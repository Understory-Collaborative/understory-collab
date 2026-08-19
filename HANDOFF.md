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

- **Color-as-meaning (do not spend elsewhere):** lime `--action #8ed14f` = "click this" (primary button ONLY); deep olive `--surface-act` (`#47601e` dark / `#35470f` light) = "we invite you to act" (conversion CTAs only). **The brand spine is now OLIVE** (see the palette decision below); the nav is olive in both themes (`#5b5c1f` dark, `#1c2902` light).
- **Severity ramp** (`--severity-brush/smolder/crown/firestorm`) drives the quiz; always paired with the type name in text (never color alone).
- **Dark canvas default** (`#1a1a1a`), light theme under `[data-theme="light"]`. Flat by default; forest-tinted shadow only on hover; real 3px focus ring.
- **Headings sentence case** ("What we do"). Metaphor lives in words, never literal flames/parachutes.
- **Website voice:** "a seasoned CTO telling you the truth over coffee. Honest, plain, unhurried, never selling." Educate, don't pitch. Lead with the honest observation, not the offer.

### Brand decisions (resolved)
- **Palette: OLIVE, light and dark (resolved 2026-08-17).** webs chose a warm olive identity over the old forest/teal. One identity, two modes, wired into `tokens/colors.css` semantic layer:
  - **Dark:** canvas `#1c2902`, card `#26380b`, nav `#5b5c1f`, cream text `#eeeee1`, pale-olive accent `#b7de7c`.
  - **Light (warm, not grey/white):** cream page `#f4f2e4`, pale-olive hero band, deep-olive nav `#1c2902`, dark-olive text `#232b10`, deep-olive accent `#4c5a16`.
  - **Shared across both:** the lime action button `#8ed14f` (stays "click this"), so the two modes read as one brand.
  - **Untouched:** the severity fire ramp (brush/smolder/crown/firestorm) — a separate product asset. All pairings verified WCAG AA.
  - **Follow-ups:** the raw `--forest-*` ramp is now legacy (kept, relabeled); the design-system specimen `guidelines/foundations.html` still shows the old forest swatches and should be refreshed; the unused `--info-*` status token still points at forest.
- **Voice gate: `design-system/VOICE.md`.** Every line of website copy passes through it. Rules are defaults; webs approves exceptions (logged in the file).
- **Font: Overpass is canonical** (tokens already ship it). DONE: README, SKILL.md, the token-file comments, and the standalone `foundations.preview.html` specimen all read Overpass now. Only the one-file revert note in `tokens/fonts.css` still names Hanken Grotesk, on purpose (it documents how to swap back).
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
- **No decorative accent bars or pills, ever** (standing rule, not just this redesign). Proof: the green hero dash and the lime CTA dash were removed site-wide.
- **`design-audit` skill (designer plugin) is the standard design-review pass** run on any key page before it is finalized.
- **Accessibility from the first draft:** COGA / WCAG / ADHD. Skimmable takeaway line + explanation underneath, not walls of prose. New-tab cues on external links, print styles, nothing meaningful on color alone.
- **Known a11y bug (accessibility / "signs" page):** audited 2026-08-17 against the current tokens. Every text pair on the page now clears WCAG AA. Lowest is the "last updated" metadata line (`--text-muted`) at 5.21:1 dark / 5.41:1 light; body, headings, hero text, and links all sit at 8:1 or higher. The original low-contrast text looks resolved by the color-token overhaul. **Action for webs:** if you still see a specific line reading low, name it and I will retune that token. (Page also still uses the old `.page-hero-description` markup, not the newer shared `.page-hero-lead`/`.page-hero-support` treatment; cosmetic, not a contrast issue.)

---

## Process

