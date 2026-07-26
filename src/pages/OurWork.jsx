import { Link } from 'react-router-dom'
import './OurWork.css'

const CATEGORIES = [
  {
    id: 'legal-policy-compliance',
    name: 'Legal, Policy & Compliance',
    intro:
      'Sensitive information under legal and regulatory pressure runs through this work—from paper-era records to modern privacy law—along with the compliance and security programs that keep organizations defensible as they scale.',
    frameworks: ['ISO', 'NIST', 'SOC 2', 'HIPAA', 'FERPA', 'COPPA', 'FedRAMP', 'GDPR'],
    items: [
      { lead: 'High-risk, high-complexity migrations', body: "Delivered a firm's largest-ever system migration—complexity comparable to a major ERP rollout—on time and on budget, protecting billing continuity and client trust." },
      { lead: 'Data migration without loss', body: 'Schema design and data mapping to move years of financial and case data into new systems without loss or corruption.' },
      { lead: 'System integration', body: 'Connected new financial systems with existing case-management platforms, avoiding duplicate entry and workflow breakage.' },
      { lead: 'Training through transitions', body: 'Compressed a three-day training program into three hours with no loss of outcomes—letting new attorneys bill sooner.' },
      { lead: 'Sensitive-data handling', body: 'Protected personal information handled at scale, from paper records to modern privacy law—the same discipline behind today’s DPAs, BAAs, and defensible data handling.' },
      { lead: 'Unstructured document volume', body: 'Custom catalogs and indexes that turned 41,000+ case records in a single class action into instant retrieval.' },
      { lead: 'Reconciling records across parties', body: 'Reconcile records across attorneys, providers, and opposing counsel so the record set holds up.' },
      { lead: 'Claimant status tracking', body: 'Tracking systems that keep claimant status current across large caseloads.' },
      { lead: 'Records-request escalation', body: 'Own the escalation path and resolve requisition bottlenecks against attorney deadlines.' },
      { lead: 'Secure document exchange', body: 'Secure transfer infrastructure for sensitive medical and legal records.' },
      { lead: 'Settlement-ready records', body: 'Supervise records-audit work that keeps high-volume mediated settlements moving with clean, defensible documentation.' },
      { lead: 'Audit quality at volume', body: 'Train and lead auditors to hold quality when the caseload and the stakes are both high.' },
      { lead: 'Compliance that enables delivery', body: 'Lead SOC 2 and NIST implementations that turn regulatory requirements into product and process changes teams actually adopt.' },
      { lead: 'Turning regulation into a backlog', body: 'Translate GDPR, HIPAA, SOC 2, and NIST obligations into a concrete backlog engineering and non-technical teams can execute.' },
      { lead: 'Continuous compliance', body: 'Build compliance testing into infrastructure so it holds every day, not just at audit time.' },
      { lead: 'Security-testing posture', body: 'Designed the 5Cs Framework to give teams a repeatable way to assess their security-testing maturity.' },
      { lead: 'Application security from the ground up', body: 'Assess, guide, and enable infosec teams standing up an application security program.' },
      { lead: 'Access governance', body: 'Redesign access governance to cut resolution time while holding least-privilege.' },
      { lead: 'Integrity at scale', body: 'Manage infrastructure trusted to deliver millions of high-stakes transactions with integrity.' },
      { lead: 'Discovery before commitment', body: 'Run discovery and proof-of-concept work that surfaces the real gaps before a client commits to a direction.' },
    ],
  },
  {
    id: 'consumer-products-services',
    name: 'Consumer Products & Services',
    intro:
      'Healthy acquisition means little without retention. We turn signups into engaged users, drive adoption of new capabilities, and modernize the platforms underneath—so growth holds.',
    items: [
      { lead: 'Retention behind acquisition', body: 'Onboarding and activation grounded in behavioral science that turn signups into returning users.' },
      { lead: 'Adoption of new capabilities', body: 'Drive adoption of new and breaking capabilities across large customer bases.' },
      { lead: 'Integration sprawl', body: 'Integration strategy across platforms and partners—work that lifted delivery velocity 7x.' },
      { lead: 'Communicating technical change', body: 'Translate breaking changes and migrations into value narratives that drive adoption instead of churn.' },
      { lead: 'Legacy migrations that break workflows', body: 'Design migrations that anticipate behavioral and data issues, with recovery processes and guardrails built in.' },
      { lead: 'Aligning product direction', body: 'Facilitate workshops that get architecture, features, and direction articulated to everyone in the room.' },
      { lead: 'Scaling the team, not just features', body: 'Mentor product owners, scrum masters, and developers so teams build their own bench.' },
      { lead: 'Reliability that protects retention', body: 'Engineer for reliability and set service objectives from real incident data.' },
      { lead: 'Delivering on personalization', body: 'Machine-learning-driven personalization that ships instead of staying a roadmap line.' },
      { lead: 'Roadmaps aligned to strategy', body: 'Build multi-year roadmaps aligned to executive priorities so investment lands in the right places.' },
      { lead: 'Platforms that buckle at scale', body: 'Lead modernization—database migration, service-oriented architecture—to restore scale and speed.' },
      { lead: 'Reporting for real decisions', body: 'Design reporting built for scale and the numbers leadership needs to decide.' },
      { lead: 'Cross-functional delivery', body: 'Coordinate across product, engineering, and operations to keep big initiatives on track.' },
      { lead: 'Security by design', body: 'Fold compliance and security in from the start instead of as late rework.' },
    ],
  },
  {
    id: 'health-safety',
    name: 'Health & Safety',
    intro:
      "Where an undetected fault becomes real-world harm, reliability and compliance can't be afterthoughts. We deliver fast under strict constraints and build resilience into how teams work.",
    items: [
      { lead: 'Automated regulatory reporting', body: 'Replaced manual Teradata SQL reporting (hours per run) with Python, cutting runtime to under an hour and freeing analyst time for higher-value work.' },
      { lead: 'Multi-jurisdiction compliance', body: 'Consistent, error-free compliance reporting across 49 states and one district, with geo-restriction and residency rules.' },
      { lead: 'Auditable, self-documenting reporting', body: 'A reusable reporting pattern that documents which variables and logic drove each report—adopted team-wide.' },
      { lead: 'Safety-critical reliability', body: 'Service objectives and reliability practices that catch failure before it becomes real-world harm.' },
      { lead: 'HIPAA-bound delivery', body: 'Lead DevOps for healthcare organizations shipping fast under HIPAA constraints.' },
      { lead: 'Incident communication', body: 'Study and strengthen how teams communicate under pressure, where breakdowns—not technology—cause the failure.' },
      { lead: 'Building resilience, not just response', body: 'Partner with teams to build resilience into how they work, not only how they react.' },
      { lead: 'Complex compliance-bound tooling', body: 'Ship compliance-heavy operational systems, including an airline maintenance platform delivered in 8 months.' },
    ],
  },
  {
    id: 'education',
    name: 'Education',
    intro:
      'Districts adopt tools faster than they can absorb them. We make technology actually get used—through integration that works, identity that scales, and data that informs.',
    items: [
      { lead: 'Adoption before purchase', body: 'Evaluate whether staff have the training, capacity, and workflow support to actually use a tool—before the district invests.' },
      { lead: 'Diagnosing stalled rollouts', body: 'Find the real cause of stalled adoption (process, training, or tool) instead of assuming staff are resistant.' },
      { lead: 'Bridging IT and curriculum', body: 'Translate between technical build and classroom need so integrations serve students and teachers.' },
      { lead: 'Integration due diligence', body: 'Assess whether a tool will genuinely integrate and whether staff can roll it out—before contracts are signed.' },
      { lead: 'Rostering & identity at scale', body: 'Bi-directional rostering and secure data exchange (OneRoster and the major providers) that holds up under district complexity.' },
      { lead: 'Data for state reporting', body: 'Consolidate data from disparate systems for state reporting and compliance—and carry the governance case with it.' },
      { lead: 'Owning the handoff', body: 'Keep the value from being lost between the team that diagnoses the problem and the team that builds the fix.' },
      { lead: 'Single sign-on done right', body: "Architect SSO with OAuth 2.0, OpenID Connect, SAML 2.0, ADFS, and LDAPS against a district's identity provider." },
      { lead: 'Portable learner credentials', body: 'Position platforms as CLR data providers and Open Badges 3.0 issuers so achievements become portable, verifiable credentials.' },
      { lead: 'Deep LMS integration', body: 'LTI 1.3 / LTI Advantage integrations with real deep linking and grade passback.' },
      { lead: 'Standards that keep moving', body: 'As a contributing 1EdTech member, build to LTI and OneRoster and run version-migration and deprecation strategy.' },
      { lead: 'Password & reset overhead', body: 'Identity infrastructure that eases the username and password burden young students and staff carry.' },
      { lead: 'Faster onboarding', body: 'Streamline onboarding so districts reach live use faster.' },
      { lead: 'Owning the partner ecosystem', body: 'Manage the integration partner ecosystem end to end—vendor relationships, RFP content, and enablement.' },
      { lead: 'Maintenance discipline', body: 'Disciplined platform maintenance so quality and velocity hold together.' },
    ],
  },
]

