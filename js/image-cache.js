// Albion Online Eşya Görüntü Önbellek Sistemi
class AlbionImageCache {
    constructor() {
        this.cacheName = 'albion-image-cache-v1';
        this.baseUrl = 'https://render.albiononline.com/v1/item';
        this.spellUrl = 'https://render.albiononline.com/v1/spell';
        this.maxCacheSize = 500; // Maksimum 500 resim
        this.cacheExpiry = 7 * 24 * 60 * 60 * 1000; // 7 gün
        this.init();
    }

    async init() {
        // Doğrudan URL kullanacağımız için karmaşık Cache API'yi siliyoruz
        // Tarayıcının kendi önbelleği (HTTP Cache) zaten işimizi en iyi şekilde yapıyor.
    }

    getItemUrl(itemId, quality = 1, size = 128) {
        return `${this.baseUrl}/${itemId}.png?quality=${quality}&size=${size}`;
    }

    getSpellUrl(spellId) {
        return `${this.spellUrl}/${spellId}.png`;
    }

    async getImage(itemId, quality = 1, size = 128, type = 'item') {
        return type === 'spell' ? this.getSpellUrl(itemId) : this.getItemUrl(itemId, quality, size);
    }

    getPlaceholderUrl() {
        return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjMGEwZDE0Ii8+CjxwYXRoIGQ9Ik0zMiA0MEMzNi40MTgzIDQwIDQwIDM2LjQxODMgNDAgMzJDNDAgMjcuNTgxNyAzNi40MTgzIDI0IDMyIDI0QzI3LjU4MTcgMjQgMjQgMjcuNTgxNyAyNCAzMkMyNCAzNi40MTgzIDI3LjU4MTcgNDAgMzIgNDBaIiBmaWxsPSIjMzM0MjU1Ii8+CjxwYXRoIGQ9Ik0zMiAyOEMzMy4xMDQ2IDI4IDM0IDI3LjEwNDYgMzQgMjZDMzQgMjQuODk1NCAzMy4xMDQ2IDI0IDMyIDI0QzMwLjg5NTQgMjQgMzAgMjQuODk1NCAzMCAyNEMzMCAyNy4xMDQ2IDMwLjg5NTQgMjggMzIgMjhaIiBmaWxsPSIjMGEwZDE0Ii8+Cjwvc3ZnPgo=';
    }

    async cleanupOldCache() { }
    async clearCache() { }

    async getCacheStats() {
        return { size: 0, maxSize: this.maxCacheSize, usage: 0 };
    }
}

// Global instance
window.albionImageCache = new AlbionImageCache();

// Yardımcı fonksiyonlar
window.getItemImage = async (itemId, quality = 1, size = 128) => {
    return await window.albionImageCache.getImage(itemId, quality, size, 'item');
};

window.getSpellImage = async (spellId) => {
    return await window.albionImageCache.getImage(spellId, 1, 64, 'spell');
};

window.createItemImage = async (itemId, options = {}) => {
    const { quality = 1, size = 128, className = '', onError = '' } = options;
    const imageUrl = await window.getItemImage(itemId, quality, size);

    return `<img src="${imageUrl}" 
             class="${className}" 
             onerror="${onError || 'this.src=window.albionImageCache.getPlaceholderUrl()'}" 
             loading="lazy">`;
};
