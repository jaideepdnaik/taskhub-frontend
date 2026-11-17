import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useCurrentOrgId } from '../orgs/queries'
import {
  addComment,
  createTask,
  deleteComment,
  deleteTask,
  editComment,
  fetchActivity,
  fetchAllProjectTasks,
  fetchComments,
  fetchMyTasks,
  fetchProjectTasks,
  fetchTasks,
  fetchTask,
  moveTask,
  updateTask,
} from './api'
import { applyMove } from './boardLogic'

export const taskKeys = {
  all: (orgId) => ['org', orgId, 'tasks'],
  board: (orgId, projectId) => [...taskKeys.all(orgId), 'board', projectId],
  lists: (orgId) => [...taskKeys.all(orgId), 'list'],
  list: (orgId, projectId, filters) => [...taskKeys.lists(orgId), projectId, filters],
  detail: (orgId, taskId) => [...taskKeys.all(orgId), 'detail', taskId],
  // Under the detail key, so invalidating a task also refreshes its history.
  comments: (orgId, taskId) => [...taskKeys.detail(orgId, taskId), 'comments'],
  activity: (orgId, taskId) => [...taskKeys.detail(orgId, taskId), 'activity'],
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

// --- task detail (the drawer) ----------------------------------------------

export function useTask(taskId) {
  const orgId = useCurrentOrgId()
  return useQuery({
    queryKey: taskKeys.detail(orgId, taskId),
    queryFn: () => fetchTask(taskId),
    enabled: taskId != null,
  })
}

// After any change to a task, the board, the lists and its activity are stale.
function useInvalidateTask(projectId) {
  const orgId = useCurrentOrgId()
  const queryClient = useQueryClient()
  return (taskId) =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(orgId, taskId) }),
      queryClient.invalidateQueries({ queryKey: taskKeys.board(orgId, projectId) }),
      queryClient.invalidateQueries({ queryKey: taskKeys.lists(orgId) }),
    ])
}

export function useUpdateTask(taskId, projectId) {
  const orgId = useCurrentOrgId()
  const queryClient = useQueryClient()
  const invalidate = useInvalidateTask(projectId)
  return useMutation({
    mutationFn: (changes) => updateTask(taskId, changes),
    onSuccess: (task) => {
      queryClient.setQueryData(taskKeys.detail(orgId, taskId), task)
      return invalidate(taskId)
    },
  })
}

// `onDeleted` runs before the cached task is dropped, so the drawer can close
// first instead of refetching a task that no longer exists.
export function useDeleteTask(taskId, projectId, { onDeleted } = {}) {
  const orgId = useCurrentOrgId()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => deleteTask(taskId),
    onSuccess: () => {
      onDeleted?.()
      queryClient.removeQueries({ queryKey: taskKeys.detail(orgId, taskId) })
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: taskKeys.board(orgId, projectId) }),
        queryClient.invalidateQueries({ queryKey: taskKeys.lists(orgId) }),
      ])
    },
  })
}

// --- comments and activity --------------------------------------------------

// Both endpoints are paginated; pages are numbered from 1.
const nextPage = (lastPage, allPages) => (lastPage.next ? allPages.length + 1 : undefined)

// Oldest first; "load more" fetches newer pages.
export function useComments(taskId) {
  const orgId = useCurrentOrgId()
  return useInfiniteQuery({
    queryKey: taskKeys.comments(orgId, taskId),
    queryFn: ({ pageParam }) => fetchComments(taskId, pageParam),
    initialPageParam: 1,
    getNextPageParam: nextPage,
  })
}

// Newest first; "load more" fetches older pages.
export function useActivity(taskId) {
  const orgId = useCurrentOrgId()
  return useInfiniteQuery({
    queryKey: taskKeys.activity(orgId, taskId),
    queryFn: ({ pageParam }) => fetchActivity(taskId, pageParam),
    initialPageParam: 1,
    getNextPageParam: nextPage,
  })
}

// Posting changes comment_count on cards and adds an activity entry, so the
// whole task is invalidated (which includes its comments and activity).
export function useAddComment(taskId, projectId) {
  const invalidate = useInvalidateTask(projectId)
  return useMutation({
    mutationFn: (body) => addComment(taskId, body),
    onSuccess: () => invalidate(taskId),
  })
}

export function useEditComment(taskId) {
  const orgId = useCurrentOrgId()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ commentId, body }) => editComment(taskId, commentId, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: taskKeys.comments(orgId, taskId) }),
  })
}

export function useDeleteComment(taskId, projectId) {
  const invalidate = useInvalidateTask(projectId)
  return useMutation({
    mutationFn: (commentId) => deleteComment(taskId, commentId),
    onSuccess: () => invalidate(taskId),
  })
}

// --- my tasks ----------------------------------------------------------------

// Tasks assigned to me across the org's projects. Keyed under `lists`, so
// anything that invalidates task lists refreshes it too.
export function useMyTasks(filters) {
  const orgId = useCurrentOrgId()
  return useQuery({
    queryKey: [...taskKeys.lists(orgId), 'mine', filters],
    queryFn: () => fetchMyTasks(filters),
    placeholderData: keepPreviousData,
  })
}

// The most overdue open tasks across the org (oldest due date first).
export function useOverdueTasks(limit = 5) {
  const orgId = useCurrentOrgId()
  const filters = { overdue: 'true', ordering: 'due_date', page_size: limit }
  return useQuery({
    queryKey: [...taskKeys.lists(orgId), 'overdue', filters],
    queryFn: () => fetchTasks(filters),
    refetchOnMount: 'always',
  })
}
