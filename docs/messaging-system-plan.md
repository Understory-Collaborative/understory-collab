# Messaging + audience system — master plan

**What this is:** the plan for how UC and SWL capture the people who contact them,
nurture the people who take the assessment or subscribe, and never miss a message.
It spans three repos. This doc is the memory. Read it first to resume.

**How to resume in a new conversation:** read this file and `docs/decisions.md`,
then pick the next unchecked phase below and follow its steps. Each phase is sized to
roughly one conversation.

---

## The one-paragraph summary

The website (UC and SWL) feeds three places. Every contact submission **emails
webs** (the never-miss floor) and **posts a lead into Tide** (the pipeline, which
lights up her "follow up on open leads" rhythm). Assessment-takers and newsletter
subscribers flow into **Buttondown**, which runs the nurture sequence and handles
unsubscribes. The **blog is owned in the website repo** (git-based CMS so the team
can write) so it can never vanish the way Ghost did.

```
UC / SWL website ──┬─→ email to contact@understorycollab.com   (never-miss floor)
                   ├─→ Tide  POST /api/inbound/lead → pipeline + "follow up" rhythm
                   └─→ Buttondown (assessment + newsletter signups) → nurture + unsubscribe
   Blog lives IN the website repo (git-based CMS for the team) — cannot vanish
```

---

## Locked decisions (see docs/decisions.md for the why)

