// ao-bin-dumps -> data/world-zones.js üretici
// Kaynak: https://github.com/ao-data/ao-bin-dumps (formatted/world.json + cluster/ dosya listesi)
// Index geometrisi: "ABCD" -> region=A (0 Thetford/swap, 1 Lymhurst/orman, 2 Bridgewatch/bozkır,
// 3 Caerleon-Martlock/yayla, 4 Fort Sterling/dağ, 5 Brecilien/mistler), row=B, col=CD.
// Bağlantılar: aynı region içinde 4-komşuluk (oyun dump grid geometrisi) + Caerleon<->Cross çapaları.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const WORLD_URL = 'https://raw.githubusercontent.com/ao-data/ao-bin-dumps/master/formatted/world.json';
const TREE_URL = 'https://api.github.com/repos/ao-data/ao-bin-dumps/git/trees/7b948b42163c94f7397c299422a347ee4d941b64';

const REGION_BIOME = { 0: 'swamp', 1: 'forest', 2: 'steppe', 3: 'highland', 4: 'mountain', 5: 'mists' };
const REGION_RESOURCE = { 0: 'ORE', 1: 'FIBER', 2: 'ROCK', 3: 'HIDE', 4: 'WOOD', 5: null };
const REGION_CENTER = { 0: [-2, 0], 1: [0, -2], 2: [2, 0], 3: [0, 2], 4: [0, 0], 5: [0, -4] };

function biomeFromFileName(name) {
  const m = name.match(/_(SW|FR|ST|HL|MN)_(AUTO|HILLY|FLAT|DRY|WET|HIGH)?/);
  if (name.includes('_CTY_')) return 'city';
  if (!m) return null;
  return { SW: 'swamp', FR: 'forest', ST: 'steppe', HL: 'highland', MN: 'mountain' }[m[1]] || null;
}

