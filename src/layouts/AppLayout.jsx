import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Outlet, useLocation } from 'react-router-dom'
import UserMenu from '../features/auth/UserMenu'
import NotificationBell from '../features/notifications/NotificationBell'
import OrgSwitcher from '../features/orgs/OrgSwitcher'
import Icon from '../components/Icon'
import { selectSidebarOpen, sidebarClosed, sidebarToggled } from '../features/ui/uiSlice'
import Sidebar from './Sidebar'

export default function AppLayout() {
  const dispatch = useDispatch()
  const sidebarOpen = useSelector(selectSidebarOpen)
  const { pathname } = useLocation()

  // Close the mobile sidebar after navigating.
  useEffect(() => {
    dispatch(sidebarClosed())
  }, [dispatch, pathname])

  return (
    <div className="layout">
      <header className="topbar">
        <div className="topbar-left">
          <button
            className="icon-button sidebar-toggle"
            aria-label="Toggle navigation"
            aria-expanded={sidebarOpen}
            onClick={() => dispatch(sidebarToggled())}
          >
            <Icon name="menu" size={20} />
          </button>
          <Link to="/" className="brand">
            <span className="brand-mark" aria-hidden="true">
              <Icon name="check" size={16} />
            </span>
            TaskHub
          </Link>
          <OrgSwitcher />
        </div>
        <div className="topbar-right">
          <NotificationBell />
          <UserMenu />
        </div>
      </header>
      <div className="shell">
        <Sidebar open={sidebarOpen} />
        {sidebarOpen && (
          <div className="backdrop" onClick={() => dispatch(sidebarClosed())} />
        )}
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
