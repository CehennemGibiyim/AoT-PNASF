import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts'

const MARKET_ALERTS = [
  {
    id: 1,
    type: 'price_spike',
    item: 'T8_BOW',
    item_name: 'Master Warbow',
    current_price: 4500000,
    previous_price: 3200000,
    change_percent: 40.6,
    city: 'Caerleon',
    time: '2 dk önce',
    alert_level: 'high',
    reason: 'ZVZ season başlangıcı, talep artışı',
    prediction: '24 saat içinde %15 düşebilir'
  },
  {
    id: 2,
    type: 'price_drop',
    item: 'T8_STAFF',
    item_name: 'Grand Fire Staff',
    current_price: 2800000,
    previous_price: 3500000,
    change_percent: -20.0,
    city: 'Thetford',
    time: '5 dk önce',
    alert_level: 'medium',
    reason: 'New patch meta değişimi',
    prediction: 'Stabilize olabilir'
  },
  {
    id: 3,
    type: 'arbitrage',
    item: 'T8_ARMOR_PLATE',
    item_name: 'Grandmaster Plate Armor',
    buy_city: 'Bridgewatch',
    buy_price: 2500000,
    sell_city: 'Caerleon',
    sell_price: 3200000,
    profit: 700000,
    profit_percent: 28.0,
    time: '8 dk önce',
    alert_level: 'high',
    reason: 'Şehirler arası fiyat farkı',
    prediction: 'Kısa süreli fırsat'
  },
  {
    id: 4,
    type: 'volume_surge',
    item: 'T8_MOUNT_HORSE',
    item_name: 'Armored Horse',
    volume_24h: 1250,
    avg_volume: 450,
    volume_increase: 177.8,
    current_price: 1800000,
    trend: 'up',
    time: '15 dk önce',
    alert_level: 'medium',
    reason: 'Mount season etkisi',
    prediction: 'Talep devam edebilir'
  }
]

const WATCHED_ITEMS = [
  { id: 'T8_BOW', name: 'Master Warbow', target_price: 4000000, current_price: 4500000, alert_above: true, alert_below: false },
  { id: 'T8_STAFF', name: 'Grand Fire Staff', target_price: 3000000, current_price: 2800000, alert_above: false, alert_below: true },
  { id: 'T8_ARMOR_PLATE', name: 'Grandmaster Plate', target_price: 2500000, current_price: 3200000, alert_above: true, alert_below: false },
  { id: 'T8_DAGGER_PAIR', name: 'Demon Daggers', target_price: 5000000, current_price: 4800000, alert_above: false, alert_below: true }
]

const MARKET_TRENDS = [
  { category: 'Weapons', trend: 'up', change: 12.5, top_gainer: 'T8_BOW', top_loser: 'T8_CROSSBOW' },
  { category: 'Armor', trend: 'down', change: -8.3, top_gainer: 'T8_ARMOR_LEATHER', top_loser: 'T8_ARMOR_PLATE' },
  { category: 'Resources', trend: 'up', change: 15.7, top_gainer: 'T8_ORE', top_loser: 'T8_WOOD' },
  { category: 'Mounts', trend: 'stable', change: 2.1, top_gainer: 'T8_MOUNT_HORSE', top_loser: 'T8_MOUNT_OX' }
]

const COLORS = ['#ef4444', '#f5c842', '#10b981', '#3b82f6', '#8b5cf6', '#f97316']

