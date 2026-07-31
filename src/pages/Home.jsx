import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import ScrollReveal from '../components/ScrollReveal'
import { partners } from '../data/partners'
import { HiShieldCheck, HiCube, HiSupport } from 'react-icons/hi'

const pillars = [
  {
    icon: HiShieldCheck,
    title: 'Global OEM Authenticity',
    description:
      'Authorized partner of Hamilton Medical, Samsung Healthcare, Linet & Spacelabs Healthcare — every product is 100% genuine.',
  },
  {
    icon: HiCube,
    title: 'Turnkey Hospital Installations',
    description:
      'End-to-end project management from infrastructure planning to commissioning of complete ICU and ward setups.',
  },
  {
    icon: HiSupport,
    title: '24/7 Biomedical Support Assurance',
    description:
      'Round-the-clock technical support, preventive maintenance, and rapid-response engineering for uninterrupted care.',
  },
]

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Medelec Healthcare Solutions | Premium Medical Equipment Distributor</title>
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-primary-blue via-primary-blue to-[#0A1D3D] overflow-hidden">
        {/* Abstract geometric overlay */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-20 left-10 w-72 h-72 border border-white rounded-full" />
          <div className="absolute bottom-20 right-10 w-96 h-96 border border-white rounded-full" />
          <div className="absolute top-1/3 right-1/4 w-px h-64 bg-white" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <ScrollReveal>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white/80 mb-6">
                Authorized Distributor — North India
              </span>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight mb-6">
                Advanced Medical
                <br />
                Infrastructure.
                <span className="text-surgical-teal"> Delivered.</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <p className="text-lg sm:text-xl text-white/60 max-w-xl mb-10 leading-relaxed">
                Premium medical equipment procurement, turnkey hospital installations, and lifelong
                biomedical support for healthcare institutions across India.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/solutions"
                  className="inline-flex items-center justify-center px-8 py-3.5 border-2 border-white text-white font-medium rounded-sm transition-all duration-300 hover:bg-white hover:text-primary-blue"
                >
                  Explore Portfolio
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-8 py-3.5 bg-surgical-teal text-white font-medium rounded-sm transition-all duration-300 hover:bg-surgical-teal/90"
                >
                  Request a Quote
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Partner Brands Ribbon */}
      <section className="py-16 bg-bg-platinum border-y border-border-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-text-muted mb-10">
              Authorized Distribution Partners
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {partners.map((partner, i) => (
              <ScrollReveal key={partner.id} delay={i * 100}>
                <a
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center justify-center p-6 bg-white rounded-sm border border-border-light transition-all duration-300 hover:border-surgical-teal/30 hover:shadow-md cursor-pointer"
                >
                  <div
                    className="w-14 h-14 rounded-sm flex items-center justify-center mb-3 transition-all duration-300 grayscale group-hover:grayscale-0"
                    style={{ backgroundColor: `${partner.color}15` }}
                  >
                    <span
                      className="text-lg font-bold transition-all duration-300"
                      style={{ color: partner.color }}
                    >
                      {partner.name.split(' ')[0][0]}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-primary-blue text-center group-hover:text-surgical-teal transition-colors">
                    {partner.name}
                  </p>
                  <p className="text-xs text-text-muted text-center mt-1">
                    {partner.description}
                  </p>
                </a>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Core Pillars */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-primary-blue mb-4">
                Why Medelec Healthcare?
              </h2>
              <p className="text-text-muted max-w-2xl mx-auto">
                Three pillars define our commitment to delivering excellence in medical infrastructure.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {pillars.map((pillar, i) => (
              <ScrollReveal key={pillar.title} delay={i * 150}>
                <div className="card p-8 lg:p-10 text-center group hover:border-surgical-teal/30 h-full flex flex-col">
                  <div className="w-14 h-14 bg-surgical-teal/10 rounded-sm flex items-center justify-center mx-auto mb-6 group-hover:bg-surgical-teal/20 transition-colors">
                    <pillar.icon className="text-surgical-teal" size={28} />
                  </div>
                  <h3 className="text-lg font-semibold text-primary-blue mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed flex-1">
                    {pillar.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Trust CTA */}
      <section className="bg-primary-blue py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Upgrade Your Medical Infrastructure?
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto mb-8">
              Connect with our team for detailed specifications, compliance documentation, and competitive pricing on all equipment.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-10 py-4 bg-surgical-teal text-white font-medium rounded-sm transition-all duration-300 hover:bg-surgical-teal/90"
            >
              Get in Touch
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}