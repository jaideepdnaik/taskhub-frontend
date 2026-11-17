import { useState } from 'react'
import ErrorState from '../../components/ErrorState'
import Pagination from '../../components/Pagination'
import InvitationRow from './InvitationRow'
import { useInvitations } from './queries'

const FILTERS = [
  { value: 'pending', label: 'Pending' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'expired', label: 'Expired' },
  { value: '', label: 'All' },
]

export default function InvitationList() {
  const [status, setStatus] = useState('pending')
  const [page, setPage] = useState(1)
  const { data, isPending, isError, error, refetch, isPlaceholderData } = useInvitations({ status, page })

  let body
  if (isPending) body = <p className="muted">Loading invitations…</p>
  else if (isError) body = <ErrorState title="Couldn't load invitations." error={error} onRetry={refetch} />
  else if (data.results.length === 0) {
    body = <p className="muted">{status ? `No ${status} invitations.` : 'No invitations yet.'}</p>
  } else {
    body = (
      <>
        <ul className={`member-list${isPlaceholderData ? ' is-stale' : ''}`}>
          {data.results.map((invitation) => (
            <InvitationRow key={invitation.id} invitation={invitation} />
          ))}
        </ul>
        <Pagination page={page} data={data} onPageChange={setPage} disabled={isPlaceholderData} />
      </>
    )
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Invitations</h2>
        <div className="segmented" role="group" aria-label="Invitation status">
          {FILTERS.map((f) => (
            <button
              key={f.label}
              className={status === f.value ? 'selected' : ''}
              aria-pressed={status === f.value}
              onClick={() => {
                setStatus(f.value)
                setPage(1)
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      {body}
    </section>
  )
}
