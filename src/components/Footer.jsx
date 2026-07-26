import { Link } from 'react-router-dom'
import SubscribeForm from './SubscribeForm'
import './Footer.css'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-main">
          <div className="footer-subscribe">
            <SubscribeForm
              variant="footer"
              heading="Stay Connected"
              description="Get our newsletter in your inbox."
            />
          </div>

          <nav className="footer-nav" aria-label="Footer navigation">
            <ul className="footer-links" role="list">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/our-work">Our Work</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </nav>
        </div>

        <div className="footer-bottom">
          <div className="footer-contact">
            <a href="mailto:contact@understorycollab.com">contact@understorycollab.com</a>
          </div>

          <div className="footer-bottom-links">
            <Link to="/accessibility" className="footer-accessibility">
              Accessibility Statement
            </Link>
            <Link to="/privacy" className="footer-accessibility">
              Privacy Policy
            </Link>
            <Link to="/unsubscribe" className="footer-accessibility">
              Unsubscribe
            </Link>
          </div>
          <p className="footer-copyright">
            &copy; {currentYear} Understory Collaborative. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
