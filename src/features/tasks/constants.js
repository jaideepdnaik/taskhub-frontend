// Mirrors TaskStatus / TaskPriority in the backend (apps/tasks/models.py).
// STATUSES is also the board's column order.
export const STATUSES = [
  { value: 'todo', label: 'To do' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'review', label: 'Review' },
  { value: 'done', label: 'Done' },
]

export const PRIORITIES = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
]

export const statusLabel = (value) => STATUSES.find((s) => s.value === value)?.label ?? value
export const priorityLabel = (value) => PRIORITIES.find((p) => p.value === value)?.label ?? value
