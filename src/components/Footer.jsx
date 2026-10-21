import { Link } from 'react-router-dom'
import { HiArrowUpRight } from 'react-icons/hi2'
import { partners } from '../data/partners'
import Brand from './Brand'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div className="footer-brand">
          <Link to="/" aria-label="Medelec home">
            <Brand />
          </Link>
          <p>
            Connecting healthcare teams with the technology and support they
            need to deliver better care.
          </p>
          <span className="footer-location">
            <span /> Based in Mohali. Serving North India.
          </span>
        </div>
        <div>
          <h2>Explore</h2>
          <Link to="/about">About Medelec</Link>
          <Link to="/solutions">Medical solutions</Link>
          <Link to="/service">Service & support</Link>
          <Link to="/contact">Contact us</Link>
        </div>
        <div>
          <h2>Our partners</h2>
          {partners.map((p) => (
            <a key={p.id} href={p.url} target="_blank" rel="noreferrer">
              {p.name}
              <HiArrowUpRight />
            </a>
          ))}
        </div>
        <div>
          <h2>Get in touch</h2>
          <a
            href="https://maps.google.com/?q=F-382,Asha+Towers,Phase+8B,Industrial+Area,Sector+74,Mohali,Punjab"
            target="_blank"
            rel="noreferrer"
          >
            F-382, Asha Towers, Phase 8B,
            <br />
            Sector 74, Mohali, Punjab — 160055
          </a>
          <a href="mailto:info@medelec.com">
            info@medelec.com <HiArrowUpRight />
          </a>
          <a className="footer-phone" href="tel:+919316666888">
            +91 93166 66888
          </a>
        </div>
      </div>
      <div className="wrap footer-bottom">
        <p>© {new Date().getFullYear()} Medelec Healthcare Solutions.</p>
        <span>Equipment. Expertise. Ongoing support.</span>
        <Link to="/admin/login">
          Staff sign in <HiArrowUpRight />
        </Link>
      </div>
    </footer>
  )
}
