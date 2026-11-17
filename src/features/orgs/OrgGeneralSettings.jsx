import { useState } from 'react'
import { parseApiError } from '../../api/errors'
import ConfirmDialog from '../../components/ConfirmDialog'
import FormField from '../../components/FormField'
import { useMe } from '../auth/queries'
import DeleteOrgDialog from './DeleteOrgDialog'
import { useCurrentOrg, useLeaveOrg, useOrgMembers, useUpdateOrganization } from './queries'
import { usePermissions } from './usePermissions'

// Rename (owner/admin), leave (anyone but the owner), delete (owner).
export default function OrgGeneralSettings() {
  const org = useCurrentOrg()
  const { data: me } = useMe()
  const { isAdmin, isOwner } = usePermissions()
  const [name, setName] = useState(org.name)
  const [dialog, setDialog] = useState(null) // 'leave' | 'delete' | null
  const rename = useUpdateOrganization(org.id)
  const leave = useLeaveOrg(org.id)
  // /me doesn't include membership ids; find mine to leave with.
  const { data: mine } = useOrgMembers({ search: me?.email ?? '' }, { enabled: !isOwner && !!me })
  const myMembership = mine?.results.find((m) => m.user.id === me?.id)
  const { fields, message } = rename.isError
    ? parseApiError(rename.error, 'Could not rename the organization.')
    : { fields: {}, message: null }

  return (
    <>
      <section className="panel">
        <h2>Organization</h2>
        <form
          className="form"
          onSubmit={(e) => {
            e.preventDefault()
            rename.mutate({ name })
          }}
          noValidate
        >
          <FormField
            label="Name"
            name="name"
            maxLength={100}
            value={name}
            errors={fields.name}
            disabled={!isAdmin || rename.isPending}
            onChange={(e) => setName(e.target.value)}
          />
          {message && <p className="error">{message}</p>}
          {rename.isSuccess && name === org.name && <p className="muted small">Saved.</p>}
          {isAdmin && (
            <div className="actions">
              <button type="submit" disabled={rename.isPending || !name.trim() || name.trim() === org.name}>
                {rename.isPending ? 'Saving…' : 'Save'}
              </button>
            </div>
          )}
        </form>
        {!isAdmin && <p className="muted small">Only owners and admins can rename the organization.</p>}
      </section>

      <section className="panel danger-zone">
        <h2>Danger zone</h2>
        {isOwner ? (
          <div className="danger-row">
            <span>
              <strong>Delete this organization</strong>
              <span className="muted small">Removes all projects, tasks and members for everyone.</span>
            </span>
            <button className="danger" onClick={() => setDialog('delete')}>
              Delete organization
            </button>
          </div>
        ) : (
          <div className="danger-row">
            <span>
              <strong>Leave this organization</strong>
              <span className="muted small">You'll lose access until someone invites you again.</span>
            </span>
            <button className="danger" disabled={!myMembership} onClick={() => setDialog('leave')}>
              Leave organization
            </button>
          </div>
        )}
      </section>

      {isOwner && <DeleteOrgDialog org={org} open={dialog === 'delete'} onClose={() => setDialog(null)} />}
      <ConfirmDialog
        open={dialog === 'leave'}
        title={`Leave ${org.name}?`}
        message="You'll be removed from all of its projects and unassigned from your tasks there."
        confirmLabel="Leave organization"
        danger
        pending={leave.isPending}
        error={leave.isError ? parseApiError(leave.error).message : null}
        onConfirm={() => leave.mutate(myMembership.id)}
        onClose={() => setDialog(null)}
      />
    </>
  )
}
