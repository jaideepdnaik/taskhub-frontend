import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { login, selectAuth } from '../features/auth/authSlice'

export default function LoginPage() {
  const dispatch = useDispatch()
  const location = useLocation()
  const { isAuthenticated, status, error } = useSelector(selectAuth)
  const [form, setForm] = useState({ email: '', password: '' })
  // Where ProtectedRoute sent us from, including ?query (e.g. an invite token).
  const from = location.state?.from
  const target = from ? `${from.pathname}${from.search ?? ''}` : '/'

  // Also handles a successful login: the session flips to authenticated and
  // this redirect runs on the next render.
  if (isAuthenticated) return <Navigate to={target} replace />

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(login(form))
  }

  return (
    <div className="auth-page">
      <div className="auth-stack">
        <form className="card" onSubmit={handleSubmit}>
          <h1>Sign in to TaskHub</h1>
          <label>
            Email
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </label>
          {error && <p className="error">{String(error)}</p>}
          <button type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="muted">
          New to TaskHub? <Link to="/register" state={location.state}>
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}
