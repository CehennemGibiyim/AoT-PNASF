/**
 * Masaüstü güncelleme indiricisi.
 *
 * Sayfa (renderer) yalnızca HTTPS adreslerini ve izinli alan adlarını
 * kullanabilir; indirme ana süreçte yapılır. Kurulum başlatılmadan önce
 * GitHub sürümündeki SHA256SUMS.txt ile dosya özeti karşılaştırılır; özet
 * eşleşmezse hiçbir şey çalıştırılmaz.
 *
 * Not: Windows paketleri kod imzalı değildir; kullanıcı kurulumu her zaman
 * kendisi başlatır (bkz. desktop/SIGNING.md).
 */
const crypto = require('node:crypto');
const fs = require('node:fs');
const fsp = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const http = require('node:http');
const https = require('node:https');

const IZINLI_HOSTLAR = [
  'github.com',
  'api.github.com',
  'objects.githubusercontent.com',
  'release-assets.githubusercontent.com',
  'github-releases.githubusercontent.com',
  'raw.githubusercontent.com',
];

const MAKS_BAYT = 400 * 1024 * 1024;
const MAKS_OZET_BAYT = 2 * 1024 * 1024;
const ZAMAN_ASIMI_MS = 30000;
const YONLENDIRME_SINIRI = 5;
const KURULUM_UZANTILARI = /\.(exe|msi|dmg|AppImage)$/i;

/** URL güvenli protokolde ve izinli bir alan adında mı? */
function adresGuvenliMi(deger, izinliHostlar = IZINLI_HOSTLAR, protokol = 'https:') {
  let adres;
  try {
    adres = new URL(String(deger));
  } catch {
    return false;
  }
  if (adres.protocol !== protokol) return false;
  return izinliHostlar.some((host) => adres.hostname === host || adres.hostname.endsWith(`.${host}`));
}

function istekAc(url, { izinliHostlar = IZINLI_HOSTLAR, protokol = 'https:', zamanAsimi = ZAMAN_ASIMI_MS, yonlendirme = 0 } = {}) {
  return new Promise((resolve, reject) => {
    if (!adresGuvenliMi(url, izinliHostlar, protokol)) {
      reject(new Error('İndirme adresi güvenli değil (yalnızca HTTPS ve izinli alan adları).'));
      return;
    }
    if (yonlendirme > YONLENDIRME_SINIRI) {
      reject(new Error('Çok fazla yönlendirme.'));
      return;
    }

    const tasiyici = protokol === 'http:' ? http : https;
    const istek = tasiyici.get(
      url,
      {
        headers: {
          'user-agent': 'AoT-PNASF-Guncelleme',
          accept: 'application/octet-stream, text/plain, */*',
        },
        timeout: zamanAsimi,
      },
      (yanit) => {
        const kod = yanit.statusCode || 0;
        const konum = yanit.headers.location;
        if ([301, 302, 303, 307, 308].includes(kod) && konum) {
          yanit.resume();
          const sonraki = new URL(konum, url).toString();
          resolve(istekAc(sonraki, { izinliHostlar, protokol, zamanAsimi, yonlendirme: yonlendirme + 1 }));
          return;
        }
        if (kod !== 200) {
          yanit.resume();
          reject(new Error(`İndirme başarısız (HTTP ${kod}).`));
          return;
        }
        resolve(yanit);
      },
    );

    istek.on('timeout', () => istek.destroy(new Error('İndirme zaman aşımına uğradı.')));
    istek.on('error', reject);
  });
}

/** Dosyayı akış halinde indirir; boyut sınırını aşarsa iptal eder. */
async function indir(url, hedef, { izinliHostlar = IZINLI_HOSTLAR, protokol = 'https:', maksBayt = MAKS_BAYT, ilerleme } = {}) {
  const yanit = await istekAc(url, { izinliHostlar, protokol });
  const bildirilen = Number(yanit.headers['content-length'] || 0);
  if (bildirilen > maksBayt) {
    yanit.destroy();
    throw new Error('Kurulum dosyası izin verilen boyuttan büyük.');
  }

  await fsp.mkdir(path.dirname(hedef), { recursive: true });

  await new Promise((resolve, reject) => {
    const akis = fs.createWriteStream(hedef);
    let inen = 0;
    let bitti = false;
    const bitir = (hata) => {
      if (bitti) return;
      bitti = true;
      akis.destroy();
      if (hata) reject(hata);
      else resolve();
    };

    yanit.on('data', (parca) => {
      inen += parca.length;
      if (inen > maksBayt) {
        yanit.destroy();
        bitir(new Error('Kurulum dosyası izin verilen boyuttan büyük.'));
        return;
      }
      if (typeof ilerleme === 'function') ilerleme(bildirilen ? inen / bildirilen : 0);
    });
    yanit.on('error', (hata) => bitir(hata));
    akis.on('error', (hata) => bitir(hata));
    akis.on('finish', () => bitir());
    yanit.pipe(akis);
  });

  const bilgi = await fsp.stat(hedef);
  return { boyut: bilgi.size };
}

