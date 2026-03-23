import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

const WORLD_EVENTS = [
  {
    id: 1,
    name: 'World Boss: Morgana',
    type: 'world_boss',
    next_spawn: '2024-03-24 20:00',
    spawn_window: '20:00-22:00',
    location: 'Caerleon Outskirts',
    difficulty: 'Extreme',
    min_players: 50,
    recommended_ip: '1200+',
    rewards: {
      fame: '5M-10M',
      silver: '2M-5M',
      unique_items: ['Morgana\'s Heart', 'Demonic Essence'],
      chance_for_tome: 15
    },
    mechanics: ['AoE Damage', 'Life Drain', 'Summon Minions', 'Phase Changes'],
    participants: 0,
    status: 'upcoming'
  },
  {
    id: 2,
    name: 'Crystal Golem Event',
    type: 'seasonal_event',
    next_spawn: '2024-03-25 18:00',
    spawn_window: '18:00-20:00',
    location: 'All Royal Cities',
    difficulty: 'Hard',
    min_players: 10,
    recommended_ip: '800+',
    rewards: {
      fame: '500K-1M',
      silver: '100K-500K',
      unique_items: ['Crystal Shards', 'Enchanted Crystals'],
      chance_for_tome: 5
    },
    mechanics: ['Crystal Collection', 'Group Puzzle', 'Time Challenge'],
    participants: 156,
    status: 'active'
  },
  {
    id: 3,
    name: 'Avalonian Invasion',
    type: 'avalon_event',
    next_spawn: '2024-03-26 15:00',
    spawn_window: '15:00-17:00',
    location: 'Random Yellow/Red Zones',
    difficulty: 'Very Hard',
    min_players: 20,
    recommended_ip: '1000+',
    rewards: {
      fame: '1M-3M',
      silver: '500K-1M',
      unique_items: ['Avalonian Artifacts', 'Ancient Relics'],
      chance_for_tome: 25
    },
    mechanics: ['Portal Defense', 'Wave Survival', 'Elite Enemies'],
    participants: 89,
    status: 'upcoming'
  },
  {
    id: 4,
    name: 'Fishing Tournament',
    type: 'mini_event',
    next_spawn: '2024-03-27 12:00',
    spawn_window: '12:00-14:00',
    location: 'Lymhurst Harbor',
    difficulty: 'Medium',
    min_players: 5,
    recommended_ip: '600+',
    rewards: {
      fame: '100K-300K',
      silver: '50K-200K',
      unique_items: ['Fishing Trophy', 'Rare Fish'],
      chance_for_tome: 2
    },
    mechanics: ['Fishing Competition', 'Time Trial', 'Rare Catch'],
    participants: 234,
    status: 'active'
  }
]

const ISLAND_TEMPLATES = [
  {
    id: 'farming_island',
    name: 'Farming Adası',
    type: 'resource_production',
    size: 'medium',
    cost: 5000000,
    daily_upkeep: 50000,
    building_slots: 8,
    resource_bonus: {
      farming: 25,
      animal_husbandry: 15
    },
    special_features: ['Greenhouse', 'Animal Pen', 'Processing Station'],
    description: 'Tarım ve hayvancılık için optimize edilmiş ada'
  },
  {
    id: 'crafting_island',
    name: 'Crafting Adası',
    type: 'crafting_hub',
    size: 'large',
    cost: 15000000,
    daily_upkeep: 150000,
    building_slots: 12,
    crafting_bonus: {
      focus_crafting: 20,
      resource_return: 10
    },
    special_features: ['Forge', 'Alchemist Lab', 'Enchanter Tower'],
    description: 'Crafting ve zanaat için tam donanımlı ada'
  },
  {
    id: 'military_island',
    name: 'Askeri Üs',
    type: 'military_outpost',
    size: 'small',
    cost: 8000000,
    daily_upkeep: 100000,
    building_slots: 6,
    military_bonus: {
      troop_training: 30,
      defense_bonus: 25
    },
    special_features: ['Barracks', 'Training Ground', 'Defense Tower'],
    description: 'Askeri operasyonlar ve asker eğitimi için'
  },
  {
    id: 'trading_island',
    name: 'Ticaret Merkezi',
    type: 'trading_hub',
    size: 'medium',
    cost: 10000000,
    daily_upkeep: 80000,
    building_slots: 10,
    trading_bonus: {
      market_fee_reduction: 15,
      trade_route_bonus: 20
    },
    special_features: ['Marketplace', 'Warehouse', 'Trade Post'],
    description: 'Ticaret ve depolama için optimize edilmiş ada'
  }
]

