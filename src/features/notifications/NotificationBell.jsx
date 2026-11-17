import { useCallback, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { parseApiError } from '../../api/errors'
import { useDismiss } from '../../hooks/useDismiss'
import { useCurrentOrgId } from '../orgs/queries'
import NotificationItem from './NotificationItem'
import { useMarkAllRead, useNotifications, useUnreadCount } from './queries'

const DROPDOWN_SIZE = 8

// Header bell: unread badge for the current org, and its latest notifications.
export default function NotificationBell() {
  const orgId = useCurrentOrgId()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const close = useCallback(() => setOpen(false), [])
  useDismiss(ref, open, close)

  const { data: unread = 0 } = useUnreadCount(orgId)
  const list = useNotifications(
    { organization: orgId, page_size: DROPDOWN_SIZE },
    { enabled: open && orgId != null },
  )
  const markAllRead = useMarkAllRead()

  if (orgId == null) return null

  return (
    <div className="menu" ref={ref}>
      <button
        className="icon-button bell"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={unread ? `Notifications, ${unread} unread` : 'Notifications'}
        onClick={() => setOpen((v) => !v)}
      >
        🔔
        {unread > 0 && <span className="bell-badge">{unread > 99 ? '99+' : unread}</span>}
      </button>
      {open && (
        <div className="menu-panel notification-panel">
          <div className="panel-header">
            <strong>Notifications</strong>
            {unread > 0 && (
              <button
                className="link-button small"
                disabled={markAllRead.isPending}
                onClick={() => markAllRead.mutate(orgId)}
              >
                Mark all as read
              </button>
            )}
          </div>
          {list.isPending && <p className="muted">Loading…</p>}
          {list.isError && <p className="error">{parseApiError(list.error).message}</p>}
          {list.data?.results.length === 0 && <p className="muted">You're all caught up.</p>}
          {list.data?.results.length > 0 && (
            <ul className="notification-list">
              {list.data.results.map((n) => (
                <NotificationItem key={n.id} notification={n} onOpen={close} />
              ))}
            </ul>
          )}
          <Link to={`/org/${orgId}/notifications`} className="small" onClick={close}>
            View all notifications
          </Link>
        </div>
      )}
    </div>
  )
}
