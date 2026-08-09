import './Values.css'

function Values() {
  const pillars = [
    {
      label: 'Accessibility & Inclusivity',
      description: 'The technology we design and build should be usable, supportive, and inclusive by design',
    },
    {
      label: 'Security & Privacy',
      description: 'The systems we build should respect and protect our clients, their users, and the trust placed in each other.',
    },
    {
      label: 'Transparency',
      description: 'Open communication, shared accountability, and partnerships grounded in mutual respect result in the best outcomes',
    },
  ]

  const practices = [
    { lead: 'Building lasting relationships', rest: ' with clients by keeping their needs at the forefront of research and implementation.' },
    { lead: 'Active partnership with our clients', rest: ' by creating a psychologically safe environment with clear communication and delivering on promises.' },
    { lead: 'Upholding our values as our north star', rest: ', guiding how we design, build, and scale.' },
    { lead: 'Taking our role as tech stewards seriously', rest: ' by exploring tangible positive-impact software.' },
  ]

  return (
    <div className="values">
      <section className="page-hero" aria-labelledby="values-heading">
        <div className="page-hero-content">
          <h1 id="values-heading">
            We believe technology shapes how people experience the world. That
            responsibility informs how we work, who we work with, and what we build.
          </h1>
        </div>
      </section>

      <section className="values-pillars" aria-labelledby="pillars-heading">
        <div className="section-container">
          <h2 id="pillars-heading" className="sr-only">Our Pillars</h2>
          <p className="values-intro">
            Thoughtful technology should support people, rather than creating unnecessary
            harm. We bring that perspective into every partnership, and every product we
            help shape, by focusing on three pillars:
          </p>
          <ul className="pillar-list" role="list">
            {pillars.map((pillar) => (
              <li className="pillar" key={pillar.label}>
                <strong className="pillar-label">{pillar.label}</strong>
                <span className="pillar-description">{pillar.description}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="values-practice" aria-labelledby="practice-heading">
        <div className="section-container">
          <h2 id="practice-heading">In Practice, This Looks Like:</h2>
          <ul className="practice-list" role="list">
            {practices.map((practice) => (
              <li className="practice-item" key={practice.lead}>
                <strong>{practice.lead}</strong>{practice.rest}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}

export default Values
