import { Link } from 'react-router-dom'
import {
  HiArrowUpRight,
  HiOutlineAdjustmentsHorizontal,
  HiOutlineShieldCheck,
  HiOutlineWrenchScrewdriver,
  HiOutlineAcademicCap,
  HiOutlinePhone,
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
            <br />
            <span>Supported for life.</span>
          </>
        }
        description="Keep your facility moving with practical biomedical support, preventive maintenance and a team that understands your equipment."
      />
      <section className="section">
        <div className="wrap">
          <div className="section-heading">
            <div>
              <p className="eyebrow">BEYOND THE INSTALLATION</p>
              <h2>
                Support for the
                <br />
                whole equipment lifecycle.
              </h2>
            </div>
            <p>
              From the first day of use to routine maintenance, we help you take
              care of the technology your team depends on.
            </p>
          </div>
          <div className="service-grid">
            {services.map(([Icon, title, text], i) => (
              <article key={title} className="service-card">
                <div>
                  <Icon size={30} />
                  <span>0{i + 1}</span>
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="support-process section">
        <div className="wrap">
          <p className="eyebrow">A SIMPLE WAY TO GET HELP</p>
          <h2>
            Tell us what’s happening.
            <br />
            We’ll take it from there.
          </h2>
          <div className="process-grid">
            {steps.map(([title, text], i) => (
              <article key={title}>
                <span>0{i + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
          <div className="support-contact">
            <div>
              <HiOutlinePhone size={28} />
              <div>
                <strong>Need equipment support?</strong>
                <p>
                  Mon–Sat, 9:00 AM–6:00 PM IST. Service timing depends on
                  location and the issue.
                </p>
              </div>
            </div>
            <a href="tel:+919316666888" className="button">
              Call +91 93166 66888 <HiArrowUpRight />
            </a>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="wrap faq-layout">
          <div>
            <p className="eyebrow">GOOD TO KNOW</p>
            <h2>
              A little clarity
              <br />
              before you call.
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
