// AoT-PNASF — Haritalar v1
// world-data.js'den zone verisi çeker, canvas üzerinde gösterir
// BFS ile rota hesaplama

// ─── ZONE RENK & TİP SİSTEMİ ────────────────────────────
const ZONE_COLORS = {
  SAFEAREA:   { bg:'#3b82f6', text:'#dbeafe', label:'Blue Zone',   dot:'zone-blue'     },
  YELLOW:     { bg:'#eab308', text:'#fefce8', label:'Yellow Zone',  dot:'zone-yellow'   },
  RED:        { bg:'#ef4444', text:'#fef2f2', label:'Red Zone',     dot:'zone-red'      },
  BLACK:      { bg:'#4b5563', text:'#f9fafb', label:'Black Zone',   dot:'zone-black'    },
  ROAD:       { bg:'#8b5cf6', text:'#f5f3ff', label:'Road of Avalon',dot:'zone-road'   },
  MIST:       { bg:'#06b6d4', text:'#ecfeff', label:'Mist Zone',    dot:'zone-mist'     },
  BRECILIEN:  { bg:'#06b6d4', text:'#ecfeff', label:'Brecilien',    dot:'zone-mist'     },
  DEFAULT:    { bg:'#6b7280', text:'#f9fafb', label:'Unknown',      dot:'zone-default'  },
};

function getZoneColor(zone) {
  const id  = (zone.id || '').toUpperCase();
  const col = (zone.color || zone.type || '').toUpperCase();
  if (id.includes('BRECILIEN') || col.includes('BRECILIEN')) return ZONE_COLORS.BRECILIEN;
  if (id.includes('ROAD') || col.includes('ROAD'))           return ZONE_COLORS.ROAD;
  if (id.includes('MIST') || col.includes('MIST'))           return ZONE_COLORS.MIST;
  if (col.includes('SAFEAREA') || col.includes('BLUE'))      return ZONE_COLORS.SAFEAREA;
  if (col.includes('YELLOW'))                                return ZONE_COLORS.YELLOW;
  if (col.includes('RED'))                                   return ZONE_COLORS.RED;
  if (col.includes('BLACK') || col.includes('OUTLANDS'))     return ZONE_COLORS.BLACK;
  return ZONE_COLORS.DEFAULT;
}

function getZoneDotClass(zone) {
  return getZoneColor(zone).dot;
}

// ─── STATE ────────────────────────────────────────────────
let zones         = [];
let filteredZones = [];
let currentFilter = 'all';
let selectedZone  = null;
let routeFrom     = null;
let routeTo       = null;
let currentRoute  = null;
let pickerTarget  = null;

// Canvas state
let canvas, ctx;
let camX = 0, camY = 0, zoom = 1;
let isDragging = false, dragStartX = 0, dragStartY = 0;
let nodePositions = new Map(); // zoneId → {x, y}

const getLang = () => localStorage.getItem('aot-lang') || 'tr';

// ─── BAŞLAT ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  canvas = document.getElementById('mapCanvas');
  ctx    = canvas.getContext('2d');
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Canvas mouse events
  canvas.addEventListener('mousedown',  onMouseDown);
  canvas.addEventListener('mousemove',  onMouseMove);
  canvas.addEventListener('mouseup',    onMouseUp);
  canvas.addEventListener('mouseleave', onMouseUp);
  canvas.addEventListener('wheel',      onWheel, { passive:false });
  canvas.addEventListener('click',      onCanvasClick);
  canvas.addEventListener('touchstart', onTouchStart, { passive:false });
  canvas.addEventListener('touchmove',  onTouchMove,  { passive:false });
  canvas.addEventListener('touchend',   onTouchEnd);

  loadZones();
});

// ─── ZONE YÜKLEMESİ ──────────────────────────────────────
function loadZones() {
  if (window.AO_ZONES && window.AO_ZONES.length > 0) {
    zones = window.AO_ZONES;
    initMap();
  } else {
    // world-data.js henüz Data Sync botu tarafından üretilmemiş
    // Statik temel zone'ları kullan
    zones = getStaticZones();
    initMap();
  }
}

