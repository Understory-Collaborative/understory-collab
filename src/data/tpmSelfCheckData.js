// TPM self-check item pool and model (working draft, NOT psychometrically validated).
//
// This is the FREE, self-report lead-generator tier. It measures the five teamwork
// competencies (Stevens & Campion, 1994) and an overall metacognition read (Schraw &
// Dennison MAI, 1994). The five delivery-craft skills are NOT asked directly here; their
// levels are DERIVED from the competencies that feed them, amplified by metacognition. The
// paid engagement is where craft is measured directly and triangulated with a 360, real
// artifacts, and observed delivery.
//
// Model (an analogy, not a literal game): teamwork competencies feed the delivery skills;
// metacognition amplifies how consistently those skills show up. Framework and rules of use
// live at review/tpm-competency-assessment.md; research pointer in the friday repo at
// research/dissertation/applied-tpm-assessment.md.
//
// All item wording and growth guidance below is a DRAFT for webs to own, not final copy.

export const SCALE = [
  { value: 1, label: 'Strongly disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Neither' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly agree' },
]

// The five teamwork competencies. Each is an investable node with its own items.
// `reverse: true` items are inverted at scoring to blunt yes-saying and straightlining.
export const COMPETENCIES = [
  {
    id: 'conflict',
    name: 'Handling disagreement',
    items: [
      { id: 'c1', text: 'I can name a disagreement openly and keep it about the work, not the people.' },
      { id: 'c2', text: 'When someone pushes back hard, I tend to give in to keep the peace.', reverse: true },
      { id: 'c3', text: 'I push back on a decision I think is wrong, even with someone senior.' },
    ],
  },
  {
    id: 'collab',
    name: 'Solving problems together',
    items: [
      { id: 'p1', text: 'I can tell when a problem needs the whole group and when it is mine to just decide.' },
      { id: 'p2', text: 'I pull the right people in to solve something rather than grinding on it alone.' },
      { id: 'p3', text: 'I often realize too late that I should have involved others sooner.', reverse: true },
    ],
  },
  {
    id: 'comm',
    name: 'Communicating clearly',
    items: [
      { id: 'k1', text: 'I adapt how I explain things to whoever I am talking to, from an executive to an engineer.' },
      { id: 'k2', text: 'People leave my updates knowing what is true and what to do next.' },
      { id: 'k3', text: 'People sometimes leave my updates unsure what I actually meant.', reverse: true },
    ],
  },
  {
    id: 'goals',
    name: 'Setting goals and giving feedback',
    items: [
      { id: 'g1', text: 'I set specific, challenging goals for the work and track against them.' },
      { id: 'g2', text: 'I give people direct, usable feedback while there is still time to act on it.' },
      { id: 'g3', text: 'Goals on my work tend to stay fuzzy until something forces them clear.', reverse: true },
    ],
  },
  {
    id: 'coord',
    name: 'Planning and coordinating',
    items: [
      { id: 'n1', text: 'I keep roles, handoffs, and workload clear across the people involved.' },
      { id: 'n2', text: 'I sequence the work so the right things happen in the right order.' },
      { id: 'n3', text: 'Coordination on my projects often happens reactively, not by plan.', reverse: true },
    ],
  },
]

// Metacognition: the overall amplifier, not a delivery skill of its own.
export const METACOGNITION = {
  id: 'meta',
  name: 'Self-awareness under pressure',
  items: [
    { id: 'x1', text: 'I regularly step back to check whether my approach is still working.' },
    { id: 'x2', text: 'When my approach stops working, I change it rather than push harder on it.' },
    { id: 'x3', text: 'I usually only see what I should have done differently in hindsight.', reverse: true },
    { id: 'x4', text: 'I have a clear read on my own strengths and blind spots as a delivery lead.' },
  ],
}

// The five delivery-craft skills (derived, not asked). `fedBy` lists the competencies that
// feed each, drawn from the framework's dependency table.
export const CRAFT_SKILLS = [
  { id: 'change', name: 'Change control', short: 'Change', fedBy: ['conflict', 'comm'] },
  { id: 'risk', name: 'Risk management', short: 'Risk', fedBy: ['collab', 'coord'] },
  { id: 'financial', name: 'Financial management', short: 'Financial', fedBy: ['coord', 'goals'] },
  { id: 'reporting', name: 'Stakeholder reporting', short: 'Reporting', fedBy: ['comm', 'conflict'] },
  { id: 'value', name: 'Value articulation', short: 'Value', fedBy: ['comm', 'goals'] },
]

// Draft growth guidance per competency (webs to own the final wording).
export const GROWTH_ACTIONS = {
  conflict: 'Name the disagreement out loud early, and separate the decision from the person. Rehearse the pushback before the meeting.',
  collab: 'Before grinding solo, ask who holds the missing piece and bring them in. Say plainly when a call is yours to make versus the group’s.',
  comm: 'Write every update as three lines: what is true, what it means, what is next. Then check the reader took away those three.',
  goals: 'Turn a fuzzy ask into one specific, measurable target before work starts, and give feedback against it while there is still time to act.',
  coord: 'Map roles, handoffs, and sequence at the start, and keep the plan visible so coordination is proactive, not reactive.',
}

// All item ids, and a fixed shuffled presentation order so the underlying structure is not
// announced. Order is hand-fixed (not random per load) so the page is stable and testable.
export const PRESENTATION_ORDER = [
  'k1', 'c1', 'n1', 'x1', 'g1', 'p1', 'k3', 'c2', 'n2', 'x3',
  'g2', 'p2', 'c3', 'k2', 'x2', 'n3', 'g3', 'p3', 'x4',
]

// Flat lookup of every item with its competency/meta owner and reverse flag.
export const ITEM_INDEX = (() => {
  const idx = {}
  COMPETENCIES.forEach((comp) => {
    comp.items.forEach((it) => {
      idx[it.id] = { ...it, group: comp.id, kind: 'competency' }
    })
  })
  METACOGNITION.items.forEach((it) => {
    idx[it.id] = { ...it, group: 'meta', kind: 'meta' }
  })
  return idx
})()

export const TOTAL_ITEMS = PRESENTATION_ORDER.length

// ---- Scoring (all derived, no raw score shown to the user) ------------------

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))

