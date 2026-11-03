#!/usr/bin/env node
/**
 * Zone harita görselleri toplayıcı.
 *
 * Kaynak: https://albiononline.th.gl (The Hidden Gaming Lair — Albion Online
 * etkileşimli haritası). Albion'un kendi harita tile servisi herkese açık
 * değil; albiononline2d ise Cloudflare challenge'ı ile botları engelliyor.
 * th.gl'nin harita sayfası tüm haritaların tile şablonlarını (içerik hash'i
 * dahil), sınırlarını ve koordinat dönüşümünü tek yanıtta gömülü olarak
 * veriyor; harita listesi sayfası da isim → harita anahtarı eşlemesini
 * sağlıyor.
 *
 * Çıktı: data/zone-maps.js → window.AO_ZONE_MAPS
 *   {
 *     generatedAt, source, tileBase,
 *     maps: {
 *       z0222: { n: 'Anklesnag Mire', u: '/map-tiles/z0222-<hash>/',
 *                b: [minX,minY,maxX,maxY], s: 512, mz: 3,
 *                t: [a,b,c,d] },
 *       world: { ... }
 *     }
 *   }
 *
 * Kullanım: npm run maps:fetch
 */
const fs = require('fs');
const path = require('path');

const SITE = 'https://albiononline.th.gl';
const CDN = 'https://cdn.th.gl/albion-online';
const LIST_URL = `${SITE}/maps`;
const CONFIG_URL = `${SITE}/maps/World`;
const OUT = path.resolve(__dirname, '..', 'data', 'zone-maps.js');

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

async function get(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'text/html,*/*' } });
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
  return res.text();
}

/** HTML varlık kaçışlarını çözer (&#x27; gibi). */
function decodeEntities(str) {
  return String(str)
    .replace(/&#x27;|&#39;|&apos;/g, "'")
    .replace(/&quot;|&#34;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ');
}

/** Harita listesi: /maps/<isim> bağlantısı + hemen ardından gelen önizleme görseli. */
function parseList(html) {
  const out = [];
  const re = /href="\/maps\/([^"]+)"[\s\S]{0,700}?map-tiles\/([A-Za-z0-9_-]+)\/preview\.webp/g;
  let m;
  while ((m = re.exec(html))) {
    out.push({ name: decodeEntities(decodeURIComponent(m[1])), key: m[2] });
  }
  return out;
}

/** Zone sayfasının RSC yükündeki tilesConfig: tüm haritaların tile şablonları. */
function parseTilesConfig(html) {
  const at = html.indexOf('tilesConfig');
  if (at < 0) throw new Error('tilesConfig bulunamadı');
  // RSC yükü JSON içinde kaçışlı: \" → "
  const slice = html.slice(at).replace(/\\"/g, '"');
  const re =
    /"([A-Za-z0-9_-]+)":\{"url":"(\/map-tiles\/[^"]+)","options":\{"minNativeZoom":(-?\d+),"maxNativeZoom":(-?\d+),"bounds":\[\[(-?[\d.]+),(-?[\d.]+)\],\[(-?[\d.]+),(-?[\d.]+)\]\],"tileSize":(\d+)\},"minZoom":(-?\d+),"maxZoom":(-?\d+),"fitBounds":\[\[(-?[\d.]+),(-?[\d.]+)\],\[(-?[\d.]+),(-?[\d.]+)\]\],"transformation":\[(-?[\d.e+]+),(-?[\d.e+]+),(-?[\d.e+]+),(-?[\d.e+]+)\]\}/g;
  const maps = {};
  let m;
  while ((m = re.exec(slice))) {
    const [
      ,
      key,
      url,
      minNative,
      maxNative,
      bx1,
      by1,
      bx2,
      by2,
      tileSize,
      ,
      maxZoom,
      ,
      ,
      ,
      ,
      ta,
      tb,
      tc,
      td,
    ] = m;
    maps[key] = {
      u: url.replace('{z}/{y}/{x}.webp', '').replace('{z}/{y}/{x}.png', ''),
      b: [Number(bx1), Number(by1), Number(bx2), Number(by2)],
      s: Number(tileSize),
      mz: Number(maxNative),
      nz: Number(minNative),
      t: [Number(ta), Number(tb), Number(tc), Number(td)],
    };
  }
  return maps;
}

(async () => {
  console.log('📡 Harita listesi alınıyor…');
  const list = parseList(await get(LIST_URL));
  console.log(`   ${list.length} harita kaydı`);

  console.log('📡 Tile şablonları alınıyor…');
  const tiles = parseTilesConfig(await get(CONFIG_URL));
  const tileKeys = Object.keys(tiles);
  console.log(`   ${tileKeys.length} harita için tile şablonu`);

  const byKey = new Map(list.map((l) => [l.key, l.name]));
  const maps = {};
  for (const key of tileKeys) {
    const t = tiles[key];
    const name = byKey.get(key) || key;
    maps[key] = { n: name, ...t };
  }

  // Listede olup tile şablonu bulunmayan kayıtlar için önizleme yine de çalışır.
  let previewOnly = 0;
  for (const { key, name } of list) {
    if (maps[key]) continue;
    maps[key] = { n: name, u: null };
    previewOnly++;
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    source: SITE,
    attribution: 'Harita görselleri: albiononline.th.gl (The Hidden Gaming Lair)',
    tileBase: CDN,
    maps,
  };

  const header = [
    '// AoT-PNASF — Albion Online zone harita görselleri',
    `// Kaynak: ${SITE} · üretim: scripts/zone-maps-fetcher.cjs`,
    `// ${payload.generatedAt} — ${Object.keys(maps).length} harita (${previewOnly} yalnız önizleme)`,
    '',
    `window.AO_ZONE_MAPS = ${JSON.stringify(payload)};`,
    '',
  ].join('\n');

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, header, 'utf8');

  const kb = Math.round(fs.statSync(OUT).size / 1024);
  console.log(`✅ data/zone-maps.js → ${Object.keys(maps).length} harita · ${kb} KB`);

  // Kapsam raporu: yerel dünya zonlarıyla isim eşleşmesi
  try {
    const vz = fs.readFileSync(path.resolve(__dirname, '..', 'data', 'world-zones.js'), 'utf8');
    const json = JSON.parse(vz.slice(vz.indexOf('['), vz.lastIndexOf(']') + 1));
    const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
    const index = new Map(Object.values(maps).map((m) => [norm(m.n), m.n]));
    const matched = json.filter((z) => index.has(norm(z.id)));
    console.log(`   zon eşleşmesi: ${matched.length}/${json.length}`);
    const miss = json.filter((z) => !index.has(norm(z.id))).slice(0, 8).map((z) => z.id);
    if (miss.length) console.log(`   eşleşmeyen örnek: ${miss.join(', ')}`);
  } catch (e) {
    console.log(`   (kapsam raporu atlandı: ${e.message})`);
  }
})().catch((err) => {
  console.error('❌ Harita verisi alınamadı:', err.message);
  process.exit(1);
});
