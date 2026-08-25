// Newsletter subscription (MailerLite, via our own /api/subscribe endpoint).
//
// MailerLite authenticates with a secret token, so unlike the old Kit embed this cannot
// post from the browser. We post the email to our serverless function, which holds the
// token and adds the subscriber. With double opt-in on, a success means the confirmation
// email is on its way, not that the address is confirmed yet.

async function describeError(res) {
  try {
    const data = await res.clone().json()
    const message = data?.error || data?.message
    if (message) return typeof message === 'string' ? message : JSON.stringify(message)
  } catch {
    // not JSON, fall through
  }
  return `${res.status} ${res.statusText}`
}

// Resolves to { already } on success (already === true when the address was already on the
// list) and throws with a human-readable message on failure, matching the form's handling.
export async function subscribe(email) {
  const res = await fetch('/api/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
  if (!res.ok) {
    const detail = await describeError(res)
    throw new Error(detail || `Subscribe failed: ${res.status}`)
  }
  const data = await res.json().catch(() => ({}))
  return { already: Boolean(data?.already) }
}
