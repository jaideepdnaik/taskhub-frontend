import MyTaskList from '../features/tasks/MyTaskList'

export default function MyTasksPage() {
  return (
    <section className="page">
      <div className="page-header">
        <h1>My Tasks</h1>
      </div>
      <MyTaskList />
    </section>
  )
}
