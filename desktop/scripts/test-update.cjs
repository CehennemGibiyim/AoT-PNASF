#!/usr/bin/env node
// Masaüstü güncelleme indiricisi için regresyon testi.
// Kullanım: node desktop/scripts/test-update.cjs
//
// Testler yerel bir HTTP sunucusu kullanır; üretimde adres doğrulaması
// yalnızca HTTPS ve izinli GitHub alan adlarını kabul eder.

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');

const { adresGuvenliMi, guncellemeIndir, ozetBul } = require('../electron/update.cjs');

const KURULUM = 'AoT-PNASF-1.1.0-x64-setup.exe';
const ICERIK = Buffer.from('MZ-test-kurulum-dosyasi');
const OZET = crypto.createHash('sha256').update(ICERIK).digest('hex');

const yanitlar = {
  [`/${KURULUM}`]: { govde: ICERIK, tip: 'application/octet-stream' },
  '/SHA256SUMS.txt': {
    govde: Buffer.from(`${OZET}  ${KURULUM}\n${'0'.repeat(64)}  baska.exe\n`),
    tip: 'text/plain',
  },
  '/bozuk-sums.txt': { govde: Buffer.from(`${'1'.repeat(64)}  ${KURULUM}\n`), tip: 'text/plain' },
  '/eksik-sums.txt': { govde: Buffer.from(`${'2'.repeat(64)}  baska.exe\n`), tip: 'text/plain' },
};

const sunucu = http.createServer((istek, yanit) => {
  const kayit = yanitlar[(istek.url || '').split('?')[0]];
  if (!kayit) {
    yanit.writeHead(404).end('yok');
    return;
  }
  yanit.writeHead(200, { 'content-type': kayit.tip, 'content-length': kayit.govde.length });
  yanit.end(kayit.govde);
});

async function calistir() {
  await new Promise((cozum) => sunucu.listen(0, '127.0.0.1', cozum));
  const taban = `http://127.0.0.1:${sunucu.address().port}`;
  const secenekler = { izinliHostlar: ['127.0.0.1'], protokol: 'http:' };
  const klasor = fs.mkdtempSync(path.join(os.tmpdir(), 'aot-update-test-'));

  const testler = [
    ['üretimde http adresi reddedilir', async () => {
      assert.equal(adresGuvenliMi(`${taban}/${KURULUM}`), false);
    }],
    ['yalnızca izinli GitHub alan adları kabul edilir', async () => {
      assert.equal(adresGuvenliMi('https://github.com/a/b'), true);
      assert.equal(adresGuvenliMi('https://objects.githubusercontent.com/a'), true);
      assert.equal(adresGuvenliMi('https://github.com.evil.example/a'), false);
      assert.equal(adresGuvenliMi('javascript:alert(1)'), false);
    }],
    ['SHA256SUMS satırından dosya özeti bulunur', async () => {
      assert.equal(ozetBul(`${OZET}  ${KURULUM}\n`, KURULUM), OZET);
      assert.equal(ozetBul(`${OZET.toUpperCase()} *${KURULUM}`, KURULUM), OZET);
      assert.equal(ozetBul(`${OZET}  ${KURULUM}`, 'yok.exe'), '');
    }],
    ['geçersiz dosya adı reddedilir', async () => {
      await assert.rejects(
        () => guncellemeIndir({ url: `${taban}/${KURULUM}`, dogrulama: `${taban}/SHA256SUMS.txt`, ad: '../kacis.exe' }, { ...secenekler, klasor }),
        /Geçersiz kurulum dosyası adı/,
      );
    }],
    ['doğrulanmış kurulum dosyası indirilir', async () => {
      const sonuc = await guncellemeIndir(
        { url: `${taban}/${KURULUM}`, dogrulama: `${taban}/SHA256SUMS.txt`, ad: KURULUM },
        { ...secenekler, klasor },
      );
      assert.equal(sonuc.boyut, ICERIK.length);
      assert.deepEqual(fs.readFileSync(sonuc.dosya), ICERIK);
    }],
    ['özet uyuşmazsa indirme reddedilir ve dosya silinir', async () => {
      await assert.rejects(
        () => guncellemeIndir(
          { url: `${taban}/${KURULUM}`, dogrulama: `${taban}/bozuk-sums.txt`, ad: KURULUM },
          { ...secenekler, klasor },
        ),
        /SHA-256 doğrulaması başarısız/,
      );
    }],
    ['özet listesinde dosya yoksa kurulum başlatılmaz', async () => {
      await assert.rejects(
        () => guncellemeIndir(
          { url: `${taban}/${KURULUM}`, dogrulama: `${taban}/eksik-sums.txt`, ad: KURULUM },
          { ...secenekler, klasor },
        ),
        /özet bulunamadı/,
      );
    }],
  ];

  let gecen = 0;
  const hatalar = [];
  for (const [ad, fn] of testler) {
    try {
      await fn();
      gecen += 1;
      console.log(`✓ ${ad}`);
    } catch (err) {
      hatalar.push(`${ad}: ${err.message}`);
      console.error(`✗ ${ad} — ${err.message}`);
    }
  }

  sunucu.close();
  fs.rmSync(klasor, { recursive: true, force: true });

  console.log(`\n${gecen}/${testler.length} test geçti`);
  if (hatalar.length) process.exitCode = 1;
}

calistir().catch((hata) => {
  console.error(hata);
  sunucu.close();
  process.exitCode = 1;
});
