const EXAMPLES = [
  "What's overdue?",
  "What's blocking the release?",
  "Summarize this week's discussion",
  'What changed in the last few days?',
]

// Shown in a new chat: what the assistant does, plus example prompts to send.
export default function ChatEmptyState({ onPick, disabled }) {
  return (
    <div className="chat-empty">
      <h2>Ask TaskHub</h2>
      <p className="muted">
        Answers come from the tasks, comments and projects you can see, with links to the
        sources.
      </p>
      <div className="example-prompts">
        {EXAMPLES.map((text) => (
          <button
            key={text}
            type="button"
            className="secondary"
            disabled={disabled}
            onClick={() => onPick(text)}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  )
}
