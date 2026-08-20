import { Link } from 'react-router-dom'
import './OurWork.css'

// NOTE: This is a trimmed, capability-level draft built from the client's raw problem/
// solution notes. All specific metrics and named claims (record counts, "largest-ever,"
// delivery timelines, velocity multipliers, framework/membership claims) have been removed
// pending the client's sign-off. Narrative framing is a first pass for the client to edit.
const CATEGORIES = [
  {
    id: 'legal-policy-compliance',
    name: 'Legal, Policy & Compliance',
    intro:
      'We work where sensitive information meets legal and regulatory pressure: protected records, compliance programs, and the migrations and systems that have to stay defensible under scrutiny.',
    highlights: [
      { lead: 'Compliance that enables delivery', body: 'Turn SOC 2, HIPAA, GDPR, and NIST obligations into a concrete backlog teams can execute, and build the testing that keeps it holding every day, not just at audit time.' },
      { lead: 'Sensitive records at scale', body: 'Bring order to high-volume, sensitive document sets: cataloging, indexing, reconciliation, and secure exchange that hold up across parties and deadlines.' },
      { lead: 'Security posture and access', body: 'Stand up application-security programs and access governance, and run the discovery that surfaces the gaps that matter before you commit to a direction.' },
    ],
  },
  {
    id: 'consumer-products-services',
    name: 'Consumer Products & Services',
    intro:
      'Healthy acquisition means little without retention. We turn signups into engaged users and modernize the platforms underneath so growth holds.',
    highlights: [
      { lead: 'Adoption and activation', body: 'Onboarding grounded in behavioral science, and technical change communicated as value, so new capabilities get taken up instead of driving churn.' },
      { lead: 'Modernization that scales', body: 'Database migration and service-oriented architecture that restore speed and reliability as volume grows, with recovery and guardrails built in.' },
      { lead: 'Direction and capacity', body: 'Facilitate the roadmap decisions that align teams to strategy, and mentor product owners and engineers so the organization builds its own bench.' },
    ],
  },
  {
    id: 'health-safety',
    name: 'Health & Safety',
    intro:
      "Where an undetected fault becomes real-world harm, reliability and compliance can't be afterthoughts. We ship fast under strict constraints and build resilience into how teams work.",
    highlights: [
      { lead: 'Reliable, compliant delivery', body: 'DevOps and delivery for health-critical, HIPAA-bound systems, with service objectives drawn from real incident data.' },
      { lead: 'Resilience, not just response', body: 'Move teams from firefighting to resilience built into their practices, and strengthen how they communicate under pressure.' },
      { lead: 'Reporting that holds up', body: 'Automate compliance and regulatory reporting so it runs fast, consistently, and stays auditable across jurisdictions.' },
    ],
  },
  {
    id: 'education',
    name: 'Education',
    intro:
      'Districts adopt tools faster than they can absorb them. We make technology actually get used, through integrations that work, identity that scales, and data that informs.',
    highlights: [
      { lead: 'Integrations that fit', body: 'Standards-based integration (LTI, OneRoster, SSO) built to serve the classroom, not just pass a technical check.' },
      { lead: 'Identity and rostering at scale', body: 'Rostering and identity infrastructure that holds up under district complexity: high volume, constant change, and users in many roles at once.' },
      { lead: 'Adoption and data', body: 'Diagnose why rollouts stall, and consolidate district data for state reporting, with the governance case to back it.' },
    ],
  },
]

function OurWork() {
  return (
    <div className="our-work">
      <section className="page-hero" aria-labelledby="our-work-heading">
        <div className="page-hero-content">
          <h1 id="our-work-heading">Our work</h1>
          <p className="page-hero-description">
            We work in regulated, high-stakes domains where the cost of getting it wrong is
            high. Here's where we do our best work, and the kinds of problems we solve.
          </p>
        </div>
      </section>

      {CATEGORIES.map((category, index) => (
        <section
          key={category.id}
          className={index % 2 === 1 ? 'work-category work-category--tint' : 'work-category'}
          aria-labelledby={`${category.id}-heading`}
        >
          <div className="section-container">
            <h2 id={`${category.id}-heading`}>{category.name}</h2>
            <p className="work-category-intro">{category.intro}</p>
            <ul className="work-items" role="list">
              {category.highlights.map((item) => (
                <li className="work-item" key={item.lead}>
                  <h3 className="work-item-lead">{item.lead}</h3>
                  <p className="work-item-body">{item.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}

      <section className="cta-section" aria-labelledby="our-work-cta-heading">
        <div className="section-container">
          <h2 id="our-work-cta-heading">Have a problem that looks familiar?</h2>
          <p>Tell us what you're working on and we'll tell you how we can help.</p>
          <Link to="/contact" className="btn btn-primary btn-large">Send us a note</Link>
        </div>
      </section>
    </div>
  )
}

export default OurWork
