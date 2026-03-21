// AoT-PNASF — Crafting Module v2
// Slishy tarzı: GameInfo API'den canlı eşya listesi + tam hesaplayıcı

const PRICE_API = 'https://europe.albion-online-data.com';
const GAMEINFO_API = 'https://gameinfo.albiononline.com/api/gameinfo';
const ALL_CITIES = 'Caerleon,Bridgewatch,Lymhurst,Martlock,Thetford,Fort Sterling,Brecilien,Black Market';

// ─── EŞYA KATEGORILERI (Slishy tarzı gruplandırma) ────────────
const ITEM_GROUPS = [
  { key:'sword',       label:'Kılıçlar',        icon:'⚔️',  ids:['MAIN_SWORD','2H_CLAYMORE','2H_DUALSWORD','MAIN_SCIMITAR_MORGANA','2H_CLEAVER_HELL'] },
  { key:'axe',         label:'Baltalar',         icon:'🪓',  ids:['MAIN_AXE','2H_AXE','2H_HALBERD','2H_SCYTHE_HELL','2H_HALBERD_UNDEAD'] },
  { key:'bow',         label:'Yaylar',           icon:'🏹',  ids:['2H_BOW','2H_LONGBOW','2H_BOW_HELL','2H_BOW_MORGANA','2H_CROSSBOW','2H_CROSSBOW_CANNON','MAIN_CROSSBOW'] },
  { key:'hammer',      label:'Çekiçler',         icon:'🔨',  ids:['MAIN_HAMMER','2H_POLEHAMMER','2H_HAMMER_HELL','2H_HAMMER_MORGANA'] },
  { key:'spear',       label:'Mızraklar',        icon:'🗡️',  ids:['MAIN_SPEAR','2H_SPEAR','2H_GLAIVE','2H_HARPOON_HELL'] },
  { key:'dagger',      label:'Hançerler',        icon:'🔪',  ids:['MAIN_DAGGER','2H_DAGGERPAIR','2H_CLAWPAIR_HELL','MAIN_RAPIER_MORGANA'] },
  { key:'quarterstaff',label:'Quarterstaff\'lar',icon:'🪄',  ids:['2H_QUARTERSTAFF','2H_IRONCLADEDSTAFF','2H_DOUBLEBLADEDSTAFF_HELL','2H_ROCKSTAFF_UNDEAD'] },
  { key:'fire',        label:'Ateş Asaları',     icon:'🔥',  ids:['MAIN_FIRE','2H_INFERNOSTAFF','2H_INFERNOSTAFF_HELL','2H_INFERNOSTAFF_MORGANA'] },
  { key:'frost',       label:'Buz Asaları',      icon:'❄️',  ids:['MAIN_FROST','2H_FROSTSTAFF','2H_ICEGAUNTLETS_HELL','2H_ICICLESTAFF_UNDEAD'] },
  { key:'arcane',      label:'Gizem Asaları',    icon:'🌀',  ids:['MAIN_ARCANE','2H_ARCANESTAFF','2H_ENIGMATICSTAFF_HELL','2H_LIGHTCROSSBOW_MORGANA'] },
  { key:'holy',        label:'Kutsal Asalar',    icon:'✨',  ids:['MAIN_HOLY','2H_HOLYSTAFF','2H_DIVINESTAFF_HELL','2H_HOLYSTAFF_MORGANA'] },
  { key:'nature',      label:'Doğa Asaları',     icon:'🌿',  ids:['MAIN_NATURE','2H_NATURESTAFF','2H_WILDSTAFF_HELL','2H_NATURESTAFF_KEEPER'] },
  { key:'curse',       label:'Lanet Asaları',    icon:'💀',  ids:['MAIN_CURSEDSTAFF','2H_CURSEDSTAFF','2H_CURSEDSTAFF_HELL','2H_SKULLJESTER_UNDEAD'] },
  { key:'bag',         label:'Çantalar',         icon:'🎒',  ids:['BAG'] },
  { key:'leather_head',label:'Deri Kask',        icon:'🪖',  ids:['HEAD_LEATHER_SET1','HEAD_LEATHER_SET2','HEAD_LEATHER_SET3'] },
  { key:'leather_armor',label:'Deri Zırh',       icon:'🥋',  ids:['ARMOR_LEATHER_SET1','ARMOR_LEATHER_SET2','ARMOR_LEATHER_SET3'] },
  { key:'leather_shoes',label:'Deri Bot',        icon:'👢',  ids:['SHOES_LEATHER_SET1','SHOES_LEATHER_SET2','SHOES_LEATHER_SET3'] },
  { key:'plate_head',  label:'Plaka Kask',       icon:'⛑️',  ids:['HEAD_PLATE_SET1','HEAD_PLATE_SET2','HEAD_PLATE_SET3'] },
  { key:'plate_armor', label:'Plaka Zırh',       icon:'🛡️',  ids:['ARMOR_PLATE_SET1','ARMOR_PLATE_SET2','ARMOR_PLATE_SET3'] },
  { key:'plate_shoes', label:'Plaka Bot',        icon:'🦺',  ids:['SHOES_PLATE_SET1','SHOES_PLATE_SET2','SHOES_PLATE_SET3'] },
  { key:'cloth_head',  label:'Kumaş Kask',       icon:'🎩',  ids:['HEAD_CLOTH_SET1','HEAD_CLOTH_SET2','HEAD_CLOTH_SET3'] },
  { key:'cloth_armor', label:'Kumaş Zırh',       icon:'👘',  ids:['ARMOR_CLOTH_SET1','ARMOR_CLOTH_SET2','ARMOR_CLOTH_SET3'] },
  { key:'cloth_shoes', label:'Kumaş Bot',        icon:'🥿',  ids:['SHOES_CLOTH_SET1','SHOES_CLOTH_SET2','SHOES_CLOTH_SET3'] },
  { key:'offhand',     label:'Kalkan/Offhand',   icon:'🛡',  ids:['SHIELD','TORCH','HORN','BOOK','LAMP'] },
  { key:'mount',       label:'Binekler',         icon:'🐎',  ids:['MOUNT_HORSE','MOUNT_OX','MOUNT_SWAMPDRAGON','MOUNT_DIREWOLF','MOUNT_MAMMOTH_BATTLE'] },
  { key:'food',        label:'Yiyecek',          icon:'🍲',  ids:['MEAL_STEW','MEAL_SOUP','MEAL_SALAD','MEAL_OMELETTE','MEAL_ROAST','MEAL_SANDWICH'] },
  { key:'potion',      label:'İksirler',         icon:'⚗️',  ids:['POTION_HEALING','POTION_ENERGY','POTION_GIGANTIFY','POTION_RESISTANCE','POTION_REVIVE'] },
];

