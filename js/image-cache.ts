// Albion Online görsel URL önbelleği: tekrar eden kart render'larında ağ ve string işçiliğini azaltır.
class AlbionImageCache {
    // Alan bildirimleri yalnızca tiptir (tsconfig: useDefineForClassFields: false),
    // çalışma zamanında constructor atamalarının önüne geçmez.
    cacheName: string;
    baseUrl: string;
    spellUrl: string;
    maxCacheSize: number;
    cache: Map<string, string>;
    pending: Map<string, Promise<string>>;

    constructor() {
        this.cacheName = 'albion-image-cache-v1';
        this.baseUrl = 'https://render.albiononline.com/v1/item';
        this.spellUrl = 'https://render.albiononline.com/v1/spell';
        this.maxCacheSize = 500;
        this.cache = new Map();
        this.pending = new Map();
    }

    getItemUrl(itemId, quality = 1, size = 128) {
        // Taban kimliğiyle çağrılırsa (MAIN_AXE) render servisi 404 verir;
        // tam kimliğe çevir (T8_MAIN_AXE).
        return `${this.baseUrl}/${encodeURIComponent(aoItemId(itemId))}.png?quality=${quality}&size=${size}`;
    }

    getSpellUrl(spellId) {
        return `${this.spellUrl}/${encodeURIComponent(spellId)}.png`;
    }

    async getImage(itemId, quality = 1, size = 128, type = 'item') {
        const key = `${type}:${itemId}:${quality}:${size}`;
        if (this.cache.has(key)) {
            const value = this.cache.get(key);
            this.cache.delete(key);
            this.cache.set(key, value);
            return value;
        }
        if (this.pending.has(key)) return this.pending.get(key);

        const promise = Promise.resolve(type === 'spell'
            ? this.getSpellUrl(itemId)
            : this.getItemUrl(itemId, quality, size));
        this.pending.set(key, promise);
        const value = await promise;
        this.pending.delete(key);
        this.cache.set(key, value);
        while (this.cache.size > this.maxCacheSize) this.cache.delete(this.cache.keys().next().value);
        return value;
    }

    getPlaceholderUrl() {
        return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjMGEwZDE0Ii8+CjxwYXRoIGQ9Ik0zMiA0MEMzNi40MTgzIDQwIDQwIDM2LjQxODMgNDAgMzJDNDAgMjcuNTgxNyAzNi40MTgzIDI0IDMyIDI0QzI3LjU4MTcgMjQgMjQgMjcuNTgxNyAyNCAzMkMyNCAzNi40MTgzIDI3LjU4MTcgNDAgMzIgNDBaIiBmaWxsPSIjMzM0MjU1Ii8+CjxwYXRoIGQ9Ik0zMiAyOEMzMy4xMDQ2IDI4IDM0IDI3LjEwNDYgMzQgMjZDMzQgMjQuODk1NCAzMy4xMDQ2IDI0IDMyIDI0QzMwLjg5NTQgMjQgMzAgMjQuODk1NCAzMCAyNEMzMCAyNy4xMDQ2IDMwLjg5NTQgMjggMzIgMjhaIiBmaWxsPSIjMGEwZDE0Ii8+Cjwvc3ZnPgo=';
    }

    async cleanupOldCache() {
        while (this.cache.size > this.maxCacheSize) this.cache.delete(this.cache.keys().next().value);
    }

    async clearCache() {
        this.cache.clear();
        this.pending.clear();
    }

    async getCacheStats() {
        const size = this.cache.size;
        return { size, maxSize: this.maxCacheSize, usage: Math.round((size / this.maxCacheSize) * 100) };
    }
}

/**
 * Taban eşya kimliğini render servisinin beklediği tam kimliğe çevirir.
 * MAIN_AXE + tier 6 + enchant 2 → T6_MAIN_AXE@2. Zaten tam kimlikse dokunmaz.
 */
function aoItemId(itemId: any, tier?: number, ench?: number): string {
    const raw = String(itemId == null ? '' : itemId);
    if (/^T\d+_/.test(raw)) return raw;
    const t = tier && tier >= 3 && tier <= 8 ? Math.round(tier) : 8;
    const e = ench ? `@${ench}` : '';
    return `T${t}_${raw}${e}`;
}

