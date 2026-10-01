// Project export: packages every tracked workspace file into one downloadable archive.
const PROJECT_FILES = [
  '.github/workflows/ai-bot.yml', '.github/workflows/ao-data-updater.yml', '.github/workflows/deploy.yml', '.github/workflows/pvp-fetcher.yml',
  '.gitignore', '404.html', 'crafting.html', 'generate-translations.py', 'index.html', 'license', 'market.html', 'miniapp.i18n.json', 'package.json', 'readme.md',
  'data/fech_items.js', 'data/feed.json', 'data/items-data.js', 'data/items-index.js', 'data/items-loader.js', 'data/items-manifest.js', 'data/items-weight.json', 'data/opportunities.json', 'data/pvp-feed.json', 'data/spells-data.json', 'data/sync-info.json', 'data/world-data.js', 'data/zone-bonuses.js',
  'locales/tr-official.json', 'locales/tr.json',
  'js/accessibility.js', 'js/ai-build.js', 'js/ai-feed.js', 'js/arbitrage.js', 'js/avalon.js', 'js/chat-widget.js', 'js/crafting-new.js', 'js/crafting-planner.js', 'js/crafting.js', 'js/events.js', 'js/gathering.js', 'js/home.js', 'js/i18n-helper.js', 'js/image-cache.js', 'js/live-stats-bar.js', 'js/loot.js', 'js/main.js', 'js/market-assistant.js', 'js/market-ledger.js', 'js/market-network.js', 'js/market-new.js', 'js/market-profit.js', 'js/market-watchlist.js', 'js/nav.js', 'js/pvp.js', 'js/settings-lib.js', 'js/settings-panel.js', 'js/silver-calculator.js', 'js/smart-scanner.js', 'js/social-hub.js', 'js/sync-button.js', 'js/zipper.js',
  'lib/crafting-legacy.js', 'lib/feed.js', 'lib/guides.js', 'lib/lang.js', 'lib/maps.js', 'lib/market.js', 'lib/nav.js', 'lib/pvp.js', 'lib/settings-panel.js', 'lib/settings.js', 'lib/sync-button.js', 'lib/tools.js',
  'pages/crafting.html', 'pages/guides.html', 'pages/maps.html', 'pages/market.html', 'pages/pvp.html', 'pages/tools.html',
  'scripts/ai-scanner.js', 'scripts/ao-data-extractor.cjs', 'scripts/check-quality.cjs', 'scripts/generate-items.py', 'scripts/generate-world.py', 'scripts/pvp-fencher.cjs', 'scripts/pvp-fetcher.cjs', 'scripts/split-locales.cjs', 'scripts/validate-project.cjs',
  'styles.css', 'styles/accessibility.css', 'styles/crafting.css', 'styles/guides.css', 'styles/home.css', 'styles/maps.css', 'styles/main.css', 'styles/market.css', 'styles/pvp.css', 'styles/settings.css', 'styles/tools.css'
];

