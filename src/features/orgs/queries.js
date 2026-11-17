import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { authKeys, useMe } from '../auth/queries'
import { createOrganization } from './api'
import { selectCurrentOrgId } from './orgSlice'

// The user's orgs come from /auth/me/ (each with the user's role), so the
// switcher needs no separate request. Org-scoped data uses keys that start with
// orgId, e.g. ['org', orgId, 'projects', ...].
export const orgKeys = {
  all: ['org'],
  detail: (orgId) => ['org', orgId],
}

export function useMyOrgs() {
  const query = useMe()
  return { ...query, data: query.data?.organizations }
}

// {id, name, slug, role} for the org in the URL, or undefined while loading.
export function useCurrentOrg() {
  const orgId = useSelector(selectCurrentOrgId)
  const { data: orgs } = useMyOrgs()
  return orgs?.find((org) => org.id === orgId)
}

export function useCreateOrganization() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createOrganization,
    // Wait for /me to include the new org before the caller navigates to it.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: authKeys.me() }),
  })
}
