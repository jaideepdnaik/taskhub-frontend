import NotificationList from '../features/notifications/NotificationList'

export default function NotificationsPage() {
  return (
    <section className="page">
      <div className="page-header">
        <h1>Notifications</h1>
      </div>
      <NotificationList />
    </section>
  )
}
