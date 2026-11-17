import { useState } from 'react'
import ErrorState from '../../components/ErrorState'
import { formatDateTime, formatRelative } from '../../utils/time'
import { useMe } from '../auth/queries'
import { usePermissions } from '../orgs/usePermissions'
import ActivityLog from './ActivityLog'
import CommentList from './CommentList'
import { useTask } from './queries'
import TaskDeleteButton from './TaskDeleteButton'
import TaskDetailsForm from './TaskDetailsForm'

// `editable`: the user can edit tasks here (not a viewer, project not archived).
export default function TaskDrawerContent({ taskId, project, editable, onClose }) {
  const [tab, setTab] = useState('comments')
  const { data: me } = useMe()
  const { isAdmin } = usePermissions()
  const { data: task, isPending, isError, error, refetch } = useTask(taskId)

  const header = (title, actions) => (
    <header className="drawer-header">
      <h2 id="task-drawer-title">{title}</h2>
      <div className="actions">
        {actions}
        <button className="icon-button" aria-label="Close task" onClick={onClose}>
          ✕
        </button>
      </div>
    </header>
  )

  if (isPending) return <>{header('Loading task…')}</>
  if (isError) {
    return (
      <>
        {header('Task')}
        {error.response?.status === 404 ? (
          <p className="muted">This task doesn't exist, or you can't see it.</p>
        ) : (
          <ErrorState title="Couldn't load the task." error={error} onRetry={refetch} />
        )}
      </>
    )
  }

  // A ?task= link can point at another project's task; show it read-only here,
  // since the assignee choices come from this project's members.
  const sameProject = task.project.id === project.id
  const canEdit = editable && sameProject
  const canDelete = canEdit && (isAdmin || task.reporter?.id === me?.id)

  return (
    <>
      {header(
        <span className="muted small">
          {sameProject ? `#${task.id}` : `${task.project.name} · #${task.id} (read-only here)`}
        </span>,
        canDelete && <TaskDeleteButton task={task} onDeleted={onClose} />,
      )}
      <div className="drawer-body">
        <TaskDetailsForm
          key={`${task.id}:${task.updated_at}`}
          task={task}
          members={project.members}
          editable={canEdit}
        />
        <p className="muted small">
          {task.reporter && `Reported by ${task.reporter.full_name || task.reporter.email} · `}
          <span title={formatDateTime(task.created_at)}>created {formatRelative(task.created_at)}</span>
          {' · '}
          <span title={formatDateTime(task.updated_at)}>updated {formatRelative(task.updated_at)}</span>
        </p>

        <div className="tabs" role="tablist">
          <button
            role="tab"
            aria-selected={tab === 'comments'}
            className={tab === 'comments' ? 'selected' : ''}
            onClick={() => setTab('comments')}
          >
            Comments{task.comment_count > 0 && ` (${task.comment_count})`}
          </button>
          <button
            role="tab"
            aria-selected={tab === 'activity'}
            className={tab === 'activity' ? 'selected' : ''}
            onClick={() => setTab('activity')}
          >
            Activity
          </button>
        </div>
        <div role="tabpanel">
          {tab === 'comments' ? (
            <CommentList task={task} editable={canEdit} />
          ) : (
            <ActivityLog taskId={task.id} />
          )}
        </div>
      </div>
    </>
  )
}
