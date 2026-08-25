/*
 * POST /api/questions — forwards a Q&A submission to webs's Google Form.
 *
 * The custom UI (src/pages/Questions.jsx) posts JSON here. This function maps the
 * fields to the Google Form's formResponse endpoint (form-urlencoded entry.<id>).
 * Submissions land in the form's Responses tab and its linked Sheet. No env var
 * and no Apps Script: the form id and field ids are public, they travel in the
 * form's own share/pre-filled URLs.
 *
 * If the form's questions change, update FORM_ID and ENTRY below. To re-derive the
 * entry ids: in the form, top-right menu -> "Get pre-filled link", fill every
 * field with a distinct value, and read the entry.<id> values out of the URL.
 *
 * The form's Product and Name questions must stay OPTIONAL (not required), because
 * the UI treats them as optional. Stuck, Share, and Email are required in both
 * places. The Share radio values must match the form's option text exactly; see
 * SHARE_OPTIONS in Questions.jsx.
 *
 * Never-miss email: before the Google Form post, every valid submission emails
 * contact@understorycollab.com via Resend, so webs sees the question even if the Google
 * Form post fails. Best-effort and independent of the form: a form failure never swallows
 * it, and a notification failure never blocks the form. It needs RESEND_API_KEY plus a from
 * address (CONTACT_NOTIFY_FROM, or FIELD_GUIDE_FROM as fallback); without them it is skipped
 * (and logs the skip) and the form post is unchanged.
 *
 * Privacy: this function never logs the submission contents. The notification email carries
 * them by design — it is sent only to the UC contact mailbox.
 */

const FORM_ID = '1FAIpQLSd5HTS0VYZR4NDR5iRnz1Ecg3gUeJ0-un-45Pfs8bLmbb9i6Q'
const FORM_RESPONSE_URL = `https://docs.google.com/forms/d/e/${FORM_ID}/formResponse`

// Where Q&A notifications land. The same monitored mailbox as the contact floor.
const NOTIFY_TO = 'contact@understorycollab.com'

const ENTRY = {
  stuck: 'entry.1540066254',
  product: 'entry.18696469',
  share: 'entry.1252682430',
  name: 'entry.896079231',
  email: 'entry.1885750161',
}

const LIMITS = {
  stuck: 3000,
  product: 500,
  name: 200,
  email: 320,
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

// Email webs about a new Q&A submission. Best-effort and self-contained: it catches its own
// errors and returns a boolean, so it never throws into (or is swallowed by) the form post.
// Returns false when unconfigured or on failure. Logs status only, never the submission.
async function notifyQuestion(fields) {
  const key = process.env.RESEND_API_KEY
  const from = process.env.CONTACT_NOTIFY_FROM || process.env.FIELD_GUIDE_FROM
  if (!key || !from) {
    // The point is not to miss a question, so a skip must be visible in logs, never silent.
    const missing = [!key && 'RESEND_API_KEY', !from && 'CONTACT_NOTIFY_FROM/FIELD_GUIDE_FROM']
      .filter(Boolean)
      .join(' and ')
    console.error(`Q&A notification skipped: ${missing} not set`)
    return false
  }

  // Strip line breaks from the subject to avoid header injection via the name field.
  const who = (fields.name || fields.email).replace(/[\r\n]+/g, ' ').slice(0, LIMITS.name)
  const rows = [
    ['question', fields.stuck],
    ['product', fields.product || '(not given)'],
    ['share preference', fields.share],
    ['name', fields.name || '(not given)'],
    ['email', fields.email],
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
    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [NOTIFY_TO],
        reply_to: fields.email, // reply goes straight to the person who asked
        subject: `New Q&A question from ${who}`,
        text: textBody,
        html: htmlBody,
      }),
    })
    if (!emailRes.ok) console.error('Q&A notification email failed with status', emailRes.status)
    return emailRes.ok
  } catch {
    console.error('Q&A notification email request failed')
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

  const fields = {
    stuck: asString(body.stuck),
    product: asString(body.product),
    share: asString(body.share),
    name: asString(body.name),
    email: asString(body.email),
  }

  const errors = []
  if (!fields.stuck) errors.push('stuck is required')
  else if (fields.stuck.length > LIMITS.stuck) errors.push('stuck is too long')

  if (fields.product.length > LIMITS.product) errors.push('product is too long')

  if (!fields.share) errors.push('share preference is required')

  if (fields.name.length > LIMITS.name) errors.push('name is too long')

  if (!fields.email) errors.push('email is required')
  else if (fields.email.length > LIMITS.email) errors.push('email is too long')
  else if (!EMAIL_RE.test(fields.email)) errors.push('email is invalid')

  if (errors.length > 0) {
    return res.status(400).json({ ok: false, error: errors.join('; ') })
  }

  // The floor: email webs first, independent of the Google Form. Awaited so it lands before any
  // form failure below can change the response, and best-effort so it never blocks delivery.
  await notifyQuestion(fields)

  // Map to the form's fields. Skip empty optional values.
  const params = new URLSearchParams()
  for (const [key, entryId] of Object.entries(ENTRY)) {
    if (fields[key]) params.set(entryId, fields[key])
  }

  try {
    const upstream = await fetch(FORM_RESPONSE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    })

    if (!upstream.ok) {
      console.error('Google Form responded with status', upstream.status)
      return res
        .status(502)
        .json({
          ok: false,
          error: 'Failed to deliver question',
          upstreamStatus: upstream.status,
        })
    }

    return res.status(200).json({ ok: true })
  } catch {
    console.error('Google Form request failed')
    return res
      .status(502)
      .json({ ok: false, error: 'Failed to deliver question' })
  }
}
