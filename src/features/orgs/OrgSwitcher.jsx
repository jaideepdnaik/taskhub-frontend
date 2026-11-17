import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { selectCurrentOrgId } from './orgSlice'
import { useMyOrgs } from './queries'

const NEW_ORG = 'new'

export default function OrgSwitcher() {
  const navigate = useNavigate()
  const currentOrgId = useSelector(selectCurrentOrgId)
  const { data: orgs, isLoading, isError } = useMyOrgs()

  if (isLoading) return <span className="muted">Loading organizations…</span>
  if (isError) return <span className="error">Couldn't load organizations</span>

  const handleChange = (e) => {
    const value = e.target.value
    navigate(value === NEW_ORG ? '/orgs/new' : `/org/${value}`)
  }

  return (
    <select
      className="org-switcher"
      aria-label="Current organization"
      value={currentOrgId ?? ''}
      onChange={handleChange}
    >
      {currentOrgId == null && (
        <option value="" disabled>
          Select an organization
        </option>
      )}
      {orgs.map((org) => (
        <option key={org.id} value={org.id}>
          {org.name}
        </option>
      ))}
      <option value={NEW_ORG}>+ New organization</option>
    </select>
  )
}
