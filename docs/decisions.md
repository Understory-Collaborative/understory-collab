# Decisions log

Internal record of tooling and process decisions, so we don't re-litigate them
and so we remember why we chose what we chose. Newest first.

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

**Substack: ruled out for UC** on values and morals grounds. They platform nazis,
and the team does not want to use them. This sets a broader criterion: **a vendor's
values are a real filter for UC**, not only its features.

**New criteria this adds to the tool choice:**

- **Low or no added cost.** webs is cost-conscious. Favor genuine free tiers; do
  not stack subscriptions.
- **Data ownership, no silent vanish.** The blog and list must be exportable and
  must not be able to disappear without warning. Strong case for owning the blog
  in the website repo itself (versioned in git, deploys on Vercel, cannot poof),
  with a replaceable ESP handling only the send + unsubscribe.

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
