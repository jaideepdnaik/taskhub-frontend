import { useState } from 'react'
import { parseApiError } from '../../api/errors'
import { useCreateTask } from './queries'

// "+ Add task" at the bottom of a column. Title only; details come later in the
// task drawer. Stays open after adding so several tasks can be typed in a row.
export default function QuickAddTask({ projectId, status }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const createTask = useCreateTask(projectId)

  const close = () => {
    setOpen(false)
    setTitle('')
    createTask.reset()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    createTask.mutate({ title, status }, { onSuccess: () => setTitle('') })
  }

  if (!open) {
    return (
      <button className="add-task" onClick={() => setOpen(true)}>
        + Add task
      </button>
    )
  }

  return (
    <form className="quick-add" onSubmit={handleSubmit}>
      <input
        autoFocus
        maxLength={200}
        placeholder="Task title"
        aria-label="New task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === 'Escape' && close()}
        disabled={createTask.isPending}
      />
      {createTask.isError && (
        <p className="error small">
          {parseApiError(createTask.error).fields.title?.[0] ??
            parseApiError(createTask.error).message}
        </p>
      )}
      <div className="actions">
        <button type="submit" disabled={createTask.isPending || !title.trim()}>
          Add
        </button>
        <button type="button" className="secondary" onClick={close}>
          Cancel
        </button>
      </div>
    </form>
  )
}
