import { api } from '../../api/client'

// Ask TaskHub (apps/assistant). Conversations are private to the user and
// scoped to the current org (X-Org-ID).
//
// Conversation: {id, title, project_id, created_at, updated_at}
// ConversationDetail: Conversation + {messages: Message[]}
// Message: {id, role: 'user'|'assistant', content (Markdown with [n] markers),
//           citations: Citation[], created_at}
// Citation: {index, source_type: 'task'|'comment'|'project', project_id,
//            task_id, comment_id, title, excerpt}

// Answers come from an LLM and can take 5-30 seconds.
const ASK_TIMEOUT_MS = 130_000

// GET /assistant/conversations/?page= -> paginated, most recently updated first
export const fetchConversations = (page) =>
  api.get('/assistant/conversations/', { params: { page } }).then((res) => res.data)

// GET /assistant/conversations/:id/ -> ConversationDetail
export const fetchConversation = (id) =>
  api.get(`/assistant/conversations/${id}/`).then((res) => res.data)

// POST /assistant/conversations/ {question, project_id?} -> 201 ConversationDetail
export const startConversation = ({ question, projectId }) =>
  api
    .post(
      '/assistant/conversations/',
      { question, project_id: projectId ?? null },
      { timeout: ASK_TIMEOUT_MS },
    )
    .then((res) => res.data)

// POST /assistant/conversations/:id/messages/ {question} -> 201 {question, answer}
export const askFollowUp = ({ conversationId, question }) =>
  api
    .post(
      `/assistant/conversations/${conversationId}/messages/`,
      { question },
      { timeout: ASK_TIMEOUT_MS },
    )
    .then((res) => res.data)

export const deleteConversation = (id) => api.delete(`/assistant/conversations/${id}/`)
