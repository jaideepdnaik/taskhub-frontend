import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { parseApiError } from '../../api/errors'
import ConfirmDialog from '../../components/ConfirmDialog'
import { useCurrentOrgId } from '../orgs/queries'
import ProjectFormModal from './ProjectFormModal'
import { useDeleteProject, useSetProjectArchived } from './queries'

// Edit / archive / delete. Render only for org admins (the backend enforces it too).
export default function ProjectActions({ project }) {
  const navigate = useNavigate()
  const orgId = useCurrentOrgId()
  const [dialog, setDialog] = useState(null) // 'edit' | 'delete' | null
  const setArchived = useSetProjectArchived(project.id)
  const deleteProject = useDeleteProject(project.id, {
    onDeleted: () => navigate(`/org/${orgId}/projects`, { replace: true }),
  })
  const close = () => setDialog(null)
  const handleDelete = () => deleteProject.mutate()

  return (
    <div className="actions">
      {!project.is_archived && (
        <button className="secondary" onClick={() => setDialog('edit')}>
          Edit
        </button>
      )}
      <button
        className="secondary"
        disabled={setArchived.isPending}
        onClick={() => setArchived.mutate(!project.is_archived)}
      >
        {project.is_archived ? 'Unarchive' : 'Archive'}
      </button>
      <button
        className="danger"
        onClick={() => {
          deleteProject.reset()
          setDialog('delete')
        }}
      >
        Delete
      </button>
      {setArchived.isError && (
        <p className="error">{parseApiError(setArchived.error).message}</p>
      )}

      <ProjectFormModal open={dialog === 'edit'} project={project} onClose={close} />
      <ConfirmDialog
        open={dialog === 'delete'}
        title="Delete project?"
        message={`“${project.name}” and all of its tasks will be permanently deleted. This can't be undone.`}
        confirmLabel="Delete project"
        danger
        pending={deleteProject.isPending}
        error={deleteProject.isError ? parseApiError(deleteProject.error).message : null}
        onConfirm={handleDelete}
        onClose={close}
      />
    </div>
  )
}
