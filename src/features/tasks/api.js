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
