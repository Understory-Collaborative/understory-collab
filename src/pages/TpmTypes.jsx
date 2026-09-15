import { Link } from 'react-router-dom'
import PageMeta from '../components/PageMeta'
import { ARCHETYPES, RENAISSANCE } from '../data/tpmSelfCheckData'
import './TpmTypes.css'

// The archetype explorer. Lists every type grouped by kind (everyday, rare, and the
// balanced whole), each card linking to its own page. Copy for the archetypes themselves
// (name, spikes, role, read) is the source of truth in tpmSelfCheckData.js and is not
// rewritten here.

const everyday = ARCHETYPES.filter((a) => !a.rare)
const rare = ARCHETYPES.filter((a) => a.rare)

function TypeCard({ type }) {
  return (
    <li className="ttypes-card">
      <Link to={`/tpm-types/${type.id}`} className="ttypes-card-link">
        <h3 className="ttypes-card-name">{type.name}</h3>
        <p className="ttypes-card-spikes">{type.spikes}</p>
        <p className="ttypes-card-role">{type.role}</p>
        <p className="ttypes-card-read">{type.read}</p>
      </Link>
    </li>
  )
}

function TpmTypes() {
  return (
    <div className="ttypes">
      <PageMeta
        title="The TPM types"
        description="Product owner, project manager, program manager, product manager, and software architect are all technical product managers, each leaning on a different pair of the same six durable skills. Explore the shapes."
      />

      <section className="page-hero" aria-labelledby="ttypes-heading">
        <div className="page-hero-content">
          <h1 id="ttypes-heading">The TPM types</h1>
          <p className="page-hero-description">
            Product owner, project manager, program manager, product manager, and software
            architect look like five different jobs. Underneath, they're one: a technical
            product manager, each leaning on a different pair of the same six durable skills.
            Those six make one shape, a hexagon, and every type is that shape with two points
            pushed out. Find the one closest to yours, then see who covers the points you lean
            on least.
          </p>
          <Link to="/tpm-self-check" className="btn btn-primary btn-large">Take the self-check</Link>
        </div>
      </section>

      <section className="ttypes-group" aria-labelledby="ttypes-everyday-heading">
        <div className="section-container">
          <h2 id="ttypes-everyday-heading">Everyday</h2>
          <p className="ttypes-group-intro">
            The eight common shapes, each with two neighboring skills pushed out.
          </p>
          <ul className="ttypes-cards" role="list">
            {everyday.map((type) => <TypeCard key={type.id} type={type} />)}
          </ul>
        </div>
      </section>

      <section className="ttypes-group ttypes-group--tint" aria-labelledby="ttypes-rare-heading">
        <div className="section-container">
          <h2 id="ttypes-rare-heading">Rare, holding a tension</h2>
          <p className="ttypes-group-intro">
            These three spike two skills that sit across the hexagon from each other, so they
            hold a genuine tension. Harder to find, and worth it.
          </p>
          <ul className="ttypes-cards" role="list">
            {rare.map((type) => <TypeCard key={type.id} type={type} />)}
          </ul>
        </div>
      </section>

      <section className="ttypes-group" aria-labelledby="ttypes-polymath-heading">
        <div className="section-container">
          <h2 id="ttypes-polymath-heading">The balanced whole</h2>
          <p className="ttypes-group-intro">
            Not a spike at all. The full shape the others are each a slice of.
          </p>
          <ul className="ttypes-cards" role="list">
            <TypeCard type={RENAISSANCE} />
          </ul>
        </div>
      </section>

      <section className="cta-section" aria-labelledby="ttypes-cta-heading">
        <div className="section-container">
          <h2 id="ttypes-cta-heading">Which shape is yours?</h2>
          <p>The self-check maps your six durable skills and names the type you're closest to.</p>
          <Link to="/tpm-self-check" className="btn btn-primary btn-large">Take the self-check</Link>
        </div>
      </section>
    </div>
  )
}

export default TpmTypes
