import { Link, Outlet } from 'react-router-dom'
import { useOrgFromUrl } from '../features/orgs/useOrgFromUrl'

// Wraps every /org/:orgId/... route. Renders children only once the org in the
// URL is confirmed and set as current.
export default function OrgLayout() {
  const { status, refetch } = useOrgFromUrl()

  if (status === 'loading') return <p className="muted">Loading organization…</p>
  if (status === 'error') {
    return (
      <div className="state">
        <p className="error">Couldn't load your organizations.</p>
        <button onClick={() => refetch()}>Try again</button>
      </div>
    )
  }
  if (status === 'not-found') {
    return (
      <div className="state">
        <h1>Organization not found</h1>
        <p className="muted">It doesn't exist, or you're not a member.</p>
        <Link to="/">Go to your organizations</Link>
      </div>
    )
  }
  return <Outlet />
}
