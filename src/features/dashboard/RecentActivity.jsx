import { Link } from 'react-router-dom'
import { formatDateTime, formatRelative } from '../../utils/time'
import { useCurrentOrgId } from '../orgs/queries'
import { describeActivity } from '../tasks/activityText'

// The dashboard's last 10 activity entries (each has `task: {id, title, project_id}`).
export default function RecentActivity({ entries }) {
  const orgId = useCurrentOrgId()

  return (
    <section className="panel" aria-labelledby="recent-heading">
      <h2 id="recent-heading">Recent activity</h2>
      {entries.length === 0 ? (
        <p className="muted">No activity yet.</p>
      ) : (
        <ul className="compact-list">
          {entries.map((entry) => {
            const actor = entry.actor ? entry.actor.full_name || entry.actor.email : 'Someone'
            const [first, ...rest] = describeActivity(entry)
            return (
              <li key={entry.id}>
                <span>
                  <strong>{actor}</strong> {first}
                  {rest.length > 0 && ` (+${rest.length} more)`} on{' '}
                  <Link to={`/org/${orgId}/projects/${entry.task.project_id}/board?task=${entry.task.id}`}>
                    {entry.task.title}
                  </Link>
                </span>
                <span className="muted small" title={formatDateTime(entry.created_at)}>
                  {formatRelative(entry.created_at)}
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
