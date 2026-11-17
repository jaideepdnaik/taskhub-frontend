import { createSlice } from '@reduxjs/toolkit'
import { logout } from '../auth/authSlice'

const LAST_ORG_KEY = 'taskhub.lastOrgId'

// Remembers the last-used org across reloads so `/` can send the user back to it.
export const lastOrgStorage = {
  get() {
    try {
      const value = Number(localStorage.getItem(LAST_ORG_KEY))
      return Number.isInteger(value) && value > 0 ? value : null
    } catch {
      return null
    }
  },
  set(orgId) {
    try {
      localStorage.setItem(LAST_ORG_KEY, String(orgId))
    } catch {
      // Storage unavailable (private mode); remembering is only a convenience.
    }
  },
}

// The org the user is acting in. The URL (/org/:orgId) is the source of truth;
// OrgLayout copies it here. Side effects (X-Org-ID header, cache clearing) live
// in app/listeners.js.
const orgSlice = createSlice({
  name: 'org',
  initialState: { currentOrgId: null },
  reducers: {
    currentOrgChanged(state, action) {
      state.currentOrgId = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout.fulfilled, (state) => {
      state.currentOrgId = null
    })
  },
})

export const { currentOrgChanged } = orgSlice.actions
export const selectCurrentOrgId = (state) => state.org.currentOrgId
export default orgSlice.reducer
