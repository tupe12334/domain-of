/* icons_bootstrap_a.js - doodle icons for "The Map of Bootstrapping" (set A).
 * Each entry returns SVG elements (no outer <svg>), centred on (0,0).
 * Box: x,y in [-90,90]; wide icons may use x in [-110,110].
 */
(function () {
  const K = 'stroke="#111" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"';
  const T = 'stroke="#111" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"';
  const SKIN = '#f1c27d', BROWN = '#8e5b3a', LBROWN = '#c8935a';
  const RED = '#e74c3c', ORANGE = '#f39c12', YELLOW = '#f7d117', GREEN = '#2ecc71';
  const TEAL = '#1abc9c', BLUE = '#3498db', NAVY = '#2c3e50', PURPLE = '#9b59b6', PINK = '#ff7eb6';
  const GREY = '#95a5a6', LGREY = '#dfe6e9', WHITE = '#ffffff', PALEBLUE = '#bfe6f7';
  const CREAM = '#fff6d5', GLOW = '#fff3a0';

  const txt = (x, y, size, s, fill = '#111') =>
    `<text x="${x}" y="${y}" font-family="Hand" font-size="${size}" fill="${fill}" text-anchor="middle">${s}</text>`;

  // Text with a dark outline, for coloured symbols such as $ or ?.
  const txtO = (x, y, size, s, fill) =>
    `<text x="${x}" y="${y}" font-family="Hand" font-size="${size}" fill="${fill}" stroke="#111" stroke-width="2.5" paint-order="stroke" text-anchor="middle">${s}</text>`;

  const poly = (points, fill, extra = K) =>
    `<polygon points="${points.map((p) => p.join(',')).join(' ')}" fill="${fill}" ${extra}/>`;

  const star = (cx, cy, R, r, fill) => {
    const pts = [];
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      const rad = i % 2 ? r : R;
      pts.push([+(cx + rad * Math.cos(a)).toFixed(1), +(cy + rad * Math.sin(a)).toFixed(1)]);
    }
    return poly(pts, fill);
  };

  // Round head with dot eyes, small smile and optional hair cap.
  const head = (cx, cy, r, hair) => `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${SKIN}" ${K}/>
    ${hair ? `<path d="M${cx - r} ${cy} A${r} ${r} 0 0 1 ${cx + r} ${cy} Q${cx} ${cy - r * 0.45} ${cx - r} ${cy} Z" fill="${hair}" ${K}/>` : ''}
    <circle cx="${cx - r * 0.35}" cy="${cy + r * 0.05}" r="${r * 0.11}" fill="#111"/>
    <circle cx="${cx + r * 0.35}" cy="${cy + r * 0.05}" r="${r * 0.11}" fill="#111"/>
    <path d="M${cx - r * 0.35} ${cy + r * 0.4} Q${cx} ${cy + r * 0.75} ${cx + r * 0.35} ${cy + r * 0.4}" fill="none" ${T}/>`;

  // A thick limb drawn as a black-outlined capsule.
  const limb = (x1, y1, x2, y2, c, w) =>
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#111" stroke-width="${w + 6}" stroke-linecap="round"/>` +
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;

  const heart = (cx, cy, s, fill) =>
    `<path d="M${cx} ${cy + s * 0.9} C${cx - s * 1.3} ${cy + s * 0.1} ${cx - s * 0.9} ${cy - s * 0.9} ${cx} ${cy - s * 0.35} C${cx + s * 0.9} ${cy - s * 0.9} ${cx + s * 1.3} ${cy + s * 0.1} ${cx} ${cy + s * 0.9} Z" fill="${fill}" ${K}/>`;

  const flame = (x, y, s, fill) =>
    `<path d="M${x} ${y - s} C${x + s * 0.7} ${y - s * 0.35} ${x + s * 0.55} ${y + s * 0.35} ${x} ${y + s * 0.5} C${x - s * 0.55} ${y + s * 0.35} ${x - s * 0.7} ${y - s * 0.35} ${x} ${y - s} Z" fill="${fill}" ${K}/>`;

  // Striped awning with scalloped bottom edge.
  const awning = (x0, y0, w, n, h, c1, c2) => {
    let s = '';
    for (let i = 0; i < n; i++) {
      const x = x0 + i * w;
      const yb = y0 + h;
      s += `<path d="M${x} ${y0} H${x + w} V${yb} A${w / 2} ${w / 2} 0 0 1 ${x} ${yb} Z" fill="${i % 2 ? c2 : c1}" ${K}/>`;
    }
    return s;
  };

  const ICONS = {

    // 1. Smiling person at a desk, laptop, mug.
    person_laptop: () => `
      ${head(-44, -40, 22, BROWN)}
      <rect x="-66" y="-14" width="44" height="44" rx="14" fill="${BLUE}" ${K}/>
      ${limb(-34, 2, -8, 24, BLUE, 12)}
      <circle cx="-6" cy="26" r="8" fill="${SKIN}" ${K}/>
      <rect x="2" y="-20" width="58" height="46" rx="5" fill="${PALEBLUE}" ${K}/>
      <path d="M10 -8 H46 M10 2 H38 M10 12 H50" fill="none" ${T}/>
      <rect x="-6" y="26" width="70" height="8" rx="3" fill="${GREY}" ${K}/>
      <rect x="-84" y="28" width="168" height="12" rx="6" fill="${LBROWN}" ${K}/>
      <rect x="-74" y="40" width="10" height="46" fill="${BROWN}" ${K}/>
      <rect x="64" y="40" width="10" height="46" fill="${BROWN}" ${K}/>
      <rect x="68" y="6" width="20" height="22" rx="4" fill="${TEAL}" ${K}/>
      <path d="M88 12 Q98 12 88 22" fill="none" ${K}/>`,

    // 2. Huge cheque, tiny investor holding it.
    big_cheque: () => `
      <rect x="-108" y="-50" width="132" height="86" rx="4" fill="${CREAM}" ${K}/>
      <circle cx="-94" cy="-38" r="6" fill="${YELLOW}" ${K}/>
      ${txt(-42, -16, 19, '$2,000,000')}
      ${txt(-42, 8, 13, 'PAY TO: STARTUP')}
      <line x1="-96" y1="24" x2="8" y2="24" ${T}/>
      <rect x="54" y="56" width="16" height="24" fill="${NAVY}" ${K}/>
      <rect x="78" y="56" width="16" height="24" fill="${NAVY}" ${K}/>
      <ellipse cx="60" cy="81" rx="12" ry="6" fill="#111"/>
      <ellipse cx="86" cy="81" rx="12" ry="6" fill="#111"/>
      <rect x="48" y="-8" width="50" height="66" rx="12" fill="${NAVY}" ${K}/>
      ${poly([[62, -8], [80, -8], [71, 10]], '#fff')}
      ${poly([[67, -4], [75, -4], [79, 22], [71, 30], [63, 22]], RED)}
      <rect x="66" y="-18" width="12" height="12" fill="${SKIN}" ${K}/>
      ${head(72, -34, 19, BROWN)}
      ${limb(54, 6, 34, 4, NAVY, 14)}
      <circle cx="28" cy="4" r="8" fill="${SKIN}" ${K}/>
      ${limb(90, 4, 88, 42, NAVY, 14)}
      <circle cx="88" cy="46" r="7" fill="${SKIN}" ${K}/>`,

    // 3. Money bag with a prohibition sign over it.
    no_money_bag: () => `
      <path d="M-48 -8 Q-62 58 -6 62 Q50 62 38 -8 Q20 -26 -6 -24 Q-34 -26 -48 -8 Z" fill="${CREAM}" ${K}/>
      <rect x="-18" y="-42" width="26" height="18" rx="4" fill="${BROWN}" ${K}/>
      ${txtO(-6, 44, 52, '$', GREEN)}
      <circle cx="0" cy="10" r="68" fill="none" stroke="${RED}" stroke-width="14"/>
      <line x1="-50" y1="-40" x2="50" y2="60" stroke="${RED}" stroke-width="14" stroke-linecap="round"/>`,

    // 4. Garage with a half-open roll-up door and a glowing idea bulb.
    garage: () => `
      <polygon points="-92,-14 0,-70 92,-14" fill="${RED}" ${K}/>
      <rect x="-76" y="-14" width="152" height="96" fill="${LGREY}" ${K}/>
      <rect x="-68" y="2" width="22" height="22" rx="3" fill="${PALEBLUE}" ${K}/>
      <rect x="-50" y="-4" width="100" height="84" fill="${GREY}" ${K}/>
      <rect x="-42" y="-4" width="84" height="26" fill="${NAVY}" ${K}/>
      <circle cx="0" cy="6" r="18" fill="${GLOW}"/>
      <circle cx="0" cy="6" r="9" fill="${YELLOW}" ${K}/>
      <rect x="-4" y="14" width="8" height="7" fill="${GREY}" ${K}/>
      <path d="M-46 22 H46 M-46 34 H46 M-46 46 H46 M-46 58 H46 M-46 70 H46" fill="none" ${T}/>`,

    // 5. Charming boot with a pull loop, a hand pulling it up.
    boot_strap: () => `
      <path d="M-74 -54 V-76 M-80 -70 L-74 -78 L-68 -70" fill="none" ${T}/>
      <path d="M-86 -44 V-64 M-92 -58 L-86 -66 L-80 -58" fill="none" ${T}/>
      <path d="M-44 -40 V-62 Q-44 -78 -30 -78 Q-16 -78 -16 -62 V-40" fill="none" stroke="#111" stroke-width="18" stroke-linecap="round"/>
      <path d="M-44 -40 V-62 Q-44 -78 -30 -78 Q-16 -78 -16 -62 V-40" fill="none" stroke="${LBROWN}" stroke-width="8" stroke-linecap="round"/>
      <path d="M-50 -40 H-6 V0 Q20 10 46 22 Q66 30 66 48 Q66 62 50 62 H-50 Z" fill="${BROWN}" ${K}/>
      <rect x="-50" y="34" width="26" height="28" rx="4" fill="${BROWN}" ${K}/>
      <path d="M8 4 L18 -2 M18 12 L28 6 M28 20 L38 14" fill="none" ${T}/>
      <rect x="-52" y="54" width="122" height="14" rx="5" fill="${NAVY}" ${K}/>
      ${limb(84, -54, 40, -70, BLUE, 16)}
      ${limb(40, -70, -30, -82, SKIN, 12)}
      <circle cx="-32" cy="-82" r="13" fill="${SKIN}" ${K}/>
      <path d="M-40 -86 L-44 -94 M-32 -92 V-96 M-24 -88 L-20 -96" fill="none" ${T}/>`,

    // 6. Pink piggy bank with a coin dropping into the slot.
    piggy_bank: () => `
      <path d="M-62 2 q-16 -4 -10 -16 q6 -8 14 -2" fill="none" ${K}/>
      <rect x="-44" y="34" width="18" height="28" rx="5" fill="${PINK}" ${K}/>
      <rect x="18" y="34" width="18" height="28" rx="5" fill="${PINK}" ${K}/>
      <ellipse cx="0" cy="6" rx="66" ry="44" fill="${PINK}" ${K}/>
      <polygon points="-34,-30 -26,-54 -12,-34" fill="${PINK}" ${K}/>
      <rect x="56" y="-4" width="18" height="24" rx="6" fill="${PINK}" ${K}/>
      <circle cx="66" cy="4" r="2.5" fill="#111"/>
      <circle cx="66" cy="12" r="2.5" fill="#111"/>
      <rect x="-14" y="-41" width="34" height="8" rx="3" fill="#111"/>
      <circle cx="-30" cy="-2" r="5" fill="#111"/>
      <path d="M-4 22 Q6 30 18 20" fill="none" ${T}/>
      <circle cx="4" cy="-66" r="15" fill="${YELLOW}" ${K}/>
      ${txt(4, -58, 20, '$')}`,

    // 7. Blue card with chip and digits, tilted, with debt flame and sweat drop.
    credit_card: () => `
      <g transform="rotate(-8)">
        <rect x="-84" y="-52" width="168" height="110" rx="12" fill="${BLUE}" ${K}/>
        <rect x="-84" y="-30" width="168" height="22" fill="${NAVY}" ${K}/>
        <rect x="-62" y="6" width="28" height="22" rx="4" fill="${YELLOW}" ${K}/>
        <path d="M-62 17 H-34 M-48 6 V28" fill="none" ${T}/>
        ${txt(30, 46, 24, '1234', '#fff')}
        ${flame(74, -70, 17, ORANGE)}
        ${flame(74, -62, 8, YELLOW)}
      </g>
      <path d="M-74 -88 C-66 -76 -62 -70 -62 -64 C-62 -56 -68 -52 -74 -52 C-80 -52 -86 -56 -86 -64 C-86 -70 -82 -76 -74 -88 Z" fill="${BLUE}" ${K}/>`,

    // 8. Small plane on a shrinking runway above a cliff.
    runway_plane: () => `
      ${txt(-6, -66, 22, 'CASH ÷ BURN')}
      <rect x="-90" y="28" width="130" height="22" fill="${GREY}" ${K}/>
      <line x1="-80" y1="39" x2="28" y2="39" stroke="#fff" stroke-width="4" stroke-dasharray="10 8"/>
      <rect x="-90" y="50" width="130" height="36" fill="${LBROWN}" ${K}/>
      <path d="M40 50 L34 60 L42 70 L36 86" fill="none" ${K}/>
      <path d="M-6 -34 H14 L-6 -54 H-20 Z" fill="#fff" ${K}/>
      <path d="M-40 -30 L-54 -56 H-40 L-24 -32 Z" fill="#fff" ${K}/>
      <rect x="-44" y="-34" width="88" height="40" rx="16" fill="${BLUE}" ${K}/>
      <rect x="6" y="-28" width="26" height="14" rx="5" fill="${PALEBLUE}" ${K}/>
      <rect x="-28" y="-26" width="16" height="10" rx="3" fill="${PALEBLUE}" ${K}/>
      <line x1="-8" y1="6" x2="-8" y2="12" ${K}/>
      <line x1="28" y1="6" x2="28" y2="12" ${K}/>
      <ellipse cx="46" cy="-14" rx="5" ry="28" fill="${NAVY}" ${K}/>
      <circle cx="46" cy="-14" r="7" fill="${GREY}" ${K}/>
      <circle cx="-8" cy="20" r="8" fill="#111"/>
      <circle cx="28" cy="20" r="8" fill="#111"/>`,

    // 9. Green banknote on fire, with a red extinguisher next to it.
    burning_money: () => `
      <rect x="-90" y="-30" width="120" height="70" rx="6" fill="${GREEN}" ${K}/>
      <circle cx="-30" cy="5" r="20" fill="#fff" ${K}/>
      ${txt(-30, 15, 30, '$')}
      <circle cx="-76" cy="-18" r="4" fill="#fff" ${K}/>
      <circle cx="14" cy="26" r="4" fill="#fff" ${K}/>
      ${flame(16, -44, 22, ORANGE)}
      ${flame(16, -36, 11, YELLOW)}
      <rect x="48" y="-10" width="34" height="86" rx="12" fill="${RED}" ${K}/>
      <rect x="54" y="-22" width="22" height="14" rx="3" fill="${GREY}" ${K}/>
      <path d="M54 -22 Q46 -30 40 -26" fill="none" ${K}/>
      <rect x="48" y="20" width="34" height="10" fill="#fff" ${K}/>`,

    // 10. Open laptop with a crescent moon and stars.
    moon_laptop: () => `
      <path d="M4 -96 A26 26 0 1 0 4 -48 A20 20 0 1 1 4 -96 Z" fill="${YELLOW}" ${K}/>
      ${star(-60, -40, 11, 5, YELLOW)}
      ${star(66, -54, 12, 5, YELLOW)}
      ${star(50, -8, 7, 3, YELLOW)}
      <rect x="-56" y="-20" width="112" height="72" rx="8" fill="${NAVY}" ${K}/>
      <rect x="-46" y="-10" width="92" height="52" rx="4" fill="${PALEBLUE}" ${K}/>
      <path d="M-34 4 H-6 M-34 16 H10 M-34 28 H-14" fill="none" stroke="${NAVY}" stroke-width="4" stroke-linecap="round"/>
      <polygon points="-74,52 74,52 84,66 -84,66" fill="${LGREY}" ${K}/>`,

    // 11. Red toolbox with hammer and wrench sticking out.
    toolbox: () => `
      <path d="M-30 -10 V-34 Q-30 -46 -18 -46 H18 Q30 -46 30 -34 V-10" fill="none" stroke="#111" stroke-width="18" stroke-linecap="round"/>
      <path d="M-30 -10 V-34 Q-30 -46 -18 -46 H18 Q30 -46 30 -34 V-10" fill="none" stroke="${RED}" stroke-width="8" stroke-linecap="round"/>
      <line x1="-42" y1="-12" x2="-62" y2="-62" stroke="#111" stroke-width="13" stroke-linecap="round"/>
      <line x1="-42" y1="-12" x2="-62" y2="-62" stroke="${LBROWN}" stroke-width="6" stroke-linecap="round"/>
      <rect x="-84" y="-82" width="44" height="16" rx="4" fill="${GREY}" ${K}/>
      <line x1="34" y1="-12" x2="60" y2="-58" stroke="#111" stroke-width="13" stroke-linecap="round"/>
      <line x1="34" y1="-12" x2="60" y2="-58" stroke="${GREY}" stroke-width="7" stroke-linecap="round"/>
      <circle cx="64" cy="-66" r="14" fill="${GREY}" ${K}/>
      <circle cx="64" cy="-66" r="6" fill="${CREAM}" ${K}/>
      <rect x="-80" y="-10" width="160" height="80" rx="10" fill="${RED}" ${K}/>
      <line x1="-80" y1="14" x2="80" y2="14" ${T}/>
      <rect x="-22" y="6" width="16" height="12" rx="3" fill="${GREY}" ${K}/>
      <rect x="6" y="6" width="16" height="12" rx="3" fill="${GREY}" ${K}/>`,

    // 12. Four people hold up coins; arrows point to a PRODUCT box.
    crowdfund: () => {
      const person = (x, c) => `
        ${limb(x + 12, -8, x + 18, -46, c, 9)}
        <circle cx="${x + 18}" cy="-56" r="10" fill="${YELLOW}" ${K}/>
        <circle cx="${x + 18}" cy="-56" r="4" fill="none" stroke="${ORANGE}" stroke-width="2.5"/>
        <rect x="${x - 15}" y="-22" width="30" height="40" rx="10" fill="${c}" ${K}/>
        ${head(x, -36, 12, null)}
        ${poly([[x - 6, 24], [x + 6, 24], [x, 40]], '#111', '')}
        <line x1="${x}" y1="22" x2="${x}" y2="38" stroke="#111" stroke-width="5" stroke-linecap="round"/>`;
      return [-66, -22, 22, 66].map((x, i) => person(x, [RED, GREEN, BLUE, PURPLE][i])).join('') + `
        <rect x="-82" y="46" width="164" height="42" rx="6" fill="${LBROWN}" ${K}/>
        ${txt(0, 74, 18, 'PRODUCT')}`;
    },

    // 13. Gold medal with a star and a GRANT banner.
    medal: () => `
      <polygon points="-42,-90 -14,-90 4,-36 -20,-36" fill="${RED}" ${K}/>
      <polygon points="14,-90 42,-90 20,-36 -4,-36" fill="${BLUE}" ${K}/>
      <circle cx="0" cy="8" r="52" fill="${YELLOW}" ${K}/>
      <circle cx="0" cy="8" r="40" fill="none" stroke="${ORANGE}" stroke-width="5"/>
      ${star(0, 8, 28, 12, ORANGE)}
      <rect x="-58" y="62" width="116" height="26" rx="5" fill="${RED}" ${K}/>
      ${txt(0, 81, 20, 'GRANT', '#fff')}`,

    // 14. Ramen bowl with chopsticks, egg half and a $ on the bowl.
    ramen_bowl: () => `
      <path d="M-40 -58 Q-44 -70 -36 -78 M-6 -62 Q-10 -74 -2 -82 M28 -58 Q24 -70 32 -78" fill="none" ${T}/>
      <line x1="-16" y1="-98" x2="22" y2="-30" stroke="#111" stroke-width="10" stroke-linecap="round"/>
      <line x1="-16" y1="-98" x2="22" y2="-30" stroke="${BROWN}" stroke-width="4" stroke-linecap="round"/>
      <line x1="-4" y1="-98" x2="30" y2="-30" stroke="#111" stroke-width="10" stroke-linecap="round"/>
      <line x1="-4" y1="-98" x2="30" y2="-30" stroke="${BROWN}" stroke-width="4" stroke-linecap="round"/>
      <path d="M-70 -16 Q-56 -30 -42 -16 T-14 -16 T14 -16 T42 -16 T70 -16" fill="none" stroke="#111" stroke-width="11" stroke-linecap="round"/>
      <path d="M-70 -16 Q-56 -30 -42 -16 T-14 -16 T14 -16 T42 -16 T70 -16" fill="none" stroke="${YELLOW}" stroke-width="5" stroke-linecap="round"/>
      <ellipse cx="0" cy="-12" rx="80" ry="13" fill="${ORANGE}" ${K}/>
      <path d="M16 -22 A18 18 0 0 1 52 -22 Z" fill="#fff" ${K}/>
      <circle cx="34" cy="-22" r="7" fill="${ORANGE}" ${K}/>
      <path d="M-80 -6 H80 Q80 60 40 70 H-40 Q-80 60 -80 -6 Z" fill="${RED}" ${K}/>
      <rect x="-80" y="14" width="160" height="12" fill="#fff" ${K}/>
      ${txtO(0, 60, 30, '$', YELLOW)}`,

    // 15. Red heart with an ECG line and ALIVE.
    heartbeat: () => `
      ${heart(0, -10, 54, RED)}
      <path d="M-88 -4 H-42 L-32 -26 L-20 18 L-8 -40 L4 12 L14 -4 H88" fill="none" stroke="${NAVY}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>
      <path d="M-88 -4 H-42 L-32 -26 L-20 18 L-8 -40 L4 12 L14 -4 H88" fill="none" stroke="#111" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round" transform="translate(0,0)"/>
      ${txt(0, 84, 24, 'ALIVE')}`,

    // 16. Full yellow pie chart with 100% and a crown.
    pie_100: () => `
      <circle cx="0" cy="8" r="60" fill="${YELLOW}" ${K}/>
      ${txt(0, 20, 30, '100%')}
      <polygon points="-30,-38 -34,-64 -16,-50 0,-74 16,-50 34,-64 30,-38" fill="${ORANGE}" ${K}/>`,

    // 17. Cheerful snail carrying a small flag.
    snail: () => `
      <line x1="-92" y1="-2" x2="-74" y2="-2" ${T}/>
      <line x1="-92" y1="16" x2="-74" y2="16" ${T}/>
      <line x1="-86" y1="34" x2="-72" y2="34" ${T}/>
      <path d="M-60 26 Q-60 6 -40 8 L40 6 Q64 6 64 26 Q64 40 46 40 H-52 Q-60 40 -60 26 Z" fill="${YELLOW}" ${K}/>
      <line x1="48" y1="8" x2="56" y2="-22" stroke="#111" stroke-width="10" stroke-linecap="round"/>
      <line x1="48" y1="8" x2="56" y2="-22" stroke="${YELLOW}" stroke-width="4" stroke-linecap="round"/>
      <line x1="58" y1="8" x2="72" y2="-20" stroke="#111" stroke-width="10" stroke-linecap="round"/>
      <line x1="58" y1="8" x2="72" y2="-20" stroke="${YELLOW}" stroke-width="4" stroke-linecap="round"/>
      <circle cx="56" cy="-24" r="9" fill="#fff" ${K}/>
      <circle cx="56" cy="-24" r="4" fill="#111"/>
      <circle cx="72" cy="-22" r="9" fill="#fff" ${K}/>
      <circle cx="72" cy="-22" r="4" fill="#111"/>
      <path d="M50 22 Q56 28 62 22" fill="none" ${T}/>
      <circle cx="-20" cy="-14" r="38" fill="${ORANGE}" ${K}/>
      <path d="M-20 -14 a6 6 0 1 1 6 6 a14 14 0 1 0 -14 -14 a22 22 0 0 1 22 22" fill="none" ${T}/>
      <line x1="-20" y1="-52" x2="-20" y2="-88" ${K}/>
      <polygon points="-20,-88 16,-80 -20,-70" fill="${RED}" ${K}/>`,

    // 18. Person bent under a heavy RISK boulder.
    backpack_weight: () => `
      <circle cx="34" cy="22" r="50" fill="${GREY}" ${K}/>
      ${txt(34, 28, 20, 'RISK')}
      ${limb(-40, -34, -20, 18, BLUE, 26)}
      ${limb(-30, -18, -10, -4, BLUE, 12)}
      <circle cx="-8" cy="-4" r="8" fill="${SKIN}" ${K}/>
      ${limb(-20, 16, -36, 72, NAVY, 14)}
      ${limb(-20, 16, -6, 72, NAVY, 14)}
      <ellipse cx="-40" cy="74" rx="11" ry="6" fill="#111"/>
      <ellipse cx="-2" cy="74" rx="11" ry="6" fill="#111"/>
      ${head(-44, -56, 20, BROWN)}
      <line x1="-90" y1="76" x2="90" y2="76" ${T}/>`,

    // 19. Empty shop: faded awning, OPEN sign, tumbleweed and one cobweb.
    empty_shop: () => `
      <rect x="-66" y="-10" width="116" height="80" rx="3" fill="${LBROWN}" ${K}/>
      ${awning(-68, -42, 17, 7, 20, GREY, LGREY)}
      <rect x="-50" y="-84" width="80" height="26" rx="4" fill="#fff" ${K}/>
      ${txt(-10, -65, 18, 'OPEN')}
      <rect x="-56" y="4" width="40" height="34" rx="3" fill="${PALEBLUE}" ${K}/>
      <rect x="-6" y="4" width="28" height="66" rx="3" fill="${BROWN}" ${K}/>
      <circle cx="16" cy="38" r="2.5" fill="${YELLOW}"/>
      <path d="M-66 -22 L-50 -10 M-66 -22 L-56 -6 M-66 -22 L-66 -4" fill="none" ${T}/>
      <line x1="-90" y1="70" x2="90" y2="70" ${T}/>
      <circle cx="72" cy="56" r="16" fill="${LBROWN}" ${K}/>
      <path d="M62 52 Q72 42 80 52 Q88 66 72 66 Q62 66 66 56 M64 60 L80 42" fill="none" ${T}/>`,

    // 20. Person stepping out of a door toward three small people with ? bubbles.
    door_out: () => `
      <rect x="-90" y="-86" width="70" height="154" fill="${NAVY}" ${K}/>
      <polygon points="-20,-86 -6,-80 -6,68 -20,62" fill="${BROWN}" ${K}/>
      <circle cx="-24" cy="-6" r="3" fill="${YELLOW}" ${K}/>
      <line x1="-90" y1="68" x2="90" y2="68" ${T}/>
      ${head(-40, -40, 17, BROWN)}
      <rect x="-54" y="-20" width="28" height="40" rx="9" fill="${RED}" ${K}/>
      ${limb(-46, 18, -56, 60, NAVY, 12)}
      ${limb(-36, 18, -22, 58, NAVY, 12)}
      ${limb(-26, -14, 4, -30, RED, 10)}
      <circle cx="6" cy="-32" r="6" fill="${SKIN}" ${K}/>
      ${[[24, 4, GREEN], [54, -2, BLUE], [80, 4, PURPLE]].map(([x, y, c]) => `
        <rect x="${x - 10}" y="${y + 10}" width="20" height="30" rx="7" fill="${c}" ${K}/>
        <circle cx="${x}" cy="${y + 2}" r="10" fill="${SKIN}" ${K}/>
        <circle cx="${x}" cy="${y - 22}" r="12" fill="#fff" ${K}/>
        ${txt(x, y - 16, 17, '?')}`).join('')}`,

    // 21. Smiling curly-haired mum, I LOVE IT! and a red question mark.
    mom_love_it: () => `
      <g transform="translate(8,0)">
        <circle cx="-36" cy="-38" r="14" fill="${BROWN}" ${K}/>
        <circle cx="-10" cy="-48" r="16" fill="${BROWN}" ${K}/>
        <circle cx="16" cy="-40" r="14" fill="${BROWN}" ${K}/>
        <circle cx="-50" cy="-14" r="12" fill="${BROWN}" ${K}/>
        <circle cx="28" cy="-12" r="11" fill="${BROWN}" ${K}/>
        <rect x="-36" y="26" width="52" height="56" rx="16" fill="${PINK}" ${K}/>
        ${limb(-30, 40, -54, 64, PINK, 12)}
        ${limb(10, 40, 26, 60, PINK, 12)}
        ${head(-10, -6, 30, null)}
      </g>
      ${txtO(-82, 6, 72, '?', RED)}
      <path d="M32 -52 L16 -30 L44 -48 Z" fill="#fff" ${K}/>
      <rect x="34" y="-92" width="66" height="38" rx="14" fill="#fff" ${K}/>
      ${txt(67, -67, 14, 'I LOVE IT!')}`,

    // 22. Browser window with a SIGN UP button, smoke rising behind it.
    smoke_test: () => `
      <circle cx="-40" cy="-66" r="14" fill="${LGREY}" ${K}/>
      <circle cx="-8" cy="-78" r="16" fill="${LGREY}" ${K}/>
      <circle cx="26" cy="-66" r="13" fill="${LGREY}" ${K}/>
      <rect x="-88" y="-40" width="176" height="124" rx="10" fill="#fff" ${K}/>
      <rect x="-88" y="-40" width="176" height="24" rx="10" fill="${LGREY}" ${K}/>
      <circle cx="-76" cy="-28" r="5" fill="${RED}"/>
      <circle cx="-62" cy="-28" r="5" fill="${YELLOW}"/>
      <circle cx="-48" cy="-28" r="5" fill="${GREEN}"/>
      <rect x="-48" y="2" width="96" height="40" rx="10" fill="${GREEN}" ${K}/>
      ${txt(0, 28, 20, 'SIGN UP')}
      <path d="M-70 60 H40 M-70 74 H10" fill="none" ${T}/>`,

    // 23. Silver concierge bell pressed by a white glove on a counter.
    concierge_bell: () => `
      <path d="M-84 -48 L-70 -60 M-86 -26 L-70 -28 M-68 -72 L-60 -80" fill="none" ${T}/>
      <rect x="-90" y="36" width="180" height="40" rx="6" fill="${LBROWN}" ${K}/>
      <path d="M-50 30 Q-50 -20 0 -20 Q50 -20 50 30 Z" fill="${LGREY}" ${K}/>
      <rect x="-62" y="24" width="124" height="12" rx="6" fill="${GREY}" ${K}/>
      <circle cx="0" cy="-26" r="8" fill="${GREY}" ${K}/>
      ${limb(86, -84, 40, -62, NAVY, 20)}
      <rect x="-8" y="-52" width="14" height="30" rx="6" fill="${SKIN}" ${K}/>
      <rect x="-4" y="-62" width="44" height="30" rx="14" fill="${SKIN}" ${K}/>
      <path d="M12 -52 V-40 M22 -54 V-40 M32 -52 V-40" fill="none" ${T}/>
      <ellipse cx="38" cy="-48" rx="7" ry="12" fill="${SKIN}" ${K} transform="rotate(30 38 -48)"/>`,

    // 24. Green curtain half open, a robot front, a person pulling levers.
    wizard_curtain: () => `
      <circle cx="-8" cy="-34" r="70" fill="${GLOW}"/>
      <line x1="0" y1="-72" x2="0" y2="-86" ${K}/>
      <circle cx="0" cy="-88" r="6" fill="${RED}" ${K}/>
      <rect x="-32" y="-70" width="64" height="46" rx="10" fill="${GREY}" ${K}/>
      <circle cx="-14" cy="-48" r="9" fill="${YELLOW}" ${K}/>
      <circle cx="14" cy="-48" r="9" fill="${YELLOW}" ${K}/>
      <rect x="-38" y="-20" width="76" height="66" rx="12" fill="${LGREY}" ${K}/>
      <rect x="-26" y="-10" width="52" height="16" rx="4" fill="${PALEBLUE}" ${K}/>
      <line x1="-14" y1="24" x2="-14" y2="6" ${K}/>
      <circle cx="-14" cy="4" r="6" fill="${RED}" ${K}/>
      <line x1="8" y1="26" x2="8" y2="8" ${K}/>
      <circle cx="8" cy="6" r="6" fill="${GREEN}" ${K}/>
      <circle cx="46" cy="-14" r="16" fill="${SKIN}" ${K}/>
      <path d="M31 -14 A16 16 0 0 1 61 -14 Q46 -22 31 -14 Z" fill="${BROWN}" ${K}/>
      <rect x="33" y="8" width="26" height="44" rx="9" fill="${PURPLE}" ${K}/>
      ${limb(40, 18, 18, 8, PURPLE, 10)}
      <path d="M-90 -90 H-54 Q-44 0 -60 88 H-90 Z" fill="${GREEN}" ${K}/>
      <path d="M90 -90 H66 Q56 0 74 88 H90 Z" fill="${GREEN}" ${K}/>
      <rect x="-94" y="-96" width="188" height="16" rx="6" fill="${GREEN}" ${K}/>
      <line x1="-90" y1="88" x2="90" y2="88" ${T}/>`,

    // 25. Balance scales: heavy coins + EVIDENCE @ card vs light OPINION bubble.
    evidence_scale: () => `
      <rect x="-6" y="-32" width="12" height="106" rx="4" fill="${GREY}" ${K}/>
      <rect x="-28" y="76" width="56" height="12" rx="5" fill="${GREY}" ${K}/>
      <line x1="-70" y1="-16" x2="-100" y2="20" ${T}/>
      <line x1="-70" y1="-16" x2="-40" y2="20" ${T}/>
      <line x1="70" y1="-48" x2="40" y2="-12" ${T}/>
      <line x1="70" y1="-48" x2="100" y2="-12" ${T}/>
      <line x1="-70" y1="-16" x2="70" y2="-48" stroke="#111" stroke-width="13" stroke-linecap="round"/>
      <line x1="-70" y1="-16" x2="70" y2="-48" stroke="${GREY}" stroke-width="7" stroke-linecap="round"/>
      <circle cx="0" cy="-32" r="9" fill="${YELLOW}" ${K}/>
      <path d="M-102 20 H-38 Q-40 46 -70 46 Q-100 46 -102 20 Z" fill="${LGREY}" ${K}/>
      <circle cx="-88" cy="10" r="10" fill="${YELLOW}" ${K}/>
      <circle cx="-72" cy="10" r="10" fill="${YELLOW}" ${K}/>
      <circle cx="-56" cy="10" r="10" fill="${YELLOW}" ${K}/>
      <rect x="-100" y="-50" width="56" height="26" rx="5" fill="#fff" ${K}/>
      ${txt(-72, -31, 22, '@')}
      <path d="M38 -12 H102 Q100 12 70 12 Q40 12 38 -12 Z" fill="${LGREY}" ${K}/>
      ${txt(-66, 70, 22, 'EVIDENCE')}
      ${txt(70, 42, 22, 'OPINION')}`,
  };

  Object.assign((window.ICONS = window.ICONS || {}), ICONS);
})();
