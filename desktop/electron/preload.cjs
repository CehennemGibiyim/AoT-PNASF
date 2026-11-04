/**
 * Preload — sayfaya yalnızca masaüstü bilgisini açar; Node API'si verilmez.
 * index.html bu bayrağı görünce service worker kaydını atlar.
 */
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('aotDesktop', {
  isDesktop: true,
  shell: 'electron',
  versions: {
    electron: process.versions.electron,
    chrome: process.versions.chrome,
    node: process.versions.node,
  },
});

// Oturum dinleyicisi köprüsü. Tüm veri ana süreçte tutulur; sayfa yalnızca
// özet, olay listesi ve yerel alıcı token'ını görür (curl örneği için).
// Token yalnızca 127.0.0.1 alıcısında geçerlidir, dış ağa açılmaz.
contextBridge.exposeInMainWorld('aotSession', {
  durum: () => ipcRenderer.invoke('oturum:durum'),
  baslat: () => ipcRenderer.invoke('oturum:baslat'),
  bitir: () => ipcRenderer.invoke('oturum:bitir'),
  temizle: () => ipcRenderer.invoke('oturum:temizle'),
  bilgi: () => ipcRenderer.invoke('oturum:bilgi'),
  onUpdate: (cb) => {
    const dinleyici = (_olay, ozet) => cb(ozet);
    ipcRenderer.on('oturum:guncelle', dinleyici);
    return () => ipcRenderer.removeListener('oturum:guncelle', dinleyici);
  },
});
