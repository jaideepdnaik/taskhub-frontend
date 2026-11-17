import { createListenerMiddleware } from '@reduxjs/toolkit'
import { setApiOrgId } from '../api/client'
import { logout } from '../features/auth/authSlice'
import { authKeys } from '../features/auth/queries'
import { currentOrgChanged, lastOrgStorage } from '../features/orgs/orgSlice'
import { queryClient } from './queryClient'

// Side effects of client-state changes, kept out of reducers.
export const listenerMiddleware = createListenerMiddleware()

listenerMiddleware.startListening({
  actionCreator: currentOrgChanged,
  effect: (action, api) => {
    const previous = api.getOriginalState().org.currentOrgId
    const next = action.payload
    setApiOrgId(next)
    if (next != null) lastOrgStorage.set(next)
    // Never let another org's data linger in the cache. User-level data
    // (the profile and org list) stays.
    if (previous != null && previous !== next) {
      queryClient.removeQueries({
        predicate: (query) => query.queryKey[0] !== authKeys.all[0],
      })
    }
  },
})

listenerMiddleware.startListening({
  actionCreator: logout.fulfilled,
  effect: () => {
    setApiOrgId(null)
    queryClient.clear()
  },
})
