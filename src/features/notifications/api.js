import { api } from '../../api/client'

// Notifications belong to the user, across all their orgs (no X-Org-ID needed).
// filters: {organization?, is_read?, page?, page_size?}

// GET /notifications/ -> paginated, newest first
export const fetchNotifications = (filters) =>
  api.get('/notifications/', { params: filters }).then((res) => res.data)

// GET /notifications/unread-count/?organization= -> {count}
export const fetchUnreadCount = (organization) =>
  api
    .get('/notifications/unread-count/', { params: { organization } })
    .then((res) => res.data.count)

// POST /notifications/:id/read/ -> notification
export const markRead = (id) => api.post(`/notifications/${id}/read/`).then((res) => res.data)

// POST /notifications/read-all/?organization= -> {updated}
export const markAllRead = (organization) =>
  api
    .post('/notifications/read-all/', null, { params: { organization } })
    .then((res) => res.data)

export const deleteNotification = (id) => api.delete(`/notifications/${id}/`)
