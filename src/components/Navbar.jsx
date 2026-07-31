import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { HiOutlineMenu, HiX } from 'react-icons/hi'
import { useRFQ } from './RFQContext'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/solutions', label: 'Medical Solutions' },
  { to: '/service', label: 'Service & Support' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const location = useLocation()
  const { totalItems } = useRFQ()
  const { user } = useAuth()

  useEffect(() => {
    setIsMobileOpen(false)
  }, [location])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border-light shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-blue rounded-sm flex items-center justify-center">
              <span className="text-white font-bold text-xs">MHS</span>
            </div>
            <span className="font-semibold text-primary-blue text-sm lg:text-base leading-tight">
              Medelec Healthcare
              <br />
              <span className="text-xs font-normal text-text-muted">Solutions</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors duration-200 ${isActive
                    ? 'text-surgical-teal'
                    : 'text-primary-blue/80 hover:text-surgical-teal'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          {user && (
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-blue hover:text-surgical-teal"
            >
              Admin Panel
            </Link>
          )}
          {totalItems > 0 && (
            <Link
              to="/contact"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-surgical-teal"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-surgical-teal opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-surgical-teal" />
              </span>
              RFQ ({totalItems})
            </Link>
          )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden p-2 text-primary-blue"
            aria-label="Toggle menu"
          >
            {isMobileOpen ? <HiX size={24} /> : <HiOutlineMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden transition-all duration-300 overflow-hidden ${isMobileOpen ? 'max-h-96' : 'max-h-0'
          }`}
      >
        <div className="bg-white border-t border-border-light px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-sm text-sm font-medium transition-colors ${isActive
                  ? 'bg-surgical-teal/10 text-surgical-teal'
                  : 'text-primary-blue/80 hover:bg-bg-platinum'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          {user && (
            <Link
              to="/admin"
              className="block px-4 py-3 text-sm font-medium text-primary-blue hover:text-surgical-teal"
            >
              Admin Panel
            </Link>
          )}
          {totalItems > 0 && (
            <Link
              to="/contact"
              className="block px-4 py-3 text-sm font-medium text-surgical-teal"
            >
              View RFQ ({totalItems} items)
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}