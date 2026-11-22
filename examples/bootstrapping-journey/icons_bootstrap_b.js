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
  const SW = (w, col) => `stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;
  const R = (x, y, w, h, fill, rx = 0, st = K) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" ${st}/>`;
  const CI = (cx, cy, r, fill, st = K) =>
    `<circle cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="${fill}" ${st}/>`;
  const EL = (cx, cy, rx, ry, fill, st = K) =>
    `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" ${st}/>`;
  const PA = (d, fill = 'none', st = K) => `<path d="${d}" fill="${fill}" ${st}/>`;
  const LN = (d, st = TH) => `<path d="${d}" fill="none" ${st}/>`;
  const TX = (x, y, s, size, fill = '#111') =>
    `<text x="${x}" y="${y}" font-family="Hand" font-size="${size}" fill="${fill}" text-anchor="middle">${s}</text>`;
  const PO = (pts, fill, st = K) =>
    `<polygon points="${pts.map((p) => f(p[0]) + ',' + f(p[1])).join(' ')}" fill="${fill}" ${st}/>`;
  // Thick line with black outline: outline first, colour on top.
  const OL = (d, col, w) => PA(d, 'none', SW(w + 10, '#111')) + PA(d, 'none', SW(w, col));
  // Straight arrow with filled head.
  const AR = (x1, y1, x2, y2, col = '#111') => {
    const a = Math.atan2(y2 - y1, x2 - x1);
    const bx = x2 - 12 * Math.cos(a), by = y2 - 12 * Math.sin(a);
    return PA(`M${f(x1)} ${f(y1)} L${f(bx)} ${f(by)}`, 'none', K) +
      PO([[x2, y2], [bx - 7 * Math.sin(a), by + 7 * Math.cos(a)], [bx + 7 * Math.sin(a), by - 7 * Math.cos(a)]], col);
  };
  // Star points: outer radius Ro, inner radius ri. Index 0 is the top point.
  const SP = (cx, cy, Ro, ri) => {
    const a = [];
    for (let k = 0; k < 10; k++) {
      const t = (-90 + 36 * k) * Math.PI / 180;
      const rr = k % 2 ? ri : Ro;
      a.push([cx + rr * Math.cos(t), cy + rr * Math.sin(t)]);
    }
    return a;
  };
  const ST = (cx, cy, Ro, fill) => PO(SP(cx, cy, Ro, Ro * 0.45), fill);
  // Smiley face
  const SM = (cx, cy, r) => CI(cx, cy, r, C.yellow) +
    CI(cx - r * 0.35, cy - r * 0.2, Math.max(2, r * 0.12), '#111', NS) +
    CI(cx + r * 0.35, cy - r * 0.2, Math.max(2, r * 0.12), '#111', NS) +
    LN(`M${f(cx - r * 0.5)} ${f(cy + r * 0.2)} Q${f(cx)} ${f(cy + r * 0.8)} ${f(cx + r * 0.5)} ${f(cy + r * 0.2)}`,
      'stroke="#111" stroke-width="3" stroke-linecap="round"');
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
      'stroke="#111" stroke-width="3" stroke-linecap="round"'
    );
    return s;
  };

  Object.assign(window.ICONS, {

    // 1. Four boxes M S C W, the W box crossed out
    moscow_boxes: () => g(
      R(-84, -84, 78, 78, C.green, 8), TX(-45, -29, 'M', 44),
      R(6, -84, 78, 78, C.yellow, 8), TX(45, -29, 'S', 44),
      R(-84, 6, 78, 78, C.orange, 8), TX(-45, 61, 'C', 44),
      R(6, 6, 78, 78, C.grey, 8), TX(45, 61, 'W', 44),
      OL('M18 18 L72 72', C.red, 8),
      OL('M72 18 L18 72', C.red, 8)
    ),

    // 2. Skateboard, bicycle, car, each with a smiley
    skateboard_car: () => {
      const bike = g(
        PA('M-12 40 L6 14 L16 40 M6 14 L10 4 L16 4', 'none', SW(5, '#111')),
        CI(-12, 40, 13, C.white), CI(16, 40, 13, C.white)
      );
      const car = g(
        PA('M50 46 L50 32 Q50 26 56 24 L66 10 Q70 6 76 6 L88 6 Q94 6 98 12 L104 24 Q106 26 106 32 L106 46 Z', C.red),
        PA('M68 22 L76 13 L88 13 L96 22 Z', C.lgrey),
        CI(68, 46, 10, C.navy), CI(90, 46, 10, C.navy)
      );
      const board = g(
        R(-106, 20, 48, 12, C.orange, 6),
        CI(-98, 40, 6, C.navy), CI(-66, 40, 6, C.navy)
      );
      return g(
        board, SM(-82, -34, 15), AR(-48, -2, -34, -2),
        bike, SM(2, -34, 15), AR(34, -2, 46, -2),
        car, SM(78, -34, 15)
      );
    },

    // 3. Three puzzle blocks snapping together, a cursor dragging one
    nocode_blocks: () => g(
      CI(-66, -6, 11, C.blue),
      CI(-30, -26, 11, C.yellow),
      CI(2, 16, 11, C.green),
      R(-100, -6, 68, 68, C.blue, 8),
      R(-30, -60, 68, 68, C.yellow, 8),
      R(-30, 16, 68, 68, C.green, 8),
      PO([[48, 26], [48, 62], [57, 53], [65, 70], [73, 66], [65, 50], [77, 50]], '#ffffff')
    ),

    // 4. Old camera with flash, a small house photo coming out
    camera_photo: () => g(
      `<g transform="translate(22 0)">`,
      R(-50, -74, 52, 50, '#ffffff', 4),
      R(-44, -68, 40, 38, C.blue, 2, S2),
      PO([[-38, -40], [-24, -54], [-10, -40]], C.red, S2),
      R(-34, -40, 28, 10, C.yellow, 0, S2),
      R(-84, -30, 120, 96, C.navy, 14),
      R(-80, -44, 28, 14, C.navy, 4),
      CI(-24, 20, 28, C.lgrey),
      CI(-24, 20, 15, C.blue, S2),
      CI(-30, 14, 4, '#ffffff', NS),
      R(22, -46, 22, 16, C.yellow, 3),
      PA('M52 -52 L62 -62 M33 -64 L33 -80 M14 -52 L4 -62', 'none', SW(4, '#111')),
      CI(-68, 0, 6, C.red, S2),
      `</g>`
    ),

    // 5. Hollow cracked gold trophy with a 1M SIGN-UPS banner
    vanity_trophy: () => g(
      PA('M-42 -46 Q-74 -46 -66 -20 Q-60 2 -34 0', 'none', K),
      PA('M42 -46 Q74 -46 66 -20 Q60 2 34 0', 'none', K),
      PA('M-44 -60 L44 -60 L36 -6 Q30 20 0 20 Q-30 20 -36 -6 Z', C.yellow),
      R(-8, 18, 16, 22, C.yellow, 2),
      R(-30, 38, 60, 16, C.yellow, 4),
      EL(0, -60, 42, 9, C.navy),
      LN('M-4 -36 L4 -22 L-6 -8 L4 6'),
      ST(62, -74, 12, C.white),
      TX(-80, -66, '?', 40, C.red),
      R(-62, 62, 124, 24, C.white, 6),
      TX(0, 80, '1M SIGN-UPS', 16)
    ),

    // 6. Chart with axes and a green line going up
    line_chart_up: () => g(
      PA('M-80 -84 L-80 74 L84 74', 'none', K),
      OL('M-64 36 L-30 6 L0 18 L30 -20 L62 -60', C.green, 9),
      CI(-64, 36, 8, C.white), CI(-30, 6, 8, C.white), CI(0, 18, 8, C.white),
      CI(30, -20, 8, C.white), CI(62, -60, 8, C.white),
      TX(0, 102, 'COMEBACKS', 18)
    ),

    // 7. Retention curve: steep drop, then flat, with a green tick
    retention_curve: () => g(
      PA('M-80 -84 L-80 74 L84 74', 'none', K),
      OL('M-70 -62 C-30 -62 -20 40 14 40 L72 40', C.blue, 9),
      CI(-70, -62, 8, C.white),
      OL('M26 16 L40 30 L64 2', C.green, 9),
      TX(0, 102, 'TIME', 18)
    ),

    // 8. Big blue sad face with a tear and a 40% badge
    sad_face_40: () => g(
      CI(-8, 0, 68, C.blue),
      EL(-30, -14, 7, 10, '#111', NS),
      EL(14, -14, 7, 10, '#111', NS),
      PA('M-44 -28 L-18 -36', 'none', SW(6, '#111')),
      PA('M0 -36 L26 -28', 'none', SW(6, '#111')),
      PA('M-36 50 Q-8 22 20 50', 'none', SW(6, '#111')),
      PA('M-38 2 Q-48 18 -38 24 Q-28 18 -38 2 Z', C.white),
      CI(56, -54, 28, C.red),
      TX(56, -44, '40%', 26, '#ffffff')
    ),

    // 9. Video player with a play button and an open box on screen
    demo_video_box: () => g(
      R(-90, -66, 180, 140, C.navy, 12),
      R(-78, -54, 156, 96, C.blue, 6),
      PO([[-36, -8], [-50, -30], [-16, -30], [-6, -8]], C.lbrown),
      PO([[36, -8], [50, -30], [16, -30], [6, -8]], C.lbrown),
      R(-34, -8, 68, 30, C.lbrown, 4),
      R(-6, -8, 12, 30, C.yellow, 0, S2),
      TX(0, -38, 'DEMO', 18, '#ffffff'),
      CI(-58, 58, 12, C.yellow),
      PO([[-63, 51], [-63, 65], [-50, 58]], '#111', NS),
      R(-36, 52, 100, 12, C.lgrey, 6, S2),
      R(-36, 52, 50, 12, C.green, 6, S2)
    ),

    // 10. Wooden signpost at a fork: PIVOT left, PERSEVERE right
    signpost_fork: () => g(
      R(-8, -70, 16, 162, C.brown, 4),
      PO([[8, -62], [-70, -62], [-88, -46], [-70, -30], [8, -30]], C.yellow),
      TX(-36, -38, 'PIVOT', 16),
      PO([[-8, -8], [84, -8], [100, 6], [84, 20], [-8, 20]], C.green),
      TX(50, 13, 'PERSEVERE', 13),
      PA('M-70 92 L70 92', 'none', K)
    ),

    // 11. Game controller, arrow, chat bubble with #
    game_to_chat: () => g(
      R(-104, -24, 68, 44, C.navy, 20),
      R(-96, -6, 24, 8, C.lgrey, 2, S2),
      R(-88, -14, 8, 24, C.lgrey, 2, S2),
      CI(-54, -12, 5, C.red, S2),
      CI(-42, 0, 5, C.green, S2),
      AR(-26, -2, -8, -2),
      PO([[32, 22], [30, 40], [52, 22]], C.white),
      R(10, -50, 92, 72, C.white, 20),
      TX(56, 6, '#', 50)
    ),

    // 12. Instant camera with a sun and mountain photo, BURBN crossed out
    polaroid_camera: () => g(
      R(-44, -96, 88, 80, '#ffffff', 4),
      R(-36, -88, 72, 58, C.blue, 2, S2),
      CI(18, -68, 10, C.yellow, S2),
      PO([[-36, -30], [-12, -62], [6, -42], [18, -54], [36, -30]], C.green, S2),
      R(-70, -20, 140, 96, C.orange, 14),
      CI(0, 30, 24, C.navy),
      CI(0, 30, 12, C.blue, S2),
      CI(-4, 24, 3, '#ffffff', NS),
      R(34, -8, 24, 20, C.yellow, 3, S2),
      CI(-48, 20, 6, C.red, S2),
      TX(-82, -98, 'BURBN', 16, C.grey),
      OL('M-108 -104 L-58 -90', C.red, 5)
    ),

    // 13. Four stair steps with blue water falling from step to step
    waterfall_steps: () => {
      const steps = [['PLAN', C.yellow], ['DESIGN', C.orange], ['BUILD', C.green], ['TEST', C.teal]];
      let s = '';
      steps.forEach(([label, col], i) => {
        const x0 = -100 + i * 40, y0 = -76 + i * 50;
        s += R(x0, y0, 80, 30, col, 4) + TX(x0 + 40, y0 + 20, label, 14);
      });
      for (let i = 0; i < 3; i++) {
        const xc = -100 + i * 40 + 70, y0 = -76 + i * 50;
        s += R(xc - 8, y0 + 24, 16, 30, C.blue, 8);
      }
      return s;
    },

    // 14. Red balloon getting huge, with a small clock beside it
    balloon_expand: () => g(
      EL(-72, -54, 16, 20, C.lgrey),
      LN('M-72 -34 Q-74 -28 -70 -24'),
      AR(-52, -46, -40, -30),
      EL(20, -6, 62, 74, C.red),
      PA('M-10 -50 Q-22 -30 -18 -6', 'none', SW(7, '#ffffff')),
      PO([[14, 66], [26, 66], [20, 76]], C.red),
      LN('M20 76 Q28 88 14 98'),
      CI(-64, 54, 22, C.white),
      LN('M-64 54 L-64 40 M-64 54 L-52 60'),
      CI(-80, 30, 7, C.yellow),
      CI(-48, 30, 7, C.yellow),
      LN('M-96 44 L-106 40 M-96 62 L-106 64')
    ),

    // 15. Snowy mountain with a ski lodge, and an AGILE scroll
    manifesto_mountain: () => g(
      PO([[-90, 60], [-12, -62], [30, 10], [56, -14], [92, 60]], C.blue),
      PO([[-12, -62], [-28, -34], [-16, -40], [-8, -30], [0, -42], [6, -30]], '#ffffff'),
      PO([[30, 40], [46, 20], [62, 40]], C.red),
      R(34, 40, 24, 20, C.yellow, 2),
      R(42, 46, 8, 14, C.brown, 1, S2),
      R(-98, 22, 20, 52, C.cream, 10),
      R(8, 22, 20, 52, C.cream, 10),
      R(-88, 26, 104, 44, C.cream, 6),
      TX(-36, 56, 'AGILE', 22)
    ),

    // 16. Circular loop of three arrows with a running shoe in the middle
    sprint_cycle: () => {
      const RR = 62;
      const pt = (a) => [RR * Math.cos(a * Math.PI / 180), RR * Math.sin(a * Math.PI / 180)];
      const seg = (a1, a2, col) => {
        const p1 = pt(a1), p2 = pt(a2);
        const d = `M${f(p1[0])} ${f(p1[1])} A${RR} ${RR} 0 0 1 ${f(p2[0])} ${f(p2[1])}`;
        const t = [-Math.sin(a2 * Math.PI / 180), Math.cos(a2 * Math.PI / 180)];
        const n = [Math.cos(a2 * Math.PI / 180), Math.sin(a2 * Math.PI / 180)];
        const tip = [p2[0] + 16 * t[0], p2[1] + 16 * t[1]];
        const b1 = [p2[0] + 12 * n[0], p2[1] + 12 * n[1]];
        const b2 = [p2[0] - 12 * n[0], p2[1] - 12 * n[1]];
        return PA(d, 'none', SW(20, '#111')) + PA(d, 'none', SW(10, col)) + PO([tip, b1, b2], col);
      };
      const shoe = g(
        PA('M-34 16 L-34 -12 Q-34 -20 -26 -20 L-10 -20 L6 -6 L30 0 Q40 4 40 14 L40 20 L-34 20 Z', C.white),
        R(-36, 14, 78, 10, C.navy, 4),
        LN('M-8 -14 L4 -6 M0 -18 L10 -10')
      );
      return seg(-90, 10, C.blue) + seg(30, 130, C.orange) + seg(150, 250, C.green) + shoe;
    },

    // 17. Kanban board: TO DO, DOING, DONE with 2-1-3 notes
    kanban_board: () => g(
      R(-88, -86, 176, 172, C.navy, 12),
      R(-74, -44, 46, 118, C.white, 4),
      R(-22, -44, 46, 118, C.white, 4),
      R(30, -44, 46, 118, C.white, 4),
      TX(-51, -56, 'TO DO', 11, '#ffffff'),
      TX(1, -56, 'DOING', 11, '#ffffff'),
      TX(53, -56, 'DONE', 11, '#ffffff'),
      R(-68, -34, 38, 32, C.yellow, 2, S2),
      R(-68, 4, 38, 32, C.pink, 2, S2),
      R(-16, -34, 38, 32, C.blue, 2, S2),
      R(36, -34, 36, 32, C.green, 2, S2),
      R(36, 4, 36, 32, C.yellow, 2, S2),
      R(36, 40, 36, 28, C.pink, 2, S2)
    ),

    // 18. Calendar page with 6 WEEKS, and scissors cutting a list
    calendar_6weeks: () => g(
      R(-86, -70, 110, 128, C.white, 8),
      R(-86, -70, 110, 30, C.red, 8),
      R(-66, -84, 10, 26, C.navy, 4),
      R(-22, -84, 10, 26, C.navy, 4),
      TX(-31, 8, '6 WEEKS', 24),
      R(30, -44, 60, 86, C.white, 6),
      R(38, -34, 10, 10, C.lgrey, 2, S2), LN('M54 -29 L82 -29'),
      R(38, -14, 10, 10, C.lgrey, 2, S2), LN('M54 -9 L82 -9'),
      R(38, 6, 10, 10, C.lgrey, 2, S2), LN('M54 11 L82 11'),
      R(38, 26, 10, 10, C.lgrey, 2, S2), LN('M54 31 L82 31'),
      OL('M50 66 L80 32', C.grey, 6),
      OL('M66 66 L36 32', C.grey, 6),
      CI(44, 74, 9, C.white),
      CI(72, 74, 9, C.white)
    ),

    // 19. Bowl of rice with chopsticks and R I C E on the bowl
    rice_bowl: () => g(
      `<g transform="translate(0 12)">`,
      PA('M-70 -6 L70 -6 Q70 64 0 66 Q-70 64 -70 -6 Z', C.white),
      PA('M-68 14 Q0 30 68 14', 'none', SW(8, C.red)),
      CI(-44, -14, 14, '#ffffff'),
      CI(-20, -24, 16, '#ffffff'),
      CI(4, -26, 16, '#ffffff'),
      CI(28, -16, 14, '#ffffff'),
      TX(-36, 46, 'R', 20),
      TX(-12, 50, 'I', 20),
      TX(12, 50, 'C', 20),
      TX(36, 46, 'E', 20),
      OL('M-12 -96 L30 -34', C.lbrown, 7),
      OL('M6 -96 L46 -34', C.lbrown, 7),
      `</g>`
    ),

    // 20. Bullseye target with an arrow, and a card with 3 ticks
    okr_target: () => g(
      CI(-26, 8, 64, C.white),
      CI(-26, 8, 46, C.red),
      CI(-26, 8, 28, C.white),
      CI(-26, 8, 10, C.red),
      OL('M-26 8 L12 -26', C.lbrown, 6),
      PO([[12, -26], [26, -36], [20, -18]], C.yellow),
      R(44, -22, 50, 96, C.white, 6),
      CI(70, -30, 6, C.red),
      PA('M52 -2 L58 4 L68 -8', 'none', SW(6, C.green)), LN('M76 -2 L88 -2'),
      PA('M52 20 L58 26 L68 14', 'none', SW(6, C.green)), LN('M76 20 L88 20'),
      PA('M52 42 L58 48 L68 36', 'none', SW(6, C.green)), LN('M76 42 L88 42')
    ),

    // 21. Four tangled people and a red LATE! clock
    tangled_people: () => g(
      PE(-56, -38, 14, C.blue, C.brown),
      PE(-4, -50, 14, C.green, C.navy),
      PE(46, -36, 14, C.orange, C.purple),
      PE(-18, 4, 14, C.pink, C.brown),
      OL('M-68 -6 C-40 40 0 -10 24 22 S62 4 40 -14', C.navy, 6),
      OL('M-40 40 C-10 -30 30 40 2 14 S-44 -4 -10 -36 S30 -10 46 6', C.purple, 6),
      CI(56, 56, 24, C.red),
      CI(56, 56, 17, C.white, S2),
      LN('M56 56 L56 45 M56 56 L65 60'),
      TX(-38, 96, 'LATE!', 22, C.red)
    ),

    // 22. Red alarm clock with two bells and motion lines
    clock: () => g(
      CI(-50, -44, 20, C.yellow),
      CI(50, -44, 20, C.yellow),
      PA('M-36 58 L-48 80 M36 58 L48 80', 'none', K),
      CI(0, 8, 62, C.red),
      CI(0, 8, 44, C.white, S2),
      LN('M0 -34 L0 -26 M0 42 L0 34 M-34 8 L-26 8 M34 8 L26 8'),
      PA('M0 8 L0 -20 M0 8 L16 16', 'none', SW(6, '#111')),
      CI(0, 8, 6, C.navy),
      PA('M-92 -6 L-104 -12 M-94 10 L-108 10 M-92 26 L-104 32', 'none', K),
      PA('M92 -6 L104 -12 M94 10 L108 10 M92 26 L104 32', 'none', K)
    ),

    // 23. Magnifier focusing one yellow dot, blurry grey dots around
    magnifier_focus: () => g(
      CI(-70, -40, 7, C.grey, NS),
      CI(-46, -72, 6, C.grey, NS),
      CI(-16, -82, 7, C.grey, NS),
      CI(-84, -6, 6, C.grey, NS),
      CI(-70, 26, 8, C.grey, NS),
      CI(-44, 56, 6, C.grey, NS),
      CI(60, -76, 6, C.grey, NS),
      CI(90, -34, 6, C.grey, NS),
      OL('M52 26 L86 60', C.brown, 14),
      CI(20, -6, 46, C.lgrey),
      CI(20, -6, 14, C.yellow),
      PA('M-2 -30 Q2 -38 10 -40', 'none', SW(6, '#ffffff'))
    ),

    // 24. Battery with one red bar left, bolt, and sweat drop
    battery_low: () => g(
      `<g transform="translate(-14 30)">`,
      R(-80, -36, 150, 72, C.white, 10),
      R(70, -16, 12, 32, C.navy, 3),
      R(-68, -26, 30, 52, C.red, 4),
      R(-30, -26, 28, 52, C.lgrey, 4, S2),
      R(2, -26, 28, 52, C.lgrey, 4, S2),
      R(34, -26, 28, 52, C.lgrey, 4, S2),
      PO([[10, -100], [-10, -64], [2, -64], [-6, -34], [18, -70], [4, -70], [18, -100]], C.yellow),
      PA('M98 -40 Q88 -18 98 -10 Q108 -18 98 -40 Z', C.blue),
      `</g>`
    ),

    // 25. Raised open hand in a red octagon with NO
    stop_hand: () => {
      const oct = [];
      for (let k = 0; k < 8; k++) {
        const t = (22.5 + 45 * k) * Math.PI / 180;
        oct.push([84 * Math.cos(t), 84 * Math.sin(t)]);
      }
      return g(
        PO(oct, C.red),
        R(-26, -44, 12, 40, '#ffffff', 6),
        R(-12, -52, 12, 48, '#ffffff', 6),
        R(2, -50, 12, 46, '#ffffff', 6),
        R(16, -40, 12, 36, '#ffffff', 6),
        R(-28, -12, 54, 40, '#ffffff', 14),
        R(-42, -10, 20, 26, '#ffffff', 9),
        TX(0, 62, 'NO', 34, '#ffffff')
      );
    },

    // 26. Two hands shaking, blue and orange sleeves, sparkles
    handshake: () => g(
      R(-102, -34, 44, 56, C.blue, 8),
      R(58, -34, 44, 56, C.orange, 8),
      PA('M-62 -10 Q-40 -34 -10 -14 L8 2 Q-8 22 -34 14 Q-54 10 -62 -10 Z', C.skin),
      PA('M62 -10 Q40 -34 10 -14 L-8 2 Q8 22 34 14 Q54 10 62 -10 Z', C.skin),
      PA('M-18 4 L-4 16 M-4 -6 L12 6 M6 6 L20 14', 'none', SW(4, '#111')),
      ST(-70, -72, 12, C.yellow),
      ST(72, -72, 12, C.yellow),
      ST(0, -84, 9, C.yellow)
    ),

    // 27. Open door with a gift, closed door with ?, and a person choosing
    two_doors: () => g(
      R(-92, -70, 70, 118, C.navy, 4),
      R(-72, 6, 30, 22, C.red, 3),
      R(-57, 6, 6, 22, C.yellow, 0, S2),
      EL(-54, 4, 7, 5, C.yellow),
      PO([[-92, -70], [-112, -58], [-112, 62], [-92, 48]], C.lbrown),
      R(20, -70, 76, 118, C.lbrown, 4),
      R(30, -60, 56, 46, C.brown, 4, S2),
      R(30, -4, 56, 56, C.brown, 4, S2),
      TX(58, -24, '?', 40, C.red),
      CI(84, 6, 5, C.yellow, S2),
      PE(0, 30, 14, C.blue, C.brown)
    ),

    // 28. Boat sinking, stubborn rower, coins spilling
    sinking_coins: () => g(
      `<g transform="rotate(12 0 10)">`,
      PO([[-70, -4], [70, -4], [50, 30], [-50, 30]], C.brown),
      PE(-16, -38, 16, C.red, C.navy),
      OL('M6 -16 L58 22', C.lbrown, 7),
      `</g>`,
      PA('M-100 26 Q-80 14 -60 26 T-20 26 T20 26 T60 26 T100 26 L100 90 L-100 90 Z', C.blue),
      CI(60, -50, 12, C.yellow), TX(60, -44, '$', 16),
      CI(84, -22, 12, C.yellow), TX(84, -16, '$', 16),
      CI(42, -74, 12, C.yellow), TX(42, -68, '$', 16)
    ),

    // 29. Pareto: small 20% work bar, big 80% results bar, linked by an arrow
    pareto_bar: () => g(
      R(-90, 30, 60, 50, C.blue, 6),
      TX(-60, 22, '20%', 20),
      R(10, -40, 70, 120, C.green, 6),
      TX(45, -6, '80%', 24),
      TX(-60, 102, 'WORK', 16),
      TX(45, 102, 'RESULTS', 16),
      OL('M-22 4 Q0 -66 34 -60', C.orange, 8),
      PO([[46, -58], [30, -74], [26, -50]], C.orange)
    ),

    // 30. Bar chart: IDEA, TEAM, PLAN, MONEY, TIMING (gold, tallest)
    timing_bars: () => {
      const data = [['IDEA', 44, C.blue], ['TEAM', 60, C.teal], ['PLAN', 52, C.purple], ['MONEY', 36, C.green], ['TIMING', 96, C.yellow]];
      let s = PA('M-96 70 L96 70', 'none', K);
      data.forEach(([label, h, col], i) => {
        const xc = -80 + 40 * i;
        s += R(xc - 14, 70 - h, 28, h, col, 3) + TX(xc, 90, label, 11);
      });
      return s + ST(80, -44, 14, C.orange);
    },

    // 31. Two calendars: 1999 with a sad truck, arrow, 2012 with a happy truck
    early_calendar: () => {
      const cal = (cx, year, col, happy) => g(
        R(cx - 35, -62, 70, 64, C.white, 8),
        R(cx - 35, -62, 70, 20, col, 8),
        TX(cx, -46, year, 17),
        R(cx - 34, 8, 44, 26, C.orange, 4),
        R(cx + 10, 16, 22, 18, C.teal, 4),
        CI(cx - 22, 38, 7, C.navy),
        CI(cx + 20, 38, 7, C.navy),
        CI(cx + 16, 22, 2.5, '#111', NS),
        CI(cx + 26, 22, 2.5, '#111', NS),
        LN(happy
          ? `M${cx + 14} 28 Q${cx + 21} 36 ${cx + 28} 28`
          : `M${cx + 14} 34 Q${cx + 21} 26 ${cx + 28} 34`,
          'stroke="#111" stroke-width="3" stroke-linecap="round"')
      );
      return cal(-68, '1999', C.red, false) + AR(-22, -20, 22, -20) + cal(68, '2012', C.green, true);
    },

    // 32. Round compass with red needle and N E S W
    compass: () => {
      let s = CI(0, 0, 84, C.white) + CI(0, 0, 68, 'none', TH);
      for (let k = 0; k < 16; k++) {
        const t = k * 22.5 * Math.PI / 180;
        s += LN(`M${f(74 * Math.cos(t))} ${f(74 * Math.sin(t))} L${f(82 * Math.cos(t))} ${f(82 * Math.sin(t))}`,
          'stroke="#111" stroke-width="4" stroke-linecap="round"');
      }
      return s +
        PO([[0, -26], [9, 0], [-9, 0]], C.red) +
        PO([[0, 26], [9, 0], [-9, 0]], '#ffffff') +
        CI(0, 0, 6, C.yellow) +
        TX(0, -30, 'N', 24) +
        TX(42, 8, 'E', 24) +
        TX(0, 50, 'S', 24) +
        TX(-42, 8, 'W', 24);
    },

    // 33. Person planting a MINE flag on a small hill
    person_flag: () => g(
      PA('M-100 72 Q-10 -28 100 72 Z', C.green),
      PE(-14, -30, 16, C.blue, C.brown),
      OL('M10 -14 L24 -48', C.skin, 8),
      CI(24, -50, 6, C.skin),
      OL('M24 -94 L24 22', C.lbrown, 6),
      PO([[24, -94], [66, -84], [54, -72], [66, -60], [24, -60]], C.red),
      TX(45, -72, 'MINE', 12, '#ffffff')
    ),
  });
})();
