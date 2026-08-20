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
    {
      name: 'Legal, Policy & Compliance',
      description:
        'Protected-data handling and compliance frameworks (SOC 2, HIPAA, FERPA, GDPR, NIST), plus high-stakes migrations and records systems that hold up under legal scrutiny.',
    },
    {
      name: 'Consumer Products & Services',
      description:
        'Onboarding and adoption grounded in behavioral science, platform modernization, and integration strategy that turns signups into retention and lifts delivery velocity.',
    },
    {
      name: 'Health & Safety',
      description:
        'Safety-critical reliability and HIPAA-bound delivery, with resilience built into how teams work, across healthcare DevOps and compliance-heavy operational systems.',
    },
    {
      name: 'Education',
      description:
        'District-scale rostering and identity, standards-based integrations (LTI, OneRoster, SSO), and data consolidation for state reporting and adoption that sticks.',
    },
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
            to flourish, through accessible, ethical technology and collaborative practice.
          </p>
        </div>
      </section>

      <section className="about-intro" aria-labelledby="who-we-are-heading">
        <div className="section-container">
          <h2 id="who-we-are-heading">Who we are</h2>
          <div className="about-intro-copy">
            <p>
              We are technical product managers. We reject the idea that you're either a weak
              generalist or a narrow specialist. It's a rare combination, and a hard one to do
              well, which is usually why the work stalled before we got there.
            </p>
            <p>
              The work lives in the messy middle, and it takes someone who thrives there. That
              person is a jack of all trades who works with real depth, from market research,
              enablement, and go-to-market to reading the technical documentation and sitting
              in a team's challenge reviews.
            </p>
            <p>
              We've spent decades on both sides of that, across healthcare, transportation,
              legal services, and beyond. When your project is behind or your team is stuck, we
              come in, get it moving, and step back once your team can run it without us.
            </p>
          </div>
          <ul className="about-cards" role="list">
            <li className="about-card">
              <h3>Human-centric</h3>
              <p>We put people first, designing around how people actually work and what they need.</p>
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
          <h2 id="capabilities-heading">Technical capabilities</h2>
          <p className="about-section-intro">
            Our team covers the full stack, infrastructure, back end, front end, and
            design, with specialized expertise in modern development practices.
          </p>
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
          <h2 id="industries-heading">Industry expertise</h2>
          <p className="about-section-intro">
            We've delivered solutions across diverse industries, bringing domain
            knowledge that accelerates delivery and reduces risk.
          </p>
          <ul className="industry-cards" role="list">
            {industries.map((industry) => (
              <li className="industry-card" key={industry.name}>
                <h3>{industry.name}</h3>
                <p>{industry.description}</p>
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
