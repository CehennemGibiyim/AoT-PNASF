// AoT-PNASF — Settings Panel UI
// Ayarlar panelini oluşturur ve yönetir

function buildSettingsPanel() {
  const s = AO_SETTINGS.get();
  const themes = AO_SETTINGS.THEMES;
  const langs  = AO_SETTINGS.LANGS;

  const panel = document.createElement('div');
  panel.id = 'settingsPanel';
  panel.innerHTML = `
<div class="sp-overlay" id="spOverlay" onclick="closeSettings()"></div>
<div class="sp-drawer" id="spDrawer">

  <div class="sp-head">
    <span class="sp-title">⚙ Ayarlar</span>
    <button class="sp-close" onclick="closeSettings()">✕</button>
  </div>

  <!-- ÖNIZLEME -->
  <div class="sp-section">
    <div class="sp-label">👁 Canlı Önizleme</div>
    <div class="sp-preview" id="spPreview">
      <div class="spv-nav" id="spvNav">
        <span class="spv-logo">AoT<span class="spv-sep"> — </span>PNASF <span class="spv-badge" id="spvBadge">AI</span></span>
        <span class="spv-ai" id="spvAi">● AI Aktif</span>
      </div>
      <div class="spv-body" id="spvBody">
        <div class="spv-title" id="spvTitle">AoT — PNASF</div>
        <div class="spv-sub">Market · Crafting · Build · PvP</div>
        <div class="spv-search" id="spvSearch">🔍 Eşya ara...</div>
      </div>
      <div class="spv-stats" id="spvStats">
        <div class="spv-stat"><span class="spv-num" id="spvN1">1.847</span><span class="spv-lbl">Eşya</span></div>
        <div class="spv-stat"><span class="spv-num" id="spvN2">3</span><span class="spv-lbl">Sunucu</span></div>
        <div class="spv-stat"><span class="spv-num spv-ai-num" id="spvN3">CANLI</span><span class="spv-lbl">AI Feed</span></div>
      </div>
    </div>
  </div>

  <!-- HAZIR TEMALAR -->
  <div class="sp-section">
    <div class="sp-label">🎨 <span class="sp-accent">Tema</span></div>
    <div class="sp-theme-grid" id="spThemeGrid">
      ${Object.entries(themes).map(([key, t]) => `
      <div class="sp-tc ${s.theme===key?'active':''}" data-theme="${key}" onclick="selectTheme('${key}')">
        <div class="sp-tc-prev" style="background:${t.bg}">
          ${key==='custom'?`<div class="sp-tc-custom-ring">
            <svg width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="none" stroke-width="3.5"
              style="stroke:conic-gradient(red,yellow,lime,cyan,blue,magenta,red)"/></svg>
            <div class="sp-tc-custom-center" id="customCenter" style="background:${t.accent}"></div>
          </div>`:
          `<div class="sp-tc-bar" style="background:${t.accent}"></div>
           <div class="sp-tc-bar2" style="background:${t.accent}88"></div>
           <div class="sp-tc-bar3" style="background:${t.border}"></div>`}
          <div class="sp-tc-dots">
            <div class="sp-tc-dot" style="background:${t.accent}"></div>
            <div class="sp-tc-dot" style="background:${t.ai}"></div>
          </div>
        </div>
        <div class="sp-tc-foot" style="background:${t.nav}">
          <div class="sp-tc-name" style="color:${t.accent}">${t.icon} ${t.name}</div>
        </div>
      </div>`).join('')}
    </div>
  </div>

  <!-- ÖZEL TEMA EDİTÖRÜ -->
  <div class="sp-section sp-custom-editor" id="spCustomEditor" style="display:none">
    <div class="sp-label">✦ <span class="sp-accent">Özel</span> Tema Editörü</div>
    <div class="sp-custom-grid">
      <!-- Renk Dairesi -->
      <div class="sp-wheel-col">
        <div class="sp-wheel-label">Vurgu rengi</div>
        <div class="sp-wheel-wrap" id="spWheelWrap">
          <canvas id="spColorWheel" width="90" height="90" style="border-radius:50%;cursor:crosshair;display:block"></canvas>
          <div class="sp-wheel-center" id="spWheelCenter"></div>
          <div class="sp-wheel-cursor" id="spWheelCursor"></div>
        </div>
        <div class="sp-palette">
          ${['#c9a84c','#00d4aa','#a78bfa','#ef4444','#22d3ee','#4ade80','#f59e0b','#f472b6','#fb923c','#60a5fa','#34d399','#e2e8f0']
            .map(c=>`<div class="sp-swatch" style="background:${c}" onclick="pickCustomColor('${c}')"></div>`).join('')}
        </div>
        <div class="sp-hex-row">
          <div class="sp-hex-preview" id="spHexPrev"></div>
          <input id="spHexInput" class="sp-hex-input" value="#c9a84c" maxlength="7" oninput="onSpHex(this.value)"/>
        </div>
      </div>
      <!-- Kaydırıcılar -->
      <div class="sp-sliders-col">
        <div class="sp-slider-group">
          <div class="sp-slider-label">Arka plan parlaklığı <span id="spBriVal">5%</span></div>
          <input type="range" id="spBri" min="2" max="18" value="5" step="1" oninput="onSpBri(this.value)"/>
        </div>
        <div class="sp-slider-group">
          <div class="sp-slider-label">Renk doygunluğu <span id="spSatVal">60%</span></div>
          <input type="range" id="spSat" min="0" max="100" value="60" step="1" oninput="onSpSat(this.value)"/>
        </div>
        <div class="sp-slider-group">
          <div class="sp-slider-label"><span style="opacity:.5">Soluk</span> Yoğunluk <span id="spIntVal">100%</span> <span style="opacity:.5">Canlı</span></div>
          <input type="range" id="spInt" min="40" max="100" value="100" step="1" oninput="onSpInt(this.value)"/>
        </div>
        <div class="sp-swatch-preview">
          <div id="spPS1" title="Vurgu"></div>
          <div id="spPS2" title="Arka plan"></div>
          <div id="spPS3" title="Kart"></div>
          <div id="spPS4" title="Kenarlık"></div>
        </div>
        <div class="sp-custom-actions">
          <button class="sp-btn-reset" onclick="resetCustomTheme()">↺ Sıfırla</button>
          <button class="sp-btn-save" id="spSaveBtn" onclick="saveCustomTheme()">✓ Kaydet</button>
        </div>
      </div>
    </div>
  </div>

  <!-- DİL -->
  <div class="sp-section">
    <div class="sp-label">🌐 <span class="sp-accent">Dil</span> Seçimi</div>
    <div class="sp-lang-grid">
      ${Object.entries(langs).map(([key, l]) => `
      <div class="sp-lang-btn lang-opt ${s.lang===key?'active':''}" data-lang="${key}" onclick="selectLang('${key}')">
        <span class="sp-lang-flag">${l.flag}</span>
        <div><span class="sp-lang-name">${l.name}</span><span class="sp-lang-native">${l.native}</span></div>
      </div>`).join('')}
    </div>
  </div>

  <!-- SUNUCU -->
  <div class="sp-section">
    <div class="sp-label">🌍 <span class="sp-accent">Sunucu</span> Tercihi</div>
    <div class="sp-srv-row">
      ${Object.entries(AO_SETTINGS.SERVERS).map(([key, srv]) => `
      <div class="sp-srv-btn server-opt ${s.server===key?'active':''}" data-server="${key}" onclick="selectServer('${key}')">
        <span class="sp-srv-dot"></span>${srv.label}
      </div>`).join('')}
    </div>
  </div>

</div>`;
  document.body.appendChild(panel);
  initColorWheel();
  loadCustomThemeToEditor();
  updateCustomPreview();
}

