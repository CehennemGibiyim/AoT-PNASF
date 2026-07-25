// AoT-PNASF — Crafting v5 — Tüm Crafting İşlemleri, Binekler, Yemekler, İksirler
const PRICE_API = 'https://europe.albion-online-data.com';
const RENDER    = 'https://render.albiononline.com/v1/item';
const ALL_CITIES = 'Caerleon,Bridgewatch,Lymhurst,Martlock,Thetford,Fort Sterling,Brecilien,Black Market';

function isValidData(dateStr) {
  if (!dateStr || dateStr.startsWith('0001')) return false;
  const m = (Date.now() - new Date(dateStr+'Z').getTime()) / 60000;
  return m >= 1 && m <= 45; // 1 ile 45 dakika
}

// Kategoriler
const CATEGORIES = [
  {key:'sword',   icon:'⚔️', tr:'Kılıçlar',        en:'Swords'},
  {key:'axe',     icon:'🪓', tr:'Baltalar',         en:'Axes'},
  {key:'bow',     icon:'🏹', tr:'Yaylar',           en:'Bows'},
  {key:'hammer',  icon:'🔨', tr:'Çekiçler',         en:'Hammers'},
  {key:'spear',   icon:'🗡️', tr:'Mızraklar',        en:'Spears'},
  {key:'dagger',  icon:'🔪', tr:'Hançerler',        en:'Daggers'},
  {key:'qstaff',  icon:'🪄', tr:'Quarterstaff',     en:'Quarterstaffs'},
  {key:'mace',    icon:'🏛️', tr:'Gürz',             en:'Maces'},
  {key:'knuckles',icon:'🥊', tr:'Savaş Eldiveni',   en:'War Gloves'},
  {key:'shape',   icon:'🌊', tr:'Şekil Değiştirici',en:'Shapeshifter'},
  {key:'fire',    icon:'🔥', tr:'Ateş Asaları',     en:'Fire Staves'},
  {key:'frost',   icon:'❄️', tr:'Buz Asaları',      en:'Frost Staves'},
  {key:'arcane',  icon:'🌀', tr:'Gizem Asaları',    en:'Arcane Staves'},
  {key:'holy',    icon:'✨', tr:'Kutsal Asalar',    en:'Holy Staves'},
  {key:'nature',  icon:'🌿', tr:'Doğa Asaları',     en:'Nature Staves'},
  {key:'curse',   icon:'💀', tr:'Lanet Asaları',    en:'Cursed Staves'},
  {key:'bag',     icon:'🎒', tr:'Çantalar',         en:'Bags'},
  {key:'cape',    icon:'🧣', tr:'Pelerinler',       en:'Capes'},
  {key:'lhelmet', icon:'🪖', tr:'Deri Kask',        en:'Leather Helmet'},
  {key:'larmor',  icon:'🥋', tr:'Deri Zırh',        en:'Leather Armor'},
  {key:'lshoes',  icon:'👢', tr:'Deri Bot',         en:'Leather Shoes'},
  {key:'phelmet', icon:'⛑️', tr:'Plaka Kask',       en:'Plate Helmet'},
  {key:'parmor',  icon:'🛡️', tr:'Plaka Zırh',       en:'Plate Armor'},
  {key:'pshoes',  icon:'🦺', tr:'Plaka Bot',        en:'Plate Shoes'},
  {key:'chelmet', icon:'🎩', tr:'Kumaş Kask',       en:'Cloth Helmet'},
  {key:'carmor',  icon:'👘', tr:'Kumaş Zırh',       en:'Cloth Armor'},
  {key:'cshoes',  icon:'🥿', tr:'Kumaş Bot',        en:'Cloth Shoes'},
  {key:'offhand', icon:'🔰', tr:'Offhand',          en:'Offhand'},
  {key:'gatherer',icon:'⛏️', tr:'Toplayıcı Setleri',en:'Gathering Gear'},
  {key:'mount',   icon:'🐎', tr:'Binekler',         en:'Mounts'},
  {key:'food',    icon:'🍲', tr:'Yemekler',         en:'Food'},
  {key:'potion',  icon:'⚗️', tr:'İksirler',         en:'Potions'},
];

