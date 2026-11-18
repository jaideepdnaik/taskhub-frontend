import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCurrentOrgId } from '../orgs/queries'
import {
  askFollowUp,
  deleteConversation,
  fetchConversation,
  fetchConversations,
  startConversation,
} from './api'

export const assistantKeys = {
  all: (orgId) => ['org', orgId, 'assistant'],
  list: (orgId) => [...assistantKeys.all(orgId), 'list'],
  detail: (orgId, id) => [...assistantKeys.all(orgId), 'detail', id],
}

// The sidebar list of threads, newest first, with "Load more".
export function useConversations() {
  const orgId = useCurrentOrgId()
  return useInfiniteQuery({
    queryKey: assistantKeys.list(orgId),
    queryFn: ({ pageParam }) => fetchConversations(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _pages, lastPageParam) =>
      lastPage.next ? lastPageParam + 1 : undefined,
  })
}

export function useConversation(id) {
  const orgId = useCurrentOrgId()
  return useQuery({
    queryKey: assistantKeys.detail(orgId, id),
    queryFn: () => fetchConversation(id),
    enabled: id != null,
    retry: (count, error) => error.response?.status !== 404 && count < 2,
  })
}

// Asking moves the thread to the top of the list (updated_at changes).
function useInvalidateList() {
  const orgId = useCurrentOrgId()
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: assistantKeys.list(orgId) })
}

// The response is the full conversation, so store it as the detail.
export function useStartConversation() {
  const orgId = useCurrentOrgId()
  const queryClient = useQueryClient()
  const invalidateList = useInvalidateList()
  return useMutation({
    mutationFn: startConversation,
    onSuccess: (conversation) => {
      queryClient.setQueryData(assistantKeys.detail(orgId, conversation.id), conversation)
      return invalidateList()
    },
  })
}

// Append the saved question and answer to the cached thread.
export function useAskFollowUp() {
  const orgId = useCurrentOrgId()
  const queryClient = useQueryClient()
  const invalidateList = useInvalidateList()
  return useMutation({
    mutationFn: askFollowUp,
    onSuccess: ({ question, answer }, { conversationId }) => {
      queryClient.setQueryData(assistantKeys.detail(orgId, conversationId), (old) =>
        old ? { ...old, messages: [...old.messages, question, answer] } : old,
      )
      return invalidateList()
    },
    onError: (error, { conversationId }) => {
      // Deleted elsewhere: refetch so the thread shows "Conversation not found".
      if (error.response?.status === 404) {
        queryClient.invalidateQueries({ queryKey: assistantKeys.detail(orgId, conversationId) })
        invalidateList()
      }
    },
  })
}

export function useDeleteConversation() {
  const orgId = useCurrentOrgId()
  const queryClient = useQueryClient()
  const invalidateList = useInvalidateList()
  return useMutation({
    mutationFn: deleteConversation,
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: assistantKeys.detail(orgId, id) })
      return invalidateList()
    },
  })
}
