import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

// The open task lives in the URL (?task=<id>), so a task link can be shared and
// the browser's Back button closes the drawer. Other params (view, filters) are kept.
export function useTaskDrawer() {
  const [params, setParams] = useSearchParams()
  const taskId = Number(params.get('task')) || null

  const update = useCallback(
    (id) =>
      setParams((prev) => {
        const next = new URLSearchParams(prev)
        if (id == null) next.delete('task')
        else next.set('task', String(id))
        return next
      }),
    [setParams],
  )

  const openTask = useCallback((id) => update(id), [update])
  const closeTask = useCallback(() => update(null), [update])
  return { taskId, openTask, closeTask }
}
