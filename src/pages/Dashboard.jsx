import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchGoldPrice, fetchPrices, formatSilver, getItemIcon } from '../utils/api'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const POPULAR_ITEMS = [
  { id: 'T4_BAG', name: 'T4 Çanta' },
  { id: 'T5_BAG', name: 'T5 Çanta' },
  { id: 'T4_MAIN_SWORD', name: 'T4 Kılıç' },
  { id: 'T6_MAIN_SWORD', name: 'T6 Kılıç' },
  { id: 'T4_2H_CROSSBOW', name: 'T4 Yay' },
  { id: 'T4_CAPE', name: 'T4 Pelerin' },
]

const STAT_CARDS = [
  { label: 'Aktif Oyuncu', value: '85K+', color: '#f5c842', desc: 'Kayıtlı kullanıcı', icon: '' },
  { label: 'Sunucular', value: '3', color: '#4a9eff', desc: 'Batı, Avrupa, Doğu', icon: '' },
  { label: 'API Verileri', value: 'Canlı', color: '#4ade80', desc: 'Albion Data Project', icon: '' },
  { label: 'Araç Sayısı', value: '6+', color: '#fb923c', desc: 'Entegre araç', icon: '' },
]

const WIDGET_DATA = {
  market: {
    title: 'Market Durumu',
    icon: '',
    items: [
      { label: 'Gold Fiyatı', value: '3,842', change: '+2.3%', trend: 'up' },
      { label: 'Toplam İşlem', value: '1.2M', change: '+12%', trend: 'up' },
      { label: 'Aktif Oyuncu', value: '28.4K', change: '+5.1%', trend: 'up' }
    ]
  },
  pvp: {
    title: 'PvP Aktivite',
    icon: '',
    items: [
      { label: 'Son 1 Saat', value: '847', change: '+15%', trend: 'up' },
      { label: 'ZVZ Katılım', value: '12.3K', change: '-3%', trend: 'down' },
      { label: 'Toplam Kill', value: '124K', change: '+8%', trend: 'up' }
    ]
  },
  dungeons: {
    title: 'Dungeon Aktivite',
    icon: '',
    items: [
      { label: 'Avalon Runs', value: '2,341', change: '+18%', trend: 'up' },
      { label: 'HCE Clears', value: '892', change: '+5%', trend: 'up' },
      { label: 'Mist Dungeons', value: '5.6K', change: '+22%', trend: 'up' }
    ]
  },
  gathering: {
    title: 'Toplama Aktivite',
    icon: '',
    items: [
      { label: 'Ore Gathered', value: '892K', change: '+7%', trend: 'up' },
      { label: 'Fiber Gathered', value: '456K', change: '+4%', trend: 'up' },
      { label: 'Fishing', value: '123K', change: '-2%', trend: 'down' }
    ]
  }
}

const COMING_FEATURES = [
  { icon: '', color: '#10b981', title: 'Killboard Entegrasyonu', desc: 'Anlık PvP verileri ve Discord bot' },
  { icon: '', color: '#3b82f6', title: '3D Harita Sistemi', desc: 'Google Earth tarzı interaktif harita' },
  { icon: '', color: '#8b5cf6', title: 'Yapay Zeka Analiz', desc: 'Build önerileri ve fiyat tahminleme' },
  { icon: '', color: '#ef4444', title: 'Avalon Rehberleri', desc: 'Boss stratejileri ve dungeon taktikleri' }
]

