// AoT-PNASF — AI Smart Feed
// Güncelleme verileri src/data/feed.json dosyasından gelir
// Bot bu dosyayı otomatik günceller

async function loadFeed() {
  const grid = document.getElementById('feedGrid');
  if (!grid) return;

  try {
    const res = await fetch('src/data/feed.json');
    const data = await res.json();
    renderFeed(data.updates.slice(0, 6));
  } catch(e) {
    // Veri çekilemediyse statik göster
    renderFeed(getFallbackFeed());
  }
}

function renderFeed(updates) {
  const grid = document.getElementById('feedGrid');
  const lang = localStorage.getItem('aot-lang') || 'tr';

  const typeColors = {
    'patch':   { bg: 'rgba(201,168,76,0.1)',  border: 'rgba(201,168,76,0.25)',  color: '#c9a84c', label: { tr: 'Patch', en: 'Patch' } },
    'item':    { bg: 'rgba(0,212,170,0.1)',   border: 'rgba(0,212,170,0.25)',   color: '#00d4aa', label: { tr: 'Yeni Eşya', en: 'New Item' } },
    'balance': { bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.25)',   color: '#ef4444', label: { tr: 'Balance', en: 'Balance' } },
    'zone':    { bg: 'rgba(59,130,246,0.1)',  border: 'rgba(59,130,246,0.25)',  color: '#3b82f6', label: { tr: 'Zone', en: 'Zone' } },
    'event':   { bg: 'rgba(168,85,247,0.1)',  border: 'rgba(168,85,247,0.25)', color: '#a855f7', label: { tr: 'Etkinlik', en: 'Event' } },
    'guide':   { bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.25)',   color: '#22c55e', label: { tr: 'Rehber', en: 'Guide' } },
  };

  grid.innerHTML = updates.map(u => {
    const tc = typeColors[u.type] || typeColors['patch'];
    const title = lang === 'tr' ? (u.title_tr || u.title) : (u.title_en || u.title);
    const desc  = lang === 'tr' ? (u.desc_tr  || u.desc)  : (u.desc_en  || u.desc);
    const typeLabel = tc.label[lang] || u.type;
    return `
      <div class="feed-card">
        <span class="feed-card-type" style="background:${tc.bg};border:1px solid ${tc.border};color:${tc.color}">${typeLabel}</span>
        <div class="feed-card-title">${title}</div>
        <div class="feed-card-desc">${desc}</div>
        <div class="feed-card-date">${u.date}</div>
      </div>`;
  }).join('');
}

function getFallbackFeed() {
  return [
    { type: 'patch',   title_tr: 'AI Feed Hazırlanıyor',   title_en: 'AI Feed Loading',     desc_tr: 'Bot ilk taramayı yapıyor. Kısa süre içinde Albion güncellemeleri burada görünecek.', desc_en: 'Bot is running its first scan. Albion updates will appear here shortly.', date: '2025' },
    { type: 'item',    title_tr: 'Yeni Eşyalar İzleniyor', title_en: 'New Items Tracked',   desc_tr: 'GameInfo API\'den yeni item ID\'leri otomatik tespit edilecek.', desc_en: 'New item IDs from GameInfo API will be auto-detected.', date: '2025' },
    { type: 'zone',    title_tr: 'Zone Verileri Aktif',     title_en: 'Zone Data Active',    desc_tr: 'Harita modülü tüm zone, biome ve şehir verilerini yüklüyor.', desc_en: 'Map module loading all zone, biome and city data.', date: '2025' },
  ];
}

document.addEventListener('DOMContentLoaded', loadFeed);

// Dil değişince feed'i yeniden render et
const origToggle = window.toggleLang;
window.toggleLang = function() {
  if (origToggle) origToggle();
  setTimeout(() => loadFeed(), 50);
};
