import { Link } from 'react-router-dom'
import Icon from './Icon'

// A headline number. `alert` adds an icon and accent for counts that need
// attention (e.g. overdue > 0), so the state isn't carried by color alone.
export default function StatTile({ label, value, hint, to, alert = false }) {
  const content = (
    <>
      <span className="stat-label">{label}</span>
      <span className="stat-value">
        {alert && (
          <span className="stat-alert" aria-hidden="true">
            <Icon name="alert" size={20} />
          </span>
        )}
        {value}
      </span>
      {hint && <span className="muted small">{hint}</span>}
    </>
  )
  const className = `stat-tile${alert ? ' alert' : ''}`
  return to ? (
    <Link to={to} className={`${className} linked`}>
      {content}
    </Link>
  ) : (
    <div className={className}>{content}</div>
  )
}
