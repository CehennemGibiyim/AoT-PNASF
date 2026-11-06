import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
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

const surumBilgisi = {
  version: pkg.version || '1.0.0',
  commit: gitBilgi(['rev-parse', '--short', 'HEAD'], 'bilinmiyor'),
  date: gitBilgi(['log', '-1', '--format=%cs'], 'bilinmiyor'),
  source: process.env.CI ? 'ci' : 'local',
};

const buildBilgisi = {
  __AOT_VERSION__: JSON.stringify(surumBilgisi.version),
  __AOT_COMMIT__: JSON.stringify(surumBilgisi.commit),
  __AOT_BUILD_DATE__: JSON.stringify(surumBilgisi.date),
  __AOT_BUILD_SOURCE__: JSON.stringify(surumBilgisi.source),
};

// Sürüm bildirimi: yayımdaki en son sürümü istemciye duyurur (js/update-check.ts).
// Web sürümü bunu kendi kaynağından okur; masaüstü sürümü GitHub Releases kullanır.
function surumBildirimi(): Plugin {
  const govde = `${JSON.stringify(surumBilgisi, null, 2)}\n`;
  return {
    name: 'aot-version-manifest',
    configureServer(server) {
      server.middlewares.use((istek, yanit, sonraki) => {
        const yol = (istek.url || '').split('?')[0];
        if (yol !== '/version.json') {
          sonraki();
          return;
        }
        yanit.setHeader('content-type', 'application/json; charset=utf-8');
        yanit.setHeader('cache-control', 'no-store');
        yanit.end(govde);
      });
    },
    closeBundle() {
      writeFileSync(resolve(root, 'dist', 'version.json'), govde);
    },
  };
}

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
  plugins: [copyStaticAssets(), surumBildirimi()],
});
