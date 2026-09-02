/*
 * POST /api/contact — Understory Collaborative contact form handler (Vercel Node function).
 *
 * Delivery is a single transactional email to contact@understorycollab.com via Resend. A
 * person who writes in is NOT added to any marketing list: sending us a message is not a
 * newsletter opt-in, and list growth happens only through the double opt-in newsletter form.
 *
 * This replaced an earlier Kit integration, which was dropped entirely because it never
 * alerted us to new submissions. There is no list write here at all now.
 *
 * Environment variables (set in Vercel, never committed):
 *   RESEND_API_KEY    — required. Without it the form reports an error rather than silently
 *                       dropping a message.
 *   CONTACT_NOTIFY_FROM — required. From address on a Resend-verified domain, e.g.
 *                       "Understory Collaborative <contact@understorycollab.com>".
 *                       FIELD_GUIDE_FROM is accepted as a fallback so one from address covers
 *                       both the contact and field-guide emails.
 *
 * Privacy: this function never logs the submitter's name, email, or message. The email carries
 * them by design and is sent only to the UC contact mailbox.
 */

// Where new-message notifications land. Must be a monitored mailbox.
const CONTACT_NOTIFY_TO = 'contact@understorycollab.com'

const LIMITS = {
  name: 200,
  email: 320,
  business: 200,
  topic: 200,
  message: 5000,
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body
  if (typeof req.body === 'string' && req.body.length > 0) {
    try {
      return JSON.parse(req.body)
    } catch {
      return null
    }
  }
  return {}
}

function asString(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// Deliver the submission as an email to the UC contact mailbox. Returns a small result object
// so the handler can tell an unconfigured setup (503) from a delivery failure (502). Logs
// status only, never the submitter's data.
async function sendContactEmail({ name, email, business, topic, message }) {
  const key = process.env.RESEND_API_KEY
  const from = process.env.CONTACT_NOTIFY_FROM || process.env.FIELD_GUIDE_FROM
  if (!key || !from) {
    const missing = [!key && 'RESEND_API_KEY', !from && 'CONTACT_NOTIFY_FROM/FIELD_GUIDE_FROM']
      .filter(Boolean)
      .join(' and ')
    console.error(`Contact email not configured: ${missing} not set`)
    return { ok: false, configured: false }
  }

  // Strip line breaks from the subject to avoid header injection via the name field.
  const safeName = name.replace(/[\r\n]+/g, ' ').slice(0, LIMITS.name)
  const rows = [
    ['name', name],
    ['business', business || '(not given)'],
    ['email', email],
    ['topic', topic || '(not specified)'],
    ['message', message],
  ]

  const textBody = rows.map(([label, value]) => `${label}: ${value}`).join('\n\n')
  const htmlBody = rows
    .map(
      ([label, value]) =>
        `<p style="margin:0 0 12px"><strong>${escapeHtml(label)}:</strong><br>` +
        `<span style="white-space:pre-wrap">${escapeHtml(value)}</span></p>`,
    )
    .join('')

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [CONTACT_NOTIFY_TO],
        reply_to: email, // reply goes straight to the person who wrote in
        subject: `New contact form message from ${safeName}`,
        text: textBody,
        html: htmlBody,
      }),
    })
    if (!res.ok) console.error('Contact email failed with status', res.status)
    return { ok: res.ok, configured: true }
  } catch {
    console.error('Contact email request failed')
    return { ok: false, configured: true }
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  const body = readBody(req)
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ ok: false, error: 'Invalid request body' })
  }

  // Honeypot: a filled hidden field means a bot. Pretend success and drop it.
  if (asString(body.hp_referral)) {
    return res.status(200).json({ ok: true })
  }

  const name = asString(body.name)
  const email = asString(body.email)
  const business = asString(body.business)
  const topic = asString(body.topic)
  const message = asString(body.message)

  const errors = []
  if (!name) errors.push('name is required')
  else if (name.length > LIMITS.name) errors.push('name is too long')

  if (!email) errors.push('email is required')
  else if (email.length > LIMITS.email) errors.push('email is too long')
  else if (!EMAIL_RE.test(email)) errors.push('email is invalid')

  if (!message) errors.push('message is required')
  else if (message.length > LIMITS.message) errors.push('message is too long')

  if (business.length > LIMITS.business) errors.push('business is too long')
  if (topic.length > LIMITS.topic) errors.push('topic is too long')

  if (errors.length > 0) {
    return res.status(400).json({ ok: false, error: errors.join('; ') })
  }

  const result = await sendContactEmail({ name, email, business, topic, message })

  if (!result.configured) {
    return res.status(503).json({
      ok: false,
      error: 'Message delivery is temporarily unavailable. Please email contact@understorycollab.com directly.',
    })
  }
  if (!result.ok) {
    return res.status(502).json({ ok: false, error: 'Failed to deliver message' })
  }

  return res.status(200).json({ ok: true })
}
