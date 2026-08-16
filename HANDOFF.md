# HANDOFF — Understory funnel redesign

Living state for the funnel-flow redesign. **Update this file in the same commit as the work it describes.** State lives here, not in chat.

---

## Goal

Rebuild understorycollab.com around a clear ladder so visitors move rung by rung:

**free quiz/report → free Q&A → low-commitment paid (office hours) → work with me**

Adapt the flow to UC. Do **not** copy studio w labs wholesale (UC already has the four fire reports).

---

## The ladder, rung by rung

| Rung | Type | UC asset | CTA points to |
|---|---|---|---|
| 1. Free asset | Free | "What's on Fire?" quiz → tailored fire report | CONNECT (not another free artifact) |
| 2. Q&A | Free | Async / public answer to one question | office hours or connect |
| 3. Low-commitment paid | Paid entry | $50 TPM office hours (3 spots) + possible fixed-price audit / discovery / sprint zero | work with me |
| 4. Work with me | Paid | Scoped project or retainer; qualify scope at intake before quoting | — |

---

## Rules that make the flow work

- **One CTA per section/page.** Match every CTA to its rung. Never re-ask for what they're already doing.
- **Free leads to CONNECT** (office hours, Q&A, connect form), never to another free artifact.
- **Never dead-end.** Every page hands the reader the next rung.
- **Scope safeguards.** A fixed tier buys a DEFINED SLICE; anything bigger is scoped and quoted. Qualify size/age/stack/architecture at intake so a large job can't be swallowed by a small price. *Rethink for UC: premium, mid-enterprise / mature-startup buyer — a nitty-gritty intake form can read as cheap.*
- **Samples show what each price buys.** Tiered sample deliverables double as the "why upgrade." Samples prove competence better than claims.
- **Business impact, not fear.** Lead with the consequence to the business.
- **Teach, don't gatekeep.** Plain words before jargon. Cite any researcher by full name + what they're known for, or not at all.

---

## Decisions — DECIDE FIRST, do not guess

| # | Decision | Status | Resolution |
|---|---|---|---|
| D1 | Buyer + forcing function | **RESOLVED** | Two on-ramps, one ladder, two drivers. **Champion** (TPM/PO): proactive, driven by *mastery* — learning to do the job better, what they don't know about being a TPM/PO. Lives on the free rungs + office hours; carries UC upward. **Exec** (CTO): reactive, driven by *pressure* — a project is behind or has been behind, asking "do we need a new team, or can we save the existing one?" Buys the engagement. |
| D2 | One product or several; shared vs separate ladders | **RESOLVED** | One shared ladder. The three doors (delivery, team, AI) are the SCOPE of "work with me," qualified at intake, not separate funnels. |
| D3 | Real rungs and prices, esp. paid entry | **RESOLVED** | $50 office hours → fixed-price audit / "sprint zero" → scoped engagement. **All prices in-house (intake-only) EXCEPT the $50 office hours, which is customer-facing.** |
| D4 | What the quiz/report assesses and produces | **RESOLVED** | Surgical, not a rebuild. Keep the 6-question spine; close the one gap (knowledge concentration / load-bearing people / bus factor — the only strong cross-report theme not asked). Offer is **severity-driven**: quiz result routes to the report's named engagement pattern (see mapping below); domain qualified at intake. The four reports double as the audit **sample**. |

---

## Brand & voice (read complete)

- **Color-as-meaning (do not spend elsewhere):** lime `--action #8ed14f` = "click this" (primary button ONLY); deep green `--surface-act #35674a` = "we invite you to act" (conversion CTAs only). Forest `--forest-700 #2d5a3d` is the spine; nav stays forest in both themes.
- **Severity ramp** (`--severity-brush/smolder/crown/firestorm`) drives the quiz; always paired with the type name in text (never color alone).
- **Dark canvas default** (`#1a1a1a`), light theme under `[data-theme="light"]`. Flat by default; forest-tinted shadow only on hover; real 3px focus ring.
- **Headings sentence case** ("What we do"). Metaphor lives in words, never literal flames/parachutes.
- **Website voice:** "a seasoned CTO telling you the truth over coffee. Honest, plain, unhurried, never selling." Educate, don't pitch. Lead with the honest observation, not the offer.

### Brand decisions (resolved)
- **Voice gate: `design-system/VOICE.md`.** Every line of website copy passes through it. Rules are defaults; webs approves exceptions (logged in the file).
- **Font: Overpass is canonical** (tokens already ship it). TO DO: update README + SKILL.md, which still say Hanken Grotesk.
- **Voice:** proceed with the documented website voice (design-system README: "a seasoned CTO telling you the truth over coffee; educate, don't pitch") plus the house-canon rules (plain language, no AI slop, no self-certifying virtue words, warm with high standards, no em dashes). Canon not separately stored; flag if a real gap appears.
- Proposal tokens (shadows, midtone ramps, warning/info) — confirm which become real as they're used.

## Severity → engagement pattern (drives "work with me", from the reports)

| Quiz result | Engagement pattern (already written in the report) |
|---|---|
| Brush Fire | Controlled burn practice (20% maintenance lane, quarterly burn weeks) |
| Smolder | Visibility + burn-down momentum |
| Crown Fire | 90-day stabilization |
| Firestorm | 6-month transformation |

