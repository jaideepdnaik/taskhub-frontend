import ErrorState from '../../components/ErrorState'
import { formatDateTime, formatRelative } from '../../utils/time'
import { describeActivity } from './activityText'
import { useActivity } from './queries'

// A task's history, newest first.
export default function ActivityLog({ taskId }) {
  const { data, isPending, isError, error, refetch, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useActivity(taskId)

  if (isPending) return <p className="muted">Loading activity…</p>
  if (isError) return <ErrorState title="Couldn't load activity." error={error} onRetry={refetch} />

  const entries = data.pages.flatMap((page) => page.results)
  if (entries.length === 0) return <p className="muted">No activity yet.</p>

  return (
    <div className="activity">
      <ol className="activity-list">
        {entries.map((entry) => {
          const actor = entry.actor ? entry.actor.full_name || entry.actor.email : 'Someone'
          return (
            <li key={entry.id}>
              <div>
                {describeActivity(entry).map((line) => (
                  <p key={line}>
                    <strong>{actor}</strong> {line}
                  </p>
                ))}
              </div>
              <span className="muted small" title={formatDateTime(entry.created_at)}>
                {formatRelative(entry.created_at)}
              </span>
            </li>
          )
        })}
      </ol>
      {hasNextPage && (
        <button className="secondary" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? 'Loading…' : 'Load older activity'}
        </button>
      )}
    </div>
  )
}
