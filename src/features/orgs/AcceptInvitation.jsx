import { Link, useLocation, useNavigate } from 'react-router-dom'
import { parseApiError } from '../../api/errors'
import { useMe } from '../auth/queries'
import { useLogout } from '../auth/useLogout'
import { useAcceptInvitation } from './queries'

// Accepting is an explicit click, not automatic on page load: it's a one-time
// action, and the invitation might be for a different account than this one.
export default function AcceptInvitation({ token }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { data: me } = useMe()
  const logout = useLogout()
  const accept = useAcceptInvitation()

  if (!token) {
    return (
      <div className="card">
        <h1>Invalid invitation link</h1>
        <p className="muted">This link is missing its invitation code. Ask for a new invite.</p>
        <Link to="/">Go to TaskHub</Link>
      </div>
    )
  }

  const status = accept.error?.response?.status
  const { fields, message } = accept.isError ? parseApiError(accept.error) : { fields: {} }
  const errorText =
    status === 404
      ? 'This invitation link is not valid. It may have been revoked or replaced by a newer one.'
      : (fields.token?.[0] ?? message)

  return (
    <div className="card">
      <h1>Join an organization</h1>
      <p>
        You've been invited to TaskHub. You're signed in as <strong>{me?.email ?? '…'}</strong>.
      </p>
      {accept.isError && <p className="error">{errorText}</p>}
      {status === 403 && (
        <p className="muted small">
          Sign in with the email address the invitation was sent to.{' '}
          <button className="link-button" onClick={() => logout({ from: location })}>
            Log out
          </button>
        </p>
      )}
      <button
        disabled={accept.isPending || accept.isSuccess}
        onClick={() =>
          accept.mutate(token, {
            onSuccess: ({ organization }) => navigate(`/org/${organization.id}`, { replace: true }),
          })
        }
      >
        {accept.isPending ? 'Joining…' : 'Accept invitation'}
      </button>
      <Link to="/" className="small">
        Not now
      </Link>
    </div>
  )
}
