import { Link } from 'react-router-dom'
import seedlingIcon from '../assets/noun-seedling-5009514.svg'
import germinationIcon from '../assets/noun-germination-7706588.svg'
import treeIcon from '../assets/noun-tree-with-leaves-6402273.svg'
import DoorsSection from '../components/DoorsSection'
import './Home.css'

function Home() {
  return (
    <div className="home">
      <section className="home-hero" aria-labelledby="hero-heading">
        <div className="home-hero-content">
          <h1 id="hero-heading" className="home-hero-title">
            <span className="hero-line">The wrong software, written well, is still the wrong software.</span>{' '}
            <span className="hero-line">We build the right thing for the problem you actually have.</span>
          </h1>
          <p className="home-hero-description">
            Like the protective forest layer we are named for, we create the
            conditions for your team to thrive, building software that is
            accessible, maintainable, and useful long after we hand it over.
          </p>
        </div>
      </section>

      <DoorsSection />

      <section className="forest-health" aria-labelledby="forest-health-heading">
        <div className="section-container">
          <div className="forest-health-content">
            <p className="section-eyebrow">Free self-assessment</p>
            <h2 id="forest-health-heading">How Healthy Is Your Digital Forest?</h2>
            <p>
              Technical debt builds quietly, complexity grows, and a crisis can
              arrive without warning. Knowing where your systems actually stand
              is the first step toward changing it.
            </p>
            <p>
              Our free assessment shows where your team is struggling, whether
              one system is on fire or the whole canopy has become a firestorm,
              and points to where we can help.
            </p>
            <Link to="/quiz" className="btn btn-primary">Take the Quiz</Link>
          </div>
        </div>
      </section>

      <section className="what-we-do" aria-labelledby="what-we-do-heading">
        <div className="section-container">
          <p className="section-eyebrow">Our services</p>
          <h2 id="what-we-do-heading">What We Do</h2>
          <p className="what-we-do-intro">
            We take the work in whatever shape it arrives: a live crisis, a
            single defined task, or ongoing technical leadership for your
            roadmap.
          </p>
          <ul className="service-grid" role="list">
            <li className="service-card">
              <h3>Advisory</h3>
              <p>
                Strategic consulting, technology assessment, and digital
                transformation guidance to help you make informed decisions.
              </p>
              <Link to="/advisory" className="service-link">
                Learn More<span className="sr-only"> about advisory services</span>
              </Link>
            </li>
            <li className="service-card">
              <h3>Implementation</h3>
              <p>
                Full-stack development, DevOps, and specialized expertise in
                accessibility, education technology, and more.
              </p>
              <Link to="/implementation" className="service-link">
                Learn More<span className="sr-only"> about implementation services</span>
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <section className="how-we-work" aria-labelledby="how-we-work-heading">
        <div className="section-container">
          <h2 id="how-we-work-heading">How We Work</h2>
          <ul className="work-grid" role="list">
            <li className="work-step">
              <img className="work-icon" src={germinationIcon} alt="" aria-hidden="true" />
              <h3>Root</h3>
              <p>
                We begin by understanding your foundation. Through deep
                discovery, we uncover the challenges, opportunities, and goals
                that lie beneath the surface. This grounding ensures everything
                we build has strong roots.
              </p>
            </li>
            <li className="work-step">
              <img className="work-icon" src={seedlingIcon} alt="" aria-hidden="true" />
              <h3>Rise</h3>
              <p>
                With a solid foundation, we begin building. Through
                collaborative development and iterative refinement, your
                solution takes shape. We work alongside your team, growing
                together toward the outcome you defined.
              </p>
            </li>
            <li className="work-step">
              <img className="work-icon" src={treeIcon} alt="" aria-hidden="true" />
              <h3>Flourish</h3>
              <p>
                We deliver solutions built to thrive. Beyond launch, we ensure
                your team is empowered to maintain and evolve what we've built
                together. We measure our work by whether your team can carry it
                forward without us.
              </p>
            </li>
          </ul>
        </div>
      </section>

      <section className="cta-section" aria-labelledby="cta-heading">
        <div className="section-container">
          <h2 id="cta-heading">Ready to Grow Together?</h2>
          <p>Let's discuss how we can help transform your ideas into reality.</p>
          <Link to="/contact" className="btn btn-primary btn-large">Start a Conversation</Link>
        </div>
      </section>
    </div>
  )
}

export default Home
