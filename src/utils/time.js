const UNITS = [
  ['year', 365 * 24 * 3600],
  ['month', 30 * 24 * 3600],
  ['week', 7 * 24 * 3600],
  ['day', 24 * 3600],
  ['hour', 3600],
  ['minute', 60],
]

const relative = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' })

// "just now", "5 minutes ago", "yesterday", "3 weeks ago" ...
export function formatRelative(isoString, now = Date.now()) {
  const seconds = Math.round((new Date(isoString).getTime() - now) / 1000)
  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size) return relative.format(Math.round(seconds / size), unit)
  }
  return 'just now'
}

// Full local date and time, for tooltips.
export const formatDateTime = (isoString) => new Date(isoString).toLocaleString()

// Plain dates from the API ("2026-11-20") are calendar dates, not instants.
// Parse them as local midnight; new Date("2026-11-20") would be UTC and can
// show the previous day.
export function formatPlainDate(value, options = { month: 'short', day: 'numeric' }) {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString(undefined, options)
}
