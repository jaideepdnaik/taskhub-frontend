import { useNavigate } from 'react-router-dom'
import { formatDateTime, formatRelative } from '../../utils/time'
import { describeNotification, notificationLink } from './notificationText'
import { useDeleteNotification, useMarkRead } from './queries'

// One notification. Clicking marks it read and opens the task.
// `showOrg`: name the org (when listing across orgs). `onOpen`: e.g. close a dropdown.
export default function NotificationItem({ notification, showOrg, canDelete, onOpen }) {
  const navigate = useNavigate()
  const markRead = useMarkRead()
  const deleteNotification = useDeleteNotification()
  const { text, detail } = describeNotification(notification)
  const { payload } = notification

  const open = () => {
    if (!notification.is_read) markRead.mutate(notification.id)
    onOpen?.()
    navigate(notificationLink(notification))
  }

  return (
    <li className={`notification${notification.is_read ? '' : ' unread'}`}>
      <button className="notification-main" onClick={open}>
        {!notification.is_read && <span className="unread-dot" aria-label="Unread" />}
        <span className="notification-text">
          {text}
          {detail && <span className="notification-detail">“{detail}”</span>}
          <span className="muted small">
            {showOrg && `${notification.organization.name} · `}
            {payload.project_name} ·{' '}
            <span title={formatDateTime(notification.created_at)}>
              {formatRelative(notification.created_at)}
            </span>
          </span>
        </span>
      </button>
      {canDelete && (
        <button
          className="icon-button"
          aria-label="Delete notification"
          disabled={deleteNotification.isPending}
          onClick={() => deleteNotification.mutate(notification.id)}
        >
          ✕
        </button>
      )}
    </li>
  )
}
