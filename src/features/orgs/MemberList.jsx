import { useState } from 'react'
import ErrorState from '../../components/ErrorState'
import Pagination from '../../components/Pagination'
import { useDebouncedValue } from '../../hooks/useDebouncedValue'
import { useMe } from '../auth/queries'
import MemberRow from './MemberRow'
import { memberActions, ROLE_HELP } from './memberRules'
import { useOrgMembers } from './queries'
import { usePermissions } from './usePermissions'

export default function MemberList() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const debouncedSearch = useDebouncedValue(search)
  const { data: me } = useMe()
  const { role } = usePermissions()
  const { data, isPending, isError, error, refetch, isPlaceholderData } = useOrgMembers({
    search: debouncedSearch,
    page,
  })

  let body
  if (isPending) body = <p className="muted">Loading members…</p>
  else if (isError) body = <ErrorState title="Couldn't load members." error={error} onRetry={refetch} />
  else if (data.results.length === 0) body = <p className="empty">No members match “{debouncedSearch}”.</p>
  else {
    body = (
      <>
        <ul className={`member-list${isPlaceholderData ? ' is-stale' : ''}`}>
          {data.results.map((membership) => (
            <MemberRow
              key={membership.id}
              membership={membership}
              isSelf={membership.user.id === me?.id}
              {...memberActions(role, me?.id, membership)}
            />
          ))}
        </ul>
        <Pagination page={page} data={data} onPageChange={setPage} disabled={isPlaceholderData} />
      </>
    )
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Members{data && ` (${data.count})`}</h2>
        <input
          type="search"
          className="search-input"
          placeholder="Search by name or email…"
          aria-label="Search members"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
        />
      </div>
      {body}
      <details className="muted small">
        <summary>What can each role do?</summary>
        <ul>
          {Object.entries(ROLE_HELP).map(([r, help]) => (
            <li key={r}>
              <strong>{r}</strong>: {help}
            </li>
          ))}
        </ul>
      </details>
    </section>
  )
}
