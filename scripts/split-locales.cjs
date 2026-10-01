const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const localePath = path.join(ROOT, 'locales', 'tr-official.json');
const outputDir = path.join(ROOT, 'locales');
const bucketCount = 16;

function readCatalog() {
  const value = JSON.parse(fs.readFileSync(localePath, 'utf8'));
  if (!value || typeof value !== 'object' || Array.isArray(value) || !Object.keys(value).length) {
    throw new Error('Türkçe resmi katalog boş veya geçersiz');
  }
  return value;
}

function bucketFor(key) {
  let hash = 0;
  for (const char of key) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return hash % bucketCount;
}

const catalog = readCatalog();
const buckets = Array.from({ length: bucketCount }, () => ({}));
Object.entries(catalog).forEach(([key, value]) => { buckets[bucketFor(key)][key] = value; });

const files = [];
for (let index = 0; index < bucketCount; index += 1) {
  const name = `tr-official-${String(index).padStart(2, '0')}.json`;
  fs.writeFileSync(path.join(outputDir, name), JSON.stringify(buckets[index]), 'utf8');
  files.push(name);
}
fs.writeFileSync(
  path.join(outputDir, 'tr-official-manifest.json'),
  JSON.stringify({ version: 1, source: 'tr-official.json', files }, null, 2) + '\n',
  'utf8'
);
console.log(`[Locale Splitter] ${Object.keys(catalog).length} kayıt ${files.length} parçaya ayrıldı.`);
