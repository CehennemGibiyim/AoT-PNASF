#!/usr/bin/env node
// scripts/release-notes.cjs için regresyon testi.
// Kullanım: node scripts/test-release-notes.cjs

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const BETIK = path.join(__dirname, 'release-notes.cjs');

function calistir(args) {
  return spawnSync(process.execPath, [BETIK, ...args], { encoding: 'utf8' });
}

const testler = [];
function test(ad, fn) { testler.push([ad, fn]); }

test('bilinen sürüm için Türkçe notları üretir', () => {
  const r = calistir(['--surum', '1.1.1']);
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /^# AoT PNASF v1\.1\.1/);
  assert.match(r.stdout, /## Düzeltmeler/);
  assert.match(r.stdout, /SHA256SUMS\.txt/);
  assert.match(r.stdout, /Kurulum/);
  assert.ok(!/Full Changelog/.test(r.stdout), 'İngilizce otomatik not kalmamalı');
});

test('kaydı olmayan sürüm için Türkçe başlıklı yedek özet üretir', () => {
  const r = calistir(['--surum', '9.9.9']);
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /^# AoT PNASF v9\.9\.9/);
  assert.match(r.stdout, /## Değişiklikler/);
  assert.match(r.stdout, /## Kurulum/);
  assert.ok(!/Full Changelog/.test(r.stdout), 'İngilizce otomatik not kalmamalı');
  assert.ok(!/AI Bot|chore\((data|archive)\)/i.test(r.stdout), 'veri botu gürültüsü girmemeli');
});

test('--cikti dosyayı yazar', () => {
  const klasor = fs.mkdtempSync(path.join(os.tmpdir(), 'aot-notes-'));
  const hedef = path.join(klasor, 'notes.md');
  const r = calistir(['--surum', '1.1.0', '--cikti', hedef]);
  assert.equal(r.status, 0, r.stderr);
  const metin = fs.readFileSync(hedef, 'utf8');
  assert.match(metin, /^# AoT PNASF v1\.1\.0/);
  assert.match(metin, /Güncellemeleri denetle/);
  fs.rmSync(klasor, { recursive: true, force: true });
});

test('geçersiz sürümü reddeder', () => {
  const r = calistir(['--surum', 'kötü sürüm']);
  assert.equal(r.status, 1);
  assert.match(r.stderr, /Geçersiz sürüm/);
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
