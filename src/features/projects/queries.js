import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCurrentOrgId } from '../orgs/queries'
import {
  addProjectMember,
  createProject,
  deleteProject,
  fetchProject,
  fetchProjects,
  removeProjectMember,
  setProjectArchived,
  updateProject,
} from './api'

export const projectKeys = {
  all: (orgId) => ['org', orgId, 'projects'],
  lists: (orgId) => [...projectKeys.all(orgId), 'list'],
  list: (orgId, filters) => [...projectKeys.lists(orgId), filters],
  detail: (orgId, projectId) => [...projectKeys.all(orgId), 'detail', projectId],
}

// filters: {page, search, archived}
export function useProjects(filters) {
  const orgId = useCurrentOrgId()
  return useQuery({
    queryKey: projectKeys.list(orgId, filters),
    queryFn: () => fetchProjects(filters),
    placeholderData: keepPreviousData, // keep the old page visible while paging
  })
}

export function useProject(projectId) {
  const orgId = useCurrentOrgId()
  return useQuery({
    queryKey: projectKeys.detail(orgId, projectId),
    queryFn: () => fetchProject(projectId),
  })
}

// Mutations that return the project detail: store it, refresh the lists.
function useDetailMutation(mutationFn) {
  const orgId = useCurrentOrgId()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn,
    onSuccess: (project) => {
      queryClient.setQueryData(projectKeys.detail(orgId, project.id), project)
      return queryClient.invalidateQueries({ queryKey: projectKeys.lists(orgId) })
    },
  })
}

// Create when projectId is null, otherwise update. One hook so forms that do
// both don't call hooks conditionally.
export const useSaveProject = (projectId) =>
  useDetailMutation((payload) =>
    projectId == null ? createProject(payload) : updateProject(projectId, payload),
  )

export const useSetProjectArchived = (projectId) =>
  useDetailMutation((archived) => setProjectArchived(projectId, archived))

// `onDeleted` runs before the cached detail is dropped, so a page showing the
// project can navigate away first instead of refetching it (and getting a 404).
export function useDeleteProject(projectId, { onDeleted } = {}) {
  const orgId = useCurrentOrgId()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => deleteProject(projectId),
    onSuccess: () => {
      onDeleted?.()
      queryClient.removeQueries({ queryKey: projectKeys.detail(orgId, projectId) })
      return queryClient.invalidateQueries({ queryKey: projectKeys.lists(orgId) })
    },
  })
}

// Adding/removing members changes the detail's member list and the lists'
// member_count. Removing one also unassigns them from the project's tasks
// (a backend signal), so cached tasks are stale too.
function useMemberMutation(projectId, mutationFn) {
  const orgId = useCurrentOrgId()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn,
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: projectKeys.detail(orgId, projectId) }),
        queryClient.invalidateQueries({ queryKey: projectKeys.lists(orgId) }),
        // Same as taskKeys.all(orgId); spelled out to avoid importing the tasks feature.
        queryClient.invalidateQueries({ queryKey: ['org', orgId, 'tasks'] }),
      ]),
  })
}

export const useAddProjectMember = (projectId) =>
  useMemberMutation(projectId, (userId) => addProjectMember(projectId, userId))

export const useRemoveProjectMember = (projectId) =>
  useMemberMutation(projectId, (userId) => removeProjectMember(projectId, userId))
