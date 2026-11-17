import { Link } from 'react-router-dom'
import { useCurrentOrgId } from '../orgs/queries'

export default function ProjectCard({ project }) {
  const orgId = useCurrentOrgId()
  const members = project.member_count

  return (
    <Link to={`/org/${orgId}/projects/${project.id}`} className="project-card">
      <div className="project-card-title">
        <strong>{project.name}</strong>
        {project.is_archived && <span className="badge">Archived</span>}
      </div>
      <p className="muted clamp">{project.description || 'No description'}</p>
      <span className="muted small">
        {members} {members === 1 ? 'member' : 'members'} · updated{' '}
        {new Date(project.updated_at).toLocaleDateString()}
      </span>
    </Link>
  )
}
