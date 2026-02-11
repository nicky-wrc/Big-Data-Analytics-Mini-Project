import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  ListOrdered, 
  Brain, 
  Search,
  Shield,
  Activity,
  BarChart3,
  Book,
  Sparkles
} from 'lucide-react'

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Overview' },
  { path: '/transactions', icon: ListOrdered, label: 'Transactions' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/model', icon: Brain, label: 'Model Insights' },
  { path: '/predict', icon: Sparkles, label: 'Predict' },
  { path: '/api-docs', icon: Book, label: 'API Docs' },
]

export default function Sidebar() {
  return (
    <aside style={{
      position: 'fixed',
      left: 0,
      top: 0,
      height: '100vh',
      width: '280px',
      background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.98) 100%)',
      backdropFilter: 'blur(20px)',
      borderRight: '1px solid rgba(71, 85, 105, 0.3)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 50
    }}>
      {/* Logo */}
      <div style={{
        padding: '28px 24px',
        borderBottom: '1px solid rgba(71, 85, 105, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(239, 68, 68, 0.3)'
            }}>
              <Shield style={{ width: '26px', height: '26px', color: 'white' }} />
            </div>
            <div style={{
              position: 'absolute',
              bottom: '-4px',
              right: '-4px',
              width: '20px',
              height: '20px',
              background: '#22c55e',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '3px solid #0f172a'
            }}>
              <Activity style={{ width: '10px', height: '10px', color: 'white' }} />
            </div>
          </div>
          <div>
            <h1 style={{
              fontSize: '22px',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #ef4444 0%, #f97316 50%, #eab308 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.5px'
            }}>FraudLens</h1>
            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Real-Time Detection</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '20px 16px' }}>
        <p style={{ 
          fontSize: '11px', 
          fontWeight: 600, 
          color: '#64748b', 
          textTransform: 'uppercase', 
          letterSpacing: '1px',
          padding: '0 12px',
          marginBottom: '12px'
        }}>Menu</p>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  color: isActive ? '#f87171' : '#94a3b8',
                  background: isActive ? 'rgba(239, 68, 68, 0.12)' : 'transparent',
                  border: isActive ? '1px solid rgba(239, 68, 68, 0.25)' : '1px solid transparent',
                  textDecoration: 'none',
                  fontWeight: 500,
                  fontSize: '14px',
                  transition: 'all 0.2s ease'
                })}
              >
                <item.icon style={{ width: '20px', height: '20px' }} />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div style={{ padding: '20px 16px', borderTop: '1px solid rgba(71, 85, 105, 0.3)' }}>
        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          borderRadius: '14px',
          padding: '18px',
          border: '1px solid rgba(71, 85, 105, 0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div style={{
              width: '10px',
              height: '10px',
              background: '#22c55e',
              borderRadius: '50%',
              boxShadow: '0 0 12px rgba(34, 197, 94, 0.6)',
              animation: 'pulse 2s infinite'
            }} />
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>System Status</span>
          </div>
          <p style={{ fontSize: '14px', color: '#4ade80', fontWeight: 600 }}>All Systems Operational</p>
        </div>
      </div>
    </aside>
  )
}
