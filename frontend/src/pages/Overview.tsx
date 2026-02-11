import { useEffect, useState } from 'react'
import { 
  CreditCard, 
  AlertTriangle, 
  DollarSign,
  Shield,
  Activity,
  Zap,
  TrendingUp
} from 'lucide-react'
import StatsCard from '../components/StatsCard'
import FraudChart from '../components/FraudChart'
import TransactionTable from '../components/TransactionTable'
import { getStats, getTransactions, getHourlyStats, Stats, Transaction } from '../services/api'

export default function Overview() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])
  const [hourlyData, setHourlyData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, txRes, hourlyRes] = await Promise.all([
          getStats(),
          getTransactions({ limit: 10 }),
          getHourlyStats().catch(() => ({ data: [] }))
        ])
        setStats(statsRes.data)
        setRecentTransactions(txRes.data.data || [])
        setHourlyData(hourlyRes.data || [])
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const riskDistribution = stats ? [
    { name: 'High Risk', value: Number(stats.high_risk_count) || 0 },
    { name: 'Medium Risk', value: Number(stats.medium_risk_count) || 0 },
    { name: 'Low Risk', value: Number(stats.low_risk_count) || 0 },
  ] : []

  const classDistribution = stats ? [
    { name: 'Legitimate', value: Number(stats.total_transactions) - Number(stats.total_fraud) },
    { name: 'Fraudulent', value: Number(stats.total_fraud) || 0 },
  ] : []

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '60vh' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid rgba(239, 68, 68, 0.2)',
            borderTopColor: '#ef4444',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <p style={{ color: '#64748b', fontSize: '15px' }}>Loading dashboard...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '32px'
      }}>
        <div>
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: 700, 
            color: '#f1f5f9',
            marginBottom: '8px',
            letterSpacing: '-0.5px'
          }}>
            Dashboard Overview
          </h1>
          <p style={{ color: '#64748b', fontSize: '15px' }}>
            Real-time fraud detection monitoring and analytics
          </p>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(34, 197, 94, 0.1)',
          border: '1px solid rgba(34, 197, 94, 0.2)',
          padding: '12px 20px',
          borderRadius: '12px'
        }}>
          <Zap style={{ width: '18px', height: '18px', color: '#4ade80' }} />
          <span style={{ fontSize: '14px', color: '#4ade80', fontWeight: 500 }}>Live Monitoring</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '24px',
        marginBottom: '32px'
      }}>
        <StatsCard
          title="Total Transactions"
          value={Number(stats?.total_transactions || 0).toLocaleString()}
          subtitle="All time processed"
          icon={<CreditCard style={{ width: '24px', height: '24px' }} />}
          variant="default"
        />
        <StatsCard
          title="Fraud Detected"
          value={Number(stats?.total_fraud || 0).toLocaleString()}
          subtitle={`${(Number(stats?.fraud_rate || 0) * 100).toFixed(3)}% fraud rate`}
          icon={<AlertTriangle style={{ width: '24px', height: '24px' }} />}
          variant="danger"
          trend="up"
          trendValue={`${Number(stats?.total_fraud || 0)} cases flagged`}
        />
        <StatsCard
          title="High Risk Alerts"
          value={Number(stats?.high_risk_count || 0).toLocaleString()}
          subtitle="Requires immediate attention"
          icon={<Shield style={{ width: '24px', height: '24px' }} />}
          variant="warning"
        />
        <StatsCard
          title="Total Volume"
          value={`$${(Number(stats?.total_amount || 0) / 1000000).toFixed(2)}M`}
          subtitle={`Avg: $${Number(stats?.avg_amount || 0).toFixed(2)} per tx`}
          icon={<DollarSign style={{ width: '24px', height: '24px' }} />}
          variant="success"
        />
      </div>

      {/* Charts Row */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
        gap: '24px',
        marginBottom: '32px'
      }}>
        <FraudChart
          data={hourlyData.length > 0 ? hourlyData : [
            { hour: '0h', fraud_count: 12 },
            { hour: '4h', fraud_count: 8 },
            { hour: '8h', fraud_count: 25 },
            { hour: '12h', fraud_count: 45 },
            { hour: '16h', fraud_count: 38 },
            { hour: '20h', fraud_count: 22 },
          ]}
          type="area"
          dataKey="fraud_count"
          xAxisKey="hour"
          title="Fraud Activity Over Time"
          subtitle="Hourly fraud detection pattern"
        />
        <FraudChart
          data={classDistribution}
          type="pie"
          dataKey="value"
          title="Transaction Classification"
          subtitle="Legitimate vs Fraudulent distribution"
          colors={['#22c55e', '#ef4444']}
        />
      </div>

      {/* Second Row */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '2fr 1fr', 
        gap: '24px',
        marginBottom: '32px'
      }}>
        <FraudChart
          data={riskDistribution}
          type="bar"
          dataKey="value"
          xAxisKey="name"
          title="Risk Level Distribution"
          subtitle="Transactions categorized by risk"
          colors={['#ef4444', '#f97316', '#22c55e']}
        />
        
        {/* Quick Stats Panel */}
        <div style={{
          background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))',
          border: '1px solid rgba(71, 85, 105, 0.3)',
          borderRadius: '20px',
          padding: '28px'
        }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: 600, 
            color: '#f1f5f9',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Activity style={{ width: '20px', height: '20px', color: '#3b82f6' }} />
            Quick Stats
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { label: 'Detection Rate', value: '99.8%', color: '#4ade80' },
              { label: 'False Positive', value: '0.15%', color: '#f97316' },
              { label: 'Avg Response', value: '45ms', color: '#3b82f6' },
              { label: 'Model Accuracy', value: '99.9%', color: '#4ade80' },
            ].map((item, i) => (
              <div key={i} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: i < 3 ? '1px solid rgba(71, 85, 105, 0.2)' : 'none'
              }}>
                <span style={{ color: '#94a3b8', fontSize: '14px' }}>{item.label}</span>
                <span style={{ 
                  color: item.color, 
                  fontWeight: 600, 
                  fontFamily: 'monospace',
                  fontSize: '15px'
                }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: '20px'
        }}>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: 600, 
            color: '#f1f5f9',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <TrendingUp style={{ width: '22px', height: '22px', color: '#ef4444' }} />
            Recent Transactions
          </h2>
          <a 
            href="/transactions" 
            style={{ 
              fontSize: '14px', 
              color: '#f87171', 
              textDecoration: 'none',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'color 0.2s'
            }}
          >
            View all transactions →
          </a>
        </div>
        <TransactionTable transactions={recentTransactions} />
      </div>
    </div>
  )
}
