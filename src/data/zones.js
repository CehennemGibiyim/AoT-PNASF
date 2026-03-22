export const ZONES = [
  // Royal Cities
  { id: 'caerleon', name: 'Caerleon', type: 'red', x: 500, y: 380, isCity: true },
  { id: 'bridgewatch', name: 'Bridgewatch', type: 'yellow', x: 760, y: 380, isCity: true },
  { id: 'fort_sterling', name: 'Fort Sterling', type: 'blue', x: 500, y: 130, isCity: true },
  { id: 'lymhurst', name: 'Lymhurst', type: 'blue', x: 240, y: 380, isCity: true },
  { id: 'martlock', name: 'Martlock', type: 'blue', x: 500, y: 630, isCity: true },
  { id: 'thetford', name: 'Thetford', type: 'blue', x: 240, y: 630, isCity: true },

  // Fort Sterling routes (North)
  { id: 'fs_1', name: 'Lilydale Cross', type: 'blue', x: 420, y: 200 },
  { id: 'fs_2', name: 'Stonefall Estate', type: 'blue', x: 350, y: 270 },
  { id: 'fs_3', name: 'Graywater Lake', type: 'yellow', x: 580, y: 200 },
  { id: 'fs_4', name: 'Thornwood Basin', type: 'yellow', x: 640, y: 270 },
  { id: 'fs_5', name: 'Ashford Lowlands', type: 'blue', x: 500, y: 250 },

  // Bridgewatch routes (East)
  { id: 'bw_1', name: 'Gravemound Pass', type: 'yellow', x: 840, y: 310 },
  { id: 'bw_2', name: 'Drowned Plains', type: 'red', x: 840, y: 450 },
  { id: 'bw_3', name: 'Ember Ring', type: 'yellow', x: 760, y: 300 },
  { id: 'bw_4', name: 'Wychwood Caverns', type: 'red', x: 760, y: 460 },

  // Lymhurst routes (West)
  { id: 'ly_1', name: 'Oldwood Crossing', type: 'blue', x: 160, y: 310 },
  { id: 'ly_2', name: 'Clearwater Lake', type: 'blue', x: 160, y: 450 },
  { id: 'ly_3', name: 'Rivercopse Heath', type: 'yellow', x: 240, y: 300 },
  { id: 'ly_4', name: 'Bramblewood', type: 'yellow', x: 240, y: 460 },

  // Martlock routes (South-Center)
  { id: 'ml_1', name: 'Deepwood Expanse', type: 'red', x: 420, y: 560 },
  { id: 'ml_2', name: 'Stonespine Hills', type: 'red', x: 580, y: 560 },
  { id: 'ml_3', name: 'Snowpeak Ridge', type: 'blue', x: 500, y: 700 },

  // Thetford routes (Southwest)
  { id: 'tf_1', name: 'Swamp Cross', type: 'yellow', x: 160, y: 560 },
  { id: 'tf_2', name: 'Mosswood Bog', type: 'red', x: 160, y: 700 },

  // Central connections (Caerleon area)
  { id: 'ca_1', name: 'Morgannas Haunt', type: 'red', x: 430, y: 380 },
  { id: 'ca_2', name: 'Eldergate Outpost', type: 'red', x: 570, y: 380 },
  { id: 'ca_3', name: 'Blackmere Passage', type: 'red', x: 500, y: 310 },
  { id: 'ca_4', name: 'Fernside Thicket', type: 'red', x: 500, y: 450 },

  // Roads of Avalon
  { id: 'road_1', name: 'Avalon Road Alpha', type: 'road', x: 640, y: 180 },
  { id: 'road_2', name: 'Avalon Road Beta', type: 'road', x: 760, y: 200 },
  { id: 'road_3', name: 'Avalon Road Gamma', type: 'road', x: 350, y: 180 },
  { id: 'road_4', name: 'Avalon Road Delta', type: 'road', x: 140, y: 380 },

  // Black Zone portals
  { id: 'bz_1', name: 'Outlands Portal (N)', type: 'black', x: 500, y: 60 },
  { id: 'bz_2', name: 'Outlands Portal (E)', type: 'black', x: 900, y: 380 },
  { id: 'bz_3', name: 'Outlands Portal (S)', type: 'black', x: 500, y: 750 },
  { id: 'bz_4', name: 'Outlands Portal (W)', type: 'black', x: 100, y: 380 },
]

