import Avatar from '../../components/Avatar'
import { statusLabel } from './constants'
import DueDate from './DueDate'
import PriorityBadge from './PriorityBadge'

export default function TaskRow({ task }) {
  return (
    <tr>
      <td>
        <span className="task-title">{task.title}</span>
        {task.labels.length > 0 && (
          <div className="labels">
            {task.labels.map((label) => (
              <span key={label} className="label">
                {label}
              </span>
            ))}
          </div>
        )}
      </td>
      <td>
        <span className={`status status-${task.status}`}>{statusLabel(task.status)}</span>
      </td>
      <td>
        <PriorityBadge priority={task.priority} />
      </td>
      <td>
        {task.assignee ? (
          <span className="assignee">
            <Avatar user={task.assignee} size={22} />
            {task.assignee.full_name || task.assignee.email}
          </span>
        ) : (
          <span className="muted">Unassigned</span>
        )}
      </td>
      <td>{task.due_date ? <DueDate task={task} /> : <span className="muted">—</span>}</td>
    </tr>
  )
}
