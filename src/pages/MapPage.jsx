import { useState, useRef, useEffect, useCallback } from 'react'
import { ZONES, CONNECTIONS, buildGraph, ZONE_COLORS, ZONE_TYPE_LABELS } from '../data/zones'
import { dijkstra } from '../utils/pathfinding'

const DEFAULT_WEIGHTS = { blue: 1, yellow: 2, red: 4, black: 8, road: 3, passage: 2 }
const ZONE_MAP = Object.fromEntries(ZONES.map(z => [z.id, z]))

const S = {
  page: { padding: '1.5rem' },
  title: { fontSize: 20, fontWeight: 700, color: '#f5c842', marginBottom: 8 },
  subtitle: { fontSize: 13, color: '#64748b', marginBottom: 16 },
  layout: { display: 'grid', gridTemplateColumns: '280px 1fr', gap: 16 },
  panel: { background: '#161921', border: '1px solid #2a2f3e', borderRadius: 12, padding: 14 },
  label: { fontSize: 11, color: '#64748b', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  sectionTitle: { fontSize: 13, fontWeight: 600, color: '#e2e8f0', marginBottom: 10 },
  weightRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
}

function ZoneBadge({ type }) {
  const colors = { blue: '#3b82f6', yellow: '#facc15', red: '#ef4444', black: '#6b7280', road: '#a855f7' }
  const c = colors[type] || '#64748b'
  return (
    <span style={{ background: c + '22', color: c, border: `1px solid ${c}44`, padding: '1px 6px', borderRadius: 4, fontSize: 10, fontWeight: 500 }}>
      {ZONE_TYPE_LABELS[type] || type}
    </span>
  )
}

function MapCanvas({ zones, connections, path, start, end, onZoneClick, selectedMode }) {
  const canvasRef = useRef()
  const W = 1000, H = 820

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, W, H)

    ctx.fillStyle = '#0d0f14'
    ctx.fillRect(0, 0, W, H)

    const pathSet = new Set(path)

    // Draw connections
    for (const conn of connections) {
      const from = ZONE_MAP[conn.from]
      const to = ZONE_MAP[conn.to]
      if (!from || !to) continue
      const isOnPath = path.length > 1 && path.some((p, i) => i < path.length - 1 &&
        ((p === conn.from && path[i + 1] === conn.to) || (p === conn.to && path[i + 1] === conn.from)))
      ctx.beginPath()
      ctx.moveTo(from.x, from.y)
      ctx.lineTo(to.x, to.y)
      ctx.strokeStyle = isOnPath ? '#f5c842' : '#1e2330'
      ctx.lineWidth = isOnPath ? 3 : 1
      ctx.stroke()
    }

    // Draw zones
    for (const zone of zones) {
      const isStart = zone.id === start
      const isEnd = zone.id === end
      const isOnPath = pathSet.has(zone.id)
      const zoneColor = ZONE_COLORS[zone.type] || '#6b7280'
      const radius = zone.isCity ? 14 : 8

      ctx.beginPath()
      ctx.arc(zone.x, zone.y, radius + (isStart || isEnd ? 4 : isOnPath ? 2 : 0), 0, Math.PI * 2)
      ctx.fillStyle = isStart ? '#4ade80' : isEnd ? '#f87171' : isOnPath ? zoneColor : zoneColor + '66'
      ctx.fill()
      ctx.strokeStyle = isStart ? '#4ade80' : isEnd ? '#f87171' : isOnPath ? '#fff' : zoneColor
      ctx.lineWidth = isStart || isEnd ? 3 : isOnPath ? 2 : 1
      ctx.stroke()

      // Label for cities and path zones
      if (zone.isCity || isOnPath) {
        ctx.font = zone.isCity ? '11px Inter,sans-serif' : '9px Inter,sans-serif'
        ctx.fillStyle = isStart || isEnd ? '#fff' : '#e2e8f0'
        ctx.textAlign = 'center'
        ctx.fillText(zone.name, zone.x, zone.y + radius + 12)
      }
    }
  }, [zones, connections, path, start, end])

  useEffect(() => { draw() }, [draw])

  function handleClick(e) {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const scaleX = W / rect.width
    const scaleY = H / rect.height
    const mx = (e.clientX - rect.left) * scaleX
    const my = (e.clientY - rect.top) * scaleY

    let closest = null, minDist = Infinity
    for (const zone of zones) {
      const d = Math.hypot(zone.x - mx, zone.y - my)
      if (d < minDist) { minDist = d; closest = zone }
    }
    if (closest && minDist < 30) {
      onZoneClick(closest.id)
    }
  }

  return (
    <canvas
      ref={canvasRef}
      width={W}
      height={H}
      onClick={handleClick}
      style={{ width: '100%', borderRadius: 10, cursor: 'crosshair', background: '#0d0f14', border: '1px solid #2a2f3e' }}
    />
  )
}

