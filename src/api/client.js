import axios from 'axios'
import { tokenStorage } from '../features/auth/tokenStorage'

const baseURL = import.meta.env.VITE_API_URL ?? '/api'

// Arrays are sent as repeated params (status=a&status=b), which is what
// django-filter expects, not axios's default status[]=a.
export const api = axios.create({ baseURL, paramsSerializer: { indexes: null } })

// The current org, mirrored here from Redux (see app/listeners.js) so this
// module doesn't import the store, which would create an import cycle.
let currentOrgId = null
export function setApiOrgId(orgId) {
  currentOrgId = orgId
}

// Attach the access token and the current org to every request.
api.interceptors.request.use((config) => {
  const access = tokenStorage.getAccess()
  if (access) config.headers.Authorization = `Bearer ${access}`
  if (currentOrgId != null) config.headers['X-Org-ID'] = String(currentOrgId)
  return config
})

// On 401, try one refresh, then replay the original request.
let refreshPromise = null

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    const refresh = tokenStorage.getRefresh()
    if (error.response?.status !== 401 || original._retry || !refresh) {
      return Promise.reject(error)
    }
    original._retry = true
    try {
      refreshPromise ??= axios
        .post(`${baseURL}/auth/refresh/`, { refresh })
        .finally(() => {
          refreshPromise = null
        })
      const { data } = await refreshPromise
      tokenStorage.set(data.access, data.refresh ?? refresh)
      original.headers.Authorization = `Bearer ${data.access}`
      return api(original)
    } catch (refreshError) {
      tokenStorage.clear()
      window.location.assign('/login')
      return Promise.reject(refreshError)
    }
  },
)
