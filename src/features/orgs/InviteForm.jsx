import { useState } from 'react'
import { parseApiError } from '../../api/errors'
import CopyField from '../../components/CopyField'
import FormField from '../../components/FormField'
import { ASSIGNABLE_ROLES } from './memberRules'
import { useCreateInvitation } from './queries'

// Invite by email. The response includes a one-time accept link; show it so
// it can be shared directly as well as by the backend's email.
export default function InviteForm() {
  const [form, setForm] = useState({ email: '', role: 'member' })
  const [sent, setSent] = useState(null) // the last created invitation
  const createInvitation = useCreateInvitation()
  const { fields, message } = createInvitation.isError
    ? parseApiError(createInvitation.error, 'Could not send the invitation.')
    : { fields: {}, message: null }

  const handleSubmit = (e) => {
    e.preventDefault()
    createInvitation.mutate(form, {
      onSuccess: (invitation) => {
        setSent(invitation)
        setForm({ ...form, email: '' })
      },
    })
  }

  return (
    <section className="panel">
      <h2>Invite someone</h2>
      <form className="invite-form" onSubmit={handleSubmit} noValidate>
        <FormField
          label="Email"
          type="email"
          name="email"
          required
          value={form.email}
          errors={fields.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <FormField
          as="select"
          label="Role"
          name="role"
          value={form.role}
          errors={fields.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          {ASSIGNABLE_ROLES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </FormField>
        <button type="submit" disabled={createInvitation.isPending || !form.email.trim()}>
          {createInvitation.isPending ? 'Inviting…' : 'Send invite'}
        </button>
      </form>
      {message && <p className="error">{message}</p>}
      {sent && (
        <div className="notice invite-sent">
          <p>
            Invitation for <strong>{sent.email}</strong> ({sent.role}) is ready. It expires on{' '}
            {new Date(sent.expires_at).toLocaleDateString()}.
          </p>
          <CopyField label="Share this link with them" value={sent.accept_url} />
        </div>
      )}
    </section>
  )
}
