/**
 * Meta Craft — killboard ekipman istatistiklerinden üretim önerileri.
 *
 * Veri: data/meta-craft.json (scripts/pvp-fetcher.cjs üretir; kaynak Albion
 * gameinfo /events). Sunucu başına ~300 kill taranır ve her slot için
 * "hangi eşya, hangi tier'da, yüzde kaç oranında giyilmiş" tablosu çıkarılır.
 *
 * İki taraf ayrı gösterilir:
 *   • Ölen taraf  → sahada en çok karşılaşılan (yani çok üretilip satılan) eşyalar
 *   • Öldüren taraf → meta build'lerde tercih edilen eşyalar
 *
 * Craft Önerileri sekmesinde iki tarafın ağırlıklı ortalaması ve ortalama tier
 * kullanılarak "öncelikli üretim listesi" oluşturulur.
 */

type MetaItem = {
  base: string;
  count: number;
  share: number;
  tiers: Record<string, number>;
  avgTier: number;
  avgQuality: number;
};
type MetaSlot = { total: number; items: MetaItem[] };
type MetaServer = { sampleKills: number; victim: Record<string, MetaSlot>; killer: Record<string, MetaSlot> };
type MetaPayload = { fetchedAt: string; source: string; pagesPerServer: number; servers: Record<string, MetaServer> };

const MC_SLOTS: { key: string; label: string }[] = [
  { key: 'weapon', label: 'Silah' },
  { key: 'offhand', label: 'Sol El' },
  { key: 'head', label: 'Kask' },
  { key: 'chest', label: 'Göğüslük' },
  { key: 'shoes', label: 'Ayakkabı' },
  { key: 'cape', label: 'Pelerin' },
  { key: 'food', label: 'Yemek' },
  { key: 'potion', label: 'İksir' },
];
const MC_SERVER_LABEL: Record<string, string> = { eu: 'Avrupa (EU)', us: 'Amerika (US)', asia: 'Asya (ASIA)' };

let mcData: MetaPayload | null = null;
let mcState = { server: 'eu', side: 'killer' as 'killer' | 'victim', slot: 'weapon' };

