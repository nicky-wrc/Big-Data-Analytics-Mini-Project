import { useEffect, useState } from 'react'
import { Filter, ChevronLeft, ChevronRight, X } from 'lucide-react'
import TransactionTable from '../components/TransactionTable'
import { getTransactions, Transaction } from '../services/api'

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [limit] = useState(20)
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null)
  const [showFilters, setShowFilters] = useState(true)
  
  const [filters, setFilters] = useState({
    risk_level: '',
    actual_class: '',
    min_amount: '',
    max_amount: '',
  })

  const fetchTransactions = async () => {
    setLoading(true)
    try {
      const params: any = { page, limit }
      if (filters.risk_level) params.risk_level = filters.risk_level
      if (filters.actual_class) params.actual_class = parseInt(filters.actual_class)
      if (filters.min_amount) params.min_amount = parseFloat(filters.min_amount)
      if (filters.max_amount) params.max_amount = parseFloat(filters.max_amount)
      
      const res = await getTransactions(params)
      setTransactions(res.data.data || [])
      setTotal(res.data.total || 0)
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [page, filters])

  const totalPages = Math.ceil(total / limit) || 1

  const clearFilters = () => {
    setFilters({ risk_level: '', actual_class: '', min_amount: '', max_amount: '' })
    setPage(1)
  }

  const hasActiveFilters = Object.values(filters).some(v => v !== '')

  const selectStyle: React.CSSProperties = {
    width: '100%',
    background: '#0f172a',
    border: '1px solid #475569',
    borderRadius: '10px',
    padding: '12px 16px',
    color: '#e2e8f0',
    fontSize: '14px',
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2394a3b8' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10l-5 5z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center'
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: '#0f172a',
    border: '1px solid #475569',
    borderRadius: '10px',
    padding: '12px 16px',
    color: '#e2e8f0',
    fontSize: '14px'
  }

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#f1f5f9', marginBottom: '8px' }}>
            Transaction Monitor
          </h1>
          <p style={{ color: '#64748b', fontSize: '15px' }}>
            Browse and analyze all transactions with fraud predictions
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '28px', fontWeight: 700, color: '#f1f5f9' }}>
            {total.toLocaleString()}
          </p>
          <p style={{ fontSize: '13px', color: '#64748b' }}>Total Transactions</p>
        </div>
      </div>

      {/* Filters */}
      <div style={{
        background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))',
        border: '1px solid rgba(71, 85, 105, 0.3)',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: 500
            }}
          >
            <Filter style={{ width: '18px', height: '18px' }} />
            <span>Filters</span>
            {hasActiveFilters && (
              <span style={{
                background: '#ef4444',
                color: 'white',
                fontSize: '11px',
                padding: '3px 10px',
                borderRadius: '20px',
                fontWeight: 600
              }}>Active</span>
            )}
          </button>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'none',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              <X style={{ width: '14px', height: '14px' }} />
              Clear all
            </button>
          )}
        </div>

        {showFilters && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(71, 85, 105, 0.3)'
          }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '8px', fontWeight: 500 }}>
                Risk Level
              </label>
              <select
                value={filters.risk_level}
                onChange={(e) => setFilters({ ...filters, risk_level: e.target.value })}
                style={selectStyle}
              >
                <option value="" style={{ background: '#0f172a', color: '#e2e8f0' }}>All Levels</option>
                <option value="HIGH" style={{ background: '#0f172a', color: '#f87171' }}>High Risk</option>
                <option value="MEDIUM" style={{ background: '#0f172a', color: '#fb923c' }}>Medium Risk</option>
                <option value="LOW" style={{ background: '#0f172a', color: '#4ade80' }}>Low Risk</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '8px', fontWeight: 500 }}>
                Classification
              </label>
              <select
                value={filters.actual_class}
                onChange={(e) => setFilters({ ...filters, actual_class: e.target.value })}
                style={selectStyle}
              >
                <option value="" style={{ background: '#0f172a', color: '#e2e8f0' }}>All</option>
                <option value="1" style={{ background: '#0f172a', color: '#f87171' }}>Fraud Only</option>
                <option value="0" style={{ background: '#0f172a', color: '#4ade80' }}>Legitimate Only</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '8px', fontWeight: 500 }}>
                Min Amount
              </label>
              <input
                type="number"
                value={filters.min_amount}
                onChange={(e) => setFilters({ ...filters, min_amount: e.target.value })}
                placeholder="0.00"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '8px', fontWeight: 500 }}>
                Max Amount
              </label>
              <input
                type="number"
                value={filters.max_amount}
                onChange={(e) => setFilters({ ...filters, max_amount: e.target.value })}
                placeholder="10000.00"
                style={inputStyle}
              />
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <TransactionTable 
        transactions={transactions} 
        loading={loading}
        onRowClick={setSelectedTx}
      />

      {/* Pagination */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '24px' }}>
        <p style={{ fontSize: '14px', color: '#64748b' }}>
          Showing {Math.min(((page - 1) * limit) + 1, total)} to {Math.min(page * limit, total)} of {total.toLocaleString()} transactions
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{
              padding: '10px',
              borderRadius: '10px',
              background: '#1e293b',
              border: '1px solid #334155',
              color: page === 1 ? '#475569' : '#94a3b8',
              cursor: page === 1 ? 'not-allowed' : 'pointer',
              opacity: page === 1 ? 0.5 : 1
            }}
          >
            <ChevronLeft style={{ width: '20px', height: '20px' }} />
          </button>
          <div style={{ display: 'flex', gap: '6px' }}>
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const pageNum = page <= 3 ? i + 1 : page - 2 + i
              if (pageNum > totalPages || pageNum < 1) return null
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    fontWeight: 600,
                    fontSize: '14px',
                    background: page === pageNum ? 'linear-gradient(135deg, #ef4444, #dc2626)' : '#1e293b',
                    border: page === pageNum ? 'none' : '1px solid #334155',
                    color: page === pageNum ? 'white' : '#94a3b8',
                    cursor: 'pointer'
                  }}
                >
                  {pageNum}
                </button>
              )
            })}
          </div>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{
              padding: '10px',
              borderRadius: '10px',
              background: '#1e293b',
              border: '1px solid #334155',
              color: page === totalPages ? '#475569' : '#94a3b8',
              cursor: page === totalPages ? 'not-allowed' : 'pointer',
              opacity: page === totalPages ? 0.5 : 1
            }}
          >
            <ChevronRight style={{ width: '20px', height: '20px' }} />
          </button>
        </div>
      </div>

      {/* Transaction Detail Modal */}
      {selectedTx && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div style={{
            background: 'linear-gradient(145deg, #1e293b, #0f172a)',
            border: '1px solid #334155',
            borderRadius: '20px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{
              padding: '24px',
              borderBottom: '1px solid #334155',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#f1f5f9' }}>
                Transaction #{selectedTx.id.toString().padStart(6, '0')}
              </h2>
              <button
                onClick={() => setSelectedTx(null)}
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  background: 'transparent',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer'
                }}
              >
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div style={{ background: '#0f172a', borderRadius: '12px', padding: '16px' }}>
                  <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Amount</p>
                  <p style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'monospace', color: '#f1f5f9' }}>
                    ${Number(selectedTx.amount).toFixed(2)}
                  </p>
                </div>
                <div style={{ background: '#0f172a', borderRadius: '12px', padding: '16px' }}>
                  <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Fraud Probability</p>
                  <p style={{
                    fontSize: '24px',
                    fontWeight: 700,
                    fontFamily: 'monospace',
                    color: Number(selectedTx.fraud_probability || 0) > 0.5 ? '#f87171' : '#4ade80'
                  }}>
                    {selectedTx.fraud_probability !== null 
                      ? `${(Number(selectedTx.fraud_probability) * 100).toFixed(2)}%`
                      : 'N/A'
                    }
                  </p>
                </div>
              </div>

              {[
                { label: 'Time Elapsed', value: `${(selectedTx.time_elapsed / 3600).toFixed(2)} hours` },
                { label: 'Actual Class', value: selectedTx.actual_class === 1 ? 'Fraudulent' : 'Legitimate', color: selectedTx.actual_class === 1 ? '#f87171' : '#4ade80' },
                { label: 'Predicted', value: selectedTx.predicted_class === 1 ? 'Fraudulent' : selectedTx.predicted_class === 0 ? 'Legitimate' : 'N/A', color: selectedTx.predicted_class === 1 ? '#f87171' : '#4ade80' },
                { label: 'Risk Level', value: selectedTx.risk_level || 'N/A' },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  borderBottom: '1px solid #1e293b'
                }}>
                  <span style={{ color: '#64748b' }}>{item.label}</span>
                  <span style={{ color: item.color || '#e2e8f0', fontWeight: 500 }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
