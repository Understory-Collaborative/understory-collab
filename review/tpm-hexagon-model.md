# The TPM hexagon (working draft)

> **Status: provisional. Not psychometrically validated.**
> A theory-based model for **development, not selection.** Use it to coach and to place a
> person in a strengths profile, never to hire, promote, pay, or fire. Every axis has a
> research literature behind it; none is validated for technical product managers
> specifically, so the same caveat as the current tool holds.

The revamp of the TPM self-check. It replaces the five-competency public framing with six
durable skills arranged as a hexagon, keeps metacognition as the layer beneath them, and
keeps product skills as the applied layer on top. Companion to
`review/tpm-competency-assessment.md`, which still holds the paid-tier depth, the rules of
use, and the validation plan. Research pointer in the friday repo at
`research/dissertation/applied-tpm-assessment.md`.

The thesis this model exists to make legible: product owner, project manager, program
manager, product manager, and even software architect are archetypes of the same six
durable skills, so they are all technical product managers of different flavors. The
hexagon is the shared shape; the role names are the spikes.

---

## The three layers

Same layered logic as the current tool. What changed is the middle layer: five teamwork
competencies became six durable skills, drawn from a wider research base.

| Layer | What it is | In the quiz | Research base |
|---|---|---|---|
| **Product skills** (applied top) | developing roadmaps, financial management, market awareness, value articulation, go to market | derived, not asked | the durable skills feed these |
| **The six durable skills** (the hexagon) | tactical, strategic, technical, creativity, leadership & collaboration, communication | asked directly | March 1991; Jaques; Guest 1991; Amabile; Stevens & Campion 1994 |
| **Metacognition** (the under-layer) | self-regulation: does the skill show up under pressure | asked directly, scored as an amplifier | Schraw & Dennison MAI 1994 |

Product skills sit on the durable foundation because they are what the durable skills add up
to in practice. A person with the foundation can learn to build a roadmap; the roadmap
skill without the foundation is a template with nothing under it.

Metacognition stays a layer, not a seventh spoke, because it is the regulation that decides
whether the six show up consistently. This is the dissertation contribution, carried intact
into the new shape: metacognition is superordinate, not a peer of the six.

---

## The six durable skills

Each with webs's own description, the research anchor, and the one plain sentence a quiz
taker would recognize.

### 1. Tactical

**In the moment. Maximizing for right now. The stop-the-bleeding move.**

- Anchor: James March's *exploitation* (March, 1991, "Exploration and Exploitation in
  Organizational Learning," *Organization Science*). Exploitation is refining and executing
  what already works for reliable near-term returns.
- Reads as: when something is on fire right now, you make the call that stops the damage
  today, with what you have.

### 2. Strategic

**Rearchitecting the whole ship over several years.**

- Anchor: March's *exploration* (same paper): searching, experimenting, and taking risks
  for long-term payoff. Corroborated by Elliott Jaques's time-span of discretion (the
  organizational psychologist behind Stratified Systems Theory), where longer-horizon work
  is inherently more complex.
- Reads as: you can hold where the whole thing needs to be in three years and work backward,
  even when it costs you something today.

Tactical and strategic are a real tension in the research, not two flavors of the same
thing. March's whole argument is that organizations, and people, struggle to hold both.
That tension is what makes a hexagon shape carry meaning: most people spike one side.

### 3. Technical

**Understanding how to use AI, APIs, and technical architecture decisions.**

- Anchor: the T-shaped professional (attributed to David Guest, 1991, in *The Independent*),
  the deep technical stem under a broad collaborative bar. This is a practitioner concept,
  widely used and not a validated instrument, so it frames the axis rather than measures it.
- Reads as: you understand the technical tradeoffs well enough to decide, without needing
  someone to translate them for you.

### 4. Creativity

**So you can MacGyver things when you need to.**

- Anchor: Teresa Amabile's componential theory of creativity (Amabile, 1988, "A model of
  creativity and innovation in organizations," *Research in Organizational Behavior*):
  creative output is novel *and* appropriate to the goal, produced by creativity-relevant
  processes applied under constraint.
- Reads as: when the standard path is blocked, you improvise a solution that actually works,
  from what is on hand.

### 5. Leadership & Collaboration

- Anchor: Stevens & Campion (1994) teamwork KSAs, "The knowledge, skill, and ability
  requirements for teamwork," *Journal of Management*: conflict resolution, collaborative
  problem solving, and planning and coordinating.
- Reads as: you get a group to do its best work together, including through disagreement,
  and you know when a call is yours versus the group's.

### 6. Communication

- Anchor: Stevens & Campion (1994), the communication KSA.
- Reads as: you adapt how you explain things to whoever is in front of you, and people leave
  knowing what is true and what to do next.

---

## Deriving the product skills

Same mechanic as the current tool: `product skill = mean(feeding durable skills) ×
metacognition amplifier`, clamped to the scale. The feeding edges below are a **draft for
webs to confirm**; they are a design choice, not a research finding.

