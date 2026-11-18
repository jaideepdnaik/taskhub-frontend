export const SOURCE_ICONS = { task: '📋', comment: '💬', project: '📁' }

// Where a cited source lives in this app. Tasks (and their comments) open in
// the board's task drawer; projects open their detail page.
export function citationHref(orgId, citation) {
  const project = `/org/${orgId}/projects/${citation.project_id}`
  return citation.task_id ? `${project}/board?task=${citation.task_id}` : project
}

// Answers mark sources as [n]. Turn each marker we have a citation for into a
// Markdown link to "#cite-n", which MessageContent renders as a chip. Markers
// without a citation (a source the user can no longer see) stay plain text.
// "[n](...)" is already a link, so it's left alone.
export function linkCitationMarkers(text, citations) {
  const known = new Set(citations.map((c) => c.index))
  return text.replace(/\[(\d+)\](?!\()/g, (marker, n) =>
    known.has(Number(n)) ? `[\\[${n}\\]](#cite-${n})` : marker,
  )
}

export const citationIndexFromHref = (href) => {
  const match = href?.match(/^#cite-(\d+)$/)
  return match ? Number(match[1]) : null
}
