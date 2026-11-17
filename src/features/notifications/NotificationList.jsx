import { useSearchParams } from 'react-router-dom'
import { parseApiError } from '../../api/errors'
import ErrorState from '../../components/ErrorState'
import Pagination from '../../components/Pagination'
import { useCurrentOrgId } from '../orgs/queries'
import NotificationItem from './NotificationItem'
import { useMarkAllRead, useNotifications, useUnreadCount } from './queries'

// ?unread=1 shows only unread; ?scope=all lists every org's notifications.
function useNotificationFilters() {
  const [params, setParams] = useSearchParams()
  const filters = {
    unread: params.get('unread') === '1',
    allOrgs: params.get('scope') === 'all',
    page: Math.max(1, Number(params.get('page')) || 1),
  }
  const setFilters = (changes) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        const toggle = (key, on, value) => (on ? next.set(key, value) : next.delete(key))
        if ('unread' in changes) toggle('unread', changes.unread, '1')
        if ('allOrgs' in changes) toggle('scope', changes.allOrgs, 'all')
        toggle('page', changes.page > 1, String(changes.page))
        return next
      },
      { replace: true },
    )
  return [filters, setFilters]
}

export default function NotificationList() {
  const orgId = useCurrentOrgId()
  const [filters, setFilters] = useNotificationFilters()
  const organization = filters.allOrgs ? undefined : orgId
  const { data, isPending, isError, error, refetch, isPlaceholderData } = useNotifications(
    { organization, is_read: filters.unread ? 'false' : undefined, page: filters.page },
    { poll: true },
  )
  const { data: unread = 0 } = useUnreadCount(orgId)
  const markAllRead = useMarkAllRead()

  const segment = (label, active, change) => (
    <button className={active ? 'selected' : ''} aria-pressed={active} onClick={() => setFilters(change)}>
      {label}
    </button>
  )

  let body
  if (isPending) body = <p className="muted">Loading notifications…</p>
  else if (isError) body = <ErrorState title="Couldn't load notifications." error={error} onRetry={refetch} />
  else if (data.results.length === 0) {
    body = <p className="empty">{filters.unread ? "You're all caught up." : 'No notifications yet.'}</p>
  } else {
    body = (
      <>
        <ul className={`notification-list panel${isPlaceholderData ? ' is-stale' : ''}`}>
          {data.results.map((n) => (
            <NotificationItem key={n.id} notification={n} showOrg={filters.allOrgs} canDelete />
          ))}
        </ul>
        <Pagination
          page={filters.page}
          data={data}
          onPageChange={(page) => setFilters({ page })}
          disabled={isPlaceholderData}
        />
      </>
    )
  }

  return (
    <>
      <div className="toolbar">
        <div className="segmented" role="group" aria-label="Show">
          {segment('All', !filters.unread, { unread: false })}
          {segment('Unread', filters.unread, { unread: true })}
        </div>
        <div className="segmented" role="group" aria-label="Organizations">
          {segment('This organization', !filters.allOrgs, { allOrgs: false })}
          {segment('All organizations', filters.allOrgs, { allOrgs: true })}
        </div>
        {(filters.allOrgs || unread > 0) && (
          <button
            className="secondary"
            disabled={markAllRead.isPending}
            onClick={() => markAllRead.mutate(organization)}
          >
            Mark all as read
          </button>
        )}
      </div>
      {markAllRead.isError && <p className="error">{parseApiError(markAllRead.error).message}</p>}
      {body}
    </>
  )
}
