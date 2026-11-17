import { useCallback, useRef, useState } from 'react'
import Avatar from '../../components/Avatar'
import { useDismiss } from '../../hooks/useDismiss'
import { useMe } from './queries'
import { useLogout } from './useLogout'

export default function UserMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const close = useCallback(() => setOpen(false), [])
  useDismiss(ref, open, close)
  const { data: me } = useMe()
  const logout = useLogout()

  return (
    <div className="menu" ref={ref}>
      <button
        className="menu-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        onClick={() => setOpen((v) => !v)}
      >
        <Avatar user={me} />
      </button>
      {open && (
        <div className="menu-panel" role="menu">
          <div className="menu-header">
            <strong>{me?.full_name || 'Signed in'}</strong>
            <span className="muted">{me?.email}</span>
          </div>
          <button role="menuitem" className="menu-item" onClick={logout}>
            Log out
          </button>
        </div>
      )}
    </div>
  )
}
