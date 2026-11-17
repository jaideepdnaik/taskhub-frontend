import { useState } from 'react'
import { parseApiError } from '../../api/errors'
import ConfirmDialog from '../../components/ConfirmDialog'
import CopyField from '../../components/CopyField'
import { formatDateTime, formatRelative } from '../../utils/time'
import { useCreateInvitation, useRevokeInvitation } from './queries'

const STATUS_LABEL = { pending: 'Pending', accepted: 'Accepted', expired: 'Expired' }

// Resend = invite the same email again, which gives the open invite a new
// link and expiry (the old link stops working).
export default function InvitationRow({ invitation }) {
  const [confirming, setConfirming] = useState(false)
  const resend = useCreateInvitation()
  const revoke = useRevokeInvitation()
  const open = invitation.status !== 'accepted'
  const inviter = invitation.invited_by
  const error = resend.error ?? (confirming ? null : revoke.error)

  return (
    <li className="invitation-row">
      <span className="member-name">
        <span>
          {invitation.email} <span className="role-badge">{invitation.role}</span>
        </span>
        <span className="muted small">
          {inviter && `Invited by ${inviter.full_name || inviter.email} · `}
          <span title={formatDateTime(invitation.created_at)}>{formatRelative(invitation.created_at)}</span>
          {invitation.status === 'pending' && ` · expires ${formatRelative(invitation.expires_at)}`}
          {invitation.accepted_at && ` · accepted ${formatRelative(invitation.accepted_at)}`}
        </span>
        {error && <span className="error small">{parseApiError(error).message}</span>}
        {resend.data && <CopyField label="New invite link" value={resend.data.accept_url} />}
      </span>
      <span className={`status invite-${invitation.status}`}>{STATUS_LABEL[invitation.status]}</span>
      {open && (
        <span className="actions">
          <button
            className="secondary"
            disabled={resend.isPending}
            onClick={() => resend.mutate({ email: invitation.email, role: invitation.role })}
          >
            {resend.isPending ? 'Resending…' : 'Resend'}
          </button>
          <button
            className="secondary"
            onClick={() => {
              revoke.reset()
              setConfirming(true)
            }}
          >
            Revoke
          </button>
        </span>
      )}
      <ConfirmDialog
        open={confirming}
        title="Revoke invitation?"
        message={`The invite link sent to ${invitation.email} will stop working.`}
        confirmLabel="Revoke"
        danger
        pending={revoke.isPending}
        error={revoke.isError ? parseApiError(revoke.error).message : null}
        onConfirm={() => revoke.mutate(invitation.id, { onSuccess: () => setConfirming(false) })}
        onClose={() => setConfirming(false)}
      />
    </li>
  )
}
