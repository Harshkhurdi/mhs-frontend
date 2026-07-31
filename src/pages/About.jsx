import { Helmet } from 'react-helmet-async'
import ScrollReveal from '../components/ScrollReveal'
import { director, teamMembers } from '../data/team'

export default function About() {
  return (
    <>
      <Helmet>
        <title>About Us | Medelec Healthcare Solutions</title>
      </Helmet>

      {/* Page Header */}
      <section className="pt-32 pb-16 bg-bg-platinum border-b border-border-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-surgical-teal">
              Corporate Governance
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-primary-blue mt-4 mb-4">
              About Medelec Healthcare
            </h1>
            <p className="text-text-muted max-w-2xl text-lg">
              Trusted by leading healthcare institutions for premium medical infrastructure, genuine OEM
              equipment, and dedicated biomedical support.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Director's Vision */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto">
              <div className="relative p-10 lg:p-14 bg-bg-platinum rounded-sm border border-border-light">
                {/* Large quote mark */}
                <div className="absolute top-6 left-6 text-6xl leading-none text-surgical-teal/20 font-serif select-none">
                  &ldquo;
                </div>

                <blockquote className="relative pl-6">
                  <p className="text-xl lg:text-2xl text-primary-blue font-medium leading-relaxed italic mb-6">
                    &ldquo;{director.quote}&rdquo;
                  </p>
                  <footer className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-blue rounded-sm flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {director.initials}
                      </span>
                    </div>
                    <div>
                      <cite className="text-sm font-semibold text-primary-blue not-italic">
                        {director.name}
                      </cite>
                      <p className="text-xs text-text-muted">
                        {director.title}
                      </p>
                    </div>
                  </footer>
                </blockquote>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Company Overview */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <ScrollReveal>
              <div>
                <h2 className="text-2xl font-bold text-primary-blue mb-4">
                  Bridging Global Innovation with Indian Healthcare
                </h2>
                <p className="text-text-muted leading-relaxed mb-4">
                  Headquartered in Mohali, Punjab, Medelec Healthcare Solutions has established itself
                  as a premier authorized distributor of elite global medical equipment brands. We
                  cater to hospital procurement networks, critical care units, and diagnostic centers
                  across North India.
                </p>
                <p className="text-text-muted leading-relaxed">
                  Our commitment to authenticity, quality, and round-the-clock biomedical support makes
                  us the preferred partner for healthcare institutions seeking reliable, world-class
                  medical infrastructure.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <div className="bg-bg-platinum p-8 rounded-sm border border-border-light">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-primary-blue mb-4">
                  Corporate Information
                </h3>
                <dl className="space-y-4">
                  {[
                    { label: 'Company', value: 'Medelec Healthcare Solutions' },
                    { label: 'Headquarters', value: 'F-382, Asha Towers, Phase 8B, Mohali, Punjab — 160055' },
                    { label: 'Leadership', value: 'Mr. Ramesh Khurdi, Owner & Managing Director' },
                    { label: 'Territory', value: 'North India (Punjab, Haryana, Himachal, J&K, Delhi-NCR, Chandigarh)' },
                    { label: 'Specialization', value: 'Critical Care, Radiology, Ward Infrastructure, Patient Monitoring' },
                  ].map((item) => (
                    <div key={item.label} className="flex flex-col sm:flex-row sm:gap-4">
                      <dt className="text-xs font-semibold text-text-muted uppercase tracking-wider sm:w-40 shrink-0">
                        {item.label}
                      </dt>
                      <dd className="text-sm text-primary-blue mt-0.5 sm:mt-0">
                        {item.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-20 bg-bg-platinum border-y border-border-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-surgical-teal">
                Our Team
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-primary-blue mt-3 mb-4">
                Engineering & Logistics Power Team
              </h2>
              <p className="text-text-muted max-w-2xl mx-auto">
                Dedicated professionals ensuring every installation, calibration, and delivery meets the
                highest standards of clinical precision.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {teamMembers.map((member, i) => (
              <ScrollReveal key={member.id} delay={i * 100}>
                <div className="card p-6 group hover:border-surgical-teal/30 h-full flex flex-col">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-primary-blue rounded-sm flex items-center justify-center group-hover:bg-surgical-teal transition-colors duration-300">
                      <span className="text-white font-bold text-lg">
                        {member.initials}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-primary-blue">
                        {member.name}
                      </h3>
                      <p className="text-xs text-surgical-teal font-medium">
                        {member.role}
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-border-light pt-3 flex-1">
                    <p className="text-sm text-text-muted">
                      <span className="font-medium text-primary-blue">Focus:</span> {member.focus}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}