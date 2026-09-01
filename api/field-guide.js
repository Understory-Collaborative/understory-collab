/**
 * POST /api/field-guide — deliver the assessment field guide (Vercel Node function).
 *
 * A visitor finishes the "What's On Fire?" assessment and enters their email to get the
 * matching field guide. Delivery is two ways, both of which only fulfil what they asked for:
 * the results screen reveals an instant download, and (if Resend is configured) we email the
 * link too.
 *
 * We do NOT add them to any marketing list. Getting a guide is not a newsletter opt-in, so the
 * only list-growth path on the site is the double opt-in newsletter form. This is why the guide
 * no longer depends on MailerLite at all: a list outage can never block the guide.
 *
 * Environment variables (set in Vercel, never committed):
 *   RESEND_API_KEY   — (optional) email the guide link. If unset, the instant download still works.
 *   FIELD_GUIDE_FROM — (optional) From address for the guide email on a Resend-verified domain,
 *                      e.g. "Understory Collaborative <contact@understorycollab.com>".
 *   SITE_URL         — (optional) canonical site origin for the absolute PDF link in the email;
 *                      falls back to the request's own host.
 *
 * Privacy: never logs the email address; returns a generic error without echoing input.
 */

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
        `<p>Read it, mark it up with what rang true and the one question you still have, ` +
        `and bring that to office hours.</p>`,
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

  // Email the link as a best-effort copy; the instant on-page download is the front end's job.
  // No list write happens here, so nothing to fail: a valid request always succeeds.
  await emailGuide({ email, guideName, pdfHref: `${siteOrigin(req)}${pdfPath}` })
  return res.status(200).json({ ok: true, pdf: pdfPath })
}