function zipCrc32(data) {
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i += 1) {
    crc ^= data[i];
    for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function zipNumber(value, bytes) {
  const output = new Uint8Array(bytes);
  let number = value >>> 0;
  for (let i = 0; i < bytes; i += 1) {
    output[i] = number & 0xff;
    number >>>= 8;
  }
  return output;
}

function zipJoin(parts) {
  const total = parts.reduce((sum, part) => sum + part.length, 0);
  const output = new Uint8Array(total);
  let offset = 0;
  parts.forEach(part => { output.set(part, offset); offset += part.length; });
  return output;
}

function makeZipBlob(entries, onProgress) {
  const localParts = [];
  const centralParts = [];
  let offset = 0;
  entries.forEach((entry, index) => {
    const name = new TextEncoder().encode(entry.path);
    const crc = zipCrc32(entry.data);
    const header = zipJoin([
      new Uint8Array([0x50, 0x4b, 0x03, 0x04]), zipNumber(20, 2), zipNumber(0, 2), zipNumber(0, 2),
      zipNumber(0, 2), zipNumber(0, 2), zipNumber(crc, 4), zipNumber(entry.data.length, 4), zipNumber(entry.data.length, 4),
      zipNumber(name.length, 2), zipNumber(0, 2), name
    ]);
    localParts.push(header, entry.data);
    const central = zipJoin([
      new Uint8Array([0x50, 0x4b, 0x01, 0x02]), zipNumber(20, 2), zipNumber(20, 2), zipNumber(0, 2), zipNumber(0, 2),
      zipNumber(0, 2), zipNumber(0, 2), zipNumber(crc, 4), zipNumber(entry.data.length, 4), zipNumber(entry.data.length, 4),
      zipNumber(name.length, 2), zipNumber(0, 2), zipNumber(0, 2), zipNumber(0, 2), zipNumber(0, 2), zipNumber(0, 4), zipNumber(offset, 4), name
    ]);
    centralParts.push(central);
    offset += header.length + entry.data.length;
    onProgress?.(index + 1, entries.length);
  });
  const central = zipJoin(centralParts);
  const end = zipJoin([
    new Uint8Array([0x50, 0x4b, 0x05, 0x06]), zipNumber(0, 2), zipNumber(0, 2), zipNumber(entries.length, 2), zipNumber(entries.length, 2),
    zipNumber(central.length, 4), zipNumber(offset, 4), zipNumber(0, 2)
  ]);
  return new Blob([...localParts, central, end], { type: 'application/zip' });
}

window.downloadProjectAsZip = async function downloadProjectAsZip() {
  const overlay = document.createElement('div');
  overlay.className = 'project-export-overlay';
  overlay.innerHTML = '<div class="project-export-card"><div class="project-export-icon" aria-hidden="true"><i class="fa-solid fa-file-zipper"></i></div><h2 class="project-export-title"></h2><p class="project-export-status" aria-live="polite"></p><div class="project-export-progress" aria-hidden="true"><span></span></div><button class="project-export-close" type="button"></button></div>';
  document.body.appendChild(overlay);
  const title = overlay.querySelector('.project-export-title');
  const status = overlay.querySelector('.project-export-status');
  const progress = overlay.querySelector('.project-export-progress span');
  const closeButton = overlay.querySelector('.project-export-close');
  const translate = (key, fallback, values) => {
    try { return window.miniappI18n?.t(key, values) || fallback; } catch (error) { return fallback; }
  };
  const setStatus = (key, fallback, values) => { status.textContent = translate(key, fallback, values); };
  title.textContent = translate('zipper-title', 'Proje paketleniyor...');
  closeButton.textContent = translate('zipper-close', 'Kapat');
  closeButton.hidden = true;
  closeButton.addEventListener('click', () => overlay.remove());

  const entries = [];
  let failed = 0;
  try {
    for (let index = 0; index < PROJECT_FILES.length; index += 1) {
      const path = PROJECT_FILES[index];
      setStatus('zipper-addingFile', `${path} ekleniyor... (${index + 1}/${PROJECT_FILES.length})`, { path, current: index + 1, total: PROJECT_FILES.length });
      progress.style.width = `${((index + 1) / PROJECT_FILES.length) * 60}%`;
      try {
        const response = await fetch(`${path}?download=${Date.now()}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        entries.push({ path, data: new Uint8Array(await response.arrayBuffer()) });
      } catch (error) {
        failed += 1;
        console.warn('Proje dışa aktarmada dosya atlandı:', path, error);
      }
    }
    setStatus('zipper-compressing', 'Dosyalar arşivleniyor...');
    const content = makeZipBlob(entries, (current, total) => { progress.style.width = `${60 + (current / total) * 40}%`; });
    const url = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'AoT-PNASF-Full-Project.zip';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    progress.style.width = '100%';
    setStatus('zipper-success', `${entries.length} dosya arşivlendi.`, { success: entries.length, failed });
    status.classList.add('project-export-success');
    closeButton.hidden = false;
    setTimeout(() => overlay.remove(), 3500);
  } catch (error) {
    console.error('Proje ZIP oluşturulamadı:', error);
    setStatus('zipper-error', 'ZIP oluşturulamadı. Lütfen tekrar deneyin.');
    status.classList.add('project-export-error');
    closeButton.hidden = false;
  }
};
