import { api } from '../../api/client'

// All endpoints are scoped to the current org by the X-Org-ID header.

// GET /projects/ -> {count, next, previous, results}. Archived projects are
// hidden unless `is_archived` is sent, so always send it explicitly.
export const fetchProjects = ({ page, search, archived }) =>
  api
    .get('/projects/', {
      params: {
        page,
        search: search || undefined,
        is_archived: archived ? 'true' : 'false',
      },
    })
    .then((res) => res.data)

// GET /projects/:id/ -> detail, including `members`
export const fetchProject = (id) => api.get(`/projects/${id}/`).then((res) => res.data)

// POST /projects/ {name, description} -> detail. Owner/admin only.
export const createProject = (payload) => api.post('/projects/', payload).then((res) => res.data)

// PATCH /projects/:id/ {name?, description?} -> detail. Fails if archived.
export const updateProject = (id, payload) =>
  api.patch(`/projects/${id}/`, payload).then((res) => res.data)

// POST /projects/:id/archive/ or /unarchive/ -> detail
export const setProjectArchived = (id, archived) =>
  api.post(`/projects/${id}/${archived ? 'archive' : 'unarchive'}/`).then((res) => res.data)

export const deleteProject = (id) => api.delete(`/projects/${id}/`)

// POST /projects/:id/members/ {user_id} -> updated member list
export const addProjectMember = (id, userId) =>
  api.post(`/projects/${id}/members/`, { user_id: userId }).then((res) => res.data)

export const removeProjectMember = (id, userId) =>
  api.delete(`/projects/${id}/members/${userId}/`)
