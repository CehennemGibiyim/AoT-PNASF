// AoT-PNASF — Haritalar v2 (Tam Yeniden Yazım)
// Zone kartları + Canvas harita + Avalon detayları

// ─── ZONE RENK & TİP SİSTEMİ ─────────────────────────────
const ZONE_COLORS = {
  SAFEAREA:  { bg:'#3b82f6', text:'#dbeafe', label:'Blue Zone',     dot:'zone-blue'    },
  YELLOW:    { bg:'#eab308', text:'#fefce8', label:'Yellow Zone',   dot:'zone-yellow'  },
  RED:       { bg:'#ef4444', text:'#fef2f2', label:'Red Zone',      dot:'zone-red'     },
  BLACK:     { bg:'#4b5563', text:'#f9fafb', label:'Black Zone',    dot:'zone-black'   },
  ROAD:      { bg:'#8b5cf6', text:'#f5f3ff', label:'Road of Avalon',dot:'zone-road'    },
  MIST:      { bg:'#06b6d4', text:'#ecfeff', label:'Mist Zone',     dot:'zone-mist'    },
  BRECILIEN: { bg:'#06b6d4', text:'#ecfeff', label:'Brecilien',     dot:'zone-mist'    },
  DEFAULT:   { bg:'#6b7280', text:'#f9fafb', label:'Bilinmiyor',    dot:'zone-default' },
};

function getZoneColor(zone) {
  const id  = (zone.id  || '').toUpperCase();
  const col = (zone.color || zone.type || zone.zone || '').toUpperCase();
  if (id.includes('BRECILIEN') || col.includes('BRECILIEN')) return ZONE_COLORS.BRECILIEN;
  if (id.includes('ROAD')  || col.includes('ROAD'))          return ZONE_COLORS.ROAD;
  if (id.includes('MIST')  || col.includes('MIST'))          return ZONE_COLORS.MIST;
  if (col.includes('SAFEAREA') || col.includes('BLUE'))      return ZONE_COLORS.SAFEAREA;
  if (col.includes('YELLOW'))                                return ZONE_COLORS.YELLOW;
  if (col.includes('RED'))                                   return ZONE_COLORS.RED;
  if (col.includes('BLACK') || col.includes('OUTLANDS'))     return ZONE_COLORS.BLACK;
  return ZONE_COLORS.DEFAULT;
}

// ─── STATE ────────────────────────────────────────────────
let zones = [], filteredZones = [], currentFilter = 'all';
let selectedZone = null, routeFrom = null, routeTo = null;
let currentRoute = null, pickerTarget = null;
let currentView = 'zones'; // 'zones' | 'map' | 'avalon'

// Leaflet state
let leafletMap = null;
let tileLayer = null;

const getLang = () => localStorage.getItem('aot-lang') || 'tr';

// ─── BAŞLAT ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadZones();
  initViewTabs();
  renderBonusSection();
  renderAvalonSection();
});

// ─── VIEW SEKME SİSTEMİ ───────────────────────────────────
function initViewTabs() {
  // Varsayılan görünüm: zone kartları
  switchView('zones');
}

function switchView(view) {
  currentView = view;
  document.querySelectorAll('.map-view-tab').forEach(t =>
    t.classList.toggle('active', t.dataset.view === view)
  );
  document.getElementById('view-zones').style.display  = view === 'zones'  ? 'block' : 'none';
  document.getElementById('view-map').style.display    = view === 'map'    ? 'flex'  : 'none';
  document.getElementById('view-avalon').style.display = view === 'avalon' ? 'block' : 'none';

  if (view === 'map') {
    if (!leafletMap && window.L) {
      setTimeout(() => initLeafletMap(), 50);
    }
  }
}

// ─── ZONE YÜKLEMESİ ──────────────────────────────────────
function loadZones() {
  if (window.AO_ZONES && window.AO_ZONES.length > 0) {
    zones = window.AO_ZONES;
    getAvalonZones().forEach(az => {
      if (!zones.find(z => z.id === az.id)) zones.push(az);
    });
  } else {
    zones = getStaticZones();
  }
  filteredZones = [...zones];
  const countEl = document.getElementById('zoneCount');
  if(countEl) countEl.textContent = zones.length.toLocaleString('tr-TR');
}

