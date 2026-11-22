/* map_layout.js: world map regions and items (world units, 6400 x 3600).
 * Items: type "icon" {icon, label, sub, s}; type "label" {text, style, fill, sub, size};
 * type "note" {text}; type "circle" {r, fill}; type "cloudtext" {text, size, plain}.
 */
window.LAYOUT = {
  regions: {
    strategy: { color: '#b58ad6', points: [[0, 0], [2550, 0], [2620, 500], [2600, 950], [2350, 1500], [1700, 1950], [900, 1940], [0, 2000]] },
    brand:    { color: '#f2a1b8', points: [[2550, 0], [4250, 0], [4150, 650], [3700, 1150], [3050, 1100], [2600, 950], [2620, 500]] },
    paid:     { color: '#7fb3e0', points: [[4250, 0], [6400, 0], [6400, 1140], [5300, 1180], [4500, 1120], [3700, 1150], [4150, 650]] },
    owned:    { color: '#95cbe9', points: [[3700, 1150], [4500, 1120], [5300, 1180], [6400, 1140], [6400, 1750], [4150, 1700]] },
    earned:   { color: '#b3dfe8', points: [[4150, 1700], [6400, 1750], [6400, 2300], [4700, 2300]] },
    growth:   { color: '#8fd1a6', points: [[0, 2000], [900, 1940], [1700, 1950], [2350, 1500], [2600, 950], [3050, 1100], [3700, 1150], [4150, 1700], [4700, 2300], [4500, 2850], [0, 2850]] },
    fog:      { color: '#b9bcc4', points: [[4700, 2300], [6400, 2300], [6400, 2850], [4500, 2850]] },
    bedrock:  { color: '#9c8468', points: [[0, 2850], [4500, 2850], [6400, 2850], [6400, 3600], [0, 3600]] }
  },
  items: [
    // ORIGINS
    { id: 'origins_circle', type: 'circle', x: 3050, y: 1480, r: 440, fill: '#d8a657' },
    { id: 'origins_label', type: 'label', x: 3050, y: 1915, text: 'ORIGINS', style: 'region', fill: '#f39c12', size: 80 },
    { id: 'o_market', type: 'icon', x: 2880, y: 1230, icon: 'market_stall', label: 'MARKETS', s: 0.8 },
    { id: 'o_fish', type: 'icon', x: 3200, y: 1200, icon: 'fish_shout', s: 0.8 },
    { id: 'o_pompeii', type: 'icon', x: 2760, y: 1460, icon: 'painted_wall', label: 'POMPEII', sub: '79 AD', s: 0.8 },
    { id: 'o_caxton', type: 'icon', x: 3340, y: 1420, icon: 'printing_press', label: 'PRINTED ADS', sub: 'CAXTON, C.1477', s: 0.8 },
    { id: 'o_radio', type: 'icon', x: 2830, y: 1690, icon: 'radio', label: 'RADIO', sub: '1920s', s: 0.7 },
    { id: 'o_tv', type: 'icon', x: 3060, y: 1660, icon: 'tv_watch', label: 'FIRST TV AD', sub: '1941 · $9', s: 0.7 },
    { id: 'o_banner', type: 'icon', x: 3300, y: 1680, icon: 'banner_ad', label: 'BANNER AD', sub: '1994 · 44% CLICKED', s: 0.7 },

    // REGION TITLES
    { id: 'strategy_label', type: 'label', x: 1000, y: 230, text: 'STRATEGY', style: 'region', size: 150, stroke: 9, px: 40, py: 16 },
    { id: 'brand_label', type: 'label', x: 3330, y: 200, text: 'BRAND', style: 'region', size: 150, stroke: 9, px: 40, py: 16 },
    { id: 'channels_label', type: 'label', x: 4700, y: 200, text: 'CHANNELS', style: 'region', size: 150, stroke: 9, px: 40, py: 16 },
    { id: 'growth_label', type: 'label', x: 1150, y: 2010, text: 'GROWTH', style: 'region', size: 150, stroke: 9, px: 40, py: 16 },
    { id: 'c_paid_label', type: 'label', x: 4560, y: 560, text: 'PAID MEDIA', style: 'sublabel', size: 70, stroke: 6 },
    { id: 'c_owned_label', type: 'label', x: 4520, y: 1240, text: 'OWNED MEDIA', style: 'sublabel', size: 70, stroke: 6 },
    { id: 'c_earned_label', type: 'label', x: 4880, y: 1840, text: 'EARNED MEDIA', style: 'sublabel', size: 70, stroke: 6 },

    // STRATEGY
    { id: 's_research', type: 'icon', x: 380, y: 520, icon: 'clipboard_magnifier', label: 'MARKET RESEARCH', sub: 'SURVEYS · INTERVIEWS' },
    { id: 's_saydo', type: 'icon', x: 760, y: 700, icon: 'say_do', label: 'SAY ≠ DO' },
    { id: 's_segment', type: 'icon', x: 1250, y: 500, icon: 'crowd_groups', label: 'SEGMENTATION' },
    { id: 's_target', type: 'icon', x: 1700, y: 520, icon: 'target', label: 'TARGETING' },
    { id: 's_position', type: 'icon', x: 2150, y: 620, icon: 'position_map', label: 'POSITIONING', sub: 'RIES & TROUT, 1970s' },
    { id: 's_stp', type: 'icon', x: 1650, y: 880, icon: 'stp_arrows', label: 'STP', s: 0.9 },
    { id: 's_jtbd', type: 'icon', x: 480, y: 1180, icon: 'drill_hole', label: 'JOBS TO BE DONE', sub: 'NOBODY WANTS A DRILL,\nTHEY WANT A HOLE' },
    { id: 's_4p_title', type: 'label', x: 1300, y: 1060, text: 'THE 4 P\'s', style: 'box', sub: 'McCARTHY, 1960' },
    { id: 's_p_product', type: 'icon', x: 1110, y: 1270, icon: 'box_product', label: 'PRODUCT', s: 0.8 },
    { id: 's_p_price', type: 'icon', x: 1460, y: 1270, icon: 'price_tag', label: 'PRICE', s: 0.8 },
    { id: 's_p_place', type: 'icon', x: 1110, y: 1540, icon: 'shop', label: 'PLACE', s: 0.8 },
    { id: 's_p_promo', type: 'icon', x: 1460, y: 1540, icon: 'megaphone', label: 'PROMOTION', s: 0.8 },
    { id: 's_quarter', type: 'note', x: 1560, y: 1700, text: '↑ ONLY 1/4 OF THE TOOLBOX!' },
    { id: 's_99', type: 'icon', x: 1920, y: 1130, icon: 'price_99', label: 'CHARM PRICING', s: 0.85 },
    { id: 's_decoy', type: 'icon', x: 2000, y: 1420, icon: 'decoy_cups', label: 'DECOY EFFECT', s: 0.85 },

    // BRAND
    { id: 'b_head', type: 'icon', x: 2960, y: 440, icon: 'head_memories', label: 'BRAND IMAGE', sub: 'MEMORIES + FEELINGS' },
    { id: 'b_identity', type: 'icon', x: 3400, y: 420, icon: 'palette_logo', label: 'VISUAL IDENTITY' },
    { id: 'b_voice', type: 'icon', x: 3820, y: 440, icon: 'speech_voice', label: 'BRAND VOICE' },
    { id: 'b_equity', type: 'icon', x: 3020, y: 800, icon: 'two_shoes', label: 'BRAND EQUITY' },
    { id: 'b_sharp', type: 'icon', x: 3440, y: 790, icon: 'brain_shelf', label: 'MENTAL + PHYSICAL\nAVAILABILITY', sub: 'BYRON SHARP' },
    { id: 'b_remind', type: 'icon', x: 3560, y: 1050, icon: 'memory_fade', label: 'KEEP REMINDING', s: 0.7 },
    { id: 'b_story', type: 'icon', x: 3880, y: 780, icon: 'book_campfire', label: 'STORIES', s: 0.85 },

    // CHANNELS
    { id: 'c_trad', type: 'icon', x: 4800, y: 830, icon: 'trad_media', label: 'TRADITIONAL', sub: 'PRINT · RADIO · TV · BILLBOARDS' },
    { id: 'c_search', type: 'icon', x: 5250, y: 780, icon: 'search_ad', label: 'SEARCH ADS' },
    { id: 'c_social', type: 'icon', x: 5660, y: 800, icon: 'phone_feed', label: 'DISPLAY & SOCIAL ADS', sub: 'TARGETED WITH DATA' },
    { id: 'c_influencer', type: 'icon', x: 6080, y: 860, icon: 'influencer', label: 'INFLUENCERS', s: 0.9 },
    { id: 'c_website', type: 'icon', x: 4750, y: 1390, icon: 'browser_window', label: 'WEBSITE', s: 0.85 },
    { id: 'c_email', type: 'icon', x: 5100, y: 1390, icon: 'envelope', label: 'EMAIL LIST', s: 0.85 },
    { id: 'c_content', type: 'icon', x: 5460, y: 1370, icon: 'content_play', label: 'CONTENT', sub: 'BLOGS · VIDEOS · PODCASTS', s: 0.85 },
    { id: 'c_seo', type: 'icon', x: 5920, y: 1390, icon: 'seo', label: 'SEO', s: 0.85 },
    { id: 'c_contentmkt', type: 'icon', x: 5250, y: 1620, icon: 'gift_trust', label: 'CONTENT MARKETING', sub: 'GIVE VALUE, EARN TRUST', s: 0.7 },
    { id: 'c_thisvideo', type: 'note', x: 5800, y: 1640, text: '← LIKE THIS VIDEO!' },
    { id: 'c_pr', type: 'icon', x: 5250, y: 1960, icon: 'newspaper_headline', label: 'PR', s: 0.8 },
    { id: 'c_reviews', type: 'icon', x: 5650, y: 1930, icon: 'stars', label: 'REVIEWS', s: 0.8 },
    { id: 'c_wom', type: 'icon', x: 6070, y: 1980, icon: 'two_people_talking', label: 'WORD OF MOUTH', s: 0.8 },
    { id: 'c_viral', type: 'icon', x: 5520, y: 2170, icon: 'viral_network', label: 'GOING VIRAL', s: 0.6 },

    // GROWTH
    { id: 'g_funnel', type: 'icon', x: 950, y: 2380, icon: 'funnel_aida', label: 'THE FUNNEL', sub: 'AIDA · ST. ELMO LEWIS, 1898', s: 1.5 },
    { id: 'g_few', type: 'note', x: 1330, y: 2560, text: '← ONLY A FEW BECOME CUSTOMERS' },
    { id: 'g_after', type: 'icon', x: 560, y: 2700, icon: 'loop_arrow', label: 'RETENTION', sub: 'CHEAPER THAN FINDING NEW ONES', s: 0.75 },
    { id: 'g_pirate', type: 'icon', x: 1750, y: 2330, icon: 'pirate_flag', label: 'PIRATE METRICS', sub: 'ACQUISITION · ACTIVATION\nRETENTION · REFERRAL · REVENUE' },
    { id: 'g_cacltv', type: 'icon', x: 2450, y: 2320, icon: 'scales_cac_ltv', label: 'CAC vs LTV' },
    { id: 'g_problem', type: 'note', x: 2470, y: 2620, text: 'LTV MUST BEAT CAC!' },
    { id: 'g_cro', type: 'icon', x: 3050, y: 2230, icon: 'percent_up', label: 'CONVERSION RATE\nOPTIMISATION', s: 0.85 },
    { id: 'g_ab', type: 'icon', x: 3480, y: 2430, icon: 'ab_test', label: 'A/B TESTING' },
    { id: 'g_science', type: 'icon', x: 3880, y: 2330, icon: 'beaker', label: 'EXPERIMENTS', sub: 'HYPOTHESIS · DATA · STATS', s: 0.85 },
    { id: 'g_lifecycle', type: 'icon', x: 4230, y: 2580, icon: 'loyalty', label: 'LIFECYCLE MARKETING', s: 0.8 },
    { id: 'g_6040', type: 'icon', x: 2150, y: 1800, icon: 'pie_6040', label: 'BRAND vs ACTIVATION', sub: 'BINET & FIELD: 60 / 40', s: 0.8 },

    // HUMAN MIND (bedrock)
    { id: 'm_label', type: 'label', x: 3200, y: 2960, text: 'THE HUMAN MIND', style: 'region', fill: '#e3c193', size: 130 },
    { id: 'm_cialdini', type: 'label', x: 1500, y: 3110, text: 'CIALDINI\'S 6 PRINCIPLES', style: 'box', sub: '1984' },
    { id: 'm_recip', type: 'icon', x: 650, y: 3330, icon: 'gift', label: 'RECIPROCITY', s: 0.75 },
    { id: 'm_commit', type: 'icon', x: 1000, y: 3330, icon: 'pen_sign', label: 'COMMITMENT', s: 0.75 },
    { id: 'm_social', type: 'icon', x: 1350, y: 3330, icon: 'crowd_thumbs', label: 'SOCIAL PROOF', s: 0.75 },
    { id: 'm_authority', type: 'icon', x: 1700, y: 3330, icon: 'doctor', label: 'AUTHORITY', s: 0.75 },
    { id: 'm_liking', type: 'icon', x: 2050, y: 3330, icon: 'heart_smile', label: 'LIKING', s: 0.75 },
    { id: 'm_scarcity', type: 'icon', x: 2400, y: 3330, icon: 'hourglass', label: 'SCARCITY', s: 0.75 },
    { id: 'm_loss', type: 'icon', x: 3700, y: 3260, icon: 'scales_loss', label: 'LOSS AVERSION', sub: 'KAHNEMAN & TVERSKY', s: 0.9 },
    { id: 'm_exposure', type: 'icon', x: 4550, y: 3260, icon: 'eyes_heart', label: 'MERE EXPOSURE EFFECT', s: 0.9 },
    { id: 'm_systems', type: 'icon', x: 5450, y: 3260, icon: 'hare_tortoise', label: 'SYSTEM 1 & SYSTEM 2', s: 0.9 },

    // FOG
    { id: 'f_label', type: 'label', x: 5450, y: 2400, text: 'THE FOG OF ATTRIBUTION', style: 'region', fill: '#e8eaee', size: 90 },
    { id: 'f_quote', type: 'icon', x: 4980, y: 2590, icon: 'quote_bubble', label: 'JOHN WANAMAKER (SUPPOSEDLY)', s: 0.8 },
    { id: 'f_path', type: 'icon', x: 5900, y: 2580, icon: 'journey', label: 'WHO GETS THE CREDIT?', s: 0.8 },
    { id: 'f_models', type: 'label', x: 5500, y: 2790, text: 'FIRST CLICK · LAST CLICK · MARKETING MIX MODELLING', style: 'box', size: 26 },

    // ETHICS (cloud floats above channels, top-right)
    { id: 'e_cloud', type: 'icon', x: 5770, y: 280, icon: 'cloud', s: 1 },
    { id: 'e_label', type: 'cloudtext', x: 5770, y: 195, text: 'ETHICS', size: 110 },
    { id: 'e_line', type: 'label', x: 5450, y: 250, text: 'PERSUASION OR MANIPULATION?', style: 'box', size: 30 },
    { id: 'e_privacy', type: 'label', x: 6110, y: 250, text: 'PRIVACY · GDPR', style: 'box', size: 30 },
    { id: 'e_dark', type: 'icon', x: 5450, y: 390, icon: 'mini_maze', label: 'DARK PATTERNS', s: 0.45 },
    { id: 'e_ai', type: 'icon', x: 6110, y: 390, icon: 'mini_robot', label: 'AI-MADE ADS', s: 0.45 },

    // OUTRO
    { id: 'sig', type: 'cloudtext', x: 5960, y: 3330, text: 'THE MAP OF MARKETING · 2026', size: 36, plain: true }
  ]
};
