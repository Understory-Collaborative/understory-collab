import { Link } from 'react-router-dom'
import seedlingIcon from '../assets/noun-seedling-5009514.svg'
import germinationIcon from '../assets/noun-germination-7706588.svg'
import treeIcon from '../assets/noun-tree-with-leaves-6402273.svg'
import './Home.css'

function Home() {
  return (
    <div className="home">
      <section className="home-hero" aria-labelledby="hero-heading">
        <div className="home-hero-content">
          <h1 id="hero-heading" className="home-hero-title">
            You aren't supposed to have all of this solved on your own.
          </h1>
          <p className="home-hero-description">
            Whether the project is late, the team is stuck, or the tooling has
            gotten away from you, we've worked through it before. A few questions
            will tell you how serious it is.
          </p>
          <Link to="/quiz" className="btn btn-primary btn-large home-hero-cta">
            Take the quiz
          </Link>
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
            <Link to="/quiz" className="btn btn-primary">Take the Quiz</Link>
          </div>
        </div>
      </section>

      <section className="offerings" aria-labelledby="offerings-heading">
        <div className="section-container">
          <h2 id="offerings-heading">Where are you stuck?</h2>
          <ul className="offering-list" role="list">
            <li className="offering">
              <h3 className="offering-label">Design</h3>
              <p className="offering-job">what to build</p>
              <p className="offering-problem">
                The scope keeps shifting, and no one can say what the first
                version even is.
              </p>
            </li>
            <li className="offering">
              <h3 className="offering-label">Build</h3>
              <p className="offering-job">how to build it</p>
              <p className="offering-problem">
                My team keeps missing, and I need to know if it can be turned
                around.
              </p>
            </li>
            <li className="offering">
              <h3 className="offering-label">Ship</h3>
              <p className="offering-job">how to ship it</p>
              <p className="offering-problem">
                We could be shipping far more often than we are, and too much is
                still done by hand.
              </p>
            </li>
          </ul>
          <p className="offering-promise">
            Repair or rebuild, the right call for what's in front of you. We've
            seen enough of these to know when a system is worth saving and when it
            isn't. What we won't do is sell you a rebuild you don't need, or a
            patch that won't hold.
          </p>
          <Link to="/contact" className="btn btn-primary">
            Talk to us about your situation
          </Link>
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
