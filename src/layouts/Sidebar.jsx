import { NavLink } from 'react-router-dom'
import { useCurrentOrg } from '../features/orgs/queries'

const LINKS = [
  { to: '', label: 'Dashboard', end: true },
  { to: 'projects', label: 'Projects' },
  { to: 'my-tasks', label: 'My Tasks' },
  { to: 'notifications', label: 'Notifications' },
  { to: 'settings', label: 'Settings' },
]

// Navigation for the current org. Hidden until an org is selected (e.g. a new
// user creating their first org).
export default function Sidebar({ open }) {
  const org = useCurrentOrg()
  if (!org) return null

  return (
    <nav className={`sidebar${open ? ' open' : ''}`} aria-label="Main">
      <div className="sidebar-org">
        <strong>{org.name}</strong>
        <span className="role-badge">{org.role}</span>
      </div>
      <ul>
        {LINKS.map(({ to, label, end }) => (
          <li key={label}>
            <NavLink to={to ? `/org/${org.id}/${to}` : `/org/${org.id}`} end={end}>
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
