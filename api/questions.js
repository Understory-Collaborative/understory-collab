/*
 * POST /api/questions — Understory Collaborative public Q&A handler (Vercel Node function).
 *
 * Someone asks a question about the work of a technical product manager. We may answer it
 * publicly on the blog or on socials. This function forwards the question to a Google Apps
 * Script Web App, which appends it to a private Google Sheet. No npm dependencies.
 *
 * This mirrors api/contact.js. Setup (once):
 *   1. Create a Google Sheet (header row: Timestamp | Question | Name | Email).
 *   2. In that Sheet: Extensions -> Apps Script, add a doPost that appends a row, e.g.:
 *
 *        function doPost(e) {
 *          var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
 *          var d = JSON.parse(e.postData.contents);
 *          sheet.appendRow([ new Date(), d.question || '', d.name || '', d.email || '' ]);
 *          return ContentService
 *            .createTextOutput(JSON.stringify({ ok: true }))
 *            .setMimeType(ContentService.MimeType.JSON);
 *        }
 *
 *      Deploy -> New deployment -> type "Web app" -> Execute as "Me",
 *      Who has access "Anyone". Copy the resulting /exec Web App URL.
 *   3. In Vercel (Project -> Settings -> Environment Variables) set:
 *        QUESTIONS_SHEET_WEBHOOK_URL = <the /exec Web App URL>
 *      Redeploy so the function picks it up.
 *
 * Privacy: this function never logs the question, name, or email.
 */

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

  const stuck = asString(body.stuck)
  const product = asString(body.product)
  const stage = asString(body.stage)
  const share = asString(body.share)
  const name = asString(body.name)
  const email = asString(body.email)

  const errors = []
  if (!stuck) errors.push('stuck is required')
  else if (stuck.length > LIMITS.stuck) errors.push('stuck is too long')

  if (product.length > LIMITS.product) errors.push('product is too long')

  if (!share) errors.push('share preference is required')

  if (name.length > LIMITS.name) errors.push('name is too long')

  if (!email) errors.push('email is required')
  else if (email.length > LIMITS.email) errors.push('email is too long')
  else if (!EMAIL_RE.test(email)) errors.push('email is invalid')

  if (errors.length > 0) {
    return res.status(400).json({ ok: false, error: errors.join('; ') })
  }

  // Read via globalThis so this Node-runtime env access stays lint-clean under
  // the project's browser-scoped ESLint config.
  const webhookUrl = globalThis.process?.env?.QUESTIONS_SHEET_WEBHOOK_URL
  if (!webhookUrl) {
    return res
      .status(500)
      .json({ ok: false, error: 'Questions endpoint not configured' })
  }

  try {
    const upstream = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stuck, product, stage, share, name, email }),
    })

    if (!upstream.ok) {
      console.error('Questions webhook responded with status', upstream.status)
      return res
        .status(502)
        .json({ ok: false, error: 'Failed to deliver question' })
    }

    return res.status(200).json({ ok: true })
  } catch {
    console.error('Questions webhook request failed')
    return res
      .status(502)
      .json({ ok: false, error: 'Failed to deliver question' })
  }
}
