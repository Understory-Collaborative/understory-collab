// Honest submit-failure copy for the site's forms.
//
// The rule: a broken backend (a 5xx from our own function) is not fixed by retrying, so we tell
// the person to email us instead of telling them to "try again." Only a genuine client-side or
// network problem is worth a retry.
//
// status: the HTTP status of the failed response, or undefined for a network/unknown failure.
// action: what we will do by hand if they email us, e.g. "add you to the list".

const CONTACT_EMAIL = 'contact@understorycollab.com'

export function submitErrorMessage(status, action) {
  if (typeof status === 'number' && status >= 400 && status < 500) {
    return 'Please check what you entered and try again.'
  }
  if (typeof status === 'number' && status >= 500) {
    return `Something on our end is broken, and trying again won't fix it. Email ${CONTACT_EMAIL} and we'll ${action} by hand.`
  }
  // No status means the request never got a reply (offline, dropped connection), which can be
  // transient, so a retry is fair, with email as the fallback.
  return `We couldn't reach the server. Check your connection, and if it keeps happening, email ${CONTACT_EMAIL}.`
}
