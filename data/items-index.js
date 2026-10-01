/* Lightweight item index shared by crafting, market and AI Build. */
(function () {
  'use strict';

  const indexState = {
    byId: new Map(),
    byCategory: new Map(),
    ready: false,
    sourceCount: 0
  };

  function text(value) {
    return String(value || '').trim().toLocaleLowerCase();
  }

  function build(items) {
    if (!Array.isArray(items)) throw new Error('Item index source must be an array');
    indexState.byId.clear();
    indexState.byCategory.clear();
    items.forEach((item) => {
      if (!item || !item.id) return;
      const normalized = {
        ...item,
        id: String(item.id),
        cat: String(item.cat || 'misc'),
        tiers: Array.isArray(item.tiers) ? item.tiers.map(Number).filter(Number.isFinite) : [],
        _search: [item.id, item.en, item.tr, item.ru, item.de, item.fr, item.pl, item.pt, item.es, item.kr]
          .map(text).filter(Boolean).join(' ')
      };
      indexState.byId.set(normalized.id, normalized);
      if (!indexState.byCategory.has(normalized.cat)) indexState.byCategory.set(normalized.cat, []);
      indexState.byCategory.get(normalized.cat).push(normalized);
    });
    indexState.sourceCount = indexState.byId.size;
    indexState.ready = true;
    return api.stats();
  }

  function ensure() {
    if (!indexState.ready && Array.isArray(window.AO_ITEMS)) build(window.AO_ITEMS);
    return indexState.ready;
  }

  function get(id) {
    ensure();
    return indexState.byId.get(String(id || '')) || null;
  }

  function category(name) {
    ensure();
    return (indexState.byCategory.get(String(name || '')) || []).slice();
  }

  function search(query, options) {
    ensure();
    const opts = options || {};
    const needle = text(query);
    const source = opts.cat ? category(opts.cat) : Array.from(indexState.byId.values());
    if (!needle) return source.slice(0, Number(opts.limit) || 20);
    const tier = opts.tier ? Number(opts.tier) : 0;
    return source.filter((item) => {
      if (tier && !item.tiers.includes(tier)) return false;
      return item._search.includes(needle);
    }).slice(0, Number(opts.limit) || 20);
  }

  function stats() {
    ensure();
    const categories = {};
    indexState.byCategory.forEach((items, name) => { categories[name] = items.length; });
    return { count: indexState.sourceCount, categories };
  }

  const api = { build, ensure, get, category, search, stats };
  window.AO_ITEM_INDEX = api;
  window.AO_SEARCH = function (query, options) { return api.search(query, options); };
})();
