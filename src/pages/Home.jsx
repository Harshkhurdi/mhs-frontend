import { Link } from 'react-router-dom'
import PageMeta from '../components/PageMeta'
import {
  HiArrowUpRight,
  HiArrowRight,
  HiOutlineShieldCheck,
  HiOutlineWrenchScrewdriver,
  HiOutlineAcademicCap,
  HiOutlineBuildingOffice2,
} from 'react-icons/hi2'
import { clinicalSpecialties } from '../data/products'
import { partners } from '../data/partners'
import EquipmentArt from '../components/EquipmentArt'
import CallToAction from '../components/CallToAction'

const support = [
  [
    HiOutlineShieldCheck,
    'The right technology',
    'Equipment from established global manufacturers, matched to your clinical requirements.',
  ],
  [
    HiOutlineBuildingOffice2,
    'From plan to practice',
    'Practical support with procurement, installation and commissioning for your facility.',
  ],
  [
    HiOutlineAcademicCap,
    'Confidence for your team',
    'Application training that helps your clinical staff make the most of their equipment.',
  ],
  [
    HiOutlineWrenchScrewdriver,
    'Support that stays',
    'Preventive maintenance, calibration and service coordination throughout the equipment lifecycle.',
  ],
]

export default function Home() {
  return (
    <>
      <PageMeta
        title="Medelec Healthcare Solutions | Medical Equipment & Biomedical Support"
        description="Medical equipment, hospital installations and biomedical support across North India. Explore critical care, imaging, hospital beds and patient monitoring with Medelec."
      />
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="status-dot" /> YOUR PARTNER IN HEALTHCARE
              TECHNOLOGY
            </p>
            <h1>
              Better technology.
              <br />
              <span>Better care.</span>
            </h1>
            <p className="hero-description">
              The right equipment makes all the difference.
              <br className="desktop-break" /> We bring global medical
              technology and dependable local support to your hospital.
            </p>
            <div className="hero-actions">
              <Link to="/solutions" className="button">
                Explore medical solutions <HiArrowUpRight />
              </Link>
              <Link to="/contact" className="text-link">
                Talk to our team <HiArrowRight />
              </Link>
            </div>
            <div className="hero-assurance">
              <HiOutlineShieldCheck size={23} />
              <span>
                Global equipment partners.
                <br />
                <strong>A local team you can count on.</strong>
              </span>
            </div>
          </div>
          <div className="hero-image">
            <img
              src="/images/hospital-room.jpg"
              alt="A clinical room equipped with medical monitoring and surgical equipment"
              fetchPriority="high"
              width="1600"
              height="1067"
            />
            <span className="image-index">01 / BUILT AROUND PATIENT CARE</span>
            <div className="hero-image-note">
              <span className="note-icon">
                <HiOutlineWrenchScrewdriver size={23} />
              </span>
              <div>
                <strong>More than equipment.</strong>
                <p>A partner through every stage.</p>
              </div>
              <HiArrowUpRight size={23} />
            </div>
          </div>
        </div>
      </section>
      <section className="partners-strip">
        <div className="wrap">
          <p className="eyebrow">GLOBAL INNOVATION. LOCAL EXPERTISE.</p>
          <div className="partner-wordmarks">
            {partners.map((p) => (
              <a
                key={p.id}
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className={`partner-${p.id}`}
                aria-label={`Visit ${p.name}`}
              >
                {p.id === 'hamilton' ? (
                  <>
                    <span className="hamilton-symbol">H</span>
                    <span>
                      HAMILTON<small>MEDICAL</small>
                    </span>
                  </>
                ) : p.id === 'samsung' ? (
                  <span>
                    SAMSUNG<small>HEALTHCARE</small>
                  </span>
                ) : p.id === 'linet' ? (
                  <span>
                    LINET<span className="linet-plus">+</span>
                  </span>
                ) : (
                  <span>
                    spacelabs<small>HEALTHCARE</small>
                  </span>
                )}
              </a>
            ))}
          </div>
        </div>
      </section>
      <section className="section solutions-section">
        <div className="wrap">
          <div className="section-heading">
            <div>
              <p className="eyebrow">OUR MEDICAL SOLUTIONS</p>
              <h2>
                Equipped for every
                <br />
                critical moment.
              </h2>
            </div>
            <div>
              <p>
                From intensive care to everyday diagnostics, explore solutions
                built around your clinical needs.
              </p>
              <Link to="/solutions" className="text-link">
                View all solutions <HiArrowUpRight />
              </Link>
            </div>
          </div>
          <div className="specialty-grid">
            {clinicalSpecialties.map((s, i) => (
              <Link
                key={s.id}
                to={`/solutions?specialty=${s.id}`}
                className="specialty-card"
              >
                <div className="specialty-art">
                  <span className="card-index">0{i + 1}</span>
                  <EquipmentArt specialty={s.id} />
                </div>
                <div className="specialty-copy">
                  <h3>
                    {s.name}
                    <HiArrowUpRight />
                  </h3>
                  <p>{s.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section approach-section">
        <div className="wrap approach-grid">
          <div className="approach-photo">
            <img
              src="/images/clinical-care.jpg"
              alt="Hospital reception and clinical facilities"
              loading="lazy"
              width="1500"
              height="1021"
            />
            <div className="photo-caption">
              <span className="status-dot" /> PEOPLE FIRST. ALWAYS.
            </div>
          </div>
          <div className="approach-copy">
            <p className="eyebrow">THE MEDELEC APPROACH</p>
            <h2>
              Good equipment is
              <br />
              only the beginning.
            </h2>
            <p className="intro-copy">
              We stay involved beyond delivery. Our team works with yours to
              help turn a purchase into lasting clinical value.
            </p>
            <div className="approach-points">
              {support.map(([Icon, title, text]) => (
                <div key={title}>
                  <Icon size={24} />
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/about" className="text-link">
              Get to know Medelec <HiArrowUpRight />
            </Link>
          </div>
        </div>
      </section>
      <section className="service-band">
        <div className="wrap">
          <div>
            <span className="service-band-icon">
              <HiOutlineWrenchScrewdriver size={34} />
            </span>
            <div>
              <p className="eyebrow">HERE FOR THE LONG RUN</p>
              <h2>
                Care for the equipment.
                <br />
                Confidence for the people using it.
              </h2>
            </div>
          </div>
          <Link to="/service" className="button button-outline">
            Discover our support <HiArrowUpRight />
          </Link>
        </div>
      </section>
      <CallToAction />
    </>
  )
}
