import { HiArrowUpRight } from 'react-icons/hi2'
import { Link } from 'react-router-dom'
import { director, headOfAdministration, teamMembers } from '../data/team'
import TeamTogether from '../components/TeamTogether'
import PageIntro from '../components/PageIntro'
import CallToAction from '../components/CallToAction'

export default function About() {
  return (
    <>
      <PageIntro
        eyebrow="About Medelec"
        title={
          <>
            Global technology.
            <br />
            <span>Personal commitment.</span>
          </>
        }
        description="We connect healthcare institutions with medical technology, practical expertise and a local team that stays involved."
      />
      <section className="section">
        <div className="wrap about-story">
          <div className="about-photo">
            <img
              src="/images/products/hamilton-hf90.webp"
              alt="HAMILTON-HF90 high flow therapy system"
              width="1500"
              height="1021"
            />
            <div className="photo-caption">
              HAMILTON MEDICAL / HF90 HIGH FLOW THERAPY
            </div>
          </div>
          <div>
            <p className="eyebrow">BUILT ON RELATIONSHIPS</p>
            <h2>
              A healthcare partner,
              <br />
              from the ground up.
            </h2>
            <p className="intro-copy">
              Every hospital has its own challenges. Our work starts by
              understanding yours.
            </p>
            <p>
              Based in Mohali, Medelec Healthcare Solutions supports hospitals
              and diagnostic centres across North India with equipment for
              critical care, radiology, ward infrastructure and patient
              monitoring.
            </p>
            <p>
              We work with established manufacturers including Hamilton Medical,
              KARL STORZ, Spacelabs Healthcare, Kiran Medical, Samsung Healthcare,
              LINET, Helmier and Nihon Kohden (defibrillation). From equipment selection to installation and
              ongoing service, our team helps you
              move forward with confidence.
            </p>
            <Link to="/solutions" className="text-link">
              Explore our medical solutions <HiArrowUpRight />
            </Link>
          </div>
        </div>
      </section>
      <section className="founder-section" aria-labelledby="founder-heading">
        <div className="wrap founder-grid">
          <figure className="founder-portrait">
            <img
              src={director.image}
              alt={`${director.name}, ${director.title} of Medelec Healthcare Solutions`}
              width="404"
              height="551"
              loading="lazy"
              decoding="async"
            />
            <figcaption>
              <span className="founder-caption-label">THE PERSON BEHIND THE PURPOSE</span>
              <h3>{director.name}</h3>
              <p>{director.title}</p>
            </figcaption>
          </figure>
          <div className="founder-copy">
            <p className="eyebrow">A NOTE FROM OUR FOUNDER</p>
            <h2 id="founder-heading">
              Better equipment.
              <br />
              <em>Lasting relationships.</em>
            </h2>
            <blockquote>
              <p>“{director.quote}”</p>
            </blockquote>
            <p className="founder-commitment">
              Equipment is the starting point. Our commitment continues through
              installation, maintenance and the everyday work of keeping your
              systems ready for care.
            </p>
            <div className="founder-values" aria-label="Our commitments">
              <span>Practical expertise</span>
              <span>Personal support</span>
              <span>Ongoing service</span>
            </div>
            <a href="#service-engineers" className="founder-link">
              Meet the engineers who carry it forward <HiArrowUpRight />
            </a>
          </div>
        </div>
      </section>
      <section className="section administration-section" aria-labelledby="administration-heading">
        <div className="wrap administration-grid">
          <div className="administration-copy">
            <p className="eyebrow">THE PEOPLE BEHIND EVERY DETAIL</p>
            <h2 id="administration-heading">Thoughtful coordination.<br /><em>Dependable follow-through.</em></h2>
            <p className="administration-intro">Good service starts with a team that works well together.</p>
            <p>As Head of Administration, {headOfAdministration.name} supports the day-to-day coordination behind Medelec’s work with healthcare institutions and our service team.</p>
            <p>Her role brings the people, communication and practical details together, helping our team stay organised and responsive from the first conversation to ongoing support.</p>
            <div className="administration-values" aria-label="Administration focus"><span>Clear communication</span><span>Team coordination</span><span>Consistent follow-through</span></div>
            <Link to="/contact" className="text-link">Connect with our team <HiArrowUpRight /></Link>
          </div>
          <figure className="administration-portrait">
            <div className="administration-photo-frame"><img src={headOfAdministration.image} alt={`${headOfAdministration.name}, ${headOfAdministration.title} at Medelec Healthcare Solutions`} width="709" height="1280" loading="lazy" decoding="async" /></div>
            <figcaption><span>THE CARE BEHIND THE COORDINATION</span><h3>{headOfAdministration.name}</h3><p>{headOfAdministration.title}</p></figcaption>
          </figure>
        </div>
      </section>
      <TeamTogether />
      <section className="section service-team" id="service-engineers" aria-labelledby="engineers-heading">
        <div className="wrap">
          <div className="service-team-heading">
            <div>
              <p className="eyebrow">HERE TO KEEP YOU WORKING</p>
              <h2 id="engineers-heading">Your service team.</h2>
            </div>
            <p>From installation to ongoing care, meet the engineers who support your equipment.</p>
          </div>
          <div className="service-team-roster">
            {teamMembers.map((member, index) => (
              <article className="service-team-member" key={member.id}>
                <span className="service-team-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <div className="service-team-identity">
                  <h3>{member.name}</h3>
                  <p>{member.role}</p>
                </div>
                <p className="service-team-focus">{member.focus}</p>
              </article>
            ))}
          </div>
          <div className="service-team-footer">
            <p>Practical expertise. Support that stays.</p>
            <Link to="/service" className="text-link">Explore our service support <HiArrowUpRight /></Link>
          </div>
        </div>
      </section>
      <CallToAction />
    </>
  )
}
