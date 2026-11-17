import ErrorState from '../../components/ErrorState'
import Pagination from '../../components/Pagination'
import { usePermissions } from '../orgs/usePermissions'
import ProjectCard from './ProjectCard'
import { useProjects } from './queries'

function emptyMessage(filters, isAdmin) {
  if (filters.search) return `No projects match “${filters.search}”.`
  if (filters.archived) return 'No archived projects.'
  return isAdmin
    ? 'No projects yet. Create the first one to get started.'
    : "You haven't been added to any projects yet. Ask an admin to add you."
}

export default function ProjectList({ filters, onPageChange }) {
  const { isAdmin } = usePermissions()
  const { data, isPending, isError, error, refetch, isPlaceholderData } = useProjects(filters)

  if (isPending) return <p className="muted">Loading projects…</p>
  if (isError) {
    return <ErrorState title="Couldn't load projects." error={error} onRetry={refetch} />
  }
  if (data.results.length === 0) {
    return <p className="empty">{emptyMessage(filters, isAdmin)}</p>
  }

  return (
    <>
      <div className={`project-grid${isPlaceholderData ? ' is-stale' : ''}`}>
        {data.results.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      <Pagination
        page={filters.page}
        data={data}
        onPageChange={onPageChange}
        disabled={isPlaceholderData}
      />
    </>
  )
}
