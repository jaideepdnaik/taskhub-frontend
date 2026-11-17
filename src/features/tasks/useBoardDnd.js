import {
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { useMemo, useState } from 'react'
import { groupByStatus } from './boardLogic'

const COLUMN_PREFIX = 'column:'
export const columnDroppableId = (status) => `${COLUMN_PREFIX}${status}`

// Which column holds `id`? `id` is a task id (number) or a column's droppable id.
function findColumn(ids, id) {
  if (typeof id === 'string' && id.startsWith(COLUMN_PREFIX)) return id.slice(COLUMN_PREFIX.length)
  return Object.keys(ids).find((status) => ids[status].includes(id))
}

// Drag-and-drop state for the board.
// While dragging, `drag.ids` ({status: [taskId, ...]}) is a local arrangement so
// cards can hop between columns as you hover. After the drop it stays on screen
// until `tasks` changes (the optimistic cache update), which avoids a flicker.
export function useBoardDnd(tasks, onMove) {
  const columns = useMemo(() => groupByStatus(tasks), [tasks])
  const baseIds = useMemo(
    () => Object.fromEntries(Object.entries(columns).map(([s, list]) => [s, list.map((t) => t.id)])),
    [columns],
  )
  const tasksById = useMemo(() => new Map(tasks.map((t) => [t.id, t])), [tasks])
  const [activeId, setActiveId] = useState(null)
  const [drag, setDrag] = useState(null) // {ids, base: tasks it was built from}

  const sensors = useSensors(
    // A small distance so a click on a card isn't treated as a drag.
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    // Space picks up and drops; Enter is left free to open the task.
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
      keyboardCodes: { start: ['Space'], cancel: ['Escape'], end: ['Space'] },
    }),
  )

  const ids = drag && (activeId != null || drag.base === tasks) ? drag.ids : baseIds

  const onDragStart = ({ active }) => {
    setActiveId(active.id)
    setDrag({ ids: baseIds, base: tasks })
  }

  // Moving over another column: move the card into it, at the hovered card's slot.
  const onDragOver = ({ active, over }) => {
    if (!over) return
    setDrag((prev) => {
      const from = findColumn(prev.ids, active.id)
      const to = findColumn(prev.ids, over.id)
      if (!from || !to || from === to) return prev
      const target = [...prev.ids[to]]
      const overIndex = target.indexOf(over.id)
      target.splice(overIndex >= 0 ? overIndex : target.length, 0, active.id)
      return {
        ...prev,
        ids: { ...prev.ids, [from]: prev.ids[from].filter((id) => id !== active.id), [to]: target },
      }
    })
  }

  const onDragEnd = ({ active, over }) => {
    setActiveId(null)
    if (!over || !drag) {
      setDrag(null)
      return
    }
    const status = findColumn(drag.ids, active.id)
    let column = drag.ids[status]
    // Reordering within the column the card is now in.
    if (findColumn(drag.ids, over.id) === status && over.id !== active.id && typeof over.id === 'number') {
      column = arrayMove(column, column.indexOf(active.id), column.indexOf(over.id))
    }
    const position = column.indexOf(active.id)
    setDrag({ ids: { ...drag.ids, [status]: column }, base: tasks })

    // Compare against the card's index, not its stored position: positions can
    // have gaps after deletes, indexes can't.
    const task = tasksById.get(active.id)
    const originalIndex = columns[task.status].findIndex((t) => t.id === task.id)
    if (task.status !== status || originalIndex !== position) {
      onMove({ taskId: task.id, status, position })
    }
  }

  const onDragCancel = () => {
    setActiveId(null)
    setDrag(null)
  }

  return {
    ids,
    tasksById,
    activeTask: activeId != null ? tasksById.get(activeId) : null,
    dndProps: {
      sensors,
      collisionDetection: closestCorners,
      onDragStart,
      onDragOver,
      onDragEnd,
      onDragCancel,
    },
  }
}
