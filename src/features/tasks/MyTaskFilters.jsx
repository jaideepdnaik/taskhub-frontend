import { useEffect, useState } from 'react'
import { useDebouncedValue } from '../../hooks/useDebouncedValue'
import { PRIORITIES, STATUSES } from './constants'

// Status '' means open tasks (OPEN_STATUSES); 'any' includes done tasks.

const ORDERINGS = [
  { value: '', label: 'Status' },
  { value: 'due_date', label: 'Due date' },
  { value: '-priority_rank', label: 'Priority (highest first)' },
  { value: '-updated_at', label: 'Recently updated' },
]

export default function MyTaskFilters({ filters, onChange, onClear, isFiltered }) {
  const [search, setSearch] = useState(filters.search)
  const debouncedSearch = useDebouncedValue(search)

  useEffect(() => {
    if (debouncedSearch.trim() !== filters.search) onChange({ search: debouncedSearch })
  }, [debouncedSearch, filters.search, onChange])

  return (
    <div className="toolbar">
      <input
        type="search"
        className="search-input"
        placeholder="Search my tasks…"
        aria-label="Search my tasks"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select
        aria-label="Status"
        value={filters.status}
        onChange={(e) => onChange({ status: e.target.value })}
      >
        <option value="">Open tasks</option>
        <option value="any">Any status</option>
        {STATUSES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      <select
        aria-label="Priority"
        value={filters.priority}
        onChange={(e) => onChange({ priority: e.target.value })}
      >
        <option value="">Any priority</option>
        {PRIORITIES.map((p) => (
          <option key={p.value} value={p.value}>
            {p.label}
          </option>
        ))}
      </select>
      <label className="checkbox">
        <input
          type="checkbox"
          checked={filters.overdue === 'true'}
          onChange={(e) => onChange({ overdue: e.target.checked ? 'true' : '' })}
        />
        Overdue only
      </label>
      <select
        aria-label="Sort by"
        value={filters.ordering}
        onChange={(e) => onChange({ ordering: e.target.value })}
      >
        {ORDERINGS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {isFiltered && (
        <button
          className="secondary"
          onClick={() => {
            setSearch('')
            onClear()
          }}
        >
          Clear filters
        </button>
      )}
    </div>
  )
}
