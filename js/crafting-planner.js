/* AoT-PNASF — Üretim Planlayıcı ve Toplu Üretim Hesabı */
(function () {
  'use strict';

  const API = 'https://europe.albion-online-data.com';
  const CITIES = ['Caerleon', 'Bridgewatch', 'Lymhurst', 'Martlock', 'Thetford', 'Fort Sterling', 'Brecilien', 'Black Market'];
  const STORAGE_KEY = 'aot-crafting-planner-v1';
  const state = { selected: null, lines: [], prices: {}, busy: false };
  const text = {
    tr: {
      noItem: 'Önce üretilecek bir eşya seçin.', searching: 'Eşya aranıyor...', noResult: 'Eşya bulunamadı.',
      added: 'Plan satırı eklendi.', removed: 'Plan satırı kaldırıldı.', cleared: 'Plan temizlendi.',
      loading: 'Fiyatlar alınıyor...', priceError: 'Fiyatlar alınamadı; plan tahmini fiyatlarla gösteriliyor.',
      noPlan: 'Henüz plan yok. Soldan bir eşya seçip plana ekleyin.', noPrice: 'Veri yok',
      estimated: 'Tahmini reçete', auto: 'En iyi fiyat', total: 'Toplam', material: 'Malzeme',
      products: 'Ürün', cost: 'Maliyet', revenue: 'Satış geliri', tax: 'Vergi', profit: 'Net kâr', roi: 'ROI',
      remove: 'Kaldır', clear: 'Planı temizle', cheapest: 'En ucuz', sellAt: 'Satış', buyAt: 'Maliyet şehri',
      focus: 'Focus dahil', focusLabel: 'Focus dahil', standard: 'Standart iade', productsLabel: 'Ürün', costLabel: 'Maliyet', revenueLabel: 'Satış geliri', taxLabel: 'Vergi', profitLabel: 'Net kâr', roiLabel: 'ROI', empty: 'Bu seçim için tahmini reçete bulunamadı.'
    },
    en: {
      noItem: 'Choose an item to craft first.', searching: 'Searching items...', noResult: 'No item found.',
      added: 'Plan line added.', removed: 'Plan line removed.', cleared: 'Plan cleared.',
      loading: 'Fetching prices...', priceError: 'Prices unavailable; showing estimated values.',
      noPlan: 'No plan yet. Choose an item on the left and add it.', noPrice: 'No data',
      estimated: 'Estimated recipe', auto: 'Best price', total: 'Total', material: 'Material',
      products: 'Products', cost: 'Cost', revenue: 'Sales revenue', tax: 'Tax', profit: 'Net profit', roi: 'ROI',
      remove: 'Remove', clear: 'Clear plan', cheapest: 'Cheapest', sellAt: 'Sell', buyAt: 'Cost city',
      focus: 'Focus included', focusLabel: 'Focus included', standard: 'Standard return', productsLabel: 'Products', costLabel: 'Cost', revenueLabel: 'Sales revenue', taxLabel: 'Tax', profitLabel: 'Net profit', roiLabel: 'ROI', empty: 'No estimated recipe for this selection.'
    }
  };

  const $ = (id) => document.getElementById(id);
  const lang = () => (typeof getLang === 'function' ? getLang() : (document.documentElement.lang || 'tr')) === 'en' ? 'en' : 'tr';
  const t = (key) => {
    const fallback = text[lang()][key] || key;
    try { return window.miniappI18n?.t(`craftPlanner-${key}`) || fallback; } catch (_) { return fallback; }
  };
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  const money = (value) => `${Math.round(Number(value) || 0).toLocaleString('tr-TR')} Silver`;
  const itemList = () => Array.isArray(window.AO_ITEMS) ? window.AO_ITEMS : [];
  const getItem = (id) => itemList().find((item) => item.id === id);
  const itemName = (item) => item ? (lang() === 'tr' ? (item.tr || item.en) : (item.en || item.tr)) : '';
  const validPrice = (record) => Number(record?.sell_price_min) > 0 && record?.sell_price_min_date && !String(record.sell_price_min_date).startsWith('0001');

  function recipeFor(item, tier) {
    if (!item) return null;
    const cat = item.cat || '';
    const id = item.id || '';
    const material = (r, q) => ({ id: `T${tier}_${r}`, q });
    if (/BAG/.test(id) || cat === 'bag') return [material('LEATHER', 16), material('PLANKS', 8)];
    if (/CAPE/.test(id) || cat === 'cape') return [material('CLOTH', 4), material('LEATHER', 4)];
    if (cat === 'sword' || cat === 'dagger') return [material('METALBAR', 8), material('LEATHER', 8), material('PLANKS', 4)];
    if (cat === 'axe' || cat === 'mace' || cat === 'hammer') return [material('METALBAR', 12), material('PLANKS', 8), material('LEATHER', 4)];
    if (cat === 'spear' || cat === 'qstaff') return [material('METALBAR', 8), material('PLANKS', 16), material('LEATHER', 4)];
    if (['bow', 'fire', 'frost', 'arcane', 'holy', 'nature', 'curse'].includes(cat)) return [material('PLANKS', 16), material('CLOTH', 8), material('METALBAR', 4)];
    if (['lhelmet', 'larmor', 'lshoes', 'gatherer'].includes(cat)) return [material('LEATHER', cat === 'larmor' ? 12 : 8), material('CLOTH', 4)];
    if (['phelmet', 'parmor', 'pshoes'].includes(cat)) return [material('METALBAR', cat === 'parmor' ? 12 : 8), material('LEATHER', 4)];
    if (['chelmet', 'carmor', 'cshoes'].includes(cat)) return [material('CLOTH', cat === 'carmor' ? 12 : 8), material('LEATHER', 4)];
    if (cat === 'offhand') return [material('METALBAR', 8), material('PLANKS', 4), material('LEATHER', 4)];
    if (cat === 'mount') return [material('PLANKS', 16), material('LEATHER', 8), material('CLOTH', 4)];
    if (cat === 'food') return [material('MEAT', 8), material('GRAIN', 4)];
    if (cat === 'potion') return [material('HERB', 8), material('ROCK', 4)];
    return null;
  }

  function outputId(line) { return `T${line.tier}_${line.itemId}${line.enchant ? `@${line.enchant}` : ''}`; }
  function cityPrice(id, city) {
    const prices = state.prices[id] || {};
    if (city && city !== 'auto' && prices[city] > 0) return { price: prices[city], city };
    const entries = Object.entries(prices).filter(([, value]) => value > 0).sort((a, b) => b[1] - a[1]);
    return entries.length ? { price: entries[0][1], city: entries[0][0] } : { price: 0, city: null };
  }
  function materialPrice(id, city) {
    const prices = state.prices[id] || {};
    if (city && prices[city] > 0) return { price: prices[city], city };
    const entries = Object.entries(prices).filter(([, value]) => value > 0).sort((a, b) => a[1] - b[1]);
    return entries.length ? { price: entries[0][1], city: entries[0][0] } : { price: 0, city: null };
  }

  function searchItems(query) {
    const needle = query.trim().toLocaleLowerCase('tr-TR');
    const tier = Number($('plannerTier')?.value || 5);
    return itemList().filter((item) => item.tiers?.includes(tier) && !['resource', 'building'].includes(item.cat) && `${item.id} ${item.tr} ${item.en}`.toLocaleLowerCase('tr-TR').includes(needle)).slice(0, 12);
  }

  function renderSuggestions() {
    const box = $('plannerSuggestions');
    const query = $('plannerSearch')?.value || '';
    if (!box || query.trim().length < 2) { box?.classList.remove('open'); return; }
    const results = searchItems(query);
    box.innerHTML = results.length ? results.map((item) => `<button type="button" class="planner-suggestion" data-item-id="${esc(item.id)}"><span>${esc(itemName(item))}</span><small>${esc(item.id)}</small></button>`).join('') : `<div class="planner-no-result">${esc(t('noResult'))}</div>`;
    box.classList.add('open');
  }

  async function fetchPrices(ids) {
    const missing = [...new Set(ids)].filter((id) => !state.prices[id]);
    if (!missing.length) return true;
    state.busy = true;
    renderSummary();
    try {
      const response = await fetch(`${API}/api/v2/stats/prices/${missing.join(',')}.json?locations=${encodeURIComponent(CITIES.join(','))}`);
      if (!response.ok) throw new Error('price response');
      const data = await response.json();
      data.forEach((record) => {
        if (!validPrice(record)) return;
        state.prices[record.item_id] = state.prices[record.item_id] || {};
        const city = record.city;
        const value = Number(record.sell_price_min);
        if (!state.prices[record.item_id][city] || value < state.prices[record.item_id][city]) state.prices[record.item_id][city] = value;
      });
      return true;
    } catch (_) {
      showStatus(t('priceError'), 'warning');
      return false;
    } finally {
      state.busy = false;
      renderSummary();
    }
  }

  function selectItem(id) {
    const item = getItem(id);
    if (!item) return;
    state.selected = { id, name: itemName(item) };
    const input = $('plannerSearch');
    if (input) input.value = itemName(item);
    $('plannerSuggestions')?.classList.remove('open');
    showStatus(`${state.selected.name} · ${t('estimated')}`, 'success');
  }

  function addLine() {
    if (!state.selected) { showStatus(t('noItem'), 'warning'); return; }
    const item = getItem(state.selected.id);
    const tier = Number($('plannerTier')?.value || 5);
    const recipe = recipeFor(item, tier);
    if (!recipe) { showStatus(t('empty'), 'warning'); return; }
    const quantity = Math.max(1, Math.min(9999, Number($('plannerQty')?.value || 1)));
    const line = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      itemId: item.id, name: itemName(item), tier, enchant: Number($('plannerEnchant')?.value || 0), quantity,
      city: $('plannerCity')?.value || 'Caerleon', sellCity: $('plannerSellCity')?.value || 'auto',
      tax: Math.max(0, Number($('plannerTax')?.value || 8)), focus: Boolean($('plannerFocus')?.checked), recipe
    };
    state.lines.push(line);
    state.selected = null;
    $('plannerSearch').value = '';
    savePlan();
    showStatus(t('added'), 'success');
    renderLines();
    fetchPrices([outputId(line), ...recipe.map((material) => material.id)]).then(renderLines);
  }

  function lineTotals(line) {
    const returnRate = line.focus ? 0.47 : 0.15;
    const materialTotal = line.recipe.reduce((sum, material) => sum + (materialPrice(material.id, line.city).price * material.q * line.quantity * (1 - returnRate)), 0);
    const sale = cityPrice(outputId(line), line.sellCity);
    const revenue = sale.price * line.quantity;
    const tax = revenue * (line.tax / 100);
    return { materialTotal, revenue, tax, profit: revenue - tax - materialTotal, saleCity: sale.city, salePrice: sale.price };
  }

  function aggregate() {
    const materials = {};
    let products = 0, cost = 0, revenue = 0, tax = 0, profit = 0;
    state.lines.forEach((line) => {
      const totals = lineTotals(line);
      products += line.quantity; cost += totals.materialTotal; revenue += totals.revenue; tax += totals.tax; profit += totals.profit;
      const returned = line.focus ? 0.53 : 0.85;
      line.recipe.forEach((material) => {
        const quantity = material.q * line.quantity * returned;
        materials[material.id] = materials[material.id] || { id: material.id, quantity: 0, cost: 0, city: null };
        materials[material.id].quantity += quantity;
        const price = materialPrice(material.id, line.city);
        materials[material.id].cost += price.price * quantity;
        materials[material.id].city = price.city || materials[material.id].city;
      });
    });
    return { products, cost, revenue, tax, profit, materials, roi: cost ? (profit / cost) * 100 : 0 };
  }

  function renderLines() {
    const box = $('plannerLines');
    if (!box) return;
    if (!state.lines.length) { box.innerHTML = `<div class="planner-empty">${esc(t('noPlan'))}</div>`; renderSummary(); return; }
    box.innerHTML = state.lines.map((line, index) => {
      const totals = lineTotals(line);
      const profitClass = totals.profit >= 0 ? 'positive' : 'negative';
      return `<article class="planner-line"><div class="planner-line-main"><div><strong>${esc(line.name)}</strong><span>T${line.tier}${line.enchant ? ` +${line.enchant}` : ''} · ${line.quantity} ${esc(t('productsLabel').toLocaleLowerCase())}</span></div><div class="planner-line-profit ${profitClass}">${totals.profit >= 0 ? '+' : ''}${money(totals.profit)}</div></div><div class="planner-line-meta"><span>${esc(t('buyAt'))}: ${esc(line.city)}</span><span>${esc(t('sellAt'))}: ${esc(totals.saleCity || t('auto'))}</span><span>${line.focus ? esc(t('focusLabel')) : esc(t('standard'))}</span><button type="button" class="planner-remove" data-remove-line="${esc(line.id)}">${esc(t('remove'))}</button></div></article>`;
    }).join('');
    renderSummary();
  }

  function renderSummary() {
    const summary = $('plannerSummary');
    const materials = $('plannerMaterials');
    if (!summary || !materials) return;
    const totals = aggregate();
    if (state.busy) summary.innerHTML = `<div class="planner-loading"><span class="loading-spinner"></span>${esc(t('loading'))}</div>`;
    else if (!state.lines.length) summary.innerHTML = `<div class="planner-empty">${esc(t('noPlan'))}</div>`;
    else summary.innerHTML = `<div class="planner-stats"><div><small>${esc(t('productsLabel'))}</small><strong>${totals.products.toLocaleString('tr-TR')}</strong></div><div><small>${esc(t('costLabel'))}</small><strong>${money(totals.cost)}</strong></div><div><small>${esc(t('revenueLabel'))}</small><strong>${money(totals.revenue)}</strong></div><div><small>${esc(t('taxLabel'))}</small><strong>${money(totals.tax)}</strong></div><div class="${totals.profit >= 0 ? 'positive' : 'negative'}"><small>${esc(t('profitLabel'))}</small><strong>${totals.profit >= 0 ? '+' : ''}${money(totals.profit)}</strong></div><div><small>${esc(t('roiLabel'))}</small><strong>%${totals.roi.toFixed(1)}</strong></div></div>`;
    const materialRows = Object.values(totals.materials);
    materials.innerHTML = materialRows.length ? `<h4>${esc(t('material'))}</h4>${materialRows.map((material) => `<div class="planner-material"><span>${esc(material.id.replace(/^T\d_/, ''))}</span><strong>${material.quantity.toFixed(1)}</strong><span>${money(material.cost)}</span></div>`).join('')}` : '';
  }

  function showStatus(message, type) {
    const status = $('plannerStatus');
    if (!status) return;
    status.textContent = message;
    status.className = `planner-status ${type || ''}`;
  }
  function clearPlan() { state.lines = []; savePlan(); showStatus(t('cleared'), 'success'); renderLines(); }
  async function savePlan() { try { if (window.miniappsAI?.storage) await window.miniappsAI.storage.setItem(STORAGE_KEY, JSON.stringify(state.lines)); } catch (_) { showStatus('Plan bu oturum için tutuluyor.', 'warning'); } }
  async function loadPlan() {
    try {
      if (!window.miniappsAI?.storage) return;
      const raw = await window.miniappsAI.storage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (Array.isArray(saved)) state.lines = saved.filter((line) => line?.itemId && Array.isArray(line.recipe)).slice(0, 20);
    } catch (_) { showStatus('Kayıtlı plan yüklenemedi.', 'warning'); }
    renderLines();
    const ids = state.lines.flatMap((line) => [outputId(line), ...(line.recipe || []).map((material) => material.id)]);
    if (ids.length) fetchPrices(ids).then(renderLines);
  }

  document.addEventListener('DOMContentLoaded', () => {
    $('plannerSearch')?.addEventListener('input', renderSuggestions);
    $('plannerTier')?.addEventListener('change', () => { state.selected = null; renderSuggestions(); });
    $('plannerAddBtn')?.addEventListener('click', addLine);
    $('plannerClearBtn')?.addEventListener('click', clearPlan);
    $('plannerSuggestions')?.addEventListener('click', (event) => { const button = event.target.closest('[data-item-id]'); if (button) selectItem(button.dataset.itemId); });
    $('plannerLines')?.addEventListener('click', (event) => { const button = event.target.closest('[data-remove-line]'); if (!button) return; state.lines = state.lines.filter((line) => line.id !== button.dataset.removeLine); savePlan(); showStatus(t('removed'), 'success'); renderLines(); });
    document.addEventListener('click', (event) => { if (!event.target.closest('.planner-search-wrap')) $('plannerSuggestions')?.classList.remove('open'); });
    loadPlan();
  });

  window.craftingPlanner = { addLine, clearPlan, renderLines };
})();