// Resmi oyun isimleri (Türkçe + İngilizce)
const ITEM_NAMES_TR = {
  'MAIN_SWORD':'Kılıç','2H_CLAYMORE':'Claymore','2H_DUALSWORD':'Çift Kılıç','MAIN_SCIMITAR_MORGANA':'Pala','2H_CLEAVER_HELL':'Cehennem Kılıcı',
  'MAIN_AXE':'Balta','2H_AXE':'Büyük Balta','2H_HALBERD':'Halberd','2H_SCYTHE_HELL':'Cehennem Tırmığı','2H_HALBERD_UNDEAD':'Ölümsüz Halberd',
  '2H_BOW':'Yay','2H_LONGBOW':'Uzun Yay','2H_BOW_HELL':'Cehennem Yayı','2H_BOW_MORGANA':'Morgana Yayı',
  '2H_CROSSBOW':'Arbalet','2H_CROSSBOW_CANNON':'Top Arbaleti','MAIN_CROSSBOW':'El Arbaleti',
  'MAIN_HAMMER':'Çekiç','2H_POLEHAMMER':'Savaş Çekici','2H_HAMMER_HELL':'Cehennem Çekici','2H_HAMMER_MORGANA':'Morgana Çekici',
  'MAIN_SPEAR':'Mızrak','2H_SPEAR':'Uzun Mızrak','2H_GLAIVE':'Glaive','2H_HARPOON_HELL':'Zıpkın',
  'MAIN_DAGGER':'Hançer','2H_DAGGERPAIR':'Çift Hançer','2H_CLAWPAIR_HELL':'Cehennem Pençesi','MAIN_RAPIER_MORGANA':'Rapier',
  '2H_QUARTERSTAFF':'Quarterstaff','2H_IRONCLADEDSTAFF':'Demir Asa','2H_DOUBLEBLADEDSTAFF_HELL':'Çift Bıçaklı Asa','2H_ROCKSTAFF_UNDEAD':'Kaya Asası',
  'MAIN_FIRE':'Ateş Asası','2H_INFERNOSTAFF':'İnferno Asası','2H_INFERNOSTAFF_HELL':'Cehennem Ateş Asası','2H_INFERNOSTAFF_MORGANA':'Morgana Ateş Asası',
  'MAIN_FROST':'Buz Asası','2H_FROSTSTAFF':'Dondurucu Asa','2H_ICEGAUNTLETS_HELL':'Buz Eldiveni','2H_ICICLESTAFF_UNDEAD':'Buz Çubuğu',
  'MAIN_ARCANE':'Gizem Asası','2H_ARCANESTAFF':'Büyük Gizem Asası','2H_ENIGMATICSTAFF_HELL':'Gizemli Asa','2H_LIGHTCROSSBOW_MORGANA':'Işık Arbaleti',
  'MAIN_HOLY':'Kutsal Asa','2H_HOLYSTAFF':'Büyük Kutsal Asa','2H_DIVINESTAFF_HELL':'İlahi Asa','2H_HOLYSTAFF_MORGANA':'Morgana Kutsal Asa',
  'MAIN_NATURE':'Doğa Asası','2H_NATURESTAFF':'Büyük Doğa Asası','2H_WILDSTAFF_HELL':'Vahşi Asa','2H_NATURESTAFF_KEEPER':'Koruyucu Asası',
  'MAIN_CURSEDSTAFF':'Lanet Asası','2H_CURSEDSTAFF':'Büyük Lanet Asası','2H_CURSEDSTAFF_HELL':'Cehennem Lanet Asası','2H_SKULLJESTER_UNDEAD':'Kafatası Soytarısı',
  'BAG':'Çanta',
  'HEAD_LEATHER_SET1':'Avcı Kaskı','HEAD_LEATHER_SET2':'Kaçak Kaskı','HEAD_LEATHER_SET3':'Kadim Kask',
  'ARMOR_LEATHER_SET1':'Avcı Zırhı','ARMOR_LEATHER_SET2':'Kaçak Zırhı','ARMOR_LEATHER_SET3':'Kadim Deri Zırh',
  'SHOES_LEATHER_SET1':'Avcı Botları','SHOES_LEATHER_SET2':'Kaçak Botları','SHOES_LEATHER_SET3':'Kadim Deri Bot',
  'HEAD_PLATE_SET1':'Savaşçı Miğferi','HEAD_PLATE_SET2':'Muhafız Miğferi','HEAD_PLATE_SET3':'Kadim Miğfer',
  'ARMOR_PLATE_SET1':'Savaşçı Zırhı','ARMOR_PLATE_SET2':'Muhafız Zırhı','ARMOR_PLATE_SET3':'Kadim Plaka Zırh',
  'SHOES_PLATE_SET1':'Savaşçı Botları','SHOES_PLATE_SET2':'Muhafız Botları','SHOES_PLATE_SET3':'Kadim Plaka Bot',
  'HEAD_CLOTH_SET1':'Bilge Şapkası','HEAD_CLOTH_SET2':'Keşiş Başlığı','HEAD_CLOTH_SET3':'Kadim Şapka',
  'ARMOR_CLOTH_SET1':'Bilge Cübbesi','ARMOR_CLOTH_SET2':'Keşiş Cübbesi','ARMOR_CLOTH_SET3':'Kadim Kumaş Zırh',
  'SHOES_CLOTH_SET1':'Bilge Botları','SHOES_CLOTH_SET2':'Keşiş Botları','SHOES_CLOTH_SET3':'Kadim Kumaş Bot',
  'SHIELD':'Kalkan','TORCH':'Meşale','HORN':'Boru','BOOK':'Kitap','LAMP':'Fener',
  'MOUNT_HORSE':'At','MOUNT_OX':'Öküz','MOUNT_SWAMPDRAGON':'Bataklık Ejderi','MOUNT_DIREWOLF':'Kurt Bineği','MOUNT_MAMMOTH_BATTLE':'Savaş Mamutu',
  'MEAL_STEW':'Güveç','MEAL_SOUP':'Çorba','MEAL_SALAD':'Salata','MEAL_OMELETTE':'Omlet','MEAL_ROAST':'Kızartma','MEAL_SANDWICH':'Sandviç',
  'POTION_HEALING':'İyileştirme İksiri','POTION_ENERGY':'Enerji İksiri','POTION_GIGANTIFY':'Dev İksiri','POTION_RESISTANCE':'Direnç İksiri','POTION_REVIVE':'Diriliş İksiri',
};

