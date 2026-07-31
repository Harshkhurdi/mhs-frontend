import { Link } from 'react-router-dom'
import { HiLocationMarker, HiPhone, HiMail } from 'react-icons/hi'
import { partners } from '../data/partners'

export default function Footer() {
  return (
    <footer className="bg-primary-blue text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
                <span className="text-primary-blue font-bold text-xs">MHS</span>
              </div>
              <div>
                <p className="font-semibold text-sm leading-tight">Medelec Healthcare</p>
                <p className="text-xs text-white/60">Solutions</p>
              </div>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              Authorized distributor of elite global medical equipment brands.
              Delivering advanced healthcare infrastructure across North India.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {[
                { to: '/', label: 'Home' },
                { to: '/about', label: 'About Us' },
                { to: '/solutions', label: 'Medical Solutions' },
                { to: '/service', label: 'Service & Support' },
                { to: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Brands */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Partner Brands
            </h4>
            <ul className="space-y-2.5">
              {partners.map((partner) => (
                <li key={partner.id}>
                  <a
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white/60 hover:text-surgical-teal transition-colors duration-200"
                  >
                    {partner.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <HiLocationMarker className="mt-0.5 text-surgical-teal shrink-0" size={16} />
                <a
                  href="https://maps.google.com/?q=F-382,Asha+Towers,Phase+8B,Industrial+Area,Sector+74,Mohali,Punjab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/70 hover:text-surgical-teal transition-colors duration-200"
                >
                  F-382, Asha Towers, Phase 8B, Industrial Area, Sector 74, Mohali, Punjab — 160055
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <HiPhone className="text-surgical-teal shrink-0" size={16} />
                <a
                  href="tel:+919316666888"
                  className="text-sm text-white/70 hover:text-surgical-teal transition-colors duration-200"
                >
                  +91 9316666888
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <HiMail className="text-surgical-teal shrink-0" size={16} />
                <a
                  href="mailto:info@medelec.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/70 hover:text-surgical-teal transition-colors duration-200"
                >
                  info@medelec.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-xs text-white/40">
            &copy; {new Date().getFullYear()} Medelec Healthcare Solutions. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}