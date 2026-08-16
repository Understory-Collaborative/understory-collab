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
 * The form's Stage, Product, and Name questions must stay OPTIONAL (not required),
 * because the UI treats them as optional. Stuck, Share, and Email are required in
 * both places. Radio values (stage, share) must match the form's option text
 * exactly; see the matching lists in Questions.jsx.
 *
 * Privacy: this function never logs the submission contents.
 */

const FORM_ID = '1FAIpQLSd5HTS0VYZR4NDR5iRnz1Ecg3gUeJ0-un-45Pfs8bLmbb9i6Q'
const FORM_RESPONSE_URL = `https://docs.google.com/forms/d/e/${FORM_ID}/formResponse`

const ENTRY = {
  stuck: 'entry.1540066254',
  product: 'entry.18696469',
  stage: 'entry.1644200461',
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
  if (asString(body.company_website)) {
    return res.status(200).json({ ok: true })
  }

  const fields = {
    stuck: asString(body.stuck),
    product: asString(body.product),
    stage: asString(body.stage),
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
