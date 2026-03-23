import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import { Icon, LatLng } from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Albion Online harita verileri
const ALBION_ZONES = [
  { id: '0004', name: 'Swamp Cross', type: 'swamp', pvp: 'yellow', lat: 51.5, lng: -0.1 },
  { id: '4206', name: 'Tharcal Fissure', type: 'mountain', pvp: 'red', lat: 51.6, lng: -0.2 },
  { id: '3201', name: 'Birken Fell', type: 'forest', pvp: 'yellow', lat: 51.4, lng: -0.15 },
  { id: '2201', name: 'Kindlegrass Steppe', type: 'steppe', pvp: 'blue', lat: 51.3, lng: -0.05 },
  { id: '1201', name: 'Larchroad', type: 'forest', pvp: 'blue', lat: 51.35, lng: 0.0 },
  { id: '0201', name: 'Swamp Cross', type: 'swamp', pvp: 'yellow', lat: 51.25, lng: 0.05 }
]

// Bölgesel bonus verileri
const REGION_BONUSES = {
  '0004': {
    rewards: { fame: '+440%', gathering: '+40%', silver: '+290%', loot: '+220%' },
    enemies: { damage: '+15%' },
    production: { carrots: '+200%', beans: '+200%', wheat: '+200%', turnips: '+200%', cabbage: '+200%', potatoes: '+200%' }
  },
  '4206': {
    rewards: { fame: '+380%', gathering: '+35%', silver: '+250%', loot: '+180%' },
    enemies: { damage: '+12%' },
    production: { fiber: '+180%', hide: '+180%', ore: '+180%', wood: '+180%', rock: '+180%', stone: '+180%' }
  }
}

// PvP renkleri
const PVP_COLORS = {
  blue: '#4a9eff',
  yellow: '#f5c842',
  red: '#ef4444',
  black: '#1f2937'
}

// Zone tipi renkleri
const TYPE_COLORS = {
  forest: '#10b981',
  swamp: '#8b5cf6',
  mountain: '#f97316',
  steppe: '#84cc16'
}

// Leaflet varsayılan ikon sorunu için düzeltme
delete Icon.Default.prototype._getIconUrl
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

