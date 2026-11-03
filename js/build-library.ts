/**
 * Build Kütüphanesi — gerçek topluluk build'leri.
 *
 * Veri: data/builds-library.json (scripts/builds-fetcher.cjs üretir; kaynak
 * albiononlinegrind.com — herkese açık SSR build sayfaları). Her kayıtta
 * silah/zırh/ayakkabı/pelerin/binek? dahil tüm slotlar, Q/W/E/pasif yetenek
 * ID'leri ve alternatif eşyalar bulunur.
 *
 * Arayüz: kategori/silah/arama/sıralama filtreleri, sayfalama, eşya ızgarası,
 * yetenek rozetleri, kaynak bağlantısı ve "Oluşturucuya Yükle" aktarımı.
 */

type LibItem = { id: string; base: string; tier: number | null; ench: number; skills?: string[] };
type LibBuild = {
  id: string;
  slug: string;
  title: string;
  weaponName: string;
  category: string;
  author: string;
  tags: string[];
  upvotes: number;
  createdAt: string;
  updatedAt: string;
  url: string;
  source: string;
  description: string;
  items: Record<string, LibItem | null>;
  alt: Record<string, LibItem>;
  alts: Record<string, LibItem[]>;
};
type LibPayload = {
  fetchedAt: string;
  source: string;
  sourceUrl: string;
  count: number;
  categories: Record<string, number>;
  builds: LibBuild[];
};

const BL_SLOT_ORDER = ['weapon', 'offhand', 'head', 'chest', 'boots', 'cape', 'food', 'potion'];
const BL_SLOT_LABEL: Record<string, string> = {
  weapon: 'Silah', offhand: 'Sol El', head: 'Kask', chest: 'Göğüslük',
  boots: 'Ayakkabı', cape: 'Pelerin', food: 'Yemek', potion: 'İksir'
};
const BL_CATEGORY_LABEL: Record<string, string> = {
  FAME_FARM_SOLO: 'Fame Farm (Solo)',
  FAME_FARM_GROUP: 'Fame Farm (Grup)',
  FAME_FARM_GROUP_AVALON: 'Avalon Fame Farm',
  MISTS_SOLO: 'Mists (Solo)',
  MISTS_DUO: 'Mists (Duo)',
  OPEN_WORLD: 'Açık Dünya',
  GANK_SOLO: 'Gank (Solo)',
  GANK_DUO: 'Gank (Duo)',
  GANK_GROUP: 'Gank (Grup)',
  SMALL_SCALE: 'Küçük Ölçekli PvP',
  ZVZ: 'ZvZ',
  CRYSTAL_ARENA: 'Kristal Arena',
  CRYSTAL_ARENA_1V1: 'Kristal Arena 1v1',
  CRYSTAL_CREATURES: 'Kristal Yaratıklar',
  HELLGATE_2V2: 'Hellgate 2v2',
  HELLGATE_5V5: 'Hellgate 5v5',
  HELLGATE_10V10: 'Hellgate 10v10',
  CORRUPTED_DUNGEON: 'Bozuk Zindan',
  ABYSSAL_DEPTHS_2V2: 'Abyssal Depths 2v2',
  ABYSSAL_DEPTHS_3V3: 'Abyssal Depths 3v3',
  HCE: 'HCE',
  WORLD_BOSS: 'Dünya Boss',
  BOMB_SQUAD: 'Bomb Squad',
  TRACKING_SOLO: 'İz Sürme (Solo)',
  TRACKING_GROUP: 'İz Sürme (Grup)',
  GATHERING: 'Toplayıcılık',
  OFF_META: 'Off-Meta'
};

let blData: LibPayload | null = null;
let blLoading: Promise<LibPayload | null> | null = null;
let blShown = 0;
const BL_PAGE = 24;
let blFilters = { q: '', category: 'ALL', weapon: '', sort: 'popular' };

