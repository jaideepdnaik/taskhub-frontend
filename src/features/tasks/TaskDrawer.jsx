import { useEffect, useRef } from 'react'
import TaskDrawerContent from './TaskDrawerContent'
import { useTaskDrawer } from './useTaskDrawer'

// Side panel for the task in ?task=<id>. Escape or a click on the backdrop closes it.
export default function TaskDrawer({ project, editable }) {
  const { taskId, closeTask } = useTaskDrawer()
  const panelRef = useRef(null)

  useEffect(() => {
    if (taskId == null) return undefined
    panelRef.current?.focus()
    const handleKey = (e) => {
      // A confirm dialog opened from the drawer handles its own Escape.
      if (e.key === 'Escape' && !document.querySelector('dialog[open]')) closeTask()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [taskId, closeTask])

  if (taskId == null) return null

  return (
    <>
      <div className="drawer-backdrop" onClick={closeTask} />
      <aside
        ref={panelRef}
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-drawer-title"
        tabIndex={-1}
      >
        <TaskDrawerContent
          key={taskId}
          taskId={taskId}
          project={project}
          editable={editable}
          onClose={closeTask}
        />
      </aside>
    </>
  )
}
