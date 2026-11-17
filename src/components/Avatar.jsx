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
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      aria-hidden="true"
    >
      {initials}
    </span>
  )
}
