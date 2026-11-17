import { Navigate } from 'react-router-dom'
import { lastOrgStorage } from '../features/orgs/orgSlice'
import { useMyOrgs } from '../features/orgs/queries'

// `/`: go to the last-used org if the user still belongs to it, else the first
// one. Users with no orgs yet are sent to create one.
export default function HomeRedirect() {
  const { data: orgs, isLoading, isError, refetch } = useMyOrgs()

  if (isLoading) return <p className="muted">Loading…</p>
  if (isError) {
    return (
      <div className="state">
        <p className="error">Couldn't load your organizations.</p>
        <button onClick={() => refetch()}>Try again</button>
      </div>
    )
  }
  if (orgs.length === 0) return <Navigate to="/orgs/new" replace />

  const lastOrgId = lastOrgStorage.get()
  const target = orgs.find((org) => org.id === lastOrgId) ?? orgs[0]
  return <Navigate to={`/org/${target.id}`} replace />
}
