import { useState } from 'react'
import { subscribe } from '../lib/subscribe'
import { submitErrorMessage } from '../lib/formErrors'
import './SubscribeForm.css'

function SubscribeForm({ variant = 'default', heading, description }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const [already, setAlready] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    if (status === 'loading') return

    setStatus('loading')
    setErrorMessage('')

    try {
      const result = await subscribe(email.trim())
      setAlready(Boolean(result?.already))
      setStatus('success')
      setEmail('')
    } catch (error) {
      setStatus('error')
      setErrorMessage(submitErrorMessage(error?.status, 'add you to the list'))
    }
  }

  const isCompact = variant === 'compact'
  const inputId = `subscribe-email-${variant}`

  return (
    <form
      className={`subscribe-form subscribe-form--${variant}`}
      onSubmit={handleSubmit}
      aria-labelledby={heading ? `${inputId}-heading` : undefined}
    >
      {heading && (
        <h2 id={`${inputId}-heading`} className="subscribe-form__heading">
          {heading}
        </h2>
      )}
      {description && !isCompact && (
        <p className="subscribe-form__description">{description}</p>
      )}

      <div className="subscribe-form__row">
        <label htmlFor={inputId} className="sr-only">
          Email address
        </label>
        <input
          id={inputId}
          type="email"
          className="subscribe-form__input"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          autoComplete="email"
          aria-invalid={status === 'error'}
          aria-describedby={status === 'error' ? `${inputId}-error` : undefined}
          disabled={status === 'loading' || status === 'success'}
        />
        <button
          type="submit"
          className="btn btn-primary subscribe-form__button"
          disabled={status === 'loading' || status === 'success'}
        >
          {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
        </button>
      </div>

      <div
        className="subscribe-form__status"
        role="status"
        aria-live="polite"
      >
        {status === 'success' && (
          <p className="subscribe-form__success">
            {already
              ? "You're already on the list. Check your inbox for our emails."
              : 'Check your inbox to confirm your subscription.'}
          </p>
        )}
        {status === 'error' && (
          <p id={`${inputId}-error`} className="subscribe-form__error">{errorMessage}</p>
        )}
      </div>
    </form>
  )
}

export default SubscribeForm
