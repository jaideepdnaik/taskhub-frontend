import { useEffect, useState } from 'react'
import { useDebouncedValue } from '../../hooks/useDebouncedValue'

export default function ProjectFilters({ filters, onChange }) {
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
        placeholder="Search projects…"
        aria-label="Search projects"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="segmented" role="group" aria-label="Show">
        <button
          className={filters.archived ? '' : 'selected'}
          aria-pressed={!filters.archived}
          onClick={() => onChange({ archived: false })}
        >
          Active
        </button>
        <button
          className={filters.archived ? 'selected' : ''}
          aria-pressed={filters.archived}
          onClick={() => onChange({ archived: true })}
        >
          Archived
        </button>
      </div>
    </div>
  )
}
