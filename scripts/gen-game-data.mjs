// AoT-PNASF — Oyun verisi üreteci
//
// ao-bin-dumps (ao-data/ao-bin-dumps) dökümlerinden siteye gömülecek kompakt
// veri dosyalarını üretir:
//   data/production-data.js  → rafine, yemek, iksir, kasap reçeteleri + şehir bonusları
//   data/farming-data.js     → çiftlik/ada ürünleri (süre, focus, hasat, tohum dönüşü)
//   data/mobs-data.js        → yaratık veritabanı (tier, can, hasar, fame, faction)
//
// Kullanım:
//   mkdir -p /tmp/ao && cd /tmp/ao
//   for f in items craftingmodifiers farmingmodifiers loot mobs; do
//     curl -sO https://raw.githubusercontent.com/ao-data/ao-bin-dumps/master/$f.json
//   done
//   node scripts/gen-game-data.mjs /tmp/ao
//
// Dökümler XML→JSON çevrilmiş hâldedir; alan adları "@" öneki taşır.

import fs from 'node:fs';
import path from 'node:path';

const kaynak = process.argv[2] || '/tmp/ao';
const hedef = path.resolve('data');
const KOK = 'https://raw.githubusercontent.com/ao-data/ao-bin-dumps/master';
const GEREKLI = ['items', 'craftingmodifiers', 'farmingmodifiers', 'loot', 'mobs'];

// --indir: eksik dökümleri resmî depodan çeker (ao-bin-dumps)
if (process.argv.includes('--indir')) {
  fs.mkdirSync(kaynak, { recursive: true });
  for (const ad of GEREKLI) {
    const yol = path.join(kaynak, `${ad}.json`);
    if (fs.existsSync(yol) && fs.statSync(yol).size > 1024) continue;
    console.log(`↓ ${ad}.json indiriliyor…`);
    const yanit = await fetch(`${KOK}/${ad}.json`);
    if (!yanit.ok) throw new Error(`${ad}.json: HTTP ${yanit.status}`);
    fs.writeFileSync(yol, Buffer.from(await yanit.arrayBuffer()));
  }
}

const oku = (ad) => JSON.parse(fs.readFileSync(path.join(kaynak, `${ad}.json`), 'utf8'));
const dizi = (v) => (Array.isArray(v) ? v : v ? [v] : []);
const sayi = (v, vars = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : vars;
};

// ── AO_ITEMS ad sözlüğü (varsa) ──────────────────────────────
const okuJson = (rel) => {
  try { return JSON.parse(fs.readFileSync(path.resolve(rel), 'utf8')); } catch { return {}; }
};
const adTr = okuJson('locales/tr-official.json');
const adEn = okuJson('locales/items-en.json');

const tabanKimlik = (tam) => String(tam).replace(/^T\d+_/, '').replace(/_LEVEL\d+$/, '');
const okunakli = (tam) => tabanKimlik(tam).toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
// "_LEVEL1" büyülü sürümler için taban ad + ".1" eki kullanılır; aksi halde
// ad sözlüğünde bulunmayan sürümler "Planks" gibi çıplak kalıyordu.
const adBul = (tam) => {
  const eslesme = String(tam).match(/_LEVEL(\d+)$/);
  const seviye = eslesme ? Number(eslesme[1]) : 0;
  const ek = seviye ? ` .${seviye}` : '';
  // Tier korunmalı: "T4_PLANKS_LEVEL1" → "T4_PLANKS" (T2 ada düşmesin)
  const tier = String(tam).match(/^T(\d+)_/);
  const taban = tabanKimlik(tam);
  const tierliTaban = tier ? `T${tier[1]}_${taban}` : taban;
  const okunakliTaban = okunakli(tier ? tierliTaban : taban);
  return {
    tr: adTr[tam] || (adTr[tierliTaban] ? adTr[tierliTaban] + ek : okunakliTaban + ek),
    en: adEn[tam] || (adEn[tierliTaban] ? adEn[tierliTaban] + ek : okunakliTaban + ek),
  };
};

