import { Link } from 'react-router-dom'
import { useCurrentOrgId } from '../orgs/queries'
import { statusLabel } from './constants'
import DueDate from './DueDate'
import PriorityBadge from './PriorityBadge'

// A row on My Tasks. The title opens the task's drawer on its project's board.
export default function MyTaskRow({ task }) {
  const orgId = useCurrentOrgId()
  const boardUrl = `/org/${orgId}/projects/${task.project.id}/board`

  return (
    <tr>
      <td>
        <Link className="task-title" to={`${boardUrl}?task=${task.id}`}>
          {task.title}
        </Link>
      </td>
      <td>
        <Link className="muted" to={boardUrl}>
          {task.project.name}
        </Link>
      </td>
      <td>
        <span className={`status status-${task.status}`}>{statusLabel(task.status)}</span>
      </td>
      <td>
        <PriorityBadge priority={task.priority} />
      </td>
      <td>{task.due_date ? <DueDate task={task} /> : <span className="muted">—</span>}</td>
    </tr>
  )
}
