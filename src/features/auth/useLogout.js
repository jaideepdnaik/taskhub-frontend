import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from './authSlice'

// Blacklists the refresh token, clears the session and cache (see
// app/listeners.js), then goes to the login page.
export function useLogout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  return useCallback(async () => {
    await dispatch(logout())
    navigate('/login', { replace: true })
  }, [dispatch, navigate])
}
