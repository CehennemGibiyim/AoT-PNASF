import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import PriceChecker from './pages/PriceChecker'
import CraftingCalc from './pages/CraftingCalc'
import TradeRoutes from './pages/TradeRoutes'
import BlackMarket from './pages/BlackMarket'
import MapPage from './pages/MapPage'
import AlbionMap from './pages/AlbionMap'
import KillboardPage from './pages/KillboardPage'
import AvalonPage from './pages/AvalonPage'
import AIAnalyticsPage from './pages/AIAnalyticsPage'
import GuildManagementPage from './pages/GuildManagementPage'
import BuildDatabasePage from './pages/BuildDatabasePage'
import MarketTrackerPage from './pages/MarketTrackerPage'
import FarmingCalculatorPage from './pages/FarmingCalculatorPage'
import PersonalStatsPage from './pages/PersonalStatsPage'
import EventTrackerPage from './pages/EventTrackerPage'
import PartyBuilderPage from './pages/PartyBuilderPage'
import ThemeSettingsPage from './pages/ThemeSettingsPage'
import GoldTracker from './pages/GoldTracker'

const NAV_ITEMS = [
  { to: '/', label: 'Panel', icon: '⬡' },
  { to: '/prices', label: 'Fiyat Sorgula', icon: '💰' },
  { to: '/crafting', label: 'Crafting Calc', icon: '⚒' },
  { to: '/trade', label: 'Ticaret Rotaları', icon: '↔' },
  { to: '/blackmarket', label: 'Kara Pazar', icon: '◈' },
  { to: '/map', label: 'Harita', icon: '◎' },
  { to: '/albion-map', label: '3D Harita', icon: '🗺️' },
  { to: '/killboard', label: 'Killboard', icon: '⚔️' },
  { to: '/avalon', label: 'Avalon', icon: '🏰' },
  { to: '/ai-analytics', label: 'AI Analiz', icon: '🤖' },
  { to: '/guild', label: 'Klan Yönetimi', icon: '👥' },
  { to: '/builds', label: 'Build Database', icon: '⚔️' },
  { to: '/market-tracker', label: 'Market Takip', icon: '📊' },
  { to: '/farming', label: 'Farming', icon: '🌾' },
  { to: '/personal-stats', label: 'Kişisel İstatistikler', icon: '📈' },
  { to: '/events', label: 'Etkinlik Takibi', icon: '⏰' },
  { to: '/party-builder', label: 'Party Builder', icon: '👥' },
  { to: '/theme-settings', label: 'Tema Ayarları', icon: '🎨' },
  { to: '/gold', label: 'Gold Takip', icon: '▲' },
]

function Sidebar() {
  return (
    <aside style={{ width: 220, minWidth: 220, background: '#161921', borderRight: '1px solid #2a2f3e', minHeight: '100vh', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid #2a2f3e' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="https://render.albiononline.com/v1/item/T4_MAIN_SWORD.png?size=40" alt="logo" style={{ width: 36, height: 36, borderRadius: 8 }} />
          <div>
            <div style={{ color: '#f5c842', fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>AoT Panel</div>
            <div style={{ color: '#64748b', fontSize: 11 }}>Albion Online Tools</div>
          </div>
        </div>
      </div>
      <nav style={{ flex: 1, padding: '0.75rem 0.5rem' }}>
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '0.6rem 0.75rem', borderRadius: 8,
              color: isActive ? '#f5c842' : '#94a3b8',
              background: isActive ? 'rgba(245,200,66,0.1)' : 'transparent',
              textDecoration: 'none', fontSize: 13.5, fontWeight: isActive ? 600 : 400,
              marginBottom: 2, transition: 'all 0.15s',
              border: isActive ? '1px solid rgba(245,200,66,0.2)' : '1px solid transparent',
            })}
          >
            <span style={{ fontSize: 16, width: 20, textAlign: 'center' }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid #2a2f3e', fontSize: 11, color: '#475569' }}>
        <div>Veri: Albion Data Project</div>
        <div style={{ marginTop: 2 }}>albion-online-data.com</div>
      </div>
    </aside>
  )
}

export default function App() {
  return (
    <BrowserRouter basename="/AoT-PNASF">
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />
        <main style={{ flex: 1, overflow: 'auto', background: '#0d0f14' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/prices" element={<PriceChecker />} />
            <Route path="/crafting" element={<CraftingCalc />} />
            <Route path="/trade" element={<TradeRoutes />} />
            <Route path="/blackmarket" element={<BlackMarket />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/albion-map" element={<AlbionMap />} />
            <Route path="/killboard" element={<KillboardPage />} />
            <Route path="/avalon" element={<AvalonPage />} />
            <Route path="/ai-analytics" element={<AIAnalyticsPage />} />
            <Route path="/guild" element={<GuildManagementPage />} />
            <Route path="/builds" element={<BuildDatabasePage />} />
            <Route path="/market-tracker" element={<MarketTrackerPage />} />
            <Route path="/farming" element={<FarmingCalculatorPage />} />
            <Route path="/personal-stats" element={<PersonalStatsPage />} />
            <Route path="/events" element={<EventTrackerPage />} />
            <Route path="/party-builder" element={<PartyBuilderPage />} />
            <Route path="/theme-settings" element={<ThemeSettingsPage />} />
            <Route path="/gold" element={<GoldTracker />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
