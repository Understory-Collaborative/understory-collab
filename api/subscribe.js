/**
 * Vercel Node serverless function: newsletter signup (MailerLite).
 *
 * The newsletter form used to post straight to Kit's public form endpoint from the browser.
 * MailerLite authenticates every write with a secret token, so the signup runs server-side:
 * the browser posts { email } here, and this function upserts the subscriber in MailerLite.
 *
 * Source is captured with MailerLite "groups" (their tag equivalent): if a group id is
 * configured for a source, the subscriber is added to it, so a future sequence can target it.
 * Group ids are optional, so capture works before any group exists and starts grouping once
 * the ids are set. Nurture automation itself is being built later, not in MailerLite.
 *
 * Double opt-in is an account-level setting in MailerLite. With it on, MailerLite sends the
 * confirmation email, which is why the on-page copy asks the subscriber to check their inbox.
 *
 * Environment variables (set in Vercel, never committed):
 *   MAILERLITE_API_KEY        — required. MailerLite API token. Without it, signups are
 *                               refused (503) rather than silently dropped.
 *   MAILERLITE_GROUP_NEWSLETTER — optional. Group id for newsletter signups.
 *   MAILERLITE_GROUP_ASSESSMENT — optional. Group id for assessment (field-guide) signups.
 *   MAILERLITE_API_URL        — optional override of the subscribers endpoint.
 *
 * Privacy: never logs the email address; returns a generic error without echoing input.
 */

const { process } = globalThis

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const MAILERLITE_SUBSCRIBERS_URL =
  process.env.MAILERLITE_API_URL || 'https://connect.mailerlite.com/api/subscribers'

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

// Upsert an email into MailerLite, optionally into the given source groups. Returns a small
// result object so the caller can tell a genuine failure from an unconfigured key. MailerLite
// upserts non-destructively, so an existing address is a success (a 200, versus 201 for new),
// not an error. Logs status only, never the subscriber's data.
export async function addSubscriber({ email, groups }) {
  const key = process.env.MAILERLITE_API_KEY
  if (!key) return { ok: false, configured: false }

  const payload = { email }
  const groupIds = (groups || []).filter(Boolean)
  if (groupIds.length) payload.groups = groupIds

  let res
  try {
    res = await fetch(MAILERLITE_SUBSCRIBERS_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    })
  } catch {
    console.error('MailerLite subscribe request failed')
    return { ok: false, configured: true }
  }

  if (res.ok) return { ok: true, configured: true, already: res.status === 200 }

  const detail = await res.text().catch(() => '')
  console.error('MailerLite subscribe failed:', res.status, detail.slice(0, 300))
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

  const result = await addSubscriber({
    email,
    groups: [process.env.MAILERLITE_GROUP_NEWSLETTER],
  })
  if (!result.configured) {
    return res.status(503).json({ error: 'Subscriptions are currently unavailable.' })
  }
  if (!result.ok) {
    return res.status(502).json({ error: 'Could not subscribe you. Please try again.' })
  }
  // already (a returning address) is surfaced so the form can show the "already on the list" copy.
  return res.status(200).json({ ok: true, already: result.already })
}
