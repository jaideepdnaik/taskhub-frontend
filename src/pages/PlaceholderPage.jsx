// Stand-in for sections that aren't built yet, so the navigation works.
// Replace each route's element as the roadmap step lands.
export default function PlaceholderPage({ title, step }) {
  return (
    <section className="state">
      <h1>{title}</h1>
      <p className="muted">This page arrives in roadmap step {step}.</p>
    </section>
  )
}