// Crafting malzeme veritabanı
const RECIPES = {
  'BAG':              { mats:[{r:'LEATHER',q:16},{r:'PLANKS',q:8}] },
  'MAIN_SWORD':       { mats:[{r:'METALBAR',q:8},{r:'LEATHER',q:8},{r:'PLANKS',q:4}] },
  '2H_CLAYMORE':      { mats:[{r:'METALBAR',q:16},{r:'LEATHER',q:8},{r:'PLANKS',q:8}] },
  '2H_DUALSWORD':     { mats:[{r:'METALBAR',q:12},{r:'LEATHER',q:8},{r:'PLANKS',q:8}] },
  '2H_CLEAVER_HELL':  { mats:[{r:'METALBAR',q:16},{r:'LEATHER',q:8},{r:'PLANKS',q:8}] },
  'MAIN_AXE':         { mats:[{r:'METALBAR',q:8},{r:'PLANKS',q:8},{r:'LEATHER',q:4}] },
  '2H_AXE':           { mats:[{r:'METALBAR',q:16},{r:'PLANKS',q:8},{r:'LEATHER',q:4}] },
  '2H_HALBERD':       { mats:[{r:'METALBAR',q:12},{r:'PLANKS',q:12},{r:'LEATHER',q:4}] },
  '2H_BOW':           { mats:[{r:'PLANKS',q:16},{r:'CLOTH',q:8},{r:'LEATHER',q:8}] },
  '2H_LONGBOW':       { mats:[{r:'PLANKS',q:20},{r:'CLOTH',q:8},{r:'LEATHER',q:4}] },
  '2H_BOW_HELL':      { mats:[{r:'PLANKS',q:16},{r:'CLOTH',q:8},{r:'LEATHER',q:8}] },
  '2H_BOW_MORGANA':   { mats:[{r:'PLANKS',q:16},{r:'CLOTH',q:8},{r:'LEATHER',q:8}] },
  '2H_CROSSBOW':      { mats:[{r:'METALBAR',q:8},{r:'PLANKS',q:12},{r:'LEATHER',q:8}] },
  '2H_CROSSBOW_CANNON':{ mats:[{r:'METALBAR',q:12},{r:'PLANKS',q:12},{r:'LEATHER',q:4}] },
  'MAIN_HAMMER':      { mats:[{r:'METALBAR',q:12},{r:'PLANKS',q:8},{r:'LEATHER',q:4}] },
  '2H_POLEHAMMER':    { mats:[{r:'METALBAR',q:16},{r:'PLANKS',q:12},{r:'LEATHER',q:4}] },
  'MAIN_SPEAR':       { mats:[{r:'METALBAR',q:8},{r:'PLANKS',q:12},{r:'LEATHER',q:4}] },
  '2H_SPEAR':         { mats:[{r:'METALBAR',q:8},{r:'PLANKS',q:16},{r:'LEATHER',q:4}] },
  '2H_GLAIVE':        { mats:[{r:'METALBAR',q:8},{r:'PLANKS',q:16},{r:'LEATHER',q:4}] },
  'MAIN_DAGGER':      { mats:[{r:'METALBAR',q:8},{r:'LEATHER',q:8},{r:'PLANKS',q:4}] },
  '2H_DAGGERPAIR':    { mats:[{r:'METALBAR',q:12},{r:'LEATHER',q:8},{r:'PLANKS',q:8}] },
  '2H_QUARTERSTAFF':  { mats:[{r:'PLANKS',q:20},{r:'LEATHER',q:4}] },
  'MAIN_FIRE':        { mats:[{r:'PLANKS',q:8},{r:'CLOTH',q:8},{r:'METALBAR',q:8}] },
  'MAIN_FROST':       { mats:[{r:'PLANKS',q:8},{r:'CLOTH',q:8},{r:'METALBAR',q:8}] },
  'MAIN_ARCANE':      { mats:[{r:'PLANKS',q:8},{r:'CLOTH',q:8},{r:'METALBAR',q:8}] },
  'MAIN_HOLY':        { mats:[{r:'PLANKS',q:8},{r:'CLOTH',q:8},{r:'METALBAR',q:8}] },
  'MAIN_NATURE':      { mats:[{r:'PLANKS',q:8},{r:'CLOTH',q:8},{r:'METALBAR',q:8}] },
  'MAIN_CURSEDSTAFF': { mats:[{r:'PLANKS',q:8},{r:'CLOTH',q:8},{r:'METALBAR',q:8}] },
  '2H_INFERNOSTAFF':  { mats:[{r:'PLANKS',q:16},{r:'CLOTH',q:8},{r:'METALBAR',q:4}] },
  '2H_FROSTSTAFF':    { mats:[{r:'PLANKS',q:16},{r:'CLOTH',q:8},{r:'METALBAR',q:4}] },
  '2H_ARCANESTAFF':   { mats:[{r:'PLANKS',q:16},{r:'CLOTH',q:8},{r:'METALBAR',q:4}] },
  '2H_HOLYSTAFF':     { mats:[{r:'PLANKS',q:16},{r:'CLOTH',q:8},{r:'METALBAR',q:4}] },
  '2H_NATURESTAFF':   { mats:[{r:'PLANKS',q:16},{r:'CLOTH',q:8},{r:'METALBAR',q:4}] },
  '2H_CURSEDSTAFF':   { mats:[{r:'PLANKS',q:16},{r:'CLOTH',q:8},{r:'METALBAR',q:4}] },
  'HEAD_LEATHER_SET1':{ mats:[{r:'LEATHER',q:8},{r:'CLOTH',q:4}] },
  'ARMOR_LEATHER_SET1':{ mats:[{r:'LEATHER',q:12},{r:'CLOTH',q:4}] },
  'SHOES_LEATHER_SET1':{ mats:[{r:'LEATHER',q:8},{r:'CLOTH',q:4}] },
  'HEAD_LEATHER_SET2':{ mats:[{r:'LEATHER',q:8},{r:'CLOTH',q:4}] },
  'ARMOR_LEATHER_SET2':{ mats:[{r:'LEATHER',q:12},{r:'CLOTH',q:4}] },
  'SHOES_LEATHER_SET2':{ mats:[{r:'LEATHER',q:8},{r:'CLOTH',q:4}] },
  'HEAD_LEATHER_SET3':{ mats:[{r:'LEATHER',q:8},{r:'CLOTH',q:4}] },
  'ARMOR_LEATHER_SET3':{ mats:[{r:'LEATHER',q:12},{r:'CLOTH',q:4}] },
  'SHOES_LEATHER_SET3':{ mats:[{r:'LEATHER',q:8},{r:'CLOTH',q:4}] },
  'HEAD_PLATE_SET1':  { mats:[{r:'METALBAR',q:8},{r:'LEATHER',q:4}] },
  'ARMOR_PLATE_SET1': { mats:[{r:'METALBAR',q:12},{r:'LEATHER',q:4}] },
  'SHOES_PLATE_SET1': { mats:[{r:'METALBAR',q:8},{r:'LEATHER',q:4}] },
  'HEAD_PLATE_SET2':  { mats:[{r:'METALBAR',q:8},{r:'LEATHER',q:4}] },
  'ARMOR_PLATE_SET2': { mats:[{r:'METALBAR',q:12},{r:'LEATHER',q:4}] },
  'SHOES_PLATE_SET2': { mats:[{r:'METALBAR',q:8},{r:'LEATHER',q:4}] },
  'HEAD_CLOTH_SET1':  { mats:[{r:'CLOTH',q:8},{r:'LEATHER',q:4}] },
  'ARMOR_CLOTH_SET1': { mats:[{r:'CLOTH',q:12},{r:'LEATHER',q:4}] },
  'SHOES_CLOTH_SET1': { mats:[{r:'CLOTH',q:8},{r:'LEATHER',q:4}] },
  'HEAD_CLOTH_SET2':  { mats:[{r:'CLOTH',q:8},{r:'LEATHER',q:4}] },
  'ARMOR_CLOTH_SET2': { mats:[{r:'CLOTH',q:12},{r:'LEATHER',q:4}] },
  'SHOES_CLOTH_SET2': { mats:[{r:'CLOTH',q:8},{r:'LEATHER',q:4}] },
  'SHIELD':           { mats:[{r:'METALBAR',q:8},{r:'PLANKS',q:4},{r:'LEATHER',q:4}] },
};

