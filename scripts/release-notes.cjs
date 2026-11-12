#!/usr/bin/env node
/**
 * Türkçe sürüm notu üreticisi.
 *
 * Sürüm notları docs/surum-notlari.json içinde elle yazılır. Bir sürüm için
 * kayıt yoksa (yeni etiket), son etiketten bu yana gelen commit başlıklarından
 * Türkçe başlıklı bir özet üretilir; böylece yayın sayfası hiçbir zaman
 * İngilizce "Full Changelog" metniyle kalmaz.
 *
 * Kullanım:
 *   node scripts/release-notes.cjs --surum 1.1.1 --cikti release-notes.md
 *   node scripts/release-notes.cjs                 (sürüm package.json'dan)
 */
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const kok = path.resolve(__dirname, '..');
const NOT_DOSYASI = path.join(kok, 'docs', 'surum-notlari.json');
const DEPO = 'CehennemGibiyim/AoT-PNASF';

// Veri botlarının gürültüsü sürüm notlarına girmesin.
const GURULTU =
  /(^⚔️|AI Bot|PvP Feed|AI Smart Feed|Build Library|Feed Güncellendi|veri güncelle|chore\((data|archive)\)|^chore\()/i;

function argumanlar(argv) {
  const ayar = { surum: '', cikti: '' };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--surum' || argv[i] === '--cikti') {
      ayar[argv[i].slice(2)] = argv[i + 1] || '';
      i += 1;
    }
  }
  return ayar;
}

function surumOku() {
  const ayar = argumanlar(process.argv.slice(2));
  if (ayar.surum) return ayar.surum.replace(/^v/i, '');
  return JSON.parse(fs.readFileSync(path.join(kok, 'package.json'), 'utf8')).version;
}

function notlarOku() {
  try {
    return JSON.parse(fs.readFileSync(NOT_DOSYASI, 'utf8'));
  } catch {
    return {};
  }
}

function oncekiEtiket() {
  try {
    return execFileSync('git', ['describe', '--tags', '--abbrev=0', 'HEAD^'], {
      cwd: kok,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return '';
  }
}

function commitBasliklari() {
  const onceki = oncekiEtiket();
  const aralik = onceki ? `${onceki}..HEAD` : 'HEAD';
  try {
    return execFileSync('git', ['log', '--no-merges', '--pretty=%s', aralik], {
      cwd: kok,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .split('\n')
      .map((satir) => satir.trim())
      .filter((satir) => satir && !GURULTU.test(satir))
      .slice(0, 12);
  } catch {
    return [];
  }
}

function maddeListesi(basliklar) {
  return basliklar.map((baslik) => `- ${baslik}`);
}

function guncellemeNotu(surum) {
  const kayit = notlarOku()[surum];
  const satirlar = [`# AoT PNASF v${surum}`, ''];

  if (kayit) {
    if (kayit.ozet) satirlar.push(String(kayit.ozet), '');
    const yenilikler = Array.isArray(kayit.yenilikler) ? kayit.yenilikler : [];
    const duzeltmeler = Array.isArray(kayit.duzeltmeler) ? kayit.duzeltmeler : [];
    if (yenilikler.length) satirlar.push('## Yenilikler', '', ...maddeListesi(yenilikler), '');
    if (duzeltmeler.length) satirlar.push('## Düzeltmeler', '', ...maddeListesi(duzeltmeler), '');
  } else {
    satirlar.push(
      'Bu sürümde yapılan değişiklikler aşağıda listelenmiştir.',
      '',
      '## Değişiklikler',
      '',
      ...(commitBasliklari().length
        ? maddeListesi(commitBasliklari())
        : ['- Bu sürüm için ayrıntılı değişiklik kaydı bulunmuyor.']),
      '',
    );
  }

  satirlar.push(
    '## Kurulum',
    '',
    `- Kurulum: \`AoT-PNASF-${surum}-x64-setup.exe\` (yönetici izni gerekmez, kurulum dizini seçilebilir).`,
    `- Kurulumsuz: \`AoT-PNASF-${surum}-x64-portable.exe\` tek dosya olarak çalışır.`,
    '- MSI paketleri de aynı sürüm klasöründe yer alır.',
    '',
    '## Doğrulama',
    '',
    'İndirdiğiniz dosyanın SHA-256 özetini `SHA256SUMS.txt` ile karşılaştırabilirsiniz:',
    '',
    '```',
    'certutil -hashfile <dosya> SHA256',
    '```',
    '',
    'Paketler kod imzalı değildir; Windows SmartScreen "bilinmeyen yayımcı" uyarısı verebilir.',
    'Güncelleme yalnızca uygulamada "Güncelle" düğmesine basıldığında başlar.',
    '',
    `Sürüm sayfası: https://github.com/${DEPO}/releases/tag/v${surum}`,
    '',
  );

  return satirlar.join('\n');
}

const surum = surumOku();
if (!/^[0-9][0-9A-Za-z.+-]{0,31}$/.test(surum)) {
  console.error(`Geçersiz sürüm: ${surum}`);
  process.exit(1);
}

const metin = guncellemeNotu(surum);
const cikti = argumanlar(process.argv.slice(2)).cikti;
if (cikti) {
  fs.writeFileSync(path.resolve(cikti), metin);
  console.log(`✓ sürüm notları yazıldı: ${cikti} (${metin.length} karakter)`);
} else {
  process.stdout.write(metin);
}
