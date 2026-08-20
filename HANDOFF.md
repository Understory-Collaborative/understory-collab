# HANDOFF — Understory funnel redesign

Living state for the funnel-flow redesign. **Update this file in the same commit as the work it describes.** State lives here, not in chat.

---

## Goal

Rebuild understorycollab.com around a clear ladder so visitors move rung by rung:

**free assessment/report → free Q&A → low-commitment paid (office hours) → work with me**

(The assessment is still branded "What's On Fire?"; the word "quiz" was renamed to "assessment" site-wide on 2026-08-19, route `/assessment` with `/quiz` redirecting.)

Adapt the flow to UC. Do **not** copy studio w labs wholesale (UC already has the four fire reports).

---

## The ladder, rung by rung

| Rung | Type | UC asset | CTA points to |
|---|---|---|---|
| 1. Free asset | Free | "What's On Fire?" assessment → tailored fire report | CONNECT (not another free artifact) |
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
- **Deep-olive canvas default** (`#1c2902`), warm-cream light theme (`#f4f2e4`) under `[data-theme="light"]`. Flat by default; olive-tinted shadow only on hover; real 3px focus ring.
- **Headings sentence case** ("What we do"). Metaphor lives in words, never literal flames/parachutes.
- **Website voice:** "a seasoned CTO telling you the truth over coffee. Honest, plain, unhurried, never selling." Educate, don't pitch. Lead with the honest observation, not the offer.

### Brand decisions (resolved)
- **Palette: OLIVE, light and dark (resolved 2026-08-17).** webs chose a warm olive identity over the old forest/teal. One identity, two modes, wired into `tokens/colors.css` semantic layer:
  - **Dark:** canvas `#1c2902`, card `#26380b`, nav `#5b5c1f`, cream text `#eeeee1`, pale-olive accent `#b7de7c`.
  - **Light (warm, not grey/white):** cream page `#f4f2e4`, pale-olive hero band, deep-olive nav `#1c2902`, dark-olive text `#232b10`, deep-olive accent `#4c5a16`.
  - **Shared across both:** the lime action button `#8ed14f` (stays "click this"), so the two modes read as one brand.
  - **Untouched:** the severity fire ramp (brush/smolder/crown/firestorm) — a separate product asset. All pairings verified WCAG AA.
  - **Design-system docs updated to olive (2026-08-19):** README, SKILL.md, `guidelines/foundations.html` and the self-contained `foundations.preview.html` (colors re-synced from `colors.css`), the `quiz-result.html` nav comment, and the elevation shadow tint. Brand swatches now show the olive semantic tokens; the forest metaphor prose is untouched.
  - **Remaining follow-ups:** the raw `--forest-*` ramp is legacy (kept, relabeled, still shown as a "legacy" note); the unused `--info-*` status token still points at forest.
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

- **Branch + deploy:** work on the session's `claude/handoff-md-*` branch, then open a PR into **`preview`** and merge it — the host builds from `preview`. Commit small; build + lint before every commit. (Older feature branch `claude/website-copy-ab-testing-l4lcp3` and its PR #28 are closed; `main` is stale — the redesign lives on `preview`.)
- **Copy-first, gated, few options:** draft 1–2 lines already run through `VOICE.md` for review, never spray 20 raw options. (This was the fix for early churn.)
- **Form backends (current):**
  - **Contact** (`api/contact.js`) → **Kit** dedicated "Website contact" form `9821838`, fields `email_address` + `fields[name|business|message]`. No env var. Kit gotchas: **publish the form** (unpublished → 401), and Kit can only *ping* on a new subscriber (Account → Settings notification) — it cannot email the message body, and its automations only act on the subscriber, not on webs. The message lives on the subscriber's custom fields; read it in Kit after the ping. webs ruled out Resend and Google Sheets for notifications.
  - **Newsletter + field guide** (`src/lib/kit.js`, `api/field-guide.js`) → Kit form `9782548`. Field guide optionally emails via Resend if `RESEND_API_KEY` is set (else instant download + Kit opt-in still work).
  - **Q&A** (`api/questions.js`) → posts `entry.*` to a Google Form's `/formResponse` (see the 2026-08-14 log entry for the form id + entry map). Google Form gotchas: publish it; no verified-email collection or response limit (either forces sign-in → 401); radio values must match the form's option text exactly.
