import { Link } from 'react-router-dom'
import PageMeta from '../components/PageMeta'
import './Privacy.css'

function Privacy() {
  return (
    <div className="privacy">
      <PageMeta
        title="Privacy policy"
        description="What information Understory Collaborative collects, how we use it, and the choices you have. We collect only what we need to talk with you, run our newsletter and assessment, answer questions, and book office hours."
      />
      <section className="page-hero" aria-labelledby="privacy-heading">
        <div className="page-hero-content">
          <h1 id="privacy-heading">Privacy Policy</h1>
          <p className="page-hero-description">Last updated: September 1, 2026</p>
        </div>
      </section>

      <section className="privacy-body" aria-labelledby="privacy-intro-heading">
        <div className="section-container">
          <h2 id="privacy-intro-heading" className="sr-only">Overview</h2>
          <p className="privacy-intro">
            Understory Collaborative respects your privacy. This policy explains what
            information we collect, how we use it, and the choices you have. We collect only
            what we need to talk with you, send the newsletter and field guide you ask for,
            answer your questions, and book office hours, nothing more.
          </p>

          <section className="privacy-section" aria-labelledby="collect-heading">
            <h2 id="collect-heading">Information We Collect</h2>
            <p>We collect information only when you choose to give it to us:</p>
            <ul>
              <li>
                <strong>Contact form:</strong> your name, business name (optional), email
                address, and message.
              </li>
              <li>
                <strong>Newsletter signup:</strong> your email address.
              </li>
              <li>
                <strong>Assessment:</strong> your email address and your result, so we can send
                you the matching field guide.
              </li>
              <li>
                <strong>Ask a question:</strong> your question, the product it concerns, your
                name (optional), and your email address.
              </li>
              <li>
                <strong>Office hours booking:</strong> your name, email address, and payment
                details.
              </li>
            </ul>
            <p>
              The site also stores one preference, your light or dark theme, in your browser.
              We do not otherwise track you.
            </p>
          </section>

          <section className="privacy-section" aria-labelledby="use-heading">
            <h2 id="use-heading">How We Use Your Information</h2>
            <p>
              We use each piece of information only for the purpose you gave it to us: to read
              and respond to your contact message, to send the newsletter or field guide you
              asked for, to answer your question, and to schedule and charge for the office
              hours you book. We do not use your details for unrelated marketing without your
              separate consent, and we never sell or rent your personal information.
            </p>
          </section>

          <section className="privacy-section" aria-labelledby="where-heading">
            <h2 id="where-heading">Where Your Information Goes</h2>
            <p>
              We rely on a few providers to run the site. They process your information on our
              behalf and are not permitted to use it for their own purposes.
            </p>
            <ul>
              <li>
                <strong>Resend</strong> delivers our email: it carries your contact message to
                us and sends the field-guide link to you.
              </li>
              <li>
                <strong>MailerLite</strong> manages our newsletter and assessment lists. It uses
                double opt-in, so you confirm by email before we add you.
              </li>
              <li>
                <strong>Google</strong> runs two parts: the "Ask a question" form is a Google
                Form, and office hours are scheduled through Google Calendar.
              </li>
              <li>
                <strong>Stripe</strong> processes office-hours payments. Your card details go
                straight to Stripe; we never see or store them.
              </li>
            </ul>
            <p>
              Office hours are sold through our business entity, Webs on the Webs, LLC, so that
              name may appear on your receipt and card statement.
            </p>
          </section>

          <section className="privacy-section" aria-labelledby="cookies-heading">
            <h2 id="cookies-heading">Cookies &amp; Analytics</h2>
            <p>
              This site runs no advertising, cross-site tracking, or third-party analytics. The
              only thing it stores on your device is your light or dark theme choice, which
              never leaves your browser. When you subscribe, ask a question, or book office
              hours, our newsletter, form, scheduling, and payment providers may set cookies
              that are strictly necessary to complete that action.
            </p>
          </section>

          <section className="privacy-section" aria-labelledby="retention-heading">
            <h2 id="retention-heading">Data Retention</h2>
            <p>
              We keep contact messages and question submissions as long as we need them to
              respond and to keep a reasonable record of the conversation, then remove them. We
              keep your newsletter or assessment email address until you unsubscribe, after
              which it leaves our active list. Booking and payment records are held by Google
              and Stripe under their own retention terms.
            </p>
          </section>

          <section className="privacy-section" aria-labelledby="rights-heading">
            <h2 id="rights-heading">Your Rights &amp; Choices</h2>
            <p>
              You can ask us to access, correct, or delete the personal information you have
              shared with us, and you can unsubscribe from the newsletter at any time using
              the one-click link in any newsletter email, or the steps on our{' '}
              <Link to="/unsubscribe">unsubscribe page</Link>. To make any other request about
              your data, please <Link to="/contact">contact us</Link> and we will respond
              promptly.
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
