/**
 * Electron özel protokolü (aot://) için dosya çözümleyici.
 *
 * Neden özel protokol? Uygulama `fetch('data/*.json')` ile veri okuyor;
 * file:// altında bu istekler CORS nedeniyle engellenir. Protocol handler
 * sayesinde sayfa `aot://app/index.html` kökünden servis edilir ve tüm
 * göreli istekler (assets, data, styles, locales) aynı kökene düşer.
 *
 * Bu modül Electron'a bağımlı değildir; test edilebilir olması için ayrı.
 */
const path = require('node:path');
const fs = require('node:fs');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
};

function mimeFor(filePath) {
  return MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
}

/**
 * aot://app/<yol> isteğini disk yoluna çevirir.
 * Kök dizin dışına çıkan (../) isteklerde null döner.
 */
function resolveRequestPath(root, requestUrl) {
  let pathname = '/';
  try {
    pathname = new URL(requestUrl).pathname || '/';
  } catch (_) {
    return null;
  }
  try {
    pathname = decodeURIComponent(pathname);
  } catch (_) {
    return null;
  }
  if (pathname === '/' || pathname === '') pathname = '/index.html';

  const filePath = path.normalize(path.join(root, pathname));
  const rootWithSep = root.endsWith(path.sep) ? root : root + path.sep;
  if (!filePath.startsWith(rootWithSep)) return null;
  return filePath;
}

/** İstenen dosya yoksa SPA köküne düş (uzantısız yollar için). */
function resolveAsset(root, requestUrl) {
  const direct = resolveRequestPath(root, requestUrl);
  if (!direct) return null; // kök dışına çıkan istek: SPA köküne düşürme
  if (fs.existsSync(direct) && fs.statSync(direct).isFile()) {
    return { filePath: direct, mime: mimeFor(direct) };
  }
  const url = new URL(requestUrl);
  if (path.extname(url.pathname)) return null;
  const index = path.join(root, 'index.html');
  if (!fs.existsSync(index)) return null;
  return { filePath: index, mime: MIME['.html'] };
}

module.exports = { resolveRequestPath, resolveAsset, mimeFor };
