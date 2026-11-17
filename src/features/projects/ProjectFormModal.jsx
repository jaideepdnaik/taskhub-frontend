import Modal from '../../components/Modal'
import ProjectForm from './ProjectForm'

export default function ProjectFormModal({ open, project, onClose, onSaved }) {
  return (
    <Modal open={open} onClose={onClose} title={project ? 'Edit project' : 'New project'}>
      <ProjectForm
        project={project}
        onCancel={onClose}
        onSaved={(saved) => {
          onClose()
          onSaved?.(saved)
        }}
      />
    </Modal>
  )
}
