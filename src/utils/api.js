const SERVERS = {
  west: 'https://west.albion-online-data.com',
  europe: 'https://europe.albion-online-data.com',
  east: 'https://east.albion-online-data.com',
}

export const CITIES = [
  'Caerleon',
  'Bridgewatch',
  'Fort Sterling',
  'Lymhurst',
  'Martlock',
  'Thetford',
  'Black Market',
  'Brecilien',
]

export const CITY_COLORS = {
  'Caerleon': '#f87171',
  'Bridgewatch': '#fb923c',
  'Fort Sterling': '#94a3b8',
  'Lymhurst': '#4ade80',
  'Martlock': '#60a5fa',
  'Thetford': '#a78bfa',
  'Black Market': '#f5c842',
  'Brecilien': '#34d399',
}

export async function fetchPrices(itemIds, locations = CITIES, server = 'west', qualities = '1,2,3') {
  const ids = Array.isArray(itemIds) ? itemIds.join(',') : itemIds
  const locs = Array.isArray(locations) ? locations.join(',') : locations
  const url = `${SERVERS[server]}/api/v2/stats/prices/${ids}.json?locations=${encodeURIComponent(locs)}&qualities=${qualities}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('API hatası: ' + res.status)
  return res.json()
}

export async function fetchHistory(itemId, location, server = 'west', timescale = 6) {
  const url = `${SERVERS[server]}/api/v2/stats/history/${itemId}.json?locations=${encodeURIComponent(location)}&time-scale=${timescale}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('API hatası: ' + res.status)
  return res.json()
}

export async function fetchGoldPrice(server = 'west', count = 24) {
  const url = `${SERVERS[server]}/api/v2/stats/gold.json?count=${count}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('API hatası: ' + res.status)
  return res.json()
}

export async function searchItems(query) {
  const url = `https://gameinfo.albiononline.com/api/gameinfo/search?q=${encodeURIComponent(query)}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Arama hatası: ' + res.status)
  return res.json()
}

export function getItemIcon(itemId, size = 64) {
  return `https://render.albiononline.com/v1/item/${itemId}.png?size=${size}&quality=1`
}

export function formatSilver(value) {
  if (!value || value === 0) return '-'
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + 'M'
  if (value >= 1_000) return (value / 1_000).toFixed(1) + 'K'
  return value.toLocaleString()
}

export function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('tr-TR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}

export const QUALITY_NAMES = {
  1: 'Normal',
  2: 'İyi',
  3: 'Olağanüstü',
  4: 'Mükemmel',
  5: 'Efsanevi',
}

export const TIER_NAMES = {
  'T1': 'T1', 'T2': 'T2', 'T3': 'T3', 'T4': 'T4',
  'T5': 'T5', 'T6': 'T6', 'T7': 'T7', 'T8': 'T8',
}
