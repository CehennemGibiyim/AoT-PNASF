/**
 * Build Oluşturucu — manuel set tasarlama aracı.
 *
 * AlbionOnlineBuilds benzeri akış: 9 ekipman slotu, eşya arama, tier/enchant
 * seçimi, ortalama IP tahmini, isimli kayıt (localStorage) ve paylaşılabilir
 * bağlantı (#build=... parametresiyle kendi kendini geri yükler).
 *
 * Yetenek (Q/W/E/pasif) seçimi bilinçli olarak yok: elimizdeki spell verisi
 * yalnızca 6 silahı kapsıyor, eksik veriyle sahte seçenek göstermiyoruz.
 */

type SlotItem = { itemId: string; tier: number; enchant: number; skills?: string[] };
type Build = {
  v: number;
  name: string;
  role: string;
  slots: Record<string, SlotItem | null>;
};

type SlotDef = {
  key: string;
  label: string;
  icon: string;
  match: (id: string) => boolean;
  enchantable: boolean;
};

const BM_SLOTS: SlotDef[] = [
  { key: 'weapon', label: 'Silah', icon: 'fa-khanda', match: (id) => /^(MAIN_|2H_)/.test(id), enchantable: true },
  { key: 'offhand', label: 'Sol El', icon: 'fa-shield-halved', match: (id) => /^OFF_/.test(id), enchantable: true },
  { key: 'head', label: 'Kask', icon: 'fa-hat-wizard', match: (id) => /^HEAD_/.test(id), enchantable: true },
  { key: 'chest', label: 'Göğüslük', icon: 'fa-shirt', match: (id) => /^ARMOR_/.test(id), enchantable: true },
  { key: 'shoes', label: 'Ayakkabı', icon: 'fa-shoe-prints', match: (id) => /^SHOES_/.test(id), enchantable: true },
  { key: 'cape', label: 'Pelerin', icon: 'fa-scroll', match: (id) => /^CAPEITEM_/.test(id), enchantable: true },
  { key: 'mount', label: 'Binek', icon: 'fa-horse', match: (id) => /^MOUNT_/.test(id), enchantable: false },
  { key: 'food', label: 'Yemek', icon: 'fa-drumstick-bite', match: (id) => /^MEAL_/.test(id), enchantable: false },
  { key: 'potion', label: 'İksir', icon: 'fa-flask', match: (id) => /^POTION_/.test(id), enchantable: false }
];

const BM_EXCLUDE = /_TOOL_|QUESTITEM|_TEST|^UNIQUE_/;
const BM_STORAGE = 'aot_builds_v1';

let bmState: Build = bmEmpty();
let bmPickerSlot: string | null = null;
let bmPickerTier = 6;
let bmPickerEnchant = 0;
let bmPools: Record<string, any[]> | null = null;

function bmEmpty(): Build {
  const slots: Record<string, SlotItem | null> = {};
  BM_SLOTS.forEach((s) => { slots[s.key] = null; });
  return { v: 1, name: '', role: 'PvP', slots };
}

function bmItemDb(): any[] {
  return Array.isArray((window as any).AO_ITEMS) ? (window as any).AO_ITEMS : [];
}

function bmPoolsFor(): Record<string, any[]> {
  if (bmPools) return bmPools;
  const db = bmItemDb();
  const pools: Record<string, any[]> = {};
  BM_SLOTS.forEach((slot) => {
    pools[slot.key] = db
      .filter((it) => it && typeof it.id === 'string' && !BM_EXCLUDE.test(it.id) && slot.match(it.id))
      .filter((it) => Array.isArray(it.tiers) && it.tiers.length)
      .sort((a, b) => bmName(a).localeCompare(bmName(b), 'tr'));
  });
  bmPools = pools;
  return pools;
}

function bmName(item: any): string {
  if (!item) return '';
  return item.tr || item.en || String(item.id || '').replace(/_/g, ' ');
}

function bmSlotDef(key: string): SlotDef {
  return BM_SLOTS.find((s) => s.key === key) || BM_SLOTS[0];
}

function bmFullId(slot: SlotItem | null): string {
  if (!slot) return '';
  const e = slot.enchant > 0 ? `@${slot.enchant}` : '';
  return `T${slot.tier}_${slot.itemId}${e}`;
}

