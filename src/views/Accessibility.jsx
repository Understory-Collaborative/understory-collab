import PageMeta from '../components/PageMeta'
import './Accessibility.css'

function Accessibility() {
  return (
    <div className="accessibility-page">
      <PageMeta
        title="Accessibility"
        description="Our commitment to making this website accessible to everyone, and the accessibility features it includes."
      />
      <section className="page-hero" aria-labelledby="accessibility-heading">
        <div className="page-hero-content">
          <h1 id="accessibility-heading">Accessibility Statement</h1>
          <p className="page-hero-description">
            Our commitment to making this website accessible to everyone.
          </p>
        </div>
      </section>

      <section className="accessibility-content">
        <div className="section-container">
          <div className="accessibility-text">
            <h2>Our Commitment</h2>
            <p>
              Understory Collaborative is committed to ensuring digital accessibility
              for people with disabilities. We are continually improving the user
              experience for everyone and applying the relevant accessibility standards.
            </p>

            <h2>Conformance Status</h2>
            <p>
              We aim to conform to the{' '}
              <a
                href="https://www.w3.org/WAI/WCAG22/quickref/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Web Content Accessibility Guidelines (WCAG) 2.2
                <span className="sr-only">(opens in new tab)</span>
              </a>{' '}
              at Level AA. These guidelines explain how to make web content more
              accessible for people with disabilities and more user-friendly for everyone.
            </p>

            <h2>Accessibility Features</h2>
            <p>This website includes the following accessibility features:</p>
            <ul>
              <li>
                <strong>Keyboard navigation:</strong> All functionality is available
                using a keyboard
              </li>
              <li>
                <strong>Skip links:</strong> Skip to main content links allow keyboard
                users to bypass navigation
              </li>
              <li>
                <strong>Color contrast:</strong> Text and interactive elements meet
                WCAG AA contrast requirements
              </li>
              <li>
                <strong>Focus indicators:</strong> Visible focus states help keyboard
                users track their location
              </li>
              <li>
                <strong>Semantic HTML:</strong> Proper heading structure and landmarks
                support screen reader navigation
              </li>
              <li>
                <strong>Form labels:</strong> All form inputs have associated labels
                and error messages are announced
              </li>
              <li>
                <strong>Responsive design:</strong> Content adapts to different screen
                sizes and zoom levels
              </li>
              <li>
                <strong>Theme options:</strong> Users can toggle between light and
                dark modes
              </li>
            </ul>

            <h2>Feedback</h2>
            <p>
              We welcome your feedback on the accessibility of this website. If you
              encounter any barriers or have suggestions for improvement, please
              contact us:
            </p>
            <ul>
              <li>
                <strong>Email:</strong>{' '}
                <a href="mailto:contact@understorycollab.com">
                  contact@understorycollab.com
                </a>
              </li>
            </ul>
            <p>
              We aim to respond to accessibility feedback within 2 business days
              and to resolve issues as quickly as possible.
            </p>

            <h2>Compatibility</h2>
            <p>This website is designed to be compatible with:</p>
            <ul>
              <li>Recent versions of major browsers (Chrome, Firefox, Safari, Edge)</li>
              <li>Screen readers including NVDA, JAWS, and VoiceOver</li>
              <li>Screen magnification software</li>
              <li>Speech recognition software</li>
            </ul>

            <h2>Limitations</h2>
            <p>
              While we strive to ensure accessibility of this website, there may be
              some limitations. If you encounter any issues, please contact us so
              we can address them promptly.
            </p>

            <h2>Assessment</h2>
            <p>
              This website's accessibility is assessed through a combination of
              self-evaluation, automated testing tools, and manual testing with
              assistive technologies.
            </p>

            <p className="last-updated">
              <em>This statement was last updated on January 2025.</em>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Accessibility
