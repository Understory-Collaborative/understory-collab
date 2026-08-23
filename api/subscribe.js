/**
 * Vercel Node serverless function: newsletter signup (Buttondown).
 *
 * The newsletter form used to post straight to Kit's public form endpoint from the browser
 * (src/lib/kit.js). Buttondown authenticates every write with a secret token, so the signup
 * has to run server-side now: the browser posts { email } here, and this function calls
 * Buttondown with the token, tagging the signup `newsletter` so a sequence can target it.
 *
 * Double opt-in is a newsletter-level setting in Buttondown, not a payload flag. With it on,
 * Buttondown sends the confirmation email, which is why the on-page copy asks the subscriber
 * to check their inbox. Keep double opt-in enabled for that copy to stay accurate.
 *
 * Environment variables (set in Vercel, never committed):
 *   BUTTONDOWN_API_KEY — required. Buttondown API token. Without it, signups are refused
 *                        (503) rather than silently dropped.
 *   BUTTONDOWN_API_URL — optional override of the subscribers endpoint, in case Buttondown
 *                        moves hosts. Defaults to the v1 subscribers endpoint below.
 *
 * Privacy: never logs the email address; returns a generic error without echoing input.
 */

const { process } = globalThis

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const BUTTONDOWN_SUBSCRIBERS_URL =
  process.env.BUTTONDOWN_API_URL || 'https://api.buttondown.email/v1/subscribers'

async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') return req.body
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body) } catch { return null }
  }
  let raw = ''
  for await (const chunk of req) raw += chunk
  if (!raw) return null
  try { return JSON.parse(raw) } catch { return null }
}

// True when Buttondown rejects a create because the address is already on the list. An
// existing subscriber is a success from the visitor's point of view, not an error.
function isAlreadySubscribed(status, text) {
  return status === 400 && /already|exist/i.test(text || '')
}

// Add an email to Buttondown with the given source tags. Returns a small result object so the
// caller can tell a genuine failure from an already-subscribed address. Logs status only.
export async function addToButtondown({ email, tags }) {
  const key = process.env.BUTTONDOWN_API_KEY
  if (!key) return { ok: false, configured: false }

  let res
  try {
    res = await fetch(BUTTONDOWN_SUBSCRIBERS_URL, {
      method: 'POST',
      headers: { Authorization: `Token ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email_address: email, tags }),
    })
  } catch {
    console.error('Buttondown subscribe request failed')
    return { ok: false, configured: true }
  }

  if (res.ok) return { ok: true, configured: true, already: false }

  const detail = await res.text().catch(() => '')
  if (isAlreadySubscribed(res.status, detail)) {
    return { ok: true, configured: true, already: true }
  }
  console.error('Buttondown subscribe failed:', res.status)
  return { ok: false, configured: true }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const body = await readJsonBody(req)
  const email = typeof body?.email === 'string' ? body.email.trim() : ''
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'A valid email address is required' })
  }

  const result = await addToButtondown({ email, tags: ['newsletter'] })
  if (!result.configured) {
    return res.status(503).json({ error: 'Subscriptions are currently unavailable.' })
  }
  if (!result.ok) {
    return res.status(502).json({ error: 'Could not subscribe you. Please try again.' })
  }
  // already-subscribed is surfaced so the form can show the friendly "already on the list" copy.
  return res.status(200).json({ ok: true, already: result.already })
}
