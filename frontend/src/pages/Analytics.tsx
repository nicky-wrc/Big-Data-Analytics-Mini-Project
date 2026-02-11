import { useEffect, useState, useCallback } from 'react'
import { 
  TrendingUp, 
  AlertTriangle, 
  DollarSign,
  Clock,
  RefreshCw,
  Download,
  Target,
  Zap
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line,
  Legend
} from 'recharts'
import { 
  getTimeSeries, 
  getTopFraud, 
  getPredictionAccuracy, 
  getAmountByRisk,
  getRealtimeSummary,
  exportCSV 
} from '../services/api'

interface TimeSeriesData {
  hour: number
  label: string
  total_count: number
  fraud_count: number
  avg_amount: number
  total_amount: number
  fraud_rate: string
}

interface TopFraudTransaction {
  id: number
  amount: number
  fraud_probability: number
  risk_level: string
  actual_class: number
  predicted_class: number
}

interface PredictionAccuracy {
  total_predicted: number
  correct_predictions: number
  wrong_predictions: number
  accuracy: number
}

interface AmountByRisk {
  risk_level: string
  count: number
  avg_amount: number
  min_amount: number
  max_amount: number
  total_amount: number
}

interface RealtimeSummary {
  total_transactions: number
  total_fraud: number
  high_risk_count: number
  avg_fraud_probability: number
  recent_count: number
  timestamp: string
}