| Product skill | Fed by (draft) |
|---|---|
| Developing roadmaps | Strategic + Communication |
| Financial management | Tactical + Strategic |
| Market awareness | Strategic + Creativity |
| Value articulation | Communication + Strategic |
| Go to market | Communication + Leadership & Collaboration |

Deriving these instead of asking about them keeps the free tool short and avoids measuring a
skill with a single question. Direct measurement of product skills belongs to the paid tier,
same as before.

---

## Archetypes: the shape is the type

An archetype is read off the person's own hexagon, so one self-report is enough (the
2026-09-07 workshop steer: a profile, not more data). The dominant region of the hexagon
places the person; the complementary region names who strengthens them.

**This whole set is a draft for webs to own.** Per the assessment doc, the archetype set is
explicitly hers to decide. Below is a proposal built from the shape logic and the role
thesis, not a settled answer. The role mappings especially are editorial characterizations
webs should confirm or rewrite.

### The draft archetype set

Arranged so opposite axes sit across the hexagon: tactical opposite strategic, technical
opposite communication, creativity opposite leadership & collaboration.

| Archetype | Spikes | Role flavor (draft) | The one-line read |
|---|---|---|---|
| **The Firefighter** | Tactical + Creativity | rescue TPM | Stops the bleeding today, improvises when the standard path is blocked. |
| **The Architect** | Technical + Strategic | software architect | Holds the long horizon and the deep technical tradeoffs in one head. |
| **The Navigator** | Strategic + Communication | product manager | Sees where the product must go and makes the case for it in plain terms. |
| **The Conductor** | Leadership & Collaboration + Communication | program manager | Gets many teams moving together and keeps everyone knowing what is true. |
| **The Steward** | Tactical + Leadership & Collaboration | product owner / project manager | Keeps the team unblocked and the work moving, day to day. |
| **The Renaissance** | balanced, no single spike | the full TPM (the unicorn) | Native in all six; the shape the others are each a slice of. |

The Renaissance archetype is the thesis made visible: the neighboring roles are each a spike
off the same hexagon, and the rare balanced profile is the whole thing. It is also webs's
own shape, which the TPM domain doc already argues is a unicorn and a single point of
failure until the capability is built into a team.

### Pairing (strengths-first, not deficit)

The complement is the archetype that spikes your low axes. The wording is "here is who
strengthens you," never "go fix your weak area."

| Archetype | Teams up with (draft) | Because |
|---|---|---|
| Firefighter | Architect | now-and-improvise meets long-horizon-and-deep-technical |
| Navigator | Steward | strategy-and-story meets day-to-day execution |
| Conductor | Architect | orchestration meets technical depth |
| Renaissance | any | already balanced; pairs to add depth, not to fill a gap |

On the paid team tier this same set composes a team: who pairs with whom, and where the
group's mix is thin. That is the existing team-composition read, unchanged.

### Assignment rule (open)

How a shape becomes an archetype is a design decision still open:

- **Dominant pair** (drafted above): the top two axes name the type. Richer, role-like, but
  needs a tie rule and a "balanced" threshold for Renaissance.
- **Dominant single axis**: simpler, fewer types, less role-like.

**[webs decides]** which rule, and whether the archetype set is the six above or her own.

---

## What carries over from the current tool

- The two tiers (free lead-gen self-check, paid depth) are unchanged.
- The rules of use are unchanged and still bind: development not selection, unvalidated
  until validated, report reliability per subscale before trusting any subscale score. See
  `review/tpm-competency-assessment.md`.
- Metacognition as the amplifier under-layer is unchanged; it is the dissertation
  contribution and it survives the revamp.
- Reverse-coded items, shuffled presentation order, and no raw score shown all carry over.

## Open decisions

- **[webs decides]** The archetype set and their names (the six above are a draft).
- **[webs decides]** The role-to-archetype mapping (editorial, hers to confirm).
- **[webs decides]** The assignment rule (dominant pair vs dominant single axis).
- **[webs decides]** The product-skill feeding edges (the table above is a draft).
- **[webs decides]** Whether the current five-competency instrument is retired or kept as an
  internal cross-check during the switch.

## Sources

- March, J. G. (1991). Exploration and Exploitation in Organizational Learning.
  *Organization Science*, 2(1), 71-87.
- Jaques, E. Stratified Systems Theory and the time-span of discretion (work-complexity by
  time horizon).
- Guest, D. (1991). "The hunt is on for the Renaissance Man of computing." *The Independent*
  (origin of the T-shaped professional).
- Amabile, T. M. (1988). A model of creativity and innovation in organizations. *Research in
  Organizational Behavior*, 10, 123-167.
- Stevens, M. J., & Campion, M. A. (1994). The knowledge, skill, and ability requirements
  for teamwork. *Journal of Management*, 20(2), 503-530.
- Schraw, G., & Dennison, R. S. (1994). Assessing metacognitive awareness. *Contemporary
  Educational Psychology*, 19, 460-475.
