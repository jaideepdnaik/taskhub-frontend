import { Link } from 'react-router-dom'
import { SOURCE_ICONS, citationHref } from './citations'

// The "Sources" list under an answer.
export default function SourceList({ citations, orgId }) {
  if (citations.length === 0) return null
  const sorted = [...citations].sort((a, b) => a.index - b.index)

  return (
    <div className="sources">
      <p className="sources-title">Sources</p>
      <ol className="source-list">
        {sorted.map((c) => (
          <li key={c.index} className="source">
            <span className="source-index">{c.index}</span>
            <span className="source-icon" title={c.source_type} aria-hidden="true">
              {SOURCE_ICONS[c.source_type] ?? '📄'}
            </span>
            <div className="source-text">
              <Link to={citationHref(orgId, c)}>{c.title}</Link>
              <span className="muted small clamp">{c.excerpt}</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
