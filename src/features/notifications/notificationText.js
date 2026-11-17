import { formatPlainDate } from '../../utils/time'

// Text and link for a notification, from the payload the backend builds
// (apps/notifications/services.py: task_payload):
//   {task_id, task_title, project_id, project_name, actor: {id, email} | null}
//   + {comment_id, excerpt} for comment_added, {due_date} for task_due_soon

export function describeNotification({ type, payload }) {
  const actor = payload.actor?.email ?? 'Someone'
  const title = `“${payload.task_title}”`
  switch (type) {
    case 'task_assigned':
      return { text: `${actor} assigned you ${title}` }
    case 'comment_added':
      return { text: `${actor} commented on ${title}`, detail: payload.excerpt }
    case 'task_due_soon':
      return {
        text: payload.due_date
          ? `${title} is due ${formatPlainDate(payload.due_date, { weekday: 'short', month: 'short', day: 'numeric' })}`
          : `${title} is due soon`,
      }
    default:
      return { text: `Update on ${title}` }
  }
}

// Opens the task's drawer on its project's board, in the notification's org.
export const notificationLink = ({ organization, payload }) =>
  `/org/${organization.id}/projects/${payload.project_id}/board?task=${payload.task_id}`