function mcEsc(v: any): string {
  return String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** Tier/enchant önekini atar: T6_2H_AXE@2 → 2H_AXE */
function mcBaseId(base: string): string {
  return String(base || '').replace(/^T\d+_/, '').replace(/@\d+$/, '');
}

function mcItemName(base: string): string {
  const items = (window as any).AO_ITEMS;
  const clean = mcBaseId(base);
  if (Array.isArray(items)) {
    const hit = items.find((i: any) => i && (i.id === base || mcBaseId(i.id) === clean));
    if (hit) return hit.tr || hit.en || base;
  }
  return clean.replace(/_/g, ' ');
}

/**
 * Eşya görseli URL'i. Meta verisinde yalnızca taban kimliği var (2H_AXE),
 * render servisi ise tam kimlik istiyor (T6_2H_AXE). Bu yüzden eşyanın
 * ortalama tieriyle başlayıp tutmayan tier'ları sırayla deniyoruz:
 * eski sürümde doğrudan "2H_AXE" isteniyordu ve tüm ikonlar 404 veriyordu.
 */
function mcIconUrls(base: string, tier?: number): string[] {
  const clean = mcBaseId(base);
  const preferred = tier && tier >= 3 && tier <= 8 ? Math.round(tier) : 0;
  const tiers = [preferred, 8, 7, 6, 5, 4, 3].filter((t, i, arr) => t >= 3 && t <= 8 && arr.indexOf(t) === i);
  return tiers.map((t) => `https://render.albiononline.com/v1/item/T${t}_${encodeURIComponent(clean)}.png?quality=1&size=64`);
}

function mcIconAttrs(base: string, tier?: number): string {
  // Ortak yardımcı (js/image-cache.ts) hem URL zincirini hem hata yedeğini kurar.
  const w = window as any;
  if (typeof w.aoItemImg === 'function') return w.aoItemImg(base, tier, 0, 64);
  const urls = mcIconUrls(base, tier);
  return `src="${urls[0]}" data-alts="${urls.slice(1).join('|')}"`;
}

function mcServer(): MetaServer | null {
  if (!mcData) return null;
  return mcData.servers[mcState.server] || mcData.servers.eu || null;
}

function mcSlot(): MetaSlot {
  const server = mcServer();
  if (!server) return { total: 0, items: [] };
  return server[mcState.side][mcState.slot] || { total: 0, items: [] };
}

function mcTierBar(item: MetaItem): string {
  const tiers = Object.keys(item.tiers).map(Number).filter((t) => t > 0).sort((a, b) => a - b);
  if (!tiers.length) return '';
  const max = Math.max(...tiers.map((t) => item.tiers[String(t)] || 0));
  return `<div class="mc-tierbar">${tiers.map((t) => {
    const n = item.tiers[String(t)] || 0;
    const height = Math.max(12, Math.round((n / max) * 100));
    return `<span class="mc-tier" title="T${t}: ${n} adet (${Math.round((n / item.count) * 100)}%)" style="height:${height}%">
      <b>T${t}</b><i>${Math.round((n / item.count) * 100)}%</i>
    </span>`;
  }).join('')}</div>`;
}

function mcRows(): string {
  const slot = mcSlot();
  if (!slot.items.length) {
    return `<div class="mc-empty">Bu slot için yeterli veri yok. Bot bir sonraki çalışmasında veriyi tazeler.</div>`;
  }
  return slot.items.slice(0, 15).map((item, index) => `
    <div class="mc-row">
      <span class="mc-rank">${index + 1}</span>
      <img class="mc-icon" ${mcIconAttrs(item.base, item.avgTier)} alt="${mcEsc(mcItemName(item.base))}" loading="lazy">
      <div class="mc-name">
        <div class="mc-title">${mcEsc(mcItemName(item.base))}</div>
        <div class="mc-sub">${mcEsc(item.base)} · ${item.count} kayıt · ort. T${item.avgTier} · kalite ${item.avgQuality}</div>
      </div>
      <div class="mc-share">
        <div class="mc-bar"><span style="width:${Math.min(100, item.share)}%"></span></div>
        <b>${item.share.toFixed(1)}%</b>
      </div>
      ${mcTierBar(item)}
    </div>`).join('');
}

/** İki tarafın ağırlıklı ortalamasıyla öncelikli üretim listesi. */
function mcCraftTargets(): { base: string; slot: string; score: number; share: number; avgTier: number; sides: string }[] {
  const server = mcServer();
  if (!server) return [];
  const acc = new Map<string, { base: string; slot: string; victim: number; killer: number; tierSum: number; tierWeight: number }>();

  (['victim', 'killer'] as const).forEach((side) => {
    for (const slot of MC_SLOTS) {
      const bucket = server[side][slot.key];
      if (!bucket) continue;
      for (const item of bucket.items) {
        const key = `${slot.key}:${item.base}`;
        const entry = acc.get(key) || { base: item.base, slot: slot.key, victim: 0, killer: 0, tierSum: 0, tierWeight: 0 };
        entry[side] += item.share;
        entry.tierSum += item.avgTier * item.count;
        entry.tierWeight += item.count;
        acc.set(key, entry);
      }
    }
  });

  return [...acc.values()]
    .map((entry) => {
      const share = entry.victim * 0.4 + entry.killer * 0.6; // meta tercihi daha ağır
      const avgTier = entry.tierWeight ? entry.tierSum / entry.tierWeight : 0;
      const sides = [entry.victim ? `ölen %${entry.victim.toFixed(1)}` : '', entry.killer ? `öldüren %${entry.killer.toFixed(1)}` : '']
        .filter(Boolean).join(' · ');
      return { base: entry.base, slot: entry.slot, share, avgTier, score: share * (0.6 + avgTier / 10), sides };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);
}

function mcCraftList(): string {
  const targets = mcCraftTargets();
  if (!targets.length) return `<div class="mc-empty">Öneri üretmek için yeterli kill verisi yok.</div>`;
  return targets.map((t, index) => {
    const slotLabel = MC_SLOTS.find((s) => s.key === t.slot)?.label || t.slot;
    return `<div class="mc-craft-row">
      <span class="mc-rank">${index + 1}</span>
      <img class="mc-icon" ${mcIconAttrs(t.base, t.avgTier)} alt="${mcEsc(mcItemName(t.base))}" loading="lazy">
      <div class="mc-name">
        <div class="mc-title">${mcEsc(mcItemName(t.base))}</div>
        <div class="mc-sub">${slotLabel} · ${t.sides} · ort. T${t.avgTier.toFixed(1)}</div>
      </div>
      <span class="mc-score" title="Kullanım oranı × ortalama tier">${t.score.toFixed(1)}</span>
    </div>`;
  }).join('');
}

function mcRender() {
  const app = document.getElementById('metaCraftApp');
  if (!app || !mcData) return;
  const server = mcServer();
  const slot = mcSlot();
  const stamp = mcData.fetchedAt ? new Date(mcData.fetchedAt).toLocaleString('tr-TR') : '—';

  app.innerHTML = `
    <div class="mc-wrap">
      <div class="mc-head">
        <div>
          <h3><i class="fa-solid fa-flask-vial"></i> Meta Craft Önerileri</h3>
          <p>Killboard ekipman verisinden üretilen canlı talep analizi: hangi eşya, hangi tier'da, ne oranla giyiliyor.
          Ölen taraf sahada neyle karşılaşıldığını, öldüren taraf meta build'lerin tercihini gösterir.</p>
        </div>
        <div class="mc-meta">
          <i class="fa-solid fa-database"></i> ${server ? server.sampleKills : 0} kill ·
          ${mcData.pagesPerServer} sayfa/sunucu · son senkron: <strong>${mcEsc(stamp)}</strong>
        </div>
      </div>

      <div class="mc-controls">
        <div class="mc-group">
          ${Object.keys(mcData.servers).map((key) => `<button class="mc-chip ${mcState.server === key ? 'active' : ''}" data-mc-server="${key}">${mcEsc(MC_SERVER_LABEL[key] || key.toUpperCase())}</button>`).join('')}
        </div>
        <div class="mc-group">
          <button class="mc-chip ${mcState.side === 'killer' ? 'active' : ''}" data-mc-side="killer">🗡️ Öldüren taraf</button>
          <button class="mc-chip ${mcState.side === 'victim' ? 'active' : ''}" data-mc-side="victim">💀 Ölen taraf</button>
        </div>
      </div>

      <div class="mc-tabs">
        ${MC_SLOTS.map((s) => `<button class="mc-slot ${mcState.slot === s.key ? 'active' : ''}" data-mc-slot="${s.key}">${s.label}</button>`).join('')}
      </div>

      <div class="mc-grid">
        <section class="mc-panel">
          <header>
            <h4>${mcState.side === 'killer' ? 'Öldürenlerin en çok giydiği' : 'Ölenlerin üzerinde en çok çıkan'} ${MC_SLOTS.find((s) => s.key === mcState.slot)?.label.toLowerCase()}</h4>
            <span>${slot.total} kayıt</span>
          </header>
          <div class="mc-rows">${mcRows()}</div>
        </section>

        <section class="mc-panel">
          <header>
            <h4>Öncelikli craft listesi</h4>
            <span>kullanım × tier</span>
          </header>
          <p class="mc-note">Puan = kullanım oranı × ortalama tier. Yüksek puan: hem sık giyiliyor hem yüksek tier'da talep görüyor — üretimi en çok kazandıran eşyalar.</p>
          <div class="mc-rows">${mcCraftList()}</div>
        </section>
      </div>
    </div>`;
}

function mcBind(root: HTMLElement) {
  root.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const server = target.closest('[data-mc-server]')?.getAttribute('data-mc-server');
    const side = target.closest('[data-mc-side]')?.getAttribute('data-mc-side');
    const slot = target.closest('[data-mc-slot]')?.getAttribute('data-mc-slot');
    if (server) mcState.server = server;
    if (side) mcState.side = side as any;
    if (slot) mcState.slot = slot;
    if (server || side || slot) mcRender();
  });
}

async function mcLoad(): Promise<MetaPayload | null> {
  if (mcData) return mcData;
  try {
    const res = await fetch('data/meta-craft.json', { cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    mcData = await res.json();
    return mcData;
  } catch (error: any) {
    console.warn('[meta-craft] veri yüklenemedi:', error?.message || error);
    return null;
  }
}

async function mcMount(container: HTMLElement) {
  if (!container) return;
  if (container.dataset.mounted === '1') { mcRender(); return; }
  container.dataset.mounted = '1';
  const data = await mcLoad();
  if (!data) {
    container.innerHTML = `<div class="mc-empty">Meta craft verisi yüklenemedi. Bot çalıştıktan sonra tekrar deneyin (data/meta-craft.json).</div>`;
    return;
  }
  const app = document.createElement('div');
  app.id = 'metaCraftApp';
  container.innerHTML = '';
  container.appendChild(app);
  mcBind(container);
  mcRender();
}

(window as any).AOTMetaCraft = { mount: mcMount, render: mcRender };

export {};
