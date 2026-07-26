/**
 * Vercel Node serverless function: field-guide email capture (Ghost, no HubSpot).
 *
 * Flow: a visitor finishes the "What's On Fire?" quiz and enters their email to get the
 * matching field guide. We add them to Ghost as a member (which sends Ghost's double
 * opt-in confirmation email) and, if a sender is configured, email them the guide link
 * too. The front end also reveals an instant on-page download, so delivery is immediate
 * AND arrives by email.
 *
 * Environment variables (set in Vercel, never committed):
 *   GHOST_ADMIN_API_URL — base URL of the Ghost site (e.g. https://the-canopy.ghost.io)
 *   GHOST_ADMIN_API_KEY — Ghost Admin API key "{id}:{hexsecret}" (custom integration)
 *   RESEND_API_KEY      — (optional) Resend API key to email the guide link. If unset,
 *                         we skip the email; Ghost's opt-in email and the instant
 *                         on-page download still work.
 *   FIELD_GUIDE_FROM    — (optional) From address for the guide email, e.g.
 *                         "Understory Collaborative <hello@understorycollab.com>"
 *   SITE_URL            — (optional) canonical site origin for absolute PDF links in the
 *                         email; falls back to the request's own host.
 *
 * Privacy: never logs the email address; returns a generic error without echoing input.
 */

import crypto from 'node:crypto'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// The four fire types are the only valid guides; this allowlist also prevents any
// path trickery from reaching the /field-guides/<slug>.pdf link.
const GUIDES = {
  'brush-fire': 'Before Fire Season',
  smolder: 'Smoke Signals',
  'crown-fire': 'When the Canopy Burns',
  firestorm: 'After the Firestorm',
}

const { Buffer, process } = globalThis

function base64url(input) {
  return Buffer.from(input).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

function createAdminToken(adminKey) {
  const [id, secret] = adminKey.split(':')
  if (!id || !secret) throw new Error('Malformed GHOST_ADMIN_API_KEY')
  const iat = Math.floor(Date.now() / 1000)
  const header = { alg: 'HS256', typ: 'JWT', kid: id }
  const payload = { iat, exp: iat + 300, aud: '/admin/' }
  const signingInput = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(payload))}`
  const signature = crypto
    .createHmac('sha256', Buffer.from(secret, 'hex'))
    .update(signingInput)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
  return `${signingInput}.${signature}`
}

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

async function addGhostMember({ apiUrl, apiKey, email, guideName, fireType }) {
  const token = createAdminToken(apiKey)
  const base = `${apiUrl.replace(/\/$/, '')}/ghost/api/admin`
  // send_email + email_type=signup triggers Ghost's double opt-in confirmation email.
  const res = await fetch(`${base}/members/?send_email=true&email_type=signup`, {
    method: 'POST',
    headers: {
      Authorization: `Ghost ${token}`,
      'Accept-Version': 'v5.0',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      members: [
        {
          email,
          labels: [
            { name: 'Field Guide', slug: 'field-guide' },
            { name: `Field Guide: ${guideName}`, slug: `field-guide-${fireType}` },
          ],
          note: `Requested field guide: ${guideName}`,
        },
      ],
    }),
  })
  // 201 created, or 422 "member already exists" — both are fine for our purposes.
  if (res.ok) return true
  if (res.status === 422) return true
  return false
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

  const apiUrl = process.env.GHOST_ADMIN_API_URL
  const apiKey = process.env.GHOST_ADMIN_API_KEY
  if (!apiUrl || !apiKey) {
    return res.status(500).json({ error: 'Field guide endpoint not configured' })
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
    const added = await addGhostMember({ apiUrl, apiKey, email, guideName, fireType })
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
