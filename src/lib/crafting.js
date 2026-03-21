// AoT-PNASF — Crafting v4 — items-data.js entegreli, çok dilli
const PRICE_API = 'https://europe.albion-online-data.com';
const RENDER    = 'https://render.albiononline.com/v1/item';
const ALL_CITIES = 'Caerleon,Bridgewatch,Lymhurst,Martlock,Thetford,Fort Sterling,Brecilien,Black Market';

// Kategori tanımları — items-data.js'deki cat değerleriyle eşleşir
const CATEGORIES = [
  {key:'sword',   icon:'⚔️', tr:'Kılıçlar',        en:'Swords'},
  {key:'axe',     icon:'🪓', tr:'Baltalar',         en:'Axes'},
  {key:'bow',     icon:'🏹', tr:'Yaylar',           en:'Bows'},
  {key:'hammer',  icon:'🔨', tr:'Çekiçler',         en:'Hammers'},
  {key:'spear',   icon:'🗡️', tr:'Mızraklar',        en:'Spears'},
  {key:'dagger',  icon:'🔪', tr:'Hançerler',        en:'Daggers'},
  {key:'qstaff',  icon:'🪄', tr:'Quarterstaff',     en:'Quarterstaffs'},
  {key:'mace',    icon:'🏛️', tr:'Gürz',             en:'Maces'},
  {key:'gloves',  icon:'🥊', tr:'Savaş Eldiveni',   en:'War Gloves'},
  {key:'shift',   icon:'🌊', tr:'Şekil Değiştirici',en:'Shapeshifter'},
  {key:'fire',    icon:'🔥', tr:'Ateş Asaları',     en:'Fire Staves'},
  {key:'frost',   icon:'❄️', tr:'Buz Asaları',      en:'Frost Staves'},
  {key:'arcane',  icon:'🌀', tr:'Gizem Asaları',    en:'Arcane Staves'},
  {key:'holy',    icon:'✨', tr:'Kutsal Asalar',    en:'Holy Staves'},
  {key:'nature',  icon:'🌿', tr:'Doğa Asaları',     en:'Nature Staves'},
  {key:'curse',   icon:'💀', tr:'Lanet Asaları',    en:'Cursed Staves'},
  {key:'bag',     icon:'🎒', tr:'Çantalar',         en:'Bags'},
  {key:'lhelmet', icon:'🪖', tr:'Deri Kask',        en:'Leather Helmet'},
  {key:'larmor',  icon:'🥋', tr:'Deri Zırh',        en:'Leather Armor'},
  {key:'lshoes',  icon:'👢', tr:'Deri Bot',         en:'Leather Shoes'},
  {key:'phelmet', icon:'⛑️', tr:'Plaka Kask',       en:'Plate Helmet'},
  {key:'parmor',  icon:'🛡️', tr:'Plaka Zırh',       en:'Plate Armor'},
  {key:'pshoes',  icon:'🦺', tr:'Plaka Bot',        en:'Plate Shoes'},
  {key:'chelmet', icon:'🎩', tr:'Kumaş Kask',       en:'Cloth Helmet'},
  {key:'carmor',  icon:'👘', tr:'Kumaş Zırh',       en:'Cloth Armor'},
  {key:'cshoes',  icon:'🥿', tr:'Kumaş Bot',        en:'Cloth Shoes'},
  {key:'cape',    icon:'🧣', tr:'Pelerinler',       en:'Capes'},
  {key:'offhand', icon:'🔰', tr:'Offhand',          en:'Offhand'},
  {key:'mount',   icon:'🐎', tr:'Binekler',         en:'Mounts'},
  {key:'food',    icon:'🍲', tr:'Yiyecek',          en:'Food'},
  {key:'potion',  icon:'⚗️', tr:'İksirler',         en:'Potions'},
  {key:'refined', icon:'⚙️', tr:'İşlenmiş Kaynak',  en:'Refined Resources'},
  {key:'raw',     icon:'🪵', tr:'Ham Kaynak',       en:'Raw Resources'},
];

