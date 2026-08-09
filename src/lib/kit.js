// Kit (formerly ConvertKit) newsletter subscription.
//
// Posts to the public form endpoint that the Kit embed itself uses. The form id
// is public, it ships in any embed rendered on the page, so there is no secret
// here and nothing that requires a paid plan. The field name and endpoint match
// Kit's own HTML embed exactly.
//
// The form is set to double opt-in, so a successful response means Kit has sent
// the confirmation email, not that the address is confirmed yet. That is why the
// success copy asks the subscriber to check their inbox.

const KIT_FORM_ENDPOINT = 'https://app.kit.com/forms/9782548/subscriptions'

async function describeError(res) {
  try {
    const data = await res.clone().json()
    const message = data?.message || data?.error || data?.errors?.[0]
    if (message) return typeof message === 'string' ? message : JSON.stringify(message)
  } catch {
    // not JSON, fall through
  }
  return `${res.status} ${res.statusText}`
}

export async function subscribe(email) {
  const res = await fetch(KIT_FORM_ENDPOINT, {
    method: 'POST',
    headers: { Accept: 'application/json' },
    // URLSearchParams keeps this a simple cross-origin POST (no preflight) and
    // mirrors Kit's native form, which submits email_address form-encoded.
    body: new URLSearchParams({ email_address: email }),
  })
  if (!res.ok) {
    const detail = await describeError(res)
    console.error('Kit subscribe failed:', res.status, detail)
    throw new Error(detail || `Subscribe failed: ${res.status}`)
  }
  return true
}
