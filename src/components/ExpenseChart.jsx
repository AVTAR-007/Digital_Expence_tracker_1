import { useState } from 'react'
import { useSelector } from 'react-redux'
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  AreaChart, Area
} from 'recharts'

const COLORS = ['#4f8fff','#22d3a0','#ff5a6e','#fbbf24','#a78bfa','#fb923c','#38bdf8','#f472b6']

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background:'#1a2336', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'0.6rem 1rem', fontSize:'0.82rem' }}>
      {label && <p style={{ color:'#8b9ab5', marginBottom:'0.25rem' }}>{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || '#f0f4ff' }}>
          {p.name}: ₹{Number(p.value).toLocaleString('en-IN')}
        </p>
      ))}
    </div>
  )
}

export default function ExpenseChart() {
  const summary = useSelector(state => state.expenses.summary)
  const [activeChart, setActiveChart] = useState('pie')
  if (!summary) return null

  const pieData = Object.entries(summary.expenseByCategory || {}).map(([name, value]) => ({
    name, value: Number(value)
  }))

  const barData = Object.entries(summary.monthlyTrend || {}).map(([month, value]) => ({
    month, amount: Number(value)
  }))

  const axisStyle = { fill: '#4f5f7a', fontSize: 11 }

  return (
    <div className="panel">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
        <p className="panel-title" style={{marginBottom:0}}>Analytics</p>
        <div className="chart-tabs">
          {['pie','bar','area'].map(t => (
            <button key={t} className={`chart-tab ${activeChart===t?'active':''}`} onClick={() => setActiveChart(t)}>
              {t === 'pie' ? 'Category' : t === 'bar' ? 'Monthly' : 'Trend'}
            </button>
          ))}
        </div>
      </div>

      {activeChart === 'pie' && (
        pieData.length > 0 ? (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={95} innerRadius={45} paddingAngle={3}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{color:'#8b9ab5',fontSize:'0.78rem'}}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        ) : <div className="empty-state"><div className="empty-icon">📊</div><p>No expense data yet</p></div>
      )}

      {activeChart === 'bar' && (
        barData.length > 0 ? (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={axisStyle} axisLine={false} tickLine={false} />
              <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill:'rgba(79,143,255,0.06)' }} />
              <Bar dataKey="amount" name="Expenses" fill="#4f8fff" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : <div className="empty-state"><div className="empty-icon">📈</div><p>No monthly data yet</p></div>
      )}

      {activeChart === 'area' && (
        barData.length > 0 ? (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={barData}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f8fff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4f8fff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={axisStyle} axisLine={false} tickLine={false} />
              <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="amount" name="Expenses" stroke="#4f8fff" strokeWidth={2} fill="url(#areaGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        ) : <div className="empty-state"><div className="empty-icon">📉</div><p>No trend data yet</p></div>
      )}
    </div>
  )
}