const COLORS = ['#ef4444', '#f5c842', '#10b981', '#3b82f6', '#8b5cf6', '#f97316']

export default function EventTrackerPage() {
  const [selectedTab, setSelectedTab] = useState('events')
  const [currentTime, setCurrentTime] = useState(new Date())
  const [notifications, setNotifications] = useState([])
  const [subscribedEvents, setSubscribedEvents] = useState([])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [])

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Extreme': return '#ef4444'
      case 'Very Hard': return '#dc2626'
      case 'Hard': return '#f97316'
      case 'Medium': return '#f5c842'
      case 'Easy': return '#10b981'
      default: return '#6b7280'
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return '#10b981'
      case 'upcoming': return '#f5c842'
      case 'completed': return '#6b7280'
      case 'cancelled': return '#ef4444'
      default: return '#94a3b8'
    }
  }

  const getTimeUntilSpawn = (spawnTime) => {
    const now = new Date()
    const spawn = new Date(spawnTime)
    const diff = spawn.getTime() - now.getTime()
    
    if (diff <= 0) return 'Spawnlandı!'
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const days = Math.floor(hours / 24)
    const remainingHours = hours % 24
    
    if (days > 0) {
      return `${days}g ${remainingHours}s ${minutes}dk`
    }
    return `${remainingHours}s ${minutes}dk`
  }

  const subscribeToEvent = (eventId) => {
    if (!subscribedEvents.includes(eventId)) {
      setSubscribedEvents([...subscribedEvents, eventId])
      setNotifications([...notifications, {
        id: Date.now(),
        type: 'success',
        message: `${WORLD_EVENTS.find(e => e.id === eventId)?.name} etkinliğine abone oldunuz!`
      }])
    }
  }

  const unsubscribeFromEvent = (eventId) => {
    setSubscribedEvents(subscribedEvents.filter(id => id !== eventId))
    setNotifications([...notifications, {
      id: Date.now(),
      type: 'info',
      message: 'Etkinlik aboneliğiniz iptal edildi.'
    }])
  }

  return (
    <div style={{ padding: '1.5rem', minHeight: '100vh', background: '#0d0f14' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: '#f5c842', fontSize: 28, fontWeight: 700, margin: 0 }}>
          Etkinlik Takibi ve World Boss Timer
        </h1>
        <p style={{ color: '#64748b', margin: 0, fontSize: 14 }}>
          Dünya etkinlikleri, boss spawn zamanları ve ada planlayıcısı
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        {['events', 'islands', 'notifications'].map(tab => (
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
            {tab === 'events' && 'Etkinlikler'}
            {tab === 'islands' && 'Ada Planı'}
            {tab === 'notifications' && 'Bildirimler'}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
        <div style={{ 
          background: '#1a1d29', 
          border: '1px solid #2a2f3e', 
          borderRadius: 8, 
          padding: '8px 16px',
          display: 'inline-block'
        }}>
          <span style={{ color: '#94a3b8', fontSize: 12 }}>Mevcut Zaman:</span>
          <span style={{ color: '#f5c842', fontSize: 14, fontWeight: 600, marginLeft: 8 }}>
            {currentTime.toLocaleString('tr-TR')}
          </span>
        </div>
      </div>

      {selectedTab === 'events' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1rem' }}>
          {WORLD_EVENTS.map(event => (
            <div key={event.id} style={{ 
              background: '#1a1d29', 
              border: '1px solid #2a2f3e', 
              borderRadius: 12, 
              padding: '1.5rem',
              borderLeft: `4px solid ${getDifficultyColor(event.difficulty)}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <h3 style={{ color: '#f5c842', fontSize: 16, fontWeight: 600, margin: 0 }}>
                    {event.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                    <span style={{ 
                      background: getDifficultyColor(event.difficulty),
                      color: 'white',
                      padding: '2px 6px',
                      borderRadius: 4,
                      fontSize: 10
                    }}>
                      {event.difficulty}
                    </span>
                    <span style={{ 
                      background: getStatusColor(event.status),
                      color: 'white',
                      padding: '2px 6px',
                      borderRadius: 4,
                      fontSize: 10
                    }}>
                      {event.status === 'active' ? 'Aktif' : event.status === 'upcoming' ? 'Yaklaşıyor' : 'Tamamlandı'}
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <button
                    onClick={() => subscribeToEvent(event.id)}
                    disabled={subscribedEvents.includes(event.id)}
                    style={{
                      background: subscribedEvents.includes(event.id) ? '#2a2f3e' : '#10b981',
                      color: subscribedEvents.includes(event.id) ? '#64748b' : 'white',
                      border: 'none',
                      borderRadius: 6,
                      padding: '6px 12px',
                      fontSize: 11,
                      cursor: subscribedEvents.includes(event.id) ? 'not-allowed' : 'pointer',
                      marginBottom: 4
                    }}
                  >
                    {subscribedEvents.includes(event.id) ? 'Abone Oldu' : 'Abone Ol'}
                  </button>
                </div>
              </div>

              <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.4, marginBottom: 12 }}>
                <div><strong>Konum:</strong> {event.location}</div>
                <div><strong>Spawn Penceresi:</strong> {event.spawn_window}</div>
                <div><strong>Minimum Oyuncu:</strong> {event.min_players}</div>
                <div><strong>Önerilen IP:</strong> {event.recommended_ip}+</div>
                <div><strong>Spawn Zamanı:</strong> {getTimeUntilSpawn(event.next_spawn)}</div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <h4 style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Ödüller</h4>
                <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.4 }}>
                  <div><strong>Fame:</strong> {event.rewards.fame}</div>
                  <div><strong>Gümüş:</strong> {event.rewards.silver}</div>
                  <div><strong>Unique Item'lar:</strong> {event.rewards.unique_items.join(', ')}</div>
                  <div><strong>Tome Şansı:</strong> {event.rewards.chance_for_tome}%</div>
                </div>
              </div>

              <div>
                <h4 style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Mekanikler</h4>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {event.mechanics.map(mechanic => (
                    <span key={mechanic} style={{
                      background: '#2a2f3e',
                      color: '#94a3b8',
                      padding: '4px 8px',
                      borderRadius: 4,
                      fontSize: 11
                    }}>
                      {mechanic}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>
                  <strong>Katılımcı:</strong> {event.participants}
                </div>
                {event.participants > 0 && (
                  <div style={{ 
                    background: '#10b981',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: 4,
                    fontSize: 10,
                    animation: 'pulse 2s infinite'
                  }}>
                    KATILIM
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedTab === 'islands' && (
        <div style={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 12, padding: '1.5rem' }}>
          <h2 style={{ color: '#f5c842', fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>
            Ada Planlayıcısı
          </h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Ada Şablonları</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
              {ISLAND_TEMPLATES.map(template => (
                <div key={template.id} style={{ 
                  background: '#0d0f14', 
                  border: '1px solid #2a2f3e', 
                  borderRadius: 8, 
                  padding: '1rem' 
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <h3 style={{ color: '#f5c842', fontSize: 14, fontWeight: 600, margin: 0 }}>
                        {template.name}
                      </h3>
                      <span style={{ 
                        background: '#2a2f3e',
                        color: '#94a3b8',
                        padding: '2px 6px',
                        borderRadius: 4,
                        fontSize: 10,
                        marginLeft: 8
                      }}>
                        {template.type}
                      </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#f5c842', fontSize: 14, fontWeight: 600 }}>{template.cost.toLocaleString()} Silver</div>
                      <div style={{ color: '#64748b', fontSize: 11 }}>Günlük: {template.daily_upkeep.toLocaleString()}</div>
                    </div>
                  </div>

                  <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.4, marginBottom: 12 }}>
                    <div><strong>Boyut:</strong> {template.size}</div>
                    <div><strong>Bina Slotları:</strong> {template.building_slots}</div>
                    <div><strong>Özel Özellikler:</strong> {template.special_features.join(', ')}</div>
                  </div>

                  <div style={{ marginBottom: 12 }}>
                    <h4 style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Bonuslar</h4>
                    <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.4 }}>
                      {Object.entries(template.resource_bonus || template.crafting_bonus || template.military_bonus || template.trading_bonus).map(([key, value]) => (
                        <div key={key}>
                          <strong>{key}:</strong> +{value}%
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ fontSize: 11, color: '#64748b', fontStyle: 'italic' }}>
                    {template.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Ada Hesaplayıcısı</h3>
            <div style={{ 
              background: '#0d0f14', 
              border: '1px solid #2a2f3e', 
              borderRadius: 8, 
              padding: '1rem',
              marginBottom: '1rem' 
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', color: '#94a3b8', fontSize: 11, marginBottom: 4 }}>Ada Tipi</label>
                  <select style={{
                    background: '#0d0f14',
                    color: '#e2e8f0',
                    border: '1px solid #2a2f3e',
                    borderRadius: 4,
                    padding: '6px 8px',
                    fontSize: 12,
                    width: '100%'
                  }}>
                    <option value="farming">Tarım</option>
                    <option value="crafting">Crafting</option>
                    <option value="military">Askeri</option>
                    <option value="trading">Ticaret</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', color: '#94a3b8', fontSize: 11, marginBottom: 4 }}>Ada Boyutu</label>
                  <select style={{
                    background: '#0d0f14',
                    color: '#e2e8f0',
                    border: '1px solid #2a2f3e',
                    borderRadius: 4,
                    padding: '6px 8px',
                    fontSize: 12,
                    width: '100%'
                  }}>
                    <option value="small">Küçük</option>
                    <option value="medium">Orta</option>
                    <option value="large">Büyük</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', color: '#94a3b8', fontSize: 11, marginBottom: 4 }}>Bütçe</label>
                  <input
                    type="number"
                    placeholder="Maksimum bütçe"
                    style={{
                      background: '#0d0f14',
                      color: '#e2e8f0',
                      border: '1px solid #2a2f3e',
                      borderRadius: 4,
                      padding: '6px 8px',
                      fontSize: 12,
                      width: '100%'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#94a3b8', fontSize: 11, marginBottom: 4 }}>Öncelik</label>
                  <select style={{
                    background: '#0d0f14',
                    color: '#e2e8f0',
                    border: '1px solid #2a2f3e',
                    borderRadius: 4,
                    padding: '6px 8px',
                    fontSize: 12,
                    width: '100%'
                  }}>
                    <option value="resource_production">Kaynak Üretimi</option>
                    <option value="military_outpost">Askeri Üs</option>
                    <option value="trading_hub">Ticaret Merkezi</option>
                  </select>
                </div>
              </div>

              <button
                style={{
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  padding: '8px 16px',
                  fontSize: 12,
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                Ada Planı Hesapla
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'notifications' && (
        <div style={{ background: '#1a1d29', border: '1px solid #2a2f3e', borderRadius: 12, padding: '1.5rem' }}>
          <h2 style={{ color: '#f5c842', fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>
            Bildirimler ve Abonelikler
          </h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Abone Olduğunuz Etkinlikler</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {subscribedEvents.length > 0 ? (
                WORLD_EVENTS.filter(event => subscribedEvents.includes(event.id)).map(event => (
                  <div key={event.id} style={{ 
                    background: '#0d0f14', 
                    border: '1px solid #2a2f3e', 
                    borderRadius: 8, 
                    padding: '12px' 
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ color: '#f5c842', fontSize: 13, fontWeight: 600 }}>{event.name}</div>
                        <div style={{ color: '#64748b', fontSize: 11, marginTop: 2 }}>Next spawn: {event.next_spawn}</div>
                      </div>
                      <button
                        onClick={() => unsubscribeFromEvent(event.id)}
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
                        Aboneliği İptal Et
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ 
                  background: '#0d0f14', 
                  border: '1px solid #2a2f3e', 
                  borderRadius: 8, 
                  padding: '2rem',
                  textAlign: 'center',
                  color: '#64748b'
                }}>
                  Henüz abone olduğunuz etkinlik bulunmuyor.
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Bildirim Geçmişi</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {notifications.length > 0 ? (
                notifications.map(notification => (
                  <div key={notification.id} style={{ 
                    background: '#0d0f14', 
                    border: `1px solid ${notification.type === 'success' ? '#10b981' : notification.type === 'error' ? '#ef4444' : '#2a2f3e'}`,
                    borderRadius: 8, 
                    padding: '12px',
                    borderLeft: `4px solid ${notification.type === 'success' ? '#10b981' : notification.type === 'error' ? '#ef4444' : '#2a2f3e'}`
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ color: '#e2e8f0', fontSize: 12 }}>{notification.message}</div>
                      <div style={{ fontSize: 10, color: '#64748b' }}>
                        {new Date(notification.id).toLocaleString('tr-TR')}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ 
                  background: '#0d0f14', 
                  border: '1px solid #2a2f3e', 
                  borderRadius: 8, 
                  padding: '2rem',
                  textAlign: 'center',
                  color: '#64748b'
                }}>
                  Bildiriminiz bulunmuyor.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}
