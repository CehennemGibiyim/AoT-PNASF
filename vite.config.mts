import { cpSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';

const root = dirname(fileURLToPath(import.meta.url));

// Derleme dışında bırakılan, olduğu gibi kopyalanması gereken kaynaklar.
const STATIC_PATHS = [
  'data',
  'locales',
  'styles',
  'styles.css',
  'serviceworker.js',
  'miniapp.i18n.json',
];

/** data/locales/styles ve service worker gibi statik kaynakları dist/ içine kopyalar. */
function copyStaticAssets(): Plugin {
  return {
    name: 'aot-copy-static-assets',
    apply: 'build',
    closeBundle() {
      const outDir = resolve(root, 'dist');
      for (const rel of STATIC_PATHS) {
        const from = resolve(root, rel);
        if (!existsSync(from)) continue;
        cpSync(from, resolve(outDir, rel), { recursive: true });
      }
    },
  };
}

// Kök ve pages/ altındaki tüm HTML sayfaları çoklu-giriş olarak derlenir.
const htmlInputs = [
  'index.html',
  'crafting.html',
  'market.html',
  '404.html',
  'pages/crafting.html',
  'pages/guides.html',
  'pages/maps.html',
  'pages/market.html',
  'pages/pvp.html',
  'pages/tools.html',
].reduce<Record<string, string>>((acc, rel) => {
  acc[rel.replace(/\.html$/, '').replace('/', '-')] = resolve(root, rel);
  return acc;
}, {});

export default defineConfig({
  // GitHub Pages alt dizininde (/AoT-PNASF/) de çalışması için göreli taban.
  base: './',
  build: {
    outDir: 'dist',
    // İlk fazda okunabilir çıktı: minification kapalı.
    minify: false,
    sourcemap: false,
    assetsInlineLimit: 0,
    rollupOptions: {
      input: htmlInputs,
    },
  },
  plugins: [copyStaticAssets()],
});
