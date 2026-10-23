# "What's On Fire?" — Self-Assessment Quiz

## Overview

A 6-question multiple choice quiz that helps engineering and technology leaders self-diagnose the state of their technical health. Ungated. Results map to one of 4 crisis types, each with a corresponding white paper offer (gated by email).

**Voice:** Peer-to-peer. Like a seasoned CTO friend asking you honest questions over coffee. Not a vendor checklist.

**Target audience:** CTOs, VPs of Engineering, technical founders, heads of platform. This predates the 2026-10-08 buyer decision (non-technical founders and leaders first, engineering leaders second), and the personas are being rebuilt.

---

## Questions & Answer Options

### Question 1: What percentage of your customers escalated a problem last year?

*What this measures: Whether your communication infrastructure is working — escalations are a signal that something upstream failed. The ratio of escalations to total customers normalizes for company size naturally.*

- **A.** Less than 5%.
- **B.** 10–20%.
- **C.** 30% or more.
- **D.** We don't know.

| Answer | Points |
|---|---|
| A | 1 |
| B | 2 |
| C | 3 |
| D | 4 |

---

### Question 2: How often do you release to production?

*What this measures: Deployment confidence — the ability to move without fear.*

- **A.** Multiple times a day or on-demand.
- **B.** Weekly or bi-weekly on a regular cadence.
- **C.** Monthly, sometimes less. We batch things up.
- **D.** It varies. Releases are a big event and sometimes they slip.

| Answer | Points |
|---|---|
| A | 1 |
| B | 2 |
| C | 3 |
| D | 4 |

---

### Question 3: Something breaks in production right now. It needs a code fix. How long until that fix is live?

*What this measures: The real pipeline speed when it matters most.*

- **A.** Under an hour. We have a clear hotfix path.
- **B.** Same day. We'd need to coordinate but it would happen.
- **C.** A day or two. There are approvals, environments, and testing to get through.
- **D.** Hard to say. It depends on who's available and what else is in flight.

| Answer | Points |
|---|---|
| A | 1 |
| B | 2 |
| C | 3 |
| D | 4 |

---

### Question 4: A customer offers you a multi-million dollar deal. It requires custom work. What's the first thing that happens?

*What this measures: Revenue discipline — not whether custom deals create maintenance burden, but whether the organization has the discipline to ask questions before taking the money. Companies that say yes first and ask questions later build things only one customer uses, capture the inbound value, then carry the maintenance cost forever.*

- **A.** We'd need to understand what they're actually asking for before we could answer.
- **B.** We'd figure out how to make it work.
- **C.** We'd take it. That's a lot of money.
- **D.** We'd already be planning the implementation.

| Answer | Points |
|---|---|
| A | 1 |
| B | 2 |
| C | 3 |
| D | 4 |

---

### Question 5: Think of a bad idea you've had. Among the people you currently work with, name the specific individuals who would tell you it's a bad idea. How many can you name?

*What this measures: Psychological safety and intellectual honesty — communication as infrastructure. If nobody pushes back on bad ideas, every other problem on this list compounds unchecked. Naming specific people is the gate — it keeps the answer honest. And if you can't think of a bad idea you've had, that's an answer too.*

- **A.** I'm struggling to name anyone.
- **B.** 1 person, maybe.
- **C.** 2–3 people. A small circle, but they're honest with me.
- **D.** 4 or more. I can name them right now.

| Answer | Points |
|---|---|
| A | 4 |
| B | 3 |
| C | 2 |
| D | 1 |

---

### Question 6: If you had a magic wand and could change one thing about your technical environment, how big is that change?

*What this measures: Where the existential pain lives. The answers are calibrated by magnitude, not by specific technology — because the person taking this knows their own landscape better than we do. Consider adding a free-text capture ("What would you change?") or encouraging a screenshot of their answer for their own records.*

- **A.** It's a nice-to-have. Things are working, I'd just polish the edges.
- **B.** It's a meaningful improvement. There's something specific holding us back and I know what it is.
- **C.** It's a major overhaul. I'd rip out and replace a significant part of how we work.
- **D.** I'd start over. What we have isn't going to get us where we need to go.

| Answer | Points |
|---|---|
| A | 1 |
| B | 2 |
| C | 3 |
| D | 4 |

---

## Scoring

Total points across all 6 questions:

| Score Range | Crisis Type |
|---|---|
| 6–9 | Brush Fire |
| 10–14 | Smolder |
| 15–19 | Crown Fire |
| 20–24 | Firestorm |

---

## Results Screen (per crisis type)

Each result shows:
1. The crisis type name and a one-paragraph description
2. What the signals mean (reframing their answers back to them)
3. A CTA: "We wrote a field guide for this." — email capture for the corresponding white paper

See Drive: Business / Offers / Crisis types and white papers for full crisis type descriptions and white paper outlines.

---

## Anonymous Analytics to Capture

- Total quiz completions
- Distribution of final crisis types (which type is most common)
- Answer distribution per question (which answers are most selected)
- Drop-off rate per question (are people abandoning mid-quiz)
- Conversion rate from result to white paper download (email capture)

No PII collected in analytics. Email capture is a separate, optional step.

---

## Design Notes

- **Q5 is intentionally inverted.** A is the alarming answer, D is the healthy one. This prevents autopiloting to A as the "good" answer. Scoring is reversed to match (A=4, D=1).
- **Q4 is a hypothetical but the answers are behaviors, not judgments.** The question tests whether the org asks questions before taking money. "We'd figure out how to make it work" and "We'd already be planning the implementation" both sound positive and proactive — but they skip the step of evaluating whether to do it at all. The only healthy answer is the one that starts with understanding what's being asked.
- **Q1 uses a customer-to-escalation ratio** rather than absolute numbers or company headcount. Number of escalations is a proxy for customers with problems — ratioing that against total customers normalizes for company size naturally. A company with 200 escalations out of 500 customers is in a fundamentally different place than 200 out of 50,000. The D answer ("we don't know the ratio") is arguably the most telling — if you're not tracking it, you can't manage it.
- **Q6 answers are calibrated by magnitude, not specifics.** "Rebuild our deployment pipeline" is a specific scenario that won't resonate with everyone. "Rip out and replace a significant part of how we work" is universal.
- **Communication as infrastructure** is the deeper thesis connecting Q1 (escalations = communication failure signal) and Q5 (psychological safety = communication infrastructure). This framing may be worth surfacing in the white papers.

## Open Questions

- Do we want a "share your results" option? Could drive organic traffic but might feel gimmicky.
- Should question order be fixed or randomized? Fixed creates a narrative arc (symptoms > discipline > culture > existential). Randomized prevents pattern gaming.
- Do we want a progress bar? Probably yes for 6 questions — it sets expectations.
- **Q6 free-text capture:** Should we add an optional "What would you change?" text field? Or just encourage a screenshot? Free text gives us richer data but adds friction. Screenshot is low-friction but we don't capture it.
- **Q4 edge case:** What if they've never taken a big custom deal? Do we need a "this hasn't happened to us" option, or is that rare enough in our target audience to ignore?
