import { useState } from 'react'
import { subscribe } from '../lib/ghost'
import './SubscribeForm.css'

function SubscribeForm({ variant = 'default', heading, description }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    if (status === 'loading') return

    setStatus('loading')
    setErrorMessage('')

    try {
      await subscribe(email.trim())
      setStatus('success')
      setEmail('')
    } catch (error) {
      setStatus('error')
      const raw = error?.message || ''
      let friendly = 'Something went wrong. Please try again.'
      if (/already/i.test(raw)) {
        friendly = "You're already subscribed — check your inbox."
      } else if (/disabled|members/i.test(raw)) {
        friendly = 'Subscriptions are currently unavailable.'
      } else if (/email/i.test(raw)) {
        friendly = 'Please enter a valid email address.'
      }
      setErrorMessage(friendly)
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
            Check your inbox to confirm your subscription.
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
