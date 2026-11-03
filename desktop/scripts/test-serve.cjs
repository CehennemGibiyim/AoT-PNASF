#!/usr/bin/env node
// Electron kabuğunun aot:// yol çözümleyicisi için regresyon testi.
// Kullanım: node desktop/scripts/test-serve.cjs

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { resolveAsset } = require('../electron/serve.cjs');

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'aot-serve-'));
fs.mkdirSync(path.join(root, 'assets'), { recursive: true });
fs.mkdirSync(path.join(root, 'data'), { recursive: true });
fs.writeFileSync(path.join(root, 'index.html'), '<!doctype html><title>AoT</title>');
fs.writeFileSync(path.join(root, 'assets', 'app.js'), 'console.log("aot");');
fs.writeFileSync(path.join(root, 'data', 'feed.json'), '{"ok":true}');
fs.writeFileSync(path.join(root, 'styles.css'), 'body{}');
fs.writeFileSync(path.join(os.tmpdir(), 'aot-disari.txt'), 'gizli');

const goreli = (r) => (r ? path.relative(root, r.filePath) : null);

const testler = [
  ['kök isteği index.html verir', () => {
    const r = resolveAsset(root, 'aot://app/');
    assert.equal(goreli(r), 'index.html');
    assert.match(r.mime, /text\/html/);
  }],
  ['js dosyası doğru MIME ile gelir', () => {
    const r = resolveAsset(root, 'aot://app/assets/app.js');
    assert.equal(goreli(r), 'assets/app.js');
    assert.match(r.mime, /javascript/);
  }],
  ['json veri dosyası okunur', () => {
    const r = resolveAsset(root, 'aot://app/data/feed.json');
    assert.equal(goreli(r), 'data/feed.json');
    assert.match(r.mime, /application\/json/);
  }],
  ['css MIME tipi doğru', () => {
    assert.match(resolveAsset(root, 'aot://app/styles.css').mime, /text\/css/);
  }],
  ['uzantısız bilinmeyen yol SPA olarak index.html döner', () => {
    assert.equal(goreli(resolveAsset(root, 'aot://app/build/items')), 'index.html');
  }],
  ['olmayan dosya (uzantılı) 404 için null döner', () => {
    assert.equal(resolveAsset(root, 'aot://app/assets/yok.js'), null);
  }],
  ['kodlanmış dizin kaçışı reddedilir', () => {
    assert.equal(resolveAsset(root, 'aot://app/%2e%2e%2faot-disari.txt'), null);
  }],
  ['mutlak yol kaçışı kök içinde kalır', () => {
    const r = resolveAsset(root, 'aot://app/../../etc/passwd');
    assert.ok(r === null || goreli(r) === 'index.html' || !goreli(r).startsWith('..'), 'kök dışına çıkılmamalı');
  }],
  ['sorgu dizesi yolu bozmaz', () => {
    assert.equal(goreli(resolveAsset(root, 'aot://app/assets/app.js?v=3')), 'assets/app.js');
  }],
];

let gecen = 0;
const hatalar = [];
for (const [ad, fn] of testler) {
  try {
    fn();
    gecen += 1;
    console.log(`✓ ${ad}`);
  } catch (err) {
    hatalar.push(`${ad}: ${err.message}`);
    console.error(`✗ ${ad} — ${err.message}`);
  }
}

fs.rmSync(root, { recursive: true, force: true });
fs.rmSync(path.join(os.tmpdir(), 'aot-disari.txt'), { force: true });

console.log(`\n${gecen}/${testler.length} test geçti`);
if (hatalar.length) process.exit(1);
