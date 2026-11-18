import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { parseApiError } from '../../api/errors'
import ConfirmDialog from '../../components/ConfirmDialog'
import ErrorState from '../../components/ErrorState'
import { useCurrentOrgId } from '../orgs/queries'
import ConversationItem from './ConversationItem'
import { useConversations, useDeleteConversation } from './queries'

// The user's threads in this org, newest first.
export default function ConversationList({ activeId }) {
  const orgId = useCurrentOrgId()
  const navigate = useNavigate()
  const { data, isPending, isError, error, refetch, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useConversations()
  const deleteConversation = useDeleteConversation()
  const [deleting, setDeleting] = useState(null)
  const conversations = data?.pages.flatMap((page) => page.results) ?? []

  const confirmDelete = () =>
    deleteConversation.mutate(deleting.id, {
      onSuccess: () => {
        if (deleting.id === activeId) navigate(`/org/${orgId}/assistant`)
        setDeleting(null)
      },
    })

  let body
  if (isPending) body = <p className="muted small">Loading conversations…</p>
  else if (isError) body = <ErrorState title="Couldn't load conversations." error={error} onRetry={refetch} />
  else if (conversations.length === 0) body = <p className="muted small">No conversations yet.</p>
  else {
    body = (
      <>
        <ul className="conversation-list">
          {conversations.map((c) => (
            <ConversationItem
              key={c.id}
              conversation={c}
              orgId={orgId}
              onDelete={(conversation) => {
                deleteConversation.reset()
                setDeleting(conversation)
              }}
            />
          ))}
        </ul>
        {hasNextPage && (
          <button
            type="button"
            className="secondary small"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? 'Loading…' : 'Load more'}
          </button>
        )}
      </>
    )
  }

  return (
    <aside className="conversation-pane" aria-label="Conversations">
      <Link className="button" to={`/org/${orgId}/assistant`}>
        + New chat
      </Link>
      {body}
      <ConfirmDialog
        open={deleting != null}
        title="Delete conversation?"
        message={`"${deleting?.title}" and all its messages will be deleted. This can't be undone.`}
        confirmLabel="Delete"
        danger
        pending={deleteConversation.isPending}
        error={deleteConversation.isError ? parseApiError(deleteConversation.error).message : null}
        onConfirm={confirmDelete}
        onClose={() => setDeleting(null)}
      />
    </aside>
  )
}
