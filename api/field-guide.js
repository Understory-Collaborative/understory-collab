/**
 * Vercel Node serverless function: field-guide email capture (MailerLite).
 *
 * Flow: a visitor finishes the "What's On Fire?" assessment and enters their email to get the
 * matching field guide. We add them to MailerLite (which sends the double opt-in confirmation
 * when the account has double opt-in on), into the assessment group so a future sequence can
 * target it, and, if a sender is configured, email them the guide link too. The front end also
 * reveals an instant on-page download, so delivery is immediate AND arrives by email.
 *
 * MailerLite authenticates every write with a secret token, so this must run server-side.
 *
 * Environment variables (set in Vercel, never committed):
 *   MAILERLITE_API_KEY — required to add the subscriber (see api/subscribe.js). Without it the
 *                        signup is refused rather than silently dropped.
 *   RESEND_API_KEY     — (optional) Resend API key to email the guide link. If unset, we skip
 *                        the email; the opt-in email and instant download still work.
 *   FIELD_GUIDE_FROM   — (optional) From address for the guide email, e.g.
 *                        "Understory Collaborative <contact@understorycollab.com>"
 *   SITE_URL           — (optional) canonical site origin for absolute PDF links in the email;
 *                        falls back to the request's own host.
 * The assessment group id is not secret and lives in api/subscribe.js (MAILERLITE_GROUPS).
 *
 * Privacy: never logs the email address; returns a generic error without echoing input.
 */

import { addSubscriber, MAILERLITE_GROUPS } from './subscribe.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// The four fire types are the only valid guides; this allowlist also prevents any
// path trickery from reaching the /field-guides/<slug>.pdf link.
const GUIDES = {
  'brush-fire': 'Before Fire Season',
  smolder: 'Smoke Signals',
  'crown-fire': 'When the Canopy Burns',
  firestorm: 'After the Firestorm',
}

const { process } = globalThis

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

function siteOrigin(req) {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, '')
  const proto = req.headers['x-forwarded-proto'] || 'https'
  const host = req.headers['x-forwarded-host'] || req.headers.host
  return `${proto}://${host}`
}

async function emailGuide({ email, guideName, pdfHref }) {
  const key = process.env.RESEND_API_KEY
  const from = process.env.FIELD_GUIDE_FROM
  if (!key || !from) return // email delivery not configured; instant download still works
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: [email],
      subject: `Your field guide: ${guideName}`,
      html:
        `<p>Thanks for taking the assessment. Here's your field guide:</p>` +
        `<p><a href="${pdfHref}">Download “${guideName}” (PDF)</a></p>` +
        `<p>We've also added you to our list — confirm the subscription email to stay on it, ` +
        `and you can unsubscribe anytime.</p>`,
    }),
  }).catch(() => {}) // best-effort; never block the response on the email
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const body = await readJsonBody(req)
  const email = typeof body?.email === 'string' ? body.email.trim() : ''
  const fireType = typeof body?.fireType === 'string' ? body.fireType : ''

  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'A valid email address is required' })
  }
  if (!Object.prototype.hasOwnProperty.call(GUIDES, fireType)) {
    return res.status(400).json({ error: 'Unknown guide' })
  }

  const guideName = GUIDES[fireType]
  const pdfPath = `/field-guides/${fireType}.pdf`

  try {
    // Add to the assessment group so a future sequence can target the assessment cohort. A
    // returning address still gets the guide (MailerLite upserts). Fire-type granularity waits
    // for the nurture build.
    const result = await addSubscriber({
      email,
      groups: [MAILERLITE_GROUPS.assessment],
    })
    if (!result.configured) {
      return res.status(503).json({ error: 'Could not process your request. Please try again.' })
    }
    if (!result.ok) {
      return res.status(502).json({ error: 'Could not process your request. Please try again.' })
    }
    await emailGuide({ email, guideName, pdfHref: `${siteOrigin(req)}${pdfPath}` })
    return res.status(200).json({ ok: true, pdf: pdfPath })
  } catch {
    // Do not leak internal detail or the email address.
    return res.status(502).json({ error: 'Could not process your request. Please try again.' })
  }
}
