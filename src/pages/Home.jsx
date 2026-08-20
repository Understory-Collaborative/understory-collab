import { Link } from 'react-router-dom'
import PageMeta from '../components/PageMeta'
import seedIcon from '../assets/noun-seed-6474297.svg'
import sproutIcon from '../assets/noun-sprout-7907397.svg'
import treeStepIcon from '../assets/noun-tree-201654.svg'
import ucLogo from '../assets/UC_Logo.png'
import './Home.css'

function Home() {
  return (
    <div className="home">
      <PageMeta description="When a project is late, a team is stuck, or your tooling has gotten away from you, we've worked through it before. Start wherever you're stuck." />
      <section className="home-hero" aria-labelledby="hero-heading">
        <div className="home-hero-content">
          <div className="home-hero-text">
            <h1 id="hero-heading" className="home-hero-title">
              You aren't supposed to have all of this solved on your own.
            </h1>
            <p className="home-hero-description">
              Whether the project is late, the team is stuck, or the tooling has
              gotten away from you, we've worked through it before. Start wherever
              you're stuck.
            </p>
          </div>
          <div className="home-hero-logo">
            <img src={ucLogo} alt="Understory Collaborative" />
          </div>
        </div>
      </section>

      <section className="offerings" aria-labelledby="offerings-heading">
        <div className="section-container">
          <p className="section-eyebrow">What we do</p>
          <h2 id="offerings-heading">Where are you stuck?</h2>
          <ul className="offering-list" role="list">
            <li className="offering">
              <h3 className="offering-label">Design</h3>
              <p className="offering-problem">
                The scope keeps shifting, and I can't say what the first iteration
                even is.
              </p>
              <Link to="/offers/design" className="offering-link">How Design works</Link>
            </li>
            <li className="offering">
              <h3 className="offering-label">Build</h3>
              <p className="offering-problem">
                My team keeps missing, and I need to know if it can be turned
                around.
              </p>
              <Link to="/offers/build" className="offering-link">How Build works</Link>
            </li>
            <li className="offering">
              <h3 className="offering-label">Ship</h3>
              <p className="offering-problem">
                We could be shipping far more often than we are, and too much is
                still done by hand.
              </p>
              <Link to="/offers/ship" className="offering-link">How Ship works</Link>
            </li>
          </ul>
        </div>
      </section>

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
            <Link to="/assessment" className="btn btn-primary">Take the assessment</Link>
          </div>
        </div>
      </section>

      <section className="positioning" aria-labelledby="positioning-heading">
        <div className="section-container">
          <div className="positioning-content">
            <h2 id="positioning-heading">Most help is only half the job</h2>
            <p>
              You've probably hired both halves of this job before. One shop builds
              exactly what you spec and never asks whether it's the right thing to build.
              One advisor arrives with a deck full of opinions and has never opened your
              codebase. Neither leaves you better off than when they showed up.
            </p>
            <p>
              We do both halves, and then we leave. That's technical product management.
              We help you decide what to build and in what order, we sit with the team
              that builds it, and we go once your team can run it without us.
            </p>
          </div>
        </div>
      </section>

      <section className="how-we-work" aria-labelledby="how-we-work-heading">
        <div className="section-container">
          <h2 id="how-we-work-heading">How we work</h2>
          <ul className="work-grid" role="list">
            <li className="work-step">
              <img className="work-icon work-icon--seed" src={seedIcon} alt="" aria-hidden="true" />
              <h3>Root</h3>
              <p>
                We begin by understanding your foundation. Through deep
                discovery, we uncover the challenges, opportunities, and goals
                that lie beneath the surface. This grounding ensures everything
                we build has strong roots.
              </p>
            </li>
            <li className="work-step">
              <img className="work-icon work-icon--sprout" src={sproutIcon} alt="" aria-hidden="true" />
              <h3>Rise</h3>
              <p>
                With a solid foundation, we begin building. Through
                collaborative development and iterative refinement, your
                solution takes shape. We work alongside your team, growing
                together toward the outcome you defined.
              </p>
            </li>
            <li className="work-step">
              <img className="work-icon" src={treeStepIcon} alt="" aria-hidden="true" />
              <h3>Flourish</h3>
              <p>
                We deliver solutions built to thrive. Beyond launch, we make sure
                your team can maintain and evolve what we've built together. We
                measure our work by whether your team can carry it forward without
                us.
              </p>
            </li>
          </ul>
        </div>
      </section>

      <section className="cta-section" aria-labelledby="cta-heading">
        <div className="section-container">
          <h2 id="cta-heading">Not sure which of these is you?</h2>
          <p>
            Tell us what's going on in your own words, and we'll set up a
            conversation to work out the scope together.
          </p>
          <Link to="/contact" className="btn btn-primary btn-large">Start a conversation</Link>
        </div>
      </section>
    </div>
  )
}

export default Home
