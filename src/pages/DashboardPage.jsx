import Dashboard from '../features/dashboard/Dashboard'
import { useCurrentOrg } from '../features/orgs/queries'

export default function DashboardPage() {
  const org = useCurrentOrg()

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h1>{org.name}</h1>
          <p className="muted small">
            You're <strong>{org.role}</strong> in this organization.
          </p>
        </div>
      </div>
      <Dashboard />
    </section>
  )
}