function blEsc(value: any): string {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function blItemName(base: string): string {
  const items = (window as any).AO_ITEMS;
  if (!Array.isArray(items)) return base;
  const hit = items.find((i: any) => i && i.id === base);
  return hit ? (hit.tr || hit.en || base) : base;
}

function blIcon(item: LibItem | null, size = 64): string {
  if (!item) return '';
  const cache = (window as any).albionImageCache;
  if (cache && typeof cache.getItemUrl === 'function') {
    try { return cache.getItemUrl(item.base, 1, size); } catch (_) {}
  }
  return `https://render.albiononline.com/v1/item/${encodeURIComponent(item.id)}.png?count=1&quality=1`;
}

function blSpellIcon(spell: string): string {
  return `https://render.albiononline.com/v1/spell/${encodeURIComponent(spell)}.png?count=1&quality=1`;
}

function blDate(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function blCategoryName(key: string): string {
  return BL_CATEGORY_LABEL[key] || key.replace(/_/g, ' ');
}

async function blLoad(): Promise<LibPayload | null> {
  if (blData) return blData;
  if (blLoading) return blLoading;
  blLoading = (async () => {
    try {
      const res = await fetch('data/builds-library.json', { cache: 'no-cache' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as LibPayload;
      if (!json || !Array.isArray(json.builds)) throw new Error('geçersiz veri');
      blData = json;
      return json;
    } catch (error: any) {
      console.warn('[build-library] veri yüklenemedi:', error?.message || error);
      return null;
    } finally {
      blLoading = null;
    }
  })();
  return blLoading;
}

function blFiltered(): LibBuild[] {
  if (!blData) return [];
  const q = blFilters.q.trim().toLowerCase();
  let list = blData.builds.filter((b) => {
    if (blFilters.category !== 'ALL' && b.category !== blFilters.category) return false;
    if (blFilters.weapon && b.items.weapon?.base !== blFilters.weapon) return false;
    if (!q) return true;
    const hay = [b.title, b.weaponName, b.author, blCategoryName(b.category), ...(b.tags || [])]
      .join(' ')
      .toLowerCase();
    return hay.includes(q);
  });
  if (blFilters.sort === 'new') {
    list = list.slice().sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
  } else if (blFilters.sort === 'name') {
    list = list.slice().sort((a, b) => a.title.localeCompare(b.title));
  }
  return list;
}

function blSkillChips(build: LibBuild): string {
  const weapon = build.items.weapon;
  if (!weapon || !weapon.skills || !weapon.skills.length) return '';
  const letters = ['Q', 'W', 'E', 'P'];
  return weapon.skills.map((skill, index) => {
    const label = letters[index] || '•';
    return `<span class="bl-skill" title="${blEsc(skill)}">
      <img src="${blSpellIcon(skill)}" alt="${blEsc(label)}" loading="lazy" onerror="this.style.display='none'">
      <b>${label}</b>
    </span>`;
  }).join('');
}

function blGearRow(build: LibBuild): string {
  return BL_SLOT_ORDER.map((slot) => {
    const item = build.items[slot];
    if (!item) return '';
    const tier = item.tier ? `T${item.tier}${item.ench ? '.' + item.ench : ''}` : '';
    return `<div class="bl-gear-item" title="${blEsc(blItemName(item.base))} ${tier}">
      <img src="${blIcon(item)}" alt="${blEsc(blItemName(item.base))}" loading="lazy" onerror="this.style.visibility='hidden'">
      <span>${tier}</span>
    </div>`;
  }).join('');
}

function blDetail(build: LibBuild): string {
  const rows = BL_SLOT_ORDER.filter((slot) => build.items[slot]).map((slot) => {
    const item = build.items[slot]!;
    const alt = build.alt[slot];
    const altText = alt ? `<span class="bl-alt">alternatif: ${blEsc(blItemName(alt.base))}</span>` : '';
    const skills = (item.skills || []).length
      ? `<span class="bl-detail-skills">${item.skills!.map((s) => `<code>${blEsc(s)}</code>`).join('')}</span>`
      : '';
    return `<div class="bl-detail-row">
      <span class="bl-detail-slot">${BL_SLOT_LABEL[slot] || slot}</span>
      <span class="bl-detail-name">${blEsc(blItemName(item.base))} ${altText}</span>
      ${skills}
    </div>`;
  }).join('');

  const altFood = (build.alts?.food || []).map((f) => blEsc(blItemName(f.base))).join(', ');
  const altPotion = (build.alts?.potion || []).map((p) => blEsc(blItemName(p.base))).join(', ');
  const altLine = [altFood ? `Yemek alternatifi: ${altFood}` : '', altPotion ? `İksir alternatifi: ${altPotion}` : '']
    .filter(Boolean).join(' • ');

  return `<div class="bl-detail">
    ${rows}
    ${altLine ? `<div class="bl-detail-alt">${altLine}</div>` : ''}
    ${build.description ? `<p class="bl-detail-desc">${blEsc(build.description)}</p>` : ''}
  </div>`;
}

function blCard(build: LibBuild): string {
  const updated = blDate(build.updatedAt);
  return `<article class="bl-card" data-slug="${blEsc(build.slug)}">
    <div class="bl-card-head">
      <div>
        <h3 class="bl-title">${blEsc(build.title)}</h3>
        <div class="bl-meta">
          <span class="bl-cat">${blEsc(blCategoryName(build.category))}</span>
          <span class="bl-author">${blEsc(build.author || 'topluluk')}</span>
          ${updated ? `<span class="bl-updated">${updated}</span>` : ''}
        </div>
      </div>
      <div class="bl-votes" title="Topluluk oyu"><i class="fa-solid fa-arrow-up"></i> ${build.upvotes}</div>
    </div>
    <div class="bl-gear">${blGearRow(build)}</div>
    <div class="bl-skills">${blSkillChips(build)}</div>
    <div class="bl-actions">
      <button class="bl-btn" data-act="detail">Detay</button>
      <button class="bl-btn bl-btn-primary" data-act="load"><i class="fa-solid fa-screwdriver-wrench"></i> Oluşturucuya Yükle</button>
      <a class="bl-link" href="${blEsc(build.url)}" target="_blank" rel="noopener noreferrer">kaynak ↗</a>
    </div>
    <div class="bl-detail-wrap hidden"></div>
  </article>`;
}

function blRenderGrid() {
  const grid = document.getElementById('buildLibraryGrid');
  if (!grid) return;
  const list = blFiltered();
  const slice = list.slice(0, blShown);
  grid.innerHTML = slice.map(blCard).join('') ||
    `<div class="bl-empty">Bu filtreyle build bulunamadı. Filtreleri temizleyip tekrar deneyin.</div>`;

  const more = document.getElementById('buildLibraryMore') as HTMLElement | null;
  if (more) {
    more.classList.toggle('hidden', slice.length >= list.length);
    more.textContent = `${Math.min(BL_PAGE, list.length - slice.length)} build daha göster (${slice.length}/${list.length})`;
  }
  const count = document.getElementById('buildLibraryCount');
  if (count) count.textContent = `${list.length} build`;
}

function blRenderSummary() {
  const meta = document.getElementById('buildLibraryMeta');
  if (!meta || !blData) return;
  const stamp = blData.fetchedAt ? new Date(blData.fetchedAt).toLocaleString('tr-TR') : '—';
  meta.innerHTML = `<i class="fa-solid fa-database"></i>
    <strong>${blData.count}</strong> doğrulanmış build ·
    ${Object.keys(blData.categories || {}).length} içerik türü ·
    son senkron: <strong>${blEsc(stamp)}</strong> ·
    kaynak: <a href="${blEsc(blData.sourceUrl)}" target="_blank" rel="noopener noreferrer">${blEsc(blData.source)}</a>`;
}

function blFillFilters() {
  const catSelect = document.getElementById('buildLibraryCategory') as HTMLSelectElement | null;
  if (catSelect && blData) {
    const entries = Object.entries(blData.categories || {}).sort((a, b) => b[1] - a[1]);
    catSelect.innerHTML = `<option value="ALL">Tüm içerikler (${blData.count})</option>` +
      entries.map(([key, n]) => `<option value="${blEsc(key)}">${blEsc(blCategoryName(key))} (${n})</option>`).join('');
  }
  const weaponSelect = document.getElementById('buildLibraryWeapon') as HTMLSelectElement | null;
  if (weaponSelect && blData) {
    const map = new Map<string, { name: string; n: number }>();
    blData.builds.forEach((b) => {
      const w = b.items.weapon;
      if (!w) return;
      const entry = map.get(w.base) || { name: b.weaponName || blItemName(w.base), n: 0 };
      entry.n += 1;
      map.set(w.base, entry);
    });
    const options = [...map.entries()].sort((a, b) => b[1].n - a[1].n)
      .map(([base, info]) => `<option value="${blEsc(base)}">${blEsc(info.name)} (${info.n})</option>`).join('');
    weaponSelect.innerHTML = `<option value="">Tüm silahlar</option>${options}`;
  }
}

function blTransfer(build: LibBuild) {
  const seed: Record<string, any> = {};
  BL_SLOT_ORDER.forEach((slot) => {
    const item = build.items[slot];
    if (!item || !item.tier) return;
    // Oluşturucu 'shoes' anahtarını kullanıyor; kütüphane 'boots' diyor.
    const targetSlot = slot === 'boots' ? 'shoes' : slot;
    seed[targetSlot] = { itemId: item.base, tier: item.tier, enchant: item.ench || 0, skills: item.skills || [] };
  });
  const maker = (window as any).AOTBuildMaker;
  if (maker && typeof maker.seed === 'function') {
    maker.seed({ name: build.title, role: blCategoryName(build.category), slots: seed, source: build.url });
    return;
  }
  // Yedek yol: sekme açık değilse hash üzerinden aktar.
  (window as any).AOT_BUILD_SEED = seed;
}

function blBind() {
  const search = document.getElementById('buildLibrarySearch') as HTMLInputElement | null;
  search?.addEventListener('input', () => {
    blFilters.q = search.value;
    blShown = BL_PAGE;
    blRenderGrid();
  });

  const cat = document.getElementById('buildLibraryCategory') as HTMLSelectElement | null;
  cat?.addEventListener('change', () => {
    blFilters.category = cat.value;
    blShown = BL_PAGE;
    blRenderGrid();
  });

  const weapon = document.getElementById('buildLibraryWeapon') as HTMLSelectElement | null;
  weapon?.addEventListener('change', () => {
    blFilters.weapon = weapon.value;
    blShown = BL_PAGE;
    blRenderGrid();
  });

  const sort = document.getElementById('buildLibrarySort') as HTMLSelectElement | null;
  sort?.addEventListener('change', () => {
    blFilters.sort = sort.value;
    blRenderGrid();
  });

  document.getElementById('buildLibraryMore')?.addEventListener('click', () => {
    blShown += BL_PAGE;
    blRenderGrid();
  });

  document.getElementById('buildLibraryGrid')?.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const card = target.closest('.bl-card') as HTMLElement | null;
    if (!card || !blData) return;
    const build = blData.builds.find((b) => b.slug === card.dataset.slug);
    if (!build) return;
    const action = target.closest('[data-act]')?.getAttribute('data-act');
    if (action === 'detail') {
      const wrap = card.querySelector('.bl-detail-wrap') as HTMLElement | null;
      if (!wrap) return;
      if (wrap.classList.contains('hidden')) {
        wrap.innerHTML = blDetail(build);
        wrap.classList.remove('hidden');
        target.textContent = 'Kapat';
      } else {
        wrap.classList.add('hidden');
        wrap.innerHTML = '';
        target.textContent = 'Detay';
      }
    } else if (action === 'load') {
      blTransfer(build);
    }
  });
}

async function initBuildLibrary() {
  const app = document.getElementById('buildLibraryApp');
  if (!app) return;
  if (app.dataset.ready === '1') return;
  app.dataset.ready = '1';

  const data = await blLoad();
  if (!data) {
    app.innerHTML = `<div class="bl-empty">Build kütüphanesi yüklenemedi. Veri dosyası (data/builds-library.json) eksik ya da bozuk olabilir.</div>`;
    return;
  }

  app.innerHTML = `
    <div class="bl-head">
      <div>
        <h2 class="bl-h2"><i class="fa-solid fa-layer-group"></i> Build Kütüphanesi</h2>
        <p class="bl-sub">Grup içeriklerinden ZvZ'ye, ganktan HCE'ye kadar topluluk build'leri — yetenekleriyle birlikte. Her build'i tek tıkla kendi oluşturucumuza aktarabilirsin.</p>
      </div>
      <div class="bl-sync" id="buildLibraryMeta"></div>
    </div>
    <div class="bl-controls">
      <input id="buildLibrarySearch" type="search" placeholder="Build, silah veya yazar ara..." autocomplete="off">
      <select id="buildLibraryCategory"><option value="ALL">Tüm içerikler</option></select>
      <select id="buildLibraryWeapon"><option value="">Tüm silahlar</option></select>
      <select id="buildLibrarySort">
        <option value="popular">Popülerlik</option>
        <option value="new">Son güncellenen</option>
        <option value="name">İsim (A-Z)</option>
      </select>
      <span class="bl-count" id="buildLibraryCount"></span>
    </div>
    <div class="bl-grid" id="buildLibraryGrid"></div>
    <button id="buildLibraryMore" class="bl-more hidden">Daha fazla göster</button>
  `;

  blFillFilters();
  blRenderSummary();
  blShown = BL_PAGE;
  blRenderGrid();
  blBind();
}

function initBuildLibraryTab() {
  const btn = document.getElementById('btnAiLibrary');
  const view = document.getElementById('aiViewLibrary');
  const makerView = document.getElementById('aiViewMaker');
  const personalView = document.getElementById('aiViewPersonal');
  const groupView = document.getElementById('aiViewGroup');
  const resultDiv = document.getElementById('aiBuildResult');

  const activate = () => {
    [document.getElementById('btnAiPersonal'), document.getElementById('btnAiGroup'),
     document.getElementById('btnAiMaker'), btn].forEach((b) => {
      if (!b) return;
      b.classList.remove('bg-albion-accent', 'text-black');
      b.classList.add('bg-transparent', 'text-gray-400');
    });
    btn?.classList.remove('bg-transparent', 'text-gray-400');
    btn?.classList.add('bg-albion-accent', 'text-black');
    [personalView, groupView, makerView, resultDiv].forEach((v) => v?.classList.add('hidden'));
    view?.classList.remove('hidden');
    void initBuildLibrary();
  };

  btn?.addEventListener('click', activate);
  [document.getElementById('btnAiPersonal'), document.getElementById('btnAiGroup'), document.getElementById('btnAiMaker')]
    .forEach((b) => b?.addEventListener('click', () => view?.classList.add('hidden')));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBuildLibraryTab);
} else {
  initBuildLibraryTab();
}

export {};
