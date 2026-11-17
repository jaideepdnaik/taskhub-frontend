import { useState } from 'react'
import { parseApiError } from '../../api/errors'
import Avatar from '../../components/Avatar'
import { useDebouncedValue } from '../../hooks/useDebouncedValue'
import { useOrgMembers } from '../orgs/queries'
import { useAddProjectMember } from './queries'

// Search the org's members and add one to the project.
export default function AddProjectMember({ project, onDone }) {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search)
  const { data, isPending, isError, error } = useOrgMembers({ search: debouncedSearch })
  const addMember = useAddProjectMember(project.id)

  const memberIds = new Set(project.members.map((m) => m.id))
  const candidates = data?.results.filter((m) => !memberIds.has(m.user.id)) ?? []

  return (
    <div className="add-member">
      <input
        type="search"
        autoFocus
        placeholder="Search org members by name or email…"
        aria-label="Search org members"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {isPending && <p className="muted">Searching…</p>}
      {isError && <p className="error">{parseApiError(error).message}</p>}
      {data && candidates.length === 0 && (
        <p className="muted">
          {debouncedSearch
            ? 'No matching org members who aren’t already on this project.'
            : 'Everyone in the organization is already on this project.'}
        </p>
      )}
      <ul className="member-list">
        {candidates.map(({ user }) => (
          <li key={user.id}>
            <Avatar user={user} size={28} />
            <span className="member-name">
              {user.full_name || user.email}
              {user.full_name && <span className="muted small">{user.email}</span>}
            </span>
            <button
              className="secondary"
              disabled={addMember.isPending}
              onClick={() => addMember.mutate(user.id)}
            >
              Add
            </button>
          </li>
        ))}
      </ul>
      {data?.next && <p className="muted small">More results. Refine your search.</p>}
      {addMember.isError && <p className="error">{parseApiError(addMember.error).message}</p>}
      <button className="secondary" onClick={onDone}>
        Done
      </button>
    </div>
  )
}
