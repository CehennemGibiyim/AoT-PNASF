// AoT-PNASF — Crafting v3
// Render API: render.albiononline.com/v1/item/{ID}@{enchant}.png
// Price API: europe.albion-online-data.com

const PRICE_API = 'https://europe.albion-online-data.com';
const RENDER    = 'https://render.albiononline.com/v1/item';
const ALL_CITIES = 'Caerleon,Bridgewatch,Lymhurst,Martlock,Thetford,Fort Sterling,Brecilien,Black Market';

// ─── TÜM KATEGORİLER & EŞYALAR ───────────────────────────────
const CATEGORIES = [
  { key:'sword',   label:'Kılıçlar',        icon:'⚔️',
    items:[ {id:'MAIN_SWORD',name:'Kılıç'},{id:'2H_CLAYMORE',name:'Claymore'},{id:'2H_DUALSWORD',name:'Çift Kılıç'},
            {id:'MAIN_SCIMITAR_MORGANA',name:'Pala'},{id:'2H_CLEAVER_HELL',name:'Cehennem Kılıcı'},{id:'2H_BROADSWORD',name:'Broad Sword'} ] },
  { key:'axe',     label:'Baltalar',         icon:'🪓',
    items:[ {id:'MAIN_AXE',name:'Balta'},{id:'2H_AXE',name:'Büyük Balta'},{id:'2H_HALBERD',name:'Halberd'},
            {id:'2H_SCYTHE_HELL',name:'Cehennem Tırmığı'},{id:'2H_HALBERD_UNDEAD',name:'Ölümsüz Halberd'} ] },
  { key:'bow',     label:'Yaylar',           icon:'🏹',
    items:[ {id:'2H_BOW',name:'Yay'},{id:'2H_LONGBOW',name:'Uzun Yay'},{id:'2H_BOW_HELL',name:'Cehennem Yayı'},
            {id:'2H_BOW_MORGANA',name:'Morgana Yayı'},{id:'2H_CROSSBOW',name:'Arbalet'},
            {id:'2H_CROSSBOW_CANNON',name:'Top Arbaleti'},{id:'MAIN_CROSSBOW',name:'El Arbaleti'} ] },
  { key:'hammer',  label:'Çekiçler',         icon:'🔨',
    items:[ {id:'MAIN_HAMMER',name:'Çekiç'},{id:'2H_POLEHAMMER',name:'Savaş Çekici'},
            {id:'2H_HAMMER_HELL',name:'Cehennem Çekici'},{id:'2H_HAMMER_MORGANA',name:'Morgana Çekici'} ] },
  { key:'spear',   label:'Mızraklar',        icon:'🗡️',
    items:[ {id:'MAIN_SPEAR',name:'Mızrak'},{id:'2H_SPEAR',name:'Uzun Mızrak'},{id:'2H_GLAIVE',name:'Glaive'},
            {id:'2H_HARPOON_HELL',name:'Zıpkın'},{id:'2H_DUALSICKLE_HELL',name:'Çift Orak'} ] },
  { key:'dagger',  label:'Hançerler',        icon:'🔪',
    items:[ {id:'MAIN_DAGGER',name:'Hançer'},{id:'2H_DAGGERPAIR',name:'Çift Hançer'},
            {id:'2H_CLAWPAIR_HELL',name:'Cehennem Pençesi'},{id:'MAIN_RAPIER_MORGANA',name:'Rapier'} ] },
  { key:'qstaff',  label:'Quarterstaff',     icon:'🪄',
    items:[ {id:'2H_QUARTERSTAFF',name:'Quarterstaff'},{id:'2H_IRONCLADEDSTAFF',name:'Demir Asa'},
            {id:'2H_DOUBLEBLADEDSTAFF_HELL',name:'Çift Bıçaklı Asa'},{id:'2H_ROCKSTAFF_UNDEAD',name:'Kaya Asası'} ] },
  { key:'fire',    label:'Ateş Asaları',     icon:'🔥',
    items:[ {id:'MAIN_FIRE',name:'Ateş Asası'},{id:'2H_INFERNOSTAFF',name:'İnferno Asası'},
            {id:'2H_INFERNOSTAFF_HELL',name:'Cehennem Ateş'},{id:'2H_INFERNOSTAFF_MORGANA',name:'Morgana Ateş'} ] },
  { key:'frost',   label:'Buz Asaları',      icon:'❄️',
    items:[ {id:'MAIN_FROST',name:'Buz Asası'},{id:'2H_FROSTSTAFF',name:'Dondurucu Asa'},
            {id:'2H_ICEGAUNTLETS_HELL',name:'Buz Eldiveni'},{id:'2H_ICICLESTAFF_UNDEAD',name:'Buz Çubuğu'} ] },
  { key:'arcane',  label:'Gizem Asaları',    icon:'🌀',
    items:[ {id:'MAIN_ARCANE',name:'Gizem Asası'},{id:'2H_ARCANESTAFF',name:'Büyük Gizem Asası'},
            {id:'2H_ENIGMATICSTAFF_HELL',name:'Gizemli Asa'} ] },
  { key:'holy',    label:'Kutsal Asalar',    icon:'✨',
    items:[ {id:'MAIN_HOLY',name:'Kutsal Asa'},{id:'2H_HOLYSTAFF',name:'Büyük Kutsal Asa'},
            {id:'2H_DIVINESTAFF_HELL',name:'İlahi Asa'},{id:'2H_HOLYSTAFF_MORGANA',name:'Morgana Kutsal'} ] },
  { key:'nature',  label:'Doğa Asaları',     icon:'🌿',
    items:[ {id:'MAIN_NATURE',name:'Doğa Asası'},{id:'2H_NATURESTAFF',name:'Büyük Doğa Asası'},
            {id:'2H_WILDSTAFF_HELL',name:'Vahşi Asa'},{id:'2H_NATURESTAFF_KEEPER',name:'Koruyucu Asa'} ] },
  { key:'curse',   label:'Lanet Asaları',    icon:'💀',
    items:[ {id:'MAIN_CURSEDSTAFF',name:'Lanet Asası'},{id:'2H_CURSEDSTAFF',name:'Büyük Lanet Asası'},
            {id:'2H_CURSEDSTAFF_HELL',name:'Cehennem Lanet'},{id:'2H_SKULLJESTER_UNDEAD',name:'Kafatası Soytarısı'} ] },
  { key:'mace',    label:'Gürz / Mace',      icon:'🏛️',
    items:[ {id:'MAIN_MACE',name:'Gürz'},{id:'2H_MACE',name:'Büyük Gürz'},
            {id:'2H_FLAIL_HELL',name:'Cehennem Zincirgürz'},{id:'MAIN_MACE_MORGANA',name:'Morgana Gürz'} ] },
  { key:'bag',     label:'Çantalar',         icon:'🎒',
    items:[ {id:'BAG',name:'Çanta'},{id:'SATCHEL_OF_INSIGHT',name:'Insight Satchel'} ] },
  { key:'lh',      label:'Deri Kask',        icon:'🪖',
    items:[ {id:'HEAD_LEATHER_SET1',name:'Avcı Kaskı'},{id:'HEAD_LEATHER_SET2',name:'Kaçak Kaskı'},{id:'HEAD_LEATHER_SET3',name:'Kadim Kask'} ] },
  { key:'la',      label:'Deri Zırh',        icon:'🥋',
    items:[ {id:'ARMOR_LEATHER_SET1',name:'Avcı Zırhı'},{id:'ARMOR_LEATHER_SET2',name:'Kaçak Zırhı'},{id:'ARMOR_LEATHER_SET3',name:'Kadim Deri Zırh'} ] },
  { key:'ls',      label:'Deri Bot',         icon:'👢',
    items:[ {id:'SHOES_LEATHER_SET1',name:'Avcı Botları'},{id:'SHOES_LEATHER_SET2',name:'Kaçak Botları'},{id:'SHOES_LEATHER_SET3',name:'Kadim Deri Bot'} ] },
  { key:'ph',      label:'Plaka Kask',       icon:'⛑️',
    items:[ {id:'HEAD_PLATE_SET1',name:'Savaşçı Miğferi'},{id:'HEAD_PLATE_SET2',name:'Muhafız Miğferi'},{id:'HEAD_PLATE_SET3',name:'Kadim Miğfer'} ] },
  { key:'pa',      label:'Plaka Zırh',       icon:'🛡️',
    items:[ {id:'ARMOR_PLATE_SET1',name:'Savaşçı Zırhı'},{id:'ARMOR_PLATE_SET2',name:'Muhafız Zırhı'},{id:'ARMOR_PLATE_SET3',name:'Kadim Plaka Zırh'} ] },
  { key:'ps',      label:'Plaka Bot',        icon:'🦺',
    items:[ {id:'SHOES_PLATE_SET1',name:'Savaşçı Botu'},{id:'SHOES_PLATE_SET2',name:'Muhafız Botu'},{id:'SHOES_PLATE_SET3',name:'Kadim Plaka Bot'} ] },
  { key:'ch',      label:'Kumaş Kask',       icon:'🎩',
    items:[ {id:'HEAD_CLOTH_SET1',name:'Bilge Şapkası'},{id:'HEAD_CLOTH_SET2',name:'Keşiş Başlığı'},{id:'HEAD_CLOTH_SET3',name:'Kadim Şapka'} ] },
  { key:'ca',      label:'Kumaş Zırh',       icon:'👘',
    items:[ {id:'ARMOR_CLOTH_SET1',name:'Bilge Cübbesi'},{id:'ARMOR_CLOTH_SET2',name:'Keşiş Cübbesi'},{id:'ARMOR_CLOTH_SET3',name:'Kadim Kumaş Zırh'} ] },
  { key:'cs',      label:'Kumaş Bot',        icon:'🥿',
    items:[ {id:'SHOES_CLOTH_SET1',name:'Bilge Botları'},{id:'SHOES_CLOTH_SET2',name:'Keşiş Botları'},{id:'SHOES_CLOTH_SET3',name:'Kadim Kumaş Bot'} ] },
  { key:'offhand', label:'Offhand',          icon:'🔰',
    items:[ {id:'OFF_SHIELD',name:'Kalkan'},{id:'OFF_BOOK',name:'Kitap'},{id:'OFF_HORN',name:'Boru'},
            {id:'OFF_TORCH',name:'Meşale'},{id:'OFF_LAMP',name:'Fener'} ] },
  { key:'mount',   label:'Binekler',         icon:'🐎',
    items:[ {id:'MOUNT_HORSE',name:'At'},{id:'MOUNT_OX',name:'Öküz'},{id:'MOUNT_SWAMPDRAGON',name:'Bataklık Ejderi'},
            {id:'MOUNT_DIREWOLF',name:'Kurt Bineği'},{id:'MOUNT_MAMMOTH_BATTLE',name:'Savaş Mamutu'},
            {id:'MOUNT_ARMOREDHORSE',name:'Zırhlı At'} ] },
  { key:'food',    label:'Yiyecek',          icon:'🍲',
    items:[ {id:'MEAL_STEW',name:'Güveç'},{id:'MEAL_SOUP',name:'Çorba'},{id:'MEAL_SALAD',name:'Salata'},
            {id:'MEAL_OMELETTE',name:'Omlet'},{id:'MEAL_ROAST',name:'Kızartma'},{id:'MEAL_SANDWICH',name:'Sandviç'} ] },
  { key:'potion',  label:'İksirler',         icon:'⚗️',
    items:[ {id:'POTION_HEALING',name:'İyileştirme'},{id:'POTION_ENERGY',name:'Enerji'},
            {id:'POTION_GIGANTIFY',name:'Dev İksiri'},{id:'POTION_RESISTANCE',name:'Direnç'},
            {id:'POTION_REVIVE',name:'Diriliş'} ] },
];

