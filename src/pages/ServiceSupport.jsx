import { Link } from 'react-router-dom'
import {
  HiArrowUpRight,
  HiOutlineAdjustmentsHorizontal,
  HiOutlineShieldCheck,
  HiOutlineWrenchScrewdriver,
  HiOutlineAcademicCap,
  HiOutlineEnvelope,
} from 'react-icons/hi2'
import PageIntro from '../components/PageIntro'
import CallToAction from '../components/CallToAction'

const services = [
  [
    HiOutlineAdjustmentsHorizontal,
    'Preventive maintenance',
    'Planned checks and servicing to help maintain performance and extend equipment life.',
  ],
  [
    HiOutlineShieldCheck,
    'Calibration & safety',
    'Equipment performance checks and calibration coordinated around the manufacturer’s requirements.',
  ],
  [
    HiOutlineWrenchScrewdriver,
    'Repairs & genuine parts',
    'Fault assessment, repair coordination and manufacturer parts support for your installed equipment.',
  ],
  [
    HiOutlineAcademicCap,
    'Installation & training',
    'Commissioning and application training to help your team use new equipment with confidence.',
  ],
]
const steps = [
  [
    'Share the details',
    'Tell us the equipment model, location, issue and a contact person at your facility.',
  ],
  [
    'Assess & coordinate',
    'Our team reviews your request and coordinates the appropriate technical assistance.',
  ],
  [
    'Service & follow through',
    'We arrange the next steps, communicate timing and help verify equipment performance.',
  ],
]

export default function ServiceSupport() {
  return (
    <>
      <PageIntro
        eyebrow="Service & support"
        title={
          <>
            Reliable equipment.
            {' '}<br className="heading-break" />
            <span>Supported for life.</span>
          </>
        }
        description="Keep your facility moving with practical biomedical support, preventive maintenance and a team that understands your equipment."
      />
      <section className="section lifecycle-section" aria-labelledby="lifecycle-heading">
        <div className="wrap">
          <div className="lifecycle-heading">
            <div>
              <p className="eyebrow">BEYOND THE INSTALLATION</p>
              <h2 id="lifecycle-heading">
                Support for the{' '}<br className="heading-break" /><span>whole equipment lifecycle.</span>
              </h2>
            </div>
            <div className="lifecycle-intro">
              <p>
                From the first day of use to routine maintenance, we help you take
                care of the technology your team depends on.
              </p>
              <Link to="/contact?type=service" className="text-link">
                Discuss your equipment <HiArrowUpRight />
              </Link>
            </div>
          </div>
          <div className="lifecycle-grid">
            {services.map(([Icon, title, text], i) => (
              <article key={title} className="lifecycle-card">
                <div className="lifecycle-icon" aria-hidden="true"><Icon /></div>
                <span className="lifecycle-number" aria-hidden="true">0{i + 1}</span>
                <div className="lifecycle-copy">
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="service-journey section" aria-labelledby="service-journey-heading">
        <div className="wrap">
          <div className="service-journey-heading">
            <p className="eyebrow">A SIMPLE WAY TO GET HELP</p>
            <h2 id="service-journey-heading">
              Tell us what’s happening.{' '}<br className="heading-break" /><span>We’ll take it from there.</span>
            </h2>
          </div>
          <ol className="service-steps">
            {steps.map(([title, text], i) => (
              <li key={title}>
                <span className="service-step-number" aria-hidden="true">0{i + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="service-email-panel">
            <div className="service-email-copy">
              <span className="service-email-icon" aria-hidden="true"><HiOutlineEnvelope /></span>
              <div>
                <h3>Need equipment support?</h3>
                <p>
                  Mon–Sat, 9:00 AM–6:00 PM IST. Service timing depends on
                  location and the issue.
                </p>
              </div>
            </div>
            <a href="mailto:info@medelec.in" className="button service-email-button">
              info@medelec.in <HiArrowUpRight />
            </a>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="wrap faq-layout">
          <div>
            <p className="eyebrow">GOOD TO KNOW</p>
            <h2>
              A little clarity{' '}<br className="heading-break" />before you get in touch.
            </h2>
            <Link to="/contact?type=service" className="text-link">
              Send a service inquiry <HiArrowUpRight />
            </Link>
          </div>
          <div className="faq-list">
            {[
              [
                'What should I include in a service request?',
                'Please include the manufacturer, model, serial number if available, hospital location, a description of the issue and your contact details. Do not include patient information.',
              ],
              [
                'Can I discuss a maintenance arrangement?',
                'Yes. Contact our team with your equipment list and facility details so we can discuss the scope, schedule and applicable terms.',
              ],
              [
                'Do you support equipment installation and staff training?',
                'Our team coordinates installation, commissioning and application training. The scope is confirmed as part of your equipment quotation or service arrangement.',
              ],
            ].map(([q, a]) => (
              <details key={q}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <CallToAction />
    </>
  )
}
