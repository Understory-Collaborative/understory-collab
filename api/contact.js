/*
 * POST /api/contact — Understory Collaborative contact form handler (Vercel Node function).
 *
 * Delivers submissions to a Google Sheet with NO npm dependencies, by POSTing JSON
 * to a Google Apps Script Web App. Three-step setup:
 *
 *   1. Create a Google Sheet (e.g. header row: Timestamp | Name | Business | Email | Message).
 *
 *   2. In that Sheet: Extensions → Apps Script, and add a doPost that appends a row, e.g.:
 *
 *        function doPost(e) {
 *          var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
 *          var data = JSON.parse(e.postData.contents);
 *          sheet.appendRow([
 *            new Date(),
 *            data.name || '',
 *            data.business || '',
 *            data.email || '',
 *            data.message || ''
 *          ]);
 *          return ContentService
 *            .createTextOutput(JSON.stringify({ ok: true }))
 *            .setMimeType(ContentService.MimeType.JSON);
 *        }
 *
 *      Deploy → New deployment → type "Web app" → Execute as "Me",
 *      Who has access "Anyone". Copy the resulting /exec Web App URL.
 *
 *   3. In Vercel (Project → Settings → Environment Variables) set:
 *        CONTACT_SHEET_WEBHOOK_URL = <the /exec Web App URL>
 *      Redeploy so the function picks it up.
 *
 * Privacy: this function never logs the submitter's name, email, or message.
 */

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
  if (asString(body.company_website)) {
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

  // Read via globalThis so this Node-runtime env access stays lint-clean under
  // the project's browser-scoped ESLint config.
  const webhookUrl = globalThis.process?.env?.CONTACT_SHEET_WEBHOOK_URL
  if (!webhookUrl) {
    // Do not leak config details to the client beyond a clear message.
    return res
      .status(500)
      .json({ ok: false, error: 'Contact endpoint not configured' })
  }

  try {
    const upstream = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, business, email, message }),
    })

    if (!upstream.ok) {
      // Log status only — never the submission contents (no PII in logs).
      console.error('Contact webhook responded with status', upstream.status)
      return res
        .status(502)
        .json({ ok: false, error: 'Failed to deliver message' })
    }

    return res.status(200).json({ ok: true })
  } catch {
    // Do not log the error object — it can echo the request payload / PII.
    console.error('Contact webhook request failed')
    return res
      .status(502)
      .json({ ok: false, error: 'Failed to deliver message' })
  }
}