// ── Eşyalar / reçeteler ─────────────────────────────────────
const itemsJson = oku('items');
const esyalar = [];
for (const anahtar of Object.keys(itemsJson.items)) {
  if (anahtar.startsWith('@') || anahtar === 'shopcategories') continue;
  for (const esya of dizi(itemsJson.items[anahtar])) if (esya?.['@uniquename']) esyalar.push(esya);
}

const ISTASYON = {
  ore: 'refine', wood: 'refine', rock: 'refine', hide: 'refine', fiber: 'refine',
  food: 'cook', potion: 'alchemy',
  meat_chicken: 'butcher', meat_goat: 'butcher', meat_goose: 'butcher',
  meat_sheep: 'butcher', meat_pig: 'butcher', meat_cow: 'butcher',
};

const receteler = {};
let atlanan = 0;
for (const esya of esyalar) {
  const kategori = esya['@craftingcategory'];
  const istasyon = ISTASYON[kategori];
  if (!istasyon) continue;
  const ham = dizi(esya.craftingrequirements);
  if (!ham.length) continue;
  // İlk reçete taban sürümdür; büyülü (LEVEL) sürümler ayrı eşya kimliğiyle gelir.
  const r = ham[0];
  const malzemeler = dizi(r.craftresource)
    .map((m) => [String(m['@uniquename']), sayi(m['@count'])])
    .filter(([, adet]) => adet > 0);
  if (!malzemeler.length) { atlanan++; continue; }
  const tam = String(esya['@uniquename']);
  const { tr, en } = adBul(tam);
  receteler[tam] = {
    n: tr, e: en,
    t: sayi(esya['@tier']),
    lvl: sayi(esya['@enchantmentlevel']),
    cat: istasyon,
    o: Math.max(1, sayi(r['@amountcrafted'], 1)),
    s: sayi(r['@silver']),
    f: sayi(r['@craftingfocus']),
    sec: Math.round(sayi(r['@time']) * 1000) / 1000,
    m: malzemeler,
  };
}

// ── Şehir bonusları ─────────────────────────────────────────
const SEHIR = {
  '0000': 'Thetford', '1000': 'Lymhurst', '2000': 'Bridgewatch',
  '3004': 'Martlock', '4000': 'Fort Sterling', '3003': 'Caerleon', '5000': 'Brecilien',
};
const sehirler = [];
for (const yer of dizi(oku('craftingmodifiers').craftingmodifiers.craftinglocation)) {
  const id = String(yer['@clusterid']);
  const ad = SEHIR[id];
  if (!ad) continue;
  const ozel = dizi(yer.craftingmodifier).find((m) => m['@value'] === '0.40');
  const et = dizi(yer.craftingmodifier).find((m) => String(m['@name']).startsWith('meat_'));
  sehirler.push({
    id, ad,
    rafine: sayi(yer.refiningbonus?.['@value']),
    uretim: sayi(yer.craftingbonus?.['@value']),
    uzmanlik: ozel ? String(ozel['@name']) : '',
    uzmanlikOran: ozel ? sayi(ozel['@value']) : 0,
    kasap: et ? String(et['@name']) : '',
    kasapOran: et ? sayi(et['@value']) : 0,
  });
}

fs.writeFileSync(
  path.join(hedef, 'production-data.js'),
  `// Üretim verisi — ao-bin-dumps (items.json, craftingmodifiers.json) — ${new Date().toISOString().slice(0, 10)}\n`
  + `// ${Object.keys(receteler).length} reçete · ${sehirler.length} şehir\n`
  + `window.AO_PRODUCTION=${JSON.stringify({ sehirler, receteler })};\n`
);

// ── Çiftlik ─────────────────────────────────────────────────
const loot = new Map();
for (const tanim of dizi(oku('loot').LootDefinition?.Loot)) {
  // LootDefinition.Loot: { "@name": [...], Item: [...] }
}
const lootKok = oku('loot').LootDefinition?.Loot;
const lootTablolari = new Map();
for (const grup of dizi(lootKok)) {
  // grup = { "@name": "T1_CARROT_LOOT", Item: [...] }  veya { Loot: [...] }
  if (grup?.['@name']) lootTablolari.set(String(grup['@name']), dizi(grup.Item));
}
for (const grup of dizi(oku('loot').LootDefinition?.Loot?.Loot)) {
  if (grup?.['@name']) lootTablolari.set(String(grup['@name']), dizi(grup.Item));
}

