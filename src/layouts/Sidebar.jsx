import { NavLink } from 'react-router-dom'
import Icon from '../components/Icon'
import { useCurrentOrg } from '../features/orgs/queries'

const LINKS = [
  { to: '', label: 'Dashboard', icon: 'dashboard', end: true },
  { to: 'projects', label: 'Projects', icon: 'projects' },
  { to: 'my-tasks', label: 'My Tasks', icon: 'tasks' },
  { to: 'assistant', label: 'Ask TaskHub', icon: 'sparkles' },
  { to: 'notifications', label: 'Notifications', icon: 'bell' },
  { to: 'settings', label: 'Settings', icon: 'settings' },
]

// Navigation for the current org. Hidden until an org is selected (e.g. a new
// user creating their first org).
export default function Sidebar({ open }) {
  const org = useCurrentOrg()
  if (!org) return null

  return (
    <nav className={`sidebar${open ? ' open' : ''}`} aria-label="Main">
      <div className="sidebar-org">
        <span className="org-mark" aria-hidden="true">
          {org.name.charAt(0).toUpperCase()}
        </span>
        <span className="sidebar-org-text">
          <strong>{org.name}</strong>
          <span className="role-badge">{org.role}</span>
        </span>
      </div>
      <ul>
        {LINKS.map(({ to, label, icon, end }) => (
          <li key={label}>
            <NavLink to={to ? `/org/${org.id}/${to}` : `/org/${org.id}`} end={end}>
              <Icon name={icon} />
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