const S = {
  page: { padding: '1.5rem', maxWidth: 1400 },
  title: { fontSize: 22, fontWeight: 700, color: '#f5c842', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#64748b', marginBottom: '1.5rem' },
  grid4: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  card: { background: '#161921', border: '1px solid #2a2f3e', borderRadius: 12, padding: 16 },
  cardTitle: { fontSize: 13, color: '#64748b', marginBottom: 4 },
  cardVal: { fontSize: 26, fontWeight: 700 },
  cardDesc: { fontSize: 11, color: '#475569', marginTop: 2 },
  sectionTitle: { fontSize: 15, fontWeight: 600, color: '#e2e8f0', marginBottom: 12 },
  itemRow: { display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid #1e2330' },
}

export default function Dashboard() {
  const [gold, setGold] = useState([])
  const [prices, setPrices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetchGoldPrice('west', 24).catch(() => []),
      fetchPrices(POPULAR_ITEMS.map(i => i.id), ['Caerleon', 'Bridgewatch'], 'west', '1').catch(() => []),
    ]).then(([g, p]) => {
      setGold(g.map(d => ({ time: new Date(d.Timestamp).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }), price: d.Price })))
      setPrices(p)
      setLoading(false)
    })
  }, [])

  const latestGold = gold.length ? gold[gold.length - 1]?.price : null

  return (
    <div style={S.page}>
      <div style={S.title}>Albion Online Panel</div>
      <div style={S.subtitle}>Gerçek zamanlı piyasa verileri ve araçlar — Albion Data Project tarafından desteklenmektedir</div>

      <div style={S.grid4}>
        {STAT_CARDS.map(c => (
          <div key={c.label} style={S.card}>
            <div style={S.cardTitle}>{c.label}</div>
            <div style={{ ...S.cardVal, color: c.color }}>{c.value}</div>
            <div style={S.cardDesc}>{c.desc}</div>
          </div>
        ))}
      </div>

      <div style={S.grid2}>
        <div style={S.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={S.sectionTitle}>Gold Fiyatı (24s)</div>
            {latestGold && <span style={{ color: '#f5c842', fontWeight: 700, fontSize: 18 }}>{latestGold.toLocaleString()} Silver</span>}
          </div>
          {loading ? (
            <div style={{ color: '#475569', textAlign: 'center', padding: 40 }}>Yükleniyor...</div>
          ) : gold.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={gold}>
                <XAxis dataKey="time" tick={{ fill: '#475569', fontSize: 10 }} interval="preserveStartEnd" />
                <YAxis tick={{ fill: '#475569', fontSize: 10 }} width={60} tickFormatter={v => v.toLocaleString()} />
                <Tooltip
                  contentStyle={{ background: '#161921', border: '1px solid #2a2f3e', borderRadius: 8, color: '#e2e8f0' }}
                  formatter={v => [v.toLocaleString() + ' Silver', 'Gold']}
                />
                <Line type="monotone" dataKey="price" stroke="#f5c842" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ color: '#475569', textAlign: 'center', padding: 40 }}>Veri yok</div>
          )}
        </div>

        <div style={S.card}>
          <div style={S.sectionTitle}>Popüler Eşyalar — Caerleon</div>
          {loading ? (
            <div style={{ color: '#475569', textAlign: 'center', padding: 40 }}>Yükleniyor...</div>
          ) : (
            <div>
              {POPULAR_ITEMS.map(item => {
                const priceData = prices.filter(p => p.item_id === item.id && p.city === 'Caerleon')
                const sell = priceData.find(p => p.sell_price_min > 0)?.sell_price_min
                return (
                  <div key={item.id} style={S.itemRow}>
                    <img src={getItemIcon(item.id, 32)} alt={item.name} style={{ width: 28, height: 28, borderRadius: 4 }} onError={e => { e.target.style.display = 'none' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: '#e2e8f0' }}>{item.name}</div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>{item.id}</div>
                    </div>
                    <div style={{ fontWeight: 600, color: sell ? '#4ade80' : '#475569', fontSize: 13 }}>
                      {sell ? formatSilver(sell) : 'N/A'}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div style={{ ...S.card, marginTop: 16 }}>
        <div style={S.sectionTitle}>Hizli Erisim</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
          {[
            { href: '/prices', label: 'Fiyat Sorgula', desc: 'Tüm şehirlerde anlık fiyatlar' },
            { href: '/crafting', label: 'Crafting Calc', desc: 'Craft karlılık hesapla' },
            { href: '/trade', label: 'Ticaret Rotaları', desc: 'En karlı rotaları bul' },
            { href: '/blackmarket', label: 'Kara Pazar Flipper', desc: 'Caerleon fiyat farkları' },
            { href: '/map', label: 'Harita & Rota', desc: 'Ağırlıklı yol bulma' },
            { href: '/gold', label: 'Gold Takip', desc: 'Altın fiyat geçmişi' },
          ].map(l => (
            <a key={l.href} href={l.href} style={{ background: '#1e2330', border: '1px solid #2a2f3e', borderRadius: 8, padding: 14, textDecoration: 'none', transition: 'border-color 0.15s', display: 'block' }}
              onMouseOver={e => e.currentTarget.style.borderColor = '#f5c842'}
              onMouseOut={e => e.currentTarget.style.borderColor = '#2a2f3e'}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{l.label}</div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{l.desc}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
