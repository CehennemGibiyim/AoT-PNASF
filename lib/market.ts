// AoT-PNASF — Market v4
// 11 lokasyon · 6 modül · Chart.js grafik · Flip & Arbitraj · Kalite & Enchant

let marketFetch = (url, options?) => window.AOTMarketNetwork.request(url, options);

// ─── SABITLER ────────────────────────────────────────────
let SERVERS = {
  europe: 'https://europe.albion-online-data.com',
  west:   'https://west.albion-online-data.com',
  east:   'https://east.albion-online-data.com',
};

// Tüm 11 lokasyon
let ALL_LOCS = 'Caerleon,Bridgewatch,Lymhurst,Martlock,Thetford,Fort Sterling,Brecilien,Arthurs Rest,Merlins Rest,Morganas Rest,Black Market';
let CITY_DISPLAY = {
  'Caerleon':'Caerleon','Bridgewatch':'Bridgewatch','Lymhurst':'Lymhurst',
  'Martlock':'Martlock','Thetford':'Thetford','Fort Sterling':'Fort Sterling',
  'FortSterling':'Fort Sterling','Brecilien':'Brecilien','Black Market':'Black Market',
  'Arthurs Rest':"Arthur's Rest",'Merlins Rest':"Merlyn's Rest",'Morganas Rest':"Morgana's Rest",
};
let CITY_TYPE = {
  'Caerleon':'royal','Bridgewatch':'royal','Lymhurst':'royal','Martlock':'royal',
  'Thetford':'royal','Fort Sterling':'royal','FortSterling':'royal',
  'Brecilien':'mist','Black Market':'bm',
  'Arthurs Rest':'outlands','Merlins Rest':'outlands','Morganas Rest':'outlands',
};

// ─── KATEGORİ VERİTABANI ─────────────────────────────────
let CATEGORIES = {
  bags:         ['T2_BAG','T3_BAG','T4_BAG','T5_BAG','T6_BAG','T7_BAG','T8_BAG'],
  swords:       ['T4_MAIN_SWORD','T5_MAIN_SWORD','T6_MAIN_SWORD','T7_MAIN_SWORD','T8_MAIN_SWORD','T4_2H_CLAYMORE','T5_2H_CLAYMORE','T6_2H_CLAYMORE','T7_2H_CLAYMORE','T8_2H_CLAYMORE','T4_2H_DUALSWORD','T5_2H_DUALSWORD','T6_2H_DUALSWORD','T7_2H_DUALSWORD','T8_2H_DUALSWORD'],
  bows:         ['T4_2H_BOW','T5_2H_BOW','T6_2H_BOW','T7_2H_BOW','T8_2H_BOW','T4_2H_LONGBOW','T5_2H_LONGBOW','T6_2H_LONGBOW','T7_2H_LONGBOW','T8_2H_LONGBOW','T4_2H_CROSSBOW','T5_2H_CROSSBOW','T6_2H_CROSSBOW','T7_2H_CROSSBOW','T8_2H_CROSSBOW','T4_2H_BOW_HELL','T5_2H_BOW_HELL','T6_2H_BOW_HELL','T4_2H_BOW_MORGANA','T5_2H_BOW_MORGANA','T6_2H_BOW_MORGANA'],
  axes:         ['T4_MAIN_AXE','T5_MAIN_AXE','T6_MAIN_AXE','T7_MAIN_AXE','T8_MAIN_AXE','T4_2H_AXE','T5_2H_AXE','T6_2H_AXE','T7_2H_AXE','T8_2H_AXE','T4_2H_HALBERD','T5_2H_HALBERD','T6_2H_HALBERD','T7_2H_HALBERD','T8_2H_HALBERD'],
  staves:       ['T4_MAIN_FIRE','T5_MAIN_FIRE','T6_MAIN_FIRE','T7_MAIN_FIRE','T8_MAIN_FIRE','T4_MAIN_FROST','T5_MAIN_FROST','T6_MAIN_FROST','T7_MAIN_FROST','T8_MAIN_FROST','T4_MAIN_HOLY','T5_MAIN_HOLY','T6_MAIN_HOLY','T7_MAIN_HOLY','T8_MAIN_HOLY','T4_MAIN_NATURE','T5_MAIN_NATURE','T6_MAIN_NATURE','T4_MAIN_ARCANE','T5_MAIN_ARCANE','T6_MAIN_ARCANE','T4_2H_INFERNOSTAFF','T5_2H_INFERNOSTAFF','T6_2H_INFERNOSTAFF','T4_2H_CURSEDSTAFF','T5_2H_CURSEDSTAFF','T6_2H_CURSEDSTAFF'],
  hammers:      ['T4_MAIN_HAMMER','T5_MAIN_HAMMER','T6_MAIN_HAMMER','T7_MAIN_HAMMER','T8_MAIN_HAMMER','T4_2H_POLEHAMMER','T5_2H_POLEHAMMER','T6_2H_POLEHAMMER','T7_2H_POLEHAMMER','T8_2H_POLEHAMMER'],
  spears:       ['T4_MAIN_SPEAR','T5_MAIN_SPEAR','T6_MAIN_SPEAR','T7_MAIN_SPEAR','T8_MAIN_SPEAR','T4_2H_SPEAR','T5_2H_SPEAR','T6_2H_SPEAR','T7_2H_SPEAR','T8_2H_SPEAR','T4_2H_GLAIVE','T5_2H_GLAIVE','T6_2H_GLAIVE'],
  armor_leather:['T4_HEAD_LEATHER_SET1','T5_HEAD_LEATHER_SET1','T6_HEAD_LEATHER_SET1','T7_HEAD_LEATHER_SET1','T8_HEAD_LEATHER_SET1','T4_ARMOR_LEATHER_SET1','T5_ARMOR_LEATHER_SET1','T6_ARMOR_LEATHER_SET1','T7_ARMOR_LEATHER_SET1','T8_ARMOR_LEATHER_SET1','T4_SHOES_LEATHER_SET1','T5_SHOES_LEATHER_SET1','T6_SHOES_LEATHER_SET1','T7_SHOES_LEATHER_SET1','T8_SHOES_LEATHER_SET1'],
  armor_plate:  ['T4_HEAD_PLATE_SET1','T5_HEAD_PLATE_SET1','T6_HEAD_PLATE_SET1','T7_HEAD_PLATE_SET1','T8_HEAD_PLATE_SET1','T4_ARMOR_PLATE_SET1','T5_ARMOR_PLATE_SET1','T6_ARMOR_PLATE_SET1','T7_ARMOR_PLATE_SET1','T8_ARMOR_PLATE_SET1','T4_SHOES_PLATE_SET1','T5_SHOES_PLATE_SET1','T6_SHOES_PLATE_SET1','T7_SHOES_PLATE_SET1','T8_SHOES_PLATE_SET1'],
  armor_cloth:  ['T4_HEAD_CLOTH_SET1','T5_HEAD_CLOTH_SET1','T6_HEAD_CLOTH_SET1','T7_HEAD_CLOTH_SET1','T8_HEAD_CLOTH_SET1','T4_ARMOR_CLOTH_SET1','T5_ARMOR_CLOTH_SET1','T6_ARMOR_CLOTH_SET1','T7_ARMOR_CLOTH_SET1','T8_ARMOR_CLOTH_SET1','T4_SHOES_CLOTH_SET1','T5_SHOES_CLOTH_SET1','T6_SHOES_CLOTH_SET1','T7_SHOES_CLOTH_SET1','T8_SHOES_CLOTH_SET1'],
  resources:    ['T4_WOOD','T5_WOOD','T6_WOOD','T7_WOOD','T8_WOOD','T4_ORE','T5_ORE','T6_ORE','T7_ORE','T8_ORE','T4_FIBER','T5_FIBER','T6_FIBER','T7_FIBER','T8_FIBER','T4_HIDE','T5_HIDE','T6_HIDE','T7_HIDE','T8_HIDE','T4_ROCK','T5_ROCK','T6_ROCK','T7_ROCK','T8_ROCK'],
  refined:      ['T4_PLANKS','T5_PLANKS','T6_PLANKS','T7_PLANKS','T8_PLANKS','T4_METALBAR','T5_METALBAR','T6_METALBAR','T7_METALBAR','T8_METALBAR','T4_CLOTH','T5_CLOTH','T6_CLOTH','T7_CLOTH','T8_CLOTH','T4_LEATHER','T5_LEATHER','T6_LEATHER','T7_LEATHER','T8_LEATHER','T4_STONEBLOCK','T5_STONEBLOCK','T6_STONEBLOCK','T7_STONEBLOCK','T8_STONEBLOCK'],
  food:         ['T4_MEAL_STEW','T5_MEAL_STEW','T6_MEAL_STEW','T7_MEAL_STEW','T4_MEAL_SOUP','T5_MEAL_SOUP','T6_MEAL_SOUP','T4_MEAL_SALAD','T5_MEAL_SALAD','T6_MEAL_SALAD','T4_MEAL_OMELETTE','T5_MEAL_OMELETTE','T5_MEAL_ROAST','T6_MEAL_ROAST'],
  potions:      ['T4_POTION_HEALING','T5_POTION_HEALING','T6_POTION_HEALING','T7_POTION_HEALING','T4_POTION_ENERGY','T5_POTION_ENERGY','T6_POTION_ENERGY','T4_POTION_GIGANTIFY','T5_POTION_GIGANTIFY','T4_POTION_RESISTANCE','T5_POTION_RESISTANCE'],
  mounts:       ['T3_MOUNT_HORSE','T4_MOUNT_HORSE','T5_MOUNT_HORSE','T6_MOUNT_HORSE','T7_MOUNT_HORSE','T8_MOUNT_HORSE','T4_MOUNT_OX','T5_MOUNT_OX','T6_MOUNT_OX','T7_MOUNT_OX','T8_MOUNT_OX','T5_MOUNT_SWAMPDRAGON','T6_MOUNT_SWAMPDRAGON','T5_MOUNT_DIREWOLF','T6_MOUNT_DIREWOLF'],
};

