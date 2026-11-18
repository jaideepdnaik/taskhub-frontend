import { Link } from 'react-router-dom'
import { citationHref } from './citations'

// A small numbered link to a cited source; hovering shows its title and excerpt.
export default function CitationChip({ citation, orgId }) {
  return (
    <Link
      className="citation-chip"
      to={citationHref(orgId, citation)}
      title={`${citation.title}\n\n${citation.excerpt}`}
      aria-label={`Source ${citation.index}: ${citation.title}`}
    >
      {citation.index}
    </Link>
  )
}
