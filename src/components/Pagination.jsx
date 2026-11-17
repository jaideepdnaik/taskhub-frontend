// Prev/next paging for DRF's {count, next, previous, results} responses.
export default function Pagination({ page, data, onPageChange, disabled }) {
  if (!data || (!data.next && !data.previous)) return null

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        className="secondary"
        disabled={disabled || !data.previous}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </button>
      <span className="muted">
        Page {page} · {data.count} total
      </span>
      <button
        className="secondary"
        disabled={disabled || !data.next}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </nav>
  )
}
