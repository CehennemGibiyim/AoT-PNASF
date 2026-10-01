/* Accessibility and lightweight runtime performance enhancements. */
(function () {
  'use strict';

  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)');

  function prepareImages(root = document) {
    root.querySelectorAll?.('img').forEach((image) => {
      if (!image.hasAttribute('loading')) image.loading = 'lazy';
      if (!image.hasAttribute('decoding')) image.decoding = 'async';
      if (!image.hasAttribute('alt')) image.alt = '';
    });
  }

  function labelIconOnlyControls(root = document) {
    root.querySelectorAll?.('button, [role="button"]').forEach((control) => {
      const hasText = (control.textContent || '').trim();
      if (hasText || control.getAttribute('aria-label') || control.getAttribute('title')) return;
      const icon = control.querySelector('i[class*="fa-"]');
      if (icon) control.setAttribute('aria-label', icon.className.replace(/.*fa-([a-z0-9-]+).*/, '$1').replace(/-/g, ' '));
    });
  }

  function syncNavigationState() {
    const menu = document.getElementById('navMenu');
    const toggle = document.getElementById('mobileMenuBtn');
    if (menu && toggle) {
      toggle.setAttribute('aria-controls', 'navMenu');
      toggle.setAttribute('aria-expanded', String(!menu.classList.contains('hidden')));
    }
    document.querySelectorAll('.tab-btn').forEach((button) => {
      const active = button.classList.contains('text-albion-accent');
      button.setAttribute('aria-current', active ? 'page' : 'false');
    });
  }

  function init() {
    prepareImages();
    labelIconOnlyControls();
    syncNavigationState();

    if (reducedMotion?.matches) document.documentElement.classList.add('reduce-motion');
    reducedMotion?.addEventListener?.('change', (event) => {
      document.documentElement.classList.toggle('reduce-motion', event.matches);
    });

    document.getElementById('mobileMenuBtn')?.addEventListener('click', () => {
      requestAnimationFrame(syncNavigationState);
    });
    document.querySelectorAll('.tab-btn').forEach((button) => {
      button.addEventListener('click', () => requestAnimationFrame(syncNavigationState));
    });
    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      const menu = document.getElementById('navMenu');
      const toggle = document.getElementById('mobileMenuBtn');
      if (menu && toggle && !menu.classList.contains('hidden')) {
        menu.classList.add('hidden');
        menu.classList.remove('flex');
        toggle.focus();
        syncNavigationState();
      }
    });

    const observer = new MutationObserver((records) => {
      records.forEach((record) => record.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          prepareImages(node);
          labelIconOnlyControls(node);
        }
      }));
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
