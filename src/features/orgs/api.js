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
