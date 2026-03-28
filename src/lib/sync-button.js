// AoT-PNASF — Veri Senkronizasyon Sistemi v3
// Hata güvenli — herhangi bir sayfada çalışır

(function() {
'use strict';

// Path tespiti
var isSubpage = location.pathname.includes('/src/pages/');
var INFO_URL  = isSubpage ? '../data/sync-info.json' : 'src/data/sync-info.json';
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
  return {
    hasUpdate:   false, // Basit: her zaman güncel göster, bot halleder
    itemsCount:  (info && info.items_count)  || 0,
    zonesCount:  (info && info.zones_count)  || 0,
    lastSync:    (info && info.last_sync) ? new Date(info.last_sync).toLocaleString('tr-TR') : '—',
  };
}

async function triggerUpdate() {
  try {
    var res = await fetch('https://api.github.com/repos/' + REPO + '/dispatches', {
      method: 'POST',
      headers: { 'Content-Type':'application/json', 'Accept':'application/vnd.github.v3+json' },
      body: JSON.stringify({ event_type:'manual-sync', client_payload:{ source:'web-button' } }),
    });
    return res.status === 204 || res.status === 200;
  } catch(e) { return false; }
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
    btn.title     = lang === 'tr' ? 'Veri Güncelle' : 'Update Data';
    btn.innerHTML = '<span>🔄</span><span id="navSyncLabel">' + (lang==='tr'?'Veri':'Data') + '</span>';
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
  var btn   = document.getElementById('navSyncBtn');
  var label = document.getElementById('navSyncLabel');
  var lang  = localStorage.getItem('aot-lang') || 'tr';
  if (!btn || btn.disabled) return;
  btn.disabled = true;
  if (label) label.textContent = lang==='tr'?'...':'...';
  var ok = await triggerUpdate();
  if (label) label.textContent = ok ? (lang==='tr'?'✓ Başlatıldı':'✓ Started') : (lang==='tr'?'⚠ Hata':'⚠ Error');
  setTimeout(function() {
    btn.disabled = false;
    if (label) label.textContent = lang==='tr'?'Veri':'Data';
  }, 5000);
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
            '<span class="sync-panel-label">' + (lang==='tr'?'Durum':'Status') + '</span>' +
            '<span class="sync-panel-val ok">✅ ' + (lang==='tr'?'Güncel':'Up to date') + '</span>' +
          '</div>' +
        '</div>' +
        '<button class="sync-panel-btn" id="sp-btn-' + containerId + '" onclick="window._doSyncPanel(this)">' +
          '<span class="ai-dot"></span> ' +
          '<span>' + (lang==='tr'?'Güncelle':'Update') + '</span>' +
        '</button>' +
      '</div>';
  } catch(e) { /* panel hatası sessiz geç */ }
}

window._doSyncPanel = async function(btn) {
  var lang = localStorage.getItem('aot-lang') || 'tr';
  if (btn) btn.disabled = true;
  var ok = await triggerUpdate();
  if (btn) {
    btn.innerHTML = ok
      ? '<span class="ai-dot"></span> ' + (lang==='tr'?'✓ Başlatıldı! (2-3dk)':'✓ Started! (2-3min)')
      : '⚠️ ' + (lang==='tr'?'Hata':'Error');
    setTimeout(function() {
      btn.disabled = false;
      btn.innerHTML = '<span class="ai-dot"></span> ' + (lang==='tr'?'Güncelle':'Update');
    }, 8000);
  }
};

// Global erişim
window.initSyncPanel = initSyncPanel;
window.SYNC = { loadInfo:loadInfo, checkUpdate:checkUpdate, triggerUpdate:triggerUpdate };

// Sayfa yüklenince navbar butonunu başlat
document.addEventListener('DOMContentLoaded', function() {
  initNavSyncBtn();
});

})();