let CAT_TITLES = {
  bags:'Çanta Fiyatları',swords:'Kılıç Fiyatları',bows:'Yay Fiyatları',axes:'Balta Fiyatları',
  staves:'Asa Fiyatları',hammers:'Çekiç Fiyatları',spears:'Mızrak Fiyatları',
  armor_leather:'Deri Zırh Fiyatları',armor_plate:'Plaka Zırh Fiyatları',armor_cloth:'Kumaş Zırh Fiyatları',
  resources:'Ham Kaynak Fiyatları',refined:'İşlenmiş Kaynak Fiyatları',food:'Yiyecek Fiyatları',
  potions:'İksir Fiyatları',mounts:'Binek Fiyatları',
};

let QUALITY_NAMES = {tr:['Normal','İyi','Üstün','Mükemmel','Şaheser'],en:['Normal','Good','Outstanding','Excellent','Masterpiece']};

// ─── STATE ────────────────────────────────────────────────
let currentServer = 'europe';
let currentCategory = 'bags';
let currentData = [];
let currentTab = 'prices';
let flipType = 'city';
let topType = 'volume';
let searchTimeout;
let historyItem = null;
let qualityItem = null;
let goldChartInstance = null;
let historyChartInstance = null;

// ─── YARDIMCILAR ─────────────────────────────────────────
let API = () => SERVERS[currentServer] || SERVERS.europe;
let RENDER = 'https://render.albiononline.com/v1/item';
let getLang = () => localStorage.getItem('aot-lang') || 'tr';

function getItemName(id) {
  const baseId = id.replace(/^T\d_/, '').replace(/@\d$/, '');
  const item = (window.AO_ITEMS || []).find(i => i.id === baseId);
  if (!item) return id.replace(/_/g,' ');
  return getLang() === 'tr' ? item.tr : item.en;
}
function getTier(id) { return id.match(/^T(\d)/)?.[1] || '?'; }
function getEnchant(id) { return id.match(/@(\d)$/)?.[1] || '0'; }
function cityBadge(city) {
  const t = CITY_TYPE[city] || 'royal';
  const d = CITY_DISPLAY[city] || city;
  return `<span class="city-badge ${t}">${d}</span>`;
}
function formatAge(dateStr) {
  if (!dateStr || dateStr === '0001-01-01T00:00:00') return '<span class="age-val age-stale">—</span>';
  const mins = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
  const lang = getLang();
  let cls = mins < 60 ? 'age-fresh' : mins < 360 ? 'age-ok' : 'age-stale';
  let txt = mins < 60
    ? `${mins}${lang==='tr'?'dk':'m'}`
    : mins < 1440
      ? `${Math.floor(mins/60)}${lang==='tr'?'sa':'h'}`
      : `${Math.floor(mins/1440)}${lang==='tr'?'g':'d'}`;
  return `<span class="age-val ${cls}">${txt} ${lang==='tr'?'önce':'ago'}</span>`;
}
function fmtNum(n) {
  if (!n || n === 0) return '—';
  if (n >= 1000000) return (n/1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n/1000).toFixed(1) + 'K';
  return n.toLocaleString('tr-TR');
}

// ─── SUNUCU GEÇİŞİ ───────────────────────────────────────
function switchServer(srv, btn) {
  if (srv === 'compare') {
    document.querySelectorAll('.srv-btn').forEach(b => b.classList.toggle('active', b === btn));
    loadCompare();
    return;
  }
  currentServer = srv;
  document.querySelectorAll('.srv-btn').forEach(b => b.classList.toggle('active', b.dataset.server === srv));
  const tag = document.getElementById('goldServerTag');
  if (tag) tag.textContent = srv === 'europe' ? 'EU' : srv === 'west' ? 'US' : 'Asia';
  loadGoldPrice();
  loadCategory(currentCategory);
}

// ─── GOLD FİYATI ─────────────────────────────────────────
async function loadGoldPrice() {
  try {
    const res = await marketFetch(`${API()}/api/v2/stats/gold.json?count=1`);
    const data = await res.json();
    if (data?.length) {
      const gv = document.getElementById('goldVal');
      const gc = document.getElementById('goldChartVal');
      const val = data[0].price.toLocaleString('tr-TR');
      if (gv) gv.textContent = val;
      if (gc) gc.textContent = val;
      const age = document.getElementById('goldAge');
      if (age && data[0].timestamp) {
        const mins = Math.floor((Date.now() - new Date(data[0].timestamp).getTime()) / 60000);
        age.textContent = mins < 60 ? `${mins}dk önce` : `${Math.floor(mins/60)}sa önce`;
      }
    }
  } catch(e) {}
}

