// Mirrors MembershipPermission (apps/organizations/permissions.py):
// - the owner's membership can't be changed or removed here;
// - owner/admin can change roles and remove members;
// - only the owner can change or remove an admin;
// - any non-owner can leave (remove themselves).

// Roles that can be given out (never owner). Order: most to least access.
export const ASSIGNABLE_ROLES = [
  { value: 'admin', label: 'Admin' },
  { value: 'member', label: 'Member' },
  { value: 'viewer', label: 'Viewer' },
]

export const ROLE_HELP = {
  owner: 'Everything, including deleting the organization',
  admin: 'Manage projects, members and invitations',
  member: 'Create and edit tasks in their projects',
  viewer: 'Read-only access to their projects',
}

export function memberActions(actorRole, actorUserId, membership) {
  const isSelf = membership.user.id === actorUserId
  const actorIsAdmin = actorRole === 'owner' || actorRole === 'admin'
  const canManage =
    actorIsAdmin &&
    membership.role !== 'owner' &&
    (membership.role !== 'admin' || actorRole === 'owner')
  return {
    canChangeRole: canManage && !isSelf,
    canRemove: canManage && !isSelf,
  }
}
