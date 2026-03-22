import { useState } from 'react'
import { fetchPrices, CITIES, formatSilver, getItemIcon } from '../utils/api'

const TRADEABLE_ITEMS = [
  'T4_PLANKS', 'T5_PLANKS', 'T6_PLANKS', 'T7_PLANKS', 'T8_PLANKS',
  'T4_METALBAR', 'T5_METALBAR', 'T6_METALBAR', 'T7_METALBAR', 'T8_METALBAR',
  'T4_CLOTH', 'T5_CLOTH', 'T6_CLOTH', 'T7_CLOTH', 'T8_CLOTH',
  'T4_LEATHER', 'T5_LEATHER', 'T6_LEATHER', 'T7_LEATHER', 'T8_LEATHER',
  'T4_BAG', 'T5_BAG', 'T6_BAG',
  'T4_CAPE', 'T5_CAPE', 'T6_CAPE',
  'T4_MAIN_SWORD', 'T5_MAIN_SWORD', 'T6_MAIN_SWORD',
  'T4_2H_CROSSBOW', 'T5_2H_CROSSBOW',
  'T4_WOOD', 'T5_WOOD', 'T6_WOOD',
  'T4_ORE', 'T5_ORE', 'T6_ORE',
  'T4_ROCK', 'T5_ROCK',
  'T4_FIBER', 'T5_FIBER', 'T6_FIBER',
  'T4_HIDE', 'T5_HIDE', 'T6_HIDE',
]

const TRANSPORT_COST_PER_SLOT = 1000

const S = {
  page: { padding: '1.5rem' },
  title: { fontSize: 20, fontWeight: 700, color: '#f5c842', marginBottom: 8 },
  subtitle: { fontSize: 13, color: '#64748b', marginBottom: 16 },
  row: { display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'flex-end' },
  label: { fontSize: 12, color: '#64748b', marginBottom: 4 },
  card: { background: '#161921', border: '1px solid #2a2f3e', borderRadius: 12 },
  th: { padding: '10px 12px', textAlign: 'left', fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '1px solid #2a2f3e' },
  td: { padding: '8px 12px', fontSize: 13 },
}

export default function TradeRoutes() {
  const [loading, setLoading] = useState(false)
  const [routes, setRoutes] = useState([])
  const [minProfit, setMinProfit] = useState(50000)
  const [taxRate, setTaxRate] = useState(3)
  const [quantity, setQuantity] = useState(1)

  async function findRoutes() {
    setLoading(true)
    setRoutes([])
    try {
      const prices = await fetchPrices(TRADEABLE_ITEMS, CITIES, 'west', '1')
      const routeMap = []

      for (const itemId of TRADEABLE_ITEMS) {
        const itemPrices = prices.filter(p => p.item_id === itemId)
        const buyCities = itemPrices.filter(p => p.sell_price_min > 0).map(p => ({ city: p.city, price: p.sell_price_min }))
        const sellCities = itemPrices.filter(p => p.buy_price_max > 0).map(p => ({ city: p.city, price: p.buy_price_max }))

        for (const buy of buyCities) {
          for (const sell of sellCities) {
            if (buy.city === sell.city) continue
            const buyTotal = buy.price * quantity
            const sellNet = sell.price * quantity * (1 - taxRate / 100)
            const profit = sellNet - buyTotal - TRANSPORT_COST_PER_SLOT

            if (profit >= minProfit) {
              routeMap.push({
                itemId,
                buyCity: buy.city,
                sellCity: sell.city,
                buyPrice: buy.price,
                sellPrice: sell.price,
                profit,
                roi: ((profit / buyTotal) * 100).toFixed(1),
              })
            }
          }
        }
      }

      routeMap.sort((a, b) => b.profit - a.profit)
      setRoutes(routeMap.slice(0, 100))
    } catch (e) {
      alert('Hata: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={S.page}>
      <div style={S.title}>Ticaret Rotası Bulucu</div>
      <div style={S.subtitle}>Şehirler arası en karlı alım-satım fırsatlarını bul</div>

      <div style={S.row}>
        <div>
          <div style={S.label}>Min. Kâr (Silver)</div>
          <input type="number" className="input-field" style={{ width: 140 }} value={minProfit} onChange={e => setMinProfit(Number(e.target.value))} min={0} step={10000} />
        </div>
        <div>
          <div style={S.label}>Adet</div>
          <input type="number" className="input-field" style={{ width: 80 }} value={quantity} onChange={e => setQuantity(Number(e.target.value))} min={1} max={1000} />
        </div>
        <div>
          <div style={S.label}>Vergi %</div>
          <input type="number" className="input-field" style={{ width: 80 }} value={taxRate} onChange={e => setTaxRate(Number(e.target.value))} min={0} max={25} />
        </div>
        <button className="btn-primary" onClick={findRoutes} disabled={loading}>
          {loading ? 'Taranıyor...' : 'Rotaları Bul'}
        </button>
      </div>

      {routes.length > 0 && (
        <div style={S.card}>
          <div style={{ padding: '10px 16px', borderBottom: '1px solid #2a2f3e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{routes.length} rota bulundu</span>
            <span style={{ fontSize: 11, color: '#64748b' }}>x{quantity} adet, %{taxRate} vergi</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={S.th}>Eşya</th>
                  <th style={S.th}>Alış Şehri</th>
                  <th style={S.th}>Alış Fiyatı</th>
                  <th style={S.th}>Satış Şehri</th>
                  <th style={S.th}>Satış Fiyatı</th>
                  <th style={S.th}>Kâr</th>
                  <th style={S.th}>ROI</th>
                </tr>
              </thead>
              <tbody>
                {routes.map((r, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #1e2330' }}
                    onMouseOver={e => e.currentTarget.style.background = '#1e2330'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={S.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <img src={getItemIcon(r.itemId, 24)} alt="" style={{ width: 22, height: 22 }} onError={e => { e.target.style.display = 'none' }} />
                        <span style={{ color: '#94a3b8', fontSize: 12 }}>{r.itemId}</span>
                      </div>
                    </td>
                    <td style={S.td}><span style={{ color: '#60a5fa' }}>{r.buyCity}</span></td>
                    <td style={S.td}><span style={{ color: '#f87171' }}>{formatSilver(r.buyPrice)}</span></td>
                    <td style={S.td}><span style={{ color: '#34d399' }}>{r.sellCity}</span></td>
                    <td style={S.td}><span style={{ color: '#4ade80' }}>{formatSilver(r.sellPrice)}</span></td>
                    <td style={S.td}><span style={{ color: '#f5c842', fontWeight: 700 }}>+{formatSilver(r.profit)}</span></td>
                    <td style={S.td}><span style={{ color: r.roi > 20 ? '#4ade80' : '#e2e8f0' }}>%{r.roi}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && routes.length === 0 && (
        <div style={{ color: '#475569', textAlign: 'center', padding: 60, fontSize: 14 }}>
          Rotaları Bul butonuna tıklayın — tüm şehirler taranacak
        </div>
      )}
    </div>
  )
}
