// AoT-PNASF — Market Module v2
// Item ikonları: render.albiononline.com
// Fiyat verisi: AODP API (europe/west/east)

const SERVERS = {
  europe: 'https://europe.albion-online-data.com',
  west:   'https://west.albion-online-data.com',
  east:   'https://east.albion-online-data.com'
};

// TÜM PAZARLAR — Black Market dahil
const ALL_CITIES = [
  'Caerleon','Bridgewatch','Lymhurst','Martlock',
  'Thetford','Fort Sterling','Brecilien','Black Market'
];

const CITY_DISPLAY = {
  'Caerleon':'Caerleon','Bridgewatch':'Bridgewatch','Lymhurst':'Lymhurst',
  'Martlock':'Martlock','Thetford':'Thetford','Fort Sterling':'Fort Sterling',
  'FortSterling':'Fort Sterling','Brecilien':'Brecilien','Black Market':'Black Market'
};

// Şehir renkleri
const CITY_CLASS = {
  'Caerleon':'city-caerleon','Bridgewatch':'city-bridgewatch',
  'Lymhurst':'city-lymhurst','Martlock':'city-martlock',
  'Thetford':'city-thetford','Fort Sterling':'city-fortsterling',
  'FortSterling':'city-fortsterling','Brecilien':'city-brecilien',
  'Black Market':'city-blackmarket'
};

// İkon URL — resmi render API
function getIconUrl(itemId, quality = 1, size = 40) {
  const q = quality > 1 ? `?quality=${quality}` : '';
  return `https://render.albiononline.com/v1/item/${itemId}.png${q}`;
}

