(function () {
  window.ICONS = window.ICONS || {};

  // Shared style strings
  const K = 'stroke="#111" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"';
  const TH = 'stroke="#111" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"';
  const S2 = 'stroke="#111" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"';
  const NS = 'stroke="none"';

  const C = {
    red: '#e74c3c', orange: '#f39c12', yellow: '#f7d117', green: '#2ecc71',
    teal: '#1abc9c', blue: '#3498db', navy: '#2c3e50', purple: '#9b59b6',
    pink: '#ff7eb6', skin: '#f1c27d', brown: '#8e5b3a', lbrown: '#c8935a',
    grey: '#95a5a6', lgrey: '#dfe6e9', white: '#ffffff', cream: '#fff3c4',
  };

  // Helpers
  const f = (n) => Math.round(n * 100) / 100;
  const g = (...a) => a.join('');
  const R_ = (x, y, w, h, fill, rx = 0, st = K) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" ${st}/>`;
  const CI = (cx, cy, r, fill, st = K) =>
    `<circle cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="${fill}" ${st}/>`;
  const EL = (cx, cy, rx, ry, fill, st = K, tf = '') =>
    `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" ${st} ${tf}/>`;
  const PA = (d, fill = 'none', st = K, extra = '') =>
    `<path d="${d}" fill="${fill}" ${st} ${extra}/>`;
  const LN = (d, st = TH) => `<path d="${d}" fill="none" ${st}/>`;
  const TX = (x, y, s, size, fill = '#111') =>
    `<text x="${x}" y="${y}" font-family="Hand" font-size="${size}" fill="${fill}" text-anchor="middle">${s}</text>`;
  const PO = (pts, fill, st = K) =>
    `<polygon points="${pts.map((p) => f(p[0]) + ',' + f(p[1])).join(' ')}" fill="${fill}" ${st}/>`;

  // Heart outline scaled and moved; built point by point so the stroke width stays fixed.
  const HE = (cx, cy, s, fill = C.pink, st = K) => {
    const P = (x, y) => `${f(cx + x * s)} ${f(cy + y * s)}`;
    return PA(
      `M${P(0, 6)} C${P(-12, -2)} ${P(-10, -12)} ${P(-4, -12)} C${P(-1, -12)} ${P(0, -9)} ${P(0, -7)} ` +
      `C${P(0, -9)} ${P(1, -12)} ${P(4, -12)} C${P(10, -12)} ${P(12, -2)} ${P(0, 6)} Z`,
      fill, st
    );
  };

  // Star points: outer radius R, inner radius r. Index 0 is the top point.
  const SP = (cx, cy, R, r) => {
    const a = [];
    for (let k = 0; k < 10; k++) {
      const t = (-90 + 36 * k) * Math.PI / 180;
      const rr = k % 2 ? r : R;
      a.push([cx + rr * Math.cos(t), cy + rr * Math.sin(t)]);
    }
    return a;
  };
  const ST = (cx, cy, R, fill = C.yellow, st = K) => PO(SP(cx, cy, R, R * 0.45), fill, st);
  // Left half of a star, for a half-filled star.
  const HS = (cx, cy, R, fill = C.yellow) => {
    const p = SP(cx, cy, R, R * 0.45);
    return PO([p[0], p[9], p[8], p[7], p[6], p[5]], fill, K);
  };

  // Simple person: head, hair, dot eyes, smile, trapezoid body.
  const PE = (hx, hy, r, shirt, hair = C.brown) => {
    let s = PA(
      `M${f(hx - 1.4 * r)} ${f(hy + 0.9 * r)} Q${f(hx)} ${f(hy + 0.6 * r)} ${f(hx + 1.4 * r)} ${f(hy + 0.9 * r)} ` +
      `L${f(hx + 1.9 * r)} ${f(hy + 3.4 * r)} L${f(hx - 1.9 * r)} ${f(hy + 3.4 * r)} Z`,
      shirt
    );
    s += CI(hx, hy, r, C.skin);
    if (hair) {
      s += PA(
        `M${f(hx - r)} ${f(hy - 0.05 * r)} Q${f(hx - 1.05 * r)} ${f(hy - 1.35 * r)} ${f(hx)} ${f(hy - 1.25 * r)} ` +
        `Q${f(hx + 1.05 * r)} ${f(hy - 1.35 * r)} ${f(hx + r)} ${f(hy - 0.05 * r)} ` +
        `Q${f(hx + 0.45 * r)} ${f(hy - 0.7 * r)} ${f(hx)} ${f(hy - 0.6 * r)} ` +
        `Q${f(hx - 0.45 * r)} ${f(hy - 0.7 * r)} ${f(hx - r)} ${f(hy - 0.05 * r)} Z`,
        hair
      );
    }
    s += CI(hx - 0.36 * r, hy + 0.02 * r, Math.max(2, 0.12 * r), '#111', NS);
    s += CI(hx + 0.36 * r, hy + 0.02 * r, Math.max(2, 0.12 * r), '#111', NS);
    s += LN(
      `M${f(hx - 0.45 * r)} ${f(hy + 0.42 * r)} Q${f(hx)} ${f(hy + 0.95 * r)} ${f(hx + 0.45 * r)} ${f(hy + 0.42 * r)}`,
      'stroke="#111" stroke-width="3" stroke-linecap="round" fill="none"'
    );
    return s;
  };

  // Balance beam used by both scale icons.
  const beam = () =>
    g(
      PA('M-62 -64 L62 -36', 'none', 'stroke="#111" stroke-width="16" stroke-linecap="round"'),
      PA('M-62 -64 L62 -36', 'none', 'stroke="#8e5b3a" stroke-width="7" stroke-linecap="round"'),
      CI(0, -50, 9, C.yellow)
    );

  Object.assign(window.ICONS, {

    // 1. Traditional media cluster: newspaper, radio, TV, billboard
    trad_media: (o) => g(
      `<g transform="rotate(-8 -52 -8)">`,
      R_(-104, -58, 88, 100, C.white, 4),
      R_(-96, -50, 72, 14, C.navy, 2),
      R_(-96, -28, 36, 30, C.blue, 2),
      R_(-52, -26, 36, 6, C.lgrey, 2, S2),
      R_(-52, -14, 36, 6, C.lgrey, 2, S2),
      R_(-96, 2, 72, 6, C.lgrey, 2, S2),
      R_(-96, 13, 72, 6, C.lgrey, 2, S2),
      R_(-96, 24, 50, 6, C.lgrey, 2, S2),
      `</g>`,
      PA('M4 -22 L-12 -56', 'none', K),
      R_(-6, -22, 72, 52, C.orange, 10),
      CI(26, 8, 15, C.lgrey),
      R_(4, -14, 30, 10, C.white, 2, S2),
      PA('M71 -60 L58 -84 M71 -60 L86 -84', 'none', K),
      R_(42, -60, 58, 46, C.teal, 6),
      R_(48, -54, 38, 32, C.lgrey, 4, S2),
      PA('M72 50 L70 74 M96 50 L98 74', 'none', K),
      R_(58, 22, 46, 28, C.yellow, 3),
      TX(81, 43, 'AD', 18)
    ),

    // 2. Search bar with an ad result
    search_ad: (o) => g(
      R_(-90, -70, 180, 140, C.white, 10),
      PA('M-90 -42 L90 -42', 'none', K),
      CI(-76, -56, 4.5, C.red, S2),
      CI(-64, -56, 4.5, C.yellow, S2),
      CI(-52, -56, 4.5, C.green, S2),
      R_(-78, -30, 120, 26, C.white, 13),
      TX(-18, -11, 'SHOES', 18),
      CI(30, -17, 8, C.white),
      PA('M36 -11 L44 -3', 'none', 'stroke="#111" stroke-width="6" stroke-linecap="round"'),
      R_(-78, 4, 30, 16, C.yellow, 3, S2),
      TX(-63, 17, 'AD', 13),
      R_(-42, 6, 96, 12, C.lgrey, 6, S2),
      R_(-78, 30, 140, 12, C.lgrey, 6, S2),
      R_(-78, 48, 100, 12, C.lgrey, 6, S2)
    ),

    // 3. Phone with a social feed, one ad post, and a targeting crosshair
    phone_feed: (o) => g(
      R_(-46, -80, 92, 160, C.navy, 14),
      R_(-38, -68, 76, 136, C.white, 6, S2),
      R_(-31, -60, 62, 56, C.lgrey, 4, S2),
      CI(-21, -50, 6, C.blue, S2),
      R_(-12, -54, 36, 7, C.grey, 2, S2),
      R_(-31, -40, 62, 30, C.green, 0, S2),
      R_(-31, 2, 62, 58, C.lgrey, 4, S2),
      R_(-27, 8, 26, 14, C.red, 3, S2),
      TX(-14, 19, 'AD', 12),
      R_(-31, 28, 62, 8, C.grey, 2, S2),
      R_(-31, 40, 44, 8, C.grey, 2, S2),
      // target
      CI(50, -22, 28, C.white),
      CI(50, -22, 19, 'none', `stroke="${C.red}" stroke-width="6"`),
      CI(50, -22, 7, C.red, NS),
      PA('M50 -50 L50 -60 M50 6 L50 16 M22 -22 L12 -22 M78 -22 L88 -22', 'none', `stroke="${C.red}" stroke-width="6" stroke-linecap="round"`)
    ),

    // 4. Influencer taking a selfie with a phone, hearts and a 1M bubble
    influencer: (o) => g(
      // bubble
      R_(-90, -86, 70, 34, C.white, 17),
      HE(-72, -69, 0.9, C.pink),
      TX(-48, -62, '1M', 20),
      // person
      PE(-6, -16, 26, C.purple, C.brown),
      // arm holding phone
      PA('M26 40 Q56 16 48 -28', 'none', 'stroke="#111" stroke-width="20" stroke-linecap="round"'),
      PA('M26 40 Q56 16 48 -28', 'none', `stroke="${C.skin}" stroke-width="10" stroke-linecap="round"`),
      // phone
      R_(38, -82, 26, 46, C.navy, 5),
      R_(42, -76, 18, 32, C.blue, 2, S2),
      // hearts
      HE(80, -50, 0.8, C.pink),
      HE(76, -6, 1, C.pink),
      HE(-74, -4, 0.9, C.pink)
    ),

    // 5. Browser window with bars and blocks
    browser_window: (o) => g(
      R_(-80, -70, 160, 140, C.white, 10),
      PA('M-80 -40 L-80 -60 Q-80 -70 -70 -70 L70 -70 Q80 -70 80 -60 L80 -40 Z', C.lgrey, K),
      CI(-66, -55, 4.5, C.red, S2),
      CI(-54, -55, 4.5, C.yellow, S2),
      CI(-42, -55, 4.5, C.green, S2),
      R_(-30, -62, 100, 14, C.white, 7, S2),
      R_(-70, -28, 140, 22, C.blue, 4),
      R_(-70, 2, 66, 56, C.yellow, 4),
      R_(4, 2, 66, 26, C.green, 4),
      R_(4, 32, 66, 26, C.pink, 4)
    ),

    // 6. Envelope with an @ and a notification badge
    envelope: (o) => g(
      R_(-82, -50, 164, 108, C.white, 8),
      PA('M-82 -50 L0 12 L82 -50 Z', C.lgrey, K),
      TX(0, 46, '@', 44),
      CI(70, -58, 22, C.red),
      TX(70, -49, '1', 26)
    ),

    // 7. Video play button over a blog page, with a microphone
    content_play: (o) => g(
      R_(-70, -60, 110, 130, C.white, 6),
      R_(-56, -38, 82, 8, C.lgrey, 4, S2),
      R_(-56, -20, 82, 8, C.lgrey, 4, S2),
      R_(-56, -2, 60, 8, C.lgrey, 4, S2),
      R_(-56, 16, 82, 8, C.lgrey, 4, S2),
      R_(-56, 34, 50, 8, C.lgrey, 4, S2),
      PA('M46 12 Q46 42 64 42 Q82 42 82 12', 'none', K),
      PA('M64 42 L64 60 M54 60 L74 60', 'none', K),
      R_(54, -10, 20, 34, C.grey, 10),
      R_(-62, -28, 80, 54, C.red, 14),
      PO([[-40, -14], [-40, 14], [-16, 0]], C.white, S2)
    ),

    // 8. Magnifier with rising bar chart and a #1 badge
    seo: (o) => g(
      CI(-8, -8, 58, C.white),
      R_(-40, 12, 14, 20, C.green, 2),
      R_(-22, 0, 14, 32, C.green, 2),
      R_(-4, -14, 14, 46, C.green, 2),
      PA('M38 38 L72 72', 'none', 'stroke="#111" stroke-width="22" stroke-linecap="round"'),
      PA('M38 38 L72 72', 'none', `stroke="${C.brown}" stroke-width="12" stroke-linecap="round"`),
      CI(62, -62, 22, C.yellow),
      TX(62, -54, '#1', 20)
    ),

    // 9. Teal gift box and arrow leading to a pink heart
    gift_trust: (o) => g(
      R_(-90, -8, 60, 64, C.teal, 4),
      R_(-96, -26, 72, 20, C.teal, 4),
      R_(-66, -26, 12, 82, C.yellow, 0),
      EL(-72, -38, 12, 8, C.yellow, K, 'transform="rotate(-25 -72 -38)"'),
      EL(-48, -38, 12, 8, C.yellow, K, 'transform="rotate(25 -48 -38)"'),
      CI(-60, -36, 6, C.yellow),
      R_(-22, 14, 36, 12, C.orange, 3),
      PO([[12, 4], [38, 20], [12, 36]], C.orange),
      HE(66, 2, 2.1, C.pink)
    ),

    // 10. Newspaper with a BIG NEWS headline
    newspaper_headline: (o) => g(
      R_(-80, -70, 160, 140, C.white, 6),
      R_(-72, -62, 144, 14, C.navy, 2),
      TX(0, -22, 'BIG NEWS!', 26),
      R_(-72, -6, 68, 60, C.blue, 3),
      CI(-38, 14, 9, C.yellow, S2),
      PO([[-70, 52], [-46, 22], [-22, 52]], C.green, S2),
      R_(6, 2, 64, 8, C.lgrey, 2, S2),
      R_(6, 16, 64, 8, C.lgrey, 2, S2),
      R_(6, 30, 50, 8, C.lgrey, 2, S2),
      R_(6, 44, 64, 8, C.lgrey, 2, S2)
    ),

    // 11. Five-star rating card, last star half filled
    stars: (o) => g(
      R_(-82, -58, 164, 116, C.white, 10),
      ST(-60, -22, 13, C.yellow, 'stroke="#111" stroke-width="4" stroke-linejoin="round"'),
      ST(-30, -22, 13, C.yellow, 'stroke="#111" stroke-width="4" stroke-linejoin="round"'),
      ST(0, -22, 13, C.yellow, 'stroke="#111" stroke-width="4" stroke-linejoin="round"'),
      ST(30, -22, 13, C.yellow, 'stroke="#111" stroke-width="4" stroke-linejoin="round"'),
      ST(60, -22, 13, C.white, 'stroke="#111" stroke-width="4" stroke-linejoin="round"'),
      HS(60, -22, 13, C.yellow),
      TX(0, 34, '★ 4.5', 30)
    ),

    // 12. Two people talking, heart and thumbs-up bubbles
    two_people_talking: (o) => g(
      PE(-44, -6, 22, C.blue, C.navy),
      PE(44, -6, 22, C.orange, C.purple),
      // left bubble
      PO([[-52, -58], [-44, -44], [-38, -56]], C.white),
      EL(-44, -72, 26, 17, C.white),
      HE(-44, -70, 0.9, C.pink),
      // right bubble
      PO([[40, -58], [46, -44], [52, -56]], C.white),
      EL(44, -72, 26, 17, C.white),
      R_(36, -64, 18, 14, C.skin, 4),
      R_(38, -82, 9, 22, C.skin, 4)
    ),

    // 13. Viral network: centre node, two rings and an outer ring of dots
    viral_network: (o) => {
      const P = (r, deg) => [r * Math.cos(deg * Math.PI / 180), r * Math.sin(deg * Math.PI / 180)];
      const r1 = [], r2 = [], r3 = [];
      for (let k = 0; k < 6; k++) r1.push(P(42, -90 + 60 * k));
      for (let k = 0; k < 6; k++) {
        r2.push(P(72, -90 + 60 * k - 18));
        r2.push(P(72, -90 + 60 * k + 18));
      }
      for (const p of r2) r3.push([p[0] * 86 / 72, p[1] * 86 / 72]);
      let s = '';
      // lines
      for (const p of r1) s += LN(`M0 0 L${f(p[0])} ${f(p[1])}`, TH);
      for (let k = 0; k < 6; k++) {
        for (const j of [2 * k, 2 * k + 1]) {
          const a = r1[k], b = r2[j];
          s += LN(`M${f(a[0])} ${f(a[1])} L${f(b[0])} ${f(b[1])}`, TH);
        }
      }
      for (let j = 0; j < r2.length; j++) {
        const a = r2[j], b = r3[j];
        s += LN(`M${f(a[0])} ${f(a[1])} L${f(b[0])} ${f(b[1])}`, TH);
      }
      // nodes
      for (const p of r3) s += CI(p[0], p[1], 3.5, C.red, TH);
      for (const p of r2) s += CI(p[0], p[1], 6, C.red, TH);
      for (const p of r1) s += CI(p[0], p[1], 9, C.red, TH);
      s += CI(0, 0, 16, C.red, K);
      return s;
    },

    // 14. Funnel with four bands and tiny people
    funnel_aida: (o) => {
      const w = (y) => 88 - (y + 60) * 0.4833;
      const band = (y0, y1, fill) =>
        PO([[-w(y0), y0], [w(y0), y0], [w(y1), y1], [-w(y1), y1]], fill);
      return g(
        band(-60, -30, C.yellow),
        band(-30, 0, C.orange),
        band(0, 30, C.red),
        band(30, 60, C.purple),
        TX(0, -38, 'ATTENTION', 18),
        TX(0, -8, 'INTEREST', 18),
        TX(0, 22, 'DESIRE', 18),
        TX(0, 52, 'ACTION', 17),
        PE(-48, -88, 7, C.blue, C.brown),
        PE(0, -88, 7, C.green, C.navy),
        PE(48, -88, 7, C.pink, C.brown),
        PE(12, 80, 8, C.teal, C.navy)
      );
    },

    // 15. Circular green loop around a happy person, with AGAIN!
    loop_arrow: (o) => {
      const cx = 0, cy = -4, R = 62;
      const P = (deg) => [cx + R * Math.cos(deg * Math.PI / 180), cy + R * Math.sin(deg * Math.PI / 180)];
      const s0 = P(120), e = P(60);
      const dir = [-Math.sin(60 * Math.PI / 180), Math.cos(60 * Math.PI / 180)];
      const perp = [Math.cos(60 * Math.PI / 180), Math.sin(60 * Math.PI / 180)];
      const tip = [e[0] + 16 * dir[0], e[1] + 16 * dir[1]];
      const b1 = [e[0] + 12 * perp[0], e[1] + 12 * perp[1]];
      const b2 = [e[0] - 12 * perp[0], e[1] - 12 * perp[1]];
      const d = `M${f(s0[0])} ${f(s0[1])} A ${R} ${R} 0 1 1 ${f(e[0])} ${f(e[1])}`;
      return g(
        PA(d, 'none', 'stroke="#111" stroke-width="24" stroke-linecap="round"'),
        PA(d, 'none', `stroke="${C.green}" stroke-width="14" stroke-linecap="round"`),
        PO([tip, b1, b2], C.green),
        PE(0, -22, 16, C.blue, C.brown),
        TX(0, 82, 'AGAIN!', 20)
      );
    },

    // 16. Pirate flag with skull, and an AARRR! speech bubble
    pirate_flag: (o) => g(
      R_(-72, -88, 10, 176, C.lbrown, 4),
      PA('M-62 -84 Q-22 -96 58 -80 L58 2 Q-22 -12 -62 2 Z', '#111', K),
      CI(-2, -44, 18, C.white),
      R_(-10, -30, 24, 12, C.white, 3, S2),
      CI(-10, -46, 6, '#111', NS),
      CI(6, -46, 6, '#111', NS),
      PO([[-2, -38], [-6, -30], [2, -30]], '#111', NS),
      PA('M-26 -4 L24 -22 M-26 -22 L24 -4', 'none', 'stroke="#ffffff" stroke-width="7" stroke-linecap="round"'),
      PO([[-16, 64], [-30, 84], [4, 64]], C.white),
      R_(-30, 18, 112, 48, C.white, 14),
      TX(26, 50, 'AARRR!', 22)
    ),

    // 17. Balance scales: small CAC stack up, big LTV pile down
    scales_cac_ltv: (o) => g(
      R_(-6, -72, 12, 140, C.brown, 4),
      R_(-40, 64, 80, 14, C.navy, 6),
      PA('M-62 -64 L-90 -30', 'none', TH),
      PA('M-62 -64 L-34 -30', 'none', TH),
      PA('M-92 -30 L-32 -30 Q-62 -4 -92 -30 Z', C.lgrey, K),
      R_(-84, -40, 44, 10, C.yellow, 5, S2),
      R_(-84, -50, 44, 10, C.yellow, 5, S2),
      TX(-62, 8, 'CAC', 20),
      PA('M62 -36 L32 -2', 'none', TH),
      PA('M62 -36 L92 -2', 'none', TH),
      PA('M32 -2 L92 -2 Q62 30 32 -2 Z', C.lgrey, K),
      CI(44, -11, 9, C.yellow),
      CI(62, -11, 9, C.yellow),
      CI(80, -11, 9, C.yellow),
      CI(53, -26, 9, C.yellow),
      CI(71, -26, 9, C.yellow),
      CI(62, -41, 9, C.yellow),
      TX(62, 42, 'LTV', 24),
      beam()
    ),

    // 18. Three rising steps with an arrow and a big percent sign
    percent_up: (o) => {
      const tipX = 58, tipY = -62;
      const u = [0.873, -0.487];
      const B = [tipX - 18 * u[0], tipY - 18 * u[1]];
      const p = [0.487 * 11, 0.873 * 11];
      return g(
        R_(-80, 40, 46, 30, C.blue, 3),
        R_(-28, 10, 46, 60, C.purple, 3),
        R_(24, -20, 46, 90, C.green, 3),
        PA(`M-68 8 L${f(B[0])} ${f(B[1])}`, 'none', 'stroke="#111" stroke-width="16" stroke-linecap="round"'),
        PA(`M-68 8 L${f(B[0])} ${f(B[1])}`, 'none', `stroke="${C.green}" stroke-width="8" stroke-linecap="round"`),
        PO([[tipX, tipY], [B[0] + p[0], B[1] + p[1]], [B[0] - p[0], B[1] - p[1]]], C.green),
        CI(-72, -70, 12, C.white),
        CI(-34, -34, 12, C.white),
        PA('M-30 -82 L-76 -22', 'none', 'stroke="#111" stroke-width="8" stroke-linecap="round"')
      );
    },

    // 19. Two web page cards for an A/B test, green tick above B
    ab_test: (o) => g(
      R_(-84, -40, 80, 100, C.white, 8),
      R_(4, -40, 80, 100, C.white, 8),
      R_(-72, -26, 56, 8, C.lgrey, 4, S2),
      R_(-72, -12, 40, 8, C.lgrey, 4, S2),
      R_(-72, 10, 56, 24, C.blue, 12),
      R_(16, -26, 56, 8, C.lgrey, 4, S2),
      R_(16, -12, 40, 8, C.lgrey, 4, S2),
      R_(16, 10, 56, 24, C.orange, 12),
      PA('M24 -54 L42 -36 L76 -80', 'none', 'stroke="#111" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"'),
      PA('M24 -54 L42 -36 L76 -80', 'none', `stroke="${C.green}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"`),
      TX(-44, 84, 'A', 26),
      TX(44, 84, 'B', 26)
    ),

    // 20. Conical flask with green liquid, beside a small bar chart
    beaker: (o) => {
      const F = 'M-18 -70 L18 -70 L18 -30 L66 50 Q72 62 58 66 L-58 66 Q-72 62 -66 50 L-18 -30 Z';
      const LQ = 'M-42 10 L42 10 L66 50 Q72 62 58 66 L-58 66 Q-72 62 -66 50 Z';
      return g(
        `<g transform="translate(-22 0) scale(0.8)">`,
        PA(F, C.white, K),
        PA(LQ, C.green, 'stroke="none"'),
        PA(F, 'none', K),
        R_(-24, -78, 48, 10, C.white, 4),
        CI(-12, 34, 6, C.white, TH),
        CI(10, 46, 4.5, C.white, TH),
        CI(-2, 56, 4, C.white, TH),
        `</g>`,
        R_(44, 16, 12, 46, C.blue, 2),
        R_(60, -2, 12, 64, C.orange, 2),
        R_(76, -20, 12, 82, C.green, 2),
        PA('M38 62 L92 62', 'none', K)
      );
    },

    // 21. Loyalty card with six stamps and a small envelope
    loyalty: (o) => g(
      R_(-82, -62, 140, 96, C.white, 10),
      CI(-58, -40, 15, C.orange),
      CI(-24, -40, 15, C.orange),
      CI(10, -40, 15, C.orange),
      CI(-58, 2, 15, C.orange),
      CI(-24, 2, 15, C.lgrey),
      CI(10, 2, 15, C.lgrey),
      ST(-58, -40, 9, C.yellow, 'stroke="#111" stroke-width="2.5" stroke-linejoin="round"'),
      ST(-24, -40, 9, C.yellow, 'stroke="#111" stroke-width="2.5" stroke-linejoin="round"'),
      ST(10, -40, 9, C.yellow, 'stroke="#111" stroke-width="2.5" stroke-linejoin="round"'),
      ST(-58, 2, 9, C.yellow, 'stroke="#111" stroke-width="2.5" stroke-linejoin="round"'),
      R_(40, 6, 46, 36, C.pink, 4),
      PA('M40 8 L63 26 L86 8', 'none', K)
    ),

    // 22. Pie chart: 60% pink, 40% teal
    pie_6040: (o) => {
      const R = 72;
      const P = (deg) => [R * Math.cos(deg * Math.PI / 180), R * Math.sin(deg * Math.PI / 180)];
      const a = P(-90), b = P(126), c = P(270);
      return g(
        PA(`M0 0 L${f(a[0])} ${f(a[1])} A ${R} ${R} 0 1 1 ${f(b[0])} ${f(b[1])} Z`, C.pink, K),
        PA(`M0 0 L${f(b[0])} ${f(b[1])} A ${R} ${R} 0 0 1 ${f(c[0])} ${f(c[1])} Z`, C.teal, K),
        TX(38, 4, '60', 28),
        TX(38, 26, 'BRAND', 15),
        TX(-38, -18, '40', 28),
        TX(-38, 4, 'SALES', 15)
      );
    },

    // 23. Wrapped present, red with yellow ribbon and bow
    gift: (o) => g(
      R_(-60, -8, 120, 78, C.red, 6),
      R_(-68, -34, 136, 28, C.red, 6),
      R_(-9, -34, 18, 104, C.yellow, 0),
      EL(-24, -50, 22, 14, C.yellow, K, 'transform="rotate(-30 -24 -50)"'),
      EL(24, -50, 22, 14, C.yellow, K, 'transform="rotate(30 24 -50)"'),
      CI(0, -42, 10, C.yellow)
    ),

    // 24. Paper with signature, pen, and a ticked YES box
    pen_sign: (o) => g(
      R_(-80, -70, 110, 140, C.white, 4),
      R_(-68, -56, 86, 5, C.lgrey, 2, S2),
      R_(-68, 22, 86, 5, C.lgrey, 2, S2),
      PA('M-68 -6 Q-56 -34 -44 -6 T-22 -6 T-4 -6 T14 -6', 'none', 'stroke="#2c3e50" stroke-width="4" stroke-linecap="round"'),
      R_(-68, 34, 28, 28, C.white, 3, S2),
      PA('M-63 48 L-56 56 L-44 38', 'none', `stroke="${C.green}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"`),
      TX(-12, 56, 'YES', 22),
      `<g transform="translate(50 0) rotate(30)">`,
      R_(-10, -70, 20, 110, C.red, 8),
      R_(-10, 22, 20, 6, C.lgrey, 0, S2),
      PO([[-10, 40], [10, 40], [0, 66]], C.navy),
      `</g>`
    ),

    // 25. Three people, all giving thumbs up
    crowd_thumbs: (o) => {
      const person = (hx, shirt, hair) => g(
        PE(hx, -12, 15, shirt, hair),
        PA(`M${hx + 16} ${-12 + 24} L${hx + 22} ${-12 - 2}`, 'none', 'stroke="#111" stroke-width="16" stroke-linecap="round"'),
        PA(`M${hx + 16} ${-12 + 24} L${hx + 22} ${-12 - 2}`, 'none', `stroke="${C.skin}" stroke-width="9" stroke-linecap="round"`),
        R_(hx + 13, -12 - 22, 20, 20, C.skin, 7),
        R_(hx + 17, -12 - 40, 10, 22, C.skin, 5)
      );
      return g(
        person(-58, C.red, C.navy),
        person(0, C.blue, C.brown),
        person(58, C.yellow, C.purple)
      );
    },

    // 26. Doctor: white coat, stethoscope, mortarboard
    doctor: (o) => g(
      PE(0, -4, 24, C.white, null),
      LN('M-10 28 L-2 52 M10 28 L2 52', TH),
      PA('M-14 26 Q-30 52 -12 62 Q 4 68 8 54', 'none', `stroke="${C.navy}" stroke-width="4" stroke-linecap="round"`),
      CI(8, 54, 5, C.grey),
      PA('M-24 -36 L-24 -18 Q0 -8 24 -18 L24 -36 Z', C.navy, K),
      PO([[0, -62], [46, -44], [0, -26], [-46, -44]], C.navy),
      PA('M40 -44 L40 -20', 'none', K),
      CI(40, -18, 5, C.yellow)
    ),

    // 27. Big red heart with a smiling face
    heart_smile: (o) => g(
      HE(0, 14, 4.8, C.red),
      EL(-18, -6, 6, 9, '#111', NS),
      EL(18, -6, 6, 9, '#111', NS),
      CI(-32, 10, 7, C.pink, NS),
      CI(32, 10, 7, C.pink, NS),
      LN('M-22 6 Q0 26 22 6', 'stroke="#111" stroke-width="6" stroke-linecap="round" fill="none"')
    ),

    // 28. Hourglass with sand and an ONLY 2 LEFT tag
    hourglass: (o) => {
      const G = 'M-38 -68 L38 -68 Q38 -40 6 -4 Q38 32 38 68 L-38 68 Q-38 32 -6 -4 Q-38 -40 -38 -68 Z';
      return g(
        `<g transform="translate(-22 0)">`,
        R_(-50, -80, 100, 12, C.brown, 4),
        R_(-50, 68, 100, 12, C.brown, 4),
        PA(G, C.white, K),
        PA('M-26 -58 L26 -58 L10 -36 Q0 -28 -10 -36 Z', C.yellow, S2),
        PA('M-34 68 L34 68 L34 44 Q0 26 -34 44 Z', C.yellow, S2),
        PA('M0 -4 L0 28', 'none', `stroke="${C.yellow}" stroke-width="4" stroke-linecap="round"`),
        PA(G, 'none', K),
        `</g>`,
        `<g transform="rotate(-8 60 6)">`,
        R_(24, -22, 64, 58, C.red, 8),
        TX(56, 2, 'ONLY 2', 17),
        TX(56, 24, 'LEFT!', 17),
        `</g>`
      );
    },

    // 29. Tipped scales: small green gain, big red loss weight, x2 label
    scales_loss: (o) => g(
      R_(-6, -72, 12, 140, C.brown, 4),
      R_(-40, 64, 80, 14, C.navy, 6),
      PA('M-62 -64 L-90 -30', 'none', TH),
      PA('M-62 -64 L-34 -30', 'none', TH),
      PA('M-92 -30 L-32 -30 Q-62 -4 -92 -30 Z', C.lgrey, K),
      PA('M62 -36 L32 -2', 'none', TH),
      PA('M62 -36 L92 -2', 'none', TH),
      PA('M32 -2 L92 -2 Q62 30 32 -2 Z', C.lgrey, K),
      beam(),
      R_(-88, -74, 46, 40, C.green, 6),
      TX(-65, -56, '+£10', 16),
      TX(-65, -40, 'GAIN', 13),
      R_(20, -62, 68, 60, C.red, 8),
      TX(54, -32, '−£10', 24),
      TX(54, -12, 'LOSS', 16),
      TX(60, 46, '×2', 28)
    ),

    // 30. Three eyes, arrow, growing heart
    eyes_heart: (o) => g(
      EL(-76, -20, 12, 10, C.white),
      CI(-73, -19, 5, '#111', NS),
      EL(-46, -20, 12, 10, C.white),
      CI(-43, -19, 5, '#111', NS),
      EL(-16, -20, 12, 10, C.white),
      CI(-13, -19, 5, '#111', NS),
      R_(2, -26, 20, 12, C.orange, 3),
      PO([[20, -38], [36, -20], [20, -2]], C.orange),
      HE(62, -20, 2.2, C.red)
    ),

    // 31. Hare (fast) and tortoise (slow), wide
    hare_tortoise: (o) => g(
      LN('M-106 -30 L-94 -30 M-102 -10 L-90 -10 M-106 10 L-94 10', 'stroke="#111" stroke-width="4" stroke-linecap="round" fill="none"'),
      `<g transform="translate(-8 0) scale(0.9)">`,
      // hare
      R_(-72, 22, 10, 18, C.lbrown, 4),
      R_(-46, 22, 10, 18, C.lbrown, 4),
      CI(-88, 0, 8, C.white),
      EL(-50, 8, 34, 20, C.lbrown),
      EL(-22, -50, 6, 22, C.lbrown),
      EL(-6, -52, 6, 22, C.lbrown),
      CI(-14, -12, 18, C.lbrown),
      CI(-8, -14, 3, '#111', NS),
      CI(2, -6, 3.5, C.pink, NS),
      `</g>`,
      TX(-50, 64, 'FAST', 22),
      TX(-50, 86, 'SYSTEM 1', 14),
      // tortoise
      `<g transform="translate(14 0) scale(0.9)">`,
      R_(-26, 24, 12, 10, C.teal, 3),
      R_(60, 24, 12, 10, C.teal, 3),
      PA('M-22 14 A 48 38 0 0 1 70 14 Z', C.green, K),
      PA('M10 -2 L24 -24 L38 -2 M24 -24 L24 14', 'none', TH),
      R_(-26, 12, 112, 16, C.teal, 8),
      EL(96, 2, 11, 9, C.green),
      CI(100, -1, 2.5, '#111', NS),
      `</g>`,
      TX(24, 64, 'SLOW', 22),
      TX(24, 86, 'SYSTEM 2', 14)
    ),

    // 32. Cream speech bubble with four lines, and an old man in a top hat
    quote_bubble: (o) => g(
      PO([[14, 56], [44, 56], [64, 84]], C.cream),
      R_(-130, -70, 190, 130, C.cream, 16),
      TX(-35, -40, 'HALF THE MONEY I', 16),
      TX(-35, -14, 'SPEND ON ADVERTISING', 16),
      TX(-35, 12, 'IS WASTED... BUT', 16),
      TX(-35, 38, 'WHICH HALF?', 16),
      PE(98, -6, 18, C.navy, null),
      R_(80, -50, 36, 28, '#111', 3),
      R_(68, -26, 60, 8, '#111', 3),
      PA('M86 4 Q98 -3 98 3 Q98 -3 110 4', 'none', 'stroke="#111" stroke-width="5" stroke-linecap="round"')
    ),

    // 33. TV, phone and laptop with dashed arrows and a big red question mark
    journey: (o) => g(
      R_(-104, -30, 58, 44, C.teal, 6),
      R_(-98, -24, 46, 30, C.blue, 3, S2),
      LN('M-92 14 L-94 24 M-56 14 L-54 24'),
      `<path d="M-42 -8 L-24 -8" fill="none" stroke="#111" stroke-width="5" stroke-dasharray="7 6" stroke-linecap="round"/>`,
      PO([[-16, -8], [-26, -16], [-26, 0]], '#111', NS),
      R_(-14, -40, 28, 56, C.navy, 6),
      R_(-10, -34, 20, 38, C.blue, 2, S2),
      `<path d="M20 -8 L34 -8" fill="none" stroke="#111" stroke-width="5" stroke-dasharray="7 6" stroke-linecap="round"/>`,
      PO([[40, -8], [30, -16], [30, 0]], '#111', NS),
      R_(46, -38, 50, 36, C.white, 4),
      R_(38, 0, 66, 9, C.lgrey, 4),
      TX(0, -52, '?', 44, C.red)
    ),

    // 34. Small square maze: START at the entrance, red CANCEL at the deep exit
    mini_maze: (o) => g(
      R_(-62, -62, 124, 124, C.white, 0, NS),
      PA('M-37 -62 L62 -62 M-62 -62 L-62 62 M-62 62 L12 62 M38 62 L62 62 M62 62 L62 -62', 'none', 'stroke="#111" stroke-width="5" stroke-linecap="round"'),
      PA('M-37 -12 L-37 38 M-12 -37 L-12 -12 M-12 13 L38 13 M13 -37 L13 13 M38 -37 L38 -12 M-37 38 L-12 38', 'none', 'stroke="#111" stroke-width="6" stroke-linecap="round"'),
      R_(-86, -92, 70, 22, C.green, 6),
      TX(-51, -76, 'START', 14),
      R_(-6, 70, 64, 20, C.red, 6),
      TX(26, 85, 'CANCEL', 13)
    ),

    // 35. Friendly boxy robot holding an AD poster
    mini_robot: (o) => g(
      PA('M0 -54 L0 -72', 'none', K),
      CI(0, -80, 8, C.red),
      R_(-56, -54, 112, 92, C.lgrey, 16),
      CI(-24, -14, 12, C.teal),
      CI(24, -14, 12, C.teal),
      CI(-20, -18, 3, C.white, NS),
      CI(28, -18, 3, C.white, NS),
      PA('M-22 14 Q0 26 22 14', 'none', 'stroke="#111" stroke-width="5" stroke-linecap="round"'),
      R_(-62, -16, 8, 24, C.grey, 2),
      R_(54, -16, 8, 24, C.grey, 2),
      R_(-12, 36, 24, 10, C.grey, 0, NS),
      R_(-40, 42, 80, 44, C.blue, 10),
      R_(-30, 46, 60, 34, C.white, 3),
      TX(0, 70, 'AD', 22),
      CI(-34, 62, 7, C.yellow),
      CI(34, 62, 7, C.yellow)
    ),

    // 36. Big background cloud, drawn at real size (1400x500 units).
    // Outline is 7 units. o.strokeWidth overrides it for the test page only.
    cloud: (o = {}) => {
      const sw = o.strokeWidth || 7;
      const xs = [-640, -497.8, -355.6, -213.3, -71.1, 71.1, 213.3, 355.6, 497.8, 640];
      const ys = [-110, -185, -130, -215, -90, -175, -120, -200, -55, -110];
      const rs = [150, 200, 130, 220, 120, 190, 160, 210, 140];
      const bx = [640, 384, 128, -128, -384, -640];
      const brs = [200, 190, 210, 195, 205];
      let d = `M${xs[0]} ${ys[0]}`;
      for (let i = 0; i < 9; i++) d += ` A${rs[i]} ${rs[i]} 0 0 1 ${xs[i + 1]} ${ys[i + 1]}`;
      d += ' C700 -40 700 130 640 195';
      for (let j = 0; j < 5; j++) d += ` A${brs[j]} ${brs[j]} 0 0 1 ${bx[j + 1]} 195`;
      d += ' C-700 130 -700 -40 -640 -110 Z';
      const band = 'M-720 100 Q0 170 720 100 L720 300 L-720 300 Z';
      return g(
        `<defs><clipPath id="cloudclip"><path d="${d}"/></clipPath></defs>`,
        PA(d, C.white, 'stroke="none"'),
        PA(band, '#c9ced6', 'stroke="none" clip-path="url(#cloudclip)"'),
        PA(d, 'none', `stroke="#111" stroke-width="${sw}" stroke-linejoin="round"`)
      );
    },
  });
})();
