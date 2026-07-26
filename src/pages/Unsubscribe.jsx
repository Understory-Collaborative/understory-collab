import { useRef, useState } from 'react'
import './Unsubscribe.css'

// Basic RFC-5322-ish check; the serverless function re-validates authoritatively.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Unsubscribe() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [errorMessage, setErrorMessage] = useState('')
  // Only the email-format failure marks the field itself invalid; a network/server
  // failure is not the field's fault, so it must not set aria-invalid on a valid address.
  const [invalidEmail, setInvalidEmail] = useState(false)
  const inputRef = useRef(null)

  async function handleSubmit(event) {
    event.preventDefault()
    if (status === 'loading') return

    const trimmed = email.trim()

    if (!EMAIL_RE.test(trimmed)) {
      setStatus('error')
      setInvalidEmail(true)
      setErrorMessage('Please enter a valid email address.')
      inputRef.current?.focus()
      return
    }

    setStatus('loading')
    setInvalidEmail(false)
    setErrorMessage('')

    try {
      const res = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      })
      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`)
      }
      setStatus('success')
      setEmail('')
    } catch {
      setStatus('error')
      setErrorMessage('Something went wrong. Please try again.')
      inputRef.current?.focus()
    }
  }

  const isLoading = status === 'loading'
  const hasError = status === 'error'
  const errorId = 'unsubscribe-email-error'

  return (
    <div className="unsubscribe">
      <section className="page-hero" aria-labelledby="unsubscribe-heading">
        <div className="page-hero-content">
          <h1 id="unsubscribe-heading">Unsubscribe</h1>
          <p className="page-hero-description">
            Every newsletter email we send also includes a one-click unsubscribe
            link. You can also remove your address from this page.
          </p>
        </div>
      </section>

      <section className="unsubscribe-body" aria-labelledby="unsubscribe-form-heading">
        <div className="section-container">
          <form className="unsubscribe-form" onSubmit={handleSubmit} noValidate>
            <h2 id="unsubscribe-form-heading" className="unsubscribe-form__heading">
              Remove Your Address
            </h2>

            <div className="unsubscribe-form__field">
              <label htmlFor="unsubscribe-email" className="unsubscribe-form__label">
                Email
              </label>
              <input
                ref={inputRef}
                id="unsubscribe-email"
                type="email"
                className="unsubscribe-form__input"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
                disabled={isLoading || status === 'success'}
                aria-invalid={invalidEmail}
                aria-describedby={hasError ? errorId : undefined}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary unsubscribe-form__button"
              disabled={isLoading || status === 'success'}
            >
              {isLoading ? 'Unsubscribing…' : 'Unsubscribe'}
            </button>

            <div className="unsubscribe-form__status" role="status" aria-live="polite">
              {status === 'success' && (
                <p className="unsubscribe-form__success">
                  If that address was subscribed, it's now removed.
                </p>
              )}
            </div>

            {hasError && (
              <p id={errorId} className="unsubscribe-form__error" role="alert">
                {errorMessage}
              </p>
            )}
          </form>
        </div>
      </section>
    </div>
  )
}

export default Unsubscribe
