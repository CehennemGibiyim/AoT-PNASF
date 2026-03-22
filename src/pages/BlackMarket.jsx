import { useState } from 'react'
import { fetchPrices, formatSilver, getItemIcon } from '../utils/api'

const FLIP_ITEMS = [
  'T4_PLANKS', 'T5_PLANKS', 'T6_PLANKS', 'T7_PLANKS',
  'T4_METALBAR', 'T5_METALBAR', 'T6_METALBAR', 'T7_METALBAR',
  'T4_CLOTH', 'T5_CLOTH', 'T6_CLOTH', 'T7_CLOTH',
  'T4_LEATHER', 'T5_LEATHER', 'T6_LEATHER', 'T7_LEATHER',
  'T4_BAG', 'T5_BAG', 'T6_BAG',
  'T4_CAPE', 'T5_CAPE',
  'T4_MAIN_SWORD', 'T5_MAIN_SWORD', 'T6_MAIN_SWORD',
  'T4_2H_CROSSBOW', 'T5_2H_CROSSBOW', 'T6_2H_CROSSBOW',
  'T4_MAIN_ARCANESTAFF', 'T5_MAIN_ARCANESTAFF',
  'T4_MAIN_HOLYSTAFF', 'T5_MAIN_HOLYSTAFF',
  'T4_ARMOR_LEATHER_SET1', 'T5_ARMOR_LEATHER_SET1',
  'T4_HEAD_LEATHER_SET1', 'T5_HEAD_LEATHER_SET1',
  'T4_SHOES_LEATHER_SET1', 'T5_SHOES_LEATHER_SET1',
]

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

export default function BlackMarket() {
  const [loading, setLoading] = useState(false)
  const [flips, setFlips] = useState([])
  const [taxRate, setTaxRate] = useState(3)
  const [minProfit, setMinProfit] = useState(20000)

  async function findFlips() {
    setLoading(true)
    setFlips([])
    try {
      const prices = await fetchPrices(FLIP_ITEMS, ['Caerleon', 'Black Market', 'Bridgewatch', 'Lymhurst', 'Fort Sterling', 'Martlock', 'Thetford'], 'west', '1')

      const results = []
      for (const itemId of FLIP_ITEMS) {
        const itemPrices = prices.filter(p => p.item_id === itemId)
        const bmData = itemPrices.find(p => p.city === 'Black Market')
        if (!bmData || !bmData.buy_price_max || bmData.buy_price_max === 0) continue

        const bmBuy = bmData.buy_price_max
        const cities = ['Caerleon', 'Bridgewatch', 'Lymhurst', 'Fort Sterling', 'Martlock', 'Thetford']

        for (const city of cities) {
          const cityData = itemPrices.find(p => p.city === city)
          if (!cityData || !cityData.sell_price_min || cityData.sell_price_min === 0) continue
          const citySell = cityData.sell_price_min
          const profit = bmBuy * (1 - taxRate / 100) - citySell
          if (profit >= minProfit) {
            results.push({ itemId, city, buyPrice: citySell, bmBuyOrder: bmBuy, profit, margin: ((profit / citySell) * 100).toFixed(1) })
          }
        }
      }

      results.sort((a, b) => b.profit - a.profit)
      setFlips(results.slice(0, 100))
    } catch (e) {
      alert('Hata: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={S.page}>
      <div style={S.title}>Kara Pazar Flipper</div>
      <div style={S.subtitle}>Şehirden ucuza al, Kara Pazar alış emrine sat — arbitraj fırsatlarını bul</div>

      <div style={{ background: 'rgba(245,200,66,0.08)', border: '1px solid rgba(245,200,66,0.2)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 12, color: '#94a3b8' }}>
        <b style={{ color: '#f5c842' }}>Nasıl Çalışır:</b> Şehirlerdeki satış emri fiyatı ile Kara Pazar'daki alış emri fiyatı arasındaki farkı hesaplar. Vergi düşülmüş net kâr gösterilir.
      </div>

      <div style={S.row}>
        <div>
          <div style={S.label}>Min. Kâr (Silver)</div>
          <input type="number" className="input-field" style={{ width: 140 }} value={minProfit} onChange={e => setMinProfit(Number(e.target.value))} min={0} step={5000} />
        </div>
        <div>
          <div style={S.label}>Vergi %</div>
          <input type="number" className="input-field" style={{ width: 80 }} value={taxRate} onChange={e => setTaxRate(Number(e.target.value))} min={0} max={25} />
        </div>
        <button className="btn-primary" onClick={findFlips} disabled={loading}>
          {loading ? 'Taranıyor...' : 'Flip Fırsatlarını Bul'}
        </button>
      </div>

      {flips.length > 0 && (
        <div style={S.card}>
          <div style={{ padding: '10px 16px', borderBottom: '1px solid #2a2f3e', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{flips.length} fırsat bulundu</span>
            <span style={{ fontSize: 11, color: '#64748b' }}>%{taxRate} vergi düşülmüş</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={S.th}>Eşya</th>
                  <th style={S.th}>Al (Şehir)</th>
                  <th style={S.th}>Şehir Fiyatı</th>
                  <th style={S.th}>BM Alış Emri</th>
                  <th style={S.th}>Net Kâr</th>
                  <th style={S.th}>Marj %</th>
                </tr>
              </thead>
              <tbody>
                {flips.map((f, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #1e2330' }}
                    onMouseOver={e => e.currentTarget.style.background = '#1e2330'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={S.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <img src={getItemIcon(f.itemId, 24)} alt="" style={{ width: 22, height: 22 }} onError={e => { e.target.style.display = 'none' }} />
                        <span style={{ color: '#94a3b8', fontSize: 12 }}>{f.itemId}</span>
                      </div>
                    </td>
                    <td style={S.td}><span style={{ color: '#60a5fa' }}>{f.city}</span></td>
                    <td style={S.td}><span style={{ color: '#f87171' }}>{formatSilver(f.buyPrice)}</span></td>
                    <td style={S.td}><span style={{ color: '#4ade80' }}>{formatSilver(f.bmBuyOrder)}</span></td>
                    <td style={S.td}><span style={{ color: '#f5c842', fontWeight: 700 }}>+{formatSilver(f.profit)}</span></td>
                    <td style={S.td}><span style={{ color: f.margin > 20 ? '#4ade80' : '#e2e8f0' }}>%{f.margin}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && flips.length === 0 && (
        <div style={{ color: '#475569', textAlign: 'center', padding: 60, fontSize: 14 }}>
          Flip Fırsatlarını Bul butonuna tıklayın
        </div>
      )}
    </div>
  )
}