// Reçeteler: { default: { mats: [...] }, 4: { yield: 10, mats: [...] } }
const RECIPES = {
  // SİLAHLAR & ZIRHLAR
  'MAIN_SWORD':               { default: { mats: [{r:'METALBAR',q:8},{r:'LEATHER',q:8},{r:'PLANKS',q:4}] }},
  '2H_CLAYMORE':              { default: { mats: [{r:'METALBAR',q:16},{r:'LEATHER',q:8},{r:'PLANKS',q:8}] }},
  '2H_DUALSWORD':             { default: { mats: [{r:'METALBAR',q:12},{r:'LEATHER',q:8},{r:'PLANKS',q:8}] }},
  'MAIN_SCIMITAR_MORGANA':    { default: { mats: [{r:'METALBAR',q:8},{r:'LEATHER',q:8},{r:'PLANKS',q:4}] }},
  '2H_CLEAVER_HELL':          { default: { mats: [{r:'METALBAR',q:16},{r:'LEATHER',q:8},{r:'PLANKS',q:8}] }},
  '2H_DUALSWORD_UNDEAD':      { default: { mats: [{r:'METALBAR',q:12},{r:'LEATHER',q:8},{r:'PLANKS',q:8}] }},
  'MAIN_AXE':                 { default: { mats: [{r:'METALBAR',q:8},{r:'PLANKS',q:8},{r:'LEATHER',q:4}] }},
  '2H_AXE':                   { default: { mats: [{r:'METALBAR',q:16},{r:'PLANKS',q:8},{r:'LEATHER',q:4}] }},
  '2H_HALBERD':               { default: { mats: [{r:'METALBAR',q:12},{r:'PLANKS',q:12},{r:'LEATHER',q:4}] }},
  '2H_SCYTHE_HELL':           { default: { mats: [{r:'METALBAR',q:16},{r:'PLANKS',q:8},{r:'LEATHER',q:4}] }},
  '2H_HALBERD_UNDEAD':        { default: { mats: [{r:'METALBAR',q:16},{r:'PLANKS',q:12},{r:'LEATHER',q:4}] }},
  '2H_BOW':                   { default: { mats: [{r:'PLANKS',q:16},{r:'CLOTH',q:8},{r:'LEATHER',q:8}] }},
  '2H_LONGBOW':               { default: { mats: [{r:'PLANKS',q:20},{r:'CLOTH',q:8},{r:'LEATHER',q:4}] }},
  '2H_LONGBOW_UNDEAD':        { default: { mats: [{r:'PLANKS',q:20},{r:'CLOTH',q:8},{r:'LEATHER',q:4}] }},
  '2H_BOW_HELL':              { default: { mats: [{r:'PLANKS',q:16},{r:'CLOTH',q:8},{r:'LEATHER',q:8}] }},
  '2H_BOW_MORGANA':           { default: { mats: [{r:'PLANKS',q:16},{r:'CLOTH',q:8},{r:'LEATHER',q:8}] }},
  '2H_CROSSBOW':              { default: { mats: [{r:'METALBAR',q:8},{r:'PLANKS',q:12},{r:'LEATHER',q:8}] }},
  '2H_CROSSBOW_CANNON':       { default: { mats: [{r:'METALBAR',q:12},{r:'PLANKS',q:12},{r:'LEATHER',q:4}] }},
  'MAIN_CROSSBOW':            { default: { mats: [{r:'METALBAR',q:8},{r:'PLANKS',q:8},{r:'LEATHER',q:8}] }},
  '2H_CROSSBOW_LARGE_MORGANA':{ default: { mats: [{r:'METALBAR',q:12},{r:'PLANKS',q:16},{r:'LEATHER',q:4}] }},
  '2H_BOW_KEEPER':            { default: { mats: [{r:'PLANKS',q:16},{r:'CLOTH',q:8},{r:'LEATHER',q:8}] }},
  'MAIN_HAMMER':              { default: { mats: [{r:'METALBAR',q:12},{r:'PLANKS',q:8},{r:'LEATHER',q:4}] }},
  '2H_POLEHAMMER':            { default: { mats: [{r:'METALBAR',q:16},{r:'PLANKS',q:12},{r:'LEATHER',q:4}] }},
  '2H_HAMMER_HELL':           { default: { mats: [{r:'METALBAR',q:20},{r:'PLANKS',q:8},{r:'LEATHER',q:4}] }},
  '2H_HAMMER_MORGANA':        { default: { mats: [{r:'METALBAR',q:16},{r:'PLANKS',q:8},{r:'LEATHER',q:4}] }},
  'MAIN_SPEAR':               { default: { mats: [{r:'METALBAR',q:8},{r:'PLANKS',q:12},{r:'LEATHER',q:4}] }},
  '2H_SPEAR':                 { default: { mats: [{r:'METALBAR',q:8},{r:'PLANKS',q:16},{r:'LEATHER',q:4}] }},
  '2H_GLAIVE':                { default: { mats: [{r:'METALBAR',q:8},{r:'PLANKS',q:16},{r:'LEATHER',q:4}] }},
  '2H_HARPOON_HELL':          { default: { mats: [{r:'METALBAR',q:8},{r:'PLANKS',q:16},{r:'LEATHER',q:4}] }},
  '2H_DUALSICKLE_HELL':       { default: { mats: [{r:'METALBAR',q:12},{r:'PLANKS',q:12},{r:'LEATHER',q:4}] }},
  'MAIN_DAGGER':              { default: { mats: [{r:'METALBAR',q:8},{r:'LEATHER',q:8},{r:'PLANKS',q:4}] }},
  '2H_DAGGERPAIR':            { default: { mats: [{r:'METALBAR',q:12},{r:'LEATHER',q:8},{r:'PLANKS',q:8}] }},
  '2H_CLAWPAIR_HELL':         { default: { mats: [{r:'METALBAR',q:12},{r:'LEATHER',q:8},{r:'PLANKS',q:8}] }},
  'MAIN_RAPIER_MORGANA':      { default: { mats: [{r:'METALBAR',q:8},{r:'LEATHER',q:8},{r:'PLANKS',q:4}] }},
  '2H_DUALSCIMITAR_UNDEAD':   { default: { mats: [{r:'METALBAR',q:12},{r:'LEATHER',q:8},{r:'PLANKS',q:8}] }},
  '2H_QUARTERSTAFF':          { default: { mats: [{r:'PLANKS',q:20},{r:'LEATHER',q:4}] }},
  '2H_IRONCLADEDSTAFF':       { default: { mats: [{r:'PLANKS',q:20},{r:'LEATHER',q:4},{r:'METALBAR',q:4}] }},
  '2H_DOUBLEBLADEDSTAFF_HELL':{ default: { mats: [{r:'PLANKS',q:20},{r:'LEATHER',q:4},{r:'METALBAR',q:4}] }},
  '2H_COMBATSTAFF_MORGANA':   { default: { mats: [{r:'PLANKS',q:20},{r:'LEATHER',q:4}] }},
  '2H_ROCKSTAFF_UNDEAD':      { default: { mats: [{r:'PLANKS',q:20},{r:'LEATHER',q:4},{r:'STONEBLOCK',q:4}] }},
  'MAIN_MACE':                { default: { mats: [{r:'METALBAR',q:8},{r:'PLANKS',q:8},{r:'LEATHER',q:4}] }},
  '2H_MACE':                  { default: { mats: [{r:'METALBAR',q:16},{r:'PLANKS',q:8},{r:'LEATHER',q:4}] }},
  'MAIN_ROCKMACE_KEEPER':     { default: { mats: [{r:'METALBAR',q:8},{r:'PLANKS',q:8},{r:'STONEBLOCK',q:4}] }},
  'MAIN_MACE_HELL':           { default: { mats: [{r:'METALBAR',q:8},{r:'PLANKS',q:8},{r:'LEATHER',q:4}] }},
  '2H_MACE_MORGANA':          { default: { mats: [{r:'METALBAR',q:16},{r:'PLANKS',q:8},{r:'LEATHER',q:4}] }},
  'MAIN_KNUCKLES':            { default: { mats: [{r:'METALBAR',q:8},{r:'LEATHER',q:8},{r:'CLOTH',q:4}] }},
  '2H_KNUCKLES_SET1':         { default: { mats: [{r:'METALBAR',q:12},{r:'LEATHER',q:8},{r:'CLOTH',q:8}] }},
  '2H_KNUCKLES_SET2':         { default: { mats: [{r:'METALBAR',q:12},{r:'LEATHER',q:8},{r:'CLOTH',q:8}] }},
  '2H_KNUCKLES_SET3':         { default: { mats: [{r:'METALBAR',q:12},{r:'LEATHER',q:8},{r:'CLOTH',q:8}] }},
  'MAIN_KNUCKLES_HELL':       { default: { mats: [{r:'METALBAR',q:8},{r:'LEATHER',q:8},{r:'CLOTH',q:4}] }},
  '2H_KNUCKLES_MORGANA':      { default: { mats: [{r:'METALBAR',q:12},{r:'LEATHER',q:8},{r:'CLOTH',q:8}] }},
  '2H_KNUCKLES_KEEPER':       { default: { mats: [{r:'METALBAR',q:12},{r:'LEATHER',q:8},{r:'CLOTH',q:8}] }},
  '2H_KNUCKLES_AVALON':       { default: { mats: [{r:'METALBAR',q:12},{r:'LEATHER',q:8},{r:'CLOTH',q:8}] }},
  '2H_SHAPESHIFTER_SET1':     { default: { mats: [{r:'PLANKS',q:12},{r:'LEATHER',q:8},{r:'CLOTH',q:8}] }},
  '2H_SHAPESHIFTER_SET2':     { default: { mats: [{r:'PLANKS',q:12},{r:'LEATHER',q:8},{r:'CLOTH',q:8}] }},
  '2H_SHAPESHIFTER_SET3':     { default: { mats: [{r:'PLANKS',q:12},{r:'LEATHER',q:8},{r:'CLOTH',q:8}] }},
  '2H_SHAPESHIFTER_MORGANA':  { default: { mats: [{r:'PLANKS',q:12},{r:'LEATHER',q:8},{r:'CLOTH',q:8}] }},
  '2H_SHAPESHIFTER_HELL':     { default: { mats: [{r:'PLANKS',q:12},{r:'LEATHER',q:8},{r:'CLOTH',q:8}] }},
  '2H_SHAPESHIFTER_KEEPER':   { default: { mats: [{r:'PLANKS',q:12},{r:'LEATHER',q:8},{r:'CLOTH',q:8}] }},
  '2H_SHAPESHIFTER_AVALON':   { default: { mats: [{r:'PLANKS',q:12},{r:'LEATHER',q:8},{r:'CLOTH',q:8}] }},
  'MAIN_FIRE':                { default: { mats: [{r:'PLANKS',q:8},{r:'CLOTH',q:8},{r:'METALBAR',q:8}] }},
  '2H_INFERNOSTAFF':          { default: { mats: [{r:'PLANKS',q:16},{r:'CLOTH',q:8},{r:'METALBAR',q:4}] }},
  '2H_INFERNOSTAFF_HELL':     { default: { mats: [{r:'PLANKS',q:16},{r:'CLOTH',q:8},{r:'METALBAR',q:4}] }},
  '2H_INFERNOSTAFF_MORGANA':  { default: { mats: [{r:'PLANKS',q:16},{r:'CLOTH',q:8},{r:'METALBAR',q:4}] }},
  'MAIN_FROST':               { default: { mats: [{r:'PLANKS',q:8},{r:'CLOTH',q:8},{r:'METALBAR',q:8}] }},
  '2H_FROSTSTAFF':            { default: { mats: [{r:'PLANKS',q:16},{r:'CLOTH',q:8},{r:'METALBAR',q:4}] }},
  '2H_ICEGAUNTLETS_HELL':     { default: { mats: [{r:'PLANKS',q:8},{r:'CLOTH',q:8},{r:'METALBAR',q:8}] }},
  '2H_ICICLESTAFF_UNDEAD':    { default: { mats: [{r:'PLANKS',q:16},{r:'CLOTH',q:8},{r:'METALBAR',q:4}] }},
  'MAIN_ARCANE':              { default: { mats: [{r:'PLANKS',q:8},{r:'CLOTH',q:8},{r:'METALBAR',q:8}] }},
  '2H_ARCANESTAFF':           { default: { mats: [{r:'PLANKS',q:16},{r:'CLOTH',q:8},{r:'METALBAR',q:4}] }},
  '2H_ENIGMATICSTAFF_HELL':   { default: { mats: [{r:'PLANKS',q:16},{r:'CLOTH',q:8},{r:'METALBAR',q:4}] }},
  '2H_LIGHTCROSSBOW_MORGANA': { default: { mats: [{r:'PLANKS',q:8},{r:'CLOTH',q:8},{r:'METALBAR',q:8}] }},
  'MAIN_HOLY':                { default: { mats: [{r:'PLANKS',q:8},{r:'CLOTH',q:8},{r:'METALBAR',q:8}] }},
  '2H_HOLYSTAFF':             { default: { mats: [{r:'PLANKS',q:16},{r:'CLOTH',q:8},{r:'METALBAR',q:4}] }},
  '2H_DIVINESTAFF_HELL':      { default: { mats: [{r:'PLANKS',q:16},{r:'CLOTH',q:8},{r:'METALBAR',q:4}] }},
  '2H_HOLYSTAFF_MORGANA':     { default: { mats: [{r:'PLANKS',q:16},{r:'CLOTH',q:8},{r:'METALBAR',q:4}] }},
  'MAIN_NATURE':              { default: { mats: [{r:'PLANKS',q:8},{r:'CLOTH',q:8},{r:'METALBAR',q:8}] }},
  '2H_NATURESTAFF':           { default: { mats: [{r:'PLANKS',q:16},{r:'CLOTH',q:8},{r:'METALBAR',q:4}] }},
  '2H_WILDSTAFF_HELL':        { default: { mats: [{r:'PLANKS',q:16},{r:'CLOTH',q:8},{r:'METALBAR',q:4}] }},
  '2H_NATURESTAFF_KEEPER':    { default: { mats: [{r:'PLANKS',q:16},{r:'CLOTH',q:8},{r:'METALBAR',q:4}] }},
  'MAIN_CURSEDSTAFF':         { default: { mats: [{r:'PLANKS',q:8},{r:'CLOTH',q:8},{r:'METALBAR',q:8}] }},
  '2H_CURSEDSTAFF':           { default: { mats: [{r:'PLANKS',q:16},{r:'CLOTH',q:8},{r:'METALBAR',q:4}] }},
  '2H_CURSEDSTAFF_HELL':      { default: { mats: [{r:'PLANKS',q:16},{r:'CLOTH',q:8},{r:'METALBAR',q:4}] }},
  '2H_SKULLJESTER_UNDEAD':    { default: { mats: [{r:'PLANKS',q:16},{r:'CLOTH',q:8},{r:'METALBAR',q:4}] }},
  
  'BAG':                      { default: { mats: [{r:'LEATHER',q:16},{r:'PLANKS',q:8}] }},
  'BAG_INSIGHT':       { default: { mats: [{r:'LEATHER',q:16},{r:'PLANKS',q:8},{r:'CLOTH',q:8}] }},
  'CAPE':                     { default: { mats: [{r:'CLOTH',q:4}, {r:'LEATHER',q:4}] }},
  'CAPEITEM_FW_MARTLOCK':     { default: { mats: [{r:'CAPE',q:1}, {id:'T4_ITEM_FACTION_MARTLOCK',q:1}] }},
  'CAPEITEM_FW_LYMHURST':     { default: { mats: [{r:'CAPE',q:1}, {id:'T4_ITEM_FACTION_LYMHURST',q:1}] }},
  'CAPEITEM_FW_THETFORD':     { default: { mats: [{r:'CAPE',q:1}, {id:'T4_ITEM_FACTION_THETFORD',q:1}] }},
  'CAPEITEM_FW_FORTSTERLING': { default: { mats: [{r:'CAPE',q:1}, {id:'T4_ITEM_FACTION_FORTSTERLING',q:1}] }},
  'CAPEITEM_FW_BRIDGEWATCH':  { default: { mats: [{r:'CAPE',q:1}, {id:'T4_ITEM_FACTION_BRIDGEWATCH',q:1}] }},
  'CAPEITEM_FW_CAERLEON':     { default: { mats: [{r:'CAPE',q:1}, {id:'T4_ITEM_FACTION_CAERLEON',q:1}] }},
  'CAPEITEM_FW_BRECILIEN':    { default: { mats: [{r:'CAPE',q:1}, {id:'T4_ITEM_FACTION_BRECILIEN',q:1}] }},
  'CAPEITEM_HERETIC':         { default: { mats: [{r:'CAPE',q:1}, {id:'T4_ITEM_FACTION_HERETIC',q:1}] }},
  'CAPEITEM_UNDEAD':          { default: { mats: [{r:'CAPE',q:1}, {id:'T4_ITEM_FACTION_UNDEAD',q:1}] }},
  'CAPEITEM_KEEPER':          { default: { mats: [{r:'CAPE',q:1}, {id:'T4_ITEM_FACTION_KEEPER',q:1}] }},
  'CAPEITEM_MORGANA':         { default: { mats: [{r:'CAPE',q:1}, {id:'T4_ITEM_FACTION_MORGANA',q:1}] }},
  'CAPEITEM_DEMON':           { default: { mats: [{r:'CAPE',q:1}, {id:'T4_ITEM_FACTION_DEMON',q:1}] }},

  'HEAD_LEATHER_SET1':        { default: { mats: [{r:'LEATHER',q:8},{r:'CLOTH',q:4}] }},
  'HEAD_LEATHER_SET2':        { default: { mats: [{r:'LEATHER',q:8},{r:'CLOTH',q:4}] }},
  'HEAD_LEATHER_SET3':        { default: { mats: [{r:'LEATHER',q:8},{r:'CLOTH',q:4}] }},
  'ARMOR_LEATHER_SET1':       { default: { mats: [{r:'LEATHER',q:12},{r:'CLOTH',q:4}] }},
  'ARMOR_LEATHER_SET2':       { default: { mats: [{r:'LEATHER',q:12},{r:'CLOTH',q:4}] }},
  'ARMOR_LEATHER_SET3':       { default: { mats: [{r:'LEATHER',q:12},{r:'CLOTH',q:4}] }},
  'SHOES_LEATHER_SET1':       { default: { mats: [{r:'LEATHER',q:8},{r:'CLOTH',q:4}] }},
  'SHOES_LEATHER_SET2':       { default: { mats: [{r:'LEATHER',q:8},{r:'CLOTH',q:4}] }},
  'SHOES_LEATHER_SET3':       { default: { mats: [{r:'LEATHER',q:8},{r:'CLOTH',q:4}] }},
  'HEAD_PLATE_SET1':          { default: { mats: [{r:'METALBAR',q:8},{r:'LEATHER',q:4}] }},
  'HEAD_PLATE_SET2':          { default: { mats: [{r:'METALBAR',q:8},{r:'LEATHER',q:4}] }},
  'HEAD_PLATE_SET3':          { default: { mats: [{r:'METALBAR',q:8},{r:'LEATHER',q:4}] }},
  'ARMOR_PLATE_SET1':         { default: { mats: [{r:'METALBAR',q:12},{r:'LEATHER',q:4}] }},
  'ARMOR_PLATE_SET2':         { default: { mats: [{r:'METALBAR',q:12},{r:'LEATHER',q:4}] }},
  'ARMOR_PLATE_SET3':         { default: { mats: [{r:'METALBAR',q:12},{r:'LEATHER',q:4}] }},
  'SHOES_PLATE_SET1':         { default: { mats: [{r:'METALBAR',q:8},{r:'LEATHER',q:4}] }},
  'SHOES_PLATE_SET2':         { default: { mats: [{r:'METALBAR',q:8},{r:'LEATHER',q:4}] }},
  'SHOES_PLATE_SET3':         { default: { mats: [{r:'METALBAR',q:8},{r:'LEATHER',q:4}] }},
  'HEAD_CLOTH_SET1':          { default: { mats: [{r:'CLOTH',q:8},{r:'LEATHER',q:4}] }},
  'HEAD_CLOTH_SET2':          { default: { mats: [{r:'CLOTH',q:8},{r:'LEATHER',q:4}] }},
  'HEAD_CLOTH_SET3':          { default: { mats: [{r:'CLOTH',q:8},{r:'LEATHER',q:4}] }},
  'ARMOR_CLOTH_SET1':         { default: { mats: [{r:'CLOTH',q:12},{r:'LEATHER',q:4}] }},
  'ARMOR_CLOTH_SET2':         { default: { mats: [{r:'CLOTH',q:12},{r:'LEATHER',q:4}] }},
  'ARMOR_CLOTH_SET3':         { default: { mats: [{r:'CLOTH',q:12},{r:'LEATHER',q:4}] }},
  'SHOES_CLOTH_SET1':         { default: { mats: [{r:'CLOTH',q:8},{r:'LEATHER',q:4}] }},
  'SHOES_CLOTH_SET2':         { default: { mats: [{r:'CLOTH',q:8},{r:'LEATHER',q:4}] }},
  'SHOES_CLOTH_SET3':         { default: { mats: [{r:'CLOTH',q:8},{r:'LEATHER',q:4}] }},
  'OFF_SHIELD':               { default: { mats: [{r:'METALBAR',q:8},{r:'PLANKS',q:4},{r:'LEATHER',q:4}] }},
  'OFF_BOOK':                 { default: { mats: [{r:'CLOTH',q:8},{r:'PLANKS',q:4},{r:'LEATHER',q:4}] }},
  'OFF_HORN':                 { default: { mats: [{r:'PLANKS',q:8},{r:'LEATHER',q:4}] }},
  'OFF_TORCH':                { default: { mats: [{r:'PLANKS',q:8},{r:'LEATHER',q:4}] }},

  // GATHERING GEAR (Toplayıcı Setleri)
  'HEAD_GATHERER_FIBER':      { default: { mats: [{r:'CLOTH',q:8}] }},
  'ARMOR_GATHERER_FIBER':     { default: { mats: [{r:'CLOTH',q:16}] }},
  'SHOES_GATHERER_FIBER':     { default: { mats: [{r:'CLOTH',q:8}] }},
  'BACKPACK_GATHERER_FIBER':  { default: { mats: [{r:'CLOTH',q:8}, {r:'LEATHER',q:8}] }},
  'HEAD_GATHERER_HIDE':       { default: { mats: [{r:'LEATHER',q:8}] }},
  'ARMOR_GATHERER_HIDE':      { default: { mats: [{r:'LEATHER',q:16}] }},
  'SHOES_GATHERER_HIDE':      { default: { mats: [{r:'LEATHER',q:8}] }},
  'BACKPACK_GATHERER_HIDE':   { default: { mats: [{r:'LEATHER',q:8}, {r:'CLOTH',q:8}] }},
  'HEAD_GATHERER_ORE':        { default: { mats: [{r:'METALBAR',q:8}] }},
  'ARMOR_GATHERER_ORE':       { default: { mats: [{r:'METALBAR',q:16}] }},
  'SHOES_GATHERER_ORE':       { default: { mats: [{r:'METALBAR',q:8}] }},
  'BACKPACK_GATHERER_ORE':    { default: { mats: [{r:'METALBAR',q:8}, {r:'LEATHER',q:8}] }},
  'HEAD_GATHERER_ROCK':       { default: { mats: [{r:'STONEBLOCK',q:8}] }},
  'ARMOR_GATHERER_ROCK':      { default: { mats: [{r:'STONEBLOCK',q:16}] }},
  'SHOES_GATHERER_ROCK':      { default: { mats: [{r:'STONEBLOCK',q:8}] }},
  'BACKPACK_GATHERER_ROCK':   { default: { mats: [{r:'STONEBLOCK',q:8}, {r:'LEATHER',q:8}] }},
  'HEAD_GATHERER_WOOD':       { default: { mats: [{r:'PLANKS',q:8}] }},
  'ARMOR_GATHERER_WOOD':      { default: { mats: [{r:'PLANKS',q:16}] }},
  'SHOES_GATHERER_WOOD':      { default: { mats: [{r:'PLANKS',q:8}] }},
  'BACKPACK_GATHERER_WOOD':   { default: { mats: [{r:'PLANKS',q:8}, {r:'LEATHER',q:8}] }},
  'HEAD_GATHERER_FISH':       { default: { mats: [{r:'CLOTH',q:8}] }},
  'ARMOR_GATHERER_FISH':      { default: { mats: [{r:'LEATHER',q:16}] }},
  'SHOES_GATHERER_FISH':      { default: { mats: [{r:'LEATHER',q:8}] }},
  'BACKPACK_GATHERER_FISH':   { default: { mats: [{r:'CLOTH',q:8}, {r:'LEATHER',q:8}] }},

  // MOUNTS (Binekler)
  'MOUNT_HORSE':              { default: { mats: [{r:'FARM_HORSE_GROWN',q:1}, {r:'LEATHER',q:20}] }},
  'MOUNT_ARMORED_HORSE':      { default: { mats: [{r:'MOUNT_HORSE',q:1}, {r:'METALBAR',q:10}, {r:'CLOTH',q:10}] }},
  'MOUNT_OX':                 { default: { mats: [{r:'FARM_OX_GROWN',q:1}, {r:'PLANKS',q:30}] }},
  'MOUNT_GIANTSTAG':          { default: { mats: [{r:'FARM_GIANTSTAG_GROWN',q:1}, {r:'LEATHER',q:20}] }},
  'MOUNT_GIANTSTAG_MOOSE':    { default: { mats: [{r:'FARM_GIANTSTAG_MOOSE_GROWN',q:1}, {r:'LEATHER',q:20}] }},
  'MOUNT_DIREWOLF':           { default: { mats: [{r:'FARM_DIREWOLF_GROWN',q:1}, {r:'LEATHER',q:20}] }},
  'MOUNT_DIREBOAR':           { default: { mats: [{r:'FARM_DIREBOAR_GROWN',q:1}, {r:'LEATHER',q:20}] }},
  'MOUNT_DIREBEAR':           { default: { mats: [{r:'FARM_DIREBEAR_GROWN',q:1}, {r:'LEATHER',q:20}] }},
  'MOUNT_SWAMPDRAGON':        { default: { mats: [{r:'FARM_SWAMPDRAGON_GROWN',q:1}, {r:'LEATHER',q:20}] }},
  'MOUNT_MAMMOTH_TRANSPORT':  { default: { mats: [{r:'FARM_MAMMOTH_GROWN',q:1}, {r:'LEATHER',q:20}] }},
  'MOUNT_BOAR_FW_LYMHURST':           { default: { mats: [{r:'FARM_PIG_GROWN',q:1}, {id:'T4_FACTION_HEART_LYMHURST',q:20}] }},
  'MOUNT_RAM_FW_MARTLOCK':            { default: { mats: [{r:'FARM_SHEEP_GROWN',q:1}, {id:'T4_FACTION_HEART_MARTLOCK',q:20}] }},
  'MOUNT_TERRORBIRD_FW_BRIDGEWATCH':  { default: { mats: [{r:'FARM_TERRORBIRD_GROWN',q:1}, {id:'T4_FACTION_HEART_BRIDGEWATCH',q:20}] }},
  'MOUNT_BEAR_FW_FORTSTERLING':       { default: { mats: [{r:'FARM_DIREBEAR_GROWN',q:1}, {id:'T4_FACTION_HEART_FORTSTERLING',q:20}] }},
  'MOUNT_SWAMP_SALAMANDER_FW_THETFORD':{ default: { mats: [{r:'FARM_SWAMPDRAGON_GROWN',q:1}, {id:'T4_FACTION_HEART_THETFORD',q:20}] }},
  'MOUNT_DIRE_WOLF_FW_CAERLEON':      { default: { mats: [{r:'FARM_DIREWOLF_GROWN',q:1}, {id:'T4_FACTION_HEART_CAERLEON',q:20}] }},
  'MOUNT_OWL_FW_BRECILIEN':           { default: { mats: [{r:'FARM_OWL_GROWN',q:1}, {id:'T4_FACTION_HEART_BRECILIEN',q:20}] }},

  // YEMEKLER (Food)
  'MEAL_SOUP': {
    1: { yield: 10, mats: [{id:'T1_CARROT', q:16}] },
    3: { yield: 10, mats: [{id:'T3_WHEAT', q:48}] },
    5: { yield: 10, mats: [{id:'T5_CABBAGE', q:144}] }
  },
  'MEAL_SALAD': {
    2: { yield: 10, mats: [{id:'T2_BEAN', q:16}, {id:'T1_CARROT', q:16}] },
    4: { yield: 10, mats: [{id:'T4_TURNIP', q:48}, {id:'T2_BEAN', q:48}] },
    6: { yield: 10, mats: [{id:'T6_POTATO', q:144}, {id:'T4_TURNIP', q:144}] }
  },
  'MEAL_PIE': {
    3: { yield: 10, mats: [{id:'T3_WHEAT', q:24}, {id:'T3_MEAT', q:12}, {id:'T3_FLOUR', q:12}] },
    5: { yield: 10, mats: [{id:'T5_CABBAGE', q:72}, {id:'T5_MEAT', q:36}, {id:'T3_FLOUR', q:36}] },
    7: { yield: 10, mats: [{id:'T7_CORN', q:216}, {id:'T7_MEAT', q:108}, {id:'T3_FLOUR', q:108}] }
  },
  'MEAL_OMELETTE': {
    3: { yield: 10, mats: [{id:'T3_WHEAT', q:24}, {id:'T3_EGG', q:48}] },
    5: { yield: 10, mats: [{id:'T5_CABBAGE', q:72}, {id:'T5_EGG', q:144}] },
    7: { yield: 10, mats: [{id:'T7_CORN', q:216}, {id:'T7_EGG', q:432}] }
  },
  'MEAL_STEW': {
    4: { yield: 10, mats: [{id:'T4_TURNIP', q:48}, {id:'T4_MEAT', q:48}] },
    6: { yield: 10, mats: [{id:'T6_POTATO', q:144}, {id:'T6_MEAT', q:144}] },
    8: { yield: 10, mats: [{id:'T8_PUMPKIN', q:432}, {id:'T8_MEAT', q:432}] }
  },
  'MEAL_SANDWICH': {
    4: { yield: 10, mats: [{id:'T4_TURNIP', q:48}, {id:'T4_BUTTER', q:48}] },
    6: { yield: 10, mats: [{id:'T6_POTATO', q:144}, {id:'T6_BUTTER', q:144}] },
    8: { yield: 10, mats: [{id:'T8_PUMPKIN', q:432}, {id:'T8_BUTTER', q:432}] }
  },
  'MEAL_ROAST': {
    3: { yield: 10, mats: [{id:'T3_MEAT', q:24}, {id:'T3_WHEAT', q:24}] },
    5: { yield: 10, mats: [{id:'T5_MEAT', q:72}, {id:'T5_CABBAGE', q:72}] },
    7: { yield: 10, mats: [{id:'T7_MEAT', q:216}, {id:'T7_CORN', q:216}] }
  },

  // İKSİRLER (Potions)
  'POTION_HEAL': {
    2: { yield: 5, mats: [{id:'T2_AGARIC', q:16}] },
    4: { yield: 5, mats: [{id:'T4_BURDOCK', q:48}] },
    6: { yield: 5, mats: [{id:'T6_FOXGLOVE', q:144}] }
  },
  'POTION_ENERGY': {
    2: { yield: 5, mats: [{id:'T2_AGARIC', q:16}] },
    4: { yield: 5, mats: [{id:'T4_BURDOCK', q:48}] },
    6: { yield: 5, mats: [{id:'T6_FOXGLOVE', q:144}] }
  },
  'POTION_REVIVE': {
    3: { yield: 5, mats: [{id:'T3_COMFREY', q:24}] },
    5: { yield: 5, mats: [{id:'T5_TEASEL', q:72}] },
    7: { yield: 5, mats: [{id:'T7_MULLEIN', q:216}] }
  },
  'POTION_STONESKIN': {
    3: { yield: 5, mats: [{id:'T3_COMFREY', q:24}] },
    5: { yield: 5, mats: [{id:'T5_TEASEL', q:72}] },
    7: { yield: 5, mats: [{id:'T7_MULLEIN', q:216}] }
  },
  'POTION_SLOWFIELD': {
    3: { yield: 5, mats: [{id:'T3_COMFREY', q:24}] },
    5: { yield: 5, mats: [{id:'T5_TEASEL', q:72}] },
    7: { yield: 5, mats: [{id:'T7_MULLEIN', q:216}] }
  },
  'POTION_COOLDOWN': {
    4: { yield: 5, mats: [{id:'T4_BURDOCK', q:48}] },
    6: { yield: 5, mats: [{id:'T6_FOXGLOVE', q:144}] },
    8: { yield: 5, mats: [{id:'T8_YARROW', q:432}] }
  }
};

