import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import ErrorState from '../../components/ErrorState'
import { useCurrentOrgId } from '../orgs/queries'
import ChatEmptyState from './ChatEmptyState'
import ChatInput from './ChatInput'
import MessageBubble from './MessageBubble'
import ProjectScope from './ProjectScope'
import { useConversation } from './queries'
import { useAssistantChat } from './useAssistantChat'

// One conversation, or a new chat when conversationId is null. projectId
// limits a new chat to one project (ignored for existing ones).
export default function ChatThread({ conversationId, projectId, onClearProject }) {
  const orgId = useCurrentOrgId()
  const conversation = useConversation(conversationId)
  const chat = useAssistantChat({ conversationId, projectId })
  const listRef = useRef(null)
  const inputRef = useRef(null)
  const listLink = <Link to={`/org/${orgId}/assistant`}>← All conversations</Link>

  const messages = conversation.data?.messages ?? []
  const scopeId = conversationId == null ? projectId : conversation.data?.project_id
  const waiting = chat.pendingQuestion != null

  // Keep the newest message in view, and the input focused once an answer is in.
  useEffect(() => {
    const list = listRef.current
    if (list) list.scrollTop = list.scrollHeight
  }, [messages.length, waiting])
  useEffect(() => {
    if (!waiting) inputRef.current?.focus()
  }, [waiting])

  if (conversation.isError && conversation.error.response?.status === 404) {
    return (
      <div className="chat-thread">
        <div className="state">
          <h2>Conversation not found</h2>
          <p className="muted">It may have been deleted.</p>
          {listLink}
        </div>
      </div>
    )
  }
  if (conversationId != null && conversation.isPending) {
    return (
      <div className="chat-thread">
        <p className="muted">Loading conversation…</p>
      </div>
    )
  }
  if (conversation.isError && !conversation.data) {
    return (
      <div className="chat-thread">
        <ErrorState
          title="Couldn't load the conversation."
          error={conversation.error}
          onRetry={conversation.refetch}
        />
      </div>
    )
  }

  const isEmpty = messages.length === 0 && !waiting
  return (
    <div className="chat-thread">
      <div className="chat-header">
        <span className="chat-back">{listLink}</span>
        <h1 className="chat-title">{conversation.data?.title ?? 'New chat'}</h1>
        {scopeId != null && (
          <ProjectScope
            projectId={scopeId}
            orgId={orgId}
            onClear={conversationId == null && !waiting ? onClearProject : undefined}
          />
        )}
      </div>

      <div className="chat-messages" ref={listRef}>
        {isEmpty ? (
          <ChatEmptyState onPick={chat.ask} disabled={waiting} />
        ) : (
          <ol className="message-list" aria-live="polite">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} orgId={orgId} />
            ))}
            {waiting && (
              <>
                <li className="message message-user">
                  <div className="bubble">
                    <p className="message-text">{chat.pendingQuestion}</p>
                  </div>
                </li>
                <li className="message message-assistant">
                  <div className="bubble bubble-pending">Searching your tasks…</div>
                </li>
              </>
            )}
          </ol>
        )}
      </div>

      {chat.error?.message && (
        <div className="notice error-notice chat-error" role="alert">
          <span>{chat.error.message}</span>
          {chat.error.retryable && (
            <button type="button" className="secondary" onClick={chat.retry}>
              Retry
            </button>
          )}
        </div>
      )}
      <ChatInput
        inputRef={inputRef}
        value={chat.draft}
        onChange={chat.setDraft}
        onSubmit={chat.ask}
        disabled={waiting}
        errors={[...(chat.error?.fields.question ?? []), ...(chat.error?.fields.project_id ?? [])]}
      />
    </div>
  )
}
