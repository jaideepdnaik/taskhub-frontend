import { useNavigate } from 'react-router-dom'
import CreateOrgForm from '../features/orgs/CreateOrgForm'
import { useMyOrgs } from '../features/orgs/queries'

export default function CreateOrgPage() {
  const navigate = useNavigate()
  const { data: orgs } = useMyOrgs()
  const isFirst = orgs?.length === 0

  return (
    <div className="centered">
      <CreateOrgForm
        title={isFirst ? 'Create your first organization' : 'New organization'}
        onCreated={(org) => navigate(`/org/${org.id}`)}
      />
    </div>
  )
}
