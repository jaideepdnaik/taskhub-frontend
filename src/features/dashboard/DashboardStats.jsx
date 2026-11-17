import StatTile from '../../components/StatTile'
import { useCurrentOrgId } from '../orgs/queries'

// Headline numbers: mine first (actionable), then the org's.
export default function DashboardStats({ stats }) {
  const orgId = useCurrentOrgId()
  const myTasksUrl = `/org/${orgId}/my-tasks`
  const { my_tasks: mine, tasks, projects, members } = stats

  return (
    <>
      <section aria-labelledby="my-work-heading" className="stat-section">
        <h2 id="my-work-heading">My work</h2>
        <div className="stat-grid">
          <StatTile label="Open tasks" value={mine.open} to={myTasksUrl} />
          <StatTile
            label="Overdue"
            value={mine.overdue}
            alert={mine.overdue > 0}
            to={`${myTasksUrl}?overdue=true`}
          />
          <StatTile label="Due this week" value={mine.due_this_week} hint="Next 7 days" />
        </div>
      </section>

      <section aria-labelledby="org-heading" className="stat-section">
        <h2 id="org-heading">Across your projects</h2>
        <div className="stat-grid">
          <StatTile label="Open tasks" value={tasks.open} hint={`${tasks.total} in total`} />
          <StatTile label="Overdue" value={tasks.overdue} alert={tasks.overdue > 0} />
          <StatTile label="Due this week" value={tasks.due_this_week} />
          <StatTile label="Unassigned" value={tasks.unassigned} hint="Open, no assignee" />
          <StatTile label="Completed" value={tasks.completed_last_7_days} hint="Last 7 days" />
          <StatTile
            label="Projects"
            value={projects.active}
            hint={projects.archived ? `${projects.archived} archived` : null}
            to={`/org/${orgId}/projects`}
          />
          <StatTile label="Members" value={members.total} />
        </div>
      </section>
    </>
  )
}
