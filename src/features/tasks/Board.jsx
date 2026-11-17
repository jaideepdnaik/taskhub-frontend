import { parseApiError } from '../../api/errors'
import ErrorState from '../../components/ErrorState'
import KanbanBoard from './KanbanBoard'
import { useBoardTasks, useMoveTask } from './queries'

// Loads the project's tasks and wires moves to the optimistic mutation.
// The board is never filtered: positions only make sense over whole columns.
export default function Board({ project, editable }) {
  const { data: tasks, isPending, isError, error, refetch } = useBoardTasks(project.id)
  const moveTask = useMoveTask(project.id)

  if (isPending) return <p className="muted">Loading tasks…</p>
  if (isError) return <ErrorState title="Couldn't load tasks." error={error} onRetry={refetch} />

  return (
    <>
      {moveTask.isError && (
        <p className="notice error-notice" role="alert">
          Couldn't move the task, so it was put back. {parseApiError(moveTask.error).message}
        </p>
      )}
      <KanbanBoard
        tasks={tasks}
        editable={editable}
        projectId={project.id}
        onMove={(move) => moveTask.mutate(move)}
      />
    </>
  )
}
