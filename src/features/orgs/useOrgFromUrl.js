import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { currentOrgChanged, selectCurrentOrgId } from './orgSlice'
import { useMyOrgs } from './queries'

// Copy /org/:orgId into Redux once we know the user is a member.
// `status` is 'loading' | 'error' | 'not-found' | 'ready'. Org-scoped children
// must only render when 'ready', so their requests carry the right X-Org-ID.
export function useOrgFromUrl() {
  const dispatch = useDispatch()
  const { orgId: param } = useParams()
  const orgId = Number(param)
  const currentOrgId = useSelector(selectCurrentOrgId)
  const { data: orgs, isLoading, isError, error, refetch } = useMyOrgs()
  const org = orgs?.find((o) => o.id === orgId)

  useEffect(() => {
    if (org && currentOrgId !== org.id) dispatch(currentOrgChanged(org.id))
  }, [dispatch, org, currentOrgId])

  let status = 'ready'
  if (isLoading) status = 'loading'
  else if (isError) status = 'error'
  else if (!org) status = 'not-found'
  else if (currentOrgId !== org.id) status = 'loading'

  return { status, org, error, refetch }
}
