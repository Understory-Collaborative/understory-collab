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
    situation:
      'You have a roadmap to set or a build-versus-buy call to make, and a lot riding on getting it right.',
    deliverables: [
      'A sequenced, costed roadmap, with the first increment specified closely enough to start building the week we finish.',
      'A build-versus-buy recommendation for each major decision, with the reasoning written down so you can defend it.',
      'A vendor shortlist scored against your actual constraints.',
    ],
    proof:
      'The same team that writes the plan can build it, so you get a roadmap you can execute.',
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
    situation:
      'You inherited a system you cannot fully judge from the outside, and a decision rides on it.',
    deliverables: [
      'A written read on your architecture, ranked by what will hurt first and what can wait.',
      'A technical-debt list with a cost and a fix beside each item, so you can budget it.',
      'A security and compliance gap check mapped to the standard you answer to, whether that is HIPAA, SOC 2, or FERPA.',
    ],
    proof:
      'We read the running code and work inside your repository, so the assessment reflects the system you actually run.',
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
    situation:
      'You need to modernize aging systems without stalling the roadmap or disrupting the people who depend on them.',
    deliverables: [
      'A modernization plan broken into increments, so delivery keeps moving while the old system is retired piece by piece.',
      'A migration path for each legacy component, with the risks and the rollback named up front.',
      'A change plan for the teams whose daily work shifts, so the new system gets adopted instead of resented.',
    ],
    proof:
      'We can execute each increment with you, so the plan turns into shipped software.',
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
      <p className="service-situation">{service.situation}</p>
      <p className="service-deliverables-label">What you walk away with</p>
      <ul className="service-deliverables">
        {service.deliverables.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p className="service-proof">{service.proof}</p>
      <button
        type="button"
        className="service-disclosure"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((prev) => !prev)}
      >
        Areas we cover
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
            Some problems need a rebuild, and some need <strong>an afternoon</strong>.
            We tell you which one you actually have before you spend a dollar.
          </h1>
        </div>
      </section>

      <section className="advisory-intro" aria-labelledby="approach-heading">
        <div className="section-container">
          <h2 id="approach-heading">Consulting That's Collaborative</h2>
          <p>
            If your app runs on a Google Sheet today, we will not sell you a
            rebuild you would then pay to run, secure, and maintain. We size the
            recommendation to the problem in front of you, and we tell you when
            the cheaper fix is the right one.
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

      <section className="advisory-handoff" aria-labelledby="handoff-heading">
        <div className="section-container">
          <h2 id="handoff-heading">One team that advises and builds</h2>
          <p>
            Every advisory engagement can continue into implementation with the
            same people, on your call. You keep one team that already knows your
            plan instead of handing it to a second firm to learn it from scratch.
          </p>
          <Link to="/implementation" className="advisory-handoff-link">
            See how we build<span className="sr-only"> on the implementation page</span>
          </Link>
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
