import { HiArrowUpRight } from 'react-icons/hi2'
import { Link } from 'react-router-dom'
import { director, teamMembers } from '../data/team'
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
              Samsung Healthcare, LINET, Spacelabs Healthcare, KARL STORZ and
              Kiran Medical. From equipment selection to installation and
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
              alt={`${director.name}, Founder and Managing Director of Medelec Healthcare Solutions`}
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
      <section className="section engineers-section" id="service-engineers" aria-labelledby="engineers-heading">
        <div className="wrap">
          <div className="engineers-heading">
            <div>
              <p className="eyebrow">THE PEOPLE BEHIND THE PROMISE</p>
              <h2 id="engineers-heading">
                One team.
                <br />
                <span>Service engineers.</span>
              </h2>
            </div>
            <p>
              Our service engineers install, maintain and service the medical
              equipment we supply, supporting your facility throughout its life.
            </p>
          </div>
          <div className="engineer-roster">
            {teamMembers.map((m, i) => (
              <article className={`engineer-profile${i > 2 ? ' engineer-profile-wide' : ''}`} key={m.id}>
                <div className="engineer-profile-top">
                  <span className="engineer-monogram" aria-hidden="true">{m.initials}</span>
                  <span className="engineer-number" aria-hidden="true">0{i + 1}</span>
                </div>
                <p className="engineer-role">{m.role}</p>
                <h3>{m.name}</h3>
                <p className="engineer-focus">{m.focus}</p>
              </article>
            ))}
          </div>
          <div className="engineers-followthrough">
            <p>From installation to ongoing care, a team you can come back to.</p>
            <Link to="/service" className="text-link">
              How we support your equipment <HiArrowUpRight />
            </Link>
          </div>
        </div>
      </section>
      <CallToAction />
    </>
  )
}
