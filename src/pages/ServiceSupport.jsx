import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import ScrollReveal from '../components/ScrollReveal'
import {
  HiCog,
  HiShieldCheck,
  HiClock,
  HiRefresh,
  HiPhone,
  HiCheckCircle,
  HiAdjustments,
  HiTruck,
} from 'react-icons/hi'

const maintenanceServices = [
  {
    icon: HiCog,
    title: 'Calibration',
    description:
      'Precision calibration of all monitoring, imaging, and ventilation equipment to OEM specifications.',
  },
  {
    icon: HiShieldCheck,
    title: 'Safety Checks',
    description:
      'Comprehensive electrical safety and performance testing ensuring full regulatory compliance.',
  },
  {
    icon: HiRefresh,
    title: 'OEM Parts Replacement',
    description:
      'Genuine replacement parts sourced directly from manufacturers to maintain warranty integrity.',
  },
  {
    icon: HiAdjustments,
    title: 'Preventive Maintenance',
    description:
      'Scheduled maintenance programs designed to prevent failures and extend equipment lifecycle.',
  },
]

const responseSteps = [
  {
    icon: HiPhone,
    time: '00:00',
    title: 'Critical Alert Received',
    description: 'Issue logged via dedicated support hotline with priority classification.',
  },
  {
    icon: HiClock,
    time: '00:15',
    title: 'Engineer Dispatched',
    description: 'Nearest field service engineer assigned with full equipment history access.',
  },
  {
    icon: HiTruck,
    time: '02:00',
    title: 'On-Site Arrival',
    description: 'Engineer arrives at facility with diagnostic tools and critical spare parts.',
  },
  {
    icon: HiCheckCircle,
    time: '04:00',
    title: 'Issue Resolved',
    description: 'Equipment restored to operational status with post-repair calibration verification.',
  },
]

export default function ServiceSupport() {
  return (
    <>
      <Helmet>
        <title>Service & Biomedical Engineering Support | Medelec Healthcare Solutions</title>
      </Helmet>

      {/* Page Header */}
      <section className="pt-32 pb-16 bg-bg-platinum border-b border-border-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-surgical-teal">
              Service & Support
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-primary-blue mt-4 mb-4">
              Biomedical Engineering Support
            </h1>
            <p className="text-text-muted max-w-2xl text-lg">
              Comprehensive technical capabilities designed to satisfy hospital compliance requirements
              and ensure uninterrupted patient care.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Preventative Maintenance */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-primary-blue mb-4">
                Preventative Maintenance
              </h2>
              <p className="text-text-muted max-w-2xl mx-auto">
                A structured approach to equipment reliability — covering calibration, safety
                verification, and genuine OEM parts replacement.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {maintenanceServices.map((service, i) => (
              <ScrollReveal key={service.title} delay={i * 100}>
                <div className="card p-6 lg:p-8 group hover:border-surgical-teal/30 h-full">
                  <div className="w-12 h-12 bg-surgical-teal/10 rounded-sm flex items-center justify-center mb-5 group-hover:bg-surgical-teal/20 transition-colors">
                    <service.icon className="text-surgical-teal" size={24} />
                  </div>
                  <h3 className="text-base font-semibold text-primary-blue mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Response Protocol Timeline */}
      <section className="py-20 bg-bg-platinum border-y border-border-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-surgical-teal">
                Response Protocol
              </span>
              <h2 className="text-3xl font-bold text-primary-blue mt-3 mb-4">
                Rapid-Response Network
              </h2>
              <p className="text-text-muted max-w-2xl mx-auto">
                Our emergency response timeline for critical equipment failures. Every minute counts
                in critical care.
              </p>
            </div>
          </ScrollReveal>

          {/* Timeline */}
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-px bg-border-light sm:-translate-x-px" />

              {responseSteps.map((step, i) => (
                <ScrollReveal key={step.title} delay={i * 120}>
                  <div
                    className={`relative flex items-center gap-6 mb-12 last:mb-0 ${
                      i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'
                    }`}
                  >
                    {/* Node */}
                    <div className="absolute left-6 sm:left-1/2 w-3 h-3 bg-surgical-teal rounded-full ring-4 ring-bg-platinum -translate-x-1/2 z-10" />

                    {/* Content Card */}
                    <div className="ml-16 sm:ml-0 sm:w-1/2 sm:px-8">
                      <div className="card p-6 group hover:border-surgical-teal/30">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-surgical-teal/10 rounded-sm flex items-center justify-center group-hover:bg-surgical-teal/20 transition-colors">
                            <step.icon className="text-surgical-teal" size={20} />
                          </div>
                          <span className="text-2xl font-bold text-surgical-teal/30">
                            {step.time}
                          </span>
                        </div>
                        <h3 className="text-base font-semibold text-primary-blue mb-2">
                          {step.title}
                        </h3>
                        <p className="text-sm text-text-muted leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    {/* Spacer for alternating layout */}
                    <div className="hidden sm:block sm:w-1/2" />
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Service Coverage */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <ScrollReveal>
              <div className="text-center p-8 border border-border-light rounded-sm">
                <p className="text-4xl font-bold text-surgical-teal mb-2">24/7</p>
                <p className="text-sm text-text-muted">Round-the-clock support availability</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <div className="text-center p-8 border border-border-light rounded-sm">
                <p className="text-4xl font-bold text-surgical-teal mb-2">{'< 2h'}</p>
                <p className="text-sm text-text-muted">Average on-site response time</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <div className="text-center p-8 border border-border-light rounded-sm">
                <p className="text-4xl font-bold text-surgical-teal mb-2">100%</p>
                <p className="text-sm text-text-muted">OEM-certified replacement parts</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-blue py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-white mb-4">
              Need Technical Assistance?
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto mb-8">
              Our biomedical engineering team is standing by. Contact us for maintenance scheduling,
              emergency support, or compliance documentation.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-10 py-4 bg-surgical-teal text-white font-medium rounded-sm transition-all duration-300 hover:bg-surgical-teal/90"
            >
              Contact Support Team
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}