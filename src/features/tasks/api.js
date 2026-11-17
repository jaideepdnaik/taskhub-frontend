import { api } from '../../api/client'

// Safety cap for fetchAllProjectTasks: 50 pages x 20 = 1000 tasks.
const MAX_PAGES = 50

// GET /projects/:id/tasks/ with filters -> {count, next, previous, results}.
// filters: {page, search, status[], priority[], assignee, label, overdue, ordering}
export const fetchProjectTasks = (projectId, { search, ...filters } = {}) =>
  api
    .get(`/projects/${projectId}/tasks/`, {
      params: { ...filters, search: search || undefined },
    })
    .then((res) => res.data)

// Every task in a project, for the board. The endpoint is paginated (20 per
// page, no page_size override), so walk the pages until `next` is null.
// Results arrive ordered by status, then position.
export async function fetchAllProjectTasks(projectId) {
  const tasks = []
  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const data = await fetchProjectTasks(projectId, { page })
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