| Topic | Decision |
|---|---|
| Contact notification | Email to contact@understorycollab.com. Must be a monitored mailbox. |
| Nurture / newsletter ESP | **Buttondown** (send + unsubscribe only) |
| Blog | Owned in the website repo, git-based CMS for team authors |
| Pipeline / CRM | **Tide** (webs's own app). Website posts leads to it. |
| Lead ↔ business | Many-to-many: a lead can tag multiple businesses |
| Kit | Left. HubSpot: let lapse in April. Ghost: out. Substack: out (values). |

**Build Tide's part as a product, not bespoke to webs.** She's the primary user, but
the inbound-lead feature should work for any Tide user's business.

---

## Repos and where each phase runs

| Repo | Role | Branch |
|---|---|---|
| `understory-collaborative/understory-collab` | UC website + these docs | `claude/website-redesign-tpm-ea8kz0` |
| `weberswords/tide` | pipeline app (Next.js, Clerk, Neon/Drizzle) | Tide's own process (plan doc + 3-agent review) |
| SWL website | studio w labs site (not yet in this session) | TBD when we wire SWL |

Notification uses **Resend**, already wired in `api/field-guide.js`
(`RESEND_API_KEY`, `FIELD_GUIDE_FROM`).

---

## Phases

### Phase 1 — Never-miss email notification  (website, small)

**Goal:** every contact submission emails webs, independent of any CRM.

- In `api/contact.js`, after validation, send an email via Resend to
  contact@understorycollab.com with name, business, email, topic, and message.
- Keep it best-effort separate from the Kit call for now; the email is the floor,
  so a Kit/Tide failure must never swallow the notification.
- Confirm contact@understorycollab.com is a real monitored mailbox first.
- Acceptance: submit the form, webs gets a readable email.

**Built (2026-08-20):** `api/contact.js` now emails `contact@understorycollab.com`
via Resend before the Kit call. It carries name, business, email, topic, and message,
each on its own line. Topic is now its own form field (`topic`); the old "fold it into
the message" hack existed only to avoid a Kit custom field, and with Kit leaving it is no
longer needed. For Kit's still-live record the topic is folded back into the stored
message server-side, so nothing regresses there. Best-effort and independent of Kit: a Kit
failure never swallows it, and a notification failure never blocks Kit delivery. Reply-to is set to the
submitter so webs can reply directly. Config: `RESEND_API_KEY` plus a from address
(`CONTACT_NOTIFY_FROM`, or `FIELD_GUIDE_FROM` as fallback); unset means the notification is
skipped and Kit delivery is unchanged. `contact@understorycollab.com` is confirmed a real
monitored mailbox (2026-08-20), and `RESEND_API_KEY` is set in Vercel (2026-08-20).
**Config complete (2026-08-20):** `FIELD_GUIDE_FROM` is set in Vercel to
`contact@understorycollab.com` (the notification's from-address fallback), and Resend is
set up with the domain verified. So the notification sends from `contact@` to `contact@`, a
self-addressed message that delivers normally; reply-to is still the submitter. The handler
logs a skip so a missing-config case is visible in Vercel logs instead of silent.
**Verified end to end (2026-08-20):** a real test submission landed the email in the
`contact@understorycollab.com` inbox. Phase 1 is complete.

### Phase 2 — Buttondown for nurture + newsletter  (website + Buttondown)

**Goal:** assessment-takers and subscribers get a compliant nurture sequence.

- Verify Buttondown pricing + values live. Create the account, one publication per
  brand (UC first).
- Move the newsletter/field-guide signup from Kit to Buttondown (replace
  `src/lib/kit.js` and `api/field-guide.js` Kit calls with Buttondown's API).
- Tag by source (`assessment:<fire-type>`, `newsletter`) so sequences can target.
- Write the first nurture sequence in Buttondown (webs writes copy; the tool sends).
- Confirm the unsubscribe footer + link work end to end.
- Retire Kit once parity is confirmed. Log it.
- Acceptance: a test signup lands in Buttondown, gets the sequence, can unsubscribe.

**Built (2026-08-21):** the two signups now go to Buttondown, server-side.

- **Newsletter** is a new server route `api/subscribe.js` (Buttondown needs a secret token, so
  the old browser-to-Kit post could not stay client-side). `src/lib/kit.js` is retired,
  replaced by `src/lib/subscribe.js`, which posts `{ email }` to the route; `SubscribeForm`
  now shows an "already on the list" success state. Tag: `newsletter`.
- **Field guide** (`api/field-guide.js`) swaps its Kit calls for the same `addToButtondown`
  helper. Tags: `assessment` and `assessment:<fire-type>`. The instant PDF download and the
  Resend guide email are unchanged.
- **Env:** `BUTTONDOWN_API_KEY` (required) and optional `BUTTONDOWN_API_URL` host override, both
  documented in `.env.example`. Without the key the signups return a clean "unavailable" error.
- **Contact form is untouched** — it still uses Kit until the Tide phases, so Kit is not fully
  retired yet.
- lint and build pass. **Open before this is done:** add `BUTTONDOWN_API_KEY` in Vercel;
  keep double opt-in ON in Buttondown (the "check your inbox" copy assumes it); webs writes the
  first nurture sequence; then a live test signup confirms opt-in + sequence + unsubscribe.
- **Known limitation:** an already-subscribed address is treated as success (guide still
  delivered) but is not re-tagged with a new fire type; refine later if cross-fire retargeting
  matters.

### Phase 3 — Tide inbound-lead feature  (Tide, product-level)

**Goal:** the website drops a lead straight into Tide's pipeline.

This is a real Tide feature and follows Tide's process: **write a `docs/` plan first,
then a designer / product-steward / developer review pass, then build.** Port the
"Tide feature design" section below into `tide/docs/inbound-leads-plan.md` to start.

- Schema: a join table linking `contacts` ↔ `teams` (many-to-many), so a lead tags
  multiple businesses. Migration via `npm run db:generate` (pipeline runs migrate).
- Endpoint: `POST /api/inbound/lead`, key-authenticated per business.
- Effect: creates a `contacts` row (role `lead`) tagged to the business(es), and
  optionally an `engagements` row (status `lead`) so it enters the pipeline and the
  "follow up on open leads" rhythm fires.
- Multi-user note: "not accessible to the whole team yet" is a known Tide gap; this
  feature shouldn't depend on team access shipping first.
- Acceptance: a POST with a valid key creates a business-tagged lead visible in Tide.

### Phase 4 — Website → Tide wiring  (website)

**Goal:** connect Phase 1's handler to Phase 3's endpoint.

- Add the Tide intake key as an env var; `api/contact.js` posts the lead to Tide
  after emailing webs. Best-effort: a Tide outage never blocks the email.
- Let the submitter pick which business it's about (or infer from the site), so the
  lead is tagged correctly.
- Acceptance: a real submission both emails webs and appears in Tide's pipeline.

### Phase 5 — Owned blog + team CMS  (website)

**Goal:** replace the lost Ghost blog with one that can't vanish and that the team
can write in without touching code.

- Add a blog to the site (markdown/MDX posts as files in the repo, rendered by a
  new `/blog` route + post pages).
- Add a git-based CMS (candidates: Sveltia CMS or Decap CMS) at `/admin` so writers
  get a web editor; confirm the auth flow works on Vercel.
- Optional: a review-before-publish step, a natural home for the VOICE.md gate on
  team posts.
- Wire "new post" to a Buttondown broadcast so the blog and newsletter share content.
- Acceptance: a non-technical teammate can write and publish a post from the browser.

### Phase 6 — SWL parity  (SWL website)

**Goal:** the same intake + nurture for studio w labs.

- Bring the SWL site into a session, repeat Phases 1, 2, 4 for the SWL brand and its
  Buttondown publication and Tide business key.

---

## Tide feature design (port into tide/docs when Phase 3 starts)

**Model today (`web/db/schema.ts`):**

- `teams` = a business (understory collaborative, studio w labs).
- `contacts` (scoped to `userId`): `name, org, email, role` (lead | prospect |
  referral source | past client), `warmth`, `notes`. No business link yet.
- `engagements` (under a `stream`): `client, status` (lead | committed | active |
  done), `revenue, hours`. This is the pipeline.
- `business-home-plan.md` defines a "follow up on open leads" rhythm that fires only
  when an open lead exists — the payoff we want inbound leads to trigger.

**Change:** add a many-to-many `contact_teams` join (`contactId`, `teamId`) so a lead
tags one or more businesses. Do not add a single `teamId` column (a lead can span
businesses). Keep `contacts` per-user ownership; the join adds business tags on top.

**Endpoint:** `POST /api/inbound/lead` (Tide has no `api/` routes yet; this is the
first). Auth: a per-business intake key, hashed at rest, sent as a header. The key
identifies the business, so the payload need not trust a business id from the caller.

**Payload:** `name, email, org?, message?, source` (e.g. `understory-contact-form`,
`assessment`), `businessSlugs[]` (validated against the key's allowed businesses),
`tags?`.

**Effect:** upsert a `contacts` row (role `lead`, warmth from source), attach the
business tags, optionally create an `engagements` row (status `lead`) so it enters
the pipeline and trips the follow-up rhythm.

**Process reminders for the Tide repo:** its Next.js has breaking changes (read
`node_modules/next/dist/docs/` before coding); UI chrome is lowercase and em-dash
free; WCAG 2.2 AA is a hard requirement; run `typecheck`, `test`, `lint`, then the
three plugin agents.

---

## Open questions to settle as we go

- Buttondown: current pricing and a values gut-check (do live before wiring).
- Does a website lead also create an `engagement` immediately, or only a `contact`
  until webs qualifies it? (Leaning: contact now, engagement when she promotes it.)
- SWL site: where it lives and its brand/voice specifics.
- Business picker on the contact form: explicit field vs inferred from which site.

---

## Status

- [x] Decisions logged (`docs/decisions.md`)
- [x] Master plan written (this file)
- [x] Phase 1 — never-miss email (complete; verified end to end 2026-08-20)
- [~] Phase 2 — Buttondown nurture (code built; needs the Vercel key, nurture copy, and a live test)
- [ ] Phase 3 — Tide inbound-lead feature
- [ ] Phase 4 — website → Tide wiring
- [ ] Phase 5 — owned blog + CMS
- [ ] Phase 6 — SWL parity
