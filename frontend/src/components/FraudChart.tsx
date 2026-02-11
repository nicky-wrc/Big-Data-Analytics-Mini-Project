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
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'

interface ChartProps {
  data: any[]
  type: 'area' | 'bar' | 'pie'
  dataKey?: string
  xAxisKey?: string
  title: string
  subtitle?: string
  colors?: string[]
}

const defaultColors = ['#ef4444', '#22c55e', '#f97316', '#3b82f6', '#8b5cf6']

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(15, 23, 42, 0.95)',
        border: '1px solid rgba(71, 85, 105, 0.5)',
        borderRadius: '12px',
        padding: '14px 18px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
      }}>
        <p style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '8px' }}>{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ 
            fontSize: '14px', 
            fontWeight: 600,
            color: entry.color,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: entry.color
            }} />
            {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function FraudChart({
  data,
  type,
  dataKey = 'value',
  xAxisKey = 'name',
  title,
  subtitle,
  colors = defaultColors,
}: ChartProps) {
  // Don't render if no data
  if (!data || data.length === 0) {
    return (
      <div style={{
        background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))',
        border: '1px solid rgba(71, 85, 105, 0.3)',
        borderRadius: '20px',
        padding: '28px',
        height: '350px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <p style={{ color: '#64748b' }}>No data available</p>
      </div>
    )
  }

  return (
    <div style={{
      background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))',
      border: '1px solid rgba(71, 85, 105, 0.3)',
      borderRadius: '20px',
      padding: '28px',
      height: '350px'
    }}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ 
          fontSize: '18px', 
          fontWeight: 600, 
          color: '#f1f5f9',
          marginBottom: '4px'
        }}>{title}</h3>
        {subtitle && (
          <p style={{ fontSize: '13px', color: '#64748b' }}>{subtitle}</p>
        )}
      </div>

      <div style={{ width: '100%', height: 'calc(100% - 60px)' }}>
        <ResponsiveContainer width="100%" height="100%">
          {type === 'area' ? (
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorFraud" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(71, 85, 105, 0.3)" vertical={false} />
              <XAxis 
                dataKey={xAxisKey} 
                stroke="#64748b" 
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: 'rgba(71, 85, 105, 0.3)' }}
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey={dataKey}
                stroke="#ef4444"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorFraud)"
              />
            </AreaChart>
          ) : type === 'bar' ? (
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(71, 85, 105, 0.3)" vertical={false} />
              <XAxis 
                dataKey={xAxisKey} 
                stroke="#64748b" 
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: 'rgba(71, 85, 105, 0.3)' }}
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey={dataKey} radius={[8, 8, 0, 0]}>
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey={dataKey}
                stroke="none"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                formatter={(value) => <span style={{ color: '#94a3b8', fontSize: '13px' }}>{value}</span>}
              />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  )
}
