/* map_layout.js: journey map regions, roads and items (world units, 6400 x 3600).
 * Items: type "icon" {icon, label, sub, s}; type "label" {text, style, fill, sub, size};
 * type "note" {text}; type "path" {points, closed, width, drawDur};
 * type "cloudtext" {text, size, plain}.
 * withRegion: '<regionKey>' pops in when that region is revealed; '*' shows at map start.
 * intro: cold-open scene {bg, items}; items use screen coords (1920 x 1080).
 */
window.LAYOUT = {
  background: '#cfe6b0',
  intro: {
    bg: '#e9a23b',
    items: [
      { id: 'i_founder', type: 'icon', x: 960, y: 640, s: 1.7, icon: 'person_laptop', until: 'i_boot' },
      { id: 'i_nomoney', type: 'icon', x: 1400, y: 330, s: 1.5, icon: 'no_money_bag', until: 'i_boot' },
      { id: 'i_garage', type: 'icon', x: 520, y: 560, s: 1.6, icon: 'garage', until: 'i_boot' },
      { id: 'i_boot', type: 'icon', x: 960, y: 540, s: 3.2, icon: 'boot_strap', until: 'i_title' },
      { id: 'i_title', type: 'title', x: 960, y: 540, rot: -2,
        lines: [{ text: 'THE MAP OF', fs: 70, y0: -95 }, { text: 'BOOTSTRAPPING', fs: 150, y0: 45, stroke: 2 }] }
    ]
  },
  regions: {
    pack:      { color: '#efe2c4', points: [[120, 120], [1850, 120], [1850, 1250], [120, 1250]] },
    camp:      { color: '#f2c46d', points: [[150, 1450], [1950, 1450], [2050, 2250], [1700, 2950], [150, 2950]] },
    village:   { color: '#f2b8a2', points: [[1900, 850], [3150, 850], [3250, 1700], [2900, 2200], [1950, 2150]] },
    swamp:     { color: '#7f9c6a', points: [[2350, 2500], [3500, 2450], [4200, 2700], [3900, 3250], [2700, 3350], [2250, 3000]] },
    graveyard: { color: '#b7b3a8', points: [[4300, 2750], [6300, 2750], [6300, 3500], [4300, 3500]] },
    mvp:       { color: '#95cbe9', points: [[4360, 1350], [4305, 1593], [4149, 1788], [3925, 1896], [3675, 1896], [3451, 1788], [3295, 1593], [3240, 1350], [3295, 1107], [3451, 912], [3675, 804], [3925, 804], [4149, 912], [4305, 1107]] },
    mountain:  { color: '#a89580', points: [[4350, 2350], [4800, 700], [5300, 250], [5800, 750], [6000, 2350]] },
    snow:      { color: '#ffffff', points: [[5050, 500], [5300, 250], [5550, 500], [5420, 560], [5300, 470], [5180, 590]] },
    fog:       { color: '#d6d8dd', points: [[4350, 1700], [5950, 1700], [5950, 2250], [4350, 2250]] },
    city:      { color: '#c9b6e4', points: [[5950, 80], [6350, 80], [6350, 650], [5950, 650]] },
    calm:      { color: '#f7e7a8', points: [[5950, 850], [6350, 850], [6350, 1400], [5950, 1400]] }
  },
  items: [
    // ROADS (drawn under icons)
    { id: 'road_main', type: 'path', width: 64, drawDur: 5,
      points: [[500, 3250], [1000, 3300], [1400, 3150], [1650, 2750], [1800, 2450], [2150, 2350], [2350, 2050], [2450, 1700], [2550, 1350], [2800, 1050], [3250, 1100], [3470, 1330]] },
    { id: 'road_swamp', type: 'path', width: 64, drawDur: 4,
      points: [[2150, 2350], [2550, 2650], [3000, 2850], [3600, 2900], [4100, 3000], [4600, 3100]] },
    { id: 'road_loop', type: 'path', width: 64, drawDur: 3, closed: true,
      points: [[4130, 1350], [4105, 1476], [4033, 1583], [3926, 1655], [3800, 1680], [3674, 1655], [3567, 1583], [3495, 1476], [3470, 1350], [3495, 1224], [3567, 1117], [3674, 1045], [3800, 1020], [3926, 1045], [4033, 1117], [4105, 1224]] },
    { id: 'road_exit_a', type: 'path', width: 64, drawDur: 2,
      points: [[3800, 1020], [3800, 700]] },
    { id: 'road_exit_b', type: 'path', width: 64, drawDur: 2,
      points: [[3800, 1680], [3880, 2050]] },
    { id: 'road_mountain', type: 'path', width: 64, drawDur: 6,
      points: [[4130, 1350], [4400, 1500], [4700, 2050], [5600, 2050], [4800, 1600], [5650, 1300], [4950, 1000], [5450, 700], [5300, 450]] },
    { id: 'road_city', type: 'path', width: 64, drawDur: 2,
      points: [[5300, 450], [5700, 350], [6050, 380]] },
    { id: 'road_calm', type: 'path', width: 64, drawDur: 2,
      points: [[5300, 450], [5650, 800], [6050, 1100]] },

    // START
    { id: 'start_garage', type: 'icon', x: 500, y: 3120, icon: 'garage', label: 'START: AN IDEA', s: 0.9 },

    // ORIGINS
    { id: 'o_hp', type: 'icon', x: 950, y: 3420, icon: 'toolbox', label: 'H.P.', sub: '1939 · $538', s: 0.6 },
    { id: 'o_spanx', type: 'icon', x: 1350, y: 3420, icon: 'piggy_bank', label: 'SPANX', sub: '$5,000 SAVINGS', s: 0.6 },
    { id: 'o_atlassian', type: 'icon', x: 1750, y: 3420, icon: 'credit_card', label: 'ATLASSIAN', sub: '$10K ON A CARD', s: 0.6 },
    { id: 'o_mailchimp', type: 'icon', x: 2150, y: 3420, icon: 'envelope', label: 'MAILCHIMP', sub: 'NO INVESTORS · ~$12B', s: 0.6 },

    // BACKPACK
    { id: 'pack_label', type: 'label', x: 985, y: 250, text: 'THE FOUNDER\'S BACKPACK', style: 'region', size: 90, fill: '#e3c193' },
    { id: 'p_time', type: 'icon', x: 350, y: 620, icon: 'clock', label: 'TIME', s: 0.8 },
    { id: 'p_focus', type: 'icon', x: 750, y: 620, icon: 'magnifier_focus', label: 'FOCUS', s: 0.8 },
    { id: 'p_energy', type: 'icon', x: 1150, y: 620, icon: 'battery_low', label: 'ENERGY', s: 0.8 },
    { id: 'p_no', type: 'icon', x: 1550, y: 620, icon: 'stop_hand', label: 'SAYING NO', s: 0.8 },
    { id: 'p_cofounder', type: 'icon', x: 550, y: 1000, icon: 'handshake', label: 'CO-FOUNDER', s: 0.8 },
    { id: 'p_health', type: 'icon', x: 950, y: 1000, icon: 'heart_smile', label: 'HEALTH', s: 0.8 },
    { id: 'pack_icon', type: 'icon', x: 1500, y: 1000, icon: 'backpack', s: 0.9, withRegion: 'pack' },

    // BASE CAMP: MONEY
    { id: 'camp_label', type: 'label', x: 1050, y: 1560, text: 'BASE CAMP: MONEY', style: 'region', size: 100, fill: '#ffd23f' },
    { id: 'camp_tent', type: 'icon', x: 1750, y: 1700, icon: 'camp_tent', s: 0.6, withRegion: 'camp' },
    { id: 'c_runway', type: 'icon', x: 420, y: 1900, icon: 'runway_plane', label: 'RUNWAY', sub: 'CASH ÷ MONTHLY BURN', s: 0.9 },
    { id: 'c_burn', type: 'icon', x: 850, y: 1950, icon: 'burning_money', label: 'LOW BURN RATE', sub: 'NO OFFICE · FREE TOOLS', s: 0.85 },
    { id: 'c_dayjob', type: 'icon', x: 1250, y: 1900, icon: 'moon_laptop', label: 'KEEP THE DAY JOB', s: 0.85 },
    { id: 'c_services', type: 'icon', x: 1650, y: 2050, icon: 'two_people_talking', label: 'SERVICES FIRST', sub: 'BASECAMP WAS A DESIGN AGENCY', s: 0.8 },
    { id: 'c_preorder', type: 'icon', x: 450, y: 2420, icon: 'crowdfund', label: 'PRE-ORDERS &\nCROWDFUNDING', s: 0.8 },
    { id: 'c_grants', type: 'icon', x: 850, y: 2420, icon: 'medal', label: 'GRANTS', s: 0.7 },
    { id: 'c_own', type: 'icon', x: 1200, y: 2650, icon: 'pie_100', label: '100% YOURS', s: 0.65 },
    { id: 'c_slow', type: 'icon', x: 1350, y: 2330, icon: 'snail', label: 'SLOWER GROWTH', s: 0.65 },
    { id: 'c_risk', type: 'icon', x: 650, y: 2760, icon: 'backpack_weight', label: 'THE RISK IS YOURS', s: 0.65 },

    // FORK
    { id: 'fork_sign', type: 'icon', x: 2000, y: 2150, icon: 'signpost_fork', s: 0.65 },
    { id: 's_oppcost', type: 'icon', x: 2450, y: 2350, icon: 'two_doors', label: 'OPPORTUNITY COST', s: 0.65 },

    // SWAMP
    { id: 'swamp_label', type: 'label', x: 3150, y: 2620, text: 'THE SWAMP OF NO MARKET NEED', style: 'region', size: 70, fill: '#c9d8b0' },
    { id: 'sw_nobody', type: 'icon', x: 2750, y: 2980, icon: 'empty_shop', label: 'BUILT SOMETHING\nNOBODY WANTED', sub: 'TOP REASON STARTUPS FAIL', s: 0.75 },
    { id: 'sw_sunk', type: 'icon', x: 3500, y: 3080, icon: 'sinking_coins', label: 'SUNK COST FALLACY', s: 0.75 },
    { id: 'reeds1', type: 'icon', x: 3900, y: 2850, icon: 'swamp_reeds', s: 0.55, withRegion: 'swamp' },
    { id: 'reeds2', type: 'icon', x: 2450, y: 3200, icon: 'swamp_reeds', s: 0.5, withRegion: 'swamp' },

    // GRAVEYARD
    { id: 'grave_label', type: 'label', x: 5300, y: 2860, text: 'THE STARTUP GRAVEYARD', style: 'region', size: 70, fill: '#dcd8cf' },
    { id: 'g_tomb1', type: 'icon', x: 4700, y: 3200, icon: 'tombstone', label: 'NO MARKET NEED', s: 0.65 },
    { id: 'g_tomb2', type: 'icon', x: 5200, y: 3200, icon: 'tombstone', label: 'RAN OUT OF CASH', s: 0.65 },
    { id: 'g_tomb3', type: 'icon', x: 5700, y: 3200, icon: 'tombstone', label: 'TOO EARLY', sub: 'WEBVAN, 2001', s: 0.65 },
    { id: 'g_tomb4', type: 'icon', x: 6150, y: 3200, icon: 'tombstone', label: 'BURNOUT', s: 0.65 },

    // VILLAGE OF VALIDATION
    { id: 'village_label', type: 'label', x: 2550, y: 960, text: 'THE VILLAGE OF VALIDATION', style: 'region', size: 70, fill: '#ffffff' },
    { id: 'v_discovery', type: 'icon', x: 2150, y: 1230, icon: 'door_out', label: 'CUSTOMER DISCOVERY', sub: 'STEVE BLANK', s: 0.75 },
    { id: 'v_momtest', type: 'icon', x: 2980, y: 1230, icon: 'mom_love_it', label: 'THE MOM TEST', sub: 'ASK ABOUT THEIR LIFE', s: 0.75 },
    { id: 'v_smoke', type: 'icon', x: 2100, y: 1650, icon: 'smoke_test', label: 'SMOKE TEST', s: 0.75 },
    { id: 'v_concierge', type: 'icon', x: 2850, y: 1560, icon: 'concierge_bell', label: 'CONCIERGE TEST', s: 0.7 },
    { id: 'v_wizard', type: 'icon', x: 2830, y: 1930, icon: 'wizard_curtain', label: 'WIZARD OF OZ TEST', sub: 'ZAPPOS', s: 0.7 },
    { id: 'v_evidence', type: 'note', x: 2200, y: 2020, text: 'EVIDENCE > OPINIONS' },

    // MVP ROUNDABOUT
    { id: 'mvp_label', type: 'label', x: 3800, y: 1350, text: 'THE MVP', style: 'region', size: 80 },
    { id: 'r_build', type: 'label', x: 3530, y: 1170, text: 'BUILD', style: 'sublabel', size: 46 },
    { id: 'r_measure', type: 'label', x: 4070, y: 1170, text: 'MEASURE', style: 'sublabel', size: 46 },
    { id: 'r_learn', type: 'label', x: 3800, y: 1690, text: 'LEARN', style: 'sublabel', size: 46 },
    { id: 'r_skate', type: 'icon', x: 3330, y: 830, icon: 'skateboard_car', label: 'SKATEBOARD, NOT A WHEEL', sub: 'HENRIK KNIBERG', s: 0.7 },
    { id: 'r_nocode', type: 'icon', x: 4280, y: 830, icon: 'nocode_blocks', label: 'NO-CODE TOOLS', s: 0.65 },
    { id: 'r_dontscale', type: 'icon', x: 4330, y: 1130, icon: 'camera_photo', label: 'DON\'T SCALE (YET)', sub: 'AIRBNB\'S PHOTOS', s: 0.6 },
    { id: 'r_vanity', type: 'icon', x: 3330, y: 1780, icon: 'vanity_trophy', label: 'VANITY METRICS', s: 0.6 },
    { id: 'r_retention', type: 'icon', x: 3260, y: 1470, icon: 'retention_curve', label: 'RETENTION', s: 0.6 },
    { id: 'r_dropbox', type: 'icon', x: 3480, y: 2130, icon: 'demo_video_box', label: 'DROPBOX DEMO VIDEO', sub: '5,000 → 75,000', s: 0.6 },
    { id: 'x_slack', type: 'icon', x: 3800, y: 560, icon: 'game_to_chat', label: 'EXIT: SLACK', sub: 'FROM A FAILED GAME', s: 0.6 },
    { id: 'x_insta', type: 'icon', x: 4060, y: 2170, icon: 'polaroid_camera', label: 'EXIT: INSTAGRAM', sub: 'FROM BURBN', s: 0.6 },

    // MILESTONES
    { id: 'm_ramen', type: 'icon', x: 4470, y: 1600, icon: 'ramen_bowl', label: 'RAMEN PROFITABLE', sub: 'PAUL GRAHAM', s: 0.6 },
    { id: 'm_alive', type: 'icon', x: 4200, y: 1850, icon: 'heartbeat', label: 'DEFAULT ALIVE', s: 0.55 },

    // MOUNTAIN
    { id: 'mountain_label', type: 'label', x: 5150, y: 2330, text: 'THE MOUNTAIN OF GETTING THINGS DONE', style: 'region', size: 60, fill: '#e3c193' },
    { id: 'pm_waterfall', type: 'icon', x: 5800, y: 1650, icon: 'waterfall_steps', label: 'WATERFALL', sub: 'ROYCE, 1970', s: 0.7 },
    { id: 'pm_agile', type: 'icon', x: 4560, y: 1780, icon: 'manifesto_mountain', label: 'AGILE: SWITCHBACKS', sub: 'UTAH, 2001', s: 0.6 },
    { id: 'pm_scrum', type: 'icon', x: 4600, y: 1300, icon: 'sprint_cycle', label: 'SCRUM', s: 0.6 },
    { id: 'pm_kanban', type: 'icon', x: 5850, y: 1250, icon: 'kanban_board', label: 'KANBAN', s: 0.6 },
    { id: 'pm_shapeup', type: 'icon', x: 5800, y: 930, icon: 'calendar_6weeks', label: 'SHAPE UP', sub: '6 WEEKS, CUT SCOPE', s: 0.6 },
    { id: 'pm_rice', type: 'icon', x: 4750, y: 900, icon: 'rice_bowl', label: 'RICE SCORE', s: 0.6 },
    { id: 'pm_okr', type: 'icon', x: 5000, y: 560, icon: 'okr_target', label: 'OKRs', s: 0.5 },
    { id: 'w_parkinson', type: 'icon', x: 5250, y: 1820, icon: 'warning_sign', label: 'PARKINSON\'S LAW', s: 0.5 },
    { id: 'w_brooks', type: 'icon', x: 5300, y: 1450, icon: 'warning_sign', label: 'BROOKS\'S LAW', s: 0.5 },
    { id: 'w_pareto', type: 'icon', x: 5250, y: 1130, icon: 'pareto_bar', label: '80/20', s: 0.5 },
    { id: 'summit', type: 'icon', x: 5300, y: 360, icon: 'summit_flag', s: 0.55 },

    // FOG
    { id: 'fog_label', type: 'label', x: 5150, y: 1760, text: 'THE FOG OF LUCK & TIMING', style: 'region', size: 60, fill: '#eef0f3' },
    { id: 'fg_gross', type: 'icon', x: 4700, y: 2130, icon: 'timing_bars', label: 'TIMING MATTERS MOST', sub: 'BILL GROSS', s: 0.55 },
    { id: 'fg_early', type: 'icon', x: 5650, y: 2130, icon: 'early_calendar', label: 'TOO EARLY = WRONG', s: 0.55 },
    { id: 'fg_survive', type: 'note', x: 5150, y: 2210, text: 'STAY ON THE ROAD LONG ENOUGH TO GET LUCKY' },

    // DESTINATIONS
    { id: 'dest_unicorn', type: 'icon', x: 6150, y: 330, icon: 'city_skyline', label: 'UNICORN CITY', sub: 'GROW AT ALL COSTS', s: 0.7 },
    { id: 'dest_calm', type: 'icon', x: 6150, y: 1100, icon: 'cottage', label: 'A CALM COMPANY', sub: 'PROFITABLE · SUSTAINABLE', s: 0.7 },

    // SCENERY (always visible, placed on empty grass)
    { id: 'tree_1', type: 'icon', x: 2050, y: 450, icon: 'tree', s: 0.6, withRegion: '*' },
    { id: 'tree_2', type: 'icon', x: 2350, y: 300, icon: 'tree', s: 0.55, withRegion: '*' },
    { id: 'tree_3', type: 'icon', x: 3350, y: 400, icon: 'tree', s: 0.6, withRegion: '*' },
    { id: 'tree_4', type: 'icon', x: 4150, y: 300, icon: 'tree', s: 0.5, withRegion: '*' },
    { id: 'tree_5', type: 'icon', x: 4550, y: 450, icon: 'tree', s: 0.55, withRegion: '*' },
    { id: 'tree_6', type: 'icon', x: 2000, y: 3150, icon: 'tree', s: 0.6, withRegion: '*' },
    { id: 'pine_2', type: 'icon', x: 5950, y: 2200, icon: 'pine_tree', s: 0.55, withRegion: '*' },

    // SIGNATURE
    { id: 'sig', type: 'cloudtext', x: 2700, y: 130, text: 'THE MAP OF BOOTSTRAPPING · 2026', size: 44, plain: true }
  ]
};
