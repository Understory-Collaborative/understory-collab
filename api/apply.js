/*
 * POST /api/apply — Understory Collaborative short-application handler (Vercel Node function).
 *
 * A leader picks a door, tells us what is stuck, and applies. This function forwards the
 * application to a Google Apps Script Web App, which emails it to a shared inbox so webs (and
 * anyone else on that inbox) can read it and reply to the good fits. No CRM, no sheet to
 * remember to check, and NO third-party email service (no Resend, no Mailgun): Apps Script
 * sends the mail from your own Google account.
 *
 * This mirrors the contact form (api/contact.js), which already posts to an Apps Script Web
 * App with zero npm dependencies.
 *
 * Setup (once):
 *   1. Go to script.google.com → New project (or Extensions → Apps Script from any Sheet).
 *   2. Paste a doPost that emails the shared inbox, e.g.:
 *
 *        function doPost(e) {
 *          var d = JSON.parse(e.postData.contents);
 *          var to = 'hello@understorycollab.com';            // your shared inbox
 *          var subject = 'Application — ' + d.door + ' — ' + d.name;
 *          var body =
 *            'Door: ' + d.door + '\n' +
 *            'Name: ' + d.name + '\n' +
 *            'Email: ' + d.email + '\n' +
 *            'Company: ' + (d.company || '—') + '\n' +
 *            'Timeline: ' + (d.timeline || '—') + '\n\n' +
 *            'What is stuck:\n' + d.situation;
 *          MailApp.sendEmail({ to: to, replyTo: d.email, subject: subject, body: body });
 *          return ContentService
 *            .createTextOutput(JSON.stringify({ ok: true }))
 *            .setMimeType(ContentService.MimeType.JSON);
 *        }
 *
 *      Deploy → New deployment → type "Web app" → Execute as "Me",
 *      Who has access "Anyone". Copy the resulting /exec Web App URL.
 *   3. In Vercel (Project → Settings → Environment Variables) set:
 *        APPLICATION_WEBHOOK_URL = <the /exec Web App URL>
 *      Redeploy so the function picks it up.
 *
 * Privacy: never logs the applicant's name, email, or answers; returns a generic error.
 */

const LIMITS = {
  name: 200,
  email: 320,
  company: 200,
  situation: 5000,
  timeline: 200,
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// The valid doors, slug → readable name. Keeps a bad or spoofed value out of the email
// and gives the notification a friendly door name.
const DOORS = {
  'product-design': 'Product design',
  development: 'Development',
  'technology-acceleration': 'Technology acceleration',
}

const { process } = globalThis

function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body
  if (typeof req.body === 'string' && req.body.length > 0) {
    try { return JSON.parse(req.body) } catch { return null }
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

  const doorSlug = asString(body.door)
  const name = asString(body.name)
  const email = asString(body.email)
  const company = asString(body.company)
  const situation = asString(body.situation)
  const timeline = asString(body.timeline)

  const errors = []
  if (!Object.prototype.hasOwnProperty.call(DOORS, doorSlug)) errors.push('a valid door is required')
  if (!name) errors.push('name is required')
  else if (name.length > LIMITS.name) errors.push('name is too long')
  if (!email) errors.push('email is required')
  else if (email.length > LIMITS.email) errors.push('email is too long')
  else if (!EMAIL_RE.test(email)) errors.push('email is invalid')
  if (!situation) errors.push('situation is required')
  else if (situation.length > LIMITS.situation) errors.push('situation is too long')
  if (company.length > LIMITS.company) errors.push('company is too long')
  if (timeline.length > LIMITS.timeline) errors.push('timeline is too long')

  if (errors.length > 0) {
    return res.status(400).json({ ok: false, error: errors.join('; ') })
  }

  const webhookUrl = process.env?.APPLICATION_WEBHOOK_URL
  if (!webhookUrl) {
    return res.status(500).json({ ok: false, error: 'Application endpoint not configured' })
  }

  try {
    const upstream = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        door: DOORS[doorSlug], // send the readable name, not the slug
        name,
        email,
        company,
        situation,
        timeline,
      }),
    })
    if (!upstream.ok) {
      // Log status only — never the submission contents (no PII in logs).
      console.error('Application webhook responded with status', upstream.status)
      return res.status(502).json({ ok: false, error: 'Could not send your application. Please try again.' })
    }
    return res.status(200).json({ ok: true })
  } catch {
    console.error('Application webhook request failed')
    return res.status(502).json({ ok: false, error: 'Could not send your application. Please try again.' })
  }
}
