import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/slices/authSlice'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(state => state.auth.user)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span>💰</span> ExpenseTracker
      </div>
      <div className="navbar-right">
        <div className="navbar-user">
          <div className="dot" />
          {user?.username?.toUpperCase()}
        </div>
        <button onClick={handleLogout} className="btn-logout">Sign out</button>
      </div>
    </nav>
  )
}
