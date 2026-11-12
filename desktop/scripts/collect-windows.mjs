#!/usr/bin/env node
// Windows kurulum paketlerini tek klasörde toplar.
//
// Electron (release/*.exe) ve Tauri (bundle/nsis/*.exe, bundle/msi/*.msi)
// çıktılarını desktop/windows/kurulum/ içine kopyalar, SHA256SUMS.txt ve
// SURUM.txt yazar. Windows kurulum paketi üretmez; üretilmiş paketleri toplar.
//
// Kullanım:
//   node desktop/scripts/collect-windows.mjs
//   node desktop/scripts/collect-windows.mjs --electron /yol/release --tauri /yol/bundle --out /yol/hedef
//   node desktop/scripts/collect-windows.mjs --allow-empty   (hiç paket yoksa hata verme)

import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

function parseArgs(argv) {
  const opts = {
    electron: path.join(repoRoot, 'desktop', 'electron', 'release'),
    tauri: path.join(repoRoot, 'desktop', 'tauri', 'src-tauri', 'target', 'release', 'bundle'),
    out: path.join(repoRoot, 'desktop', 'windows', 'kurulum'),
    allowEmpty: false,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--allow-empty') { opts.allowEmpty = true; continue; }
    if (arg === '--electron' || arg === '--tauri' || arg === '--out') {
      const value = argv[i + 1];
      if (!value) throw new Error(`${arg} için yol gerekli`);
      opts[arg.slice(2)] = path.resolve(value);
      i += 1;
      continue;
    }
    if (arg === '--help' || arg === '-h') {
      console.log('kullanım: node desktop/scripts/collect-windows.mjs [--electron dir] [--tauri dir] [--out dir] [--allow-empty]');
      process.exit(0);
    }
    throw new Error(`bilinmeyen argüman: ${arg}`);
  }
  return opts;
}

const KURULUM_DESENI = /\.(exe|msi)$/i;

// Dosya adları boşluksuz ve yalnızca güvenli karakterlerle toplanır:
// güncelleyici (desktop/electron/update.cjs) bu kuralı zorunlu tutar ve
// GitHub yükleme sırasında boşlukları noktaya çevirir. Böylece sürüm
// varlıklarının adı, SHA256SUMS.txt ve zip içeriği birebir aynı olur.
const GUVENLI_AD = /^[A-Za-z0-9._-]{1,120}$/;

function guvenliAd(ad) {
  if (GUVENLI_AD.test(ad)) return ad;
  return String(ad)
    .replace(/[^A-Za-z0-9._-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^[-.]+/, '')
    .slice(0, 120);
}

function listDir(dir) {
  try {
    return fs.readdirSync(dir, { withFileTypes: true });
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

// Electron: yalnızca release/ kökündeki dosyalar (win-unpacked/ içindeki
// çalıştırılabilir dosya kurulum paketi değildir).
function electronInstallers(releaseDir) {
  return listDir(releaseDir)
    .filter((e) => e.isFile() && KURULUM_DESENI.test(e.name))
    .map((e) => ({ file: path.join(releaseDir, e.name), kaynak: 'Electron' }));
}

// Tauri: bundle/nsis/*.exe ve bundle/msi/*.msi
function tauriInstallers(bundleDir) {
  const out = [];
  for (const [alt, kaynak] of [['nsis', 'Tauri (NSIS)'], ['msi', 'Tauri (MSI)']]) {
    const dir = path.join(bundleDir, alt);
    for (const entry of listDir(dir)) {
      if (entry.isFile() && KURULUM_DESENI.test(entry.name)) {
        out.push({ file: path.join(dir, entry.name), kaynak });
      }
    }
  }
  return out;
}

function sha256(file) {
  return createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function gitCommit() {
  try {
    return execFileSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: repoRoot, encoding: 'utf8' }).trim();
  } catch {
    return 'bilinmiyor';
  }
}

function appVersion() {
  try {
    return JSON.parse(fs.readFileSync(path.join(repoRoot, 'package.json'), 'utf8')).version || '1.0.0';
  } catch {
    return '1.0.0';
  }
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const bulunan = [...electronInstallers(opts.electron), ...tauriInstallers(opts.tauri)];

  fs.mkdirSync(opts.out, { recursive: true });

  if (!bulunan.length) {
    const mesaj = [
      'Toplanacak Windows kurulum paketi bulunamadı.',
      `  Electron: ${opts.electron}`,
      `  Tauri:    ${opts.tauri}`,
      '',
      'Windows paketleri yalnızca Windows (veya wine) üzerinde üretilebilir:',
      '  npm run windows:installer          (Windows, tek komut)',
      '  GitHub Actions → Desktop Installers (Windows)',
    ].join('\n');
    if (opts.allowEmpty) { console.log(mesaj); return; }
    console.error(mesaj);
    process.exit(1);
  }

  const satirlar = [];
  const kopyalanan = [];
  const kullanilan = new Set();
  for (const { file, kaynak } of bulunan) {
    const hedefAd = guvenliAd(path.basename(file));
    if (kullanilan.has(hedefAd)) {
      throw new Error(`Aynı ada sahip iki paket: ${hedefAd}`);
    }
    kullanilan.add(hedefAd);
    const hedef = path.join(opts.out, hedefAd);
    fs.copyFileSync(file, hedef);
    const boyut = fs.statSync(hedef).size;
    const hash = sha256(hedef);
    satirlar.push(`${hash}  ${hedefAd}`);
    kopyalanan.push({ ad: hedefAd, kaynak, boyut, hash });
  }

  const rehber = path.join(repoRoot, 'desktop', 'windows', 'KURULUM-OKU.txt');
  if (fs.existsSync(rehber)) fs.copyFileSync(rehber, path.join(opts.out, 'KURULUM-OKU.txt'));

  fs.writeFileSync(path.join(opts.out, 'SHA256SUMS.txt'), `${satirlar.join('\n')}\n`);
  fs.writeFileSync(
    path.join(opts.out, 'SURUM.txt'),
    [
      'AoT PNASF — Windows kurulum paketleri',
      `Sürüm:   ${appVersion()}`,
      `Commit:  ${gitCommit()}`,
      `Tarih:   ${new Date().toISOString()}`,
      '',
      ...kopyalanan.map((f) => `${f.ad}  |  ${f.kaynak}  |  ${(f.boyut / 1024 / 1024).toFixed(1)} MB  |  sha256 ${f.hash.slice(0, 16)}…`),
      '',
      'Kurulum: setup.exe dosyasını çalıştırın. Yönetici izni gerekmez',
      '(kullanıcı bazlı kurulum), kurulum dizini değiştirilebilir.',
      'portable.exe kurulum gerektirmez; tek dosya olarak çalışır.',
      'Paketler imzasız olduğu için SmartScreen "bilinmeyen yayımcı" uyarısı verebilir.',
      'Doğrulama: certutil -hashfile <dosya> SHA256  → SHA256SUMS.txt ile karşılaştırın.',
    ].join('\n') + '\n',
  );

  for (const f of kopyalanan) {
    console.log(`✓ ${f.ad.padEnd(42)} ${(f.boyut / 1024 / 1024).toFixed(1).padStart(6)} MB  (${f.kaynak})`);
  }
  const goreliHedef = path.relative(repoRoot, opts.out);
  const hedefYazi = !goreliHedef || goreliHedef.startsWith('..') ? opts.out : goreliHedef;
  console.log(`\nHedef klasör: ${hedefYazi}`);
  console.log(`Dosyalar: SHA256SUMS.txt, SURUM.txt + ${kopyalanan.length} paket`);
}

main();
