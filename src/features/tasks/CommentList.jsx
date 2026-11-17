import ErrorState from '../../components/ErrorState'
import { useMe } from '../auth/queries'
import { usePermissions } from '../orgs/usePermissions'
import CommentForm from './CommentForm'
import CommentItem from './CommentItem'
import { useComments } from './queries'

// Mirrors CanComment: viewers read only; edit = author; delete = author or admin.
export default function CommentList({ task, editable }) {
  const { data: me } = useMe()
  const { isAdmin } = usePermissions()
  const { data, isPending, isError, error, refetch, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useComments(task.id)

  let list
  if (isPending) list = <p className="muted">Loading comments…</p>
  else if (isError) list = <ErrorState title="Couldn't load comments." error={error} onRetry={refetch} />
  else {
    const comments = data.pages.flatMap((page) => page.results)
    list =
      comments.length === 0 ? (
        <p className="muted">No comments yet.</p>
      ) : (
        <ul className="comment-list">
          {comments.map((comment) => {
            const isAuthor = comment.author?.id === me?.id
            return (
              <CommentItem
                key={comment.id}
                comment={comment}
                task={task}
                canEdit={editable && isAuthor}
                canDelete={editable && (isAuthor || isAdmin)}
              />
            )
          })}
        </ul>
      )
  }

  return (
    <div className="comments">
      {list}
      {hasNextPage && (
        <button className="secondary" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? 'Loading…' : 'Load newer comments'}
        </button>
      )}
      {editable && <CommentForm task={task} />}
    </div>
  )
}
