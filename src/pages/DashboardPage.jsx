import { useQuery } from '@tanstack/react-query'
import { api } from '../api/client'

export default function DashboardPage() {
  // Example React Query usage; swap for real endpoints as they're built.
  const { data, isLoading, isError } = useQuery({
    queryKey: ['health'],
    queryFn: () => api.get('/health/').then((res) => res.data),
  })

  return (
    <section>
      <h1>Dashboard</h1>
      <p>
        API status:{' '}
        {isLoading ? 'checking…' : isError ? 'unreachable' : data.status}
      </p>
    </section>
  )
}
