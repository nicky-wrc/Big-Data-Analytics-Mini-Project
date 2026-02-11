import { ReactNode } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: ReactNode
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  variant?: 'default' | 'danger' | 'success' | 'warning'
  className?: string
}

const variantColors = {
  default: { accent: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.2)' },
  danger: { accent: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.2)' },
  success: { accent: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)', border: 'rgba(34, 197, 94, 0.2)' },
  warning: { accent: '#f97316', bg: 'rgba(249, 115, 22, 0.1)', border: 'rgba(249, 115, 22, 0.2)' },
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  variant = 'default',
}: StatsCardProps) {
  const colors = variantColors[variant]

  return (
    <div style={{
      background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))',
      border: `1px solid ${colors.border}`,
      borderRadius: '20px',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s ease'
    }}>
      {/* Accent line */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: `linear-gradient(90deg, ${colors.accent}, transparent)`
      }} />
      
      {/* Glow effect */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        right: '-20%',
        width: '150px',
        height: '150px',
        background: colors.accent,
        filter: 'blur(80px)',
        opacity: 0.15,
        borderRadius: '50%'
      }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative' }}>
        <div style={{ flex: 1 }}>
          <p style={{ 
            fontSize: '13px', 
            color: '#94a3b8', 
            fontWeight: 500, 
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>{title}</p>
          <p style={{ 
            fontSize: '32px', 
            fontWeight: 700, 
            color: '#f1f5f9',
            letterSpacing: '-1px',
            lineHeight: 1
          }}>{value}</p>
          {subtitle && (
            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '8px' }}>{subtitle}</p>
          )}
          {trend && trendValue && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              marginTop: '12px',
              padding: '6px 12px',
              background: trend === 'up' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
              borderRadius: '8px',
              width: 'fit-content'
            }}>
              {trend === 'up' ? (
                <TrendingUp style={{ width: '14px', height: '14px', color: '#f87171' }} />
              ) : (
                <TrendingDown style={{ width: '14px', height: '14px', color: '#4ade80' }} />
              )}
              <span style={{ 
                fontSize: '12px', 
                fontWeight: 600,
                color: trend === 'up' ? '#f87171' : '#4ade80'
              }}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div style={{
          padding: '14px',
          background: colors.bg,
          borderRadius: '14px',
          border: `1px solid ${colors.border}`,
          color: colors.accent
        }}>
          {icon}
        </div>
      </div>
    </div>
  )
}