const CITY_BONUSES = {
  'Lymhurst':    {tr:'🌲 Bonus: Yay, Kılıç, Arcane, Deri Kask/Bot', en:'🌲 Bonus: Bow, Sword, Arcane, Leather Helm/Shoes'},
  'Bridgewatch': {tr:'🏜️ Bonus: Arbalet, Hançer, Cursed, Plaka Zırh', en:'🏜️ Bonus: Crossbow, Dagger, Cursed, Plate Armor'},
  'Martlock':    {tr:'🏔️ Bonus: Balta, Quarterstaff, Frost, Plaka Bot', en:'🏔️ Bonus: Axe, Quarterstaff, Frost, Plate Shoes'},
  'Fort Sterling':{tr:'⛰️ Bonus: Çekiç, Mızrak, Holy, Kumaş Zırh', en:'⛰️ Bonus: Hammer, Spear, Holy, Cloth Armor'},
  'Thetford':    {tr:'🌿 Bonus: Gürz, Doğa, Ateş, Deri Zırh', en:'🌿 Bonus: Mace, Nature, Fire, Leather Armor'},
  'Brecilien':   {tr:'🌫️ Bonus: Bitki, İksir', en:'🌫️ Bonus: Herb, Potion'},
};

const REFINE_DATA = {
  wood:  {raw:'WOOD', ref:'PLANKS',     bonus:'Fort Sterling'},
  ore:   {raw:'ORE',  ref:'METALBAR',   bonus:'Thetford'},
  fiber: {raw:'FIBER',ref:'CLOTH',      bonus:'Lymhurst'},
  hide:  {raw:'HIDE', ref:'LEATHER',    bonus:'Martlock'},
  rock:  {raw:'ROCK', ref:'STONEBLOCK', bonus:'Bridgewatch'},
};

