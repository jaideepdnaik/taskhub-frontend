import ErrorState from '../../components/ErrorState'
import Pagination from '../../components/Pagination'
import { OPEN_STATUSES } from './constants'
import MyTaskFilters from './MyTaskFilters'
import MyTaskRow from './MyTaskRow'
import { useMyTasks } from './queries'
import { toApiParams, useTaskFilters } from './useTaskFilters'

// '' = open tasks (the default), 'any' = no status filter, else one status.
function myTaskParams(filters) {
  const params = toApiParams({ ...filters, status: '', assignee: '' })
  if (filters.status === '') params.status = OPEN_STATUSES
  else if (filters.status !== 'any') params.status = filters.status
  return params
}

export default function MyTaskList() {
  const { filters, setFilters, clearFilters, isFiltered } = useTaskFilters()
  const { data, isPending, isError, error, refetch, isPlaceholderData } = useMyTasks(
    myTaskParams(filters),
  )

  let body
  if (isPending) body = <p className="muted">Loading your tasks…</p>
  else if (isError) body = <ErrorState title="Couldn't load your tasks." error={error} onRetry={refetch} />
  else if (data.results.length === 0) {
    body = (
      <p className="empty">
        {isFiltered ? 'No tasks match these filters.' : 'Nothing assigned to you right now. 🎉'}
      </p>
    )
  } else {
    body = (
      <>
        <div className={`table-wrap${isPlaceholderData ? ' is-stale' : ''}`}>
          <table className="task-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Project</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Due</th>
              </tr>
            </thead>
            <tbody>
              {data.results.map((task) => (
                <MyTaskRow key={task.id} task={task} />
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
          page={filters.page}
          data={data}
          onPageChange={(page) => setFilters({ page })}
          disabled={isPlaceholderData}
        />
      </>
    )
  }

  return (
    <>
      <MyTaskFilters
        filters={filters}
        onChange={setFilters}
        onClear={clearFilters}
        isFiltered={isFiltered}
      />
      {body}
    </>
  )
}
