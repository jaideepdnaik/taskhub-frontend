import { useState } from 'react'
import { parseApiError } from '../../api/errors'
import Avatar from '../../components/Avatar'
import ConfirmDialog from '../../components/ConfirmDialog'
import FormField from '../../components/FormField'
import { formatDateTime, formatRelative } from '../../utils/time'
import { useDeleteComment, useEditComment } from './queries'

// canEdit: the author (and the task is editable). canDelete: author or org admin.
export default function CommentItem({ comment, task, canEdit, canDelete }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(comment.body)
  const [confirming, setConfirming] = useState(false)
  const editComment = useEditComment(task.id)
  const deleteComment = useDeleteComment(task.id, task.project.id)
  const author = comment.author

  const save = () =>
    editComment.mutate(
      { commentId: comment.id, body: draft },
      { onSuccess: () => setEditing(false) },
    )

  return (
    <li className="comment">
      <Avatar user={author} size={28} />
      <div className="comment-main">
        <div className="comment-head">
          <strong>{author ? author.full_name || author.email : 'Deleted user'}</strong>
          <span className="muted small" title={formatDateTime(comment.created_at)}>
            {formatRelative(comment.created_at)}
            {comment.edited_at && ' (edited)'}
          </span>
        </div>

        {editing ? (
          <div className="comment-edit">
            <FormField
              as="textarea"
              label="Edit comment"
              rows={3}
              maxLength={5000}
              autoFocus
              value={draft}
              errors={editComment.isError ? parseApiError(editComment.error).fields.body : null}
              onChange={(e) => setDraft(e.target.value)}
            />
            {editComment.isError && !parseApiError(editComment.error).fields.body && (
              <p className="error">{parseApiError(editComment.error).message}</p>
            )}
            <div className="actions">
              <button onClick={save} disabled={editComment.isPending || !draft.trim()}>
                {editComment.isPending ? 'Saving…' : 'Save'}
              </button>
              <button
                className="secondary"
                onClick={() => {
                  setEditing(false)
                  setDraft(comment.body)
                  editComment.reset()
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="comment-body">{comment.body}</p>
        )}

        {!editing && (canEdit || canDelete) && (
          <div className="comment-actions">
            {canEdit && (
              <button className="link-button" onClick={() => setEditing(true)}>
                Edit
              </button>
            )}
            {canDelete && (
              <button
                className="link-button"
                onClick={() => {
                  deleteComment.reset()
                  setConfirming(true)
                }}
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirming}
        title="Delete comment?"
        message="This comment will be permanently deleted. This can't be undone."
        confirmLabel="Delete comment"
        danger
        pending={deleteComment.isPending}
        error={deleteComment.isError ? parseApiError(deleteComment.error).message : null}
        onConfirm={() =>
          deleteComment.mutate(comment.id, { onSuccess: () => setConfirming(false) })
        }
        onClose={() => setConfirming(false)}
      />
    </li>
  )
}