// ─── TAB GEÇİŞİ ──────────────────────────────────────────
function switchTab(tab, btn) {
  currentTab = tab;
  document.querySelectorAll('.mkt-panel').forEach(p => p.style.display = 'none');
  document.querySelectorAll('.mkt-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('tab-'+tab).style.display = 'block';
  if (btn) btn.classList.add('active');
  if (tab === 'top')     loadTopTraded();
  if (tab === 'flip')    loadFlips();
  if (tab === 'gold')    loadGoldChart();
}

// ─── ARAMA ───────────────────────────────────────────────
function onSearchInput(val) {
  const dd = document.getElementById('marketSearchDropdown');
  const clearBtn = document.getElementById('clearBtn');
  if (clearBtn) clearBtn.style.display = val ? 'block' : 'none';
  clearTimeout(searchTimeout);
  if (!val || val.length < 1) { if(dd) dd.classList.remove('open'); filterTable(val); return; }
  searchTimeout = setTimeout(() => {
    const results = window.AO_SEARCH ? window.AO_SEARCH(val) : [];
    if (dd && results.length) {
      const lang = getLang();
      dd.innerHTML = results.slice(0,12).map(r => {
        const name = lang==='tr' ? r.tr : r.en;
        const tier = r.tiers.includes(5) ? 5 : r.tiers[0];
        return `<div class="msd-item" onclick="marketSearchSelect('${r.id}','${name}','${r.cat}')">
          <img src="${RENDER}/T${tier}_${r.id}.png" onerror="this.style.display='none'"/>
          <span class="msd-tier">T${tier}</span>
          <span style="flex:1">${name}</span>
          <span class="msd-en">${r.en}</span>
          <span class="msd-cat">${r.cat}</span>
        </div>`;
      }).join('');
      dd.classList.add('open');
    } else if (dd) dd.classList.remove('open');
    filterTable(val);
  }, 200);
}

async function marketSearchSelect(baseId, name, catKey) {
  const dd = document.getElementById('marketSearchDropdown');
  if (dd) dd.classList.remove('open');
  document.getElementById('itemSearch').value = name;
  const tiers = [4,5,6,7,8];
  const ids = tiers.map(t => `T${t}_${baseId}`);
  showLoading();
  try {
    const res = await marketFetch(`${API()}/api/v2/stats/prices/${ids.join(',')}.json?locations=${encodeURIComponent(ALL_LOCS)}`);
    const data = await res.json();
    currentData = data;
    document.getElementById('tableTitle').textContent = name;
    renderTable(data);
    updateStats(data);
  } catch(e) { showError(); }
}

function clearSearch() {
  document.getElementById('itemSearch').value = '';
  document.getElementById('clearBtn').style.display = 'none';
  document.getElementById('marketSearchDropdown').classList.remove('open');
  loadCategory(currentCategory);
}

function filterTable(q) {
  if (!q) { renderTable(currentData); return; }
  const ql = q.toLowerCase();
  const filtered = currentData.filter(d => {
    const name = getItemName(d.item_id).toLowerCase();
    return name.includes(ql) || d.item_id.toLowerCase().includes(ql);
  });
  renderTable(filtered);
}

// ─── KATEGORİ YÜKLEME ────────────────────────────────────
async function loadCategory(cat) {
  currentCategory = cat;
  const items = CATEGORIES[cat] || CATEGORIES.bags;
  const title = document.getElementById('tableTitle');
  if (title) title.textContent = CAT_TITLES[cat] || cat;
  const tierF = document.getElementById('tierFilter').value;
  const cityF = document.getElementById('cityFilter').value;
  let filtered = items;
  if (tierF) filtered = filtered.filter(id => id.startsWith(tierF+'_'));
  const locs = cityF || ALL_LOCS;
  showLoading();
  try {
    const url = `${API()}/api/v2/stats/prices/${filtered.slice(0,60).join(',')}.json?locations=${encodeURIComponent(locs)}`;
    const res = await marketFetch(url);
    const data = await res.json();
    currentData = data;
    renderTable(data);
    updateStats(data);
  } catch(e) { showError(); }
}

function applyFilters() { loadCategory(currentCategory); }
function refreshPrices() {
  window.AOTMarketNetwork?.clear();
  loadCategory(currentCategory);
}

// ─── TABLO RENDER ─────────────────────────────────────────
function renderTable(data) {
  const lang = getLang();
  const cityF = document.getElementById('cityFilter').value;
  const grouped: any = {};
  data.forEach(d => {
    if (!grouped[d.item_id]) grouped[d.item_id] = [];
    grouped[d.item_id].push(d);
  });
  const sortedItems = Object.keys(grouped).sort();
  const count = document.getElementById('tableCount');
  if (count) count.textContent = `${sortedItems.length} eşya`;

  const headers = lang === 'tr'
    ? ['Eşya','Şehir','Satış Fiyatı','Alış Emri','Kalite','Veri Yaşı']
    : ['Item','City','Sell Price','Buy Order','Quality','Data Age'];

  let html = `<table class="price-table"><thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>`;

  for (const id of sortedItems) {
    const rows = grouped[id].filter(r => !cityF || r.city === cityF || r.city.replace(' ','') === cityF.replace(' ',''));
    const name = getItemName(id);
    const tier = getTier(id);
    rows.sort((a,b) => (a.sell_price_min||Infinity) - (b.sell_price_min||Infinity));
    rows.forEach((r, i) => {
      const isBM = r.city === 'Black Market';
      const sellP = r.sell_price_min > 0 ? r.sell_price_min.toLocaleString('tr-TR') : '—';
      const buyP  = r.buy_price_max > 0  ? r.buy_price_max.toLocaleString('tr-TR')  : '—';
      const qualNames = QUALITY_NAMES[lang] || QUALITY_NAMES.tr;
      const qualName = qualNames[(r.quality||1)-1] || qualNames[0];
      html += `<tr>
        <td>${i===0?`<div class="item-cell"><img src="${RENDER}/${id}.png" onerror="this.style.display='none'" alt="${name}"/><div><div class="item-name">${name}</div><span class="item-tier">T${tier}</span></div></div>`:''}
        </td>
        <td>${cityBadge(r.city)}</td>
        <td><span class="price-val ${r.sell_price_min<=0?'no-data':''}">${isBM?`<span class="price-bm">—</span>`:sellP}</span></td>
        <td><span class="price-val ${r.buy_price_max<=0?'no-data':''}">${buyP}</span></td>
        <td style="font-size:11px;color:var(--text-muted)">${qualName}</td>
        <td>${formatAge(r.sell_price_min_date||r.buy_price_max_date)}</td>
      </tr>`;
    });
  }
  html += '</tbody></table>';
  document.getElementById('priceTableContainer').innerHTML = html;
  calcTransport();
}

function updateStats(data) {
  const sells = data.filter(d => d.sell_price_min > 0 && d.city !== 'Black Market');
  const buys  = data.filter(d => d.buy_price_max > 0);
  const dates = data.map(d => d.sell_price_min_date||d.buy_price_max_date).filter(Boolean).map(d => new Date(d)).filter(d => d > new Date('2000-01-01'));
  if (sells.length) {
    const cheapest = sells.reduce((a,b) => a.sell_price_min < b.sell_price_min ? a : b);
    const expensive = sells.reduce((a,b) => a.sell_price_min > b.sell_price_min ? a : b);
    document.getElementById('statMin').textContent = cheapest.sell_price_min.toLocaleString('tr-TR');
    document.getElementById('statMinCity').textContent = CITY_DISPLAY[cheapest.city]||cheapest.city;
    document.getElementById('statMax').textContent = expensive.sell_price_min.toLocaleString('tr-TR');
    document.getElementById('statMaxCity').textContent = CITY_DISPLAY[expensive.city]||expensive.city;
    const profit = expensive.sell_price_min * 0.92 - cheapest.sell_price_min;
    document.getElementById('statProfit').textContent = profit > 0 ? '+' + Math.round(profit).toLocaleString('tr-TR') : '—';
    document.getElementById('statProfitCities').textContent = profit > 0 ? `${CITY_DISPLAY[cheapest.city]||cheapest.city} → ${CITY_DISPLAY[expensive.city]||expensive.city}` : '';
  }
  if (dates.length) {
    const newest = new Date(Math.max(...dates));
    const mins = Math.floor((Date.now() - newest.getTime()) / 60000);
    const lang = getLang();
    document.getElementById('statAge').textContent = mins < 60
      ? `${mins} ${lang==='tr'?'dk':'min'}`
      : `${Math.floor(mins/60)} ${lang==='tr'?'sa':'h'}`;
  }
}

// ─── TRANSPORT HESABI ────────────────────────────────────
function calcTransport() {
  const buyC  = document.getElementById('buyCity').value;
  const sellC = document.getElementById('sellCity').value;
  const qty   = parseInt(document.getElementById('tQty').value) || 1;
  const tax   = parseFloat(document.getElementById('tTax').value) / 100 || 0.08;
  const lang  = getLang();
  const res   = document.getElementById('transportResult');
  if (!res) return;

  const byItem = {};
  currentData.forEach(d => {
    if (!byItem[d.item_id]) byItem[d.item_id] = {};
    byItem[d.item_id][d.city] = d;
  });

  const routes = [];
  Object.entries<any>(byItem).forEach(([id, cities]) => {
    const cityKeys = Object.keys(cities);
    const buyOptions = buyC
      ? [{city: buyC, p: cities[buyC]?.sell_price_min || 0}]
      : cityKeys.filter(c => c !== 'Black Market').map(c => ({city:c, p: cities[c]?.sell_price_min||0})).filter(x=>x.p>0);
    const sellOptions = sellC
      ? [{city: sellC, p: sellC==='Black Market' ? (cities['Black Market']?.buy_price_max||0) : (cities[sellC]?.sell_price_min||0)}]
      : cityKeys.map(c => ({city:c, p: c==='Black Market'?(cities[c]?.buy_price_max||0):(cities[c]?.sell_price_min||0)})).filter(x=>x.p>0);
    buyOptions.forEach(b => {
      sellOptions.forEach(s => {
        if (b.city === s.city || !b.p || !s.p) return;
        const profit = s.p * (1-tax) * qty - b.p * qty;
        if (profit > 0) routes.push({id, buyCity:b.city, sellCity:s.city, buyP:b.p, sellP:s.p, profit});
      });
    });
  });
  routes.sort((a,b) => b.profit - a.profit);
  const top = routes.slice(0,3);
  if (!top.length) {
    res.innerHTML = `<p style="color:var(--text-muted);font-size:12px;padding:8px">${lang==='tr'?'Karlı rota bulunamadı. Farklı kategori veya şehir deneyin.':'No profitable route found.'}</p>`;
    return;
  }
  res.innerHTML = top.map((r,i) => `
    <div class="tr-row">
      <span class="tr-label">${i+1}. ${getItemName(r.id)} · ${CITY_DISPLAY[r.buyCity]||r.buyCity} → ${CITY_DISPLAY[r.sellCity]||r.sellCity}</span>
      <span class="tr-profit pos">+${Math.round(r.profit).toLocaleString('tr-TR')}</span>
    </div>`).join('');
}

// ─── FİYAT GEÇMİŞİ ───────────────────────────────────────
function onHistorySearch(val) {
  const dd = document.getElementById('historyDropdown');
  if (!val || val.length < 1) { dd.classList.remove('open'); return; }
  const results = window.AO_SEARCH ? window.AO_SEARCH(val).slice(0,8) : [];
  if (!results.length) { dd.classList.remove('open'); return; }
  const lang = getLang();
  dd.innerHTML = results.map(r => {
    const name = lang==='tr'?r.tr:r.en;
    const tier = r.tiers.includes(5)?5:r.tiers[0];
    return `<div class="msd-item" onclick="selectHistoryItem('T${tier}_${r.id}','${name}')">
      <img src="${RENDER}/T${tier}_${r.id}.png" onerror="this.style.display='none'"/>
      <span class="msd-tier">T${tier}</span>
      <span>${name}</span>
    </div>`;
  }).join('');
  dd.classList.add('open');
}

function selectHistoryItem(id, name) {
  historyItem = id;
  document.getElementById('historySearch').value = name;
  document.getElementById('historyDropdown').classList.remove('open');
  loadHistory();
}

async function loadHistory() {
  if (!historyItem) return;
  const city  = document.getElementById('historyCity').value || 'Caerleon';
  const scale = document.getElementById('historyScale').value || '24';
  const box   = document.getElementById('historyChartBox');
  box.innerHTML = '<div class="loading-state"><div class="loading-spinner"></div><span>Grafik yükleniyor...</span></div>';
  try {
    const url = `${API()}/api/v2/stats/history/${historyItem}.json?locations=${city}&time-scale=${scale}`;
    const res = await marketFetch(url);
    const data = await res.json();
    const cityData = data.find(d => d.location === city || d.location === city.replace(' ',''));
    if (!cityData?.data?.length) {
      box.innerHTML = '<div class="chart-empty"><p>Bu lokasyon için geçmiş veri bulunamadı.</p></div>';
      return;
    }
    const labels = cityData.data.map(d => d.timestamp?.slice(0,10) || '');
    const prices = cityData.data.map(d => d.avg_price || 0);
    box.innerHTML = '<canvas id="historyChart" height="120"></canvas>';
    if (historyChartInstance) historyChartInstance.destroy();
    const ctx = document.getElementById('historyChart').getContext('2d');
    historyChartInstance = new Chart(ctx, {
      type:'line',
      data:{
        labels,
        datasets:[{
          label: getItemName(historyItem) + ' — ' + (CITY_DISPLAY[city]||city),
          data: prices,
          borderColor:'#c9a84c',
          backgroundColor:'rgba(201,168,76,.08)',
          tension:.3, fill:true,
          pointRadius:3, pointBackgroundColor:'#c9a84c',
        }]
      },
      options:{
        responsive:true,
        plugins:{legend:{labels:{color:'#8b9ab0',font:{size:12}}},tooltip:{callbacks:{label:c=>`${c.parsed.y.toLocaleString('tr-TR')} Silver`}}},
        scales:{x:{ticks:{color:'#8b9ab0',font:{size:10}},grid:{color:'rgba(255,255,255,.04)'}},y:{ticks:{color:'#8b9ab0',font:{size:10},callback:v=>fmtNum(v)},grid:{color:'rgba(255,255,255,.04)'}}}
      }
    });
  } catch(e) { box.innerHTML = '<div class="chart-empty"><p>API hatası. Tekrar deneyin.</p></div>'; }
}

// ─── TOP TRADED ───────────────────────────────────────────
let currentTopType = 'volume';
function switchTopType(type, btn) {
  currentTopType = type;
  document.querySelectorAll('.top-tab').forEach(t => t.classList.toggle('active', t === btn));
  loadTopTraded();
}

async function loadTopTraded() {
  const city  = document.getElementById('topCity').value || 'Caerleon';
  const cont  = document.getElementById('topContent');
  const lang  = getLang();
  cont.innerHTML = '<div class="loading-state"><div class="loading-spinner"></div><span>Yükleniyor...</span></div>';

  // İlk 50 eşyadan tarihsel veri çek (bags + swords + bows kombinasyonu)
  const sampleItems = [...CATEGORIES.bags, ...CATEGORIES.swords.slice(0,5), ...CATEGORIES.bows.slice(0,5), ...CATEGORIES.resources.slice(0,10)].slice(0,50);
  try {
    const url = `${API()}/api/v2/stats/history/${sampleItems.join(',')}.json?locations=${city}&time-scale=24`;
    const res = await marketFetch(url);
    const data = await res.json();

    let rows = data.map(d => {
      const pts = d.data || [];
      if (pts.length < 2) return null;
      const latest = pts[pts.length-1];
      const prev   = pts[pts.length-2];
      const vol    = pts.reduce((sum,p) => sum+(p.item_count||0), 0);
      const chg    = prev?.avg_price > 0 ? ((latest.avg_price - prev.avg_price) / prev.avg_price * 100) : 0;
      return { id: d.item_id, loc: d.location, vol, price: latest.avg_price, chg, pts };
    }).filter(Boolean);

    if (currentTopType === 'volume') {
      rows.sort((a,b) => b.vol - a.vol);
    } else if (currentTopType === 'rising') {
      rows = rows.filter(r => r.chg > 0).sort((a,b) => b.chg - a.chg);
    } else {
      rows = rows.filter(r => r.chg < 0).sort((a,b) => a.chg - b.chg);
    }

    const headers = currentTopType === 'volume'
      ? (lang==='tr' ? ['#','Eşya','Şehir','Ort. Fiyat','Hacim (7g)'] : ['#','Item','City','Avg Price','Volume (7d)'])
      : (lang==='tr' ? ['#','Eşya','Şehir','Fiyat','Değişim %'] : ['#','Item','City','Price','Change %']);

    cont.innerHTML = `<table class="top-table">
      <thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead>
      <tbody>${rows.slice(0,20).map((r,i) => `<tr>
        <td class="rank-num">${i+1}</td>
        <td><div class="item-cell"><img src="${RENDER}/${r.id}.png" onerror="this.style.display='none'" style="width:24px;height:24px;border-radius:4px"/>${getItemName(r.id)}</div></td>
        <td>${cityBadge(r.loc)}</td>
        <td>${fmtNum(r.price)}</td>
        <td>${currentTopType==='volume'
          ? `<span style="font-family:var(--font-mono);font-size:12px">${r.vol.toLocaleString('tr-TR')}</span>`
          : `<span class="${r.chg>=0?'change-pos':'change-neg'}">${r.chg>=0?'+':''}${r.chg.toFixed(1)}%</span>`}
        </td>
      </tr>`).join('')}
      </tbody></table>`;
  } catch(e) { cont.innerHTML = '<div class="loading-state"><span>API hatası.</span></div>'; }
}

// ─── FLIP & ARBİTRAJ ─────────────────────────────────────
let currentFlipType = 'city';
let flipCache = {};

function switchFlipType(type, btn) {
  currentFlipType = type;
  document.querySelectorAll('.flip-tab').forEach(t => t.classList.toggle('active', t === btn));
  loadFlips();
}

async function loadFlips() {
  const cont = document.getElementById('flipContent');
  const lang = getLang();
  const minProfit = parseInt(document.getElementById('flipMinProfit').value) || 0;
  const tax = parseFloat(document.getElementById('flipTax').value) / 100 || 0.08;
  const tierF = document.getElementById('flipTier').value;

  let flipItems = [...CATEGORIES.bags, ...CATEGORIES.swords, ...CATEGORIES.bows, ...CATEGORIES.axes, ...CATEGORIES.armor_leather];
  if (tierF !== 'all') flipItems = flipItems.filter(id => id.startsWith(`T${tierF}_`));
  flipItems = flipItems.slice(0, 50);

  // Lokasyonlar flip tipine göre
  let locs = ALL_LOCS;
  if (currentFlipType === 'bm') locs = 'Caerleon,Bridgewatch,Lymhurst,Martlock,Thetford,Fort Sterling,Black Market';
  if (currentFlipType === 'rest') locs = 'Caerleon,Arthurs Rest,Merlins Rest,Morganas Rest';

  cont.innerHTML = '<div class="loading-state"><div class="loading-spinner"></div><span>Flip fırsatları hesaplanıyor...</span></div>';
  try {
    const url = `${API()}/api/v2/stats/prices/${flipItems.join(',')}.json?locations=${encodeURIComponent(locs)}`;
    const res = await marketFetch(url);
    const data = await res.json();
    flipCache = {};
    data.forEach(d => {
      if (!flipCache[d.item_id]) flipCache[d.item_id] = {};
      flipCache[d.item_id][d.city] = d;
    });
    renderFlips();
  } catch(e) { cont.innerHTML = '<div class="loading-state"><span>API hatası.</span></div>'; }
}

function renderFlips() {
  const minProfit = parseInt(document.getElementById('flipMinProfit').value) || 0;
  const tax = parseFloat(document.getElementById('flipTax').value) / 100 || 0.08;
  const lang = getLang();
  const flips = [];

  Object.entries<any>(flipCache).forEach(([id, cities]) => {
    const cityKeys = Object.keys(cities);
    if (currentFlipType === 'bm') {
      const bm = cities['Black Market'];
      if (!bm?.buy_price_max) return;
      cityKeys.filter(c => c !== 'Black Market').forEach(c => {
        const sellP = cities[c]?.sell_price_min;
        if (!sellP) return;
        const profit = bm.buy_price_max * (1-tax) - sellP;
        const pct = ((profit / sellP) * 100).toFixed(1);
        if (profit >= minProfit) flips.push({id, buyCity:c, sellCity:'Black Market', buyP:sellP, sellP:bm.buy_price_max, profit, pct});
      });
    } else {
      cityKeys.forEach(bc => {
        const buyP = cities[bc]?.sell_price_min;
        if (!buyP || bc === 'Black Market') return;
        cityKeys.forEach(sc => {
          if (bc === sc) return;
          const sellP = sc === 'Black Market' ? cities[sc]?.buy_price_max : cities[sc]?.sell_price_min;
          if (!sellP) return;
          const profit = sellP * (1-tax) - buyP;
          const pct = ((profit / buyP) * 100).toFixed(1);
          if (profit >= minProfit) flips.push({id, buyCity:bc, sellCity:sc, buyP, sellP, profit, pct});
        });
      });
    }
  });
  flips.sort((a,b) => b.profit - a.profit);

  if (!flips.length) {
    document.getElementById('flipContent').innerHTML = `<div class="chart-empty"><div style="font-size:32px">🔄</div><p>${lang==='tr'?'Belirtilen kriterlerde flip bulunamadı. Min. kârı düşürün veya farklı tier deneyin.':'No flip found with current criteria.'}</p></div>`;
    return;
  }

  const headers = lang==='tr'
    ? ['Eşya','T','Al','Alış','Sat','Satış','Kâr','%']
    : ['Item','T','Buy','Buy P','Sell','Sell P','Profit','%'];

  document.getElementById('flipContent').innerHTML = `<table class="flip-table">
    <thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead>
    <tbody>${flips.slice(0,30).map(f => `<tr>
      <td><div class="item-cell"><img src="${RENDER}/${f.id}.png" onerror="this.style.display='none'" style="width:24px;height:24px;border-radius:4px"/>${getItemName(f.id)}</div></td>
      <td><span class="item-tier">T${getTier(f.id)}</span></td>
      <td>${cityBadge(f.buyCity)}</td>
      <td style="font-family:var(--font-mono);font-size:12px">${f.buyP.toLocaleString('tr-TR')}</td>
      <td>${cityBadge(f.sellCity)}</td>
      <td style="font-family:var(--font-mono);font-size:12px">${f.sellP.toLocaleString('tr-TR')}</td>
      <td class="flip-profit">+${Math.round(f.profit).toLocaleString('tr-TR')}</td>
      <td class="flip-pct">%${f.pct}</td>
    </tr>`).join('')}
    </tbody></table>`;
}

// ─── KALİTE & ENCHANT ────────────────────────────────────
function onQualitySearch(val) {
  const dd = document.getElementById('qualityDropdown');
  if (!val || val.length < 1) { dd.classList.remove('open'); return; }
  const results = window.AO_SEARCH ? window.AO_SEARCH(val).slice(0,8) : [];
  const lang = getLang();
  dd.innerHTML = results.map(r => {
    const name = lang==='tr'?r.tr:r.en;
    const tier = r.tiers.includes(5)?5:r.tiers[0];
    return `<div class="msd-item" onclick="selectQualityItem('${r.id}','${tier}','${name}')">
      <img src="${RENDER}/T${tier}_${r.id}.png" onerror="this.style.display='none'"/>
      <span class="msd-tier">T${tier}</span><span>${name}</span>
    </div>`;
  }).join('');
  dd.classList.add('open');
}

async function selectQualityItem(baseId, tier, name) {
  qualityItem = {baseId, tier};
  document.getElementById('qualitySearch').value = name;
  document.getElementById('qualityDropdown').classList.remove('open');
  document.getElementById('qualityContent').innerHTML = '<div class="loading-state"><div class="loading-spinner"></div><span>Yükleniyor...</span></div>';
  const lang = getLang();

  // Tüm kaliteler + enchant'lar
  const qualIds = [1,2,3,4,5].map(q => `T${tier}_${baseId}`);
  const enchIds = [0,1,2,3].map(e => e===0 ? `T${tier}_${baseId}` : `T${tier}_${baseId}@${e}`);
  const allIds = [...new Set([...qualIds, ...enchIds])];

  try {
    const url = `${API()}/api/v2/stats/prices/${allIds.join(',')}.json?locations=Caerleon&qualities=1,2,3,4,5`;
    const res = await marketFetch(url);
    const data = await res.json();

    // Kaliteye göre grupla
    const byQual = {};
    data.forEach(d => { if (d.quality) byQual[d.quality] = d; });
    const qualNames = QUALITY_NAMES[lang] || QUALITY_NAMES.tr;

    // Enchant için ayrı sorgu
    const enchRes = await marketFetch(`${API()}/api/v2/stats/prices/${enchIds.join(',')}.json?locations=Caerleon`);
    const enchData = await enchRes.json();
    const byEnch = {};
    enchIds.forEach((id, i) => {
      const found = enchData.find(d => d.item_id === id);
      if (found) byEnch[i] = found;
    });

    let html = `<h3 style="font-family:var(--font-display);font-size:16px;font-weight:700;color:var(--text-primary);margin-bottom:12px">${name} — ${lang==='tr'?'Kalite Karşılaştırması':'Quality Comparison'}</h3>`;
    html += `<div class="quality-grid">`;
    [1,2,3,4,5].forEach((q,i) => {
      const d = byQual[q];
      html += `<div class="quality-card">
        <div class="quality-label">${qualNames[i]}</div>
        <div class="quality-price">${d?.sell_price_min > 0 ? d.sell_price_min.toLocaleString('tr-TR') : '—'}</div>
        <div class="quality-city">Caerleon</div>
      </div>`;
    });
    html += `</div>`;

    html += `<h3 style="font-family:var(--font-display);font-size:16px;font-weight:700;color:var(--text-primary);margin:20px 0 12px">${lang==='tr'?'Enchant Fiyat Karşılaştırması':'Enchant Price Comparison'}</h3>`;
    html += `<div class="enchant-grid">`;
    const basePrice = byEnch[0]?.sell_price_min || 0;
    [0,1,2,3].forEach(e => {
      const d = byEnch[e];
      const p = d?.sell_price_min || 0;
      const diff = e > 0 && basePrice > 0 ? ((p - basePrice) / basePrice * 100).toFixed(0) : null;
      const colors = ['','#22c55e','#60a5fa','#a78bfa'];
      html += `<div class="enchant-card enchant-${e}">
        <div class="enchant-label" style="color:${colors[e]||'var(--text-muted)'}">${e===0?(lang==='tr'?'Normal':'+0 Normal'):('+'+e)}</div>
        <div class="enchant-price">${p > 0 ? p.toLocaleString('tr-TR') : '—'}</div>
        ${diff ? `<div class="enchant-diff" style="color:${parseFloat(diff)>=0?'#22c55e':'#ef4444'}">${parseFloat(diff)>=0?'+':''}${diff}%</div>` : ''}
      </div>`;
    });
    html += `</div>`;
    document.getElementById('qualityContent').innerHTML = html;
  } catch(e) { document.getElementById('qualityContent').innerHTML = '<div class="chart-empty"><p>API hatası.</p></div>'; }
}

// ─── GOLD GRAFİĞİ ─────────────────────────────────────────
async function loadGoldChart() {
  const days = parseInt(document.getElementById('goldDays').value) || 30;
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const fmt = d => `${d.getMonth()+1}-${d.getDate()}-${d.getFullYear()}`;
  const box = document.getElementById('goldChart');
  if (!box) return;
  try {
    const url = `${API()}/api/v2/stats/gold.json?date=${fmt(startDate)}&end_date=${fmt(endDate)}`;
    const res = await marketFetch(url);
    const data = await res.json();
    if (!data?.length) return;
    const labels = data.map(d => d.timestamp?.slice(0,10) || '');
    const prices = data.map(d => d.price || 0);
    const minP = Math.min(...prices), maxP = Math.max(...prices), avgP = Math.round(prices.reduce((a,b)=>a+b,0)/prices.length);
    if (goldChartInstance) goldChartInstance.destroy();
    const ctx = box.getContext('2d');
    goldChartInstance = new Chart(ctx, {
      type:'line',
      data:{
        labels,
        datasets:[{
          label:'Gold Fiyatı (Silver)',
          data:prices,
          borderColor:'#c9a84c',
          backgroundColor:'rgba(201,168,76,.06)',
          tension:.4, fill:true,
          pointRadius:0, pointHoverRadius:4,
        }]
      },
      options:{
        responsive:true,
        plugins:{legend:{labels:{color:'#8b9ab0',font:{size:12}}},tooltip:{callbacks:{label:c=>`${c.parsed.y.toLocaleString('tr-TR')} Silver`}}},
        scales:{x:{ticks:{color:'#8b9ab0',font:{size:10},maxTicksLimit:8},grid:{color:'rgba(255,255,255,.03)'}},y:{ticks:{color:'#8b9ab0',font:{size:10},callback:v=>fmtNum(v)},grid:{color:'rgba(255,255,255,.03)'}}}
      }
    });
    const lang = getLang();
    const statsEl = document.getElementById('goldStatCards');
    if (statsEl) statsEl.innerHTML = [
      {label:lang==='tr'?'En Düşük':'Minimum', val:minP},
      {label:lang==='tr'?'En Yüksek':'Maximum', val:maxP},
      {label:lang==='tr'?'Ortalama':'Average', val:avgP},
      {label:lang==='tr'?'Son Fiyat':'Latest', val:prices[prices.length-1]},
    ].map(s=>`<div class="gold-stat-card"><div class="gsc-label">${s.label}</div><div class="gsc-val">${s.val.toLocaleString('tr-TR')}</div></div>`).join('');
  } catch(e) { console.error(e); }
}

// ─── 3 SUNUCU KARŞILAŞTIRMA ──────────────────────────────
async function loadCompare() {
  switchTab('prices', document.querySelector('.mkt-tab'));
  const cont = document.getElementById('priceTableContainer');
  cont.innerHTML = '<div class="loading-state"><div class="loading-spinner"></div><span>3 sunucu karşılaştırılıyor...</span></div>';
  const items = CATEGORIES[currentCategory].slice(0, 20);
  try {
    const [eu, us, asia] = await Promise.all([
      marketFetch(`${SERVERS.europe}/api/v2/stats/prices/${items.join(',')}.json?locations=Caerleon`).then(r=>r.json()),
      marketFetch(`${SERVERS.west}/api/v2/stats/prices/${items.join(',')}.json?locations=Caerleon`).then(r=>r.json()),
      marketFetch(`${SERVERS.east}/api/v2/stats/prices/${items.join(',')}.json?locations=Caerleon`).then(r=>r.json()),
    ]);
    const byItem = {};
    eu.forEach(d=>{ if(!byItem[d.item_id]) byItem[d.item_id]={}; byItem[d.item_id].eu=d; });
    us.forEach(d=>{ if(!byItem[d.item_id]) byItem[d.item_id]={}; byItem[d.item_id].us=d; });
    asia.forEach(d=>{ if(!byItem[d.item_id]) byItem[d.item_id]={}; byItem[d.item_id].asia=d; });
    const lang = getLang();
    cont.innerHTML = `<table class="price-table">
      <thead><tr><th>${lang==='tr'?'Eşya':'Item'}</th><th>🌍 EU</th><th>🌎 US</th><th>🌏 Asia</th><th>${lang==='tr'?'Fark':'Diff'}</th></tr></thead>
      <tbody>${Object.entries<any>(byItem).map(([id,d])=>{
        const euP=d.eu?.sell_price_min||0, usP=d.us?.sell_price_min||0, asiaP=d.asia?.sell_price_min||0;
        const vals=[euP,usP,asiaP].filter(v=>v>0);
        const diff = vals.length>1 ? Math.round(Math.max(...vals)-Math.min(...vals)) : 0;
        return `<tr>
          <td><div class="item-cell"><img src="${RENDER}/${id}.png" onerror="this.style.display='none'" style="width:24px;height:24px;border-radius:4px"/>${getItemName(id)}</div></td>
          <td class="price-val ${euP?'':'no-data'}">${euP?euP.toLocaleString('tr-TR'):'—'}</td>
          <td class="price-val ${usP?'':'no-data'}">${usP?usP.toLocaleString('tr-TR'):'—'}</td>
          <td class="price-val ${asiaP?'':'no-data'}">${asiaP?asiaP.toLocaleString('tr-TR'):'—'}</td>
          <td style="font-family:var(--font-mono);font-size:12px;color:${diff>0?'#22c55e':'var(--text-muted)'}">${diff>0?'+'+diff.toLocaleString('tr-TR'):'—'}</td>
        </tr>`;
      }).join('')}</tbody></table>`;
  } catch(e) { cont.innerHTML='<div class="loading-state"><span>API hatası.</span></div>'; }
}

// ─── YARDIMCI ─────────────────────────────────────────────
function showLoading() {
  document.getElementById('priceTableContainer').innerHTML = '<div class="loading-state"><div class="loading-spinner"></div><span>Fiyatlar yükleniyor...</span></div>';
}
function showError() {
  document.getElementById('priceTableContainer').innerHTML = '<div class="loading-state"><span style="color:var(--red)">⚠️ API hatası. Tekrar deneyin.</span></div>';
}

// ─── BAŞLAT ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadGoldPrice();
  loadCategory('bags');

  // Dışarı tıklayınca dropdown'ları kapat
  document.addEventListener('click', e => {
    if (!e.target.closest('.mf-search-wrap') && !e.target.closest('.mkt-search-dd')) {
      document.querySelectorAll('.mkt-search-dd').forEach(d => d.classList.remove('open'));
    }
  });

  // URL hash kontrolü (hero search'ten gelen)
  const hash = location.hash;
  if (hash.startsWith('#search=')) {
    const baseId = hash.replace('#search=','');
    const item = (window.AO_ITEMS||[]).find(i => i.id === baseId);
    if (item) {
      const lang = localStorage.getItem('aot-lang')||'tr';
      const name = lang==='tr'?item.tr:item.en;
      document.getElementById('itemSearch').value = name;
      marketSearchSelect(baseId, name, item.cat);
    }
  }
});

