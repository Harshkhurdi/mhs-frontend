import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  HiArrowUpRight,
  HiArrowRight,
  HiOutlineWrenchScrewdriver,
  HiOutlineShieldCheck,
  HiOutlineDocumentText,
  HiOutlinePhone,
  HiOutlineCheck,
} from 'react-icons/hi2'
import PageMeta from '../components/PageMeta'
import CallToAction from '../components/CallToAction'
import catalogue from '../data/homeCatalogue.json'
import { manufacturerBrands } from '../data/products'

const range = catalogue.products
const showcaseIds = [
  'hamilton-c6',
  'karl-storz-8404zx',
  'spacelabs-xprezzon',
  'kiran-flat-panel-based-digital-carm',
  'samsung-r20',
  'linet-multicare-x',
  'helmier-graseby-2000-2100',
  'nihon-kohden-tec-5600',
]
const showcases = showcaseIds
  .map((id) => range.find((p) => p.id === id))
  .filter(Boolean)
const categories = [
  { id: 'infusion-therapy', name: 'Infusion & pain management', note: 'Syringe pumps. Infusion. PCA.', imageId: 'helmier-graseby-2000-2100' },
  { id: 'temperature-management', name: 'Patient & fluid warming', note: 'Patient warming. Blood & fluid warmers.', imageId: 'helmier-aerotherm-iq' },
  { id: 'defibrillation', name: 'Defibrillators & AEDs', note: 'Hospital. Emergency. Public access.', imageId: 'nihon-kohden-tec-5600' },
  {
    id: 'endoscopy-surgery',
    name: 'Endoscopy & surgery',
    note: 'Visualisation. Endoscopy. Surgical systems.',
    imageId: 'karl-storz-th121',
  },
  {
    id: 'radiation-protection',
    name: 'Radiation protection',
    note: 'Aprons. Eyewear. Protective shields.',
    imageId: 'kiran-coat-apron-flex-back',
  },
  {
    id: 'accessories',
    name: 'Equipment accessories',
    note: 'Circuits. Consumables. Compatible fittings.',
    imageId: 'hamilton-breathing-circuit-sets',
  },
  {
    id: 'critical-care',
    name: 'Respiratory & critical care',
    note: 'Ventilation. High flow. Humidification.',
    imageId: 'hamilton-c6',
  },
  {
    id: 'radiology',
    name: 'Imaging & diagnostics',
    note: 'Ultrasound. Radiography. Mobile CT.',
    imageId: 'samsung-r20',
  },
  {
    id: 'ward-infrastructure',
    name: 'Beds & patient mobility',
    note: 'Intensive care. Ward care. Transport.',
    imageId: 'linet-multicare-x',
  },
  {
    id: 'patient-monitoring',
    name: 'Patient monitoring',
    note: 'Bedside. Transport. Central surveillance.',
    imageId: 'spacelabs-xprezzon',
  },
  {
    id: 'cardiology',
    name: 'Diagnostic cardiology',
    note: 'ECG. Holter. Blood pressure.',
    imageId: 'spacelabs-cardioexpress-sl18a',
  },
  {
    id: 'pressure-care',
    name: 'Pressure care & support',
    note: 'Active. Passive. Hybrid surfaces.',
    imageId: 'linet-virtuoso',
  },
]
const featuredIds = [
  'karl-storz-ui600',
  'kiran-flat-panel-based-digital-carm',
  'karl-storz-tp101',
  'hamilton-hf90',
  'samsung-hera-z20',
  'linet-eleganza-5',
  'spacelabs-xprezzon',
  'samsung-gm85-elite',
  'linet-sprint-200',
]

