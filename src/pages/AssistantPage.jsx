import { useParams, useSearchParams } from 'react-router-dom'
import ChatThread from '../features/assistant/ChatThread'
import ConversationList from '../features/assistant/ConversationList'

// /org/:orgId/assistant[/:conversationId][?project=<id>]
export default function AssistantPage() {
  const conversationId = Number(useParams().conversationId) || null
  const [params, setParams] = useSearchParams()
  const projectId = Number(params.get('project')) || null

  return (
    <section className={`assistant${conversationId ? ' thread-open' : ''}`}>
      <ConversationList activeId={conversationId} />
      <ChatThread
        // A fresh thread (input, pending question, errors) per conversation.
        key={conversationId ?? `new-${projectId ?? 'org'}`}
        conversationId={conversationId}
        projectId={projectId}
        onClearProject={() => setParams({}, { replace: true })}
      />
    </section>
  )
}
