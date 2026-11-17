import { formatPlainDate } from '../../utils/time'
import { priorityLabel, statusLabel } from './constants'

// Sentences for an ActivityLog entry, following the shapes the backend writes
// (apps/tasks/services.py: snapshot/diff):
//   created   {title}
//   updated   {field: {from, to}}  (assignee values are {id, email} or null)
//   moved     {status?: {from, to}, position?: {from, to}}
//   commented {comment_id}

const userText = (user) => (user ? user.email : 'nobody')
const dateText = (value) =>
  value ? formatPlainDate(value, { year: 'numeric', month: 'short', day: 'numeric' }) : null

function describeChange(field, { from, to }) {
  switch (field) {
    case 'title':
      return `renamed the task to “${to}”`
    case 'description':
      return to ? 'updated the description' : 'removed the description'
    case 'status':
      return `changed the status from ${statusLabel(from)} to ${statusLabel(to)}`
    case 'priority':
      return `changed the priority from ${priorityLabel(from)} to ${priorityLabel(to)}`
    case 'assignee':
      return to ? `assigned it to ${userText(to)}` : `unassigned ${userText(from)}`
    case 'due_date':
      return to ? `set the due date to ${dateText(to)}` : 'removed the due date'
    case 'labels':
      return to?.length ? `set the labels to ${to.join(', ')}` : 'removed all labels'
    default:
      return `changed ${field}`
  }
}

export function describeActivity({ action, changes }) {
  switch (action) {
    case 'created':
      return ['created this task']
    case 'commented':
      return ['commented']
    case 'moved':
      return changes.status
        ? [`moved it from ${statusLabel(changes.status.from)} to ${statusLabel(changes.status.to)}`]
        : ['reordered it within its column']
    case 'updated': {
      const lines = Object.entries(changes).map(([field, change]) => describeChange(field, change))
      return lines.length ? lines : ['updated the task']
    }
    default:
      return [action]
  }
}
