import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addExpense, fetchSummary } from '../store/slices/expenseSlice'

const CATEGORIES = ['Food','Transport','Housing','Health','Entertainment','Shopping','Education','Other']

export default function ExpenseForm({ onSuccess }) {
  const dispatch = useDispatch()
  const [form, setForm] = useState({
    title: '', amount: '', category: 'Food',
    date: new Date().toISOString().split('T')[0],
    description: '', type: 'EXPENSE'
  })
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await dispatch(addExpense({ ...form, amount: parseFloat(form.amount) }))
      dispatch(fetchSummary())
      setForm({ title: '', amount: '', category: 'Food', date: new Date().toISOString().split('T')[0], description: '', type: 'EXPENSE' })
      onSuccess?.('Transaction added!')
    } catch {
      onSuccess?.('Failed to add', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="panel">
      <p className="panel-title">Add Transaction</p>

      <div className="type-toggle">
        <button type="button"
          className={`type-btn ${form.type === 'EXPENSE' ? 'active-expense' : ''}`}
          onClick={() => set('type', 'EXPENSE')}>
          ↓ Expense
        </button>
        <button type="button"
          className={`type-btn ${form.type === 'INCOME' ? 'active-income' : ''}`}
          onClick={() => set('type', 'INCOME')}>
          ↑ Income
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Title</label>
          <input type="text" placeholder="e.g. Grocery run" value={form.title}
            onChange={e => set('title', e.target.value)} required />
        </div>
        <div className="form-row">
          <label>Amount (₹)</label>
          <input type="number" placeholder="0.00" min="0.01" step="0.01" value={form.amount}
            onChange={e => set('amount', e.target.value)} required />
        </div>
        <div className="form-row">
          <label>Category</label>
          <select value={form.category} onChange={e => set('category', e.target.value)}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-row">
          <label>Date</label>
          <input type="date" value={form.date} onChange={e => set('date', e.target.value)} required />
        </div>
        <div className="form-row">
          <label>Note (optional)</label>
          <input type="text" placeholder="Add a note..." value={form.description}
            onChange={e => set('description', e.target.value)} />
        </div>
        <button type="submit" className="btn-add" disabled={loading}>
          {loading ? 'Adding...' : `+ Add ${form.type === 'INCOME' ? 'Income' : 'Expense'}`}
        </button>
      </form>
    </div>
  )
}
