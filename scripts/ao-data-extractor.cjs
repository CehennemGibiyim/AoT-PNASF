const fs = require('fs');
const path = require('path');

const ITEMS_URL = 'https://raw.githubusercontent.com/ao-data/ao-bin-dumps/master/formatted/items.json';
const ROOT = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data');
const LOCALES_DIR = path.join(ROOT, 'locales');
const CATEGORY_KEYS = [
  'sword', 'axe', 'bow', 'hammer', 'spear', 'dagger', 'qstaff', 'mace', 'knuckles', 'shape',
  'fire', 'frost', 'arcane', 'holy', 'nature', 'curse', 'parmor', 'pshoes', 'phelmet',
  'larmor', 'lshoes', 'lhelmet', 'carmor', 'cshoes', 'chelmet', 'bag', 'cape', 'offhand',
  'food', 'potion', 'raw', 'refined', 'journal', 'mount', 'misc'
];

function baseId(uniqueName) {
  return String(uniqueName || '').replace(/^T\d+_/, '').replace(/@\d+$/, '');
}

function category(uniqueName) {
  const id = String(uniqueName || '').toUpperCase();
  const rules = [
    [/KNUCKLES/, 'knuckles'], [/SHAPESHIFTER/, 'shape'], [/SWORD/, 'sword'], [/AXE/, 'axe'],
    [/MACE/, 'mace'], [/HAMMER/, 'hammer'], [/SPEAR/, 'spear'], [/CROSSBOW|BOW/, 'bow'],
    [/NATURESTAFF/, 'nature'], [/HOLYSTAFF/, 'holy'], [/FIRESTAFF/, 'fire'], [/FROSTSTAFF/, 'frost'],
    [/ARCANESTAFF/, 'arcane'], [/CURSEDSTAFF/, 'curse'], [/DAGGER/, 'dagger'], [/QUARTERSTAFF/, 'qstaff'],
    [/ARMOR_LEATHER/, 'larmor'], [/HEAD_LEATHER/, 'lhelmet'], [/SHOES_LEATHER/, 'lshoes'],
    [/ARMOR_PLATE/, 'parmor'], [/HEAD_PLATE/, 'phelmet'], [/SHOES_PLATE/, 'pshoes'],
    [/ARMOR_CLOTH/, 'carmor'], [/HEAD_CLOTH/, 'chelmet'], [/SHOES_CLOTH/, 'cshoes'],
    [/BAG/, 'bag'], [/CAPE/, 'cape'], [/OFF_/, 'offhand'], [/T\d+_MEAL/, 'food'],
    [/T\d+_POTION/, 'potion'], [/T\d+_(PLANKS|METALBAR|CLOTH|LEATHER|STONEBLOCK)/, 'refined'],
    [/T\d+_(WOOD|ORE|FIBER|HIDE|ROCK)/, 'raw']
  ];
  return (rules.find(([pattern]) => pattern.test(id)) || [null, 'misc'])[1];
}

function localized(item, locale, fallback) {
  return item.LocalizedNames?.[locale] || fallback || '';
}

function extractSpells(item) {
  const source = item.activecastspelllist?.activecastspell || item.activecastspelllist;
  if (!source) return [];
  const spells = Array.isArray(source) ? source : [source];
  return spells.filter(Boolean).map(spell => ({
    slot: spell.slot || 'Q/W/E',
    name: spell.UniqueName || spell.name || '',
    cooldown: Number(spell.cooldown || 0) / 1000,
    energy: Number(spell.energycost || 0)
  })).filter(spell => spell.name);
}

function readObject(relativePath) {
  try {
    const value = JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), 'utf8'));
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  } catch (_) {
    return {};
  }
}

