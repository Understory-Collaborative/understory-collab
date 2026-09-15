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

The full arithmetic, from a single answer to the final archetype, with a worked example, is in
`review/tpm-scoring-math.md`.

---

## Archetypes: the recognizable people

An archetype earns a place because it is a person you would recognize the moment they walk
into a standup, not because a cell in a pair-grid needs filling. The set below is built from
how the skill-pairings actually manifest at work.

**This whole set is a draft for webs to own.** Per the assessment doc, the archetype set is
explicitly hers, and the role mappings are editorial characterizations she should confirm or
rewrite. The behavioral reads and the axis weights are illustrative starting points.

### The geometry, read as behavior

The hexagon's shape carries a real pattern: skills next to each other reinforce, skills
across from each other fight.

- **Adjacent skills are natural allies.** They co-occur, so their people are common and
  everyday. These make up the main roster.
- **Opposite skills are in tension** (March's whole argument about exploration and
  exploitation). Holding both is rare, so those people read as senior. They are full types
  you can be, just rarer ones, and the roster tags them as rare.
- **The pair is only the headline.** The rest of a person's shape flavors it, so nobody is
  flattened to two words and nobody is homeless.

### The everyday roster

Each is a headline pair, the behavior it shows up as, the role flavor, the research anchor,
and the complement who covers their weak region.

| Archetype | Headline | Who this is at work | Role flavor | Anchor | Teams up with |
|---|---|---|---|---|---|
| **The Operator** | Tactical + Technical | Gets paged and fixes it. Knows the system deep enough to stop the outage today. | senior engineer / tech lead | March exploitation; T-shaped depth | Navigator |
| **The Prototyper** | Technical + Creativity | "Let me just build it and show you." Spikes a working prototype over a weekend to prove the idea is real. | creative technologist / founding engineer | T-shaped; Amabile | Conductor |
| **The Firefighter** | Tactical + Creativity | Stops the bleeding today, and improvises when the standard path is blocked. | rescue TPM | March exploitation; Amabile | Navigator |
| **The Architect** | Technical + Strategic | Designs the system to last. Deep tradeoffs and the long horizon in one head. | software architect | T-shaped; March exploration / Jaques | Conductor |
| **The Visionary** | Creativity + Strategic | Reimagines where the product could go in three years, and sees a non-obvious path there. | innovation lead | Amabile; March exploration | Steward |
| **The Navigator** | Strategic + Communication | Sees where the product must go, and sells the multi-year bet in plain terms. | product manager | March exploration; Stevens & Campion | Operator |
| **The Conductor** | Communication + Leadership | Gets many teams moving together and keeps everyone knowing what is true. | program manager | Stevens & Campion | Architect |
| **The Steward** | Tactical + Leadership | Rallies the team through the crunch and keeps everyone unblocked, day to day. | product owner / project manager | Stevens & Campion; March exploitation | Visionary |
| **The Renaissance** | balanced, no spike | Native in all six. The whole shape the others are each a slice of. | the full TPM (the unicorn) | all six | any, to add depth |

The Renaissance is the thesis made visible: the neighboring roles are each a spike off the
same hexagon, and the rare balanced profile is the whole thing. It is also webs's own shape,
which the TPM domain doc argues is a unicorn and a single point of failure until the
capability is built into a team.

Operator and Firefighter are **sister archetypes**: both are Tactical-forward crisis
responders, coming at the same fire from opposite sides. The Operator resolves it through
deep system knowledge; the Firefighter improvises a way through. Kept as two, not merged.

Every axis is a headline in at least two archetypes, so no corner of the hexagon is starved.
Tactical and strategic each headline three, which fits: they are the ambidexterity core the
whole model turns on. With the Prototyper back, technical and creativity headline three as
well.

### The rare types: holding a tension

These are types you can be, just rarer ones. When someone spikes two *opposite* axes, they
are holding a contradiction most people cannot, so they read as senior. Holding all six is
the Renaissance. Each carries a **Rare** tag in the roster.

| Archetype | Tension | Who this is at work | Anchor |
|---|---|---|---|
| **The Captain** | Tactical + Strategic | Commands the crisis on deck and owns where the ship is headed over years, without trading one for the other. The senior TPM move. | March, organizational ambidexterity |
| **The Translator** | Technical + Communication | Native in the code, and can make an exec care about the invisible work. | the native-fluency case in the TPM doc |
| **The Catalyst** | Creativity + Leadership | Invents the wild idea and gets the team to actually commit to shipping it. | Amabile; team leadership |

### Assignment: nearest shape, not exact pair

A profile maps to the archetype whose shape it most resembles, not to whichever exact top-two
it happens to have. So a Creativity + Strategic person lands on the Visionary even if their
raw top-two is not a named pair, and we can report the strength of the match ("82% Visionary,
leaning Architect"). This is what closes the coverage gap: nobody is ever told their pairing
does not exist, because we never claim their raw top-two is a type.

**Decided (webs, 2026-09-14):** eight common types plus three rare, tagged **Rare**; the
Tactical + Strategic type is **The Captain**; Operator and Firefighter stay as sister
archetypes; the Prototyper is in for Technical + Creativity. **Open for webs:** the exact
behavioral wording and role mappings.

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
