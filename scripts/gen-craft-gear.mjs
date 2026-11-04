#!/usr/bin/env node
// Üretim reçeteleri (silah/zırh) — ao-bin-dumps items.json → data/craft-gear.js
//
// Spec planlayıcı, "en ucuz spec" hesabı için her eşyanın tier/enchant başına
// gerçek malzeme listesini ve focus maliyetini kullanır. Sadece craft edilebilir
// ekipman slotları alınır (mainhand/offhand/head/chest/shoes/cape/bag).
//
// Kullanım: node scripts/gen-craft-gear.mjs /tmp/ao

import fs from 'node:fs';
import path from 'node:path';

const kok = process.argv[2] || '/tmp/ao';
const itemsYolu = path.join(kok, 'items.json');
if (!fs.existsSync(itemsYolu)) {
  console.error(`items.json bulunamadı: ${itemsYolu}\nÖnce: node scripts/gen-game-data.mjs ${kok} --indir`);
  process.exit(1);
}

const veri = JSON.parse(fs.readFileSync(itemsYolu, 'utf8'));
const tum = Object.values(veri.items || {}).flat();
const SLOT_SINIF = {
  mainhand: null, // iki elli mi tek elli mi @twohanded belirler
  offhand: 'small',
  head: 'small',
  chest: 'armor',
  shoes: 'small',
  cape: 'small',
  bag: 'armor',
};

const kaynaklar = (cr) => {
  const liste = cr?.craftresource;
  if (!liste) return [];
  const dizi = Array.isArray(liste) ? liste : [liste];
  return dizi
    .map((r) => [String(r['@uniquename'] || ''), Number(r['@count']) || 0])
    .filter(([id, adet]) => id && adet > 0);
};

const gruplar = [];
for (const it of tum) {
  const id = String(it['@uniquename'] || '');
  const m = id.match(/^T([4-8])_(.+)$/);
  if (!m) continue;
  const slot = String(it['@slottype'] || '');
  if (!(slot in SLOT_SINIF)) continue;
  const sinif = slot === 'mainhand' ? (String(it['@twohanded']) === 'true' ? '2h' : '1h') : SLOT_SINIF[slot];
  const taban = m[2];
  const satirlar = [];

  const temel = it.craftingrequirements;
  const temelMalzeme = kaynaklar(temel);
  if (temelMalzeme.length) {
    satirlar.push([Number(m[1]), 0, Number(temel['@craftingfocus']) || 0, temelMalzeme]);
  }
  const efsunlar = it.enchantments?.enchantment;
  for (const e of Array.isArray(efsunlar) ? efsunlar : efsunlar ? [efsunlar] : []) {
    const seviye = Number(e['@enchantmentlevel']);
    const cr = e.craftingrequirements;
    const malzeme = kaynaklar(cr);
    if (!seviye || !malzeme.length) continue;
    satirlar.push([Number(m[1]), seviye, Number(cr['@craftingfocus']) || 0, malzeme]);
  }
  if (!satirlar.length) continue;
  gruplar.push({ b: taban, s: sinif, r: satirlar });
}

gruplar.sort((a, b) => a.b.localeCompare(b.b));
const cikti = `// Üretim reçeteleri (ekipman) — ao-bin-dumps items.json — ${new Date().toISOString().slice(0, 10)}
// ${gruplar.length} eşya · tier 4-8 · enchant 0-4. Satır: [tier, enchant, focus, [[malzeme, adet], ...]]
// Eşya kimliği: T<tier>_<b> (\`@<enchant>\` efsunlu sürümlerde).
window.AO_CRAFT_GEAR=${JSON.stringify(gruplar)};\n`;
fs.writeFileSync(path.join(process.cwd(), 'data/craft-gear.js'), cikti);
console.log(`data/craft-gear.js yazıldı · ${gruplar.length} eşya · ${(cikti.length / 1024).toFixed(1)} kB`);
