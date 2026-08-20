/*
 * POST /api/contact — Understory Collaborative contact form handler (Vercel Node function).
 *
 * Delivers submissions to Kit (formerly ConvertKit), the same service the newsletter and
 * field-guide signups use. NO npm dependencies, NO Vercel env var, NO Google Sheet: it
 * subscribes the sender to the public Kit form and rides the name, business, and message
 * along as Kit custom fields.
 *
 * Kit setup (one-time, in the Kit account):
 *   - The form id below is public (it ships in the site's newsletter embed), so there is no
 *     key here and nothing that needs a paid plan.
 *   - To STORE the extra fields, add custom fields named `name`, `business`, and `message`
 *     in Kit (Grow → Subscribers → custom fields, or Settings). If a field is missing, Kit
 *     ignores that value and the signup still succeeds — the email is always captured.
 *   - Contact submitters land on the same Kit list as newsletter signups. If you want them
 *     kept separate, point CONTACT_KIT_FORM at a dedicated Kit form id instead.
 *
 * Privacy: this function never logs the submitter's name, email, or message.
 */

// Public Kit form id for the dedicated "Website contact" form (separate from the newsletter
// form 9782548, so contacts don't land on the newsletter list and a Kit automation can
// notify on this form alone). Its custom fields are name / business / message.
const CONTACT_KIT_FORM = '9821838'
const KIT_FORM_ENDPOINT = `https://app.kit.com/forms/${CONTACT_KIT_FORM}/subscriptions`

const LIMITS = {
  name: 200,
  email: 320,
  business: 200,
  message: 5000,
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function readBody(req) {
  // Vercel usually parses JSON into req.body; fall back to manual parsing.
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

  try {
    // Kit's own HTML form posts email_address form-encoded; custom fields ride along as
    // fields[<key>]. URLSearchParams keeps this a simple, dependency-free POST. Missing
    // custom fields are ignored by Kit, so the email is captured either way.
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

    if (!upstream.ok) {
      // Log status only — never the submission contents (no PII in logs).
      console.error('Contact Kit subscribe responded with status', upstream.status)
      return res
        .status(502)
        .json({ ok: false, error: 'Failed to deliver message' })
    }

    return res.status(200).json({ ok: true })
  } catch {
    // Do not log the error object — it can echo the request payload / PII.
    console.error('Contact Kit request failed')
    return res
      .status(502)
      .json({ ok: false, error: 'Failed to deliver message' })
  }
}