// ─── ZONE KARTLARI (Ana Görünüm) ───────────────────────────
function renderBonusSection() {
  const db  = window.AO_ZONE_BONUSES;
  const lang = getLang();
  const container = document.getElementById('bonus-section');
  if (!container || !db) return;

  // ─ Zone tipi genel bilgi kartları
  const zoneInfoHtml = Object.entries(db.zoneBonuses).map(([key, z]) => `
    <div class="zb-info-card" style="border-color:${z.color}33">
      <div class="zbi-header" style="background:${z.color}18;border-bottom:1px solid ${z.color}33">
        <span class="zbi-icon">${z.icon}</span>
        <span class="zbi-label" style="color:${z.color}">${z.label}</span>
        <span class="zbi-tier" style="background:${z.color}22;color:${z.color}">${z.resourceTier}</span>
      </div>
      <div class="zbi-body">
        <div class="zbi-desc">${z.description}</div>
        <div class="zbi-stats">
          <div class="zbi-stat"><span class="zbi-st-lbl">⚔️ PvP Riski</span><span class="zbi-st-val" style="color:${z.color}">${z.pvpRisk}</span></div>
          <div class="zbi-stat"><span class="zbi-st-lbl">💀 Eşya Kaybı</span><span class="zbi-st-val">${z.lootRisk}</span></div>
          <div class="zbi-stat"><span class="zbi-st-lbl">⭐ Bonus</span><span class="zbi-st-val">${z.generalBonus}</span></div>
        </div>
      </div>
    </div>`).join('');

  // ─ Şehir crafting kartları
  const cityHtml = db.cities.map(c => {
    const col = ZONE_COLORS[c.zone] || ZONE_COLORS.DEFAULT;
    const craftBonuses = c.bonuses.filter(b => b.type === 'craft');
    const refineBonuses = c.bonuses.filter(b => b.type === 'refine');
    const infoBonuses = c.bonuses.filter(b => b.type === 'info');
    return `
    <div class="city-card" onclick="selectCityCard('${c.id}', this)">
      <div class="cc-header" style="background:${col.bg}18;border-bottom:1px solid ${col.bg}33">
        <span class="cc-icon">${c.icon}</span>
        <div class="cc-title-wrap">
          <div class="cc-name">${c.name}</div>
          <div class="cc-region">${c.region || ''}</div>
        </div>
        <span class="cc-zone-badge" style="background:${col.bg}22;color:${col.bg}">
          <span style="width:7px;height:7px;border-radius:50%;background:${col.bg};display:inline-block"></span>
          ${col.label}
        </span>
      </div>
      <div class="cc-body">
        <div class="cc-desc">${c.description}</div>
        ${craftBonuses.length ? `
        <div class="cc-bonus-group">
          <div class="cc-bonus-title">⚔️ Craft Bonusları</div>
          ${craftBonuses.map(b => `
          <div class="cc-bonus-row">
            <span class="cc-bonus-icon">${b.icon}</span>
            <span class="cc-bonus-label">${b.label}</span>
            <span class="cc-bonus-val" style="color:#c9a84c">${b.value}</span>
          </div>`).join('')}
        </div>` : ''}
        ${refineBonuses.length ? `
        <div class="cc-bonus-group">
          <div class="cc-bonus-title">🔥 Rafine Bonusları</div>
          ${refineBonuses.map(b => `
          <div class="cc-bonus-row">
            <span class="cc-bonus-icon">${b.icon}</span>
            <span class="cc-bonus-label">${b.label}</span>
            <span class="cc-bonus-val" style="color:#06b6d4">${b.value}</span>
          </div>`).join('')}
        </div>` : ''}
        ${infoBonuses.length ? `
        <div class="cc-bonus-group">
          <div class="cc-bonus-title">ℹ️ Diğer</div>
          ${infoBonuses.map(b => `
          <div class="cc-bonus-row">
            <span class="cc-bonus-icon">${b.icon}</span>
            <span class="cc-bonus-label">${b.label}</span>
            <span class="cc-bonus-val">${b.value}</span>
          </div>`).join('')}
        </div>` : ''}
        <div class="cc-resources">
          ${(c.resources||[]).map(r => `<span class="cc-res-tag">${r}</span>`).join('')}
        </div>
      </div>
    </div>`;
  }).join('');

  // ─ Black zone kartları
  const blackHtml = db.blackZones.map(b => {
    const col = ZONE_COLORS.BLACK;
    return `
    <div class="city-card black-card">
      <div class="cc-header" style="background:${col.bg}18;border-bottom:1px solid ${col.bg}33">
        <span class="cc-icon">${b.icon}</span>
        <div class="cc-title-wrap">
          <div class="cc-name">${b.name}</div>
          <div class="cc-region">Outlands — Tam Kayıp PvP</div>
        </div>
        <span class="cc-zone-badge" style="background:${col.bg}22;color:#9ca3af">⚫ Black Zone</span>
      </div>
      <div class="cc-body">
        <div class="cc-desc">${b.description}</div>
        <div class="cc-bonus-group">
          ${b.bonuses.map(bonus => `
          <div class="cc-bonus-row">
            <span class="cc-bonus-icon">${bonus.icon}</span>
            <span class="cc-bonus-label">${bonus.label}</span>
            <span class="cc-bonus-val" style="color:#ef4444">${bonus.value}</span>
          </div>`).join('')}
        </div>
        <div class="cc-resources">
          ${b.resources.map(r => `<span class="cc-res-tag danger">${r}</span>`).join('')}
        </div>
      </div>
    </div>`;
  }).join('');

  container.innerHTML = `
    <div class="bs-section">
      <div class="bs-section-title">🗺️ Zone Tipleri & Risk Rehberi</div>
      <div class="zb-info-grid">${zoneInfoHtml}</div>
    </div>
    <div class="bs-section">
      <div class="bs-section-title">🏙️ Kraliyet Şehirleri — Crafting Bonusları</div>
      <div class="city-grid">${cityHtml}</div>
    </div>
    <div class="bs-section">
      <div class="bs-section-title">💀 Outlands — Black Zone Üsleri</div>
      <div class="city-grid">${blackHtml}</div>
    </div>`;
}

