import { useState, useEffect, useRef } from 'react'
import { fetchPrices, CITIES, CITY_COLORS, formatSilver, formatDate, QUALITY_NAMES, getItemIcon } from '../utils/api'

const SERVERS = ['west', 'europe', 'east']
const SERVER_LABELS = { west: 'Batı', europe: 'Avrupa', east: 'Doğu' }

const POPULAR = [
  'T4_BAG', 'T5_BAG', 'T6_BAG', 'T4_CAPE', 'T5_CAPE',
  'T4_MAIN_SWORD', 'T5_MAIN_SWORD', 'T6_MAIN_SWORD', 'T7_MAIN_SWORD', 'T8_MAIN_SWORD',
  'T4_2H_CROSSBOW', 'T5_2H_CROSSBOW', 'T4_HEAD_LEATHER_SET1', 'T4_ARMOR_LEATHER_SET1',
  'T4_PLANKS', 'T5_PLANKS', 'T6_PLANKS', 'T4_METALBAR', 'T5_METALBAR', 'T6_METALBAR',
  'T4_CLOTH', 'T5_CLOTH', 'T6_CLOTH', 'T4_LEATHER', 'T5_LEATHER',
  'T4_WOOD', 'T5_WOOD', 'T6_WOOD', 'T4_ORE', 'T5_ORE', 'T6_ORE',
  'T4_ROCK', 'T5_ROCK', 'T4_FIBER', 'T5_FIBER',
]

const S = {
  page: { padding: '1.5rem' },
  title: { fontSize: 20, fontWeight: 700, color: '#f5c842', marginBottom: 16 },
  row: { display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'flex-end' },
  label: { fontSize: 12, color: '#64748b', marginBottom: 4 },
  card: { background: '#161921', border: '1px solid #2a2f3e', borderRadius: 12 },
  th: { padding: '10px 12px', textAlign: 'left', fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '1px solid #2a2f3e', background: '#161921' },
  td: { padding: '8px 12px', fontSize: 13, color: '#e2e8f0', whiteSpace: 'nowrap' },
}

function CityPriceCell({ buy, sell, updatedAt }) {
  return (
    <td style={S.td}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <span style={{ color: '#4ade80', fontWeight: 600 }}>{formatSilver(sell) || <span style={{ color: '#374151' }}>—</span>}</span>
        <span style={{ color: '#f87171', fontSize: 11 }}>{formatSilver(buy) || <span style={{ color: '#374151' }}>—</span>}</span>
        {updatedAt && <span style={{ color: '#374151', fontSize: 10 }}>{formatDate(updatedAt)}</span>}
      </div>
    </td>
  )
}

export default function PriceChecker() {
  const [query, setQuery] = useState('')
  const [server, setServer] = useState('west')
  const [quality, setQuality] = useState('1')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [suggestions, setSuggestions] = useState([])
  const [showSug, setShowSug] = useState(false)
  const sugRef = useRef()

  useEffect(() => {
    if (query.length >= 2) {
      const filtered = POPULAR.filter(id => id.toLowerCase().includes(query.toLowerCase()))
      setSuggestions(filtered.slice(0, 8))
      setShowSug(filtered.length > 0)
    } else {
      setShowSug(false)
    }
  }, [query])

  async function search(itemId) {
    const id = itemId || query.trim()
    if (!id) return
    setLoading(true)
    setError(null)
    setShowSug(false)
    try {
      const data = await fetchPrices(id, CITIES, server, quality)
      setResults(data)
    } catch (e) {
      setError('Fiyatlar alınamadı: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  const itemIds = [...new Set(results.map(r => r.item_id))]

  return (
    <div style={S.page}>
      <div style={S.title}>Fiyat Sorgulayıcı</div>

      <div style={S.row}>
        <div style={{ flex: 1, minWidth: 240, position: 'relative' }}>
          <div style={S.label}>Eşya ID / Arama</div>
          <input
            className="input-field"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && search()}
            placeholder="Örn: T4_BAG, T5_PLANKS..."
          />
          {showSug && (
            <div ref={sugRef} style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#161921', border: '1px solid #2a2f3e', borderRadius: 8, zIndex: 50, overflow: 'hidden', marginTop: 4 }}>
              {suggestions.map(s => (
                <div key={s} onClick={() => { setQuery(s); search(s) }}
                  style={{ padding: '8px 12px', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}
                  onMouseOver={e => e.currentTarget.style.background = '#1e2330'}
                  onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                  <img src={getItemIcon(s, 24)} alt="" style={{ width: 20, height: 20 }} onError={e => { e.target.style.display = 'none' }} />
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <div style={S.label}>Sunucu</div>
          <select className="select-field" value={server} onChange={e => setServer(e.target.value)}>
            {SERVERS.map(s => <option key={s} value={s}>{SERVER_LABELS[s]}</option>)}
          </select>
        </div>
        <div>
          <div style={S.label}>Kalite</div>
          <select className="select-field" value={quality} onChange={e => setQuality(e.target.value)}>
            {Object.entries(QUALITY_NAMES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <button className="btn-primary" onClick={() => search()} disabled={loading}>
          {loading ? 'Sorgulanıyor...' : 'Sorgula'}
        </button>
      </div>

      {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 }}>{error}</div>}

      {results.length > 0 && (
        <div style={S.card}>
          <div style={{ padding: '10px 16px', borderBottom: '1px solid #2a2f3e', fontSize: 12, color: '#64748b' }}>
            Yesil = Satis fiyati (min) | Kirmizi = Alis fiyati (max) | — = Veri yok
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={S.th}>Eşya</th>
                  {CITIES.map(c => <th key={c} style={{ ...S.th, color: CITY_COLORS[c] || '#64748b' }}>{c}</th>)}
                </tr>
              </thead>
              <tbody>
                {itemIds.map(itemId => (
                  <tr key={itemId} style={{ borderBottom: '1px solid #1e2330' }}>
                    <td style={S.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <img src={getItemIcon(itemId, 32)} alt="" style={{ width: 28, height: 28, borderRadius: 4 }} onError={e => { e.target.style.display = 'none' }} />
                        <span style={{ fontSize: 12, color: '#94a3b8' }}>{itemId}</span>
                      </div>
                    </td>
                    {CITIES.map(city => {
                      const d = results.find(r => r.item_id === itemId && r.city === city)
                      return <CityPriceCell key={city} sell={d?.sell_price_min} buy={d?.buy_price_max} updatedAt={d?.sell_price_min_date} />
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && results.length === 0 && !error && (
        <div style={{ color: '#475569', textAlign: 'center', padding: 60, fontSize: 14 }}>
          Bir eşya ID'si girin ve Sorgula butonuna tıklayın
        </div>
      )}
    </div>
  )
}
