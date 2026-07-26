import { Link } from 'react-router-dom'
import './Privacy.css'

function Privacy() {
  return (
    <div className="privacy">
      <section className="page-hero" aria-labelledby="privacy-heading">
        <div className="page-hero-content">
          <h1 id="privacy-heading">Privacy Policy</h1>
          <p className="page-hero-description placeholder-copy">
            Last updated: [date]
          </p>
          {/* PLACEHOLDER — client to supply effective date and any prefatory note. Do not invent. */}
        </div>
      </section>

      <section className="privacy-body" aria-labelledby="privacy-notice-heading">
        <div className="section-container">
          <h2 id="privacy-notice-heading" className="sr-only">Draft Notice</h2>
          <p className="placeholder-copy privacy-draft-notice">
            [Draft template — pending review and finalization by Understory Collaborative. Not yet legal advice.]
          </p>

          <section className="privacy-section" aria-labelledby="collect-heading">
            <h2 id="collect-heading">Information We Collect</h2>
            <p>
              Our contact form collects your name, business name (optional), email
              address, and message. Our newsletter signup collects an email address.
            </p>
          </section>

          <section className="privacy-section" aria-labelledby="use-heading">
            <h2 id="use-heading">How We Use Your Information</h2>
            <p>
              Contact form submissions are used only to respond to your enquiry. Your
              newsletter email address is used only to send the newsletter.
            </p>
          </section>

          <section className="privacy-section" aria-labelledby="where-heading">
            <h2 id="where-heading">Where Your Information Goes</h2>
            <p>
              Contact form submissions are recorded in a Google Sheet (Google LLC).
              Newsletter subscriptions are managed by Ghost.
            </p>
          </section>

          <section className="privacy-section" aria-labelledby="cookies-heading">
            <h2 id="cookies-heading">Cookies &amp; Analytics</h2>
            {/* PLACEHOLDER — client to supply cookies & analytics details. The previous third-party tracking script has been removed. Do not invent. */}
            <p className="placeholder-copy">[To be completed]</p>
            <p className="privacy-note">
              Note: the previous third-party tracking script has been removed.
            </p>
          </section>

          <section className="privacy-section" aria-labelledby="retention-heading">
            <h2 id="retention-heading">Data Retention</h2>
            {/* PLACEHOLDER — client to supply data retention periods. Do not invent. */}
            <p className="placeholder-copy">[To be completed]</p>
          </section>

          <section className="privacy-section" aria-labelledby="rights-heading">
            <h2 id="rights-heading">Your Rights &amp; Choices</h2>
            <p>
              You can unsubscribe from the newsletter at any time using the{' '}
              <Link to="/unsubscribe">unsubscribe page</Link>. To request access to or
              deletion of your data, please <Link to="/contact">contact us</Link>.
            </p>
            {/* PLACEHOLDER — client to supply any jurisdiction-specific rights (e.g. GDPR/CCPA) as [bracketed placeholders]. Do not invent. */}
          </section>

          <section className="privacy-section" aria-labelledby="contact-heading">
            <h2 id="contact-heading">Contact</h2>
            <p>
              Questions about this policy can be directed to us via our{' '}
              <Link to="/contact">contact page</Link>.
            </p>
            {/* PLACEHOLDER — client to supply the published contact email address, if a direct address is to be listed here. Do not invent. */}
          </section>
        </div>
      </section>
    </div>
  )
}

export default Privacy
