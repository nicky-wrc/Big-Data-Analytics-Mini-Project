import { useState } from 'react'
import { 
  Book, 
  Code2, 
  Copy, 
  Check,
  ChevronRight,
  Server,
  Database,
  Cpu
} from 'lucide-react'

interface Endpoint {
  method: 'GET' | 'POST'
  path: string
  description: string
  params?: { name: string; type: string; description: string; required?: boolean }[]
  response: string
}

const endpoints: { category: string; items: Endpoint[] }[] = [
  {
    category: 'Statistics',
    items: [
      {
        method: 'GET',
        path: '/api/stats',
        description: 'Get overall transaction statistics including fraud counts, rates, and risk distribution',
        response: `{
  "total_transactions": 284807,
  "total_fraud": 492,
  "fraud_rate": 0.001727,
  "avg_amount": 88.35,
  "total_amount": 25166161.94,
  "high_risk_count": 156,
  "medium_risk_count": 892,
  "low_risk_count": 283759
}`
      },
      {
        method: 'GET',
        path: '/api/stats/hourly',
        description: 'Get hourly fraud statistics for time-series visualization',
        response: `[
  { "hour": "0h", "fraud_count": 12, "total_count": 5844 },
  { "hour": "1h", "fraud_count": 8, "total_count": 4921 },
  ...
]`
      },
      {
        method: 'GET',
        path: '/api/stats/amount-distribution',
        description: 'Get transaction amount distribution by ranges',
        response: `[
  { "range": "0-10", "total": 45231, "fraud_count": 234 },
  { "range": "10-50", "total": 78452, "fraud_count": 156 },
  ...
]`
      },
      {
        method: 'GET',
        path: '/api/stats/time-series',
        description: 'Get comprehensive time-series data for analytics',
        response: `[
  {
    "hour": 0,
    "label": "Hour 0",
    "total_count": 5844,
    "fraud_count": 12,
    "avg_amount": 92.45,
    "total_amount": 540234.56,
    "fraud_rate": "0.21"
  },
  ...
]`
      },
      {
        method: 'GET',
        path: '/api/stats/confusion-matrix',
        description: 'Get confusion matrix from model predictions',
        response: `{
  "tn": 284315,  // True Negatives
  "fp": 123,     // False Positives
  "fn": 45,      // False Negatives
  "tp": 447      // True Positives
}`
      }
    ]
  },
  {
    category: 'Transactions',
    items: [
      {
        method: 'GET',
        path: '/api/transactions',
        description: 'Get paginated list of transactions with optional filters',
        params: [
          { name: 'page', type: 'number', description: 'Page number (default: 1)' },
          { name: 'limit', type: 'number', description: 'Items per page (default: 20)' },
          { name: 'risk_level', type: 'string', description: 'Filter by risk: HIGH, MEDIUM, LOW' },
          { name: 'actual_class', type: 'number', description: 'Filter by class: 0 (legit) or 1 (fraud)' },
          { name: 'min_amount', type: 'number', description: 'Minimum transaction amount' },
          { name: 'max_amount', type: 'number', description: 'Maximum transaction amount' }
        ],
        response: `{
  "data": [
    {
      "id": 1,
      "amount": 149.62,
      "time_elapsed": 0,
      "actual_class": 0,
      "predicted_class": 0,
      "fraud_probability": 0.0234,
      "risk_level": "LOW"
    },
    ...
  ],
  "total": 284807,
  "page": 1,
  "limit": 20
}`
      },
      {
        method: 'GET',
        path: '/api/transactions/:id',
        description: 'Get detailed information for a specific transaction',
        params: [
          { name: 'id', type: 'number', description: 'Transaction ID', required: true }
        ],
        response: `{
  "id": 12345,
  "amount": 2125.87,
  "time_elapsed": 86400,
  "actual_class": 1,
  "predicted_class": 1,
  "fraud_probability": 0.9821,
  "risk_level": "HIGH",
  "v1": -1.3598071336738,
  "v2": -0.0727811733098497,
  ...
  "v28": -0.021053053453327
}`
      }
    ]
  },
  {
    category: 'Prediction',
    items: [
      {
        method: 'POST',
        path: '/api/predict',
        description: 'Make a fraud prediction for a new transaction',
        params: [
          { name: 'features', type: 'number[]', description: 'Array of 30 features [V1-V28, Amount, Time]', required: true }
        ],
        response: `{
  "prediction": 1,
  "is_fraud": true,
  "fraud_probability": 0.9543,
  "risk_level": "HIGH",
  "model": "RandomForest"
}`
      }
    ]
  },
  {
    category: 'Model Insights',
    items: [
      {
        method: 'GET',
        path: '/api/stats/model-comparison',
        description: 'Get performance comparison of trained ML models',
        response: `[
  {
    "model": "RandomForest",
    "accuracy": 0.9988,
    "precision": 0.5957,
    "recall": 0.8571,
    "f1_score": 0.7029,
    "roc_auc": 0.98
  },
  {
    "model": "GradientBoosting",
    "accuracy": 0.9975,
    "precision": 0.3944,
    "recall": 0.8571,
    "f1_score": 0.5402,
    "roc_auc": 0.9621
  },
  ...
]`
      },
      {
        method: 'GET',
        path: '/api/stats/feature-importance',
        description: 'Get feature importance scores from Random Forest model',
        response: `[
  { "feature": "V10", "importance": 0.1746 },
  { "feature": "V14", "importance": 0.1408 },
  { "feature": "V4", "importance": 0.1158 },
  ...
]`
      }
    ]
  },
  {
    category: 'Export',
    items: [
      {
        method: 'GET',
        path: '/api/stats/export/csv',
        description: 'Export transaction data as CSV file',
        params: [
          { name: 'limit', type: 'number', description: 'Max rows to export (default: 1000)' },
          { name: 'risk_level', type: 'string', description: 'Filter by risk level' },
          { name: 'actual_class', type: 'number', description: 'Filter by actual class' }
        ],
        response: `CSV file download with columns:
ID, Amount, Time, Actual Class, Predicted Class, Fraud Probability, Risk Level`
      }
    ]
  }
]

