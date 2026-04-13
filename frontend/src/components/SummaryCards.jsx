import { useSelector } from 'react-redux'

export default function SummaryCards() {
  const summary = useSelector(state => state.expenses.summary)
  if (!summary) return null

  const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
  const balance = Number(summary.balance || 0)

  return (
    <div className="summary-cards">
      <div className="card card-income">
        <span className="card-icon">💹</span>
        <span className="card-label">Total Income</span>
        <span className="card-value">{fmt(summary.totalIncome)}</span>
      </div>
      <div className="card card-expense">
        <span className="card-icon">💸</span>
        <span className="card-label">Total Expenses</span>
        <span className="card-value">{fmt(summary.totalExpense)}</span>
      </div>
      <div className={`card ${balance >= 0 ? 'card-positive' : 'card-negative'}`}>
        <span className="card-icon">{balance >= 0 ? '✅' : '⚠️'}</span>
        <span className="card-label">Net Balance</span>
        <span className="card-value">{fmt(summary.balance)}</span>
      </div>
    </div>
  )
}