function bmLabel(slot: SlotItem | null): string {
  if (!slot) return '';
  return `T${slot.tier}${slot.enchant > 0 ? '.' + slot.enchant : ''}`;
}

function bmItemPower(slot: SlotItem | null): number {
  if (!slot || slot.tier < 4) return 0;
  return slot.tier * 100 + 300 + Math.max(0, slot.enchant) * 100;
}

function bmGearKeys(): string[] {
  return ['weapon', 'offhand', 'head', 'chest', 'shoes', 'cape'];
}

function bmAvgIp(): number {
  const twoHanded = bmState.slots.weapon && bmState.slots.weapon.itemId.startsWith('2H_');
  const keys = bmGearKeys().filter((k) => !(k === 'offhand' && twoHanded));
  const values = keys.map((k) => bmItemPower(bmState.slots[k])).filter((v) => v > 0);
  if (!values.length) return 0;
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

function bmEquippedCount(): number {
  return BM_SLOTS.filter((s) => bmState.slots[s.key]).length;
}

function bmIconUrl(slot: SlotItem | null, size = 96): string {
  if (!slot) return '';
  const cache = (window as any).albionImageCache;
  if (cache && cache.getItemUrl) return cache.getItemUrl(bmFullId(slot), 1, size);
  return `https://render.albiononline.com/v1/item/${encodeURIComponent(bmFullId(slot))}.png?quality=1&size=${size}`;
}

function bmPlaceholder(): string {
  const cache = (window as any).albionImageCache;
  return cache && cache.getPlaceholderUrl ? cache.getPlaceholderUrl() : '';
}

function bmImgErr(): string {
  const ph = bmPlaceholder();
  return ph ? `this.onerror=null;this.src='${ph}'` : 'this.onerror=null';
}

function bmEncode(build: Build): string {
  const json = JSON.stringify(build);
  const bytes = new TextEncoder().encode(json);
  let bin = '';
  bytes.forEach((b) => { bin += String.fromCharCode(b); });
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function bmDecode(token: string): Build | null {
  try {
    const padded = token.replace(/-/g, '+').replace(/_/g, '/');
    const bin = atob(padded + '='.repeat((4 - (padded.length % 4)) % 4));
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    const parsed = JSON.parse(new TextDecoder().decode(bytes));
    if (!parsed || !parsed.slots) return null;
    const clean = bmEmpty();
    clean.name = typeof parsed.name === 'string' ? parsed.name : '';
    clean.role = typeof parsed.role === 'string' ? parsed.role : 'PvP';
    BM_SLOTS.forEach((s) => {
      const v = parsed.slots[s.key];
      if (v && typeof v.itemId === 'string' && v.tier) {
        clean.slots[s.key] = { itemId: v.itemId, tier: Number(v.tier) || 6, enchant: Number(v.enchant) || 0 };
      }
    });
    return clean;
  } catch (_) {
    return null;
  }
}

function bmSaved(): any[] {
  try {
    const raw = localStorage.getItem(BM_STORAGE);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch (_) {
    return [];
  }
}

function bmWriteSaved(list: any[]) {
  try { localStorage.setItem(BM_STORAGE, JSON.stringify(list.slice(0, 30))); } catch (_) { /* yoksay */ }
}

function bmToast(msg: string, ok = true) {
  const el = document.getElementById('bmToast');
  if (!el) return;
  el.textContent = msg;
  el.className = `fixed bottom-6 left-1/2 -translate-x-1/2 z-[999] px-4 py-2.5 rounded-lg font-bold text-sm shadow-2xl transition-opacity duration-300 ${ok ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`;
  el.style.opacity = '1';
  window.setTimeout(() => { el.style.opacity = '0'; }, 2200);
}

// ─── Render ─────────────────────────────────────────────────────────────────

function bmRender() {
  const app = document.getElementById('buildMakerApp');
  if (!app) return;

  const ip = bmAvgIp();
  const twoHanded = bmState.slots.weapon && bmState.slots.weapon.itemId.startsWith('2H_');

  const slotCards = BM_SLOTS.map((def) => {
    const item = bmState.slots[def.key];
    const dbItem = item ? bmItemDb().find((i) => i.id === item.itemId) : null;
    const disabled = def.key === 'offhand' && twoHanded;
    const name = item ? bmName(dbItem) : def.label;
    const empty = !item;
    return `
      <div class="relative group">
        <button data-bm-slot="${def.key}" ${disabled ? 'disabled' : ''}
          class="w-full bg-[#0a0d14] border ${empty ? 'border-gray-700 border-dashed' : 'border-albion-accent/60'} rounded-xl p-3 flex flex-col items-center justify-center gap-1.5 transition-all ${disabled ? 'opacity-40 cursor-not-allowed' : 'hover:border-albion-accent hover:bg-albion-800'} min-h-[118px]">
          ${item
            ? `<img src="${bmIconUrl(item, 96)}" alt="${name}" class="w-14 h-14 object-contain drop-shadow-lg" onerror="${bmImgErr()}">
               <span class="text-[11px] font-bold text-white text-center leading-tight line-clamp-2">${name}</span>
               <span class="text-[10px] font-black text-albion-accent tracking-wider">${bmLabel(item)}</span>
               ${item.skills && item.skills.length ? `<span class="flex gap-0.5 mt-0.5">${item.skills.slice(0, 4).map((s, i) => `<img src="https://render.albiononline.com/v1/spell/${encodeURIComponent(s)}.png?count=1&quality=1" alt="${['Q', 'W', 'E', 'P'][i] || ''}" title="${s}" class="w-4 h-4 object-contain opacity-90" loading="lazy" onerror="this.style.display='none'">`).join('')}</span>` : ''}`
            : `<i class="fa-solid ${def.icon} text-2xl text-gray-600 mb-1"></i>
               <span class="text-[11px] font-bold text-gray-500">${def.label}</span>
               <span class="text-[10px] text-gray-600">+ Ekle</span>`}
        </button>
        ${item ? `<button data-bm-clear="${def.key}" title="Kaldır" class="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-red-600 hover:bg-red-500 text-white text-[11px] font-black shadow-lg flex items-center justify-center">×</button>` : ''}
        ${disabled ? `<div class="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-orange-400 pointer-events-none">2H silah → sol el kapalı</div>` : ''}
      </div>`;
  }).join('');

  const saved = bmSaved();
  const savedHtml = saved.length
    ? saved.map((b, i) => `
        <div class="flex items-center gap-2 bg-[#0a0d14] border border-gray-700 rounded-lg px-2.5 py-2">
          <div class="min-w-0 flex-1">
            <div class="text-xs font-bold text-white truncate">${b.name || 'İsimsiz Build'}</div>
            <div class="text-[10px] text-gray-500">${b.role || 'PvP'} · ${Object.values(b.slots || {}).filter(Boolean).length} eşya · ${new Date(b.at || Date.now()).toLocaleDateString('tr-TR')}</div>
          </div>
          <button data-bm-load="${i}" class="text-[10px] font-bold bg-albion-800 hover:bg-albion-700 border border-gray-600 text-gray-200 px-2 py-1 rounded">Yükle</button>
          <button data-bm-del="${i}" class="text-[10px] font-bold bg-red-900/40 hover:bg-red-900/70 border border-red-700/50 text-red-300 px-2 py-1 rounded">Sil</button>
        </div>`).join('')
    : `<div class="text-[11px] text-gray-500 text-center py-4">Henüz kayıtlı build yok.</div>`;

  app.innerHTML = `
    <div class="max-w-6xl mx-auto animate-fade-in">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-5">
        <div>
          <h2 class="text-2xl font-bold text-white mb-1"><i class="fa-solid fa-screwdriver-wrench mr-2 text-albion-accent"></i>Build Oluşturucu</h2>
          <p class="text-gray-400 text-sm max-w-2xl">Kendi setini kur: slota tıkla, eşyayı ara, tier ve enchant seç. Ortalama IP anında hesaplanır; build'i kaydedebilir veya bağlantıyla paylaşabilirsin.</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <button id="bmSaveBtn" class="bg-albion-accent hover:brightness-110 text-black px-4 py-2.5 rounded-lg font-black text-sm uppercase tracking-wide flex items-center"><i class="fa-solid fa-floppy-disk mr-2"></i>Kaydet</button>
          <button id="bmShareBtn" class="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-lg font-black text-sm uppercase tracking-wide flex items-center"><i class="fa-solid fa-link mr-2"></i>Paylaş</button>
          <button id="bmCopyBtn" class="bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-200 px-4 py-2.5 rounded-lg font-black text-sm uppercase tracking-wide flex items-center"><i class="fa-solid fa-copy mr-2"></i>Metin</button>
          <button id="bmResetBtn" class="bg-red-900/40 hover:bg-red-900/70 border border-red-700/50 text-red-300 px-4 py-2.5 rounded-lg font-black text-sm uppercase tracking-wide flex items-center"><i class="fa-solid fa-trash mr-2"></i>Temizle</button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div class="lg:col-span-2 space-y-4">
          <div class="grid grid-cols-3 gap-2.5">${slotCards}</div>
        </div>

        <aside class="space-y-4">
          <div class="bg-albion-800 border border-gray-700 rounded-xl p-4 shadow-lg">
            <div class="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Build Özeti</div>
            <label class="block text-[11px] font-bold text-gray-400 mb-1">Build Adı</label>
            <input id="bmName" type="text" maxlength="40" value="${(bmState.name || '').replace(/"/g, '&quot;')}" placeholder="Örn: 2H Claymore Solo" class="w-full bg-albion-900 border border-gray-600 rounded-lg p-2.5 text-white text-sm focus:border-albion-accent outline-none mb-3">
            <label class="block text-[11px] font-bold text-gray-400 mb-1">Amaç</label>
            <select id="bmRole" class="w-full bg-albion-900 border border-gray-600 rounded-lg p-2.5 text-white text-sm focus:border-albion-accent outline-none mb-4">
              ${['PvP', 'PvE', 'ZvZ', 'Ganking', 'Mists', 'Avalon'].map((r) => `<option value="${r}" ${bmState.role === r ? 'selected' : ''}>${r}</option>`).join('')}
            </select>
            <div class="grid grid-cols-2 gap-2">
              <div class="bg-[#0a0d14] border border-gray-700 rounded-lg p-3">
                <div class="text-[9px] font-black text-gray-500 uppercase tracking-widest">Ort. IP</div>
                <div class="text-xl font-black ${ip ? 'text-albion-accent' : 'text-gray-600'}">${ip || '—'}</div>
              </div>
              <div class="bg-[#0a0d14] border border-gray-700 rounded-lg p-3">
                <div class="text-[9px] font-black text-gray-500 uppercase tracking-widest">Eşya</div>
                <div class="text-xl font-black text-white">${bmEquippedCount()}<span class="text-xs text-gray-500"> / ${BM_SLOTS.length}</span></div>
              </div>
            </div>
            <p class="text-[10px] text-gray-500 mt-3 leading-relaxed">IP değeri tier ve enchant üzerinden tahminidir (T4+300, her tier +100, her enchant +100); oyun içi ustalık ve kalite bonuslarını içermez.</p>
          </div>

          <div class="bg-albion-800 border border-gray-700 rounded-xl p-4 shadow-lg">
            <div class="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3"><i class="fa-solid fa-bookmark mr-1.5"></i>Kayıtlı Buildlerim</div>
            <div class="space-y-2 max-h-[260px] overflow-y-auto custom-scroll" id="bmSavedList">${savedHtml}</div>
          </div>
        </aside>
      </div>
    </div>

    <div id="bmPicker" class="hidden fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-3">
      <div class="bg-albion-800 border border-gray-700 rounded-xl w-full max-w-3xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        <div class="flex items-center justify-between px-4 py-3 border-b border-gray-700 bg-[#0a0d14]">
          <div class="text-sm font-black text-white uppercase tracking-widest"><i class="fa-solid fa-list mr-2 text-albion-accent"></i><span id="bmPickerTitle">Eşya Seç</span></div>
          <button id="bmPickerClose" class="text-gray-400 hover:text-white text-lg font-black px-2">✕</button>
        </div>
        <div class="p-3 border-b border-gray-700 flex flex-col sm:flex-row gap-2">
          <input id="bmSearch" type="text" placeholder="Eşya ara..." class="flex-1 bg-albion-900 border border-gray-600 rounded-lg p-2.5 text-white text-sm focus:border-albion-accent outline-none">
          <div class="flex gap-2">
            <select id="bmTier" class="bg-albion-900 border border-gray-600 rounded-lg p-2.5 text-white text-sm font-bold outline-none"></select>
            <select id="bmEnchant" class="bg-albion-900 border border-gray-600 rounded-lg p-2.5 text-white text-sm font-bold outline-none"></select>
          </div>
        </div>
        <div id="bmList" class="flex-1 overflow-y-auto custom-scroll p-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2"></div>
      </div>
    </div>

    <div id="bmToast" class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[999] px-4 py-2.5 rounded-lg font-bold text-sm shadow-2xl" style="opacity:0;pointer-events:none"></div>
  `;

  bmBind();
}

function bmBind() {
  document.querySelectorAll('[data-bm-slot]').forEach((btn) => {
    btn.addEventListener('click', () => bmOpenPicker(btn.getAttribute('data-bm-slot') as string));
  });
  document.querySelectorAll('[data-bm-clear]').forEach((btn) => {
    btn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      const key = btn.getAttribute('data-bm-clear') as string;
      bmState.slots[key] = null;
      bmRender();
    });
  });
  document.querySelectorAll('[data-bm-load]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const list = bmSaved();
      const b = list[Number(btn.getAttribute('data-bm-load'))];
      if (!b) return;
      bmState = { v: 1, name: b.name || '', role: b.role || 'PvP', slots: { ...bmEmpty().slots, ...(b.slots || {}) } };
      bmRender();
      bmToast('Build yüklendi.');
    });
  });
  document.querySelectorAll('[data-bm-del]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const list = bmSaved();
      list.splice(Number(btn.getAttribute('data-bm-del')), 1);
      bmWriteSaved(list);
      bmRender();
      bmToast('Build silindi.');
    });
  });

  const nameInput = document.getElementById('bmName') as HTMLInputElement | null;
  if (nameInput) nameInput.addEventListener('input', () => { bmState.name = nameInput.value; });
  const roleSel = document.getElementById('bmRole') as HTMLSelectElement | null;
  if (roleSel) roleSel.addEventListener('change', () => { bmState.role = roleSel.value; });

  document.getElementById('bmSaveBtn')?.addEventListener('click', () => {
    const list = bmSaved();
    const entry = { name: bmState.name || 'İsimsiz Build', role: bmState.role, slots: bmState.slots, at: Date.now() };
    const idx = list.findIndex((b) => b.name === entry.name);
    if (idx >= 0) list[idx] = entry; else list.unshift(entry);
    bmWriteSaved(list);
    bmRender();
    bmToast('Build kaydedildi.');
  });

  document.getElementById('bmShareBtn')?.addEventListener('click', async () => {
    if (!bmEquippedCount()) { bmToast('Önce en az bir eşya seç.', false); return; }
    const url = `${location.origin}${location.pathname}#build=${bmEncode(bmState)}`;
    try {
      await navigator.clipboard.writeText(url);
      bmToast('Paylaşım bağlantısı kopyalandı.');
    } catch (_) {
      window.prompt('Bağlantıyı kopyala:', url);
    }
    history.replaceState(null, '', `#build=${bmEncode(bmState)}`);
  });

  document.getElementById('bmCopyBtn')?.addEventListener('click', async () => {
    if (!bmEquippedCount()) { bmToast('Önce en az bir eşya seç.', false); return; }
    const lines = [`${bmState.name || 'Build'} (${bmState.role}) · Ort. IP ${bmAvgIp()}`];
    BM_SLOTS.forEach((def) => {
      const item = bmState.slots[def.key];
      if (!item) return;
      const dbItem = bmItemDb().find((i) => i.id === item.itemId);
      lines.push(`${def.label}: ${bmFullId(item)} — ${bmName(dbItem)}`);
    });
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      bmToast('Build metni kopyalandı.');
    } catch (_) {
      window.prompt('Build metni:', lines.join('\n'));
    }
  });

  document.getElementById('bmResetBtn')?.addEventListener('click', () => {
    bmState = bmEmpty();
    bmRender();
    bmToast('Build temizlendi.');
  });

  document.getElementById('bmPickerClose')?.addEventListener('click', bmClosePicker);
  document.getElementById('bmPicker')?.addEventListener('click', (ev) => {
    if (ev.target && (ev.target as HTMLElement).id === 'bmPicker') bmClosePicker();
  });

  const search = document.getElementById('bmSearch') as HTMLInputElement | null;
  if (search) {
    search.addEventListener('input', () => bmRenderList(search.value));
    search.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') {
        const first = document.querySelector('#bmList [data-bm-pick]') as HTMLElement | null;
        if (first) first.click();
      }
    });
  }

  const tierSel = document.getElementById('bmTier') as HTMLSelectElement | null;
  if (tierSel) {
    tierSel.addEventListener('change', () => {
      bmPickerTier = Number(tierSel.value) || 6;
      bmRenderList((document.getElementById('bmSearch') as HTMLInputElement)?.value || '');
    });
  }
  const enchSel = document.getElementById('bmEnchant') as HTMLSelectElement | null;
  if (enchSel) {
    enchSel.addEventListener('change', () => {
      bmPickerEnchant = Number(enchSel.value) || 0;
      bmRenderList((document.getElementById('bmSearch') as HTMLInputElement)?.value || '');
    });
  }
}

