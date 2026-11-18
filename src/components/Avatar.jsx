// A pleasant gradient per person, picked from a hash of their name/email.
const GRADIENTS = [
  ['#6366f1', '#8b5cf6'],
  ['#ec4899', '#f43f5e'],
  ['#0ea5e9', '#6366f1'],
  ['#14b8a6', '#0ea5e9'],
  ['#f59e0b', '#ef4444'],
  ['#8b5cf6', '#d946ef'],
  ['#10b981', '#14b8a6'],
]

function gradientFor(label) {
  let hash = 0
  for (const ch of label) hash = (hash * 31 + ch.charCodeAt(0)) | 0
  const [from, to] = GRADIENTS[Math.abs(hash) % GRADIENTS.length]
  return `linear-gradient(135deg, ${from}, ${to})`
}

// Initials in a circle. Takes the API's user shape ({full_name, email}).
export default function Avatar({ user, size = 32 }) {
  const label = user?.full_name || user?.email || '?'
  const initials = label
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')

  return (
    <span
      className="avatar"
      style={{ width: size, height: size, fontSize: size * 0.4, background: gradientFor(label) }}
      aria-hidden="true"
    >
      {initials}
    </span>
  )
}
