#!/usr/bin/env node
'use strict';
/*
 * Renders a map explainer project to PNG stills or to an MP4.
 *
 *   node video_renderer.js [--project <dir>] --still <t> [<out.png>]
 *   node video_renderer.js [--project <dir>] --stills <t1,t2,...> [<outdir>]
 *   node video_renderer.js [--project <dir>] --video [--fps 30] [--workers N]
 *                          [--from t0] [--to t1] [--out name.mp4]
 *
 * --workers defaults to min(CPUs - 2, free memory in GB / 0.6), at least 1.
 *
 * --project defaults to the current folder. The project holds narration_script.json,
 * data.js (from narration_tts.py), map_layout.js, optional icons*.js, and audio/.
 * Outputs go to <project>/out (video) and <project>/frames (stills) unless a path is given.
 * A path given on the command line is resolved from the current folder.
 *
 * Environment:
 *   CHROME  path to a Chromium binary (default: first of chromium, chromium-browser,
 *           google-chrome, google-chrome-stable on PATH, else playwright-core's own)
 *   FFMPEG  path to ffmpeg (default: ffmpeg on PATH)
 *   MAPVID_TEST_FAIL_FRAME  frame index (video) or list position (stills) whose first
 *           screenshot try gets a 1 ms timeout, to test recovery. Unset in normal use.
 */
const os = require('os');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const { once } = require('events');
const { pathToFileURL } = require('url');

const ENGINE_DIR = __dirname;
const ICON_LIBRARY = path.join(ENGINE_DIR, '..', 'icon_library');
const FONT_FILE = path.join(ENGINE_DIR, 'fonts', 'PatrickHandSC-Regular.ttf');
const STAGE_TEMPLATE = path.join(ENGINE_DIR, 'map_stage.html');
const ENGINE_FILE = path.join(ENGINE_DIR, 'map_engine.js');
const STARTER_ICONS = ['starter_icons_a.js', 'starter_icons_b.js'];
const GENERATED_PAGE = '.map_stage.generated.html';
const BROWSER_NAMES = ['chromium', 'chromium-browser', 'google-chrome', 'google-chrome-stable'];
const CHROME_ARGS = ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--renderer-process-limit=1'];
const W = 1920;
const H = 1080;

const FRAME_ATTEMPTS = 3;
const SCREENSHOT_TIMEOUT_MS = 30000;
const POSE_TIMEOUT_MS = 60000;
const READY_TIMEOUT_MS = 60000;
const CLOSE_TIMEOUT_MS = 10000;
// Error texts that mean the page or browser died or hung. Anything else is not retried.
const RECOVERABLE = /Timeout \d+ms exceeded|Target closed|has been closed|Browser closed|crashed|Protocol error/i;
const TEST_FAIL_FRAME = process.env.MAPVID_TEST_FAIL_FRAME ? Number(process.env.MAPVID_TEST_FAIL_FRAME) : null;

const args = process.argv.slice(2);
function opt(name, def) {
  const i = args.indexOf(name);
  return i >= 0 && i + 1 < args.length ? args[i + 1] : def;
}
function has(name) { return args.indexOf(name) >= 0; }

const PROJECT = path.resolve(opt('--project', process.cwd()));
const OUT = path.join(PROJECT, 'out');
const AUDIO = path.join(PROJECT, 'audio');
const FRAMES = path.join(PROJECT, 'frames');

let chromium = null;   // set by loadPlaywright()
let PAGE_URL = null;   // set by buildStagePage()
let FFMPEG = null;     // set by video()

// The one shared browser. relaunchIfDead() replaces it when it dies.
const pool = { browser: null, relaunching: null };

function onPath(name) {
  for (const dir of (process.env.PATH || '').split(path.delimiter)) {
    if (!dir) continue;
    const p = path.join(dir, name);
    try {
      if (fs.statSync(p).isFile()) { fs.accessSync(p, fs.constants.X_OK); return p; }
    } catch (e) { /* not here */ }
  }
  return null;
}

function loadPlaywright() {
  const candidates = [
    path.join(ENGINE_DIR, 'node_modules', 'playwright-core'),
    path.join(PROJECT, 'node_modules', 'playwright-core'),
    'playwright-core'
  ];
  for (const c of candidates) {
    try {
      return require(c);
    } catch (e) {
      if (e.code !== 'MODULE_NOT_FOUND') throw e;
    }
  }
  throw new Error(`playwright-core not found. Run "npm install" in ${ENGINE_DIR}`);
}

function findBrowser() {
  if (process.env.CHROME) return process.env.CHROME;
  for (const name of BROWSER_NAMES) {
    const p = onPath(name);
    if (p) return p;
  }
  return undefined; // let playwright-core use its default browser
}

