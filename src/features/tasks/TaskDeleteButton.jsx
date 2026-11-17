import { useState } from 'react'
import { parseApiError } from '../../api/errors'
import ConfirmDialog from '../../components/ConfirmDialog'
import { useDeleteTask } from './queries'

export default function TaskDeleteButton({ task, onDeleted }) {
  const [confirming, setConfirming] = useState(false)
  const deleteTask = useDeleteTask(task.id, task.project.id, { onDeleted })

  return (
    <>
      <button
        className="danger"
        onClick={() => {
          deleteTask.reset()
          setConfirming(true)
        }}
      >
        Delete
      </button>
      <ConfirmDialog
        open={confirming}
        title="Delete task?"
        message={`“${task.title}”, its comments and its history will be permanently deleted. This can't be undone.`}
        confirmLabel="Delete task"
        danger
        pending={deleteTask.isPending}
        error={deleteTask.isError ? parseApiError(deleteTask.error).message : null}
        onConfirm={() => deleteTask.mutate()}
        onClose={() => setConfirming(false)}
      />
    </>
  )
}
