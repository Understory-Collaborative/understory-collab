/**
 * Vercel Node serverless function: field-guide email capture (Kit, formerly ConvertKit).
 *
 * Flow: a visitor finishes the "What's On Fire?" quiz and enters their email to get the
 * matching field guide. We subscribe them to our Kit form (which sends Kit's double
 * opt-in confirmation email), tagging the fire type as a custom field so the list can be
 * segmented later, and, if a sender is configured, email them the guide link too. The
 * front end also reveals an instant on-page download, so delivery is immediate AND
 * arrives by email.
 *
 * Kit's public form endpoint takes only an email plus optional custom fields, and the form
 * id is public (it ships in the embed on the site), so there is no API key here and nothing
 * that requires a paid plan.
 *
 * Environment variables (set in Vercel, never committed):
 *   RESEND_API_KEY   — (optional) Resend API key to email the guide link. If unset, we skip
 *                      the email; Kit's opt-in email and the instant download still work.
 *   FIELD_GUIDE_FROM — (optional) From address for the guide email, e.g.
 *                      "Understory Collaborative <hello@understorycollab.com>"
 *   SITE_URL         — (optional) canonical site origin for absolute PDF links in the email;
 *                      falls back to the request's own host.
 *
 * Privacy: never logs the email address; returns a generic error without echoing input.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Kit form that newsletter and field-guide signups both feed. The id is public, so it is
// safe to hardcode and needs no key. To capture the fire type, add a "fire_type" custom
// field in Kit; if it is missing, Kit simply ignores the value and the signup still works.
const KIT_FORM_ENDPOINT = 'https://app.kit.com/forms/9782548/subscriptions'

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

async function subscribeToKit({ email, fireType }) {
  // Kit's own HTML form posts email_address form-encoded; custom fields ride along as
  // fields[<key>]. URLSearchParams keeps this a simple, dependency-free POST.
  const res = await fetch(KIT_FORM_ENDPOINT, {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: new URLSearchParams({ email_address: email, 'fields[fire_type]': fireType }),
  })
  if (!res.ok) {
    // Log status only — never the email address (no PII in logs).
    console.error('Kit subscribe failed:', res.status)
  }
  return res.ok
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
    const added = await subscribeToKit({ email, fireType })
    if (!added) {
      return res.status(502).json({ error: 'Could not process your request. Please try again.' })
    }
    await emailGuide({ email, guideName, pdfHref: `${siteOrigin(req)}${pdfPath}` })
    return res.status(200).json({ ok: true, pdf: pdfPath })
  } catch {
    // Do not leak internal detail or the email address.
    return res.status(502).json({ error: 'Could not process your request. Please try again.' })
  }
}
