import { useSelector } from 'react-redux'
import { Link, Navigate } from 'react-router-dom'
import { selectAuth } from '../features/auth/authSlice'
import RegisterForm from '../features/auth/RegisterForm'

export default function RegisterPage() {
  const { isAuthenticated } = useSelector(selectAuth)

  // Also covers a successful sign-up: registering starts the session, and `/`
  // then sends a new user (who has no orgs yet) to create their first one.
  if (isAuthenticated) return <Navigate to="/" replace />

  return (
    <div className="auth-page">
      <div className="auth-stack">
        <RegisterForm />
        <p className="muted">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
