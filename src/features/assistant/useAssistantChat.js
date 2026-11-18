import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCurrentOrgId } from '../orgs/queries'
import { describeAskError } from './askErrors'
import { useAskFollowUp, useStartConversation } from './queries'

// Sending questions in one thread (conversationId null = a new chat).
// The pending question is shown from the mutation's variables while it runs,
// so a failed request simply stops showing it: nothing to roll back.
// Render the owner with key={conversationId} so each thread starts fresh.
export function useAssistantChat({ conversationId, projectId }) {
  const orgId = useCurrentOrgId()
  const navigate = useNavigate()
  const [draft, setDraft] = useState('')
  const start = useStartConversation()
  const followUp = useAskFollowUp()
  const mutation = conversationId == null ? start : followUp

  const ask = (text) => {
    const question = text.trim()
    if (!question || mutation.isPending) return
    setDraft('')
    // Keep the question in the input so the user can edit or retry it.
    const onError = () => setDraft((current) => current || question)

    if (conversationId == null) {
      start.mutate(
        { question, projectId },
        {
          onSuccess: (conversation) =>
            navigate(`/org/${orgId}/assistant/${conversation.id}`, { replace: true }),
          onError,
        },
      )
    } else {
      followUp.mutate({ conversationId, question }, { onError })
    }
  }

  return {
    draft,
    setDraft,
    ask,
    pendingQuestion: mutation.isPending ? mutation.variables.question : null,
    error: mutation.isError ? describeAskError(mutation.error) : null,
    retry: () => ask(draft || mutation.variables?.question || ''),
  }
}
