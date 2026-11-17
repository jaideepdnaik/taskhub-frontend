import { api } from '../../api/client'

// POST /auth/register/ -> {user, access, refresh}
export const register = (payload) => api.post('/auth/register/', payload).then((res) => res.data)

// GET /auth/me/ -> profile plus `organizations: [{id, name, slug, role}]`. No X-Org-ID needed.
export const fetchMe = () => api.get('/auth/me/').then((res) => res.data)