function initMap() {
  filteredZones = [...zones];
  renderZoneList();
  buildNodePositions();
  drawMap();
  document.getElementById('zoneCount').textContent = zones.length.toLocaleString('tr-TR');
}

// ─── STATİK TEMEL ZONE'LAR (world-data.js yokken fallback) ──
function getStaticZones() {
  return [
    // Royal Cities
    {id:'CAERLEON',       name:'Caerleon',       color:'SAFEAREA', type:'CITY',   exits:['SWAMP_BRIDGEWATCH_ACCESS','HIGHLAND_MARTLOCK_ACCESS','STEPPE_THETFORD_ACCESS','FOREST_LYMHURST_ACCESS','MOUNTAIN_FORTSTERLING_ACCESS']},
    {id:'SWAMP_BRIDGEWATCH_ACCESS', name:'Bridgewatch',  color:'YELLOW',   type:'CITY',   exits:['CAERLEON']},
    {id:'HIGHLAND_MARTLOCK_ACCESS', name:'Martlock',     color:'YELLOW',   type:'CITY',   exits:['CAERLEON']},
    {id:'STEPPE_THETFORD_ACCESS',   name:'Thetford',     color:'YELLOW',   type:'CITY',   exits:['CAERLEON']},
    {id:'FOREST_LYMHURST_ACCESS',   name:'Lymhurst',     color:'YELLOW',   type:'CITY',   exits:['CAERLEON']},
    {id:'MOUNTAIN_FORTSTERLING_ACCESS', name:'Fort Sterling', color:'YELLOW', type:'CITY', exits:['CAERLEON']},
    // Outlands Rests
    {id:'ARTHURSREST',    name:"Arthur's Rest",   color:'BLACK',    type:'REST',   exits:['MERLINSREST','MORGANASREST']},
    {id:'MERLINSREST',    name:"Merlyn's Rest",   color:'BLACK',    type:'REST',   exits:['ARTHURSREST','MORGANASREST']},
    {id:'MORGANASREST',   name:"Morgana's Rest",  color:'BLACK',    type:'REST',   exits:['ARTHURSREST','MERLINSREST']},
    // Mist
    {id:'BRECILIEN',      name:'Brecilien',       color:'MIST',     type:'CITY',   exits:[]},
    // Example zones
    {id:'BLACKZONE_01',   name:'Black Zone 1',    color:'BLACK',    type:'BLACKZONE', exits:['BLACKZONE_02','ARTHURSREST']},
    {id:'BLACKZONE_02',   name:'Black Zone 2',    color:'BLACK',    type:'BLACKZONE', exits:['BLACKZONE_01','MERLINSREST']},
    {id:'REDZONE_01',     name:'Red Zone 1',      color:'RED',      type:'REDZONE',   exits:['CAERLEON','REDZONE_02']},
    {id:'REDZONE_02',     name:'Red Zone 2',      color:'RED',      type:'REDZONE',   exits:['REDZONE_01']},
    {id:'YELLOWZONE_01',  name:'Yellow Zone 1',   color:'YELLOW',   type:'YELLOWZONE', exits:['CAERLEON','YELLOWZONE_02']},
    {id:'YELLOWZONE_02',  name:'Yellow Zone 2',   color:'YELLOW',   type:'YELLOWZONE', exits:['YELLOWZONE_01']},

  // ── Avalon Roads (fallback — world-data.js yokken)
  {id:'ROAD_2P_001',name:'Road of Avalon (2p #1)',color:'ROAD',type:'ROAD',exits:['ROAD_2P_002','ROAD_7P_001'],road:true},
  {id:'ROAD_2P_002',name:'Road of Avalon (2p #2)',color:'ROAD',type:'ROAD',exits:['ROAD_2P_001','ROAD_2P_003'],road:true},
  {id:'ROAD_2P_003',name:'Road of Avalon (2p #3)',color:'ROAD',type:'ROAD',exits:['ROAD_2P_002'],road:true},
  {id:'ROAD_7P_001',name:'Road of Avalon (7p #1)',color:'ROAD',type:'ROAD',exits:['ROAD_2P_001','ROAD_7P_002','ROAD_20P_001'],road:true},
  {id:'ROAD_7P_002',name:'Road of Avalon (7p #2)',color:'ROAD',type:'ROAD',exits:['ROAD_7P_001','ROAD_7P_003'],road:true},
  {id:'ROAD_7P_003',name:'Road of Avalon (7p #3)',color:'ROAD',type:'ROAD',exits:['ROAD_7P_002'],road:true},
  {id:'ROAD_20P_001',name:'Road of Avalon (20p #1)',color:'ROAD',type:'ROAD',exits:['ROAD_7P_001','ROAD_20P_002'],road:true},
  {id:'ROAD_20P_002',name:'Road of Avalon (20p #2)',color:'ROAD',type:'ROAD',exits:['ROAD_20P_001'],road:true},
    {id:'ROAD_01',        name:'Road of Avalon 1',color:'ROAD',     type:'ROAD',      exits:['ROAD_02']},
    {id:'ROAD_02',        name:'Road of Avalon 2',color:'ROAD',     type:'ROAD',      exits:['ROAD_01']},
  ];
}

