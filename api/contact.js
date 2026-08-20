/*
 * POST /api/contact — Understory Collaborative contact form handler (Vercel Node function).
 *
 * Delivers submissions to Kit (formerly ConvertKit). It prefers Kit's authenticated v4 API,
 * because the anonymous public-form endpoint is subject to Kit's spam "guard", which
 * QUARANTINES server-side POSTs (returns 200 but never creates a real subscriber). The v4
 * API is authenticated, so it is not guarded.
 *
 * Setup (one-time):
 *   - Create a Kit v4 API key: Kit account → Settings → Developer (or Advanced) → API keys.
 *   - Add it to Vercel as an environment variable named KIT_API_KEY (KIT_API also works),
 *     then redeploy.
 *   - In Kit, custom fields `business` and `message` should exist so those values are stored
 *     (name maps to the standard first_name field). The email is captured either way.
 *   - New contacts are added to the "Website contact" form 9821838, so the form's
 *     new-subscriber notification fires.
 *
 * Without the key set, it falls back to the old public-form endpoint (which Kit may
 * quarantine — that is the bug this file works around).
 *
 * Never-miss email (the floor): before the Kit call, every valid submission emails
 * contact@understorycollab.com via Resend, so webs is notified even if Kit (or any later
 * pipeline step) fails. The notification is best-effort and independent of Kit: a Kit
 * failure never swallows it, and a notification failure never blocks the Kit delivery.
 * It needs RESEND_API_KEY plus a from address (CONTACT_NOTIFY_FROM, or FIELD_GUIDE_FROM as
 * a fallback); without them the notification is skipped and Kit delivery is unchanged.
 * The mailbox at CONTACT_NOTIFY_TO must be real and monitored for this to be the floor.
 *
 * Privacy: this function never logs the submitter's name, email, or message. The
 * notification email carries them by design — it is sent only to the UC contact mailbox.
 */

const CONTACT_KIT_FORM = '9821838'
const KIT_FORM_ENDPOINT = `https://app.kit.com/forms/${CONTACT_KIT_FORM}/subscriptions`
const KIT_API_BASE = 'https://api.kit.com/v4'

// Where new-message notifications land. Must be a monitored mailbox for the floor to hold.
const CONTACT_NOTIFY_TO = 'contact@understorycollab.com'

const LIMITS = {
  name: 200,
  email: 320,
  business: 200,
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

// Email webs about a new submission. Best-effort and self-contained: it catches its own
// errors and returns a boolean, so it never throws into (or is swallowed by) the Kit path.
// Returns false when unconfigured or on failure. Logs status only, never the submitter's data.
async function notifyContact({ name, email, business, message }) {
  const key = process.env.RESEND_API_KEY
  const from = process.env.CONTACT_NOTIFY_FROM || process.env.FIELD_GUIDE_FROM
  if (!key || !from) return false // notification not configured; Kit delivery still runs

  // Strip line breaks from the subject to avoid header injection via the name field.
  const safeName = name.replace(/[\r\n]+/g, ' ').slice(0, LIMITS.name)
  const rows = [
    ['name', name],
    ['business', business || '(not given)'],
    ['email', email],
    // The "About: <topic>" line, when present, rides at the top of the message already.
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
    if (!res.ok) console.error('Contact notification email failed with status', res.status)
    return res.ok
  } catch {
    console.error('Contact notification email request failed')
    return false
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

  if (errors.length > 0) {
    return res.status(400).json({ ok: false, error: errors.join('; ') })
  }

  // The floor: notify webs first, independent of Kit. Awaited so it lands before any Kit
  // failure below can change the response, and best-effort so it never blocks delivery.
  await notifyContact({ name, email, business, message })

  const apiKey = process.env.KIT_API_KEY || process.env.KIT_API

  try {
    let ok = false

    if (apiKey) {
      // v4 API: authenticated, so not subject to the form spam guard/quarantine.
      const fields = { message }
      if (business) fields.business = business

      const subRes = await fetch(`${KIT_API_BASE}/subscribers`, {
        method: 'POST',
        headers: { 'X-Kit-Api-Key': apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email_address: email, first_name: name, fields }),
      })
      ok = subRes.ok

      if (ok) {
        // Land them on the contact form so its notification fires. Best-effort.
        await fetch(`${KIT_API_BASE}/forms/${CONTACT_KIT_FORM}/subscribers`, {
          method: 'POST',
          headers: { 'X-Kit-Api-Key': apiKey, 'Content-Type': 'application/json' },
          body: JSON.stringify({ email_address: email }),
        }).catch(() => {})
      } else {
        console.error('Contact Kit v4 responded with status', subRes.status)
      }
    } else {
      // Fallback: the public form endpoint (Kit may quarantine this — set KIT_API_KEY).
      const params = new URLSearchParams({
        email_address: email,
        'fields[name]': name,
        'fields[message]': message,
      })
      if (business) params.set('fields[business]', business)

      const upstream = await fetch(KIT_FORM_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: params,
      })
      ok = upstream.ok
      if (!ok) console.error('Contact Kit form responded with status', upstream.status)
    }

    if (!ok) {
      return res.status(502).json({ ok: false, error: 'Failed to deliver message' })
    }

    return res.status(200).json({ ok: true })
  } catch {
    console.error('Contact Kit request failed')
    return res.status(502).json({ ok: false, error: 'Failed to deliver message' })
  }
}
