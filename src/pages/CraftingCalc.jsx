import { useState } from 'react'
import { fetchPrices, formatSilver, getItemIcon, CITIES } from '../utils/api'

const RECIPES = {
  'T4_PLANKS': { name: 'T4 Tahta', inputs: [{ id: 'T3_WOOD', name: 'T3 Kereste', amount: 8 }], output: 1, focus: false },
  'T5_PLANKS': { name: 'T5 Tahta', inputs: [{ id: 'T4_WOOD', name: 'T4 Kereste', amount: 8 }, { id: 'T4_PLANKS', name: 'T4 Tahta', amount: 1 }], output: 1, focus: false },
  'T6_PLANKS': { name: 'T6 Tahta', inputs: [{ id: 'T5_WOOD', name: 'T5 Kereste', amount: 8 }, { id: 'T5_PLANKS', name: 'T5 Tahta', amount: 1 }], output: 1, focus: false },
  'T4_METALBAR': { name: 'T4 Metal Bar', inputs: [{ id: 'T3_ORE', name: 'T3 Cevher', amount: 8 }], output: 1, focus: false },
  'T5_METALBAR': { name: 'T5 Metal Bar', inputs: [{ id: 'T4_ORE', name: 'T4 Cevher', amount: 8 }, { id: 'T4_METALBAR', name: 'T4 Bar', amount: 1 }], output: 1, focus: false },
  'T6_METALBAR': { name: 'T6 Metal Bar', inputs: [{ id: 'T5_ORE', name: 'T5 Cevher', amount: 8 }, { id: 'T5_METALBAR', name: 'T5 Bar', amount: 1 }], output: 1, focus: false },
  'T4_CLOTH': { name: 'T4 Kumaş', inputs: [{ id: 'T3_FIBER', name: 'T3 Lif', amount: 8 }], output: 1, focus: false },
  'T5_CLOTH': { name: 'T5 Kumaş', inputs: [{ id: 'T4_FIBER', name: 'T4 Lif', amount: 8 }, { id: 'T4_CLOTH', name: 'T4 Kumaş', amount: 1 }], output: 1, focus: false },
  'T4_LEATHER': { name: 'T4 Deri', inputs: [{ id: 'T3_HIDE', name: 'T3 Post', amount: 8 }], output: 1, focus: false },
  'T5_LEATHER': { name: 'T5 Deri', inputs: [{ id: 'T4_HIDE', name: 'T4 Post', amount: 8 }, { id: 'T4_LEATHER', name: 'T4 Deri', amount: 1 }], output: 1, focus: false },
  'T4_MAIN_SWORD': { name: 'T4 Kılıç', inputs: [{ id: 'T4_METALBAR', name: 'T4 Bar', amount: 16 }, { id: 'T4_PLANKS', name: 'T4 Tahta', amount: 8 }], output: 1, focus: false },
  'T5_MAIN_SWORD': { name: 'T5 Kılıç', inputs: [{ id: 'T5_METALBAR', name: 'T5 Bar', amount: 16 }, { id: 'T5_PLANKS', name: 'T5 Tahta', amount: 8 }], output: 1, focus: false },
  'T4_BAG': { name: 'T4 Çanta', inputs: [{ id: 'T4_LEATHER', name: 'T4 Deri', amount: 16 }, { id: 'T4_CLOTH', name: 'T4 Kumaş', amount: 8 }], output: 1, focus: false },
  'T5_BAG': { name: 'T5 Çanta', inputs: [{ id: 'T5_LEATHER', name: 'T5 Deri', amount: 16 }, { id: 'T5_CLOTH', name: 'T5 Kumaş', amount: 8 }], output: 1, focus: false },
}

const CITY_BONUS = {
  'Fort Sterling': 0.15,
  'Bridgewatch': 0.15,
  'Lymhurst': 0.15,
  'Martlock': 0.15,
  'Thetford': 0.15,
  'Caerleon': 0,
}

