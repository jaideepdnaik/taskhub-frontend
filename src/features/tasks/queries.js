import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCurrentOrgId } from '../orgs/queries'
import { createTask, fetchAllProjectTasks, fetchProjectTasks, moveTask } from './api'
import { applyMove } from './boardLogic'

export const taskKeys = {
  all: (orgId) => ['org', orgId, 'tasks'],
  board: (orgId, projectId) => [...taskKeys.all(orgId), 'board', projectId],
  lists: (orgId) => [...taskKeys.all(orgId), 'list'],
  list: (orgId, projectId, filters) => [...taskKeys.lists(orgId), projectId, filters],
  detail: (orgId, taskId) => [...taskKeys.all(orgId), 'detail', taskId],
}

// Every task in the project, as a flat array (see boardLogic.js for grouping).
export function useBoardTasks(projectId) {
  const orgId = useCurrentOrgId()
  return useQuery({
    queryKey: taskKeys.board(orgId, projectId),
    queryFn: () => fetchAllProjectTasks(projectId),
  })
}

// One filtered, paginated page of the project's tasks (the list view).
export function useTaskList(projectId, filters) {
  const orgId = useCurrentOrgId()
  return useQuery({
    queryKey: taskKeys.list(orgId, projectId, filters),
    queryFn: () => fetchProjectTasks(projectId, filters),
    placeholderData: keepPreviousData,
  })
}

export function useCreateTask(projectId) {
  const orgId = useCurrentOrgId()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload) => createTask(projectId, payload),
    onSuccess: (task) => {
      // The server put it at the bottom of its column; show it right away.
      queryClient.setQueryData(taskKeys.board(orgId, projectId), (tasks) =>
        tasks ? [...tasks, task] : tasks,
      )
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: taskKeys.board(orgId, projectId) }),
        queryClient.invalidateQueries({ queryKey: taskKeys.lists(orgId) }),
      ])
    },
  })
}

// Drag and drop: move the card in the cache immediately, roll back if the
// server refuses, and refetch afterwards either way so positions match the server.
export function useMoveTask(projectId) {
  const orgId = useCurrentOrgId()
  const queryClient = useQueryClient()
  const boardKey = taskKeys.board(orgId, projectId)

  return useMutation({
    mutationKey: ['moveTask', orgId, projectId],
    mutationFn: ({ taskId, status, position }) => moveTask(taskId, { status, position }),
    onMutate: async ({ taskId, status, position }) => {
      await queryClient.cancelQueries({ queryKey: boardKey })
      const previous = queryClient.getQueryData(boardKey)
      queryClient.setQueryData(boardKey, (tasks) =>
        tasks ? applyMove(tasks, taskId, status, position) : tasks,
      )
      return { previous }
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(boardKey, context.previous)
    },
    onSettled: (_data, _error, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(orgId, taskId) })
      queryClient.invalidateQueries({ queryKey: taskKeys.lists(orgId) })
      // If the user dragged again before this one finished, refetching now would
      // overwrite that newer optimistic state. The last move to settle refetches.
      if (queryClient.isMutating({ mutationKey: ['moveTask', orgId, projectId] }) === 1) {
        return queryClient.invalidateQueries({ queryKey: boardKey })
      }
      return undefined
    },
  })
}
