# Decisions log

Internal record of website and tooling decisions, so we don't re-litigate them
and so we remember why we chose what we chose. Newest first.

Business decisions live in the Decisions doc in the shared Understory Drive folder,
under Business:
https://docs.google.com/document/d/1WB7g8fUZUk5Gz6WBP0nL6rA9EuLYFmR2YvKBlCUtYgs/edit
How the site routes messages and signups today is in the "Where messages and signups
go" doc, under Business / Marketing. The older messaging system plan is archived.

---

## 2026-10-11 Vercel Web Analytics added

We added Vercel Web Analytics on 2026-10-11 so the team can see visits by referrer, such as LinkedIn and TikTok, and whether social posts bring people to the site. It is cookieless and collects no personal data, so the site needs no cookie banner. It starts collecting only after someone turns it on in the Analytics tab of the Vercel project.

## 2026-10-11, understorycollab.com/tiktok sends TikTok viewers to Understory

We added understorycollab.com/tiktok so Understory's product-design TikToks send viewers
straight to Understory, with visits tagged utm_source=tiktok. The address is a temporary
redirect in `vercel.json` to `/start?utm_source=tiktok&utm_medium=social`, and `/start` is a
noindex landing page with three links: free office hours, the latest article, and the
questions page. Which videos say this address is a business decision, logged in the Drive
Decisions doc.

---

## 2026-08-23 — ESP chosen: MailerLite (capture now, nurture built later)

**MailerLite is the ESP.** The decision moved through two candidates in one sitting: EcoSend was
picked first on values (a B Corp, carbon-neutral), then the frame changed. webs decided the
nurture **automation will be built in-house later**, not bought. That removed automation as an
ESP requirement and turned the choice into a price question for a capture-and-broadcast list.

Re-run price-first (all figures sourced from vendor/review pages, 2026):

- **MailerLite** — free to 250 subscribers (branded), then **$10/mo** removes the logo with no
  send caps. Cheapest clean paid tier. **Chosen.**
- Brevo — potentially $0 forever (unlimited contacts, 300 sends/day) but stamps its logo on
  free; runner-up on absolute price.
- beehiiv — free to 2,500 subscribers, unlimited sends, but a $43/mo cliff after and a logo.
- EcoSend — the values pick, but ~£15/mo and no free-forever edge over Brevo/beehiiv.

MailerLite won on clean-and-cheap with automation off the table. EcoSend's values edge did not
outweigh the cost once nurture was going to be built in-house anyway.

**What is built:** capture only. `api/subscribe.js` + `api/field-guide.js` upsert subscribers via
MailerLite's API (`POST connect.mailerlite.com/api/subscribers`, Bearer token). Source is
captured with MailerLite **groups** (their tag equivalent), assigned via optional env group ids
(`MAILERLITE_GROUP_NEWSLETTER`, `MAILERLITE_GROUP_ASSESSMENT`) so capture works before the groups
exist. Fire-type granularity is deferred to the nurture build.

**Nurture automation: deferred, to be built in-house.** Likely on Resend (already owned) plus a
data store, when there is a list worth nurturing. Not in MailerLite.

---

## 2026-08-23 — Buttondown free is too limited; HubSpot is out for nurture

**Buttondown's free plan cannot run the nurture.** Live check of the plan table: tags need
Basic ($9/mo), and **automations (the nurture sequence) need Standard ($29/mo)**. Free gives
capture, manual newsletter sends (broadcasts), and unsubscribe only. Metadata and analytics are
also paid. So Buttondown free covers capture but not the automated nurture that is the point of
this phase. The signup code stays plan-resilient: it subscribes without tags when the plan
disallows them, so capture works on free and tagging resumes if the account is ever upgraded.

**HubSpot is out as the nurture home.** webs's HubSpot plan has no automations (workflows are a
Marketing Hub Professional feature she does not have), she finds it hard to use, and it is still
being let lapse in April. Wiring nurture into a departing tool is throwaway work and repeats the
Ghost lesson (do not build on something set to vanish). Not reversing the lapse.

**Still open:** the nurture engine. The remaining fit for the cost goal is an ESP whose free
tier includes automations and that we keep long term. Candidate to verify: MailerLite. Values
gut-check required before committing, per the Substack precedent.

---

## 2026-08-21 — Newsletter signup moved server-side for Buttondown

