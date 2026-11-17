import { Link, useParams, useSearchParams } from 'react-router-dom'
import ErrorState from '../components/ErrorState'
import { useCurrentOrgId } from '../features/orgs/queries'
import { usePermissions } from '../features/orgs/usePermissions'
import { useProject } from '../features/projects/queries'
import Board from '../features/tasks/Board'
import TaskListView from '../features/tasks/TaskListView'

export default function BoardPage() {
  const orgId = useCurrentOrgId()
  const projectId = Number(useParams().projectId)
  const [params] = useSearchParams()
  const view = params.get('view') === 'list' ? 'list' : 'board'
  const { canEdit } = usePermissions()
  const { data: project, isPending, isError, error, refetch } = useProject(projectId)
  const projectUrl = `/org/${orgId}/projects/${projectId}`

  if (isPending) return <p className="muted">Loading project…</p>
  if (isError) {
    return error.response?.status === 404 ? (
      <section className="state">
        <h1>Project not found</h1>
        <p className="muted">It doesn't exist, or you're not a member of it.</p>
        <Link to={`/org/${orgId}/projects`}>← All projects</Link>
      </section>
    ) : (
      <ErrorState title="Couldn't load the project." error={error} onRetry={refetch} />
    )
  }

  const editable = canEdit && !project.is_archived

  return (
    <section className="page page-wide">
      <Link to={projectUrl}>← {project.name}</Link>
      <div className="page-header">
        <h1>
          {project.name}
          {project.is_archived && <span className="badge">Archived</span>}
        </h1>
        <div className="segmented" role="group" aria-label="View">
          <Link className={view === 'board' ? 'selected' : ''} to={`${projectUrl}/board`}>
            Board
          </Link>
          <Link className={view === 'list' ? 'selected' : ''} to={`${projectUrl}/board?view=list`}>
            List
          </Link>
        </div>
      </div>
      {!editable && (
        <p className="notice">
          {project.is_archived
            ? 'This project is archived, so its tasks are read-only.'
            : 'You have view-only access to this project.'}
        </p>
      )}
      {view === 'board' ? (
        <Board project={project} editable={editable} />
      ) : (
        <TaskListView project={project} />
      )}
    </section>
  )
}
