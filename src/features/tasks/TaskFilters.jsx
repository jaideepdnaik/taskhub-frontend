import { useEffect, useState } from 'react'
import { useDebouncedValue } from '../../hooks/useDebouncedValue'
import { PRIORITIES, STATUSES } from './constants'

const ORDERINGS = [
  { value: '', label: 'Board order' },
  { value: 'due_date', label: 'Due date' },
  { value: '-priority_rank', label: 'Priority (highest first)' },
  { value: '-updated_at', label: 'Recently updated' },
  { value: 'title', label: 'Title' },
]

// `members`: the project's members, for the assignee filter.
export default function TaskFilters({ filters, onChange, onClear, isFiltered, members }) {
  const [search, setSearch] = useState(filters.search)
  const debouncedSearch = useDebouncedValue(search)

  useEffect(() => {
    if (debouncedSearch.trim() !== filters.search) onChange({ search: debouncedSearch })
  }, [debouncedSearch, filters.search, onChange])

  const select = (name, label, options) => (
    <select
      aria-label={label}
      value={filters[name]}
      onChange={(e) => onChange({ [name]: e.target.value })}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )

  return (
    <div className="toolbar">
      <input
        type="search"
        className="search-input"
        placeholder="Search tasks…"
        aria-label="Search tasks"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {select('status', 'Status', [{ value: '', label: 'Any status' }, ...STATUSES])}
      {select('priority', 'Priority', [{ value: '', label: 'Any priority' }, ...PRIORITIES])}
      {select('assignee', 'Assignee', [
        { value: '', label: 'Anyone' },
        { value: 'me', label: 'Assigned to me' },
        { value: 'none', label: 'Unassigned' },
        ...members.map((m) => ({ value: String(m.id), label: m.full_name || m.email })),
      ])}
      <label className="checkbox">
        <input
          type="checkbox"
          checked={filters.overdue === 'true'}
          onChange={(e) => onChange({ overdue: e.target.checked ? 'true' : '' })}
        />
        Overdue only
      </label>
      {select('ordering', 'Sort by', ORDERINGS)}
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
