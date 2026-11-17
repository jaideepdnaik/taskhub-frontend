import { Link, useParams } from 'react-router-dom'

// 404 inside an org, shown within the app shell instead of a blank page.
export default function NotFoundSection() {
  const { orgId } = useParams()
  return (
    <section className="state">
      <h1>Page not found</h1>
      <Link to={`/org/${orgId}`}>Back to the dashboard</Link>
    </section>
  )
}
