import { useParams, Navigate, Link } from 'react-router-dom'
import { getOffer, PENDING } from '../data/offersData'
import './OfferPage.css'

// One offer page per door, built on the who / problem / impact / proof structure
// from review/brand-offer-foundation.md. Data-driven from offersData.js so all
// three doors share one template. Price and the lead proof metric render as
// visible "to confirm" placeholders until webs fills them.
//
// Conversation step = short application (webs's decision). The CTA points at the
// application; the dedicated application form is a follow-up once the questions
// it asks are settled.
function OfferPage() {
  const { slug } = useParams()
  const offer = getOffer(slug)

  if (!offer) {
    return <Navigate to="/" replace />
  }

  const pricePending = offer.price === PENDING
  const proofLeadPending = offer.proofLead === PENDING

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
            {proofLeadPending && (
              <p className="offer-pending" role="note">
                To confirm: which metric or story leads here, and whether a client
                can be named.
              </p>
            )}
          </div>

          <div className="offer-block offer-price">
            <h2>Investment</h2>
            {pricePending ? (
              <p className="offer-pending" role="note">
                Pricing — to confirm.
              </p>
            ) : (
              <p className="offer-price-value">{offer.price}</p>
            )}
          </div>
        </div>
      </section>

      <section className="cta-section" aria-labelledby="offer-cta-heading">
        <div className="section-container">
          <h2 id="offer-cta-heading">Think this is your door?</h2>
          <p>
            Tell us where you are stuck in a short application. If it is a fit, we
            will set up a conversation.
          </p>
          {/* Points at Contact for now; a dedicated short-application form is a
              follow-up once we settle the questions it should ask. */}
          <Link to="/contact" className="btn btn-primary btn-large">
            Start an application
          </Link>
        </div>
      </section>
    </div>
  )
}

export default OfferPage
