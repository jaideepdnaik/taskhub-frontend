import Avatar from '../../components/Avatar'
import DueDate from './DueDate'
import PriorityBadge from './PriorityBadge'

// A board card. Presentational only; dragging is handled by SortableTaskCard.
export default function TaskCard({ task, overlay = false }) {
  return (
    <div className={`task-card${overlay ? ' overlay' : ''}`}>
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
      <div className="task-meta">
        <PriorityBadge priority={task.priority} />
        <DueDate task={task} />
        {task.comment_count > 0 && (
          <span className="muted small" title="Comments">
            💬 {task.comment_count}
          </span>
        )}
        {task.assignee && (
          <span className="task-assignee" title={task.assignee.full_name || task.assignee.email}>
            <Avatar user={task.assignee} size={22} />
          </span>
        )}
      </div>
    </div>
  )
}
