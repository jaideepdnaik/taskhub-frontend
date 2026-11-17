import { Link, useParams } from 'react-router-dom'
import ErrorState from '../components/ErrorState'
import { useCurrentOrgId } from '../features/orgs/queries'
import { usePermissions } from '../features/orgs/usePermissions'
import ProjectActions from '../features/projects/ProjectActions'
import ProjectMembers from '../features/projects/ProjectMembers'
import { useProject } from '../features/projects/queries'

export default function ProjectDetailPage() {
  const orgId = useCurrentOrgId()
  const projectId = Number(useParams().projectId)
  const { isAdmin } = usePermissions()
  const { data: project, isPending, isError, error, refetch } = useProject(projectId)
  const backLink = <Link to={`/org/${orgId}/projects`}>← All projects</Link>

  if (isPending) return <p className="muted">Loading project…</p>
  if (isError) {
    return error.response?.status === 404 ? (
      <section className="state">
        <h1>Project not found</h1>
        <p className="muted">It doesn't exist, or you're not a member of it.</p>
        {backLink}
      </section>
    ) : (
      <ErrorState title="Couldn't load the project." error={error} onRetry={refetch} />
    )
  }

  return (
    <section className="page">
      {backLink}
      <div className="page-header">
        <div>
          <h1>
            {project.name}
            {project.is_archived && <span className="badge">Archived</span>}
          </h1>
          <p className="muted small">
            Created {new Date(project.created_at).toLocaleDateString()}
            {project.created_by && ` by ${project.created_by.full_name || project.created_by.email}`}
          </p>
        </div>
        <div className="actions">
          <Link className="button" to={`/org/${orgId}/projects/${project.id}/board`}>
            Open board
          </Link>
          {isAdmin && <ProjectActions project={project} />}
        </div>
      </div>

      {project.is_archived && (
        <p className="notice">This project is archived and read-only. Unarchive it to make changes.</p>
      )}
      <p className="description">{project.description || 'No description.'}</p>
      <ProjectMembers project={project} canManage={isAdmin && !project.is_archived} />
    </section>
  )
}
