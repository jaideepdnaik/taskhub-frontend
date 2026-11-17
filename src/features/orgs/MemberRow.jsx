import { useState } from 'react'
import { parseApiError } from '../../api/errors'
import Avatar from '../../components/Avatar'
import ConfirmDialog from '../../components/ConfirmDialog'
import { formatDateTime, formatRelative } from '../../utils/time'
import { ASSIGNABLE_ROLES } from './memberRules'
import { useRemoveMember, useUpdateMemberRole } from './queries'

export default function MemberRow({ membership, isSelf, canChangeRole, canRemove }) {
  const [confirming, setConfirming] = useState(false)
  const updateRole = useUpdateMemberRole()
  const removeMember = useRemoveMember()
  const { user } = membership
  const name = user.full_name || user.email
  const error = updateRole.error ?? (confirming ? null : removeMember.error)

  return (
    <li className="member-row">
      <Avatar user={user} size={32} />
      <span className="member-name">
        <span>
          {name}
          {isSelf && <span className="muted"> (you)</span>}
        </span>
        <span className="muted small">
          {user.full_name && `${user.email} · `}
          <span title={formatDateTime(membership.joined_at)}>
            joined {formatRelative(membership.joined_at)}
          </span>
        </span>
        {error && <span className="error small">{parseApiError(error).message}</span>}
      </span>

      {canChangeRole ? (
        <select
          aria-label={`Role for ${name}`}
          value={membership.role}
          disabled={updateRole.isPending}
          onChange={(e) => updateRole.mutate({ membershipId: membership.id, role: e.target.value })}
        >
          {ASSIGNABLE_ROLES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      ) : (
        <span className="role-badge">{membership.role}</span>
      )}

      {canRemove && (
        <button
          className="secondary"
          onClick={() => {
            removeMember.reset()
            setConfirming(true)
          }}
        >
          Remove
        </button>
      )}

      <ConfirmDialog
        open={confirming}
        title="Remove member?"
        message={`${name} will lose access to this organization, be removed from all of its projects and be unassigned from their tasks. You can invite them again later.`}
        confirmLabel="Remove member"
        danger
        pending={removeMember.isPending}
        error={removeMember.isError ? parseApiError(removeMember.error).message : null}
        onConfirm={() => removeMember.mutate(membership.id, { onSuccess: () => setConfirming(false) })}
        onClose={() => setConfirming(false)}
      />
    </li>
  )
}
