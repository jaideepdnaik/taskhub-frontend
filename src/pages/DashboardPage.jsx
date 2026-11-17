import { useCurrentOrg } from '../features/orgs/queries'

// Org home. The real dashboard (stats, overdue tasks) is roadmap step 7.
export default function DashboardPage() {
  const org = useCurrentOrg()

  return (
    <section>
      <h1>{org.name}</h1>
      <p className="muted">
        You're signed in as <strong>{org.role}</strong> in this organization.
      </p>
    </section>
  )
}
