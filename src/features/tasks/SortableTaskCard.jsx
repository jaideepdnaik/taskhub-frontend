import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import TaskCard from './TaskCard'
import { useTaskDrawer } from './useTaskDrawer'

// Click or Enter opens the task; Space picks it up for keyboard dragging
// (see the KeyboardSensor setup in useBoardDnd).
export default function SortableTaskCard({ task, disabled }) {
  const { openTask } = useTaskDrawer()
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    disabled,
  })

  const handleKeyDown = (e) => {
    listeners?.onKeyDown?.(e)
    if (e.key === 'Enter' && !e.defaultPrevented) openTask(task.id)
  }

  return (
    <li
      ref={setNodeRef}
      className={`sortable-card${isDragging ? ' dragging' : ''}${disabled ? '' : ' draggable'}`}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
      // Keep tab focus and a role even when dragging is disabled (viewers).
      tabIndex={0}
      role="button"
      aria-label={`${task.title}. Press Enter to open${disabled ? '' : ', Space to move'}.`}
      onKeyDown={handleKeyDown}
      onClick={() => openTask(task.id)}
    >
      <TaskCard task={task} />
    </li>
  )
}
