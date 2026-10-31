// AoT-PNASF — Home Page JavaScript
// Gold fiyatı, geri sayım, canlılık şeridi, silver widget, hero arama

let HOME_API = window.AO_PRICE_API || 'https://europe.albion-online-data.com';
let RENDER   = 'https://render.albiononline.com/v1/item';

// ═══ GOLD FİYATI ════════════════════════════════════════
async function loadGoldPrice() {
  try {
    const res  = await window.AOTMarketNetwork.request(`${HOME_API}/api/v2/stats/gold.json?count=1`);
    const data = await res.json();
    if (data && data.length) {
      const gold = data[0].price;
      const el = document.getElementById('goldVal');
      const el2 = document.getElementById('statGold');
      if (el) el.textContent = gold.toLocaleString('tr-TR');
      if (el2) el2.textContent = gold.toLocaleString('tr-TR');
      // Veri yaşı
      const age = document.getElementById('goldAge');
      if (age && data[0].timestamp) {
        const mins = Math.floor((Date.now() - new Date(data[0].timestamp).getTime()) / 60000);
        age.textContent = mins < 60 ? `${mins}dk önce` : `${Math.floor(mins/60)}sa önce`;
      }
    }
  } catch(e) { console.error('Gold yüklenemedi:', e); }
}

// ═══ GERİ SAYIM ═════════════════════════════════════════
// Radiant Wilds — tahmini Nisan 2026 ilk haftası
let PATCH_DATE = new Date('2026-04-09T10:00:00Z');

function updateCountdown() {
  const now  = Date.now();
  const diff = PATCH_DATE.getTime() - now;
  if (diff <= 0) {
    ['cdDays','cdHours','cdMins','cdSecs'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '00';
    });
    const pc = document.getElementById('patchCountdown');
    if (pc) pc.innerHTML = '<span style="color:var(--teal);font-family:var(--font-mono);font-size:12px">⚡ Radiant Wilds — YAYINDA!</span>';
    return;
  }
  const days  = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins  = Math.floor((diff % 3600000) / 60000);
  const secs  = Math.floor((diff % 60000) / 1000);
  const fmt = n => String(n).padStart(2,'0');
  const set = (id, v) => { const el = document.getElementById(id); if(el) el.textContent = fmt(v); };
  set('cdDays', days); set('cdHours', hours); set('cdMins', mins); set('cdSecs', secs);
}

// ═══ İSTATİSTİK SAYAÇLARI ═══════════════════════════════
function loadStats() {
  // items-data.js yüklüyse gerçek sayıyı al
  const items = window.AO_ITEMS || [];
  // Tüm tier kombinasyonlarını say
  const totalVariants = items.reduce((sum, item) => sum + item.tiers.length * 4, 0); // 4 enchant
  const el = document.getElementById('statItems');
  if (el) {
    // Sayaç animasyonu
    animateCount(el, 0, totalVariants || 1847, 1200);
  }
}

