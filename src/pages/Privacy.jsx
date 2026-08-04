import { Link } from 'react-router-dom'
import './Privacy.css'

function Privacy() {
  return (
    <div className="privacy">
      <section className="page-hero" aria-labelledby="privacy-heading">
        <div className="page-hero-content">
          <h1 id="privacy-heading">Privacy Policy</h1>
          <p className="page-hero-description">Last updated: July 26, 2026</p>
        </div>
      </section>

      <section className="privacy-body" aria-labelledby="privacy-intro-heading">
        <div className="section-container">
          <h2 id="privacy-intro-heading" className="sr-only">Overview</h2>
          <p className="privacy-intro">
            Understory Collaborative respects your privacy. This policy explains what
            information we collect, how we use it, and the choices you have. We collect
            only what we need to talk with you and to run our newsletter, nothing more.
          </p>

          <section className="privacy-section" aria-labelledby="collect-heading">
            <h2 id="collect-heading">Information We Collect</h2>
            <p>
              We collect information only when you choose to give it to us. Our contact
              form collects your name, business name (optional), email address, and your
              message. Our newsletter signup collects your email address. We do not ask
              for, or knowingly collect, any information beyond this.
            </p>
          </section>

          <section className="privacy-section" aria-labelledby="use-heading">
            <h2 id="use-heading">How We Use Your Information</h2>
            <p>
              We use contact-form submissions solely to read and respond to your enquiry.
              We use your newsletter email address solely to send the newsletter you asked
              for. We do not use your contact details for marketing without your separate
              consent, and we never sell or rent your personal information.
            </p>
          </section>

          <section className="privacy-section" aria-labelledby="where-heading">
            <h2 id="where-heading">Where Your Information Goes</h2>
            <p>
              Contact-form submissions are recorded in a private Google Sheet hosted by
              Google LLC, accessible only to Understory Collaborative. Newsletter
              subscriptions are managed by our newsletter provider, Ghost. These providers
              process your information on our behalf and are not permitted to use it for
              their own purposes.
            </p>
          </section>

          <section className="privacy-section" aria-labelledby="cookies-heading">
            <h2 id="cookies-heading">Cookies &amp; Analytics</h2>
            <p>
              This site does not use advertising or cross-site tracking, and no third-party
              analytics or marketing scripts run on it. The site stores a single preference
              in your browser, your light or dark theme choice, which never leaves your
              device. Our newsletter provider may set cookies that are strictly necessary to
              manage your subscription when you interact with it.
            </p>
          </section>

          <section className="privacy-section" aria-labelledby="retention-heading">
            <h2 id="retention-heading">Data Retention</h2>
            <p>
              We keep contact-form submissions only as long as needed to respond to you and
              to keep a reasonable record of the conversation, and we remove them when they
              are no longer needed. We keep your newsletter email address until you
              unsubscribe, after which it is removed from our active list.
            </p>
          </section>

          <section className="privacy-section" aria-labelledby="rights-heading">
            <h2 id="rights-heading">Your Rights &amp; Choices</h2>
            <p>
              You can ask us to access, correct, or delete the personal information you have
              shared with us, and you can unsubscribe from the newsletter at any time using
              the <Link to="/unsubscribe">unsubscribe page</Link> or the one-click link in
              any newsletter email. To make any other request about your data, please{' '}
              <Link to="/contact">contact us</Link> and we will respond promptly.
            </p>
          </section>

          <section className="privacy-section" aria-labelledby="contact-heading">
            <h2 id="contact-heading">Contact</h2>
            <p>
              Questions about this policy or your information can be sent to{' '}
              <a href="mailto:contact@understorycollab.com">contact@understorycollab.com</a>{' '}
              or through our <Link to="/contact">contact page</Link>.
            </p>
          </section>
        </div>
      </section>
    </div>
  )
}

export default Privacy