// Crafting malzeme veritabanı (T her tier için ön ek)
const RECIPES = {
  'BAG':               [{r:'LEATHER',q:16},{r:'PLANKS',q:8}],
  'MAIN_SWORD':        [{r:'METALBAR',q:8},{r:'LEATHER',q:8},{r:'PLANKS',q:4}],
  '2H_CLAYMORE':       [{r:'METALBAR',q:16},{r:'LEATHER',q:8},{r:'PLANKS',q:8}],
  '2H_DUALSWORD':      [{r:'METALBAR',q:12},{r:'LEATHER',q:8},{r:'PLANKS',q:8}],
  '2H_CLEAVER_HELL':   [{r:'METALBAR',q:16},{r:'LEATHER',q:8},{r:'PLANKS',q:8}],
  '2H_BROADSWORD':     [{r:'METALBAR',q:16},{r:'LEATHER',q:8},{r:'PLANKS',q:8}],
  'MAIN_AXE':          [{r:'METALBAR',q:8},{r:'PLANKS',q:8},{r:'LEATHER',q:4}],
  '2H_AXE':            [{r:'METALBAR',q:16},{r:'PLANKS',q:8},{r:'LEATHER',q:4}],
  '2H_HALBERD':        [{r:'METALBAR',q:12},{r:'PLANKS',q:12},{r:'LEATHER',q:4}],
  '2H_SCYTHE_HELL':    [{r:'METALBAR',q:16},{r:'PLANKS',q:8},{r:'LEATHER',q:4}],
  '2H_BOW':            [{r:'PLANKS',q:16},{r:'CLOTH',q:8},{r:'LEATHER',q:8}],
  '2H_LONGBOW':        [{r:'PLANKS',q:20},{r:'CLOTH',q:8},{r:'LEATHER',q:4}],
  '2H_BOW_HELL':       [{r:'PLANKS',q:16},{r:'CLOTH',q:8},{r:'LEATHER',q:8}],
  '2H_BOW_MORGANA':    [{r:'PLANKS',q:16},{r:'CLOTH',q:8},{r:'LEATHER',q:8}],
  '2H_CROSSBOW':       [{r:'METALBAR',q:8},{r:'PLANKS',q:12},{r:'LEATHER',q:8}],
  '2H_CROSSBOW_CANNON':[{r:'METALBAR',q:12},{r:'PLANKS',q:12},{r:'LEATHER',q:4}],
  'MAIN_CROSSBOW':     [{r:'METALBAR',q:8},{r:'PLANKS',q:8},{r:'LEATHER',q:8}],
  'MAIN_HAMMER':       [{r:'METALBAR',q:12},{r:'PLANKS',q:8},{r:'LEATHER',q:4}],
  '2H_POLEHAMMER':     [{r:'METALBAR',q:16},{r:'PLANKS',q:12},{r:'LEATHER',q:4}],
  'MAIN_SPEAR':        [{r:'METALBAR',q:8},{r:'PLANKS',q:12},{r:'LEATHER',q:4}],
  '2H_SPEAR':          [{r:'METALBAR',q:8},{r:'PLANKS',q:16},{r:'LEATHER',q:4}],
  '2H_GLAIVE':         [{r:'METALBAR',q:8},{r:'PLANKS',q:16},{r:'LEATHER',q:4}],
  'MAIN_DAGGER':       [{r:'METALBAR',q:8},{r:'LEATHER',q:8},{r:'PLANKS',q:4}],
  '2H_DAGGERPAIR':     [{r:'METALBAR',q:12},{r:'LEATHER',q:8},{r:'PLANKS',q:8}],
  '2H_QUARTERSTAFF':   [{r:'PLANKS',q:20},{r:'LEATHER',q:4}],
  'MAIN_FIRE':         [{r:'PLANKS',q:8},{r:'CLOTH',q:8},{r:'METALBAR',q:8}],
  'MAIN_FROST':        [{r:'PLANKS',q:8},{r:'CLOTH',q:8},{r:'METALBAR',q:8}],
  'MAIN_ARCANE':       [{r:'PLANKS',q:8},{r:'CLOTH',q:8},{r:'METALBAR',q:8}],
  'MAIN_HOLY':         [{r:'PLANKS',q:8},{r:'CLOTH',q:8},{r:'METALBAR',q:8}],
  'MAIN_NATURE':       [{r:'PLANKS',q:8},{r:'CLOTH',q:8},{r:'METALBAR',q:8}],
  'MAIN_CURSEDSTAFF':  [{r:'PLANKS',q:8},{r:'CLOTH',q:8},{r:'METALBAR',q:8}],
  '2H_INFERNOSTAFF':   [{r:'PLANKS',q:16},{r:'CLOTH',q:8},{r:'METALBAR',q:4}],
  '2H_FROSTSTAFF':     [{r:'PLANKS',q:16},{r:'CLOTH',q:8},{r:'METALBAR',q:4}],
  '2H_ARCANESTAFF':    [{r:'PLANKS',q:16},{r:'CLOTH',q:8},{r:'METALBAR',q:4}],
  '2H_HOLYSTAFF':      [{r:'PLANKS',q:16},{r:'CLOTH',q:8},{r:'METALBAR',q:4}],
  '2H_NATURESTAFF':    [{r:'PLANKS',q:16},{r:'CLOTH',q:8},{r:'METALBAR',q:4}],
  '2H_CURSEDSTAFF':    [{r:'PLANKS',q:16},{r:'CLOTH',q:8},{r:'METALBAR',q:4}],
  'MAIN_MACE':         [{r:'METALBAR',q:8},{r:'PLANKS',q:8},{r:'LEATHER',q:4}],
  '2H_MACE':           [{r:'METALBAR',q:16},{r:'PLANKS',q:8},{r:'LEATHER',q:4}],
  'HEAD_LEATHER_SET1': [{r:'LEATHER',q:8},{r:'CLOTH',q:4}],
  'HEAD_LEATHER_SET2': [{r:'LEATHER',q:8},{r:'CLOTH',q:4}],
  'HEAD_LEATHER_SET3': [{r:'LEATHER',q:8},{r:'CLOTH',q:4}],
  'ARMOR_LEATHER_SET1':[{r:'LEATHER',q:12},{r:'CLOTH',q:4}],
  'ARMOR_LEATHER_SET2':[{r:'LEATHER',q:12},{r:'CLOTH',q:4}],
  'ARMOR_LEATHER_SET3':[{r:'LEATHER',q:12},{r:'CLOTH',q:4}],
  'SHOES_LEATHER_SET1':[{r:'LEATHER',q:8},{r:'CLOTH',q:4}],
  'SHOES_LEATHER_SET2':[{r:'LEATHER',q:8},{r:'CLOTH',q:4}],
  'SHOES_LEATHER_SET3':[{r:'LEATHER',q:8},{r:'CLOTH',q:4}],
  'HEAD_PLATE_SET1':   [{r:'METALBAR',q:8},{r:'LEATHER',q:4}],
  'HEAD_PLATE_SET2':   [{r:'METALBAR',q:8},{r:'LEATHER',q:4}],
  'HEAD_PLATE_SET3':   [{r:'METALBAR',q:8},{r:'LEATHER',q:4}],
  'ARMOR_PLATE_SET1':  [{r:'METALBAR',q:12},{r:'LEATHER',q:4}],
  'ARMOR_PLATE_SET2':  [{r:'METALBAR',q:12},{r:'LEATHER',q:4}],
  'ARMOR_PLATE_SET3':  [{r:'METALBAR',q:12},{r:'LEATHER',q:4}],
  'SHOES_PLATE_SET1':  [{r:'METALBAR',q:8},{r:'LEATHER',q:4}],
  'SHOES_PLATE_SET2':  [{r:'METALBAR',q:8},{r:'LEATHER',q:4}],
  'HEAD_CLOTH_SET1':   [{r:'CLOTH',q:8},{r:'LEATHER',q:4}],
  'HEAD_CLOTH_SET2':   [{r:'CLOTH',q:8},{r:'LEATHER',q:4}],
  'HEAD_CLOTH_SET3':   [{r:'CLOTH',q:8},{r:'LEATHER',q:4}],
  'ARMOR_CLOTH_SET1':  [{r:'CLOTH',q:12},{r:'LEATHER',q:4}],
  'ARMOR_CLOTH_SET2':  [{r:'CLOTH',q:12},{r:'LEATHER',q:4}],
  'ARMOR_CLOTH_SET3':  [{r:'CLOTH',q:12},{r:'LEATHER',q:4}],
  'SHOES_CLOTH_SET1':  [{r:'CLOTH',q:8},{r:'LEATHER',q:4}],
  'SHOES_CLOTH_SET2':  [{r:'CLOTH',q:8},{r:'LEATHER',q:4}],
  'OFF_SHIELD':        [{r:'METALBAR',q:8},{r:'PLANKS',q:4},{r:'LEATHER',q:4}],
  'MEAL_STEW':         [{r:'CROP_TURNIP',q:8},{r:'CROP_CARROT',q:4}],
  'MEAL_SOUP':         [{r:'CROP_TURNIP',q:8},{r:'CROP_CARROT',q:8}],
  'POTION_HEALING':    [{r:'HERB_FOXGLOVE',q:8},{r:'HERB_YARROW',q:4}],
  'POTION_ENERGY':     [{r:'HERB_FOXGLOVE',q:8},{r:'HERB_YARROW',q:4}],
};