function findFfmpeg() {
  const p = process.env.FFMPEG || onPath('ffmpeg');
  if (!p) throw new Error('ffmpeg not found. Install it, put it on PATH, or set FFMPEG=/path/to/ffmpeg');
  return p;
}

function firstLine(e) {
  return String(e && e.message !== undefined ? e.message : e).split('\n')[0];
}

// Rejects with a Timeout error if promise does not settle within ms.
function withTimeout(promise, ms, what) {
  let timer;
  const limit = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`Timeout ${ms}ms exceeded in ${what}`)), ms);
  });
  return Promise.race([promise, limit]).finally(() => clearTimeout(timer));
}

// Waits for a close call, but never longer than CLOSE_TIMEOUT_MS. Errors are ignored.
function quietly(promise) {
  return withTimeout(promise, CLOSE_TIMEOUT_MS, 'close').catch(() => {});
}

async function launch() {
  const executablePath = findBrowser();
  const where = executablePath ? ` at ${executablePath}` : '';
  try {
    return await chromium.launch({
      ...(executablePath ? { executablePath } : {}),
      args: CHROME_ARGS,
      headless: true
    });
  } catch (e) {
    throw new Error(`Could not start the browser${where}. Set CHROME=/path/to/chromium. ${e.message}`);
  }
}

// Available memory in GB: MemAvailable on Linux, else os.freemem().
function availableMemGB() {
  if (process.platform === 'linux') {
    try {
      const m = fs.readFileSync('/proc/meminfo', 'utf-8').match(/^MemAvailable:\s+(\d+)\s+kB/m);
      if (m) return Number(m[1]) / (1024 * 1024);
    } catch (e) { /* fall back to os.freemem() */ }
  }
  return os.freemem() / 1024 ** 3;
}

function autoWorkers() {
  const cpus = os.cpus().length;
  const memGB = availableMemGB();
  const n = Math.max(1, Math.min(cpus - 2, Math.floor(memGB / 0.6)));
  return { n, cpus, memGB };
}

// Writes <project>/.map_stage.generated.html: the stage template plus this project's scripts.
function buildStagePage() {
  const dataFile = path.join(PROJECT, 'data.js');
  const layoutFile = path.join(PROJECT, 'map_layout.js');
  if (!fs.existsSync(dataFile)) throw new Error(`missing ${dataFile}. Run narration_tts.py --project <dir> first.`);
  if (!fs.existsSync(layoutFile)) throw new Error(`missing ${layoutFile}. Copy examples/map-of-marketing/map_layout.js or write one.`);

  const projectIcons = fs.readdirSync(PROJECT).filter((f) => /^icons.*\.js$/.test(f)).sort();
  const files = [
    dataFile,
    ...STARTER_ICONS.map((f) => path.join(ICON_LIBRARY, f)),
    ...projectIcons.map((f) => path.join(PROJECT, f)),
    layoutFile,
    ENGINE_FILE
  ];
  const tags = files.map((f) => `<script src="${pathToFileURL(f).href}"></script>`).join('\n');

  const template = fs.readFileSync(STAGE_TEMPLATE, 'utf-8');
  const html = template
    .split('<!--SCRIPTS-->').join(tags)
    .split('__FONT_URL__').join(pathToFileURL(FONT_FILE).href);
  const out = path.join(PROJECT, GENERATED_PAGE);
  fs.writeFileSync(out, html);
  return pathToFileURL(out).href;
}

async function openPage(browser) {
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  try {
    page.on('pageerror', (e) => console.error('[page error]', e.message));
    page.on('console', (m) => { if (m.type() === 'error') console.error('[console]', m.text()); });
    await page.goto(PAGE_URL);
    await withTimeout(page.evaluate(() => window.ready), READY_TIMEOUT_MS, 'window.ready');
  } catch (e) {
    await quietly(page.close());
    throw e;
  }
  return page;
}

async function poseAt(page, t) {
  await withTimeout(page.evaluate((tt) => window.renderAt(tt), t), POSE_TIMEOUT_MS, 'renderAt');
}

// Replaces the shared browser if it is dead. Workers that see the same death share one relaunch.
async function relaunchIfDead() {
  if (pool.browser.isConnected()) return;
  if (!pool.relaunching) {
    const dead = pool.browser;
    pool.relaunching = (async () => {
      await quietly(dead.close());
      pool.browser = await launch();
    })().finally(() => { pool.relaunching = null; });
  }
  await pool.relaunching;
}

// Closes the browser that the stills or video run opened, after fn finishes.
async function withBrowser(fn) {
  pool.browser = await launch();
  try {
    return await fn();
  } finally {
    await quietly(pool.browser.close());
  }
}