// ─── ZONE POZİSYON HESAPLAMA ──────────────────────────────
function buildNodePositions() {
  // BFS ile zone bağlantılarına göre ağaç pozisyon hesapla
  nodePositions.clear();
  if (!zones.length) return;

  // Caerleon merkeze
  const center = zones.find(z => z.id === 'CAERLEON') || zones[0];
  const W = 900, H = 700;
  nodePositions.set(center.id, { x: W/2, y: H/2 });

  // BFS ile pozisyon dağıt
  const visited = new Set([center.id]);
  const queue   = [{ id: center.id, depth: 0, angle: 0 }];
  const angleMap = new Map([[center.id, 0]]);
  const depthCount = new Map([[0, 1]]);

  while (queue.length) {
    const { id, depth } = queue.shift();
    const zone = zones.find(z => z.id === id);
    if (!zone) continue;
    const exits = zone.exits || [];
    const unvisited = exits.filter(e => !visited.has(e) && zones.find(z => z.id === e));

    unvisited.forEach((exitId, i) => {
      visited.add(exitId);
      const parentPos = nodePositions.get(id) || { x: W/2, y: H/2 };
      const parentAngle = angleMap.get(id) || 0;
      const spread = Math.PI * 1.2;
      const angleStep = unvisited.length > 1 ? spread / (unvisited.length - 1) : 0;
      const angle = parentAngle - spread/2 + i * angleStep;
      const dist = Math.max(80, 160 - depth * 20);
      const x = Math.max(30, Math.min(W-30, parentPos.x + Math.cos(angle) * dist));
      const y = Math.max(30, Math.min(H-30, parentPos.y + Math.sin(angle) * dist));
      nodePositions.set(exitId, { x, y });
      angleMap.set(exitId, angle);
      queue.push({ id: exitId, depth: depth + 1, angle });
    });
  }

  // Pozisyon verilemeyen zone'lar için grid
  let gridX = 50, gridY = 50;
  zones.forEach(z => {
    if (!nodePositions.has(z.id)) {
      nodePositions.set(z.id, { x: gridX, y: gridY });
      gridX += 80;
      if (gridX > W - 50) { gridX = 50; gridY += 60; }
    }
  });
}

// ─── CANVAS ───────────────────────────────────────────────
function resizeCanvas() {
  if (!canvas) return;
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width  = rect.width  || 800;
  canvas.height = rect.height || 600;
  drawMap();
}