function animateCount(el, from, to, duration) {
  const start = Date.now();
  const step = () => {
    const progress = Math.min((Date.now() - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(from + (to - from) * ease).toLocaleString('tr-TR');
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// ═══ CANLILIK ŞERİDİ ════════════════════════════════════
let ACTIVITY_ITEMS = [
  {name:'T6 Avcı Ceketi', city:'Caerleon',      change:+12400, dir:'up'},
  {name:'T7 Badon Yayı',  city:'Lymhurst',      change:-8200,  dir:'down'},
  {name:'T5 Çanta',       city:'Black Market',  change:+3100,  dir:'up'},
  {name:'T6 Claymore',    city:'Bridgewatch',   change:+5800,  dir:'up'},
  {name:'T4 Metal Külçe', city:'Thetford',      change:0,      dir:'neutral'},
  {name:'T7 Glacial Asa', city:'Martlock',      change:+22000, dir:'up'},
  {name:'T8 Arbalet',     city:'Fort Sterling', change:-15600, dir:'down'},
  {name:'T5 Bilge Cübbe', city:'Caerleon',      change:+4200,  dir:'up'},
  {name:'T6 Savaş Yayı',  city:'Lymhurst',      change:+9800,  dir:'up'},
  {name:'T4 Tahta',       city:'Bridgewatch',   change:-1200,  dir:'down'},
];

async function loadActivityStrip() {
  // Önce canlı fiyat deneyelim, yoksa statik
  const track = document.getElementById('activityItems');
  if (!track) return;

  const lang = localStorage.getItem('aot-lang') || 'tr';
  // 2x döngü için öğeleri kopyala (sonsuz kayma efekti)
  const allItems = [...ACTIVITY_ITEMS, ...ACTIVITY_ITEMS];
  track.innerHTML = allItems.map(item => {
    const dirClass = item.dir === 'up' ? 'ai-up' : item.dir === 'down' ? 'ai-down' : 'ai-neutral';
    const dirIcon  = item.dir === 'up' ? '▲' : item.dir === 'down' ? '▼' : '—';
    const changeStr = item.change !== 0 ? `${item.change > 0 ? '+' : ''}${item.change.toLocaleString('tr-TR')}` : '±0';
    return `<div class="activity-item">
      <span class="ai-name">${item.name}</span>
      <span style="color:var(--text-muted)">→</span>
      <span class="ai-city">${item.city}</span>
      <span class="${dirClass}">${dirIcon} ${changeStr}</span>
    </div>`;
  }).join('');
}

// ═══ SILVER WİDGET ══════════════════════════════════════
let SILVER_BASE = {
  pvp:    [8, 18, 35],    // M silver/hafta [düşük,orta,yüksek tier]
  craft:  [5, 14, 28],
  trade:  [12, 25, 50],
  farm:   [3, 8, 15],
  gather: [4, 10, 22],
};
let TIME_MULT  = [1, 2.2, 4];
let PREM_MULT  = [1, 1.5];

function calcSilver() {
  const style = document.getElementById('silverStyle')?.value || 'pvp';
  const time  = parseInt(document.getElementById('silverTime')?.value || 1) - 1;
  const tier  = parseInt(document.getElementById('silverTier')?.value || 1) - 1;
  const prem  = parseInt(document.getElementById('silverPrem')?.value || 1);
  const base  = SILVER_BASE[style]?.[tier] || 10;
  const total = base * TIME_MULT[time] * PREM_MULT[prem] * 7; // haftalık
  const el    = document.getElementById('silverVal');
  if (el) {
    const M = total;
    el.textContent = M >= 1000 ? `~${(M/1000).toFixed(1)}B` : `~${M.toFixed(1)}M`;
  }
  const note = document.getElementById('silverNote');
  if (note) {
    const notes = {
      pvp: 'PvP · Fame · Kill silver kombinasyonu',
      craft: 'Crafting kâr · Black Market flip',
      trade: 'Transport · Flip · Arbitraj',
      farm: 'Farming + Hayvan yetiştirme',
      gather: 'Ham kaynak toplama + satış',
    };
    note.textContent = notes[style] || '';
  }
}

// ═══ HERO ARAMA ══════════════════════════════════════════
let heroSearchTimeout;
function onHeroSearch(val) {
  const dd = document.getElementById('heroSearchDropdown');
  clearTimeout(heroSearchTimeout);
  if (!val || val.length < 1) { dd.classList.remove('open'); return; }
  heroSearchTimeout = setTimeout(() => {
    const results = window.AO_SEARCH ? window.AO_SEARCH(val) : [];
    if (!results.length) { dd.classList.remove('open'); return; }
    const lang = localStorage.getItem('aot-lang') || 'tr';
    dd.innerHTML = results.slice(0, 12).map(r => {
      const name = lang === 'tr' ? r.tr : r.en;
      const tier = r.tiers.includes(5) ? 5 : r.tiers[0];
      const icon = `${RENDER}/T${tier}_${r.id}.png`;
      const cats = {sword:'⚔️',axe:'🪓',bow:'🏹',hammer:'🔨',spear:'🗡️',dagger:'🔪',
                    fire:'🔥',frost:'❄️',arcane:'🌀',holy:'✨',nature:'🌿',curse:'💀',
                    bag:'🎒',food:'🍲',potion:'⚗️',mount:'🐎',refined:'⚙️',raw:'🪵'};
      const catIcon = cats[r.cat] || '📦';
      return `<div class="hsd-item" onclick="heroSearchGo('${r.id}')">
        <img src="${icon}" onerror="this.style.display='none'" alt="${name}"/>
        <span class="hsd-tier">T${tier}</span>
        <span style="flex:1">${name}</span>
        <span style="font-size:10px;color:var(--text-muted)">${r.en}</span>
        <span class="hsd-cat">${catIcon}</span>
      </div>`;
    }).join('');
    dd.classList.add('open');
  }, 200);
}

function heroSearchGo(baseId) {
  // Market sayfasına git ve eşyayı ara
  window.location.href = `market.html#search=${baseId}`;
}

// Dışarı tıklayınca kapat
document.addEventListener('click', e => {
  if (!e.target.closest('.hero-search-wrap'))
    document.getElementById('heroSearchDropdown')?.classList.remove('open');
});

// ═══ AI FEED ═════════════════════════════════════════════
async function loadFeed() {
  const grid = document.getElementById('feedGrid');
  if (!grid) return;
  try {
    const res  = await fetch('data/feed.json?_=' + Date.now(), { cache: 'no-cache' });
    const data = await res.json();
    if (!data || !data.items || !data.items.length) {
      renderFallbackFeed(grid);
      return;
    }
    grid.innerHTML = data.items.slice(0, 6).map(item => {
      const typeClass = item.type === 'alert' ? 'alert' : item.type === 'meta' ? 'meta' : 'update';
      return `<div class="feed-card">
        <div class="feed-dot-wrap"><div class="feed-dot-type ${typeClass}"></div></div>
        <div style="flex:1">
          <div class="feed-card-title">${item.title || ''}</div>
          <div class="feed-card-text">${item.summary || item.content || ''}</div>
          <div class="feed-card-time">${formatFeedAge(item.date)}</div>
        </div>
      </div>`;
    }).join('');
  } catch(e) {
    renderFallbackFeed(grid);
  }
}

function renderFallbackFeed(grid) {
  const lang = localStorage.getItem('aot-lang') || 'tr';
  const items = lang === 'tr' ? [
    {type:'update', title:'Resmi haber akışı yenileniyor', text:'Yeni oyun güncellemesi ve etkinlikler yalnızca doğrulanmış Albion Online kaynaklarından yüklenecek.', time:'Bekleniyor'},
  ] : [
    {type:'update', title:'Official news feed is refreshing', text:'New game updates and events will be loaded only from verified Albion Online sources.', time:'Pending'},
  ];
  grid.innerHTML = items.map(i => `<div class="feed-card">
    <div class="feed-dot-wrap"><div class="feed-dot-type ${i.type}"></div></div>
    <div style="flex:1">
      <div class="feed-card-title">${i.title}</div>
      <div class="feed-card-text">${i.text}</div>
      <div class="feed-card-time">${i.time}</div>
    </div>
  </div>`).join('');
}

function formatFeedAge(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const lang = localStorage.getItem('aot-lang') || 'tr';
  if (lang === 'tr') {
    if (mins < 60)  return `${mins} dakika önce`;
    if (mins < 1440) return `${Math.floor(mins/60)} saat önce`;
    return `${Math.floor(mins/1440)} gün önce`;
  } else {
    if (mins < 60)  return `${mins} minutes ago`;
    if (mins < 1440) return `${Math.floor(mins/60)} hours ago`;
    return `${Math.floor(mins/1440)} days ago`;
  }
}

// ═══ BAŞLAT ══════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  loadGoldPrice();
  loadStats();
  loadActivityStrip();
  loadFeed();
  calcSilver();
  updateCountdown();
  // Geri sayımı her saniye güncelle
  setInterval(updateCountdown, 1000);
  // Gold'u her 5 dakikada güncelle
  setInterval(loadGoldPrice, 300000);
});

// --- Modül dönüşümü: üst düzey semboller window üzerinden paylaşılır ---
declare global {
  var HOME_API: any;
  var RENDER: any;
  var loadGoldPrice: any;
  var PATCH_DATE: any;
  var updateCountdown: any;
  var loadStats: any;
  var animateCount: any;
  var ACTIVITY_ITEMS: any;
  var loadActivityStrip: any;
  var SILVER_BASE: any;
  var TIME_MULT: any;
  var PREM_MULT: any;
  var calcSilver: any;
  var heroSearchTimeout: any;
  var onHeroSearch: any;
  var heroSearchGo: any;
  var loadFeed: any;
  var renderFallbackFeed: any;
  var formatFeedAge: any;
}

let loadGoldPrice_windowOverride: any;
let updateCountdown_windowOverride: any;
let loadStats_windowOverride: any;
let animateCount_windowOverride: any;
let loadActivityStrip_windowOverride: any;
let calcSilver_windowOverride: any;
let onHeroSearch_windowOverride: any;
let heroSearchGo_windowOverride: any;
let loadFeed_windowOverride: any;
let renderFallbackFeed_windowOverride: any;
let formatFeedAge_windowOverride: any;

Object.defineProperty(window, 'HOME_API', {
  get: () => HOME_API,
  set: (value) => { HOME_API = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'RENDER', {
  get: () => RENDER,
  set: (value) => { RENDER = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'loadGoldPrice', {
  get: () => (loadGoldPrice_windowOverride !== undefined ? loadGoldPrice_windowOverride : loadGoldPrice),
  set: (value) => { loadGoldPrice_windowOverride = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'PATCH_DATE', {
  get: () => PATCH_DATE,
  set: (value) => { PATCH_DATE = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'updateCountdown', {
  get: () => (updateCountdown_windowOverride !== undefined ? updateCountdown_windowOverride : updateCountdown),
  set: (value) => { updateCountdown_windowOverride = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'loadStats', {
  get: () => (loadStats_windowOverride !== undefined ? loadStats_windowOverride : loadStats),
  set: (value) => { loadStats_windowOverride = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'animateCount', {
  get: () => (animateCount_windowOverride !== undefined ? animateCount_windowOverride : animateCount),
  set: (value) => { animateCount_windowOverride = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'ACTIVITY_ITEMS', {
  get: () => ACTIVITY_ITEMS,
  set: (value) => { ACTIVITY_ITEMS = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'loadActivityStrip', {
  get: () => (loadActivityStrip_windowOverride !== undefined ? loadActivityStrip_windowOverride : loadActivityStrip),
  set: (value) => { loadActivityStrip_windowOverride = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'SILVER_BASE', {
  get: () => SILVER_BASE,
  set: (value) => { SILVER_BASE = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'TIME_MULT', {
  get: () => TIME_MULT,
  set: (value) => { TIME_MULT = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'PREM_MULT', {
  get: () => PREM_MULT,
  set: (value) => { PREM_MULT = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'calcSilver', {
  get: () => (calcSilver_windowOverride !== undefined ? calcSilver_windowOverride : calcSilver),
  set: (value) => { calcSilver_windowOverride = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'heroSearchTimeout', {
  get: () => heroSearchTimeout,
  set: (value) => { heroSearchTimeout = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'onHeroSearch', {
  get: () => (onHeroSearch_windowOverride !== undefined ? onHeroSearch_windowOverride : onHeroSearch),
  set: (value) => { onHeroSearch_windowOverride = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'heroSearchGo', {
  get: () => (heroSearchGo_windowOverride !== undefined ? heroSearchGo_windowOverride : heroSearchGo),
  set: (value) => { heroSearchGo_windowOverride = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'loadFeed', {
  get: () => (loadFeed_windowOverride !== undefined ? loadFeed_windowOverride : loadFeed),
  set: (value) => { loadFeed_windowOverride = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'renderFallbackFeed', {
  get: () => (renderFallbackFeed_windowOverride !== undefined ? renderFallbackFeed_windowOverride : renderFallbackFeed),
  set: (value) => { renderFallbackFeed_windowOverride = value; },
  configurable: true, enumerable: true });
Object.defineProperty(window, 'formatFeedAge', {
  get: () => (formatFeedAge_windowOverride !== undefined ? formatFeedAge_windowOverride : formatFeedAge),
  set: (value) => { formatFeedAge_windowOverride = value; },
  configurable: true, enumerable: true });

export {};