async function main() {
  const world = await (await fetch(WORLD_URL)).json();
  const tree = await (await fetch(TREE_URL)).json();
  if (!Array.isArray(world)) throw new Error('world.json geçersiz');
  if (!tree.tree) throw new Error('cluster ağacı alınamadı: ' + JSON.stringify(tree).slice(0, 120));

  const clusterFiles = tree.tree.filter(e => e.path.endsWith('.cluster.xml')).map(e => e.path);
  // index -> dosya adı. Sadece yüzey kümeleri: WRL (dünya), CTY (şehir), STT (Cross kapısı).
  // HellDen/HALL/TUT/TEST/DNG/ISL/PGU (hellgate, hall, tutorial, zindan, ada) elenir.
  const byIndex = new Map();
  for (const file of clusterFiles) {
    const idx = file.match(/^(\d{4})_([A-Z]{3,4})_/);
    if (!idx) continue;
    const [, index, kind] = idx;
    if (!['WRL', 'CTY', 'STT'].includes(kind)) continue;
    const isWRL = kind === 'WRL';
    const isCTY = kind === 'CTY';
    const prev = byIndex.get(index);
    if (!prev || (!prev.isWRL && isWRL)) byIndex.set(index, { file, isWRL, isCTY });
  }

  const zones = [];
  for (const { Index, UniqueName } of world) {
    if (!/^\d{4}$/.test(Index)) continue;      // adalar, instance'lar, debug
    const meta = byIndex.get(Index);
    if (!meta) continue;
    const reg = Number(Index[0]);
    const row = Number(Index[1]);
    const col = Number(Index.slice(2));
    const tierM = meta.file.match(/_T(\d)_/);
    const tier = tierM ? Number(tierM[1]) : 0;
    // İç mekân alt kümeleri (banka/pazar/portal/salon/arena) harita düğümü değildir
    if (/(Market|Bank|Portal|Hall|Arena)/i.test(UniqueName)) continue;
    const biome = REGION_BIOME[reg] || 'unknown';
    zones.push({
      id: UniqueName,
      index: Index,
      reg, row, col,
      x: (REGION_CENTER[reg]?.[0] ?? 0) * 100 + col * 4,   // şematik dünya ızgarası (birim: 4/grid)
      y: (REGION_CENTER[reg]?.[1] ?? 0) * 100 + row * 4,
      biome,
      type: meta.isCTY ? 'CITY' : 'WORLD',
      tier,
      resource: REGION_RESOURCE[reg] || null,
    });
  }

  // Kenarlar: aynı region içinde 8-komşuluk (dump ızgarası seyrek; köşegenler
  // ara hücre dump'ta yokken gerçek dünyadaki zinciri temsil eder)
  const byCell = new Map();
  for (const z of zones) byCell.set(`${z.reg}:${z.row}:${z.col}`, z.id);
  for (const z of zones) {
    const exits = [];
    for (const dr of [-1, 0, 1]) for (const dc of [-1, 0, 1]) {
      if (dr === 0 && dc === 0) continue;
      const n = byCell.get(`${z.reg}:${z.row + dr}:${z.col + dc}`);
      if (n && n !== z.id) exits.push(n);
    }
    z.exits = exits;
  }

  // Şehir/çapraz çengeller: dump ızgarası seyrek olduğundan şehir ve Cross'ları
  // region içindeki en yakın hücrelere bağla (en yakın K hücre, eşitlikler dahil).
  const anchorToRegion = (zone, k) => {
    if (!zone || zone.exits.length) return;
    const cands = zones
      .filter(z => z.reg === zone.reg && z.id !== zone.id && z.type === 'WORLD')
      .map(z => ({ z, d: Math.hypot(z.row - zone.row, z.col - zone.col) }))
      .filter(c => c.d > 0)
      .sort((a, b) => a.d - b.d);
    const minD = cands[0]?.d;
    for (const c of cands.filter(c => c.d === minD).slice(0, k)) {
      zone.exits.push(c.z.id);
      c.z.exits.push(zone.id);
    }
  };
  for (const z of zones) {
    if (z.type === 'CITY' && z.id !== 'Caerleon' && z.id !== 'Brecilien') anchorToRegion(z, 4);
    if (z.type === 'CITY' && z.id === 'Brecilien') anchorToRegion(z, 2);
    if (z.id.endsWith('Cross')) anchorToRegion(z, 2);
  }

  // Caerleon <-> Cross çapaları (sabit kraliyet kapıları)
  const find = name => zones.find(z => z.id === name);
  const caerleon = find('Caerleon');
  for (const cross of ['Swamp Cross', 'Forest Cross', 'Steppe Cross', 'Highland Cross', 'Mountain Cross']) {
    const c = find(cross);
    if (caerleon && c && !caerleon.exits.includes(c.id)) {
      caerleon.exits.push(c.id);
      c.exits.push(caerleon.id);
    }
  }
  // Brecilien izole düğüm (mist kapısı dinamiktir) — bilgi notu düşülecek

  const connected = zones.filter(z => z.exits.length > 0).length;
  const payload = `// AoT-PNASF Dünya Zone Verisi — ao-bin-dumps (${new Date().toISOString()}) — ${zones.length} zone, ${connected} bağlantılı
// Üretici: scripts/generate-world-zones.cjs — Index geometrisinden türetilmiştir.
window.AO_WORLD_ZONES = ${JSON.stringify(zones)};
`;
  fs.writeFileSync(path.join(ROOT, 'data', 'world-zones.js'), payload, 'utf8');
  console.log(`Yazıldı: data/world-zones.js — ${zones.length} zone, ${connected} bağlantılı, kenar sayısı ${zones.reduce((s, z) => s + z.exits.length, 0) / 2}`);
  const regCount = {};
  zones.forEach(z => regCount[z.reg] = (regCount[z.reg] || 0) + 1);
  console.log('Region dağılımı:', regCount);
}

main().catch(err => { console.error('[generate-world-zones] HATA:', err.message); process.exit(1); });
