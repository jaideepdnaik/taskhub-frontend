import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import TaskCard from './TaskCard'

export default function SortableTaskCard({ task, disabled }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    disabled,
  })

  return (
    <li
      ref={setNodeRef}
      className={`sortable-card${isDragging ? ' dragging' : ''}${disabled ? '' : ' draggable'}`}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      aria-label={task.title}
      {...attributes}
      {...listeners}
    >
      <TaskCard task={task} />
    </li>
  )
}
