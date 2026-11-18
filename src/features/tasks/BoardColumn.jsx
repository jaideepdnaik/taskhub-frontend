import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import QuickAddTask from './QuickAddTask'
import SortableTaskCard from './SortableTaskCard'
import { columnDroppableId } from './useBoardDnd'

export default function BoardColumn({ status, label, tasks, editable, projectId }) {
  // The column itself is a drop target so cards can land in an empty column.
  const { setNodeRef, isOver } = useDroppable({ id: columnDroppableId(status) })

  return (
    <section className={`board-column column-${status}${isOver ? ' over' : ''}`} aria-label={label}>
      <header className="board-column-header">
        <h2>
          <span className="column-dot" aria-hidden="true" />
          {label}
        </h2>
        <span className="count">{tasks.length}</span>
      </header>
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <ul ref={setNodeRef} className="board-cards">
          {tasks.map((task) => (
            <SortableTaskCard key={task.id} task={task} disabled={!editable} />
          ))}
          {tasks.length === 0 && <li className="column-empty">No tasks</li>}
        </ul>
      </SortableContext>
      {editable && <QuickAddTask projectId={projectId} status={status} />}
    </section>
  )
}
