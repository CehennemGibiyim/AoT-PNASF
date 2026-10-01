/* Market production profit calculator: client-side, transparent assumptions. */
(() => {
  'use strict';

  const ids = ['profitMaterial', 'profitSale', 'profitQty', 'profitTax', 'profitFocus', 'profitExtra'];
  const $ = (id) => document.getElementById(id);
  const number = (id) => Math.max(0, Number($(id)?.value) || 0);

  function format(value) {
    return Math.round(value).toLocaleString('tr-TR');
  }

  function calculate() {
    const material = number('profitMaterial');
    const sale = number('profitSale');
    const quantity = Math.max(1, number('profitQty'));
    const tax = Math.min(100, number('profitTax')) / 100;
    const focus = Math.min(100, number('profitFocus')) / 100;
    const extra = number('profitExtra');
    const totalMaterial = material * quantity;
    const effectiveMaterial = totalMaterial * (1 - focus);
    const totalExtra = extra * quantity;
    const netSales = sale * quantity * (1 - tax);
    const totalCost = effectiveMaterial + totalExtra;
    const profit = netSales - totalCost;
    const roi = totalCost > 0 ? (profit / totalCost) * 100 : 0;
    const breakEven = quantity > 0 && (1 - tax) > 0 ? totalCost / quantity / (1 - tax) : 0;
    const profitNode = $('profitNet');
    const roiNode = $('profitRoi');
    const breakEvenNode = $('profitBreakEven');
    const state = $('profitState');
    if (!profitNode || !roiNode || !breakEvenNode || !state) return;
    const form = $('productionProfitForm');
    const lang = document.documentElement.lang?.startsWith('en') ? 'en' : 'tr';
    const currency = form?.dataset[`currency${lang === 'en' ? 'En' : 'Tr'}`] || 'Silver';
    profitNode.textContent = `${profit >= 0 ? '+' : ''}${format(profit)} ${currency}`;
    roiNode.textContent = `${roi >= 0 ? '+' : ''}${roi.toFixed(1)}%`;
    breakEvenNode.textContent = `${format(breakEven)} ${currency}`;
    profitNode.className = `profit-value ${profit >= 0 ? 'positive' : 'negative'}`;
    roiNode.className = `profit-value ${roi >= 0 ? 'positive' : 'negative'}`;
    state.className = `profit-state ${profit >= 0 ? 'positive' : 'negative'}`;
    state.textContent = state.dataset[lang] || state.dataset.tr || '';
  }

  function init() {
    const form = $('productionProfitForm');
    if (!form) return;
    ids.forEach((id) => $(id)?.addEventListener('input', calculate));
    form.addEventListener('reset', () => window.setTimeout(calculate, 0));
    calculate();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
