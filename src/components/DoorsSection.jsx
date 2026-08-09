import { Link } from 'react-router-dom'
import { offers } from '../data/offersData'
import './DoorsSection.css'

// Homepage "which one is you right now?" section. A stuck leader self-selects one
// of the three doors and lands on the matching offer page, instead of reading a
// capability list. Copy is scaffolded from the foundation draft (see offersData.js);
// door names and self-select lines are marked PENDING there for webs to confirm.
function DoorsSection() {
  return (
    <section className="doors-section" aria-labelledby="doors-heading">
      <div className="section-container">
        <p className="section-eyebrow">Where you are right now</p>
        <h2 id="doors-heading">Which one is you?</h2>
        <p className="doors-intro">
          Most leaders who find us are stuck in one of three specific places. Pick
          the one that matches your week.
        </p>
        <ul className="doors-grid" role="list">
          {offers.map((offer) => (
            <li key={offer.id} className="door-card">
              <p className="door-self-select">{offer.selfSelect}</p>
              <h3 className="door-name">{offer.name}</h3>
              <p className="door-impact">{offer.impact}</p>
              <Link to={`/offers/${offer.slug}`} className="door-link">
                Open this door
                <span className="sr-only"> — {offer.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default DoorsSection
