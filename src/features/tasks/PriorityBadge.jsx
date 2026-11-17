import { priorityLabel } from './constants'

export default function PriorityBadge({ priority }) {
  return <span className={`priority priority-${priority}`}>{priorityLabel(priority)}</span>
}
