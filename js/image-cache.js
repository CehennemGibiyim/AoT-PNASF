// Albion Online görsel URL önbelleği: tekrar eden kart render'larında ağ ve string işçiliğini azaltır.
class AlbionImageCache {
    constructor() {
        this.cacheName = 'albion-image-cache-v1';
        this.baseUrl = 'https://render.albiononline.com/v1/item';
        this.spellUrl = 'https://render.albiononline.com/v1/spell';
        this.maxCacheSize = 500;
        this.cache = new Map();
        this.pending = new Map();
    }

    getItemUrl(itemId, quality = 1, size = 128) {
        return `${this.baseUrl}/${encodeURIComponent(itemId)}.png?quality=${quality}&size=${size}`;
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

window.albionImageCache = new AlbionImageCache();

window.getItemImage = (itemId, quality = 1, size = 128) =>
    window.albionImageCache.getImage(itemId, quality, size, 'item');

window.getSpellImage = (spellId) =>
    window.albionImageCache.getImage(spellId, 1, 64, 'spell');

window.createItemImage = async (itemId, options = {}) => {
    const { quality = 1, size = 128, className = '', onError = '' } = options;
    const imageUrl = await window.getItemImage(itemId, quality, size);
    const errorHandler = onError || 'this.src=window.albionImageCache.getPlaceholderUrl()';
    return `<img src="${imageUrl}" class="${className}" onerror="${errorHandler}" loading="lazy" decoding="async" width="${size}" height="${size}" alt="">`;
};