async function closePage(session) {
  const page = session.page;
  session.page = null;
  if (page) await quietly(page.close());
}

// Drops this worker's page, and the browser if it died. The next attempt reopens the page.
async function recoverSession(session) {
  await closePage(session);
  try {
    await relaunchIfDead();
  } catch (e) {
    console.warn(`[recover] browser relaunch failed: ${firstLine(e)}`);
  }
}

// Ends the process at once. Other workers may be waiting on the same browser, so no cleanup runs here.
function fatal(msg) {
  console.error(`render failed: ${msg}`);
  process.exit(1);
}

// Poses the scene at t and takes one screenshot. Recovers from timeouts and browser crashes
// up to FRAME_ATTEMPTS tries. Other errors are thrown at once.
async function renderFrame(session, index, t, shot) {
  for (let attempt = 1; ; attempt++) {
    try {
      if (!session.page) session.page = await openPage(pool.browser);
      await poseAt(session.page, t);
      const timeout = index === TEST_FAIL_FRAME && attempt === 1 ? 1 : SCREENSHOT_TIMEOUT_MS;
      return await session.page.screenshot({ ...shot, timeout });
    } catch (e) {
      const msg = firstLine(e);
      if (!RECOVERABLE.test(msg)) throw e;
      if (attempt >= FRAME_ATTEMPTS) {
        fatal(`frame ${index} failed after ${attempt} attempts: ${msg}`);
      }
      console.warn(`[recover] frame ${index} attempt ${attempt}/${FRAME_ATTEMPTS} failed (${msg}); reopening page`);
      await recoverSession(session);
    }
  }
}

async function still(t, outFile) {
  await withBrowser(async () => {
    const session = { page: null };
    await renderFrame(session, 0, t, { path: outFile, type: 'png' });
    console.log('wrote', outFile);
    await closePage(session);
  });
}

async function stills(times, outDir) {
  fs.mkdirSync(outDir, { recursive: true });
  await withBrowser(async () => {
    const session = { page: null };
    for (let i = 0; i < times.length; i++) {
      const t = times[i];
      const f = path.join(outDir, `still_${t.toFixed(2)}.png`);
      await renderFrame(session, i, t, { path: f, type: 'png' });
      console.log('wrote', f);
    }
    await closePage(session);
  });
}

function ffmpegRun(argList) {
  return new Promise((resolve, reject) => {
    const p = spawn(FFMPEG, ['-y', '-loglevel', 'error', ...argList], { stdio: ['ignore', 'inherit', 'inherit'] });
    p.on('error', reject);
    p.on('exit', (code) => (code === 0 ? resolve() : reject(new Error('ffmpeg exit ' + code))));
  });
}

