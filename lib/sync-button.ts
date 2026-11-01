// AoT-PNASF — Veri Senkronizasyon Sistemi v3
// Hata güvenli — herhangi bir sayfada çalışır

(function() {
'use strict';

// Path tespiti
var isSubpage = location.pathname.includes('/pages/');
var INFO_URL  = isSubpage ? '../data/sync-info.json' : 'data/sync-info.json';
var REPO      = 'CehennemGibiyim/AoT-PNASF';
var _cache    = null;
var _cacheT   = 0;

async function loadInfo() {
  if (_cache && Date.now() - _cacheT < 300000) return _cache;
  try {
    var res = await fetch(INFO_URL + '?t=' + Date.now());
    if (!res.ok) return null;
    _cache = await res.json();
    _cacheT = Date.now();
    return _cache;
  } catch(e) { return null; }
}

async function checkUpdate() {
  var info = await loadInfo();
  var lastSyncMs = info && info.last_sync ? Date.parse(info.last_sync) : 0;
  var ageHours = lastSyncMs ? (Date.now() - lastSyncMs) / 3600000 : Infinity;
  return {
    hasUpdate:   ageHours > 24 || info?.status === 'stale_pending_manual_run',
    itemsCount:  (info && (info.normalized_items_count || info.items_count)) || 0,
    zonesCount:  (info && info.zones_count) || 0,
    lastSync:    lastSyncMs ? new Date(lastSyncMs).toLocaleString('tr-TR') : '—',
    ageHours:    Number.isFinite(ageHours) ? Math.round(ageHours) : null,
    status:      info?.status || 'unknown'
  };
}

async function triggerUpdate() {
  // Aşama 8: istemci tarafı güncelleme akışı — önbellekleri baypasseyerek veriyi tazeler.
  try {
    _cache = null; _cacheT = 0;
    var isSubpage = location.pathname.includes('/pages/');
    var FEED_URL = isSubpage ? '../data/pvp-feed.json' : 'data/pvp-feed.json';
    await fetch(FEED_URL + '?t=' + Date.now(), { cache: 'no-store' });
    var info = await checkUpdate();
    return info.hasUpdate ? 'stale' : 'ok';
  } catch (e) {
    return 'error';
  }
}

// ── NAVBAR BUTONU ──────────────────────────────────────
async function initNavSyncBtn() {
  try {
    var navRight = document.querySelector('.nav-right');
    if (!navRight || document.getElementById('navSyncBtn')) return;

    var lang = localStorage.getItem('aot-lang') || 'tr';
    var btn  = document.createElement('button');
    btn.id        = 'navSyncBtn';
    btn.className = 'sync-nav-btn';
    btn.title     = lang === 'tr' ? 'Veri Durumu' : 'Data Status';
    btn.innerHTML = '<span>📘</span><span id="navSyncLabel">' + (lang==='tr'?'Veri':'Data') + '</span>';
    btn.onclick   = doNavSync;

    var settingsBtn = navRight.querySelector('.settings-trigger');
    if (settingsBtn) navRight.insertBefore(btn, settingsBtn);
    else navRight.prepend(btn);

    var info = await checkUpdate();
    var label = document.getElementById('navSyncLabel');
    if (label && info.itemsCount > 0) {
      label.textContent = (info.itemsCount / 1000).toFixed(1) + 'K ' + (lang==='tr'?'eşya':'items');
    }
  } catch(e) { /* navbar hatası sessiz geç */ }
}

async function doNavSync() {
  try {
    var existing = document.getElementById('syncPopover');
    if (existing) { existing.remove(); return; }
    var lang = localStorage.getItem('aot-lang') || 'tr';
    var isSubpage = location.pathname.includes('/pages/');
    var FEED_URL = isSubpage ? '../data/pvp-feed.json' : 'data/pvp-feed.json';

    ensurePopoverStyles();
    var pop = document.createElement('div');
    pop.id = 'syncPopover';
    pop.innerHTML =
      '<div class="sync-pop-head">' +
        '<span>📘 ' + (lang === 'tr' ? 'Veri Durumu' : 'Data Status') + '</span>' +
        '<button class="sync-pop-close" id="syncPopClose" aria-label="Kapat" title="Kapat">✕</button>' +
      '</div>' +
      '<div class="sync-pop-body" id="syncPopBody">…</div>' +
      '<div class="sync-pop-actions">' +
        '<button class="sync-pop-btn" id="syncPopRefresh">⟳ ' + (lang === 'tr' ? 'Verileri Yenile' : 'Refresh Data') + '</button>' +
        '<a class="sync-pop-btn" href="https://github.com/CehennemGibiyim/AoT-PNASF/actions/workflows/ai-bot.yml" target="_blank" rel="noopener">🤖 ' + (lang === 'tr' ? 'Bot\'u Çalıştır' : 'Run Bot') + ' ↗</a>' +
      '</div>';
    document.body.appendChild(pop);

    document.getElementById('syncPopClose')!.onclick = function () { pop.remove(); };
    document.getElementById('syncPopRefresh')!.onclick = async function () {
      var body = document.getElementById('syncPopBody');
      if (body) body.textContent = lang === 'tr' ? 'Yenileniyor…' : 'Refreshing…';
      _cache = null; _cacheT = 0;
      try { await fetch(FEED_URL + '?t=' + Date.now(), { cache: 'no-store' }); } catch (e) { /* yoksay */ }
      await renderPopoverBody(FEED_URL);
    };
    await renderPopoverBody(FEED_URL);
  } catch (e) { /* panel hatası sessiz geç */ }
}

async function renderPopoverBody(feedUrl: string) {
  var body = document.getElementById('syncPopBody');
  if (!body) return;
  var lang = localStorage.getItem('aot-lang') || 'tr';
  var info = await checkUpdate();

  var feedAge = '—';
  try {
    var res = await fetch(feedUrl + '?t=' + Date.now(), { cache: 'no-store' });
    if (res.ok) {
      var feed = await res.json();
      if (feed && feed.fetchedAt) {
        feedAge = new Date(feed.fetchedAt).toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US');
      }
    }
  } catch (e) { /* feed yoksa boş bırak */ }

  var rows = [
    [lang === 'tr' ? 'Eşya' : 'Items', info.itemsCount > 0 ? info.itemsCount.toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US') : '—'],
    [lang === 'tr' ? 'Son Senkron' : 'Last Sync', info.lastSync],
    [lang === 'tr' ? 'Bölge' : 'Zones', info.zonesCount > 0 ? String(info.zonesCount) : '—'],
    [lang === 'tr' ? 'PvP Feed' : 'PvP Feed', feedAge],
    [lang === 'tr' ? 'Durum' : 'Status', '🔄 ' + (lang === 'tr' ? 'Otomatik (6 saatte bir)' : 'Auto (every 6h)')]
  ];
  body.innerHTML = rows.map(function (r) {
    return '<div class="sync-pop-row"><span>' + r[0] + '</span><b>' + r[1] + '</b></div>';
  }).join('');
}

function ensurePopoverStyles() {
  if (document.getElementById('sync-pop-style')) return;
  var style = document.createElement('style');
  style.id = 'sync-pop-style';
  style.textContent =
    '#syncPopover{position:fixed;top:66px;right:16px;z-index:10000;width:300px;background:#14161c;border:1px solid rgba(201,168,76,.45);border-radius:10px;box-shadow:0 18px 50px rgba(0,0,0,.6);font-family:Inter,system-ui,sans-serif;color:#e8e8e8;overflow:hidden;animation:syncPopIn .18s ease}' +
    '@keyframes syncPopIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}' +
    '.sync-pop-head{display:flex;justify-content:space-between;align-items:center;padding:12px 14px;background:rgba(201,168,76,.12);font-weight:700;font-size:14px;color:#f0d78c}' +
    '.sync-pop-close{background:none;border:none;color:#9aa0a6;font-size:14px;cursor:pointer;padding:2px 6px}' +
    '.sync-pop-close:hover{color:#fff}' +
    '.sync-pop-body{padding:10px 14px}' +
    '.sync-pop-row{display:flex;justify-content:space-between;gap:10px;padding:6px 0;font-size:12.5px;border-bottom:1px dashed rgba(255,255,255,.08)}' +
    '.sync-pop-row:last-child{border-bottom:none}' +
    '.sync-pop-row span{color:#9aa0a6}' +
    '.sync-pop-row b{color:#f0d78c;font-weight:600;text-align:right}' +
    '.sync-pop-actions{display:flex;gap:8px;padding:10px 14px 14px}' +
    '.sync-pop-btn{flex:1;text-align:center;padding:8px 10px;border-radius:6px;border:1px solid rgba(201,168,76,.5);background:rgba(201,168,76,.14);color:#f0d78c;font-size:12.5px;font-weight:600;cursor:pointer;text-decoration:none;transition:all .15s}' +
    '.sync-pop-btn:hover{background:rgba(201,168,76,.3)}';
  document.head.appendChild(style);
}

// ── SAYFA PANELİ ──────────────────────────────────────
async function initSyncPanel(containerId) {
  try {
    var container = document.getElementById(containerId);
    if (!container) return;
    var lang = localStorage.getItem('aot-lang') || 'tr';
    var info = await checkUpdate();

    container.innerHTML =
      '<div class="sync-panel">' +
        '<div class="sync-panel-info">' +
          '<div class="sync-panel-item">' +
            '<span class="sync-panel-label">' + (lang==='tr'?'Eşya':'Items') + '</span>' +
            '<span class="sync-panel-val">' + (info.itemsCount > 0 ? info.itemsCount.toLocaleString('tr-TR') : '—') + '</span>' +
          '</div>' +
          '<div class="sync-panel-item">' +
            '<span class="sync-panel-label">' + (lang==='tr'?'Son Güncelleme':'Last Sync') + '</span>' +
            '<span class="sync-panel-val">' + info.lastSync + '</span>' +
          '</div>' +
          '<div class="sync-panel-item">' +
            '<span class="sync-panel-label">' + (lang==='tr'?'Sistem':'System') + '</span>' +
            '<span class="sync-panel-val ok">🔄 ' + (lang==='tr'?'Otomatik':'Auto Sync') + '</span>' +
          '</div>' +
        '</div>' +
      '</div>';
  } catch(e) { /* panel hatası sessiz geç */ }
}

window._doSyncPanel = async function(btn) {
  // Buton kaldırıldığı için boş fonksiyon olarak bırakıldı.
};

// Global erişim
window.initSyncPanel = initSyncPanel;
window.SYNC = { loadInfo:loadInfo, checkUpdate:checkUpdate, triggerUpdate:triggerUpdate };

// Sayfa yüklenince navbar butonunu başlat
document.addEventListener('DOMContentLoaded', function() {
  initNavSyncBtn();
});

})();

export {};
