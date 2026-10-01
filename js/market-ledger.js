/* AoT-PNASF — Personal stock and investment ledger. */
(() => {
  'use strict';

  const STORAGE_KEY = 'market-ledger-v1';
  const MAX_TRANSACTIONS = 200;
  const SERVERS = {
    europe: 'https://europe.albion-online-data.com',
    west: 'https://west.albion-online-data.com',
    east: 'https://east.albion-online-data.com'
  };
  const CITY_LABELS = {
    Caerleon: 'Caerleon', Bridgewatch: 'Bridgewatch', Lymhurst: 'Lymhurst',
    Martlock: 'Martlock', Thetford: 'Thetford', 'Fort Sterling': 'Fort Sterling',
    Brecilien: 'Brecilien', 'Arthurs Rest': "Arthur's Rest", 'Merlins Rest': "Merlyn's Rest",
    'Morganas Rest': "Morgana's Rest", 'Black Market': 'Black Market'
  };
  const $ = (id) => document.getElementById(id);
  const t = (key, fallback) => {
    const translated = window.miniappI18n?.t(key);
    return translated && translated !== key ? translated : fallback;
  };
  const format = (value) => Math.round(Number(value) || 0).toLocaleString('tr-TR');
  const now = () => new Date().toISOString();
  let transactions = [];
  let storageReady = false;
  let busy = false;

  function makeId() {
    return window.crypto?.randomUUID ? window.crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  }

  function normalizeTransaction(item) {
    if (!item || !item.itemId) return null;
    const quantity = Math.floor(Number(item.quantity) || 0);
    const unitPrice = Math.max(0, Number(item.unitPrice) || 0);
    if (quantity < 1 || unitPrice <= 0 || !['buy', 'sell'].includes(item.type)) return null;
    return {
      id: item.id || makeId(), itemId: String(item.itemId).toUpperCase(), name: item.name || item.itemId,
      type: item.type, quantity, unitPrice, city: item.city || 'Caerleon', server: item.server || 'europe',
      note: item.note || '', lastPrice: Number(item.lastPrice) || 0, at: item.at || now()
    };
  }

  async function save() {
    if (!storageReady || !window.miniappsAI?.storage) {
      showStatus(t('ledger-storageError', 'Defter şu an kaydedilemedi.'), 'error');
      return false;
    }
    try {
      await window.miniappsAI.storage.setItem(STORAGE_KEY, JSON.stringify(transactions));
      return true;
    } catch (error) {
      showStatus(t('ledger-storageError', 'Defter şu an kaydedilemedi.'), 'error');
      return false;
    }
  }

  async function load() {
    try {
      if (!window.miniappsAI?.storage) throw new Error('storage-unavailable');
      const raw = await window.miniappsAI.storage.getItem(STORAGE_KEY);
      const firstRun = raw == null;
      const parsed = raw ? JSON.parse(raw) : [];
      transactions = Array.isArray(parsed) ? parsed.map(normalizeTransaction).filter(Boolean).slice(0, MAX_TRANSACTIONS) : [];
      storageReady = true;
      if (firstRun) {
        transactions = [
          normalizeTransaction({ id: makeId(), itemId: 'T4_BAG', name: 'T4_BAG', type: 'buy', quantity: 10, unitPrice: 1200, city: 'Caerleon', server: 'europe', note: t('ledger-starterNote', 'Örnek stok kaydı') })
        ];
        await save();
      }
      render();
    } catch (error) {
      transactions = [];
      storageReady = false;
      showStatus(t('ledger-loadError', 'Yatırım defteri yüklenemedi.'), 'error');
      render();
    }
  }

  function showStatus(message, kind = 'info') {
    const node = $('ledgerStatus');
    if (!node) return;
    node.textContent = message;
    node.className = `ledger-status ${kind}`;
    if (message) window.setTimeout(() => { if (node.textContent === message) node.textContent = ''; }, 5000);
  }

  function resolveItem(query) {
    const clean = String(query || '').trim();
    if (!clean) return null;
    if (/^T[2-8]_[A-Z0-9_]+(?:@\d)?$/i.test(clean)) return { itemId: clean.toUpperCase(), name: clean.toUpperCase() };
    const match = window.AO_SEARCH?.(clean)?.[0];
    const base = match?.id || clean.toUpperCase().replace(/[^A-Z0-9]+/g, '_').replace(/^_|_$/g, '');
    if (!base) return null;
    const tier = $('ledgerTier')?.value || 'T4';
    return { itemId: `${tier}_${base}`, name: match?.tr || clean };
  }

  function derive() {
    const map = new Map();
    const ordered = [...transactions].sort((a, b) => new Date(a.at) - new Date(b.at));
    let totalBought = 0;
    let totalSold = 0;
    let totalRealized = 0;
    ordered.forEach((transaction) => {
      const current = map.get(transaction.itemId) || { itemId: transaction.itemId, name: transaction.name, quantity: 0, costBasis: 0, realized: 0, lastPrice: 0, city: transaction.city, server: transaction.server };
      current.name = transaction.name || current.name;
      current.city = transaction.city || current.city;
      current.server = transaction.server || current.server;
      current.lastPrice = Number(transaction.lastPrice) || current.lastPrice;
      if (transaction.type === 'buy') {
        current.quantity += transaction.quantity;
        current.costBasis += transaction.quantity * transaction.unitPrice;
        totalBought += transaction.quantity * transaction.unitPrice;
      } else {
        const sold = Math.min(current.quantity, transaction.quantity);
        const average = current.quantity > 0 ? current.costBasis / current.quantity : transaction.unitPrice;
        current.realized += (transaction.unitPrice - average) * sold;
        totalRealized += (transaction.unitPrice - average) * sold;
        current.quantity -= sold;
        current.costBasis = Math.max(0, current.costBasis - average * sold);
        totalSold += transaction.unitPrice * sold;
      }
      map.set(transaction.itemId, current);
    });
    return { holdings: [...map.values()].filter((item) => item.quantity > 0), totalBought, totalSold, totalRealized };
  }

  function holdingValue(holding) {
    const marketPrice = Number(holding.lastPrice) || 0;
    const value = (marketPrice || holding.costBasis / Math.max(1, holding.quantity)) * holding.quantity;
    return { value, marketPrice, unrealized: value - holding.costBasis };
  }

  function text(tag, className, value) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    node.textContent = value;
    return node;
  }

  function renderSummary(state) {
    const totalValue = state.holdings.reduce((sum, item) => sum + holdingValue(item).value, 0);
    const unrealized = state.holdings.reduce((sum, item) => sum + holdingValue(item).unrealized, 0);
    const realized = state.totalRealized;
    $('ledgerInvested').textContent = `${format(state.totalBought)} ${t('ledger-silver', 'gümüş')}`;
    $('ledgerValue').textContent = `${format(totalValue)} ${t('ledger-silver', 'gümüş')}`;
    $('ledgerProfit').textContent = `${unrealized + realized >= 0 ? '+' : ''}${format(unrealized + realized)} ${t('ledger-silver', 'gümüş')}`;
    $('ledgerProfit').className = `ledger-summary-value ${unrealized + realized >= 0 ? 'is-positive' : 'is-negative'}`;
    $('ledgerItems').textContent = String(state.holdings.length);
  }

  function renderHoldings(state) {
    const list = $('ledgerHoldings');
    if (!list) return;
    list.replaceChildren();
    if (!state.holdings.length) {
      list.append(text('p', 'ledger-empty', t('ledger-emptyHoldings', 'Henüz stok bulunmuyor. İlk alış kaydınızı ekleyin.')));
      return;
    }
    state.holdings.forEach((holding) => {
      const values = holdingValue(holding);
      const card = document.createElement('article');
      card.className = 'ledger-holding-card';
      const head = document.createElement('div');
      head.className = 'ledger-card-head';
      head.append(text('strong', 'ledger-item-name', holding.name), text('span', 'ledger-item-id', holding.itemId));
      const body = document.createElement('div');
      body.className = 'ledger-card-grid';
      [[t('ledger-quantity', 'Stok'), format(holding.quantity)], [t('ledger-average', 'Ortalama maliyet'), `${format(holding.costBasis / holding.quantity)} ${t('ledger-silver', 'gümüş')}`], [t('ledger-marketValue', 'Tahmini değer'), `${format(values.value)} ${t('ledger-silver', 'gümüş')}`], [t('ledger-unrealized', 'Gerçekleşmemiş'), `${values.unrealized >= 0 ? '+' : ''}${format(values.unrealized)} ${t('ledger-silver', 'gümüş')}`]].forEach(([label, value]) => {
        const cell = document.createElement('div');
        cell.append(text('span', '', label), text('strong', '', value));
        body.append(cell);
      });
      const foot = document.createElement('div');
      foot.className = 'ledger-card-foot';
      foot.append(text('span', '', `${holding.server.toUpperCase()} · ${CITY_LABELS[holding.city] || holding.city}`));
      const priceButton = document.createElement('button');
      priceButton.type = 'button'; priceButton.className = 'ledger-price-btn';
      priceButton.textContent = values.marketPrice ? `${t('ledger-currentPrice', 'Piyasa')}: ${format(values.marketPrice)}` : t('ledger-updatePrice', 'Fiyatı güncelle');
      priceButton.addEventListener('click', () => updatePrice(holding));
      foot.append(priceButton);
      card.append(head, body, foot);
      list.append(card);
    });
  }

  function renderTransactions() {
    const list = $('ledgerTransactions');
    if (!list) return;
    list.replaceChildren();
    if (!transactions.length) {
      list.append(text('p', 'ledger-empty', t('ledger-emptyTransactions', 'Henüz işlem kaydı yok.')));
      return;
    }
    transactions.slice(0, 30).forEach((transaction) => {
      const row = document.createElement('article');
      row.className = 'ledger-transaction';
      const main = document.createElement('div');
      main.append(text('strong', 'ledger-transaction-name', transaction.name), text('span', 'ledger-transaction-meta', `${transaction.type === 'buy' ? t('ledger-buy', 'Alış') : t('ledger-sell', 'Satış')} · ${format(transaction.quantity)} ${t('ledger-unit', 'adet')} · ${CITY_LABELS[transaction.city] || transaction.city}`));
      const amount = text('strong', transaction.type === 'buy' ? 'is-negative' : 'is-positive', `${transaction.type === 'buy' ? '-' : '+'}${format(transaction.quantity * transaction.unitPrice)} ${t('ledger-silver', 'gümüş')}`);
      const remove = document.createElement('button');
      remove.type = 'button'; remove.className = 'ledger-delete'; remove.textContent = t('ledger-remove', 'Sil');
      remove.addEventListener('click', () => removeTransaction(transaction.id));
      row.append(main, amount, remove);
      list.append(row);
    });
  }

  function render() {
    const state = derive();
    renderSummary(state);
    renderHoldings(state);
    renderTransactions();
  }

  async function addTransaction(event) {
    event.preventDefault();
    const item = resolveItem($('ledgerItem')?.value);
    const quantity = Math.floor(Number($('ledgerQuantity')?.value) || 0);
    const unitPrice = Number($('ledgerUnitPrice')?.value) || 0;
    const type = $('ledgerType')?.value === 'sell' ? 'sell' : 'buy';
    if (!item || quantity < 1 || unitPrice <= 0) return showStatus(t('ledger-invalid', 'Eşya, miktar ve birim fiyatı kontrol edin.'), 'error');
    if (type === 'sell') {
      const holding = derive().holdings.find((entry) => entry.itemId === item.itemId);
      if (!holding || holding.quantity < quantity) return showStatus(t('ledger-stockError', 'Satış miktarı mevcut stoktan fazla olamaz.'), 'error');
    }
    transactions.unshift({ id: makeId(), ...item, type, quantity, unitPrice, city: $('ledgerCity').value, server: $('ledgerServer').value, note: $('ledgerNote').value.trim(), at: now() });
    transactions = transactions.slice(0, MAX_TRANSACTIONS);
    if (!await save()) { transactions.shift(); return; }
    event.currentTarget.reset();
    $('ledgerType').value = 'buy'; $('ledgerTier').value = 'T4'; $('ledgerServer').value = 'europe'; $('ledgerCity').value = 'Caerleon';
    render();
    showStatus(t('ledger-saved', 'İşlem kaydedildi.'), 'success');
  }

  async function removeTransaction(id) {
    transactions = transactions.filter((item) => item.id !== id);
    if (await save()) { render(); showStatus(t('ledger-removed', 'İşlem silindi.'), 'success'); }
  }

  async function updatePrice(holding) {
    if (busy) return;
    busy = true;
    showStatus(t('ledger-priceLoading', 'Piyasa fiyatları güncelleniyor...'), 'info');
    try {
      const api = SERVERS[holding.server] || SERVERS.europe;
      const url = `${api}/api/v2/stats/prices/${encodeURIComponent(holding.itemId)}.json?locations=${encodeURIComponent(holding.city)}`;
      const response = await window.AOTMarketNetwork.request(url, { timeoutMs: 12000, cacheTtl: 30000, staleTtl: 180000 });
      const data = await response.json();
      const row = Array.isArray(data) ? data.find((entry) => entry.city === holding.city) : null;
      const price = Number(holding.city === 'Black Market' ? row?.buy_price_max : row?.sell_price_min) || 0;
      if (!price) throw new Error('no-price');
      transactions.filter((item) => item.itemId === holding.itemId).forEach((item) => { item.lastPrice = price; });
      await save();
      render();
      showStatus(`${t('ledger-priceUpdated', 'Piyasa fiyatı güncellendi')}: ${format(price)} ${t('ledger-silver', 'gümüş')}`, 'success');
    } catch (error) {
      showStatus(t('ledger-priceError', 'Piyasa fiyatı alınamadı.'), 'error');
    } finally { busy = false; }
  }

  function init() {
    if (!$('ledgerForm')) return;
    $('ledgerForm').addEventListener('submit', addTransaction);
    $('ledgerType').addEventListener('change', () => { $('ledgerQuantity').setAttribute('aria-label', $('ledgerType').value === 'sell' ? t('ledger-sellQuantity', 'Satış miktarı') : t('ledger-buyQuantity', 'Alış miktarı')); });
    $('ledgerRefreshPrices')?.addEventListener('click', () => {
      const state = derive();
      state.holdings.reduce((chain, holding) => chain.then(() => updatePrice(holding)), Promise.resolve());
    });
    load();
  }

  window.marketLedger = { refresh: render };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
