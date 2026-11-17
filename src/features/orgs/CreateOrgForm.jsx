import { useState } from 'react'
import { parseApiError } from '../../api/errors'
import FormField from '../../components/FormField'
import { useCreateOrganization } from './queries'

export default function CreateOrgForm({ title, onCreated }) {
  const [name, setName] = useState('')
  const createOrg = useCreateOrganization()
  const { fields, message } = createOrg.isError
    ? parseApiError(createOrg.error, 'Could not create the organization.')
    : { fields: {}, message: null }

  const handleSubmit = (e) => {
    e.preventDefault()
    createOrg.mutate({ name }, { onSuccess: onCreated })
  }

  return (
    <form className="card" onSubmit={handleSubmit} noValidate>
      <h1>{title}</h1>
      <p className="muted">You'll be its owner and can invite teammates later.</p>
      <FormField
        label="Organization name"
        name="name"
        required
        maxLength={100}
        value={name}
        errors={fields.name}
        onChange={(e) => setName(e.target.value)}
      />
      {message && <p className="error">{message}</p>}
      <button type="submit" disabled={createOrg.isPending || !name.trim()}>
        {createOrg.isPending ? 'Creating…' : 'Create organization'}
      </button>
    </form>
  )
}
