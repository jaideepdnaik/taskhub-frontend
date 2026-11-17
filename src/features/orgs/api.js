import { api } from '../../api/client'

// POST /organizations/ {name} -> Organization (the caller becomes its owner).
// Not scoped by X-Org-ID.
export const createOrganization = (payload) =>
  api.post('/organizations/', payload).then((res) => res.data)

// GET /members/?search= -> {count, next, previous, results: [{id, user, role, joined_at}]}
// Members of the current org (X-Org-ID).
export const fetchOrgMembers = ({ search, page }) =>
  api
    .get('/members/', { params: { search: search || undefined, page } })
    .then((res) => res.data)

// --- organization (not scoped by X-Org-ID; the id is in the URL) -------------

// PATCH /organizations/:id/ {name} -> organization. Owner/admin.
export const updateOrganization = (orgId, payload) =>
  api.patch(`/organizations/${orgId}/`, payload).then((res) => res.data)

// DELETE /organizations/:id/. Owner only; deletes every project and task in it.
export const deleteOrganization = (orgId) => api.delete(`/organizations/${orgId}/`)

// --- members (X-Org-ID) -----------------------------------------------------

// PATCH /members/:id/ {role} -> membership. `id` is the membership id, not the user id.
export const updateMemberRole = (membershipId, role) =>
  api.patch(`/members/${membershipId}/`, { role }).then((res) => res.data)

// DELETE /members/:id/. Removing yourself leaves the org.
export const removeMember = (membershipId) => api.delete(`/members/${membershipId}/`)

// --- invitations (X-Org-ID, owner/admin) --------------------------------------

// GET /invitations/?status=pending|accepted|expired -> paginated
export const fetchInvitations = ({ status, page }) =>
  api
    .get('/invitations/', { params: { status: status || undefined, page } })
    .then((res) => res.data)

// POST /invitations/ {email, role} -> invitation with a one-time `accept_url`.
// Re-inviting an email with an open invite refreshes it (new link, 200).
export const createInvitation = (payload) =>
  api.post('/invitations/', payload).then((res) => res.data)

// DELETE /invitations/:id/. Accepted invitations can't be revoked.
export const revokeInvitation = (id) => api.delete(`/invitations/${id}/`)

// POST /invitations/accept/ {token} -> {organization: {id, name, slug}, role}. No X-Org-ID.
export const acceptInvitation = (token) =>
  api.post('/invitations/accept/', { token }).then((res) => res.data)