const ciftlikBonus = new Map(); // farmable → { city: oran }
for (const yer of dizi(oku('farmingmodifiers').farmingmodifiers.location)) {
  const ad = SEHIR[String(yer['@clusterid'])];
  if (!ad) continue;
  for (const m of dizi(yer.farmingyieldmodifier)) {
    const anahtar = String(m['@farmable']);
    const kayit = ciftlikBonus.get(anahtar) || {};
    kayit[ad] = sayi(m['@value']);
    ciftlikBonus.set(anahtar, kayit);
  }
}

const ciftlik = [];
for (const esya of esyalar) {
  if (!esya.harvest && !esya['@activefarmmaxcycles']) continue;
  const tam = String(esya['@uniquename']);
  const hasat = esya.harvest || {};
  const lootAdi = String(hasat['@lootlist'] || '');
  const lootSatirlari = lootTablolari.get(lootAdi) || [];
  const urun = lootSatirlari.find((x) => x['@chance'] === '1.0') || lootSatirlari[0];
  const aralik = String(urun?.['@amount'] || '');
  const [az, cok] = aralik.includes('-') ? aralik.split('-').map(Number) : [Number(aralik) || 0, Number(aralik) || 0];
  const tohum = hasat.seed;
  const { tr, en } = adBul(String(urun?.['@type'] || tam));
  ciftlik.push({
    id: tam,
    urun: String(urun?.['@type'] || ''),
    n: tr, e: en,
    t: sayi(esya['@tier']),
    tur: String(esya['@kind'] || ''),
    sure: sayi(hasat['@growtime'] || esya['@activefarmcyclelengthseconds']),
    focus: sayi(esya['@activefarmfocuscost']),
    bonus: sayi(esya['@activefarmbonus']),
    az, cok,
    tohumSans: sayi(tohum?.['@chance']),
    fame: sayi(hasat['@fame']),
    sehir: ciftlikBonus.get(tam) || {},
  });
}

fs.writeFileSync(
  path.join(hedef, 'farming-data.js'),
  `// Çiftlik verisi — ao-bin-dumps (items.json farmableitem, loot.json, farmingmodifiers.json) — ${new Date().toISOString().slice(0, 10)}\n`
  + `// ${ciftlik.length} ürün\n`
  + `window.AO_FARMING=${JSON.stringify(ciftlik)};\n`
);

// ── Yaratıklar ──────────────────────────────────────────────
const moblar = [];
for (const mob of dizi(oku('mobs').Mobs.Mob)) {
  const tam = String(mob['@uniquename'] || '');
  if (!tam) continue;
  const can = sayi(mob['@hitpointsmax']);
  const hasar = sayi(mob['@attackdamage']);
  const fame = sayi(mob['@fame']);
  if (!can && !fame) continue;
  moblar.push([
    okunakli(tam.replace(/^T\d+_/, '').replace(/^MOB_/, '')),
    sayi(mob['@tier']),
    String(mob['@faction'] || ''),
    can,
    hasar,
    fame,
    String(mob['@mobtypecategory'] || ''),
  ]);
}

fs.writeFileSync(
  path.join(hedef, 'mobs-data.js'),
  `// Yaratık verisi — ao-bin-dumps (mobs.json) — ${new Date().toISOString().slice(0, 10)}\n`
  + `// ${moblar.length} yaratık · alanlar: [kimlik, tier, faction, can, hasar, fame, kategori]\n`
  + `window.AO_MOBS=${JSON.stringify(moblar)};\n`
);

const boy = (ad) => (fs.statSync(path.join(hedef, ad)).size / 1024).toFixed(1);
console.log('production-data.js', boy('production-data.js'), 'kB ·', Object.keys(receteler).length, 'reçete');
console.log('farming-data.js   ', boy('farming-data.js'), 'kB ·', ciftlik.length, 'ürün');
console.log('mobs-data.js      ', boy('mobs-data.js'), 'kB ·', moblar.length, 'yaratık');
console.log('atlanan reçete:', atlanan);