// GENİŞ KATEGORİLER — tüm alt tipler dahil
const CATEGORIES = {
  bags: ['T2_BAG','T3_BAG','T4_BAG','T5_BAG','T6_BAG','T7_BAG','T8_BAG'],

  swords: [
    'T4_MAIN_SWORD','T5_MAIN_SWORD','T6_MAIN_SWORD','T7_MAIN_SWORD','T8_MAIN_SWORD',
    'T4_2H_CLAYMORE','T5_2H_CLAYMORE','T6_2H_CLAYMORE','T7_2H_CLAYMORE','T8_2H_CLAYMORE',
    'T4_MAIN_SCIMITAR_MORGANA','T5_MAIN_SCIMITAR_MORGANA','T6_MAIN_SCIMITAR_MORGANA',
    'T4_2H_DUALSWORD','T5_2H_DUALSWORD','T6_2H_DUALSWORD','T7_2H_DUALSWORD','T8_2H_DUALSWORD',
    'T4_2H_CLEAVER_HELL','T5_2H_CLEAVER_HELL','T6_2H_CLEAVER_HELL'
  ],

  bows: [
    'T4_2H_BOW','T5_2H_BOW','T6_2H_BOW','T7_2H_BOW','T8_2H_BOW',
    'T4_2H_CROSSBOW','T5_2H_CROSSBOW','T6_2H_CROSSBOW','T7_2H_CROSSBOW','T8_2H_CROSSBOW',
    'T4_2H_BOW_HELL','T5_2H_BOW_HELL','T6_2H_BOW_HELL',
    'T4_2H_BOW_MORGANA','T5_2H_BOW_MORGANA','T6_2H_BOW_MORGANA',
    'T4_2H_CROSSBOW_CANNON','T5_2H_CROSSBOW_CANNON','T6_2H_CROSSBOW_CANNON',
    'T4_2H_LONGBOW','T5_2H_LONGBOW','T6_2H_LONGBOW','T7_2H_LONGBOW','T8_2H_LONGBOW'
  ],

  axes: [
    'T4_MAIN_AXE','T5_MAIN_AXE','T6_MAIN_AXE','T7_MAIN_AXE','T8_MAIN_AXE',
    'T4_2H_AXE','T5_2H_AXE','T6_2H_AXE','T7_2H_AXE','T8_2H_AXE',
    'T4_2H_HALBERD','T5_2H_HALBERD','T6_2H_HALBERD','T7_2H_HALBERD','T8_2H_HALBERD',
    'T4_2H_SCYTHE_HELL','T5_2H_SCYTHE_HELL','T6_2H_SCYTHE_HELL'
  ],

  staves: [
    'T4_MAIN_ARCANE','T5_MAIN_ARCANE','T6_MAIN_ARCANE','T7_MAIN_ARCANE','T8_MAIN_ARCANE',
    'T4_MAIN_FIRE','T5_MAIN_FIRE','T6_MAIN_FIRE','T7_MAIN_FIRE','T8_MAIN_FIRE',
    'T4_MAIN_FROST','T5_MAIN_FROST','T6_MAIN_FROST','T7_MAIN_FROST','T8_MAIN_FROST',
    'T4_MAIN_HOLY','T5_MAIN_HOLY','T6_MAIN_HOLY','T7_MAIN_HOLY','T8_MAIN_HOLY',
    'T4_MAIN_NATURE','T5_MAIN_NATURE','T6_MAIN_NATURE','T7_MAIN_NATURE','T8_MAIN_NATURE',
    'T4_2H_ARCANE_MORGANA','T5_2H_ARCANE_MORGANA','T6_2H_ARCANE_MORGANA',
    'T4_2H_DEMONICSTAFF','T5_2H_DEMONICSTAFF','T6_2H_DEMONICSTAFF'
  ],

  armor_leather: [
    'T4_HEAD_LEATHER_SET1','T5_HEAD_LEATHER_SET1','T6_HEAD_LEATHER_SET1','T7_HEAD_LEATHER_SET1','T8_HEAD_LEATHER_SET1',
    'T4_ARMOR_LEATHER_SET1','T5_ARMOR_LEATHER_SET1','T6_ARMOR_LEATHER_SET1','T7_ARMOR_LEATHER_SET1','T8_ARMOR_LEATHER_SET1',
    'T4_SHOES_LEATHER_SET1','T5_SHOES_LEATHER_SET1','T6_SHOES_LEATHER_SET1','T7_SHOES_LEATHER_SET1','T8_SHOES_LEATHER_SET1'
  ],

  armor_plate: [
    'T4_HEAD_PLATE_SET1','T5_HEAD_PLATE_SET1','T6_HEAD_PLATE_SET1','T7_HEAD_PLATE_SET1','T8_HEAD_PLATE_SET1',
    'T4_ARMOR_PLATE_SET1','T5_ARMOR_PLATE_SET1','T6_ARMOR_PLATE_SET1','T7_ARMOR_PLATE_SET1','T8_ARMOR_PLATE_SET1',
    'T4_SHOES_PLATE_SET1','T5_SHOES_PLATE_SET1','T6_SHOES_PLATE_SET1','T7_SHOES_PLATE_SET1','T8_SHOES_PLATE_SET1'
  ],

  resources: [
    'T4_WOOD','T5_WOOD','T6_WOOD','T7_WOOD','T8_WOOD',
    'T4_ORE','T5_ORE','T6_ORE','T7_ORE','T8_ORE',
    'T4_FIBER','T5_FIBER','T6_FIBER','T7_FIBER','T8_FIBER',
    'T4_HIDE','T5_HIDE','T6_HIDE','T7_HIDE','T8_HIDE',
    'T4_ROCK','T5_ROCK','T6_ROCK','T7_ROCK','T8_ROCK'
  ],

  refined: [
    'T4_PLANKS','T5_PLANKS','T6_PLANKS','T7_PLANKS','T8_PLANKS',
    'T4_METALBAR','T5_METALBAR','T6_METALBAR','T7_METALBAR','T8_METALBAR',
    'T4_CLOTH','T5_CLOTH','T6_CLOTH','T7_CLOTH','T8_CLOTH',
    'T4_LEATHER','T5_LEATHER','T6_LEATHER','T7_LEATHER','T8_LEATHER',
    'T4_STONEBLOCK','T5_STONEBLOCK','T6_STONEBLOCK','T7_STONEBLOCK','T8_STONEBLOCK'
  ],

  food: [
    'T4_MEAL_STEW','T5_MEAL_STEW','T6_MEAL_STEW','T7_MEAL_STEW',
    'T4_MEAL_SOUP','T5_MEAL_SOUP','T6_MEAL_SOUP',
    'T4_MEAL_SALAD','T5_MEAL_SALAD','T6_MEAL_SALAD',
    'T4_MEAL_OMELETTE','T5_MEAL_OMELETTE','T6_MEAL_OMELETTE',
    'T5_MEAL_ROAST','T6_MEAL_ROAST','T7_MEAL_ROAST'
  ],

  potions: [
    'T4_POTION_HEALING','T5_POTION_HEALING','T6_POTION_HEALING','T7_POTION_HEALING',
    'T4_POTION_ENERGY','T5_POTION_ENERGY','T6_POTION_ENERGY',
    'T4_POTION_GIGANTIFY','T5_POTION_GIGANTIFY','T6_POTION_GIGANTIFY',
    'T4_POTION_RESISTANCE','T5_POTION_RESISTANCE','T6_POTION_RESISTANCE'
  ],

  mounts: [
    'T3_MOUNT_HORSE','T4_MOUNT_HORSE','T5_MOUNT_HORSE','T6_MOUNT_HORSE','T7_MOUNT_HORSE','T8_MOUNT_HORSE',
    'T5_MOUNT_SWAMPDRAGON','T6_MOUNT_SWAMPDRAGON','T7_MOUNT_SWAMPDRAGON',
    'T4_MOUNT_OX','T5_MOUNT_OX','T6_MOUNT_OX','T7_MOUNT_OX','T8_MOUNT_OX',
    'T5_MOUNT_DIREWOLF','T6_MOUNT_DIREWOLF','T7_MOUNT_DIREWOLF',
    'T6_MOUNT_MAMMOTH_BATTLE','T7_MOUNT_MAMMOTH_BATTLE','T8_MOUNT_MAMMOTH_BATTLE'
  ]
};