// --- Modül dönüşümü: üst düzey semboller window üzerinden paylaşılır ---
declare global {
  var marketFetch: any;
  var SERVERS: any;
  var ALL_LOCS: any;
  var CITY_DISPLAY: any;
  var CITY_TYPE: any;
  var CATEGORIES: any;
  var CAT_TITLES: any;
  var QUALITY_NAMES: any;
  var currentServer: any;
  var currentCategory: any;
  var currentData: any;
  var currentTab: any;
  var flipType: any;
  var topType: any;
  var searchTimeout: any;
  var historyItem: any;
  var qualityItem: any;
  var goldChartInstance: any;
  var historyChartInstance: any;
  var API: any;
  var RENDER: any;
  var getLang: any;
  var getItemName: any;
  var getTier: any;
  var getEnchant: any;
  var cityBadge: any;
  var formatAge: any;
  var fmtNum: any;
  var switchServer: any;
  var loadGoldPrice: any;
  var switchTab: any;
  var onSearchInput: any;
  var marketSearchSelect: any;
  var clearSearch: any;
  var filterTable: any;
  var loadCategory: any;
  var applyFilters: any;
  var refreshPrices: any;
  var renderTable: any;
  var updateStats: any;
  var calcTransport: any;
  var onHistorySearch: any;
  var selectHistoryItem: any;
  var loadHistory: any;
  var currentTopType: any;
  var switchTopType: any;
  var loadTopTraded: any;
  var currentFlipType: any;
  var flipCache: any;
  var switchFlipType: any;
  var loadFlips: any;
  var renderFlips: any;
  var onQualitySearch: any;
  var selectQualityItem: any;
  var loadGoldChart: any;
  var loadCompare: any;
  var showLoading: any;
  var showError: any;
}