function itemScore(id, responses) {
  const raw = responses[id]
  if (raw == null) return null
  const meta = ITEM_INDEX[id]
  return meta.reverse ? 6 - raw : raw // invert reverse-coded items on a 1..5 scale
}

function mean(nums) {
  const vals = nums.filter((n) => n != null)
  if (!vals.length) return null
  return vals.reduce((a, b) => a + b, 0) / vals.length
}

// Returns { competencies: {id: mean}, metaMean, multiplier, craft: {id: level}, bands... }
export function scoreResponses(responses) {
  const competencies = {}
  COMPETENCIES.forEach((comp) => {
    competencies[comp.id] = mean(comp.items.map((it) => itemScore(it.id, responses)))
  })

  const metaMean = mean(METACOGNITION.items.map((it) => itemScore(it.id, responses)))
  // Amplifier maps a 1..5 metacognition mean onto roughly 0.85..1.15.
  const multiplier = metaMean == null ? null : 0.85 + ((metaMean - 1) / 4) * 0.3

  const craft = {}
  CRAFT_SKILLS.forEach((skill) => {
    const feeders = skill.fedBy.map((cid) => competencies[cid])
    const base = mean(feeders)
    craft[skill.id] = base == null || multiplier == null ? null : clamp(base * multiplier, 1, 5)
  })

  return { competencies, metaMean, multiplier, craft }
}

export function levelBand(level) {
  if (level == null) return { id: 'none', label: 'Not yet' }
  if (level >= 3.8) return { id: 'strong', label: 'Strong' }
  if (level >= 2.8) return { id: 'solid', label: 'Solid' }
  return { id: 'emerging', label: 'Emerging' }
}

export function metacognitionRead(metaMean) {
  if (metaMean == null) return null
  if (metaMean >= 3.8) {
    return 'Your skills tend to show up consistently, even under pressure. That steadiness amplifies everything above.'
  }
  if (metaMean >= 2.8) {
    return 'Your skills are solid but do not always show up when things get hard. Strengthening this lifts every skill at once.'
  }
  return 'Right now your skills may not show up reliably under pressure. This is the highest-leverage place to grow, because it multiplies everything else.'
}
