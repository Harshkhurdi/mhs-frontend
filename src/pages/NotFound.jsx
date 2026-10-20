import { Link } from 'react-router-dom'
import PageMeta from '../components/PageMeta'
export default function NotFound() {
  return (
    <section className="section">
      <PageMeta title="Page not found | Medelec Healthcare Solutions" noindex />
      <div className="wrap empty-state">
        <p className="eyebrow">404 / PAGE NOT FOUND</p>
        <h1>Let’s get you back on track.</h1>
        <p>
          This page may have moved. Explore our equipment or contact our team.
        </p>
        <Link to="/" className="button">
          Back to home ↗
        </Link>
        <Link to="/solutions" className="text-link">
          Explore medical solutions ↗
        </Link>
      </div>
    </section>
  )
}
