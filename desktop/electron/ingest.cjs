/**
 * Yerel olay alıcısı (ingest).
 *
 * Yalnızca 127.0.0.1 üzerinde, rastgele portta dinler ve her istekte
 * `Authorization: Bearer <token>` ister. Token her açılışta üretilir ve
 * yalnızca uygulamanın kendi penceresine IPC ile verilir.
 *
 * Amaç: yerel bir yardımcı aracın (veya curl/kendi betiğinizin) ürettiği
 * loot/kill/fame olaylarını masaüstü uygulamasına aktarması. Dış ağa açılmaz,
 * CORS başlığı göndermez, gövde boyutu sınırlıdır.
 */
const http = require('node:http');
const crypto = require('node:crypto');

const GOVDE_SINIRI = 256 * 1024;

function yanit(res, kod, govde) {
  const metin = JSON.stringify(govde);
  res.writeHead(kod, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(metin),
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
  });
  res.end(metin);
}

function govdeOku(req) {
  return new Promise((resolve, reject) => {
    let boyut = 0;
    const parcalar = [];
    req.on('data', (p) => {
      boyut += p.length;
      if (boyut > GOVDE_SINIRI) {
        reject(Object.assign(new Error('gövde çok büyük'), { kod: 413 }));
        req.destroy();
        return;
      }
      parcalar.push(p);
    });
    req.on('end', () => resolve(Buffer.concat(parcalar).toString('utf8')));
    req.on('error', reject);
  });
}

function yerelMi(req) {
  const adres = req.socket.remoteAddress || '';
  return adres === '127.0.0.1' || adres === '::1' || adres === '::ffff:127.0.0.1';
}

/**
 * @param {import('./session.cjs').SessionStore} store
 * @param {{port?: number}} [secenek]
 */
function ingestBaslat(store, secenek = {}) {
  const token = crypto.randomBytes(24).toString('hex');

  const sunucu = http.createServer(async (req, res) => {
    if (!yerelMi(req)) return yanit(res, 403, { ok: false, hata: 'yalnızca yerel bağlantı' });

    const auth = String(req.headers.authorization || '');
    const baslikToken = auth.startsWith('Bearer ') ? auth.slice(7) : String(req.headers['x-aot-token'] || '');
    if (baslikToken !== token) return yanit(res, 401, { ok: false, hata: 'geçersiz token' });

    const yol = (req.url || '/').split('?')[0];

    try {
      if (req.method === 'GET' && yol === '/saglik') return yanit(res, 200, { ok: true });

      if (req.method === 'GET' && yol === '/durum') return yanit(res, 200, { ok: true, durum: store.ozet() });

      if (req.method === 'POST' && (yol === '/olay' || yol === '/olaylar')) {
        const govde = JSON.parse((await govdeOku(req)) || '{}');
        const sonuc = Array.isArray(govde) ? store.olaylariEkle(govde) : store.olayEkle(govde);
        const kod = sonuc.kabul === false || sonuc.kabul === undefined ? 400 : 200;
        return yanit(res, kod, { ok: kod === 200, ...sonuc });
      }

      if (req.method === 'POST' && yol === '/baslat') return yanit(res, 200, { ok: true, durum: store.basla() });
      if (req.method === 'POST' && yol === '/bitir') return yanit(res, 200, { ok: true, durum: store.bitir() });
      if (req.method === 'POST' && yol === '/temizle') return yanit(res, 200, { ok: true, durum: store.temizle() });

      return yanit(res, 404, { ok: false, hata: 'bilinmeyen yol' });
    } catch (hata) {
      const kod = hata && hata.kod ? hata.kod : 400;
      return yanit(res, kod, { ok: false, hata: String((hata && hata.message) || hata) });
    }
  });

  return new Promise((resolve, reject) => {
    sunucu.once('error', reject);
    sunucu.listen(secenek.port || 0, '127.0.0.1', () => {
      const adres = sunucu.address();
      resolve({
        port: adres.port,
        token,
        kapat: () => new Promise((r) => sunucu.close(() => r())),
      });
    });
  });
}

module.exports = { ingestBaslat };