let getItemName_windowOverride: any;
let getTier_windowOverride: any;
let getEnchant_windowOverride: any;
let cityBadge_windowOverride: any;
let formatAge_windowOverride: any;
let fmtNum_windowOverride: any;
let switchServer_windowOverride: any;
let loadGoldPrice_windowOverride: any;
let switchTab_windowOverride: any;
let onSearchInput_windowOverride: any;
let marketSearchSelect_windowOverride: any;
let clearSearch_windowOverride: any;
let filterTable_windowOverride: any;
let loadCategory_windowOverride: any;
let applyFilters_windowOverride: any;
let refreshPrices_windowOverride: any;
let renderTable_windowOverride: any;
let updateStats_windowOverride: any;
let calcTransport_windowOverride: any;
let onHistorySearch_windowOverride: any;
let selectHistoryItem_windowOverride: any;
let loadHistory_windowOverride: any;
let switchTopType_windowOverride: any;
let loadTopTraded_windowOverride: any;
let switchFlipType_windowOverride: any;
let loadFlips_windowOverride: any;
let renderFlips_windowOverride: any;
let onQualitySearch_windowOverride: any;
let selectQualityItem_windowOverride: any;
let loadGoldChart_windowOverride: any;
let loadCompare_windowOverride: any;
let showLoading_windowOverride: any;
let showError_windowOverride: any;

