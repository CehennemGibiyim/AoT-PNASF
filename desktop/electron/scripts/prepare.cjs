/**
 * depo kökündeki dist/ çıktısını desktop/electron/app/ içine kopyalar.
 * electron-builder paketlenen dosyaları uygulama klasöründe arar; dist dışarıda
 * olduğu için bu kopya gerekli.
 */
const fs = require('node:fs');
const path = require('node:path');

const electronDir = path.resolve(__dirname, '..');
const repoRoot = path.resolve(electronDir, '..', '..');
const dist = path.join(repoRoot, 'dist');
const target = path.join(electronDir, 'app');

if (!fs.existsSync(path.join(dist, 'index.html'))) {
  console.error('❌ dist/ bulunamadı. Önce depo kökünde "npm run build" çalıştırın.');
  process.exit(1);
}

fs.rmSync(target, { recursive: true, force: true });
fs.mkdirSync(target, { recursive: true });
fs.cpSync(dist, target, { recursive: true });

const sizeMb = (dir) => {
  let total = 0;
  const walk = (p) => {
    for (const entry of fs.readdirSync(p, { withFileTypes: true })) {
      const full = path.join(p, entry.name);
      if (entry.isDirectory()) walk(full);
      else total += fs.statSync(full).size;
    }
  };
  walk(dir);
  return (total / 1024 / 1024).toFixed(1);
};

console.log(`✅ app/ hazır — ${sizeMb(target)} MB`);
