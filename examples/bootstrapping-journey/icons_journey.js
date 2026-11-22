/* icons_journey.js - doodle icons for "The Bootstrapping Journey" (set J).
 * Each entry returns SVG elements (no outer <svg>), centred on (0,0).
 * Box: x,y in [-90,90].
 */
(function () {
  const K = 'stroke="#111" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"';
  const T = 'stroke="#111" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"';
  const SKIN = '#f1c27d', BROWN = '#8e5b3a', LBROWN = '#c8935a';
  const RED = '#e74c3c', ORANGE = '#f39c12', YELLOW = '#f7d117', GREEN = '#2ecc71';
  const TEAL = '#1abc9c', BLUE = '#3498db', NAVY = '#2c3e50', PURPLE = '#9b59b6', PINK = '#ff7eb6';
  const GREY = '#95a5a6', LGREY = '#dfe6e9', WHITE = '#ffffff', PALEBLUE = '#bfe6f7';
  const CREAM = '#fff6d5', DGREEN = '#1e8449', MGREEN = '#27ae60', LGREEN = '#58d68d';
  const MURKY = '#7a9a6b', DPURPLE = '#8e44ad', DORANGE = '#e67e22', MOSS = '#229954';

  const txt = (x, y, size, s, fill = '#111') =>
    `<text x="${x}" y="${y}" font-family="Hand" font-size="${size}" fill="${fill}" text-anchor="middle">${s}</text>`;

  const poly = (points, fill, extra = K) =>
    `<polygon points="${points.map((p) => p.join(',')).join(' ')}" fill="${fill}" ${extra}/>`;

  // Thick limb drawn as a black-outlined capsule.
  const limb = (x1, y1, x2, y2, c, w) =>
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#111" stroke-width="${w + 6}" stroke-linecap="round"/>` +
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;

  const flame = (x, y, s, fill) =>
    `<path d="M${x} ${y - s} C${x + s * 0.7} ${y - s * 0.35} ${x + s * 0.55} ${y + s * 0.35} ${x} ${y + s * 0.5} C${x - s * 0.55} ${y + s * 0.35} ${x - s * 0.7} ${y - s * 0.35} ${x} ${y - s} Z" fill="${fill}" ${K}/>`;

  // Four-point sparkle centred on (cx,cy).
  const sparkle = (cx, cy, R, r, fill) => {
    const pts = [[0, -R], [r, -r], [R, 0], [r, r], [0, R], [-r, r], [-R, 0], [-r, -r]].map(([x, y]) => [cx + x, cy + y]);
    return poly(pts, fill);
  };

  const ICONS = {

    // 1. Grey rounded-top gravestone with carved R.I.P., grass and a crack.
    tombstone: () => `
      <path d="M-62 84 V-34 Q-62 -76 0 -76 Q62 -76 62 -34 V84 Z" fill="${GREY}" ${K}/>
      <path d="M-44 -24 Q-44 -62 0 -62 Q44 -62 44 -24" fill="none" stroke="#7f8c8d" stroke-width="4" stroke-linecap="round"/>
      ${txt(0, -4, 22, 'R.I.P.', '#4d5656')}
      <path d="M32 -50 L24 -36 L36 -26 L28 -12" fill="none" ${T}/>
      <rect x="-80" y="76" width="160" height="14" rx="6" fill="${MOSS}" ${K}/>
      ${poly([[-76, 80], [-70, 56], [-62, 80]], MGREEN)}
      ${poly([[-64, 80], [-56, 50], [-48, 80]], MGREEN)}
      ${poly([[50, 80], [58, 54], [66, 80]], MGREEN)}
      ${poly([[66, 80], [74, 60], [80, 80]], MGREEN)}`,

    // 2. Cheerful round tree with two-tone green canopy and brown trunk.
    tree: () => `
      <rect x="-12" y="20" width="24" height="64" rx="4" fill="${BROWN}" ${K}/>
      <circle cx="0" cy="-24" r="60" fill="${MGREEN}" ${K}/>
      <circle cx="-20" cy="-44" r="30" fill="${LGREEN}" ${K}/>
      <circle cx="20" cy="-2" r="16" fill="${LGREEN}" ${K}/>`,

    // 3. Dark-green triangular pine with a trunk.
    pine_tree: () => `
      <rect x="-13" y="40" width="26" height="44" rx="4" fill="${BROWN}" ${K}/>
      ${poly([[0, -88], [-36, -36], [36, -36]], DGREEN)}
      ${poly([[0, -58], [-48, 4], [48, 4]], DGREEN)}
      ${poly([[0, -20], [-60, 40], [60, 40]], DGREEN)}`,

    // 4. Skyline of tall towers, lit windows, rocket and a unicorn flag.
    city_skyline: () => {
      const bld = (x, y, w, h, c) => {
        let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}" ${K}/>`;
        let row = 0;
        for (let wy = y + 10; wy < y + h - 14; wy += 14, row++) {
          for (let wx = x + 6; wx < x + w - 8; wx += 11) {
            const lit = (row + wx) % 3 !== 0;
            s += `<rect x="${wx}" y="${wy}" width="6" height="8" fill="${lit ? YELLOW : PALEBLUE}" stroke="#111" stroke-width="2.5"/>`;
          }
        }
        return s;
      };
      return `
        ${bld(-84, 24, 32, 60, NAVY)}
        ${bld(-50, -8, 34, 92, PURPLE)}
        ${bld(-14, 8, 32, 76, BLUE)}
        ${bld(24, 30, 32, 54, DPURPLE)}
        <line x1="-92" y1="84" x2="92" y2="84" ${T}/>
        <path d="M-33 -90 Q-18 -70 -18 -46 V-24 H-48 V-46 Q-48 -70 -33 -90 Z" fill="${WHITE}" ${K}/>
        <circle cx="-33" cy="-58" r="6" fill="${BLUE}" stroke="#111" stroke-width="3"/>
        ${poly([[-48, -44], [-60, -24], [-48, -24]], RED)}
        ${poly([[-18, -44], [-6, -24], [-18, -24]], RED)}
        <path d="M-40 -24 Q-33 8 -26 -24 Z" fill="${ORANGE}" ${K}/>
        <path d="M-35 -24 Q-33 -12 -31 -24 Z" fill="${YELLOW}"/>
        <line x1="40" y1="30" x2="40" y2="-30" ${K}/>
        ${poly([[40, -40], [84, -28], [40, -16]], PINK)}
        <ellipse cx="56" cy="-26" rx="10" ry="5" fill="#111"/>
        <path d="M63 -28 Q66 -38 72 -36 L77 -34 Q80 -31 76 -29 L70 -24 Z" fill="#111"/>
        <path d="M68 -36 L71 -47 L74 -35 Z" fill="#111"/>
        <path d="M48 -23 V-14 M58 -23 V-14" stroke="#111" stroke-width="3.5" stroke-linecap="round"/>
        <path d="M46 -26 Q40 -30 42 -20" fill="none" stroke="#111" stroke-width="3.5" stroke-linecap="round"/>`;
    },

    // 5. Cosy cottage with red roof, chimney smoke, flowers, bench and a sun.
    cottage: () => `
      <circle cx="-72" cy="-74" r="12" fill="${YELLOW}" ${K}/>
      <rect x="24" y="-56" width="16" height="30" fill="${BROWN}" ${K}/>
      <circle cx="34" cy="-68" r="6" fill="${LGREY}" ${K}/>
      <circle cx="46" cy="-82" r="8" fill="${LGREY}" ${K}/>
      <rect x="-56" y="-8" width="96" height="78" fill="${CREAM}" ${K}/>
      <polygon points="-72,-6 -8,-62 56,-6" fill="${RED}" ${K}/>
      <rect x="-22" y="20" width="24" height="50" rx="4" fill="${BROWN}" ${K}/>
      <circle cx="-12" cy="46" r="3" fill="${YELLOW}"/>
      <rect x="-50" y="6" width="22" height="22" fill="${PALEBLUE}" ${K}/>
      <path d="M-39 6 V28 M-50 17 H-28" fill="none" ${T}/>
      <rect x="-90" y="70" width="180" height="20" rx="8" fill="${GREEN}" ${K}/>
      <line x1="-80" y1="70" x2="-80" y2="54" stroke="${MGREEN}" stroke-width="4"/>
      <line x1="-70" y1="70" x2="-70" y2="60" stroke="${MGREEN}" stroke-width="4"/>
      <circle cx="-80" cy="50" r="7" fill="${PINK}" ${K}/>
      <circle cx="-70" cy="58" r="6" fill="${YELLOW}" ${K}/>
      <rect x="52" y="26" width="36" height="8" rx="3" fill="${BROWN}" ${K}/>
      <rect x="54" y="34" width="32" height="8" rx="3" fill="${BROWN}" ${K}/>
      <rect x="56" y="44" width="6" height="22" fill="${BROWN}" ${K}/>
      <rect x="80" y="44" width="6" height="22" fill="${BROWN}" ${K}/>`,

    // 6. Cattail reeds, lily pad, murky water and a sad frog.
    swamp_reeds: () => `
      <path d="M-90 40 H90 V90 H-90 Z" fill="${MURKY}" ${K}/>
      <path d="M-60 66 Q-40 60 -20 66 M10 76 Q30 70 50 76 M44 58 Q60 54 76 58" fill="none" ${T}/>
      <ellipse cx="20" cy="44" rx="52" ry="18" fill="none" ${T}/>
      ${limb(-54, 84, -58, -40, MGREEN, 8)}
      ${limb(-30, 84, -36, -28, MGREEN, 8)}
      ${limb(78, 84, 80, -6, MGREEN, 8)}
      <path d="M-58 36 Q-84 18 -88 -10 Q-60 6 -58 36 Z" fill="${GREEN}" ${K}/>
      <rect x="-66" y="-74" width="16" height="36" rx="8" fill="${BROWN}" ${K}/>
      <rect x="-44" y="-64" width="16" height="36" rx="8" fill="${BROWN}" ${K}/>
      <rect x="72" y="-28" width="16" height="36" rx="8" fill="${BROWN}" ${K}/>
      <ellipse cx="20" cy="44" rx="36" ry="10" fill="${GREEN}" ${K}/>
      <ellipse cx="20" cy="26" rx="24" ry="13" fill="${MGREEN}" ${K}/>
      <circle cx="9" cy="14" r="8" fill="${WHITE}" ${K}/>
      <circle cx="31" cy="14" r="8" fill="${WHITE}" ${K}/>
      <circle cx="9" cy="16" r="3.5" fill="#111"/>
      <circle cx="31" cy="16" r="3.5" fill="#111"/>
      <path d="M2 6 L16 2 M24 2 L38 6" fill="none" ${T}/>
      <path d="M38 32 Q44 40 38 44 Q32 40 38 32 Z" fill="${TEAL}" ${K}/>
      <path d="M12 32 Q20 25 28 32" fill="none" ${T}/>`,

    // 7. Yellow diamond road sign with a black exclamation mark on a post.
    warning_sign: () => `
      <rect x="-7" y="30" width="14" height="58" fill="${GREY}" ${K}/>
      <polygon points="0,-86 62,-24 0,38 -62,-24" fill="${YELLOW}" ${K}/>
      <polygon points="0,-72 50,-24 0,24 -50,-24" fill="none" stroke="#111" stroke-width="3" stroke-linejoin="round"/>
      <rect x="-6" y="-62" width="12" height="46" rx="6" fill="#111"/>
      <circle cx="0" cy="6" r="7" fill="#111"/>`,

    // 8. Red flag on a pole, planted on a small snowy peak.
    summit_flag: () => `
      <polygon points="-80,82 -8,-30 64,82" fill="${GREY}" ${K}/>
      ${poly([[-8, -30], [8, -4], [2, -9], [-4, -2], [-11, -9], [-24, -4]], WHITE)}
      <line x1="-8" y1="-30" x2="-8" y2="-88" ${K}/>
      ${poly([[-8, -88], [30, -78], [-8, -66]], RED)}`,

    // 9. Orange hiking backpack with pockets and a rolled sleeping mat on top.
    backpack: () => `
      <path d="M-44 -30 Q-44 -56 -20 -56 H20 Q44 -56 44 -30 V60 Q44 84 20 84 H-20 Q-44 84 -44 60 Z" fill="${ORANGE}" ${K}/>
      <rect x="-36" y="-84" width="72" height="26" rx="13" fill="${TEAL}" ${K}/>
      <circle cx="36" cy="-71" r="9" fill="${MOSS}" ${K}/>
      <circle cx="36" cy="-71" r="3" fill="#111"/>
      <path d="M-36 -10 H36 V26 Q36 40 20 40 H-20 Q-36 40 -36 26 Z" fill="${DORANGE}" ${K}/>
      <rect x="-14" y="-2" width="28" height="12" rx="3" fill="${GREY}" ${K}/>
      <rect x="-26" y="50" width="52" height="24" rx="8" fill="${DORANGE}" ${K}/>
      <path d="M-44 6 H-56 M44 6 H56" fill="none" ${T}/>`,

    // 10. Rounded stone milestone with a green ribbon and a sparkle.
    milestone: () => `
      <ellipse cx="0" cy="74" rx="62" ry="10" fill="${LBROWN}" ${K}/>
      <rect x="-54" y="-54" width="108" height="128" rx="28" fill="${GREY}" ${K}/>
      <path d="M-48 -8 H48 L56 6 L48 20 H-48 L-40 6 Z" fill="${GREEN}" ${K}/>
      <path d="M-40 -2 H40 M-40 14 H40" fill="none" stroke="${MOSS}" stroke-width="3"/>
      ${sparkle(66, -56, 16, 5, YELLOW)}
      ${sparkle(-68, -40, 9, 3, YELLOW)}`,

    // 11. Yellow triangular tent with a campfire beside it.
    camp_tent: () => `
      <rect x="-90" y="70" width="180" height="12" rx="4" fill="${LBROWN}" ${K}/>
      ${poly([[-80, 70], [-18, -44], [44, 70]], YELLOW)}
      ${poly([[-18, -44], [-32, 70], [-4, 70]], BROWN)}
      <rect x="44" y="64" width="44" height="10" rx="5" fill="${BROWN}" ${K}/>
      <rect x="48" y="54" width="40" height="10" rx="5" fill="${LBROWN}" ${K}/>
      ${flame(66, 40, 24, ORANGE)}
      ${flame(66, 48, 13, YELLOW)}`,
  };

  Object.assign((window.ICONS = window.ICONS || {}), ICONS);
})();