function bmOpenPicker(slotKey: string) {
  bmPickerSlot = slotKey;
  const def = bmSlotDef(slotKey);
  const overlay = document.getElementById('bmPicker');
  if (!overlay) return;
  overlay.classList.remove('hidden');

  const title = document.getElementById('bmPickerTitle');
  if (title) title.textContent = `${def.label} Seç`;

  const existing = bmState.slots[slotKey];
  bmPickerTier = existing ? existing.tier : 6;
  bmPickerEnchant = existing ? existing.enchant : 0;

  const tierSel = document.getElementById('bmTier') as HTMLSelectElement | null;
  if (tierSel) {
    tierSel.innerHTML = [4, 5, 6, 7, 8].map((t) => `<option value="${t}" ${t === bmPickerTier ? 'selected' : ''}>T${t}</option>`).join('');
  }
  const enchSel = document.getElementById('bmEnchant') as HTMLSelectElement | null;
  if (enchSel) {
    enchSel.disabled = !def.enchantable;
    enchSel.innerHTML = [0, 1, 2, 3, 4].map((e) => `<option value="${e}" ${e === bmPickerEnchant ? 'selected' : ''}>${e === 0 ? 'Enchant yok' : '.' + e}</option>`).join('');
  }

  const search = document.getElementById('bmSearch') as HTMLInputElement | null;
  if (search) { search.value = ''; search.focus(); }

  bmRenderList('');
}

