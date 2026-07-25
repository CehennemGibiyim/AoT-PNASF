// AoT-PNASF — Settings Panel (GitHub repo'dan uyarlandı)
// Yan çekmecer (drawer) formatında ayarlar paneli

// ─── TEMALAR ─────────────────────────────────────────────
const SP_THEMES = {
  'obsidian-gold': { name: 'Obsidian Gold', icon: '⚜', bg: '#0a0a0a', nav: '#141414', accent: '#d4af37', border: '#262626', text: '#f5f5f5', muted: '#a3a3a3', ai: '#00d4aa' },
  'void-purple':   { name: 'Void Purple',   icon: '🔮', bg: '#0d001a', nav: '#1a0033', accent: '#9d00ff', border: '#2a004d', text: '#f3e8ff', muted: '#d8b4fe', ai: '#00d4aa' },
  'blood-moon':    { name: 'Blood Moon',    icon: '🌑', bg: '#120000', nav: '#240000', accent: '#ff1a1a', border: '#3a0000', text: '#fee2e2', muted: '#fca5a5', ai: '#ff6b6b' },
  'arctic-cyan':   { name: 'Arctic Cyan',   icon: '❄', bg: '#000b14', nav: '#001729', accent: '#00e6ff', border: '#002540', text: '#e0f2fe', muted: '#7dd3fc', ai: '#00d4aa' },
  'forest-keeper': { name: 'Forest Keeper', icon: '🌿', bg: '#001205', nav: '#00240a', accent: '#00ff40', border: '#003810', text: '#dcfce7', muted: '#86efac', ai: '#00d4aa' },
  'amber-fire':    { name: 'Amber Fire',    icon: '🔥', bg: '#140800', nav: '#291000', accent: '#ff8800', border: '#401a00', text: '#ffedd5', muted: '#fdba74', ai: '#ffd700' },
  'silver-knight': { name: 'Silver Knight', icon: '🛡', bg: '#14161a', nav: '#22252a', accent: '#c0c0c0', border: '#33373e', text: '#f8fafc', muted: '#cbd5e1', ai: '#00d4aa' },
  'neon-nexus':    { name: 'Neon Nexus',    icon: '⚡', bg: '#050014', nav: '#0a0029', accent: '#ff00ff', border: '#140052', text: '#fae8ff', muted: '#f0abfc', ai: '#00ffff' },
  'custom':        { name: 'Özel Tema',     icon: '✦', bg: '#0a0a0a', nav: '#141414', accent: '#d4af37', border: '#262626', text: '#f5f5f5', muted: '#a3a3a3', ai: '#00d4aa' }
};

// ─── TEMA UYGULA ─────────────────────────────────────────
function applyTheme(key) {
  const t = SP_THEMES[key] || SP_THEMES['obsidian-gold'];
  const root = document.documentElement;
  root.setAttribute('data-theme', key);
  root.style.setProperty('--bg-900', t.bg);
  root.style.setProperty('--bg-800', t.nav);
  root.style.setProperty('--bg-700', t.border);
  root.style.setProperty('--accent', t.accent);
  root.style.setProperty('--accent-hover', adjustColor(t.accent, -20));
  root.style.setProperty('--text-main', t.text);
  root.style.setProperty('--text-muted', t.muted);
  // RGB değeri için
  const rgb = hexToRgb(t.accent);
  if (rgb) root.style.setProperty('--accent-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
  localStorage.setItem('aot-theme', key);
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? { r: parseInt(result[1],16), g: parseInt(result[2],16), b: parseInt(result[3],16) } : null;
}

function adjustColor(hex, amount) {
  const num = parseInt(hex.replace('#',''), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0xff) + amount));
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}

