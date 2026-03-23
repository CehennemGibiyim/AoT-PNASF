// AoT-PNASF — Veri Senkronizasyon Sistemi v2
// Her sayfada çalışır — navbar butonu + sayfa içi panel

const SYNC = {
  REPO:     'CehennemGibiyim/AoT-PNASF',
  WORKFLOW: 'data-sync.yml',
  INFO_URL: (loc => loc.includes('/src/pages/') ? '../data/sync-info.json' : 'src/data/sync-info.json')(location.pathname),
  BIN_API:  'https://api.github.com/repos/ao-data/ao-bin-dumps/commits/master',
  _cache:   null,
  _cacheTime: 0,

  async loadInfo() {
    // 5 dakika cache
    if (this._cache && Date.now() - this._cacheTime < 300000) return this._cache;
    try {
      const res = await fetch(this.INFO_URL + '?t=' + Date.now());
      this._cache = await res.json();
      this._cacheTime = Date.now();
      return this._cache;
    } catch(e) { return null; }
  },

  async getRemoteDate() {
    try {
      const res = await fetch(this.BIN_API);
      const data = await res.json();
      return data?.commit?.committer?.date || null;
    } catch(e) { return null; }
  },

  async checkUpdate() {
    const [info, remote] = await Promise.all([this.loadInfo(), this.getRemoteDate()]);
    return {
      hasUpdate:   !!(remote && info?.ao_bin_dumps_commit && remote !== info.ao_bin_dumps_commit),
      itemsCount:  info?.items_count   || 0,
      zonesCount:  info?.zones_count   || 0,
      lastSync:    info?.last_sync     ? new Date(info.last_sync).toLocaleString('tr-TR') : '—',
      remoteDate:  remote              ? new Date(remote).toLocaleString('tr-TR')         : '—',
    };
  },

  async triggerUpdate() {
    try {
      const res = await fetch(
        `https://api.github.com/repos/${this.REPO}/dispatches`,
        {
          method: 'POST',
          headers: { 'Content-Type':'application/json', 'Accept':'application/vnd.github.v3+json' },
          body: JSON.stringify({ event_type:'manual-sync', client_payload:{ source:'web-button' } }),
        }
      );
      return res.status === 204;
    } catch(e) { return false; }
  },
};

// ─── NAVBAR SYNC BUTONU ──────────────────────────────────
async function initNavSyncBtn() {
  const lang = localStorage.getItem('aot-lang') || 'tr';
  const navRight = document.querySelector('.nav-right');
  if (!navRight) return;

  // Butonu oluştur
  const btn = document.createElement('button');
  btn.className = 'sync-nav-btn';
  btn.id = 'navSyncBtn';
  btn.title = lang === 'tr' ? 'Veri Güncelle' : 'Update Data';
  btn.innerHTML = `<span>🔄</span><span id="navSyncLabel">${lang==='tr'?'Veri':'Data'}</span>`;
  btn.onclick = doNavSync;

  // Settings trigger'dan önce ekle
  const settingsBtn = navRight.querySelector('.settings-trigger');
  if (settingsBtn) navRight.insertBefore(btn, settingsBtn);
  else navRight.prepend(btn);

  // Durum kontrol et
  const info = await SYNC.checkUpdate();
  if (info.hasUpdate) {
    btn.classList.add('has-update');
    btn.title = lang==='tr' ? '🔄 Güncelleme Mevcut!' : '🔄 Update Available!';
    document.getElementById('navSyncLabel').textContent = lang==='tr' ? 'Güncelle!' : 'Update!';
  } else {
    document.getElementById('navSyncLabel').textContent = lang==='tr'
      ? info.itemsCount > 0 ? `${(info.itemsCount/1000).toFixed(1)}K eşya` : 'Veri'
      : info.itemsCount > 0 ? `${(info.itemsCount/1000).toFixed(1)}K items` : 'Data';
  }
}