// Refined resource isimler
const RES_NAMES = { PLANKS:'Tahta', METALBAR:'Metal Külçe', CLOTH:'Kumaş', LEATHER:'İşlenmiş Deri', STONEBLOCK:'Taş Blok' };
const RES_IDS   = { PLANKS:'PLANKS', METALBAR:'METALBAR', CLOTH:'CLOTH', LEATHER:'LEATHER', STONEBLOCK:'STONEBLOCK' };

let craftCity = 'Caerleon';
let selectedTier = 5;
let selectedEnchant = 0;
let selectedItemBase = null;
let priceCache = {};
let currentGroup = 'sword';

// ─── BAŞLANGIÇ ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderGroupButtons();
  renderItemGrid('sword');
  setCraftCity('Caerleon');
});

// ─── MODÜL GEÇİŞİ ─────────────────────────────────────────────
function switchModule(mod) {
  document.querySelectorAll('.module-content').forEach(el => el.style.display='none');
  document.querySelectorAll('.mod-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('mod-'+mod).style.display='block';
  event.target.classList.add('active');
  if (mod==='refining') loadRefiningPrices();
  if (mod==='farming')  loadFarmingPrices();
  if (mod==='food')     loadFoodGrid();
}

// ─── KATEGORİ BUTONLARI ───────────────────────────────────────
function renderGroupButtons() {
  const el = document.getElementById('groupButtons');
  if (!el) return;
  el.innerHTML = ITEM_GROUPS.map(g => `
    <button class="group-btn ${g.key===currentGroup?'active':''}" onclick="selectGroup('${g.key}')">
      <span style="font-size:16px">${g.icon}</span>
      <span>${g.label}</span>
    </button>`).join('');
}

function selectGroup(key) {
  currentGroup = key;
  document.querySelectorAll('.group-btn').forEach(b => b.classList.toggle('active', b.dataset?.key===key||b.textContent.includes(ITEM_GROUPS.find(g=>g.key===key)?.label)));
  renderGroupButtons();
  renderItemGrid(key);
  selectedItemBase = null;
  document.getElementById('craftPlaceholder').style.display='flex';
  document.getElementById('craftResult').style.display='none';
}

// ─── EŞYA IZGARASI (Slishy tarzı görsel seçim) ────────────────
function renderItemGrid(groupKey) {
  const group = ITEM_GROUPS.find(g => g.key === groupKey);
  if (!group) return;
  const el = document.getElementById('itemGrid');
  if (!el) return;

  el.innerHTML = group.ids.map(baseId => {
    const name = ITEM_NAMES_TR[baseId] || baseId.replace(/_/g,' ');
    const itemId = `T${selectedTier}_${baseId}`;
    const isActive = selectedItemBase === baseId;
    return `<button class="item-grid-btn ${isActive?'active':''}" onclick="selectItemBase('${baseId}')" title="${name}">
      <img src="https://render.albiononline.com/v1/item/${itemId}.png"
           onerror="this.src='https://render.albiononline.com/v1/item/T4_BAG.png'" alt="${name}"/>
      <span class="item-grid-name">${name}</span>
    </button>`;
  }).join('');
}

// ─── TIER SEÇİMİ ──────────────────────────────────────────────
function selectTier(tier) {
  selectedTier = tier;
  document.querySelectorAll('.tier-btn').forEach(b => b.classList.toggle('active', parseInt(b.dataset.tier)===tier));
  renderItemGrid(currentGroup);
  if (selectedItemBase) selectItemBase(selectedItemBase);
}

// ─── ENCHANT SEÇİMİ ───────────────────────────────────────────
function selectEnchant(enc) {
  selectedEnchant = enc;
  document.querySelectorAll('.enchant-btn').forEach(b => b.classList.toggle('active', parseInt(b.dataset.enc)===enc));
  if (selectedItemBase) updateItemDisplay();
}

// ─── EŞYA SEÇİMİ ──────────────────────────────────────────────
async function selectItemBase(baseId) {
  selectedItemBase = baseId;
  renderItemGrid(currentGroup);

  document.getElementById('craftPlaceholder').style.display='none';
  document.getElementById('craftResult').style.display='flex';
  document.getElementById('craftResult').style.flexDirection='column';
  document.getElementById('craftResult').style.gap='16px';

  await updateItemDisplay();
}

async function updateItemDisplay() {
  if (!selectedItemBase) return;
  const encSuffix = selectedEnchant > 0 ? `@${selectedEnchant}` : '';
  const itemId = `T${selectedTier}_${selectedItemBase}${encSuffix}`;
  const baseItemId = `T${selectedTier}_${selectedItemBase}`;
  const name = ITEM_NAMES_TR[selectedItemBase] || selectedItemBase;
  const recipe = RECIPES[selectedItemBase];

  // Başlık güncelle
  document.getElementById('resultItemHeader').innerHTML = `
    <img src="https://render.albiononline.com/v1/item/${itemId}.png"
         onerror="this.src='https://render.albiononline.com/v1/item/${baseItemId}.png'" alt="${name}"
         style="width:64px;height:64px;border-radius:10px;border:1px solid var(--border)"/>
    <div class="result-item-info">
      <h2>T${selectedTier} ${name}${selectedEnchant>0?' +'+selectedEnchant:''}</h2>
      <p>Craft şehri: ${craftCity} · Tier ${selectedTier}${selectedEnchant>0?' · Enchant +'+selectedEnchant:''}</p>
    </div>`;

  if (!recipe) {
    document.getElementById('materialsList').innerHTML = '<span style="color:var(--text-muted);font-size:13px">Bu eşya için crafting reçetesi henüz eklenmedi.</span>';
    return;
  }

  // Malzeme ID'lerini oluştur
  const matIds = recipe.mats.map(m => `T${selectedTier}_${m.r}`);
  const allIds = [...matIds, baseItemId];

  document.getElementById('materialsList').innerHTML = '<div class="loading-wrap"><div class="loading-spinner"></div><span>Fiyatlar çekiliyor...</span></div>';

  try {
    const url = `${PRICE_API}/api/v2/stats/prices/${[...new Set(allIds)].join(',')}.json?locations=${encodeURIComponent(ALL_CITIES)}`;
    const res = await fetch(url);
    const data = await res.json();
    data.forEach(d => {
      if (!priceCache[d.item_id]) priceCache[d.item_id] = {};
      if (d.sell_price_min > 0) {
        if (!priceCache[d.item_id][d.city] || d.sell_price_min < priceCache[d.item_id][d.city])
          priceCache[d.item_id][d.city] = d.sell_price_min;
      }
    });
    calcCrafting();
  } catch(e) {
    document.getElementById('materialsList').innerHTML = '<span style="color:var(--red)">API hatası. Tekrar deneyin.</span>';
  }
}

// ─── ŞEHİR SEÇİMİ ─────────────────────────────────────────────
function setCraftCity(city) {
  craftCity = city;
  document.querySelectorAll('.cbs-btn').forEach(b => b.classList.toggle('active', b.dataset.city===city));
  if (selectedItemBase) calcCrafting();
}

// ─── CRAFTING HESABI ──────────────────────────────────────────
function calcCrafting() {
  if (!selectedItemBase) return;
  const recipe = RECIPES[selectedItemBase];
  if (!recipe) return;

  const qty = parseInt(document.getElementById('craftQty')?.value)||1;
  const returnRate = document.getElementById('focusMode')?.checked ? 0.47 : (parseFloat(document.getElementById('returnRate')?.value)||15)/100;
  const usageFee = parseFloat(document.getElementById('usageFee')?.value||3)/100;
  const taxRate  = parseFloat(document.getElementById('taxRate')?.value||8)/100;
  const baseItemId = `T${selectedTier}_${selectedItemBase}`;

  // Malzeme maliyeti
  let totalMat = 0;
  const matRows = recipe.mats.map(m => {
    const matId = `T${selectedTier}_${m.r}`;
    const cheapest = getMinPriceCity(matId);
    const cityP = priceCache[matId]?.[craftCity] || cheapest.price || 0;
    const effQty = m.q * qty * (1 - returnRate);
    const cost = cityP * effQty;
    totalMat += cost;
    return { matId, name: RES_NAMES[m.r]||m.r, qty: m.q, effQty, cityP, cost, cheapest };
  });

  // Malzeme listesi render
  document.getElementById('materialsList').innerHTML = matRows.map(({matId, name, effQty, cityP, cost, cheapest}) => `
    <div class="material-row">
      <img src="https://render.albiononline.com/v1/item/${matId}.png" onerror="this.style.display='none'" alt="${name}" style="width:36px;height:36px;border-radius:6px;border:1px solid var(--border)"/>
      <div style="flex:1">
        <div style="font-size:13px;font-weight:500;color:var(--text-primary)">${name}</div>
        <div style="font-size:11px;color:var(--text-muted)">${effQty.toFixed(1)} adet (return sonrası)</div>
      </div>
      <div style="text-align:right">
        <div style="font-family:var(--font-display);font-size:14px;font-weight:700;color:var(--gold)">${cityP>0?cityP.toLocaleString('tr-TR'):'—'}</div>
        <div style="font-size:11px;color:var(--text-muted)">${cost>0?Math.round(cost).toLocaleString('tr-TR'):''}</div>
      </div>
      ${cheapest.city&&cheapest.city!==craftCity?`<div style="font-size:10px;color:var(--teal);font-family:var(--font-mono);text-align:right;min-width:80px">En ucuz:<br>${cheapest.city}<br>${cheapest.price?.toLocaleString('tr-TR')}</div>`:''}
    </div>`).join('');

  document.getElementById('materialsTotal').innerHTML = `
    <span class="materials-total-label">Toplam Malzeme Maliyeti (${craftCity})</span>
    <span class="materials-total-value">${Math.round(totalMat).toLocaleString('tr-TR')} Silver</span>`;

  // Satış fiyatları — tüm şehirler
  const cities = ['Caerleon','Bridgewatch','Lymhurst','Martlock','Thetford','Fort Sterling','Brecilien','Black Market'];
  const sellData = cities.map(c => ({ city:c, price: priceCache[baseItemId]?.[c]||0 }));
  const best = sellData.filter(x=>x.price>0).sort((a,b)=>b.price-a.price)[0];

  document.getElementById('sellPricesGrid').innerHTML = cities.map(c => {
    const p = priceCache[baseItemId]?.[c]||0;
    const isBest = best && c===best.city;
    const isBM = c==='Black Market';
    return `<div class="sell-price-card ${isBest?'best':''}" title="${c}">
      ${isBest?'<div class="best-badge">⭐ EN İYİ</div>':''}
      <div class="spc-city">${c}</div>
      <div class="spc-price ${!p?'no-data':''}">${p>0?p.toLocaleString('tr-TR'):(isBM?'Alış emri':'Veri yok')}</div>
    </div>`;
  }).join('');

  // Kâr hesabı
  const sellPrice = (best?.price||0) * qty;
  const usageFeeAmt = totalMat * usageFee;
  const taxAmt = sellPrice * taxRate;
  const totalCost = totalMat + usageFeeAmt;
  const netIncome = sellPrice - taxAmt;
  const profit = netIncome - totalCost;
  const profitPct = totalCost>0?((profit/totalCost)*100).toFixed(1):0;

  document.getElementById('profitBreakdown').innerHTML = `
    <div class="pb-row"><span class="pb-label">Malzeme maliyeti</span><span class="pb-value cost">-${Math.round(totalMat).toLocaleString('tr-TR')}</span></div>
    <div class="pb-row"><span class="pb-label">Kullanım ücreti (%${(usageFee*100).toFixed(0)})</span><span class="pb-value fee">-${Math.round(usageFeeAmt).toLocaleString('tr-TR')}</span></div>
    <div class="pb-row"><span class="pb-label">Satış geliri${best?' ('+best.city+')':''}</span><span class="pb-value income">+${Math.round(sellPrice).toLocaleString('tr-TR')}</span></div>
    <div class="pb-row"><span class="pb-label">Market vergisi (%${(taxRate*100).toFixed(0)})</span><span class="pb-value fee">-${Math.round(taxAmt).toLocaleString('tr-TR')}</span></div>`;

  const el = document.getElementById('profitResult');
  el.className = `profit-result ${profit>=0?'positive':'negative'}`;
  el.innerHTML = `
    <div><div class="pr-label">NET KÂR (${qty} adet)</div><div class="pr-pct">%${profitPct} getiri · ${best?.city||'—'}'de sat</div></div>
    <div class="pr-value ${profit>=0?'positive':'negative'}">${profit>=0?'+':''}${Math.round(profit).toLocaleString('tr-TR')}</div>`;
}

// ─── REFİNİNG ─────────────────────────────────────────────────
const REFINE_DATA = {
  wood:  { label:'Odun→Tahta',     raw:'WOOD',  ref:'PLANKS',     bonus:'Fort Sterling' },
  ore:   { label:'Maden→Külçe',    raw:'ORE',   ref:'METALBAR',   bonus:'Thetford' },
  fiber: { label:'Fiber→Kumaş',    raw:'FIBER', ref:'CLOTH',      bonus:'Lymhurst' },
  hide:  { label:'Deri→Deri İşl.', raw:'HIDE',  ref:'LEATHER',    bonus:'Martlock' },
  rock:  { label:'Taş→Taş Blok',   raw:'ROCK',  ref:'STONEBLOCK', bonus:'Bridgewatch' },
};
const FARM_DATA = {
  carrot: {name:'Havuç',icon:'🥕',hours:8, baseYield:27,itemId:'T1_FARM_CARROT_RIPE'},
  turnip: {name:'Şalgam',icon:'🌱',hours:22,baseYield:27,itemId:'T2_FARM_TURNIP_RIPE'},
  pumpkin:{name:'Kabak', icon:'🎃',hours:22,baseYield:27,itemId:'T3_FARM_PUMPKIN_RIPE'},
  corn:   {name:'Mısır', icon:'🌽',hours:52,baseYield:27,itemId:'T4_FARM_CORN_RIPE'},
  bean:   {name:'Fasulye',icon:'🫘',hours:52,baseYield:27,itemId:'T5_FARM_BEAN_RIPE'},
  wheat:  {name:'Buğday',icon:'🌾',hours:52,baseYield:27,itemId:'T2_FARM_WHEAT_RIPE'},
  sheep:  {name:'Koyun', icon:'🐑',hours:22,baseYield:9, itemId:'T3_FARM_SHEEP'},
  pig:    {name:'Domuz', icon:'🐷',hours:22,baseYield:9, itemId:'T4_FARM_PIG'},
  cow:    {name:'İnek',  icon:'🐄',hours:52,baseYield:9, itemId:'T5_FARM_COW'},
  goose:  {name:'Kaz',   icon:'🦆',hours:22,baseYield:9, itemId:'T2_FARM_GOOSE'},
};

async function loadRefiningPrices() {
  const ids=[];
  Object.values(REFINE_DATA).forEach(r=>{
    [4,5,6,7,8].forEach(t=>{
      ids.push(`T${t}_${r.raw}`,`T${t}_${r.ref}`);
      if(t>4) ids.push(`T${t-1}_${r.ref}`);
    });
  });
  try {
    const res=await fetch(`${PRICE_API}/api/v2/stats/prices/${[...new Set(ids)].join(',')}.json?locations=Caerleon,Bridgewatch,Lymhurst,Martlock,Thetford,Fort Sterling`);
    const data=await res.json();
    data.forEach(d=>{
      if(!priceCache[d.item_id]) priceCache[d.item_id]={};
      if(d.sell_price_min>0) priceCache[d.item_id][d.city]=d.sell_price_min;
    });
    renderRefiningCards();
  } catch(e){console.error(e);}
}

function renderRefiningCards() {
  Object.entries(REFINE_DATA).forEach(([res,r])=>{
    const el=document.getElementById(`refine-${res}`);
    if(!el) return;
    const rr=parseFloat(document.getElementById('refineReturnRate')?.value||36.7)/100;
    const qty=parseInt(document.getElementById('refineQty')?.value||100);
    el.innerHTML=[4,5,6,7,8].map(t=>{
      const rawP=getMinPrice(`T${t}_${r.raw}`);
      const refP=getMinPrice(`T${t}_${r.ref}`);
      const prevP=t>4?getMinPrice(`T${t-1}_${r.ref}`):0;
      const prev=qty*0.5;
      const out=Math.floor((qty+prev)*(1+rr)/2);
      const cost=rawP*qty+prevP*prev;
      const rev=refP*out;
      const profit=rev-cost;
      return `<div class="rc-tier-row">
        <span class="rc-tier-label">T${t}</span>
        <span class="rc-tier-profit ${profit>0?'pos':profit<0?'neg':'load'}">${profit!==0?(profit>0?'+':'')+Math.round(profit).toLocaleString('tr-TR'):'Veri yok'}</span>
      </div>`;
    }).join('');
  });
}

function calcRefining(){
  renderRefiningCards();
  const rr=parseFloat(document.getElementById('refineReturnRate').value)/100;
  const qty=parseInt(document.getElementById('refineQty').value)||100;
  const focus=document.getElementById('refineFocus').checked;
  const eff=focus?0.53:rr;
  const rows=[];
  Object.entries(REFINE_DATA).forEach(([res,r])=>{
    [4,5,6,7,8].forEach(t=>{
      const rawP=getMinPrice(`T${t}_${r.raw}`);
      const refP=getMinPrice(`T${t}_${r.ref}`);
      const prevP=t>4?getMinPrice(`T${t-1}_${r.ref}`):0;
      const prev=qty*0.5;
      const out=Math.floor((qty+prev)*(1+eff)/2);
      const cost=rawP*qty+prevP*prev;
      const rev=refP*out;
      const profit=rev-cost;
      rows.push({label:r.label,t,rawP,refP,out,cost,rev,profit,bonus:r.bonus});
    });
  });
  rows.sort((a,b)=>b.profit-a.profit);
  const tbody=document.getElementById('refineTableBody');
  if(tbody) tbody.innerHTML=rows.map(r=>`
    <tr>
      <td>${r.label}</td>
      <td><span class="item-tier">T${r.t}</span></td>
      <td>${r.rawP>0?r.rawP.toLocaleString('tr-TR'):'—'}</td>
      <td>${r.refP>0?r.refP.toLocaleString('tr-TR'):'—'}</td>
      <td>${r.out}</td>
      <td>${r.cost>0?Math.round(r.cost).toLocaleString('tr-TR'):'—'}</td>
      <td>${r.rev>0?Math.round(r.rev).toLocaleString('tr-TR'):'—'}</td>
      <td class="${r.profit>0?'profit-pos':'profit-neg'}">${r.profit!==0?(r.profit>0?'+':'')+Math.round(r.profit).toLocaleString('tr-TR'):'—'}</td>
    </tr>`).join('');
  const rd=document.getElementById('refiningResults');
  const rt=document.getElementById('refineTable');
  if(rd) rd.style.display='block';
  if(rt) rt.style.display='table';
}

async function loadFarmingPrices(){
  const ids=Object.values(FARM_DATA).map(f=>f.itemId);
  try{
    const res=await fetch(`${PRICE_API}/api/v2/stats/prices/${ids.join(',')}.json?locations=Caerleon`);
    const data=await res.json();
    data.forEach(d=>{
      if(!priceCache[d.item_id]) priceCache[d.item_id]={};
      if(d.sell_price_min>0) priceCache[d.item_id][d.city]=d.sell_price_min;
    });
    calcFarming();renderFarmRanking();
  }catch(e){console.error(e);}
}

function calcFarming(){
  const plots=parseInt(document.getElementById('farmPlots')?.value)||9;
  const cropKey=document.getElementById('farmCrop')?.value||'carrot';
  const premium=document.getElementById('farmPremium')?.checked;
  const focus=document.getElementById('farmFocus')?.checked;
  const crop=FARM_DATA[cropKey];
  if(!crop) return;
  const mult=(premium?1.5:1)*(focus?1.5:1);
  const totalYield=crop.baseYield*plots*mult;
  const price=getMinPrice(crop.itemId);
  const rev=totalYield*price;
  const daily=(rev/crop.hours)*24;
  const el=document.getElementById('farmResultContent');
  if(el) el.innerHTML=`<div class="farm-result-grid">
    <div class="farm-stat"><div class="farm-stat-label">Toplam Ürün</div><div class="farm-stat-value">${Math.round(totalYield)}</div></div>
    <div class="farm-stat"><div class="farm-stat-label">Birim Fiyat</div><div class="farm-stat-value">${price>0?price.toLocaleString('tr-TR'):'—'}</div></div>
    <div class="farm-stat"><div class="farm-stat-label">Toplam Gelir</div><div class="farm-stat-value">${price>0?Math.round(rev).toLocaleString('tr-TR'):'—'}</div></div>
    <div class="farm-stat"><div class="farm-stat-label">Günlük Gelir</div><div class="farm-stat-value">${price>0?Math.round(daily).toLocaleString('tr-TR'):'—'}</div></div>
    <div class="farm-stat"><div class="farm-stat-label">Hasat Süresi</div><div class="farm-stat-value">${crop.hours} saat</div></div>
    <div class="farm-stat"><div class="farm-stat-label">Tarla Başına/Gün</div><div class="farm-stat-value">${price>0?Math.round(daily/plots).toLocaleString('tr-TR'):'—'}</div></div>
  </div>`;
}

function renderFarmRanking(){
  const ranks=Object.entries(FARM_DATA).map(([k,c])=>{
    const p=getMinPrice(c.itemId);
    const daily=(c.baseYield*9*1.5*p/c.hours)*24;
    return {k,c,daily,p};
  }).filter(r=>r.p>0).sort((a,b)=>b.daily-a.daily);
  const el=document.getElementById('farmRanking');
  if(!el) return;
  el.innerHTML=ranks.slice(0,8).map((r,i)=>`
    <div class="farm-rank-row">
      <span class="farm-rank-num">${i+1}</span>
      <span class="farm-rank-icon">${r.c.icon}</span>
      <span class="farm-rank-name">${r.c.name}</span>
      <span style="font-size:11px;color:var(--text-muted)">${r.c.hours}sa</span>
      <span class="farm-rank-profit">${Math.round(r.daily).toLocaleString('tr-TR')}/gün</span>
    </div>`).join('');
}

function loadFoodGrid(){
  const el=document.getElementById('foodGrid');
  if(el) el.innerHTML='<span style="color:var(--text-muted);font-size:13px;padding:20px">Yakında eklenecek...</span>';
  document.getElementById('foodTableLoading').style.display='none';
}

// ─── YARDIMCILAR ──────────────────────────────────────────────
function getMinPrice(id){
  const p=priceCache[id];
  if(!p) return 0;
  const v=Object.values(p).filter(x=>x>0);
  return v.length?Math.min(...v):0;
}

function getMinPriceCity(id){
  const p=priceCache[id];
  if(!p) return {price:0,city:null};
  const entries=Object.entries(p).filter(([,v])=>v>0).sort((a,b)=>a[1]-b[1]);
  return entries.length?{price:entries[0][1],city:entries[0][0]}:{price:0,city:null};
}
