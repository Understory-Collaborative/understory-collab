import { Link } from 'react-router-dom'
import './About.css'

function About() {
  const capabilities = [
    { name: 'DevOps', description: 'CI/CD pipelines, infrastructure as code, monitoring and observability' },
    { name: 'Design', description: 'User research, UX design, visual design, design systems' },
    { name: 'Front End', description: 'React, Vue, Angular, responsive design, performance optimization' },
    { name: 'Back End', description: 'APIs, microservices, databases, system architecture' },
    { name: 'Business Process Outsourcing', description: 'Process automation, workflow optimization, operational efficiency' },
    { name: 'IT Outsourcing', description: 'Staff augmentation, managed services, technical leadership' },
  ]

  const industries = [
    'Legal, Policy & Compliance',
    'Consumer Products & Services',
    'Health & Safety',
    'Education',
  ]

  return (
    <div className="about">
      <section className="page-hero" aria-labelledby="about-heading">
        <div className="page-hero-content">
          {/* FLAG: brand metaphor is the understory (beneath the canopy); confirm final hero wording with client */}
          <h1 id="about-heading">
            The Understory Collaborative takes its name from the protective forest
            layer that shelters vulnerable growth and creates the environment for a
            rich diversity of life.
          </h1>
          <p className="page-hero-description">
            Like the understory, we create the conditions for people and organizations
            to flourish—through accessible, ethical technology and collaborative practice.
          </p>
        </div>
      </section>

      <section className="about-intro" aria-labelledby="who-we-are-heading">
        <div className="section-container">
          <h2 id="who-we-are-heading">Who We Are</h2>
          <div className="about-intro-copy">
            <p>
              We are a team of seasoned technologists with decades of combined experience
              across diverse industries including healthcare, transportation, legal services
              and beyond.
            </p>
            <p>
              We bridge the gap between business objectives and technical implementation
              through a deep understanding of both our clients' systems and the people they
              serve.
            </p>
          </div>
          <ul className="about-cards" role="list">
            <li className="about-card">
              <h3>Human-Centric</h3>
              <p>We put people first, designing solutions that work for real users with real needs.</p>
            </li>
            <li className="about-card">
              <h3>Experienced</h3>
              <p>Decades of professional experience across industries and technologies.</p>
            </li>
            <li className="about-card">
              <h3>Holistic</h3>
              <p>We understand both business drivers and technical constraints.</p>
            </li>
          </ul>
        </div>
      </section>

      <section className="about-capabilities" aria-labelledby="capabilities-heading">
        <div className="section-container">
          <h2 id="capabilities-heading">Technical Capabilities</h2>
          {/* PLACEHOLDER — brief specifies an intro line here but supplies no copy; awaiting client */}
          <p className="about-section-intro placeholder-copy">[Intro line coming soon]</p>
          <ul className="capability-cards" role="list">
            {capabilities.map((capability) => (
              <li className="capability-card" key={capability.name}>
                <h3>{capability.name}</h3>
                <p>{capability.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="about-industries" aria-labelledby="industries-heading">
        <div className="section-container">
          <h2 id="industries-heading">Industry Expertise</h2>
          {/* PLACEHOLDER — brief specifies an intro line here but supplies no copy; awaiting client */}
          <p className="about-section-intro placeholder-copy">[Intro line coming soon]</p>
          <ul className="industry-cards" role="list">
            {industries.map((industry) => (
              <li className="industry-card" key={industry}>
                <h3>{industry}</h3>
                {/* PLACEHOLDER — awaiting client blurb; full narratives live on Our Work */}
                <p className="placeholder-copy">[Short description coming soon]</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="cta-section" aria-labelledby="about-cta-heading">
        <div className="section-container">
          <h2 id="about-cta-heading">We'd Love to Hear From You</h2>
          <p>Let's start a conversation that gets you closer to a solution.</p>
          <Link to="/contact" className="btn btn-primary btn-large">Contact Us</Link>
        </div>
      </section>
    </div>
  )
}

export default About