// Türkçe/İngilizce item isimleri
const ITEM_NAMES = {
  tr: {
    'T2_BAG':'T2 Çanta','T3_BAG':'T3 Çanta','T4_BAG':'T4 Çanta','T5_BAG':'T5 Çanta','T6_BAG':'T6 Çanta','T7_BAG':'T7 Çanta','T8_BAG':'T8 Çanta',
    'T4_MAIN_SWORD':'T4 Kılıç','T5_MAIN_SWORD':'T5 Kılıç','T6_MAIN_SWORD':'T6 Kılıç','T7_MAIN_SWORD':'T7 Kılıç','T8_MAIN_SWORD':'T8 Kılıç',
    'T4_2H_CLAYMORE':'T4 Claymore','T5_2H_CLAYMORE':'T5 Claymore','T6_2H_CLAYMORE':'T6 Claymore','T7_2H_CLAYMORE':'T7 Claymore','T8_2H_CLAYMORE':'T8 Claymore',
    'T4_2H_DUALSWORD':'T4 Çift Kılıç','T5_2H_DUALSWORD':'T5 Çift Kılıç','T6_2H_DUALSWORD':'T6 Çift Kılıç','T7_2H_DUALSWORD':'T7 Çift Kılıç','T8_2H_DUALSWORD':'T8 Çift Kılıç',
    'T4_2H_BOW':'T4 Yay','T5_2H_BOW':'T5 Yay','T6_2H_BOW':'T6 Yay','T7_2H_BOW':'T7 Yay','T8_2H_BOW':'T8 Yay',
    'T4_2H_LONGBOW':'T4 Uzun Yay','T5_2H_LONGBOW':'T5 Uzun Yay','T6_2H_LONGBOW':'T6 Uzun Yay','T7_2H_LONGBOW':'T7 Uzun Yay','T8_2H_LONGBOW':'T8 Uzun Yay',
    'T4_2H_CROSSBOW':'T4 Arbalet','T5_2H_CROSSBOW':'T5 Arbalet','T6_2H_CROSSBOW':'T6 Arbalet','T7_2H_CROSSBOW':'T7 Arbalet','T8_2H_CROSSBOW':'T8 Arbalet',
    'T4_2H_CROSSBOW_CANNON':'T4 Top Arbaleti','T5_2H_CROSSBOW_CANNON':'T5 Top Arbaleti','T6_2H_CROSSBOW_CANNON':'T6 Top Arbaleti',
    'T4_2H_BOW_HELL':'T4 Cehennem Yayı','T5_2H_BOW_HELL':'T5 Cehennem Yayı','T6_2H_BOW_HELL':'T6 Cehennem Yayı',
    'T4_2H_BOW_MORGANA':'T4 Morgana Yayı','T5_2H_BOW_MORGANA':'T5 Morgana Yayı','T6_2H_BOW_MORGANA':'T6 Morgana Yayı',
    'T4_MAIN_AXE':'T4 Balta','T5_MAIN_AXE':'T5 Balta','T6_MAIN_AXE':'T6 Balta','T7_MAIN_AXE':'T7 Balta','T8_MAIN_AXE':'T8 Balta',
    'T4_2H_AXE':'T4 Çift El Balta','T5_2H_AXE':'T5 Çift El Balta','T6_2H_AXE':'T6 Çift El Balta','T7_2H_AXE':'T7 Çift El Balta','T8_2H_AXE':'T8 Çift El Balta',
    'T4_2H_HALBERD':'T4 Halberd','T5_2H_HALBERD':'T5 Halberd','T6_2H_HALBERD':'T6 Halberd','T7_2H_HALBERD':'T7 Halberd','T8_2H_HALBERD':'T8 Halberd',
    'T4_MAIN_FIRE':'T4 Ateş Asa','T5_MAIN_FIRE':'T5 Ateş Asa','T6_MAIN_FIRE':'T6 Ateş Asa','T7_MAIN_FIRE':'T7 Ateş Asa','T8_MAIN_FIRE':'T8 Ateş Asa',
    'T4_MAIN_FROST':'T4 Buz Asa','T5_MAIN_FROST':'T5 Buz Asa','T6_MAIN_FROST':'T6 Buz Asa','T7_MAIN_FROST':'T7 Buz Asa','T8_MAIN_FROST':'T8 Buz Asa',
    'T4_MAIN_HOLY':'T4 Kutsal Asa','T5_MAIN_HOLY':'T5 Kutsal Asa','T6_MAIN_HOLY':'T6 Kutsal Asa','T7_MAIN_HOLY':'T7 Kutsal Asa','T8_MAIN_HOLY':'T8 Kutsal Asa',
    'T4_MAIN_NATURE':'T4 Doğa Asası','T5_MAIN_NATURE':'T5 Doğa Asası','T6_MAIN_NATURE':'T6 Doğa Asası','T7_MAIN_NATURE':'T7 Doğa Asası','T8_MAIN_NATURE':'T8 Doğa Asası',
    'T4_MAIN_ARCANE':'T4 Gizem Asası','T5_MAIN_ARCANE':'T5 Gizem Asası','T6_MAIN_ARCANE':'T6 Gizem Asası','T7_MAIN_ARCANE':'T7 Gizem Asası','T8_MAIN_ARCANE':'T8 Gizem Asası',
    'T4_ARMOR_LEATHER_SET1':'T4 Deri Zırh','T5_ARMOR_LEATHER_SET1':'T5 Deri Zırh','T6_ARMOR_LEATHER_SET1':'T6 Deri Zırh','T7_ARMOR_LEATHER_SET1':'T7 Deri Zırh','T8_ARMOR_LEATHER_SET1':'T8 Deri Zırh',
    'T4_ARMOR_PLATE_SET1':'T4 Plaka Zırh','T5_ARMOR_PLATE_SET1':'T5 Plaka Zırh','T6_ARMOR_PLATE_SET1':'T6 Plaka Zırh','T7_ARMOR_PLATE_SET1':'T7 Plaka Zırh','T8_ARMOR_PLATE_SET1':'T8 Plaka Zırh',
    'T4_HEAD_LEATHER_SET1':'T4 Deri Kask','T5_HEAD_LEATHER_SET1':'T5 Deri Kask','T6_HEAD_LEATHER_SET1':'T6 Deri Kask','T7_HEAD_LEATHER_SET1':'T7 Deri Kask','T8_HEAD_LEATHER_SET1':'T8 Deri Kask',
    'T4_HEAD_PLATE_SET1':'T4 Plaka Kask','T5_HEAD_PLATE_SET1':'T5 Plaka Kask','T6_HEAD_PLATE_SET1':'T6 Plaka Kask','T7_HEAD_PLATE_SET1':'T7 Plaka Kask','T8_HEAD_PLATE_SET1':'T8 Plaka Kask',
    'T4_SHOES_LEATHER_SET1':'T4 Deri Bot','T5_SHOES_LEATHER_SET1':'T5 Deri Bot','T6_SHOES_LEATHER_SET1':'T6 Deri Bot','T7_SHOES_LEATHER_SET1':'T7 Deri Bot','T8_SHOES_LEATHER_SET1':'T8 Deri Bot',
    'T4_SHOES_PLATE_SET1':'T4 Plaka Bot','T5_SHOES_PLATE_SET1':'T5 Plaka Bot','T6_SHOES_PLATE_SET1':'T6 Plaka Bot','T7_SHOES_PLATE_SET1':'T7 Plaka Bot','T8_SHOES_PLATE_SET1':'T8 Plaka Bot',
    'T4_WOOD':'T4 Odun','T5_WOOD':'T5 Odun','T6_WOOD':'T6 Odun','T7_WOOD':'T7 Odun','T8_WOOD':'T8 Odun',
    'T4_ORE':'T4 Maden','T5_ORE':'T5 Maden','T6_ORE':'T6 Maden','T7_ORE':'T7 Maden','T8_ORE':'T8 Maden',
    'T4_FIBER':'T4 Fiber','T5_FIBER':'T5 Fiber','T6_FIBER':'T6 Fiber','T7_FIBER':'T7 Fiber','T8_FIBER':'T8 Fiber',
    'T4_HIDE':'T4 Deri Ham','T5_HIDE':'T5 Deri Ham','T6_HIDE':'T6 Deri Ham','T7_HIDE':'T7 Deri Ham','T8_HIDE':'T8 Deri Ham',
    'T4_ROCK':'T4 Taş','T5_ROCK':'T5 Taş','T6_ROCK':'T6 Taş','T7_ROCK':'T7 Taş','T8_ROCK':'T8 Taş',
    'T4_PLANKS':'T4 Tahta','T5_PLANKS':'T5 Tahta','T6_PLANKS':'T6 Tahta','T7_PLANKS':'T7 Tahta','T8_PLANKS':'T8 Tahta',
    'T4_METALBAR':'T4 Metal Külçe','T5_METALBAR':'T5 Metal Külçe','T6_METALBAR':'T6 Metal Külçe','T7_METALBAR':'T7 Metal Külçe','T8_METALBAR':'T8 Metal Külçe',
    'T4_CLOTH':'T4 Kumaş','T5_CLOTH':'T5 Kumaş','T6_CLOTH':'T6 Kumaş','T7_CLOTH':'T7 Kumaş','T8_CLOTH':'T8 Kumaş',
    'T4_LEATHER':'T4 Deri İşlenmiş','T5_LEATHER':'T5 Deri İşlenmiş','T6_LEATHER':'T6 Deri İşlenmiş','T7_LEATHER':'T7 Deri İşlenmiş','T8_LEATHER':'T8 Deri İşlenmiş',
    'T4_STONEBLOCK':'T4 Taş Blok','T5_STONEBLOCK':'T5 Taş Blok','T6_STONEBLOCK':'T6 Taş Blok','T7_STONEBLOCK':'T7 Taş Blok','T8_STONEBLOCK':'T8 Taş Blok',
    'T4_MEAL_STEW':'T4 Güveç','T5_MEAL_STEW':'T5 Güveç','T6_MEAL_STEW':'T6 Güveç','T7_MEAL_STEW':'T7 Güveç',
    'T4_MEAL_SOUP':'T4 Çorba','T5_MEAL_SOUP':'T5 Çorba','T6_MEAL_SOUP':'T6 Çorba',
    'T4_MEAL_SALAD':'T4 Salata','T5_MEAL_SALAD':'T5 Salata','T6_MEAL_SALAD':'T6 Salata',
    'T4_MEAL_OMELETTE':'T4 Omlet','T5_MEAL_OMELETTE':'T5 Omlet','T6_MEAL_OMELETTE':'T6 Omlet',
    'T5_MEAL_ROAST':'T5 Kızartma','T6_MEAL_ROAST':'T6 Kızartma','T7_MEAL_ROAST':'T7 Kızartma',
    'T4_POTION_HEALING':'T4 İyileştirme İksiri','T5_POTION_HEALING':'T5 İyileştirme İksiri','T6_POTION_HEALING':'T6 İyileştirme İksiri','T7_POTION_HEALING':'T7 İyileştirme İksiri',
    'T4_POTION_ENERGY':'T4 Enerji İksiri','T5_POTION_ENERGY':'T5 Enerji İksiri','T6_POTION_ENERGY':'T6 Enerji İksiri',
    'T4_POTION_GIGANTIFY':'T4 Dev İksiri','T5_POTION_GIGANTIFY':'T5 Dev İksiri','T6_POTION_GIGANTIFY':'T6 Dev İksiri',
    'T4_POTION_RESISTANCE':'T4 Direnç İksiri','T5_POTION_RESISTANCE':'T5 Direnç İksiri','T6_POTION_RESISTANCE':'T6 Direnç İksiri',
    'T3_MOUNT_HORSE':'T3 At','T4_MOUNT_HORSE':'T4 At','T5_MOUNT_HORSE':'T5 At','T6_MOUNT_HORSE':'T6 At','T7_MOUNT_HORSE':'T7 At','T8_MOUNT_HORSE':'T8 At',
    'T5_MOUNT_SWAMPDRAGON':'T5 Bataklık Ejderi','T6_MOUNT_SWAMPDRAGON':'T6 Bataklık Ejderi','T7_MOUNT_SWAMPDRAGON':'T7 Bataklık Ejderi',
    'T4_MOUNT_OX':'T4 Öküz','T5_MOUNT_OX':'T5 Öküz','T6_MOUNT_OX':'T6 Öküz','T7_MOUNT_OX':'T7 Öküz','T8_MOUNT_OX':'T8 Öküz',
    'T5_MOUNT_DIREWOLF':'T5 Kurt Bineği','T6_MOUNT_DIREWOLF':'T6 Kurt Bineği','T7_MOUNT_DIREWOLF':'T7 Kurt Bineği',
    'T6_MOUNT_MAMMOTH_BATTLE':'T6 Savaş Mamutu','T7_MOUNT_MAMMOTH_BATTLE':'T7 Savaş Mamutu','T8_MOUNT_MAMMOTH_BATTLE':'T8 Savaş Mamutu',
  }
};

