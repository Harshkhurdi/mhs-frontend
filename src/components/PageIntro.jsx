import PageMeta from './PageMeta'
import { Link } from 'react-router-dom'

export default function PageIntro({ eyebrow, title, description }) {
  return (
    <>
      <PageMeta
        title={`${eyebrow} | Medelec Healthcare Solutions`}
        description={description}
      />
      <section className="page-intro">
        <div className="wrap">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>{eyebrow}</span>
          </div>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="intro-copy">{description}</p>
        </div>
      </section>
    </>
  )
}
