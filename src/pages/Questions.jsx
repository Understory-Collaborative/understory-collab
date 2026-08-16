import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import './Contact.css'
import './Questions.css'

const MAX = {
  question: 3000,
  name: 200,
  email: 320,
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(values) {
  const errors = {}

  const question = values.question.trim()
  if (!question) {
    errors.question = 'Please enter your question.'
  } else if (question.length > MAX.question) {
    errors.question = `Please keep your question under ${MAX.question} characters.`
  }

  if (values.name.trim().length > MAX.name) {
    errors.name = `Please keep your name under ${MAX.name} characters.`
  }

  const email = values.email.trim()
  if (email) {
    if (email.length > MAX.email) {
      errors.email = `Please keep your email under ${MAX.email} characters.`
    } else if (!EMAIL_RE.test(email)) {
      errors.email = 'Please enter a valid email address, like name@example.com.'
    }
  }

  return errors
}

// Fields validated on submit, in DOM order — used to focus the first invalid one.
const FOCUS_ORDER = ['question', 'name', 'email']

function Questions() {
  const [values, setValues] = useState({
    question: '',
    name: '',
    email: '',
    company_website: '', // honeypot — humans never see or fill this
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | loading | success | error

  const refs = {
    question: useRef(null),
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
          question: values.question.trim(),
          name: values.name.trim(),
          email: values.email.trim(),
          company_website: values.company_website,
        }),
      })

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      setStatus('success')
      setValues({ question: '', name: '', email: '', company_website: '' })
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
          <p className="page-hero-description">
            Ask us a question about the work of a technical product manager. We
            answer the ones that help the most people, on the blog and on
            socials. It's free and open to anyone.
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
              <label className="contact-label" htmlFor="qa-question">
                Your question <span className="contact-required">(required)</span>
              </label>
              <textarea
                id="qa-question"
                name="question"
                className="contact-input contact-textarea"
                value={values.question}
                onChange={handleChange}
                ref={refs.question}
                required
                aria-required="true"
                rows={6}
                maxLength={MAX.question}
                aria-invalid={errors.question ? 'true' : undefined}
                aria-describedby={errors.question ? 'qa-question-error' : undefined}
                disabled={isSending}
              />
              {errors.question && (
                <p className="contact-error" id="qa-question-error">
                  {errors.question}
                </p>
              )}
            </div>

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
                Email <span className="contact-optional">(optional)</span>
              </label>
              <input
                id="qa-email"
                name="email"
                type="email"
                className="contact-input"
                value={values.email}
                onChange={handleChange}
                ref={refs.email}
                autoComplete="email"
                maxLength={MAX.email}
                aria-describedby="qa-email-help"
                aria-invalid={errors.email ? 'true' : undefined}
                disabled={isSending}
              />
              <p className="contact-help" id="qa-email-help">
                We'll only use it to tell you when we answer.
              </p>
              {errors.email && (
                <p className="contact-error" id="qa-email-error">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Honeypot — hidden from users and assistive tech; bots that fill
                it are silently dropped by the server. */}
            <div className="sr-only" aria-hidden="true">
              <label htmlFor="qa-company-website">Leave this field empty</label>
              <input
                id="qa-company-website"
                name="company_website"
                type="text"
                value={values.company_website}
                onChange={handleChange}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <p className="qa-consent">
              We may answer your question publicly, on the blog or on socials. We
              keep you anonymous unless you tell us it's fine to use your name.
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
                  blog or socials.
                </p>
              )}
            </div>
          </form>
        </div>
      </section>

      <section className="questions-next" aria-labelledby="questions-next-heading">
        <div className="section-container">
          <h2 id="questions-next-heading">Want an answer now?</h2>
          <p>
            If it's about your own situation and you want it answered today,
            bring it to office hours. <Link to="/office-hours">See office hours</Link>.
          </p>
        </div>
      </section>
    </div>
  )
}

export default Questions