const RES_NAMES = {PLANKS:'Tahta',METALBAR:'Metal Külçe',CLOTH:'Kumaş',LEATHER:'İşl. Deri',
  STONEBLOCK:'Taş Blok',CROP_TURNIP:'Şalgam',CROP_CARROT:'Havuç',CROP_PUMPKIN:'Kabak',
  HERB_FOXGLOVE:'Yüksükotu',HERB_YARROW:'Civanperçemi'};

const CITY_BONUSES = {
  'Lymhurst':    '🌲 Bonus: Yay, Kılıç, Arcane, Deri Kask/Bot (+40% focus)',
  'Bridgewatch': '🏜️ Bonus: Arbalet, Hançer, Cursed, Plaka Zırh (+40% focus)',
  'Martlock':    '🏔️ Bonus: Balta, Quarterstaff, Frost, Plaka Bot (+40% focus)',
  'Fort Sterling':'⛰️ Bonus: Çekiç, Mızrak, Holy, Kumaş Zırh (+40% focus)',
  'Thetford':    '🌿 Bonus: Gürz, Nature, Fire, Deri Zırh (+40% focus)',
  'Brecilien':   '🌫️ Bonus: Bitki/Herb crafting (+40% focus)',
  'Caerleon':    '⚔️ Black Market erişimi — Herb/bitki bonusu',
};

