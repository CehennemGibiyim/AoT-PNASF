#!/usr/bin/env node
// Oturum mağazası + yerel alıcı testleri: node scripts/test-session.cjs
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const http = require('node:http');
const { SessionStore } = require('../session.cjs');
const { ingestBaslat } = require('../ingest.cjs');

const testler = [];
const test = (ad, fn) => testler.push([ad, fn]);

function istek(port, yol, { method = 'GET', token, govde } = {}) {
  return new Promise((resolve, reject) => {
    const veri = govde == null ? null : JSON.stringify(govde);
    const req = http.request({
      host: '127.0.0.1',
      port,
      path: yol,
      method,
      headers: {
        ...(token ? { authorization: `Bearer ${token}` } : {}),
        ...(veri ? { 'content-type': 'application/json', 'content-length': Buffer.byteLength(veri) } : {}),
      },
    }, (res) => {
      let g = '';
      res.on('data', (p) => { g += p; });
      res.on('end', () => resolve({ kod: res.statusCode, govde: g ? JSON.parse(g) : null }));
    });
    req.on('error', reject);
    if (veri) req.write(veri);
    req.end();
  });
}

test('olaylar toplanır, süre ve DPS hesaplanır', () => {
  const dosya = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'aot-session-')), 'oturum.json');
  const s = new SessionStore(dosya);
  s.basla(new Date(Date.now() - 10_000).toISOString());
  assert.equal(s.olayEkle({ tur: 'loot', ad: 'T6 Deri', adet: 2, birimDeger: 500 }).kabul, true);
  s.olayEkle({ tur: 'loot', ad: 'T5 Kumaş', deger: 300 });
  s.olayEkle({ tur: 'kill', ad: 'Rakip', fame: 1000 });
  s.olayEkle({ tur: 'death' });
  s.olayEkle({ tur: 'fame', miktar: 2000, alan: 'pve' });
  s.olayEkle({ tur: 'damage', miktar: 600 });
  const o = s.ozet();
  assert.equal(o.toplam.silver, 1300);
  assert.equal(o.toplam.loot, 2);
  assert.equal(o.toplam.kills, 1);
  assert.equal(o.toplam.deaths, 1);
  assert.equal(o.toplam.fame, 3000);
  assert.equal(o.fame.pve, 2000);
  assert.ok(o.sure >= 9 && o.sure <= 11, `süre beklenen aralıkta değil: ${o.sure}`);
  assert.equal(o.dps, 60);
  s.bitir();
  assert.equal(s.ozet().aktif, false);
  fs.rmSync(path.dirname(dosya), { recursive: true, force: true });
});

test('geçersiz olay reddedilir, kalıcılık korunur', () => {
  const dosya = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'aot-session-')), 'oturum.json');
  const s = new SessionStore(dosya);
  assert.equal(s.olayEkle({ tur: 'hack' }).kabul, false);
  assert.equal(s.olayEkle(null).kabul, false);
  s.olayEkle({ tur: 'loot', ad: 'Test', adet: 1, birimDeger: 42 });
  const yeniden = new SessionStore(dosya);
  assert.equal(yeniden.ozet().toplam.silver, 42);
  fs.rmSync(path.dirname(dosya), { recursive: true, force: true });
});

test('alıcı token ister, olayı mağazaya yazar', async () => {
  const dosya = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'aot-session-')), 'oturum.json');
  const s = new SessionStore(dosya);
  const alici = await ingestBaslat(s);

  try {
    const yetkisiz = await istek(alici.port, '/olay', { method: 'POST', govde: { tur: 'loot', deger: 999 } });
    assert.equal(yetkisiz.kod, 401);

    const saglik = await istek(alici.port, '/saglik', { token: alici.token });
    assert.equal(saglik.kod, 200);

    const olay = await istek(alici.port, '/olay', {
      method: 'POST', token: alici.token, govde: { tur: 'loot', ad: 'Kurt Postu', adet: 3, birimDeger: 100 },
    });
    assert.equal(olay.kod, 200);
    assert.equal(olay.govde.kabul, true);

    const toplu = await istek(alici.port, '/olaylar', {
      method: 'POST', token: alici.token,
      govde: [{ tur: 'kill', fame: 500 }, { tur: 'damage', miktar: 1200 }],
    });
    assert.equal(toplu.govde.kabul, 2);

    const durum = await istek(alici.port, '/durum', { token: alici.token });
    assert.equal(durum.govde.durum.toplam.silver, 300);
    assert.equal(durum.govde.durum.toplam.hasar, 1200);
    assert.equal(durum.govde.durum.toplam.kills, 1);

    const bitir = await istek(alici.port, '/bitir', { method: 'POST', token: alici.token });
    assert.equal(bitir.govde.durum.aktif, false);
  } finally {
    await alici.kapat();
    fs.rmSync(path.dirname(dosya), { recursive: true, force: true });
  }
});

(async () => {
  let hata = 0;
  for (const [ad, fn] of testler) {
    try { await fn(); console.log(`✓ ${ad}`); } catch (e) { hata++; console.error(`✗ ${ad}\n  ${e.message}`); }
  }
  if (hata) process.exit(1);
  console.log(`${testler.length}/${testler.length} oturum testi geçti`);
})();