// ─── PANEL AÇ/KAPAT ─────────────────────────────────────
function openSettings() {
  const panel = document.getElementById('settingsPanel');
  if (!panel) buildSettingsPanel();
  document.getElementById('spOverlay').style.display = 'block';
  document.getElementById('spDrawer').classList.add('open');
}

function closeSettings() {
  const drawer = document.getElementById('spDrawer');
  const overlay = document.getElementById('spOverlay');
  if (drawer) drawer.classList.remove('open');
  if (overlay) overlay.style.display = 'none';
}

// ─── TEMA SEÇ ────────────────────────────────────────────
function selectTheme(key) {
  document.querySelectorAll('.sp-tc').forEach(t => t.classList.toggle('active', t.dataset.theme === key));
  AO_SETTINGS.save({ theme: key });
  AO_SETTINGS.applyTheme(key);
  updateSettingsPreview(key);
  // Özel editör göster/gizle
  const editor = document.getElementById('spCustomEditor');
  if (editor) editor.style.display = key === 'custom' ? 'block' : 'none';
}

function updateSettingsPreview(key) {
  const t = AO_SETTINGS.getTheme(key);
  const set = (id, prop, val) => { const el = document.getElementById(id); if(el) el.style[prop] = val; };
  set('spPreview', 'borderColor', t.border);
  set('spvNav', 'background', t.nav); set('spvNav', 'borderBottomColor', t.border);
  set('spvBody', 'background', t.bg);
  set('spvStats', 'background', t.border);
  set('spvBadge', 'background', t.accent); set('spvBadge', 'color', t.bg);
  set('spvAi', 'color', t.ai);
  set('spvTitle', 'color', t.text);
  set('spvSearch', 'background', t.nav); set('spvSearch', 'borderColor', t.border2); set('spvSearch', 'color', t.muted);
  ['spvN1','spvN2'].forEach(id => set(id, 'color', t.accent));
  set('spvN3', 'color', t.ai);
  document.querySelectorAll('#spvStats .spv-stat').forEach(s => s.style.background = t.nav);
  document.querySelectorAll('#spvStats .spv-lbl').forEach(l => l.style.color = t.muted);
}