function ZoneMarker({ zone, isSelected, onSelect }) {
  const position = [zone.lat, zone.lng]
  
  const customIcon = new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="8" fill="${PVP_COLORS[zone.pvp]}" stroke="#fff" stroke-width="2"/>
        <circle cx="12" cy="12" r="4" fill="${TYPE_COLORS[zone.type]}" opacity="0.7"/>
        <text x="12" y="16" text-anchor="middle" fill="white" font-size="8" font-weight="bold">${zone.id.slice(-2)}</text>
      </svg>
    `)}`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  })

  return (
    <Marker 
      position={position} 
      icon={customIcon}
      eventHandlers={{
        click: () => onSelect(zone)
      }}
    >
      <Popup>
        <div style={{ minWidth: 200 }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#f5c842' }}>{zone.name}</h3>
          <p style={{ margin: '0 0 4px 0', fontSize: 12 }}>
            <strong>Zone ID:</strong> {zone.id}<br/>
            <strong>Tip:</strong> {zone.type}<br/>
            <strong>PvP:</strong> <span style={{ color: PVP_COLORS[zone.pvp] }}>{zone.pvp}</span>
          </p>
          {REGION_BONUSES[zone.id] && (
            <div style={{ marginTop: 8 }}>
              <h4 style={{ margin: '0 0 4px 0', fontSize: 12, color: '#f5c842' }}>Bölge Bonusları</h4>
              <div style={{ fontSize: 11 }}>
                <div><strong>Ödül Değiştiriciler:</strong></div>
                {Object.entries(REGION_BONUSES[zone.id].rewards).map(([key, value]) => (
                  <div key={key} style={{ marginLeft: 8 }}>
                    • {key}: <span style={{ color: '#10b981' }}>{value}</span>
                  </div>
                ))}
                <div style={{ marginTop: 4 }}><strong>Düşman Değiştiriciler:</strong></div>
                {Object.entries(REGION_BONUSES[zone.id].enemies).map(([key, value]) => (
                  <div key={key} style={{ marginLeft: 8 }}>
                    • {key}: <span style={{ color: '#ef4444' }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Popup>
    </Marker>
  )
}

function PathfindingLayer({ start, end }) {
  if (!start || !end) return null
  
  const path = [
    [start.lat, start.lng],
    [(start.lat + end.lat) / 2, (start.lng + end.lng) / 2],
    [end.lat, end.lng]
  ]

  return (
    <Polyline
      positions={path}
      color="#f5c842"
      weight={3}
      opacity={0.8}
      dashArray="10, 10"
    />
  )
}

function MapController({ center, zoom }) {
  const map = useMap()
  
  useEffect(() => {
    map.setView(center, zoom)
  }, [center, zoom, map])
  
  return null
}

export default function AlbionMap() {
  const [selectedZone, setSelectedZone] = useState(null)
  const [startPoint, setStartPoint] = useState(null)
  const [endPoint, setEndPoint] = useState(null)
  const [mapCenter] = useState([51.5, -0.1])
  const [mapZoom] = useState(7)
  const [showBonuses, setShowBonuses] = useState(true)
  const [pathfindingWeights, setPathfindingWeights] = useState({
    blue: 1,
    yellow: 2,
    red: 5,
    black: 10
  })

  const handleZoneSelect = (zone) => {
    setSelectedZone(zone)
    if (!startPoint) {
      setStartPoint(zone)
    } else if (!endPoint) {
      setEndPoint(zone)
    } else {
      setStartPoint(zone)
      setEndPoint(null)
    }
  }

  const clearPath = () => {
    setStartPoint(null)
    setEndPoint(null)
    setSelectedZone(null)
  }

  return (
    <div style={{ height: '100vh', width: '100%', position: 'relative' }}>
      <div style={{
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 1000,
        background: '#1a1d29',
        border: '1px solid #2a2f3e',
        borderRadius: 8,
        padding: '12px',
        minWidth: 250
      }}>
        <h3 style={{ margin: '0 0 12px 0', color: '#f5c842', fontSize: 14 }}>Albion Online Harita</h3>
        
        <div style={{ marginBottom: 12 }}>
          <h4 style={{ margin: '0 0 6px 0', color: '#e2e8f0', fontSize: 12 }}>Pathfinding Ağırlıkları</h4>
          {Object.entries(pathfindingWeights).map(([zone, weight]) => (
            <div key={zone} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <span style={{ color: PVP_COLORS[zone], fontSize: 11 }}>{zone.toUpperCase()}</span>
              <input
                type="range"
                min="1"
                max="10"
                value={weight}
                onChange={(e) => setPathfindingWeights(prev => ({ ...prev, [zone]: parseInt(e.target.value) }))}
                style={{ width: 80 }}
              />
              <span style={{ color: '#94a3b8', fontSize: 11 }}>{weight}</span>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'flex', alignItems: 'center', color: '#e2e8f0', fontSize: 12 }}>
            <input
              type="checkbox"
              checked={showBonuses}
              onChange={(e) => setShowBonuses(e.target.checked)}
              style={{ marginRight: 6 }}
            />
            Bölge Bonuslarını Göster
          </label>
        </div>

        <div>
          <button
            onClick={clearPath}
            style={{
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              padding: '6px 12px',
              fontSize: 11,
              cursor: 'pointer',
              width: '100%'
            }}
          >
            Rotayı Temizle
          </button>
        </div>

        {startPoint && (
          <div style={{ marginTop: 8, fontSize: 11, color: '#94a3b8' }}>
            <div>Başlangıç: {startPoint.name}</div>
            {endPoint && <div>Bitiş: {endPoint.name}</div>}
          </div>
        )}
      </div>

      <div style={{
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1000,
        background: '#1a1d29',
        border: '1px solid #2a2f3e',
        borderRadius: 8,
        padding: '12px',
        minWidth: 200
      }}>
        <h4 style={{ margin: '0 0 8px 0', color: '#f5c842', fontSize: 12 }}>PvP Bölge Renkleri</h4>
        {Object.entries(PVP_COLORS).map(([zone, color]) => (
          <div key={zone} style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
            <div style={{
              width: 12,
              height: 12,
              background: color,
              borderRadius: 2,
              marginRight: 6
            }}></div>
            <span style={{ color: '#e2e8f0', fontSize: 11 }}>{zone.toUpperCase()}</span>
          </div>
        ))}
      </div>

      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%' }}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <MapController center={mapCenter} zoom={mapZoom} />
        
        {ALBION_ZONES.map(zone => (
          <ZoneMarker
            key={zone.id}
            zone={zone}
            isSelected={selectedZone?.id === zone.id}
            onSelect={handleZoneSelect}
          />
        ))}
        
        <PathfindingLayer start={startPoint} end={endPoint} />
      </MapContainer>
    </div>
  )
}
