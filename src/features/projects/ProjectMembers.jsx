import { useState } from 'react'
import { parseApiError } from '../../api/errors'
import Avatar from '../../components/Avatar'
import AddProjectMember from './AddProjectMember'
import { useRemoveProjectMember } from './queries'

// `canManage`: org admin and the project isn't archived.
export default function ProjectMembers({ project, canManage }) {
  const [adding, setAdding] = useState(false)
  const removeMember = useRemoveProjectMember(project.id)

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Members ({project.members.length})</h2>
        {canManage && !adding && (
          <button className="secondary" onClick={() => setAdding(true)}>
            Add member
          </button>
        )}
      </div>

      {canManage && adding && (
        <AddProjectMember project={project} onDone={() => setAdding(false)} />
      )}

      {project.members.length === 0 ? (
        <p className="empty">No members yet.</p>
      ) : (
        <ul className="member-list">
          {project.members.map((user) => (
            <li key={user.id}>
              <Avatar user={user} size={28} />
              <span className="member-name">
                {user.full_name || user.email}
                {user.full_name && <span className="muted small">{user.email}</span>}
              </span>
              {canManage && (
                <button
                  className="secondary"
                  disabled={removeMember.isPending && removeMember.variables === user.id}
                  onClick={() => removeMember.mutate(user.id)}
                >
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      {removeMember.isError && (
        <p className="error">{parseApiError(removeMember.error).message}</p>
      )}
    </section>
  )
}