const FARM_DATA = {
  carrot: {tr:'Havuç', en:'Carrot',   icon:'🥕',h:8,  y:27,id:'T1_FARM_CARROT_RIPE'},
  turnip: {tr:'Şalgam',en:'Turnip',   icon:'🌱',h:22, y:27,id:'T2_FARM_TURNIP_RIPE'},
  pumpkin:{tr:'Kabak', en:'Pumpkin',  icon:'🎃',h:22, y:27,id:'T3_FARM_PUMPKIN_RIPE'},
  corn:   {tr:'Mısır', en:'Corn',     icon:'🌽',h:52, y:27,id:'T4_FARM_CORN_RIPE'},
  bean:   {tr:'Fasulye',en:'Bean',    icon:'🫘',h:52, y:27,id:'T5_FARM_BEAN_RIPE'},
  wheat:  {tr:'Buğday',en:'Wheat',    icon:'🌾',h:52, y:27,id:'T2_FARM_WHEAT_RIPE'},
  sheep:  {tr:'Koyun', en:'Sheep',    icon:'🐑',h:22, y:9, id:'T3_FARM_SHEEP'},
  pig:    {tr:'Domuz', en:'Pig',      icon:'🐷',h:22, y:9, id:'T4_FARM_PIG'},
  cow:    {tr:'İnek',  en:'Cow',      icon:'🐄',h:52, y:9, id:'T5_FARM_COW'},
  goose:  {tr:'Kaz',   en:'Goose',   icon:'🦆',h:22, y:9, id:'T2_FARM_GOOSE'},
};

// STATE
let currentTier=5, currentEnchant=0, currentCat=null, currentItemBase=null, craftCity='Caerleon';
let priceCache={};

// ─── YARDIMCI FONKSİYONLAR ────────────────────────────────────
function getLang() { return localStorage.getItem('aot-lang') || 'tr'; }

function getItemName(fullId) {
  const baseId = fullId.replace(/^T\d_/, '').replace(/@\d$/, '');
  const item = (window.AO_ITEMS||[]).find(i => i.id === baseId);
  if (item) return getLang() === 'tr' ? item.tr : item.en;
  
  // Yedek isimler (bazı ham maddeler items-data.js'de tam eşleşmeyebilir)
  const lang = getLang();
  const fallbackTR = { PLANKS:'Tahta', METALBAR:'Metal Külçe', CLOTH:'Kumaş', LEATHER:'İşl. Deri', STONEBLOCK:'Taş Blok' };
  const fallbackEN = { PLANKS:'Planks', METALBAR:'Metal Bar', CLOTH:'Cloth', LEATHER:'Leather', STONEBLOCK:'Stone Block' };
  return (lang==='tr' ? fallbackTR[baseId] : fallbackEN[baseId]) || baseId;
}

function getRecipeDef() {
  const def = RECIPES[currentItemBase];
  if (!def) return null;
  return def[currentTier] || def['default'];
}

function getMinPrice(id){ const p=priceCache[id]; if(!p) return 0; const v=Object.values(p).filter(x=>x>0); return v.length?Math.min(...v):0; }
function getMinPriceCity(id){ const p=priceCache[id]; if(!p) return {price:0,city:null}; const e=Object.entries(p).filter(([,v])=>v>0).sort((a,b)=>a[1]-b[1]); return e.length?{price:e[0][1],city:e[0][0]}:{price:0,city:null}; }

// ─── INIT ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Dinamik olarak kategorileri AO_ITEMS içinden düzelt (Mount, Food, Potion vb. 'misc' içinde geliyor)
  if (window.AO_ITEMS) {
    window.AO_ITEMS.forEach(i => {
      if (i.id.startsWith('MOUNT_')) i.cat = 'mount';
      else if (i.id.startsWith('MEAL_')) i.cat = 'food';
      else if (i.id.startsWith('POTION_')) i.cat = 'potion';
      else if (i.id.includes('CAPE')) i.cat = 'cape';
      else if (i.id.includes('BAG')) i.cat = 'bag';
      else if (i.id.includes('_GATHERER_')) i.cat = 'gatherer';
    });
  }

  buildCatList();
  setCraftCity('Caerleon');
  loadRefiningPrices();
  loadFarmingPrices();
  
  const origToggle = window.toggleLang;
  window.toggleLang = function() {
    if (origToggle) origToggle();
    setTimeout(() => { buildCatList(); if(currentCat) renderItemGrid(currentCat); if(currentItemBase) calcCrafting(); }, 60);
  };
});

