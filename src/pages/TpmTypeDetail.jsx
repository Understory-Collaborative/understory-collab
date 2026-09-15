import { useParams, Link } from 'react-router-dom'
import PageMeta from '../components/PageMeta'
import HexRadar from '../components/HexRadar'
import { ARCHETYPES, RENAISSANCE, AXES } from '../data/tpmSelfCheckData'
import './TpmTypeDetail.css'

// One page per archetype. Looks the type up by :slug against the everyday/rare roster plus
// the Polymath. The archetype copy (name, spikes, role, read) is the source of truth in
// tpmSelfCheckData.js and is shown, not rewritten. The point of the page is the cross-links:
// the complement to team up with, and a hop to every other type.

// The full roster in reading order: everyday and rare (as authored), then the balanced whole.
const ROSTER = [...ARCHETYPES, RENAISSANCE]

// Short axis labels in the fixed AXIS_ORDER, for the radar.
const AXIS_LABELS = AXES.map((a) => a.short)

// Resolve a complement name (e.g. "The Navigator") to its type, if it names a real one.
// The Polymath's complement is open-ended ("Any, to add depth"), so it stays plain text.
const byName = (name) => ROSTER.find((t) => t.name === name)

function TpmTypeDetail() {
  const { slug } = useParams()
  const index = ROSTER.findIndex((t) => t.id === slug)
  const type = index === -1 ? null : ROSTER[index]

  if (!type) {
    return (
      <div className="ttype">
        <PageMeta title="Type not found" description="That TPM type does not exist." noindex />
        <section className="page-hero" aria-labelledby="ttype-missing-heading">
          <div className="page-hero-content">
            <h1 id="ttype-missing-heading">Type not found</h1>
            <p className="page-hero-description">
              We couldn't find that type. Browse the full set instead.
            </p>
            <Link to="/tpm-types" className="btn btn-primary btn-large">Browse all types</Link>
          </div>
        </section>
      </div>
    )
  }

  const complement = byName(type.complement)
  const others = ROSTER.filter((t) => t.id !== type.id)
  const prev = index > 0 ? ROSTER[index - 1] : null
  const next = index < ROSTER.length - 1 ? ROSTER[index + 1] : null

  return (
    <div className="ttype">
      <PageMeta
        title={type.name}
        description={`${type.name}: ${type.spikes}. ${type.read}`}
        noindex
      />

      <section className="page-hero" aria-labelledby="ttype-heading">
        <div className="page-hero-content">
          <p className="ttype-eyebrow">
            <Link to="/tpm-types">The TPM types</Link>
          </p>
          <h1 id="ttype-heading">{type.name}</h1>
          <p className="ttype-spikes">
            {type.spikes}
            {type.rare && <span className="ttype-rare-tag">Rare</span>}
          </p>
          <p className="page-hero-description">{type.read}</p>
        </div>
      </section>

      <section className="ttype-body" aria-labelledby="ttype-shape-heading">
        <div className="section-container ttype-grid">
          <div className="ttype-shape">
            <h2 id="ttype-shape-heading">The shape</h2>
            <figure className="ttype-radar-figure">
              <HexRadar
                v={type.v}
                labels={AXIS_LABELS}
                title={`${type.name}: durable-skills hexagon, spiking ${type.spikes}.`}
              />
              <figcaption>Six durable skills. This type spikes {type.spikes}.</figcaption>
            </figure>
          </div>

          <div className="ttype-facts">
            <h2>At a glance</h2>
            <dl className="ttype-dl">
              <div>
                <dt>Skills it spikes</dt>
                <dd>{type.spikes}</dd>
              </div>
              <div>
                <dt>Where you see it</dt>
                <dd>{type.role}</dd>
              </div>
              <div>
                <dt>Team up with</dt>
                <dd>
                  {type.balanced ? (
                    "You don't have a weak side to cover, so pair with anyone. You're the one who adds the depth they're missing."
                  ) : (
                    <>
                      {complement ? (
                        <Link to={`/tpm-types/${complement.id}`}>{type.complement}</Link>
                      ) : (
                        type.complement
                      )}
                      , who covers the skills you lean on least.
                    </>
                  )}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="ttype-more" aria-labelledby="ttype-more-heading">
        <div className="section-container">
          <h2 id="ttype-more-heading">Hop to another type</h2>
          <ul className="ttype-others" role="list">
            {others.map((t) => (
              <li key={t.id}>
                <Link to={`/tpm-types/${t.id}`}>{t.name}</Link>
                {t.rare && <span className="ttype-others-tag"> (rare)</span>}
              </li>
            ))}
          </ul>

          <nav className="ttype-pager" aria-label="Previous and next type">
            {prev ? (
              <Link to={`/tpm-types/${prev.id}`} className="ttype-pager-link ttype-pager-prev">
                <span className="ttype-pager-dir">Previous</span>
                <span className="ttype-pager-name">{prev.name}</span>
              </Link>
            ) : <span />}
            {next ? (
              <Link to={`/tpm-types/${next.id}`} className="ttype-pager-link ttype-pager-next">
                <span className="ttype-pager-dir">Next</span>
                <span className="ttype-pager-name">{next.name}</span>
              </Link>
            ) : <span />}
          </nav>

          <p className="ttype-browse">
            <Link to="/tpm-types">Browse all types</Link>
          </p>
        </div>
      </section>

      <section className="cta-section" aria-labelledby="ttype-cta-heading">
        <div className="section-container">
          <h2 id="ttype-cta-heading">Is this your shape?</h2>
          <p>The self-check maps your six durable skills and names the type you're closest to.</p>
          <Link to="/tpm-self-check" className="btn btn-primary btn-large">Take the self-check</Link>
        </div>
      </section>
    </div>
  )
}

export default TpmTypeDetail