// Crafting malzeme veritabanı
const RECIPES = {
  'MAIN_SWORD':               [{r:'METALBAR',q:8},{r:'LEATHER',q:8},{r:'PLANKS',q:4}],
  '2H_CLAYMORE':              [{r:'METALBAR',q:16},{r:'LEATHER',q:8},{r:'PLANKS',q:8}],
  '2H_DUALSWORD':             [{r:'METALBAR',q:12},{r:'LEATHER',q:8},{r:'PLANKS',q:8}],
  'MAIN_SCIMITAR_MORGANA':    [{r:'METALBAR',q:8},{r:'LEATHER',q:8},{r:'PLANKS',q:4}],
  '2H_CLEAVER_HELL':          [{r:'METALBAR',q:16},{r:'LEATHER',q:8},{r:'PLANKS',q:8}],
  '2H_DUALSWORD_UNDEAD':      [{r:'METALBAR',q:12},{r:'LEATHER',q:8},{r:'PLANKS',q:8}],
  'MAIN_AXE':                 [{r:'METALBAR',q:8},{r:'PLANKS',q:8},{r:'LEATHER',q:4}],
  '2H_AXE':                   [{r:'METALBAR',q:16},{r:'PLANKS',q:8},{r:'LEATHER',q:4}],
  '2H_HALBERD':               [{r:'METALBAR',q:12},{r:'PLANKS',q:12},{r:'LEATHER',q:4}],
  '2H_SCYTHE_HELL':           [{r:'METALBAR',q:16},{r:'PLANKS',q:8},{r:'LEATHER',q:4}],
  '2H_HALBERD_UNDEAD':        [{r:'METALBAR',q:16},{r:'PLANKS',q:12},{r:'LEATHER',q:4}],
  '2H_BOW':                   [{r:'PLANKS',q:16},{r:'CLOTH',q:8},{r:'LEATHER',q:8}],
  '2H_LONGBOW':               [{r:'PLANKS',q:20},{r:'CLOTH',q:8},{r:'LEATHER',q:4}],
  '2H_LONGBOW_UNDEAD':        [{r:'PLANKS',q:20},{r:'CLOTH',q:8},{r:'LEATHER',q:4}],
  '2H_BOW_HELL':              [{r:'PLANKS',q:16},{r:'CLOTH',q:8},{r:'LEATHER',q:8}],
  '2H_BOW_MORGANA':           [{r:'PLANKS',q:16},{r:'CLOTH',q:8},{r:'LEATHER',q:8}],
  '2H_CROSSBOW':              [{r:'METALBAR',q:8},{r:'PLANKS',q:12},{r:'LEATHER',q:8}],
  '2H_CROSSBOW_CANNON':       [{r:'METALBAR',q:12},{r:'PLANKS',q:12},{r:'LEATHER',q:4}],
  'MAIN_CROSSBOW':            [{r:'METALBAR',q:8},{r:'PLANKS',q:8},{r:'LEATHER',q:8}],
  '2H_CROSSBOW_LARGE_MORGANA':[{r:'METALBAR',q:12},{r:'PLANKS',q:16},{r:'LEATHER',q:4}],
  '2H_BOW_KEEPER':            [{r:'PLANKS',q:16},{r:'CLOTH',q:8},{r:'LEATHER',q:8}],
  'MAIN_HAMMER':              [{r:'METALBAR',q:12},{r:'PLANKS',q:8},{r:'LEATHER',q:4}],
  '2H_POLEHAMMER':            [{r:'METALBAR',q:16},{r:'PLANKS',q:12},{r:'LEATHER',q:4}],
  '2H_HAMMER_HELL':           [{r:'METALBAR',q:20},{r:'PLANKS',q:8},{r:'LEATHER',q:4}],
  '2H_HAMMER_MORGANA':        [{r:'METALBAR',q:16},{r:'PLANKS',q:8},{r:'LEATHER',q:4}],
  'MAIN_SPEAR':               [{r:'METALBAR',q:8},{r:'PLANKS',q:12},{r:'LEATHER',q:4}],
  '2H_SPEAR':                 [{r:'METALBAR',q:8},{r:'PLANKS',q:16},{r:'LEATHER',q:4}],
  '2H_GLAIVE':                [{r:'METALBAR',q:8},{r:'PLANKS',q:16},{r:'LEATHER',q:4}],
  '2H_HARPOON_HELL':          [{r:'METALBAR',q:8},{r:'PLANKS',q:16},{r:'LEATHER',q:4}],
  '2H_DUALSICKLE_HELL':       [{r:'METALBAR',q:12},{r:'PLANKS',q:12},{r:'LEATHER',q:4}],
  'MAIN_DAGGER':              [{r:'METALBAR',q:8},{r:'LEATHER',q:8},{r:'PLANKS',q:4}],
  '2H_DAGGERPAIR':            [{r:'METALBAR',q:12},{r:'LEATHER',q:8},{r:'PLANKS',q:8}],
  '2H_CLAWPAIR_HELL':         [{r:'METALBAR',q:12},{r:'LEATHER',q:8},{r:'PLANKS',q:8}],
  'MAIN_RAPIER_MORGANA':      [{r:'METALBAR',q:8},{r:'LEATHER',q:8},{r:'PLANKS',q:4}],
  '2H_DUALSCIMITAR_UNDEAD':   [{r:'METALBAR',q:12},{r:'LEATHER',q:8},{r:'PLANKS',q:8}],
  '2H_QUARTERSTAFF':          [{r:'PLANKS',q:20},{r:'LEATHER',q:4}],
  '2H_IRONCLADEDSTAFF':       [{r:'PLANKS',q:20},{r:'LEATHER',q:4},{r:'METALBAR',q:4}],
  '2H_DOUBLEBLADEDSTAFF_HELL':[{r:'PLANKS',q:20},{r:'LEATHER',q:4},{r:'METALBAR',q:4}],
  '2H_COMBATSTAFF_MORGANA':   [{r:'PLANKS',q:20},{r:'LEATHER',q:4}],
  '2H_ROCKSTAFF_UNDEAD':      [{r:'PLANKS',q:20},{r:'LEATHER',q:4},{r:'STONEBLOCK',q:4}],
  'MAIN_MACE':                [{r:'METALBAR',q:8},{r:'PLANKS',q:8},{r:'LEATHER',q:4}],
  '2H_MACE':                  [{r:'METALBAR',q:16},{r:'PLANKS',q:8},{r:'LEATHER',q:4}],
  'MAIN_ROCKMACE_KEEPER':     [{r:'METALBAR',q:8},{r:'PLANKS',q:8},{r:'STONEBLOCK',q:4}],
  'MAIN_MACE_HELL':           [{r:'METALBAR',q:8},{r:'PLANKS',q:8},{r:'LEATHER',q:4}],
  '2H_MACE_MORGANA':          [{r:'METALBAR',q:16},{r:'PLANKS',q:8},{r:'LEATHER',q:4}],
  'MAIN_KNUCKLES':            [{r:'METALBAR',q:8},{r:'LEATHER',q:8},{r:'CLOTH',q:4}],
  '2H_KNUCKLES_SET1':         [{r:'METALBAR',q:12},{r:'LEATHER',q:8},{r:'CLOTH',q:8}],
  'MAIN_KNUCKLES_HELL':       [{r:'METALBAR',q:8},{r:'LEATHER',q:8},{r:'CLOTH',q:4}],
  '2H_KNUCKLES_MORGANA':      [{r:'METALBAR',q:12},{r:'LEATHER',q:8},{r:'CLOTH',q:8}],
  'MAIN_FIRE':                [{r:'PLANKS',q:8},{r:'CLOTH',q:8},{r:'METALBAR',q:8}],
  '2H_INFERNOSTAFF':          [{r:'PLANKS',q:16},{r:'CLOTH',q:8},{r:'METALBAR',q:4}],
  '2H_INFERNOSTAFF_HELL':     [{r:'PLANKS',q:16},{r:'CLOTH',q:8},{r:'METALBAR',q:4}],
  '2H_INFERNOSTAFF_MORGANA':  [{r:'PLANKS',q:16},{r:'CLOTH',q:8},{r:'METALBAR',q:4}],
  'MAIN_FROST':               [{r:'PLANKS',q:8},{r:'CLOTH',q:8},{r:'METALBAR',q:8}],
  '2H_FROSTSTAFF':            [{r:'PLANKS',q:16},{r:'CLOTH',q:8},{r:'METALBAR',q:4}],
  '2H_ICEGAUNTLETS_HELL':     [{r:'PLANKS',q:8},{r:'CLOTH',q:8},{r:'METALBAR',q:8}],
  '2H_ICICLESTAFF_UNDEAD':    [{r:'PLANKS',q:16},{r:'CLOTH',q:8},{r:'METALBAR',q:4}],
  'MAIN_ARCANE':              [{r:'PLANKS',q:8},{r:'CLOTH',q:8},{r:'METALBAR',q:8}],
  '2H_ARCANESTAFF':           [{r:'PLANKS',q:16},{r:'CLOTH',q:8},{r:'METALBAR',q:4}],
  '2H_ENIGMATICSTAFF_HELL':   [{r:'PLANKS',q:16},{r:'CLOTH',q:8},{r:'METALBAR',q:4}],
  '2H_LIGHTCROSSBOW_MORGANA': [{r:'PLANKS',q:8},{r:'CLOTH',q:8},{r:'METALBAR',q:8}],
  'MAIN_HOLY':                [{r:'PLANKS',q:8},{r:'CLOTH',q:8},{r:'METALBAR',q:8}],
  '2H_HOLYSTAFF':             [{r:'PLANKS',q:16},{r:'CLOTH',q:8},{r:'METALBAR',q:4}],
  '2H_DIVINESTAFF_HELL':      [{r:'PLANKS',q:16},{r:'CLOTH',q:8},{r:'METALBAR',q:4}],
  '2H_HOLYSTAFF_MORGANA':     [{r:'PLANKS',q:16},{r:'CLOTH',q:8},{r:'METALBAR',q:4}],
  'MAIN_NATURE':              [{r:'PLANKS',q:8},{r:'CLOTH',q:8},{r:'METALBAR',q:8}],
  '2H_NATURESTAFF':           [{r:'PLANKS',q:16},{r:'CLOTH',q:8},{r:'METALBAR',q:4}],
  '2H_WILDSTAFF_HELL':        [{r:'PLANKS',q:16},{r:'CLOTH',q:8},{r:'METALBAR',q:4}],
  '2H_NATURESTAFF_KEEPER':    [{r:'PLANKS',q:16},{r:'CLOTH',q:8},{r:'METALBAR',q:4}],
  'MAIN_CURSEDSTAFF':         [{r:'PLANKS',q:8},{r:'CLOTH',q:8},{r:'METALBAR',q:8}],
  '2H_CURSEDSTAFF':           [{r:'PLANKS',q:16},{r:'CLOTH',q:8},{r:'METALBAR',q:4}],
  '2H_CURSEDSTAFF_HELL':      [{r:'PLANKS',q:16},{r:'CLOTH',q:8},{r:'METALBAR',q:4}],
  '2H_SKULLJESTER_UNDEAD':    [{r:'PLANKS',q:16},{r:'CLOTH',q:8},{r:'METALBAR',q:4}],
  'BAG':                      [{r:'LEATHER',q:16},{r:'PLANKS',q:8}],
  'SATCHEL_OF_INSIGHT':       [{r:'LEATHER',q:16},{r:'PLANKS',q:8},{r:'CLOTH',q:8}],
  'HEAD_LEATHER_SET1':        [{r:'LEATHER',q:8},{r:'CLOTH',q:4}],
  'HEAD_LEATHER_SET2':        [{r:'LEATHER',q:8},{r:'CLOTH',q:4}],
  'HEAD_LEATHER_SET3':        [{r:'LEATHER',q:8},{r:'CLOTH',q:4}],
  'ARMOR_LEATHER_SET1':       [{r:'LEATHER',q:12},{r:'CLOTH',q:4}],
  'ARMOR_LEATHER_SET2':       [{r:'LEATHER',q:12},{r:'CLOTH',q:4}],
  'ARMOR_LEATHER_SET3':       [{r:'LEATHER',q:12},{r:'CLOTH',q:4}],
  'SHOES_LEATHER_SET1':       [{r:'LEATHER',q:8},{r:'CLOTH',q:4}],
  'SHOES_LEATHER_SET2':       [{r:'LEATHER',q:8},{r:'CLOTH',q:4}],
  'SHOES_LEATHER_SET3':       [{r:'LEATHER',q:8},{r:'CLOTH',q:4}],
  'HEAD_PLATE_SET1':          [{r:'METALBAR',q:8},{r:'LEATHER',q:4}],
  'HEAD_PLATE_SET2':          [{r:'METALBAR',q:8},{r:'LEATHER',q:4}],
  'HEAD_PLATE_SET3':          [{r:'METALBAR',q:8},{r:'LEATHER',q:4}],
  'ARMOR_PLATE_SET1':         [{r:'METALBAR',q:12},{r:'LEATHER',q:4}],
  'ARMOR_PLATE_SET2':         [{r:'METALBAR',q:12},{r:'LEATHER',q:4}],
  'ARMOR_PLATE_SET3':         [{r:'METALBAR',q:12},{r:'LEATHER',q:4}],
  'SHOES_PLATE_SET1':         [{r:'METALBAR',q:8},{r:'LEATHER',q:4}],
  'SHOES_PLATE_SET2':         [{r:'METALBAR',q:8},{r:'LEATHER',q:4}],
  'SHOES_PLATE_SET3':         [{r:'METALBAR',q:8},{r:'LEATHER',q:4}],
  'HEAD_CLOTH_SET1':          [{r:'CLOTH',q:8},{r:'LEATHER',q:4}],
  'HEAD_CLOTH_SET2':          [{r:'CLOTH',q:8},{r:'LEATHER',q:4}],
  'HEAD_CLOTH_SET3':          [{r:'CLOTH',q:8},{r:'LEATHER',q:4}],
  'ARMOR_CLOTH_SET1':         [{r:'CLOTH',q:12},{r:'LEATHER',q:4}],
  'ARMOR_CLOTH_SET2':         [{r:'CLOTH',q:12},{r:'LEATHER',q:4}],
  'ARMOR_CLOTH_SET3':         [{r:'CLOTH',q:12},{r:'LEATHER',q:4}],
  'SHOES_CLOTH_SET1':         [{r:'CLOTH',q:8},{r:'LEATHER',q:4}],
  'SHOES_CLOTH_SET2':         [{r:'CLOTH',q:8},{r:'LEATHER',q:4}],
  'SHOES_CLOTH_SET3':         [{r:'CLOTH',q:8},{r:'LEATHER',q:4}],
  'OFF_SHIELD':               [{r:'METALBAR',q:8},{r:'PLANKS',q:4},{r:'LEATHER',q:4}],
  'OFF_BOOK':                 [{r:'CLOTH',q:8},{r:'PLANKS',q:4},{r:'LEATHER',q:4}],
  'OFF_HORN':                 [{r:'PLANKS',q:8},{r:'LEATHER',q:4}],
  'OFF_TORCH':                [{r:'PLANKS',q:8},{r:'LEATHER',q:4}],
  'MEAL_STEW':                [{r:'CROP_TURNIP',q:8},{r:'CROP_CARROT',q:4},{r:'MEAT',q:4}],
  'MEAL_SOUP':                [{r:'CROP_TURNIP',q:8},{r:'CROP_CARROT',q:8}],
  'MEAL_SALAD':               [{r:'CROP_PUMPKIN',q:8},{r:'CROP_CARROT',q:4}],
  'MEAL_OMELETTE':            [{r:'CROP_CABBAGE',q:8},{r:'EGG',q:4}],
  'MEAL_ROAST':               [{r:'MEAT',q:8},{r:'CROP_CORN',q:4}],
  'POTION_HEALING':           [{r:'HERB_FOXGLOVE',q:8},{r:'HERB_YARROW',q:4}],
  'POTION_ENERGY':            [{r:'HERB_FOXGLOVE',q:8},{r:'HERB_MUELEIN',q:4}],
  'POTION_GIGANTIFY':         [{r:'HERB_BURDOCK',q:8},{r:'HERB_FOXGLOVE',q:4}],
  'POTION_RESISTANCE':        [{r:'HERB_YARROW',q:8},{r:'HERB_BURDOCK',q:4}],
};