**Buttondown authenticates every write with a secret token.** The old Kit newsletter signup
posted straight from the browser to a public form endpoint with no secret. Buttondown cannot
work that way without exposing the token, so the newsletter signup moved to a server route
(`api/subscribe.js`); the field-guide route already ran server-side. The token lives only in
Vercel env (`BUTTONDOWN_API_KEY`), never in the client bundle.

**Tags carry the source:** `newsletter` for the footer/subscribe form, and `assessment` plus
`assessment:<fire-type>` for the assessment guide, so a sequence can target the whole cohort or
one fire. This is the tagging the plan asked for.

**Kit is not fully retired yet.** The contact form still posts to Kit until the Tide phases move
it, so the Kit account stays live for contact only. Newsletter and field-guide no longer touch
Kit.

---

## 2026-08-20 — ESP, and the lead data model

**ESP: Buttondown, chosen.** Markdown-first, indie, cheap, clean API, pro-privacy
stance. It handles only the send + nurture + unsubscribe; the blog stays owned in
the website repo. Confirm current pricing and values live before wiring (sandbox
egress is blocked, so we could not verify from here).

**Leads are many-to-many with businesses.** A `contacts` (lead) record links to zero
or more businesses (`teams`) through a join table. This replaces the earlier "add a
teamId column to contacts" idea. Lead vs prospect is stored in `contacts.role`, and the
deal is an `engagement` whose `status` runs lead to committed to active to done. The
definitions of lead and prospect, and why a lead can belong to more than one business,
are in the Drive Decisions doc.

---

## 2026-08-20 — Ghost is out; pipeline lives in Tide

**Ghost: ruled out.** webs went to log in and the URL was gone. No notification, no
warning, no export, just vanished. Likely a self-hosted instance or a lapsed
plan/domain, but the cause matters less than the lesson: **do not put the blog
anywhere it can silently disappear.** She also does not want the added cost.

**Pipeline: in Tide, which webs is building herself.** Tide is webs's own software
to manage all her businesses, and it holds the pipeline stages (lead to won). So we
are NOT adding HubSpot for pipeline, and HubSpot can lapse in April. Because Tide is
her own product, the website can post a new prospect straight into Tide's API, fully
owned, no third-party connector. "Not accessible to the whole team right now" is a
build-status detail on Tide (multi-user access not shipped yet), not a reason to
move off it. Open: see Tide's data model / write API to design the intake integration.

Substack was ruled out the same day on values grounds, which added three filters to
every tool choice: the vendor's values, low or no added cost, and data ownership. Those
are in the Drive Decisions doc.

---

## 2026-08-20 — Leaving Kit (ConvertKit) for contact + nurture

**Status:** decided to leave. System of record still being chosen (see open question below).

**Why we tried it:** it was set up to capture newsletter and field-guide signups,
and to be a single place to manage an audience.

**Why we're leaving it:**

- Hard to work with day to day.
- Data is hard to follow. A contact submission lands as a "subscriber" with the
  message buried in a custom field, not anywhere you'd naturally read it.
- Could not do something as basic as email webs when a new person subscribes.
- The public form endpoint silently **quarantines** server-side submissions
  (returns 200 but never creates a subscriber), so messages were being lost. We
  worked around it with the authenticated v4 API, but the fact it needed a
  workaround at all is telling.

**If we ever reconsider:** the v4 API works and is not spam-guarded. The block was
usability and the missing new-subscriber notification, not raw capability.

**What we still need (the reason this is a real project, not a form fix):**

- A way for **UC and SWL** to be contacted about prospective work.
- A way to **nurture** people who take the assessment or subscribe to a
  blog/newsletter.
- **Compliant marketing email**: recipients can opt out / unsubscribe, handled by
  the platform, not by hand.
- **Writer-first, low ops:** webs writes content; the tool sends the nurture
  sequence and handles unsubscribes. She should not have to think about either.
- Replace the **blog** capability lost when Ghost fell through.
- Two brands (UC and SWL) kept cleanly separate.

**Open question:** which platform(s) back this. Contact notifications go to
contact@understorycollab.com (decided 2026-08-20). Nurture/blog engine TBD.

**Not chosen and why:**

- **Email-only** was floated as a reliable floor, but webs explicitly does not
  want to optimize for the local minimum. The nurture + unsubscribe + blog needs
  are real, so the system has to cover them, not just deliver a notification.
