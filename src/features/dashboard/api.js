import { api } from '../../api/client'

// GET /dashboard/ -> {projects, tasks, my_tasks, members, recent_activity}
// Stats cover the current org's active projects the user can see (X-Org-ID).
export const fetchDashboard = () => api.get('/dashboard/').then((res) => res.data)
