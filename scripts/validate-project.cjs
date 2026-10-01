const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const generatedMode = process.argv.includes('--generated');
const failures = [];
const warnings = [];

function read(relativePath) {
  const fullPath = path.join(ROOT, relativePath);
  if (!fs.existsSync(fullPath)) {
    failures.push(`Eksik dosya: ${relativePath}`);
    return '';
  }
  return fs.readFileSync(fullPath, 'utf8');
}

function parseJson(relativePath) {
  try {
    return JSON.parse(read(relativePath));
  } catch (error) {
    failures.push(`Geçersiz JSON: ${relativePath} (${error.message})`);
    return null;
  }
}

function parseAssignedArray(source, label) {
  const match = source.match(new RegExp(`${label}\\s*=\\s*(\\[[\\s\\S]*?\\]);`));
  if (!match) {
    failures.push(`${label} dizisi bulunamadı`);
    return null;
  }
  try {
    return JSON.parse(match[1]);
  } catch (error) {
    failures.push(`${label} JSON olarak okunamadı (${error.message})`);
    return null;
  }
}

function listHtmlFiles(directory = ROOT) {
  const files = [];
  if (!fs.existsSync(directory)) return files;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.git')) continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...listHtmlFiles(fullPath));
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(fullPath);
  }
  return files;
}

