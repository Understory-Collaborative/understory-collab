import { Link } from 'react-router-dom'
import PageMeta from '../components/PageMeta'
import './Unsubscribe.css'

function Unsubscribe() {
  return (
    <div className="unsubscribe">
      <PageMeta
        title="Unsubscribe"
        description="You can leave the Understory Collaborative newsletter at any time. Here's how."
      />
      <section className="page-hero" aria-labelledby="unsubscribe-heading">
        <div className="page-hero-content">
          <h1 id="unsubscribe-heading">Unsubscribe</h1>
          <p className="page-hero-description">
            You can leave our newsletter at any time.
          </p>
        </div>
      </section>

      <section className="unsubscribe-body" aria-labelledby="unsubscribe-how-heading">
        <div className="section-container">
          <h2 id="unsubscribe-how-heading" className="unsubscribe-form__heading">
            How to unsubscribe
          </h2>
          <p>
            Every email we send has a one-click unsubscribe link at the bottom. Select it
            and you are removed right away, with no account or password to remember.
          </p>
          <p>
            If you cannot find an email from us, or you would rather we remove your address
            for you, <Link to="/contact">contact us</Link> and we will take care of it.
          </p>
        </div>
      </section>
    </div>
  )
}

export default Unsubscribe
