#!/usr/bin/env node
'use strict';
/*
 * Renders a map explainer project to PNG stills or to an MP4.
 *
 *   node video_renderer.js [--project <dir>] --still <t> [<out.png>]
 *   node video_renderer.js [--project <dir>] --stills <t1,t2,...> [<outdir>]
 *   node video_renderer.js [--project <dir>] --video [--fps 30] [--workers 8]
 *                          [--from t0] [--to t1] [--out name.mp4]
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
 */
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
const W = 1920;
const H = 1080;

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

async function launch() {
  const executablePath = findBrowser();
  const where = executablePath ? ` at ${executablePath}` : '';
  try {
    return await chromium.launch({
      ...(executablePath ? { executablePath } : {}),
      args: ['--no-sandbox'],
      headless: true
    });
  } catch (e) {
    throw new Error(`Could not start the browser${where}. Set CHROME=/path/to/chromium. ${e.message}`);
  }
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
  page.on('pageerror', (e) => console.error('[page error]', e.message));
  page.on('console', (m) => { if (m.type() === 'error') console.error('[console]', m.text()); });
  await page.goto(PAGE_URL);
  await page.evaluate(() => window.ready);
  return page;
}

async function poseAt(page, t) {
  await page.evaluate((tt) => window.renderAt(tt), t);
}

async function still(t, outFile) {
  const browser = await launch();
  try {
    const page = await openPage(browser);
    await poseAt(page, t);
    await page.screenshot({ path: outFile, type: 'png' });
    console.log('wrote', outFile);
  } finally {
    await browser.close();
  }
}

async function stills(times, outDir) {
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await launch();
  try {
    const page = await openPage(browser);
    for (const t of times) {
      await poseAt(page, t);
      const f = path.join(outDir, `still_${t.toFixed(2)}.png`);
      await page.screenshot({ path: f, type: 'png' });
      console.log('wrote', f);
    }
  } finally {
    await browser.close();
  }
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

async function renderChunk(browser, fps, startFrame, endFrame, outFile, progress) {
  const page = await openPage(browser);
  const enc = startEncoder(fps, outFile);
  const stdin = enc.proc.stdin;
  for (let f = startFrame; f < endFrame; f++) {
    await poseAt(page, f / fps);
    const jpg = await page.screenshot({ type: 'jpeg', quality: 92 });
    if (!stdin.write(jpg)) await once(stdin, 'drain');
    progress.done++;
  }
  stdin.end();
  await enc.done;
  await page.close();
}

async function video() {
  FFMPEG = findFfmpeg();
  const fps = Number(opt('--fps', 30));
  const workers = Math.max(1, Number(opt('--workers', 8)));
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

  const browser = await launch();
  try {
    await Promise.all(chunks.map((c) => renderChunk(browser, fps, c.s, c.e, c.file, progress)));
  } finally {
    clearInterval(timer);
    await browser.close();
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