function checkIndexReferences() {
  for (const fullPath of listHtmlFiles()) {
    const relativePath = path.relative(ROOT, fullPath).replace(/\\/g, '/');
    const html = fs.readFileSync(fullPath, 'utf8');
    for (const match of html.matchAll(/<(?:script|link|iframe)[^>]+(?:src|href)=["']([^"']+)["']/gi)) {
      const target = match[1];
      if (/^(https?:|data:|#|\/|mailto:|javascript:)/i.test(target)) continue;
      const cleanTarget = target.split('?')[0].split('#')[0];
      const resolved = path.resolve(path.dirname(fullPath), cleanTarget);
      if (cleanTarget && !fs.existsSync(resolved)) {
        failures.push(`${relativePath} referansı eksik: ${cleanTarget}`);
      }
    }
  }
  const html = read('index.html');
  const requiredMarkers = ['tab-home', 'tab-crafting', 'tab-pvp', 'tab-arbitrage', 'tab-ai-build'];
  for (const marker of requiredMarkers) {
    if (!html.includes(`id="${marker}"`)) failures.push(`Ana sekme eksik: ${marker}`);
  }
}

function checkJavaScriptSyntax() {
  const roots = ['js', 'lib', 'data', 'scripts'];
  for (const root of roots) {
    const directory = path.join(ROOT, root);
    if (!fs.existsSync(directory)) continue;
    for (const entry of fs.readdirSync(directory)) {
      if (!/\.(?:js|cjs)$/.test(entry)) continue;
      const relativePath = path.join(root, entry);
      const source = read(relativePath);
      try {
        new vm.Script(source, { filename: relativePath });
      } catch (error) {
        failures.push(`JavaScript sözdizimi hatası: ${relativePath} (${error.message})`);
      }
    }
  }
}

function checkDataQuality() {
  const sync = parseJson('data/sync-info.json');
  const payloads = [
    ['data/items-weight.json', 'weights_count'],
    ['data/spells-data.json', 'spells_count'],
    ['locales/tr-official.json', null]
  ];
  for (const [relativePath, countKey] of payloads) {
    const value = parseJson(relativePath);
    if (!value || typeof value !== 'object' || Array.isArray(value)) continue;
    const count = Object.keys(value).length;
    if (generatedMode && count === 0) failures.push(`Üretilmiş veri boş: ${relativePath}`);
    if (!generatedMode && count === 0) warnings.push(`Veri henüz üretilmemiş veya boş: ${relativePath}`);
    if (relativePath === 'data/items-weight.json') {
      for (const [itemId, weight] of Object.entries(value)) {
        if (!Number.isFinite(Number(weight)) || Number(weight) < 0) {
          failures.push(`Geçersiz item ağırlığı: ${itemId}`);
        }
      }
    }
    if (relativePath === 'data/spells-data.json') {
      for (const [itemId, spells] of Object.entries(value)) {
        if (!Array.isArray(spells) || spells.some((spell) => (
          !spell || !spell.name || !Number.isFinite(Number(spell.cooldown)) || Number(spell.cooldown) < 0
        ))) {
          failures.push(`Geçersiz yetenek kaydı: ${itemId}`);
        }
      }
    }
    if (generatedMode && sync && countKey && Number(sync[countKey] || 0) !== count) {
      failures.push(`${relativePath} kayıt sayısı uyuşmuyor: ${sync[countKey]} != ${count}`);
    }
  }
  if (generatedMode && sync) {
    if (Number(sync.items_count || 0) <= 0 || Number(sync.normalized_items_count || 0) <= 0) {
      failures.push('Üretilmiş senkron bilgisi item sayısını içermiyor');
    }
    if (Number(sync.normalized_items_count) > Number(sync.items_count)) {
      failures.push('Normalize item sayısı ham item sayısından büyük');
    }
  }
}

function checkLocaleShards() {
  const manifestPath = path.join(ROOT, 'locales', 'tr-official-manifest.json');
  if (!fs.existsSync(manifestPath)) return;
  const manifest = parseJson('locales/tr-official-manifest.json');
  if (!manifest || !Array.isArray(manifest.files) || !manifest.files.length) {
    failures.push('Resmi çeviri parça manifesti geçersiz');
    return;
  }
  const merged = {};
  for (const file of manifest.files) {
    const part = parseJson(path.join('locales', file));
    if (!part || typeof part !== 'object' || Array.isArray(part)) continue;
    Object.assign(merged, part);
  }
  const full = parseJson('locales/tr-official.json');
  if (full && Object.keys(merged).length !== Object.keys(full).length) {
    failures.push(`Resmi çeviri parça toplamı uyuşmuyor: ${Object.keys(merged).length} != ${Object.keys(full).length}`);
  }
}

function checkItems() {
  const items = parseAssignedArray(read('data/items-data.js'), 'window\\.AO_ITEMS');
  if (!Array.isArray(items) || !items.length) {
    failures.push('Ana item listesi boş');
    return 0;
  }
  const ids = new Set();
  for (const item of items) {
    if (!item || !item.id) failures.push('Kimliksiz item bulundu');
    else if (ids.has(String(item.id))) failures.push(`Tekrarlanan item id: ${item.id}`);
    else ids.add(String(item.id));
  }

  const sync = parseJson('data/sync-info.json');
  if (sync && sync.normalized_items_count !== items.length) {
    failures.push(`sync-info item sayısı uyuşmuyor: ${sync.normalized_items_count} != ${items.length}`);
  }
  for (const relativePath of ['data/items-weight.json', 'data/spells-data.json', 'locales/tr-official.json']) {
    const value = parseJson(relativePath);
    if (value === null || typeof value !== 'object' || Array.isArray(value)) failures.push(`${relativePath} nesne olmalı`);
  }

  const manifestSource = read('data/items-manifest.js');
  const manifestMatch = manifestSource.match(/window\.AO_ITEMS_MANIFEST\s*=\s*(\{[\s\S]*?\});/);
  let manifest = null;
  try { manifest = manifestMatch ? JSON.parse(manifestMatch[1]) : null; } catch (error) { failures.push(`Item manifest JSON olarak okunamadı: ${error.message}`); }
  if (!manifest) failures.push('Item manifest bulunamadı');

  if (generatedMode) {
    if (!manifest || manifest.mode !== 'category-chunks' || !Array.isArray(manifest.files) || !manifest.files.length) {
      failures.push('Üretilmiş modda kategori item manifesti eksik');
    } else {
      const chunkIds = new Set();
      let chunkCount = 0;
      for (const file of manifest.files) {
        const source = read(path.join('data', file));
        const key = file.replace(/^items-/, '').replace(/\.js$/, '');
        const chunk = parseAssignedArray(source, `window\\.AO_ITEM_CHUNKS\\["${key}"\\]`);
        if (!Array.isArray(chunk)) continue;
        chunkCount += chunk.length;
        for (const item of chunk) if (item && item.id) chunkIds.add(String(item.id));
      }
      if (chunkCount !== items.length) failures.push(`Kategori toplamı uyuşmuyor: ${chunkCount} != ${items.length}`);
      if (chunkIds.size !== ids.size) failures.push(`Kategori benzersiz item sayısı uyuşmuyor: ${chunkIds.size} != ${ids.size}`);
    }
  } else if (manifest && manifest.mode === 'category-chunks' && (!manifest.files || !manifest.files.length)) {
    warnings.push('Manifest kategori modunda ancak dosya listesi boş');
  }
  return items.length;
}

function markSyncValidated() {
  if (!generatedMode) return;
  const relativePath = 'data/sync-info.json';
  const sync = parseJson(relativePath);
  if (!sync) return;
  sync.status = 'validated';
  sync.validated_at = new Date().toISOString();
  sync.validation_run_id = process.env.GITHUB_RUN_ID || null;
  fs.writeFileSync(path.join(ROOT, relativePath), JSON.stringify(sync, null, 2) + '\n');
}

function main() {
  for (const relativePath of ['index.html', 'styles.css', 'js/market-network.js', 'data/items-loader.js', 'data/items-index.js', 'data/items-manifest.js', 'locales/tr.json']) read(relativePath);
  parseJson('locales/tr.json');
  checkIndexReferences();
  checkJavaScriptSyntax();
  checkDataQuality();
  checkLocaleShards();
  const itemCount = checkItems();

  if (failures.length) {
    console.error(`\nDoğrulama başarısız (${failures.length} hata):`);
    failures.forEach((message) => console.error(`- ${message}`));
    process.exitCode = 1;
    return;
  }
  markSyncValidated();
  console.log(`Doğrulama başarılı: ${itemCount || 0} item, HTML referansları, statik dosyalar, JSON ve JavaScript sözdizimi kontrol edildi.`);
  if (warnings.length) warnings.forEach((message) => console.warn(`Uyarı: ${message}`));
}

main();
