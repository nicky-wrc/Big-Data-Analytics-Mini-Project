import { useState } from 'react'
import { 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  Loader2,
  RefreshCw,
  Sparkles,
  Shield,
  Zap
} from 'lucide-react'
import { predict, PredictionResult } from '../services/api'

const defaultFeatures = [
  -1.359807, -0.072781, 2.536347, 1.378155, -0.338321,
  0.462388, 0.239599, 0.098698, 0.363787, 0.090794,
  -0.551600, -0.617801, -0.991390, -0.311169, 1.468177,
  -0.470401, 0.207971, 0.025791, 0.403993, 0.251412,
  -0.018307, 0.277838, -0.110474, 0.066928, 0.128539,
  -0.189115, 0.133558, -0.021053, 149.62
]

const featureLabels = [
  ...Array.from({ length: 28 }, (_, i) => `V${i + 1}`),
  'Amount'
]

export default function Predict() {
  const [features, setFeatures] = useState<number[]>(defaultFeatures)
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePredict = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await predict(features)
      setResult(res.data)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Prediction failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFeatures(defaultFeatures)
    setResult(null)
    setError(null)
  }

  const handleRandomize = () => {
    const randomFeatures = features.map((_, i) => {
      if (i === 28) return Math.random() * 1000
      return (Math.random() - 0.5) * 10
    })
    setFeatures(randomFeatures)
    setResult(null)
  }

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...features]
    newFeatures[index] = parseFloat(value) || 0
    setFeatures(newFeatures)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: '#0f172a',
    border: '1px solid #334155',
    borderRadius: '8px',
    padding: '8px 10px',
    color: '#e2e8f0',
    fontSize: '13px',
    fontFamily: 'monospace'
  }

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#f1f5f9', marginBottom: '8px' }}>
          Fraud Prediction
        </h1>
        <p style={{ color: '#64748b' }}>
          Enter transaction features to get real-time fraud prediction
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
        {/* Input Form */}
        <div>
          {/* Quick Actions */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <button
              onClick={handleRandomize}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                background: 'rgba(30, 41, 59, 0.8)',
                border: '1px solid #334155',
                borderRadius: '12px',
                color: '#94a3b8',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 500
              }}
            >
              <Sparkles style={{ width: '16px', height: '16px' }} />
              Random Values
            </button>
            <button
              onClick={handleReset}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                background: 'rgba(30, 41, 59, 0.8)',
                border: '1px solid #334155',
                borderRadius: '12px',
                color: '#94a3b8',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 500
              }}
            >
              <RefreshCw style={{ width: '16px', height: '16px' }} />
              Reset to Default
            </button>
          </div>

          {/* Feature Inputs */}
          <div style={{
            background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))',
            border: '1px solid rgba(71, 85, 105, 0.3)',
            borderRadius: '20px',
            padding: '28px'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#f1f5f9', marginBottom: '20px' }}>
              Transaction Features
            </h3>
            
            {/* Amount (highlighted) */}
            <div style={{
              marginBottom: '24px',
              padding: '20px',
              background: 'rgba(15, 23, 42, 0.6)',
              borderRadius: '14px',
              border: '1px solid rgba(34, 197, 94, 0.2)'
            }}>
              <label style={{ display: 'block', fontSize: '14px', color: '#4ade80', marginBottom: '10px', fontWeight: 500 }}>
                💰 Transaction Amount ($)
              </label>
              <input
                type="number"
                value={features[28]}
                onChange={(e) => updateFeature(28, e.target.value)}
                step="0.01"
                style={{
                  width: '100%',
                  background: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  padding: '16px',
                  fontSize: '24px',
                  fontFamily: 'monospace',
                  color: '#f1f5f9',
                  fontWeight: 600
                }}
              />
            </div>

            {/* PCA Features Grid */}
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>PCA Features (V1-V28)</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px' }}>
              {featureLabels.slice(0, 28).map((label, index) => (
                <div key={label}>
                  <label style={{ display: 'block', fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>
                    {label}
                  </label>
                  <input
                    type="number"
                    value={features[index]}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    step="0.000001"
                    style={inputStyle}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Predict Button */}
          <button
            onClick={handlePredict}
            disabled={loading}
            style={{
              width: '100%',
              marginTop: '24px',
              padding: '18px',
              background: loading ? '#475569' : 'linear-gradient(135deg, #ef4444, #dc2626)',
              border: 'none',
              borderRadius: '14px',
              color: 'white',
              fontSize: '16px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              boxShadow: loading ? 'none' : '0 8px 24px rgba(239, 68, 68, 0.3)'
            }}
          >
            {loading ? (
              <>
                <Loader2 style={{ width: '20px', height: '20px', animation: 'spin 1s linear infinite' }} />
                Analyzing Transaction...
              </>
            ) : (
              <>
                <Search style={{ width: '20px', height: '20px' }} />
                Predict Fraud Risk
              </>
            )}
          </button>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

          {error && (
            <div style={{
              marginTop: '16px',
              padding: '16px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px',
              color: '#f87171'
            }}>
              {error}
            </div>
          )}
        </div>

        {/* Result Panel */}
        <div>
          {result ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Main Result */}
              <div style={{
                borderRadius: '20px',
                padding: '28px',
                border: result.is_fraud 
                  ? '1px solid rgba(239, 68, 68, 0.4)' 
                  : '1px solid rgba(34, 197, 94, 0.4)',
                background: result.is_fraud 
                  ? 'linear-gradient(145deg, rgba(127, 29, 29, 0.3), rgba(15, 23, 42, 0.9))' 
                  : 'linear-gradient(145deg, rgba(20, 83, 45, 0.3), rgba(15, 23, 42, 0.9))',
                boxShadow: result.is_fraud 
                  ? '0 0 40px rgba(239, 68, 68, 0.2)' 
                  : '0 0 40px rgba(34, 197, 94, 0.2)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                  {result.is_fraud ? (
                    <AlertTriangle style={{ width: '36px', height: '36px', color: '#f87171' }} />
                  ) : (
                    <CheckCircle style={{ width: '36px', height: '36px', color: '#4ade80' }} />
                  )}
                  <div>
                    <p style={{ fontSize: '13px', color: '#94a3b8' }}>Prediction Result</p>
                    <p style={{ 
                      fontSize: '24px', 
                      fontWeight: 700,
                      color: result.is_fraud ? '#f87171' : '#4ade80'
                    }}>
                      {result.is_fraud ? '⚠️ FRAUDULENT' : '✓ LEGITIMATE'}
                    </p>
                  </div>
                </div>

                {/* Probability Bar */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#94a3b8' }}>Fraud Probability</span>
                    <span style={{ 
                      fontSize: '16px',
                      fontWeight: 700,
                      fontFamily: 'monospace',
                      color: result.fraud_probability > 0.5 ? '#f87171' : '#4ade80'
                    }}>
                      {(result.fraud_probability * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div style={{ 
                    height: '12px', 
                    background: '#1e293b', 
                    borderRadius: '6px', 
                    overflow: 'hidden' 
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${result.fraud_probability * 100}%`,
                      background: result.fraud_probability > 0.7 
                        ? 'linear-gradient(90deg, #ef4444, #dc2626)' 
                        : result.fraud_probability > 0.3 
                          ? 'linear-gradient(90deg, #f97316, #ea580c)'
                          : 'linear-gradient(90deg, #22c55e, #16a34a)',
                      borderRadius: '6px',
                      transition: 'width 0.5s ease'
                    }} />
                  </div>
                </div>

                {/* Risk Level Badge */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: 600,
                  background: result.risk_level === 'HIGH' 
                    ? 'rgba(239, 68, 68, 0.2)' 
                    : result.risk_level === 'MEDIUM' 
                      ? 'rgba(249, 115, 22, 0.2)'
                      : 'rgba(34, 197, 94, 0.2)',
                  color: result.risk_level === 'HIGH' 
                    ? '#f87171' 
                    : result.risk_level === 'MEDIUM' 
                      ? '#fb923c'
                      : '#4ade80',
                  border: `1px solid ${
                    result.risk_level === 'HIGH' 
                      ? 'rgba(239, 68, 68, 0.3)' 
                      : result.risk_level === 'MEDIUM' 
                        ? 'rgba(249, 115, 22, 0.3)'
                        : 'rgba(34, 197, 94, 0.3)'
                  }`
                }}>
                  <Shield style={{ width: '16px', height: '16px' }} />
                  {result.risk_level} RISK
                </div>
              </div>

              {/* Model Info */}
              <div style={{
                background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))',
                border: '1px solid rgba(71, 85, 105, 0.3)',
                borderRadius: '16px',
                padding: '24px'
              }}>
                <h4 style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>Model Information</h4>
                {[
                  { label: 'Model Used', value: result.model },
                  { label: 'Prediction', value: result.prediction.toString() },
                  { label: 'Confidence', value: `${(result.is_fraud ? result.fraud_probability : (1 - result.fraud_probability)) * 100}`.slice(0, 5) + '%' },
                ].map((item, i) => (
                  <div key={i} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    padding: '10px 0',
                    borderBottom: i < 2 ? '1px solid rgba(71, 85, 105, 0.2)' : 'none'
                  }}>
                    <span style={{ color: '#64748b', fontSize: '14px' }}>{item.label}</span>
                    <span style={{ color: '#e2e8f0', fontFamily: 'monospace', fontSize: '14px' }}>{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Recommendations */}
              <div style={{
                background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))',
                border: '1px solid rgba(71, 85, 105, 0.3)',
                borderRadius: '16px',
                padding: '24px'
              }}>
                <h4 style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>Recommendations</h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {result.risk_level === 'HIGH' && (
                    <>
                      <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#f87171', fontSize: '14px' }}>
                        <Zap style={{ width: '16px', height: '16px', marginTop: '2px', flexShrink: 0 }} />
                        Block transaction immediately
                      </li>
                      <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#f87171', fontSize: '14px' }}>
                        <Zap style={{ width: '16px', height: '16px', marginTop: '2px', flexShrink: 0 }} />
                        Contact cardholder for verification
                      </li>
                      <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#f87171', fontSize: '14px' }}>
                        <Zap style={{ width: '16px', height: '16px', marginTop: '2px', flexShrink: 0 }} />
                        Flag account for manual review
                      </li>
                    </>
                  )}
                  {result.risk_level === 'MEDIUM' && (
                    <>
                      <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#fb923c', fontSize: '14px' }}>
                        <Zap style={{ width: '16px', height: '16px', marginTop: '2px', flexShrink: 0 }} />
                        Request additional verification
                      </li>
                      <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#fb923c', fontSize: '14px' }}>
                        <Zap style={{ width: '16px', height: '16px', marginTop: '2px', flexShrink: 0 }} />
                        Monitor subsequent transactions
                      </li>
                    </>
                  )}
                  {result.risk_level === 'LOW' && (
                    <>
                      <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#4ade80', fontSize: '14px' }}>
                        <CheckCircle style={{ width: '16px', height: '16px', marginTop: '2px', flexShrink: 0 }} />
                        Transaction appears safe
                      </li>
                      <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#4ade80', fontSize: '14px' }}>
                        <CheckCircle style={{ width: '16px', height: '16px', marginTop: '2px', flexShrink: 0 }} />
                        Proceed with standard processing
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          ) : (
            <div style={{
              background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))',
              border: '1px solid rgba(71, 85, 105, 0.3)',
              borderRadius: '20px',
              padding: '48px',
              textAlign: 'center'
            }}>
              <Search style={{ width: '48px', height: '48px', color: '#334155', margin: '0 auto 16px' }} />
              <p style={{ color: '#64748b', marginBottom: '8px' }}>No prediction yet</p>
              <p style={{ color: '#475569', fontSize: '14px' }}>
                Enter transaction features and click "Predict" to analyze
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