function OurWork() {
  return (
    <div className="our-work">
      <section className="page-hero" aria-labelledby="our-work-heading">
        <div className="page-hero-content">
          <h1 id="our-work-heading">Our Work</h1>
          <p className="page-hero-description">
            Across regulated, high-stakes domains, we solve the problems that threaten
            continuity, trust, and adoption. Here is the kind of work we know how to do.
          </p>
        </div>
      </section>

      {CATEGORIES.map((category, index) => (
        <section
          key={category.id}
          className={index % 2 === 0 ? 'work-category work-category--tint' : 'work-category'}
          aria-labelledby={`${category.id}-heading`}
        >
          <div className="section-container">
            <h2 id={`${category.id}-heading`}>{category.name}</h2>
            <p className="work-category-intro">{category.intro}</p>
            {category.frameworks && (
              <ul className="framework-tags" role="list" aria-label="Frameworks and standards">
                {category.frameworks.map((framework) => (
                  <li key={framework} className="framework-tag">{framework}</li>
                ))}
              </ul>
            )}
            <ul className="work-items" role="list">
              {category.items.map((item) => (
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
          <h2 id="our-work-cta-heading">Have a Problem That Looks Familiar?</h2>
          <p>Tell us what you're working on and we'll tell you how we can help.</p>
          <Link to="/contact" className="btn btn-primary btn-large">Start a Conversation</Link>
        </div>
      </section>
    </div>
  )
}

export default OurWork
