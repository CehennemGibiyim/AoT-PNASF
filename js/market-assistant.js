/* AoT-PNASF — Smart Market Assistant: transparent route analysis. */
(() => {
  'use strict';

  const SERVERS = {
    europe: 'https://europe.albion-online-data.com',
    west: 'https://west.albion-online-data.com',
    east: 'https://east.albion-online-data.com'
  };
  const LOCATIONS = 'Caerleon,Bridgewatch,Lymhurst,Martlock,Thetford,Fort Sterling,Brecilien,Arthurs Rest,Merlins Rest,Morganas Rest,Black Market';
  const LABELS = {
    Caerleon: 'Caerleon', Bridgewatch: 'Bridgewatch', Lymhurst: 'Lymhurst', Martlock: 'Martlock',
    Thetford: 'Thetford', 'Fort Sterling': 'Fort Sterling', Brecilien: 'Brecilien',
    'Arthurs Rest': "Arthur's Rest", 'Merlins Rest': "Merlyn's Rest", 'Morganas Rest': "Morgana's Rest",
    'Black Market': 'Black Market'
  };
  const RISK = { safe: 0, balanced: 0.05, high: 0.12 };
  const $ = (id) => document.getElementById(id);
  const t = (key, fallback) => {
    const translated = window.miniappI18n?.t(key);
    return translated && translated !== key ? translated : fallback;
  };
  let busy = false;
  let lastAnalysis = null;

  function format(value) {
    return Math.round(Number(value) || 0).toLocaleString('tr-TR');
  }

  function language() {
    return document.documentElement.lang?.startsWith('en') ? 'en' : 'tr';
  }

  function itemName(itemId, fallback) {
    if (typeof window.getItemName === 'function') return window.getItemName(itemId);
    const base = itemId.replace(/^T\d_/, '').replace(/@\d$/, '');
    const item = (window.AO_ITEMS || []).find((entry) => entry.id === base);
    if (item) return language() === 'en' ? item.en : item.tr;
    return fallback || itemId.replace(/_/g, ' ');
  }

  function resolveItem(query, tier) {
    const clean = String(query || '').trim();
    if (!clean) return null;
    if (/^T[2-8]_[A-Z0-9_]+(?:@\d)?$/i.test(clean)) {
      const itemId = clean.toUpperCase();
      return { itemId, name: itemName(itemId, itemId) };
    }
    const match = window.AO_SEARCH ? window.AO_SEARCH(clean)[0] : null;
    const base = match?.id || clean.toUpperCase().replace(/[^A-Z0-9]+/g, '_').replace(/^_|_$/g, '');
    if (!base) return null;
    const itemId = `T${String(tier || '4').replace(/^T/i, '')}_${base}`;
    return { itemId, name: match ? (language() === 'en' ? match.en : match.tr) : itemName(itemId, clean) };
  }

  function setStatus(message, kind = 'info') {
    const node = $('assistantStatus');
    if (!node) return;
    node.textContent = message;
    node.className = `assistant-status ${kind}`;
  }

  function cityLabel(city) {
    return LABELS[city] || city || t('marketAssistant-unknownCity', 'Bilinmeyen şehir');
  }

  function rowPrice(row, key) {
    return Number(row?.[key]) || 0;
  }

  function makeRoutes(rows, taxRate, quantity, transportPerTrip, riskRate, capacity, tripMinutes) {
    const sellRows = rows.filter((row) => row.city !== 'Black Market' && rowPrice(row, 'sell_price_min') > 0);
    const buyRows = rows.filter((row) => rowPrice(row, 'buy_price_max') > 0);
    const trips = Math.max(1, Math.ceil(quantity / Math.max(1, capacity)));
    const transport = Math.max(0, transportPerTrip) * trips;
    const totalMinutes = trips * Math.max(1, tripMinutes);
    const routes = [];
    sellRows.forEach((source) => buyRows.forEach((destination) => {
      if (source.city === destination.city) return;
      const buy = rowPrice(source, 'sell_price_min');
      const sell = rowPrice(destination, 'buy_price_max');
      const grossUnit = sell - buy;
      if (grossUnit <= 0) return;
      const saleAfterTax = sell * quantity * (1 - taxRate);
      const totalCost = buy * quantity + transport;
      const riskReserve = grossUnit * quantity * riskRate;
      const net = saleAfterTax - buy * quantity - transport - riskReserve;
      const roi = totalCost > 0 ? (net / totalCost) * 100 : 0;
      const hourly = totalMinutes > 0 ? (net / totalMinutes) * 60 : net;
      routes.push({
        from: source.city, to: destination.city, buy, sell, grossUnit, net, roi, hourly, trips, totalMinutes,
        updated: source.sell_price_min_date || destination.buy_price_max_date || ''
      });
    }));
    return routes.sort((a, b) => b.net - a.net).slice(0, 8);
  }

  function decisionFor(route) {
    if (!route) return { label: t('marketAssistant-noOpportunity', 'Uygun rota bulunamadı.'), tone: 'neutral', detail: t('marketAssistant-noOpportunityDetail', 'Pozitif net kâr için farklı bir eşya veya şehir çifti deneyin.') };
    if (route.net <= 0) return { label: t('marketAssistant-wait', 'Bekle'), tone: 'warning', detail: t('marketAssistant-waitDetail', 'Vergi, taşıma ve risk payı sonrası rota şu an pozitif görünmüyor.') };
    if (route.roi < 5) return { label: t('marketAssistant-caution', 'Dikkatli değerlendir'), tone: 'warning', detail: t('marketAssistant-cautionDetail', 'Marj dar; fiyat değişimi ve taşıma riskini kontrol edin.') };
    return { label: t('marketAssistant-buyNow', 'Şimdi değerlendir'), tone: 'positive', detail: t('marketAssistant-buyNowDetail', 'En iyi rota pozitif net kâr ve uygulanabilir bir marj gösteriyor.') };
  }

  function confidence(rows, routes) {
    if (!rows.length || !routes.length) return t('marketAssistant-confidenceLow', 'Düşük güven');
    if (rows.length >= 8 && routes.length >= 3) return t('marketAssistant-confidenceHigh', 'Yüksek güven');
    return t('marketAssistant-confidenceMedium', 'Orta güven');
  }

  function showResults(visible) {
    const result = $('assistantResults');
    if (result) result.hidden = !visible;
  }

  function renderRoutes(routes, quantity) {
    const list = $('assistantRoutes');
    if (!list) return;
    list.replaceChildren();
    routes.forEach((route) => {
      const item = document.createElement('article');
      item.className = 'assistant-route';
      const head = document.createElement('div');
      head.className = 'assistant-route-head';
      const title = document.createElement('strong');
      title.textContent = `${cityLabel(route.from)} → ${cityLabel(route.to)}`;
      const profit = document.createElement('b');
      profit.className = route.net >= 0 ? 'is-positive' : 'is-negative';
      profit.textContent = `${route.net >= 0 ? '+' : ''}${format(route.net)} ${t('marketAssistant-silver', 'gümüş')}`;
      head.append(title, profit);
      const meta = document.createElement('p');
      meta.textContent = `${t('marketAssistant-buyAt', 'Alış')} ${format(route.buy)} · ${t('marketAssistant-sellAt', 'Satış')} ${format(route.sell)} · ${t('marketAssistant-roi', 'ROI')} ${route.roi.toFixed(1)}% · ${t('marketAssistant-quantity', 'adet')} ${format(quantity)} · ${format(route.trips)} ${t('marketAssistant-trips', 'sefer')}`;
      const hourly = document.createElement('span');
      hourly.className = 'assistant-route-hourly';
      hourly.textContent = `${t('marketAssistant-hourly', 'Saatlik')} ${route.hourly >= 0 ? '+' : ''}${format(route.hourly)} ${t('marketAssistant-silver', 'gümüş')}`;
      item.append(head, meta, hourly);
      list.append(item);
    });
    if (!routes.length) {
      const empty = document.createElement('p');
      empty.className = 'assistant-route-empty';
      empty.textContent = t('marketAssistant-noRoutes', 'Karşılaştırılabilir pozitif rota bulunamadı.');
      list.append(empty);
    }
  }

  function renderAnalysis(analysis) {
    const best = analysis.routes[0];
    const decision = decisionFor(best);
    $('assistantItemLabel').textContent = `${analysis.item.name} · ${analysis.item.itemId}`;
    $('assistantBestBuy').textContent = best ? `${format(best.buy)} ${t('marketAssistant-silver', 'gümüş')}` : '—';
    $('assistantBestBuyCity').textContent = best ? cityLabel(best.from) : '—';
    $('assistantBestSell').textContent = best ? `${format(best.sell)} ${t('marketAssistant-silver', 'gümüş')}` : '—';
    $('assistantBestSellCity').textContent = best ? cityLabel(best.to) : '—';
    $('assistantNet').textContent = best ? `${best.net >= 0 ? '+' : ''}${format(best.net)} ${t('marketAssistant-silver', 'gümüş')}` : '—';
    $('assistantNet').className = `assistant-stat-value ${best?.net >= 0 ? 'is-positive' : 'is-negative'}`;
    $('assistantTrips').textContent = best ? `${format(best.trips)} ${t('marketAssistant-trips', 'sefer')}` : '—';
    $('assistantHourly').textContent = best ? `${best.hourly >= 0 ? '+' : ''}${format(best.hourly)} ${t('marketAssistant-silver', 'gümüş')}` : '—';
    $('assistantHourly').className = `assistant-stat-value ${best?.hourly >= 0 ? 'is-positive' : 'is-negative'}`;
    $('assistantDecision').textContent = decision.label;
    $('assistantDecision').className = `assistant-decision ${decision.tone}`;
    $('assistantDecisionDetail').textContent = decision.detail;
    $('assistantConfidence').textContent = confidence(analysis.rows, analysis.routes);
    $('assistantDataMeta').textContent = `${analysis.rows.length} ${t('marketAssistant-citiesCompared', 'şehir karşılaştırıldı')} · ${t('marketAssistant-risk', 'risk payı')} ${Math.round(analysis.riskRate * 100)}% · ${format(analysis.capacity)} ${t('marketAssistant-capacity', 'kapasite')}`;
    renderRoutes(analysis.routes, analysis.quantity);
    showResults(true);
  }

  async function analyze() {
    if (busy) return;
    const item = resolveItem($('assistantItem')?.value, $('assistantTier')?.value);
    if (!item) {
      setStatus(t('marketAssistant-invalidItem', 'Geçerli bir eşya adı veya ID girin.'), 'error');
      showResults(false);
      return;
    }
    const server = $('assistantServer')?.value || 'europe';
    const quantity = Math.max(1, Number($('assistantQuantity')?.value) || 1);
    const taxRate = Math.min(100, Math.max(0, Number($('assistantTax')?.value) || 0)) / 100;
    const transportPerTrip = Math.max(0, Number($('assistantTransport')?.value) || 0);
    const capacity = Math.max(1, Number($('assistantCapacity')?.value) || 1);
    const tripMinutes = Math.max(1, Number($('assistantTripMinutes')?.value) || 1);
    const riskKey = $('assistantRisk')?.value || 'balanced';
    const riskRate = RISK[riskKey] ?? RISK.balanced;
    const button = $('assistantAnalyze');
    busy = true;
    if (button) button.disabled = true;
    setStatus(t('marketAssistant-loading', 'Piyasa verileri karşılaştırılıyor...'), 'info');
    showResults(false);
    try {
      const api = SERVERS[server] || SERVERS.europe;
      const url = `${api}/api/v2/stats/prices/${encodeURIComponent(item.itemId)}.json?locations=${encodeURIComponent(LOCATIONS)}`;
      const response = await window.AOTMarketNetwork.request(url, { timeoutMs: 15000, cacheTtl: 30000, staleTtl: 180000 });
      const payload = await response.json();
      const rows = Array.isArray(payload) ? payload.filter((row) => row && row.city) : [];
      const routes = makeRoutes(rows, taxRate, quantity, transportPerTrip, riskRate, capacity, tripMinutes);
      lastAnalysis = { item, rows, routes, quantity, riskRate, capacity, tripMinutes };
      renderAnalysis(lastAnalysis);
      setStatus(routes.length ? t('marketAssistant-complete', 'Analiz tamamlandı.') : t('marketAssistant-noData', 'Bu eşya için karşılaştırılabilir fiyat verisi bulunamadı.'), routes.length ? 'success' : 'warning');
    } catch (error) {
      showResults(false);
      setStatus(t('marketAssistant-error', 'Piyasa verileri alınamadı. Lütfen tekrar deneyin.'), 'error');
    } finally {
      busy = false;
      if (button) button.disabled = false;
    }
  }

  function init() {
    if (!$('assistantAnalyze')) return;
    $('assistantAnalyze').addEventListener('click', analyze);
    $('assistantForm')?.addEventListener('submit', (event) => { event.preventDefault(); analyze(); });
    $('assistantItem')?.addEventListener('keydown', (event) => { if (event.key === 'Enter') { event.preventDefault(); analyze(); } });
    setStatus(t('marketAssistant-ready', 'Bir eşya seçin; şehirler arası alış, satış ve net kârı karşılaştıralım.'), 'info');
  }

  window.marketAssistant = { analyze };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
