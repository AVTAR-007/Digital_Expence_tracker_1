import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchExpenses, fetchSummary } from '../store/slices/expenseSlice'
import SummaryCards from '../components/SummaryCards'
import ExpenseChart from '../components/ExpenseChart'
import ExpenseList from '../components/ExpenseList'
import ExpenseForm from '../components/ExpenseForm'
import Navbar from '../components/Navbar'
import Toast from '../components/Toast'
import { useToast } from '../utils/toast'

export default function DashboardPage() {
  const dispatch = useDispatch()
  const user = useSelector(state => state.auth.user)
  const { toasts, addToast } = useToast()

  useEffect(() => {
    dispatch(fetchExpenses())
    dispatch(fetchSummary())
  }, [dispatch])

  return (
    <div className="dashboard">
      <Navbar />
      <main className="dashboard-main">
        <p className="page-title">
          Hello, <span>{user?.username}</span> 👋
        </p>
        <SummaryCards />
        <div className="dashboard-grid">
          <ExpenseChart />
          <ExpenseForm onSuccess={addToast} />
        </div>
        <ExpenseList onSuccess={addToast} />
      </main>
      <Toast toasts={toasts} />
    </div>
  )
}
