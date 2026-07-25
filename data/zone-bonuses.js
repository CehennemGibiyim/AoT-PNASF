// AoT-PNASF — Albion Online Zone & Crafting Bonus Veritabanı v2
// Kaynak: Albion Online Wiki + ao-bin-dumps + avalonroads community data

window.AO_ZONE_BONUSES = {

  // ══════════════════════════════════════════
  // ROYAL CITIES (Blue Zone — Safe)
  // ══════════════════════════════════════════
  cities: [
    {
      id: 'CITY_CAERLEON',
      name: 'Caerleon',
      zone: 'SAFEAREA',
      color: '#3b82f6',
      icon: '🏰',
      description: 'Kraliyet şehirlerinin merkezi. Tüm bölgelere erişim sağlar.',
      bonuses: [
        { type: 'info', label: 'Market Erişimi', value: '5 Şehir', icon: '📦', note: 'Tüm kraliyet şehirleri marketlerine erişim' },
        { type: 'info', label: 'Özellik', value: 'Black Market Hub', icon: '💹', note: 'Caerleon Black Market en karlı trade noktasıdır' },
      ],
      resources: ['Wood', 'Ore', 'Stone', 'Fibre', 'Hide'],
      tier: 'Royal City', pvp: false, hasMap: false,
    },
    {
      id: 'CITY_THETFORD',
      name: 'Thetford',
      zone: 'SAFEAREA',
      color: '#22c55e',
      icon: '🌲',
      region: 'Swamp (Bataklık)',
      description: 'Bataklık bölgesi. Deri ve Fiber işleme konusunda uzmanlaşmış şehir.',
      bonuses: [
        { type: 'craft', label: 'Leather Armor', value: '+40%', icon: '🛡️', note: 'Deri zırh üretiminde bonus' },
        { type: 'craft', label: 'Nature Staff', value: '+40%', icon: '🌿', note: 'Doğa asası üretiminde bonus' },
        { type: 'craft', label: 'Fishing Rod', value: '+40%', icon: '🎣', note: 'Balıkçı oltası' },
        { type: 'refine', label: 'Fibre Rafine', value: '+36%', icon: '🧵', note: 'Pamuk ve iplik rafine bonusu' },
        { type: 'refine', label: 'Hide Rafine', value: '+36%', icon: '🐂', note: 'Ham deri rafine bonusu' },
      ],
      resources: ['Fibre', 'Hide', 'Wood'],
      tier: 'Royal City', pvp: false, hasMap: false,
    },
    {
      id: 'CITY_FORT_STERLING',
      name: 'Fort Sterling',
      zone: 'SAFEAREA',
      color: '#94a3b8',
      icon: '⛰️',
      region: 'Mountain (Dağ)',
      description: 'Dağ bölgesi. Metal ve Taş işleme konusunda en verimli şehir.',
      bonuses: [
        { type: 'craft', label: 'Plate Armor', value: '+40%', icon: '🛡️', note: 'Plaka zırh üretiminde bonus' },
        { type: 'craft', label: 'Hammer', value: '+40%', icon: '🔨', note: 'Çekiç silah bonus' },
        { type: 'craft', label: 'Crossbow', value: '+40%', icon: '🏹', note: 'Arbalet bonus' },
        { type: 'refine', label: 'Ore Rafine', value: '+36%', icon: '⛏️', note: 'Metal rafine bonusu' },
        { type: 'refine', label: 'Stone Rafine', value: '+36%', icon: '🪨', note: 'Taş rafine bonusu' },
      ],
      resources: ['Ore', 'Stone'],
      tier: 'Royal City', pvp: false, hasMap: false,
    },
    {
      id: 'CITY_MARTLOCK',
      name: 'Martlock',
      zone: 'SAFEAREA',
      color: '#a855f7',
      icon: '🏔️',
      region: 'Highland (Dağlık)',
      description: 'Dağlık bölge. Ağır zırh ve baltalar için en iyi şehir.',
      bonuses: [
        { type: 'craft', label: 'Axe', value: '+40%', icon: '🪓', note: 'Balta silahları bonusu' },
        { type: 'craft', label: 'Plate Armor', value: '+40%', icon: '🛡️', note: 'Plaka zırh bonus' },
        { type: 'craft', label: 'Mace', value: '+40%', icon: '⚔️', note: 'Gürz tipi silahlar' },
        { type: 'refine', label: 'Ore Rafine', value: '+36%', icon: '⛏️', note: 'Metal rafine bonusu' },
        { type: 'refine', label: 'Hide Rafine', value: '+36%', icon: '🐂', note: 'Deri rafine bonusu' },
      ],
      resources: ['Ore', 'Stone', 'Hide'],
      tier: 'Royal City', pvp: false, hasMap: false,
    },
    {
      id: 'CITY_BRIDGEWATCH',
      name: 'Bridgewatch',
      zone: 'SAFEAREA',
      color: '#14b8a6',
      icon: '🏞️',
      region: 'Steppe (Step)',
      description: 'Step bölgesi. Yaylı silahlar ve ateş için özel bonuslar.',
      bonuses: [
        { type: 'craft', label: 'Bow', value: '+40%', icon: '🏹', note: 'Yay silahları bonusu' },
        { type: 'craft', label: 'Fire Staff', value: '+40%', icon: '🔥', note: 'Ateş asası bonus' },
        { type: 'craft', label: 'Sword', value: '+40%', icon: '⚔️', note: 'Kılıç tipi silahlar' },
        { type: 'refine', label: 'Hide Rafine', value: '+36%', icon: '🐂', note: 'Deri rafine bonusu' },
        { type: 'refine', label: 'Ore Rafine', value: '+36%', icon: '⛏️', note: 'Metal rafine bonusu' },
      ],
      resources: ['Hide', 'Fibre', 'Ore'],
      tier: 'Royal City', pvp: false, hasMap: false,
    },
    {
      id: 'CITY_LYMHURST',
      name: 'Lymhurst',
      zone: 'SAFEAREA',
      color: '#4ade80',
      icon: '🌳',
      region: 'Forest (Orman)',
      description: 'Orman şehri. Kumaş zırh ve büyü silahları üretim merkezi.',
      bonuses: [
        { type: 'craft', label: 'Cloth Armor', value: '+40%', icon: '👘', note: 'Kumaş zırh üretim bonusu' },
        { type: 'craft', label: 'Dagger', value: '+40%', icon: '🗡️', note: 'Hançer silahları bonusu' },
        { type: 'craft', label: 'Nature / Holy Staff', value: '+40%', icon: '🔮', note: 'Tüm asa çeşitleri' },
        { type: 'refine', label: 'Fibre Rafine', value: '+36%', icon: '🧵', note: 'İplik rafine bonusu' },
        { type: 'refine', label: 'Wood Rafine', value: '+36%', icon: '🪵', note: 'Tahta rafine bonusu' },
      ],
      resources: ['Wood', 'Fibre'],
      tier: 'Royal City', pvp: false, hasMap: false,
    },
    {
      id: 'CITY_BRECILIEN',
      name: 'Brecilien',
      zone: 'MIST',
      color: '#06b6d4',
      icon: '🌫️',
      region: 'Mist (Sis)',
      description: 'Gizemli Mist şehri. Özel ekipmanlara ve eşsiz bonuslara sahiptir.',
      bonuses: [
        { type: 'craft', label: 'Avalonian Equipment', value: '+40%', icon: '✨', note: 'Mist/Avalon eşyaları özel bonusu' },
        { type: 'craft', label: 'Tome Craft', value: '+40%', icon: '📖', note: 'Kitap/Tome üretim bonusu' },
        { type: 'info', label: 'Erişim', value: 'Mist Portal', icon: '🌀', note: 'Sadece mist portalından erişilir' },
      ],
      resources: ['Mist Resources'],
      tier: 'Mist City', pvp: false, hasMap: false,
    },
  ],

  // ══════════════════════════════════════════
  // ROADS OF AVALON — Detaylı Harita Verisi
  // Kaynak: Albion Online Wiki + ao-bin-dumps
  // Harita Tipleri: Crossroads | Corridor | Sanctuary | Rest (Hideout)
  // Kapasite: 2p (Yeşil Portal) | 7p (Mavi Portal) | 20p (Sarı Portal)
  // Tier: T4-T8
  // ══════════════════════════════════════════
  avalonRoads: [

    // ══════════════════════════════════════
    // 2-PLAYER ROADS (Yeşil Portal)
    // ══════════════════════════════════════

    // --- 2p T4 ---
    { id:'ROAD_2P_T4_CROSS', name:'Avalon Crossroads (2p · T4)', mapType:'Crossroads', zone:'ROAD', color:'#8b5cf6', tier:4, capacity:'2 Oyuncu', icon:'🟣',
      chests:[{ type:'Solo Chest', count:1, tier:4, icon:'📦', loot:'T4 solo loot, küçük eşya' }],
      resources:[{ name:'Wood', tier:4, count:'2-3 node' },{ name:'Ore', tier:4, count:'2-3 node' }],
      bonuses:[{ type:'fame', label:'Fame Bonusu', value:'+50%', icon:'⭐' },{ type:'info', label:'Kapasite', value:'2 Oyuncu (Yeşil Portal)', icon:'👤' }],
      pvp:true, fullLoot:true, exits:2, mapImage:'road_2p' },

    { id:'ROAD_2P_T4_CORR', name:'Avalon Corridor (2p · T4)', mapType:'Corridor', zone:'ROAD', color:'#8b5cf6', tier:4, capacity:'2 Oyuncu', icon:'🟣',
      chests:[{ type:'Solo Chest', count:1, tier:4, icon:'📦', loot:'T4 solo loot' }],
      resources:[{ name:'Fibre', tier:4, count:'2-3 node' }],
      bonuses:[{ type:'fame', label:'Fame Bonusu', value:'+50%', icon:'⭐' },{ type:'info', label:'Kapasite', value:'2 Oyuncu', icon:'👤' }],
      pvp:true, fullLoot:true, exits:2, mapImage:'road_2p' },

    { id:'ROAD_2P_T4_SANC', name:'Avalon Sanctuary (2p · T4)', mapType:'Sanctuary', zone:'ROAD', color:'#8b5cf6', tier:4, capacity:'2 Oyuncu', icon:'🟣',
      chests:[{ type:'Solo Chest', count:2, tier:4, icon:'📦', loot:'T4 solo loot' }],
      resources:[{ name:'Stone', tier:4, count:'3-4 node' },{ name:'Wood', tier:4, count:'2-3 node' }],
      bonuses:[{ type:'fame', label:'Fame Bonusu', value:'+50%', icon:'⭐' },{ type:'info', label:'Çıkış', value:'1 Portal (Dar)', icon:'🚪' }],
      pvp:true, fullLoot:true, exits:1, mapImage:'road_2p' },

    { id:'ROAD_2P_T4_REST', name:'Avalon Rest / Hideout (2p · T4)', mapType:'Rest (Hideout)', zone:'ROAD', color:'#8b5cf6', tier:4, capacity:'2 Oyuncu', icon:'🟣',
      chests:[{ type:'Solo Chest', count:1, tier:4, icon:'📦', loot:'T4 solo loot' },{ type:'Small Group Chest', count:1, tier:4, icon:'🗃️', loot:'T4 grup' }],
      resources:[{ name:'Hide', tier:4, count:'2-4 node' }],
      bonuses:[{ type:'fame', label:'Fame Bonusu', value:'+50%', icon:'⭐' },{ type:'info', label:'Hideout', value:'Kurulabilir', icon:'🏠' }],
      pvp:true, fullLoot:true, exits:1, mapImage:'road_2p' },

    // --- 2p T5 ---
    { id:'ROAD_2P_T5_CROSS', name:'Avalon Crossroads (2p · T5)', mapType:'Crossroads', zone:'ROAD', color:'#8b5cf6', tier:5, capacity:'2 Oyuncu', icon:'🟣',
      chests:[{ type:'Solo Chest', count:1, tier:5, icon:'📦', loot:'T5 solo loot' },{ type:'Small Group Chest', count:1, tier:5, icon:'🗃️', loot:'T5 grup loot' }],
      resources:[{ name:'Wood', tier:5, count:'3-5 node' },{ name:'Fibre', tier:5, count:'2-4 node' }],
      bonuses:[{ type:'fame', label:'Fame Bonusu', value:'+50%', icon:'⭐' },{ type:'info', label:'Kapasite', value:'2 Oyuncu', icon:'👤' }],
      pvp:true, fullLoot:true, exits:2, mapImage:'road_2p' },

    { id:'ROAD_2P_T5_CORR', name:'Avalon Corridor (2p · T5)', mapType:'Corridor', zone:'ROAD', color:'#8b5cf6', tier:5, capacity:'2 Oyuncu', icon:'🟣',
      chests:[{ type:'Solo Chest', count:2, tier:5, icon:'📦', loot:'T5 solo loot' }],
      resources:[{ name:'Ore', tier:5, count:'3-5 node' }],
      bonuses:[{ type:'fame', label:'Fame Bonusu', value:'+50%', icon:'⭐' }],
      pvp:true, fullLoot:true, exits:2, mapImage:'road_2p' },

    { id:'ROAD_2P_T5_SANC', name:'Avalon Sanctuary (2p · T5)', mapType:'Sanctuary', zone:'ROAD', color:'#8b5cf6', tier:5, capacity:'2 Oyuncu', icon:'🟣',
      chests:[{ type:'Solo Chest', count:2, tier:5, icon:'📦', loot:'T5 solo loot' },{ type:'Small Group Chest', count:1, tier:5, icon:'🗃️', loot:'T5 grup' }],
      resources:[{ name:'Hide', tier:5, count:'3-5 node' },{ name:'Stone', tier:5, count:'2-3 node' }],
      bonuses:[{ type:'fame', label:'Fame Bonusu', value:'+50%', icon:'⭐' }],
      pvp:true, fullLoot:true, exits:1, mapImage:'road_2p' },

    { id:'ROAD_2P_T5_REST', name:'Avalon Rest / Hideout (2p · T5)', mapType:'Rest (Hideout)', zone:'ROAD', color:'#8b5cf6', tier:5, capacity:'2 Oyuncu', icon:'🟣',
      chests:[{ type:'Solo Chest', count:2, tier:5, icon:'📦', loot:'T5 solo loot' },{ type:'Small Group Chest', count:1, tier:5, icon:'🗃️', loot:'T5 grup' }],
      resources:[{ name:'Fibre', tier:5, count:'3-5 node' }],
      bonuses:[{ type:'fame', label:'Fame Bonusu', value:'+50%', icon:'⭐' },{ type:'info', label:'Hideout', value:'Kurulabilir', icon:'🏠' }],
      pvp:true, fullLoot:true, exits:1, mapImage:'road_2p' },

    // --- 2p T6 ---
    { id:'ROAD_2P_T6_CROSS', name:'Avalon Crossroads (2p · T6)', mapType:'Crossroads', zone:'ROAD', color:'#8b5cf6', tier:6, capacity:'2 Oyuncu', icon:'🟣',
      chests:[{ type:'Solo Chest', count:2, tier:6, icon:'📦', loot:'T6 eşyalar' },{ type:'Veteran Chest', count:1, tier:6, icon:'🏆', loot:'T6 nadir' }],
      resources:[{ name:'Ore', tier:6, count:'4-7 node' },{ name:'Hide', tier:6, count:'2-5 node' }],
      bonuses:[{ type:'fame', label:'Fame Bonusu', value:'+50%', icon:'⭐' }],
      pvp:true, fullLoot:true, exits:2, mapImage:'road_2p' },

    { id:'ROAD_2P_T6_CORR', name:'Avalon Corridor (2p · T6)', mapType:'Corridor', zone:'ROAD', color:'#8b5cf6', tier:6, capacity:'2 Oyuncu', icon:'🟣',
      chests:[{ type:'Solo Chest', count:2, tier:6, icon:'📦', loot:'T6 solo' }],
      resources:[{ name:'Wood', tier:6, count:'4-6 node' }],
      bonuses:[{ type:'fame', label:'Fame Bonusu', value:'+50%', icon:'⭐' }],
      pvp:true, fullLoot:true, exits:2, mapImage:'road_2p' },

    { id:'ROAD_2P_T6_SANC', name:'Avalon Sanctuary (2p · T6)', mapType:'Sanctuary', zone:'ROAD', color:'#8b5cf6', tier:6, capacity:'2 Oyuncu', icon:'🟣',
      chests:[{ type:'Veteran Chest', count:2, tier:6, icon:'🏆', loot:'T6 nadir eşyalar' }],
      resources:[{ name:'Stone', tier:6, count:'4-7 node' },{ name:'Fibre', tier:6, count:'3-5 node' }],
      bonuses:[{ type:'fame', label:'Fame Bonusu', value:'+50%', icon:'⭐' }],
      pvp:true, fullLoot:true, exits:1, mapImage:'road_2p' },

    { id:'ROAD_2P_T6_REST', name:'Avalon Rest / Hideout (2p · T6)', mapType:'Rest (Hideout)', zone:'ROAD', color:'#8b5cf6', tier:6, capacity:'2 Oyuncu', icon:'🟣',
      chests:[{ type:'Solo Chest', count:2, tier:6, icon:'📦', loot:'T6 solo' },{ type:'Veteran Chest', count:1, tier:6, icon:'🏆', loot:'T6 veteran' }],
      resources:[{ name:'Hide', tier:6, count:'4-6 node' }],
      bonuses:[{ type:'fame', label:'Fame Bonusu', value:'+50%', icon:'⭐' },{ type:'info', label:'Hideout', value:'Kurulabilir', icon:'🏠' }],
      pvp:true, fullLoot:true, exits:1, mapImage:'road_2p' },

    // --- 2p T7 ---
    { id:'ROAD_2P_T7_CROSS', name:'Avalon Crossroads (2p · T7)', mapType:'Crossroads', zone:'ROAD', color:'#8b5cf6', tier:7, capacity:'2 Oyuncu', icon:'🟣',
      chests:[{ type:'Veteran Chest', count:2, tier:7, icon:'🏆', loot:'T7 nadir' },{ type:'Solo Chest', count:1, tier:7, icon:'📦', loot:'T7 solo' }],
      resources:[{ name:'Ore', tier:7, count:'4-8 node' },{ name:'Stone', tier:7, count:'3-5 node' }],
      bonuses:[{ type:'fame', label:'Fame Bonusu', value:'+50%', icon:'⭐' }],
      pvp:true, fullLoot:true, exits:2, mapImage:'road_2p' },

    { id:'ROAD_2P_T7_SANC', name:'Avalon Sanctuary (2p · T7)', mapType:'Sanctuary', zone:'ROAD', color:'#8b5cf6', tier:7, capacity:'2 Oyuncu', icon:'🟣',
      chests:[{ type:'Veteran Chest', count:3, tier:7, icon:'🏆', loot:'T7 nadir eşyalar' }],
      resources:[{ name:'Hide', tier:7, count:'4-8 node' },{ name:'Wood', tier:7, count:'3-5 node' }],
      bonuses:[{ type:'fame', label:'Fame Bonusu', value:'+50%', icon:'⭐' }],
      pvp:true, fullLoot:true, exits:1, mapImage:'road_2p' },

    { id:'ROAD_2P_T7_REST', name:'Avalon Rest / Hideout (2p · T7)', mapType:'Rest (Hideout)', zone:'ROAD', color:'#8b5cf6', tier:7, capacity:'2 Oyuncu', icon:'🟣',
      chests:[{ type:'Veteran Chest', count:2, tier:7, icon:'🏆', loot:'T7 veteran' },{ type:'Solo Chest', count:2, tier:7, icon:'📦', loot:'T7 solo' }],
      resources:[{ name:'Fibre', tier:7, count:'4-7 node' }],
      bonuses:[{ type:'fame', label:'Fame Bonusu', value:'+50%', icon:'⭐' },{ type:'info', label:'Hideout', value:'Kurulabilir', icon:'🏠' }],
      pvp:true, fullLoot:true, exits:1, mapImage:'road_2p' },

    // ══════════════════════════════════════
    // 7-PLAYER ROADS (Mavi Portal)
    // ══════════════════════════════════════

    // --- 7p T4 ---
    { id:'ROAD_7P_T4_CROSS', name:'Avalon Crossroads (7p · T4)', mapType:'Crossroads', zone:'ROAD', color:'#7c3aed', tier:4, capacity:'7 Oyuncu', icon:'🟣',
      chests:[{ type:'Group Chest', count:2, tier:4, icon:'🗃️', loot:'T4 grup loot' },{ type:'Solo Chest', count:1, tier:4, icon:'📦', loot:'T4 solo loot' }],
      resources:[{ name:'Wood', tier:4, count:'5-8 node' },{ name:'Ore', tier:4, count:'4-6 node' },{ name:'Stone', tier:4, count:'2-3 node' }],
      bonuses:[{ type:'fame', label:'Fame Bonusu', value:'+50%', icon:'⭐' },{ type:'info', label:'Kapasite', value:'7 Oyuncu (Mavi Portal)', icon:'👥' },{ type:'info', label:'Çıkış Sayısı', value:'3-4 Portal', icon:'🚪' }],
      pvp:true, fullLoot:true, exits:3, mapImage:'road_7p' },

    { id:'ROAD_7P_T4_CORR', name:'Avalon Corridor (7p · T4)', mapType:'Corridor', zone:'ROAD', color:'#7c3aed', tier:4, capacity:'7 Oyuncu', icon:'🟣',
      chests:[{ type:'Group Chest', count:1, tier:4, icon:'🗃️', loot:'T4 grup' },{ type:'Solo Chest', count:2, tier:4, icon:'📦', loot:'T4 solo' }],
      resources:[{ name:'Fibre', tier:4, count:'4-6 node' },{ name:'Hide', tier:4, count:'3-4 node' }],
      bonuses:[{ type:'fame', label:'Fame Bonusu', value:'+50%', icon:'⭐' },{ type:'info', label:'Kapasite', value:'7 Oyuncu', icon:'👥' }],
      pvp:true, fullLoot:true, exits:3, mapImage:'road_7p' },

    { id:'ROAD_7P_T4_SANC', name:'Avalon Sanctuary (7p · T4)', mapType:'Sanctuary', zone:'ROAD', color:'#7c3aed', tier:4, capacity:'7 Oyuncu', icon:'🟣',
      chests:[{ type:'Group Chest', count:3, tier:4, icon:'🗃️', loot:'T4 grup loot' },{ type:'Solo Chest', count:2, tier:4, icon:'📦', loot:'T4 solo' }],
      resources:[{ name:'Stone', tier:4, count:'5-8 node' },{ name:'Ore', tier:4, count:'4-6 node' }],
      bonuses:[{ type:'fame', label:'Fame Bonusu', value:'+50%', icon:'⭐' }],
      pvp:true, fullLoot:true, exits:2, mapImage:'road_7p' },

    { id:'ROAD_7P_T4_REST', name:'Avalon Rest / Hideout (7p · T4)', mapType:'Rest (Hideout)', zone:'ROAD', color:'#7c3aed', tier:4, capacity:'7 Oyuncu', icon:'🟣',
      chests:[{ type:'Group Chest', count:2, tier:4, icon:'🗃️', loot:'T4 grup' },{ type:'Solo Chest', count:2, tier:4, icon:'📦', loot:'T4 solo' }],
      resources:[{ name:'Wood', tier:4, count:'4-7 node' }],
      bonuses:[{ type:'fame', label:'Fame Bonusu', value:'+50%', icon:'⭐' },{ type:'info', label:'Hideout', value:'Kurulabilir', icon:'🏠' }],
      pvp:true, fullLoot:true, exits:2, mapImage:'road_7p' },

    // --- 7p T5 ---
    { id:'ROAD_7P_T5_CROSS', name:'Avalon Crossroads (7p · T5)', mapType:'Crossroads', zone:'ROAD', color:'#7c3aed', tier:5, capacity:'7 Oyuncu', icon:'🟣',
      chests:[{ type:'Group Chest', count:2, tier:5, icon:'🗃️', loot:'T5 grup loot' },{ type:'Veteran Chest', count:1, tier:5, icon:'🏆', loot:'T5 veteran loot' },{ type:'Solo Chest', count:2, tier:5, icon:'📦', loot:'T5 solo' }],
      resources:[{ name:'Ore', tier:5, count:'5-9 node' },{ name:'Fibre', tier:5, count:'4-7 node' },{ name:'Stone', tier:5, count:'3-5 node' }],
      bonuses:[{ type:'fame', label:'Fame Bonusu', value:'+50%', icon:'⭐' },{ type:'info', label:'Çıkış Sayısı', value:'3-4 Portal', icon:'🚪' }],
      pvp:true, fullLoot:true, exits:4, mapImage:'road_7p' },

    { id:'ROAD_7P_T5_CORR', name:'Avalon Corridor (7p · T5)', mapType:'Corridor', zone:'ROAD', color:'#7c3aed', tier:5, capacity:'7 Oyuncu', icon:'🟣',
      chests:[{ type:'Group Chest', count:2, tier:5, icon:'🗃️', loot:'T5 grup' },{ type:'Solo Chest', count:2, tier:5, icon:'📦', loot:'T5 solo' }],
      resources:[{ name:'Wood', tier:5, count:'4-7 node' },{ name:'Hide', tier:5, count:'3-5 node' }],
      bonuses:[{ type:'fame', label:'Fame Bonusu', value:'+50%', icon:'⭐' }],
      pvp:true, fullLoot:true, exits:3, mapImage:'road_7p' },

    { id:'ROAD_7P_T5_SANC', name:'Avalon Sanctuary (7p · T5)', mapType:'Sanctuary', zone:'ROAD', color:'#7c3aed', tier:5, capacity:'7 Oyuncu', icon:'🟣',
      chests:[{ type:'Veteran Chest', count:2, tier:5, icon:'🏆', loot:'T5 veteran' },{ type:'Group Chest', count:2, tier:5, icon:'🗃️', loot:'T5 grup' }],
      resources:[{ name:'Stone', tier:5, count:'5-9 node' },{ name:'Fibre', tier:5, count:'4-6 node' }],
      bonuses:[{ type:'fame', label:'Fame Bonusu', value:'+50%', icon:'⭐' }],
      pvp:true, fullLoot:true, exits:2, mapImage:'road_7p' },

    { id:'ROAD_7P_T5_REST', name:'Avalon Rest / Hideout (7p · T5)', mapType:'Rest (Hideout)', zone:'ROAD', color:'#7c3aed', tier:5, capacity:'7 Oyuncu', icon:'🟣',
      chests:[{ type:'Group Chest', count:3, tier:5, icon:'🗃️', loot:'T5 grup' },{ type:'Solo Chest', count:2, tier:5, icon:'📦', loot:'T5 solo' }],
      resources:[{ name:'Ore', tier:5, count:'4-7 node' }],
      bonuses:[{ type:'fame', label:'Fame Bonusu', value:'+50%', icon:'⭐' },{ type:'info', label:'Hideout', value:'Kurulabilir', icon:'🏠' }],
      pvp:true, fullLoot:true, exits:2, mapImage:'road_7p' },

    // --- 7p T6 ---
    { id:'ROAD_7P_T6_CROSS', name:'Avalon Crossroads (7p · T6)', mapType:'Crossroads', zone:'ROAD', color:'#7c3aed', tier:6, capacity:'7 Oyuncu', icon:'🟣',
      chests:[{ type:'Veteran Chest', count:2, tier:6, icon:'🏆', loot:'T6 nadir eşyalar' },{ type:'Group Chest', count:3, tier:6, icon:'🗃️', loot:'T6 grup loot' },{ type:'Solo Chest', count:2, tier:6, icon:'📦', loot:'T6 solo' }],
      resources:[{ name:'Wood', tier:6, count:'6-10 node' },{ name:'Ore', tier:6, count:'5-8 node' },{ name:'Hide', tier:6, count:'4-6 node' }],
      bonuses:[{ type:'fame', label:'Fame Bonusu', value:'+50%', icon:'⭐' },{ type:'info', label:'Çıkış Sayısı', value:'3-5 Portal', icon:'🚪' }],
      pvp:true, fullLoot:true, exits:4, mapImage:'road_7p' },

    { id:'ROAD_7P_T6_CORR', name:'Avalon Corridor (7p · T6)', mapType:'Corridor', zone:'ROAD', color:'#7c3aed', tier:6, capacity:'7 Oyuncu', icon:'🟣',
      chests:[{ type:'Veteran Chest', count:1, tier:6, icon:'🏆', loot:'T6 veteran' },{ type:'Group Chest', count:2, tier:6, icon:'🗃️', loot:'T6 grup' },{ type:'Solo Chest', count:2, tier:6, icon:'📦', loot:'T6 solo' }],
      resources:[{ name:'Stone', tier:6, count:'5-8 node' },{ name:'Fibre', tier:6, count:'4-6 node' }],
      bonuses:[{ type:'fame', label:'Fame Bonusu', value:'+50%', icon:'⭐' }],
      pvp:true, fullLoot:true, exits:3, mapImage:'road_7p' },

    { id:'ROAD_7P_T6_SANC', name:'Avalon Sanctuary (7p · T6)', mapType:'Sanctuary', zone:'ROAD', color:'#7c3aed', tier:6, capacity:'7 Oyuncu', icon:'🟣',
      chests:[{ type:'Veteran Chest', count:3, tier:6, icon:'🏆', loot:'T6 veteran' },{ type:'Group Chest', count:2, tier:6, icon:'🗃️', loot:'T6 grup' }],
      resources:[{ name:'Hide', tier:6, count:'6-10 node' },{ name:'Stone', tier:6, count:'4-7 node' }],
      bonuses:[{ type:'fame', label:'Fame Bonusu', value:'+50%', icon:'⭐' }],
      pvp:true, fullLoot:true, exits:2, mapImage:'road_7p' },

    { id:'ROAD_7P_T6_REST', name:'Avalon Rest / Hideout (7p · T6)', mapType:'Rest (Hideout)', zone:'ROAD', color:'#7c3aed', tier:6, capacity:'7 Oyuncu', icon:'🟣',
      chests:[{ type:'Veteran Chest', count:2, tier:6, icon:'🏆', loot:'T6 veteran' },{ type:'Group Chest', count:2, tier:6, icon:'🗃️', loot:'T6 grup' },{ type:'Solo Chest', count:2, tier:6, icon:'📦', loot:'T6 solo' }],
      resources:[{ name:'Ore', tier:6, count:'5-8 node' }],
      bonuses:[{ type:'fame', label:'Fame Bonusu', value:'+50%', icon:'⭐' },{ type:'info', label:'Hideout', value:'Kurulabilir', icon:'🏠' }],
      pvp:true, fullLoot:true, exits:2, mapImage:'road_7p' },

    // --- 7p T7 ---
    { id:'ROAD_7P_T7_CROSS', name:'Avalon Crossroads (7p · T7)', mapType:'Crossroads', zone:'ROAD', color:'#7c3aed', tier:7, capacity:'7 Oyuncu', icon:'🟣',
      chests:[{ type:'Veteran Chest', count:3, tier:7, icon:'🏆', loot:'T7 nadir' },{ type:'Legendary Chest', count:1, tier:7, icon:'👑', loot:'T7 efsanevi loot' },{ type:'Solo Chest', count:2, tier:7, icon:'📦', loot:'T7 solo' }],
      resources:[{ name:'Fibre', tier:7, count:'5-9 node' },{ name:'Stone', tier:7, count:'4-7 node' },{ name:'Ore', tier:7, count:'4-6 node' }],
      bonuses:[{ type:'fame', label:'Fame Bonusu', value:'+50%', icon:'⭐' }],
      pvp:true, fullLoot:true, exits:5, mapImage:'road_7p' },

    { id:'ROAD_7P_T7_SANC', name:'Avalon Sanctuary (7p · T7)', mapType:'Sanctuary', zone:'ROAD', color:'#7c3aed', tier:7, capacity:'7 Oyuncu', icon:'🟣',
      chests:[{ type:'Legendary Chest', count:1, tier:7, icon:'👑', loot:'T7 efsanevi' },{ type:'Veteran Chest', count:3, tier:7, icon:'🏆', loot:'T7 veteran' }],
      resources:[{ name:'Hide', tier:7, count:'6-10 node' },{ name:'Wood', tier:7, count:'4-7 node' }],
      bonuses:[{ type:'fame', label:'Fame Bonusu', value:'+50%', icon:'⭐' }],
      pvp:true, fullLoot:true, exits:2, mapImage:'road_7p' },

    { id:'ROAD_7P_T7_REST', name:'Avalon Rest / Hideout (7p · T7)', mapType:'Rest (Hideout)', zone:'ROAD', color:'#7c3aed', tier:7, capacity:'7 Oyuncu', icon:'🟣',
      chests:[{ type:'Veteran Chest', count:3, tier:7, icon:'🏆', loot:'T7 veteran' },{ type:'Group Chest', count:3, tier:7, icon:'🗃️', loot:'T7 grup' },{ type:'Solo Chest', count:2, tier:7, icon:'📦', loot:'T7 solo' }],
      resources:[{ name:'Fibre', tier:7, count:'5-8 node' }],
      bonuses:[{ type:'fame', label:'Fame Bonusu', value:'+50%', icon:'⭐' },{ type:'info', label:'Hideout', value:'Kurulabilir', icon:'🏠' }],
      pvp:true, fullLoot:true, exits:2, mapImage:'road_7p' },

    { id:'ROAD_7P_T7_CORR', name:'Avalon Corridor (7p · T7)', mapType:'Corridor', zone:'ROAD', color:'#7c3aed', tier:7, capacity:'7 Oyuncu', icon:'🟣',
      chests:[{ type:'Veteran Chest', count:2, tier:7, icon:'🏆', loot:'T7 veteran' },{ type:'Group Chest', count:2, tier:7, icon:'🗃️', loot:'T7 grup' }],
      resources:[{ name:'Stone', tier:7, count:'4-8 node' }],
      bonuses:[{ type:'fame', label:'Fame Bonusu', value:'+50%', icon:'⭐' }],
      pvp:true, fullLoot:true, exits:3, mapImage:'road_7p' },

    // ══════════════════════════════════════
    // 20-PLAYER ROADS (Sarı Portal)
    // ══════════════════════════════════════

    // --- 20p T5 ---
    { id:'ROAD_20P_T5_CROSS', name:'Avalon Crossroads (20p · T5)', mapType:'Crossroads', zone:'ROAD', color:'#6d28d9', tier:5, capacity:'20 Oyuncu', icon:'🟣',
      chests:[{ type:'Group Chest', count:4, tier:5, icon:'🗃️', loot:'T5 grup' },{ type:'Veteran Chest', count:2, tier:5, icon:'🏆', loot:'T5 veteran' },{ type:'Solo Chest', count:3, tier:5, icon:'📦', loot:'T5 solo' }],
      resources:[{ name:'Wood', tier:5, count:'8-14 node' },{ name:'Ore', tier:5, count:'6-10 node' },{ name:'Fibre', tier:5, count:'5-9 node' },{ name:'Stone', tier:5, count:'4-6 node' }],
      bonuses:[{ type:'fame', label:'Fame Bonusu', value:'+50%', icon:'⭐' },{ type:'info', label:'Kapasite', value:'20 Oyuncu (Sarı Portal)', icon:'👥' },{ type:'info', label:'Çıkış Sayısı', value:'5-7 Portal', icon:'🚪' }],
      pvp:true, fullLoot:true, exits:6, mapImage:'road_20p' },

    { id:'ROAD_20P_T5_CORR', name:'Avalon Corridor (20p · T5)', mapType:'Corridor', zone:'ROAD', color:'#6d28d9', tier:5, capacity:'20 Oyuncu', icon:'🟣',
      chests:[{ type:'Group Chest', count:3, tier:5, icon:'🗃️', loot:'T5 grup' },{ type:'Solo Chest', count:3, tier:5, icon:'📦', loot:'T5 solo' }],
      resources:[{ name:'Hide', tier:5, count:'6-10 node' },{ name:'Stone', tier:5, count:'4-7 node' }],
      bonuses:[{ type:'fame', label:'Fame Bonusu', value:'+50%', icon:'⭐' }],
      pvp:true, fullLoot:true, exits:5, mapImage:'road_20p' },

    { id:'ROAD_20P_T5_SANC', name:'Avalon Sanctuary (20p · T5)', mapType:'Sanctuary', zone:'ROAD', color:'#6d28d9', tier:5, capacity:'20 Oyuncu', icon:'🟣',
      chests:[{ type:'Veteran Chest', count:3, tier:5, icon:'🏆', loot:'T5 veteran' },{ type:'Group Chest', count:4, tier:5, icon:'🗃️', loot:'T5 grup' }],
      resources:[{ name:'Fibre', tier:5, count:'7-12 node' },{ name:'Wood', tier:5, count:'5-9 node' }],
      bonuses:[{ type:'fame', label:'Fame Bonusu', value:'+50%', icon:'⭐' }],
      pvp:true, fullLoot:true, exits:4, mapImage:'road_20p' },

    { id:'ROAD_20P_T5_REST', name:'Avalon Rest / Hideout (20p · T5)', mapType:'Rest (Hideout)', zone:'ROAD', color:'#6d28d9', tier:5, capacity:'20 Oyuncu', icon:'🟣',
      chests:[{ type:'Veteran Chest', count:2, tier:5, icon:'🏆', loot:'T5 veteran' },{ type:'Group Chest', count:4, tier:5, icon:'🗃️', loot:'T5 grup' },{ type:'Solo Chest', count:3, tier:5, icon:'📦', loot:'T5 solo' }],
      resources:[{ name:'Ore', tier:5, count:'6-10 node' }],
      bonuses:[{ type:'fame', label:'Fame Bonusu', value:'+50%', icon:'⭐' },{ type:'info', label:'Hideout', value:'Kurulabilir', icon:'🏠' }],
      pvp:true, fullLoot:true, exits:4, mapImage:'road_20p' },

    // --- 20p T6 ---
    { id:'ROAD_20P_T6_CROSS', name:'Avalon Crossroads (20p · T6)', mapType:'Crossroads', zone:'ROAD', color:'#6d28d9', tier:6, capacity:'20 Oyuncu', icon:'🟣',
      chests:[{ type:'Veteran Chest', count:4, tier:6, icon:'🏆', loot:'T6 veteran' },{ type:'Legendary Chest', count:2, tier:6, icon:'👑', loot:'T6 efsanevi' },{ type:'Group Chest', count:3, tier:6, icon:'🗃️', loot:'T6 grup' },{ type:'Solo Chest', count:3, tier:6, icon:'📦', loot:'T6 solo' }],
      resources:[{ name:'Ore', tier:6, count:'8-15 node' },{ name:'Hide', tier:6, count:'6-12 node' },{ name:'Wood', tier:6, count:'5-10 node' },{ name:'Fibre', tier:6, count:'5-8 node' }],
      bonuses:[{ type:'fame', label:'Fame Bonusu', value:'+50%', icon:'⭐' },{ type:'info', label:'Çıkış Sayısı', value:'5-8 Portal', icon:'🚪' }],
      pvp:true, fullLoot:true, exits:7, mapImage:'road_20p' },

    { id:'ROAD_20P_T6_CORR', name:'Avalon Corridor (20p · T6)', mapType:'Corridor', zone:'ROAD', color:'#6d28d9', tier:6, capacity:'20 Oyuncu', icon:'🟣',
      chests:[{ type:'Veteran Chest', count:3, tier:6, icon:'🏆', loot:'T6 veteran' },{ type:'Group Chest', count:3, tier:6, icon:'🗃️', loot:'T6 grup' },{ type:'Solo Chest', count:2, tier:6, icon:'📦', loot:'T6 solo' }],
      resources:[{ name:'Stone', tier:6, count:'7-12 node' },{ name:'Fibre', tier:6, count:'5-8 node' }],
      bonuses:[{ type:'fame', label:'Fame Bonusu', value:'+50%', icon:'⭐' }],
      pvp:true, fullLoot:true, exits:5, mapImage:'road_20p' },

    { id:'ROAD_20P_T6_SANC', name:'Avalon Sanctuary (20p · T6)', mapType:'Sanctuary', zone:'ROAD', color:'#6d28d9', tier:6, capacity:'20 Oyuncu', icon:'🟣',
      chests:[{ type:'Legendary Chest', count:2, tier:6, icon:'👑', loot:'T6 efsanevi' },{ type:'Veteran Chest', count:4, tier:6, icon:'🏆', loot:'T6 veteran' },{ type:'Group Chest', count:3, tier:6, icon:'🗃️', loot:'T6 grup' }],
      resources:[{ name:'Hide', tier:6, count:'8-14 node' },{ name:'Wood', tier:6, count:'6-10 node' }],
      bonuses:[{ type:'fame', label:'Fame Bonusu', value:'+50%', icon:'⭐' }],
      pvp:true, fullLoot:true, exits:4, mapImage:'road_20p' },

    { id:'ROAD_20P_T6_REST', name:'Avalon Rest / Hideout (20p · T6)', mapType:'Rest (Hideout)', zone:'ROAD', color:'#6d28d9', tier:6, capacity:'20 Oyuncu', icon:'🟣',
      chests:[{ type:'Legendary Chest', count:1, tier:6, icon:'👑', loot:'T6 efsanevi' },{ type:'Veteran Chest', count:3, tier:6, icon:'🏆', loot:'T6 veteran' },{ type:'Group Chest', count:4, tier:6, icon:'🗃️', loot:'T6 grup' },{ type:'Solo Chest', count:3, tier:6, icon:'📦', loot:'T6 solo' }],
      resources:[{ name:'Ore', tier:6, count:'7-12 node' }],
      bonuses:[{ type:'fame', label:'Fame Bonusu', value:'+50%', icon:'⭐' },{ type:'info', label:'Hideout', value:'Kurulabilir', icon:'🏠' }],
      pvp:true, fullLoot:true, exits:4, mapImage:'road_20p' },

    // --- 20p T7 ---
    { id:'ROAD_20P_T7_CROSS', name:'Avalon Crossroads (20p · T7)', mapType:'Crossroads', zone:'ROAD', color:'#6d28d9', tier:7, capacity:'20 Oyuncu', icon:'🟣',
      chests:[{ type:'Legendary Chest', count:3, tier:7, icon:'👑', loot:'T7 efsanevi' },{ type:'Veteran Chest', count:4, tier:7, icon:'🏆', loot:'T7 veteran' },{ type:'Group Chest', count:4, tier:7, icon:'🗃️', loot:'T7 grup' },{ type:'Solo Chest', count:4, tier:7, icon:'📦', loot:'T7 solo' }],
      resources:[{ name:'Hide', tier:7, count:'8-14 node' },{ name:'Stone', tier:7, count:'7-12 node' },{ name:'Fibre', tier:7, count:'6-10 node' },{ name:'Ore', tier:7, count:'6-10 node' }],
      bonuses:[{ type:'fame', label:'Fame Bonusu', value:'+50%', icon:'⭐' },{ type:'info', label:'Çıkış Sayısı', value:'6-9 Portal', icon:'🚪' }],
      pvp:true, fullLoot:true, exits:8, mapImage:'road_20p' },

    { id:'ROAD_20P_T7_SANC', name:'Avalon Sanctuary (20p · T7)', mapType:'Sanctuary', zone:'ROAD', color:'#6d28d9', tier:7, capacity:'20 Oyuncu', icon:'🟣',
      chests:[{ type:'Legendary Chest', count:3, tier:7, icon:'👑', loot:'T7 efsanevi' },{ type:'Veteran Chest', count:4, tier:7, icon:'🏆', loot:'T7 veteran' }],
      resources:[{ name:'Wood', tier:7, count:'8-14 node' },{ name:'Fibre', tier:7, count:'6-10 node' }],
      bonuses:[{ type:'fame', label:'Fame Bonusu', value:'+50%', icon:'⭐' }],
      pvp:true, fullLoot:true, exits:4, mapImage:'road_20p' },

    { id:'ROAD_20P_T7_REST', name:'Avalon Rest / Hideout (20p · T7)', mapType:'Rest (Hideout)', zone:'ROAD', color:'#6d28d9', tier:7, capacity:'20 Oyuncu', icon:'🟣',
      chests:[{ type:'Legendary Chest', count:2, tier:7, icon:'👑', loot:'T7 efsanevi' },{ type:'Veteran Chest', count:4, tier:7, icon:'🏆', loot:'T7 veteran' },{ type:'Group Chest', count:4, tier:7, icon:'🗃️', loot:'T7 grup' },{ type:'Solo Chest', count:4, tier:7, icon:'📦', loot:'T7 solo' }],
      resources:[{ name:'Stone', tier:7, count:'7-12 node' }],
      bonuses:[{ type:'fame', label:'Fame Bonusu', value:'+50%', icon:'⭐' },{ type:'info', label:'Hideout', value:'Kurulabilir', icon:'🏠' }],
      pvp:true, fullLoot:true, exits:4, mapImage:'road_20p' },

    { id:'ROAD_20P_T7_CORR', name:'Avalon Corridor (20p · T7)', mapType:'Corridor', zone:'ROAD', color:'#6d28d9', tier:7, capacity:'20 Oyuncu', icon:'🟣',
      chests:[{ type:'Legendary Chest', count:1, tier:7, icon:'👑', loot:'T7 efsanevi' },{ type:'Veteran Chest', count:4, tier:7, icon:'🏆', loot:'T7 veteran' },{ type:'Group Chest', count:3, tier:7, icon:'🗃️', loot:'T7 grup' }],
      resources:[{ name:'Ore', tier:7, count:'6-12 node' },{ name:'Wood', tier:7, count:'5-9 node' }],
      bonuses:[{ type:'fame', label:'Fame Bonusu', value:'+50%', icon:'⭐' }],
      pvp:true, fullLoot:true, exits:5, mapImage:'road_20p' },

    // --- 20p T8 (Deep Roads — En Değerli) ---
    { id:'ROAD_20P_T8_CROSS', name:'Deep Roads — Crossroads (20p · T8)', mapType:'Crossroads', zone:'ROAD', color:'#6d28d9', tier:8, capacity:'20 Oyuncu', icon:'🟣',
      chests:[{ type:'Legendary Chest', count:5, tier:8, icon:'👑', loot:'T8 efsanevi — En Değerli' },{ type:'Veteran Chest', count:4, tier:8, icon:'🏆', loot:'T8 veteran' },{ type:'Group Chest', count:4, tier:8, icon:'🗃️', loot:'T8 grup' },{ type:'Solo Chest', count:3, tier:8, icon:'📦', loot:'T8 solo' }],
      resources:[{ name:'Tüm Kaynaklar T8', tier:8, count:'10+ node' }],
      bonuses:[{ type:'fame', label:'Fame Bonusu', value:'+50%', icon:'⭐' },{ type:'info', label:'Kapasite', value:'20 Oyuncu', icon:'👥' },{ type:'info', label:'Çıkış Sayısı', value:'6-10 Portal', icon:'🚪' },{ type:'info', label:'Özellik', value:'Oyunun zirvesi! Deep Road', icon:'🔥' }],
      pvp:true, fullLoot:true, exits:9, mapImage:'road_20p' },

    { id:'ROAD_20P_T8_SANC', name:'Deep Roads — Sanctuary (20p · T8)', mapType:'Sanctuary', zone:'ROAD', color:'#6d28d9', tier:8, capacity:'20 Oyuncu', icon:'🟣',
      chests:[{ type:'Legendary Chest', count:6, tier:8, icon:'👑', loot:'T8 efsanevi — Maksimum Değer' },{ type:'Veteran Chest', count:4, tier:8, icon:'🏆', loot:'T8 veteran' }],
      resources:[{ name:'Tüm Kaynaklar T8', tier:8, count:'12+ node' }],
      bonuses:[{ type:'fame', label:'Fame Bonusu', value:'+50%', icon:'⭐' },{ type:'info', label:'Özellik', value:'Sadece Deep Roads içinden erişilir', icon:'🔥' }],
      pvp:true, fullLoot:true, exits:4, mapImage:'road_20p' },

    { id:'ROAD_20P_T8_REST', name:'Deep Roads — Rest / Hideout (20p · T8)', mapType:'Rest (Hideout)', zone:'ROAD', color:'#6d28d9', tier:8, capacity:'20 Oyuncu', icon:'🟣',
      chests:[{ type:'Legendary Chest', count:5, tier:8, icon:'👑', loot:'T8 efsanevi' },{ type:'Veteran Chest', count:5, tier:8, icon:'🏆', loot:'T8 veteran' },{ type:'Group Chest', count:4, tier:8, icon:'🗃️', loot:'T8 grup' },{ type:'Solo Chest', count:3, tier:8, icon:'📦', loot:'T8 solo' }],
      resources:[{ name:'Tüm Kaynaklar T8', tier:8, count:'10+ node' }],
      bonuses:[{ type:'fame', label:'Fame Bonusu', value:'+50%', icon:'⭐' },{ type:'info', label:'Hideout', value:'Kurulabilir', icon:'🏠' },{ type:'info', label:'Özellik', value:'En güçlü Hideout konumu', icon:'🔥' }],
      pvp:true, fullLoot:true, exits:4, mapImage:'road_20p' },

  ],


      chests: [
        { type: 'Solo Chest', count: 1, tier: 5, icon: '📦', loot: 'T5 eşyalar, ara loot' },
        { type: 'Small Group Chest', count: 1, tier: 5, icon: '🗃️', loot: 'T5 grup loot' },
      ],
      resources: [
        { name: 'Wood', tier: 5, count: '3-6 node' },
        { name: 'Fibre', tier: 5, count: '2-4 node' },
      ],
      bonuses: [
        { type: 'fame', label: 'Fame Bonusu', value: '+50%', icon: '⭐' },
        { type: 'info', label: 'Kapasite', value: '2 Oyuncu', icon: '👥' },
      ],
      pvp: true, fullLoot: true,
      exits: 2, mapImage: 'road_2p',
    },
    {
      id: 'ROAD_2P_T6_01', name: 'Road of Avalon (2p · T6)', zone: 'ROAD', color: '#8b5cf6',
      tier: 6, capacity: '2 Oyuncu', icon: '🟣',
      chests: [
        { type: 'Solo Chest', count: 2, tier: 6, icon: '📦', loot: 'T6 eşyalar' },
        { type: 'Veteran Chest', count: 1, tier: 6, icon: '🏆', loot: 'T6 nadir eşyalar' },
      ],
      resources: [
        { name: 'Ore', tier: 6, count: '4-7 node' },
        { name: 'Hide', tier: 6, count: '2-5 node' },
      ],
      bonuses: [
        { type: 'fame', label: 'Fame Bonusu', value: '+50%', icon: '⭐' },
        { type: 'info', label: 'Kapasite', value: '2 Oyuncu', icon: '👥' },
      ],
      pvp: true, fullLoot: true,
      exits: 2, mapImage: 'road_2p',
    },

    // ─── 7-PLAYER ROADS ─────────────────────
    {
      id: 'ROAD_7P_T4_01', name: 'Road of Avalon (7p · T4)', zone: 'ROAD', color: '#7c3aed',
      tier: 4, capacity: '7 Oyuncu', icon: '🟣',
      chests: [
        { type: 'Group Chest', count: 2, tier: 4, icon: '🗃️', loot: 'T4 grup loot' },
        { type: 'Solo Chest', count: 1, tier: 4, icon: '📦', loot: 'T4 solo loot' },
      ],
      resources: [
        { name: 'Wood', tier: 4, count: '5-8 node' },
        { name: 'Ore', tier: 4, count: '4-6 node' },
        { name: 'Stone', tier: 4, count: '2-3 node' },
      ],
      bonuses: [
        { type: 'fame', label: 'Fame Bonusu', value: '+50%', icon: '⭐' },
        { type: 'info', label: 'Kapasite', value: '7 Oyuncu', icon: '👥' },
        { type: 'info', label: 'Çıkış Sayısı', value: '3-4 Portal', icon: '🚪' },
      ],
      pvp: true, fullLoot: true,
      exits: 3, mapImage: 'road_7p',
    },
    {
      id: 'ROAD_7P_T5_01', name: 'Road of Avalon (7p · T5)', zone: 'ROAD', color: '#7c3aed',
      tier: 5, capacity: '7 Oyuncu', icon: '🟣',
      chests: [
        { type: 'Group Chest', count: 2, tier: 5, icon: '🗃️', loot: 'T5 grup loot' },
        { type: 'Veteran Chest', count: 1, tier: 5, icon: '🏆', loot: 'T5 veteran loot' },
        { type: 'Solo Chest', count: 2, tier: 5, icon: '📦', loot: 'T5 solo loot' },
      ],
      resources: [
        { name: 'Ore', tier: 5, count: '5-9 node' },
        { name: 'Fibre', tier: 5, count: '4-7 node' },
        { name: 'Stone', tier: 5, count: '3-5 node' },
      ],
      bonuses: [
        { type: 'fame', label: 'Fame Bonusu', value: '+50%', icon: '⭐' },
        { type: 'info', label: 'Kapasite', value: '7 Oyuncu', icon: '👥' },
        { type: 'info', label: 'Çıkış Sayısı', value: '3-4 Portal', icon: '🚪' },
      ],
      pvp: true, fullLoot: true,
      exits: 4, mapImage: 'road_7p',
    },
    {
      id: 'ROAD_7P_T6_01', name: 'Road of Avalon (7p · T6)', zone: 'ROAD', color: '#7c3aed',
      tier: 6, capacity: '7 Oyuncu', icon: '🟣',
      chests: [
        { type: 'Veteran Chest', count: 2, tier: 6, icon: '🏆', loot: 'T6 nadir eşyalar' },
        { type: 'Group Chest', count: 3, tier: 6, icon: '🗃️', loot: 'T6 grup loot' },
        { type: 'Solo Chest', count: 2, tier: 6, icon: '📦', loot: 'T6 solo loot' },
      ],
      resources: [
        { name: 'Wood', tier: 6, count: '6-10 node' },
        { name: 'Ore', tier: 6, count: '5-8 node' },
        { name: 'Hide', tier: 6, count: '4-6 node' },
      ],
      bonuses: [
        { type: 'fame', label: 'Fame Bonusu', value: '+50%', icon: '⭐' },
        { type: 'info', label: 'Kapasite', value: '7 Oyuncu', icon: '👥' },
        { type: 'info', label: 'Çıkış Sayısı', value: '3-5 Portal', icon: '🚪' },
      ],
      pvp: true, fullLoot: true,
      exits: 4, mapImage: 'road_7p',
    },
    {
      id: 'ROAD_7P_T7_01', name: 'Road of Avalon (7p · T7)', zone: 'ROAD', color: '#7c3aed',
      tier: 7, capacity: '7 Oyuncu', icon: '🟣',
      chests: [
        { type: 'Veteran Chest', count: 3, tier: 7, icon: '🏆', loot: 'T7 nadir eşyalar' },
        { type: 'Legendary Chest', count: 1, tier: 7, icon: '👑', loot: 'T7 efsanevi loot' },
        { type: 'Solo Chest', count: 2, tier: 7, icon: '📦', loot: 'T7 solo loot' },
      ],
      resources: [
        { name: 'Fibre', tier: 7, count: '5-9 node' },
        { name: 'Stone', tier: 7, count: '4-7 node' },
        { name: 'Ore', tier: 7, count: '4-6 node' },
      ],
      bonuses: [
        { type: 'fame', label: 'Fame Bonusu', value: '+50%', icon: '⭐' },
        { type: 'info', label: 'Kapasite', value: '7 Oyuncu', icon: '👥' },
      ],
      pvp: true, fullLoot: true,
      exits: 5, mapImage: 'road_7p',
    },

    // ─── 20-PLAYER ROADS ────────────────────
    {
      id: 'ROAD_20P_T5_01', name: 'Road of Avalon (20p · T5)', zone: 'ROAD', color: '#6d28d9',
      tier: 5, capacity: '20 Oyuncu', icon: '🟣',
      chests: [
        { type: 'Group Chest', count: 4, tier: 5, icon: '🗃️', loot: 'T5 grup loot' },
        { type: 'Veteran Chest', count: 2, tier: 5, icon: '🏆', loot: 'T5 veteran loot' },
        { type: 'Solo Chest', count: 3, tier: 5, icon: '📦', loot: 'T5 solo loot' },
      ],
      resources: [
        { name: 'Wood', tier: 5, count: '8-14 node' },
        { name: 'Ore', tier: 5, count: '6-10 node' },
        { name: 'Fibre', tier: 5, count: '5-9 node' },
        { name: 'Stone', tier: 5, count: '4-6 node' },
      ],
      bonuses: [
        { type: 'fame', label: 'Fame Bonusu', value: '+50%', icon: '⭐' },
        { type: 'info', label: 'Kapasite', value: '20 Oyuncu', icon: '👥' },
        { type: 'info', label: 'Çıkış Sayısı', value: '5-7 Portal', icon: '🚪' },
      ],
      pvp: true, fullLoot: true,
      exits: 6, mapImage: 'road_20p',
    },
    {
      id: 'ROAD_20P_T6_01', name: 'Road of Avalon (20p · T6)', zone: 'ROAD', color: '#6d28d9',
      tier: 6, capacity: '20 Oyuncu', icon: '🟣',
      chests: [
        { type: 'Veteran Chest', count: 4, tier: 6, icon: '🏆', loot: 'T6 veteran loot' },
        { type: 'Legendary Chest', count: 2, tier: 6, icon: '👑', loot: 'T6 efsanevi loot' },
        { type: 'Group Chest', count: 3, tier: 6, icon: '🗃️', loot: 'T6 grup loot' },
        { type: 'Solo Chest', count: 3, tier: 6, icon: '📦', loot: 'T6 solo loot' },
      ],
      resources: [
        { name: 'Ore', tier: 6, count: '8-15 node' },
        { name: 'Hide', tier: 6, count: '6-12 node' },
        { name: 'Wood', tier: 6, count: '5-10 node' },
        { name: 'Fibre', tier: 6, count: '5-8 node' },
      ],
      bonuses: [
        { type: 'fame', label: 'Fame Bonusu', value: '+50%', icon: '⭐' },
        { type: 'info', label: 'Kapasite', value: '20 Oyuncu', icon: '👥' },
        { type: 'info', label: 'Çıkış Sayısı', value: '5-8 Portal', icon: '🚪' },
      ],
      pvp: true, fullLoot: true,
      exits: 7, mapImage: 'road_20p',
    },
    {
      id: 'ROAD_20P_T7_01', name: 'Road of Avalon (20p · T7)', zone: 'ROAD', color: '#6d28d9',
      tier: 7, capacity: '20 Oyuncu', icon: '🟣',
      chests: [
        { type: 'Legendary Chest', count: 3, tier: 7, icon: '👑', loot: 'T7 efsanevi loot' },
        { type: 'Veteran Chest', count: 4, tier: 7, icon: '🏆', loot: 'T7 veteran loot' },
        { type: 'Group Chest', count: 4, tier: 7, icon: '🗃️', loot: 'T7 grup loot' },
        { type: 'Solo Chest', count: 4, tier: 7, icon: '📦', loot: 'T7 solo loot' },
      ],
      resources: [
        { name: 'Hide', tier: 7, count: '8-14 node' },
        { name: 'Stone', tier: 7, count: '7-12 node' },
        { name: 'Fibre', tier: 7, count: '6-10 node' },
        { name: 'Ore', tier: 7, count: '6-10 node' },
      ],
      bonuses: [
        { type: 'fame', label: 'Fame Bonusu', value: '+50%', icon: '⭐' },
        { type: 'info', label: 'Kapasite', value: '20 Oyuncu', icon: '👥' },
        { type: 'info', label: 'Çıkış Sayısı', value: '6-9 Portal', icon: '🚪' },
      ],
      pvp: true, fullLoot: true,
      exits: 8, mapImage: 'road_20p',
    },
    {
      id: 'ROAD_20P_T8_01', name: 'Road of Avalon (20p · T8)', zone: 'ROAD', color: '#6d28d9',
      tier: 8, capacity: '20 Oyuncu', icon: '🟣',
      chests: [
        { type: 'Legendary Chest', count: 5, tier: 8, icon: '👑', loot: 'T8 efsanevi loot — En Değerli' },
        { type: 'Veteran Chest', count: 4, tier: 8, icon: '🏆', loot: 'T8 veteran loot' },
        { type: 'Group Chest', count: 4, tier: 8, icon: '🗃️', loot: 'T8 grup loot' },
        { type: 'Solo Chest', count: 3, tier: 8, icon: '📦', loot: 'T8 solo loot' },
      ],
      resources: [
        { name: 'Tüm Kaynaklar', tier: 8, count: '10+ node' },
      ],
      bonuses: [
        { type: 'fame', label: 'Fame Bonusu', value: '+50%', icon: '⭐' },
        { type: 'info', label: 'Kapasite', value: '20 Oyuncu', icon: '👥' },
        { type: 'info', label: 'Çıkış Sayısı', value: '6-10 Portal', icon: '🚪' },
        { type: 'info', label: 'Özellik', value: 'Oyunun zirvesi!', icon: '🔥' },
      ],
      pvp: true, fullLoot: true,
      exits: 9, mapImage: 'road_20p',
    },
  ],

  // ══════════════════════════════════════════
  // BLACK ZONES — Outlands Rests
  // ══════════════════════════════════════════
  blackZones: [
    {
      id: 'ARTHURSREST', name: "Arthur's Rest", zone: 'BLACK', color: '#4b5563', icon: '💀',
      description: "Outlands'ın kuzey üssü. Tam kayıp PvP bölgesi.",
      bonuses: [
        { type: 'craft', label: 'Crafting Bonus', value: '+100%', icon: '⚔️' },
        { type: 'refine', label: 'Refining Bonus', value: '+100%', icon: '🔥' },
        { type: 'info', label: 'Kaynak Tier', value: 'T5-T8', icon: '⛏️' },
      ],
      resources: ['T5-T8 Tüm Kaynaklar'],
      tier: 'Outlands', pvp: true, fullLoot: true, hasMap: false,
    },
    {
      id: 'MERLINSREST', name: "Merlyn's Rest", zone: 'BLACK', color: '#4b5563', icon: '💀',
      description: "Outlands'ın doğu üssü.",
      bonuses: [
        { type: 'craft', label: 'Crafting Bonus', value: '+100%', icon: '⚔️' },
        { type: 'refine', label: 'Refining Bonus', value: '+100%', icon: '🔥' },
        { type: 'info', label: 'Kaynak Tier', value: 'T5-T8', icon: '⛏️' },
      ],
      resources: ['T5-T8 Tüm Kaynaklar'],
      tier: 'Outlands', pvp: true, fullLoot: true, hasMap: false,
    },
    {
      id: 'MORGANASREST', name: "Morgana's Rest", zone: 'BLACK', color: '#4b5563', icon: '💀',
      description: "Outlands'ın güney üssü.",
      bonuses: [
        { type: 'craft', label: 'Crafting Bonus', value: '+100%', icon: '⚔️' },
        { type: 'refine', label: 'Refining Bonus', value: '+100%', icon: '🔥' },
        { type: 'info', label: 'Kaynak Tier', value: 'T5-T8', icon: '⛏️' },
      ],
      resources: ['T5-T8 Tüm Kaynaklar'],
      tier: 'Outlands', pvp: true, fullLoot: true, hasMap: false,
    },
  ],

  // ══════════════════════════════════════════
  // ZONE TİPİ GENEL TABLO
  // ══════════════════════════════════════════
  zoneBonuses: {
    SAFEAREA: {
      label: 'Blue Zone (Safe)', color: '#3b82f6', icon: '🔵',
      description: 'Tam güvenli bölge. PvP yok, eşya kaybı yok.',
      generalBonus: 'Şehir bazlı spesifik crafting bonusları',
      pvpRisk: 'Yok', lootRisk: 'Yok', resourceTier: 'T1-T4',
    },
    YELLOW: {
      label: 'Yellow Zone', color: '#eab308', icon: '🟡',
      description: 'Düşük riskli PvP. Öldürülseniz eşyalar korunur.',
      generalBonus: '+15% Fame & Loot Kalitesi',
      pvpRisk: 'Düşük (korumalı)', lootRisk: 'Düşük', resourceTier: 'T3-T5',
    },
    RED: {
      label: 'Red Zone', color: '#ef4444', icon: '🔴',
      description: 'Yüksek riskli PvP. Eşyaların %50\'si düşer.',
      generalBonus: '+50% Fame & Loot Kalitesi',
      pvpRisk: 'Yüksek (kısmi kayıp)', lootRisk: 'Orta (%50)', resourceTier: 'T5-T7',
    },
    BLACK: {
      label: 'Black Zone', color: '#4b5563', icon: '⚫',
      description: 'Tam kayıp PvP. Tüm eşyalar düşer. En yüksek ödül.',
      generalBonus: '+100% Fame | +50% Crafting Bonus',
      pvpRisk: 'Çok Yüksek (tam kayıp)', lootRisk: 'Tam Kayıp (%100)', resourceTier: 'T6-T8',
    },
    ROAD: {
      label: 'Road of Avalon', color: '#8b5cf6', icon: '🟣',
      description: 'Özel portal bölgesi. Sürekli değişen bağlantılar.',
      generalBonus: '+50% Fame | Avalon Kaynakları | Sandıklar',
      pvpRisk: 'Yüksek (tam kayıp)', lootRisk: 'Tam Kayıp', resourceTier: 'T4-T8',
    },
    MIST: {
      label: 'Mist Zone', color: '#06b6d4', icon: '🌫️',
      description: 'Gizemli sis bölgesi. Özel Brecilien ekipmanları.',
      generalBonus: '+25% Özel Mist Loot',
      pvpRisk: 'Orta', lootRisk: 'Kısmi', resourceTier: 'T4-T7',
    },
  },

  // ══════════════════════════════════════════
  // SANDIK TİPLERİ AÇIKLAMALARI
  // ══════════════════════════════════════════
  chestTypes: {
    'Solo Chest':        { icon: '📦', color: '#6b7280', desc: '1-2 kişilik içerik. Hızlı açılır.' },
    'Small Group Chest': { icon: '🗃️', color: '#3b82f6', desc: '2-4 kişi için grup içeriği.' },
    'Group Chest':       { icon: '🗃️', color: '#22c55e', desc: '4-7 kişi için grup içeriği.' },
    'Veteran Chest':     { icon: '🏆', color: '#f97316', desc: '7+ kişi, nadir eşyalar içerir.' },
    'Legendary Chest':   { icon: '👑', color: '#eab308', desc: 'En yüksek değerli sandık. T7-T8 efsanevi item.' },
  },
};