function drawMap() {
  if (!ctx || !canvas) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Arka plan
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg-base').trim() || '#0d1117';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(camX + canvas.width/2, camY + canvas.height/2);
  ctx.scale(zoom, zoom);

  const visibleZones = currentFilter === 'all' ? zones : filteredZones;

  // Önce bağlantıları çiz
  visibleZones.forEach(zone => {
    const from = nodePositions.get(zone.id);
    if (!from) return;
    (zone.exits || []).forEach(exitId => {
      const to = nodePositions.get(exitId);
      if (!to) return;
      const isRoute = currentRoute && isRouteEdge(zone.id, exitId);
      ctx.beginPath();
      ctx.moveTo(from.x - 450, from.y - 350);
      ctx.lineTo(to.x - 450,   to.y - 350);
      ctx.strokeStyle = isRoute ? '#c9a84c' : 'rgba(255,255,255,0.08)';
      ctx.lineWidth   = isRoute ? 3 : 1;
      ctx.stroke();
    });
  });

  // Sonra node'ları çiz
  visibleZones.forEach(zone => {
    const pos = nodePositions.get(zone.id);
    if (!pos) return;
    const px = pos.x - 450;
    const py = pos.y - 350;
    const col = getZoneColor(zone);
    const isSelected = selectedZone?.id === zone.id;
    const isRoute = currentRoute?.path.includes(zone.id);
    const r = isSelected ? 10 : isRoute ? 9 : 7;

    // Gölge
    ctx.shadowColor = isSelected ? col.bg : 'transparent';
    ctx.shadowBlur  = isSelected ? 15 : 0;

    // Çember
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fillStyle = col.bg;
    ctx.fill();
    if (isSelected || isRoute) {
      ctx.strokeStyle = '#c9a84c';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    ctx.shadowBlur = 0;

    // İsim (yakın zoom'da)
    if (zoom > 1.2) {
      ctx.font = `${Math.round(9/zoom * 10)}px Inter, sans-serif`;
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.textAlign = 'center';
      const label = zone.name || zone.id;
      ctx.fillText(label.length > 15 ? label.slice(0,14)+'…' : label, px, py + r + 10);
    }
  });

  ctx.restore();
}

function isRouteEdge(a, b) {
  if (!currentRoute?.path) return false;
  const p = currentRoute.path;
  for (let i = 0; i < p.length - 1; i++) {
    if ((p[i] === a && p[i+1] === b) || (p[i] === b && p[i+1] === a)) return true;
  }
  return false;
}

// ─── CANVAS MOUSE ─────────────────────────────────────────
function onMouseDown(e) {
  isDragging = true;
  dragStartX = e.clientX - camX;
  dragStartY = e.clientY - camY;
}
function onMouseMove(e) {
  if (isDragging) {
    camX = e.clientX - dragStartX;
    camY = e.clientY - dragStartY;
    drawMap();
  } else {
    // Hover tooltip
    const zone = getZoneAtMouse(e);
    const tt   = document.getElementById('canvasTooltip');
    if (zone) {
      const col = getZoneColor(zone);
      tt.innerHTML = `<strong>${zone.name||zone.id}</strong><br><span style="color:${col.bg}">${col.label}</span><br><span style="opacity:.6;font-size:11px">${(zone.exits||[]).length} bağlantı</span>`;
      tt.style.display = 'block';
      tt.style.left = (e.offsetX + 12) + 'px';
      tt.style.top  = (e.offsetY + 12) + 'px';
    } else {
      tt.style.display = 'none';
    }
  }
}
function onMouseUp() { isDragging = false; }
function onWheel(e) {
  e.preventDefault();
  const delta = e.deltaY > 0 ? 0.9 : 1.1;
  zoom = Math.max(0.3, Math.min(5, zoom * delta));
  drawMap();
}
function onCanvasClick(e) {
  if (Math.abs(e.clientX - (dragStartX + camX)) > 5) return; // Drag değil
  const zone = getZoneAtMouse(e);
  if (zone) selectZone(zone.id);
}

// Touch
let lastTouchDist = 0;
function onTouchStart(e) {
  if (e.touches.length === 2) {
    lastTouchDist = Math.hypot(e.touches[0].clientX-e.touches[1].clientX, e.touches[0].clientY-e.touches[1].clientY);
  } else {
    isDragging = true;
    dragStartX = e.touches[0].clientX - camX;
    dragStartY = e.touches[0].clientY - camY;
  }
}
function onTouchMove(e) {
  e.preventDefault();
  if (e.touches.length === 2) {
    const d = Math.hypot(e.touches[0].clientX-e.touches[1].clientX, e.touches[0].clientY-e.touches[1].clientY);
    zoom = Math.max(0.3, Math.min(5, zoom * (d / lastTouchDist)));
    lastTouchDist = d;
    drawMap();
  } else if (isDragging) {
    camX = e.touches[0].clientX - dragStartX;
    camY = e.touches[0].clientY - dragStartY;
    drawMap();
  }
}
function onTouchEnd() { isDragging = false; }

function getZoneAtMouse(e) {
  const rect = canvas.getBoundingClientRect();
  const mx = (e.clientX - rect.left - camX - canvas.width/2)  / zoom + 450;
  const my = (e.clientY - rect.top  - camY - canvas.height/2) / zoom + 350;
  let closest = null, minDist = 18;
  filteredZones.forEach(z => {
    const p = nodePositions.get(z.id);
    if (!p) return;
    const d = Math.hypot(p.x - mx, p.y - my);
    if (d < minDist) { minDist = d; closest = z; }
  });
  return closest;
}

// ─── ZOOM KONTROLLERI ────────────────────────────────────
function zoomIn()    { zoom = Math.min(5, zoom * 1.3); drawMap(); }
function zoomOut()   { zoom = Math.max(0.3, zoom / 1.3); drawMap(); }
function resetView() { camX = 0; camY = 0; zoom = 1; drawMap(); }

// ─── ZONE LİSTESİ ─────────────────────────────────────────
function renderZoneList() {
  const list = document.getElementById('zoneList');
  const lang = getLang();
  const src  = filteredZones;
  if (!src.length) {
    list.innerHTML = `<div style="padding:20px;text-align:center;color:var(--text-muted);font-size:12px">${lang==='tr'?'Zone bulunamadı':'No zones found'}</div>`;
    return;
  }
  list.innerHTML = src.slice(0, 300).map(z => {
    const col = getZoneColor(z);
    return `<div class="zone-item ${selectedZone?.id === z.id ? 'selected' : ''}" onclick="selectZone('${z.id}')">
      <div class="zi-dot ${col.dot}"></div>
      <div>
        <div class="zi-name">${z.name || z.id}</div>
        <div class="zi-type">${col.label}</div>
      </div>
    </div>`;
  }).join('') + (src.length > 300 ? `<div style="padding:10px;text-align:center;color:var(--text-muted);font-size:11px">+${src.length-300} zone daha — arama ile filtrele</div>` : '');
}

// ─── ZONE SEÇ ─────────────────────────────────────────────
function selectZone(id) {
  selectedZone = zones.find(z => z.id === id) || null;
  renderZoneList();
  renderZoneDetail();
  drawMap();

  // Seçilen zone'a odaklan
  const pos = nodePositions.get(id);
  if (pos) {
    camX = -(pos.x - 450) * zoom;
    camY = -(pos.y - 350) * zoom;
    drawMap();
  }
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
  const exits = (z.exits || []).map(eid => {
    const ez = zones.find(x => x.id === eid);
    return ez || { id: eid, name: eid, color:'DEFAULT' };
  });

  cont.innerHTML = `
    <div class="detail-zone-name">${z.name || z.id}</div>
    <div class="detail-zone-id">${z.id}</div>
    <span class="detail-badge" style="background:${col.bg}22;color:${col.bg};border:1px solid ${col.bg}44">
      <span style="width:8px;height:8px;border-radius:50%;background:${col.bg};display:inline-block"></span>
      ${col.label}
    </span>
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
        ${lang==='tr'?'Başlangıç Noktası Yap':'Set as Start'}
      </button>
      <button class="route-calc-btn" style="width:100%;background:var(--bg-card);color:var(--gold);border:1px solid var(--gold)"
        onclick="document.getElementById('routeTo').value='${z.name||z.id}';routeTo='${z.id}'">
        ${lang==='tr'?'Hedef Noktası Yap':'Set as Destination'}
      </button>
    </div>`;
}

// ─── ARAMA ────────────────────────────────────────────────
let searchTimer;
function onMapSearch(val) {
  clearTimeout(searchTimer);
  const dd = document.getElementById('mapSearchDd');
  if (!val || val.length < 2) { dd.classList.remove('open'); return; }
  searchTimer = setTimeout(() => {
    const q = val.toLowerCase();
    const results = zones.filter(z =>
      (z.name || z.id).toLowerCase().includes(q) || z.id.toLowerCase().includes(q)
    ).slice(0, 12);
    if (!results.length) { dd.classList.remove('open'); return; }
    dd.innerHTML = results.map(z => {
      const col = getZoneColor(z);
      return `<div class="map-dd-item" onclick="selectZone('${z.id}');document.getElementById('mapSearch').value='';document.getElementById('mapSearchDd').classList.remove('open')">
        <div class="map-dd-dot ${col.dot}"></div>
        <div>
          <div style="font-weight:500;color:var(--text-primary)">${z.name || z.id}</div>
          <div style="font-size:10px;color:var(--text-muted)">${col.label}</div>
        </div>
      </div>`;
    }).join('');
    dd.classList.add('open');
  }, 250);
}

document.addEventListener('click', e => {
  if (!e.target.closest('.map-search-wrap'))
    document.getElementById('mapSearchDd')?.classList.remove('open');
});

// ─── FİLTRE ───────────────────────────────────────────────
function filterZones(type, btn) {
  currentFilter = type;
  document.querySelectorAll('.map-filter-btn').forEach(b => b.classList.toggle('active', b === btn));
  filteredZones = type === 'all' ? [...zones] : zones.filter(z => {
    const col = (z.color || z.type || '').toUpperCase();
    const id  = (z.id || '').toUpperCase();
    if (type === 'ROAD')     return id.includes('ROAD')    || col.includes('ROAD');
    if (type === 'SAFEAREA') return col.includes('SAFEAREA')|| col.includes('BLUE');
    return col.includes(type);
  });
  document.getElementById('zoneCount').textContent = filteredZones.length.toLocaleString('tr-TR');
  renderZoneList();
  drawMap();
}

// ─── ROTA HESAPLAMA (BFS) ─────────────────────────────────
function calcRoute() {
  const lang = getLang();
  if (!routeFrom || !routeTo) {
    alert(lang==='tr'?'Başlangıç ve hedef zone seçin.':'Please select start and destination zones.');
    return;
  }
  if (routeFrom === routeTo) {
    alert(lang==='tr'?'Başlangıç ve hedef aynı olamaz.':'Start and destination cannot be same.');
    return;
  }

  // BFS
  const queue   = [[routeFrom]];
  const visited = new Set([routeFrom]);
  let found     = null;

  while (queue.length && !found) {
    const path = queue.shift();
    const cur  = path[path.length - 1];
    const zone = zones.find(z => z.id === cur);
    if (!zone) continue;
    for (const exit of (zone.exits || [])) {
      if (visited.has(exit)) continue;
      visited.add(exit);
      const newPath = [...path, exit];
      if (exit === routeTo) { found = newPath; break; }
      queue.push(newPath);
    }
  }

  if (!found) {
    const rr = document.getElementById('routeResult');
    const rs = document.getElementById('routeSteps');
    rs.innerHTML = `<p style="color:var(--text-muted);font-size:13px;padding:12px 0">${lang==='tr'?'Bu iki zone arasında bağlantı bulunamadı.':'No connection found between these zones.'}</p>`;
    document.getElementById('routeStats').innerHTML = '';
    rr.style.display = 'block';
    currentRoute = null;
    drawMap();
    return;
  }

  currentRoute = { path: found };
  renderRouteResult(found);
  drawMap();
}

function renderRouteResult(path) {
  const lang  = getLang();
  const rr    = document.getElementById('routeResult');
  const rs    = document.getElementById('routeSteps');
  const stats = document.getElementById('routeStats');

  rs.innerHTML = path.map((id, i) => {
    const z   = zones.find(x => x.id === id) || { id, name:id, color:'DEFAULT' };
    const col = getZoneColor(z);
    return `<div class="route-step">
      <div class="route-step-num">${i+1}</div>
      <div style="width:8px;height:8px;border-radius:50%;background:${col.bg};flex-shrink:0"></div>
      <div>
        <div class="route-step-name">${z.name || z.id}</div>
        <div class="route-step-type">${col.label}</div>
      </div>
    </div>`;
  }).join('');

  // İstatistikler
  const typeCount = {};
  path.forEach(id => {
    const z   = zones.find(x => x.id === id) || { color:'DEFAULT' };
    const col = getZoneColor(z).label;
    typeCount[col] = (typeCount[col] || 0) + 1;
  });
  stats.innerHTML = `
    <div class="rr-stat"><strong>${path.length}</strong> ${lang==='tr'?'zone':'zones'}</div>
    <div class="rr-stat"><strong>${path.length-1}</strong> ${lang==='tr'?'geçiş':'hops'}</div>
    ${Object.entries(typeCount).map(([type,cnt]) => `<div class="rr-stat"><strong>${cnt}</strong> ${type}</div>`).join('')}`;

  rr.style.display = 'block';
}

function clearRoute() {
  currentRoute = null;
  routeFrom = null;
  routeTo   = null;
  document.getElementById('routeFrom').value = '';
  document.getElementById('routeTo').value   = '';
  document.getElementById('routeResult').style.display = 'none';
  drawMap();
}

function swapRoute() {
  const tmp   = routeFrom;
  routeFrom   = routeTo;
  routeTo     = tmp;
  const fromEl = document.getElementById('routeFrom');
  const toEl   = document.getElementById('routeTo');
  const tmpVal = fromEl.value;
  fromEl.value = toEl.value;
  toEl.value   = tmpVal;
}

// ─── ZONE PİCKER ─────────────────────────────────────────
function openZonePicker(target) {
  pickerTarget = target;
  const lang = getLang();
  document.getElementById('zpmTitle').textContent = target === 'from'
    ? (lang==='tr'?'Başlangıç Zone':'Start Zone')
    : (lang==='tr'?'Hedef Zone':'Destination Zone');
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

function filterZonePicker(val) {
  renderZonePicker(val);
}

function renderZonePicker(search) {
  const list = document.getElementById('zpmList');
  const q    = search.toLowerCase();
  const src  = search ? zones.filter(z => (z.name||z.id).toLowerCase().includes(q)) : zones;
  list.innerHTML = src.slice(0, 100).map(z => {
    const col = getZoneColor(z);
    return `<div class="zpm-item" onclick="pickZone('${z.id}','${(z.name||z.id).replace(/'/g,"\\'")}')">
      <div style="width:10px;height:10px;border-radius:50%;background:${col.bg};flex-shrink:0"></div>
      <div>
        <div class="zpm-item-name">${z.name || z.id}</div>
        <div class="zpm-item-id">${z.id} · ${col.label}</div>
      </div>
    </div>`;
  }).join('');
}

function pickZone(id, name) {
  if (pickerTarget === 'from') {
    routeFrom = id;
    document.getElementById('routeFrom').value = name;
  } else {
    routeTo = id;
    document.getElementById('routeTo').value = name;
  }
  closeZonePicker();
}