export default function ApiDocs() {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null)

  const copyToClipboard = (text: string, endpoint: string) => {
    navigator.clipboard.writeText(text)
    setCopiedEndpoint(endpoint)
    setTimeout(() => setCopiedEndpoint(null), 2000)
  }

  const methodColors = {
    GET: { bg: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', border: 'rgba(34, 197, 94, 0.3)' },
    POST: { bg: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: 'rgba(59, 130, 246, 0.3)' }
  }

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <Book style={{ width: '32px', height: '32px', color: '#ef4444' }} />
          <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#f1f5f9' }}>
            API Documentation
          </h1>
        </div>
        <p style={{ color: '#64748b', maxWidth: '700px' }}>
          Complete REST API reference for FraudLens. All endpoints return JSON and are accessible at the base URL.
        </p>
      </div>

      {/* Quick Info */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
        {[
          { icon: Server, label: 'Base URL', value: 'http://localhost:8000' },
          { icon: Database, label: 'Database', value: 'PostgreSQL 16' },
          { icon: Cpu, label: 'ML Model', value: 'RandomForest (scikit-learn)' }
        ].map((item, i) => (
          <div key={i} style={{
            background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))',
            border: '1px solid rgba(71, 85, 105, 0.3)',
            borderRadius: '14px',
            padding: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <item.icon style={{ width: '18px', height: '18px', color: '#64748b' }} />
              <span style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>{item.label}</span>
            </div>
            <p style={{ fontSize: '16px', fontWeight: 600, color: '#e2e8f0', fontFamily: 'monospace' }}>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Endpoints */}
      {endpoints.map((section) => (
        <div key={section.category} style={{ marginBottom: '40px' }}>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: 600, 
            color: '#f1f5f9', 
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <ChevronRight style={{ width: '20px', height: '20px', color: '#ef4444' }} />
            {section.category}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {section.items.map((endpoint) => (
              <div key={endpoint.path} style={{
                background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))',
                border: '1px solid rgba(71, 85, 105, 0.3)',
                borderRadius: '16px',
                overflow: 'hidden'
              }}>
                {/* Endpoint Header */}
                <div style={{ 
                  padding: '16px 20px', 
                  borderBottom: '1px solid rgba(71, 85, 105, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 700,
                      background: methodColors[endpoint.method].bg,
                      color: methodColors[endpoint.method].color,
                      border: `1px solid ${methodColors[endpoint.method].border}`
                    }}>
                      {endpoint.method}
                    </span>
                    <code style={{ fontSize: '14px', color: '#e2e8f0', fontFamily: 'JetBrains Mono, monospace' }}>
                      {endpoint.path}
                    </code>
                  </div>
                  <button
                    onClick={() => copyToClipboard(endpoint.path, endpoint.path)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid rgba(71, 85, 105, 0.3)',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    {copiedEndpoint === endpoint.path ? (
                      <>
                        <Check style={{ width: '14px', height: '14px', color: '#4ade80' }} />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy style={{ width: '14px', height: '14px' }} />
                        Copy
                      </>
                    )}
                  </button>
                </div>

                {/* Description */}
                <div style={{ padding: '16px 20px' }}>
                  <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.6 }}>
                    {endpoint.description}
                  </p>

                  {/* Parameters */}
                  {endpoint.params && endpoint.params.length > 0 && (
                    <div style={{ marginTop: '20px' }}>
                      <h4 style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', marginBottom: '12px', fontWeight: 600 }}>
                        Parameters
                      </h4>
                      <div style={{ 
                        background: 'rgba(15, 23, 42, 0.6)', 
                        borderRadius: '10px', 
                        overflow: 'hidden',
                        border: '1px solid rgba(71, 85, 105, 0.2)'
                      }}>
                        {endpoint.params.map((param, i) => (
                          <div key={param.name} style={{
                            padding: '12px 16px',
                            borderBottom: i < endpoint.params!.length - 1 ? '1px solid rgba(71, 85, 105, 0.2)' : 'none',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '16px'
                          }}>
                            <code style={{ 
                              fontSize: '13px', 
                              color: '#f87171', 
                              fontFamily: 'JetBrains Mono, monospace',
                              minWidth: '100px'
                            }}>
                              {param.name}
                              {param.required && <span style={{ color: '#ef4444' }}>*</span>}
                            </code>
                            <span style={{ 
                              fontSize: '11px', 
                              color: '#64748b', 
                              padding: '2px 8px', 
                              background: 'rgba(71, 85, 105, 0.3)',
                              borderRadius: '4px',
                              fontFamily: 'monospace'
                            }}>
                              {param.type}
                            </span>
                            <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                              {param.description}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Response */}
                  <div style={{ marginTop: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <h4 style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
                        Response
                      </h4>
                      <button
                        onClick={() => copyToClipboard(endpoint.response, `${endpoint.path}-response`)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          background: 'transparent',
                          border: 'none',
                          color: '#64748b',
                          cursor: 'pointer',
                          fontSize: '11px'
                        }}
                      >
                        {copiedEndpoint === `${endpoint.path}-response` ? (
                          <>
                            <Check style={{ width: '12px', height: '12px', color: '#4ade80' }} />
                            Copied
                          </>
                        ) : (
                          <>
                            <Code2 style={{ width: '12px', height: '12px' }} />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                    <pre style={{
                      background: 'rgba(15, 23, 42, 0.8)',
                      borderRadius: '10px',
                      padding: '16px',
                      overflow: 'auto',
                      fontSize: '12px',
                      lineHeight: 1.6,
                      color: '#94a3b8',
                      fontFamily: 'JetBrains Mono, monospace',
                      border: '1px solid rgba(71, 85, 105, 0.2)',
                      maxHeight: '300px'
                    }}>
                      {endpoint.response}
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Tech Stack */}
      <div style={{
        background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))',
        border: '1px solid rgba(71, 85, 105, 0.3)',
        borderRadius: '16px',
        padding: '24px',
        marginTop: '40px'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#f1f5f9', marginBottom: '20px' }}>
          Technology Stack
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          {[
            { name: 'Apache Spark', desc: 'Big Data Processing & EDA', color: '#f97316' },
            { name: 'scikit-learn', desc: 'ML Model Training', color: '#3b82f6' },
            { name: 'Node.js + Express', desc: 'REST API Backend', color: '#22c55e' },
            { name: 'React + Recharts', desc: 'Interactive Dashboard', color: '#8b5cf6' }
          ].map((tech) => (
            <div key={tech.name} style={{
              padding: '16px',
              borderRadius: '10px',
              background: 'rgba(15, 23, 42, 0.6)',
              border: `1px solid ${tech.color}33`
            }}>
              <p style={{ fontSize: '14px', fontWeight: 600, color: tech.color, marginBottom: '4px' }}>
                {tech.name}
              </p>
              <p style={{ fontSize: '12px', color: '#64748b' }}>{tech.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