function selectCityCard(id, el) {
  document.querySelectorAll('.city-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
}

// ─── AVALON ROADS SEKSİYONU ───────────────────────────────
function renderAvalonSection() {
  const db = window.AO_ZONE_BONUSES;
  const container = document.getElementById('avalon-section');
  if (!container || !db) return;

  const roads = db.avalonRoads;
  const tiers  = [...new Set(roads.map(r => r.tier))].sort();
  const sizes  = ['2 Oyuncu', '7 Oyuncu', '20 Oyuncu'];

  // Filtre butonları
  const filterHtml = `
    <div class="av-filters">
      <button class="av-filter-btn active" onclick="filterAvalon('all',this)">Tümü</button>
      <button class="av-filter-btn" onclick="filterAvalon('2p',this)">👤 2p</button>
      <button class="av-filter-btn" onclick="filterAvalon('7p',this)">👥 7p</button>
      <button class="av-filter-btn" onclick="filterAvalon('20p',this)">🏰 20p</button>
      ${tiers.map(t => `<button class="av-filter-btn tier-btn" onclick="filterAvalonTier(${t},this)">T${t}</button>`).join('')}
    </div>`;

  const roadCards = roads.map(r => {
    const totalChests = (r.chests || []).reduce((sum, c) => sum + c.count, 0);
    const legendaryCount = (r.chests || []).filter(c => c.type === 'Legendary Chest').reduce((s,c) => s+c.count, 0);
    const tierColor = r.tier <= 5 ? '#22c55e' : r.tier <= 6 ? '#eab308' : r.tier <= 7 ? '#f97316' : '#ef4444';
    const sizeClass = r.capacity.includes('2') ? 'av-2p' : r.capacity.includes('7') ? 'av-7p' : 'av-20p';
    return `
    <div class="av-card ${sizeClass}" data-tier="${r.tier}" data-cap="${r.capacity}" onclick="selectAvalonCard(this)">
      <div class="av-card-header">
        <div class="av-card-top">
          <span class="av-tier-badge" style="background:${tierColor}22;color:${tierColor};border:1px solid ${tierColor}44">T${r.tier}</span>
          <span class="av-cap-badge">${r.capacity}</span>
          ${legendaryCount > 0 ? `<span class="av-legendary">👑 ${legendaryCount}x Legendary</span>` : ''}
        </div>
        <div class="av-name">${r.name}</div>
        <div class="av-exits">🚪 ${r.exits} çıkış portali</div>
      </div>
      <div class="av-card-body">
        <!-- Sandıklar -->
        <div class="av-chests-section">
          <div class="av-sub-title">📦 Sandıklar (${totalChests} adet)</div>
          <div class="av-chests-grid">
            ${(r.chests || []).map(c => {
              const ctInfo = db.chestTypes[c.type] || { icon:'📦', color:'#6b7280' };
              return `
              <div class="av-chest-item" style="border-color:${ctInfo.color}44">
                <span class="av-chest-icon" style="color:${ctInfo.color}">${ctInfo.icon}</span>
                <div class="av-chest-info">
                  <div class="av-chest-name">${c.type}</div>
                  <div class="av-chest-count" style="color:${ctInfo.color}">×${c.count} adet</div>
                  <div class="av-chest-loot">${c.loot}</div>
                </div>
              </div>`;
            }).join('')}
          </div>
        </div>
        <!-- Kaynaklar -->
        <div class="av-resources-section">
          <div class="av-sub-title">⛏️ Kaynaklar</div>
          <div class="av-res-list">
            ${(r.resources || []).map(res => `
            <div class="av-res-item">
              <span class="av-res-name">${res.name}</span>
              <span class="av-res-count">${res.count}</span>
              <span class="av-res-tier" style="color:${tierColor}">T${res.tier}</span>
            </div>`).join('')}
          </div>
        </div>
        <!-- Fame bonusu -->
        <div class="av-bonuses-row">
          ${(r.bonuses || []).map(b => `
          <div class="av-bonus-chip">
            <span>${b.icon}</span>
            <span>${b.label}: <strong>${b.value}</strong></span>
          </div>`).join('')}
        </div>
      </div>
    </div>`;
  }).join('');

  // Sandık tipi rehberi
  const chestGuideHtml = Object.entries(db.chestTypes).map(([name, info]) => `
    <div class="chest-guide-item">
      <span style="color:${info.color};font-size:20px">${info.icon}</span>
      <div>
        <div class="cgi-name">${name}</div>
        <div class="cgi-desc">${info.desc}</div>
      </div>
    </div>`).join('');

  container.innerHTML = `
    <div class="av-header-section">
      <div class="av-main-title">🟣 Roads of Avalon — Detaylı Harita Rehberi</div>
      <div class="av-main-desc">Avalon yolları her sunucu resetinde farklı bağlantılar oluşturur. Kapasite, tier ve sandık sayıları sabit kalır.</div>
    </div>
    ${filterHtml}
    <div class="av-cards-grid" id="avalonGrid">${roadCards}</div>
    <div class="bs-section" style="margin-top:28px">
      <div class="bs-section-title">📦 Sandık Tipi Rehberi</div>
      <div class="chest-guide-grid">${chestGuideHtml}</div>
    </div>`;
}

function filterAvalon(type, btn) {
  document.querySelectorAll('.av-filter-btn:not(.tier-btn)').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.av-card').forEach(card => {
    if (type === 'all') { card.style.display = ''; return; }
    const cap = card.dataset.cap || '';
    card.style.display = cap.includes(type === '2p' ? '2' : type === '7p' ? '7' : '20') ? '' : 'none';
  });
}