function bmClosePicker() {
  document.getElementById('bmPicker')?.classList.add('hidden');
  bmPickerSlot = null;
}

function bmRenderList(query: string) {
  if (!bmPickerSlot) return;
  const list = document.getElementById('bmList');
  if (!list) return;

  const def = bmSlotDef(bmPickerSlot);
  const q = (query || '').toLocaleLowerCase('tr');
  const pool = bmPoolsFor()[bmPickerSlot] || [];

  const rows = pool
    .filter((it) => {
      if (!q) return true;
      return bmName(it).toLocaleLowerCase('tr').includes(q) || String(it.id).toLocaleLowerCase('tr').includes(q);
    })
    .filter((it) => (it.tiers || []).includes(bmPickerTier))
    .slice(0, 120);

  if (!rows.length) {
    list.innerHTML = `<div class="col-span-full text-center text-gray-500 text-sm py-8">Eşya bulunamadı — arama terimini veya tier'ı değiştir.</div>`;
    return;
  }

  list.innerHTML = rows.map((it) => {
    const slot: SlotItem = { itemId: it.id, tier: bmPickerTier, enchant: def.enchantable ? bmPickerEnchant : 0 };
    return `
      <button data-bm-pick="${it.id}" class="bg-[#0a0d14] border border-gray-700 hover:border-albion-accent rounded-lg p-2 flex flex-col items-center gap-1 transition-colors">
        <img src="${bmIconUrl(slot, 64)}" alt="${bmName(it)}" class="w-10 h-10 object-contain" onerror="${bmImgErr()}">
        <span class="text-[10px] font-bold text-gray-200 text-center leading-tight line-clamp-2">${bmName(it)}</span>
        <span class="text-[9px] font-black text-albion-accent">${bmLabel(slot)}</span>
      </button>`;
  }).join('');

  list.querySelectorAll('[data-bm-pick]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-bm-pick') as string;
      if (!bmPickerSlot) return;
      bmState.slots[bmPickerSlot] = {
        itemId: id,
        tier: bmPickerTier,
        enchant: bmSlotDef(bmPickerSlot).enchantable ? bmPickerEnchant : 0
      };
      bmClosePicker();
      bmRender();
    });
  });
}

