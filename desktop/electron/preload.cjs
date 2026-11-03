/**
 * Preload — sayfaya yalnızca masaüstü bilgisini açar; Node API'si verilmez.
 * index.html bu bayrağı görünce service worker kaydını atlar.
 */
const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('aotDesktop', {
  isDesktop: true,
  shell: 'electron',
  versions: {
    electron: process.versions.electron,
    chrome: process.versions.chrome,
    node: process.versions.node,
  },
});
