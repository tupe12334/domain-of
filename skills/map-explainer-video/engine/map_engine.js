/* map_engine.js: builds the map scene once, then window.renderAt(t) poses it for time t.
 * Uses window.SCRIPT, window.TIMING, window.ICONS, window.LAYOUT when present.
 * LAYOUT.world = {w, h} sets the world size (default 6400 x 3600).
 * LAYOUT.credit sets the on-screen credit text (the credit itself is always shown).
 */
(function () {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';
  // World size comes from LAYOUT.world in buildAll(). 6400 x 3600 is only the fallback.
  var WORLD_W = 6400;
  var WORLD_H = 3600;
  // Decorations (bedrock, fog) were placed on an authoring grid and scale with the world.
  var AUTHOR_W = 6400;
  var AUTHOR_H = 3600;
  var SX = 1;
  var SY = 1;
  var INTRO_BG = '#17a2a8';
  var TITLE_FILL = '#f7d117';
  var REGION_FADE = 0.8;
  var POP_DUR = 0.45;
  var POP_FADE = 0.15;
  var UNTIL_DUR = 0.4;
  var CAM_EASE = 1.6;
  var CAM_LEAD = 0.4;
  // 'all' = wobble filter on every item group, 'icons' = only icon items.
  var WOBBLE_MODE = 'all';

  var STYLE = {
    region:   { fs: 84, fill: TITLE_FILL, stroke: 7, px: 28, py: 12, tfill: '#000', tstroke: '#111', tsw: 1.5 },
    sublabel: { fs: 46, fill: '#ffffff', stroke: 5, px: 18, py: 8, tfill: '#111', tstroke: null, tsw: 0 },
    box:      { fs: 34, fill: '#ffffff', stroke: 4, px: 14, py: 6, tfill: '#111', tstroke: null, tsw: 0 }
  };

  // Intro layer, in screen coordinates (1920 x 1080).
  var INTRO_ITEMS = [
    { id: 'i_person', type: 'icon', x: 960, y: 700, s: 1.6, icon: 'person_sofa', until: 'i_iceberg' },
    { id: 'i_tv', type: 'icon', x: 520, y: 620, s: 1.3, icon: 'tv_ad', until: 'i_iceberg' },
    { id: 'i_billboard', type: 'icon', x: 1420, y: 300, s: 1.4, icon: 'billboard', until: 'i_iceberg' },
    { id: 'i_jingle', type: 'icon', x: 620, y: 300, s: 1.1, icon: 'music_notes', until: 'i_iceberg' },
    { id: 'i_phone', type: 'icon', x: 1400, y: 720, s: 1.2, icon: 'phone_ad', until: 'i_iceberg' },
    { id: 'i_iceberg', type: 'icon', x: 960, y: 560, s: 3.6, icon: 'iceberg', until: 'i_title' },
    { id: 'i_title', type: 'title', x: 960, y: 540, rot: -2,
      lines: [{ text: 'THE MAP OF', fs: 70, y0: -95 }, { text: 'MARKETING', fs: 170, y0: 45, stroke: 2 }] }
  ];

  var state = {
    built: false,
    stage: null,
    world: null,
    introSvg: null,
    regions: [],      // {name, g}
    items: [],        // {id, item, g, x, y}
    reveal: {},       // id -> time
    regionStart: {},  // name -> time
    introStart: null, // time the intro crossfade starts
    camKF: [],
    credit: null,         // overlay group for the credit box
    creditEndStart: null, // time the credit fades in for the last segments
    camDefault: null
  };

  /* ---------- small helpers ---------- */

  function el(name, attrs, parent) {
    var e = document.createElementNS(NS, name);
    if (attrs) {
      for (var k in attrs) {
        if (Object.prototype.hasOwnProperty.call(attrs, k) && attrs[k] !== undefined && attrs[k] !== null) {
          e.setAttribute(k, attrs[k]);
        }
      }
    }
    if (parent) parent.appendChild(e);
    return e;
  }

  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }

  function easeInOutCubic(u) { return u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; }

  function easeOutBack(u) {
    var c1 = 1.7;
    var c3 = c1 + 1;
    return 1 + c3 * Math.pow(u - 1, 3) + c1 * Math.pow(u - 1, 2);
  }

  function hash4(ax, ay, bx, by) {
    var h = 2166136261 >>> 0;
    var vals = [ax, ay, bx, by];
    for (var i = 0; i < 4; i++) {
      var n = Math.round(vals[i] * 10) | 0;
      h = Math.imul(h ^ n, 16777619) >>> 0;
      h ^= h >>> 13;
    }
    return h >>> 0;
  }

  // Seeded PRNG (mulberry32).
  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function strHash(s) {
    var h = 2166136261 >>> 0;
    for (var i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619) >>> 0;
    return h >>> 0;
  }

  /* ---------- wobbly region outlines ---------- */

  function cmpPt(p, q) { return p[0] !== q[0] ? p[0] - q[0] : p[1] - q[1]; }

  // Returns the wobbled points from a to b (both included). Same edge gives same points.
  function wobbleEdge(a, b) {
    var fwd = cmpPt(a, b) < 0;
    var c0 = fwd ? a : b;
    var c1 = fwd ? b : a;
    var dx = c1[0] - c0[0];
    var dy = c1[1] - c0[1];
    var len = Math.hypot(dx, dy);
    var r = rng(hash4(c0[0], c0[1], c1[0], c1[1]));
    var f1 = 2 + r() * 3;
    var f2 = 4 + r() * 4;
    var p1 = r() * Math.PI * 2;
    var p2 = r() * Math.PI * 2;
    var amp = Math.min(40, len * 0.06);
    var n = Math.max(1, Math.ceil(len / 40));
    var nx = -dy / len;
    var ny = dx / len;
    var pts = [];
    for (var i = 0; i <= n; i++) {
      var u = i / n;
      var d = amp * Math.sin(Math.PI * u) *
        (Math.sin(u * f1 * 2 * Math.PI + p1) * 0.6 + Math.sin(u * f2 * 2 * Math.PI + p2) * 0.4);
      pts.push([c0[0] + dx * u + nx * d, c0[1] + dy * u + ny * d]);
    }
    pts[0] = [c0[0], c0[1]];
    pts[n] = [c1[0], c1[1]];
    if (!fwd) pts.reverse();
    return pts;
  }

  function polyPath(points) {
    var out = [];
    for (var i = 0; i < points.length; i++) {
      var a = points[i];
      var b = points[(i + 1) % points.length];
      var seg = wobbleEdge(a, b);
      for (var j = 0; j < seg.length - 1; j++) out.push(seg[j]);
    }
    return 'M' + out.map(function (p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join('L') + 'Z';
  }

  /* ---------- text and labels ---------- */

  function makeText(parent, text, o) {
    var t = el('text', {
      'text-anchor': 'middle',
      'dominant-baseline': 'central',
      fill: o.fill || '#111',
      style: 'font-family:Hand;font-size:' + o.fs + 'px;letter-spacing:' + (o.ls || 0) + 'px'
    }, parent);
    if (o.stroke) {
      t.setAttribute('stroke', o.stroke);
      t.setAttribute('stroke-width', o.sw);
      t.setAttribute('stroke-linejoin', 'round');
    }
    var lines = String(text).split('\n');
    var lh = o.lh || o.fs * 1.2;
    var y0 = o.y0 || 0;
    for (var i = 0; i < lines.length; i++) {
      var ts = el('tspan', { x: 0, y: y0 + (i - (lines.length - 1) / 2) * lh }, t);
      ts.textContent = lines[i];
    }
    return t;
  }

  function subText(parent, text, top) {
    var t = el('text', {
      'text-anchor': 'middle',
      'dominant-baseline': 'hanging',
      fill: '#111',
      style: 'font-family:Hand;font-size:24px;letter-spacing:0.5px'
    }, parent);
    var lines = String(text).split('\n');
    for (var i = 0; i < lines.length; i++) {
      var ts = el('tspan', { x: 0, y: top + i * 28 }, t);
      ts.textContent = lines[i];
    }
    return t;
  }

  // Boxed label centred on (0, cy). Box size comes from measured text.
  function boxLabel(parent, cfg, text, o) {
    var fs = o.size || cfg.fs;
    var cy = o.cy || 0;
    var g = el('g', {}, parent);
    var strokeW = o.stroke || cfg.stroke;
    var padX = o.px || cfg.px;
    var padY = o.py || cfg.py;
    var rect = el('rect', {
      rx: 3, ry: 3, stroke: '#000', 'stroke-width': strokeW, fill: o.fill || cfg.fill
    }, g);
    var t = makeText(g, text, { fs: fs, fill: cfg.tfill, stroke: cfg.tstroke, sw: cfg.tsw, ls: 1, lh: fs * 1.2 });
    var bb = t.getBBox();
    var w = bb.width + 2 * padX;
    var h = bb.height + 2 * padY;
    t.setAttribute('transform', 'translate(0,' + (cy - (bb.y + bb.height / 2)) + ')');
    rect.setAttribute('x', -w / 2);
    rect.setAttribute('y', cy - h / 2);
    rect.setAttribute('width', w);
    rect.setAttribute('height', h);
    return { w: w, h: h, bottom: cy + h / 2 };
  }

  /* ---------- icons ---------- */

  function addIcon(parent, name) {
    var markup = null;
    try {
      if (window.ICONS && typeof window.ICONS[name] === 'function') markup = window.ICONS[name]({});
    } catch (e) {
      markup = null;
    }
    if (markup) {
      try {
        var doc = new DOMParser().parseFromString(
          '<svg xmlns="' + NS + '">' + markup + '</svg>', 'image/svg+xml');
        var root = doc.documentElement;
        if (root.nodeName === 'parsererror' || doc.getElementsByTagName('parsererror').length) {
          throw new Error('bad icon markup: ' + name);
        }
        var kids = Array.prototype.slice.call(root.childNodes);
        for (var i = 0; i < kids.length; i++) {
          if (kids[i].nodeType === 1) parent.appendChild(document.importNode(kids[i], true));
        }
        return;
      } catch (e) {
        // Some icons have duplicate attributes, which XML rejects. The HTML parser accepts them.
        try {
          var holder = document.createElementNS(NS, 'svg');
          holder.innerHTML = markup;
          var hk = Array.prototype.slice.call(holder.childNodes);
          for (var j = 0; j < hk.length; j++) {
            if (hk[j].nodeType === 1) parent.appendChild(hk[j]);
          }
          return;
        } catch (e2) {
          // fall through to placeholder
        }
      }
    }
    el('circle', { r: 80, fill: '#8a8a8a', stroke: '#000', 'stroke-width': 4 }, parent);
    makeText(parent, name, { fs: 22, fill: '#ffffff' });
  }

  /* ---------- items ---------- */

  function buildItemContent(inner, item) {
    switch (item.type) {
      case 'icon': {
        var s = item.s || 1;
        var ig = el('g', { transform: 'scale(' + s + ')' }, inner);
        addIcon(ig, item.icon);
        if (item.label) {
          var lab = boxLabel(inner, STYLE.box, item.label, { cy: 90 * s + 34 });
          if (item.sub) subText(inner, item.sub, lab.bottom + 4);
        }
        break;
      }
      case 'label': {
        var cfg = STYLE[item.style] || STYLE.box;
        var lb = boxLabel(inner, cfg, item.text, { fill: item.fill, size: item.size, cy: 0,
          stroke: item.stroke, px: item.px, py: item.py });
        if (item.sub) subText(inner, item.sub, lb.bottom + 4);
        break;
      }
      case 'note': {
        var nt = makeText(inner, item.text, { fs: 32, fill: '#c0392b' });
        nt.setAttribute('transform', 'rotate(-4)');
        break;
      }
      case 'circle': {
        el('circle', { r: item.r, fill: item.fill || '#d8a657', stroke: '#000', 'stroke-width': 7 }, inner);
        break;
      }
      case 'cloudtext': {
        makeText(inner, item.text, {
          fs: item.size || 90,
          fill: '#000',
          stroke: item.plain ? null : '#000',
          sw: 2
        });
        break;
      }
      case 'title': {
        var rect = el('rect', { rx: 6, ry: 6, stroke: '#000', 'stroke-width': 9, fill: TITLE_FILL }, inner);
        var tg = el('g', {}, inner);
        var tl = (item.lines || []);
        for (var i = 0; i < tl.length; i++) {
          makeText(tg, tl[i].text, { fs: tl[i].fs, fill: '#000', y0: tl[i].y0,
            stroke: tl[i].stroke ? '#000' : null, sw: tl[i].stroke || 0 });
        }
        var bb = tg.getBBox();
        tg.setAttribute('transform', 'translate(' + (-(bb.x + bb.width / 2)) + ',' +
          (-(bb.y + bb.height / 2)) + ')');
        rect.setAttribute('x', -bb.width / 2 - 60);
        rect.setAttribute('y', -bb.height / 2 - 40);
        rect.setAttribute('width', bb.width + 120);
        rect.setAttribute('height', bb.height + 80);
        inner.setAttribute('transform', 'rotate(' + (item.rot || 0) + ')');
        break;
      }
      default:
        break;
    }
  }

  function addItem(parent, item, filterId, list) {
    var g = el('g', { 'data-id': item.id }, parent);
    if (WOBBLE_MODE === 'all' || item.type === 'icon') g.setAttribute('filter', 'url(#' + filterId + ')');
    var inner = el('g', {}, g);
    // Build while visible: getBBox returns zero inside display:none.
    buildItemContent(inner, item);
    g.setAttribute('display', 'none');
    list.push({ id: item.id, item: item, g: g, x: item.x, y: item.y });
  }

  /* ---------- regions and decoration ---------- */

  function addRegion(parent, name, reg) {
    var g = el('g', { 'data-region': name, opacity: 0, display: 'none' }, parent);
    var pts = reg.points;
    el('path', {
      d: polyPath(pts), fill: reg.color, stroke: reg.color,
      'stroke-width': 8, 'stroke-linejoin': 'round'
    }, g);
    var r = rng(strHash(name) ^ 0x9e3779b9);

    if (name === 'bedrock') {
      var ys = [3020, 3180, 3330, 3500].map(function (v) { return v * SY; });
      for (var s = 0; s < ys.length; s++) {
        var x0 = (200 + r() * 1400) * SX;
        var x1 = x0 + (2200 + r() * 2000) * SX;
        var phase = r() * 6;
        var d = '';
        for (var x = x0; x <= x1; x += 80) {
          var yy = ys[s] + 14 * Math.sin((x - x0) * 0.012 + phase) + 6 * Math.sin((x - x0) * 0.031);
          d += (d ? 'L' : 'M') + x.toFixed(1) + ' ' + yy.toFixed(1);
        }
        el('path', { d: d, fill: 'none', stroke: '#7a654f', 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
      }
      for (var b = 0; b < 12; b++) {
        var cxB = (200 + r() * 5900) * SX;
        var cyB = (2950 + r() * 610) * SY;
        el('ellipse', {
          cx: cxB.toFixed(1), cy: cyB.toFixed(1),
          rx: (40 + r() * 70).toFixed(1), ry: (25 + r() * 35).toFixed(1),
          transform: 'rotate(' + (r() * 40 - 20).toFixed(1) + ' ' + cxB.toFixed(1) + ' ' + cyB.toFixed(1) + ')',
          fill: '#85705a', stroke: '#5e4d3c', 'stroke-width': 3
        }, g);
      }
    }

    if (name === 'fog') {
      for (var f = 0; f < 14; f++) {
        el('ellipse', {
          cx: ((4950 + r() * 1300) * SX).toFixed(1), cy: ((2370 + r() * 400) * SY).toFixed(1),
          rx: (120 + r() * 80).toFixed(1), ry: (40 + r() * 20).toFixed(1),
          fill: '#ffffff', opacity: 0.35
        }, g);
      }
    }
    return g;
  }

  /* ---------- camera ---------- */

  function frameTarget(ids, byId) {
    var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (var i = 0; i < ids.length; i++) {
      var it = byId[ids[i]];
      if (!it) continue;
      var rx = it.type === 'circle' ? it.r : 220;
      var ry = it.type === 'circle' ? it.r : 200;
      minX = Math.min(minX, it.x - rx);
      maxX = Math.max(maxX, it.x + rx);
      minY = Math.min(minY, it.y - ry);
      maxY = Math.max(maxY, it.y + ry);
    }
    if (minX === Infinity) return null;
    var bw = maxX - minX;
    var bh = maxY - minY;
    return {
      x: (minX + maxX) / 2,
      y: (minY + maxY) / 2,
      w: Math.max(bw * 1.25, bh * 1.25 * 16 / 9, 1900)
    };
  }

  function rectEq(a, b) { return a.x === b.x && a.y === b.y && a.w === b.w; }

  // Piecewise keyframe evaluation. Keyframe ease 'cub' applies to the interval that ends at it.
  function evalKF(kfs, t) {
    if (!kfs.length) return null;
    var first = kfs[0];
    if (t <= first.t) return { x: first.x, y: first.y, w: first.w };
    var i = 0;
    for (var j = kfs.length - 1; j >= 0; j--) {
      if (kfs[j].t <= t) { i = j; break; }
    }
    var A = kfs[i];
    if (i === kfs.length - 1) return { x: A.x, y: A.y, w: A.w };
    var B = kfs[i + 1];
    var u = (t - A.t) / (B.t - A.t);
    if (B.ease === 'cub') u = easeInOutCubic(u);
    return { x: A.x + (B.x - A.x) * u, y: A.y + (B.y - A.y) * u, w: A.w + (B.w - A.w) * u };
  }

  function clampCam(v) {
    var w = clamp(v.w, 300, WORLD_W);
    var h = w * 9 / 16;
    return {
      x: clamp(v.x, w / 2, WORLD_W - w / 2),
      y: clamp(v.y, h / 2, WORLD_H - h / 2),
      w: w
    };
  }

  function buildCamera(SCRIPT, TIM, scenes, byId) {
    var kfs = [];
    var last = null;

    SCRIPT.forEach(function (seg, i) {
      var tm = TIM.segments[i];
      if (!tm || scenes[i] !== 'map') return;

      var tgt = null;
      if (Array.isArray(seg.cam)) {
        if (seg.cam.length === 3 && typeof seg.cam[0] === 'number') {
          tgt = { x: seg.cam[0], y: seg.cam[1], w: seg.cam[2] };
        } else {
          tgt = frameTarget(seg.cam, byId);
        }
      }
      if (!tgt) tgt = last;
      if (!tgt) return;

      var start = tm.start;
      var end = tm.start + tm.dur + (tm.pause || 0);
      var driftFrom;

      if (!last) {
        // First map segment: the camera already sits on the target.
        kfs.push({ t: 0, x: tgt.x, y: tgt.y, w: tgt.w, ease: 'lin' });
        driftFrom = Math.max(0, start - CAM_LEAD);
      } else if (!rectEq(tgt, last)) {
        var a = Math.max(0, start - CAM_LEAD);
        var v0 = evalKF(kfs, a);
        while (kfs.length && kfs[kfs.length - 1].t > a) kfs.pop();
        kfs.push({ t: a, x: v0.x, y: v0.y, w: v0.w, ease: 'lin' });
        kfs.push({ t: a + CAM_EASE, x: tgt.x, y: tgt.y, w: tgt.w, ease: 'cub' });
        driftFrom = a + CAM_EASE;
      } else {
        // Same target: no re-ease, keep drifting from the current value.
        var a2 = Math.max(0, start);
        var v1 = evalKF(kfs, a2);
        while (kfs.length && kfs[kfs.length - 1].t > a2) kfs.pop();
        kfs.push({ t: a2, x: v1.x, y: v1.y, w: v1.w, ease: 'lin' });
        driftFrom = a2;
      }

      // Drift ends at 97% of the target width, so repeated segments do not zoom in without limit.
      var dEnd = Math.max(end, driftFrom + 0.5);
      kfs.push({ t: dEnd, x: tgt.x, y: tgt.y, w: tgt.w * 0.97, ease: 'lin' });
      last = tgt;
    });

    state.camKF = kfs;
  }

  function camAt(t) {
    var v = evalKF(state.camKF, t);
    if (!v) v = state.camDefault;
    return clampCam(v);
  }

  /* ---------- intro crossfade ---------- */

  function introAlpha(t) {
    if (state.introStart === null) return 1;
    return 1 - clamp((t - state.introStart) / 0.8, 0, 1);
  }

  /* ---------- on-screen credit (mandatory) ---------- */

  var CREDIT_DEFAULT = 'STYLE INSPIRED BY DOMAIN OF SCIENCE · YOUTUBE.COM/@DOMAINOFSCIENCE';
  var CREDIT_STYLE_TAG = ' · STYLE: DOMAIN OF SCIENCE';
  var CREDIT_FS = 26;
  var CREDIT_PADX = 10;
  var CREDIT_PADY = 4;
  var CREDIT_MARGIN = 24;
  var CREDIT_INTRO_HOLD = 6;   // seconds of intro with the credit fully shown
  var CREDIT_FADE = 0.8;

  function creditText(L) {
    var s = (typeof L.credit === 'string') ? L.credit.trim() : '';
    if (!s) s = CREDIT_DEFAULT;
    if (s.toUpperCase().indexOf('DOMAIN OF SCIENCE') < 0) s += CREDIT_STYLE_TAG;
    return s;
  }

  // Screen-space box, bottom left. Lives in the overlay svg, so the camera does not move it.
  function buildCredit(svg, L) {
    // Not display:none here: getBBox returns zero inside a hidden subtree.
    var g = el('g', { id: 'credit', opacity: 0 }, svg);
    var rect = el('rect', { rx: 8, ry: 8, fill: '#ffffff', opacity: 0.85 }, g);
    var t = el('text', {
      'dominant-baseline': 'central', fill: '#111',
      style: 'font-family:Hand;font-size:' + CREDIT_FS + 'px'
    }, g);
    t.textContent = creditText(L);
    var bb = t.getBBox();
    var w = bb.width + 2 * CREDIT_PADX;
    var h = bb.height + 2 * CREDIT_PADY;
    var x0 = CREDIT_MARGIN;
    var y0 = 1080 - CREDIT_MARGIN - h;
    rect.setAttribute('x', x0);
    rect.setAttribute('y', y0);
    rect.setAttribute('width', w);
    rect.setAttribute('height', h);
    t.setAttribute('x', x0 + CREDIT_PADX);
    t.setAttribute('y', y0 + h / 2);
    state.credit = g;
  }

  // Shown for the first CREDIT_INTRO_HOLD seconds, then from the start of the last 4 segments to the end.
  function creditAlpha(t) {
    var intro = 1 - clamp((t - CREDIT_INTRO_HOLD) / CREDIT_FADE, 0, 1);
    var end = state.creditEndStart === null ? 0 : clamp((t - state.creditEndStart) / CREDIT_FADE, 0, 1);
    return Math.max(intro, end);
  }

  /* ---------- build ---------- */

  function deriveTiming(SCRIPT) {
    var segs = [];
    var t = 0;
    for (var i = 0; i < SCRIPT.length; i++) {
      var dur = Math.max(1, String(SCRIPT[i].text || '').length / 15);
      var pause = SCRIPT[i].pause || 0;
      segs.push({ start: t, dur: dur, pause: pause });
      t += dur + pause;
    }
    return { segments: segs, total: t };
  }

  function addFilter(svg, id) {
    var defs = el('defs', {}, svg);
    var f = el('filter', {
      id: id, x: '-20%', y: '-20%', width: '140%', height: '140%', 'color-interpolation-filters': 'sRGB'
    }, defs);
    el('feTurbulence', { type: 'fractalNoise', baseFrequency: '0.035', numOctaves: '2', seed: '7', result: 'n' }, f);
    el('feDisplacementMap', { in: 'SourceGraphic', in2: 'n', scale: '4', xChannelSelector: 'R', yChannelSelector: 'G' }, f);
  }

  function buildAll() {
    var SCRIPT = Array.isArray(window.SCRIPT) ? window.SCRIPT : [];
    var TIM = (window.TIMING && Array.isArray(window.TIMING.segments) && window.TIMING.segments.length)
      ? window.TIMING : deriveTiming(SCRIPT);
    var L = window.LAYOUT || { regions: {}, items: [] };
    var worldCfg = L.world || {};
    WORLD_W = Number(worldCfg.w) > 0 ? Number(worldCfg.w) : WORLD_W;
    WORLD_H = Number(worldCfg.h) > 0 ? Number(worldCfg.h) : WORLD_H;
    SX = WORLD_W / AUTHOR_W;
    SY = WORLD_H / AUTHOR_H;
    state.camDefault = { x: WORLD_W / 2, y: WORLD_H / 2, w: WORLD_W };

    state.stage = document.getElementById('stage');
    state.introSvg = document.getElementById('introsvg');
    state.world = el('g', { id: 'world' }, state.stage);
    addFilter(state.stage, 'wobble-world');
    addFilter(state.introSvg, 'wobble-intro');

    // Scenes and reveal times.
    var scenes = [];
    var cur = 'intro';
    SCRIPT.forEach(function (seg, i) {
      if (seg.scene) cur = seg.scene;
      scenes.push(cur);
      var tm = TIM.segments[i];
      if (!tm) return;
      var start = tm.start;
      (seg.regions || []).forEach(function (r) {
        if (state.regionStart[r] === undefined) state.regionStart[r] = start;
      });
      var text = String(seg.text || '');
      (seg.show || []).forEach(function (pair) {
        var id = pair[0];
        var idx = text.indexOf(pair[1]);
        if (idx < 0) idx = 0;
        var rt = start + tm.dur * idx / Math.max(1, text.length);
        if (state.reveal[id] === undefined || rt < state.reveal[id]) state.reveal[id] = rt;
      });
    });
    for (var i = 0; i < SCRIPT.length; i++) {
      if (scenes[i] === 'map' && TIM.segments[i]) { state.introStart = TIM.segments[i].start - 0.5; break; }
    }

    // Items index for camera framing.
    var byId = {};
    (L.items || []).forEach(function (it) { byId[it.id] = it; });
    INTRO_ITEMS.forEach(function (it) { byId[it.id] = it; });

    // World layers: regions first, then items.
    var regionLayer = el('g', { id: 'regions' }, state.world);
    var names = Object.keys(L.regions || {});
    names.forEach(function (name) {
      state.regions.push({ name: name, g: addRegion(regionLayer, name, L.regions[name]) });
    });

    var itemLayer = el('g', { id: 'items' }, state.world);
    (L.items || []).forEach(function (item) {
      addItem(itemLayer, item, 'wobble-world', state.items);
    });

    // Intro layer: background then items.
    el('rect', { x: 0, y: 0, width: 1920, height: 1080, fill: INTRO_BG }, state.introSvg);
    var introLayer = el('g', { id: 'intro' }, state.introSvg);
    INTRO_ITEMS.forEach(function (item) {
      addItem(introLayer, item, 'wobble-intro', state.items);
    });

    buildCamera(SCRIPT, TIM, scenes, byId);
    buildCredit(document.getElementById('creditsvg'), L);
    var creditSeg = Math.max(0, SCRIPT.length - 4);
    state.creditEndStart = TIM.segments[creditSeg] ? TIM.segments[creditSeg].start : null;
    state.built = true;
  }

  /* ---------- per-frame pose ---------- */

  window.renderAt = function (t) {
    if (!state.built) return;

    var c = camAt(t);
    var h = c.w * 9 / 16;
    state.stage.setAttribute('viewBox', [c.x - c.w / 2, c.y - h / 2, c.w, h].join(' '));

    var a = introAlpha(t);
    state.introSvg.style.opacity = a;
    state.introSvg.style.display = a <= 0.001 ? 'none' : 'inline';

    if (state.credit) {
      var ca = creditAlpha(t);
      state.credit.setAttribute('display', ca <= 0.001 ? 'none' : 'inline');
      state.credit.setAttribute('opacity', ca.toFixed(3));
    }

    state.regions.forEach(function (r) {
      var rs = state.regionStart[r.name];
      var op = rs === undefined ? 0 : clamp((t - rs) / REGION_FADE, 0, 1);
      if (op <= 0.001) {
        r.g.setAttribute('display', 'none');
      } else {
        r.g.setAttribute('display', 'inline');
        r.g.setAttribute('opacity', op.toFixed(3));
      }
    });

    state.items.forEach(function (r) {
      var rv = state.reveal[r.id];
      if (rv === undefined || t < rv) {
        r.g.setAttribute('display', 'none');
        return;
      }
      var p = clamp((t - rv) / POP_DUR, 0, 1);
      var k = easeOutBack(p);
      var op2 = clamp((t - rv) / POP_FADE, 0, 1);
      var until = r.item.until;
      if (until && state.reveal[until] !== undefined) {
        op2 *= 1 - clamp((t - state.reveal[until]) / UNTIL_DUR, 0, 1);
      }
      if (op2 <= 0.001) {
        r.g.setAttribute('display', 'none');
        return;
      }
      r.g.setAttribute('display', 'inline');
      r.g.setAttribute('opacity', op2.toFixed(3));
      r.g.setAttribute('transform', 'translate(' + r.x + ' ' + r.y + ') scale(' + k.toFixed(4) + ')');
    });
  };

  // Build after the page has loaded and the Hand font is ready.
  window.ready = new Promise(function (resolve) {
    if (document.readyState === 'complete') resolve();
    else window.addEventListener('load', function () { resolve(); });
  })
    .then(function () {
      if (!document.fonts) return null;
      return document.fonts.load('34px Hand').catch(function () { return null; })
        .then(function () { return document.fonts.ready; });
    })
    .then(function () {
      buildAll();
      window.renderAt(0);
      return true;
    });
})();
