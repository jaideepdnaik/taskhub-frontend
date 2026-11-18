import { NavLink } from 'react-router-dom'
import { formatDateTime, formatRelative } from '../../utils/time'

export default function ConversationItem({ conversation, orgId, onDelete }) {
  return (
    <li className="conversation">
      <NavLink className="conversation-link" to={`/org/${orgId}/assistant/${conversation.id}`}>
        <span className="conversation-title">{conversation.title}</span>
        <span className="muted small" title={formatDateTime(conversation.updated_at)}>
          {formatRelative(conversation.updated_at)}
        </span>
      </NavLink>
      <button
        type="button"
        className="icon-button conversation-delete"
        aria-label={`Delete "${conversation.title}"`}
        title="Delete"
        onClick={() => onDelete(conversation)}
      >
        🗑
      </button>
    </li>
  )
}