const REFINE_DATA = {
  wood:  {raw:'WOOD', ref:'PLANKS',   bonus:'Fort Sterling'},
  ore:   {raw:'ORE',  ref:'METALBAR', bonus:'Thetford'},
  fiber: {raw:'FIBER',ref:'CLOTH',    bonus:'Lymhurst'},
  hide:  {raw:'HIDE', ref:'LEATHER',  bonus:'Martlock'},
  rock:  {raw:'ROCK', ref:'STONEBLOCK',bonus:'Bridgewatch'},
};

const FARM_DATA = {
  carrot: {n:'Havuç',  icon:'🥕',h:8,  y:27,id:'T1_FARM_CARROT_RIPE'},
  turnip: {n:'Şalgam', icon:'🌱',h:22, y:27,id:'T2_FARM_TURNIP_RIPE'},
  pumpkin:{n:'Kabak',  icon:'🎃',h:22, y:27,id:'T3_FARM_PUMPKIN_RIPE'},
  corn:   {n:'Mısır',  icon:'🌽',h:52, y:27,id:'T4_FARM_CORN_RIPE'},
  bean:   {n:'Fasulye',icon:'🫘',h:52, y:27,id:'T5_FARM_BEAN_RIPE'},
  wheat:  {n:'Buğday', icon:'🌾',h:52, y:27,id:'T2_FARM_WHEAT_RIPE'},
  sheep:  {n:'Koyun',  icon:'🐑',h:22, y:9, id:'T3_FARM_SHEEP'},
  pig:    {n:'Domuz',  icon:'🐷',h:22, y:9, id:'T4_FARM_PIG'},
  cow:    {n:'İnek',   icon:'🐄',h:52, y:9, id:'T5_FARM_COW'},
  goose:  {n:'Kaz',    icon:'🦆',h:22, y:9, id:'T2_FARM_GOOSE'},
};

