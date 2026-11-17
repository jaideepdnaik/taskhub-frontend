import { createSlice } from '@reduxjs/toolkit'

// Client-only UI state. The sidebar is always visible on wide screens;
// `sidebarOpen` only matters for the slide-in sidebar on narrow ones.
const uiSlice = createSlice({
  name: 'ui',
  initialState: { sidebarOpen: false },
  reducers: {
    sidebarToggled(state) {
      state.sidebarOpen = !state.sidebarOpen
    },
    sidebarClosed(state) {
      state.sidebarOpen = false
    },
  },
})

export const { sidebarToggled, sidebarClosed } = uiSlice.actions
export const selectSidebarOpen = (state) => state.ui.sidebarOpen
export default uiSlice.reducer
