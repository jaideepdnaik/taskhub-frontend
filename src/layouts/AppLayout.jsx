import { useDispatch } from 'react-redux'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { logout } from '../features/auth/authSlice'
import OrgSwitcher from '../features/orgs/OrgSwitcher'

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
        <div className="topbar-left">
          <Link to="/" className="brand">TaskHub</Link>
          <OrgSwitcher />
        </div>
        <button onClick={handleLogout}>Log out</button>
      </header>
      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}
