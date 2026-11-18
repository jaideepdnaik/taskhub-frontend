import { useMemo } from 'react'
import Markdown from 'react-markdown'
import CitationChip from './CitationChip'
import { citationIndexFromHref, linkCitationMarkers } from './citations'

// An answer's Markdown. react-markdown escapes raw HTML (no rehype-raw), so
// model output can't inject markup. [n] markers become citation chips.
export default function MessageContent({ content, citations, orgId }) {
  const byIndex = useMemo(() => new Map(citations.map((c) => [c.index, c])), [citations])
  const markdown = useMemo(() => linkCitationMarkers(content, citations), [content, citations])

  const components = useMemo(
    () => ({
      a({ href, children }) {
        const citation = byIndex.get(citationIndexFromHref(href))
        if (citation) return <CitationChip citation={citation} orgId={orgId} />
        return (
          <a href={href} target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        )
      },
    }),
    [byIndex, orgId],
  )

  return (
    <div className="markdown">
      <Markdown components={components}>{markdown}</Markdown>
    </div>
  )
}
