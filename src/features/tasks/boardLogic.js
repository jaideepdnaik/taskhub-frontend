import { STATUSES } from './constants'

// Pure helpers for the board's shape. Kept free of React so they're easy to test.

// {todo: [task, ...], in_progress: [...], ...}, each column sorted by position.
export function groupByStatus(tasks) {
  const columns = Object.fromEntries(STATUSES.map((s) => [s.value, []]))
  for (const task of tasks) columns[task.status]?.push(task)
  for (const list of Object.values(columns)) list.sort((a, b) => a.position - b.position)
  return columns
}

// The same move the server makes (apps/tasks/services.py: move_task): take the
// task out of its column, insert it at `position` in the target column (clamped
// to the end), then renumber both columns 0..n-1. Returns a new array.
export function applyMove(tasks, taskId, status, position) {
  const task = tasks.find((t) => t.id === taskId)
  if (!task) return tasks

  const columns = groupByStatus(tasks.filter((t) => t.id !== taskId))
  const target = columns[status]
  target.splice(Math.min(position, target.length), 0, { ...task, status })

  const renumbered = new Map()
  for (const [columnStatus, list] of Object.entries(columns)) {
    list.forEach((t, index) => {
      renumbered.set(t.id, { ...t, status: columnStatus, position: index })
    })
  }
  return tasks.map((t) => renumbered.get(t.id) ?? t)
}
