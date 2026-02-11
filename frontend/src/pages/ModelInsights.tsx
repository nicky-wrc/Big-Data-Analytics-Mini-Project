import { useEffect, useState } from 'react'
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Award,
  BarChart3,
  Activity,
  AlertCircle
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts'
import { getModelComparison, getFeatureImportance, getConfusionMatrix } from '../services/api'

interface ModelResult {
  model: string
  accuracy: number
  precision: number
  recall: number
  f1_score: number
  roc_auc: number
}

export default function ModelInsights() {
  const [modelComparison, setModelComparison] = useState<ModelResult[]>([])
  const [featureImportance, setFeatureImportance] = useState<any[]>([])
  const [confusionMatrix, setConfusionMatrix] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedModel, setSelectedModel] = useState<string>('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [compRes, featRes, confRes] = await Promise.all([
          getModelComparison().catch(() => ({ data: [] })),
          getFeatureImportance().catch(() => ({ data: [] })),
          getConfusionMatrix().catch(() => ({ data: null }))
        ])
        
        // Ensure we have arrays
        const models = Array.isArray(compRes.data) ? compRes.data : []
        const features = Array.isArray(featRes.data) ? featRes.data : []
        
        setModelComparison(models)
        setFeatureImportance(features)
        setConfusionMatrix(confRes.data)
        
        if (models.length > 0) {
          const best = models.reduce((a: ModelResult, b: ModelResult) => 
            (a.f1_score || 0) > (b.f1_score || 0) ? a : b
          )
          setSelectedModel(best.model || '')
        }
      } catch (error) {
        console.error('Failed to fetch model data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const selectedModelData = modelComparison.find(m => m.model === selectedModel)

  const radarData = selectedModelData ? [
    { metric: 'Accuracy', value: (selectedModelData.accuracy || 0) * 100 },
    { metric: 'Precision', value: (selectedModelData.precision || 0) * 100 },
    { metric: 'Recall', value: (selectedModelData.recall || 0) * 100 },
    { metric: 'F1 Score', value: (selectedModelData.f1_score || 0) * 100 },
    { metric: 'ROC AUC', value: (selectedModelData.roc_auc || 0) * 100 },
  ] : []

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid #334155',
          borderRadius: '10px',
          padding: '12px 16px'
        }}>
          <p style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '6px' }}>{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ fontSize: '14px', fontWeight: 600, color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(4) : entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <Brain style={{ width: '48px', height: '48px', color: '#ef4444', margin: '0 auto 16px' }} />
          <p style={{ color: '#64748b' }}>Loading model insights...</p>
        </div>
      </div>
    )
  }

  // Show message if no data
  if (modelComparison.length === 0) {
    return (
      <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#f1f5f9', marginBottom: '8px' }}>
          Model Insights
        </h1>
        <p style={{ color: '#64748b', marginBottom: '32px' }}>
          Machine learning model performance analysis
        </p>
        
        <div style={{
          background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))',
          border: '1px solid rgba(249, 115, 22, 0.3)',
          borderRadius: '16px',
          padding: '48px',
          textAlign: 'center'
        }}>
          <AlertCircle style={{ width: '48px', height: '48px', color: '#f97316', margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '20px', color: '#f1f5f9', marginBottom: '8px' }}>No Model Data Available</h3>
          <p style={{ color: '#64748b', maxWidth: '400px', margin: '0 auto' }}>
            Model comparison data is not yet available. This data is generated from the Spark training pipeline. 
            Please ensure the training has completed and the output files exist in spark/output/model/
          </p>
        </div>

        {/* Confusion Matrix from DB */}
        {confusionMatrix && (
          <div style={{ marginTop: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#f1f5f9', marginBottom: '20px' }}>
              Confusion Matrix (from predictions)
            </h2>
            <div style={{
              background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))',
              border: '1px solid rgba(71, 85, 105, 0.3)',
              borderRadius: '16px',
              padding: '32px'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr', gap: '12px', maxWidth: '400px', margin: '0 auto' }}>
                <div></div>
                <div style={{ textAlign: 'center', color: '#64748b', fontSize: '13px', padding: '8px' }}>Pred: Legit</div>
                <div style={{ textAlign: 'center', color: '#64748b', fontSize: '13px', padding: '8px' }}>Pred: Fraud</div>
                
                <div style={{ color: '#64748b', fontSize: '13px', padding: '8px', textAlign: 'right' }}>Actual: Legit</div>
                <div style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
                  <p style={{ fontSize: '24px', fontWeight: 700, color: '#4ade80' }}>{(confusionMatrix.tn || 0).toLocaleString()}</p>
                  <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>True Negative</p>
                </div>
                <div style={{ background: 'rgba(249, 115, 22, 0.15)', border: '1px solid rgba(249, 115, 22, 0.3)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
                  <p style={{ fontSize: '24px', fontWeight: 700, color: '#fb923c' }}>{(confusionMatrix.fp || 0).toLocaleString()}</p>
                  <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>False Positive</p>
                </div>
                
                <div style={{ color: '#64748b', fontSize: '13px', padding: '8px', textAlign: 'right' }}>Actual: Fraud</div>
                <div style={{ background: 'rgba(249, 115, 22, 0.15)', border: '1px solid rgba(249, 115, 22, 0.3)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
                  <p style={{ fontSize: '24px', fontWeight: 700, color: '#fb923c' }}>{(confusionMatrix.fn || 0).toLocaleString()}</p>
                  <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>False Negative</p>
                </div>
                <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
                  <p style={{ fontSize: '24px', fontWeight: 700, color: '#f87171' }}>{(confusionMatrix.tp || 0).toLocaleString()}</p>
                  <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>True Positive</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#f1f5f9', marginBottom: '8px' }}>
          Model Insights
        </h1>
        <p style={{ color: '#64748b' }}>
          Machine learning model performance analysis and comparison
        </p>
      </div>

      {/* Model Selector */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
        {modelComparison.map((model) => (
          <button
            key={model.model}
            onClick={() => setSelectedModel(model.model)}
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: selectedModel === model.model 
                ? 'linear-gradient(135deg, #ef4444, #dc2626)' 
                : 'rgba(30, 41, 59, 0.8)',
              border: selectedModel === model.model 
                ? 'none' 
                : '1px solid rgba(71, 85, 105, 0.5)',
              color: selectedModel === model.model ? 'white' : '#94a3b8',
              boxShadow: selectedModel === model.model ? '0 8px 24px rgba(239, 68, 68, 0.3)' : 'none'
            }}
          >
            {model.model}
          </button>
        ))}
      </div>

      {/* Metrics Cards */}
      {selectedModelData && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '32px' }}>
          {[
            { icon: Target, label: 'Accuracy', value: selectedModelData.accuracy, color: '#3b82f6' },
            { icon: TrendingUp, label: 'Precision', value: selectedModelData.precision, color: '#22c55e' },
            { icon: Activity, label: 'Recall', value: selectedModelData.recall, color: '#f97316' },
            { icon: Award, label: 'F1 Score', value: selectedModelData.f1_score, color: '#8b5cf6' },
            { icon: BarChart3, label: 'ROC AUC', value: selectedModelData.roc_auc, color: '#ef4444' },
          ].map((item, i) => (
            <div key={i} style={{
              background: `linear-gradient(145deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))`,
              border: `1px solid ${item.color}33`,
              borderRadius: '16px',
              padding: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <item.icon style={{ width: '18px', height: '18px', color: item.color }} />
                <span style={{ fontSize: '13px', color: '#94a3b8' }}>{item.label}</span>
              </div>
              <p style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'monospace', color: item.color }}>
                {((item.value || 0) * 100).toFixed(2)}%
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
        {/* Radar Chart */}
        <div style={{
          background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))',
          border: '1px solid rgba(71, 85, 105, 0.3)',
          borderRadius: '16px',
          padding: '24px',
          height: '400px'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#f1f5f9', marginBottom: '20px' }}>
            Performance Radar
          </h3>
          {radarData.length > 0 ? (
            <div style={{ width: '100%', height: 'calc(100% - 40px)' }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} />
                  <Radar name="Performance" dataKey="value" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} strokeWidth={2} />
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'calc(100% - 40px)', color: '#64748b' }}>
              Select a model to view performance
            </div>
          )}
        </div>

        {/* Model Comparison */}
        <div style={{
          background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))',
          border: '1px solid rgba(71, 85, 105, 0.3)',
          borderRadius: '16px',
          padding: '24px',
          height: '400px'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#f1f5f9', marginBottom: '20px' }}>
            Model Comparison (F1 Score)
          </h3>
          <div style={{ width: '100%', height: 'calc(100% - 40px)' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={modelComparison} layout="vertical" margin={{ left: 80 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" domain={[0, 1]} stroke="#64748b" fontSize={12} />
                <YAxis type="category" dataKey="model" stroke="#64748b" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="f1_score" name="F1 Score" radius={[0, 8, 8, 0]}>
                  {modelComparison.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.model === selectedModel ? '#ef4444' : '#475569'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Feature Importance */}
      {featureImportance.length > 0 && (
        <div style={{
          background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))',
          border: '1px solid rgba(71, 85, 105, 0.3)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '32px',
          height: '450px'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#f1f5f9', marginBottom: '20px' }}>
            Feature Importance (Top 15)
          </h3>
          <div style={{ width: '100%', height: 'calc(100% - 40px)' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={featureImportance.slice(0, 15)} layout="vertical" margin={{ left: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" stroke="#64748b" fontSize={12} />
                <YAxis type="category" dataKey="feature" stroke="#64748b" fontSize={11} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="importance" name="Importance" radius={[0, 8, 8, 0]}>
                  {featureImportance.slice(0, 15).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(${(index / 15) * 60}, 70%, 50%)`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Confusion Matrix */}
      {confusionMatrix && (
        <div style={{
          background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))',
          border: '1px solid rgba(71, 85, 105, 0.3)',
          borderRadius: '16px',
          padding: '32px'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#f1f5f9', marginBottom: '24px' }}>
            Confusion Matrix
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr', gap: '12px', maxWidth: '400px', margin: '0 auto' }}>
            <div></div>
            <div style={{ textAlign: 'center', color: '#64748b', fontSize: '13px', padding: '8px' }}>Predicted: Legit</div>
            <div style={{ textAlign: 'center', color: '#64748b', fontSize: '13px', padding: '8px' }}>Predicted: Fraud</div>
            
            <div style={{ color: '#64748b', fontSize: '13px', padding: '8px', textAlign: 'right' }}>Actual: Legit</div>
            <div style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
              <p style={{ fontSize: '24px', fontWeight: 700, color: '#4ade80' }}>{(confusionMatrix.tn || 0).toLocaleString()}</p>
              <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>True Negative</p>
            </div>
            <div style={{ background: 'rgba(249, 115, 22, 0.15)', border: '1px solid rgba(249, 115, 22, 0.3)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
              <p style={{ fontSize: '24px', fontWeight: 700, color: '#fb923c' }}>{(confusionMatrix.fp || 0).toLocaleString()}</p>
              <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>False Positive</p>
            </div>
            
            <div style={{ color: '#64748b', fontSize: '13px', padding: '8px', textAlign: 'right' }}>Actual: Fraud</div>
            <div style={{ background: 'rgba(249, 115, 22, 0.15)', border: '1px solid rgba(249, 115, 22, 0.3)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
              <p style={{ fontSize: '24px', fontWeight: 700, color: '#fb923c' }}>{(confusionMatrix.fn || 0).toLocaleString()}</p>
              <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>False Negative</p>
            </div>
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
              <p style={{ fontSize: '24px', fontWeight: 700, color: '#f87171' }}>{(confusionMatrix.tp || 0).toLocaleString()}</p>
              <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>True Positive</p>
            </div>
          </div>
        </div>
      )}

      {/* Model Details Table */}
      <div style={{
        background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))',
        border: '1px solid rgba(71, 85, 105, 0.3)',
        borderRadius: '16px',
        overflow: 'hidden',
        marginTop: '32px'
      }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(71, 85, 105, 0.3)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#f1f5f9' }}>All Models Comparison</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(71, 85, 105, 0.3)' }}>
              {['Model', 'Accuracy', 'Precision', 'Recall', 'F1 Score', 'ROC AUC'].map(h => (
                <th key={h} style={{ padding: '16px', textAlign: h === 'Model' ? 'left' : 'right', fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {modelComparison.map((model) => (
              <tr key={model.model} style={{ 
                borderBottom: '1px solid rgba(71, 85, 105, 0.2)',
                background: model.model === selectedModel ? 'rgba(239, 68, 68, 0.1)' : 'transparent'
              }}>
                <td style={{ padding: '16px', fontWeight: 500, color: '#e2e8f0' }}>
                  {model.model}
                  {model.model === selectedModel && (
                    <span style={{ marginLeft: '10px', fontSize: '11px', background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', padding: '3px 8px', borderRadius: '6px' }}>Selected</span>
                  )}
                </td>
                <td style={{ padding: '16px', textAlign: 'right', fontFamily: 'monospace', color: '#94a3b8' }}>{((model.accuracy || 0) * 100).toFixed(2)}%</td>
                <td style={{ padding: '16px', textAlign: 'right', fontFamily: 'monospace', color: '#94a3b8' }}>{((model.precision || 0) * 100).toFixed(2)}%</td>
                <td style={{ padding: '16px', textAlign: 'right', fontFamily: 'monospace', color: '#94a3b8' }}>{((model.recall || 0) * 100).toFixed(2)}%</td>
                <td style={{ padding: '16px', textAlign: 'right', fontFamily: 'monospace', color: '#4ade80', fontWeight: 600 }}>{((model.f1_score || 0) * 100).toFixed(2)}%</td>
                <td style={{ padding: '16px', textAlign: 'right', fontFamily: 'monospace', color: '#94a3b8' }}>{((model.roc_auc || 0) * 100).toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