const QUALITY_NAMES = { tr:{1:'Normal',2:'İyi',3:'Üstün',4:'Mükemmel',5:'Şaheser'}, en:{1:'Normal',2:'Good',3:'Outstanding',4:'Excellent',5:'Masterpiece'} };

let currentServer = 'europe';
let currentCategory = 'bags';
let currentData = [];
let searchTimeout = null;

// ─── BAŞLANGIÇ ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadGoldPrice();
  loadCategory('bags');
});

// ─── SUNUCU ────────────────────────────────────────────────────
function setServer(s) {
  currentServer = s;
  document.querySelectorAll('.server-tab').forEach(t => t.classList.toggle('active', t.dataset.server === s));
  document.getElementById('goldServer').textContent = {europe:'EU',west:'US',east:'Asia'}[s];
  loadGoldPrice();
  loadCategory(currentCategory);
}

function toggleCompare() {
  document.getElementById('compareBtn').classList.toggle('active');
  loadCategory(currentCategory);
}

// ─── GOLD ──────────────────────────────────────────────────────
async function loadGoldPrice() {
  try {
    const res = await fetch(`${SERVERS[currentServer]}/api/v2/stats/gold.json?count=1`);
    const data = await res.json();
    if (data?.[0]) {
      document.getElementById('goldValue').textContent = data[0].price.toLocaleString('tr-TR') + ' Silver';
      document.getElementById('goldUpdated').textContent = formatTimeAgo(new Date(data[0].timestamp));
    }
  } catch { document.getElementById('goldValue').textContent = '—'; }
}