// STATE
let currentTier=5, currentEnchant=0, currentCat=null, currentItemBase=null, craftCity='Caerleon';
let priceCache={};

// ─── INIT ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded',()=>{
  buildCatList();
  loadRefiningPrices();
  loadFarmingPrices();
});

// ─── MODÜL ────────────────────────────────────────────────────
function switchModule(mod,btn){
  document.querySelectorAll('.module-content').forEach(el=>el.style.display='none');
  document.querySelectorAll('.mod-tab').forEach(t=>t.classList.remove('active'));
  document.getElementById('mod-'+mod).style.display='block';
  if(btn) btn.classList.add('active');
}

// ─── TIER & ENCHANT ───────────────────────────────────────────
function setTier(t){
  currentTier=t;
  document.querySelectorAll('#tierBtns .ctrl-btn').forEach(b=>b.classList.toggle('active',parseInt(b.dataset.val)===t));
  if(currentItemBase) renderItemGrid(currentCat);
  if(currentItemBase) loadItemPrices();
}

function setEnchant(e){
  currentEnchant=e;
  document.querySelectorAll('#enchantBtns .ctrl-btn').forEach(b=>b.classList.toggle('active',parseInt(b.dataset.val)===e));
  if(currentItemBase) updateSelectedBar();
  if(currentItemBase) calcCrafting();
}

// ─── KATEGORİ LİSTESİ ────────────────────────────────────────
function buildCatList(){
  const el=document.getElementById('catList');
  if(!el) return;
  el.innerHTML=CATEGORIES.map(c=>`
    <div class="cat-item ${currentCat===c.key?'active':''}" onclick="selectCat('${c.key}')">
      <span class="cat-icon">${c.icon}</span>
      <span>${c.label}</span>
    </div>`).join('');
}

function selectCat(key){
  currentCat=key;
  currentItemBase=null;
  buildCatList();
  renderItemGrid(key);
  document.getElementById('craftResult').style.display='none';
}

// ─── EŞYA IZGARASI ────────────────────────────────────────────
function renderItemGrid(catKey){
  const cat=CATEGORIES.find(c=>c.key===catKey);
  if(!cat) return;
  document.getElementById('gridTitle').textContent=`${cat.icon} ${cat.label} — T${currentTier}${currentEnchant>0?' +'+currentEnchant:''}`;

  const grid=document.getElementById('itemGrid');
  grid.innerHTML=cat.items.map(item=>{
    const fullId=buildItemId(item.id);
    const iconUrl=buildIconUrl(item.id);
    const isActive=currentItemBase===item.id;
    return `<button class="item-btn ${isActive?'active':''}" onclick="selectItem('${item.id}','${item.name}')" title="${item.name}">
      <img src="${iconUrl}" alt="${item.name}" onerror="this.src='${RENDER}/T4_BAG.png'"/>
      <span class="item-btn-name">${item.name}</span>
    </button>`;
  }).join('');
}

