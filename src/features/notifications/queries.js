import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  deleteNotification,
  fetchNotifications,
  fetchUnreadCount,
  markAllRead,
  markRead,
} from './api'

// User-level data, filtered by org where it matters (the org id is part of
// `filters` / the unread key), so one org's notifications never show as another's.
export const notificationKeys = {
  all: ['notifications'],
  list: (filters) => ['notifications', 'list', filters],
  unreadCount: (orgId) => ['notifications', 'unread', orgId],
}

// No websockets yet, so the bell polls. Only while the tab is visible.
const POLL_MS = 30_000

export function useUnreadCount(orgId) {
  return useQuery({
    queryKey: notificationKeys.unreadCount(orgId),
    queryFn: () => fetchUnreadCount(orgId),
    enabled: orgId != null,
    refetchInterval: POLL_MS,
    refetchOnWindowFocus: true,
  })
}

// filters: {organization?, is_read?, page?, page_size?}
export function useNotifications(filters, { enabled = true, poll = false } = {}) {
  return useQuery({
    queryKey: notificationKeys.list(filters),
    queryFn: () => fetchNotifications(filters),
    placeholderData: keepPreviousData,
    enabled,
    refetchInterval: poll ? POLL_MS : false,
  })
}

// Every change can affect every list and count, so refresh them all.
function useNotificationMutation(mutationFn) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: notificationKeys.all }),
  })
}

export const useMarkRead = () => useNotificationMutation(markRead)
export const useMarkAllRead = () => useNotificationMutation(markAllRead)
export const useDeleteNotification = () => useNotificationMutation(deleteNotification)
