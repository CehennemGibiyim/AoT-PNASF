/**
 * AoT PNASF — Electron ana süreç.
 *
 * Uygulamanın web sürümü `dist/` klasörüne derlenir (npm run build) ve burada
 * `aot://app/` özel protokolü üzerinden servis edilir. Böylece fetch/XHR,
 * göreli yollar ve CSP web sürümüyle aynı davranır.
 */
const { app, BrowserWindow, Menu, protocol, net, shell } = require('electron');
const path = require('node:path');
const fs = require('node:fs');
const { pathToFileURL } = require('node:url');
const { resolveAsset } = require('./serve.cjs');

const SCHEME = 'aot';
const ROOT = path.join(__dirname, 'app');
const START_URL = `${SCHEME}://app/index.html`;
const IS_DEV = !app.isPackaged && process.env.AOT_DEV === '1';

protocol.registerSchemesAsPrivileged([
  {
    scheme: SCHEME,
    privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true, stream: true },
  },
]);

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    show: false,
    backgroundColor: '#0a0a0a',
    title: 'AoT PNASF',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      spellcheck: false,
    },
  });

  win.once('ready-to-show', () => win.show());

  // Dış bağlantılar (Albion wiki, th.gl, GitHub) sistem tarayıcısında açılsın.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/i.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });

  win.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith(`${SCHEME}://app/`)) {
      event.preventDefault();
      if (/^https?:/i.test(url)) shell.openExternal(url);
    }
  });

  win.loadURL(START_URL);

  if (IS_DEV) win.webContents.openDevTools({ mode: 'detach' });
  return win;
}

function registerProtocol() {
  protocol.handle(SCHEME, async (request) => {
    const asset = resolveAsset(ROOT, request.url);
    if (!asset) {
      return new Response('Bulunamadı', { status: 404, headers: { 'content-type': 'text/plain; charset=utf-8' } });
    }
    const res = await net.fetch(pathToFileURL(asset.filePath).toString());
    return new Response(res.body, {
      status: res.status,
      headers: { 'content-type': asset.mime, 'cache-control': 'no-cache' },
    });
  });
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', () => {
    const win = BrowserWindow.getAllWindows()[0];
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });

  app.whenReady().then(() => {
    if (!fs.existsSync(path.join(ROOT, 'index.html'))) {
      const { dialog } = require('electron');
      dialog.showErrorBox(
        'Uygulama dosyaları eksik',
        'app/ klasörü bulunamadı. Kurulumdan önce "npm run prepare:app" (depo kökünde "npm run build") çalıştırın.'
      );
      app.quit();
      return;
    }

    registerProtocol();
    Menu.setApplicationMenu(
      Menu.buildFromTemplate([
        {
          label: 'Görünüm',
          submenu: [
            { role: 'reload', label: 'Yenile' },
            { role: 'forceReload', label: 'Önbelleği atlayarak yenile' },
            { type: 'separator' },
            { role: 'resetZoom', label: 'Yakınlaştırmayı sıfırla' },
            { role: 'zoomIn', label: 'Yakınlaştır' },
            { role: 'zoomOut', label: 'Uzaklaştır' },
            { type: 'separator' },
            { role: 'togglefullscreen', label: 'Tam ekran' },
            { role: 'toggleDevTools', label: 'Geliştirici araçları' },
          ],
        },
        { label: 'Yardım', submenu: [{ label: 'AoT PNASF (GitHub)', click: () => shell.openExternal('https://github.com/CehennemGibiyim/AoT-PNASF') }] },
      ])
    );

    createWindow();
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });
}