async function doNavSync() {
  const btn = document.getElementById('navSyncBtn');
  const lang = localStorage.getItem('aot-lang') || 'tr';
  if (!btn || btn.classList.contains('syncing')) return;
  btn.classList.add('syncing');
  btn.classList.remove('has-update');
  document.getElementById('navSyncLabel').textContent = lang==='tr'?'Güncelleniyor...':'Updating...';
  const ok = await SYNC.triggerUpdate();
  if (ok) {
    document.getElementById('navSyncLabel').textContent = lang==='tr'?'Başlatıldı ✓':'Started ✓';
    btn.style.borderColor = 'var(--teal)';
    btn.style.color = 'var(--teal)';
    setTimeout(() => {
      btn.classList.remove('syncing');
      btn.style.borderColor = '';
      btn.style.color = '';
      document.getElementById('navSyncLabel').textContent = lang==='tr'?'Veri':'Data';
    }, 5000);
  } else {
    document.getElementById('navSyncLabel').textContent = lang==='tr'?'Hata':'Error';
    btn.style.borderColor = '#ef4444';
    btn.style.color = '#ef4444';
    setTimeout(() => {
      btn.classList.remove('syncing');
      btn.style.borderColor = '';
      btn.style.color = '';
      document.getElementById('navSyncLabel').textContent = lang==='tr'?'Veri':'Data';
    }, 3000);
  }
}

// ─── SAYFA İÇİ SYNC PANELİ ───────────────────────────────
async function initSyncPanel(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const lang = localStorage.getItem('aot-lang') || 'tr';

  container.innerHTML = `<div class="sync-panel">
    <div class="sync-panel-info">
      <div class="sync-panel-item">
        <span class="sync-panel-label">${lang==='tr'?'Eşya Sayısı':'Items'}</span>
        <span class="sync-panel-val" id="sp-items">Yükleniyor...</span>
      </div>
      <div class="sync-panel-item">
        <span class="sync-panel-label">${lang==='tr'?'Son Güncelleme':'Last Sync'}</span>
        <span class="sync-panel-val" id="sp-date">—</span>
      </div>
      <div class="sync-panel-item">
        <span class="sync-panel-label">${lang==='tr'?'Durum':'Status'}</span>
        <span class="sync-panel-val" id="sp-status">—</span>
      </div>
    </div>
    <button class="sync-panel-btn" id="sp-btn" onclick="doSyncPanel()">
      <span class="ai-dot"></span>
      <span id="sp-btn-text">${lang==='tr'?'Güncelle':'Update'}</span>
    </button>
  </div>`;

  const info = await SYNC.checkUpdate();
  const L = lang === 'tr';

  document.getElementById('sp-items').textContent =
    info.itemsCount > 0 ? info.itemsCount.toLocaleString('tr-TR') + (L?' eşya':' items') : '—';
  document.getElementById('sp-date').textContent  = info.lastSync;

  const statusEl = document.getElementById('sp-status');
  const btnEl    = document.getElementById('sp-btn');
  if (info.hasUpdate) {
    statusEl.textContent = L ? '🔄 Güncelleme Mevcut' : '🔄 Update Available';
    statusEl.className   = 'sync-panel-val update';
  } else if (info.itemsCount > 0) {
    statusEl.textContent = L ? '✅ Güncel' : '✅ Up to date';
    statusEl.className   = 'sync-panel-val ok';
    btnEl.className      = 'sync-panel-btn ok-btn';
    document.getElementById('sp-btn-text').textContent = L ? 'Kontrol Et' : 'Check';
  } else {
    statusEl.textContent = L ? '⚠️ Veri yok — güncelle' : '⚠️ No data — update';
    statusEl.className   = 'sync-panel-val update';
  }
}

window.doSyncPanel = async function() {
  const btn  = document.getElementById('sp-btn');
  const lang = localStorage.getItem('aot-lang') || 'tr';
  const L    = lang === 'tr';
  if (!btn || btn.disabled) return;
  btn.disabled = true;
  document.getElementById('sp-btn-text').textContent = L ? 'Güncelleniyor...' : 'Updating...';
  const ok = await SYNC.triggerUpdate();
  if (ok) {
    document.getElementById('sp-btn-text').textContent = L ? '✓ Başlatıldı! (2-3dk)' : '✓ Started! (2-3min)';
    btn.className = 'sync-panel-btn ok-btn';
    document.getElementById('sp-status').textContent = L ? '⏳ Bot çalışıyor...' : '⏳ Bot running...';
    setTimeout(() => { btn.disabled = false; document.getElementById('sp-btn-text').textContent = L?'Güncelle':'Update'; }, 10000);
  } else {
    document.getElementById('sp-btn-text').textContent = L ? '⚠️ Hata — Tekrar Dene' : '⚠️ Error — Retry';
    setTimeout(() => { btn.disabled = false; document.getElementById('sp-btn-text').textContent = L?'Güncelle':'Update'; }, 3000);
  }
};

// Sayfa yüklenince navbar butonunu başlat
document.addEventListener('DOMContentLoaded', () => {
  initNavSyncBtn();
});
