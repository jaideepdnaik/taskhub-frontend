import { api } from '../../api/client'

// The backend's StandardPagination allows ?page_size= up to 100.
const BOARD_PAGE_SIZE = 100
// Safety cap for fetchAllProjectTasks: 20 pages x 100 = 2000 tasks.
const MAX_PAGES = 20

// GET /projects/:id/tasks/ with filters -> {count, next, previous, results}.
// filters: {page, search, status[], priority[], assignee, label, overdue, ordering}
export const fetchProjectTasks = (projectId, { search, ...filters } = {}) =>
  api
    .get(`/projects/${projectId}/tasks/`, {
      params: { ...filters, search: search || undefined },
    })
    .then((res) => res.data)

// Every task in a project, for the board: one request for up to 100 tasks,
// then further pages until `next` is null. Ordered by status, then position.
export async function fetchAllProjectTasks(projectId) {
  const tasks = []
  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const data = await fetchProjectTasks(projectId, { page, page_size: BOARD_PAGE_SIZE })
    tasks.push(...data.results)
    if (!data.next) break
  }
  return tasks
}

// POST /projects/:id/tasks/ {title, status?, ...} -> task (added at the bottom of its column)
export const createTask = (projectId, payload) =>
  api.post(`/projects/${projectId}/tasks/`, payload).then((res) => res.data)

// PATCH /tasks/:id/move/ {status, position} -> task. `position` is the 0-based
// slot in the target column; the server renumbers the other cards.
export const moveTask = (taskId, { status, position }) =>
  api.patch(`/tasks/${taskId}/move/`, { status, position }).then((res) => res.data)

// GET /tasks/:id/ -> task
export const fetchTask = (taskId) => api.get(`/tasks/${taskId}/`).then((res) => res.data)

// PATCH /tasks/:id/ {title?, description?, status?, priority?, assignee_id?, due_date?, labels?}
// -> task. A status change here puts the card at the bottom of its new column.
export const updateTask = (taskId, payload) =>
  api.patch(`/tasks/${taskId}/`, payload).then((res) => res.data)

// DELETE /tasks/:id/. Admins, or the task's reporter.
export const deleteTask = (taskId) => api.delete(`/tasks/${taskId}/`)

// GET /tasks/:id/comments/ -> paginated, oldest first
export const fetchComments = (taskId, page) =>
  api.get(`/tasks/${taskId}/comments/`, { params: { page } }).then((res) => res.data)

// POST /tasks/:id/comments/ {body} -> comment
export const addComment = (taskId, body) =>
  api.post(`/tasks/${taskId}/comments/`, { body }).then((res) => res.data)

// PATCH /tasks/:id/comments/:commentId/ {body} -> comment. Author only.
export const editComment = (taskId, commentId, body) =>
  api.patch(`/tasks/${taskId}/comments/${commentId}/`, { body }).then((res) => res.data)

// DELETE /tasks/:id/comments/:commentId/. Author or org admin.
export const deleteComment = (taskId, commentId) =>
  api.delete(`/tasks/${taskId}/comments/${commentId}/`)

// GET /tasks/:id/activity/ -> paginated, newest first
export const fetchActivity = (taskId, page) =>
  api.get(`/tasks/${taskId}/activity/`, { params: { page } }).then((res) => res.data)

// GET /tasks/?assignee=me&... -> paginated tasks across every visible project
export const fetchMyTasks = ({ search, ...filters } = {}) =>
  api
    .get('/tasks/', { params: { ...filters, assignee: 'me', search: search || undefined } })
    .then((res) => res.data)
