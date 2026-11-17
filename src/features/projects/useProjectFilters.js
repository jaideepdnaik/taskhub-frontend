import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

// The projects list's filters live in the URL (?q=&archived=1&page=), so they
// survive reloads, can be shared and work with the back button.
export function useProjectFilters() {
  const [params, setParams] = useSearchParams()

  const filters = {
    search: params.get('q') ?? '',
    archived: params.get('archived') === '1',
    page: Math.max(1, Number(params.get('page')) || 1),
  }

  // Any change other than the page itself goes back to page 1.
  const setFilters = useCallback(
    (changes) =>
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          const set = (key, value) => (value ? next.set(key, value) : next.delete(key))
          if ('search' in changes) set('q', changes.search.trim())
          if ('archived' in changes) set('archived', changes.archived ? '1' : '')
          set('page', 'page' in changes && changes.page > 1 ? String(changes.page) : '')
          return next
        },
        { replace: true },
      ),
    [setParams],
  )

  return [filters, setFilters]
}
