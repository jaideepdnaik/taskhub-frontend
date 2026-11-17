// Converting between a task (API read shape) and the drawer's form state.

export function formFromTask(task) {
  return {
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    assignee_id: task.assignee ? String(task.assignee.id) : '',
    due_date: task.due_date ?? '',
    labels: task.labels,
  }
}

const sameLabels = (a, b) => a.length === b.length && a.every((label, i) => label === b[i])

// Only the fields that changed, in the write shape (TaskWriteSerializer).
// Sending only changes keeps the activity log accurate.
export function changedFields(task, form) {
  const original = formFromTask(task)
  const changes = {}
  for (const key of ['title', 'description', 'status', 'priority']) {
    if (form[key] !== original[key]) changes[key] = form[key]
  }
  if (form.assignee_id !== original.assignee_id) {
    changes.assignee_id = form.assignee_id ? Number(form.assignee_id) : null
  }
  if (form.due_date !== original.due_date) changes.due_date = form.due_date || null
  if (!sameLabels(form.labels, original.labels)) changes.labels = form.labels
  return changes
}
