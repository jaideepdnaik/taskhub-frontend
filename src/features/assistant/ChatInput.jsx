export const QUESTION_MAX_LENGTH = 2000 // AskSerializer

// Enter sends, Shift+Enter adds a line.
export default function ChatInput({ value, onChange, onSubmit, disabled, errors, inputRef }) {
  const send = () => {
    if (!disabled && value.trim()) onSubmit(value)
  }

  return (
    <form
      className="chat-input"
      onSubmit={(e) => {
        e.preventDefault()
        send()
      }}
    >
      <textarea
        ref={inputRef}
        aria-label="Ask a question"
        placeholder="Ask about your tasks, projects and discussions…"
        rows={2}
        maxLength={QUESTION_MAX_LENGTH}
        value={value}
        disabled={disabled}
        aria-invalid={errors?.length ? true : undefined}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault()
            send()
          }
        }}
      />
      <div className="chat-input-footer">
        <span className="muted small">
          {value.length}/{QUESTION_MAX_LENGTH} · Shift+Enter for a new line
        </span>
        <button type="submit" disabled={disabled || !value.trim()}>
          {disabled ? 'Thinking…' : 'Send'}
        </button>
      </div>
      {errors?.map((message) => (
        <span key={message} className="field-error">
          {message}
        </span>
      ))}
    </form>
  )
}
