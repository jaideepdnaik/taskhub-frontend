import { Link } from 'react-router-dom'
import { useProject } from '../projects/queries'

// "In project: X" for a chat limited to one project. onClear (new chats only)
// widens it back to the whole org.
export default function ProjectScope({ projectId, orgId, onClear }) {
  const { data: project, isError } = useProject(projectId)
  const name = project?.name ?? (isError ? `Project #${projectId}` : 'Loading…')

  return (
    <span className="scope-chip">
      In project:{' '}
      {project ? <Link to={`/org/${orgId}/projects/${projectId}`}>{name}</Link> : name}
      {onClear && (
        <button
          type="button"
          className="chip-remove"
          aria-label="Ask about the whole organization instead"
          title="Ask about the whole organization"
          onClick={onClear}
        >
          ×
        </button>
      )}
    </span>
  )
}
