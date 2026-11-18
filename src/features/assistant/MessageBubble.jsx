import { formatDateTime } from '../../utils/time'
import MessageContent from './MessageContent'
import SourceList from './SourceList'

// One message. Questions are plain text; answers are Markdown with sources.
export default function MessageBubble({ message, orgId }) {
  const isUser = message.role === 'user'
  return (
    <li className={`message message-${message.role}`}>
      <div className="bubble" title={message.created_at && formatDateTime(message.created_at)}>
        {isUser ? (
          <p className="message-text">{message.content}</p>
        ) : (
          <>
            <MessageContent content={message.content} citations={message.citations} orgId={orgId} />
            <SourceList citations={message.citations} orgId={orgId} />
          </>
        )}
      </div>
    </li>
  )
}
