# TPM competency assessment (working draft)

> **Status: provisional. Not psychometrically validated.**
> This is a theory-based draft instrument for **development, not selection.** Use it to
> coach and to decide where an engagement starts, never to hire, promote, pay, or fire.
> The question set below is an illustrative item pool, not a finished, scored test.

A draft to react to. Where a real choice is open it says **[webs decides]** rather than
guessing. Companion to `review/tpm-positioning.md` (the slider: who leads, us or them). The
research contribution behind this lives with the dissertation in the friday repo, pointer at
`research/dissertation/applied-tpm-assessment.md`.

---

## Why this exists

To build TPM capability in a client's people (or to set the leadership slider on an
engagement), we need to know where each person starts. That means assessing capability with
something better than gut feel. This drafts that something, grounded in two validated
frameworks plus one we argue is missing.

---

## Two tiers: free lead-gen, paid depth

The assessment is UC's funnel, top to bottom.

| Tier | What it is | Rung |
|---|---|---|
| **Free self-check** | A short, self-report reflection. Built at `/tpm-self-check` (hidden). Measures the five teamwork competencies and a metacognition read, then **derives** the five delivery-craft levels and shows a radar plus one place to focus. | Rung 1: free asset that pulls toward connect |
| **Paid assessment** | The full three-layer instrument used properly: direct craft measurement, a 360, real delivery artifacts, observed work, and the validation track. For a person or a whole team. | "Work with me" |

