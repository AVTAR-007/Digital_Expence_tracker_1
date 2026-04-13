import { useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { removeExpense, editExpense, fetchSummary } from '../store/slices/expenseSlice'

const CATEGORIES = ['Food','Transport','Housing','Health','Entertainment','Shopping','Education','Other']
const CAT_ICONS = { Food:'🍜', Transport:'🚗', Housing:'🏠', Health:'💊', Entertainment:'🎮', Shopping:'🛍️', Education:'📚', Other:'📌', Income:'💼' }

export default function ExpenseList({ onSuccess }) {
  const dispatch = useDispatch()
  const { list, loading } = useSelector(state => state.expenses)
  const [editId, setEditId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [filter, setFilter] = useState('ALL')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    let items = filter === 'ALL' ? list : list.filter(e => e.type === filter)
    if (search.trim()) {
      const q = search.toLowerCase()
      items = items.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        e.description?.toLowerCase().includes(q)
      )
    }
    return items
  }, [list, filter, search])

  const handleDelete = async (id) => {
    if (!confirm('Delete this transaction?')) return
    await dispatch(removeExpense(id))
    dispatch(fetchSummary())
    onSuccess?.('Transaction deleted')
  }

  const startEdit = (exp) => {
    setEditId(exp.id)
    setEditForm({ ...exp, amount: exp.amount.toString() })
  }

  const saveEdit = async (e) => {
    e.preventDefault()
    await dispatch(editExpense({ id: editId, data: { ...editForm, amount: parseFloat(editForm.amount) } }))
    dispatch(fetchSummary())
    setEditId(null)
    onSuccess?.('Transaction updated')
  }

  const fmt = (n) => `₹${Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`

  return (
    <div className="list-panel">
      <div className="list-header">
        <h3 style={{fontSize:'0.78rem',fontWeight:600,color:'var(--text3)',textTransform:'uppercase',letterSpacing:'0.08em'}}>
          Transactions <span style={{color:'var(--text2)',fontFamily:'DM Mono',fontWeight:400}}>({filtered.length})</span>
        </h3>
        <div className="list-controls">
          <input className="search-input" placeholder="🔍 Search..." value={search}
            onChange={e => setSearch(e.target.value)} />
          <div className="filter-tabs">
            {['ALL','INCOME','EXPENSE'].map(f => (
              <button key={f} className={`tab ${filter===f?'active':''}`} onClick={() => setFilter(f)}>
                {f === 'ALL' ? 'All' : f === 'INCOME' ? '↑ Income' : '↓ Expense'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-state"><div className="spinner" /> Loading transactions...</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">{search ? '🔍' : '📭'}</div>
          <p>{search ? 'No results found' : 'No transactions yet — add one above!'}</p>
        </div>
      ) : (
        <div className="list-items">
          {filtered.map(exp => (
            <div key={exp.id} className={`list-item`}>
              {editId === exp.id ? (
                <form onSubmit={saveEdit} className="edit-form">
                  <input value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} placeholder="Title" />
                  <input type="number" value={editForm.amount} onChange={e => setEditForm({...editForm, amount: e.target.value})} placeholder="Amount" />
                  <select value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                  <input type="date" value={editForm.date} onChange={e => setEditForm({...editForm, date: e.target.value})} />
                  <select value={editForm.type} onChange={e => setEditForm({...editForm, type: e.target.value})}>
                    <option value="EXPENSE">Expense</option>
                    <option value="INCOME">Income</option>
                  </select>
                  <button type="submit" className="btn-save">Save</button>
                  <button type="button" onClick={() => setEditId(null)} className="btn-cancel">Cancel</button>
                </form>
              ) : (
                <>
                  <div className="item-left">
                    <div className={`item-icon ${exp.type === 'INCOME' ? 'income' : 'expense'}`}>
                      {CAT_ICONS[exp.category] || CAT_ICONS.Other}
                    </div>
                    <div>
                      <p className="item-title">{exp.title}</p>
                      <p className="item-meta">
                        <span className="cat-badge">{exp.category}</span>
                        {exp.date}
                        {exp.description && <span style={{marginLeft:'0.3rem',color:'var(--text3)'}}>· {exp.description}</span>}
                      </p>
                    </div>
                  </div>
                  <div className="item-right">
                    <span className={`item-amount ${exp.type === 'INCOME' ? 'green' : 'red'}`}>
                      {exp.type === 'INCOME' ? '+' : '-'}{fmt(exp.amount)}
                    </span>
                    <div className="item-actions">
                      <button onClick={() => startEdit(exp)} className="btn-icon" title="Edit">✏️</button>
                      <button onClick={() => handleDelete(exp.id)} className="btn-icon del" title="Delete">🗑️</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
