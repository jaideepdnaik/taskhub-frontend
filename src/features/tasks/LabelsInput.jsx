import { useState } from 'react'

// Limits match TaskWriteSerializer (MAX_LABELS, max_length=50).
const MAX_LABELS = 20
const MAX_LENGTH = 50

// Chips with a text box: Enter or comma adds a label, Backspace in an empty box
// removes the last one.
export default function LabelsInput({ value, onChange, disabled, errors }) {
  const [draft, setDraft] = useState('')

  const add = () => {
    const label = draft.trim()
    if (label && !value.includes(label) && value.length < MAX_LABELS) onChange([...value, label])
    setDraft('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      add()
    } else if (e.key === 'Backspace' && !draft && value.length) {
      onChange(value.slice(0, -1))
    }
  }

  return (
    <div className="field">
      <span>Labels</span>
      <div className={`labels-input${disabled ? ' disabled' : ''}`}>
        {value.map((label) => (
          <span key={label} className="label">
            {label}
            {!disabled && (
              <button
                type="button"
                className="chip-remove"
                aria-label={`Remove label ${label}`}
                onClick={() => onChange(value.filter((l) => l !== label))}
              >
                ×
              </button>
            )}
          </span>
        ))}
        {!disabled && value.length < MAX_LABELS && (
          <input
            aria-label="Add a label"
            placeholder={value.length ? '' : 'Add labels…'}
            maxLength={MAX_LENGTH}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={add}
          />
        )}
        {disabled && value.length === 0 && <span className="muted">None</span>}
      </div>
      {errors?.map((message) => (
        <span key={message} className="field-error">
          {message}
        </span>
      ))}
    </div>
  )
}
