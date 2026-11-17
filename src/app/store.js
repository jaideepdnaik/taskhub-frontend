import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import orgReducer from '../features/orgs/orgSlice'
import uiReducer from '../features/ui/uiSlice'
import { listenerMiddleware } from './listeners'

// Redux holds client state (auth session, current org, UI).
// Server data (projects, tasks) lives in React Query instead.
export const store = configureStore({
  reducer: {
    auth: authReducer,
    org: orgReducer,
    ui: uiReducer,
  },
  middleware: (getDefault) => getDefault().prepend(listenerMiddleware.middleware),
})