The **fixed-price audit** = the "honest assessment" every report describes (map the real workflow, find the load-bearing people, save / sunset / rebuild triage). Reports are the sample of what it buys.

## Design & craft rules
- **Anti-slop design:** NO colored left/top/bottom edge-accent bars. NO decorative or single-word pills. Differentiate with type hierarchy, whitespace, and real content (a small table, a code sample). Icons OK if `aria-hidden` and the text carries meaning.
- **Accessibility from the first draft:** COGA / WCAG / ADHD. Skimmable takeaway line + explanation underneath, not walls of prose. New-tab cues on external links, print styles, nothing meaningful on color alone.
- **Known a11y bug:** the signs page has insufficient contrast on some text. → fix during redesign.

---

## Process

- **Branch:** `claude/website-copy-ab-testing-l4lcp3` (feature) → mirror to `preview` (host builds). Commit small.
- **Reviews:** designer + product-steward review passes on key pages before finalizing.
- **PR:** open only at the end.

---

## Status log

> Mirroring: every commit is pushed to both `claude/website-copy-ab-testing-l4lcp3` and `preview` (fast-forward) so the host builds the latest.

**Q&A rung is live end to end.** The 401 was an unpublished form; publishing it fixed it. Submissions land in the Google Form. Product field kept; Stage field removed (SWL vibe-coder framing, not UC's audience).

**Designer audit run** on both new pages (design-audit skill). Applied: radio hit-target size + branded focus ring + on-scale hero type; **removed the green hero dash site-wide** (`.page-hero-content::before` / `.home-hero-content::before`). Still OPEN for webs: (1) the sibling **lime CTA dash** (`.cta-section h2::before`) — remove for consistency or keep (it ties the heading to the lime button); (2) **form input borders fail WCAG 1.4.11 contrast** in both themes on every form — strengthen site-wide?


| Date | State |
|---|---|
| 2026-08-14 | Pivoted from copy workshop to funnel redesign. HANDOFF created. Brand/voice read complete. Prior copy work (hero direction, 20-line artifact, comms guidelines) committed on this branch. |
| 2026-08-14 | Read all four fire reports. **All decisions resolved (D1–D4).** Inputs from webs: font = Overpass; prices in-house except $50 office hours; forcing function + two buyer drivers captured. Build order set. Next: build rung destinations (Q&A + Office Hours pages). |
| 2026-08-14 | Reports stay as-is: deep + generic. Free/paid line = the step-by-step remediation sequences (90-day, 6-month) read as "what the engagement does," not a DIY manual. |
| 2026-08-14 | **Voice gate signed off and stored at `design-system/VOICE.md`.** All website copy passes through it. Rules are defaults; webs approves exceptions (logged in the file; first entry: "physics, not failure"). Ready to build pages. |
| 2026-08-14 | Built **Office hours page** (`/office-hours`, rung 3). Copy approved (opener: "There's a problem you can't take to your team or your boss. Bring it here."). External booking link with new-tab cue + print style; at-a-glance table; free-Q&A fallback. |
| 2026-08-14 | Built **Q&A page** (`/questions`, rung 2) + `api/questions.js`. Copy approved. Hands off to office hours (no dead-end). Both rung destinations exist and cross-link. Nav wiring deferred to the homepage/IA pass. |
| 2026-08-14 | Q&A backend **wired**: `api/questions.js` posts form-urlencoded `entry.*` to the Google Form's `/formResponse` (form id `1FAIpQLSd5HTS0VYZR4NDR5iRnz1Ecg3gUeJ0-un-45Pfs8bLmbb9i6Q`). No env var, no Apps Script. Entry map: stuck `1540066254`, product `18696469`, stage `1644200461`, share `1252682430`, name `896079231`, email `1885750161`. Email is now a normal required question (built-in collection off). Radio option text matched to the form exactly (stage: Idea/Building/Launched/Growing; share: "Yes, use my name" / "Yes, keep me anonymous" / "No, just answer me privately"). Form's Stage/Product/Name must stay OPTIONAL to match the UI. **Still to verify:** a real submit on preview/prod lands a row in the form (the sandbox proxy blocks outbound Google, so it can't be tested from here). |

---

## Build order (bottom-up, so no CTA points to a missing page)

1. **New rung destinations first:** Q&A page (free, async/public; champion mastery voice) and Office Hours page ($50, 3 spots, bring the marked-up report). So every CTA has a real target.
2. **Rewire endings:** quiz results screen + the four report endings → hand off to office hours / Q&A. Kill the dead-ends and the email-capture-only close.
3. **Quiz surgical edit:** add the bus-factor axis; keep the 6-question spine; results route to the severity engagement pattern.
4. **Homepage:** two on-ramps — champion (mastery, free rungs) and exec (behind project + the team question, paid tiers). One CTA per section.
5. **"Work with me":** reframe offers around the severity engagement patterns; intake qualifies domain + scope (premium tone, not a nitty-gritty form).
6. **Fold/retire** Advisory + Implementation into the ladder (decision I'll make and flag for review). Fix the **Accessibility ("signs") page contrast** bug.
7. **Font docs:** README + SKILL.md → Overpass.
8. **Reviews:** designer + product-steward passes on key pages.
9. **PR** at the very end.

Every step: small commit, update this file in the same commit, mirror the feature branch to `preview`.
