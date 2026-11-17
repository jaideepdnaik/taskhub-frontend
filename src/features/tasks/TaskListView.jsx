import ErrorState from '../../components/ErrorState'
import Pagination from '../../components/Pagination'
import { useTaskList } from './queries'
import TaskFilters from './TaskFilters'
import TaskRow from './TaskRow'
import { toApiParams, useTaskFilters } from './useTaskFilters'

export default function TaskListView({ project }) {
  const { filters, setFilters, clearFilters, isFiltered } = useTaskFilters()
  const { data, isPending, isError, error, refetch, isPlaceholderData } = useTaskList(
    project.id,
    toApiParams(filters),
  )

  let body
  if (isPending) body = <p className="muted">Loading tasks…</p>
  else if (isError) body = <ErrorState title="Couldn't load tasks." error={error} onRetry={refetch} />
  else if (data.results.length === 0) {
    body = (
      <p className="empty">
        {isFiltered ? 'No tasks match these filters.' : 'No tasks in this project yet.'}
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
                <th>Status</th>
                <th>Priority</th>
                <th>Assignee</th>
                <th>Due</th>
              </tr>
            </thead>
            <tbody>
              {data.results.map((task) => (
                <TaskRow key={task.id} task={task} />
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
      <TaskFilters
        filters={filters}
        onChange={setFilters}
        onClear={clearFilters}
        isFiltered={isFiltered}
        members={project.members}
      />
      {body}
    </>
  )
}
