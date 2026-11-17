import { useEffect } from 'react'

// Call `onDismiss` on Escape or on a click outside `ref`, while `active`.
// Used by dropdowns and popovers.
export function useDismiss(ref, active, onDismiss) {
  useEffect(() => {
    if (!active) return undefined

    const handlePointer = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onDismiss()
    }
    const handleKey = (e) => {
      if (e.key === 'Escape') onDismiss()
    }
    document.addEventListener('mousedown', handlePointer)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handlePointer)
      document.removeEventListener('keydown', handleKey)
    }
  }, [ref, active, onDismiss])
}
