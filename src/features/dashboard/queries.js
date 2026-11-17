import { useQuery } from '@tanstack/react-query'
import { useCurrentOrgId } from '../orgs/queries'
import { fetchDashboard } from './api'

export const dashboardKeys = {
  all: (orgId) => ['org', orgId, 'dashboard'],
}

// Stats change with every task edit elsewhere, so refetch whenever the page mounts.
export function useDashboard() {
  const orgId = useCurrentOrgId()
  return useQuery({
    queryKey: dashboardKeys.all(orgId),
    queryFn: fetchDashboard,
    refetchOnMount: 'always',
  })
}
