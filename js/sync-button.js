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
  // Seçenek 1: Manuel tetikleme yerine otomatik süreç kullanıldığı için bu fonksiyon iptal edildi.
  return 'cancelled'; 
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
  var lang = localStorage.getItem('aot-lang') || 'tr';
  var msg = lang === 'tr'
    ? "Tüm veriler (Market, PvP vb.) arka planda sunucu tarafından otomatik olarak senkronize edilmektedir.\nSizin ekstra bir güncelleme yapmanıza gerek yoktur."
    : "All data (Market, PvP etc.) is automatically synchronized by the server in the background.\nNo manual update is required.";
  alert(msg);
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
