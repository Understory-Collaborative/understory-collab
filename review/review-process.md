# Website Review Process — Understory Collaborative

This document defines the three review groups, their responsibilities, the review workflow, and how changes get approved before implementation.

---

## Review Groups

### Group 1: Marketing Review

**Focus:** Branding, messaging, and market positioning

**Charter:**
Evaluate the website through the lens of Understory's brand identity and the four target personas. Ensure every page communicates the right message to the right audience and drives toward meaningful engagement.

**Responsibilities:**
- Audit all page copy against the personas (see `personas.md`)
- Evaluate whether CTAs are compelling and appropriately placed for each persona
- Assess brand consistency: voice, tone, visual identity, and the Root-Rise-Flourish narrative
- Identify gaps in content (missing proof points, unclear differentiators, weak value propositions)
- Review case studies (using `case-study-template.md`) for persuasiveness and persona alignment
- Recommend new content: blog topics, case study subjects, landing page concepts

**Deliverable:** Marketing Review Report — a page-by-page assessment with specific recommendations, each tagged to the persona(s) it serves.

---

### Group 2: UX Review

**Focus:** Information architecture, navigation, and user experience

**Charter:**
Evaluate the website's structure, flow, and usability to ensure it guides each persona type from arrival to contact as efficiently as possible.

**Responsibilities:**
- Map the current information architecture and identify structural issues
- Evaluate navigation patterns: Can each persona find what they need in 2–3 clicks?
- Assess page hierarchy: Are headings, sections, and visual weight guiding attention correctly?
- Review responsive behavior across device sizes
- Evaluate accessibility implementation (WCAG 2.2 AA compliance, screen reader experience)
- Identify friction in the contact/conversion path
- Propose restructuring recommendations with wireframes or sitemap diagrams

**Deliverable:** UX Review Report — information architecture map (current vs. proposed), annotated page critiques, and prioritized restructuring recommendations.

---

### Group 3: Client Critique

**Focus:** Experiencing the website as a prospective client

**Charter:**
Each member adopts one of the four personas from `personas.md` and walks through the website as that person. Document the experience honestly — what builds confidence, what raises doubts, and what's missing.

**Responsibilities:**
- Each reviewer adopts a specific persona (ensure all four are covered)
- Walk through the site following that persona's likely entry point and journey
- Document first impressions, emotional reactions, and trust signals (or lack thereof)
- Identify content that answers the persona's key objections — and objections left unaddressed
- Note where the experience breaks down (confusing navigation, missing information, dead ends)
- Rate overall confidence level: "Would this persona schedule a call? Why or why not?"

**Deliverable:** Client Critique Report — one per persona, structured as a narrative walkthrough with specific callouts and a confidence rating.

---

## Review Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   Phase 1: REVIEW                                          │
│   ┌──────────────┐ ┌──────────────┐ ┌──────────────┐      │
│   │  Marketing   │ │     UX       │ │   Client     │      │
│   │   Review     │ │   Review     │ │  Critique    │      │
│   └──────┬───────┘ └──────┬───────┘ └──────┬───────┘      │
│          │                │                │               │
│          └────────────────┼────────────────┘               │
│                           ▼                                │
│   Phase 2: CONSOLIDATION                                   │
│   ┌─────────────────────────────────────────┐              │
│   │  Merge findings into unified change     │              │
│   │  proposals with priority rankings       │              │
│   └─────────────────────┬───────────────────┘              │
│                         ▼                                  │
│   Phase 3: APPROVAL                                        │
│   ┌─────────────────────────────────────────┐              │
│   │  Owner reviews proposals                │              │
│   │  Approves / Requests Changes / Rejects  │              │
│   └─────────────────────┬───────────────────┘              │
│                         ▼                                  │
│   Phase 4: IMPLEMENTATION                                  │
│   ┌─────────────────────────────────────────┐              │
│   │  Implementation team executes only      │              │
│   │  approved changes                       │              │
│   └─────────────────────────────────────────┘              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Phase Details

### Phase 1: Review (All groups work in parallel)

- Each group conducts their review independently
- Groups reference `personas.md` as the shared foundation
- Groups use the templates and checklists in this directory
- Timeline: [To be set by owner]

### Phase 2: Consolidation

- A facilitator collects all three group reports
- Findings are de-duplicated and cross-referenced (e.g., Marketing says "messaging is unclear on Advisory page" + UX says "Advisory page hierarchy is wrong" + Client Critique says "As Technical Tom, I couldn't find what I needed on Advisory" → single consolidated issue)
- Each consolidated finding becomes a **Change Proposal** with:
  - **Issue:** What the problem is
  - **Evidence:** Which groups identified it and from what angle
  - **Recommendation:** Specific proposed change
  - **Persona Impact:** Which personas are affected
  - **Priority:** Critical / High / Medium / Low
  - **Effort Estimate:** Small / Medium / Large

### Phase 3: Approval (Owner Gate)

**Nothing gets implemented without explicit owner approval.**

The owner reviews each Change Proposal and marks it:

| Decision | Meaning |
|---|---|
| **Approved** | Proceed to implementation as described |
| **Approved with modifications** | Proceed with the owner's specified adjustments |
| **Deferred** | Valid but not now — add to backlog |
| **Rejected** | Not aligned with vision — document reasoning |

### Phase 4: Implementation

- The implementation team receives only **Approved** change proposals
- Each change is implemented, tested, and reviewed before deployment
- Implementation team reports back to the owner for final sign-off before going live

---

## Change Proposal Template

Use this format for each consolidated finding:

```markdown
## CP-[NNN]: [Short title]

**Issue:** [Description of the problem]

**Evidence:**
- Marketing Review: [Finding]
- UX Review: [Finding]
- Client Critique: [Finding from persona X]

**Recommendation:** [Specific proposed change]

**Persona Impact:** [Which personas are affected and how]

**Priority:** [Critical / High / Medium / Low]

**Effort Estimate:** [Small / Medium / Large]

**Owner Decision:** [ ] Approved  [ ] Approved w/ modifications  [ ] Deferred  [ ] Rejected

**Owner Notes:** [Space for owner comments]
```

---

## File Index

| File | Purpose |
|---|---|
| Drive: Business / Marketing / Marketing personas | Four target client personas |
| Drive: Business / Marketing / Case study template | Template for writing case studies |
| `review/review-process.md` | This document — group charters, workflow, approval process |
