// `due_date` is a plain date ("2026-11-20"). Parse it as local midnight; new
// Date("2026-11-20") would be UTC and can show the previous day.
function formatDate(value) {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}

export default function DueDate({ task }) {
  if (!task.due_date) return null
  return (
    <span className={`due${task.is_overdue ? ' overdue' : ''}`} title="Due date">
      {task.is_overdue ? 'Overdue · ' : 'Due '}
      {formatDate(task.due_date)}
    </span>
  )
}