export default function Analytics() {
  const [timeSeries, setTimeSeries] = useState<TimeSeriesData[]>([])
  const [topFraud, setTopFraud] = useState<TopFraudTransaction[]>([])
  const [accuracy, setAccuracy] = useState<PredictionAccuracy | null>(null)
  const [amountByRisk, setAmountByRisk] = useState<AmountByRisk[]>([])
  const [realtime, setRealtime] = useState<RealtimeSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [exporting, setExporting] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const [tsRes, topRes, accRes, amtRes, rtRes] = await Promise.all([
        getTimeSeries().catch(() => ({ data: [] })),
        getTopFraud().catch(() => ({ data: [] })),
        getPredictionAccuracy().catch(() => ({ data: null })),
        getAmountByRisk().catch(() => ({ data: [] })),
        getRealtimeSummary().catch(() => ({ data: null }))
      ])
      
      setTimeSeries(tsRes.data || [])
      setTopFraud(topRes.data || [])
      setAccuracy(accRes.data)
      setAmountByRisk(amtRes.data || [])
      setRealtime(rtRes.data)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [fetchData])

  const handleExport = async () => {
    setExporting(true)
    try {
      const response = await exportCSV({ limit: 10000 })
      const blob = new Blob([response.data], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `fraudlens_export_${new Date().toISOString().slice(0, 10)}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setExporting(false)
    }
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid #334155',
          borderRadius: '10px',
          padding: '12px 16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        }}>
          <p style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '8px' }}>{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ fontSize: '13px', fontWeight: 600, color: entry.color, marginBottom: '2px' }}>
              {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const riskColors: { [key: string]: string } = {
    HIGH: '#ef4444',
    MEDIUM: '#f97316',
    LOW: '#22c55e'
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <RefreshCw style={{ width: '48px', height: '48px', color: '#ef4444', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
          <p style={{ color: '#64748b' }}>Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#f1f5f9', marginBottom: '8px' }}>
            Advanced Analytics
          </h1>
          <p style={{ color: '#64748b' }}>
            Deep dive into fraud detection patterns and system performance
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
          <button
            onClick={fetchData}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              borderRadius: '10px',
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(71, 85, 105, 0.5)',
              color: '#94a3b8',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500
            }}
          >
            <RefreshCw style={{ width: '16px', height: '16px' }} />
            Refresh
          </button>
          <button
            onClick={handleExport}
            disabled={exporting}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              border: 'none',
              color: 'white',
              cursor: exporting ? 'not-allowed' : 'pointer',
              fontSize: '13px',
              fontWeight: 600,
              opacity: exporting ? 0.7 : 1,
              boxShadow: '0 4px 16px rgba(239, 68, 68, 0.3)'
            }}
          >
            <Download style={{ width: '16px', height: '16px' }} />
            {exporting ? 'Exporting...' : 'Export CSV'}
          </button>
        </div>
      </div>

      {/* Real-time Stats */}
      {realtime && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '32px' }}>
          {[
            { icon: Zap, label: 'Total Transactions', value: realtime.total_transactions.toLocaleString(), color: '#3b82f6' },
            { icon: AlertTriangle, label: 'Total Fraud Cases', value: realtime.total_fraud.toLocaleString(), color: '#ef4444' },
            { icon: Target, label: 'High Risk', value: realtime.high_risk_count.toLocaleString(), color: '#f97316' },
            { icon: TrendingUp, label: 'Avg Fraud Prob', value: `${(realtime.avg_fraud_probability * 100).toFixed(2)}%`, color: '#8b5cf6' },
            { icon: Clock, label: 'Recent (1hr)', value: realtime.recent_count.toLocaleString(), color: '#22c55e' },
          ].map((item, i) => (
            <div key={i} style={{
              background: `linear-gradient(145deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))`,
              border: `1px solid ${item.color}33`,
              borderRadius: '16px',
              padding: '20px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', background: item.color, opacity: 0.1, borderRadius: '50%', filter: 'blur(20px)' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <item.icon style={{ width: '18px', height: '18px', color: item.color }} />
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>{item.label}</span>
              </div>
              <p style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'monospace', color: item.color }}>
                {item.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Prediction Accuracy */}
      {accuracy && (
        <div style={{
          background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))',
          border: '1px solid rgba(71, 85, 105, 0.3)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '32px'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#f1f5f9', marginBottom: '20px' }}>
            Model Prediction Accuracy
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '36px', fontWeight: 700, color: '#22c55e', fontFamily: 'monospace' }}>
                {accuracy.accuracy}%
              </p>
              <p style={{ color: '#64748b', fontSize: '13px' }}>Overall Accuracy</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '36px', fontWeight: 700, color: '#3b82f6', fontFamily: 'monospace' }}>
                {accuracy.total_predicted.toLocaleString()}
              </p>
              <p style={{ color: '#64748b', fontSize: '13px' }}>Total Predictions</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '36px', fontWeight: 700, color: '#4ade80', fontFamily: 'monospace' }}>
                {accuracy.correct_predictions.toLocaleString()}
              </p>
              <p style={{ color: '#64748b', fontSize: '13px' }}>Correct</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '36px', fontWeight: 700, color: '#f87171', fontFamily: 'monospace' }}>
                {accuracy.wrong_predictions.toLocaleString()}
              </p>
              <p style={{ color: '#64748b', fontSize: '13px' }}>Incorrect</p>
            </div>
          </div>
          {/* Accuracy bar */}
          <div style={{ marginTop: '24px' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', borderRadius: '12px', height: '24px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  width: `${accuracy.accuracy}%`, 
                  height: '100%', 
                  background: 'linear-gradient(90deg, #22c55e, #4ade80)',
                  borderRadius: '12px',
                  transition: 'width 1s ease'
                }} 
              />
            </div>
          </div>
        </div>
      )}

      {/* Time Series Chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
        <div style={{
          background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))',
          border: '1px solid rgba(71, 85, 105, 0.3)',
          borderRadius: '16px',
          padding: '24px',
          height: '400px'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#f1f5f9', marginBottom: '20px' }}>
            Transaction Volume Over Time
          </h3>
          <div style={{ width: '100%', height: 'calc(100% - 40px)' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeSeries}>
                <defs>
                  <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="fraudGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="label" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area type="monotone" dataKey="total_count" stroke="#3b82f6" fillOpacity={1} fill="url(#totalGradient)" name="Total" />
                <Area type="monotone" dataKey="fraud_count" stroke="#ef4444" fillOpacity={1} fill="url(#fraudGradient)" name="Fraud" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Amount by Risk Level */}
        <div style={{
          background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))',
          border: '1px solid rgba(71, 85, 105, 0.3)',
          borderRadius: '16px',
          padding: '24px',
          height: '400px'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#f1f5f9', marginBottom: '20px' }}>
            Risk Level Distribution
          </h3>
          <div style={{ width: '100%', height: 'calc(100% - 40px)' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={amountByRisk}
                  dataKey="count"
                  nameKey="risk_level"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  label={(props: any) => `${props.name || ''} ${((props.percent || 0) * 100).toFixed(0)}%`}
                  labelLine={{ stroke: '#64748b' }}
                >
                  {amountByRisk.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={riskColors[entry.risk_level] || '#64748b'} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Average Amount by Risk */}
      <div style={{
        background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))',
        border: '1px solid rgba(71, 85, 105, 0.3)',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '32px',
        height: '350px'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#f1f5f9', marginBottom: '20px' }}>
          Amount Statistics by Risk Level
        </h3>
        <div style={{ width: '100%', height: 'calc(100% - 40px)' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={amountByRisk} layout="vertical" margin={{ left: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis type="number" stroke="#64748b" fontSize={11} tickFormatter={(v) => `$${v.toLocaleString()}`} />
              <YAxis type="category" dataKey="risk_level" stroke="#64748b" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="avg_amount" name="Avg Amount" radius={[0, 4, 4, 0]}>
                {amountByRisk.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={riskColors[entry.risk_level] || '#64748b'} />
                ))}
              </Bar>
              <Bar dataKey="max_amount" name="Max Amount" fill="#64748b" radius={[0, 4, 4, 0]} opacity={0.5} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Fraud Transactions */}
      <div style={{
        background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))',
        border: '1px solid rgba(71, 85, 105, 0.3)',
        borderRadius: '16px',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(71, 85, 105, 0.3)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#f1f5f9' }}>
            Top 10 High-Risk Transactions
          </h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(71, 85, 105, 0.3)' }}>
                {['ID', 'Amount', 'Fraud Probability', 'Risk Level', 'Actual', 'Predicted'].map(h => (
                  <th key={h} style={{ 
                    padding: '14px 20px', 
                    textAlign: h === 'ID' ? 'left' : 'right', 
                    fontSize: '11px', 
                    color: '#64748b', 
                    textTransform: 'uppercase',
                    fontWeight: 600 
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topFraud.map((tx) => (
                <tr key={tx.id} style={{ borderBottom: '1px solid rgba(71, 85, 105, 0.2)' }}>
                  <td style={{ padding: '14px 20px', fontFamily: 'monospace', color: '#e2e8f0', fontSize: '13px' }}>#{tx.id}</td>
                  <td style={{ padding: '14px 20px', textAlign: 'right', fontFamily: 'monospace', color: '#94a3b8', fontSize: '13px' }}>
                    ${tx.amount.toFixed(2)}
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    <span style={{
                      fontFamily: 'monospace',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: tx.fraud_probability >= 0.7 ? '#ef4444' : tx.fraud_probability >= 0.4 ? '#f97316' : '#22c55e'
                    }}>
                      {(tx.fraud_probability * 100).toFixed(2)}%
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 600,
                      background: tx.risk_level === 'HIGH' ? 'rgba(239, 68, 68, 0.15)' : tx.risk_level === 'MEDIUM' ? 'rgba(249, 115, 22, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                      color: riskColors[tx.risk_level] || '#64748b',
                      border: `1px solid ${riskColors[tx.risk_level] || '#64748b'}33`
                    }}>
                      {tx.risk_level}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 600,
                      background: tx.actual_class === 1 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                      color: tx.actual_class === 1 ? '#f87171' : '#4ade80'
                    }}>
                      {tx.actual_class === 1 ? 'Fraud' : 'Legit'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 600,
                      background: tx.predicted_class === 1 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                      color: tx.predicted_class === 1 ? '#f87171' : '#4ade80'
                    }}>
                      {tx.predicted_class === 1 ? 'Fraud' : 'Legit'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
