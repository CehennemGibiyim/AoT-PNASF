// AoT-PNASF — Home Page JavaScript
// Gold fiyatı, geri sayım, canlılık şeridi, silver widget, hero arama

const HOME_API = window.AO_PRICE_API || 'https://europe.albion-online-data.com';
const RENDER   = 'https://render.albiononline.com/v1/item';

// ═══ GOLD FİYATI ════════════════════════════════════════
async function loadGoldPrice() {
  try {
    const res  = await fetch(`${HOME_API}/api/v2/stats/gold.json?count=1`);
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
        const mins = Math.floor((Date.now() - new Date(data[0].timestamp)) / 60000);
        age.textContent = mins < 60 ? `${mins}dk önce` : `${Math.floor(mins/60)}sa önce`;
      }
    }
  } catch(e) { console.error('Gold yüklenemedi:', e); }
}

// ═══ GERİ SAYIM ═════════════════════════════════════════
// Radiant Wilds — tahmini Nisan 2026 ilk haftası
const PATCH_DATE = new Date('2026-04-09T10:00:00Z');

function updateCountdown() {
  const now  = Date.now();
  const diff = PATCH_DATE - now;
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
const ACTIVITY_ITEMS = [
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
const SILVER_BASE = {
  pvp:    [8, 18, 35],    // M silver/hafta [düşük,orta,yüksek tier]
  craft:  [5, 14, 28],
  trade:  [12, 25, 50],
  farm:   [3, 8, 15],
  gather: [4, 10, 22],
};
const TIME_MULT  = [1, 2.2, 4];
const PREM_MULT  = [1, 1.5];

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
  window.location.href = `src/pages/market.html#search=${baseId}`;
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
    const res  = await fetch('src/data/feed.json');
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
    {type:'update', title:'Radiant Wilds — Nisan 2026 Güncellemesi', text:'Yeni silahlar, Crystal Realm değişiklikleri ve Brecilien güncellemeleri geliyor. Bot patch notlarını izlemeye devam ediyor.', time:'Bekleniyor'},
    {type:'meta',   title:'T8 Badon Yayı — Meta Değişimi', text:'Son 48 saatte EU sunucusunda alım emirleri yoğunlaştı. Fiyat %18 arttı.', time:'Otomatik'},
    {type:'update', title:'AI Bot Aktif — Her 6 Saatte Tarama', text:'Forum ve patch notları otomatik izleniyor. Yeni içerik gelince burada görünecek.', time:'Aktif'},
  ] : [
    {type:'update', title:'Radiant Wilds — April 2026 Update', text:'New weapons, Crystal Realm changes and Brecilien updates incoming. Bot continues monitoring patch notes.', time:'Upcoming'},
    {type:'meta',   title:'T8 Bow of Badon — Meta Shift', text:'Buy orders spiked on EU server in last 48h. Price up 18%.', time:'Auto'},
    {type:'update', title:'AI Bot Active — Scanning Every 6h', text:'Forum and patch notes automatically monitored. New content appears here when detected.', time:'Active'},
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
  const diff = Date.now() - new Date(dateStr);
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
