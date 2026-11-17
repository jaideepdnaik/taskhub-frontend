import OrgSettings from '../features/orgs/OrgSettings'

export default function SettingsPage() {
  return (
    <section className="page">
      <div className="page-header">
        <h1>Settings</h1>
      </div>
      <OrgSettings />
    </section>
  )
}
