import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { authKeys, useMe } from '../auth/queries'
import { createOrganization, fetchOrgMembers } from './api'
import { selectCurrentOrgId } from './orgSlice'

// The user's orgs come from /auth/me/ (each with the user's role), so the
// switcher needs no separate request. Org-scoped data uses keys that start with
// ['org', orgId], e.g. ['org', orgId, 'projects', ...].
export const orgKeys = {
  all: ['org'],
  detail: (orgId) => ['org', orgId],
  members: (orgId, filters) => ['org', orgId, 'members', filters],
}

export const useCurrentOrgId = () => useSelector(selectCurrentOrgId)

export function useMyOrgs() {
  const query = useMe()
  return { ...query, data: query.data?.organizations }
}

// {id, name, slug, role} for the org in the URL, or undefined while loading.
export function useCurrentOrg() {
  const orgId = useCurrentOrgId()
  const { data: orgs } = useMyOrgs()
  return orgs?.find((org) => org.id === orgId)
}

// filters: {search, page}. Pass enabled=false to hold off until needed.
export function useOrgMembers(filters, { enabled = true } = {}) {
  const orgId = useCurrentOrgId()
  return useQuery({
    queryKey: orgKeys.members(orgId, filters),
    queryFn: () => fetchOrgMembers(filters),
    placeholderData: keepPreviousData,
    enabled,
  })
}

export function useCreateOrganization() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createOrganization,
    // Wait for /me to include the new org before the caller navigates to it.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: authKeys.me() }),
  })
}
