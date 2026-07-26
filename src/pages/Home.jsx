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
            Great Software Isn't Just About Clean Code — It's About Solving
            Real Problems When It Matters Most.
          </h1>
          <p className="home-hero-description">
            Like the protective forest layer that is our namesake, we create
            the conditions that help your team thrive by building solutions
            that are accessible, maintainable, and genuinely useful.
          </p>
        </div>
      </section>

      <section className="forest-health" aria-labelledby="forest-health-heading">
        <div className="section-container">
          <div className="forest-health-content">
            <h2 id="forest-health-heading">How Healthy Is Your Digital Forest?</h2>
            <p>
              Whether you're managing technical debt, navigating growing
              complexity, or responding to an active crisis, understanding the
              state of your tech ecosystem is the first step toward meaningful
              change.
            </p>
            <p>
              Our free assessment helps you identify the state of your digital
              forest by providing insight into where your team may be struggling,
              whether it be a fast-moving fire threatening critical systems or
              multiple issues that have compounded into a self-sustaining
              firestorm, and provides insight into how we can help strengthen and
              support your organization.
            </p>
            <Link to="/quiz" className="btn btn-primary">Take the Quiz</Link>
          </div>
        </div>
      </section>

      <section className="what-we-do" aria-labelledby="what-we-do-heading">
        <div className="section-container">
          <h2 id="what-we-do-heading">What We Do</h2>
          <p className="what-we-do-intro">
            Whether you're navigating a moment of crisis, need targeted, à la
            carte support, or require technical leadership to steady and guide
            your roadmap, we adapt to meet you exactly where you are.
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
                together toward your vision.
              </p>
            </li>
            <li className="work-step">
              <img className="work-icon" src={treeIcon} alt="" aria-hidden="true" />
              <h3>Flourish</h3>
              <p>
                We deliver solutions built to thrive. Beyond launch, we ensure
                your team is empowered to maintain and evolve what we've built
                together. Your success is our measure of success.
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