const RES_NAMES_TR = {
  PLANKS:'Tahta', METALBAR:'Metal Külçe', CLOTH:'Kumaş', LEATHER:'İşl. Deri',
  STONEBLOCK:'Taş Blok', CROP_TURNIP:'Şalgam', CROP_CARROT:'Havuç',
  CROP_PUMPKIN:'Kabak', CROP_CABBAGE:'Lahana', CROP_CORN:'Mısır',
  MEAT:'Et', EGG:'Yumurta', HERB_FOXGLOVE:'Yüksükotu', HERB_YARROW:'Civanperçemi',
  HERB_MUELEIN:'Sığırkuyruğu', HERB_BURDOCK:'Dulavrat Otu',
};
const RES_NAMES_EN = {
  PLANKS:'Planks', METALBAR:'Metal Bar', CLOTH:'Cloth', LEATHER:'Leather',
  STONEBLOCK:'Stone Block', CROP_TURNIP:'Turnip', CROP_CARROT:'Carrot',
  CROP_PUMPKIN:'Pumpkin', CROP_CABBAGE:'Cabbage', CROP_CORN:'Corn',
  MEAT:'Meat', EGG:'Egg', HERB_FOXGLOVE:'Foxglove', HERB_YARROW:'Yarrow',
  HERB_MUELEIN:'Mullein', HERB_BURDOCK:'Burdock',
};