async function extractData() {
  console.log(`[Extractor] Albion item verisi indiriliyor: ${ITEMS_URL}`);
  const response = await fetch(ITEMS_URL);
  if (!response.ok) throw new Error(`Items HTTP ${response.status}`);
  const items = await response.json();
  if (!Array.isArray(items) || items.length === 0) throw new Error('Geçersiz veya boş item verisi');

  const weights = {};
  const locales = {};
  const spells = {};
  const normalized = new Map();

  for (const item of items) {
    const uniqueName = item.UniqueName;
    if (!uniqueName || /NONTRADABLE|SKILLBOOK|TRASH/.test(uniqueName)) continue;

    const id = baseId(uniqueName);
    const tierMatch = uniqueName.match(/^T(\d+)_/);
    const tier = tierMatch ? Number(tierMatch[1]) : 0;
    const fallback = id;
    const entry = normalized.get(id) || {
      id,
      en: localized(item, 'EN-US', fallback),
      tr: localized(item, 'TR-TR', localized(item, 'EN-US', fallback)),
      cat: category(uniqueName),
      tiers: []
    };

    if (tier && !entry.tiers.includes(tier)) entry.tiers.push(tier);
    if (entry.en === fallback) entry.en = localized(item, 'EN-US', fallback);
    if (entry.tr === fallback) entry.tr = localized(item, 'TR-TR', entry.en);
    normalized.set(id, entry);

    if (item.weight !== undefined && item.weight !== null) {
      weights[uniqueName] = Number(item.weight);
      weights[id] ??= Number(item.weight);
    }

    const trName = localized(item, 'TR-TR', '');
    if (trName) {
      locales[uniqueName] = trName;
      locales[id] ??= trName;
    }

    const itemSpells = extractSpells(item);
    if (itemSpells.length) spells[id] = itemSpells;
  }

  for (const item of normalized.values()) {
    if (!item.tiers.length) item.tiers = [1, 2, 3, 4, 5, 6, 7, 8];
    item.tiers.sort((a, b) => a - b);
  }

  // Upstream dumps can temporarily omit optional fields. Keep the last known
  // values instead of publishing an empty or partially destructive catalog.
  const previousWeights = readObject('data/items-weight.json');
  const previousSpells = readObject('data/spells-data.json');
  const mergedWeights = { ...previousWeights, ...weights };
  const mergedSpells = { ...previousSpells, ...spells };
  if (!Object.keys(mergedWeights).length) throw new Error('Ağırlık verisi boş; mevcut katalog korunarak işlem durduruldu');
  if (!Object.keys(mergedSpells).length) throw new Error('Yetenek verisi boş; mevcut katalog korunarak işlem durduruldu');

  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.mkdirSync(LOCALES_DIR, { recursive: true });
  const syncPath = path.join(DATA_DIR, 'sync-info.json');
  let previous = {};
  try { previous = JSON.parse(fs.readFileSync(syncPath, 'utf8')); } catch (_) {}
  const dataVersion = Number(previous.data_version || 0) + 1;

  const allItems = [...normalized.values()];
  const itemOutput = `// AoT-PNASF Items Data — ${new Date().toISOString()} — ${normalized.size} eşya\nwindow.AO_ITEMS = ${JSON.stringify(allItems)};\n`;
  fs.writeFileSync(path.join(DATA_DIR, 'items-data.js'), itemOutput, 'utf8');

  const grouped = Object.fromEntries(CATEGORY_KEYS.map(key => [key, []]));
  for (const item of allItems) (grouped[item.cat] || grouped.misc).push(item);
  for (const key of CATEGORY_KEYS) {
    const chunk = `// Generated category chunk: ${key}\nwindow.AO_ITEM_CHUNKS = window.AO_ITEM_CHUNKS || {};\nwindow.AO_ITEM_CHUNKS[${JSON.stringify(key)}] = ${JSON.stringify(grouped[key])};\n`;
    fs.writeFileSync(path.join(DATA_DIR, `items-${key}.js`), chunk, 'utf8');
  }
  fs.writeFileSync(path.join(DATA_DIR, 'items-manifest.js'), `// Generated item manifest\nwindow.AO_ITEMS_MANIFEST = ${JSON.stringify({
    version: dataVersion,
    mode: 'category-chunks',
    files: CATEGORY_KEYS.map(key => `items-${key}.js`),
    fallback: 'items-data.js'
  }, null, 2)};\n`, 'utf8');
  fs.writeFileSync(path.join(DATA_DIR, 'items-weight.json'), JSON.stringify(mergedWeights), 'utf8');
  fs.writeFileSync(path.join(DATA_DIR, 'spells-data.json'), JSON.stringify(mergedSpells), 'utf8');
  fs.writeFileSync(path.join(LOCALES_DIR, 'tr-official.json'), JSON.stringify(locales), 'utf8');

  fs.writeFileSync(syncPath, JSON.stringify({
    schema_version: 1,
    data_version: dataVersion,
    source: 'ao-data/ao-bin-dumps',
    source_url: ITEMS_URL,
    last_sync: new Date().toISOString(),
    previous_sync: previous.last_sync || null,
    items_count: items.length,
    normalized_items_count: normalized.size,
    weights_count: Object.keys(mergedWeights).length,
    spells_count: Object.keys(mergedSpells).length,
    zones_count: previous.zones_count || 0,
    zones_last_sync: previous.zones_last_sync || null,
    backup_run_id: process.env.GITHUB_RUN_ID || null,
    status: 'generated_pending_validation'
  }, null, 2) + '\n', 'utf8');

  console.log(`[Extractor] Tamamlandı: ${items.length} ham / ${normalized.size} eşya / ${Object.keys(spells).length} yetenek`);
}

extractData().catch(error => {
  console.error('[Extractor] KRİTİK HATA:', error.message);
  process.exit(1);
});
