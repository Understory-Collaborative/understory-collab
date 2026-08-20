import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import './Contact.css'
import './Questions.css'

const MAX = {
  stuck: 3000,
  product: 500,
  name: 200,
  email: 320,
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Radio values must match the Google Form option text EXACTLY, or the form
// drops the value on submit. Keep these strings in sync with the form's options.
const SHARE_OPTIONS = [
  { value: 'Yes, use my name', label: 'Yes, use my name' },
  { value: 'Yes, keep me anonymous', label: 'Yes, keep me anonymous' },
  { value: 'No, just answer me privately', label: 'No, just answer me privately' },
]

function validate(values) {
  const errors = {}

  const stuck = values.stuck.trim()
  if (!stuck) {
    errors.stuck = 'Please tell us what you are stuck on.'
  } else if (stuck.length > MAX.stuck) {
    errors.stuck = `Please keep this under ${MAX.stuck} characters.`
  }

  if (values.product.trim().length > MAX.product) {
    errors.product = `Please keep this under ${MAX.product} characters.`
  }

  if (!values.share) {
    errors.share = 'Please choose whether we can share your question.'
  }

  if (values.name.trim().length > MAX.name) {
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

  return errors
}

// Fields validated on submit, in DOM order — used to focus the first invalid one.
const FOCUS_ORDER = ['stuck', 'product', 'share', 'name', 'email']

function Questions() {
  const [values, setValues] = useState({
    stuck: '',
    product: '',
    share: '',
    name: '',
    email: '',
    hp_referral: '', // honeypot — neutral name so browser autofill won't populate it
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | loading | success | error

  const refs = {
    stuck: useRef(null),
    product: useRef(null),
    share: useRef(null), // first radio of the share group
    name: useRef(null),
    email: useRef(null),
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
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stuck: values.stuck.trim(),
          product: values.product.trim(),
          share: values.share,
          name: values.name.trim(),
          email: values.email.trim(),
          hp_referral: values.hp_referral,
        }),
      })

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      setStatus('success')
      setValues({
        stuck: '',
        product: '',
        share: '',
        name: '',
        email: '',
        hp_referral: '',
      })
      setErrors({})
    } catch {
      setStatus('error')
    }
  }

  const isSending = status === 'loading'

  return (
    <div className="questions">
      <section className="page-hero" aria-labelledby="questions-heading">
        <div className="page-hero-content">
          <h1 id="questions-heading">Ask a question</h1>
          <p className="page-hero-lead">
            You have a question about what you're building, and you don't want a
            sales call to get it answered.
          </p>
          <p className="page-hero-support">
            Ask it here, free. We answer the ones that help the most people on
            the blog and on socials.
          </p>
        </div>
      </section>

      <section className="questions-content" aria-labelledby="ask-heading">
        <div className="section-container">
          <h2 id="ask-heading" className="sr-only">
            Ask your question
          </h2>

          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            {status === 'error' && (
              <div className="contact-form__alert" role="alert">
                Sorry, we couldn't send your question just now. Please try again,
                or email us at{' '}
                <a href="mailto:contact@understorycollab.com">
                  contact@understorycollab.com
                </a>
                .
              </div>
            )}

            <div className="contact-field">
              <label className="contact-label" htmlFor="qa-stuck">
                What are you stuck on?{' '}
                <span className="contact-required">(required)</span>
              </label>
              <textarea
                id="qa-stuck"
                name="stuck"
                className="contact-input contact-textarea"
                value={values.stuck}
                onChange={handleChange}
                ref={refs.stuck}
                required
                aria-required="true"
                rows={6}
                maxLength={MAX.stuck}
                aria-invalid={errors.stuck ? 'true' : undefined}
                aria-describedby={
                  errors.stuck ? 'qa-stuck-error qa-stuck-help' : 'qa-stuck-help'
                }
                disabled={isSending}
              />
              <p className="contact-help" id="qa-stuck-help">
                Give us enough that we can actually answer.
              </p>
              {errors.stuck && (
                <p className="contact-error" id="qa-stuck-error">
                  {errors.stuck}
                </p>
              )}
            </div>

            <div className="contact-field">
              <label className="contact-label" htmlFor="qa-product">
                What's the product?{' '}
                <span className="contact-optional">(optional)</span>
              </label>
              <input
                id="qa-product"
                name="product"
                type="text"
                className="contact-input"
                value={values.product}
                onChange={handleChange}
                ref={refs.product}
                maxLength={MAX.product}
                aria-describedby="qa-product-help"
                aria-invalid={errors.product ? 'true' : undefined}
                disabled={isSending}
              />
              <p className="contact-help" id="qa-product-help">
                A link or a sentence.
              </p>
              {errors.product && (
                <p className="contact-error" id="qa-product-error">
                  {errors.product}
                </p>
              )}
            </div>

            <fieldset
              className="qa-fieldset"
              aria-describedby={errors.share ? 'qa-share-error' : undefined}
            >
              <legend className="qa-legend">
                Can we share this publicly?{' '}
                <span className="contact-required">(required)</span>
              </legend>
              <div className="qa-choices">
                {SHARE_OPTIONS.map((option, index) => (
                  <label key={option.value} className="qa-choice">
                    <input
                      type="radio"
                      name="share"
                      value={option.value}
                      checked={values.share === option.value}
                      onChange={handleChange}
                      ref={index === 0 ? refs.share : undefined}
                      required
                      aria-required="true"
                      aria-invalid={errors.share ? 'true' : undefined}
                      disabled={isSending}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
              {errors.share && (
                <p className="contact-error" id="qa-share-error">
                  {errors.share}
                </p>
              )}
            </fieldset>

            <div className="contact-field">
              <label className="contact-label" htmlFor="qa-name">
                Your name <span className="contact-optional">(optional)</span>
              </label>
              <input
                id="qa-name"
                name="name"
                type="text"
                className="contact-input"
                value={values.name}
                onChange={handleChange}
                ref={refs.name}
                autoComplete="name"
                maxLength={MAX.name}
                aria-invalid={errors.name ? 'true' : undefined}
                aria-describedby={errors.name ? 'qa-name-error' : undefined}
                disabled={isSending}
              />
              {errors.name && (
                <p className="contact-error" id="qa-name-error">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="contact-field">
              <label className="contact-label" htmlFor="qa-email">
                Email <span className="contact-required">(required)</span>
              </label>
              <input
                id="qa-email"
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
                aria-describedby={
                  errors.email ? 'qa-email-error qa-email-help' : 'qa-email-help'
                }
                aria-invalid={errors.email ? 'true' : undefined}
                disabled={isSending}
              />
              <p className="contact-help" id="qa-email-help">
                Required, so we can keep the spam out. We only use it to reply.
              </p>
              {errors.email && (
                <p className="contact-error" id="qa-email-error">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Honeypot — hidden from users and assistive tech; bots that fill
                it are silently dropped by the server. Neutral field name plus the
                autofill/password-manager opt-outs so a real person's browser never
                fills it and gets dropped as a bot. */}
            <div className="sr-only" aria-hidden="true">
              <label htmlFor="qa-hp-referral">Leave this field empty</label>
              <input
                id="qa-hp-referral"
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

            <p className="qa-consent">
              We keep you anonymous unless you tell us it's fine to use your
              name. See our <Link to="/privacy">Privacy Policy</Link>.
            </p>

            <button
              type="submit"
              className="btn btn-primary contact-submit"
              disabled={isSending}
            >
              {isSending ? 'Sending…' : 'Send your question'}
            </button>

            <div className="contact-status" role="status" aria-live="polite">
              {status === 'success' && (
                <p className="contact-success">
                  Thanks. We read every one. If we answer yours, it'll be on the
                  blog and on socials, unless you asked us to keep it private.
                </p>
              )}
            </div>
          </form>
        </div>
      </section>

      <section className="questions-next" aria-labelledby="questions-next-heading">
        <div className="section-container">
          <h2 id="questions-next-heading">Want to talk it through?</h2>
          <p>
            If it's about your own situation and you want to talk it through,
            bring it to office hours.{' '}
            <Link to="/office-hours">See office hours</Link>.
          </p>
        </div>
      </section>
    </div>
  )
}

export default Questions
