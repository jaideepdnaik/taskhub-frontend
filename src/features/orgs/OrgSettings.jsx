import { useSearchParams } from 'react-router-dom'
import InvitationList from './InvitationList'
import InviteForm from './InviteForm'
import MemberList from './MemberList'
import OrgGeneralSettings from './OrgGeneralSettings'
import { usePermissions } from './usePermissions'

// Tabs in the URL (?tab=members|invitations|general). Invitations are owner/admin only.
export default function OrgSettings() {
  const { isAdmin } = usePermissions()
  const [params, setParams] = useSearchParams()
  const tabs = [
    { key: 'members', label: 'Members' },
    ...(isAdmin ? [{ key: 'invitations', label: 'Invitations' }] : []),
    { key: 'general', label: 'General' },
  ]
  const requested = params.get('tab')
  const tab = tabs.some((t) => t.key === requested) ? requested : 'members'

  return (
    <>
      <div className="tabs" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            className={tab === t.key ? 'selected' : ''}
            onClick={() => setParams(t.key === 'members' ? {} : { tab: t.key }, { replace: true })}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="settings-panel">
        {tab === 'members' && <MemberList />}
        {tab === 'invitations' && (
          <>
            <InviteForm />
            <InvitationList />
          </>
        )}
        {tab === 'general' && <OrgGeneralSettings />}
      </div>
    </>
  )
}
