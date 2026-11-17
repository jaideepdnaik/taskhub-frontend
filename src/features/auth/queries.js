import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { fetchMe, register } from './api'
import { sessionStarted } from './authSlice'
import { tokenStorage } from './tokenStorage'

// User-level data, not tied to an org. Kept when switching orgs.
export const authKeys = {
  all: ['auth'],
  me: () => ['auth', 'me'],
}

export function useMe() {
  return useQuery({ queryKey: authKeys.me(), queryFn: fetchMe })
}

// Sign up, store the tokens and start the session. The response already holds
// the profile, so seed the `me` cache with it instead of refetching.
export function useRegister() {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: register,
    onSuccess: ({ user, access, refresh }) => {
      tokenStorage.set(access, refresh)
      queryClient.setQueryData(authKeys.me(), user)
      dispatch(sessionStarted())
    },
  })
}