// ─── KATEGORİ YÜKLE ────────────────────────────────────────────
async function loadCategory(cat) {
  currentCategory = cat;
  const items = CATEGORIES[cat] || CATEGORIES.bags;
  const cityFilter = document.getElementById('cityFilter').value;
  const cities = cityFilter || ALL_CITIES.join(',');
  showLoading();
  try {
    const url = `${SERVERS[currentServer]}/api/v2/stats/prices/${items.join(',')}.json?locations=${encodeURIComponent(cities)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('API ' + res.status);
    const data = await res.json();
    currentData = data;
    renderTable(data);
    updateStats(data);
  } catch(e) {
    console.error(e);
    showError();
  }
}

// ─── TABLO RENDER ──────────────────────────────────────────────
function renderTable(data) {
  const lang = localStorage.getItem('aot-lang') || 'tr';
  const tbody = document.getElementById('priceTableBody');
  const tierFilter = document.getElementById('tierFilter').value;

  let filtered = data.filter(d => d.sell_price_min > 0 || d.buy_price_max > 0);
  if (tierFilter) filtered = filtered.filter(d => d.item_id.startsWith(tierFilter + '_'));

  const sellPrices = filtered.map(d => d.sell_price_min).filter(p => p > 0);
  const minSell = Math.min(...sellPrices);
  const maxSell = Math.max(...sellPrices);

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:40px;color:var(--text-muted)">${lang==='tr'?'Fiyat verisi bulunamadı.':'No price data found.'}</td></tr>`;
    document.getElementById('itemsCount').textContent = '0 kayıt';
    showTable(); return;
  }

  tbody.innerHTML = filtered.map(d => {
    const tier = d.item_id.match(/^T(\d)/)?.[1] || '?';
    const name = ITEM_NAMES.tr[d.item_id] || d.item_id.replace(/_/g,' ');
    const cityKey = d.city || '';
    const cityClass = CITY_CLASS[cityKey] || 'city-other';
    const cityName = CITY_DISPLAY[cityKey] || cityKey || '—';
    const rowClass = d.sell_price_min === minSell && d.sell_price_min > 0 ? 'best-sell' : (d.sell_price_min === maxSell ? 'worst-sell' : '');
    const qName = QUALITY_NAMES[lang][d.quality || 1] || 'Normal';
    const dateClass = getDateClass(d.sell_price_min_date);
    const dateStr = d.sell_price_min_date ? formatTimeAgo(new Date(d.sell_price_min_date)) : '—';
    const iconUrl = getIconUrl(d.item_id, d.quality || 1);

    return `<tr class="${rowClass}">
      <td>
        <div class="item-name">
          <img src="${iconUrl}" alt="${name}" class="item-icon" onerror="this.style.display='none'"/>
          <div class="item-name-text">
            <span class="item-tier">T${tier}</span>
            <span class="item-label">${name}</span>
          </div>
        </div>
      </td>
      <td><span class="city-badge ${cityClass}">${cityName}</span></td>
      <td class="${d.sell_price_min > 0 ? 'price-sell' : 'price-zero'}">${d.sell_price_min > 0 ? d.sell_price_min.toLocaleString('tr-TR') : '—'}</td>
      <td class="${d.buy_price_max > 0 ? 'price-buy' : 'price-zero'}">${d.buy_price_max > 0 ? d.buy_price_max.toLocaleString('tr-TR') : '—'}</td>
      <td><span class="quality-badge q${d.quality||1}">${qName}</span></td>
      <td class="date-cell ${dateClass}">${dateStr}</td>
    </tr>`;
  }).join('');

  document.getElementById('itemsCount').textContent = `${filtered.length} ${lang==='tr'?'kayıt':'records'}`;
  showTable();
}