Object.defineProperty(window, 'marketFetch', {
  get: () => marketFetch,
  set: (value) => { marketFetch = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'SERVERS', {
  get: () => SERVERS,
  set: (value) => { SERVERS = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'ALL_LOCS', {
  get: () => ALL_LOCS,
  set: (value) => { ALL_LOCS = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'CITY_DISPLAY', {
  get: () => CITY_DISPLAY,
  set: (value) => { CITY_DISPLAY = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'CITY_TYPE', {
  get: () => CITY_TYPE,
  set: (value) => { CITY_TYPE = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'CATEGORIES', {
  get: () => CATEGORIES,
  set: (value) => { CATEGORIES = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'CAT_TITLES', {
  get: () => CAT_TITLES,
  set: (value) => { CAT_TITLES = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'QUALITY_NAMES', {
  get: () => QUALITY_NAMES,
  set: (value) => { QUALITY_NAMES = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'currentServer', {
  get: () => currentServer,
  set: (value) => { currentServer = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'currentCategory', {
  get: () => currentCategory,
  set: (value) => { currentCategory = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'currentData', {
  get: () => currentData,
  set: (value) => { currentData = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'currentTab', {
  get: () => currentTab,
  set: (value) => { currentTab = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'flipType', {
  get: () => flipType,
  set: (value) => { flipType = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'topType', {
  get: () => topType,
  set: (value) => { topType = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'searchTimeout', {
  get: () => searchTimeout,
  set: (value) => { searchTimeout = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'historyItem', {
  get: () => historyItem,
  set: (value) => { historyItem = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'qualityItem', {
  get: () => qualityItem,
  set: (value) => { qualityItem = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'goldChartInstance', {
  get: () => goldChartInstance,
  set: (value) => { goldChartInstance = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'historyChartInstance', {
  get: () => historyChartInstance,
  set: (value) => { historyChartInstance = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'API', {
  get: () => API,
  set: (value) => { API = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'RENDER', {
  get: () => RENDER,
  set: (value) => { RENDER = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'getLang', {
  get: () => getLang,
  set: (value) => { getLang = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'getItemName', {
  get: () => (getItemName_windowOverride !== undefined ? getItemName_windowOverride : getItemName),
  set: (value) => { getItemName_windowOverride = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'getTier', {
  get: () => (getTier_windowOverride !== undefined ? getTier_windowOverride : getTier),
  set: (value) => { getTier_windowOverride = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'getEnchant', {
  get: () => (getEnchant_windowOverride !== undefined ? getEnchant_windowOverride : getEnchant),
  set: (value) => { getEnchant_windowOverride = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'cityBadge', {
  get: () => (cityBadge_windowOverride !== undefined ? cityBadge_windowOverride : cityBadge),
  set: (value) => { cityBadge_windowOverride = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'formatAge', {
  get: () => (formatAge_windowOverride !== undefined ? formatAge_windowOverride : formatAge),
  set: (value) => { formatAge_windowOverride = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'fmtNum', {
  get: () => (fmtNum_windowOverride !== undefined ? fmtNum_windowOverride : fmtNum),
  set: (value) => { fmtNum_windowOverride = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'switchServer', {
  get: () => (switchServer_windowOverride !== undefined ? switchServer_windowOverride : switchServer),
  set: (value) => { switchServer_windowOverride = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'loadGoldPrice', {
  get: () => (loadGoldPrice_windowOverride !== undefined ? loadGoldPrice_windowOverride : loadGoldPrice),
  set: (value) => { loadGoldPrice_windowOverride = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'switchTab', {
  get: () => (switchTab_windowOverride !== undefined ? switchTab_windowOverride : switchTab),
  set: (value) => { switchTab_windowOverride = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'onSearchInput', {
  get: () => (onSearchInput_windowOverride !== undefined ? onSearchInput_windowOverride : onSearchInput),
  set: (value) => { onSearchInput_windowOverride = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'marketSearchSelect', {
  get: () => (marketSearchSelect_windowOverride !== undefined ? marketSearchSelect_windowOverride : marketSearchSelect),
  set: (value) => { marketSearchSelect_windowOverride = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'clearSearch', {
  get: () => (clearSearch_windowOverride !== undefined ? clearSearch_windowOverride : clearSearch),
  set: (value) => { clearSearch_windowOverride = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'filterTable', {
  get: () => (filterTable_windowOverride !== undefined ? filterTable_windowOverride : filterTable),
  set: (value) => { filterTable_windowOverride = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'loadCategory', {
  get: () => (loadCategory_windowOverride !== undefined ? loadCategory_windowOverride : loadCategory),
  set: (value) => { loadCategory_windowOverride = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'applyFilters', {
  get: () => (applyFilters_windowOverride !== undefined ? applyFilters_windowOverride : applyFilters),
  set: (value) => { applyFilters_windowOverride = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'refreshPrices', {
  get: () => (refreshPrices_windowOverride !== undefined ? refreshPrices_windowOverride : refreshPrices),
  set: (value) => { refreshPrices_windowOverride = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'renderTable', {
  get: () => (renderTable_windowOverride !== undefined ? renderTable_windowOverride : renderTable),
  set: (value) => { renderTable_windowOverride = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'updateStats', {
  get: () => (updateStats_windowOverride !== undefined ? updateStats_windowOverride : updateStats),
  set: (value) => { updateStats_windowOverride = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'calcTransport', {
  get: () => (calcTransport_windowOverride !== undefined ? calcTransport_windowOverride : calcTransport),
  set: (value) => { calcTransport_windowOverride = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'onHistorySearch', {
  get: () => (onHistorySearch_windowOverride !== undefined ? onHistorySearch_windowOverride : onHistorySearch),
  set: (value) => { onHistorySearch_windowOverride = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'selectHistoryItem', {
  get: () => (selectHistoryItem_windowOverride !== undefined ? selectHistoryItem_windowOverride : selectHistoryItem),
  set: (value) => { selectHistoryItem_windowOverride = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'loadHistory', {
  get: () => (loadHistory_windowOverride !== undefined ? loadHistory_windowOverride : loadHistory),
  set: (value) => { loadHistory_windowOverride = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'currentTopType', {
  get: () => currentTopType,
  set: (value) => { currentTopType = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'switchTopType', {
  get: () => (switchTopType_windowOverride !== undefined ? switchTopType_windowOverride : switchTopType),
  set: (value) => { switchTopType_windowOverride = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'loadTopTraded', {
  get: () => (loadTopTraded_windowOverride !== undefined ? loadTopTraded_windowOverride : loadTopTraded),
  set: (value) => { loadTopTraded_windowOverride = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'currentFlipType', {
  get: () => currentFlipType,
  set: (value) => { currentFlipType = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'flipCache', {
  get: () => flipCache,
  set: (value) => { flipCache = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'switchFlipType', {
  get: () => (switchFlipType_windowOverride !== undefined ? switchFlipType_windowOverride : switchFlipType),
  set: (value) => { switchFlipType_windowOverride = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'loadFlips', {
  get: () => (loadFlips_windowOverride !== undefined ? loadFlips_windowOverride : loadFlips),
  set: (value) => { loadFlips_windowOverride = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'renderFlips', {
  get: () => (renderFlips_windowOverride !== undefined ? renderFlips_windowOverride : renderFlips),
  set: (value) => { renderFlips_windowOverride = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'onQualitySearch', {
  get: () => (onQualitySearch_windowOverride !== undefined ? onQualitySearch_windowOverride : onQualitySearch),
  set: (value) => { onQualitySearch_windowOverride = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'selectQualityItem', {
  get: () => (selectQualityItem_windowOverride !== undefined ? selectQualityItem_windowOverride : selectQualityItem),
  set: (value) => { selectQualityItem_windowOverride = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'loadGoldChart', {
  get: () => (loadGoldChart_windowOverride !== undefined ? loadGoldChart_windowOverride : loadGoldChart),
  set: (value) => { loadGoldChart_windowOverride = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'loadCompare', {
  get: () => (loadCompare_windowOverride !== undefined ? loadCompare_windowOverride : loadCompare),
  set: (value) => { loadCompare_windowOverride = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'showLoading', {
  get: () => (showLoading_windowOverride !== undefined ? showLoading_windowOverride : showLoading),
  set: (value) => { showLoading_windowOverride = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'showError', {
  get: () => (showError_windowOverride !== undefined ? showError_windowOverride : showError),
  set: (value) => { showError_windowOverride = value; },
  configurable: true, enumerable: true });

export {};
