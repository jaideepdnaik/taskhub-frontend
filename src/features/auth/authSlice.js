import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api } from '../../api/client'
import { tokenStorage } from './tokenStorage'

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/login/', { email, password })
      tokenStorage.set(data.access, data.refresh)
      return { email }
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail ?? 'Login failed')
    }
  },
)

export const logout = createAsyncThunk('auth/logout', async () => {
  const refresh = tokenStorage.getRefresh()
  try {
    if (refresh) await api.post('/auth/logout/', { refresh })
  } finally {
    tokenStorage.clear()
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: Boolean(tokenStorage.getAccess()),
    status: 'idle', // idle | loading | failed
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(login.fulfilled, (state) => {
        state.status = 'idle'
        state.isAuthenticated = true
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false
      })
  },
})

export const selectAuth = (state) => state.auth
export default authSlice.reducer
