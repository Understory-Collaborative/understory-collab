import './OurWork.css'

function OurWork() {
  return (
    <div className="our-work">
      <section className="page-hero" aria-labelledby="our-work-heading">
        <div className="page-hero-content">
          <h1 id="our-work-heading">Our Work</h1>
          <p className="page-hero-description placeholder-copy">[Intro copy coming soon]</p>
        </div>
      </section>

      <section className="work-category work-category--grey" aria-labelledby="legal-heading">
        <div className="section-container">
          <h2 id="legal-heading">Legal, Policy &amp; Compliance</h2>
          {/* PLACEHOLDER — client to supply the full narrative copy for this category (provided as an image; awaiting text). Do not invent. */}
          <p className="placeholder-copy">[Detailed work narratives for this area are coming soon.]</p>
        </div>
      </section>

      <section className="work-category work-category--white" aria-labelledby="consumer-heading">
        <div className="section-container">
          <h2 id="consumer-heading">Consumer Products &amp; Services</h2>
          {/* PLACEHOLDER — client to supply the full narrative copy for this category (provided as an image; awaiting text). Do not invent. */}
          <p className="placeholder-copy">[Detailed work narratives for this area are coming soon.]</p>
        </div>
      </section>

      <section className="work-category work-category--grey" aria-labelledby="health-heading">
        <div className="section-container">
          <h2 id="health-heading">Health &amp; Safety</h2>
          {/* PLACEHOLDER — client to supply the full narrative copy for this category (provided as an image; awaiting text). Do not invent. */}
          <p className="placeholder-copy">[Detailed work narratives for this area are coming soon.]</p>
        </div>
      </section>

      <section className="work-category work-category--white" aria-labelledby="education-heading">
        <div className="section-container">
          <h2 id="education-heading">Education</h2>
          {/* PLACEHOLDER — client to supply the full narrative copy for this category (provided as an image; awaiting text). Do not invent. */}
          <p className="placeholder-copy">[Detailed work narratives for this area are coming soon.]</p>
        </div>
      </section>
    </div>
  )
}

export default OurWork
