/* Category-aware item loader with parallel chunk requests and a safe fallback. */
(function () {
  'use strict';
  const root = document.currentScript?.src ? new URL('.', document.currentScript.src).href : 'data/';
  const loadedFiles = new Set();

  function loadScript(path) {
    if (loadedFiles.has(path)) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = new URL(path, root).href;
      script.async = true;
      script.onload = () => {
        loadedFiles.add(path);
        resolve();
      };
      script.onerror = () => reject(new Error(`Item data yüklenemedi: ${path}`));
      document.head.appendChild(script);
    });
  }

  async function load() {
    if (Array.isArray(window.AO_ITEMS)) return window.AO_ITEMS;
    if (!window.AO_ITEMS_MANIFEST) await loadScript('items-manifest.js');
    const manifest = window.AO_ITEMS_MANIFEST || {};
    const files = Array.isArray(manifest.files) ? manifest.files : [];

    if (files.length) {
      window.AO_ITEM_CHUNKS = window.AO_ITEM_CHUNKS || {};
      await Promise.all(files.map(loadScript));
      const combined = files.flatMap((file) => {
        const key = file.replace(/^items-/, '').replace(/\.js$/, '');
        return Array.isArray(window.AO_ITEM_CHUNKS[key]) ? window.AO_ITEM_CHUNKS[key] : [];
      });
      if (combined.length) {
        window.AO_ITEMS = combined;
        return combined;
      }
    }

    await loadScript(manifest.fallback || 'items-data.js');
    if (!Array.isArray(window.AO_ITEMS)) throw new Error('Eşya verisi alınamadı');
    return window.AO_ITEMS;
  }

  window.AO_ITEM_LOADER = { load };
})();
