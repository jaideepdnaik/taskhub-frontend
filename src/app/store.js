import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'

// Redux holds client state (auth session, current org, UI).
// Server data (projects, tasks) lives in React Query instead.
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
})