function buildItemId(baseId){
  return `T${currentTier}_${baseId}`;
}

function buildIconUrl(baseId){
  const enc=currentEnchant>0?`@${currentEnchant}`:'';
  return `${RENDER}/T${currentTier}_${baseId}${enc}.png`;
}

// ─── EŞYA SEÇİMİ ──────────────────────────────────────────────
function selectItem(baseId, name){
  currentItemBase=baseId;
  if(currentCat) renderItemGrid(currentCat);
  updateSelectedBar(name);
  document.getElementById('craftResult').style.display='block';
  loadItemPrices();
}

function updateSelectedBar(name){
  const n=name||currentItemBase;
  const enc=currentEnchant>0?` +${currentEnchant} ${['','Uncommon','Rare','Exceptional'][currentEnchant]}`:'';
  const iconUrl=buildIconUrl(currentItemBase);
  const el=document.getElementById('selectedBar');
  if(el) el.innerHTML=`
    <img src="${iconUrl}" onerror="this.src='${RENDER}/T4_BAG.png'" alt="${n}"/>
    <div class="selected-bar-info">
      <h2>T${currentTier} ${n}${enc}</h2>
      <p>Craft şehri: ${craftCity} · Tier ${currentTier}${enc}</p>
    </div>`;
}

// ─── ARAMA ────────────────────────────────────────────────────
function onSearchInput(val){
  const dd=document.getElementById('searchDropdown');
  if(!val||val.length<2){ dd.classList.remove('open'); return; }
  const q=val.toLowerCase();
  const results=[];
  CATEGORIES.forEach(cat=>{
    cat.items.forEach(item=>{
      if(item.name.toLowerCase().includes(q)||item.id.toLowerCase().includes(q)){
        results.push({...item, catKey:cat.key, catLabel:cat.label, catIcon:cat.icon});
      }
    });
  });
  if(!results.length){ dd.classList.remove('open'); return; }
  dd.innerHTML=results.slice(0,12).map(r=>`
    <div class="sd-item" onclick="searchSelect('${r.id}','${r.name}','${r.catKey}')">
      <img src="${RENDER}/T${currentTier}_${r.id}.png" onerror="this.src='${RENDER}/T4_BAG.png'" alt="${r.name}"/>
      <span class="sd-tier">T${currentTier}</span>
      <span>${r.name}</span>
      <span class="sd-cat">${r.catIcon} ${r.catLabel}</span>
    </div>`).join('');
  dd.classList.add('open');
}

function searchSelect(id,name,catKey){
  document.getElementById('searchDropdown').classList.remove('open');
  document.getElementById('craftSearchInput').value=name;
  currentCat=catKey;
  buildCatList();
  renderItemGrid(catKey);
  selectItem(id,name);
}

document.addEventListener('click',e=>{
  if(!e.target.closest('.craft-search-wrap'))
    document.getElementById('searchDropdown')?.classList.remove('open');
});

// ─── ŞEHİR ────────────────────────────────────────────────────
function setCraftCity(city){
  craftCity=city;
  document.querySelectorAll('.city-btn').forEach(b=>b.classList.toggle('active',b.dataset.city===city));
  const bi=document.getElementById('bonusInfo');
  if(bi){
    const bonus=CITY_BONUSES[city];
    bi.textContent=bonus||'';
    bi.classList.toggle('show',!!bonus);
  }
  calcCrafting();
}

// ─── FİYAT ÇEKİMİ ─────────────────────────────────────────────
async function loadItemPrices(){
  if(!currentItemBase) return;
  const recipe=RECIPES[currentItemBase];
  const baseId=`T${currentTier}_${currentItemBase}`;
  const matIds=recipe?recipe.map(m=>`T${currentTier}_${m.r}`):[];
  const allIds=[...new Set([...matIds,baseId])];

  document.getElementById('materialsList').innerHTML='<div class="loading-wrap"><div class="loading-spinner"></div><span>Fiyatlar yükleniyor...</span></div>';

  try{
    const url=`${PRICE_API}/api/v2/stats/prices/${allIds.join(',')}.json?locations=${encodeURIComponent(ALL_CITIES)}`;
    const res=await fetch(url);
    const data=await res.json();
    data.forEach(d=>{
      if(!priceCache[d.item_id]) priceCache[d.item_id]={};
      if(d.sell_price_min>0){
        if(!priceCache[d.item_id][d.city]||d.sell_price_min<priceCache[d.item_id][d.city])
          priceCache[d.item_id][d.city]=d.sell_price_min;
      }
    });
    calcCrafting();
  }catch(e){
    document.getElementById('materialsList').innerHTML='<span style="color:var(--red);font-size:13px">⚠️ API hatası. Tekrar deneyin.</span>';
  }
}

