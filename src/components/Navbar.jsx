import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import {
  HiArrowUpRight,
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlineClipboardDocumentList,
} from 'react-icons/hi2'
import { useRFQ } from './RFQContext'
import { useAuth } from '../context/AuthContext'
import Brand from './Brand'

const links = [
  ['/', 'Home'],
  ['/about', 'About us'],
  ['/solutions', 'Medical solutions'],
  ['/service', 'Service & support'],
  ['/events', 'Photos & events'],
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { totalItems, setIsOpen } = useRFQ()
  const { user } = useAuth()
  return (
    <header className="site-header">
      <div className="topbar">
        <div className="wrap">
          <span>Medical technology. Personal commitment.</span>
          <a href="mailto:info@medelec.com">
            Speak to our team <span>info@medelec.com ↗</span>
          </a>
        </div>
      </div>
      <div className="wrap nav-row">
        <Link
          to="/"
          aria-label="Medelec Healthcare Solutions home"
          onClick={() => setOpen(false)}
        >
          <Brand />
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/'}>
              {label}
            </NavLink>
          ))}
          {user && <NavLink to="/admin">Admin</NavLink>}
        </nav>
        <div className="nav-actions">
          <button
            className="quote-button"
            aria-label={`Open quote list, ${totalItems} items`}
            onClick={() => setIsOpen(true)}
          >
            <HiOutlineClipboardDocumentList size={21} />
            <span className="quote-count">{totalItems}</span>
          </button>
          <Link to="/contact" className="button button-small nav-contact">
            Let’s talk <HiArrowUpRight />
          </Link>
          <button
            className="menu-toggle"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? <HiOutlineXMark size={25} /> : <HiOutlineBars3 size={25} />}
          </button>
        </div>
      </div>
      {open && (
        <nav
          id="mobile-navigation"
          className="mobile-nav wrap"
          aria-label="Mobile navigation"
        >
          {[
            ...links,
            ['/contact', 'Contact'],
            ...(user ? [['/admin', 'Admin dashboard']] : []),
          ].map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setOpen(false)}
            >
              {label}
              <HiArrowUpRight />
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}
