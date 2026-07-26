import { Link } from 'react-router-dom'
import './Implementation.css'

const principles = [
  {
    title: 'Iterative Development',
    description: 'Regular releases, continuous feedback, constant improvement',
  },
  {
    title: 'Transparent Communication',
    description: 'Clear updates, honest assessments, no surprises',
  },
  {
    title: 'Knowledge Transfer',
    description: 'Your team grows alongside the solution',
  },
  {
    title: 'Quality Built In',
    description: 'Testing, documentation, and maintainability from day one',
  },
]

function Implementation() {
  return (
    <div className="implementation">
      <section className="page-hero" aria-labelledby="implementation-heading">
        <div className="page-hero-content">
          <h1 id="implementation-heading">
            From Concept to Deployment, <strong>We Build Software</strong> That
            Combines Technical Excellence With a Deep Commitment to User-Centered
            Design.
          </h1>
        </div>
      </section>

      <section className="implementation-intro" aria-labelledby="partnership-heading">
        <div className="section-container">
          <h2 id="partnership-heading">Delivering in Partnership</h2>
          <p>
            Our process is iterative and transparent—you'll always know where we are
            and where we're headed. Whether you need a full team to build from
            scratch, specialists to augment your existing capabilities, or technical
            leadership to guide your roadmap, we adapt to fit your needs.
          </p>
        </div>
      </section>

      <section className="principles-section" aria-labelledby="principles-heading">
        <div className="section-container">
          <h2 id="principles-heading" className="sr-only">
            How We Deliver
          </h2>
          <ul className="principles-list" role="list">
            {principles.map((principle) => (
              <li key={principle.title} className="principle-card">
                <h3>{principle.title}</h3>
                <p>{principle.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="cta-section" aria-labelledby="cta-heading">
        <div className="section-container">
          <h2 id="cta-heading">Ready to Build Something Great?</h2>
          <p>
            Tell us about your project. We'll help you figure out the best path
            forward.
          </p>
          <Link to="/contact" className="btn btn-primary btn-large">
            Start a Project
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Implementation
