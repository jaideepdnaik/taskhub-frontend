import { api } from '../../api/client'

// POST /organizations/ {name} -> Organization (the caller becomes its owner).
// Not scoped by X-Org-ID.
export const createOrganization = (payload) =>
  api.post('/organizations/', payload).then((res) => res.data)
