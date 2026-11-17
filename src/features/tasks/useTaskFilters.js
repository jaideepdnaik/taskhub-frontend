import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

// URL param <-> filter name. Values are kept as strings; '' means "any".
const PARAMS = {
  search: 'q',
  status: 'status',
  priority: 'priority',
  assignee: 'assignee', // user id, "me" or "none"
  overdue: 'overdue', // "true" or ''
  ordering: 'sort',
}

export const DEFAULT_ORDERING = '' // the backend's default: status, then board position

// The list view's filters, kept in the URL next to ?view=list.
export function useTaskFilters() {
  const [params, setParams] = useSearchParams()

  const filters = Object.fromEntries(
    Object.entries(PARAMS).map(([name, param]) => [name, params.get(param) ?? '']),
  )
  filters.page = Math.max(1, Number(params.get('page')) || 1)

  // Any change other than the page itself goes back to page 1.
  const setFilters = useCallback(
    (changes) =>
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          for (const [name, value] of Object.entries(changes)) {
            if (!(name in PARAMS)) continue
            const text = String(value ?? '').trim()
            if (text) next.set(PARAMS[name], text)
            else next.delete(PARAMS[name])
          }
          if ('page' in changes && changes.page > 1) next.set('page', String(changes.page))
          else next.delete('page')
          return next
        },
        { replace: true },
      ),
    [setParams],
  )

  const clearFilters = useCallback(
    () => setFilters(Object.fromEntries(Object.keys(PARAMS).map((name) => [name, '']))),
    [setFilters],
  )

  const isFiltered = Object.keys(PARAMS).some((name) => name !== 'ordering' && filters[name])
  return { filters, setFilters, clearFilters, isFiltered }
}

// The filters as API query params (empty values dropped).
export function toApiParams({ search, status, priority, assignee, overdue, ordering, page }) {
  const params = { page, search }
  if (status) params.status = status
  if (priority) params.priority = priority
  if (assignee) params.assignee = assignee
  if (overdue) params.overdue = 'true'
  if (ordering) params.ordering = ordering
  return params
}