// ─── CRAFTING HESABI ──────────────────────────────────────────
function calcCrafting(){
  if(!currentItemBase) return;
  const recipe=RECIPES[currentItemBase];
  const baseId=`T${currentTier}_${currentItemBase}`;
  const qty=parseInt(document.getElementById('craftQty')?.value)||1;
  const focus=document.getElementById('focusMode')?.checked;
  const returnRate=focus?0.47:(parseFloat(document.getElementById('returnRate')?.value)||15)/100;
  const usageFee=(parseFloat(document.getElementById('usageFee')?.value)||3)/100;
  const taxRate=(parseFloat(document.getElementById('taxRate')?.value)||8)/100;

  if(!recipe){
    document.getElementById('materialsList').innerHTML='<p style="color:var(--text-muted);font-size:12px">Bu eşya için reçete henüz eklenmedi.</p>';
    return;
  }

  let totalMat=0;
  const matHtml=recipe.map(m=>{
    const matId=`T${currentTier}_${m.r}`;
    const cheapEntry=getMinPriceCity(matId);
    const cityP=priceCache[matId]?.[craftCity]||cheapEntry.price||0;
    const effQty=m.q*qty*(1-returnRate);
    const cost=cityP*effQty;
    totalMat+=cost;
    const cheapDiff=cheapEntry.city&&cheapEntry.city!==craftCity&&cheapEntry.price>0?
      `<span class="mat-cheap">En ucuz: ${cheapEntry.city}<br>${cheapEntry.price.toLocaleString('tr-TR')}</span>`:'';
    return `<div class="mat-row">
      <img src="${RENDER}/${matId}.png" onerror="this.style.display='none'" alt="${m.r}" style="width:34px;height:34px;border-radius:5px;border:1px solid var(--border)"/>
      <div style="flex:1">
        <div class="mat-name">${RES_NAMES[m.r]||m.r}</div>
        <div class="mat-qty">${effQty.toFixed(1)} adet (return sonrası)</div>
      </div>
      <div style="text-align:right">
        <div class="mat-price">${cityP>0?cityP.toLocaleString('tr-TR'):'—'}</div>
        <div class="mat-cost">${cost>0?'= '+Math.round(cost).toLocaleString('tr-TR'):''}</div>
      </div>
      ${cheapDiff}
    </div>`;
  }).join('');

  document.getElementById('materialsList').innerHTML=matHtml;
  document.getElementById('matTotal').innerHTML=`
    <div class="mat-total">
      <span class="mat-total-label">Toplam Malzeme (${craftCity})</span>
      <span class="mat-total-val">${Math.round(totalMat).toLocaleString('tr-TR')} Silver</span>
    </div>`;

  // Satış fiyatları
  const cities=['Caerleon','Bridgewatch','Lymhurst','Martlock','Thetford','Fort Sterling','Brecilien','Black Market'];
  const sellData=cities.map(c=>({city:c,price:priceCache[baseId]?.[c]||0}));
  const best=sellData.filter(x=>x.price>0).sort((a,b)=>b.price-a.price)[0];
  document.getElementById('sellGrid').innerHTML=cities.map(c=>{
    const p=priceCache[baseId]?.[c]||0;
    const isBest=best&&c===best.city;
    return `<div class="sell-card ${isBest?'best':''}" onclick="this.parentElement.querySelectorAll('.sell-card').forEach(x=>x.classList.remove('selected'));this.classList.add('selected');">
      ${isBest?'<div class="sc-best">⭐ EN İYİ</div>':''}
      <div class="sc-city">${c}</div>
      <div class="sc-price ${!p?'empty':''}">${p>0?p.toLocaleString('tr-TR'):(c==='Black Market'?'Alış emri':'Veri yok')}</div>
    </div>`;
  }).join('');

  // Kâr
  const sellPrice=(best?.price||0)*qty;
  const ufAmt=totalMat*usageFee;
  const taxAmt=sellPrice*taxRate;
  const netIncome=sellPrice-taxAmt;
  const profit=netIncome-totalMat-ufAmt;
  const pct=totalMat>0?((profit/totalMat)*100).toFixed(1):0;

  document.getElementById('profitBreakdown').innerHTML=`
    <div class="pb-row"><span class="pb-label">Malzeme maliyeti</span><span class="pb-val cost">−${Math.round(totalMat).toLocaleString('tr-TR')}</span></div>
    <div class="pb-row"><span class="pb-label">Kullanım ücreti (%${(usageFee*100).toFixed(0)})</span><span class="pb-val fee">−${Math.round(ufAmt).toLocaleString('tr-TR')}</span></div>
    <div class="pb-row"><span class="pb-label">Satış geliri${best?' ('+best.city+')':''}</span><span class="pb-val earn">+${Math.round(sellPrice).toLocaleString('tr-TR')}</span></div>
    <div class="pb-row"><span class="pb-label">Market vergisi (%${(taxRate*100).toFixed(0)})</span><span class="pb-val fee">−${Math.round(taxAmt).toLocaleString('tr-TR')}</span></div>`;

  const pb=document.getElementById('profitResult');
  pb.innerHTML=`<div class="profit-box ${profit>=0?'pos':'neg'}">
    <div><div class="pb-meta">NET KÂR (${qty} adet)</div><div class="pb-pct">%${pct} getiri · ${best?.city||'—'}'de sat</div></div>
    <div class="pb-amount ${profit>=0?'pos':'neg'}">${profit>=0?'+':''}${Math.round(profit).toLocaleString('tr-TR')}</div>
  </div>`;
}

// ─── REFİNİNG ─────────────────────────────────────────────────
async function loadRefiningPrices(){
  const ids=[];
  Object.values(REFINE_DATA).forEach(r=>{
    [4,5,6,7,8].forEach(t=>{
      ids.push(`T${t}_${r.raw}`,`T${t}_${r.ref}`);
      if(t>4) ids.push(`T${t-1}_${r.ref}`);
    });
  });
  try{
    const res=await fetch(`${PRICE_API}/api/v2/stats/prices/${[...new Set(ids)].join(',')}.json?locations=Caerleon,Bridgewatch,Lymhurst,Martlock,Thetford,Fort Sterling`);
    const data=await res.json();
    data.forEach(d=>{
      if(!priceCache[d.item_id]) priceCache[d.item_id]={};
      if(d.sell_price_min>0) priceCache[d.item_id][d.city]=d.sell_price_min;
    });
    calcRefining();
  }catch(e){console.error('Refining fiyat hatası',e);}
}