function filterAvalonTier(tier, btn) {
  document.querySelectorAll('.av-filter-btn.tier-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.av-card').forEach(card => {
    card.style.display = card.dataset.tier == tier ? '' : 'none';
  });
}

function selectAvalonCard(el) {
  document.querySelectorAll('.av-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
}

// ─── LEAFLET HARİTA SİSTEMİ (Gerçek Oyun Haritası) ───────────────────────────────────
function initLeafletMap() {
  const container = document.getElementById('mapCanvas');
  if (!container) return;

  // Leaflet map başlatma
  leafletMap = L.map('mapCanvas', {
    crs: L.CRS.Simple, // Gerçek dünya projeksiyonu yerine oyun haritası
    minZoom: 1,
    maxZoom: 7,
    zoomSnap: 0.5,
    attributionControl: false
  });

  // Kullanıcının albiononline2d'den sağladığı tile url'si
  // Formatımız https://cdn.albiononline2d.com/map/maptiles/{z}/map_{x}_{y}.png
  const tileUrl = 'https://cdn.albiononline2d.com/map/maptiles/{z}/map_{x}_{y}.png';

  tileLayer = L.tileLayer(tileUrl, {
    noWrap: true,
    tms: false,
    maxNativeZoom: 7
  }).addTo(leafletMap);

  // Haritanın merkezine odaklan (Yaklaşık bir başlangıç noktası, Royal Continent merkezi)
  leafletMap.setView([0, 0], 2);

  // Şehirleri görsel olarak haritaya ekleme (Temsili koordinatlar)
  addCityMarkers();
}

function addCityMarkers() {
  if (!leafletMap) return;

  // Şu an için elimizde tam koordinat listesi olmadığından geçici temsili butonlar eklenecek
  // Kullanıcı haritayı incelerken biz ilerleyen süreçte koordinatları oturtacağız.
  
  // Örnek: Tıkladığımızda koordinatları loglamak için
  leafletMap.on('click', function(e) {
    console.log("Haritaya tıklandı: LatLng", e.latlng);
  });
}

function drawMap() {
  // Leaflet otomatik render ettiği için bu metodu boş bırakıyoruz, sadece BFS state güncellemelerinde çalışabilir
}

function zoomIn()    { if(leafletMap) leafletMap.zoomIn(); }
function zoomOut()   { if(leafletMap) leafletMap.zoomOut(); }
function resetView() { if(leafletMap) leafletMap.setView([0, 0], 2); }


// ─── ZONE SEÇ & DETAY ─────────────────────────────────────
function selectZone(id) {
  selectedZone = zones.find(z => z.id === id) || null;
  renderZoneDetail();
}

function renderZoneDetail() {
  const empty = document.getElementById('detailEmpty');
  const cont  = document.getElementById('detailContent');
  const lang  = getLang();
  if (!selectedZone) { empty.style.display='block'; cont.style.display='none'; return; }
  empty.style.display = 'none';
  cont.style.display  = 'block';
  const z   = selectedZone;
  const col = getZoneColor(z);
  const exits = (z.exits || []).map(eid => zones.find(x => x.id === eid) || { id:eid, name:eid, color:'DEFAULT' });

  // Zone bonusunu bul
  const db = window.AO_ZONE_BONUSES;
  const zoneKey = (z.color || z.type || '').toUpperCase();
  const zBonus  = db ? db.zoneBonuses[zoneKey] : null;
  const cityData = db ? [...(db.cities||[]), ...(db.blackZones||[])].find(c => c.id === z.id) : null;

  cont.innerHTML = `
    <div class="detail-zone-name">${z.name || z.id}</div>
    <div class="detail-zone-id">${z.id}</div>
    <span class="detail-badge" style="background:${col.bg}22;color:${col.bg};border:1px solid ${col.bg}44">
      <span style="width:8px;height:8px;border-radius:50%;background:${col.bg};display:inline-block"></span>
      ${col.label}
    </span>
    ${zBonus ? `
    <div class="detail-section-title" style="margin-top:12px">${lang==='tr'?'Bölge Özellikleri':'Zone Properties'}</div>
    <div style="margin-bottom:12px">
      <div class="detail-stat"><span class="detail-stat-label">⚔️ PvP Riski</span><span class="detail-stat-val" style="color:${col.bg}">${zBonus.pvpRisk}</span></div>
      <div class="detail-stat"><span class="detail-stat-label">💀 Eşya Kaybı</span><span class="detail-stat-val">${zBonus.lootRisk}</span></div>
      <div class="detail-stat"><span class="detail-stat-label">⛏️ Kaynak Tier</span><span class="detail-stat-val">${zBonus.resourceTier}</span></div>
      <div class="detail-stat"><span class="detail-stat-label">⭐ Genel Bonus</span><span class="detail-stat-val" style="color:#c9a84c;font-size:10px">${zBonus.generalBonus}</span></div>
    </div>` : ''}
    ${cityData ? `
    <div class="detail-section-title">${lang==='tr'?'Şehir Bonusları':'City Bonuses'}</div>
    <div style="margin-bottom:12px">
      ${cityData.bonuses.map(b => `
      <div class="detail-stat">
        <span class="detail-stat-label">${b.icon} ${b.label}</span>
        <span class="detail-stat-val" style="color:${b.type==='craft'?'#c9a84c':b.type==='refine'?'#06b6d4':'var(--text-primary)'}">${b.value}</span>
      </div>`).join('')}
    </div>` : ''}
    <div class="detail-section-title">${lang==='tr'?'İstatistikler':'Statistics'}</div>
    <div style="margin-bottom:14px">
      <div class="detail-stat"><span class="detail-stat-label">${lang==='tr'?'Bağlantı':'Connections'}</span><span class="detail-stat-val">${exits.length}</span></div>
      <div class="detail-stat"><span class="detail-stat-label">Zone ID</span><span class="detail-stat-val">${z.id}</span></div>
      <div class="detail-stat"><span class="detail-stat-label">${lang==='tr'?'Tip':'Type'}</span><span class="detail-stat-val">${z.type || '—'}</span></div>
    </div>
    ${exits.length ? `
    <div class="detail-section-title">${lang==='tr'?'Bağlantılar':'Connections'} (${exits.length})</div>
    <div class="detail-exits">
      ${exits.map(e => {
        const ec = getZoneColor(e);
        return `<div class="detail-exit-item" onclick="selectZone('${e.id}')">
          <div style="width:8px;height:8px;border-radius:50%;background:${ec.bg};flex-shrink:0"></div>
          <span>${e.name || e.id}</span>
          <span style="margin-left:auto;font-size:10px;color:var(--text-muted)">${ec.label}</span>
        </div>`;
      }).join('')}
    </div>` : ''}
    <div style="margin-top:14px;padding-top:12px;border-top:1px solid var(--border)">
      <button class="route-calc-btn" style="width:100%;margin-bottom:6px"
        onclick="document.getElementById('routeFrom').value='${z.name||z.id}';routeFrom='${z.id}'">
        ${lang==='tr'?'Başlangıç Yap':'Set as Start'}
      </button>
      <button class="route-calc-btn" style="width:100%;background:var(--bg-card);color:var(--gold);border:1px solid var(--gold)"
        onclick="document.getElementById('routeTo').value='${z.name||z.id}';routeTo='${z.id}'">
        ${lang==='tr'?'Hedef Yap':'Set as Destination'}
      </button>
    </div>
    
    <!-- Hideout Crafting Simulator -->
    <div class="ho-sim-wrap" style="margin-top:20px; background:var(--bg-card); border:1px solid var(--border); border-radius:8px; padding:12px;">
      <div class="detail-section-title" style="margin:0 0 10px 0; color:var(--text-primary);">🛠️ Craft & Hideout Simülatörü</div>
      <div style="font-size:11px; color:var(--text-muted); margin-bottom:12px;">
        Seçili bölgenin (Black Zone veya Şehir) baz üretim bonusu üzerine Hideout/HQ seviyesi ve Focus (Odak) ekleyerek <strong>Net Geri Dönüş (RRR)</strong> oranını hesaplayın.
      </div>
      
      <div style="display:flex; flex-direction:column; gap:8px;">
        <div>
          <label style="font-size:11px; color:var(--text-muted); display:block; margin-bottom:2px;">Temel Bölge Bonusu (Örn: 18%)</label>
          <input type="number" id="simBaseBonus" value="0" style="width:100%; background:#0d1117; border:1px solid var(--border); color:white; padding:6px; border-radius:4px; font-size:12px;" onchange="calcSimRRR()" onkeyup="calcSimRRR()"/>
        </div>
        <div>
          <label style="font-size:11px; color:var(--text-muted); display:block; margin-bottom:2px;">Hideout Gücü / Seviyesi</label>
          <select id="simHoLevel" style="width:100%; background:#0d1117; border:1px solid var(--border); color:white; padding:6px; border-radius:4px; font-size:12px;" onchange="calcSimRRR()">
            <option value="0">Hideout Yok (Şehir/Açık Dünya)</option>
            <option value="1">Level 1 (HO / HQ 1) -> +%7 Bonus</option>
            <option value="2">Level 2 (HQ 2) -> +%14 Bonus</option>
            <option value="3">Level 3 (HQ 3+) -> +%21 Bonus</option>
          </select>
        </div>
        <div style="display:flex; align-items:center; gap:8px; margin-top:4px;">
          <input type="checkbox" id="simFocus" style="cursor:pointer" onchange="calcSimRRR()"/>
          <label for="simFocus" style="font-size:12px; color:var(--text-primary); cursor:pointer">Odak (Focus) Kullan (+43.5% Base)</label>
        </div>
      </div>
      
      <div style="margin-top:14px; padding:10px; background:#0d1117; border-radius:6px; text-align:center; border:1px solid var(--border);">
        <div style="font-size:11px; color:var(--text-muted); margin-bottom:4px;">Net Kaynak Geri Dönüşü (RRR)</div>
        <div id="simResult" style="font-size:18px; font-weight:600; color:var(--gold);">%0.0</div>
      </div>
    </div>`;
    
    // Default base bonusu seçili zona göre tespit etme
    setTimeout(() => {
        let defaultBonus = 0;
        // BZ bölge kalite bonusu veya şehirlerin base craft bonusları
        if (col.bg === '#4b5563') defaultBonus = 18; // Black Zone varsayılan
        if (col.bg === '#3b82f6') defaultBonus = 15.2; // Royal Şehir varsayılanı (Focus'suz salt)
        const inpt = document.getElementById('simBaseBonus');
        if (inpt) { inpt.value = defaultBonus; calcSimRRR(); }
    }, 50);
}

// Net RRR = 1 - 1 / (1 + (ToplamBonus/100))
window.calcSimRRR = function() {
    const base = parseFloat(document.getElementById('simBaseBonus').value) || 0;
    const ho = parseInt(document.getElementById('simHoLevel').value) || 0;
    const focus = document.getElementById('simFocus').checked;
    
    // Albion Online RRR production formulü: Yüzde bonuslar toplanır
    // HO levelleri ortalama +7, +14, +21 production bonus ekler
    let totalProd = base;
    if (ho === 1) totalProd += 7.0;
    if (ho === 2) totalProd += 14.0;
    if (ho === 3) totalProd += 21.0;
    if (focus) totalProd += 43.5;
    
    // RRR Formulü
    const rrr = 1 - (1 / (1 + (totalProd / 100)));
    const percentage = rrr * 100;
    
    document.getElementById('simResult').innerHTML = '<span style="color:#22c55e">+' + parseFloat(totalProd).toFixed(1) + '% Bonus</span> <br> %' + percentage.toFixed(2) + ' RRR';
}


// ─── ARAMA ────────────────────────────────────────────────
let searchTimer;
function onMapSearch(val) {
  clearTimeout(searchTimer);
  const dd = document.getElementById('mapSearchDd');
  if (!val || val.length < 2) { if(dd) dd.classList.remove('open'); return; }
  searchTimer = setTimeout(() => {
    const q = val.toLowerCase();
    const results = zones.filter(z => (z.name||z.id).toLowerCase().includes(q) || z.id.toLowerCase().includes(q)).slice(0, 20);
    if (!results.length || !dd) { dd && dd.classList.remove('open'); return; }
    dd.innerHTML = results.map(z => {
      const col = getZoneColor(z);
      return `<div class="map-dd-item" onclick="selectZone('${z.id}');document.getElementById('mapSearch').value='';document.getElementById('mapSearchDd').classList.remove('open')">
        <div class="map-dd-dot ${col.dot}"></div>
        <div><div style="font-weight:500;color:var(--text-primary)">${z.name||z.id}</div><div style="font-size:10px;color:var(--text-muted)">${col.label} • ${z.id}</div></div>
      </div>`;
    }).join('');
    // position:fixed koordinatlarını input'un pozisyonuna göre ayarla
    const inp = document.getElementById('mapSearch');
    if (inp) {
      const rect = inp.getBoundingClientRect();
      dd.style.top    = (rect.bottom + 6) + 'px';
      dd.style.left   = rect.left + 'px';
      dd.style.width  = Math.max(rect.width, 300) + 'px';
    }
    dd.classList.add('open');
  }, 180);
}

document.addEventListener('click', e => {
  if (!e.target.closest('.mvb-search-wrap') && !e.target.closest('.mkt-search-dd')) {
    document.getElementById('mapSearchDd')?.classList.remove('open');
  }
});


// ─── FİLTRE ───────────────────────────────────────────────
function filterZones(type, btn) {
  currentFilter = type;
  document.querySelectorAll('.map-filter-btn').forEach(b => b.classList.toggle('active', b === btn));
  filteredZones = type === 'all' ? [...zones] : zones.filter(z => {
    const col = (z.color || z.type || '').toUpperCase();
    const id  = (z.id || '').toUpperCase();
    if (type === 'ROAD')     return id.includes('ROAD') || col.includes('ROAD');
    if (type === 'SAFEAREA') return col.includes('SAFEAREA') || col.includes('BLUE');
    return col.includes(type);
  });
  const countEl = document.getElementById('zoneCount');
  if(countEl) countEl.textContent = filteredZones.length.toLocaleString('tr-TR');
}

// ─── ROTA HESAPLAMA (BFS) ─────────────────────────────────
function calcRoute() {
  const lang = getLang();
  if (!routeFrom || !routeTo) { alert(lang==='tr'?'Başlangıç ve hedef zone seçin.':'Select start and destination zones.'); return; }
  if (routeFrom === routeTo)  { alert(lang==='tr'?'Başlangıç ve hedef aynı olamaz.':'Start and destination cannot be same.'); return; }
  const queue = [[routeFrom]], visited = new Set([routeFrom]);
  let found = null;
  while (queue.length && !found) {
    const path = queue.shift(), cur = path[path.length - 1];
    const zone = zones.find(z => z.id === cur);
    if (!zone) continue;
    for (const exit of (zone.exits || [])) {
      if (visited.has(exit)) continue;
      visited.add(exit);
      const np = [...path, exit];
      if (exit === routeTo) { found = np; break; }
      queue.push(np);
    }
  }
  if (!found) {
    document.getElementById('routeSteps').innerHTML = `<p style="color:var(--text-muted);font-size:13px;padding:12px 0">${lang==='tr'?'Bu iki zone arasında bağlantı bulunamadı.':'No connection found.'}</p>`;
    document.getElementById('routeStats').innerHTML = '';
    document.getElementById('routeResult').style.display = 'block';
    currentRoute = null; return;
  }
  currentRoute = { path: found };
  renderRouteResult(found);
}

function renderRouteResult(path) {
  const lang = getLang();
  const rs = document.getElementById('routeSteps'), stats = document.getElementById('routeStats');
  rs.innerHTML = path.map((id, i) => {
    const z = zones.find(x => x.id === id) || { id, name:id, color:'DEFAULT' };
    const col = getZoneColor(z);
    return `<div class="route-step">
      <div class="route-step-num">${i+1}</div>
      <div style="width:8px;height:8px;border-radius:50%;background:${col.bg};flex-shrink:0"></div>
      <div><div class="route-step-name">${z.name||z.id}</div><div class="route-step-type">${col.label}</div></div>
    </div>`;
  }).join('');
  const typeCount = {};
  path.forEach(id => { const z = zones.find(x => x.id === id)||{color:'DEFAULT'}; const l=getZoneColor(z).label; typeCount[l]=(typeCount[l]||0)+1; });
  stats.innerHTML = `<div class="rr-stat"><strong>${path.length}</strong> zone</div><div class="rr-stat"><strong>${path.length-1}</strong> geçiş</div>
    ${Object.entries(typeCount).map(([t,c]) => `<div class="rr-stat"><strong>${c}</strong> ${t}</div>`).join('')}`;
  document.getElementById('routeResult').style.display = 'block';
}

function clearRoute() {
  currentRoute = null; routeFrom = null; routeTo = null;
  document.getElementById('routeFrom').value = '';
  document.getElementById('routeTo').value   = '';
  document.getElementById('routeResult').style.display = 'none';
}

function swapRoute() {
  const tmp = routeFrom; routeFrom = routeTo; routeTo = tmp;
  const fe = document.getElementById('routeFrom'), te = document.getElementById('routeTo');
  const tv = fe.value; fe.value = te.value; te.value = tv;
}

// ─── ZONE PİCKER ─────────────────────────────────────────
function openZonePicker(target) {
  pickerTarget = target;
  const lang = getLang();
  document.getElementById('zpmTitle').textContent = target==='from' ? (lang==='tr'?'Başlangıç Zone':'Start Zone') : (lang==='tr'?'Hedef Zone':'Destination Zone');
  document.getElementById('zpmSearch').value = '';
  renderZonePicker('');
  document.getElementById('zonePickerOverlay').classList.add('open');
  document.getElementById('zonePickerModal').classList.add('open');
  document.getElementById('zpmSearch').focus();
}
function closeZonePicker() {
  document.getElementById('zonePickerOverlay').classList.remove('open');
  document.getElementById('zonePickerModal').classList.remove('open');
}
function filterZonePicker(val) { renderZonePicker(val); }
function renderZonePicker(search) {
  const list = document.getElementById('zpmList'), q = search.toLowerCase();
  const src  = search ? zones.filter(z => (z.name||z.id).toLowerCase().includes(q)) : zones;
  list.innerHTML = src.slice(0,100).map(z => {
    const col = getZoneColor(z);
    return `<div class="zpm-item" onclick="pickZone('${z.id}','${(z.name||z.id).replace(/'/g,"\\'")}')">
      <div style="width:10px;height:10px;border-radius:50%;background:${col.bg};flex-shrink:0"></div>
      <div><div class="zpm-item-name">${z.name||z.id}</div><div class="zpm-item-id">${z.id} · ${col.label}</div></div>
    </div>`;
  }).join('');
}
function pickZone(id, name) {
  if (pickerTarget === 'from') { routeFrom=id; document.getElementById('routeFrom').value=name; }
  else { routeTo=id; document.getElementById('routeTo').value=name; }
  closeZonePicker();
}

// ─── STATİK ZONE FALLBACK ─────────────────────────────────
function getAvalonZones() {
  return [
    {id:'ROAD_2P_001',name:'Road of Avalon (2p)',color:'ROAD',type:'ROAD',exits:['ROAD_2P_002','ROAD_7P_001'],road:true},
    {id:'ROAD_2P_002',name:'Road of Avalon (2p)',color:'ROAD',type:'ROAD',exits:['ROAD_2P_001','ROAD_7P_002'],road:true},
    {id:'ROAD_7P_001',name:'Road of Avalon (7p)',color:'ROAD',type:'ROAD',exits:['ROAD_2P_001','ROAD_7P_002','ROAD_20P_001'],road:true},
    {id:'ROAD_7P_002',name:'Road of Avalon (7p)',color:'ROAD',type:'ROAD',exits:['ROAD_7P_001','ROAD_20P_002'],road:true},
    {id:'ROAD_20P_001',name:'Road of Avalon (20p)',color:'ROAD',type:'ROAD',exits:['ROAD_7P_001','ROAD_20P_002'],road:true},
    {id:'ROAD_20P_002',name:'Road of Avalon (20p)',color:'ROAD',type:'ROAD',exits:['ROAD_20P_001','ROAD_7P_002'],road:true},
  ];
}

function getStaticZones() {
  return [
    {id:'CAERLEON',name:'Caerleon',color:'SAFEAREA',type:'CITY',exits:['SWAMP_BRIDGEWATCH_ACCESS','HIGHLAND_MARTLOCK_ACCESS','STEPPE_THETFORD_ACCESS','FOREST_LYMHURST_ACCESS','MOUNTAIN_FORTSTERLING_ACCESS']},
    {id:'SWAMP_BRIDGEWATCH_ACCESS',name:'Bridgewatch',color:'SAFEAREA',type:'CITY',exits:['CAERLEON']},
    {id:'HIGHLAND_MARTLOCK_ACCESS',name:'Martlock',color:'SAFEAREA',type:'CITY',exits:['CAERLEON']},
    {id:'STEPPE_THETFORD_ACCESS',name:'Thetford',color:'SAFEAREA',type:'CITY',exits:['CAERLEON']},
    {id:'FOREST_LYMHURST_ACCESS',name:'Lymhurst',color:'SAFEAREA',type:'CITY',exits:['CAERLEON']},
    {id:'MOUNTAIN_FORTSTERLING_ACCESS',name:'Fort Sterling',color:'SAFEAREA',type:'CITY',exits:['CAERLEON']},
    {id:'ARTHURSREST',name:"Arthur's Rest",color:'BLACK',type:'REST',exits:['MERLINSREST','MORGANASREST']},
    {id:'MERLINSREST',name:"Merlyn's Rest",color:'BLACK',type:'REST',exits:['ARTHURSREST','MORGANASREST']},
    {id:'MORGANASREST',name:"Morgana's Rest",color:'BLACK',type:'REST',exits:['ARTHURSREST','MERLINSREST']},
    {id:'BRECILIEN',name:'Brecilien',color:'MIST',type:'CITY',exits:[]},
    {id:'REDZONE_01',name:'Red Zone (Örnek)',color:'RED',type:'REDZONE',exits:['CAERLEON']},
    {id:'YELLOWZONE_01',name:'Yellow Zone (Örnek)',color:'YELLOW',type:'YELLOWZONE',exits:['CAERLEON']},
    ...getAvalonZones(),
  ];
}
