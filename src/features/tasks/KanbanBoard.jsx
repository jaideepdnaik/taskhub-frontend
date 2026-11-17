import { DndContext, DragOverlay } from '@dnd-kit/core'
import BoardColumn from './BoardColumn'
import { STATUSES } from './constants'
import TaskCard from './TaskCard'
import { useBoardDnd } from './useBoardDnd'

// The columns and drag-and-drop. `tasks` is the project's full task list.
export default function KanbanBoard({ tasks, editable, projectId, onMove }) {
  const { ids, tasksById, activeTask, dndProps } = useBoardDnd(tasks, onMove)

  return (
    <DndContext {...dndProps}>
      <div className="board">
        {STATUSES.map(({ value, label }) => (
          <BoardColumn
            key={value}
            status={value}
            label={label}
            tasks={ids[value].map((id) => tasksById.get(id))}
            editable={editable}
            projectId={projectId}
          />
        ))}
      </div>
      <DragOverlay>{activeTask && <TaskCard task={activeTask} overlay />}</DragOverlay>
    </DndContext>
  )
}
