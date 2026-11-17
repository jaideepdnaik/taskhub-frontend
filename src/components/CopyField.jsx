import { useRef, useState } from 'react'

// A read-only text box with a Copy button (e.g. an invite link).
export default function CopyField({ label, value }) {
  const inputRef = useRef(null)
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard blocked (e.g. not a secure context): select it for Ctrl+C.
      inputRef.current?.select()
    }
  }

  return (
    <div className="field">
      <span>{label}</span>
      <div className="copy-field">
        <input ref={inputRef} readOnly value={value} onFocus={(e) => e.target.select()} />
        <button type="button" className="secondary" onClick={copy}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </div>
  )
}
