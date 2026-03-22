import { useState, useEffect } from 'react'
import { fetchGoldPrice } from '../utils/api'
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts'

const SERVERS = ['west', 'europe', 'east']
const SERVER_LABELS = { west: 'Batı', europe: 'Avrupa', east: 'Doğu' }

const S = {
  page: { padding: '1.5rem' },
  title: { fontSize: 20, fontWeight: 700, color: '#f5c842', marginBottom: 8 },
  subtitle: { fontSize: 13, color: '#64748b', marginBottom: 16 },
  row: { display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'flex-end' },
  label: { fontSize: 12, color: '#64748b', marginBottom: 4 },
  card: { background: '#161921', border: '1px solid #2a2f3e', borderRadius: 12, padding: 16 },
  statRow: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 16 },
  stat: { background: '#0d0f14', border: '1px solid #2a2f3e', borderRadius: 8, padding: 12 },
}

export default function GoldTracker() {
  const [server, setServer] = useState('west')
  const [count, setCount] = useState(48)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      const raw = await fetchGoldPrice(server, count)
      const formatted = raw.map(d => ({
        time: new Date(d.Timestamp).toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }),
        price: d.Price,
        amount: d.Amount,
      }))
      setData(formatted)
    } catch (e) {
      alert('Hata: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  const prices = data.map(d => d.price)
  const latest = prices[prices.length - 1]
  const highest = Math.max(...prices)
  const lowest = Math.min(...prices)
  const avg = prices.length ? Math.round(prices.reduce((s, p) => s + p, 0) / prices.length) : 0
  const change = prices.length >= 2 ? prices[prices.length - 1] - prices[0] : 0

  return (
    <div style={S.page}>
      <div style={S.title}>Gold Fiyat Takipçisi</div>
      <div style={S.subtitle}>Gerçek zamanlı gold (altın) fiyat geçmişi ve istatistikleri</div>

      <div style={S.row}>
        <div>
          <div style={S.label}>Sunucu</div>
          <select className="select-field" value={server} onChange={e => setServer(e.target.value)}>
            {SERVERS.map(s => <option key={s} value={s}>{SERVER_LABELS[s]}</option>)}
          </select>
        </div>
        <div>
          <div style={S.label}>Veri Sayısı</div>
          <select className="select-field" value={count} onChange={e => setCount(Number(e.target.value))}>
            <option value={24}>Son 24</option>
            <option value={48}>Son 48</option>
            <option value={96}>Son 96</option>
            <option value={168}>Son 168</option>
          </select>
        </div>
        <button className="btn-primary" onClick={load} disabled={loading}>
          {loading ? 'Yükleniyor...' : 'Güncelle'}
        </button>
      </div>

      {data.length > 0 && (
        <>
          <div style={S.statRow}>
            <div style={S.stat}>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>Güncel</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#f5c842' }}>{latest?.toLocaleString()}</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>Silver / 100 Gold</div>
            </div>
            <div style={S.stat}>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>En Yüksek</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#4ade80' }}>{highest?.toLocaleString()}</div>
            </div>
            <div style={S.stat}>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>En Düşük</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#f87171' }}>{lowest?.toLocaleString()}</div>
            </div>
            <div style={S.stat}>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>Değişim</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: change >= 0 ? '#4ade80' : '#f87171' }}>
                {change >= 0 ? '+' : ''}{change?.toLocaleString()}
              </div>
            </div>
          </div>

          <div style={S.card}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0', marginBottom: 14 }}>Gold Fiyat Grafiği</div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2330" />
                <XAxis dataKey="time" tick={{ fill: '#475569', fontSize: 10 }} interval={Math.floor(data.length / 8)} />
                <YAxis tick={{ fill: '#475569', fontSize: 10 }} width={70} tickFormatter={v => v.toLocaleString()} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{ background: '#161921', border: '1px solid #2a2f3e', borderRadius: 8, color: '#e2e8f0', fontSize: 12 }}
                  formatter={v => [v.toLocaleString() + ' Silver', 'Gold']}
                />
                <Line type="monotone" dataKey="price" stroke="#f5c842" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={{ ...S.card, marginTop: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0', marginBottom: 14 }}>Son {Math.min(20, data.length)} Kayıt</div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, color: '#64748b', borderBottom: '1px solid #2a2f3e' }}>Zaman</th>
                  <th style={{ padding: '8px 12px', textAlign: 'right', fontSize: 11, color: '#64748b', borderBottom: '1px solid #2a2f3e' }}>Fiyat</th>
                  <th style={{ padding: '8px 12px', textAlign: 'right', fontSize: 11, color: '#64748b', borderBottom: '1px solid #2a2f3e' }}>Miktar</th>
                </tr>
              </thead>
              <tbody>
                {data.slice(-20).reverse().map((d, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #1e2330' }}>
                    <td style={{ padding: '7px 12px', fontSize: 12, color: '#64748b' }}>{d.time}</td>
                    <td style={{ padding: '7px 12px', fontSize: 13, fontWeight: 600, color: '#f5c842', textAlign: 'right' }}>{d.price?.toLocaleString()}</td>
                    <td style={{ padding: '7px 12px', fontSize: 12, color: '#94a3b8', textAlign: 'right' }}>{d.amount?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!loading && data.length === 0 && (
        <div style={{ color: '#475569', textAlign: 'center', padding: 60, fontSize: 14 }}>Güncelle butonuna tıklayın</div>
      )}
    </div>
  )
}