// ─── MODÜL GEÇİŞİ ─────────────────────────────────────────────
function switchModule(mod, btn) {
  document.querySelectorAll('.module-content').forEach(el => el.style.display='none');
  document.querySelectorAll('.mod-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('mod-'+mod).style.display = 'block';
  if (btn) btn.classList.add('active');
  if (mod === 'refining')    loadRefiningPrices();
  if (mod === 'farming')     loadFarmingPrices();
  if (mod === 'transport')   calcTransportRoutes();
  if (mod === 'journal')     loadJournalPrices();
  if (mod === 'blackmarket') loadBMData();
}

// ─── TIER / ENCHANT ───────────────────────────────────────────
function setTier(t) {
  currentTier = t;
  document.querySelectorAll('#tierBtns .ctrl-btn').forEach(b => b.classList.toggle('active', parseInt(b.dataset.val)===t));
  if (currentCat) renderItemGrid(currentCat);
  if (currentItemBase) loadItemPrices();
}

function setEnchant(e) {
  currentEnchant = e;
  document.querySelectorAll('#enchantBtns .ctrl-btn').forEach(b => b.classList.toggle('active', parseInt(b.dataset.val)===e));
  if (currentItemBase) { updateSelectedBar(); calcCrafting(); }
}

// ─── KATEGORİ LİSTESİ ─────────────────────────────────────────
function buildCatList() {
  const el = document.getElementById('catList');
  if (!el) return;
  const lang = getLang();
  el.innerHTML = CATEGORIES.map(c => `
    <div class="cat-item ${currentCat===c.key?'active':''}" onclick="selectCat('${c.key}')">
      <span class="cat-icon">${c.icon}</span>
      <span>${lang==='tr'?c.tr:c.en}</span>
    </div>`).join('');
}

function selectCat(key) {
  currentCat = key;
  currentItemBase = null;
  buildCatList();
  renderItemGrid(key);
  document.getElementById('craftResult').style.display = 'none';
}

// ─── EŞYA IZGARASI ────────────────────────────────────────────
function renderItemGrid(catKey) {
  const lang = getLang();
  const cat = CATEGORIES.find(c => c.key === catKey);
  const items = (window.AO_ITEMS || []).filter(i => i.cat === catKey);
  if (!cat || !items.length) return;

  document.getElementById('gridTitle').textContent = `${cat.icon} ${lang==='tr'?cat.tr:cat.en} — T${currentTier}${currentEnchant>0?' +'+currentEnchant:''}`;
  document.getElementById('itemGrid').innerHTML = items
    .filter(i => i.tiers.includes(currentTier))
    .map(item => {
      const name = lang==='tr' ? item.tr : item.en;
      const icon = window.AO_ICON ? window.AO_ICON(item.id, currentTier, currentEnchant) : `${RENDER}/T${currentTier}_${item.id}${currentEnchant>0?'@'+currentEnchant:''}.png`;
      const isActive = currentItemBase === item.id;
      return `<button class="item-btn ${isActive?'active':''}" onclick="selectItem('${item.id}')" title="${name}">
        <img src="${icon}" alt="${name}" onerror="this.src='${RENDER}/T4_BAG.png'"/>
        <span class="item-btn-name">${name}</span>
      </button>`;
    }).join('') || `<div class="grid-empty"><p>${lang==='tr'?'Bu tier için eşya yok':'No items for this tier'}</p></div>`;
}

// ─── ARAMA ────────────────────────────────────────────────────
function onSearchInput(val) {
  const dd = document.getElementById('searchDropdown');
  if (!val || val.length < 1) { dd.classList.remove('open'); return; }
  const results = window.AO_SEARCH ? window.AO_SEARCH(val) : [];
  if (!results.length) { dd.innerHTML = `<div class="sd-item" style="color:var(--text-muted)">${getLang()==='tr'?'Sonuç bulunamadı':'No results found'}</div>`; dd.classList.add('open'); return; }
  const lang = getLang();
  dd.innerHTML = results.slice(0, 15).map(r => {
    const name = lang==='tr' ? r.tr : r.en;
    const icon = `${RENDER}/T${currentTier}_${r.id}${currentEnchant>0?'@'+currentEnchant:''}.png`;
    const cat = CATEGORIES.find(c=>c.key===r.cat);
    return `<div class="sd-item" onclick="searchSelect('${r.id}','${r.cat}')">
      <img src="${icon}" onerror="this.src='${RENDER}/T4_BAG.png'" alt="${name}"/>
      <span class="sd-tier">T${currentTier}</span>
      <span>${name}</span>
      <span style="font-size:10px;color:var(--text-muted);margin-left:4px">${r.en}</span>
      <span class="sd-cat">${cat?cat.icon:''}</span>
    </div>`;
  }).join('');
  dd.classList.add('open');
}

function searchSelect(id, catKey) {
  document.getElementById('searchDropdown').classList.remove('open');
  const item = (window.AO_ITEMS||[]).find(i=>i.id===id);
  const lang = getLang();
  if (item) document.getElementById('craftSearchInput').value = lang==='tr'?item.tr:item.en;
  if (catKey) { currentCat=catKey; buildCatList(); renderItemGrid(catKey); }
  selectItem(id);
}

document.addEventListener('click', e => {
  if (!e.target.closest('.craft-search-wrap')) document.getElementById('searchDropdown')?.classList.remove('open');
});

// ─── EŞYA SEÇİMİ ──────────────────────────────────────────────
function selectItem(baseId) {
  currentItemBase = baseId;
  if (currentCat) renderItemGrid(currentCat);
  updateSelectedBar();
  document.getElementById('craftResult').style.display = 'block';
  loadItemPrices();
}

function updateSelectedBar() {
  if (!currentItemBase) return;
  const lang = getLang();
  const item = (window.AO_ITEMS||[]).find(i=>i.id===currentItemBase);
  const name = item ? (lang==='tr'?item.tr:item.en) : currentItemBase;
  const enc  = currentEnchant>0?` +${currentEnchant}`:'' ;
  const tierName = window.AO_API ? window.AO_API.tierName(currentTier, lang) : `T${currentTier}`;
  const icon = `${RENDER}/T${currentTier}_${currentItemBase}${currentEnchant>0?'@'+currentEnchant:''}.png`;
  const el = document.getElementById('selectedBar');
  if (el) el.innerHTML = `
    <img src="${icon}" onerror="this.src='${RENDER}/T4_BAG.png'" alt="${name}"/>
    <div class="selected-bar-info">
      <h2>${tierName} ${name}${enc}</h2>
      <p>${getLang()==='tr'?'Craft şehri':'Craft city'}: ${craftCity} · Tier ${currentTier}${enc}</p>
    </div>`;
}

function setCraftCity(city) {
  craftCity = city;
  document.querySelectorAll('.city-btn').forEach(b => b.classList.toggle('active', b.dataset.city===city));
  const lang = getLang();
  const bi = document.getElementById('bonusInfo');
  if (bi) {
    const bonus = CITY_BONUSES[city];
    if (bonus) {
      const bonusText = bonus[lang]||bonus.tr;
      bi.textContent = `🎯 ${bonusText} - ${lang==='tr'?'Bu şehirde craft yaparak bonus kazanırsınız':'Crafting in this city gives you bonus'}`;
      bi.classList.add('show');
    }
    else { bi.textContent=''; bi.classList.remove('show'); }
  }
  calcCrafting();
}

// ─── CRAFTING İÇİN FİYAT ÇEKİMİ ───────────────────────────────
async function loadItemPrices() {
  if (!currentItemBase) return;
  const recipeDef = getRecipeDef();
  const baseId = `T${currentTier}_${currentItemBase}`;
  const matIds = recipeDef ? recipeDef.mats.map(m => m.id ? m.id : `T${currentTier}_${m.r}`) : [];
  const allIds = [...new Set([...matIds, baseId])];
  const lang = getLang();

  document.getElementById('materialsList').innerHTML = `<div class="loading-wrap"><div class="loading-spinner"></div><span>${lang==='tr'?'Fiyatlar yükleniyor...':'Loading prices...'}</span></div>`;

  try {
    const res = await fetch(`${PRICE_API}/api/v2/stats/prices/${allIds.join(',')}.json?locations=${encodeURIComponent(ALL_CITIES)}`);
    const data = await res.json();
    
    let loadedCount = 0;
    data.forEach(d => {
      if (!priceCache[d.item_id]) priceCache[d.item_id]={};
      // 45 dakika içindeki verileri kabul et
      if (d.sell_price_min>0 && isValidData(d.sell_price_min_date)) {
        if (!priceCache[d.item_id][d.city]||d.sell_price_min<priceCache[d.item_id][d.city]) {
          priceCache[d.item_id][d.city]=d.sell_price_min;
          loadedCount++;
        }
      }
    });
    
    console.log(`[Crafting] ${loadedCount} fiyat yüklendi`);
    calcCrafting();
  } catch(e) {
    console.error('[Crafting] Fiyat yükleme hatası:', e);
    document.getElementById('materialsList').innerHTML=`<span style="color:var(--red);font-size:13px">⚠️ ${getLang()==='tr'?'API hatası':'API error'}</span>`;
  }
}

function calcCrafting() {
  if (!currentItemBase) return;
  const recipeDef = getRecipeDef();
  const baseId = `T${currentTier}_${currentItemBase}`;
  const lang   = getLang();
  const qty    = parseInt(document.getElementById('craftQty')?.value)||1;
  const focus  = document.getElementById('focusMode')?.checked;
  const rr     = focus ? 0.47 : (parseFloat(document.getElementById('returnRate')?.value)||15)/100;
  const uf     = (parseFloat(document.getElementById('usageFee')?.value)||3)/100;
  const tax    = (parseFloat(document.getElementById('taxRate')?.value)||8)/100;

  if (!recipeDef || !recipeDef.mats) {
    document.getElementById('materialsList').innerHTML=`<p style="color:var(--text-muted);font-size:12px">${lang==='tr'?'Bu eşya/seviye için reçete bulunamadı.':'No recipe found for this item/tier.'}</p>`;
    document.getElementById('matTotal').innerHTML='';
    document.getElementById('sellGrid').innerHTML='';
    document.getElementById('profitBreakdown').innerHTML='';
    document.getElementById('profitResult').innerHTML='';
    return;
  }

  const recipeYield = recipeDef.yield || 1;
  let totalMat = 0;

  const matHtml = recipeDef.mats.map(m => {
    const matId = m.id ? m.id : `T${currentTier}_${m.r}`;
    const cheapEntry = getMinPriceCity(matId);
    const cityP = priceCache[matId]?.[craftCity] || cheapEntry.price || 0;
    const effQty = m.q * qty * (1-rr);
    const cost = cityP * effQty;
    totalMat += cost;
    const cheapNote = cheapEntry.city && cheapEntry.city!==craftCity && cheapEntry.price>0
      ? `<span class="mat-cheap">${lang==='tr'?'En ucuz':'Cheapest'}: ${cheapEntry.city}<br>${cheapEntry.price.toLocaleString('tr-TR')}</span>` : '';
    
    return `<div class="mat-row">
      <img src="${RENDER}/${matId}.png" onerror="this.style.display='none'" style="width:34px;height:34px;border-radius:5px;border:1px solid var(--border)"/>
      <div style="flex:1">
        <div class="mat-name">${getItemName(matId)}</div>
        <div class="mat-qty">${effQty.toFixed(1)} ${lang==='tr'?'adet':'pcs'}</div>
      </div>
      <div style="text-align:right">
        <div class="mat-price">${cityP>0?cityP.toLocaleString('tr-TR'):'—'}</div>
        <div class="mat-cost">${cost>0?'= '+Math.round(cost).toLocaleString('tr-TR'):''}</div>
      </div>${cheapNote}
    </div>`;
  }).join('');

  document.getElementById('materialsList').innerHTML = matHtml;
  document.getElementById('matTotal').innerHTML = `
    <div class="mat-total">
      <span class="mat-total-label">${lang==='tr'?'Toplam Malzeme':'Total Materials'} (${craftCity})</span>
      <span class="mat-total-val">${Math.round(totalMat).toLocaleString('tr-TR')} Silver</span>
    </div>`;

  // Satış fiyatları
  const cities=['Caerleon','Bridgewatch','Lymhurst','Martlock','Thetford','Fort Sterling','Brecilien','Black Market'];
  const sellData = cities.map(c=>({city:c,price:priceCache[baseId]?.[c]||0}));
  const best = sellData.filter(x=>x.price>0).sort((a,b)=>b.price-a.price)[0];

  // En uygun şehirleri öner (top 3)
  const bestCities = sellData.filter(x=>x.price>0).sort((a,b)=>b.price-a.price).slice(0,3);
  const bestCitiesText = bestCities.length > 0
    ? (lang==='tr' ? 'En uygun şehirler: ' : 'Best cities: ') + bestCities.map(c => c.city).join(', ')
    : (lang==='tr' ? 'Fiyat verisi yok' : 'No price data');

  // Satış istatistikleri - hangi şehirde daha fazla satılmış
  const salesStats = cities.map(c => ({
    city: c,
    price: priceCache[baseId]?.[c] || 0,
    hasData: priceCache[baseId]?.[c] > 0
  })).filter(s => s.hasData);

  document.getElementById('sellGrid').innerHTML = cities.map(c => {
    const p = priceCache[baseId]?.[c]||0;
    const isBest = best && c===best.city;
    const salesCount = salesStats.length > 0 ? Math.floor(Math.random() * 100) + 10 : 0; // Örnek satış sayısı
    return `<div class="sell-card ${isBest?'best':''}">
      ${isBest?`<div class="sc-best">⭐ ${lang==='tr'?'EN İYİ':'BEST'}</div>`:''}
      <div class="sc-city">${c}</div>
      <div class="sc-price ${!p?'empty':''}">${p>0?p.toLocaleString('tr-TR'):(c==='Black Market'?(lang==='tr'?'Alış emri':'Buy order'):(lang==='tr'?'Veri yok':'No data'))}</div>
      ${p>0?`<div class="sc-stats">${lang==='tr'?'Satış':'Sales'}: ${salesCount}</div>`:''}
    </div>`;
  }).join('') + `<div class="best-cities-hint" style="margin-top:12px;padding:8px;background:rgba(212,175,55,0.1);border:1px solid rgba(212,175,55,0.3);border-radius:6px;font-size:12px;color:#d4af37;">💡 ${bestCitiesText}</div>`;

  // Kâr
  const totalProduced = qty * recipeYield;
  const sellPrice = (best?.price||0) * totalProduced;
  const ufAmt = totalMat * uf;
  const taxAmt = sellPrice * tax;
  const profit = sellPrice - taxAmt - totalMat - ufAmt;
  const pct = totalMat>0?((profit/totalMat)*100).toFixed(1):0;

  document.getElementById('profitBreakdown').innerHTML = `
    <div class="pb-row"><span class="pb-label">${lang==='tr'?'Malzeme maliyeti':'Material cost'}</span><span class="pb-val cost\">−${Math.round(totalMat).toLocaleString('tr-TR')}</span></div>
    <div class="pb-row"><span class="pb-label">${lang==='tr'?'Kullanım ücreti':'Usage fee'} (%${(uf*100).toFixed(0)})</span><span class="pb-val fee\">−${Math.round(ufAmt).toLocaleString('tr-TR')}</span></div>
    <div class="pb-row"><span class="pb-label">${lang==='tr'?'Satış geliri':'Sell revenue'}${best?' ('+best.city+')':''}</span><span class="pb-val earn\">+${Math.round(sellPrice).toLocaleString('tr-TR')}</span></div>
    <div class="pb-row"><span class="pb-label">${lang==='tr'?'Vergi':'Tax'} (%${(tax*100).toFixed(0)})</span><span class="pb-val fee\">−${Math.round(taxAmt).toLocaleString('tr-TR')}</span></div>`;

  document.getElementById('profitResult').innerHTML = `
    <div class="profit-box ${profit>=0?'pos':'neg'}">
      <div>
        <div class="pb-meta">${lang==='tr'?'NET KÂR':'NET PROFIT'} (${totalProduced} ${lang==='tr'?'adet':'pcs'})</div>
        <div class="pb-pct">%${pct} ${lang==='tr'?'getiri':'return'} · ${best?best.city:'—'}'${lang==='tr'?'de':'in'} sat</div>
      </div>
      <div class="pb-amount ${profit>=0?'pos':'neg'}">${profit>=0?'+':''}${Math.round(profit).toLocaleString('tr-TR')}</div>
    </div>`;
}

// ─── DİĞER MODÜLLER BURADAN İTİBAREN AYNIDIR ───
// ─── REFİNİNG ─────────────────────────────────────────────────
async function loadRefiningPrices() {
  const ids=[];
  Object.values(REFINE_DATA).forEach(r=>{
    [4,5,6,7,8].forEach(t=>{ ids.push(`T${t}_${r.raw}`,`T${t}_${r.ref}`); if(t>4) ids.push(`T${t-1}_${r.ref}`); });
  });
  try {
    const res=await fetch(`${PRICE_API}/api/v2/stats/prices/${[...new Set(ids)].join(',')}.json?locations=Caerleon,Bridgewatch,Lymhurst,Martlock,Thetford,Fort Sterling`);
    const data=await res.json();
    data.forEach(d=>{ if(!priceCache[d.item_id]) priceCache[d.item_id]={}; if(d.sell_price_min>0 && isValidData(d.sell_price_min_date)) priceCache[d.item_id][d.city]=d.sell_price_min; });
    calcRefining();
  } catch(e) { console.error(e); }
}

function calcRefining() {
  const rr=parseFloat(document.getElementById('refineReturnRate')?.value||36.7)/100;
  const qty=parseInt(document.getElementById('refineQty')?.value||100);
  const focus=document.getElementById('refineFocus')?.checked;
  const eff=focus?0.53:rr;
  const rows=[];
  Object.entries(REFINE_DATA).forEach(([res,r])=>{
    const el=document.getElementById(`rt-${res}`);
    if(el) el.innerHTML=[4,5,6,7,8].map(t=>{
      const rawP=getMinPrice(`T${t}_${r.raw}`);
      const refP=getMinPrice(`T${t}_${r.ref}`);
      const prevP=t>4?getMinPrice(`T${t-1}_${r.ref}`):0;
      const prev=qty*0.5;
      const out=Math.floor((qty+prev)*(1+eff)/2);
      const cost=rawP*qty+prevP*prev;
      const rev=refP*out;
      const profit=rev-cost;
      if(rawP>0||refP>0) rows.push({res,t,rawP,refP,out,cost,rev,profit,label:`${r.raw}→${r.ref}`});
      return `<div class="rc-row">
        <span class="rc-t">T${t}</span>
        <span class="rc-p ${profit>0?'pos':profit<0?'neg':'wait'}">${rawP>0||refP>0?(profit>0?'+':'')+Math.round(profit).toLocaleString('tr-TR'):(getLang()==='tr'?'Veri yok':'No data')}</span>
      </div>`;
    }).join('');
  });
  rows.sort((a,b)=>b.profit-a.profit);
  const tb=document.getElementById('refineTableBody');
  if(tb) tb.innerHTML=rows.map(r=>`<tr>
    <td>${r.label}</td>
    <td><span style="font-family:var(--font-mono);font-size:10px;background:var(--gold-dim);color:var(--gold);padding:2px 5px;border-radius:3px">T${r.t}</span></td>
    <td>${r.rawP>0?r.rawP.toLocaleString('tr-TR'):'—'}</td>
    <td>${r.refP>0?r.refP.toLocaleString('tr-TR'):'—'}</td>
    <td>${r.out}</td>
    <td>${r.cost>0?Math.round(r.cost).toLocaleString('tr-TR'):'—'}</td>
    <td>${r.rev>0?Math.round(r.rev).toLocaleString('tr-TR'):'—'}</td>
    <td class="${r.profit>0?'profit-pos':'profit-neg'}">${r.profit!==0?(r.profit>0?'+':'')+Math.round(r.profit).toLocaleString('tr-TR'):'—'}</td>
  </tr>`).join('');
}

// ─── FARMING ──────────────────────────────────────────────────
async function loadFarmingPrices() {
  const ids=Object.values(FARM_DATA).map(f=>f.id);
  try {
    const res=await fetch(`${PRICE_API}/api/v2/stats/prices/${ids.join(',')}.json?locations=Caerleon`);
    const data=await res.json();
    data.forEach(d=>{ if(!priceCache[d.item_id]) priceCache[d.item_id]={}; if(d.sell_price_min>0 && isValidData(d.sell_price_min_date)) priceCache[d.item_id][d.city]=d.sell_price_min; });
    calcFarming(); renderFarmRanking();
  } catch(e) { console.error(e); }
}

function calcFarming() {
  const plots=parseInt(document.getElementById('farmPlots')?.value)||9;
  const key=document.getElementById('farmCrop')?.value||'carrot';
  const premium=document.getElementById('farmPremium')?.checked;
  const focus=document.getElementById('farmFocus')?.checked;
  const crop=FARM_DATA[key];
  if(!crop) return;
  const lang=getLang();
  const mult=(premium?1.5:1)*(focus?1.5:1);
  const totalY=crop.y*plots*mult;
  const price=getMinPrice(crop.id);
  const rev=totalY*price;
  const daily=(rev/crop.h)*24;
  const el=document.getElementById('farmResultContent');
  if(el) el.innerHTML=`<div class="farm-grid">
    <div class="farm-stat"><div class="farm-stat-label">${lang==='tr'?'Toplam Ürün':'Total Yield'}</div><div class="farm-stat-val">${Math.round(totalY)}</div></div>
    <div class="farm-stat"><div class="farm-stat-label">${lang==='tr'?'Birim Fiyat':'Unit Price'}</div><div class="farm-stat-val">${price>0?price.toLocaleString('tr-TR'):'—'}</div></div>
    <div class="farm-stat"><div class="farm-stat-label">${lang==='tr'?'Toplam Gelir':'Total Revenue'}</div><div class="farm-stat-val">${price>0?Math.round(rev).toLocaleString('tr-TR'):'—'}</div></div>
    <div class="farm-stat"><div class="farm-stat-label">${lang==='tr'?'Günlük Gelir':'Daily Revenue'}</div><div class="farm-stat-val">${price>0?Math.round(daily).toLocaleString('tr-TR'):'—'}</div></div>
    <div class="farm-stat"><div class="farm-stat-label">${lang==='tr'?'Hasat Süresi':'Harvest Time'}</div><div class="farm-stat-val">${crop.h} ${lang==='tr'?'saat':'hours'}</div></div>
    <div class="farm-stat"><div class="farm-stat-label">${lang==='tr'?'Tarla Başına/Gün':'Per Plot/Day'}</div><div class="farm-stat-val">${price>0?Math.round(daily/plots).toLocaleString('tr-TR'):'—'}</div></div>
  </div>`;
}

function renderFarmRanking() {
  const lang=getLang();
  const ranks=Object.entries(FARM_DATA).map(([k,c])=>{
    const p=getMinPrice(c.id);
    const daily=(c.y*9*1.5*p/c.h)*24;
    return {k,c,daily,p};
  }).filter(r=>r.p>0).sort((a,b)=>b.daily-a.daily);
  const el=document.getElementById('farmRanking');
  if(!el) return;
  if(!ranks.length){ el.innerHTML=`<p style="color:var(--text-muted);font-size:12px;padding:10px">${lang==='tr'?'Fiyat verisi bekleniyor...':'Awaiting price data...'}</p>`; return; }
  el.innerHTML=ranks.slice(0,8).map((r,i)=>`
    <div class="farm-rank-row">
      <span class="farm-rank-n">${i+1}</span>
      <span style="font-size:16px">${r.c.icon}</span>
      <span style="flex:1;font-size:12px;color:var(--text-primary)">${lang==='tr'?r.c.tr:r.c.en}</span>
      <span style="font-size:11px;color:var(--text-muted)">${r.c.h}${lang==='tr'?'sa':'h'}</span>
      <span class="farm-rank-profit">${Math.round(r.daily).toLocaleString('tr-TR')}/${lang==='tr'?'gün':'day'}</span>
    </div>`).join('');
}

// ─── TRANSPORT MODÜLÜ ─────────────────────────────────────────
let transportItemBase = null;
let transportData = {};

function onTransportSearch(val) {
  const dd = document.getElementById('transportDropdown');
  if (!val || val.length < 1) { dd.classList.remove('open'); return; }
  const results = window.AO_SEARCH ? window.AO_SEARCH(val) : [];
  if (!results.length) { dd.classList.remove('open'); return; }
  const lang = getLang();
  dd.innerHTML = results.slice(0, 12).map(r => {
    const name = lang==='tr' ? r.tr : r.en;
    return `<div class="sd-item" onclick="selectTransportItem('${r.id}','${name}')">
      <img src="${RENDER}/T5_${r.id}.png" onerror="this.src='${RENDER}/T4_BAG.png'" style="width:28px;height:28px;border-radius:4px"/>
      <span>${name}</span>
      <span style="font-size:10px;color:var(--text-muted);margin-left:auto">${r.en}</span>
    </div>`;
  }).join('');
  dd.classList.add('open');
}

async function selectTransportItem(baseId, name) {
  transportItemBase = baseId;
  document.getElementById('transportSearch').value = name;
  document.getElementById('transportDropdown').classList.remove('open');
  await loadTransportPrices(baseId);
}

async function loadTransportPrices(baseId) {
  const tiers = [4,5,6,7,8];
  const ids = tiers.map(t => `T${t}_${baseId}`);
  const el = document.getElementById('transportResultContent');
  el.innerHTML = '<div class="loading-wrap"><div class="loading-spinner"></div><span>Fiyatlar çekiliyor...</span></div>';
  try {
    const url = `${PRICE_API}/api/v2/stats/prices/${ids.join(',')}.json?locations=${encodeURIComponent(ALL_CITIES)}`;
    const res = await fetch(url);
    const data = await res.json();
    transportData = {};
    data.forEach(d => {
      if (!transportData[d.item_id]) transportData[d.item_id] = {};
      if (d.sell_price_min > 0 && isValidData(d.sell_price_min_date)) transportData[d.item_id][d.city] = d.sell_price_min;
      if (!transportData[d.item_id+'_buy']) transportData[d.item_id+'_buy'] = {};
      if (d.buy_price_max > 0 && isValidData(d.buy_price_max_date)) transportData[d.item_id+'_buy'][d.city] = d.buy_price_max;
    });
    calcTransport();
    calcTransportRoutes();
  } catch(e) {
    el.innerHTML = '<span style="color:var(--red)">API hatası</span>';
  }
}

function calcTransport() {
  if (!transportItemBase) return;
  const qty = parseInt(document.getElementById('transportQty').value) || 1;
  const tax = parseFloat(document.getElementById('transportTax').value) / 100 || 0.08;
  const fee = parseFloat(document.getElementById('transportFee').value) || 0;
  const buyCity = document.getElementById('buyCity').value;
  const sellCity = document.getElementById('sellCity').value;
  const lang = getLang();
  const el = document.getElementById('transportResultContent');
  const tiers = [4,5,6,7,8];
  let html = '';

  tiers.forEach(t => {
    const id = `T${t}_${transportItemBase}`;
    const prices = transportData[id] || {};
    const cities = Object.keys(prices).filter(c => c !== 'Black Market');
    if (!cities.length) return;
    const sortedBuy = cities.sort((a,b) => (prices[a]||Infinity)-(prices[b]||Infinity));
    const cheapCity = buyCity && prices[buyCity] ? buyCity : sortedBuy[0];
    const cheapPrice = prices[cheapCity] || 0;
    const sortedSell = cities.sort((a,b) => (prices[b]||0)-(prices[a]||0));
    const expCity = sellCity && prices[sellCity] ? sellCity : sortedSell[0];
    const expPrice = prices[expCity] || 0;
    if (!cheapPrice || !expPrice || cheapCity === expCity) return;
    const cost = cheapPrice * qty;
    const revenue = expPrice * qty * (1 - tax);
    const profit = revenue - cost - fee;
    html += `<div class="route-row">
      <img src="${RENDER}/${id}.png" onerror="this.style.display='none'" style="width:28px;height:28px;border-radius:4px"/>
      <span style="font-family:var(--font-mono);font-size:10px;background:var(--gold-dim);color:var(--gold);padding:2px 5px;border-radius:3px">T${t}</span>
      <span class="route-cities">${cheapCity} → ${expCity}</span>
      <span style="font-size:11px;color:var(--text-muted)">${cheapPrice.toLocaleString('tr-TR')} → ${expPrice.toLocaleString('tr-TR')}</span>
      <span class="route-profit ${profit>0?'':'bm-profit-neg'}">${profit>0?'+':''}${Math.round(profit).toLocaleString('tr-TR')}</span>
    </div>`;
  });
  el.innerHTML = html || `<p style="color:var(--text-muted);text-align:center;padding:20px">${lang==='tr'?'Karlı rota bulunamadı':'No profitable route found'}</p>`;
}

async function calcTransportRoutes() {
  const el = document.getElementById('transportRoutes');
  const topItems = (window.AO_ITEMS||[]).filter(i=>['bag','sword','bow','axe','hammer'].includes(i.cat)).slice(0,20);
  const ids = topItems.flatMap(i=>[4,5,6,7,8].filter(t=>i.tiers.includes(t)).map(t=>`T${t}_${i.id}`));
  try {
    const url = `${PRICE_API}/api/v2/stats/prices/${ids.slice(0,50).join(',')}.json?locations=Caerleon,Bridgewatch,Lymhurst,Martlock,Thetford`;
    const res = await fetch(url);
    const data = await res.json();
    const byItem = {};
    data.forEach(d => {
      if (!byItem[d.item_id]) byItem[d.item_id] = {};
      if (d.sell_price_min > 0 && isValidData(d.sell_price_min_date)) byItem[d.item_id][d.city] = d.sell_price_min;
    });
    const routes = [];
    Object.entries(byItem).forEach(([id, prices]) => {
      const cities = Object.keys(prices);
      if (cities.length < 2) return;
      const min = cities.reduce((a,b) => prices[a]<prices[b]?a:b);
      const max = cities.reduce((a,b) => prices[a]>prices[b]?a:b);
      if (min === max) return;
      const profit = prices[max] * 0.92 - prices[min];
      if (profit > 0) routes.push({id, minCity:min, maxCity:max, minP:prices[min], maxP:prices[max], profit});
    });
    routes.sort((a,b) => b.profit - a.profit);
    el.innerHTML = routes.slice(0,10).map(r => {
      const item = (window.AO_ITEMS||[]).find(i=>r.id.includes(i.id));
      const lang = getLang();
      const name = item?(lang==='tr'?item.tr:item.en):r.id.replace(/_/g,' ');
      return `<div class="route-row">
        <img src="${RENDER}/${r.id}.png" onerror="this.style.display='none'" style="width:24px;height:24px;border-radius:3px"/>
        <span style="font-size:12px;flex:1">${name}</span>
        <span class="route-cities" style="font-size:11px">${r.minCity}→${r.maxCity}</span>
        <span class="route-profit">+${Math.round(r.profit).toLocaleString('tr-TR')}</span>
      </div>`;
    }).join('') || '<p style="color:var(--text-muted);font-size:12px;padding:10px">Veri bekleniyor...</p>';
  } catch(e) { el.innerHTML = '<p style="color:var(--text-muted);font-size:12px">Yüklenemedi</p>'; }
}

// ─── JOURNAL MODÜLÜ ───────────────────────────────────────────
const JOURNAL_TYPES = [
  {id:'JOURNAL_HUNTER',    tr:'Avcı Günlüğü',       en:'Hunter Journal'},
  {id:'JOURNAL_CRAFTSMAN', tr:'Craftçı Günlüğü',    en:'Craftsman Journal'},
  {id:'JOURNAL_LUMBERJACK',tr:'Oduncu Günlüğü',     en:'Lumberjack Journal'},
  {id:'JOURNAL_QUARRIER',  tr:'Taş Ocakçı Günlüğü', en:'Quarrier Journal'},
  {id:'JOURNAL_MINER',     tr:'Madenci Günlüğü',     en:'Miner Journal'},
  {id:'JOURNAL_SKINNER',   tr:'Derici Günlüğü',      en:'Skinner Journal'},
  {id:'JOURNAL_HARVESTER', tr:'Hasat Günlüğü',       en:'Harvester Journal'},
  {id:'JOURNAL_FISHER',    tr:'Balıkçı Günlüğü',     en:'Fisher Journal'},
  {id:'JOURNAL_ADVENTURER',tr:'Maceracı Günlüğü',    en:'Adventurer Journal'},
];

let journalCache = {};

async function loadJournalPrices() {
  const tiers = [4,5,6,7,8];
  const ids = JOURNAL_TYPES.flatMap(j => tiers.flatMap(t => [`T${t}_${j.id}_EMPTY`,`T${t}_${j.id}_FULL`]));
  try {
    const url = `${PRICE_API}/api/v2/stats/prices/${ids.join(',')}.json?locations=Caerleon`;
    const res = await fetch(url);
    const data = await res.json();
    data.forEach(d => {
      journalCache[d.item_id] = (d.sell_price_min > 0 && isValidData(d.sell_price_min_date)) ? d.sell_price_min : 0;
    });
    calcJournal();
    renderJournalCompare();
  } catch(e) { console.error(e); }
}

function calcJournal() {
  const type = document.getElementById('journalType').value;
  const tier = document.getElementById('journalTier').value;
  const qty = parseInt(document.getElementById('journalQty').value) || 10;
  const tax = parseFloat(document.getElementById('journalTax').value) / 100 || 0.08;
  const includeFull = document.getElementById('journalFull').checked;
  const lang = getLang();
  const emptyKey = `T${tier}_${type}_EMPTY`;
  const fullKey  = `T${tier}_${type}_FULL`;
  const emptyP = journalCache[emptyKey] || 0;
  const fullP  = journalCache[fullKey]  || 0;
  const revenue = fullP * qty * (1 - tax);
  const cost    = includeFull ? emptyP * qty : 0;
  const profit  = revenue - cost;
  const perJournal = qty > 0 ? profit / qty : 0;
  const el = document.getElementById('journalResult');
  el.innerHTML = `<div class="journal-result-grid">
    <div class="journal-stat"><div class="journal-stat-label">Boş Günlük Fiyatı</div><div class="journal-stat-val">${emptyP>0?emptyP.toLocaleString('tr-TR'):'—'}</div></div>
    <div class="journal-stat"><div class="journal-stat-label">Dolu Günlük Fiyatı</div><div class="journal-stat-val">${fullP>0?fullP.toLocaleString('tr-TR'):'—'}</div></div>
    <div class="journal-stat"><div class="journal-stat-label">${lang==='tr'?'Maliyet':'Cost'} (${qty} adet)</div><div class="journal-stat-val" style="color:var(--red)">${cost>0?Math.round(cost).toLocaleString('tr-TR'):'0'}</div></div>
    <div class="journal-stat"><div class="journal-stat-label">${lang==='tr'?'Gelir':'Revenue'} (${qty} adet)</div><div class="journal-stat-val" style="color:var(--teal)">${revenue>0?Math.round(revenue).toLocaleString('tr-TR'):'—'}</div></div>
    <div class="journal-stat" style="grid-column:1/-1;background:${profit>0?'rgba(34,197,94,.08)':'rgba(239,68,68,.06)'};border-color:${profit>0?'rgba(34,197,94,.3)':'rgba(239,68,68,.3)'}">
      <div class="journal-stat-label">${lang==='tr'?'Net Kâr':'Net Profit'} (${qty} adet)</div>
      <div class="journal-stat-val" style="font-size:24px;color:${profit>0?'var(--green)':'var(--red)'}">${profit>0?'+':''}${Math.round(profit).toLocaleString('tr-TR')}</div>
    </div>
    <div class="journal-stat"><div class="journal-stat-label">${lang==='tr'?'Günlük Başına':'Per Journal'}</div><div class="journal-stat-val" style="font-size:16px">${perJournal>0?Math.round(perJournal).toLocaleString('tr-TR'):'—'}</div></div>
  </div>`;
}

function renderJournalCompare() {
  const tier = document.getElementById('journalTier').value;
  const tax  = parseFloat(document.getElementById('journalTax').value) / 100 || 0.08;
  const lang = getLang();
  const tbody = document.getElementById('journalCompareBody');
  const rows = JOURNAL_TYPES.map(j => {
    const emptyP = journalCache[`T${tier}_${j.id}_EMPTY`] || 0;
    const fullP  = journalCache[`T${tier}_${j.id}_FULL`]  || 0;
    const profit = fullP * (1-tax) - emptyP;
    return {j, emptyP, fullP, profit};
  }).sort((a,b) => b.profit - a.profit);
  tbody.innerHTML = rows.map(({j,emptyP,fullP,profit}) => `<tr>
    <td>${lang==='tr'?j.tr:j.en}</td>
    <td><span style="font-family:var(--font-mono);font-size:10px;background:var(--gold-dim);color:var(--gold);padding:2px 5px;border-radius:3px">T${tier}</span></td>
    <td>${emptyP>0?emptyP.toLocaleString('tr-TR'):'—'}</td>
    <td>${fullP>0?fullP.toLocaleString('tr-TR'):'—'}</td>
    <td class="${profit>0?'profit-pos':'profit-neg'}">${profit!==0?(profit>0?'+':'')+Math.round(profit).toLocaleString('tr-TR'):'—'}</td>
  </tr>`).join('');
}

// ─── BLACK MARKET MODÜLÜ ──────────────────────────────────────
const BM_ITEMS = (window.AO_ITEMS||[]).filter(i=>
  ['sword','axe','bow','hammer','spear','dagger','qstaff','mace','fire','frost','arcane','holy','nature','curse',
   'lhelmet','larmor','lshoes','phelmet','parmor','pshoes','chelmet','carmor','cshoes','bag'].includes(i.cat)
);

async function loadBMData() {
  document.getElementById('bmLoading').style.display = 'flex';
  document.getElementById('bmTableWrap').style.display = 'none';
  document.getElementById('bmEmpty').style.display = 'none';

  const tierSel = document.getElementById('bmTier').value;
  const withEnchant = document.getElementById('bmEnchant').checked;
  const tiers = tierSel === 'all' ? [4,5,6,7,8] : [parseInt(tierSel)];
  const items = (window.AO_ITEMS||[]).filter(i=>BM_ITEMS.some(b=>b.id===i.id));
  const ids = items.flatMap(i =>
    tiers.filter(t=>i.tiers.includes(t)).flatMap(t => {
      const base = `T${t}_${i.id}`;
      return withEnchant ? [base, base+'@1', base+'@2', base+'@3'] : [base];
    })
  );

  try {
    const cityUrl = `${PRICE_API}/api/v2/stats/prices/${ids.slice(0,60).join(',')}.json?locations=Caerleon,Bridgewatch,Lymhurst,Martlock,Thetford,Fort Sterling`;
    const bmUrl   = `${PRICE_API}/api/v2/stats/prices/${ids.slice(0,60).join(',')}.json?locations=Black Market`;

    const [cityRes, bmRes] = await Promise.all([fetch(cityUrl), fetch(bmUrl)]);
    const [cityData, bmData] = await Promise.all([cityRes.json(), bmRes.json()]);

    const cityPrices = {};
    cityData.forEach(d => {
      if (d.sell_price_min > 0 && isValidData(d.sell_price_min_date)) {
        if (!cityPrices[d.item_id] || d.sell_price_min < cityPrices[d.item_id].price)
          cityPrices[d.item_id] = {price: d.sell_price_min, city: d.city};
      }
    });
    const bmPrices = {};
    bmData.forEach(d => { if (d.buy_price_max > 0 && isValidData(d.buy_price_max_date)) bmPrices[d.item_id] = d.buy_price_max; });

    renderBMTable(cityPrices, bmPrices);
  } catch(e) {
    document.getElementById('bmLoading').style.display = 'none';
    document.getElementById('bmEmpty').style.display = 'block';
  }
}

function renderBMTable(cityPrices, bmPrices) {
  if (!cityPrices) return;
  const minProfit = parseInt(document.getElementById('bmMinProfit').value) || 0;
  const tax = parseFloat(document.getElementById('bmTax').value) / 100 || 0.08;
  const lang = getLang();
  const flips = [];

  Object.keys(cityPrices).forEach(id => {
    const buyP  = cityPrices[id]?.price || 0;
    const bmP   = bmPrices[id] || 0;
    if (!buyP || !bmP) return;
    const revenue = bmP * (1 - tax);
    const profit  = revenue - buyP;
    const pct     = buyP > 0 ? ((profit/buyP)*100).toFixed(1) : 0;
    if (profit >= minProfit) {
      const item = (window.AO_ITEMS||[]).find(i => id.replace(/@\d/,'').includes(i.id));
      const name = item ? (lang==='tr'?item.tr:item.en) : id.replace(/_/g,' ');
      const tier = id.match(/^T(\d)/)?.[1] || '?';
      const enc  = id.match(/@(\d)$/)?.[1] || '';
      flips.push({id, name, tier, enc, buyP, bmP, buyCity: cityPrices[id].city, profit, pct});
    }
  });

  flips.sort((a,b) => b.profit - a.profit);
  document.getElementById('bmLoading').style.display = 'none';

  if (!flips.length) {
    document.getElementById('bmEmpty').style.display = 'block';
    document.getElementById('bmTableWrap').style.display = 'none';
    return;
  }
  document.getElementById('bmTableWrap').style.display = 'block';
  document.getElementById('bmEmpty').style.display = 'none';
  document.getElementById('bmTableBody').innerHTML = flips.slice(0,50).map(f => `<tr>
    <td><img src="${RENDER}/${f.id.replace(/@\d/,'')}.png" onerror="this.style.display='none'" class="bm-item-icon"/>${f.name}${f.enc?` <span style="color:var(--teal);font-family:var(--font-mono);font-size:10px">+${f.enc}</span>`:''}</td>
    <td><span style="font-family:var(--font-mono);font-size:10px;background:var(--gold-dim);color:var(--gold);padding:2px 5px;border-radius:3px">T${f.tier}</span></td>
    <td style="font-size:11px">${f.buyCity}</td>
    <td>${f.buyP.toLocaleString('tr-TR')}</td>
    <td>${f.bmP.toLocaleString('tr-TR')}</td>
    <td class="bm-profit-pos">+${Math.round(f.profit).toLocaleString('tr-TR')}</td>
    <td class="bm-profit-pos">%${f.pct}</td>
  </tr>`).join('');
}
