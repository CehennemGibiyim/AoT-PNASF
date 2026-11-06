#!/usr/bin/env node
// collect-windows.mjs için regresyon testi (Windows gerekmez).
// Kullanım: node desktop/scripts/test-collect.cjs

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const TOPLAYICI = path.join(__dirname, 'collect-windows.mjs');
const SURUM = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'package.json'), 'utf8')).version;

function calistir(args) {
  return spawnSync(process.execPath, [TOPLAYICI, ...args], { encoding: 'utf8' });
}

function mkTmp() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'aot-collect-'));
}

function dosya(yol, boyut) {
  fs.mkdirSync(path.dirname(yol), { recursive: true });
  fs.writeFileSync(yol, Buffer.alloc(boyut, 7));
}

const testler = [];
function test(ad, fn) { testler.push([ad, fn]); }

test('Electron setup/portable ve Tauri nsis/msi paketlerini toplar', () => {
  const kok = mkTmp();
  const release = path.join(kok, 'release');
  const bundle = path.join(kok, 'bundle');
  const out = path.join(kok, 'out');

  dosya(path.join(release, 'AoT-PNASF-1.0.0-x64-setup.exe'), 2048);
  dosya(path.join(release, 'AoT-PNASF-1.0.0-x64-portable.exe'), 1024);
  dosya(path.join(bundle, 'nsis', 'AoT PNASF_1.0.0_x64-setup.exe'), 4096);
  dosya(path.join(bundle, 'msi', 'AoT PNASF_1.0.0_x64_en-US.msi'), 3000);

  const r = calistir(['--electron', release, '--tauri', bundle, '--out', out]);
  assert.equal(r.status, 0, r.stderr);

  const dosyalar = fs.readdirSync(out).sort();
  assert.deepEqual(dosyalar, [
    'AoT PNASF_1.0.0_x64-setup.exe',
    'AoT PNASF_1.0.0_x64_en-US.msi',
    'AoT-PNASF-1.0.0-x64-portable.exe',
    'AoT-PNASF-1.0.0-x64-setup.exe',
    'KURULUM-OKU.txt',
    'SHA256SUMS.txt',
    'SURUM.txt',
  ]);
  fs.rmSync(kok, { recursive: true, force: true });
});

test('win-unpacked içindeki çalıştırılabilir dosya kurulum paketi sayılmaz', () => {
  const kok = mkTmp();
  const release = path.join(kok, 'release');
  const out = path.join(kok, 'out');
  dosya(path.join(release, 'win-unpacked', 'AoT PNASF.exe'), 512);
  dosya(path.join(release, 'AoT-PNASF-1.0.0-x64-setup.exe'), 600);

  const r = calistir(['--electron', release, '--tauri', path.join(kok, 'yok'), '--out', out]);
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(fs.readdirSync(out).filter((f) => /\.exe$/.test(f)), ['AoT-PNASF-1.0.0-x64-setup.exe']);
  fs.rmSync(kok, { recursive: true, force: true });
});

test('SHA256SUMS.txt paketlerin gerçek özetini içerir', () => {
  const kok = mkTmp();
  const release = path.join(kok, 'release');
  const out = path.join(kok, 'out');
  const paket = path.join(release, 'AoT-PNASF-1.0.0-x64-setup.exe');
  dosya(paket, 1234);

  const r = calistir(['--electron', release, '--tauri', path.join(kok, 'yok'), '--out', out]);
  assert.equal(r.status, 0, r.stderr);

  const beklenen = crypto.createHash('sha256').update(fs.readFileSync(paket)).digest('hex');
  const satir = fs.readFileSync(path.join(out, 'SHA256SUMS.txt'), 'utf8').trim();
  assert.equal(satir, `${beklenen}  AoT-PNASF-1.0.0-x64-setup.exe`);
  fs.rmSync(kok, { recursive: true, force: true });
});

test('SURUM.txt sürüm, commit ve paket listesini yazar', () => {
  const kok = mkTmp();
  const release = path.join(kok, 'release');
  const out = path.join(kok, 'out');
  dosya(path.join(release, 'AoT-PNASF-1.0.0-x64-portable.exe'), 900);

  calistir(['--electron', release, '--tauri', path.join(kok, 'yok'), '--out', out]);
  const metin = fs.readFileSync(path.join(out, 'SURUM.txt'), 'utf8');
  assert.match(metin, new RegExp(`Sürüm:\\s+${SURUM.replace(/\./g, '\\.')}`));
  assert.match(metin, /Commit:\s+\S+/);
  assert.match(metin, /AoT-PNASF-1\.0\.0-x64-portable\.exe/);
  fs.rmSync(kok, { recursive: true, force: true });
});

test('paket yoksa hata koduyla çıkar', () => {
  const kok = mkTmp();
  const r = calistir(['--electron', path.join(kok, 'a'), '--tauri', path.join(kok, 'b'), '--out', path.join(kok, 'out')]);
  assert.equal(r.status, 1);
  assert.match(r.stderr, /bulunamadı/);
  fs.rmSync(kok, { recursive: true, force: true });
});

test('--allow-empty ile paket yokken de başarılı olur', () => {
  const kok = mkTmp();
  const r = calistir(['--electron', path.join(kok, 'a'), '--tauri', path.join(kok, 'b'), '--out', path.join(kok, 'out'), '--allow-empty']);
  assert.equal(r.status, 0, r.stderr);
  fs.rmSync(kok, { recursive: true, force: true });
});

let gecen = 0;
const hatalar = [];
for (const [ad, fn] of testler) {
  try {
    fn();
    gecen += 1;
    console.log(`✓ ${ad}`);
  } catch (err) {
    hatalar.push(ad);
    console.error(`✗ ${ad} — ${err.message}`);
  }
}

console.log(`\n${gecen}/${testler.length} test geçti`);
if (hatalar.length) process.exit(1);