function bmLoadFromHash(): boolean {
  const m = location.hash.match(/build=([A-Za-z0-9\-_]+)/);
  if (!m) return false;
  const parsed = bmDecode(m[1]);
  if (!parsed) return false;
  bmState = parsed;
  return true;
}

function initBuildMaker() {
  const app = document.getElementById('buildMakerApp');
  if (!app) return;

  bmLoadFromHash();
  bmRender();

  const btnMaker = document.getElementById('btnAiMaker');
  const viewMaker = document.getElementById('aiViewMaker');
  const btnPersonal = document.getElementById('btnAiPersonal');
  const btnGroup = document.getElementById('btnAiGroup');
  const viewPersonal = document.getElementById('aiViewPersonal');
  const viewGroup = document.getElementById('aiViewGroup');
  const resultDiv = document.getElementById('aiBuildResult');

  const activate = () => {
    [btnPersonal, btnGroup, btnMaker].forEach((b) => {
      if (!b) return;
      b.classList.remove('bg-albion-accent', 'text-black');
      b.classList.add('bg-transparent', 'text-gray-400');
    });
    btnMaker?.classList.remove('bg-transparent', 'text-gray-400');
    btnMaker?.classList.add('bg-albion-accent', 'text-black');
    viewPersonal?.classList.add('hidden');
    viewGroup?.classList.add('hidden');
    resultDiv?.classList.add('hidden');
    viewMaker?.classList.remove('hidden');
  };

  btnMaker?.addEventListener('click', activate);

  [btnPersonal, btnGroup].forEach((btn) => {
    btn?.addEventListener('click', () => {
      viewMaker?.classList.add('hidden');
    });
  });

  if (location.hash.includes('build=')) activate();
}

