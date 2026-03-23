// AoT-PNASF — Veri Güncelleme Sistemi
// Herhangi bir kullanıcı tetikleyebilir — bot günceller

const SYNC = {
  REPO:     'CehennemGibiyim/AoT-PNASF',
  WORKFLOW: 'data-sync.yml',
  INFO_URL: 'src/data/sync-info.json',
  BIN_API:  'https://api.github.com/repos/ao-data/ao-bin-dumps/commits/master',

  // Son güncelleme bilgisini yükle
  async loadInfo() {
    try {
      const res = await fetch(`${SYNC.INFO_URL}?t=${Date.now()}`);
      return await res.json();
    } catch(e) { return null; }
  },

  // ao-bin-dumps'ın son commit tarihini al
  async getRemoteDate() {
    try {
      const res = await fetch(SYNC.BIN_API);
      const data = await res.json();
      return data?.commit?.author?.date || data?.commit?.committer?.date || null;
    } catch(e) { return null; }
  },

  // Güncelleme var mı kontrol et
  async checkUpdate() {
    const [info, remote] = await Promise.all([SYNC.loadInfo(), SYNC.getRemoteDate()]);
    const local = info?.ao_bin_dumps_commit || null;
    return {
      hasUpdate: remote && local !== remote,
      localDate: local ? new Date(local).toLocaleString('tr-TR') : 'Bilinmiyor',
      remoteDate: remote ? new Date(remote).toLocaleString('tr-TR') : 'Bilinmiyor',
      itemsCount: info?.items_count || 0,
      lastSync: info?.last_sync ? new Date(info.last_sync).toLocaleString('tr-TR') : 'Hiç güncellenmedi',
    };
  },

  // GitHub Actions workflow'u tetikle
  async triggerUpdate() {
    try {
      // GitHub'ın repository_dispatch event'ini kullan — token gerektirmez
      const res = await fetch(
        `https://api.github.com/repos/${SYNC.REPO}/dispatches`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/vnd.github.v3+json' },
          body: JSON.stringify({ event_type: 'manual-sync', client_payload: { source: 'web-button' } }),
        }
      );
      return res.status === 204;
    } catch(e) { return false; }
  },
};

// ─── UI BILEŞENI ─────────────────────────────────────────
async function initSyncButton(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const lang = localStorage.getItem('aot-lang') || 'tr';
  const L = {
    tr: { checking:'Kontrol ediliyor...', upToDate:'✅ Güncel', updateAvailable:'🔄 Güncelleme Mevcut', update:'Güncelle', updating:'Güncelleniyor...', done:'✅ Güncelleme Başlatıldı!', error:'⚠️ Hata', lastSync:'Son güncelleme:', items:'eşya', failed:'Güncelleme başlatılamadı.' },
    en: { checking:'Checking...', upToDate:'✅ Up to date', updateAvailable:'🔄 Update Available', update:'Update', updating:'Updating...', done:'✅ Update Started!', error:'⚠️ Error', lastSync:'Last sync:', items:'items', failed:'Could not start update.' },
  };
  const t = L[lang] || L.tr;

  container.innerHTML = `
    <div class="sync-widget">
      <div class="sync-status" id="syncStatus">
        <div class="sync-checking">${t.checking}</div>
      </div>
      <button class="sync-btn" id="syncBtn" onclick="doSync()" style="display:none">
        <span class="ai-dot"></span> ${t.update}
      </button>
    </div>`;

  // Durum kontrol et
  const info = await SYNC.checkUpdate();
  const status = document.getElementById('syncStatus');
  const btn    = document.getElementById('syncBtn');

  status.innerHTML = `
    <div class="sync-info-row">
      <span class="sync-label">${t.lastSync}</span>
      <span class="sync-val">${info.lastSync}</span>
    </div>
    <div class="sync-info-row">
      <span class="sync-label">${lang==='tr'?'Eşya sayısı:':'Items:'}</span>
      <span class="sync-val">${info.itemsCount.toLocaleString('tr-TR')} ${t.items}</span>
    </div>
    <div class="sync-badge ${info.hasUpdate ? 'sync-badge-update' : 'sync-badge-ok'}">
      ${info.hasUpdate ? t.updateAvailable : t.upToDate}
    </div>`;

  if (info.hasUpdate) {
    btn.style.display = 'flex';
  }

  window.doSync = async function() {
    const btn = document.getElementById('syncBtn');
    const lang = localStorage.getItem('aot-lang') || 'tr';
    const t2 = L[lang] || L.tr;
    btn.disabled = true;
    btn.innerHTML = `<span class="loading-spinner" style="width:14px;height:14px;border-width:2px"></span> ${t2.updating}`;
    const ok = await SYNC.triggerUpdate();
    if (ok) {
      btn.innerHTML = t2.done;
      btn.style.background = 'var(--teal)';
      setTimeout(() => { btn.innerHTML = t2.update; btn.disabled = false; btn.style.background = ''; }, 5000);
    } else {
      btn.innerHTML = t2.failed;
      btn.style.background = '#ef4444';
      setTimeout(() => { btn.innerHTML = t2.update; btn.disabled = false; btn.style.background = ''; }, 3000);
    }
  };
}