export default function MarketTrackerPage() {
  const [selectedTab, setSelectedTab] = useState('alerts')
  const [selectedCity, setSelectedCity] = useState('all')
  const [priceHistory, setPriceHistory] = useState([])
  const [watchedItems, setWatchedItems] = useState(WATCHED_ITEMS)
  const [alertSettings, setAlertSettings] = useState({
    price_spike: true,
    price_drop: true,
    arbitrage: true,
    volume_surge: true
  })

  const getAlertColor = (level) => {
    switch(level) {
      case 'high': return '#ef4444'
      case 'medium': return '#f5c842'
      case 'low': return '#10b981'
      default: return '#6b7280'
    }
  }

  const getTrendColor = (trend) => {
    return trend === 'up' ? '#10b981' : trend === 'down' ? '#ef4444' : '#f5c842'
  }

  const formatSilver = (value) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
    return value.toString()
  }

  const addWatchItem = (itemId) => {
    if (!watchedItems.find(item => item.id === itemId)) {
      const newItem = {
        id: itemId,
        name: `Watch Item ${watchedItems.length + 1}`,
        target_price: 3000000,
        current_price: 3000000,
        alert_above: true,
        alert_below: true
      }
      setWatchedItems([...watchedItems, newItem])
    }
  }

  const removeWatchItem = (itemId) => {
    setWatchedItems(watchedItems.filter(item => item.id !== itemId))
  }

  return (
    <div style={{ padding: '1.5rem', minHeight: '100vh', background: '#0d0f14' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: '#f5c842', fontSize: 28, fontWeight: 700, margin: 0 }}>
          Market Takip ve Alert Sistemi
        </h1>
        <p style={{ color: '#64748b', margin: 0, fontSize: 14 }}>
          Gerçek zamanlı fiyat takibi, arbitraj fırsatları ve kişisel alert'ler
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        {['alerts', 'watched', 'trends', 'analytics'].map(tab => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            style={{
              background: selectedTab === tab ? '#f5c842' : '#1a1d29',
              color: selectedTab === tab ? '#0d0f14' : '#94a3b8',
              border: selectedTab === tab ? '1px solid #f5c842' : '1px solid #2a2f3e',
              borderRadius: 8,
              padding: '8px 16px',
              fontSize: 13,
              fontWeight: selectedTab === tab ? 600 : 400,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {tab === 'alerts' && 'Alert\'lar'}
            {tab === 'watched' && 'İzlenenler'}
            {tab === 'trends' && 'Trendler'}
            {tab === 'analytics' && 'Analizler'}
          </button>
        ))}
      </div>

      {selectedTab === 'alerts' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 12, padding: '1.5rem' }}>
            <h2 style={{ color: '#f5c842', fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>
              Alert Ayarları
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Object.entries(alertSettings).map(([key, value]) => (
                <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#e2e8f0', fontSize: 13 }}>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setAlertSettings(prev => ({ ...prev, [key]: e.target.checked }))}
                    style={{ width: 16, height: 16 }}
                  />
                  <span>
                    {key === 'price_spike' && 'Fiyat Artışları'}
                    {key === 'price_drop' && 'Fiyat Düşüşleri'}
                    {key === 'arbitrage' && 'Arbitraj Fırsatları'}
                    {key === 'volume_surge' && 'Hacim Artışları'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 12, padding: '1.5rem' }}>
            <h2 style={{ color: '#f5c842', fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>
              Aktif Alert'ler
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {MARKET_ALERTS.filter(alert => alertSettings[alert.type]).map(alert => (
                <div key={alert.id} style={{ 
                  background: '#0d0f14', 
                  border: `1px solid ${getAlertColor(alert.alert_level)}`, 
                  borderRadius: 8, 
                  padding: '12px',
                  borderLeft: `4px solid ${getAlertColor(alert.alert_level)}`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ 
                          background: getAlertColor(alert.alert_level),
                          color: 'white',
                          padding: '2px 6px',
                          borderRadius: 4,
                          fontSize: 10
                        }}>
                          {alert.alert_level.toUpperCase()}
                        </span>
                        <span style={{ color: '#94a3b8', fontSize: 11 }}>{alert.time}</span>
                      </div>
                      <div style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 600 }}>
                        {alert.type === 'price_spike' && `${alert.item_name} fiyat artışı`}
                        {alert.type === 'price_drop' && `${alert.item_name} fiyat düşüşü`}
                        {alert.type === 'arbitrage' && `${alert.item_name} arbitraj fırsatı`}
                        {alert.type === 'volume_surge' && `${alert.item_name} hacim artışı`}
                      </div>
                      <div style={{ color: '#64748b', fontSize: 11 }}>{alert.reason}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      {alert.type === 'arbitrage' ? (
                        <div>
                          <div style={{ color: '#10b981', fontSize: 12, fontWeight: 600 }}>
                            +{formatSilver(alert.profit)}
                          </div>
                          <div style={{ color: '#94a3b8', fontSize: 10 }}>
                            {alert.profit_percent}% kâr
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div style={{ 
                            color: alert.change_percent > 0 ? '#10b981' : '#ef4444',
                            fontSize: 12,
                            fontWeight: 600
                          }}>
                            {alert.change_percent > 0 ? '+' : ''}{alert.change_percent}%
                          </div>
                          <div style={{ color: '#94a3b8', fontSize: 10 }}>
                            {formatSilver(alert.current_price)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {alert.prediction && (
                    <div style={{ 
                      background: '#1a1d29', 
                      border: '1px solid #2a2f3e', 
                      borderRadius: 6, 
                      padding: '8px',
                      marginTop: 8,
                      fontSize: 11,
                      color: '#94a3b8'
                    }}>
                      💡 Tahmin: {alert.prediction}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'watched' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 12, padding: '1.5rem' }}>
            <h2 style={{ color: '#f5c842', fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>
              İzlenen Item'lar
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {watchedItems.map(item => (
                <div key={item.id} style={{ 
                  background: '#0d0f14', 
                  border: '1px solid #2a2f3e', 
                  borderRadius: 8, 
                  padding: '12px' 
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600 }}>
                      {item.name}
                    </div>
                    <button
                      onClick={() => removeWatchItem(item.id)}
                      style={{
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: 4,
                        padding: '4px 8px',
                        fontSize: 10,
                        cursor: 'pointer'
                      }}
                    >
                      Kaldır
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                    <div>
                      <div style={{ color: '#64748b', fontSize: 11, marginBottom: 4 }}>Hedef Fiyat</div>
                      <div style={{ color: '#e2e8f0', fontSize: 12 }}>{formatSilver(item.target_price)}</div>
                    </div>
                    <div>
                      <div style={{ color: '#64748b', fontSize: 11, marginBottom: 4 }}>Mevcut Fiyat</div>
                      <div style={{ 
                        color: item.current_price > item.target_price ? '#10b981' : '#ef4444',
                        fontSize: 12
                      }}>
                        {formatSilver(item.current_price)}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#94a3b8', fontSize: 11 }}>
                      <input
                        type="checkbox"
                        checked={item.alert_above}
                        onChange={(e) => {
                          const updated = watchedItems.map(w => 
                            w.id === item.id ? { ...w, alert_above: e.target.checked } : w
                          )
                          setWatchedItems(updated)
                        }}
                      />
                      Üstünde alert
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#94a3b8', fontSize: 11 }}>
                      <input
                        type="checkbox"
                        checked={item.alert_below}
                        onChange={(e) => {
                          const updated = watchedItems.map(w => 
                            w.id === item.id ? { ...w, alert_below: e.target.checked } : w
                          )
                          setWatchedItems(updated)
                        }}
                      />
                      Altında alert
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 12, padding: '1.5rem' }}>
            <h2 style={{ color: '#f5c842', fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>
              Fiyat Grafiği
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={[
                { time: '00:00', price: 3000000 },
                { time: '04:00', price: 3200000 },
                { time: '08:00', price: 3500000 },
                { time: '12:00', price: 2800000 },
                { time: '16:00', price: 4500000 },
                { time: '20:00', price: 4200000 },
                { time: '23:00', price: 4000000 }
              ]}>
                <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 8 }}
                />
                <Area type="monotone" dataKey="price" stroke="#f5c842" fill="#f5c842" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {selectedTab === 'trends' && (
        <div style={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 12, padding: '1.5rem' }}>
          <h2 style={{ color: '#f5c842', fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>
            Piyasa Trendleri
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            {MARKET_TRENDS.map(trend => (
              <div key={trend.category} style={{ 
                background: '#0d0f14', 
                border: '1px solid #2a2f3e', 
                borderRadius: 8, 
                padding: '1rem' 
              }}>
                <h3 style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
                  {trend.category}
                </h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ 
                    background: getTrendColor(trend.trend),
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: 4,
                    fontSize: 11
                  }}>
                    {trend.trend === 'up' ? '↑' : trend.trend === 'down' ? '↓' : '→'} {Math.abs(trend.change)}%
                  </span>
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.4 }}>
                  <div><strong>En Çok Kazanan:</strong> {trend.top_gainer}</div>
                  <div><strong>En Çok Kaybeden:</strong> {trend.top_loser}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedTab === 'analytics' && (
        <div style={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 12, padding: '1.5rem' }}>
          <h2 style={{ color: '#f5c842', fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>
            Market Analizleri
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <h3 style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
                Hacim Analizi
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={[
                  { category: 'Silahlar', volume: 4500, change: 15.2 },
                  { category: 'Zırhlar', volume: 3200, change: -8.5 },
                  { category: 'Kaynaklar', volume: 8900, change: 22.1 },
                  { category: 'Mountlar', volume: 2100, change: 5.8 }
                ]}>
                  <XAxis dataKey="category" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 8 }}
                  />
                  <Bar dataKey="volume" fill="#f5c842" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div>
              <h3 style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
                Fiyat Volatilitesi
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={[
                  { time: 'Pazartesi', volatility: 12.5 },
                  { time: 'Salı', volatility: 18.2 },
                  { time: 'Çarşamba', volatility: 8.7 },
                  { time: 'Perşembe', volatility: 15.3 },
                  { time: 'Cuma', volatility: 22.8 },
                  { time: 'Cumartesi', volatility: 28.4 },
                  { time: 'Pazar', volatility: 19.6 }
                ]}>
                  <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 8 }}
                  />
                  <Line type="monotone" dataKey="volatility" stroke="#f97316" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