/* ─── Dışa açılan API ────────────────────────────────────
   Build Kütüphanesi'nden gelen hazır setleri oluşturucuya aktarır.
   Yetenekler (Q/W/E/pasif) kütüphane verisinden gelir ve yalnızca
   görüntülenir; düzenlenebilir yetenek seçimi henüz yok. */
function bmSeed(payload: any) {
  if (!payload || typeof payload !== 'object') return false;

  const next: Build = bmEmpty();
  next.name = String(payload.name || '').slice(0, 40);
  const role = String(payload.role || '');
  const roleMap: Record<string, string> = {
    'PvP': 'PvP', 'PvE': 'PvE', 'ZvZ': 'ZvZ', 'Ganking': 'Ganking', 'Mists': 'Mists', 'Avalon': 'Avalon'
  };
  if (roleMap[role]) next.role = roleMap[role];
  else if (/zvz/i.test(role)) next.role = 'ZvZ';
  else if (/mists/i.test(role)) next.role = 'Mists';
  else if (/gank/i.test(role)) next.role = 'Ganking';
  else if (/avalon|hce|farm|dungeon|pve/i.test(role)) next.role = 'PvE';

  const slots = payload.slots && typeof payload.slots === 'object' ? payload.slots : {};
  Object.keys(slots).forEach((key) => {
    const raw = slots[key];
    if (!raw || !raw.itemId) return;
    const tier = Number(raw.tier) || 6;
    const enchant = Number(raw.enchant) || 0;
    next.slots[key] = {
      itemId: String(raw.itemId),
      tier,
      enchant,
      skills: Array.isArray(raw.skills) ? raw.skills.filter((s: any) => typeof s === 'string') : []
    };
  });

  // Veri setinde binek yok; varsa mevcut binek korunur.
  bmState = next;
  const btn = document.getElementById('btnAiMaker') as HTMLElement | null;
  btn?.click();
  bmRender();
  bmToast('Build oluşturucuya aktarıldı — düzenleyip kaydedebilirsin.', true);
  return true;
}

(window as any).AOTBuildMaker = {
  seed: bmSeed,
  get: () => bmState,
  render: bmRender
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBuildMaker);
} else {
  initBuildMaker();
}