// ─── İSTATİSTİKLER ─────────────────────────────────────────────
function updateStats(data) {
  const valid = data.filter(d => d.sell_price_min > 0);
  if (!valid.length) return;
  const sorted = [...valid].sort((a,b) => a.sell_price_min - b.sell_price_min);
  const cheapest = sorted[0], expensive = sorted[sorted.length-1];
  const profit = expensive.sell_price_min - cheapest.sell_price_min;
  const pct = cheapest.sell_price_min > 0 ? ((profit/cheapest.sell_price_min)*100).toFixed(0) : 0;
  document.getElementById('cheapestVal').textContent = cheapest.sell_price_min.toLocaleString('tr-TR');
  document.getElementById('cheapestCity').textContent = CITY_DISPLAY[cheapest.city] || cheapest.city || '—';
  document.getElementById('expensiveVal').textContent = expensive.sell_price_min.toLocaleString('tr-TR');
  document.getElementById('expensiveCity').textContent = CITY_DISPLAY[expensive.city] || expensive.city || '—';
  document.getElementById('profitVal').textContent = `${profit.toLocaleString('tr-TR')} (%${pct})`;
  const dates = valid.map(d=>d.sell_price_min_date).filter(Boolean).map(d=>new Date(d));
  if (dates.length) document.getElementById('lastUpdated').textContent = formatTimeAgo(new Date(Math.max(...dates)));
}