function calcRefining(){
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
        <span class="rc-p ${profit>0?'pos':profit<0?'neg':'wait'}">${rawP>0||refP>0?(profit>0?'+':'')+Math.round(profit).toLocaleString('tr-TR'):'Veri yok'}</span>
      </div>`;
    }).join('');
  });

  rows.sort((a,b)=>b.profit-a.profit);
  const tb=document.getElementById('refineTableBody');
  if(tb) tb.innerHTML=rows.map(r=>`<tr>
    <td>${r.label}</td><td><span style="font-family:var(--font-mono);font-size:10px;background:var(--gold-dim);color:var(--gold);padding:2px 5px;border-radius:3px">T${r.t}</span></td>
    <td>${r.rawP>0?r.rawP.toLocaleString('tr-TR'):'—'}</td>
    <td>${r.refP>0?r.refP.toLocaleString('tr-TR'):'—'}</td>
    <td>${r.out}</td>
    <td>${r.cost>0?Math.round(r.cost).toLocaleString('tr-TR'):'—'}</td>
    <td>${r.rev>0?Math.round(r.rev).toLocaleString('tr-TR'):'—'}</td>
    <td class="${r.profit>0?'profit-pos':'profit-neg'}">${r.profit!==0?(r.profit>0?'+':'')+Math.round(r.profit).toLocaleString('tr-TR'):'—'}</td>
  </tr>`).join('');
}

// ─── FARMING ──────────────────────────────────────────────────
async function loadFarmingPrices(){
  const ids=Object.values(FARM_DATA).map(f=>f.id);
  try{
    const res=await fetch(`${PRICE_API}/api/v2/stats/prices/${ids.join(',')}.json?locations=Caerleon`);
    const data=await res.json();
    data.forEach(d=>{
      if(!priceCache[d.item_id]) priceCache[d.item_id]={};
      if(d.sell_price_min>0) priceCache[d.item_id][d.city]=d.sell_price_min;
    });
    calcFarming();
    renderFarmRanking();
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
  const totalY=crop.y*plots*mult;
  const price=getMinPrice(crop.id);
  const rev=totalY*price;
  const daily=(rev/crop.h)*24;
  const el=document.getElementById('farmResultContent');
  if(el) el.innerHTML=`<div class="farm-grid">
    <div class="farm-stat"><div class="farm-stat-label">Toplam Ürün</div><div class="farm-stat-val">${Math.round(totalY)}</div></div>
    <div class="farm-stat"><div class="farm-stat-label">Birim Fiyat</div><div class="farm-stat-val">${price>0?price.toLocaleString('tr-TR'):'—'}</div></div>
    <div class="farm-stat"><div class="farm-stat-label">Toplam Gelir</div><div class="farm-stat-val">${price>0?Math.round(rev).toLocaleString('tr-TR'):'—'}</div></div>
    <div class="farm-stat"><div class="farm-stat-label">Günlük Gelir</div><div class="farm-stat-val">${price>0?Math.round(daily).toLocaleString('tr-TR'):'—'}</div></div>
    <div class="farm-stat"><div class="farm-stat-label">Hasat Süresi</div><div class="farm-stat-val">${crop.h} saat</div></div>
    <div class="farm-stat"><div class="farm-stat-label">Tarla Başına/Gün</div><div class="farm-stat-val">${price>0?Math.round(daily/plots).toLocaleString('tr-TR'):'—'}</div></div>
  </div>`;
}

function renderFarmRanking(){
  const ranks=Object.entries(FARM_DATA).map(([k,c])=>{
    const p=getMinPrice(c.id);
    const daily=(c.y*9*1.5*p/c.h)*24;
    return {k,c,daily,p};
  }).filter(r=>r.p>0).sort((a,b)=>b.daily-a.daily);
  const el=document.getElementById('farmRanking');
  if(!el) return;
  if(!ranks.length){el.innerHTML='<p style="color:var(--text-muted);font-size:12px;padding:10px">Fiyat verisi bekleniyor...</p>';return;}
  el.innerHTML=ranks.slice(0,8).map((r,i)=>`
    <div class="farm-rank-row">
      <span class="farm-rank-n">${i+1}</span>
      <span style="font-size:16px">${r.c.icon}</span>
      <span style="flex:1;font-size:12px;color:var(--text-primary)">${r.c.n}</span>
      <span style="font-size:11px;color:var(--text-muted)">${r.c.h}sa</span>
      <span class="farm-rank-profit">${Math.round(r.daily).toLocaleString('tr-TR')}/gün</span>
    </div>`).join('');
}

// ─── YARDIMCI ─────────────────────────────────────────────────
function getMinPrice(id){
  const p=priceCache[id];
  if(!p) return 0;
  const v=Object.values(p).filter(x=>x>0);
  return v.length?Math.min(...v):0;
}
function getMinPriceCity(id){
  const p=priceCache[id];
  if(!p) return {price:0,city:null};
  const e=Object.entries(p).filter(([,v])=>v>0).sort((a,b)=>a[1]-b[1]);
  return e.length?{price:e[0][1],city:e[0][0]}:{price:0,city:null};
}