export default function Home() {
  const [selectedBrand, setSelectedBrand] = useState('hamilton')
  const featured =
    showcases.find((p) => p.brand === selectedBrand) || showcases[0]
  return (
    <>
      <PageMeta
        title="Medelec Healthcare Solutions | Equipment. Expertise. Care."
        description="Explore medical equipment from Hamilton Medical, KARL STORZ, Spacelabs, Kiran, Samsung, LINET, Helmier and Nihon Kohden defibrillation, with official product literature and local service engineering support."
      />
      <section className="home-hero">
        <div className="wrap home-hero-grid">
          <div className="home-hero-copy">
            <p className="eyebrow">
              <span className="status-dot" /> MEDELEC HEALTHCARE SOLUTIONS
            </p>
            <h1>
              Technology,{' '}<br className="heading-break" />with a <em>human side.</em>
            </h1>
            <p className="hero-lede">
              Global medical equipment. Local engineers who stand behind it.
            </p>
            <p className="hero-explainer">
              From selecting the right system to keeping it working, we help
              healthcare teams across North India move forward with confidence.
            </p>
            <div className="hero-actions">
              <Link to="/solutions" className="button">
                Find your equipment <HiArrowUpRight />
              </Link>
              <Link to="/service" className="text-link">
                Meet your support team <HiArrowRight />
              </Link>
            </div>
            <div className="hero-facts">
              <div>
                <strong>{catalogue.total}</strong>
                <span>equipment & product families</span>
              </div>
              <div>
                <strong>
                  {String(manufacturerBrands.length).padStart(2, '0')}
                </strong>
                <span>global manufacturer ranges</span>
              </div>
              <div>
                <HiOutlineWrenchScrewdriver />
                <span>
                  Local service
                  <br />
                  engineering support
                </span>
              </div>
            </div>
          </div>
          <div className={`equipment-showcase showcase-${featured.brand}`}>
            <div className="showcase-top">
              <span>
                IN FOCUS /{' '}
                {manufacturerBrands.find((b) => b.id === featured.brand)?.name}
              </span>
              <span className="showcase-number">
                {String(showcases.indexOf(featured) + 1).padStart(2, '0')}—
                {String(showcases.length).padStart(2, '0')}
              </span>
            </div>
            <div className="showcase-image">
              <img
                key={featured.id}
                src={featured.image}
                alt={`${featured.name} — official manufacturer product photograph`}
                width="760"
                height="660"
                fetchPriority="high"
              />
            </div>
            <div className="showcase-description">
              <div>
                <span>{featured.categoryLabel}</span>
                <h2>{featured.name}</h2>
              </div>
              <Link
                to={`/solutions?q=${encodeURIComponent(featured.name)}`}
                aria-label={`Explore ${featured.name}`}
              >
                <HiArrowUpRight size={24} />
              </Link>
            </div>
            <div
              className="showcase-tabs"
              role="group"
              aria-label="Featured manufacturer"
            >
              {showcases.map((p) => (
                <button
                  key={p.brand}
                  className={selectedBrand === p.brand ? 'selected' : ''}
                  aria-pressed={selectedBrand === p.brand}
                  onClick={() => setSelectedBrand(p.brand)}
                >
                  {manufacturerBrands.find((b) => b.id === p.brand)?.shortName}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="brand-navigation">
        <div className="wrap">
          <span className="eyebrow">THE NAMES BEHIND THE TECHNOLOGY</span>
          <div className="manufacturer-logo-grid">
            {manufacturerBrands.map((b) => (
              <Link
                key={b.id}
                to={`/solutions?brand=${b.id}`}
                className={`manufacturer-logo-tile logo-${b.id}${b.logo.theme === 'dark' ? ' logo-on-dark' : ''}`}
                aria-label={`Explore ${b.name} equipment`}
              >
                <img
                  src={b.logo.src}
                  alt={`${b.name} logo`}
                  width={b.logo.width}
                  height={b.logo.height}
                  loading="lazy"
                  decoding="async"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section clinical-ranges">
        <div className="wrap">
          <div className="section-heading">
            <div>
              <p className="eyebrow">START WITH THE CLINICAL NEED</p>
              <h2>
                Different departments.{' '}<br className="heading-break" /><em>One dependable partner.</em>
              </h2>
            </div>
            <div>
              <p>
                Find the right category, explore real equipment, and build a
                quotation around your facility.
              </p>
              <Link className="text-link" to="/solutions">
                Explore the full catalogue <HiArrowUpRight />
              </Link>
            </div>
          </div>
          <div className="clinical-grid">
            {categories.map((c, i) => {
              const p = range.find((p) => p.id === c.imageId)
              return (
                <Link
                  className={`clinical-card clinical-card-${i + 1}`}
                  to={`/solutions?specialty=${c.id}`}
                  key={c.id}
                >
                  <div className="clinical-image">
                    <span>{String(i + 1).padStart(2, '0')}</span>
                    {p && (
                      <img
                        src={p.image}
                        alt={p.name}
                        loading="lazy"
                        width="760"
                        height="660"
                      />
                    )}
                  </div>
                  <div className="clinical-card-copy">
                    <h3>
                      {c.name}
                      <HiArrowUpRight />
                    </h3>
                    <p>{c.note}</p>
                  </div>
                </Link>
              )
            })}
          </div>
          <div className="accessory-link">
            <span>
              Looking for consumables, mounting options or equipment
              accessories?
            </span>
            <Link to="/solutions?specialty=accessories" className="text-link">
              Browse accessories <HiArrowUpRight />
            </Link>
          </div>
        </div>
      </section>
      <section className="section selected-equipment">
        <div className="wrap">
          <div className="section-heading">
            <div>
              <p className="eyebrow">A CLOSER LOOK</p>
              <h2>Explore the possibilities.</h2>
            </div>
            <p>
              Discover respiratory care, surgical imaging, diagnostics and
              patient support systems from our manufacturer ranges.
            </p>
          </div>
          <div className="featured-equipment-grid">
            {featuredIds
              .map((id) => range.find((p) => p.id === id))
              .filter(Boolean)
              .map((p) => (
                <Link
                  key={p.id}
                  to={`/solutions?q=${encodeURIComponent(p.name)}`}
                  className="featured-equipment"
                >
                  <div className="featured-product-image">
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      width="760"
                      height="660"
                    />
                  </div>
                  <div>
                    <span>
                      {manufacturerBrands.find((b) => b.id === p.brand)?.name}
                    </span>
                    <h3>
                      {p.name}
                      <HiArrowUpRight />
                    </h3>
                    <p>{p.categoryLabel}</p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>
      <section className="engineering-story">
        <div className="wrap engineering-grid">
          <div className="engineering-photo">
            <img
              src="/images/products/karl-storz-or1-integration-hd.webp"
              alt="KARL STORZ OR1 integrated operating room"
              loading="lazy"
              width="2540"
              height="1429"
            />
            <div className="engineering-caption">
              <HiOutlineWrenchScrewdriver />
              <span>
                Equipment is only half the story.
                <br />
                <strong>People keep it working.</strong>
              </span>
            </div>
          </div>
          <div className="engineering-copy">
            <p className="eyebrow">SERVICE IS PART OF THE SOLUTION</p>
            <h2>
              Delivery is a milestone.{' '}<br className="heading-break" /><em>Support is a relationship.</em>
            </h2>
            <p>
              Our service engineers look after the medical equipment we supply —
              from installation and commissioning to maintenance and servicing.
            </p>
            <ul>
              {[
                'Installation & commissioning',
                'Preventive maintenance & calibration',
                'Equipment servicing & technical support',
              ].map((s) => (
                <li key={s}>
                  <HiOutlineCheck />
                  {s}
                </li>
              ))}
            </ul>
            <Link to="/service" className="button button-light">
              Discover our engineering support <HiArrowUpRight />
            </Link>
          </div>
        </div>
      </section>
      <section className="how-to-buy section">
        <div className="wrap">
          <p className="eyebrow">FROM EXPLORATION TO INSTALLATION</p>
          <h2>A simpler way to get equipped.</h2>
          <div className="buying-steps">
            {[
              [
                HiOutlineShieldCheck,
                'Explore with confidence',
                'Browse equipment and follow direct links to official manufacturer information.',
              ],
              [
                HiOutlineDocumentText,
                'Build your requirements',
                'Save equipment to your quote list and choose the quantities your facility needs.',
              ],
              [
                HiOutlinePhone,
                'Talk to the right people',
                'Our team helps confirm configuration, availability, installation and support.',
              ],
            ].map(([Icon, title, text], i) => (
              <article key={title}>
                <div>
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  <Icon />
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <CallToAction />
    </>
  )
}