function startEncoder(fps, outFile) {
  const p = spawn(FFMPEG, [
    '-y', '-loglevel', 'error',
    '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'fast', '-crf', '18', '-pix_fmt', 'yuv420p', outFile
  ], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((resolve, reject) => {
    p.on('error', reject);
    p.on('exit', (code) => (code === 0 ? resolve() : reject(new Error('encoder exit ' + code + ' for ' + outFile))));
  });
  return { proc: p, done };
}

async function renderChunk(fps, startFrame, endFrame, outFile, progress) {
  const session = { page: null };
  const enc = startEncoder(fps, outFile);
  const stdin = enc.proc.stdin;
  for (let f = startFrame; f < endFrame; f++) {
    const jpg = await renderFrame(session, f, f / fps, { type: 'jpeg', quality: 92 });
    if (!stdin.write(jpg)) await once(stdin, 'drain');
    progress.done++;
  }
  stdin.end();
  await enc.done;
  await closePage(session);
}

async function video() {
  FFMPEG = findFfmpeg();
  const fps = Number(opt('--fps', 30));
  const workersArg = opt('--workers', null);
  let workers;
  if (workersArg !== null) {
    workers = Math.max(1, Number(workersArg));
  } else {
    const auto = autoWorkers();
    workers = auto.n;
    console.log(`workers ${workers} (auto: ${auto.cpus} CPUs, ${auto.memGB.toFixed(1)} GB available)`);
  }
  fs.mkdirSync(OUT, { recursive: true });

  const probe = await launch();
  let total;
  try {
    const page = await openPage(probe);
    total = await page.evaluate(() => window.TIMING.total);
  } finally {
    await probe.close();
  }

  const frameCount = Math.round(total * fps);
  const fromArg = opt('--from', null);
  const toArg = opt('--to', null);
  const startFrame = fromArg !== null ? Math.max(0, Math.round(Number(fromArg) * fps)) : 0;
  const endFrame = toArg !== null ? Math.min(frameCount, Math.round(Number(toArg) * fps)) : frameCount;
  const span = endFrame - startFrame;
  if (span <= 0) throw new Error('empty frame range');
  console.log(`total ${total.toFixed(2)} s, frames ${startFrame}..${endFrame - 1} at ${fps} fps, ${workers} workers`);

  // Contiguous chunks.
  const chunks = [];
  for (let w = 0; w < workers; w++) {
    const s = startFrame + Math.floor((span * w) / workers);
    const e = startFrame + Math.floor((span * (w + 1)) / workers);
    if (e > s) chunks.push({ s, e, file: path.join(OUT, `chunk_${String(w).padStart(2, '0')}.mp4`) });
  }

  const progress = { done: 0 };
  const t0 = Date.now();
  const timer = setInterval(() => {
    const secs = (Date.now() - t0) / 1000;
    const rate = progress.done / Math.max(secs, 0.001);
    console.log(`progress ${progress.done}/${span} frames, ${rate.toFixed(1)} fps render`);
  }, 5000);

  pool.browser = await launch();
  try {
    await Promise.all(chunks.map((c) => renderChunk(fps, c.s, c.e, c.file, progress)));
  } finally {
    clearInterval(timer);
    await quietly(pool.browser.close());
  }
  console.log(`rendered ${progress.done} frames in ${((Date.now() - t0) / 1000).toFixed(1)} s`);

  // Concat chunks.
  const listFile = path.join(OUT, 'concat.txt');
  fs.writeFileSync(listFile, chunks.map((c) => `file '${c.file}'`).join('\n') + '\n');
  const videoOnly = path.join(OUT, 'video_only.mp4');
  await ffmpegRun(['-f', 'concat', '-safe', '0', '-i', listFile, '-c', 'copy', videoOnly]);

  // Mux audio: narration, and music under it at 0.12.
  const narration = path.join(AUDIO, 'narration.wav');
  const music = path.join(AUDIO, 'music.wav');
  const hasNar = fs.existsSync(narration);
  const hasMus = fs.existsSync(music);
  const final = path.resolve(OUT, opt('--out', `${path.basename(PROJECT)}.mp4`));
  const outDuration = span / fps; // video length in seconds, so a short range is not padded
  const seek = startFrame / fps;  // audio must start at the same time as the video
  const inputs = ['-i', videoOnly];
  const audioLabels = [];
  const filters = [];
  if (hasNar) {
    if (seek > 0) inputs.push('-ss', String(seek));
    inputs.push('-i', narration);
    filters.push('[1:a]apad,aformat=sample_rates=48000:channel_layouts=stereo[n]');
    audioLabels.push('[n]');
  }
  if (hasMus) {
    if (seek > 0) inputs.push('-ss', String(seek));
    inputs.push('-i', music);
    const idx = hasNar ? 2 : 1;
    filters.push(`[${idx}:a]volume=0.12,aformat=sample_rates=48000:channel_layouts=stereo[m]`);
    audioLabels.push('[m]');
  }
  const args2 = [...inputs];
  if (audioLabels.length === 0) {
    args2.push('-c:v', 'copy', '-t', String(outDuration), final);
  } else {
    let mapA;
    if (audioLabels.length === 1) {
      mapA = audioLabels[0];
    } else {
      filters.push(`${audioLabels.join('')}amix=inputs=${audioLabels.length}:normalize=0:duration=first[a]`);
      mapA = '[a]';
    }
    args2.push('-filter_complex', filters.join(';'), '-map', '0:v', '-map', mapA,
      '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-t', String(outDuration), final);
  }
  await ffmpegRun(args2);
  console.log('wrote', final, `(narration: ${hasNar}, music: ${hasMus})`);
}

async function main() {
  const si = args.indexOf('--still');
  const ssi = args.indexOf('--stills');
  if (si < 0 && ssi < 0 && !has('--video')) {
    console.log('usage: node video_renderer.js [--project <dir>] --still <t> [out.png] | --stills <t1,t2> [outdir] | --video [--fps 30] [--workers 8] [--from t] [--to t] [--out name.mp4]');
    process.exitCode = 2;
    return;
  }

  chromium = loadPlaywright().chromium;
  PAGE_URL = buildStagePage();

  if (si >= 0) {
    const t = Number(args[si + 1]);
    const out = args[si + 2] ? path.resolve(args[si + 2]) : path.join(FRAMES, `still_${t.toFixed(2)}.png`);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    return still(t, out);
  }
  if (ssi >= 0) {
    const times = args[ssi + 1].split(',').map(Number);
    const dir = args[ssi + 2] ? path.resolve(args[ssi + 2]) : FRAMES;
    return stills(times, dir);
  }
  return video();
}

main().catch((e) => {
  console.error(e.message || e);
  process.exitCode = 1;
});
