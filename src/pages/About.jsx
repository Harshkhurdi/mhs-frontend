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
              Samsung Healthcare, LINET and Spacelabs Healthcare. From equipment
              selection to installation and ongoing service, our team helps you
              move forward with confidence.
            </p>
            <Link to="/solutions" className="text-link">
              Explore our medical solutions <HiArrowUpRight />
            </Link>
          </div>
        </div>
      </section>
      <section className="leadership-section">
        <div className="wrap leadership-grid">
          <div>
            <p className="eyebrow">A NOTE FROM OUR LEADERSHIP</p>
            <div className="director-profile">
              <span>{director.initials}</span>
              <div>
                <h2>{director.name}</h2>
                <p>{director.title}</p>
              </div>
            </div>
          </div>
          <blockquote>
            “{director.quote}”
            <span>
              Equipment is the starting point. The relationship is what makes it
              work.
            </span>
          </blockquote>
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <div className="section-heading">
            <div>
              <p className="eyebrow">THE PEOPLE BEHIND THE PROMISE</p>
              <h2>
                One team.
                <br />
                Service engineers.
              </h2>
            </div>
            <p>
              Our service engineers install, maintain and service the medical
              equipment we supply, supporting your facility throughout its life.
            </p>
          </div>
          <div className="team-grid">
            {teamMembers.map((m) => (
              <article className="team-card" key={m.id}>
                <span className="team-initials">{m.initials}</span>
                <h3>{m.name}</h3>
                <p className="team-role">{m.role}</p>
                <p>{m.focus}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <CallToAction />
    </>
  )
}
