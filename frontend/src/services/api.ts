import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface Transaction {
  id: number
  time_elapsed: number
  amount: number
  actual_class: number
  predicted_class: number | null
  fraud_probability: number | null
  risk_level: string | null
  created_at: string
  v1?: number
  v2?: number
  v3?: number
  v4?: number
  v5?: number
  v6?: number
  v7?: number
  v8?: number
  v9?: number
  v10?: number
  v11?: number
  v12?: number
  v13?: number
  v14?: number
  v15?: number
  v16?: number
  v17?: number
  v18?: number
  v19?: number
  v20?: number
  v21?: number
  v22?: number
  v23?: number
  v24?: number
  v25?: number
  v26?: number
  v27?: number
  v28?: number
}

export interface Stats {
  total_transactions: number
  total_fraud: number
  fraud_rate: number
  avg_amount: number
  total_amount: number
  high_risk_count: number
  medium_risk_count: number
  low_risk_count: number
}

export interface PredictionResult {
  prediction: number
  is_fraud: boolean
  fraud_probability: number
  risk_level: string
  model: string
}

export interface ModelMetrics {
  accuracy: number
  precision: number
  recall: number
  f1_score: number
  roc_auc: number
}

// Stats endpoints
export const getStats = () => api.get<Stats>('/stats')
export const getHourlyStats = () => api.get('/stats/hourly')
export const getAmountDistribution = () => api.get('/stats/amount-distribution')
export const getClassDistribution = () => api.get('/stats/class-distribution')

// Transactions endpoints
export const getTransactions = (params?: {
  page?: number
  limit?: number
  risk_level?: string
  actual_class?: number
  min_amount?: number
  max_amount?: number
}) => api.get<{ data: Transaction[], total: number, page: number, limit: number }>('/transactions', { params })

export const getTransaction = (id: number) => api.get<Transaction>(`/transactions/${id}`)

// Predict endpoint
export const predict = (features: number[]) => 
  api.post<PredictionResult>('/predict', { features })

// Model insights
export const getModelComparison = () => api.get('/stats/model-comparison')
export const getFeatureImportance = () => api.get('/stats/feature-importance')
export const getConfusionMatrix = () => api.get('/stats/confusion-matrix')

// Advanced analytics
export const getTimeSeries = () => api.get('/stats/time-series')
export const getTopFraud = () => api.get('/stats/top-fraud')
export const getPredictionAccuracy = () => api.get('/stats/prediction-accuracy')
export const getAmountByRisk = () => api.get('/stats/amount-by-risk')
export const getRealtimeSummary = () => api.get('/stats/realtime-summary')

// Export
export const exportCSV = (params?: {
  limit?: number
  risk_level?: string
  actual_class?: number
}) => api.get('/stats/export/csv', { params, responseType: 'blob' })

export default api