const CITY_BONUSES = {
  'Lymhurst':    {tr:'🌲 Bonus: Yay, Kılıç, Arcane, Deri Kask/Bot', en:'🌲 Bonus: Bow, Sword, Arcane, Leather Helm/Shoes'},
  'Bridgewatch': {tr:'🏜️ Bonus: Arbalet, Hançer, Cursed, Plaka Zırh', en:'🏜️ Bonus: Crossbow, Dagger, Cursed, Plate Armor'},
  'Martlock':    {tr:'🏔️ Bonus: Balta, Quarterstaff, Frost, Plaka Bot', en:'🏔️ Bonus: Axe, Quarterstaff, Frost, Plate Shoes'},
  'Fort Sterling':{tr:'⛰️ Bonus: Çekiç, Mızrak, Holy, Kumaş Zırh', en:'⛰️ Bonus: Hammer, Spear, Holy, Cloth Armor'},
  'Thetford':    {tr:'🌿 Bonus: Gürz, Doğa, Ateş, Deri Zırh', en:'🌿 Bonus: Mace, Nature, Fire, Leather Armor'},
  'Brecilien':   {tr:'🌫️ Bonus: Bitki/Herb crafting', en:'🌫️ Bonus: Herb/Plant crafting'},
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

// ─── LANG HELPER ──────────────────────────────────────────────
function getLang() { return localStorage.getItem('aot-lang') || 'tr'; }
function t(obj) { const l=getLang(); return obj[l] || obj.tr || obj.en || ''; }

// ─── INIT ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  buildCatList();
  setCraftCity('Caerleon');
  loadRefiningPrices();
  loadFarmingPrices();
  // Dil değişince yeniden render
  const origToggle = window.toggleLang;
  window.toggleLang = function() {
    if (origToggle) origToggle();
    setTimeout(() => { buildCatList(); if(currentCat) renderItemGrid(currentCat); if(currentItemBase) calcCrafting(); }, 60);
  };
});

