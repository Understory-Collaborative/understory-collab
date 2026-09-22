import { Link } from 'react-router-dom'
import PageMeta from '../components/PageMeta'
import './OfficeHours.css'

const BOOKING_URL = 'https://calendar.app.google/98a3uMFvjrRzfr7b6'

function OfficeHours() {
  return (
    <div className="office-hours">
      <PageMeta
        title="Office hours"
        description="Thirty minutes with someone who's seen just about everything, for a problem you can't take to your team or your boss. Fifty dollars a seat."
      />
      <section className="page-hero" aria-labelledby="oh-heading">
        <div className="page-hero-content">
          <h1 id="oh-heading">Office hours</h1>
          <p className="page-hero-lead">
            There's a problem you can't take to your team or your boss. Bring it
            here.
          </p>
          <p className="page-hero-support">
            Thirty minutes with someone who's seen just about everything. Fifty
            dollars a seat.
          </p>
          <p className="oh-cta">
            <a
              className="btn btn-primary btn-large"
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Book a seat
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <span className="oh-newtab" aria-hidden="true">Opens in a new tab</span>
          </p>
        </div>
      </section>

      <section className="oh-section" aria-labelledby="oh-who-heading">
        <div className="section-container">
          <h2 id="oh-who-heading">Who it's for</h2>
          <p>
            The person closest to the work who wants to get better at it. A
            product owner or technical product manager learning the job as they
            go, or a leader who wants an outside opinion before committing to
            anything bigger.
          </p>
        </div>
      </section>

      <section className="oh-section" aria-labelledby="oh-bring-heading">
        <div className="section-container">
          <h2 id="oh-bring-heading">What to bring</h2>
          <p>
            Your field guide, marked up with what rang true and what you're still
            unsure about, and the one question you most want answered. The prep
            is what makes the time count.
          </p>

          <table className="oh-glance">
            <caption className="sr-only">Office hours at a glance</caption>
            <tbody>
              <tr>
                <th scope="row">Format</th>
                <td>30 minutes, up to three people</td>
              </tr>
              <tr>
                <th scope="row">Price</th>
                <td>$50 a seat</td>
              </tr>
              <tr>
                <th scope="row">Bring</th>
                <td>Your marked-up field guide and one question</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="oh-section oh-fallback" aria-labelledby="oh-fallback-heading">
        <div className="section-container">
          <h2 id="oh-fallback-heading">Not ready to book?</h2>
          <p>
            Ask a question for free, and we'll answer it on the blog and on
            socials. <Link to="/questions">Ask a question</Link>.
          </p>
        </div>
      </section>
    </div>
  )
}

export default OfficeHours
