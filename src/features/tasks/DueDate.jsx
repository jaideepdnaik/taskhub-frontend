import { formatPlainDate } from '../../utils/time'

export default function DueDate({ task }) {
  if (!task.due_date) return null
  return (
    <span className={`due${task.is_overdue ? ' overdue' : ''}`} title="Due date">
      {task.is_overdue ? 'Overdue · ' : 'Due '}
      {formatPlainDate(task.due_date)}
    </span>
  )
}
