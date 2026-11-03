import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';

const root = dirname(fileURLToPath(import.meta.url));

// Derleme bilgisi: arayüzde "hangi sürüm kurulu" sorusunu yanıtlar (js/app-info.ts).
// Commit tarihi kullanılır; böylece aynı commit'in tekrar derlemesi aynı
// varlık hash'lerini üretir (tarayıcı önbelleği boşa düşmez).
function gitBilgi(args: string[], yedek: string): string {
  try {
    return execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim() || yedek;
  } catch {
    return yedek;
  }
}

const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8')) as { version?: string };

const buildBilgisi = {
  __AOT_VERSION__: JSON.stringify(pkg.version || '1.0.0'),
  __AOT_COMMIT__: JSON.stringify(gitBilgi(['rev-parse', '--short', 'HEAD'], 'bilinmiyor')),
  __AOT_BUILD_DATE__: JSON.stringify(gitBilgi(['log', '-1', '--format=%cs'], 'bilinmiyor')),
  __AOT_BUILD_SOURCE__: JSON.stringify(process.env.CI ? 'ci' : 'local'),
};

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

// Uygulama tek sayfa (SPA): Haritalar / Rehberler / Araçlar index.html içinde
// sekme olarak açılır. Yalnızca kök belge ve 404 girişi derlenir.
const htmlInputs = [
  'index.html',
  '404.html',
].reduce<Record<string, string>>((acc, rel) => {
  acc[rel.replace(/\.html$/, '').replace('/', '-')] = resolve(root, rel);
  return acc;
}, {});

export default defineConfig({
  // GitHub Pages alt dizininde (/AoT-PNASF/) de çalışması için göreli taban.
  base: './',
  define: buildBilgisi,
  build: {
    outDir: 'dist',
    // Paket boyutu: kaynak haritası olmadan küçültme (Vite'ın kendi minifier'ı).
    // Geliştirme sunucusu etkilenmez; hata ayıklama için `npm run build:debug`.
    minify: true,
    sourcemap: false,
    assetsInlineLimit: 0,
    rollupOptions: {
      input: htmlInputs,
    },
  },
  plugins: [copyStaticAssets()],
});
