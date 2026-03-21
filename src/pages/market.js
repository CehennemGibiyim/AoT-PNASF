// AoT-PNASF — Market Module
// AODP API: west/europe/east.albion-online-data.com

const SERVERS = {
  europe: 'https://europe.albion-online-data.com',
  west:   'https://west.albion-online-data.com',
  east:   'https://east.albion-online-data.com'
};

const CITIES = ['Caerleon','Bridgewatch','Lymhurst','Martlock','Thetford','FortSterling','Brecilien'];

const CATEGORIES = {
  bags:      ['T2_BAG','T3_BAG','T4_BAG','T5_BAG','T6_BAG','T7_BAG','T8_BAG'],
  swords:    ['T4_MAIN_SWORD','T5_MAIN_SWORD','T6_MAIN_SWORD','T7_MAIN_SWORD','T8_MAIN_SWORD','T4_2H_CLAYMORE','T5_2H_CLAYMORE','T6_2H_CLAYMORE'],
  bows:      ['T4_2H_BOW','T5_2H_BOW','T6_2H_BOW','T7_2H_BOW','T8_2H_BOW','T4_2H_CROSSBOW','T5_2H_CROSSBOW','T6_2H_CROSSBOW'],
  armor:     ['T4_ARMOR_LEATHER_SET1','T5_ARMOR_LEATHER_SET1','T6_ARMOR_LEATHER_SET1','T4_ARMOR_PLATE_SET1','T5_ARMOR_PLATE_SET1','T6_ARMOR_PLATE_SET1'],
  resources: ['T4_WOOD','T5_WOOD','T6_WOOD','T7_WOOD','T8_WOOD','T4_ORE','T5_ORE','T6_ORE','T7_ORE','T8_ORE','T4_FIBER','T5_FIBER','T6_FIBER','T4_HIDE','T5_HIDE','T6_HIDE','T4_ROCK','T5_ROCK','T6_ROCK'],
  food:      ['T4_MEAL_STEW','T5_MEAL_STEW','T6_MEAL_STEW','T7_MEAL_STEW','T4_MEAL_SOUP','T5_MEAL_SOUP','T6_MEAL_SOUP'],
  mounts:    ['T3_MOUNT_HORSE','T4_MOUNT_HORSE','T5_MOUNT_HORSE','T6_MOUNT_HORSE','T7_MOUNT_HORSE','T8_MOUNT_HORSE','T5_MOUNT_SWAMPDRAGON','T6_MOUNT_SWAMPDRAGON']
};

const QUALITY_NAMES = { 1:'Normal', 2:'İyi', 3:'Üstün', 4:'Mükemmel', 5:'Şaheser' };
const QUALITY_NAMES_EN = { 1:'Normal', 2:'Good', 3:'Outstanding', 4:'Excellent', 5:'Masterpiece' };

const CITY_DISPLAY = {
  'Caerleon':'Caerleon','Bridgewatch':'Bridgewatch','Lymhurst':'Lymhurst',
  'Martlock':'Martlock','Thetford':'Thetford','FortSterling':'Fort Sterling',
  'Brecilien':'Brecilien','Black Market':'Black Market'
};

let currentServer = 'europe';
let currentCategory = 'bags';
let currentData = [];
let compareMode = false;
let searchTimeout = null;

// ─── BAŞLANGIÇ ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadGoldPrice();
  loadCategory('bags');
});

// ─── SUNUCU ───────────────────────────────────────────────────
function setServer(server) {
  currentServer = server;
  document.querySelectorAll('.server-tab').forEach(t => t.classList.toggle('active', t.dataset.server === server));
  const labels = { europe:'EU', west:'US', east:'Asia' };
  document.getElementById('goldServer').textContent = labels[server];
  loadGoldPrice();
  loadCategory(currentCategory);
}

// ─── KARŞILAŞTIRMA ────────────────────────────────────────────
function toggleCompare() {
  compareMode = !compareMode;
  document.getElementById('compareBtn').classList.toggle('active', compareMode);
  loadCategory(currentCategory);
}

// ─── GOLD FİYATI ──────────────────────────────────────────────
async function loadGoldPrice() {
  try {
    const url = `${SERVERS[currentServer]}/api/v2/stats/gold.json?count=1`;
    const res = await fetch(url);
    const data = await res.json();
    if (data && data[0]) {
      const price = data[0].price.toLocaleString('tr-TR');
      document.getElementById('goldValue').textContent = `${price} Silver`;
      const d = new Date(data[0].timestamp);
      document.getElementById('goldUpdated').textContent = formatTimeAgo(d);
    }
  } catch(e) {
    document.getElementById('goldValue').textContent = '—';
  }
}

