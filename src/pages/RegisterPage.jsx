import { useSelector } from 'react-redux'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { selectAuth } from '../features/auth/authSlice'
import RegisterForm from '../features/auth/RegisterForm'

export default function RegisterPage() {
  const { isAuthenticated } = useSelector(selectAuth)
  const location = useLocation()
  // Carried over from the login page, e.g. an invite link opened while signed out.
  const from = location.state?.from
  const target = from ? `${from.pathname}${from.search ?? ''}` : '/'

  // Also covers a successful sign-up: registering starts the session. Without a
  // `from`, `/` sends a new user (who has no orgs yet) to create their first one.
  if (isAuthenticated) return <Navigate to={target} replace />

  return (
    <div className="auth-page">
      <div className="auth-stack">
        <RegisterForm />
        <p className="muted">
          Already have an account? <Link to="/login" state={location.state}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
