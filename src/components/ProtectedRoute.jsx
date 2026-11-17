import { useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { selectAuth } from '../features/auth/authSlice'

export default function ProtectedRoute() {
  const { isAuthenticated } = useSelector(selectAuth)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return <Outlet />
}
