import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCurrentOrgId } from '../features/orgs/queries'
import { usePermissions } from '../features/orgs/usePermissions'
import ProjectFilters from '../features/projects/ProjectFilters'
import ProjectFormModal from '../features/projects/ProjectFormModal'
import ProjectList from '../features/projects/ProjectList'
import { useProjectFilters } from '../features/projects/useProjectFilters'

export default function ProjectsPage() {
  const navigate = useNavigate()
  const orgId = useCurrentOrgId()
  const { isAdmin } = usePermissions()
  const [filters, setFilters] = useProjectFilters()
  const [creating, setCreating] = useState(false)

  return (
    <section className="page">
      <div className="page-header">
        <h1>Projects</h1>
        {isAdmin && <button onClick={() => setCreating(true)}>New project</button>}
      </div>
      <ProjectFilters filters={filters} onChange={setFilters} />
      <ProjectList filters={filters} onPageChange={(page) => setFilters({ page })} />
      <ProjectFormModal
        open={creating}
        onClose={() => setCreating(false)}
        onSaved={(project) => navigate(`/org/${orgId}/projects/${project.id}`)}
      />
    </section>
  )
}
