/* AoT-PNASF — Hızlı Eşya Arama (Ana Sayfa)
 *
 * Ana sayfadaki arama kutusuna yazılan eşya adı/ID'si için eşya verisinde
 * arama yapar, en yüksek tier'ını seçer ve tüm şehirlerdeki güncel min.
 * satış fiyatlarını canlı olarak karşılaştırır. En ucuz şehri vurgular.
 */
(() => {
  'use strict';

  const CITIES = ['Caerleon', 'Bridgewatch', 'Lymhurst', 'Martlock', 'Thetford', 'Fort Sterling'];
  const CITY_LABELS: Record<string, string> = {
    Caerleon: 'Caerleon', Bridgewatch: 'Bridgewatch', Lymhurst: 'Lymhurst',
    Martlock: 'Martlock', Thetford: 'Thetford', 'Fort Sterling': 'Fort Sterling'
  };

  function t(key: string, fallback?: string) {
    return (window as any).t ? (window as any).t(key, fallback) : (fallback || key);
  }

  function esc(value: any) {
    return String(value ?? '').replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c] as string));
  }

  function getApiDomain() {
    if (typeof (window as any).getAlbionApiDomain === 'function') {
      try { return (window as any).getAlbionApiDomain(); } catch (_) { /* düşer */ }
    }
    return 'europe.albion-online-data.com';
  }

  function itemName(item: any) {
    const lang = localStorage.getItem('aot-lang') || 'tr';
    return item[lang] || item.en || item.tr || item.id;
  }

  function priceId(item: any) {
    const tier = Math.max(...(Array.isArray(item.tiers) && item.tiers.length ? item.tiers : [8]));
    return `T${tier}_${item.id}`;
  }

  async function ensureItems() {
    if (Array.isArray((window as any).AO_ITEMS)) return true;
    try {
      if (typeof (window as any).ensureItemsData === 'function') {
        await (window as any).ensureItemsData();
        return Array.isArray((window as any).AO_ITEMS);
      }
      if ((window as any).AO_ITEM_LOADER?.load) {
        await (window as any).AO_ITEM_LOADER.load();
        return Array.isArray((window as any).AO_ITEMS);
      }
    } catch (_) { /* veri yoksa arama çalışmaz */ }
    return false;
  }

  async function fetchPrices(id: string) {
    const url = `https://${getApiDomain()}/api/v2/stats/prices/${encodeURIComponent(id)}.json?locations=${encodeURIComponent(CITIES.join(','))}`;
    const fetcher = (window as any).fetchWithProxies || ((u: string) => fetch(u).then((r) => r.json()));
    const data = await fetcher(url);
    if (!Array.isArray(data)) return [];
    return data.filter((row: any) => row && row.sell_price_min > 0);
  }

  function renderResults(container: HTMLElement, items: any[], pricesById: Record<string, any[]>) {
    if (!items.length) {
      container.innerHTML = `<div class="text-xs text-gray-400">${esc(t('home-searchNoResult', 'Sonuç bulunamadı.'))}</div>`;
      return;
    }
    container.innerHTML = items.map((item) => {
      const rows = pricesById[item.id] || [];
      if (!rows.length) {
        return `<div class="flex items-center justify-between bg-albion-900 border border-albion-700 rounded-lg px-3 py-2">
          <span class="text-sm text-white font-bold">${esc(itemName(item))}</span>
          <span class="text-xs text-gray-500">${esc(t('marketWatch-noPrice', 'fiyat yok'))}</span>
        </div>`;
      }
      const sorted = rows.slice().sort((a: any, b: any) => a.sell_price_min - b.sell_price_min);
      const cheapest = sorted[0];
      const cells = sorted.map((row: any, i: number) => `
        <span class="text-[11px] px-1.5 py-0.5 rounded ${i === 0 ? 'bg-green-900/40 text-green-300 border border-green-500/40 font-bold' : 'text-gray-400'}">
          ${esc(CITY_LABELS[row.city] || row.city)}: ${Number(row.sell_price_min).toLocaleString()}
        </span>`).join('');
      return `<div class="bg-albion-900 border border-albion-700 rounded-lg px-3 py-2">
        <div class="flex items-center justify-between mb-1">
          <span class="text-sm text-white font-bold">${esc(itemName(item))}</span>
          <span class="text-[10px] text-gray-500">${esc(item.id)}</span>
        </div>
        <div class="flex flex-wrap gap-1.5 items-center">
          ${cells}
          <span class="text-[10px] text-albion-accent font-bold ml-auto">★ ${esc(cheapest.city)}</span>
        </div>
      </div>`;
    }).join('');
  }

  async function runSearch() {
    const input = document.getElementById('quickSearchInput') as HTMLInputElement | null;
    const container = document.getElementById('quickSearchResults');
    if (!input || !container) return;
    const query = input.value.trim();
    if (!query) return;

    container.innerHTML = `<div class="text-xs text-gray-400 animate-pulse">${esc(t('loading', 'Yükleniyor...'))}</div>`;

    const ready = await ensureItems();
    if (!ready || typeof (window as any).AO_SEARCH !== 'function') {
      container.innerHTML = `<div class="text-xs text-gray-400">${esc(t('home-searchNoResult', 'Sonuç bulunamadı.'))}</div>`;
      return;
    }

    const results = (window as any).AO_SEARCH(query, { limit: 6 });
    if (!results.length) {
      renderResults(container, [], {});
      return;
    }

    const pricesById: Record<string, any[]> = {};
    await Promise.all(results.map(async (item: any) => {
      try { pricesById[item.id] = await fetchPrices(priceId(item)); }
      catch (_) { pricesById[item.id] = []; }
    }));
    renderResults(container, results, pricesById);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('quickSearchInput');
    const btn = document.getElementById('quickSearchBtn');
    if (input) input.addEventListener('keydown', (e) => { if ((e as KeyboardEvent).key === 'Enter') void runSearch(); });
    if (btn) btn.addEventListener('click', () => void runSearch());
  });
})();

export {};