const S = {
  page: { padding: '1.5rem' },
  title: { fontSize: 20, fontWeight: 700, color: '#f5c842', marginBottom: 16 },
  row: { display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'flex-end' },
  label: { fontSize: 12, color: '#64748b', marginBottom: 4 },
  card: { background: '#161921', border: '1px solid #2a2f3e', borderRadius: 12, padding: 16 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  profit: (p) => ({ fontWeight: 700, fontSize: 16, color: p > 0 ? '#4ade80' : p < 0 ? '#f87171' : '#64748b' }),
}

export default function CraftingCalc() {
  const [selectedItem, setSelectedItem] = useState('T4_PLANKS')
  const [city, setCity] = useState('Fort Sterling')
  const [useFocus, setUseFocus] = useState(false)
  const [taxRate, setTaxRate] = useState(3)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  async function calculate() {
    const recipe = RECIPES[selectedItem]
    if (!recipe) return
    setLoading(true)
    try {
      const allIds = [selectedItem, ...recipe.inputs.map(i => i.id)]
      const prices = await fetchPrices(allIds, CITIES, 'west', '1')

      const inputCosts = recipe.inputs.map(inp => {
        const p = prices.find(d => d.item_id === inp.id && d.city === city)
        const unitPrice = p?.sell_price_min || 0
        return { ...inp, unitPrice, totalCost: unitPrice * inp.amount }
      })

      const totalInputCost = inputCosts.reduce((s, i) => s + i.totalCost, 0)
      const cityBonus = CITY_BONUS[city] || 0
      const focusBonus = useFocus ? 0.475 : 0
      const resourceSaved = totalInputCost * (cityBonus + focusBonus)
      const actualCost = totalInputCost - resourceSaved

      const sellData = prices.filter(d => d.item_id === selectedItem)
      const cityPrices = CITIES.map(c => {
        const d = sellData.find(p => p.city === c)
        return { city: c, sell: d?.sell_price_min || 0 }
      }).filter(p => p.sell > 0).sort((a, b) => b.sell - a.sell)

      const bestSell = cityPrices[0]
      const taxMultiplier = 1 - (taxRate / 100)
      const netSell = bestSell ? bestSell.sell * taxMultiplier : 0
      const profit = netSell - actualCost

      setResult({ inputCosts, totalInputCost, cityBonus, focusBonus, actualCost, cityPrices, netSell, profit, bestSell })
    } catch (e) {
      alert('Hesaplama hatası: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={S.page}>
      <div style={S.title}>Crafting Hesaplayıcı</div>

      <div style={S.row}>
        <div style={{ flex: 1 }}>
          <div style={S.label}>Eşya</div>
          <select className="select-field" style={{ width: '100%' }} value={selectedItem} onChange={e => setSelectedItem(e.target.value)}>
            {Object.entries(RECIPES).map(([id, r]) => <option key={id} value={id}>{r.name} ({id})</option>)}
          </select>
        </div>
        <div>
          <div style={S.label}>Craft Şehri</div>
          <select className="select-field" value={city} onChange={e => setCity(e.target.value)}>
            {Object.keys(CITY_BONUS).map(c => <option key={c} value={c}>{c} ({(CITY_BONUS[c] * 100).toFixed(0)}% bonus)</option>)}
          </select>
        </div>
        <div>
          <div style={S.label}>Vergi %</div>
          <input type="number" className="input-field" style={{ width: 80 }} value={taxRate} onChange={e => setTaxRate(Number(e.target.value))} min={0} max={25} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 2 }}>
          <input type="checkbox" id="focus" checked={useFocus} onChange={e => setUseFocus(e.target.checked)} style={{ accentColor: '#f5c842', width: 16, height: 16 }} />
          <label htmlFor="focus" style={{ color: '#94a3b8', fontSize: 13, cursor: 'pointer' }}>Focus Kullan</label>
        </div>
        <button className="btn-primary" onClick={calculate} disabled={loading}>
          {loading ? 'Hesaplanıyor...' : 'Hesapla'}
        </button>
      </div>

      {result && (
        <div style={S.grid}>
          <div style={S.card}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0', marginBottom: 12 }}>Malzeme Maliyeti</div>
            {result.inputCosts.map(inp => (
              <div key={inp.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #1e2330', fontSize: 13 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <img src={getItemIcon(inp.id, 24)} alt="" style={{ width: 20, height: 20 }} onError={e => { e.target.style.display = 'none' }} />
                  <span style={{ color: '#94a3b8' }}>{inp.name} x{inp.amount}</span>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: 11 }}>{formatSilver(inp.unitPrice)} ea = </span>
                  <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{formatSilver(inp.totalCost)}</span>
                </div>
              </div>
            ))}
            <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, color: '#64748b' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Toplam Hammadde:</span><span style={{ color: '#e2e8f0' }}>{formatSilver(result.totalInputCost)}</span>
              </div>
              {result.cityBonus > 0 && <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Şehir Bonusu ({(result.cityBonus * 100).toFixed(0)}%):</span><span style={{ color: '#4ade80' }}>-{formatSilver(result.totalInputCost * result.cityBonus)}</span>
              </div>}
              {result.focusBonus > 0 && <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Focus Bonusu (47.5%):</span><span style={{ color: '#4ade80' }}>-{formatSilver(result.totalInputCost * result.focusBonus)}</span>
              </div>}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#e2e8f0', fontSize: 14, paddingTop: 6, borderTop: '1px solid #2a2f3e' }}>
                <span>Gerçek Maliyet:</span><span>{formatSilver(result.actualCost)}</span>
              </div>
            </div>
          </div>

          <div style={S.card}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0', marginBottom: 12 }}>Satış Fiyatları</div>
            {result.cityPrices.slice(0, 6).map((cp, i) => (
              <div key={cp.city} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #1e2330', fontSize: 13 }}>
                <span style={{ color: i === 0 ? '#f5c842' : '#94a3b8' }}>{cp.city}</span>
                <span style={{ color: i === 0 ? '#f5c842' : '#e2e8f0', fontWeight: i === 0 ? 700 : 400 }}>{formatSilver(cp.sell)}</span>
              </div>
            ))}
            <div style={{ marginTop: 12, background: '#0d0f14', borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>
                En iyi satış: {result.bestSell?.city || '-'} (vergi sonrası)
              </div>
              <div style={{ fontSize: 14, color: '#94a3b8', marginBottom: 8 }}>
                Net Satış: <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{formatSilver(result.netSell)}</span>
              </div>
              <div style={{ fontSize: 18, ...S.profit(result.profit) }}>
                {result.profit >= 0 ? '+ ' : ''}{formatSilver(result.profit)} Silver
              </div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
                {result.actualCost > 0 ? `ROI: ${((result.profit / result.actualCost) * 100).toFixed(1)}%` : ''}
              </div>
            </div>
          </div>
        </div>
      )}

      {!result && (
        <div style={{ color: '#475569', textAlign: 'center', padding: 60, fontSize: 14 }}>
          Eşya seçin ve Hesapla butonuna tıklayın
        </div>
      )}
    </div>
  )
}
