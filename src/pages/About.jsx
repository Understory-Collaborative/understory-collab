import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import './About.css'

/*
  ABOUT PAGE — SCAFFOLD WITH PLACEHOLDERS
  =======================================
  Every [PLACEHOLDER: ...] below needs a REAL fact before this page ships.
  Per our content rule, nothing here is invented — these are intentional
  blanks for Understory to fill. Open questions are flagged with OPEN Q.
  Once the real copy lands, delete this comment block.
*/

function About() {
  // Per-page SEO: give searchers a real, specific title + description.
  useEffect(() => {
    const prevTitle = document.title
    const metaEl = document.querySelector('meta[name="description"]')
    const prevDesc = metaEl ? metaEl.getAttribute('content') : null

    document.title = 'About — Understory Collaborative'
    // OPEN Q: confirm a real one-sentence description (used in Google results).
    if (metaEl) {
      metaEl.setAttribute(
        'content',
        '[PLACEHOLDER: One real sentence describing who Understory Collaborative is, where you are based, and what you do — this is what shows up under your name in search results.]'
      )
    }

    return () => {
      document.title = prevTitle
      if (metaEl && prevDesc !== null) metaEl.setAttribute('content', prevDesc)
    }
  }, [])

  return (
    <div className="about-page">
      <section className="page-hero" aria-labelledby="about-heading">
        <div className="page-hero-content">
          <h1 id="about-heading">About Understory Collaborative</h1>
          <p className="page-hero-description">
            {/* OPEN Q: a real, plain-spoken one-liner — what you are and who you serve. */}
            [PLACEHOLDER: A real one-line description of the firm — e.g. “A
            [solo / partnership / collective] of technologists based in
            [CITY, REGION], helping [WHO] build accessible, ethical software.”]
          </p>
        </div>
      </section>

      {/* Quick-facts strip — concrete, scannable, good for trust + search */}
      <section className="about-facts" aria-label="Key facts about Understory Collaborative">
        <div className="section-container">
          <dl className="facts-grid">
            <div className="fact">
              <dt>Founded</dt>
              <dd>[PLACEHOLDER: YEAR]</dd>
            </div>
            <div className="fact">
              <dt>Based in</dt>
              <dd>[PLACEHOLDER: CITY, REGION — or “Remote, US-based”]</dd>
            </div>
            <div className="fact">
              <dt>Team</dt>
              <dd>[PLACEHOLDER: # of people, or “Founder-led”]</dd>
            </div>
            <div className="fact">
              <dt>Focus</dt>
              <dd>[PLACEHOLDER: e.g. Accessibility, EdTech, Healthcare]</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="about-story" aria-labelledby="story-heading">
        <div className="section-container">
          <h2 id="story-heading">Our Story</h2>
          {/* OPEN Q: when/why founded? What problem made you start? Real narrative only. */}
          <p>
            [PLACEHOLDER: The real founding story — who started Understory
            Collaborative, when, and why. What were you doing before? What gap
            or frustration led to this? Keep it true and specific; this is the
            paragraph that makes a stranger trust you.]
          </p>
          <p>
            [PLACEHOLDER: A second paragraph if useful — how the practice has
            grown, what you’ve learned, what you stand for. Tie back to the
            “understory” idea only if it’s genuinely how you work.]
          </p>
        </div>
      </section>

      <section className="about-team" aria-labelledby="team-heading">
        <div className="section-container">
          <h2 id="team-heading">Who We Are</h2>
          <p className="about-team-intro">
            [PLACEHOLDER: One line introducing the team — real people, named.]
          </p>

          <div className="team-grid">
            {/*
              OPEN Q for EACH person:
              - Full name
              - Role / title
              - 1–2 sentence true bio (notable real experience, focus areas)
              - LinkedIn (or other) URL
              - Headshot? (drop into src/assets and wire the <img>)
              Duplicate this <article> block per team member.
            */}
            <article className="team-card">
              <div className="team-photo" aria-hidden="true">
                {/* OPEN Q: real headshot or a tasteful initial/monogram? */}
                <span className="team-photo-placeholder">[PHOTO]</span>
              </div>
              <h3 className="team-name">[PLACEHOLDER: Full Name]</h3>
              <p className="team-role">[PLACEHOLDER: Role / Title]</p>
              <p className="team-bio">
                [PLACEHOLDER: 1–2 real sentences — what they do, notable
                experience, and what they care about. No invented credentials.]
              </p>
              {/* OPEN Q: real profile URL */}
              <a className="team-link" href="#" aria-disabled="true">
                [PLACEHOLDER: LinkedIn URL]
              </a>
            </article>

            <article className="team-card">
              <div className="team-photo" aria-hidden="true">
                <span className="team-photo-placeholder">[PHOTO]</span>
              </div>
              <h3 className="team-name">[PLACEHOLDER: Full Name]</h3>
              <p className="team-role">[PLACEHOLDER: Role / Title]</p>
              <p className="team-bio">
                [PLACEHOLDER: 1–2 real sentences. Delete this card if it’s a
                solo practice; duplicate it if there are more than two.]
              </p>
              <a className="team-link" href="#" aria-disabled="true">
                [PLACEHOLDER: LinkedIn URL]
              </a>
            </article>
          </div>
        </div>
      </section>

      <section className="about-experience" aria-labelledby="experience-heading">
        <div className="section-container">
          <h2 id="experience-heading">What We’ve Done</h2>
          <p>
            {/* OPEN Q: VERIFY the existing Home claim — real & citable, or aspirational?
                "decades of experience across education, healthcare, transportation, legal" */}
            [PLACEHOLDER: Concrete, verifiable proof of work. Real industries
            you’ve served, and — where you have permission — named clients or
            anonymized-but-specific projects (“a regional health system,” “a
            K-12 ed-tech platform”). Specifics beat adjectives.]
          </p>
          <ul className="experience-list">
            <li>[PLACEHOLDER: Real industry or domain #1]</li>
            <li>[PLACEHOLDER: Real industry or domain #2]</li>
            <li>[PLACEHOLDER: Real industry or domain #3]</li>
          </ul>
          {/* OPEN Q: any real, true numbers? Only include if accurate. */}
          <p className="experience-note">
            [PLACEHOLDER (optional): real numbers — years in practice, projects
            shipped, clients served. Omit entirely rather than estimate.]
          </p>
        </div>
      </section>

      <section className="cta-section" aria-labelledby="about-cta-heading">
        <div className="section-container">
          <h2 id="about-cta-heading">Want to work with us?</h2>
          <p>Tell us what you’re building. We’ll listen first.</p>
          <Link to="/contact" className="btn btn-primary btn-large">Get in Touch</Link>
        </div>
      </section>
    </div>
  )
}

export default About
