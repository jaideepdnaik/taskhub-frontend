import { useCurrentOrg } from './queries'

// Mirrors the backend's role matrix (apps/core/permissions.py):
//   viewer - read only; member - create/edit content;
//   admin  - manage projects and members; owner - everything.
const ADMIN_ROLES = ['owner', 'admin']
const EDITOR_ROLES = [...ADMIN_ROLES, 'member']

// What the current user may do in the current org. Use it to hide or disable
// actions; the backend still enforces every rule.
export function usePermissions() {
  const role = useCurrentOrg()?.role
  return {
    role,
    isAdmin: ADMIN_ROLES.includes(role),
    canEdit: EDITOR_ROLES.includes(role),
    isOwner: role === 'owner',
  }
}