// ─── MODÜL ────────────────────────────────────────────────────
function switchModule(mod, btn) {
  document.querySelectorAll('.module-content').forEach(el => el.style.display='none');
  document.querySelectorAll('.mod-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('mod-'+mod).style.display = 'block';
  if (btn) btn.classList.add('active');
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
    }).join('') || `<div class="grid-empty"><p>Bu tier için eşya yok</p></div>`;
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

// ─── ŞEHİR ────────────────────────────────────────────────────
function setCraftCity(city) {
  craftCity = city;
  document.querySelectorAll('.city-btn').forEach(b => b.classList.toggle('active', b.dataset.city===city));
  const lang = getLang();
  const bi = document.getElementById('bonusInfo');
  if (bi) {
    const bonus = CITY_BONUSES[city];
    if (bonus) { bi.textContent = bonus[lang]||bonus.tr; bi.classList.add('show'); }
    else { bi.textContent=''; bi.classList.remove('show'); }
  }
  calcCrafting();
}

// ─── FİYAT ÇEKİMİ ─────────────────────────────────────────────
async function loadItemPrices() {
  if (!currentItemBase) return;
  const recipe = RECIPES[currentItemBase];
  const baseId = `T${currentTier}_${currentItemBase}`;
  const matIds = recipe ? recipe.map(m=>`T${currentTier}_${m.r}`) : [];
  const allIds = [...new Set([...matIds, baseId])];
  const lang = getLang();
  document.getElementById('materialsList').innerHTML = `<div class="loading-wrap"><div class="loading-spinner"></div><span>${lang==='tr'?'Fiyatlar yükleniyor...':'Loading prices...'}</span></div>`;
  try {
    const res = await fetch(`${PRICE_API}/api/v2/stats/prices/${allIds.join(',')}.json?locations=${encodeURIComponent(ALL_CITIES)}`);
    const data = await res.json();
    data.forEach(d => {
      if (!priceCache[d.item_id]) priceCache[d.item_id]={};
      if (d.sell_price_min>0) {
        if (!priceCache[d.item_id][d.city]||d.sell_price_min<priceCache[d.item_id][d.city])
          priceCache[d.item_id][d.city]=d.sell_price_min;
      }
    });
    calcCrafting();
  } catch(e) {
    document.getElementById('materialsList').innerHTML=`<span style="color:var(--red);font-size:13px">⚠️ ${getLang()==='tr'?'API hatası':'API error'}</span>`;
  }
}

