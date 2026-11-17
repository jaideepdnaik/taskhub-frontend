// Horizontal bars for one series of counts per category (e.g. tasks by status).
// One hue, since only magnitude varies. Every bar has its label and value as
// text beside it, so the chart doubles as its own table. The row is the hover
// target and carries a tooltip with the share of the total.
// rows: [{key, label, value}]
export default function BarBreakdown({ title, rows }) {
  const total = rows.reduce((sum, r) => sum + r.value, 0)
  const max = Math.max(1, ...rows.map((r) => r.value))

  return (
    <figure className="breakdown">
      <figcaption>{title}</figcaption>
      <ul>
        {rows.map((row) => {
          const share = total ? Math.round((row.value / total) * 100) : 0
          return (
            <li key={row.key} className="breakdown-row" title={`${row.label}: ${row.value} (${share}%)`}>
              <span className="breakdown-label">{row.label}</span>
              <span className="breakdown-track" aria-hidden="true">
                {row.value > 0 && (
                  <span className="breakdown-bar" style={{ width: `${(row.value / max) * 100}%` }} />
                )}
              </span>
              <span className="breakdown-value">{row.value}</span>
            </li>
          )
        })}
      </ul>
    </figure>
  )
}
