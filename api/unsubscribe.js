/**
 * Vercel Node serverless function: newsletter unsubscribe.
 *
 * Environment variables (set in the Vercel project, never committed):
 *   GHOST_ADMIN_API_URL — base URL of the Ghost site, e.g. https://the-canopy.ghost.io
 *                         (no trailing /ghost/api path; we append it below).
 *   GHOST_ADMIN_API_KEY — the Ghost Admin API key in the form "{id}:{hexsecret}".
 *                         Create it in Ghost under Settings → Advanced → Integrations →
 *                         "Add custom integration"; copy the integration's Admin API Key.
 *                         The "{id}" becomes the JWT `kid` header and the "{hexsecret}"
 *                         is hex-decoded to raw bytes to sign the token (HS256).
 *
 * We sign the Admin API JWT with Node's built-in `crypto` — no npm dependencies.
 * Privacy: this endpoint always returns 200 { ok: true } whether or not the address
 * was a member (so membership can't be probed), and never logs the email address.
 */

import crypto from 'node:crypto'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Read Node runtime globals via globalThis so they stay lint-clean under the
// project's browser-globals ESLint config.
const { Buffer, process } = globalThis

function base64url(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

/**
 * Build a short-lived Ghost Admin API JWT signed with HS256.
 * adminKey format: "{id}:{hexsecret}".
 */
function createAdminToken(adminKey) {
  const [id, secret] = adminKey.split(':')
  if (!id || !secret) {
    throw new Error('Malformed GHOST_ADMIN_API_KEY')
  }

  const iat = Math.floor(Date.now() / 1000)
  const header = { alg: 'HS256', typ: 'JWT', kid: id }
  const payload = { iat, exp: iat + 300, aud: '/admin/' }

  const encodedHeader = base64url(JSON.stringify(header))
  const encodedPayload = base64url(JSON.stringify(payload))
  const signingInput = `${encodedHeader}.${encodedPayload}`

  // The secret is hex-encoded; decode to raw bytes before signing.
  const key = Buffer.from(secret, 'hex')
  const signature = crypto
    .createHmac('sha256', key)
    .update(signingInput)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')

  return `${signingInput}.${signature}`
}

async function readJsonBody(req) {
  // Vercel usually parses JSON into req.body, but fall back to the raw stream.
  if (req.body && typeof req.body === 'object') return req.body
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body)
    } catch {
      return null
    }
  }
  let raw = ''
  for await (const chunk of req) raw += chunk
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiUrl = process.env.GHOST_ADMIN_API_URL
  const apiKey = process.env.GHOST_ADMIN_API_KEY
  if (!apiUrl || !apiKey) {
    return res.status(500).json({ error: 'Unsubscribe endpoint not configured' })
  }

  const body = await readJsonBody(req)
  const email = typeof body?.email === 'string' ? body.email.trim() : ''
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'A valid email address is required' })
  }

  try {
    const token = createAdminToken(apiKey)
    const authHeaders = {
      Authorization: `Ghost ${token}`,
      'Accept-Version': 'v5.0',
    }
    const base = `${apiUrl.replace(/\/$/, '')}/ghost/api/admin`

    // 1. Find the member by email.
    const filter = encodeURIComponent(`email:'${email}'`)
    const findRes = await fetch(`${base}/members/?filter=${filter}`, {
      method: 'GET',
      headers: authHeaders,
    })

    if (findRes.ok) {
      const data = await findRes.json()
      const member = data?.members?.[0]

      // 2. If found, remove them from all newsletters.
      if (member?.id) {
        await fetch(`${base}/members/${member.id}/`, {
          method: 'PUT',
          headers: { ...authHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ members: [{ newsletters: [] }] }),
        })
      }
    } else {
      // Log status only — never the email address (no PII in logs).
      console.error('Ghost member lookup failed:', findRes.status)
    }
  } catch (error) {
    console.error('Unsubscribe error:', error?.message || 'unknown')
  }

  // Always 200 regardless of membership — don't leak whether the address existed.
  return res.status(200).json({ ok: true })
}