export default function MapPage() {
  const [start, setStart] = useState(null)
  const [end, setEnd] = useState(null)
  const [path, setPath] = useState([])
  const [weights, setWeights] = useState({ ...DEFAULT_WEIGHTS })
  const [result, setResult] = useState(null)
  const [mode, setMode] = useState('start')
  const [filter, setFilter] = useState('all')

  const filteredZones = filter === 'all' ? ZONES : ZONES.filter(z => z.type === filter || (filter === 'city' && z.isCity))
  const { graph, zoneMap } = buildGraph()

  function handleZoneClick(zoneId) {
    if (mode === 'start') {
      setStart(zoneId)
      setMode('end')
      setPath([])
      setResult(null)
    } else {
      setEnd(zoneId)
      setMode('start')
    }
  }

  function findPath() {
    if (!start || !end) return alert('Başlangıç ve bitiş noktası seçin')
    const res = dijkstra(graph, start, end, weights)
    if (!res) {
      alert('Rota bulunamadı')
      setPath([])
      setResult(null)
      return
    }
    setPath(res.path)
    const zonePath = res.path.map(id => ZONE_MAP[id]).filter(Boolean)
    const typeCounts = {}
    for (const z of zonePath) {
      typeCounts[z.type] = (typeCounts[z.type] || 0) + 1
    }
    setResult({ path: res.path, cost: res.cost, zonePath, typeCounts, steps: res.path.length - 1 })
  }

  function reset() {
    setStart(null)
    setEnd(null)
    setPath([])
    setResult(null)
    setMode('start')
  }

  const startZone = start ? ZONE_MAP[start] : null
  const endZone = end ? ZONE_MAP[end] : null

  return (
    <div style={S.page}>
      <div style={S.title}>Albion Online Haritası</div>
      <div style={S.subtitle}>İnteraktif bölge haritası ve ağırlıklı rota planlayıcı</div>

      <div style={S.layout}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={S.panel}>
            <div style={S.sectionTitle}>Rota Planlayıcı</div>

            <div style={{ marginBottom: 10 }}>
              <div style={S.label}>Mod</div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => setMode('start')} style={{ flex: 1, padding: '6px 4px', borderRadius: 6, fontSize: 11, fontWeight: 600, border: mode === 'start' ? '1px solid #4ade80' : '1px solid #2a2f3e', background: mode === 'start' ? 'rgba(74,222,128,0.1)' : '#0d0f14', color: mode === 'start' ? '#4ade80' : '#64748b', cursor: 'pointer' }}>Başlangıç</button>
                <button onClick={() => setMode('end')} style={{ flex: 1, padding: '6px 4px', borderRadius: 6, fontSize: 11, fontWeight: 600, border: mode === 'end' ? '1px solid #f87171' : '1px solid #2a2f3e', background: mode === 'end' ? 'rgba(248,113,113,0.1)' : '#0d0f14', color: mode === 'end' ? '#f87171' : '#64748b', cursor: 'pointer' }}>Bitiş</button>
              </div>
            </div>

            <div style={{ marginBottom: 10, fontSize: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #1e2330' }}>
                <span style={{ color: '#64748b' }}>Başlangıç:</span>
                <span style={{ color: '#4ade80', fontWeight: 600 }}>{startZone?.name || '—'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
                <span style={{ color: '#64748b' }}>Bitiş:</span>
                <span style={{ color: '#f87171', fontWeight: 600 }}>{endZone?.name || '—'}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
              <button className="btn-primary" style={{ flex: 1, fontSize: 12 }} onClick={findPath} disabled={!start || !end}>Rota Bul</button>
              <button className="btn-secondary" style={{ fontSize: 12 }} onClick={reset}>Sıfırla</button>
            </div>
          </div>

          <div style={S.panel}>
            <div style={S.sectionTitle}>Bölge Ağırlıkları</div>
            <div style={{ fontSize: 11, color: '#475569', marginBottom: 10 }}>Düşük = tercih edilen bölge</div>
            {Object.entries(weights).map(([type, w]) => (
              <div key={type} style={S.weightRow}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: ZONE_COLORS[type] || '#6b7280' }} />
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>{ZONE_TYPE_LABELS[type] || type}</span>
                </div>
                <input
                  type="range" min={1} max={20} value={w}
                  onChange={e => setWeights(prev => ({ ...prev, [type]: Number(e.target.value) }))}
                  style={{ width: 80, accentColor: ZONE_COLORS[type] || '#f5c842' }}
                />
                <span style={{ fontSize: 12, color: '#e2e8f0', width: 20, textAlign: 'right' }}>{w}</span>
              </div>
            ))}
          </div>

          {result && (
            <div style={S.panel}>
              <div style={S.sectionTitle}>Yolculuk Özeti</div>
              <div style={{ fontSize: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Toplam Adım:</span>
                  <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{result.steps}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Maliyet Puanı:</span>
                  <span style={{ color: '#f5c842', fontWeight: 600 }}>{result.cost}</span>
                </div>
                {Object.entries(result.typeCounts).map(([type, count]) => (
                  <div key={type} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <ZoneBadge type={type} />
                    <span style={{ color: '#94a3b8' }}>{count} bölge</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 11, color: '#64748b', marginBottom: 6 }}>Rota Adımları:</div>
                <div style={{ maxHeight: 180, overflowY: 'auto' }}>
                  {result.zonePath.map((zone, i) => (
                    <div key={zone.id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 0', fontSize: 11 }}>
                      <span style={{ color: '#475569', width: 16 }}>{i + 1}.</span>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: ZONE_COLORS[zone.type], flexShrink: 0 }} />
                      <span style={{ color: '#94a3b8' }}>{zone.name}</span>
                      {zone.isCity && <span style={{ color: '#f5c842', fontSize: 9 }}>★</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div style={S.panel}>
            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8 }}>Renk Açıklamaları</div>
            {Object.entries(ZONE_TYPE_LABELS).map(([type, label]) => (
              <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: ZONE_COLORS[type] }} />
                <span style={{ fontSize: 11, color: '#94a3b8' }}>{label}</span>
              </div>
            ))}
            <div style={{ marginTop: 8, fontSize: 10, color: '#475569' }}>Haritaya tıklayarak nokta seçin</div>
          </div>
        </div>

        <div>
          <MapCanvas
            zones={ZONES}
            connections={CONNECTIONS}
            path={path}
            start={start}
            end={end}
            onZoneClick={handleZoneClick}
            selectedMode={mode}
          />
          <div style={{ marginTop: 8, fontSize: 11, color: '#475569', textAlign: 'center' }}>
            {mode === 'start' ? 'Haritada başlangıç noktasına tıklayın' : 'Haritada bitiş noktasına tıklayın'}
          </div>
        </div>
      </div>
    </div>
  )
}
