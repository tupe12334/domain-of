/* icons_a.js - doodle icons for "The Map of Marketing" (set A).
 * Each entry returns SVG elements (no outer <svg>), centred on (0,0).
 * Box: x,y in [-90,90]; wide icons may use x in [-110,110].
 */
(function () {
  const K = 'stroke="#111" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"';
  const T = 'stroke="#111" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"';
  const SKIN = '#f1c27d', BROWN = '#8e5b3a', LBROWN = '#c8935a';
  const RED = '#e74c3c', ORANGE = '#f39c12', YELLOW = '#f7d117', GREEN = '#2ecc71';
  const BLUE = '#3498db', NAVY = '#2c3e50', PINK = '#ff7eb6', GREY = '#95a5a6';
  const LGREY = '#dfe6e9', WHITE = '#ffffff', PALEBLUE = '#bfe6f7';

  const txt = (x, y, size, s, fill = '#111') =>
    `<text x="${x}" y="${y}" font-family="Hand" font-size="${size}" fill="${fill}" text-anchor="middle">${s}</text>`;

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

  const arrow = (xa, xb) =>
    `<line x1="${xa}" y1="0" x2="${xb - 8}" y2="0" ${K}/>` + poly([[xb, 0], [xb - 9, -6], [xb - 9, 6]], '#111', '');

  const person = (x, y, c) =>
    `<circle cx="${x}" cy="${y - 14}" r="8" fill="${SKIN}" ${T}/>` +
    `<rect x="${x - 12}" y="${y - 4}" width="24" height="24" rx="9" fill="${c}" ${T}/>`;

  const cup = (cx, top, bottom, tw, bw, fill) => {
    const x1 = cx - tw / 2, x2 = cx + tw / 2, b1 = cx - bw / 2, b2 = cx + bw / 2;
    return `<ellipse cx="${cx}" cy="${bottom + 4}" rx="${bw / 2 + 12}" ry="6" fill="#fff" ${K}/>` +
      `<path d="M${x1} ${top} L${x2} ${top} L${b2} ${bottom} L${b1} ${bottom} Z" fill="${fill}" ${K}/>` +
      `<rect x="${x1 - 4}" y="${top - 6}" width="${tw + 8}" height="10" rx="4" fill="#fff" ${K}/>`;
  };

  const ICONS = {

    // 1. Person on a red sofa holding a remote.
    person_sofa: () => `
      <g transform="translate(0,24)">
        ${head(0, -84, 24, BROWN)}
        <rect x="-32" y="-62" width="64" height="80" rx="18" fill="${BLUE}" ${K}/>
        <rect x="-78" y="-22" width="156" height="44" rx="16" fill="${RED}" ${K}/>
        <rect x="-94" y="-10" width="24" height="64" rx="12" fill="${RED}" ${K}/>
        <rect x="70" y="-10" width="24" height="64" rx="12" fill="${RED}" ${K}/>
        <rect x="-84" y="8" width="168" height="40" rx="12" fill="${RED}" ${K}/>
        <rect x="-70" y="46" width="12" height="14" fill="${NAVY}" ${K}/>
        <rect x="58" y="46" width="12" height="14" fill="${NAVY}" ${K}/>
        <rect x="22" y="-30" width="16" height="36" rx="8" fill="${SKIN}" ${K}/>
        <circle cx="30" cy="8" r="9" fill="${SKIN}" ${K}/>
        <rect x="34" y="-6" width="10" height="24" rx="2" fill="${NAVY}" ${K}/>
      </g>`,

    // 2. Old TV with antenna, screen says AD!
    tv_ad: () => `
      <g transform="translate(0,8)">
        <line x1="-18" y1="-58" x2="-44" y2="-92" ${K}/>
        <line x1="18" y1="-58" x2="44" y2="-92" ${K}/>
        <circle cx="-44" cy="-92" r="6" fill="${YELLOW}" ${K}/>
        <circle cx="44" cy="-92" r="6" fill="${YELLOW}" ${K}/>
        <rect x="-76" y="-60" width="152" height="122" rx="18" fill="${LBROWN}" ${K}/>
        <rect x="-58" y="-44" width="116" height="90" rx="14" fill="${YELLOW}" ${K}/>
        ${txt(0, 22, 52, 'AD!')}
        <circle cx="66" cy="-30" r="7" fill="${RED}" ${K}/>
        <circle cx="66" cy="-8" r="7" fill="${NAVY}" ${K}/>
        <rect x="-52" y="62" width="16" height="14" fill="${NAVY}" ${K}/>
        <rect x="36" y="62" width="16" height="14" fill="${NAVY}" ${K}/>
      </g>`,

    // 3. Billboard on two posts.
    billboard: () => `
      <rect x="-46" y="20" width="12" height="66" fill="${BROWN}" ${K}/>
      <rect x="34" y="20" width="12" height="66" fill="${BROWN}" ${K}/>
      <rect x="-88" y="-60" width="176" height="84" rx="8" fill="${BLUE}" ${K}/>
      <rect x="-74" y="-48" width="148" height="60" rx="6" fill="${YELLOW}" ${K}/>
      ${txt(0, -6, 30, 'BUY NOW!')}`,

    // 4. Three bouncing musical notes, one beamed pair, sparkle.
    music_notes: () => `
      <g transform="translate(0,20) scale(1.1)">
        <line x1="-37" y1="20" x2="-37" y2="-48" ${K}/>
        <ellipse cx="-50" cy="22" rx="15" ry="12" transform="rotate(-20 -50 22)" fill="#111"/>
        <path d="M-37 -48 Q-18 -36 -24 -18" fill="none" ${K}/>
        <line x1="18" y1="-6" x2="18" y2="-64" ${K}/>
        <line x1="63" y1="10" x2="63" y2="-42" ${K}/>
        <polygon points="18,-64 63,-44 63,-30 18,-50" fill="#111" ${K}/>
        <ellipse cx="4" cy="-4" rx="15" ry="12" transform="rotate(-20 4 -4)" fill="#111"/>
        <ellipse cx="49" cy="16" rx="15" ry="12" transform="rotate(-20 49 16)" fill="#111"/>
        ${star(-62, -66, 17, 7, YELLOW)}
      </g>`,

    // 5. Smartphone with a feed card tagged AD and a red crosshair.
    phone_ad: () => `
      <rect x="-42" y="-84" width="84" height="168" rx="16" fill="${NAVY}" ${K}/>
      <rect x="-33" y="-70" width="66" height="128" rx="4" fill="#fff" ${K}/>
      <rect x="-27" y="-60" width="54" height="42" rx="5" fill="${LGREY}" ${K}/>
      <rect x="-23" y="-56" width="30" height="16" rx="4" fill="${RED}" ${K}/>
      ${txt(-8, -43, 16, 'AD', '#fff')}
      <rect x="-27" y="-12" width="54" height="36" rx="5" fill="${LGREY}" ${K}/>
      <rect x="-27" y="30" width="54" height="22" rx="5" fill="${LGREY}" ${K}/>
      <circle cx="14" cy="-22" r="13" fill="none" stroke="${RED}" stroke-width="5"/>
      <line x1="-2" y1="-22" x2="30" y2="-22" stroke="${RED}" stroke-width="4"/>
      <line x1="14" y1="-42" x2="14" y2="-2" stroke="${RED}" stroke-width="4"/>`,

    // 6. Iceberg: small tip with ADVERTS, big underwater mass with MARKETING.
    iceberg: () => `
      <rect x="-110" y="-45" width="220" height="135" fill="#7fc8f0" fill-opacity="0.5" stroke="none"/>
      <polygon points="-96,-45 -84,-12 -100,18 -72,46 -80,80 -40,68 -14,90 14,70 38,88 56,62 92,72 84,34 102,4 80,-12 92,-45" fill="${PALEBLUE}" stroke="none"/>
      <path d="M-96 -45 L-84 -12 L-100 18 L-72 46 L-80 80 L-40 68 L-14 90 L14 70 L38 88 L56 62 L92 72 L84 34 L102 4 L80 -12 L92 -45" fill="none" ${K}/>
      <polygon points="-36,-45 -28,-64 -14,-58 -4,-74 8,-62 22,-66 36,-45" fill="#fff" ${K}/>
      ${txt(0, -80, 16, 'ADVERTS')}
      <path d="M-110 -45 Q-95 -57 -80 -45 T-50 -45 T-20 -45 T10 -45 T40 -45 T70 -45 T100 -45 T110 -45" fill="none" ${K}/>
      ${txt(0, 18, 26, 'MARKETING')}`,

    // 7. Market stall with striped awning and fruit crates.
    market_stall: () => `
      <rect x="-82" y="-28" width="8" height="40" fill="${BROWN}" ${K}/>
      <rect x="74" y="-28" width="8" height="40" fill="${BROWN}" ${K}/>
      ${awning(-84, -62, 28, 6, 34, RED, '#fff')}
      <rect x="-76" y="10" width="152" height="54" rx="4" fill="${LBROWN}" ${K}/>
      <line x1="-76" y1="30" x2="76" y2="30" ${T}/>
      <circle cx="-46" cy="-2" r="13" fill="${ORANGE}" ${K}/>
      <circle cx="-18" cy="-4" r="13" fill="${RED}" ${K}/>
      <circle cx="10" cy="-2" r="13" fill="${YELLOW}" ${K}/>
      <circle cx="36" cy="-2" r="13" fill="${GREEN}" ${K}/>`,

    // 8. Blue fish with speech bubble BEST FISH!
    fish_shout: () => `
      <g transform="translate(0,14)">
        <path d="M30 10 L60 -14 L60 34 Z" fill="${BLUE}" ${K}/>
        <path d="M-30 -22 Q-16 -52 4 -24 Z" fill="${BLUE}" ${K}/>
        <ellipse cx="-22" cy="10" rx="56" ry="34" fill="${BLUE}" ${K}/>
        <path d="M-30 -4 Q-24 2 -30 10 M-6 -12 Q-2 2 -6 20" fill="none" ${T}/>
        <circle cx="-50" cy="2" r="9" fill="#fff" ${K}/>
        <circle cx="-48" cy="2" r="4.5" fill="#111"/>
        <path d="M-72 22 Q-62 28 -52 20" fill="none" ${T}/>
        <path d="M20 -50 L34 -50 L22 -34 Z" fill="#fff" ${K}/>
        <rect x="6" y="-88" width="84" height="40" rx="14" fill="#fff" ${K}/>
        ${txt(48, -62, 16, 'BEST FISH!')}
      </g>`,

    // 9. Brick wall with red painted VOTE!
    painted_wall: () => `
      <rect x="-88" y="-72" width="176" height="146" rx="4" fill="${LBROWN}" ${K}/>
      <path d="M-88 -36 H88 M-88 0 H88 M-88 36 H88" fill="none" ${T}/>
      <path d="M-30 -72 V-36 M30 -72 V-36 M-60 -36 V0 M0 -36 V0 M60 -36 V0 M-30 0 V36 M30 0 V36 M-60 36 V74 M0 36 V74 M60 36 V74" fill="none" ${T}/>
      <text x="0" y="18" font-family="Hand" font-size="46" fill="${RED}" stroke="#111" stroke-width="1.5" text-anchor="middle" transform="rotate(-8 0 0)">VOTE!</text>`,

    // 10. Printed handbill next to a wooden press screw.
    printing_press: () => `
      <rect x="-84" y="-70" width="108" height="140" rx="4" fill="#fff" ${K}/>
      ${txt(-54, -16, 58, 'A')}
      <path d="M-34 -40 H18 M-34 -24 H18 M-34 -8 H18 M-72 16 H18 M-72 32 H18 M-72 48 H4" fill="none" ${T}/>
      <rect x="40" y="-94" width="44" height="10" rx="4" fill="${BROWN}" ${K}/>
      <rect x="34" y="-82" width="50" height="16" rx="3" fill="${LBROWN}" ${K}/>
      <rect x="58" y="-66" width="10" height="34" fill="${GREY}" ${K}/>
      <rect x="34" y="-32" width="50" height="14" rx="3" fill="${LBROWN}" ${K}/>
      <rect x="30" y="-18" width="56" height="66" rx="4" fill="${BROWN}" ${K}/>`,

    // 11. Vintage wooden radio with grille and two knobs.
    radio: () => `
      <g transform="translate(0,8)">
        <line x1="28" y1="-40" x2="58" y2="-88" ${K}/>
        <rect x="-80" y="-40" width="160" height="108" rx="18" fill="${BROWN}" ${K}/>
        <rect x="-64" y="-24" width="92" height="74" rx="10" fill="${LBROWN}" ${K}/>
        <line x1="-54" y1="-4" x2="18" y2="-4" ${T}/>
        <line x1="-54" y1="10" x2="18" y2="10" ${T}/>
        <line x1="-54" y1="24" x2="18" y2="24" ${T}/>
        <line x1="-54" y1="38" x2="18" y2="38" ${T}/>
        <circle cx="52" cy="-6" r="13" fill="${RED}" ${K}/>
        <circle cx="52" cy="28" r="13" fill="${YELLOW}" ${K}/>
      </g>`,

    // 12. Small old TV showing a wristwatch.
    tv_watch: () => `
      <g transform="translate(0,8)">
        <line x1="-18" y1="-58" x2="-42" y2="-90" ${K}/>
        <line x1="18" y1="-58" x2="42" y2="-90" ${K}/>
        <rect x="-76" y="-60" width="152" height="122" rx="18" fill="${GREY}" ${K}/>
        <rect x="-58" y="-44" width="116" height="90" rx="14" fill="${BLUE}" ${K}/>
        <rect x="-13" y="-44" width="26" height="18" fill="${NAVY}" ${K}/>
        <rect x="-13" y="24" width="26" height="18" fill="${NAVY}" ${K}/>
        <circle cx="0" cy="0" r="24" fill="#fff" ${K}/>
        <line x1="0" y1="0" x2="0" y2="-14" stroke="#111" stroke-width="4" stroke-linecap="round"/>
        <line x1="0" y1="0" x2="9" y2="4" stroke="#111" stroke-width="4" stroke-linecap="round"/>
        <circle cx="0" cy="0" r="3" fill="#111"/>
        <circle cx="66" cy="-30" r="6" fill="${RED}" ${K}/>
        <circle cx="66" cy="-8" r="6" fill="${NAVY}" ${K}/>
        <rect x="-52" y="62" width="16" height="14" fill="${NAVY}" ${K}/>
        <rect x="36" y="62" width="16" height="14" fill="${NAVY}" ${K}/>
      </g>`,

    // 13. Striped web banner with YOU WILL. and a clicking cursor.
    banner_ad: () => {
      let stripes = '';
      for (let i = 0; i < 8; i++) {
        stripes += `<rect x="${-100 + i * 25}" y="-50" width="25" height="100" fill="${i % 2 ? YELLOW : RED}"/>`;
      }
      return `${stripes}
        <rect x="-100" y="-50" width="200" height="100" rx="8" fill="none" ${K}/>
        <rect x="-74" y="-30" width="148" height="40" rx="6" fill="#fff" ${K}/>
        ${txt(0, -2, 26, 'YOU WILL.')}
        <polygon points="30,8 30,50 40,40 48,58 56,55 48,38 62,38" fill="#fff" ${K}/>`;
    },

    // 14. Clipboard with checklist and a magnifying glass over it.
    clipboard_magnifier: () => `
      <rect x="-62" y="-70" width="104" height="138" rx="10" fill="${LBROWN}" ${K}/>
      <rect x="-50" y="-58" width="80" height="116" rx="4" fill="#fff" ${K}/>
      <rect x="-30" y="-84" width="40" height="22" rx="6" fill="${GREY}" ${K}/>
      <path d="M-46 -38 L-39 -31 L-28 -46 M-46 -14 L-39 -7 L-28 -22 M-46 10 L-39 17 L-28 2 M-46 34 L-39 41 L-28 26" fill="none" stroke="${GREEN}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M-18 -38 H22 M-18 -14 H22 M-18 10 H22 M-18 34 H22" fill="none" ${T}/>
      <line x1="56" y1="48" x2="80" y2="74" stroke="#111" stroke-width="18" stroke-linecap="round"/>
      <line x1="56" y1="48" x2="80" y2="74" stroke="${BROWN}" stroke-width="8" stroke-linecap="round"/>
      <circle cx="36" cy="28" r="28" fill="${LGREY}" ${K}/>
      <path d="M20 22 Q24 10 36 8" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`,

    // 15. Same person: says I'D BUY IT, then walks away from a shop. Big not-equal sign between.
    say_do: () => {
      const limb = (x1, y1, x2, y2, c, w) =>
        `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#111" stroke-width="${w + 6}" stroke-linecap="round"/>` +
        `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
      return `
      <rect x="-94" y="-88" width="100" height="32" rx="12" fill="#fff" ${K}/>
      <polygon points="-50,-58 -40,-58 -50,-44" fill="#fff" ${K}/>
      ${txt(-44, -66, 16, "I'D BUY IT!")}
      ${head(-46, -22, 20, BROWN)}
      <rect x="-70" y="2" width="48" height="72" rx="14" fill="${BLUE}" ${K}/>
      <line x1="-18" y1="-26" x2="18" y2="-26" stroke="${RED}" stroke-width="7" stroke-linecap="round"/>
      <line x1="-18" y1="-8" x2="18" y2="-8" stroke="${RED}" stroke-width="7" stroke-linecap="round"/>
      <line x1="10" y1="-42" x2="-10" y2="2" stroke="${RED}" stroke-width="7" stroke-linecap="round"/>
      <path d="M60 -30 H70 M58 -12 H70" fill="none" ${T}/>
      <g transform="translate(8,0)">
        ${limb(40, 4, 52, 20, BLUE, 11)}
        ${limb(26, 40, 14, 72, NAVY, 12)}
        ${limb(38, 40, 52, 70, NAVY, 12)}
        <rect x="18" y="-4" width="26" height="44" rx="10" fill="${BLUE}" ${K}/>
        ${limb(24, 4, 10, 22, BLUE, 11)}
        <circle cx="30" cy="-24" r="18" fill="${SKIN}" ${K}/>
        <path d="M12 -24 A18 18 0 0 1 48 -24 Q38 -32 26 -36 Q16 -32 12 -24 Z" fill="${BROWN}" ${K}/>
        <circle cx="22" cy="-22" r="3" fill="#111"/>
        <ellipse cx="10" cy="76" rx="10" ry="5" fill="#111"/>
        <ellipse cx="54" cy="74" rx="10" ry="5" fill="#111"/>
      </g>
      ${awning(72, -40, 11, 2, 14, RED, '#fff')}
      <rect x="72" y="-24" width="22" height="98" fill="${LBROWN}" ${K}/>
      <rect x="76" y="-12" width="14" height="16" fill="${BLUE}" ${K}/>
      <rect x="78" y="14" width="10" height="60" fill="${BROWN}" ${K}/>`;
    },

    // 16. Three small clusters of people in red, green and blue, with dashed rings.
    crowd_groups: () => {
      const cluster = (cx, c) =>
        `<circle cx="${cx}" cy="-2" r="36" fill="none" stroke="#111" stroke-width="3" stroke-dasharray="6 6"/>` +
        person(cx - 16, 8, c) + person(cx + 16, 8, c) + person(cx, -10, c);
      return cluster(-72, RED) + cluster(0, GREEN) + cluster(72, BLUE);
    },

    // 17. Bullseye with an arrow stuck in the centre.
    target: () => `
      <circle cx="0" cy="0" r="84" fill="#fff" ${K}/>
      <circle cx="0" cy="0" r="60" fill="${RED}" ${K}/>
      <circle cx="0" cy="0" r="36" fill="#fff" ${K}/>
      <circle cx="0" cy="0" r="14" fill="${RED}" ${K}/>
      <line x1="80" y1="-80" x2="10" y2="-10" stroke="#111" stroke-width="8" stroke-linecap="round"/>
      <line x1="80" y1="-80" x2="10" y2="-10" stroke="${BROWN}" stroke-width="3" stroke-linecap="round"/>
      ${poly([[84, -84], [92, -92], [90, -76]], YELLOW)}
      ${poly([[0, 0], [14.9, -4.9], [4.9, -14.9]], LGREY)}`,

    // 18. Perceptual map: two axes, labels, grey dots, one star in the empty quadrant.
    position_map: () => `
      <line x1="-88" y1="0" x2="88" y2="0" ${K}/>
      <line x1="0" y1="88" x2="0" y2="-88" ${K}/>
      ${poly([[88, 0], [78, -7], [78, 7]], '#111', '')}
      ${poly([[0, -88], [-7, -78], [7, -78]], '#111', '')}
      ${txt(-60, 22, 18, 'CHEAP')}
      ${txt(60, 22, 18, 'PRICEY')}
      ${txt(30, -72, 18, 'FUN')}
      ${txt(36, 80, 18, 'SERIOUS')}
      <circle cx="-40" cy="-40" r="7" fill="${GREY}" ${K}/>
      <circle cx="-58" cy="-20" r="7" fill="${GREY}" ${K}/>
      <circle cx="-24" cy="-62" r="7" fill="${GREY}" ${K}/>
      <circle cx="-30" cy="38" r="7" fill="${GREY}" ${K}/>
      <circle cx="-56" cy="50" r="7" fill="${GREY}" ${K}/>
      <circle cx="22" cy="44" r="7" fill="${GREY}" ${K}/>
      <circle cx="-14" cy="-22" r="7" fill="${GREY}" ${K}/>
      ${star(50, -44, 20, 9, YELLOW)}`,

    // 19. Three circles labelled S, T, P joined by arrows.
    stp_arrows: () => `
      <circle cx="-78" cy="0" r="28" fill="${YELLOW}" ${K}/>
      ${txt(-78, 11, 38, 'S')}
      <circle cx="0" cy="0" r="28" fill="${ORANGE}" ${K}/>
      ${txt(0, 11, 38, 'T')}
      <circle cx="78" cy="0" r="28" fill="${RED}" ${K}/>
      ${txt(78, 11, 38, 'P')}
      ${arrow(-48, -30)}
      ${arrow(30, 48)}`,

    // 20. Power drill makes a hole in a wall; a happy frame hangs there.
    drill_hole: () => `
      <rect x="-94" y="-18" width="24" height="70" rx="8" fill="${NAVY}" ${K}/>
      <rect x="-104" y="-54" width="66" height="44" rx="14" fill="${YELLOW}" ${K}/>
      <line x1="-90" y1="-40" x2="-64" y2="-40" ${T}/>
      <line x1="-90" y1="-30" x2="-64" y2="-30" ${T}/>
      <rect x="-40" y="-44" width="14" height="24" rx="3" fill="${GREY}" ${K}/>
      <rect x="-26" y="-38" width="22" height="8" fill="${GREY}" ${K}/>
      ${poly([[-6, -44], [6, -34], [-6, -24]], LGREY)}
      <line x1="-14" y1="30" x2="10" y2="30" ${K}/>
      ${poly([[18, 30], [9, 23], [9, 37]], '#111', '')}
      <rect x="22" y="-55" width="86" height="110" rx="4" fill="${LBROWN}" ${K}/>
      <circle cx="50" cy="-22" r="14" fill="${NAVY}" ${K}/>
      <rect x="60" y="-4" width="40" height="36" rx="3" fill="#fff" ${K}/>
      <rect x="65" y="1" width="30" height="26" fill="${BLUE}" ${K}/>
      <circle cx="72" cy="10" r="5" fill="${YELLOW}" ${K}/>
      <path d="M76 18 Q82 23 90 18" fill="none" ${T}/>
      <line x1="66" y1="-4" x2="80" y2="-30" ${T}/>
      <line x1="94" y1="-4" x2="80" y2="-30" ${T}/>
      <circle cx="80" cy="-30" r="4" fill="${GREY}" ${K}/>`,

    // 21. Cardboard box with a star sticker.
    box_product: () => `
      <g transform="translate(0,-14)">
        <polygon points="-62,-18 -40,-48 50,-48 66,-18" fill="${LBROWN}" ${K}/>
        <rect x="-62" y="-18" width="128" height="94" rx="6" fill="${LBROWN}" ${K}/>
        <line x1="-62" y1="-18" x2="-40" y2="-48" ${T}/>
        <line x1="-6" y1="-18" x2="-6" y2="-48" ${T}/>
        ${star(0, 26, 26, 11, YELLOW)}
      </g>`,

    // 22. Price tag with string hole and $.
    price_tag: () => `
      <path d="M-34 -70 L60 -70 Q80 -70 80 -50 L80 50 Q80 70 60 70 L-34 70 L-82 0 Z" fill="${YELLOW}" ${K}/>
      <path d="M-56 -4 Q-80 -40 -70 -88" fill="none" ${T}/>
      <circle cx="-56" cy="0" r="8" fill="#fff" ${K}/>
      ${txt(20, 26, 60, '$')}`,

    // 23. Small shop front with striped awning, door and window.
    shop: () => `
      <rect x="-78" y="-24" width="156" height="110" rx="3" fill="${LBROWN}" ${K}/>
      ${awning(-84, -60, 28, 6, 32, RED, '#fff')}
      <rect x="-68" y="0" width="36" height="34" rx="3" fill="${BLUE}" ${K}/>
      <rect x="32" y="0" width="36" height="34" rx="3" fill="${BLUE}" ${K}/>
      <rect x="-18" y="8" width="36" height="78" rx="3" fill="${BROWN}" ${K}/>
      <circle cx="10" cy="48" r="3.5" fill="${YELLOW}" stroke="#111" stroke-width="2"/>`,

    // 24. Red megaphone with sound lines.
    megaphone: () => `
      <rect x="-36" y="18" width="16" height="28" rx="4" fill="${NAVY}" ${K}/>
      <rect x="-70" y="-18" width="38" height="36" rx="4" fill="${RED}" ${K}/>
      <polygon points="-36,-20 30,-62 30,62 -36,20" fill="${RED}" ${K}/>
      <rect x="30" y="-62" width="12" height="124" rx="4" fill="#fff" ${K}/>
      <path d="M54 -30 Q68 0 54 30" fill="none" ${K}/>
      <path d="M68 -50 Q88 0 68 50" fill="none" ${K}/>`,

    // 25. Price tag $9.99 with $10? crossed out.
    price_99: () => `
      <g transform="translate(0,-12)">
        <path d="M-50 -48 L76 -48 Q88 -48 88 -36 L88 36 Q88 48 76 48 L-50 48 L-80 0 Z" fill="${YELLOW}" ${K}/>
        <circle cx="-58" cy="0" r="7" fill="#fff" ${K}/>
        ${txt(20, 14, 42, '$9.99')}
        ${txt(-6, 98, 26, '$10?')}
        <line x1="-40" y1="93" x2="28" y2="85" stroke="${RED}" stroke-width="5" stroke-linecap="round"/>
      </g>`,

    // 26. Three coffee cups with prices; the medium one is a greyed DECOY.
    decoy_cups: () => `
      ${cup(-72, -8, 32, 44, 34, BLUE)}
      ${txt(-72, 80, 26, '$3')}
      ${cup(0, -30, 30, 56, 46, GREY)}
      ${txt(0, 6, 18, 'DECOY')}
      ${txt(0, 80, 26, '$6.50')}
      ${cup(72, -52, 30, 68, 56, ORANGE)}
      ${txt(72, 80, 26, '$7')}`,

    // 27. Side-profile head with a thought bubble: heart, star, smiley.
    head_memories: () => `
      <g transform="translate(-6,18)">
        <path d="M-48 -4 C-50 -50 -20 -66 8 -62 C40 -58 50 -30 46 -10 L54 -2 L46 4 C46 12 42 16 36 18 C32 26 28 30 24 32 L24 48 L-20 48 L-22 32 C-40 26 -48 14 -48 -4 Z" fill="${SKIN}" ${K}/>
        <path d="M-48 -6 C-52 -44 -22 -68 6 -62 C-14 -56 -18 -48 -20 -36 C-30 -36 -40 -30 -44 -18 Z" fill="${BROWN}" ${K}/>
        <circle cx="22" cy="-18" r="5" fill="#111"/>
      </g>
      <circle cx="22" cy="-40" r="5" fill="#fff" ${K}/>
      <circle cx="30" cy="-30" r="3.5" fill="#fff" ${K}/>
      <rect x="14" y="-92" width="74" height="46" rx="22" fill="#fff" ${K}/>
      ${heart(30, -69, 14, RED)}
      ${star(52, -69, 12, 5, YELLOW)}
      <circle cx="74" cy="-69" r="10" fill="${YELLOW}" ${K}/>
      <circle cx="71" cy="-72" r="1.8" fill="#111"/>
      <circle cx="77" cy="-72" r="1.8" fill="#111"/>
      <path d="M70 -66 Q74 -62 78 -66" fill="none" ${T}/>`,

    // 28. Painter's palette with four colour blobs and Aa.
    palette_logo: () => `
      <g transform="translate(-24,0) scale(0.72)">
        <ellipse cx="-20" cy="0" rx="72" ry="62" fill="${LBROWN}" ${K}/>
        <circle cx="22" cy="34" r="12" fill="#fff" ${K}/>
        <circle cx="-50" cy="-22" r="13" fill="${RED}" ${K}/>
        <circle cx="-16" cy="-40" r="13" fill="${YELLOW}" ${K}/>
        <circle cx="20" cy="-26" r="13" fill="${GREEN}" ${K}/>
        <circle cx="-44" cy="14" r="13" fill="${BLUE}" ${K}/>
      </g>
      ${txt(60, 14, 50, 'Aa')}`,

    // 29. Big speech bubble with HELLO! and sound lines.
    speech_voice: () => `
      <polygon points="-50,28 -30,28 -58,52" fill="#fff" ${K}/>
      <rect x="-84" y="-70" width="120" height="100" rx="24" fill="#fff" ${K}/>
      ${txt(-24, -4, 32, 'HELLO!')}
      <path d="M50 -40 Q62 -20 50 0" fill="none" ${K}/>
      <path d="M66 -56 Q84 -20 66 16" fill="none" ${K}/>`,

    // 30. Two identical sneakers. Left plain $20; right with star logo and $90.
    two_shoes: () => {
      const shoe = (cx, withStar) => `
        <g transform="translate(${cx} 22) scale(0.92)">
          <path d="M-54 14 L-54 -22 Q-54 -40 -36 -40 L-18 -40 Q-10 -26 6 -22 Q18 -18 38 -18 Q56 -16 56 2 L56 14 Z" fill="${BLUE}" ${K}/>
          <rect x="-56" y="14" width="112" height="12" rx="5" fill="#fff" ${K}/>
          ${withStar ? star(8, -2, 13, 6, YELLOW) : ''}
        </g>`;
      const tag = (cx, label) => `
        <line x1="${cx}" y1="-14" x2="${cx}" y2="-6" ${T}/>
        <rect x="${cx - 30}" y="-44" width="60" height="30" rx="5" fill="${YELLOW}" ${K}/>
        ${txt(cx, -22, 22, label)}`;
      return shoe(-46, false) + tag(-46, '$20') + shoe(46, true) + tag(46, '$90');
    },

    // 31. Pink brain next to a shop shelf, with a plus sign between.
    brain_shelf: () => `
      <ellipse cx="-54" cy="-2" rx="36" ry="34" fill="${PINK}" ${K}/>
      <path d="M-74 -10 Q-64 -22 -54 -10 Q-44 2 -34 -10 M-72 10 Q-62 0 -52 10 Q-42 20 -34 8 M-58 -30 Q-54 -16 -48 -12" fill="none" ${T}/>
      <rect x="-58" y="30" width="12" height="16" rx="4" fill="${PINK}" ${K}/>
      <path d="M-11 0 H11 M0 -11 V11" fill="none" stroke="#111" stroke-width="9" stroke-linecap="round"/>
      <rect x="16" y="-80" width="76" height="166" rx="4" fill="${LGREY}" ${K}/>
      <rect x="16" y="-40" width="76" height="8" fill="${LBROWN}" ${K}/>
      <rect x="16" y="12" width="76" height="8" fill="${LBROWN}" ${K}/>
      <rect x="24" y="-70" width="14" height="30" rx="3" fill="${RED}" ${K}/>
      <rect x="44" y="-62" width="18" height="22" fill="${BLUE}" ${K}/>
      <rect x="68" y="-66" width="14" height="26" rx="3" fill="${GREEN}" ${K}/>
      <circle cx="30" cy="-2" r="10" fill="${ORANGE}" ${K}/>
      <rect x="46" y="-18" width="20" height="30" fill="#9b59b6" ${K}/>
      <circle cx="74" cy="-6" r="9" fill="#1abc9c" ${K}/>`,

    // 32. Same star logo four times, fading left to right.
    memory_fade: () => {
      const xs = [-78, -26, 26, 78];
      const ops = [1, 0.7, 0.4, 0.15];
      const stars = xs.map((x, i) => `<g opacity="${ops[i]}">${star(x, -4, 22, 9, ORANGE)}</g>`).join('');
      return stars +
        `<line x1="-90" y1="50" x2="78" y2="50" ${T}/>` +
        poly([[90, 50], [78, 43], [78, 57]], '#111', '');
    },

    // 33. Open book with flames and stars rising from the pages.
    book_campfire: () => `
      ${flame(0, -34, 34, ORANGE)}
      ${flame(0, -14, 16, YELLOW)}
      ${flame(-36, -30, 14, RED)}
      ${flame(36, -30, 14, ORANGE)}
      ${star(-60, -70, 9, 4, YELLOW)}
      ${star(60, -72, 9, 4, YELLOW)}
      <path d="M-84 -18 Q-44 -38 0 -20 Q44 -38 84 -18 L84 58 Q44 40 0 60 Q-44 40 -84 58 Z" fill="#fff" ${K}/>
      <line x1="0" y1="-20" x2="0" y2="60" ${T}/>
      <path d="M-70 6 Q-44 -2 -18 6 M-70 24 Q-44 16 -18 24 M18 6 Q44 -2 70 6 M18 24 Q44 16 70 24" fill="none" ${T}/>`,
  };

  Object.assign((window.ICONS = window.ICONS || {}), ICONS);
})();