// ─── ARAMA ─────────────────────────────────────────────────────
function onSearchInput(val) {
  document.getElementById('clearBtn').style.display = val ? 'block' : 'none';
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    if (val.length < 2) { renderTable(currentData); return; }
    const q = val.toLowerCase();
    const f = currentData.filter(d =>
      (ITEM_NAMES.tr[d.item_id]||'').toLowerCase().includes(q) ||
      d.item_id.toLowerCase().includes(q)
    );
    renderTable(f);
  }, 300);
}

function clearSearch() {
  document.getElementById('itemSearch').value = '';
  document.getElementById('clearBtn').style.display = 'none';
  renderTable(currentData);
}

function applyFilters() { renderTable(currentData); }

function refreshPrices() {
  const btn = document.getElementById('refreshBtn');
  btn.classList.add('loading');
  loadCategory(currentCategory).finally(() => setTimeout(()=>btn.classList.remove('loading'),500));
}

// ─── TRANSPORT ─────────────────────────────────────────────────
function calcTransport() {
  const buyCity = document.getElementById('buyCity').value;
  const sellCity = document.getElementById('sellCity').value;
  const qty = parseInt(document.getElementById('quantity').value)||1;
  const lang = localStorage.getItem('aot-lang')||'tr';
  const el = document.getElementById('transportResult');
  if (buyCity === sellCity) {
    el.innerHTML = `<span style="color:var(--red)">${lang==='tr'?'Aynı şehir seçilemez!':'Cannot select the same city!'}</span>`;
    return;
  }
  const buyData  = currentData.filter(d => (d.city===buyCity||d.city===buyCity.replace(' ','')) && d.sell_price_min>0);
  const sellData = currentData.filter(d => (d.city===sellCity||d.city===sellCity.replace(' ','')) && d.sell_price_min>0);
  if (!buyData.length||!sellData.length) {
    el.innerHTML = `<span>${lang==='tr'?'Yeterli veri yok. Farklı kategori deneyin.':'Not enough data. Try a different category.'}</span>`;
    return;
  }
  let totalProfit=0, count=0;
  buyData.forEach(b => {
    const s = sellData.find(d=>d.item_id===b.item_id&&d.quality===b.quality);
    if (s&&s.sell_price_min>b.sell_price_min) { totalProfit+=(s.sell_price_min-b.sell_price_min)*qty; count++; }
  });
  const avg = count>0?Math.round(totalProfit/count):0;
  const pct = count>0&&buyData[0]?((avg/buyData[0].sell_price_min)*100).toFixed(0):0;
  if (avg>0) {
    el.className='transport-result profit';
    el.innerHTML=`<div style="font-size:11px;color:var(--text-muted);margin-bottom:4px">${CITY_DISPLAY[buyCity]||buyCity} → ${CITY_DISPLAY[sellCity]||sellCity}</div><div class="profit-amount">+${avg.toLocaleString('tr-TR')} Silver</div><div class="profit-pct">≈ %${pct} ort. kâr · ${count} eşya</div>`;
  } else {
    el.className='transport-result';
    el.innerHTML=`<span style="color:var(--text-muted)">${lang==='tr'?'Bu güzergahta karlı transport yok.':'No profitable transport on this route.'}</span>`;
  }
}

// ─── YARDIMCILAR ───────────────────────────────────────────────
function formatTimeAgo(date) {
  const d = Math.floor((new Date()-date)/60000);
  if (d<1) return 'Az önce';
  if (d<60) return `${d}dk`;
  if (d<1440) return `${Math.floor(d/60)}sa`;
  return `${Math.floor(d/1440)}g`;
}

function getDateClass(ds) {
  if (!ds) return 'date-stale';
  const d = (new Date()-new Date(ds))/60000;
  return d<60?'date-fresh':d<1440?'date-old':'date-stale';
}

function showLoading() {
  document.getElementById('loadingWrap').style.display='flex';
  document.getElementById('errorWrap').style.display='none';
  document.getElementById('priceTableWrap').style.display='none';
}
function showError() {
  document.getElementById('loadingWrap').style.display='none';
  document.getElementById('errorWrap').style.display='flex';
  document.getElementById('priceTableWrap').style.display='none';
}
function showTable() {
  document.getElementById('loadingWrap').style.display='none';
  document.getElementById('errorWrap').style.display='none';
  document.getElementById('priceTableWrap').style.display='block';
}