- **Reviews:** designer + product-steward review passes on key pages before finalizing.

---

## Status log

> Deploy: work lands on the session branch, then a PR into `preview` (merged) so the host builds the latest. PRs #29–#32 (2026-08-19) carried the font docs, a11y audit, olive palette, contact-form Kit switch, assessment rename, CTA de-dup, and design-system doc updates onto `preview`.

**Q&A rung is live end to end.** The 401 was an unpublished form; publishing it fixed it. Submissions land in the Google Form. Product field kept; Stage field removed (SWL vibe-coder framing, not UC's audience).

**Designer audit run** on both new pages (design-audit skill), all findings resolved:
- Radio hit-target size + branded focus ring + on-scale hero type — fixed.
- Green hero dash removed site-wide (`.page-hero-content::before` / `.home-hero-content::before`).
- Lime CTA dash removed (`.cta-section h2::before`) — consistency with the above.
- Form input borders: new `--border-input` token (dark `rgba(255,255,255,0.42)`, light `--neutral-500`), `.contact-input` repointed at it — clears WCAG 1.4.11 (3:1) on every form.
- Hero lead/support promoted to shared `.page-hero-lead` / `.page-hero-support`; office hours + Q&A now use the same treatment.

**Nav / IA collapse done.** Nav is now flat: Assessment (/assessment) · Office hours · Our work · About · Contact. Retired: Advisory + Implementation (redirect → /, offerings now live on the homepage as Design/Build/Ship), Values (redirect → /about). Old Services dropdown and its logic removed. **The Advisory/Implementation/Values page components + CSS were deleted 2026-08-19** (they were unrouted and unimported; the redirect routes stay so old links don't 404). Their positioning copy is preserved in this HANDOFF (see "Positioning") and offer content lives in `offersData.js`. **Open:** webs also mentioned collapsing About itself; kept a single About for iteration 2 (Values folded in via redirect) rather than deleting it — confirm whether About stays or folds onto the homepage. Q&A (/questions) is not in the nav by design (reached from the assessment result and office hours); revisit if it should be surfaced.

**Homepage hero locked** (`Home.jsx`): "You aren't supposed to have all of this solved on your own." + sub naming the three situations + "we've worked through it before" + a few-questions pointer to the assessment. Replaces the interim "clean code" hero. **The hero no longer carries its own CTA** (2026-08-19) — it was a duplicate of the assessment section's button right below it; the hero is now a pure hook and the "How Healthy Is Your Digital Forest?" section owns the single "Take the assessment" CTA. Also pulled the unverified "about 2 minutes" claim from the assessment intro. NOTE: assessment intro still has gate issues to fix in the surgical pass ("a plain read on where you stand" uses blocklisted "read"; "No vendor pitch. No sales sequence." are ad-fragments; "Six questions" count will change when the bus-factor question is added).

**Homepage "Design/Build/Ship" section built** (`Home.jsx`, replaces the old Advisory/Implementation "What we do"): h2 "Where are you stuck?", three buckets (Design/Build/Ship + job + recognition line), the practical-not-shiny promise (Option B) folded underneath, one CTA to /contact (stopgap until the "work with me" bucket pages exist). Recognition lines are drafts webs saw but hasn't line-edited. **Homepage still to do:** the how-it-works/ladder section, the two on-ramps framing (champion vs exec), and confirming the About/Values fold. (Hero, Design/Build/Ship, and nav collapse are done.)

**Quiz results screen rewired** (`Quiz.jsx`) to the ladder: keeps the result + field-guide capture, then a "Your next move" handoff to office hours (primary) and Q&A (free alt). Dropped the three door links and the "Let's Talk"/contact ending (webs approved for iteration 2; doors move to the "work with me" rung later). Office hours support line aligned to "someone who's seen just about everything." **Still to do:** hand webs drop-in copy for the four report (PDF) endings.


| Date | State |
|---|---|
| 2026-08-20 | **Homepage design-polish pass (branch `claude/uc-website-design-polish-uuee5t`).** webs read the site next to studio w labs and felt it looked flat, and worried that leading a mature buyer with the assessment reads as presumptuous. Three moves, all layout/CSS, no copy changed: (1) **Reordered the homepage** so Design/Build/Ship ("Where are you stuck?") now leads directly under the hero and the "How Healthy Is Your Digital Forest?" assessment follows it, so the buyer self-selects by problem before being offered the free asset. New order: hero, offerings, assessment, positioning, how-we-work, closing CTA. (2) **Promoted the offerings block:** it sits on a subtly raised band (`--bg-secondary`) with a hairline base rule, larger problem statements (`--text-md`), and more column spacing, using type and whitespace only (no cards, no accent bars, honoring the standing anti-slop rule). (3) **Added a faint "canopy" vine watermark** on the warm hero bands and the deep-olive act blocks (assessment card + every page's closing CTA), applied as a CSS mask so its color is a themeable token (`--texture-ink` adapts per theme; `--texture-ink-on-act` stays pale on the dark act blocks) at 5–6% opacity, decorative and aria-hidden, so no text-contrast pair shifts. Also bumped the home hero headline to the display size the type scale already named for it (`--text-4xl`, extrabold) for more presence. Build + lint clean; verified in both themes with screenshots. **Open for webs (her call, easily reverted):** the reorder demotes the assessment from the funnel's rung-1 lead position (see "The ladder"); confirm that is the intent. Not touched: the hero's closing line "A few questions will tell you how serious it is" still points at the assessment, now one section below; reads fine, flag if you want it retuned. Additional designer proposals not yet built are in the session summary. |
| 2026-08-20 | **Hero brand mark added (same branch).** Diagnosed the gap against studio w labs: the biggest "flat" driver was that the hero had no focal graphic (swl anchors its hero with the hexagon badge); the deeper one is that UC spends its whole palette inside one olive family, so nothing pops (swl runs a cream/navy/orange triad). Built the fix for the first: the site's tree line-art now renders as a solid olive emblem on the right of the hero (two-column on wide screens, hidden on phones), via a mask so its color is a theme token (pale `--brand-primary` on the deep-olive canvas, deep olive on the cream light theme). Decorative, aria-hidden, reuses the already-imported `treeIcon` asset. webs approved the mark and vetoed a nav utility strip. **Still open (webs's call):** whether to introduce a warm counterpoint color to break the olive-on-olive flatness, and the other proposals (hover elevation, editorial "How we work", display serif). Build + lint clean; checked both themes. |
| 2026-08-20 | **New vine texture + warm-accent prototype (same branch).** (a) Replaced the canopy watermark tile: the old two-sprig motif read as vertical "musical notes"; the new `--texture-canopy` is a leafy vine (meandering stems, small leaves, berry clusters) that tiles as allover foliage, closer to the references webs sent. Same mask technique, themeable via `--texture-ink`; mask-size 220px, opacity 0.06. (b) **Warm-accent prototype** to break the olive-on-olive flatness: added `--accent-warm-text` (terracotta `#e8a87c` dark / `#8a4a1f` light, both AA on their grounds — 7.5:1 canvas, 6.1:1 cream) and applied it to section eyebrows and the offering link arrows. Added a "What we do" eyebrow over "Where are you stuck?" so the accent is visible on home and the section is signposted like the assessment block. **Awaiting webs:** keep or drop the warm accent, and confirm the added "What we do" eyebrow copy. Build + lint clean; both themes checked. |
| 2026-08-20 | **Designer + product-steward review passes run on the TPM pass; fixes applied.** Both passes reviewed the home band, About opener, and Design/Build/Ship offer pages. Fixed: the colored left edge-accent bar on the offer `.offer-problem` quote (standing anti-slop rule); offer-page grid capped to 2 columns so the who/problem/impact/cost/proof/how-it-works argument keeps reading order; POV parallelism (Design hook now first person like Build/Ship); missing contractions in the offer CTA and Design engagement; a false-contrast fail ("not off a form") in the Design engagement; long Build/Ship `whoFor` sentences split; sentence-case headings ("Who we are", "How we work", "Technical capabilities", "Industry expertise", "Human-centric"); the "empowered" blocklist word in the Flourish step; and the slop closing CTA ("Ready to Grow Together? / transform your ideas into reality") rewritten in peer-diagnosis voice ("Not sure which of these is you?"). Also removed the now-redundant offerings-section "/contact" button (the three door links carry that rung; one contact CTA remains at page bottom). **Open flags for webs (not changed, awaiting her call):** the About line "there aren't many of us who do this well" (PS reads it as self-certifying; it is webs's own manifesto line); the positioning band's two-archetype edge ("Neither leaves you better off"; deliberate, webs-approved, flagged only against the note's "skip the villain"); and the Build proof "within a month or two" time claim (confirm it holds for both turnarounds). Remaining title-case sweep (About bottom CTA, a few labels) and adjacency slop noted for a later full-page gate pass. Preview deploy still held per webs. |
| 2026-08-19 | **TPM-forward positioning + offer pages.** Adopted TPM-forward positioning (Path A, buyer unchanged; see the TPM section above and `review/tpm-positioning.md`). Shipped the home positioning band and the About identity opener (webs's own manifesto folded in), all through the voice gate + `copy-that-moves` + PS voice. Then built the "work with me" rung: `offersData.js` renamed to Design / Build / Ship, price pulled to intake-only, `OfferPage.jsx` de-priced, homepage buckets wired to the offer pages. Fixed a rendered em dash in `Apply.jsx`. Build + lint clean throughout. **Flag for webs:** three rendered em dashes remain in `quizData.js` result copy (lines ~72/74/83), a voice-gate fail slated for the quiz surgical pass. |
| 2026-08-14 | Pivoted from copy workshop to funnel redesign. HANDOFF created. Brand/voice read complete. Prior copy work (hero direction, 20-line artifact, comms guidelines) committed on this branch. |
| 2026-08-14 | Read all four fire reports. **All decisions resolved (D1–D4).** Inputs from webs: font = Overpass; prices in-house except $50 office hours; forcing function + two buyer drivers captured. Build order set. Next: build rung destinations (Q&A + Office Hours pages). |
| 2026-08-14 | Reports stay as-is: deep + generic. Free/paid line = the step-by-step remediation sequences (90-day, 6-month) read as "what the engagement does," not a DIY manual. |
| 2026-08-14 | **Voice gate signed off and stored at `design-system/VOICE.md`.** All website copy passes through it. Rules are defaults; webs approves exceptions (logged in the file; first entry: "physics, not failure"). Ready to build pages. |
| 2026-08-14 | Built **Office hours page** (`/office-hours`, rung 3). Copy approved (opener: "There's a problem you can't take to your team or your boss. Bring it here."). External booking link with new-tab cue + print style; at-a-glance table; free-Q&A fallback. |
| 2026-08-14 | Built **Q&A page** (`/questions`, rung 2) + `api/questions.js`. Copy approved. Hands off to office hours (no dead-end). Both rung destinations exist and cross-link. Nav wiring deferred to the homepage/IA pass. |
| 2026-08-14 | Q&A backend **wired**: `api/questions.js` posts form-urlencoded `entry.*` to the Google Form's `/formResponse` (form id `1FAIpQLSd5HTS0VYZR4NDR5iRnz1Ecg3gUeJ0-un-45Pfs8bLmbb9i6Q`). No env var, no Apps Script. Entry map: stuck `1540066254`, product `18696469`, stage `1644200461`, share `1252682430`, name `896079231`, email `1885750161`. Email is now a normal required question (built-in collection off). Radio option text matched to the form exactly (stage: Idea/Building/Launched/Growing; share: "Yes, use my name" / "Yes, keep me anonymous" / "No, just answer me privately"). Form's Stage/Product/Name must stay OPTIONAL to match the UI. **Still to verify:** a real submit on preview/prod lands a row in the form (the sandbox proxy blocks outbound Google, so it can't be tested from here). |
| 2026-08-17 | **Accessibility ("signs") page contrast audited (build order item 6).** Computed WCAG ratios for every text/background pair on `/accessibility` in both themes against the current tokens. All clear AA: hero and body 8:1+, links ~7–8:1, the only sub-6 value is the muted "last updated" line at 5.21:1 dark / 5.41:1 light (still above the 4.5 AA floor). The original bug reads as resolved by the color-token overhaul; no code change made. Flagged for webs to confirm the specific line if one still looks low. |
| 2026-08-19 | **Renamed "quiz" → "assessment" and killed the back-to-back CTA on the homepage.** Route is now `/assessment` (`/quiz` redirects, so old links survive); nav and homepage links updated; visible copy ("Take the quiz", "Retake the quiz") now reads "assessment". The homepage had two identical "Take the assessment" buttons stacked (hero + the "How Healthy Is Your Digital Forest?" section); per webs, dropped the hero button so the hero is a clean hook and the purpose-built assessment section owns the single CTA. Internal component/file names (`Quiz.jsx`, `quizData`) left as-is. Build + lint clean. |
| 2026-08-19 | **Session wrap-up: dedicated contact form + dead-code + doc refresh.** (a) `CONTACT_KIT_FORM` now points at the dedicated Kit "Website contact" form `9821838` (name/business/message fields), so contacts stay off the newsletter list. **webs action still open:** publish that Kit form, and turn on Kit's new-subscriber notification (Kit can only ping; the message body lives on the subscriber record — webs ruled out Resend/Sheets). (b) Deleted the dead, unrouted Advisory/Implementation/Values page components + CSS. (c) Removed the now-unused `.home-hero-cta` CSS. (d) Refreshed this HANDOFF: Process, deploy note, brand/canvas line, nav/IA, homepage notes, and build order all brought current. Build + lint clean. |
| 2026-08-19 | **Contact form fixed: switched from the Google Sheet webhook to Kit.** The form was erroring on the live build because `/api/contact` needed a `CONTACT_SHEET_WEBHOOK_URL` (Apps Script) env var that was never set. Rewrote `api/contact.js` to subscribe to a public Kit form, carrying name/business/message as Kit custom fields — no env var, no Google Sheet. Removed the stale env var from `.env.example`. (Superseded same day by the dedicated form `9821838` — see the wrap-up entry above.) |
| 2026-08-17 | **Olive palette adopted, light + dark (`tokens/colors.css`).** webs reviewed a live palette-switch artifact and chose the warm-olive identity. Mapped dark + light olive into the semantic token layer; nav goes olive (`#5b5c1f` dark, deep `#1c2902` light), canvas/card/text/accent all olive, lime action button shared across both modes so it reads as one brand. Warm light mode uses cream `#f4f2e4` and a pale-olive band, deliberately not grey/white. Severity fire ramp left untouched. `.nav-submenu` (retired) repointed off the raw forest ramp. Every pairing verified AA; build + lint clean. Raw `--forest-*` ramp relabeled legacy; specimen `foundations.html` refresh left as a follow-up. |
| 2026-08-17 | **Font docs squared with the code (build order item 7).** The tokens already shipped Overpass; the docs lagged. Updated `design-system/README.md` (source-materials table + type note), `SKILL.md`, the comments in `tokens/fonts.css` and `tokens/typography.css`, and the standalone `foundations.preview.html` specimen (which was still loading Hanken Grotesk) to all read Overpass. Left the one-file revert note in `fonts.css` naming Hanken on purpose. Build + lint clean. |

---

## TPM-forward positioning (decided with webs, 2026-08-19)

UC is repositioning as a **technical-product-management-forward consultancy**. Full plan in
`review/tpm-positioning.md`. The four locked calls:

- **Path A:** TPM is the connective identity and method *over* Design / Build / Ship. Not a
  recut of the offers, not a fourth door.
- **Buyer unchanged:** the stuck-team / behind-project leader (CTO, VP Eng). TPM is the
  differentiated *how*, and the champion (TPM / PO) who carries us in.
- **Visibility:** the TPM label is **named openly in the identity layer** (About,
  positioning, how-we-work) and **shown, not named, on the storefront** (the problem-framed
  doors, where the buyer self-selects).
- **Rejected:** the PE / VC segment, gainshare, and equity commercial models (off-brand;
  the commercial models are out of scope for the site).

**Internal talk-track** (how staff describe UC): lives as a Google Doc in the "The Understory
Collaborative" Drive folder, "How to talk about Understory Collaborative (internal
talk-track)". webs asked for it in Docs rather than the repo, so it is not tracked here. Open
items in it: lead proof per offer, and confirming the senior-only staffing line.

The wedge: the rare generalist strategic enough to sequence the whole product and technical
enough to read the pull request, who leaves the team stronger instead of dependent. webs's
full TPM responsibility list (portfolio strategy, integration sequencing, consolidation, GTM,
enablement, market strategy, vendor ecosystems, lifecycle and deprecation) serves as **proof
of range** and **intake-qualified scope**, never a storefront menu. Next: webs reacts to the
positioning note; then a gated copy pass (home positioning band, About identity).

## Offering trio (resolved with webs)

Framed as customer problems, not services: **Design · Build · Ship** = *what to build · how to build it · how to ship it*.
- **Design** — what to build (scope, the right first version).
- **Build** — how to build it (the team / execution).
- **Ship** — how to ship it (release cadence, automation, AI, practices). "Accelerate" is this bucket's benefit line, not its label.

This RE-CUTS the old three doors (delivery-rescue / team-turnaround / AI) along the lifecycle. Offer-page depth (proof, pricing in `offersData.js`) must be remapped onto Design/Build/Ship when the "work with me" rung is built. These three also collapsed the old Advisory / Implementation pages (now deleted); Values + About fold into the homepage/About.

## Positioning: practical, not shiny

UC's wedge against the big consultancies (Thoughtworks / Deloitte tier): they sell the shiny new build; UC gets what you already have running right. webs's metaphor: not a Bugatti, but fixing the alternator and repainting the Celica. Consistent with UC's prior Advisory positioning (page now deleted, line preserved here): "we will not sell you a rebuild you would then pay to run, secure, and maintain."
- On the SITE: express the contrast WITHOUT naming competitors (naming reads insecure / invites trouble).
- The car metaphor is vivid but off the forest/fire brand and the voice gate ("metaphor subtle, never literal"), so use it as a deliberate one-off or state plainly. TBD with webs.

## Build order (bottom-up, so no CTA points to a missing page)

1. ~~**New rung destinations first:** Q&A page + Office Hours page.~~ **DONE.**
2. **Rewire endings:** ~~quiz results screen~~ **DONE** → the four report (PDF) endings still need drop-in copy handed to webs.
3. **Quiz/assessment surgical edit** (NEXT): add the bus-factor axis; keep the 6-question spine; results route to the severity engagement pattern. Also fix the intro gate issues (blocklisted "read", ad-fragments, the "Six questions" count once the question is added).
4. **Homepage:** two on-ramps — champion (mastery, free rungs) and exec (behind project + the team question, paid tiers). One CTA per section. (Hero, Design/Build/Ship, nav done; the ladder/on-ramps section is what's left.)
5. **"Work with me":** ~~remap `offersData.js` onto Design/Build/Ship~~ **DONE (2026-08-19).** Offers renamed Design / Build / Ship, mapped to the delivery-rescue / team-turnaround / AI stories; price pulled to intake-only (no public number, per D3); `OfferPage.jsx` price block replaced with "How the engagement works"; homepage buckets now link to `/offers/design|build|ship` (rung no longer orphaned). All copy run through `VOICE.md` + `copy-that-moves` + PS voice. **Still open:** intake qualifies domain + scope (premium tone, not a nitty-gritty form); severity-engagement-pattern framing not yet woven in.
6. ~~**Fold/retire** Advisory + Implementation~~ **DONE** (redirects in place; dead components deleted 2026-08-19). ~~Fix the **Accessibility ("signs") page contrast** bug~~ — audited 2026-08-17, all text clears AA. **Open:** confirm the About/Values fold (does About stay or fold onto the homepage?).
7. ~~**Font docs:** README + SKILL.md → Overpass.~~ **DONE** (2026-08-17).
8. **Reviews:** designer + product-steward passes on key pages.
9. **Deploy** is continuous now: each change PRs into `preview`. (No single final PR — `preview` is the live host build.)

Also settled this cycle, outside the original order: **olive palette** (site + design-system docs), **quiz → assessment** rename, **contact form on Kit**. See the status log.

Every step: small commit, update this file in the same commit, PR into `preview`.
