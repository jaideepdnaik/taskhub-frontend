import { Link } from 'react-router-dom'
import BarBreakdown from '../../components/BarBreakdown'
import ErrorState from '../../components/ErrorState'
import { useCurrentOrgId } from '../orgs/queries'
import { usePermissions } from '../orgs/usePermissions'
import { PRIORITIES, STATUSES } from '../tasks/constants'
import DashboardStats from './DashboardStats'
import OverdueTasks from './OverdueTasks'
import { useDashboard } from './queries'
import RecentActivity from './RecentActivity'

const toRows = (choices, counts) =>
  choices.map(({ value, label }) => ({ key: value, label, value: counts[value] ?? 0 }))

export default function Dashboard() {
  const orgId = useCurrentOrgId()
  const { isAdmin } = usePermissions()
  const { data, isPending, isError, error, refetch } = useDashboard()

  if (isPending) return <p className="muted">Loading dashboard…</p>
  if (isError) return <ErrorState title="Couldn't load the dashboard." error={error} onRetry={refetch} />

  if (data.projects.active + data.projects.archived === 0) {
    return (
      <div className="empty">
        <p>
          {isAdmin
            ? 'No projects yet. Create one to start tracking work.'
            : "You haven't been added to any projects yet. Ask an admin to add you."}
        </p>
        {isAdmin && (
          <Link className="button" to={`/org/${orgId}/projects`}>
            Go to projects
          </Link>
        )}
      </div>
    )
  }

  return (
    <>
      <DashboardStats stats={data} />
      <div className="dashboard-grid">
        <OverdueTasks />
        <section className="panel" aria-label="Task breakdown">
          <BarBreakdown title="Tasks by status" rows={toRows(STATUSES, data.tasks.by_status)} />
          <BarBreakdown title="Tasks by priority" rows={toRows(PRIORITIES, data.tasks.by_priority)} />
        </section>
        <RecentActivity entries={data.recent_activity} />
      </div>
    </>
  )
}
