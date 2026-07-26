import { useId, useState } from 'react'
import { Link } from 'react-router-dom'
import './Advisory.css'

const services = [
  {
    title: 'Strategy Consulting',
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
      </svg>
    ),
    description:
      "Navigate complex decisions with confidence. We help you define technology roadmaps, evaluate build-vs-buy decisions, and align technical investments with business objectives.",
    features: [
      'Technology roadmap development',
      'Build vs. buy analysis',
      'Vendor selection and evaluation',
      'Technical due diligence',
      'Innovation strategy',
    ],
  },
  {
    title: 'Technology Assessment',
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
    ),
    description:
      "Understand where you are to chart where you're going. Our assessments provide clear-eyed evaluation of your current technology landscape, identifying strengths, gaps, and opportunities for improvement.",
    features: [
      'Architecture review and analysis',
      'Security and compliance assessment',
      'Performance and scalability evaluation',
      'Technical debt inventory',
      'Team capability assessment',
    ],
  },
  {
    title: 'Digital Transformation',
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"></polyline>
        <polyline points="8 6 2 12 8 18"></polyline>
      </svg>
    ),
    description:
      'Transform how your organization operates with technology. We guide you through the complexities of modernization, ensuring that change delivers real value while managing risk and maintaining continuity.',
    features: [
      'Modernization strategy and planning',
      'Process optimization and automation',
      'Change management support',
      'Legacy system transition planning',
      'Digital capability building',
    ],
  },
]

function ServiceCard({ service }) {
  const [open, setOpen] = useState(false)
  const panelId = useId()

  return (
    <li className="service-card">
      <span className="service-icon" aria-hidden="true">
        {service.icon}
      </span>
      <h3>{service.title}</h3>
      <p>{service.description}</p>
      <button
        type="button"
        className="service-disclosure"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((prev) => !prev)}
      >
        More
      </button>
      <ul id={panelId} className="service-features" hidden={!open}>
        {service.features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
    </li>
  )
}

function Advisory() {
  return (
    <div className="advisory">
      <section className="page-hero" aria-labelledby="advisory-heading">
        <div className="page-hero-content">
          <h1 id="advisory-heading">
            <strong>Strategic Guidance</strong> from experienced technologists who
            understand business imperatives and technical realities.
          </h1>
        </div>
      </section>

      <section className="advisory-intro" aria-labelledby="approach-heading">
        <div className="section-container">
          <h2 id="approach-heading">Consulting That's Collaborative</h2>
          <p>
            We don't believe in one-size-fits-all solutions. Every organization has
            unique challenges, constraints, and opportunities. Our advisory practice
            is built on deep listening, thorough analysis, and actionable
            recommendations that respect your context and capabilities.
          </p>
        </div>
      </section>

      <section className="services-detail" aria-labelledby="services-heading">
        <div className="section-container">
          <h2 id="services-heading" className="sr-only">
            Our Advisory Services
          </h2>
          <ul className="services-grid" role="list">
            {services.map((service) => (
              <ServiceCard key={service.title} service={service} />
            ))}
          </ul>
        </div>
      </section>

      <section className="cta-section" aria-labelledby="cta-heading">
        <div className="section-container">
          <h2 id="cta-heading">Let's Explore What's Possible</h2>
          <p>
            Start with a conversation. We'll listen first, then help you chart the
            path forward.
          </p>
          <Link to="/contact" className="btn btn-primary btn-large">
            Schedule a Discussion
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Advisory
