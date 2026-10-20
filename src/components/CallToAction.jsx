import { Link } from 'react-router-dom'
import { HiArrowUpRight } from 'react-icons/hi2'

export default function CallToAction() {
  return (
    <section className="cta-section">
      <div className="wrap cta-inner">
        <div>
          <p className="eyebrow">LET’S BUILD BETTER CARE</p>
          <h2>
            Your next step starts
            <br />
            with a conversation.
          </h2>
          <p>
            Tell us what your facility needs. We’ll help you find the right
            solution.
          </p>
        </div>
        <Link to="/contact" className="button button-light">
          Discuss your requirements <HiArrowUpRight />
        </Link>
      </div>
    </section>
  )
}
