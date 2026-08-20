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
 *   - Add it to Vercel as an environment variable named KIT_API_KEY, then redeploy.
 *   - In Kit, custom fields `business` and `message` should exist so those values are stored
 *     (name maps to the standard first_name field). The email is captured either way.
 *   - New contacts are added to the "Website contact" form 9821838, so the form's
 *     new-subscriber notification fires.
 *
 * Without KIT_API_KEY set, it falls back to the old public-form endpoint (which Kit may
 * quarantine — that is the bug this file works around).
 *
 * Privacy: this function never logs the submitter's name, email, or message.
 */

const CONTACT_KIT_FORM = '9821838'
const KIT_FORM_ENDPOINT = `https://app.kit.com/forms/${CONTACT_KIT_FORM}/subscriptions`
const KIT_API_BASE = 'https://api.kit.com/v4'

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

async function snippet(response) {
  try {
    return (await response.text()).slice(0, 200)
  } catch {
    return ''
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
    return res.status(200).json({ ok: true, via: 'honeypot' })
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

  const apiKey = process.env.KIT_API_KEY

  try {
    let kitStatus = 0
    let kitSnippet = ''
    let ok = false
    let via = ''

    if (apiKey) {
      // v4 API: authenticated, so not subject to the form spam guard/quarantine.
      via = 'kit-v4'
      const fields = { message }
      if (business) fields.business = business

      const subRes = await fetch(`${KIT_API_BASE}/subscribers`, {
        method: 'POST',
        headers: { 'X-Kit-Api-Key': apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email_address: email, first_name: name, fields }),
      })
      kitStatus = subRes.status
      kitSnippet = await snippet(subRes)
      ok = subRes.ok

      if (ok) {
        // Land them on the contact form so its notification fires. Best-effort.
        await fetch(`${KIT_API_BASE}/forms/${CONTACT_KIT_FORM}/subscribers`, {
          method: 'POST',
          headers: { 'X-Kit-Api-Key': apiKey, 'Content-Type': 'application/json' },
          body: JSON.stringify({ email_address: email }),
        }).catch(() => {})
      }
    } else {
      // Fallback: the public form endpoint (Kit may quarantine this — set KIT_API_KEY).
      via = 'kit-form'
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
      kitStatus = upstream.status
      kitSnippet = await snippet(upstream)
      ok = upstream.ok
    }

    if (!ok) {
      console.error('Contact Kit responded with status', kitStatus)
      return res
        .status(502)
        .json({ ok: false, error: 'Failed to deliver message', via, kitStatus, kitSnippet })
    }

    return res.status(200).json({ ok: true, via, kitStatus, kitSnippet })
  } catch {
    console.error('Contact Kit request failed')
    return res.status(502).json({ ok: false, error: 'Failed to deliver message', via: 'exception' })
  }
}