// ─── DİL SEÇ ─────────────────────────────────────────────
function selectLang(lang) {
  // Önce kaydet
  localStorage.setItem('aot-lang', lang);
  AO_SETTINGS.save({ lang });
  // lang.js merkezi fonksiyonunu çağır
  if (typeof _applyLang === 'function') _applyLang(lang);
  // Settings panel butonları
  document.querySelectorAll('.lang-opt').forEach(b => {
    b.classList.toggle('active', b.dataset.lang === lang);
  });
  // Navbar göstergesi
  const flags = {tr:'🇹🇷',en:'🇬🇧',ru:'🇷🇺',de:'🇩🇪',fr:'🇫🇷',pl:'🇵🇱',pt:'🇵🇹',es:'🇪🇸',kr:'🇰🇷'};
  const indicator = document.getElementById('settingsLangIndicator');
  if (indicator) indicator.textContent = (flags[lang] || '🌐') + ' ' + lang.toUpperCase();
}

// ─── SUNUCU SEÇ ───────────────────────────────────────────
function selectServer(key) {
  AO_SETTINGS.save({ server: key });
  AO_SETTINGS.applyServer(key);
}

// ─── ÖZEL TEMA ────────────────────────────────────────────
let _customAccent = '#c9a84c';

function loadCustomThemeToEditor() {
  try {
    const c = JSON.parse(localStorage.getItem('aot-custom-theme') || '{}');
    if (c.accent) { _customAccent = c.accent; updateCustomEditorUI(); }
  } catch {}
}

function initColorWheel() {
  const canvas = document.getElementById('spColorWheel');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cx = 45, cy = 45, r = 43;
  for (let a = 0; a < 360; a++) {
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    grad.addColorStop(0, 'white');
    grad.addColorStop(1, `hsl(${a},100%,50%)`);
    ctx.beginPath(); ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, (a-1)*Math.PI/180, a*Math.PI/180);
    ctx.fillStyle = grad; ctx.fill();
  }
  canvas.addEventListener('click', e => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    if (Math.sqrt((x-45)**2 + (y-45)**2) > 43) return;
    const d = ctx.getImageData(Math.round(x), Math.round(y), 1, 1).data;
    const hex = '#' + [d[0],d[1],d[2]].map(v=>v.toString(16).padStart(2,'0')).join('');
    _customAccent = hex;
    const cur = document.getElementById('spWheelCursor');
    if (cur) { cur.style.left = x+'px'; cur.style.top = y+'px'; }
    updateCustomEditorUI();
    updateCustomPreview();
  });
}

function pickCustomColor(hex) {
  _customAccent = hex;
  updateCustomEditorUI();
  updateCustomPreview();
}

