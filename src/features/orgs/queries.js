import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { authKeys, useMe } from '../auth/queries'
import {
  acceptInvitation,
  createInvitation,
  createOrganization,
  deleteOrganization,
  fetchInvitations,
  fetchOrgMembers,
  removeMember,
  revokeInvitation,
  updateMemberRole,
  updateOrganization,
} from './api'
import { selectCurrentOrgId } from './orgSlice'

// The user's orgs come from /auth/me/ (each with the user's role), so the
// switcher needs no separate request. Org-scoped data uses keys that start with
// ['org', orgId], e.g. ['org', orgId, 'projects', ...].
export const orgKeys = {
  all: ['org'],
  detail: (orgId) => ['org', orgId],
  // Without `filters`, these match every filtered variant (for invalidation).
  members: (orgId, filters) => ['org', orgId, 'members', ...(filters ? [filters] : [])],
  invitations: (orgId, filters) => ['org', orgId, 'invitations', ...(filters ? [filters] : [])],
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

// --- settings ---------------------------------------------------------------

// Drop an org the user no longer belongs to (left or deleted): leave its pages
// first, then remove it from /me, so nothing renders "organization not found".
export function useForgetOrg() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  return (orgId) => {
    navigate('/', { replace: true })
    queryClient.setQueryData(authKeys.me(), (me) =>
      me ? { ...me, organizations: me.organizations.filter((o) => o.id !== orgId) } : me,
    )
    return queryClient.invalidateQueries({ queryKey: authKeys.me() })
  }
}

export function useUpdateOrganization(orgId) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload) => updateOrganization(orgId, payload),
    // The name shows in the switcher and sidebar, both fed by /me.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: authKeys.me() }),
  })
}

export function useDeleteOrganization(orgId) {
  const forgetOrg = useForgetOrg()
  return useMutation({
    mutationFn: () => deleteOrganization(orgId),
    onSuccess: () => forgetOrg(orgId),
  })
}

export function useUpdateMemberRole() {
  const orgId = useCurrentOrgId()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ membershipId, role }) => updateMemberRole(membershipId, role),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: orgKeys.members(orgId) }),
  })
}

// A removed member also disappears from projects and assignee lists, so
// refresh all of this org's cached data, not just the member list.
export function useRemoveMember() {
  const orgId = useCurrentOrgId()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: removeMember,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: orgKeys.detail(orgId) }),
  })
}

// Leaving = removing your own membership, then forgetting the org.
export function useLeaveOrg(orgId) {
  const forgetOrg = useForgetOrg()
  return useMutation({
    mutationFn: (membershipId) => removeMember(membershipId),
    onSuccess: () => forgetOrg(orgId),
  })
}

export function useInvitations(filters) {
  const orgId = useCurrentOrgId()
  return useQuery({
    queryKey: orgKeys.invitations(orgId, filters),
    queryFn: () => fetchInvitations(filters),
    placeholderData: keepPreviousData,
  })
}

function useInvitationMutation(mutationFn) {
  const orgId = useCurrentOrgId()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: orgKeys.invitations(orgId) }),
  })
}

export const useCreateInvitation = () => useInvitationMutation(createInvitation)
export const useRevokeInvitation = () => useInvitationMutation(revokeInvitation)

// Joining adds an org to /me; wait for it so the caller can navigate there.
export function useAcceptInvitation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: acceptInvitation,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: authKeys.me() }),
  })
}
