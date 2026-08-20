import { useParams, Navigate, Link } from 'react-router-dom'
import { getOffer } from '../data/offersData'
import './OfferPage.css'

// One offer page per bucket (Design / Build / Ship), built on the who / problem /
// impact / proof structure from review/brand-offer-foundation.md. Data-driven from
// offersData.js so all three share one template.
//
// Price is intake-only (webs, 2026-08-19): the page describes the engagement shape
// without a number, and scope is settled in conversation. The CTA invites a note
// that opens that conversation.
function OfferPage() {
  const { slug } = useParams()
  const offer = getOffer(slug)

  if (!offer) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="offer-page">
      <section className="page-hero" aria-labelledby="offer-heading">
        <div className="page-hero-content">
          <p className="offer-eyebrow">{offer.selfSelect}</p>
          <h1 id="offer-heading">{offer.name}</h1>
        </div>
      </section>

      <section className="offer-body" aria-labelledby="offer-who-heading">
        <div className="section-container offer-grid">
          <div className="offer-block">
            <h2 id="offer-who-heading">Who this is for</h2>
            <p>{offer.whoFor}</p>
          </div>

          <div className="offer-block">
            <h2>The problem</h2>
            <blockquote className="offer-problem">{offer.problem}</blockquote>
          </div>

          <div className="offer-block">
            <h2>What you walk away with</h2>
            <p>{offer.impact}</p>
          </div>

          <div className="offer-block offer-risk">
            <h2>The cost of doing nothing</h2>
            <p>{offer.risk}</p>
          </div>

          <div className="offer-block">
            <h2>Proof</h2>
            <p>{offer.proof}</p>
          </div>

          <div className="offer-block offer-engagement">
            <h2>How the engagement works</h2>
            <p>{offer.engagement}</p>
          </div>
        </div>
      </section>

      <section className="cta-section" aria-labelledby="offer-cta-heading">
        <div className="section-container">
          <h2 id="offer-cta-heading">Sound like your situation?</h2>
          <p>
            Drop us a note about what's going on. If it's a good match, we'll set up
            a time to talk.
          </p>
          <Link to={`/contact?door=${offer.slug}`} className="btn btn-primary btn-large">
            Send us a note
          </Link>
        </div>
      </section>
    </div>
  )
}

export default OfferPage