/** Küçük metin dosyasını (SHA256SUMS.txt) indirir. */
async function metinIndir(url, secenekler = {}) {
  const yanit = await istekAc(url, secenekler);
  return await new Promise((resolve, reject) => {
    const parcalar = [];
    let toplam = 0;
    yanit.on('data', (parca) => {
      toplam += parca.length;
      if (toplam > MAKS_OZET_BAYT) {
        yanit.destroy();
        reject(new Error('Doğrulama dosyası izin verilen boyuttan büyük.'));
        return;
      }
      parcalar.push(parca);
    });
    yanit.on('error', reject);
    yanit.on('end', () => resolve(Buffer.concat(parcalar).toString('utf8')));
  });
}

/** SHA256SUMS.txt içinden dosya adına ait özeti bulur. */
function ozetBul(metin, dosyaAdi) {
  const hedef = String(dosyaAdi).toLowerCase();
  for (const satir of String(metin).split(/\r?\n/)) {
    const eslesme = satir.trim().match(/^([a-f0-9]{64})\s+\*?(.+)$/i);
    if (!eslesme) continue;
    if (eslesme[2].trim().toLowerCase() === hedef) return eslesme[1].toLowerCase();
  }
  return '';
}

function sha256(dosya) {
  return new Promise((resolve, reject) => {
    const ozet = crypto.createHash('sha256');
    const akis = fs.createReadStream(dosya);
    akis.on('error', reject);
    akis.on('data', (parca) => ozet.update(parca));
    akis.on('end', () => resolve(ozet.digest('hex')));
  });
}

function ozetEsitMi(a, b) {
  if (!/^[a-f0-9]{64}$/i.test(a) || !/^[a-f0-9]{64}$/i.test(b)) return false;
  return crypto.timingSafeEqual(Buffer.from(a.toLowerCase(), 'hex'), Buffer.from(b.toLowerCase(), 'hex'));
}

/**
 * Kurulum dosyasını indirir ve doğrular.
 * @param {{url: string, dogrulama?: string, ad?: string}} istek
 * @param {{klasor?: string, ilerleme?: (yuzde: number) => void, izinliHostlar?: string[], maksBayt?: number}} secenekler
 */
async function guncellemeIndir(istek = {}, secenekler = {}) {
  const url = String(istek.url || '');
  const dogrulama = String(istek.dogrulama || '');
  const ad = String(istek.ad || '');

  // Dizin ayırıcıları ve kaçış dizileri kabul edilmez: dosya adı düz olmalı.
  if (!/^[A-Za-z0-9._-]{1,120}$/.test(ad) || !KURULUM_UZANTILARI.test(ad)) {
    throw new Error('Geçersiz kurulum dosyası adı.');
  }
  if (!adresGuvenliMi(url, secenekler.izinliHostlar, secenekler.protokol)) {
    throw new Error('İndirme adresi güvenli değil.');
  }
  if (!adresGuvenliMi(dogrulama, secenekler.izinliHostlar, secenekler.protokol)) {
    throw new Error('SHA-256 doğrulama adresi yok; güvenlik için kurulum başlatılmadı.');
  }

  const klasor = await fsp.mkdtemp(path.join(secenekler.klasor || os.tmpdir(), 'aot-guncelleme-'));
  const hedef = path.join(klasor, ad);

  try {
    await indir(url, hedef, secenekler);
    const ozetler = await metinIndir(dogrulama, secenekler);
    const beklenen = ozetBul(ozetler, ad);
    if (!beklenen) throw new Error(`SHA256SUMS.txt içinde ${ad} için özet bulunamadı.`);
    const gercek = await sha256(hedef);
    if (!ozetEsitMi(gercek, beklenen)) {
      throw new Error('SHA-256 doğrulaması başarısız; kurulum başlatılmadı.');
    }
    return { dosya: hedef, boyut: (await fsp.stat(hedef)).size };
  } catch (hata) {
    await fsp.rm(klasor, { recursive: true, force: true });
    throw hata;
  }
}

module.exports = { IZINLI_HOSTLAR, adresGuvenliMi, indir, metinIndir, ozetBul, sha256, guncellemeIndir };
