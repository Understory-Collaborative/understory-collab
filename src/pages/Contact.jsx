import { useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { offers, getOffer } from '../data/offersData'
import PageMeta from '../components/PageMeta'
import './Contact.css'

// Human-readable label for the "what's this about?" selection, sent as its own
// `topic` field so the notification email can show it on its own line.
function topicLabel(topic) {
  if (topic === 'other') return 'Something else'
  return getOffer(topic)?.name || ''
}

const MAX = {
  name: 200,
  business: 200,
  email: 320,
  message: 5000,
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(values) {
  const errors = {}

  const name = values.name.trim()
  if (!name) {
    errors.name = 'Please enter your name.'
  } else if (name.length > MAX.name) {
    errors.name = `Please keep your name under ${MAX.name} characters.`
  }

  const email = values.email.trim()
  if (!email) {
    errors.email = 'Please enter your email address.'
  } else if (email.length > MAX.email) {
    errors.email = `Please keep your email under ${MAX.email} characters.`
  } else if (!EMAIL_RE.test(email)) {
    errors.email = 'Please enter a valid email address, like name@example.com.'
  }

  const message = values.message.trim()
  if (!message) {
    errors.message = 'Please enter a message.'
  } else if (message.length > MAX.message) {
    errors.message = `Please keep your message under ${MAX.message} characters.`
  }

  if (values.business.trim().length > MAX.business) {
    errors.business = `Please keep your business name under ${MAX.business} characters.`
  }

  return errors
}

// Fields validated on submit, in DOM order — used to focus the first invalid one.
const FOCUS_ORDER = ['name', 'business', 'email', 'message']

function Contact() {
  const [searchParams] = useSearchParams()
  // Preselect the topic when someone arrives from an offer page (/contact?door=design).
  const doorParam = searchParams.get('door')
  const initialTopic = getOffer(doorParam) ? doorParam : ''

  const [values, setValues] = useState({
    topic: initialTopic,
    name: '',
    business: '',
    email: '',
    message: '',
    hp_referral: '', // honeypot — neutral name so browser autofill won't populate it
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | loading | success | error

  const refs = {
    name: useRef(null),
    business: useRef(null),
    email: useRef(null),
    message: useRef(null),
  }

  function handleChange(event) {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (status === 'loading') return

    const nextErrors = validate(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      setStatus('idle')
      const firstInvalid = FOCUS_ORDER.find((field) => nextErrors[field])
      if (firstInvalid && refs[firstInvalid].current) {
        refs[firstInvalid].current.focus()
      }
      return
    }

    setStatus('loading')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name.trim(),
          business: values.business.trim(),
          email: values.email.trim(),
          topic: topicLabel(values.topic),
          message: values.message.trim(),
          hp_referral: values.hp_referral,
        }),
      })

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      setStatus('success')
      setValues({
        topic: '',
        name: '',
        business: '',
        email: '',
        message: '',
        hp_referral: '',
      })
      setErrors({})
    } catch {
      setStatus('error')
    }
  }

  const isSending = status === 'loading'

  return (
    <div className="contact">
      <PageMeta
        title="Contact"
        description="Tell us what you're working on. If it's a good match, we'll set up a time to talk."
      />
      <section className="page-hero" aria-labelledby="contact-heading">
        <div className="page-hero-content">
          <h1 id="contact-heading">Tell us what you're working on</h1>
          <p className="page-hero-description">
            Send a note about what's going on. If it's a good match, we'll set up a
            time to talk.
          </p>
        </div>
      </section>

      <section className="contact-content" aria-labelledby="say-hello-heading">
        <div className="section-container">
          <div className="contact-body">
            <div className="contact-intro">
              <h2 id="say-hello-heading">Say hello</h2>
              <p>
                Send a quick question or start a longer conversation. Either way,
                we meet you where you are.
              </p>
            </div>

            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              {/* Submit-failure summary. role="alert" so it interrupts and is
                  announced when a network/server error occurs on submit. */}
              {status === 'error' && (
                <div className="contact-form__alert" role="alert">
                  Sorry, we couldn't send your message just now. Please try
                  again, or email us directly at{' '}
                  <a href="mailto:contact@understorycollab.com">
                    contact@understorycollab.com
                  </a>
                  .
                </div>
              )}

              <div className="contact-field">
                <label className="contact-label" htmlFor="contact-topic">
                  What's this about?{' '}
                  <span className="contact-optional">(optional)</span>
                </label>
                <select
                  id="contact-topic"
                  name="topic"
                  className="contact-input"
                  value={values.topic}
                  onChange={handleChange}
                  disabled={isSending}
                >
                  <option value="">Choose one</option>
                  {offers.map((offer) => (
                    <option key={offer.id} value={offer.slug}>
                      {offer.name}
                    </option>
                  ))}
                  <option value="other">Something else</option>
                </select>
              </div>

              <div className="contact-field">
                <label className="contact-label" htmlFor="contact-name">
                  Name <span className="contact-required">(required)</span>
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  className="contact-input"
                  value={values.name}
                  onChange={handleChange}
                  ref={refs.name}
                  required
                  aria-required="true"
                  autoComplete="name"
                  maxLength={MAX.name}
                  aria-invalid={errors.name ? 'true' : undefined}
                  aria-describedby={errors.name ? 'contact-name-error' : undefined}
                  disabled={isSending}
                />
                {errors.name && (
                  <p className="contact-error" id="contact-name-error">
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="contact-field">
                <label className="contact-label" htmlFor="contact-business">
                  Business{' '}
                  <span className="contact-optional">(optional)</span>
                </label>
                <input
                  id="contact-business"
                  name="business"
                  type="text"
                  className="contact-input"
                  value={values.business}
                  onChange={handleChange}
                  ref={refs.business}
                  autoComplete="organization"
                  maxLength={MAX.business}
                  aria-invalid={errors.business ? 'true' : undefined}
                  aria-describedby={
                    errors.business ? 'contact-business-error' : undefined
                  }
                  disabled={isSending}
                />
                {errors.business && (
                  <p className="contact-error" id="contact-business-error">
                    {errors.business}
                  </p>
                )}
              </div>

              <div className="contact-field">
                <label className="contact-label" htmlFor="contact-email">
                  Email <span className="contact-required">(required)</span>
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  className="contact-input"
                  value={values.email}
                  onChange={handleChange}
                  ref={refs.email}
                  required
                  aria-required="true"
                  autoComplete="email"
                  maxLength={MAX.email}
                  aria-invalid={errors.email ? 'true' : undefined}
                  aria-describedby={
                    errors.email ? 'contact-email-error' : undefined
                  }
                  disabled={isSending}
                />
                {errors.email && (
                  <p className="contact-error" id="contact-email-error">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="contact-field">
                <label className="contact-label" htmlFor="contact-message">
                  Message <span className="contact-required">(required)</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  className="contact-input contact-textarea"
                  value={values.message}
                  onChange={handleChange}
                  ref={refs.message}
                  required
                  aria-required="true"
                  rows={6}
                  maxLength={MAX.message}
                  aria-invalid={errors.message ? 'true' : undefined}
                  aria-describedby={
                    errors.message ? 'contact-message-error' : undefined
                  }
                  disabled={isSending}
                />
                {errors.message && (
                  <p className="contact-error" id="contact-message-error">
                    {errors.message}
                  </p>
                )}
              </div>

              {/* Honeypot — hidden from users and assistive tech; bots that fill
                  it are silently dropped by the server. Neutral field name plus the
                  autofill/password-manager opt-outs so a real person's browser never
                  fills it and gets dropped as a bot. */}
              <div className="sr-only" aria-hidden="true">
                <label htmlFor="contact-hp-referral">
                  Leave this field empty
                </label>
                <input
                  id="contact-hp-referral"
                  name="hp_referral"
                  type="text"
                  value={values.hp_referral}
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  data-1p-ignore="true"
                  data-lpignore="true"
                  data-form-type="other"
                />
              </div>

              <p className="contact-privacy">
                We use your details only to reply to you. See our{' '}
                <Link to="/privacy">Privacy Policy</Link>.
              </p>

              <button
                type="submit"
                className="btn btn-primary contact-submit"
                disabled={isSending}
              >
                {isSending ? 'Sending…' : 'Send'}
              </button>

              {/* Success status. role="status" + aria-live="polite" announces
                  without interrupting. */}
              <div className="contact-status" role="status" aria-live="polite">
                {status === 'success' && (
                  <p className="contact-success">
                    Thanks, we'll be in touch.
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact
