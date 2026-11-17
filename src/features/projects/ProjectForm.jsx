import { useState } from 'react'
import { parseApiError } from '../../api/errors'
import FormField from '../../components/FormField'
import { useSaveProject } from './queries'

// Create (no `project`) or edit an existing project.
export default function ProjectForm({ project, onSaved, onCancel }) {
  const [form, setForm] = useState({
    name: project?.name ?? '',
    description: project?.description ?? '',
  })
  const save = useSaveProject(project?.id ?? null)
  const { fields, message } = save.isError
    ? parseApiError(save.error, 'Could not save the project.')
    : { fields: {}, message: null }

  const handleSubmit = (e) => {
    e.preventDefault()
    save.mutate(form, { onSuccess: onSaved })
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <FormField
        label="Name"
        name="name"
        required
        maxLength={120}
        autoFocus
        value={form.name}
        errors={fields.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <FormField
        as="textarea"
        label="Description"
        name="description"
        rows={4}
        value={form.description}
        errors={fields.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      {message && <p className="error">{message}</p>}
      <div className="modal-actions">
        <button type="button" className="secondary" onClick={onCancel} disabled={save.isPending}>
          Cancel
        </button>
        <button type="submit" disabled={save.isPending || !form.name.trim()}>
          {save.isPending ? 'Saving…' : project ? 'Save changes' : 'Create project'}
        </button>
      </div>
    </form>
  )
}