/**
 * Görsel adayları: ilk sırada tercih edilen tier, sonra T8→T3 yedeği.
 * Relik eşyalar yalnızca T7/T8'de bulunduğu için tek tier yeterli değil.
 */
function aoItemUrls(itemId: any, tier?: number, ench?: number, size = 64): string[] {
    const raw = String(itemId == null ? '' : itemId);
    const enchantInId = Number((raw.match(/@(\d+)$/) || [])[1] || 0);
    const e = ench || enchantInId;
    const clean = raw.replace(/^T\d+_/, '').replace(/@\d+$/, '');
    const preferred = tier && tier >= 3 && tier <= 8 ? Math.round(tier) : 0;
    const tiers = [preferred, 8, 7, 6, 5, 4, 3].filter((t, i, arr) => t >= 3 && t <= 8 && arr.indexOf(t) === i);
    const suffix = e ? `@${e}` : '';
    return tiers.map((t) => `https://render.albiononline.com/v1/item/T${t}_${encodeURIComponent(clean)}${suffix}.png?quality=1&size=${size}`);
}

/** <img ...> için hazır öznitelik: src + data-alts yedek zinciri. */
function aoItemImg(itemId: any, tier?: number, ench?: number, size = 64): string {
    const urls = aoItemUrls(itemId, tier, ench, size);
    return `src="${urls[0]}" data-alts="${urls.slice(1).join('|')}"`;
}

/** İlk tier 404 verirse sıradaki tier'i dener; hepsi biterse ikonu gizler. */
function aoInstallItemFallback() {
    const w = window as any;
    if (w.__aoItemFallback) return;
    w.__aoItemFallback = true;
    document.addEventListener('error', (event) => {
        const img = event.target as HTMLImageElement;
        if (!img || img.tagName !== 'IMG' || !img.dataset || !img.dataset.alts) return;
        const alts = img.dataset.alts.split('|').filter(Boolean);
        const next = alts.shift();
        img.dataset.alts = alts.join('|');
        if (next) {
            img.src = next;
        } else {
            const placeholder = w.albionImageCache?.getPlaceholderUrl?.();
            if (placeholder) img.src = placeholder;
            else { img.style.visibility = 'hidden'; img.style.opacity = '0'; }
        }
    }, true);
}

aoInstallItemFallback();

window.albionImageCache = new AlbionImageCache();
window.aoItemId = aoItemId;
window.aoItemUrls = aoItemUrls;
window.aoItemImg = aoItemImg;

window.getItemImage = (itemId, quality = 1, size = 128) =>
    window.albionImageCache.getImage(itemId, quality, size, 'item');

window.getSpellImage = (spellId) =>
    window.albionImageCache.getImage(spellId, 1, 64, 'spell');

window.createItemImage = async (itemId, options: any = {}) => {
    const { quality = 1, size = 128, className = '', onError = '' } = options;
    const imageUrl = await window.getItemImage(itemId, quality, size);
    const errorHandler = onError || 'this.src=window.albionImageCache.getPlaceholderUrl()';
    return `<img src="${imageUrl}" class="${className}" onerror="${errorHandler}" loading="lazy" decoding="async" width="${size}" height="${size}" alt="">`;
};

// --- Modül dönüşümü: üst düzey semboller window üzerinden paylaşılır ---
declare global {
  var AlbionImageCache: any;
  var aoItemId: (itemId: any, tier?: number, ench?: number) => string;
  var aoItemUrls: (itemId: any, tier?: number, ench?: number, size?: number) => string[];
  var aoItemImg: (itemId: any, tier?: number, ench?: number, size?: number) => string;
}

let AlbionImageCache_windowOverride: any;

Object.defineProperty(window, 'AlbionImageCache', {
  get: () => (AlbionImageCache_windowOverride !== undefined ? AlbionImageCache_windowOverride : AlbionImageCache),
  set: (value) => { AlbionImageCache_windowOverride = value; },
  configurable: true, enumerable: true });

export {};