function onSpHex(v) {
  if (/^#[0-9a-fA-F]{6}$/.test(v)) { _customAccent = v; updateCustomEditorUI(); updateCustomPreview(); }
}

function onSpBri(v) { document.getElementById('spBriVal').textContent = v + '%'; updateCustomPreview(); }
function onSpSat(v) { document.getElementById('spSatVal').textContent = v + '%'; updateCustomPreview(); }
function onSpInt(v) { document.getElementById('spIntVal').textContent = v + '%'; updateCustomPreview(); }

function updateCustomEditorUI() {
  const hi = document.getElementById('spHexInput'); if(hi) hi.value = _customAccent;
  const hp = document.getElementById('spHexPrev'); if(hp) hp.style.background = _customAccent;
  const wc = document.getElementById('spWheelCenter'); if(wc) wc.style.background = _customAccent;
  const cc = document.getElementById('customCenter'); if(cc) cc.style.background = _customAccent;
  document.querySelectorAll('.sp-swatch').forEach(s => s.classList.toggle('active', s.style.background === _customAccent));
}

function hslToHex(h, s, l) {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1-l);
  const f = n => { const k=(n+h/30)%12; const c=l-a*Math.max(Math.min(k-3,9-k,1),-1); return Math.round(255*c).toString(16).padStart(2,'0'); };
  return `#${f(0)}${f(8)}${f(4)}`;
}
function hexToHsl(hex) {
  let r=parseInt(hex.slice(1,3),16)/255, g=parseInt(hex.slice(3,5),16)/255, b=parseInt(hex.slice(5,7),16)/255;
  const max=Math.max(r,g,b), min=Math.min(r,g,b); let h=0,s=0,l=(max+min)/2;
  if(max!==min){s=l>0.5?(max-min)/(2-max-min):(max-min)/(max+min);if(max===r)h=((g-b)/(max-min)+(g<b?6:0))/6;else if(max===g)h=((b-r)/(max-min)+2)/6;else h=((r-g)/(max-min)+4)/6;}
  return [Math.round(h*360), Math.round(s*100), Math.round(l*100)];
}
function adjustIntensity(hex, pct) {
  const [h,s,l] = hexToHsl(hex);
  return hslToHex(h, Math.round(s*pct/100), l);
}

function buildCustomTheme() {
  const bri = parseInt(document.getElementById('spBri')?.value || 5);
  const sat = parseInt(document.getElementById('spSat')?.value || 60);
  const intv = parseInt(document.getElementById('spInt')?.value || 100);
  const [h,s,l] = hexToHsl(_customAccent);
  const accent = adjustIntensity(_customAccent, intv);
  const bg     = hslToHex(h, Math.round(sat*0.15), bri);
  const nav    = hslToHex(h, Math.round(sat*0.12), Math.min(bri+3, 20));
  const hover  = hslToHex(h, Math.round(sat*0.12), Math.min(bri+5, 22));
  const border = hslToHex(h, Math.round(sat*0.18), Math.min(bri+8, 28));
  const border2= hslToHex(h, Math.round(sat*0.15), Math.min(bri+12,35));
  return { name:'Özel Tema', icon:'✦', accent, bg, nav, hover, text:'#e2e0d8', muted:'#8b9ab0', faint:'#3a4455', border, border2, ai:'#00d4aa', card:nav };
}

function updateCustomPreview() {
  const t = buildCustomTheme();
  const s1=document.getElementById('spPS1'), s2=document.getElementById('spPS2');
  const s3=document.getElementById('spPS3'), s4=document.getElementById('spPS4');
  if(s1) s1.style.background=t.accent;
  if(s2) s2.style.background=t.bg;
  if(s3) s3.style.background=t.nav;
  if(s4) s4.style.background=t.border;
  if (document.querySelector('.sp-tc[data-theme="custom"]')?.classList.contains('active')) {
    AO_SETTINGS.THEMES.custom = t;
    AO_SETTINGS.applyTheme('custom');
    updateSettingsPreview('custom');
  }
}

function saveCustomTheme() {
  const t = buildCustomTheme();
  AO_SETTINGS.THEMES.custom = t;
  AO_SETTINGS.saveCustomTheme(t);
  AO_SETTINGS.save({ theme: 'custom' });
  AO_SETTINGS.applyTheme('custom');
  updateSettingsPreview('custom');
  // Seçili yap
  document.querySelectorAll('.sp-tc').forEach(tc => tc.classList.toggle('active', tc.dataset.theme === 'custom'));
  const btn = document.getElementById('spSaveBtn');
  if (btn) { btn.textContent = '✓ Kaydedildi!'; btn.style.background = '#00d4aa'; setTimeout(() => { btn.textContent='✓ Kaydet'; btn.style.background=''; }, 2000); }
}

function resetCustomTheme() {
  _customAccent = '#c9a84c';
  const bi = document.getElementById('spBri'); if(bi) bi.value=5;
  const si = document.getElementById('spSat'); if(si) si.value=60;
  const ii = document.getElementById('spInt'); if(ii) ii.value=100;
  document.getElementById('spBriVal').textContent='5%';
  document.getElementById('spSatVal').textContent='60%';
  document.getElementById('spIntVal').textContent='100%';
  updateCustomEditorUI(); updateCustomPreview();
}

// ─── NAVBAR SETTINGS BUTONU ──────────────────────────────
function toggleLang() {
  openSettings();
}
