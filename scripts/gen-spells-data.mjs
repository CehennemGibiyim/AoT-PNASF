#!/usr/bin/env node
// AoT-PNASF — ao-bin-dumps → data/spells-db.js
//
// Kullanım:
//   node scripts/gen-spells-data.mjs <dizin>
//
// <dizin> içinde spells.json ve localization.json beklenir (ao-bin-dumps).
// Eksikse --indir ile resmî depodan çekilir:
//   node scripts/gen-spells-data.mjs /tmp/ao --indir
//
// Çıktı: window.AO_SPELLS = [[id, ad, aciklama, tur, enerji, cast, cd, menzil, hedef], ...]
// Ad ve açıklamalar oyunun TR-TR yerelleştirmesinden gelir; yoksa EN-US kullanılır.

import fs from 'node:fs';
import path from 'node:path';

const KOK = 'https://raw.githubusercontent.com/ao-data/ao-bin-dumps/master';
const hedefDizin = process.argv[2] || '/tmp/ao';
const indir = process.argv.includes('--indir');
const cikti = path.resolve('data/spells-db.js');

async function getir(dosya) {
  const yol = path.join(hedefDizin, dosya);
  if (fs.existsSync(yol) && fs.statSync(yol).size > 1024) return yol;
  if (!indir) throw new Error(`${yol} yok. --indir ile indirebilirsiniz.`);
  fs.mkdirSync(hedefDizin, { recursive: true });
  console.log(`↓ ${dosya} indiriliyor…`);
  const yanit = await fetch(`${KOK}/${dosya}`);
  if (!yanit.ok) throw new Error(`${dosya}: HTTP ${yanit.status}`);
  fs.writeFileSync(yol, Buffer.from(await yanit.arrayBuffer()));
  return yol;
}

const dizi = (v) => (!v ? [] : Array.isArray(v) ? v : [v]);

// TMX yerelleştirmesini { "@TAG": { "TR-TR": "…", "EN-US": "…" } } biçimine çevir
function yerellesmeOku(dosya) {
  const veri = JSON.parse(fs.readFileSync(dosya, 'utf8'));
  const map = new Map();
  for (const tu of veri?.tmx?.body?.tu || []) {
    const etiket = tu['@tuid'];
    if (!etiket) continue;
    const diller = {};
    for (const tuv of dizi(tu.tuv)) {
      const dil = tuv?.['@xml:lang'];
      if (!dil) continue;
      const seg = tuv.seg;
      diller[dil] = Array.isArray(seg) ? seg.map((s) => s?.['#text'] ?? s).join('') : (seg ?? '');
    }
    map.set(etiket, diller);
  }
  return map;
}

const HTML = /<[^>]*>/g;
const BOSLUK = /\s+/g;

function temizle(metin) {
  if (!metin) return '';
  return String(metin)
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(HTML, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    // Oyun içi biçimlendirme: [other]metin[/other] → metin
    .replace(/\[\/?[a-z]+\]/gi, '')
    // Dinamik değerler (item power'a göre değişen) çözülemez; okunur kalsın diye …
    .replace(/\$\$[^$]*\$/g, '…')
    .replace(/\{(\d+)\}/g, '…')
    .replace(/\s+([,.;:!?])/g, '$1')
    .replace(BOSLUK, ' ')
    .trim();
}

const sayi = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.round(n * 1000) / 1000 : 0;
};

function turEtiketi(kaynak, spell) {
  if (kaynak === 'togglespell') return 'aç-kapa';
  if (kaynak === 'passivespell') return 'pasif';
  const kategori = String(spell['@category'] || '').toLowerCase();
  if (kategori.includes('channel')) return 'kanal';
  if (kategori.includes('toggle')) return 'aç-kapa';
  return 'aktif';
}

async function main() {
  const spellsYolu = await getir('spells.json');
  const locYolu = await getir('localization.json');

  const spells = JSON.parse(fs.readFileSync(spellsYolu, 'utf8')).spells;
  const dil = yerellesmeOku(locYolu);

  const gruplar = new Map(); // etiket → kayıt
  let dislanan = 0;

  for (const kaynak of ['activespell', 'togglespell', 'passivespell']) {
    for (const spell of dizi(spells?.[kaynak])) {
      const id = spell?.['@uniquename'];
      const adEtiketi = spell?.['@namelocatag'];
      if (!id || !adEtiketi) continue;
      // Yaratık ve sistem yeteneklerini atla
      if (/^MOB_/i.test(id) || spell['@systemspell'] === 'true') {
        dislanan += 1;
        continue;
      }
      const ceviri = dil.get(adEtiketi) || {};
      const ad = temizle(ceviri['TR-TR'] || ceviri['EN-US']);
      if (!ad) continue;
      const aciklamaEtiketi = spell['@descriptionlocatag'] || spell['@spelleffectlocatag'];
      const ceviriAciklama = dil.get(aciklamaEtiketi) || {};
      const aciklama = temizle(ceviriAciklama['TR-TR'] || ceviriAciklama['EN-US'] || '');

      const kayit = {
        id,
        ad,
        aciklama,
        tur: turEtiketi(kaynak, spell),
        enerji: sayi(spell['@energyusage']),
        cast: sayi(spell['@castingtime']),
        cd: sayi(spell['@recastdelay']),
        menzil: sayi(spell['@castrange']),
        hedef: String(spell['@target'] || ''),
        anahtar: adEtiketi,
      };

      const mevcut = gruplar.get(adEtiketi);
      // Aynı yeteneğin varyantlarında en zengin kaydı tut
      if (!mevcut || (kayit.aciklama.length > mevcut.aciklama.length)
        || (kayit.aciklama.length === mevcut.aciklama.length && kayit.cd > mevcut.cd)) {
        gruplar.set(adEtiketi, kayit);
      }
    }
  }

  const liste = [...gruplar.values()].sort((a, b) => a.ad.localeCompare(b.ad, 'tr'));
  const satirlar = liste.map((s) => [s.id, s.ad, s.aciklama, s.tur, s.enerji, s.cast, s.cd, s.menzil, s.hedef]);

  const icerik = `// Otomatik üretildi — scripts/gen-spells-data.mjs\n`
    + `// Kaynak: ao-data/ao-bin-dumps (spells.json + localization.json, TR-TR)\n`
    + `// ${liste.length} yetenek · ${new Date().toISOString().slice(0, 10)}\n`
    + `window.AO_SPELLS = ${JSON.stringify(satirlar)};\n`;

  fs.mkdirSync(path.dirname(cikti), { recursive: true });
  fs.writeFileSync(cikti, icerik);

  const boyut = (fs.statSync(cikti).size / 1024).toFixed(1);
  const aciklamali = liste.filter((s) => s.aciklama).length;
  console.log(`✓ data/spells-db.js · ${liste.length} yetenek · ${aciklamali} açıklamalı · ${boyut} kB`);
  if (dislanan) console.log(`  (${dislanan} yaratık/sistem yeteneği atlandı)`);
}

main().catch((hata) => {
  console.error('✗', hata.message);
  process.exit(1);
});
