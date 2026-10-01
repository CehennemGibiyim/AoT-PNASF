/* AoT-PNASF — Market Watchlist, Auto Refresh & Price History */
(() => {
  'use strict';

  const STORAGE_KEY = 'market-watchlist-v1';
  const SETTINGS_KEY = 'market-watchlist-settings-v1';
  const MAX_RECORDS = 20;
  const MAX_HISTORY = 30;
  const DEFAULT_INTERVAL = 15;
  const SERVERS = {
    europe: 'https://europe.albion-online-data.com',
    west: 'https://west.albion-online-data.com',
    east: 'https://east.albion-online-data.com'
  };
  const CITY_LABELS = {
    Caerleon: 'Caerleon', Lymhurst: 'Lymhurst', Bridgewatch: 'Bridgewatch',
    Martlock: 'Martlock', Thetford: 'Thetford', 'Fort Sterling': 'Fort Sterling',
    Brecilien: 'Brecilien', 'Arthurs Rest': "Arthur's Rest",
    'Merlins Rest': "Merlyn's Rest", 'Morganas Rest': "Morgana's Rest",
    'Black Market': 'Black Market'
  };
  const INTERVALS = [0, 5, 15, 30];
  const ALARM_TYPES = ['none', 'price-below', 'price-above', 'drop-percent', 'rise-percent', 'stale'];
  let records = [];
  let settings = { intervalMinutes: DEFAULT_INTERVAL, notifications: false };
  let storageReady = false;
  let busy = false;
  let refreshTimer = null;
  const view = { query: '', sort: 'recent' };

  const $ = (id) => document.getElementById(id);
  const t = (key, fallback) => {
    const translated = window.miniappI18n?.t(key);
    return translated && translated !== key ? translated : fallback;
  };
  const language = () => document.documentElement.lang?.startsWith('en') ? 'en' : 'tr';
  const now = () => new Date().toISOString();

  function normalizeRecord(item) {
    if (!item || !item.itemId || !item.city || !item.server) return null;
    const history = Array.isArray(item.history) ? item.history
      .filter((point) => point && Number(point.price) > 0 && point.at)
      .slice(-MAX_HISTORY)
      .map((point) => ({ at: point.at, price: Number(point.price) })) : [];
    const legacyType = item.target ? (item.mode === 'above' ? 'price-above' : 'price-below') : 'none';
    const alarmType = ALARM_TYPES.includes(item.alarmType) ? item.alarmType : legacyType;
    return {
      ...item,
      target: Number(item.target) || 0,
      alarmType,
      lastPrice: Number(item.lastPrice) || 0,
      triggered: Boolean(item.triggered),
      error: item.error || '',
      history
    };
  }

  async function readRecords() {
    try {
      if (!window.miniappsAI?.storage) throw new Error('storage-unavailable');
      const raw = await window.miniappsAI.storage.getItem(STORAGE_KEY);
      const firstRun = raw == null;
      const parsed = raw ? JSON.parse(raw) : [];
      records = Array.isArray(parsed) ? parsed.map(normalizeRecord).filter(Boolean) : [];
      if (firstRun) {
        records = [{ id: 'starter-bag', itemId: 'T4_BAG', name: 'T4_BAG', server: 'europe', city: 'Caerleon', target: 1000, mode: 'below', alarmType: 'price-below', lastPrice: 0, triggered: false, history: [] }];
      }
      storageReady = true;
      if (firstRun) await saveRecords();
    } catch (error) {
      records = [];
      storageReady = false;
      showStatus(t('marketWatch-storageError', 'Takip listesi şu an yüklenemedi.'), 'error');
    }
    render();
  }

  async function readSettings() {
    try {
      if (!window.miniappsAI?.storage) throw new Error('storage-unavailable');
      const raw = await window.miniappsAI.storage.getItem(SETTINGS_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      const intervalMinutes = Number(parsed?.intervalMinutes);
      settings.intervalMinutes = INTERVALS.includes(intervalMinutes) ? intervalMinutes : DEFAULT_INTERVAL;
      settings.notifications = Boolean(parsed?.notifications);
    } catch (error) {
      settings.intervalMinutes = DEFAULT_INTERVAL;
    }
    const select = $('watchRefreshInterval');
    if (select) select.value = String(settings.intervalMinutes);
    const notify = $('watchNotifications');
    if (notify) notify.checked = settings.notifications;
    updateRefreshMeta();
  }

  async function saveRecords() {
    if (!storageReady || !window.miniappsAI?.storage) {
      showStatus(t('marketWatch-storageError', 'Takip listesi şu an kaydedilemedi.'), 'error');
      return false;
    }
    try {
      await window.miniappsAI.storage.setItem(STORAGE_KEY, JSON.stringify(records));
      return true;
    } catch (error) {
      showStatus(t('marketWatch-storageError', 'Takip listesi şu an kaydedilemedi.'), 'error');
      return false;
    }
  }

  async function saveSettings() {
    if (!storageReady || !window.miniappsAI?.storage) return false;
    try {
      await window.miniappsAI.storage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      return true;
    } catch (error) {
      showStatus(t('marketWatch-settingsError', 'Yenileme tercihi kaydedilemedi.'), 'error');
      return false;
    }
  }

  function showStatus(message, kind = 'info') {
    const node = $('watchlistStatus');
    if (!node) return;
    node.textContent = message;
    node.className = `watch-status ${kind}`;
    if (message) window.setTimeout(() => { if (node.textContent === message) node.textContent = ''; }, 5000);
  }

  function updateRefreshMeta() {
    const node = $('watchlistRefreshMeta');
    if (!node) return;
    node.textContent = settings.intervalMinutes
      ? `${t('marketWatch-autoRefresh', 'Otomatik yenileme')}: ${settings.intervalMinutes} ${t('marketWatch-minutes', 'dk')}`
      : t('marketWatch-autoRefreshOff', 'Otomatik yenileme kapalı');
  }

  function scheduleRefresh() {
    if (refreshTimer) window.clearInterval(refreshTimer);
    refreshTimer = null;
    updateRefreshMeta();
    if (!settings.intervalMinutes) return;
    refreshTimer = window.setInterval(() => refreshAll('auto'), settings.intervalMinutes * 60 * 1000);
  }

  async function changeRefreshInterval(event) {
    const value = Number(event.currentTarget.value);
    settings.intervalMinutes = INTERVALS.includes(value) ? value : DEFAULT_INTERVAL;
    scheduleRefresh();
    await saveSettings();
    showStatus(settings.intervalMinutes
      ? `${t('marketWatch-autoRefreshSaved', 'Otomatik yenileme ayarlandı')}: ${settings.intervalMinutes} ${t('marketWatch-minutes', 'dk')}`
      : t('marketWatch-autoRefreshDisabled', 'Otomatik yenileme kapatıldı.'), 'success');
  }

  async function changeNotifications(event) {
    if (!event.currentTarget.checked) {
      settings.notifications = false;
      await saveSettings();
      return;
    }
    try {
      if (!('Notification' in window)) throw new Error('unsupported');
      const permission = Notification.permission === 'default' ? await Notification.requestPermission() : Notification.permission;
      if (permission !== 'granted') throw new Error('denied');
      settings.notifications = true;
      await saveSettings();
      showStatus(t('marketWatch-notificationsOn', 'Alarm bildirimleri açıldı.'), 'success');
    } catch (error) {
      settings.notifications = false;
      event.currentTarget.checked = false;
      showStatus(t('marketWatch-notificationsError', 'Bildirim izni alınamadı.'), 'error');
    }
  }

  function notifyTriggered(recordsToNotify) {
    if (!settings.notifications || !recordsToNotify.length || !('Notification' in window) || Notification.permission !== 'granted') return;
    recordsToNotify.forEach((record) => {
      try {
        new Notification(t('marketWatch-notificationTitle', 'Albion fiyat alarmı'), {
          body: `${itemName(record.itemId, record.name)} · ${formatPrice(record.lastPrice)}`
        });
      } catch (error) {
        showStatus(t('marketWatch-notificationsError', 'Bildirim izni alınamadı.'), 'error');
      }
    });
  }

  function itemName(itemId, fallback) {
    const baseId = itemId.replace(/^T\d_/, '').replace(/@\d$/, '');
    const item = (window.AO_ITEMS || []).find((entry) => entry.id === baseId);
    if (item) return language() === 'en' ? item.en : item.tr;
    return fallback || itemId.replace(/_/g, ' ');
  }

  function resolveItem(query, tier) {
    const clean = String(query || '').trim();
    if (!clean) return null;
    if (/^T[2-8]_[A-Z0-9_]+(?:@\d)?$/i.test(clean)) {
      return { itemId: clean.toUpperCase(), name: itemName(clean.toUpperCase(), clean) };
    }
    const results = window.AO_SEARCH ? window.AO_SEARCH(clean) : [];
    const match = results[0];
    const base = match?.id || clean.toUpperCase().replace(/[^A-Z0-9]+/g, '_').replace(/^_|_$/g, '');
    if (!base) return null;
    const normalizedTier = String(tier || 'T4').replace(/^T/i, '');
    const itemId = `T${normalizedTier}_${base}`;
    return { itemId, name: match ? (language() === 'en' ? match.en : match.tr) : itemName(itemId, clean) };
  }

  function formatPrice(value) {
    return value > 0 ? `${Math.round(value).toLocaleString('tr-TR')} ${t('marketWatch-silver', 'gümüş')}` : '—';
  }

  function alarmType() {
    const selected = $('watchAlarmType')?.value;
    return ALARM_TYPES.includes(selected) ? selected : 'price-below';
  }

  function updateAlarmForm() {
    const type = alarmType();
    const label = $('watchTargetLabel');
    const input = $('watchTarget');
    const targetRequired = type !== 'none' && type !== 'stale';
    const labels = {
      none: [t('marketWatch-targetOptional', 'Hedef (opsiyonel)'), '—'],
      'price-below': [t('marketWatch-targetPrice', 'Hedef fiyat'), '1000'],
      'price-above': [t('marketWatch-targetPrice', 'Hedef fiyat'), '1000'],
      'drop-percent': [t('marketWatch-percentThreshold', 'Düşüş eşiği (%)'), '10'],
      'rise-percent': [t('marketWatch-percentThreshold', 'Yükseliş eşiği (%)'), '10'],
      stale: [t('marketWatch-staleAlarm', 'Veri eskiyse alarm'), '—']
    };
    const [labelText, placeholder] = labels[type] || labels['price-below'];
    if (label) label.textContent = labelText;
    if (input) {
      input.placeholder = placeholder;
      input.required = targetRequired;
      input.disabled = !targetRequired;
      input.min = type.includes('percent') ? '0.1' : '1';
      input.step = type.includes('percent') ? '0.1' : '1';
    }
  }

  function isStale(record) {
    if (record.error) return true;
    if (!record.lastChecked) return false;
    const maxAgeMinutes = Math.max(30, (settings.intervalMinutes || 15) * 2);
    return (Date.now() - new Date(record.lastChecked).getTime()) > maxAgeMinutes * 60 * 1000;
  }

  function evaluateAlarm(record) {
    const type = record.alarmType || (record.target ? (record.mode === 'above' ? 'price-above' : 'price-below') : 'none');
    if (type === 'none') return false;
    if (type === 'stale') return Boolean(record.lastChecked && isStale(record));
    if (!(record.target > 0 && record.lastPrice > 0)) return false;
    if (type === 'price-below') return record.lastPrice <= record.target;
    if (type === 'price-above') return record.lastPrice >= record.target;
    const history = Array.isArray(record.history) ? record.history : [];
    if (history.length < 2) return false;
    const previous = Number(history[history.length - 2]?.price) || 0;
    if (!previous) return false;
    const change = ((record.lastPrice - previous) / previous) * 100;
    return type === 'drop-percent' ? change <= -record.target : change >= record.target;
  }

  function alarmRule(record) {
    const type = record.alarmType || 'none';
    if (type === 'price-below') return `≤ ${formatPrice(record.target)}`;
    if (type === 'price-above') return `≥ ${formatPrice(record.target)}`;
    if (type === 'drop-percent') return `${t('marketWatch-drop', 'Düşüş')} ≥ ${record.target}%`;
    if (type === 'rise-percent') return `${t('marketWatch-rise', 'Yükseliş')} ≥ ${record.target}%`;
    if (type === 'stale') return t('marketWatch-staleRule', 'Veri eskiyse');
    return t('marketWatch-noTarget', 'Sadece izle');
  }

  function priceFrom(data, city) {
    const row = data.find((entry) => entry.city === city || entry.city?.replaceAll(' ', '') === city.replaceAll(' ', ''));
    if (!row) return { price: 0, date: '' };
    const price = city === 'Black Market' ? row.buy_price_max : row.sell_price_min;
    return { price: Number(price) || 0, date: row.sell_price_min_date || row.buy_price_max_date || '' };
  }

  async function fetchPrice(record) {
    const api = SERVERS[record.server] || SERVERS.europe;
    const url = `${api}/api/v2/stats/prices/${encodeURIComponent(record.itemId)}.json?locations=${encodeURIComponent(record.city)}`;
    const response = await window.AOTMarketNetwork.request(url, { timeoutMs: 12000, cacheTtl: 30000, staleTtl: 180000 });
    const data = await response.json();
    return priceFrom(Array.isArray(data) ? data : [], record.city);
  }

  async function refreshOne(record) {
    try {
      const result = await fetchPrice(record);
      if (result.price > 0) {
        record.lastPrice = result.price;
        record.lastChecked = now();
        record.lastDate = result.date;
        record.history = [...(record.history || []), { at: record.lastChecked, price: record.lastPrice }].slice(-MAX_HISTORY);
        record.triggered = evaluateAlarm(record);
        record.error = '';
      } else {
        record.error = t('marketWatch-noPrice', 'Bu konumda fiyat bulunamadı');
        record.triggered = evaluateAlarm(record);
      }
    } catch (error) {
      record.error = t('marketWatch-itemError', 'Veri alınamadı');
      record.triggered = evaluateAlarm(record);
    }
  }

  async function refreshAll(source = 'manual') {
    if (busy || !records.length) return;
    busy = true;
    const button = $('watchlistRefresh');
    if (button) button.disabled = true;
    showStatus(source === 'auto' ? t('marketWatch-autoRefreshing', 'Otomatik yenileme yapılıyor...') : t('marketWatch-refreshing', 'Fiyatlar yenileniyor...'), 'info');
    try {
      const previousTriggered = new Map(records.map((record) => [record.id, record.triggered]));
      await Promise.all(records.map(refreshOne));
      await saveRecords();
      render();
      if (source !== 'initial') notifyTriggered(records.filter((record) => record.triggered && !previousTriggered.get(record.id)));
      const triggered = records.filter((item) => item.triggered).length;
      showStatus(triggered ? `${triggered} ${t('marketWatch-alertReady', 'alarm hazır')}` : t('marketWatch-updated', 'Takip listesi güncellendi.'), triggered ? 'success' : 'info');
    } catch (error) {
      showStatus(t('marketWatch-refreshError', 'Fiyatlar yenilenemedi.'), 'error');
    } finally {
      busy = false;
      if (button) button.disabled = false;
    }
  }

  function createText(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    node.textContent = text;
    return node;
  }

  function createSparkline(history, itemNameText) {
    const wrapper = document.createElement('div');
    wrapper.className = 'watch-history';
    const label = createText('span', 'watch-history-label', t('marketWatch-history', 'Fiyat geçmişi'));
    wrapper.append(label);
    const points = (history || []).filter((point) => Number(point.price) > 0);
    if (points.length < 2) {
      wrapper.append(createText('span', 'watch-history-empty', t('marketWatch-historyWaiting', 'İlk yenilemeden sonra grafik oluşur')));
      return wrapper;
    }
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 180 46');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', `${itemNameText} ${t('marketWatch-history', 'fiyat geçmişi')}`);
    const min = Math.min(...points.map((point) => point.price));
    const max = Math.max(...points.map((point) => point.price));
    const range = max - min || 1;
    const coords = points.map((point, index) => `${(index / (points.length - 1)) * 176 + 2},${40 - ((point.price - min) / range) * 32}`);
    const area = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    area.setAttribute('points', `2,42 ${coords.join(' ')} 178,42`);
    area.setAttribute('class', 'watch-history-area');
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    line.setAttribute('points', coords.join(' '));
    line.setAttribute('class', 'watch-history-line');
    svg.append(area, line);
    wrapper.append(svg);
    return wrapper;
  }

  function historyChange(history) {
    if (!history || history.length < 2) return '';
    const previous = Number(history[history.length - 2].price);
    const current = Number(history[history.length - 1].price);
    if (!previous) return '';
    const percent = ((current - previous) / previous) * 100;
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(1)}%`;
  }

  function trendStats(history) {
    const points = (history || []).filter((point) => Number(point.price) > 0).map((point) => Number(point.price));
    if (!points.length) return { direction: 'flat', change: 0, average: 0, min: 0, max: 0, volatility: 0, projected: 0, confidence: 'low', samples: 0 };
    const average = points.reduce((sum, price) => sum + price, 0) / points.length;
    const min = Math.min(...points);
    const max = Math.max(...points);
    const first = points[0];
    const last = points[points.length - 1];
    const change = first ? ((last - first) / first) * 100 : 0;
    const variance = points.reduce((sum, price) => sum + ((price - average) ** 2), 0) / points.length;
    const volatility = average ? (Math.sqrt(variance) / average) * 100 : 0;
    const meanX = (points.length - 1) / 2;
    const covariance = points.reduce((sum, price, index) => sum + ((index - meanX) * (price - average)), 0);
    const spread = points.reduce((sum, _price, index) => sum + ((index - meanX) ** 2), 0);
    const slope = spread ? covariance / spread : 0;
    const projected = Math.max(0, last + slope);
    const direction = Math.abs(change) < 1 && Math.abs(slope / Math.max(average, 1) * 100) < 0.25 ? 'flat' : (slope >= 0 ? 'up' : 'down');
    const confidence = points.length >= 8 && volatility < 18 ? 'high' : points.length >= 4 ? 'medium' : 'low';
    return { direction, change, average, min, max, volatility, projected, confidence, samples: points.length };
  }

  function trendLabel(direction) {
    if (direction === 'up') return t('marketWatch-trendUp', 'Yükselen trend');
    if (direction === 'down') return t('marketWatch-trendDown', 'Düşen trend');
    return t('marketWatch-trendFlat', 'Yatay trend');
  }

  function createTrendPanel(stats) {
    const panel = document.createElement('div');
    panel.className = `watch-trend-panel is-${stats.direction}`;
    const head = document.createElement('div');
    head.className = 'watch-trend-head';
    head.append(createText('span', 'watch-trend-title', t('marketWatch-trendAnalysis', 'Trend analizi')));
    head.append(createText('strong', 'watch-trend-direction', trendLabel(stats.direction)));
    const grid = document.createElement('div');
    grid.className = 'watch-trend-grid';
    const cells = [
      [t('marketWatch-average', 'Ortalama'), formatPrice(stats.average)],
      [t('marketWatch-range', 'Aralık'), `${formatPrice(stats.min)} – ${formatPrice(stats.max)}`],
      [t('marketWatch-projection', 'Sonraki tahmin'), formatPrice(stats.projected)]
    ];
    cells.forEach(([label, value]) => {
      const cell = document.createElement('div');
      cell.append(createText('span', '', label), createText('strong', '', value));
      grid.append(cell);
    });
    const note = `${t('marketWatch-confidence', 'Güven')}: ${t(`marketWatch-confidence-${stats.confidence}`, stats.confidence)} · ${stats.samples} ${t('marketWatch-samples', 'örnek')}`;
    panel.append(head, grid, createText('div', 'watch-trend-note', `${note} · ${t('marketWatch-predictionNote', 'Tahmin geçmiş örneklerin eğilimine dayanır.')}`));
    return panel;
  }

  function visibleRecords() {
    const query = view.query.trim().toLocaleLowerCase('tr-TR');
    const filtered = records.filter((record) => {
      if (!query) return true;
      return [record.itemId, record.name, record.city, CITY_LABELS[record.city], record.server]
        .filter(Boolean)
        .some((value) => String(value).toLocaleLowerCase('tr-TR').includes(query));
    });
    return filtered.sort((first, second) => {
      if (view.sort === 'alerts') return Number(second.triggered) - Number(first.triggered);
      if (view.sort === 'price-up' || view.sort === 'price-down') {
        const change = (record) => Number.parseFloat(historyChange(record.history)) || 0;
        const direction = view.sort === 'price-up' ? -1 : 1;
        return (change(first) - change(second)) * direction;
      }
      return records.indexOf(first) - records.indexOf(second);
    });
  }

  function updateInsights() {
    const total = $('watchMetricTotal');
    const alerts = $('watchMetricAlerts');
    const stale = $('watchMetricStale');
    const rising = $('watchMetricRising');
    const falling = $('watchMetricFalling');
    if (total) total.textContent = String(records.length);
    if (alerts) alerts.textContent = String(records.filter((record) => record.triggered).length);
    if (stale) stale.textContent = String(records.filter(isStale).length);
    if (rising) rising.textContent = String(records.filter((record) => trendStats(record.history).direction === 'up').length);
    if (falling) falling.textContent = String(records.filter((record) => trendStats(record.history).direction === 'down').length);
  }

  function exportRecords() {
    try {
      const payload = JSON.stringify({ version: 1, exportedAt: now(), records }, null, 2);
      const url = URL.createObjectURL(new Blob([payload], { type: 'application/json' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `aot-pnasf-watchlist-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      showStatus(t('marketWatch-exported', 'Takip listesi dışa aktarıldı.'), 'success');
    } catch (error) {
      showStatus(t('marketWatch-exportError', 'Liste dışa aktarılamadı.'), 'error');
    }
  }

  async function importRecords(event) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = '';
    if (!file) return;
    try {
      const raw = await file.text();
      const parsed = JSON.parse(raw);
      const imported = Array.isArray(parsed) ? parsed : parsed?.records;
      if (!Array.isArray(imported)) throw new Error('invalid-payload');
      const valid = imported.map(normalizeRecord).filter(Boolean);
      if (!valid.length) throw new Error('empty-payload');
      const existingKeys = new Set(records.map((record) => `${record.itemId}|${record.server}|${record.city}`));
      const additions = valid.filter((record) => {
        const key = `${record.itemId}|${record.server}|${record.city}`;
        if (existingKeys.has(key)) return false;
        existingKeys.add(key);
        return true;
      }).map((record) => ({ ...record, id: window.crypto?.randomUUID ? window.crypto.randomUUID() : `${Date.now()}-${Math.random()}` }));
      records = [...additions, ...records].slice(0, MAX_RECORDS);
      if (!await saveRecords()) return;
      render();
      showStatus(`${additions.length} ${t('marketWatch-imported', 'kayıt içe aktarıldı.')}`, 'success');
    } catch (error) {
      showStatus(t('marketWatch-importError', 'Geçerli bir takip listesi dosyası seçin.'), 'error');
    }
  }

  function ageLabel(dateString) {
    if (!dateString) return t('marketWatch-notChecked', 'Henüz kontrol edilmedi');
    const minutes = Math.max(0, Math.floor((Date.now() - new Date(dateString).getTime()) / 60000));
    if (minutes < 1) return t('marketWatch-justNow', 'Az önce');
    if (minutes < 60) return `${minutes} ${t('marketWatch-minutesAgo', 'dk önce')}`;
    return `${Math.floor(minutes / 60)} ${t('marketWatch-hoursAgo', 'sa önce')}`;
  }

  function render() {
    const list = $('watchlistItems');
    const empty = $('watchlistEmpty');
    const filteredEmpty = $('watchlistFilteredEmpty');
    const count = $('watchlistCount');
    if (!list || !empty) return;
    list.replaceChildren();
    if (count) count.textContent = `${records.length}/${MAX_RECORDS}`;
    empty.hidden = records.length > 0;
    const displayed = visibleRecords();
    if (filteredEmpty) filteredEmpty.hidden = records.length === 0 || displayed.length > 0;
    records.forEach((record) => { record.triggered = evaluateAlarm(record); });
    updateInsights();
    displayed.forEach((record) => {
      const card = document.createElement('article');
      const stale = isStale(record);
      card.className = `watch-card${record.triggered ? ' is-triggered' : ''}${stale ? ' is-stale' : ''}`;
      const head = document.createElement('div');
      head.className = 'watch-card-head';
      const title = itemName(record.itemId, record.name);
      head.append(createText('strong', 'watch-item-name', title), createText('span', 'watch-item-id', record.itemId));
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'watch-remove';
      remove.textContent = t('marketWatch-remove', 'Kaldır');
      remove.addEventListener('click', () => removeRecord(record.id));
      head.append(remove);
      const meta = document.createElement('div');
      meta.className = 'watch-meta';
      meta.append(createText('span', '', `${record.server.toUpperCase()} · ${CITY_LABELS[record.city] || record.city}`));
      meta.append(createText('span', `watch-current${stale ? ' is-stale' : ''}`, `${stale ? t('marketWatch-lastSuccessful', 'Son başarılı') : t('marketWatch-current', 'Güncel')}: ${formatPrice(record.lastPrice)}`));
      const rule = createText('div', 'watch-rule', alarmRule(record));
      const age = createText('div', `watch-age${stale ? ' is-stale' : ''}`, `${t('marketWatch-lastCheck', 'Son kontrol')}: ${ageLabel(record.lastChecked)}`);
      const trend = historyChange(record.history);
      if (trend) age.append(createText('span', trend.startsWith('+') ? 'watch-trend up' : 'watch-trend down', `${t('marketWatch-change', 'Değişim')}: ${trend}`));
      const state = createText('div', `watch-state${record.error ? ' error' : record.triggered ? ' success' : ''}`, record.error || (record.triggered ? t('marketWatch-triggered', 'Alarm koşulu sağlandı') : t('marketWatch-waiting', 'Koşul bekleniyor')));
      card.append(head, meta, rule, age, createSparkline(record.history, title), createTrendPanel(trendStats(record.history)), state);
      list.append(card);
    });
  }

  async function removeRecord(id) {
    records = records.filter((item) => item.id !== id);
    await saveRecords();
    render();
    showStatus(t('marketWatch-removed', 'Takip kaldırıldı.'), 'success');
  }

  async function addRecord(event) {
    event.preventDefault();
    if (records.length >= MAX_RECORDS) return showStatus(t('marketWatch-limit', 'En fazla 20 eşya takip edilebilir.'), 'error');
    const form = event.currentTarget;
    const resolved = resolveItem($('watchItem').value, $('watchTier').value);
    const selectedAlarm = alarmType();
    const target = Number($('watchTarget').value) || 0;
    if (!resolved) return showStatus(t('marketWatch-invalidItem', 'Geçerli bir eşya adı veya ID girin.'), 'error');
    if (selectedAlarm !== 'none' && selectedAlarm !== 'stale' && target <= 0) {
      return showStatus(t('marketWatch-invalidTarget', 'Alarm eşiği 0’dan büyük olmalı.'), 'error');
    }
    const record = {
      id: window.crypto?.randomUUID ? window.crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
      itemId: resolved.itemId, name: resolved.name,
      server: $('watchServer').value, city: $('watchCity').value,
      target, alarmType: selectedAlarm, mode: selectedAlarm === 'price-above' ? 'above' : 'below', lastPrice: 0, triggered: false, history: []
    };
    if (records.some((item) => item.itemId === record.itemId && item.server === record.server && item.city === record.city)) {
      return showStatus(t('marketWatch-duplicate', 'Bu eşya ve şehir zaten takipte.'), 'error');
    }
    records.unshift(record);
    if (!await saveRecords()) { records.shift(); return; }
    form.reset();
    $('watchTier').value = 'T4';
    $('watchAlarmType').value = 'price-below';
    updateAlarmForm();
    render();
    showStatus(t('marketWatch-added', 'Eşya takip listesine eklendi.'), 'success');
    refreshAll();
  }

  async function init() {
    if (!$('watchlistItems')) return;
    $('watchlistForm')?.addEventListener('submit', addRecord);
    $('watchlistRefresh')?.addEventListener('click', () => refreshAll('manual'));
    $('watchRefreshInterval')?.addEventListener('change', changeRefreshInterval);
    $('watchNotifications')?.addEventListener('change', changeNotifications);
    $('watchAlarmType')?.addEventListener('change', updateAlarmForm);
    $('watchSearch')?.addEventListener('input', (event) => { view.query = event.currentTarget.value; render(); });
    $('watchSort')?.addEventListener('change', (event) => { view.sort = event.currentTarget.value; render(); });
    $('watchExport')?.addEventListener('click', exportRecords);
    $('watchImportButton')?.addEventListener('click', () => $('watchImport')?.click());
    $('watchImport')?.addEventListener('change', importRecords);
    await readRecords();
    await readSettings();
    updateAlarmForm();
    scheduleRefresh();
    if (records.length) refreshAll('initial');
  }

  window.marketWatchlist = { refresh: () => refreshAll('manual') };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
