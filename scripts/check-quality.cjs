const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const warnings = [];
const failures = [];

function read(relativePath) {
  const fullPath = path.join(ROOT, relativePath);
  return fs.existsSync(fullPath) ? fs.readFileSync(fullPath, 'utf8') : '';
}

function htmlFiles(directory = ROOT) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === 'node_modules' || entry.name.startsWith('.git')) return [];
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return htmlFiles(fullPath);
    return entry.isFile() && entry.name.endsWith('.html') ? [fullPath] : [];
  });
}

function checkHtml(filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  const relative = path.relative(ROOT, filePath).replace(/\\/g, '/');
  const ids = new Set();
  for (const match of html.matchAll(/\bid=["']([^"']+)["']/gi)) {
    if (ids.has(match[1])) failures.push(`${relative}: yinelenen id=${match[1]}`);
    ids.add(match[1]);
  }
  for (const match of html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/gi)) {
    const attrs = match[1];
    const body = match[2].replace(/<[^>]+>/g, '').trim();
    if (!body && !/aria-label=|title=/.test(attrs)) warnings.push(`${relative}: etiketsiz buton`);
  }
  for (const match of html.matchAll(/<img\b([^>]*)>/gi)) {
    if (!/\balt=/.test(match[1])) warnings.push(`${relative}: alt niteliği olmayan görsel`);
  }
}

for (const file of htmlFiles()) checkHtml(file);

const sizeLimits = [
  ['data/items-data.js', 450000],
  ['data/world-data.js', 120000],
  ['js/arbitrage.js', 155000],
  ['locales/tr-official.json', 620000]
];
for (const [relative, limit] of sizeLimits) {
  const file = path.join(ROOT, relative);
  if (fs.existsSync(file) && fs.statSync(file).size > limit) {
    warnings.push(`${relative}: parçalanması önerilen büyük dosya (${fs.statSync(file).size} byte)`);
  }
}

if (failures.length) {
  console.error(`Kalite kontrolü başarısız (${failures.length} hata):`);
  failures.forEach((message) => console.error(`- ${message}`));
  process.exitCode = 1;
} else {
  console.log(`Kalite kontrolü başarılı: ${htmlFiles().length} HTML dosyası tarandı.`);
}
if (warnings.length) warnings.forEach((message) => console.warn(`Uyarı: ${message}`));
