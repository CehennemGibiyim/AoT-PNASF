/* Shared market transport: short-lived cache, request deduplication, timeout and fallback proxies. */
(() => {
  const CACHE_TTL = 45 * 1000;
  const STALE_TTL = 5 * 60 * 1000;
  const DEFAULT_TIMEOUT = 12 * 1000;
  const MAX_CACHE_ENTRIES = 80;
  const cache = new Map();
  const pending = new Map();

  const proxyUrls = (url) => [
    url,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
    `https://corsproxy.io/?url=${encodeURIComponent(url)}`
  ];

  function responseLike(data, fromCache = false) {
    return {
      ok: true,
      status: 200,
      fromCache,
      json: async () => data
    };
  }

  async function fetchJsonTarget(url, timeoutMs) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } finally {
      clearTimeout(timer);
    }
  }

  async function request(url, options = {}) {
    const timeoutMs = options.timeoutMs || DEFAULT_TIMEOUT;
    const cacheTtl = options.cacheTtl ?? CACHE_TTL;
    const staleTtl = options.staleTtl ?? STALE_TTL;
    const forceRefresh = Boolean(options.forceRefresh);
    const now = Date.now();
    const cached = cache.get(url);

    if (!forceRefresh && cached && cached.expiresAt > now) {
      return responseLike(cached.data, true);
    }

    if (!forceRefresh && pending.has(url)) return pending.get(url);

    const operation = (async () => {
      let lastError = null;
      for (const target of proxyUrls(url)) {
        try {
          const data = await fetchJsonTarget(target, timeoutMs);
          cache.delete(url);
          cache.set(url, {
            data,
            expiresAt: Date.now() + cacheTtl,
            staleUntil: Date.now() + staleTtl
          });
          while (cache.size > MAX_CACHE_ENTRIES) cache.delete(cache.keys().next().value);
          return responseLike(data, false);
        } catch (error) {
          lastError = error;
        }
      }

      if (cached && cached.staleUntil > Date.now()) {
        return responseLike(cached.data, true);
      }
      throw lastError || new Error('Market verisi alınamadı');
    })();

    pending.set(url, operation);
    try {
      return await operation;
    } finally {
      pending.delete(url);
    }
  }

  function clear(url) {
    if (url) cache.delete(url);
    else cache.clear();
  }

  window.AOTMarketNetwork = { request, clear };
  window.fetchWithProxies = async (targetUrl, options = {}) => {
    const response = await request(targetUrl, options);
    return response.json();
  };
})();
