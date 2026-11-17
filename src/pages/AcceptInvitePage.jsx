import { Navigate, useParams, useSearchParams } from 'react-router-dom'
import AcceptInvitation from '../features/orgs/AcceptInvitation'

// /invitations/accept?token=... is the link the backend sends (accept_url).
// /invite/:token is kept as a short alias and redirects here.
export default function AcceptInvitePage() {
  const [params] = useSearchParams()
  const { token: pathToken } = useParams()
  if (pathToken) {
    return <Navigate to={`/invitations/accept?token=${encodeURIComponent(pathToken)}`} replace />
  }

  return (
    <div className="auth-page">
      <AcceptInvitation token={params.get('token')} />
    </div>
  )
}