// ─── KATEGORİ YÜKLE ───────────────────────────────────────────
async function loadCategory(cat) {
  currentCategory = cat;
  const items = CATEGORIES[cat] || CATEGORIES.bags;
  const cityParam = document.getElementById('cityFilter').value || CITIES.join(',');
  const cities = document.getElementById('cityFilter').value || CITIES.join(',');

  showLoading();

  try {
    let url;
    if (compareMode) {
      url = `${SERVERS[currentServer]}/api/v2/stats/prices/${items.join(',')}.json?locations=${cities}`;
    } else {
      url = `${SERVERS[currentServer]}/api/v2/stats/prices/${items.join(',')}.json?locations=${cities}`;
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error('API hatası');
    const data = await res.json();
    currentData = data;
    renderTable(data);
    updateStats(data);
  } catch(e) {
    showError();
  }
}

// ─── TABLO RENDER ─────────────────────────────────────────────
function renderTable(data) {
  const lang = localStorage.getItem('aot-lang') || 'tr';
  const tbody = document.getElementById('priceTableBody');
  const tierFilter = document.getElementById('tierFilter').value;

  // Filtrele
  let filtered = data.filter(d => d.sell_price_min > 0 || d.buy_price_max > 0);
  if (tierFilter) filtered = filtered.filter(d => d.item_id.startsWith(tierFilter));

  // En ucuz satış fiyatını bul (highlight için)
  const sellPrices = filtered.map(d => d.sell_price_min).filter(p => p > 0);
  const minSell = Math.min(...sellPrices);
  const maxSell = Math.max(...sellPrices);

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:40px;color:var(--text-muted)">${lang==='tr'?'Bu filtre için fiyat verisi bulunamadı.':'No price data found for this filter.'}</td></tr>`;
    showTable();
    document.getElementById('itemsCount').textContent = '0 kayıt';
    return;
  }

  tbody.innerHTML = filtered.map(d => {
    const tier = d.item_id.match(/T(\d)/)?.[1] || '?';
    const name = formatItemName(d.item_id, lang);
    const cityClass = 'city-' + (d.city || '').toLowerCase().replace(' ','');
    const cityName = CITY_DISPLAY[d.city] || d.city || '—';
    const sellClass = d.sell_price_min === minSell ? 'best-sell' : (d.sell_price_min === maxSell ? 'worst-sell' : '');
    const qName = lang === 'tr' ? (QUALITY_NAMES[d.quality] || 'Normal') : (QUALITY_NAMES_EN[d.quality] || 'Normal');
    const dateClass = getDateClass(d.sell_price_min_date);
    const dateStr = d.sell_price_min_date ? formatTimeAgo(new Date(d.sell_price_min_date)) : '—';

    return `<tr class="${sellClass}">
      <td><div class="item-name"><span class="item-tier">T${tier}</span> ${name}</div></td>
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

// ─── İSTATİSTİKLER ────────────────────────────────────────────
function updateStats(data) {
  const valid = data.filter(d => d.sell_price_min > 0);
  if (valid.length === 0) return;

  const sorted = [...valid].sort((a,b) => a.sell_price_min - b.sell_price_min);
  const cheapest = sorted[0];
  const expensive = sorted[sorted.length-1];
  const profit = expensive.sell_price_min - cheapest.sell_price_min;
  const profitPct = ((profit / cheapest.sell_price_min) * 100).toFixed(0);

  document.getElementById('cheapestVal').textContent = cheapest.sell_price_min.toLocaleString('tr-TR');
  document.getElementById('cheapestCity').textContent = CITY_DISPLAY[cheapest.city] || cheapest.city || '—';
  document.getElementById('expensiveVal').textContent = expensive.sell_price_min.toLocaleString('tr-TR');
  document.getElementById('expensiveCity').textContent = CITY_DISPLAY[expensive.city] || expensive.city || '—';
  document.getElementById('profitVal').textContent = `${profit.toLocaleString('tr-TR')} (${profitPct}%)`;

  // Son güncelleme
  const dates = valid.map(d => d.sell_price_min_date).filter(Boolean).map(d => new Date(d));
  if (dates.length > 0) {
    const latest = new Date(Math.max(...dates));
    document.getElementById('lastUpdated').textContent = formatTimeAgo(latest);
  }
}

// ─── ARAMA ────────────────────────────────────────────────────
function onSearchInput(val) {
  document.getElementById('clearBtn').style.display = val ? 'block' : 'none';
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    if (val.length < 2) { renderTable(currentData); return; }
    const filtered = currentData.filter(d => formatItemName(d.item_id,'tr').toLowerCase().includes(val.toLowerCase()) || d.item_id.toLowerCase().includes(val.toLowerCase()));
    renderTable(filtered);
  }, 300);
}

function clearSearch() {
  document.getElementById('itemSearch').value = '';
  document.getElementById('clearBtn').style.display = 'none';
  renderTable(currentData);
}

function applyFilters() {
  renderTable(currentData);
}

// ─── YENİLE ───────────────────────────────────────────────────
function refreshPrices() {
  const btn = document.getElementById('refreshBtn');
  btn.classList.add('loading');
  loadCategory(currentCategory).finally(() => {
    setTimeout(() => btn.classList.remove('loading'), 500);
  });
}

// ─── TRANSPORT HESABI ─────────────────────────────────────────
function calcTransport() {
  const buyCity  = document.getElementById('buyCity').value;
  const sellCity = document.getElementById('sellCity').value;
  const qty = parseInt(document.getElementById('quantity').value) || 1;
  const lang = localStorage.getItem('aot-lang') || 'tr';

  if (buyCity === sellCity) {
    document.getElementById('transportResult').innerHTML = `<span style="color:var(--red)">${lang==='tr'?'Alış ve satış şehri aynı olamaz!':'Buy and sell city cannot be the same!'}</span>`;
    return;
  }

  const buyData  = currentData.filter(d => d.city === buyCity  && d.sell_price_min > 0);
  const sellData = currentData.filter(d => d.city === sellCity && d.sell_price_min > 0);

  if (buyData.length === 0 || sellData.length === 0) {
    document.getElementById('transportResult').innerHTML = `<span>${lang==='tr'?'Bu şehirler için yeterli veri yok. Farklı bir kategori seçin.':'Not enough data for these cities. Try a different category.'}</span>`;
    return;
  }

  let totalProfit = 0;
  let count = 0;
  buyData.forEach(b => {
    const s = sellData.find(d => d.item_id === b.item_id && d.quality === b.quality);
    if (s && s.sell_price_min > b.sell_price_min) {
      totalProfit += (s.sell_price_min - b.sell_price_min) * qty;
      count++;
    }
  });

  const avgProfit = count > 0 ? Math.round(totalProfit / count) : 0;
  const pct = count > 0 && buyData[0] ? ((avgProfit / buyData[0].sell_price_min) * 100).toFixed(0) : 0;

  const el = document.getElementById('transportResult');
  if (avgProfit > 0) {
    el.className = 'transport-result profit';
    el.innerHTML = `
      <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px">${CITY_DISPLAY[buyCity]} → ${CITY_DISPLAY[sellCity]}</div>
      <div class="profit-amount">+${avgProfit.toLocaleString('tr-TR')} Silver</div>
      <div class="profit-pct">≈ %${pct} ${lang==='tr'?'ortalama kâr':'avg profit'} · ${count} ${lang==='tr'?'eşya':'items'}</div>`;
  } else {
    el.className = 'transport-result';
    el.innerHTML = `<span style="color:var(--text-muted)">${lang==='tr'?'Bu güzergahta karlı transport bulunamadı.':'No profitable transport found on this route.'}</span>`;
  }
}

// ─── YARDIMCI FONKSİYONLAR ───────────────────────────────────
function formatItemName(id, lang) {
  const names = {
    'T2_BAG':'T2 Çanta','T3_BAG':'T3 Çanta','T4_BAG':'T4 Çanta','T5_BAG':'T5 Çanta',
    'T6_BAG':'T6 Çanta','T7_BAG':'T7 Çanta','T8_BAG':'T8 Çanta',
    'T4_MAIN_SWORD':'T4 Kılıç','T5_MAIN_SWORD':'T5 Kılıç','T6_MAIN_SWORD':'T6 Kılıç',
    'T7_MAIN_SWORD':'T7 Kılıç','T8_MAIN_SWORD':'T8 Kılıç',
    'T4_2H_CLAYMORE':'T4 Claymore','T5_2H_CLAYMORE':'T5 Claymore','T6_2H_CLAYMORE':'T6 Claymore',
    'T4_2H_BOW':'T4 Yay','T5_2H_BOW':'T5 Yay','T6_2H_BOW':'T6 Yay','T7_2H_BOW':'T7 Yay','T8_2H_BOW':'T8 Yay',
    'T4_2H_CROSSBOW':'T4 Arbalet','T5_2H_CROSSBOW':'T5 Arbalet','T6_2H_CROSSBOW':'T6 Arbalet',
    'T4_ARMOR_LEATHER_SET1':'T4 Deri Zırh','T5_ARMOR_LEATHER_SET1':'T5 Deri Zırh','T6_ARMOR_LEATHER_SET1':'T6 Deri Zırh',
    'T4_ARMOR_PLATE_SET1':'T4 Plaka Zırh','T5_ARMOR_PLATE_SET1':'T5 Plaka Zırh','T6_ARMOR_PLATE_SET1':'T6 Plaka Zırh',
    'T4_WOOD':'T4 Odun','T5_WOOD':'T5 Odun','T6_WOOD':'T6 Odun','T7_WOOD':'T7 Odun','T8_WOOD':'T8 Odun',
    'T4_ORE':'T4 Maden','T5_ORE':'T5 Maden','T6_ORE':'T6 Maden','T7_ORE':'T7 Maden','T8_ORE':'T8 Maden',
    'T4_FIBER':'T4 Fiber','T5_FIBER':'T5 Fiber','T6_FIBER':'T6 Fiber',
    'T4_HIDE':'T4 Deri','T5_HIDE':'T5 Deri','T6_HIDE':'T6 Deri',
    'T4_ROCK':'T4 Taş','T5_ROCK':'T5 Taş','T6_ROCK':'T6 Taş',
    'T4_MEAL_STEW':'T4 Güveç','T5_MEAL_STEW':'T5 Güveç','T6_MEAL_STEW':'T6 Güveç','T7_MEAL_STEW':'T7 Güveç',
    'T4_MEAL_SOUP':'T4 Çorba','T5_MEAL_SOUP':'T5 Çorba','T6_MEAL_SOUP':'T6 Çorba',
    'T3_MOUNT_HORSE':'T3 At','T4_MOUNT_HORSE':'T4 At','T5_MOUNT_HORSE':'T5 At',
    'T6_MOUNT_HORSE':'T6 At','T7_MOUNT_HORSE':'T7 At','T8_MOUNT_HORSE':'T8 At',
    'T5_MOUNT_SWAMPDRAGON':'T5 Bataklık Ejderi','T6_MOUNT_SWAMPDRAGON':'T6 Bataklık Ejderi',
  };
  if (lang === 'en') {
    return id.replace(/_/g,' ').replace(/T(\d)/,'T$1').toLowerCase().replace(/\b\w/g,c=>c.toUpperCase());
  }
  return names[id] || id.replace(/_/g,' ');
}

function formatTimeAgo(date) {
  const now = new Date();
  const diff = Math.floor((now - date) / 60000);
  if (diff < 1)  return 'Az önce';
  if (diff < 60) return `${diff}dk önce`;
  if (diff < 1440) return `${Math.floor(diff/60)}sa önce`;
  return `${Math.floor(diff/1440)}g önce`;
}

function getDateClass(dateStr) {
  if (!dateStr) return 'date-stale';
  const diff = (new Date() - new Date(dateStr)) / 60000;
  if (diff < 60)   return 'date-fresh';
  if (diff < 1440) return 'date-old';
  return 'date-stale';
}

function showLoading() {
  document.getElementById('loadingWrap').style.display = 'flex';
  document.getElementById('errorWrap').style.display = 'none';
  document.getElementById('priceTableWrap').style.display = 'none';
}

function showError() {
  document.getElementById('loadingWrap').style.display = 'none';
  document.getElementById('errorWrap').style.display = 'flex';
  document.getElementById('priceTableWrap').style.display = 'none';
}

function showTable() {
  document.getElementById('loadingWrap').style.display = 'none';
  document.getElementById('errorWrap').style.display = 'none';
  document.getElementById('priceTableWrap').style.display = 'block';
}
