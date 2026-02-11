import { Transaction } from '../services/api'
import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react'

interface TransactionTableProps {
  transactions: Transaction[]
  onRowClick?: (transaction: Transaction) => void
  loading?: boolean
}

const RiskBadge = ({ level }: { level: string | null }) => {
  if (!level) return <span style={{ color: '#64748b' }}>—</span>
  
  const configs: Record<string, { bg: string, textColor: string }> = {
    HIGH: { bg: 'linear-gradient(135deg, #ef4444, #dc2626)', textColor: 'white' },
    MEDIUM: { bg: 'linear-gradient(135deg, #f97316, #ea580c)', textColor: 'white' },
    LOW: { bg: 'linear-gradient(135deg, #22c55e, #16a34a)', textColor: 'white' },
  }
  
  const config = configs[level] || configs.LOW
  const Icon = level === 'HIGH' ? AlertTriangle : level === 'MEDIUM' ? AlertCircle : CheckCircle
  
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 14px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 600,
      background: config.bg,
      color: config.textColor
    }}>
      <Icon style={{ width: '12px', height: '12px' }} />
      {level}
    </span>
  )
}

const ClassBadge = ({ value }: { value: number | null }) => {
  if (value === null) return <span style={{ color: '#64748b' }}>—</span>
  
  const isFraud = value === 1
  
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 12px',
      borderRadius: '8px',
      fontSize: '12px',
      fontWeight: 600,
      background: isFraud ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)',
      color: isFraud ? '#f87171' : '#4ade80',
      border: `1px solid ${isFraud ? 'rgba(239, 68, 68, 0.3)' : 'rgba(34, 197, 94, 0.3)'}`
    }}>
      {isFraud ? 'Fraud' : 'Legit'}
    </span>
  )
}

export default function TransactionTable({ 
  transactions, 
  onRowClick,
  loading = false 
}: TransactionTableProps) {
  if (loading) {
    return (
      <div style={{
        background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))',
        border: '1px solid rgba(71, 85, 105, 0.3)',
        borderRadius: '20px',
        padding: '32px',
        animation: 'pulse 2s infinite'
      }}>
        <div style={{ height: '24px', background: 'rgba(71, 85, 105, 0.3)', borderRadius: '8px', width: '200px', marginBottom: '24px' }} />
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{ height: '56px', background: 'rgba(71, 85, 105, 0.2)', borderRadius: '8px', marginBottom: '8px' }} />
        ))}
      </div>
    )
  }

  return (
    <div style={{
      background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))',
      border: '1px solid rgba(71, 85, 105, 0.3)',
      borderRadius: '20px',
      overflow: 'hidden'
    }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(71, 85, 105, 0.3)' }}>
              {['ID', 'Time', 'Amount', 'Actual', 'Predicted', 'Probability', 'Risk'].map((header) => (
                <th key={header} style={{
                  padding: '18px 20px',
                  textAlign: header === 'Amount' || header === 'Probability' ? 'right' : 'left',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr
                key={tx.id}
                onClick={() => onRowClick?.(tx)}
                style={{
                  borderBottom: '1px solid rgba(71, 85, 105, 0.2)',
                  background: tx.actual_class === 1 ? 'rgba(239, 68, 68, 0.05)' : 'transparent',
                  cursor: onRowClick ? 'pointer' : 'default',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(71, 85, 105, 0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.background = tx.actual_class === 1 ? 'rgba(239, 68, 68, 0.05)' : 'transparent'}
              >
                <td style={{ padding: '16px 20px', fontFamily: 'monospace', fontSize: '13px', color: '#94a3b8' }}>
                  #{tx.id.toString().padStart(6, '0')}
                </td>
                <td style={{ padding: '16px 20px', fontSize: '13px', color: '#64748b' }}>
                  {(tx.time_elapsed / 3600).toFixed(1)}h
                </td>
                <td style={{ padding: '16px 20px', textAlign: 'right', fontFamily: 'monospace', fontSize: '14px', color: '#e2e8f0', fontWeight: 500 }}>
                  ${Number(tx.amount).toFixed(2)}
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <ClassBadge value={tx.actual_class} />
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <ClassBadge value={tx.predicted_class} />
                </td>
                <td style={{ padding: '16px 20px', textAlign: 'right', fontFamily: 'monospace', fontSize: '13px' }}>
                  {tx.fraud_probability !== null ? (
                    <span style={{ color: Number(tx.fraud_probability) > 0.5 ? '#f87171' : '#4ade80' }}>
                      {(Number(tx.fraud_probability) * 100).toFixed(1)}%
                    </span>
                  ) : (
                    <span style={{ color: '#64748b' }}>—</span>
                  )}
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <RiskBadge level={tx.risk_level} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {transactions.length === 0 && (
        <div style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>
          No transactions found
        </div>
      )}
    </div>
  )
}
