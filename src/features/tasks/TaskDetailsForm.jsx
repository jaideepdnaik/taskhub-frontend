import { useState } from 'react'
import { parseApiError } from '../../api/errors'
import FormField from '../../components/FormField'
import { PRIORITIES, STATUSES } from './constants'
import LabelsInput from './LabelsInput'
import { useUpdateTask } from './queries'
import { changedFields, formFromTask } from './taskForm'

// Edit a task's fields. Save sends only what changed. Read-only when !editable.
// Re-mounted (via `key`) when the task changes on the server, so it starts fresh.
export default function TaskDetailsForm({ task, members, editable }) {
  const [form, setForm] = useState(() => formFromTask(task))
  const update = useUpdateTask(task.id, task.project.id)
  const changes = changedFields(task, form)
  const dirty = Object.keys(changes).length > 0
  const { fields, message } = update.isError
    ? parseApiError(update.error, 'Could not save the task.')
    : { fields: {}, message: null }

  const bind = (name) => ({
    name,
    value: form[name],
    errors: fields[name],
    disabled: !editable || update.isPending,
    onChange: (e) => setForm({ ...form, [name]: e.target.value }),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (dirty) update.mutate(changes)
  }

  // The assignee must be a project member. Keep a current assignee who has
  // since left the project selectable, so the form doesn't silently change it.
  const assigneeOptions = [...members]
  if (task.assignee && !members.some((m) => m.id === task.assignee.id)) {
    assigneeOptions.push(task.assignee)
  }

  return (
    <form className="form task-form" onSubmit={handleSubmit} noValidate>
      <FormField label="Title" maxLength={200} required {...bind('title')} />
      <div className="form-grid">
        <FormField as="select" label="Status" {...bind('status')}>
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </FormField>
        <FormField as="select" label="Priority" {...bind('priority')}>
          {PRIORITIES.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </FormField>
        <FormField as="select" label="Assignee" {...bind('assignee_id')}>
          <option value="">Unassigned</option>
          {assigneeOptions.map((m) => (
            <option key={m.id} value={String(m.id)}>
              {m.full_name || m.email}
            </option>
          ))}
        </FormField>
        <FormField type="date" label="Due date" {...bind('due_date')} />
      </div>
      <LabelsInput
        value={form.labels}
        onChange={(labels) => setForm({ ...form, labels })}
        disabled={!editable || update.isPending}
        errors={fields.labels}
      />
      <FormField
        as="textarea"
        label="Description"
        rows={5}
        placeholder={editable ? 'Add more detail…' : ''}
        {...bind('description')}
      />
      {message && <p className="error">{message}</p>}
      {editable && dirty && (
        <div className="actions">
          <button type="submit" disabled={update.isPending || !form.title.trim()}>
            {update.isPending ? 'Saving…' : 'Save changes'}
          </button>
          <button
            type="button"
            className="secondary"
            disabled={update.isPending}
            onClick={() => {
              setForm(formFromTask(task))
              update.reset()
            }}
          >
            Discard
          </button>
        </div>
      )}
    </form>
  )
}
