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
| D1 | Buyer + forcing function | **RESOLVED** | Two on-ramps, one ladder: champion (TPM/product owner) enters via free rungs and carries UC up; exec enters near paid tiers. Forcing function: still needed from webs. |
| D2 | One product or several; shared vs separate ladders | **RESOLVED** | One shared ladder. The three doors (delivery, team, AI) are the SCOPE of "work with me," not separate funnels. |
| D3 | Real rungs and prices, esp. paid entry | **RESOLVED** | $50 office hours (toe-in) + fixed-price audit / "sprint zero" rung above it, then scoped engagement. Actual prices TBC; may be non-customer-facing. |
| D4 | What the quiz/report assesses and produces | **IN PROGRESS** | webs: rethink quiz + reports together, driving both the questions AND the offer from the report content. Reading all four reports to propose a restructure. |

---

## Brand & voice (read complete)

- **Color-as-meaning (do not spend elsewhere):** lime `--action #8ed14f` = "click this" (primary button ONLY); deep green `--surface-act #35674a` = "we invite you to act" (conversion CTAs only). Forest `--forest-700 #2d5a3d` is the spine; nav stays forest in both themes.
- **Severity ramp** (`--severity-brush/smolder/crown/firestorm`) drives the quiz; always paired with the type name in text (never color alone).
- **Dark canvas default** (`#1a1a1a`), light theme under `[data-theme="light"]`. Flat by default; forest-tinted shadow only on hover; real 3px focus ring.
- **Headings sentence case** ("What we do"). Metaphor lives in words, never literal flames/parachutes.
- **Website voice:** "a seasoned CTO telling you the truth over coffee. Honest, plain, unhurried, never selling." Educate, don't pitch. Lead with the honest observation, not the offer.

### Open brand flags (need webs)
- **Font mismatch:** README/SKILL say Hanken Grotesk; `tokens/fonts.css` ships **Overpass**. Pick canonical, align docs + tokens.
- **House voice canon not in repo** (referenced at `review/brand-offer-foundation.md:30`, incl. any "no em dashes" rule). Get the real doc from webs; do not reconstruct.
- Many visual tokens (shadows, midtone ramps, warning/info) are marked `proposal`. Confirm which become real.

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

| Date | State |
|---|---|
| 2026-08-14 | Pivoted from copy workshop to funnel redesign. HANDOFF created. Brand/voice read complete (notes + open flags above). Four decisions (D1–D4) open, awaiting webs. Prior copy work (hero direction, 20-line artifact, comms guidelines) committed on this branch. |

---

## Next steps

1. Resolve D1–D4 with webs.
2. Finish brand kit + voice canon read.
3. Map every current page to a rung; find dead-ends and mismatched CTAs.
4. Build rung by rung, small commits, mirror to `preview`, update this file each commit.
5. Designer + product-steward review passes.
6. Open PR.
