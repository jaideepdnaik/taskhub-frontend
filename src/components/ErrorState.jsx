import { parseApiError } from '../api/errors'

// Error block for a failed query, with a retry button.
export default function ErrorState({ error, title = 'Something went wrong.', onRetry }) {
  const { message } = parseApiError(error)
  return (
    <div className="state" role="alert">
      <p className="error">{title}</p>
      {message && <p className="muted">{message}</p>}
      {onRetry && (
        <button className="secondary" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  )
}