- **Branch:** `claude/website-copy-ab-testing-l4lcp3` (feature) → mirror to `preview` (host builds). Commit small; build + lint before each commit.
- **Copy-first, gated, few options:** draft 1–2 lines already run through `VOICE.md` for review, never spray 20 raw options. (This was the fix for early churn.)
- **Form backend pattern + gotchas:** custom UI posts to a Google Form's `formResponse` (the form owner's account), or Apps Script → Sheet. Google Form gotchas: publish the form; no verified-email collection or response limit (either forces sign-in → 401); radio values must match the form's option text exactly.
- **Reviews:** designer + product-steward review passes on key pages before finalizing.
- **PR:** [#28](https://github.com/Understory-Collaborative/understory-collab/pull/28) (opened from the Claude Code UI). Pushing to the feature branch updates it; no new PR needed.

---

## Status log

> Mirroring: every commit is pushed to both `claude/website-copy-ab-testing-l4lcp3` and `preview` (fast-forward) so the host builds the latest.

**Q&A rung is live end to end.** The 401 was an unpublished form; publishing it fixed it. Submissions land in the Google Form. Product field kept; Stage field removed (SWL vibe-coder framing, not UC's audience).

**Designer audit run** on both new pages (design-audit skill), all findings resolved:
- Radio hit-target size + branded focus ring + on-scale hero type — fixed.
- Green hero dash removed site-wide (`.page-hero-content::before` / `.home-hero-content::before`).
- Lime CTA dash removed (`.cta-section h2::before`) — consistency with the above.
- Form input borders: new `--border-input` token (dark `rgba(255,255,255,0.42)`, light `--neutral-500`), `.contact-input` repointed at it — clears WCAG 1.4.11 (3:1) on every form.
- Hero lead/support promoted to shared `.page-hero-lead` / `.page-hero-support`; office hours + Q&A now use the same treatment.

**Nav / IA collapse done.** Nav is now flat: Assessment (/quiz) · Office hours · Our work · About · Contact. Retired: Advisory + Implementation (redirect → /, offerings now live on the homepage as Design/Build/Ship), Values (redirect → /about). Old Services dropdown and its logic removed. Page components for Advisory/Implementation/Values remain in the repo but are unrouted. **Open:** webs also mentioned collapsing About itself; kept a single About for iteration 2 (Values folded in via redirect) rather than deleting it — confirm whether About stays or folds onto the homepage. Q&A (/questions) is not in the nav by design (reached from the quiz result and office hours); revisit if it should be surfaced.

**Homepage hero locked** (`Home.jsx`): "You aren't supposed to have all of this solved on your own." + sub naming the three situations + "we've worked through it before" + a few-questions pointer to the quiz, with a "Take the quiz" CTA. Replaces the interim "clean code" hero. Also pulled the unverified "about 2 minutes" claim from the quiz intro (webs hasn't timed it). NOTE: quiz intro still has other gate issues to fix in the quiz surgical pass ("a plain read on where you stand" uses blocklisted "read"; "No vendor pitch. No sales sequence." are ad-fragments; "Six questions" count will change when the bus-factor question is added).

**Homepage "Design/Build/Ship" section built** (`Home.jsx`, replaces the old Advisory/Implementation "What we do"): h2 "Where are you stuck?", three buckets (Design/Build/Ship + job + recognition line), the practical-not-shiny promise (Option B) folded underneath, one CTA to /contact (stopgap until the "work with me" bucket pages exist). Recognition lines are drafts webs saw but hasn't line-edited. **Homepage still to do:** hero (still the interim "clean code" line, unresolved), the how-it-works/ladder section, the two on-ramps framing, nav collapse (retire Advisory/Implementation/Values/About links), and Values/About fold.

**Quiz results screen rewired** (`Quiz.jsx`) to the ladder: keeps the result + field-guide capture, then a "Your next move" handoff to office hours (primary) and Q&A (free alt). Dropped the three door links and the "Let's Talk"/contact ending (webs approved for iteration 2; doors move to the "work with me" rung later). Office hours support line aligned to "someone who's seen just about everything." **Still to do:** hand webs drop-in copy for the four report (PDF) endings.


| Date | State |
|---|---|
| 2026-08-14 | Pivoted from copy workshop to funnel redesign. HANDOFF created. Brand/voice read complete. Prior copy work (hero direction, 20-line artifact, comms guidelines) committed on this branch. |
| 2026-08-14 | Read all four fire reports. **All decisions resolved (D1–D4).** Inputs from webs: font = Overpass; prices in-house except $50 office hours; forcing function + two buyer drivers captured. Build order set. Next: build rung destinations (Q&A + Office Hours pages). |
| 2026-08-14 | Reports stay as-is: deep + generic. Free/paid line = the step-by-step remediation sequences (90-day, 6-month) read as "what the engagement does," not a DIY manual. |
| 2026-08-14 | **Voice gate signed off and stored at `design-system/VOICE.md`.** All website copy passes through it. Rules are defaults; webs approves exceptions (logged in the file; first entry: "physics, not failure"). Ready to build pages. |
| 2026-08-14 | Built **Office hours page** (`/office-hours`, rung 3). Copy approved (opener: "There's a problem you can't take to your team or your boss. Bring it here."). External booking link with new-tab cue + print style; at-a-glance table; free-Q&A fallback. |
| 2026-08-14 | Built **Q&A page** (`/questions`, rung 2) + `api/questions.js`. Copy approved. Hands off to office hours (no dead-end). Both rung destinations exist and cross-link. Nav wiring deferred to the homepage/IA pass. |
| 2026-08-14 | Q&A backend **wired**: `api/questions.js` posts form-urlencoded `entry.*` to the Google Form's `/formResponse` (form id `1FAIpQLSd5HTS0VYZR4NDR5iRnz1Ecg3gUeJ0-un-45Pfs8bLmbb9i6Q`). No env var, no Apps Script. Entry map: stuck `1540066254`, product `18696469`, stage `1644200461`, share `1252682430`, name `896079231`, email `1885750161`. Email is now a normal required question (built-in collection off). Radio option text matched to the form exactly (stage: Idea/Building/Launched/Growing; share: "Yes, use my name" / "Yes, keep me anonymous" / "No, just answer me privately"). Form's Stage/Product/Name must stay OPTIONAL to match the UI. **Still to verify:** a real submit on preview/prod lands a row in the form (the sandbox proxy blocks outbound Google, so it can't be tested from here). |
| 2026-08-17 | **Accessibility ("signs") page contrast audited (build order item 6).** Computed WCAG ratios for every text/background pair on `/accessibility` in both themes against the current tokens. All clear AA: hero and body 8:1+, links ~7–8:1, the only sub-6 value is the muted "last updated" line at 5.21:1 dark / 5.41:1 light (still above the 4.5 AA floor). The original bug reads as resolved by the color-token overhaul; no code change made. Flagged for webs to confirm the specific line if one still looks low. |
| 2026-08-17 | **Olive palette adopted, light + dark (`tokens/colors.css`).** webs reviewed a live palette-switch artifact and chose the warm-olive identity. Mapped dark + light olive into the semantic token layer; nav goes olive (`#5b5c1f` dark, deep `#1c2902` light), canvas/card/text/accent all olive, lime action button shared across both modes so it reads as one brand. Warm light mode uses cream `#f4f2e4` and a pale-olive band, deliberately not grey/white. Severity fire ramp left untouched. `.nav-submenu` (retired) repointed off the raw forest ramp. Every pairing verified AA; build + lint clean. Raw `--forest-*` ramp relabeled legacy; specimen `foundations.html` refresh left as a follow-up. |
| 2026-08-17 | **Font docs squared with the code (build order item 7).** The tokens already shipped Overpass; the docs lagged. Updated `design-system/README.md` (source-materials table + type note), `SKILL.md`, the comments in `tokens/fonts.css` and `tokens/typography.css`, and the standalone `foundations.preview.html` specimen (which was still loading Hanken Grotesk) to all read Overpass. Left the one-file revert note in `fonts.css` naming Hanken on purpose. Build + lint clean. |

---

## Offering trio (resolved with webs)

Framed as customer problems, not services: **Design · Build · Ship** = *what to build · how to build it · how to ship it*.
- **Design** — what to build (scope, the right first version).
- **Build** — how to build it (the team / execution).
- **Ship** — how to ship it (release cadence, automation, AI, practices). "Accelerate" is this bucket's benefit line, not its label.

This RE-CUTS the old three doors (delivery-rescue / team-turnaround / AI) along the lifecycle. Offer-page depth (proof, pricing in `offersData.js`) must be remapped onto Design/Build/Ship when the "work with me" rung is built. These three also collapse the old Advisory / Implementation pages; Values + About fold into the homepage/About.

## Positioning: practical, not shiny

UC's wedge against the big consultancies (Thoughtworks / Deloitte tier): they sell the shiny new build; UC gets what you already have running right. webs's metaphor: not a Bugatti, but fixing the alternator and repainting the Celica. Consistent with existing Advisory copy ("we will not sell you a rebuild you would then pay to run, secure, and maintain").
- On the SITE: express the contrast WITHOUT naming competitors (naming reads insecure / invites trouble).
- The car metaphor is vivid but off the forest/fire brand and the voice gate ("metaphor subtle, never literal"), so use it as a deliberate one-off or state plainly. TBD with webs.

## Build order (bottom-up, so no CTA points to a missing page)

1. **New rung destinations first:** Q&A page (free, async/public; champion mastery voice) and Office Hours page ($50, 3 spots, bring the marked-up report). So every CTA has a real target.
2. **Rewire endings:** quiz results screen + the four report endings → hand off to office hours / Q&A. Kill the dead-ends and the email-capture-only close.
3. **Quiz surgical edit:** add the bus-factor axis; keep the 6-question spine; results route to the severity engagement pattern.
4. **Homepage:** two on-ramps — champion (mastery, free rungs) and exec (behind project + the team question, paid tiers). One CTA per section.
5. **"Work with me":** reframe offers around the severity engagement patterns; intake qualifies domain + scope (premium tone, not a nitty-gritty form).
6. **Fold/retire** Advisory + Implementation into the ladder (decision I'll make and flag for review). ~~Fix the **Accessibility ("signs") page contrast** bug~~ — audited 2026-08-17, all text clears AA; see the a11y note above. Awaiting webs confirmation of the specific line, if any remains.
7. **Font docs:** README + SKILL.md → Overpass. **DONE** (2026-08-17).
8. **Reviews:** designer + product-steward passes on key pages.
9. **PR** at the very end.

Every step: small commit, update this file in the same commit, mirror the feature branch to `preview`.
