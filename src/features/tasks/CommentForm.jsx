import { useState } from 'react'
import { parseApiError } from '../../api/errors'
import FormField from '../../components/FormField'
import { useAddComment } from './queries'

const MAX_LENGTH = 5000 // CommentWriteSerializer

export default function CommentForm({ task }) {
  const [body, setBody] = useState('')
  const addComment = useAddComment(task.id, task.project.id)
  const { fields, message } = addComment.isError
    ? parseApiError(addComment.error, 'Could not post the comment.')
    : { fields: {}, message: null }

  const submit = () => {
    if (!body.trim() || addComment.isPending) return
    addComment.mutate(body, { onSuccess: () => setBody('') })
  }

  return (
    <form
      className="comment-form"
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
    >
      <FormField
        as="textarea"
        label="Add a comment"
        rows={3}
        maxLength={MAX_LENGTH}
        placeholder="Write a comment… (Ctrl+Enter to post)"
        value={body}
        errors={fields.body}
        disabled={addComment.isPending}
        onChange={(e) => setBody(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) submit()
        }}
      />
      {message && <p className="error">{message}</p>}
      <button type="submit" disabled={addComment.isPending || !body.trim()}>
        {addComment.isPending ? 'Posting…' : 'Comment'}
      </button>
    </form>
  )
}
