import { useState } from 'react'
import { parseApiError } from '../../api/errors'
import Modal from '../../components/Modal'
import { useDeleteOrganization } from './queries'

// Deleting an org cascades to every project, task and comment in it, so the
// owner has to type the org's name to confirm.
export default function DeleteOrgDialog({ org, open, onClose }) {
  const [typed, setTyped] = useState('')
  const deleteOrg = useDeleteOrganization(org.id)
  const matches = typed.trim() === org.name

  return (
    <Modal open={open} onClose={onClose} title="Delete organization?">
      <p>
        This permanently deletes <strong>{org.name}</strong> with all of its projects, tasks,
        comments and invitations, for every member. This can't be undone.
      </p>
      <label>
        Type <strong>{org.name}</strong> to confirm
        <input autoFocus value={typed} onChange={(e) => setTyped(e.target.value)} />
      </label>
      {deleteOrg.isError && <p className="error">{parseApiError(deleteOrg.error).message}</p>}
      <div className="modal-actions">
        <button className="secondary" onClick={onClose} disabled={deleteOrg.isPending}>
          Cancel
        </button>
        <button
          className="danger"
          disabled={!matches || deleteOrg.isPending}
          onClick={() => deleteOrg.mutate()}
        >
          {deleteOrg.isPending ? 'Deleting…' : 'Delete organization'}
        </button>
      </div>
    </Modal>
  )
}