// ─── CRAFTING HESABI ──────────────────────────────────────────
function calcCrafting() {
  if (!currentItemBase) return;
  const recipe = RECIPES[currentItemBase];
  const baseId = `T${currentTier}_${currentItemBase}`;
  const lang   = getLang();
  const qty    = parseInt(document.getElementById('craftQty')?.value)||1;
  const focus  = document.getElementById('focusMode')?.checked;
  const rr     = focus ? 0.47 : (parseFloat(document.getElementById('returnRate')?.value)||15)/100;
  const uf     = (parseFloat(document.getElementById('usageFee')?.value)||3)/100;
  const tax    = (parseFloat(document.getElementById('taxRate')?.value)||8)/100;

  if (!recipe) {
    document.getElementById('materialsList').innerHTML=`<p style="color:var(--text-muted);font-size:12px">${lang==='tr'?'Bu eşya için reçete henüz eklenmedi.':'No recipe added yet for this item.'}</p>`;
    return;
  }

  let totalMat = 0;
  const resNames = lang==='tr' ? RES_NAMES_TR : RES_NAMES_EN;
  const matHtml = recipe.map(m => {
    const matId = `T${currentTier}_${m.r}`;
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
        <div class="mat-name">${resNames[m.r]||m.r}</div>
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
  document.getElementById('sellGrid').innerHTML = cities.map(c => {
    const p = priceCache[baseId]?.[c]||0;
    const isBest = best && c===best.city;
    return `<div class="sell-card ${isBest?'best':''}">
      ${isBest?`<div class="sc-best">⭐ ${lang==='tr'?'EN İYİ':'BEST'}</div>`:''}
      <div class="sc-city">${c}</div>
      <div class="sc-price ${!p?'empty':''}">${p>0?p.toLocaleString('tr-TR'):(c==='Black Market'?(lang==='tr'?'Alış emri':'Buy order'):(lang==='tr'?'Veri yok':'No data'))}</div>
    </div>`;
  }).join('');

  // Kâr
  const sellPrice = (best?.price||0)*qty;
  const ufAmt = totalMat*uf;
  const taxAmt = sellPrice*tax;
  const profit = sellPrice - taxAmt - totalMat - ufAmt;
  const pct = totalMat>0?((profit/totalMat)*100).toFixed(1):0;

  document.getElementById('profitBreakdown').innerHTML = `
    <div class="pb-row"><span class="pb-label">${lang==='tr'?'Malzeme maliyeti':'Material cost'}</span><span class="pb-val cost">−${Math.round(totalMat).toLocaleString('tr-TR')}</span></div>
    <div class="pb-row"><span class="pb-label">${lang==='tr'?'Kullanım ücreti':'Usage fee'} (%${(uf*100).toFixed(0)})</span><span class="pb-val fee">−${Math.round(ufAmt).toLocaleString('tr-TR')}</span></div>
    <div class="pb-row"><span class="pb-label">${lang==='tr'?'Satış geliri':'Sell revenue'}${best?' ('+best.city+')':''}</span><span class="pb-val earn">+${Math.round(sellPrice).toLocaleString('tr-TR')}</span></div>
    <div class="pb-row"><span class="pb-label">${lang==='tr'?'Vergi':'Tax'} (%${(tax*100).toFixed(0)})</span><span class="pb-val fee">−${Math.round(taxAmt).toLocaleString('tr-TR')}</span></div>`;

  document.getElementById('profitResult').innerHTML = `
    <div class="profit-box ${profit>=0?'pos':'neg'}">
      <div>
        <div class="pb-meta">${lang==='tr'?'NET KÂR':'NET PROFIT'} (${qty} ${lang==='tr'?'adet':'pcs'})</div>
        <div class="pb-pct">%${pct} ${lang==='tr'?'getiri':'return'} · ${best?best.city:'—'}'${lang==='tr'?'de':'in'} sat</div>
      </div>
      <div class="pb-amount ${profit>=0?'pos':'neg'}">${profit>=0?'+':''}${Math.round(profit).toLocaleString('tr-TR')}</div>
    </div>`;
}

// ─── REFİNİNG ─────────────────────────────────────────────────
async function loadRefiningPrices() {
  const ids=[];
  Object.values(REFINE_DATA).forEach(r=>{
    [4,5,6,7,8].forEach(t=>{ ids.push(`T${t}_${r.raw}`,`T${t}_${r.ref}`); if(t>4) ids.push(`T${t-1}_${r.ref}`); });
  });
  try {
    const res=await fetch(`${PRICE_API}/api/v2/stats/prices/${[...new Set(ids)].join(',')}.json?locations=Caerleon,Bridgewatch,Lymhurst,Martlock,Thetford,Fort Sterling`);
    const data=await res.json();
    data.forEach(d=>{ if(!priceCache[d.item_id]) priceCache[d.item_id]={}; if(d.sell_price_min>0) priceCache[d.item_id][d.city]=d.sell_price_min; });
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
    data.forEach(d=>{ if(!priceCache[d.item_id]) priceCache[d.item_id]={}; if(d.sell_price_min>0) priceCache[d.item_id][d.city]=d.sell_price_min; });
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

// ─── YARDIMCILAR ──────────────────────────────────────────────
function getMinPrice(id){ const p=priceCache[id]; if(!p) return 0; const v=Object.values(p).filter(x=>x>0); return v.length?Math.min(...v):0; }
function getMinPriceCity(id){ const p=priceCache[id]; if(!p) return {price:0,city:null}; const e=Object.entries(p).filter(([,v])=>v>0).sort((a,b)=>a[1]-b[1]); return e.length?{price:e[0][1],city:e[0][0]}:{price:0,city:null}; }