export const CONNECTIONS = [
  // Fort Sterling city connections
  { from: 'fort_sterling', to: 'fs_5' },
  { from: 'fs_5', to: 'fs_1' },
  { from: 'fs_5', to: 'fs_3' },
  { from: 'fs_1', to: 'fs_2' },
  { from: 'fs_3', to: 'fs_4' },
  { from: 'fs_2', to: 'ca_3' },
  { from: 'fs_4', to: 'ca_3' },
  { from: 'ca_3', to: 'caerleon' },

  // Bridgewatch city connections
  { from: 'bridgewatch', to: 'bw_3' },
  { from: 'bridgewatch', to: 'bw_1' },
  { from: 'bw_1', to: 'bw_2' },
  { from: 'bw_3', to: 'bw_4' },
  { from: 'bw_2', to: 'ca_2' },
  { from: 'bw_4', to: 'ca_2' },
  { from: 'ca_2', to: 'caerleon' },

  // Lymhurst city connections
  { from: 'lymhurst', to: 'ly_3' },
  { from: 'lymhurst', to: 'ly_1' },
  { from: 'ly_1', to: 'ly_2' },
  { from: 'ly_3', to: 'ly_4' },
  { from: 'ly_2', to: 'ca_1' },
  { from: 'ly_4', to: 'ca_1' },
  { from: 'ca_1', to: 'caerleon' },

  // Martlock city connections
  { from: 'martlock', to: 'ml_3' },
  { from: 'ml_3', to: 'ml_1' },
  { from: 'ml_3', to: 'ml_2' },
  { from: 'ml_1', to: 'ca_4' },
  { from: 'ml_2', to: 'ca_4' },
  { from: 'ca_4', to: 'caerleon' },

  // Thetford city connections
  { from: 'thetford', to: 'tf_2' },
  { from: 'tf_2', to: 'tf_1' },
  { from: 'tf_1', to: 'ly_4' },
  { from: 'tf_1', to: 'ml_1' },

  // Caerleon cross connections
  { from: 'caerleon', to: 'ca_1' },
  { from: 'caerleon', to: 'ca_2' },
  { from: 'caerleon', to: 'ca_3' },
  { from: 'caerleon', to: 'ca_4' },

  // Roads of Avalon
  { from: 'fort_sterling', to: 'road_1' },
  { from: 'road_1', to: 'road_2' },
  { from: 'bridgewatch', to: 'road_2' },
  { from: 'fort_sterling', to: 'road_3' },
  { from: 'road_3', to: 'lymhurst' },
  { from: 'lymhurst', to: 'road_4' },
  { from: 'road_4', to: 'thetford' },

  // Black Zone portals
  { from: 'fort_sterling', to: 'bz_1' },
  { from: 'bridgewatch', to: 'bz_2' },
  { from: 'martlock', to: 'bz_3' },
  { from: 'lymhurst', to: 'bz_4' },

  // City to city shortcuts
  { from: 'lymhurst', to: 'thetford' },
  { from: 'bridgewatch', to: 'caerleon' },
  { from: 'fort_sterling', to: 'caerleon' },
  { from: 'lymhurst', to: 'caerleon' },
]

export function buildGraph() {
  const graph = {}
  const zoneMap = {}
  for (const z of ZONES) {
    graph[z.id] = []
    zoneMap[z.id] = z
  }
  for (const c of CONNECTIONS) {
    const fromZone = zoneMap[c.to]
    const toZone = zoneMap[c.from]
    if (fromZone && toZone) {
      graph[c.from].push({ id: c.to, type: fromZone.type })
      graph[c.to].push({ id: c.from, type: toZone.type })
    }
  }
  return { graph, zoneMap }
}

export const ZONE_TYPE_LABELS = {
  blue: 'Mavi (Güvenli)',
  yellow: 'Sarı',
  red: 'Kırmızı',
  black: 'Siyah',
  road: 'Avalon Yolu',
}

export const ZONE_COLORS = {
  blue: '#3b82f6',
  yellow: '#facc15',
  red: '#ef4444',
  black: '#6b7280',
  road: '#a855f7',
}
