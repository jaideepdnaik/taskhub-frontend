import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="auth-page">
      <div className="card">
        <h1>Page not found</h1>
        <Link to="/">Go home</Link>
      </div>
    </div>
  )
}
