import { useDispatch } from 'react-redux'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { logout } from '../features/auth/authSlice'

export default function AppLayout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await dispatch(logout())
    navigate('/login')
  }

  return (
    <div className="layout">
      <header className="topbar">
        <Link to="/" className="brand">TaskHub</Link>
        <button onClick={handleLogout}>Log out</button>
      </header>
      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}