// ─── PANEL OLUŞTUR ───────────────────────────────────────
function buildSettingsPanel() {
  if (document.getElementById('spPanel')) return;

  const currentTheme = localStorage.getItem('aot-theme') || 'obsidian-gold';
  let currentLang = localStorage.getItem('aot-lang') || 'tr';
  if (window.miniappI18n && window.miniappI18n.getContext) {
    const ctx = window.miniappI18n.getContext();
    if (ctx && ctx.resolvedLocale) {
      currentLang = ctx.resolvedLocale.split('-')[0]; // tr-TR -> tr
      if (currentLang === 'ko') currentLang = 'kr';
    }
  }
  const currentServer = localStorage.getItem('aot-server') || 'europe';

  const langs = {
    tr: { flag: '🇹🇷', name: window.t('settings-langTr', 'Türkçe'), native: 'Türkçe' },
    en: { flag: '🇬🇧', name: window.t('settings-langEn', 'İngilizce'), native: 'English' },
    ru: { flag: '🇷🇺', name: window.t('settings-langRu', 'Rusça'), native: 'Русский' },
    de: { flag: '🇩🇪', name: window.t('settings-langDe', 'Almanca'), native: 'Deutsch' },
    fr: { flag: '🇫🇷', name: window.t('settings-langFr', 'Fransızca'), native: 'Français' },
    pl: { flag: '🇵🇱', name: window.t('settings-langPl', 'Lehçe'), native: 'Polski' },
    pt: { flag: '🇵🇹', name: window.t('settings-langPt', 'Portekizce'), native: 'Português' },
    es: { flag: '🇪🇸', name: window.t('settings-langEs', 'İspanyolca'), native: 'Español' },
    kr: { flag: '🇰🇷', name: window.t('settings-langKr', 'Korece'), native: '한국어' }
  };

  const servers = {
    europe: { label: '🌍 Avrupa (EU)', domain: 'europe.albion-online-data.com' },
    americas: { label: '🌎 Amerika (NA)', domain: 'west.albion-online-data.com' },
    asia: { label: '🌏 Asya', domain: 'east.albion-online-data.com' }
  };

  const panel = document.createElement('div');
  panel.id = 'spPanel';
  panel.innerHTML = `
    <div class="sp-overlay" id="spOverlay" onclick="closeSettingsPanel()"></div>
    <div class="sp-drawer" id="spDrawer">
      
      <!-- Başlık -->
      <div class="sp-head">
        <span class="sp-title">⚙ <span data-i18n="settings-title">Ayarlar</span></span>
        <button class="sp-close" onclick="closeSettingsPanel()">✕</button>
      </div>

      <!-- Önizleme -->
      <div class="sp-section">
        <div class="sp-label">👁 <span class="sp-acc" data-i18n="settings-livePreview">Canlı Önizleme</span></div>
        <div class="sp-preview" id="spPreview">
          <div class="spv-nav" id="spvNav">
            <span class="spv-logo">AoT<span class="spv-sep"> — </span>PNASF <span class="spv-badge" id="spvBadge">AI</span></span>
            <span class="spv-ai" id="spvAi">● AI Aktif</span>
          </div>
          <div class="spv-body" id="spvBody">
            <div class="spv-title" id="spvTitle">AoT — PNASF</div>
            <div class="spv-sub">Market · Crafting · Build · PvP</div>
            <div class="spv-search">🔍 Eşya ara...</div>
          </div>
          <div class="spv-stats" id="spvStats">
            <div class="spv-stat"><span class="spv-num" id="spvN1">1.847</span><span class="spv-lbl">Eşya</span></div>
            <div class="spv-stat"><span class="spv-num" id="spvN2">3</span><span class="spv-lbl">Sunucu</span></div>
            <div class="spv-stat"><span class="spv-num spv-ai-num" id="spvN3">CANLI</span><span class="spv-lbl">AI Feed</span></div>
          </div>
        </div>
      </div>

      <!-- Temalar -->
      <div class="sp-section">
        <div class="sp-label">🎨 <span class="sp-acc" data-i18n="settings-themeSelection">Tema Seçimi</span></div>
        <div class="sp-theme-grid" id="spThemeGrid">
          ${Object.entries(SP_THEMES).map(([key, t]) => `
          <div class="sp-tc ${currentTheme === key ? 'active' : ''}" data-theme="${key}" onclick="selectSpTheme('${key}')">
            <div class="sp-tc-prev" style="background:${t.bg}">
              <div class="sp-tc-bar" style="background:${t.accent}"></div>
              <div class="sp-tc-bar2" style="background:${t.accent}88"></div>
              <div class="sp-tc-bar3" style="background:${t.border}"></div>
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

      <!-- Özel Renk Seçici (Color Wheel) -->
      <div class="sp-section" id="spCustomEditor" style="display:none">
        <div class="sp-label">✦ <span class="sp-acc">ÖZEL TEMA EDİTÖRÜ</span></div>
        <div style="display:flex; gap:15px; margin-bottom:10px;">
          
          <!-- Sol: Wheel ve Presetler -->
          <div style="flex:1; display:flex; flex-direction:column; align-items:center;">
            <div style="font-size:10px; color:var(--text-muted); margin-bottom:8px; text-transform:uppercase;">Vurgu Rengi</div>
            <div id="spColorWheel"></div>
            
            <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:6px; margin-top:12px; margin-bottom:10px;" id="spColorPresets">
              ${['#d4af37','#9d00ff','#ff1a1a','#00e6ff','#00ff40','#ff8800','#c0c0c0','#ff00ff','#00d4aa','#ffb84d','#4da6ff','#ff4d4d'].map(c => 
                `<div class="sp-preset-color" style="width:18px;height:18px;border-radius:50%;background:${c};cursor:pointer;border:2px solid #333;" onclick="setSpCustomColor('${c}')"></div>`
              ).join('')}
            </div>
            
            <div style="display:flex; align-items:center; background:#111; border:1px solid #333; border-radius:4px; padding:2px 6px;">
               <span style="color:#666; font-size:12px; margin-right:4px;">#</span>
               <input type="text" id="spHexInput" value="d4af37" style="background:transparent; border:none; color:#fff; width:60px; font-size:12px; outline:none; text-align:center;" onchange="setSpCustomColor(this.value)">
            </div>
          </div>
          
          <!-- Sağ: Sliderlar ve Butonlar -->
          <div style="flex:1; display:flex; flex-direction:column; justify-content:flex-start;">
            <div style="margin-bottom:15px;">
              <div style="display:flex; justify-content:space-between; font-size:10px; color:var(--text-muted); margin-bottom:4px;">
                <span>Arka plan parlaklığı</span>
                <span id="spBgVal">5%</span>
              </div>
              <input type="range" id="spBgSlider" min="0" max="20" value="5" style="width:100%; accent-color:var(--accent);" oninput="onSpCustomSlidersChange()">
            </div>
            
            <div style="margin-bottom:15px;">
              <div style="display:flex; justify-content:space-between; font-size:10px; color:var(--text-muted); margin-bottom:4px;">
                <span>Renk doygunluğu</span>
                <span id="spTextVal">80%</span>
              </div>
              <input type="range" id="spTextSlider" min="0" max="100" value="80" style="width:100%; accent-color:var(--accent);" oninput="onSpCustomSlidersChange()">
              <div style="display:flex; justify-content:space-between; font-size:9px; color:#666; margin-top:2px;">
                 <span>Soluk</span><span>Yoğunluk</span><span>Canlı</span>
              </div>
            </div>
            
            <div style="display:flex; gap:6px; margin-top:auto;">
              <button class="sp-btn-secondary" style="flex:1; padding:6px; font-size:11px;" onclick="resetSpCustom()">Sıfırla</button>
              <button class="sp-btn-primary" style="flex:2; padding:6px; font-size:11px;" id="spSaveCustomBtn" onclick="saveSpCustom(event)">✓ Kaydet</button>
            </div>
          </div>
          
        </div>
      </div>

      <!-- Dil -->
      <div class="sp-section">
        <div class="sp-label">🌐 <span class="sp-acc" data-i18n="settings-languageSelection">Dil Seçimi</span></div>
        <div class="sp-lang-grid">
          ${Object.entries(langs).map(([key, l]) => `
          <div class="sp-lang-btn ${currentLang === key ? 'active' : ''}" data-lang="${key}" onclick="selectSpLang('${key}')">
            <span class="sp-lang-flag">${l.flag}</span>
            <div><span class="sp-lang-name">${l.name}</span><span class="sp-lang-native">${l.native}</span></div>
          </div>`).join('')}
        </div>
      </div>

      <!-- Sunucu -->
      <div class="sp-section">
        <div class="sp-label">🌍 <span class="sp-acc" data-i18n="settings-serverSelection">Sunucu Tercihi</span></div>
        <div class="sp-srv-row">
          ${Object.entries(servers).map(([key, s]) => `
          <div class="sp-srv-btn ${currentServer === key ? 'active' : ''}" data-server="${key}" onclick="selectSpServer('${key}')">
            <span class="sp-srv-dot"></span>${s.label}
          </div>`).join('')}
        </div>
      </div>

      <!-- Metin Boyutu -->
      <div class="sp-section">
        <div class="sp-label">🔤 <span class="sp-acc" data-i18n="settings-textSize">Metin Boyutu</span></div>
        <div class="sp-srv-row">
          ${['12px','13px','14px','15px','16px'].map(sz => `
          <div class="sp-srv-btn ${(localStorage.getItem('aot-fontsize')||'14px') === sz ? 'active' : ''}" onclick="selectSpFontSize('${sz}')">
            <span style="font-size:${sz}">${sz}</span>
          </div>`).join('')}
        </div>
      </div>

      <!-- Önbellek -->
      <div class="sp-section">
        <div class="sp-label">🗂 <span class="sp-acc" data-i18n="settings-cacheManagement">Önbellek Yönetimi</span></div>
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <div style="font-size:11px;color:var(--text-muted)" id="spCacheInfo">Yükleniyor...</div>
          <button class="sp-btn-danger" onclick="clearSpCache()"><i class="fa-solid fa-trash mr-1"></i> Temizle</button>
        </div>
      </div>

    </div>
  `;
  document.body.appendChild(panel);

  // iro.js Color Wheel Başlatma
  if (window.iro) {
    window.spColorPicker = new window.iro.ColorPicker("#spColorWheel", {
      width: 120,
      color: "#d4af37",
      borderWidth: 1,
      borderColor: "#333",
      layout: [ { component: window.iro.ui.Wheel } ]
    });
    
    window.spColorPicker.on('color:change', function(color) {
      const hexEl = document.getElementById('spHexInput');
      if (hexEl) hexEl.value = color.hexString.replace('#', '');
      onSpCustomSlidersChange(color.hexString);
    });
  }

  // Önizlemeyi güncelle
  updateSpPreview(currentTheme);
  // Cache bilgisini yükle
  updateSpCacheInfo();
  // Kaydedilmiş custom temayı yükle
  loadSpCustomTheme();
}

// ─── PANEL AÇ/KAPAT ─────────────────────────────────────
function openSettingsPanel() {
  if (!document.getElementById('spPanel')) buildSettingsPanel();
  document.getElementById('spOverlay').style.display = 'block';
  document.getElementById('spDrawer').classList.add('open');
}

function closeSettingsPanel() {
  const drawer = document.getElementById('spDrawer');
  const overlay = document.getElementById('spOverlay');
  if (drawer) drawer.classList.remove('open');
  if (overlay) overlay.style.display = 'none';
}

// ─── TEMA SEÇ ────────────────────────────────────────────
function selectSpTheme(key) {
  document.querySelectorAll('.sp-tc').forEach(t => t.classList.toggle('active', t.dataset.theme === key));
  applyTheme(key);
  updateSpPreview(key);
  const editor = document.getElementById('spCustomEditor');
  if (editor) editor.style.display = key === 'custom' ? 'block' : 'none';
}

function updateSpPreview(key) {
  const t = SP_THEMES[key] || SP_THEMES['obsidian-gold'];
  const set = (id, prop, val) => { const el = document.getElementById(id); if(el) el.style[prop] = val; };
  set('spvNav', 'background', t.nav);
  set('spvNav', 'borderBottomColor', t.border);
  set('spvBody', 'background', t.bg);
  set('spvStats', 'background', t.border);
  set('spvBadge', 'background', t.accent);
  set('spvBadge', 'color', t.bg);
  set('spvAi', 'color', t.ai);
  set('spvTitle', 'color', t.text);
  document.querySelectorAll('#spvStats .spv-num').forEach(el => el.style.color = t.accent);
  set('spvN3', 'color', t.ai);
}

// ─── ÖZEL TEMA EDİTÖRÜ ───────────────────────────────────
function loadSpCustomTheme() {
  try {
    const c = JSON.parse(localStorage.getItem('aot-custom-theme') || '{}');
    if (c.bgVal !== undefined) document.getElementById('spBgSlider').value = c.bgVal;
    if (c.textVal !== undefined) document.getElementById('spTextSlider').value = c.textVal;
    if (c.accent) {
       document.getElementById('spHexInput').value = c.accent.replace('#', '');
       if (window.spColorPicker) window.spColorPicker.color.hexString = c.accent;
    }
    onSpCustomSlidersChange(c.accent || '#d4af37');
  } catch(e) {}
}

function setSpCustomColor(hex) {
  if (!hex.startsWith('#')) hex = '#' + hex;
  if (window.spColorPicker) {
    window.spColorPicker.color.hexString = hex;
  }
  document.getElementById('spHexInput').value = hex.replace('#', '');
  onSpCustomSlidersChange(hex);
}

function onSpCustomSlidersChange(passedHex) {
  let accent = typeof passedHex === 'string' ? passedHex : null;
  if (!accent) {
    if (window.spColorPicker) accent = window.spColorPicker.color.hexString;
    else accent = '#' + document.getElementById('spHexInput').value;
  }
  if (!accent.startsWith('#')) accent = '#' + accent;

  const bgSlider = document.getElementById('spBgSlider');
  const textSlider = document.getElementById('spTextSlider');
  if (!bgSlider || !textSlider) return;
  
  const bgVal = parseInt(bgSlider.value);
  const textVal = parseInt(textSlider.value);
  
  document.getElementById('spBgVal').textContent = bgVal + '%';
  document.getElementById('spTextVal').textContent = textVal + '%';
  
  const bgC = Math.floor((bgVal / 100) * 255);
  const bg = '#' + bgC.toString(16).padStart(2,'0').repeat(3);
  
  const txtC = Math.floor(102 + (textVal / 100) * 153);
  const text = '#' + txtC.toString(16).padStart(2,'0').repeat(3);
  
  SP_THEMES['custom'] = { ...SP_THEMES['custom'], bg, nav: adjustColor(bg, 10), accent, text, border: adjustColor(bg, 20) };
  
  if (document.querySelector('.sp-tc[data-theme="custom"]')?.classList.contains('active')) {
    applyTheme('custom');
  }
}

function saveSpCustom(event) {
  const bgSlider = document.getElementById('spBgSlider');
  const textSlider = document.getElementById('spTextSlider');
  
  const bgVal = parseInt(bgSlider.value);
  const bgC = Math.floor((bgVal / 100) * 255);
  const bg = '#' + bgC.toString(16).padStart(2,'0').repeat(3);
  
  const textVal = parseInt(textSlider.value);
  const txtC = Math.floor(102 + (textVal / 100) * 153);
  const text = '#' + txtC.toString(16).padStart(2,'0').repeat(3);
  
  let accent = window.spColorPicker ? window.spColorPicker.color.hexString : '#' + document.getElementById('spHexInput').value;
  if(!accent.startsWith('#')) accent = '#' + accent;
  
  const customTheme = {
    name: 'Özel Tema', icon: '✦',
    bg, nav: adjustColor(bg, 10), accent, border: adjustColor(bg, 20),
    text, muted: adjustColor(text, -60), ai: '#00d4aa'
  };
  
  SP_THEMES['custom'] = customTheme;
  localStorage.setItem('aot-custom-theme', JSON.stringify({ bgVal, textVal, accent }));
  applyTheme('custom');
  updateSpPreview('custom');
  selectSpTheme('custom');
  
  const btn = event ? event.target : document.getElementById('spSaveCustomBtn');
  if (btn) {
    const oldText = btn.textContent;
    btn.textContent = '✓ Kaydedildi!';
    btn.style.background = '#00d4aa';
    btn.style.color = '#000';
    setTimeout(() => { btn.textContent = oldText; btn.style.background = ''; btn.style.color = ''; }, 2000);
  }
}

function resetSpCustom() {
  document.getElementById('spBgSlider').value = 5;
  document.getElementById('spTextSlider').value = 80;
  if (window.spColorPicker) window.spColorPicker.color.hexString = '#d4af37';
  document.getElementById('spHexInput').value = 'd4af37';
  onSpCustomSlidersChange('#d4af37');
}

// ─── DİL SEÇ ─────────────────────────────────────────────
function selectSpLang(lang) {
  localStorage.setItem('aot-lang', lang);
  document.querySelectorAll('.sp-lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
  const langDisplay = document.getElementById('currentLangDisplay');
  const flags = { tr:'TR', en:'EN', ru:'RU', de:'DE', fr:'FR', pl:'PL', pt:'PT', es:'ES', kr:'KR' };
  if (langDisplay) langDisplay.textContent = flags[lang] || lang.toUpperCase();

  // AOT Platform (Miniapps AI) i18n Entegrasyonu
  if (window.miniappI18n && typeof window.miniappI18n.setLocale === 'function') {
    const mappedLang = lang === 'kr' ? 'ko' : lang;
    window.miniappI18n.setLocale(mappedLang).then(() => {
      // Dinamik JS elementlerinin tam çevrilmesi için sayfayı temiz bir şekilde yeniliyoruz
      setTimeout(() => window.location.reload(), 200);
    }).catch(err => console.error('AOT i18n hatası:', err));
  } else if (typeof _applyLang === 'function') {
    // Test ortamı / Geriye dönük uyumluluk
    _applyLang(lang);
  }

  // Dinamik içerikleri yenile (eşya isimleri vb.)
  if (typeof window.AO_ITEMS !== 'undefined' && window.AOT_DATA.locales) {
    window.AO_ITEMS.forEach(item => {
      if (window.AOT_DATA.locales[item.id]) {
        item.tr = window.AOT_DATA.locales[item.id];
      }
    });
  }

  // Sayfa içeriğini yenile
  if (typeof window.refreshContent === 'function') {
    window.refreshContent();
  }
}

// ─── SUNUCU SEÇ ──────────────────────────────────────────
const SP_SERVERS = {
  europe: 'europe.albion-online-data.com',
  americas: 'west.albion-online-data.com',
  asia: 'east.albion-online-data.com'
};

function selectSpServer(key) {
  localStorage.setItem('aot-server', key);
  window._albionApiDomain = SP_SERVERS[key] || SP_SERVERS.europe;
  if (typeof window.getAlbionApiDomain === 'function') {
    window.getAlbionApiDomain = () => SP_SERVERS[key] || SP_SERVERS.europe;
  }
  document.querySelectorAll('.sp-srv-btn[data-server]').forEach(b => b.classList.toggle('active', b.dataset.server === key));
  const badge = document.getElementById('globalServerBadge');
  if (badge) badge.textContent = { europe: 'EU', americas: 'NA', asia: 'AS' }[key] || key.toUpperCase();

  // AppConfig.server'ı güncelle
  if (window.AppConfig) {
    window.AppConfig.server = key;
  }

  // Fiyat verilerini yenile
  if (typeof window.refreshPrices === 'function') {
    window.refreshPrices();
  }

  // Sayfa içeriğini yenile
  if (typeof window.refreshContent === 'function') {
    window.refreshContent();
  }
}

// ─── YAZI BOYU ───────────────────────────────────────────
function selectSpFontSize(sz) {
  document.documentElement.style.fontSize = sz;
  localStorage.setItem('aot-fontsize', sz);
  document.querySelectorAll('.sp-srv-btn:not([data-server]):not([data-lang])').forEach(b => {
    b.classList.toggle('active', b.textContent.trim().startsWith(sz));
  });
}

// ─── ÖNBELLEK ────────────────────────────────────────────
function updateSpCacheInfo() {
  const el = document.getElementById('spCacheInfo');
  if (!el) return;
  if (window.albionImageCache) {
    window.albionImageCache.getCacheStats().then(stats => {
      el.textContent = `${stats.size}/${stats.maxSize} resim (${stats.usage}%)`;
    }).catch(() => { el.textContent = 'Önbellek bilgisi alınamadı'; });
  } else {
    el.textContent = 'Önbellek sistemi hazır değil';
  }
}

function clearSpCache() {
  if (window.albionImageCache) {
    window.albionImageCache.clearCache().then(() => {
      updateSpCacheInfo();
      const btn = document.querySelector('[onclick="clearSpCache()"]');
      if (btn) { btn.innerHTML = '<i class="fa-solid fa-check mr-1"></i> Temizlendi!'; setTimeout(() => { btn.innerHTML = '<i class="fa-solid fa-trash mr-1"></i> Temizle'; }, 2000); }
    });
  }
}

// ─── BAŞLANGIÇTA TEMA UYGULA ─────────────────────────────
(function initSpTheme() {
  const savedTheme = localStorage.getItem('aot-theme') || 'obsidian-gold';
  const savedFontSize = localStorage.getItem('aot-fontsize') || '14px';
  const savedServer = localStorage.getItem('aot-server') || 'europe';

  // Custom tema varsa yükle
  if (savedTheme === 'custom') {
    try {
      const c = JSON.parse(localStorage.getItem('aot-custom-theme') || '{}');
      if (c.bgVal !== undefined && c.accent) {
        const bgC = Math.floor((c.bgVal / 100) * 255);
        const bg = '#' + bgC.toString(16).padStart(2,'0').repeat(3);
        
        const textVal = c.textVal !== undefined ? c.textVal : 80;
        const txtC = Math.floor(102 + (textVal / 100) * 153);
        const text = '#' + txtC.toString(16).padStart(2,'0').repeat(3);
        
        SP_THEMES['custom'] = {
          ...SP_THEMES['custom'], bg: bg,
          nav: adjustColor(bg, 10), accent: c.accent,
          border: adjustColor(bg, 20), text: text
        };
      }
    } catch(e) {}
  }

  applyTheme(savedTheme);
  document.documentElement.style.fontSize = savedFontSize;

  // Sunucu uygula
  if (SP_SERVERS[savedServer]) {
    window._albionApiDomain = SP_SERVERS[savedServer];
  }

  // AOT i18n Senkronizasyonu (Navbar)
  setTimeout(() => {
    let currentLang = localStorage.getItem('aot-lang') || 'tr';
    if (window.miniappI18n && window.miniappI18n.getContext) {
      const ctx = window.miniappI18n.getContext();
      if (ctx && ctx.resolvedLocale) {
        currentLang = ctx.resolvedLocale.split('-')[0];
      }
    }
    const flags = { tr:'TR', en:'EN', ru:'RU', de:'DE', fr:'FR', pl:'PL', pt:'PT', es:'ES', kr:'KR', ko:'KR' };
    const langDisplay = document.getElementById('currentLangDisplay');
    if (langDisplay) langDisplay.textContent = flags[currentLang] || currentLang.toUpperCase();
  }, 100);
})();