The free tool also demonstrates the method, which proves competence better than a claim
(the brand's "samples prove it" rule). It never dead-ends: it closes on office hours and
the paid depth.

## The mechanic (free tier)

An analogy, not a literal game: teamwork competencies **feed** the delivery skills, and
metacognition **amplifies** how consistently those skills show up. So the free tool only
asks about the competencies and metacognition; craft levels are computed:

- `craft level = mean(feeding competencies) × metacognition amplifier` (amplifier maps a
  1-5 metacognition mean onto ~0.85-1.15), clamped to 1-5.
- Feeding edges (change control ← handling disagreement + communicating clearly; risk ←
  solving problems together + planning and coordinating; financial ← planning and
  coordinating + setting goals; reporting ← communicating clearly + handling disagreement;
  value ← communicating clearly + setting goals).
- Reverse-coded items are mixed in and inverted at scoring; the item order is shuffled so
  the structure is not announced; no raw number is shown, only a shape and a plain-language
  read. All item wording and growth guidance in `src/data/tpmSelfCheckData.js` is a draft
  for webs to own.

Deriving craft (rather than asking it directly) is a free-tier choice: it keeps the tool
short and kills the single-item-per-construct problem. Direct craft measurement belongs to
the paid tier.

---

## The three-layer model

Capability is not one list. It is three layers, and they sit under each other. The craft is
what you see; the lower layers explain whether someone can sustain it and adapt it.

| Layer | Source | What it is | Assessed how |
|---|---|---|---|
| **Delivery craft** (the visible output) | the client lead's five | change control, risk, financial, stakeholder reporting, value articulation | self-report **plus** artifacts and observed work |
| **Teamwork competency** (how you operate with others) | Stevens & Campion (1994) | conflict resolution, collaborative problem solving, communication, goal setting, planning and coordination | self-report plus light 360 |
| **Metacognition** (the self-regulation engine) | Schraw & Dennison MAI (1994) | knowledge of cognition; regulation: planning, information management, monitoring, debugging, evaluation | self-report, triangulated |

### Why metacognition is a layer, not a sixth competency

Stevens and Campion's five are interpersonal and self-management behaviors. They quietly
assume the person can regulate their own thinking, then do not measure it. Metacognition is
that regulation. It is what lets a TPM notice the risk register has gone stale, the status
report is rosier than reality, or the value story is not landing, and change course. The
industry wants a "confidently repeatable process that still adapts to context," and adapting
a process to context **is** conditional knowledge plus monitoring plus debugging plus
evaluation. So metacognition is not a peer of the other five. It is the layer beneath them.
Framing it as a superordinate layer is also cleaner psychometrically: its items should load
as their own higher-order factor rather than muddying the teamwork factors.

---

## The draft question set (illustrative item pool)

> **Note:** this pool measures the craft skills *directly*, which is the **paid-tier**
> direction. The built **free** self-check does not use these; it asks about competencies
> and metacognition and derives craft (see "The mechanic" above). Kept here as the seed for
> the paid instrument's direct-measurement items.

**Response scale:** 5-point agreement (1 = strongly disagree, 5 = strongly agree). A Likert
scale gives more information than the MAI's original true/false, which matters for any later
factor analysis. All items are self-report and written for the engagement context (not the
MAI's student wording). Items are our own, written to the constructs, so nothing is lifted
from a licensed instrument.

**These are drafts to cut, keep, or reword.** Three per construct is a starting pool, not a
final set.

### Layer 1: Metacognition

**Knowledge of cognition**
1. I have a clear read on my own strengths and blind spots as a delivery lead.
2. I know which of my methods tend to work, and I reach for them on purpose.
3. I can tell when an approach fits the situation in front of me and when it does not.

**Regulation: planning**
4. Before I take on an engagement, I think through what I need to learn about this client's context.
5. I set specific goals for a piece of work before I start it.

**Regulation: information management**
6. I organize what I am hearing on an engagement so the signal does not get lost.

**Regulation: comprehension monitoring**
7. While an engagement is running, I regularly check whether my read of the situation still holds.

**Regulation: debugging**
8. When my approach stops working, I change it rather than push harder on it.

**Regulation: evaluation**
9. After a milestone, I ask whether my approach actually worked, not only whether we hit the date.

### Layer 2: Teamwork competency (Stevens & Campion)

**Conflict resolution**
10. I can name a disagreement openly and keep it about the work, not the people.
11. I push back on a bad decision without damaging the relationship.

**Collaborative problem solving**
12. I can tell when a problem needs the whole group and when it does not.

**Communication**
13. I adapt how I explain things to whoever I am talking to, from an executive to an engineer.
14. People leave my updates knowing what is true and what to do next.

**Goal setting and performance management**
15. I set specific, challenging goals for the work and track against them.
16. I give people direct, usable feedback on how the work is going.

**Planning and task coordination**
17. I keep roles, handoffs, and workload clear across the people on an engagement.

### Layer 3: Delivery craft (the client lead's five)

**Change control**
18. When scope shifts, I make the tradeoff explicit and vetted before we agree to it.

**Risk management**
19. I keep a live view of the real risks to the engagement, not a checkbox list.

**Financial management**
20. I know the numbers on both sides, our cost and the client's budget, and I can read the burn.

**Stakeholder reporting**
21. My status reporting reflects reality, including the parts people would rather not hear.

**Value articulation**
22. I can state the value we are delivering in the client's own terms and metrics.

### The evidence companion (do not skip)

Self-report has a ceiling, and for metacognition it is circular: the people weakest at
self-monitoring are the worst at rating it. So every delivery-craft item pairs with a real
artifact, reviewed alongside the self-rating:

| Delivery skill | Artifact to review |
|---|---|
| Change control | the change log and scope baseline |
| Risk management | the live risk register, and whether flagged risks matched what happened |
| Financial management | the engagement financials and burn |
| Stakeholder reporting | recent status reports, and whether stakeholders felt informed |
| Value articulation | the value narrative, and whether it is tied to the client's own metrics |

Add a light 360 (a peer and the person's lead) for the teamwork layer. The full picture is
self-report, plus artifacts, plus observed practice on live work, which is also where the
slider starts.

---

## Rules of use (read before this touches a real person)

**Psychometric**
- Validity is bound to construct and population. The MAI is validated for metacognitive
  awareness in learners; Stevens (1999) validated a 35-item test for teamwork KSAs. Neither
  is validated to measure TPM engagement-leadership skill. We cannot inherit their validity
  for a new construct or population. This instrument is new, so it is unvalidated until we
  validate it.
- Report reliability (Cronbach's alpha or McDonald's omega) per subscale on our own sample
  before trusting any subscale score.

**Legal and ethical**
- **Development, not selection.** The moment a client uses this to hire, promote, pay, or
  fire, it becomes a selection instrument, and in the US that triggers the EEOC Uniform
  Guidelines and Title VII: it must be demonstrably job-related and validated or it is
  adverse-impact liability, for the client and for UC. Keep it formative. That is also the
  brand: we teach, we do not gatekeep.
- **Licensing.** The MAI is generally free for research and education with citation; the
  Teamwork-KSA Test is proprietary. Constructs (ideas) are not copyrightable; items are. We
  write our own items, so we stay clear.
- Informed consent, confidentiality of scores, competent administration and feedback.

---

## Two tracks

**Practice track (what UC uses now).** A theory-driven, rationally grouped, behaviorally
anchored rubric, used formatively and stamped "not validated." Every engagement that uses it
is data for the research track.

**Research track (what earns the word "validated," longer horizon).**
1. Define the construct: TPM engagement-leadership competency, with the lead's five as the criterion.
2. Write a behaviorally anchored item pool across the three layers (our own items).
3. Content validity: an SME panel maps items to intended competencies; keep the agreed ones.
4. **EFA** to see how items actually cluster (the real "regroup"), then **CFA** to test the structure; report alpha or omega per factor.
5. Criterion validity: correlate or regress the factors against rated TPM delivery performance (supervisor and client ratings of the five). That earns "aligns with TPM skills."
6. Reality check: EFA and CFA want roughly 5 to 10 respondents per item and a stable sample (often 200-plus). Not reachable inside one engagement, so this is a program, not a per-client step. It may be publishable, which loops back to the dissertation.

---

## Can we test it on ourselves (the UC team)?

Yes, and it is the right first move, as long as we are clear on what it does and does not do.

**What it gives us (pretest and dogfood):**
- Face validity: do the items read as real to working TPMs.
- Cognitive pretesting: have each person take it, then debrief item by item. Which items
  were ambiguous, which felt irrelevant, did the score match their self-image. This is how
  we cut and reword.
- A rough signal on wording and coverage, and the experience of taking and scoring it.
- A team-development conversation, which models the formative, non-gatekeeping use.

**What it does not do:**
- It does not validate anything. UC is small, so N is tiny, and the sample is not
  independent (we built it, and we are all already skilled, so range is restricted). No
  factor analysis, no norms come out of this. It is pretest, not validation.

**Suggested pilot:** each UC person takes the draft, scores it, then a 30-minute debrief on
the items themselves. Output is a cleaner item pool, not a score anyone should trust yet.

---

## Sources

- Stevens, M. J., & Campion, M. A. (1994). The knowledge, skill, and ability requirements for teamwork. *Journal of Management*, 20(2), 503-530.
- Stevens, M. J. (1999). Teamwork-KSA Test; validation against supervisor and peer ratings.
- Schraw, G., & Dennison, R. S. (1994). Assessing metacognitive awareness. *Contemporary Educational Psychology*, 19, 460-475.

---

## Open decisions

- **[webs decides]** Response scale: 5-point agreement (recommended) or keep the MAI's true/false.
- **[webs decides]** How many items per construct in the real draft (this pool has three or fewer).
- **[webs decides]** Whether the practice-track rubric is client-facing or an internal UC tool only.
- **[webs decides]** Whether to run the research track as part of, or after, the dissertation.
