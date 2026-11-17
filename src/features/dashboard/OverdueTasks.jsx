import { Link } from 'react-router-dom'
import Avatar from '../../components/Avatar'
import ErrorState from '../../components/ErrorState'
import { useCurrentOrgId } from '../orgs/queries'
import DueDate from '../tasks/DueDate'
import { useOverdueTasks } from '../tasks/queries'

export default function OverdueTasks() {
  const orgId = useCurrentOrgId()
  const { data, isPending, isError, error, refetch } = useOverdueTasks(5)

  let body
  if (isPending) body = <p className="muted">Loading…</p>
  else if (isError) body = <ErrorState title="Couldn't load overdue tasks." error={error} onRetry={refetch} />
  else if (data.results.length === 0) body = <p className="muted">Nothing overdue. Nice work.</p>
  else {
    body = (
      <ul className="compact-list">
        {data.results.map((task) => (
          <li key={task.id}>
            <Link to={`/org/${orgId}/projects/${task.project.id}/board?task=${task.id}`}>
              {task.title}
            </Link>
            <span className="muted small">{task.project.name}</span>
            <span className="compact-meta">
              <DueDate task={task} />
              {task.assignee ? (
                <Avatar user={task.assignee} size={22} />
              ) : (
                <span className="muted small">Unassigned</span>
              )}
            </span>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <section className="panel" aria-labelledby="overdue-heading">
      <div className="panel-header">
        <h2 id="overdue-heading">Overdue tasks</h2>
        {data?.count > data?.results.length && (
          <span className="muted small">
            {data.results.length} of {data.count}
          </span>
        )}
      </div>
      {body}
    </section>
  )
}
