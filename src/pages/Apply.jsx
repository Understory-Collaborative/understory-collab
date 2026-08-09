import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { offers, getOffer } from '../data/offersData'
import './Apply.css'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const TIMELINES = [
  'As soon as we can',
  'This quarter',
  'Next quarter',
  'Still exploring',
]

// Short application. A real form (not a mailto): on submit it POSTs to /api/apply,
// which emails a shared inbox via Resend so webs can read it and reply to the good
// fits. The hidden company_website field is a honeypot; the server drops any
// submission that fills it.
function Apply() {
  const [searchParams] = useSearchParams()
  const doorFromUrl = searchParams.get('door')
  const initialDoor = getOffer(doorFromUrl) ? doorFromUrl : ''

  const [door, setDoor] = useState(initialDoor)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [situation, setSituation] = useState('')
  const [timeline, setTimeline] = useState('')
  const [companyWebsite, setCompanyWebsite] = useState('') // honeypot
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [errorMessage, setErrorMessage] = useState('')
  const headingRef = useRef(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    if (status === 'loading') return

    if (!door) {
      setStatus('error')
      setErrorMessage('Please choose which door fits.')
      return
    }
    if (!name.trim()) {
      setStatus('error')
      setErrorMessage('Please enter your name.')
      return
    }
    if (!EMAIL_RE.test(email.trim())) {
      setStatus('error')
      setErrorMessage('Please enter a valid email address.')
      return
    }
    if (!situation.trim()) {
      setStatus('error')
      setErrorMessage('Please tell us what is stuck.')
      return
    }

    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          door,
          name: name.trim(),
          email: email.trim(),
          company: company.trim(),
          situation: situation.trim(),
          timeline,
          company_website: companyWebsite, // honeypot
        }),
      })
      if (!response.ok) throw new Error(`Request failed: ${response.status}`)
      setStatus('success')
    } catch {
      setStatus('error')
      setErrorMessage('Something went wrong. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className="apply-page">
        <section className="page-hero" aria-labelledby="apply-heading">
          <div className="page-hero-content">
            <h1 id="apply-heading" ref={headingRef} tabIndex={-1}>
              Thank you. Your application is in.
            </h1>
            <p className="apply-success">
              We read every one. If it is a fit, we will reply to set up a
              conversation. If it is not, we will tell you that too.
            </p>
          </div>
        </section>
      </div>
    )
  }

  const errorId = 'apply-form-error'

  return (
    <div className="apply-page">
      <section className="page-hero" aria-labelledby="apply-heading">
        <div className="page-hero-content">
          <h1 id="apply-heading">Apply</h1>
          <p className="apply-intro">
            A short application, not a sales form. Tell us where you are stuck. If
            it is a fit, we will set up a conversation. If it is not, we will tell
            you that too, and that saves us both time.
          </p>
        </div>
      </section>

      <section className="apply-body" aria-labelledby="apply-form-heading">
        <div className="section-container">
          <h2 id="apply-form-heading" className="sr-only">
            Application form
          </h2>
          <form className="apply-form" onSubmit={handleSubmit} noValidate>
            <div className="apply-field">
              <label htmlFor="apply-door">Which door fits?</label>
              <select
                id="apply-door"
                value={door}
                onChange={(event) => setDoor(event.target.value)}
                required
                className="apply-select"
              >
                <option value="">Choose one</option>
                {offers.map((offer) => (
                  <option key={offer.id} value={offer.slug}>
                    {offer.name} — {offer.descriptor}
                  </option>
                ))}
              </select>
            </div>

            <div className="apply-field">
              <label htmlFor="apply-name">Your name</label>
              <input
                id="apply-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                autoComplete="name"
                className="apply-input"
              />
            </div>

            <div className="apply-field">
              <label htmlFor="apply-email">Email</label>
              <input
                id="apply-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoComplete="email"
                placeholder="you@company.com"
                className="apply-input"
              />
            </div>

            <div className="apply-field">
              <label htmlFor="apply-company">
                Company <span className="apply-optional">(optional)</span>
              </label>
              <input
                id="apply-company"
                type="text"
                value={company}
                onChange={(event) => setCompany(event.target.value)}
                autoComplete="organization"
                className="apply-input"
              />
            </div>

            <div className="apply-field">
              <label htmlFor="apply-situation">What is stuck?</label>
              <textarea
                id="apply-situation"
                value={situation}
                onChange={(event) => setSituation(event.target.value)}
                required
                rows={6}
                className="apply-textarea"
              />
            </div>

            <div className="apply-field">
              <label htmlFor="apply-timeline">
                Timeline <span className="apply-optional">(optional)</span>
              </label>
              <select
                id="apply-timeline"
                value={timeline}
                onChange={(event) => setTimeline(event.target.value)}
                className="apply-select"
              >
                <option value="">No preference</option>
                {TIMELINES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Honeypot: hidden from people, tempting to bots. Server drops it if filled. */}
            <div className="apply-hp" aria-hidden="true">
              <label htmlFor="company_website">Company website</label>
              <input
                id="company_website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={companyWebsite}
                onChange={(event) => setCompanyWebsite(event.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-large"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Sending…' : 'Send application'}
            </button>

            <div className="apply-status" role="status" aria-live="polite">
              {status === 'error' && (
                <p id={errorId} className="apply-error">{errorMessage}</p>
              )}
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}

export default Apply
