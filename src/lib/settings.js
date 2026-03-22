// AoT-PNASF — Settings System v1
// Tema, dil ve sunucu tercihlerini yönetir — tüm sayfalar kullanır

const AO_SETTINGS = {

  // ─── HAZIR TEMALAR ──────────────────────────────────────
  THEMES: {
    obsidian: {
      name:'Obsidian Gold', icon:'🌑',
      accent:'#c9a84c', bg:'#080c10', nav:'#0d1117',
      text:'#e2e0d8', muted:'#8b9ab0', faint:'#3a4455',
      border:'#1e2530', border2:'#2a3445', ai:'#00d4aa',
      card:'#0d1117', hover:'#131920'
    },
    void: {
      name:'Void Purple', icon:'🌌',
      accent:'#a78bfa', bg:'#08060f', nav:'#0d0a1a',
      text:'#ede9fe', muted:'#7c6fa8', faint:'#2e2550',
      border:'#1e1535', border2:'#2a2040', ai:'#f472b6',
      card:'#0d0a1a', hover:'#120e22'
    },
    blood: {
      name:'Blood Moon', icon:'🩸',
      accent:'#ef4444', bg:'#0a0606', nav:'#0f0808',
      text:'#fee2e2', muted:'#8b5a5a', faint:'#3a1010',
      border:'#2a1010', border2:'#3a1818', ai:'#f97316',
      card:'#0f0808', hover:'#140a0a'
    },
    arctic: {
      name:'Arctic Cyan', icon:'❄️',
      accent:'#22d3ee', bg:'#060a0f', nav:'#080e14',
      text:'#e0f7fa', muted:'#4a7a8a', faint:'#0f1e2a',
      border:'#0f1e2a', border2:'#162535', ai:'#38bdf8',
      card:'#080e14', hover:'#0c1520'
    },
    forest: {
      name:'Forest Keeper', icon:'🌲',
      accent:'#4ade80', bg:'#060b07', nav:'#080f09',
      text:'#dcfce7', muted:'#4a7a52', faint:'#0f2010',
      border:'#0f2010', border2:'#163018', ai:'#86efac',
      card:'#080f09', hover:'#0b1409'
    },
    amber: {
      name:'Amber Fire', icon:'🔥',
      accent:'#f59e0b', bg:'#0a0700', nav:'#0f0900',
      text:'#fef3c7', muted:'#8b6a30', faint:'#2a1800',
      border:'#2a1800', border2:'#3a2200', ai:'#fb923c',
      card:'#0f0900', hover:'#140b00'
    },
    silver: {
      name:'Silver Knight', icon:'⚔️',
      accent:'#e2e8f0', bg:'#08090b', nav:'#0c0e12',
      text:'#f1f5f9', muted:'#64748b', faint:'#1a1f28',
      border:'#1a1f28', border2:'#242a35', ai:'#94a3b8',
      card:'#0c0e12', hover:'#111520'
    },
    neon: {
      name:'Neon Nexus', icon:'💚',
      accent:'#00ff88', bg:'#040810', nav:'#070b14',
      text:'#e0ffe8', muted:'#2a6a4a', faint:'#0a1525',
      border:'#0a1525', border2:'#0f1e35', ai:'#ff0066',
      card:'#070b14', hover:'#091018'
    },
    custom: {
      name:'Özel Tema', icon:'✦',
      accent:'#c9a84c', bg:'#080c10', nav:'#0d1117',
      text:'#e2e0d8', muted:'#8b9ab0', faint:'#3a4455',
      border:'#1e2530', border2:'#2a3445', ai:'#00d4aa',
      card:'#0d1117', hover:'#131920'
    }
  },

  LANGS: {
    tr:{flag:'🇹🇷', name:'Türkçe',   native:'Türkçe'},
    en:{flag:'🇬🇧', name:'English',  native:'English'},
    ru:{flag:'🇷🇺', name:'Rusça',    native:'Русский'},
    de:{flag:'🇩🇪', name:'Almanca',  native:'Deutsch'},
    fr:{flag:'🇫🇷', name:'Fransızca',native:'Français'},
    pl:{flag:'🇵🇱', name:'Lehçe',    native:'Polski'},
    pt:{flag:'🇵🇹', name:'Portekizce',native:'Português'},
    es:{flag:'🇪🇸', name:'İspanyolca',native:'Español'},
    kr:{flag:'🇰🇷', name:'Korece',   native:'한국어'},
  },

  SERVERS: {
    eu: {label:'EU — Avrupa',   api:'https://europe.albion-online-data.com'},
    us: {label:'US — Amerika',  api:'https://west.albion-online-data.com'},
    asia:{label:'Asia — Asya',  api:'https://east.albion-online-data.com'},
  },

  // ─── DEFAULTS ───────────────────────────────────────────
  defaults: { theme:'obsidian', lang:'tr', server:'eu' },

  // ─── GET / SET ───────────────────────────────────────────
  get() {
    try {
      const s = JSON.parse(localStorage.getItem('aot-settings')||'{}');
      return { ...this.defaults, ...s };
    } catch { return { ...this.defaults }; }
  },

  save(patch) {
    const current = this.get();
    const next = { ...current, ...patch };
    localStorage.setItem('aot-settings', JSON.stringify(next));
    return next;
  },

  getTheme(key) {
    const t = this.THEMES[key];
    if (!t) return this.THEMES.obsidian;
    // Özel tema ise localStorage'dan al
    if (key === 'custom') {
      try {
        const c = JSON.parse(localStorage.getItem('aot-custom-theme')||'{}');
        return { ...t, ...c };
      } catch { return t; }
    }
    return t;
  },

  saveCustomTheme(themeObj) {
    localStorage.setItem('aot-custom-theme', JSON.stringify(themeObj));
  },

  // ─── TEMAYIA UYGULA ─────────────────────────────────────
  applyTheme(key) {
    const t = this.getTheme(key);
    const r = document.documentElement;
    r.style.setProperty('--gold',        t.accent);
    r.style.setProperty('--gold-dim',    t.accent + '18');
    r.style.setProperty('--gold-light',  t.accent + 'cc');
    r.style.setProperty('--teal',        t.ai);
    r.style.setProperty('--teal-dim',    t.ai + '12');
    r.style.setProperty('--bg-base',     t.bg);
    r.style.setProperty('--bg-card',     t.nav);
    r.style.setProperty('--bg-card-hover', t.hover);
    r.style.setProperty('--border',      t.border);
    r.style.setProperty('--text-primary', t.text);
    r.style.setProperty('--text-secondary', t.muted);
    r.style.setProperty('--text-muted',  t.faint);
    // meta theme-color (mobil tarayıcı rengi)
    let meta = document.querySelector('meta[name=theme-color]');
    if (!meta) { meta = document.createElement('meta'); meta.name='theme-color'; document.head.appendChild(meta); }
    meta.content = t.bg;
    // body bg
    document.body.style.background = t.bg;
    // navbar badge rengi
    const badge = document.querySelector('.logo-ai-badge');
    if (badge) { badge.style.background = t.accent; badge.style.color = t.bg; }
  },

  // ─── DİL UYGULA ─────────────────────────────────────────
  applyLang(lang) {
    localStorage.setItem('aot-lang', lang);
    document.querySelectorAll('[data-tr]').forEach(el => {
      el.textContent = lang === 'tr' ? el.dataset.tr : (el.dataset[lang] || el.dataset.en || el.dataset.tr);
    });
    // placeholder'lar
    document.querySelectorAll('[data-ph-tr]').forEach(el => {
      el.placeholder = lang === 'tr' ? el.dataset.phTr : (el.dataset['ph'+lang.charAt(0).toUpperCase()+lang.slice(1)] || el.dataset.phEn || el.dataset.phTr);
    });
    // lang label
    const ll = document.getElementById('langLabel');
    if (ll) ll.textContent = lang.toUpperCase();
    // settings panel seçimini güncelle
    document.querySelectorAll('.lang-opt').forEach(b => {
      b.classList.toggle('active', b.dataset.lang === lang);
    });
  },

  // ─── SUNUCU UYGULA ──────────────────────────────────────
  applyServer(serverKey) {
    window.AO_PRICE_API = this.SERVERS[serverKey]?.api || this.SERVERS.eu.api;
    document.querySelectorAll('.server-opt').forEach(b => {
      b.classList.toggle('active', b.dataset.server === serverKey);
    });
  },

  // ─── SAYFA İLK YÜKLEME ──────────────────────────────────
  init() {
    const s = this.get();
    this.applyTheme(s.theme);
    this.applyLang(s.lang);
    this.applyServer(s.server);
  }
};

// Sayfa yüklenince hemen uygula
document.addEventListener('DOMContentLoaded', () => AO_SETTINGS.init());
