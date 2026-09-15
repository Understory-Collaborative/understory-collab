// TPM self-check item pool and model (working draft, NOT psychometrically validated).
//
// This is the FREE, self-report lead-generator tier. It measures the SIX durable skills of
// the TPM hexagon directly, plus a metacognition read that amplifies how consistently they
// show up. From the six it DERIVES the product skills (roadmaps, financials, market, value,
// go to market), and it reads the person's hexagon SHAPE to name an archetype.
//
// Model and rationale live at review/tpm-hexagon-model.md; research pointer in the friday
// repo at research/dissertation/applied-tpm-assessment.md. Research anchors per axis:
// March (1991) exploration/exploitation; Jaques time-span of discretion; Guest (1991)
// T-shaped; Amabile (1988) componential creativity; Stevens & Campion (1994) teamwork KSAs;
// Schraw & Dennison (1994) metacognition.
//
// All item wording, archetype copy, and growth guidance below is a DRAFT for webs to own,
// not final copy.

export const SCALE = [
  { value: 1, label: 'Strongly disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Neither' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly agree' },
]

// The six durable skills. Order here IS the hexagon/vector order used by the archetypes.
// `reverse: true` items are inverted at scoring to blunt yes-saying and straightlining.
export const AXES = [
  {
    id: 'tactical',
    name: 'Tactical',
    short: 'Tactical',
    blurb: 'The in-the-moment, stop-the-bleeding move.',
    anchor: 'March (1991), exploitation: refine and execute for reliable near-term returns.',
    items: [
      { id: 'ta1', text: 'When something breaks right now, I stabilize it fast with what is already in front of me.' },
      { id: 'ta2', text: 'In a crisis I can tell what has to be fixed now and what can wait.' },
      { id: 'ta3', text: 'In an emergency I reach for the perfect fix instead of the one that stops the damage now.', reverse: true },
    ],
  },
  {
    id: 'technical',
    name: 'Technical',
    short: 'Technical',
    blurb: 'Understanding AI, APIs, and architecture decisions.',
    anchor: 'Guest (1991), the T-shaped professional: a deep technical stem.',
    items: [
      { id: 'te1', text: 'I can weigh a technical architecture tradeoff and decide, without needing someone to translate it for me.' },
      { id: 'te2', text: 'I understand enough about how our systems, APIs, and tools fit together to see the knock-on effects of a change.' },
      { id: 'te3', text: 'I usually have to take an engineer’s word for a technical tradeoff rather than judge it myself.', reverse: true },
    ],
  },
  {
    id: 'creativity',
    name: 'Creativity',
    short: 'Creativity',
    blurb: 'So you can improvise a fix when you need to.',
    anchor: 'Amabile (1988), componential theory: novel and appropriate, under constraint.',
    items: [
      { id: 'cr1', text: 'When the standard path is blocked, I improvise a workaround that holds.' },
      { id: 'cr2', text: 'I come up with approaches the rest of the team had not considered.' },
      { id: 'cr3', text: 'When the obvious approach fails, I stall rather than invent another way through.', reverse: true },
    ],
  },
  {
    id: 'strategic',
    name: 'Strategic',
    short: 'Strategic',
    blurb: 'Rearchitecting the whole ship over several years.',
    anchor: 'March (1991), exploration; Jaques, longer horizon means more complex work.',
    items: [
      { id: 'st1', text: 'I can hold where the product needs to be in a few years and work backward from it.' },
      { id: 'st2', text: 'I will take the slower path now when it sets the product up better for the long run.' },
      { id: 'st3', text: 'I mostly optimize for the next release and rarely plan past it.', reverse: true },
    ],
  },
  {
    id: 'comms',
    name: 'Communication',
    short: 'Comms',
    blurb: 'Explaining the work to whoever is in front of you.',
    anchor: 'Stevens & Campion (1994), the communication KSA.',
    items: [
      { id: 'co1', text: 'I adapt how I explain things to whoever I am talking to, from an executive to an engineer.' },
      { id: 'co2', text: 'People leave my updates knowing what is true and what to do next.' },
      { id: 'co3', text: 'People sometimes leave my updates unsure what I actually meant.', reverse: true },
    ],
  },
  {
    id: 'leadership',
    name: 'Leadership & collaboration',
    short: 'Leadership',
    blurb: 'Getting a group to its best work together.',
    anchor: 'Stevens & Campion (1994): conflict, collaborative problem solving, coordination.',
    items: [
      { id: 'le1', text: 'I get a group to do its best work together, including through disagreement.' },
      { id: 'le2', text: 'I can tell when a call is mine to make and when it belongs to the group.' },
      { id: 'le3', text: 'I push my own solution instead of drawing the best out of the team.', reverse: true },
    ],
  },
]

// The fixed vector order the archetype shapes are written in.
export const AXIS_ORDER = AXES.map((a) => a.id)

// Metacognition: the amplifier under the six, not a seventh axis.
export const METACOGNITION = {
  id: 'meta',
  name: 'Self-awareness under pressure',
  items: [
    { id: 'mx1', text: 'I regularly step back to check whether my approach is still working.' },
    { id: 'mx2', text: 'When my approach stops working, I change it rather than push harder on it.' },
    { id: 'mx3', text: 'I usually only see what I should have done differently in hindsight.', reverse: true },
    { id: 'mx4', text: 'I know my own strengths and blind spots as a delivery lead.' },
  ],
}

// Product skills (derived, not asked). `fedBy` lists the durable skills that feed each.
export const PRODUCT_SKILLS = [
  {
    id: 'roadmaps',
    name: 'Developing roadmaps',
    short: 'Roadmaps',
    def: 'Turning where the product should go into a sequence the team can actually run.',
    fedBy: ['strategic', 'comms'],
  },
  {
    id: 'financial',
    name: 'Financial management',
    short: 'Financials',
    def: 'Tracking what the work costs against what the budget allows, and keeping the two in line.',
    fedBy: ['tactical', 'strategic'],
  },
  {
    id: 'market',
    name: 'Market awareness',
    short: 'Market',
    def: 'Reading where the market is moving and what that means for the product.',
    fedBy: ['strategic', 'creativity'],
  },
  {
    id: 'value',
    name: 'Value articulation',
    short: 'Value',
    def: 'Explaining the worth of the work in the terms the client actually cares about.',
    fedBy: ['comms', 'strategic'],
  },
  {
    id: 'gtm',
    name: 'Go to market',
    short: 'GTM',
    def: 'Getting a product out the door and into users’ hands across the teams it touches.',
    fedBy: ['comms', 'leadership'],
  },
]

// The archetypes. `v` is the prototype hexagon shape in AXIS_ORDER (0..1). Assignment reads
// the person's shape and matches the nearest prototype, so every profile lands somewhere.
// `rare` marks the three opposite-axis (tension) types. All copy is a DRAFT for webs.
export const ARCHETYPES = [
  { id: 'operator', name: 'The Operator', role: 'Senior engineer / tech lead', spikes: 'Tactical + Technical', complement: 'The Navigator',
    read: 'Gets paged and fixes it. Knows the system deep enough to stop the outage today.',
    v: [0.95, 0.95, 0.55, 0.4, 0.5, 0.55] },
  { id: 'prototyper', name: 'The Prototyper', role: 'Creative technologist / founding engineer', spikes: 'Technical + Creativity', complement: 'The Conductor',
    read: 'Let me just build it and show you. Spikes a working prototype over a weekend to prove the idea is real.',
    v: [0.55, 0.95, 0.95, 0.5, 0.45, 0.4] },
  { id: 'firefighter', name: 'The Firefighter', role: 'Rescue TPM', spikes: 'Tactical + Creativity', complement: 'The Navigator',
    read: 'Stops the bleeding today, and improvises when the standard path is blocked.',
    v: [0.95, 0.55, 0.9, 0.4, 0.55, 0.5] },
  { id: 'architect', name: 'The Architect', role: 'Software architect', spikes: 'Technical + Strategic', complement: 'The Conductor',
    read: 'Designs the system to last. Deep tradeoffs and the long horizon in one head.',
    v: [0.5, 0.95, 0.6, 0.95, 0.5, 0.5] },
  { id: 'visionary', name: 'The Visionary', role: 'Innovation lead', spikes: 'Creativity + Strategic', complement: 'The Steward',
    read: 'Reimagines where the product could go in three years, and sees a non-obvious path there.',
    v: [0.35, 0.5, 0.95, 0.95, 0.6, 0.5] },
  { id: 'navigator', name: 'The Navigator', role: 'Product manager', spikes: 'Strategic + Communication', complement: 'The Operator',
    read: 'Sees where the product must go, and sells the multi-year bet in plain terms.',
    v: [0.45, 0.45, 0.6, 0.95, 0.95, 0.65] },
  { id: 'conductor', name: 'The Conductor', role: 'Program manager', spikes: 'Communication + Leadership', complement: 'The Architect',
    read: 'Gets many teams moving together and keeps everyone knowing what is true.',
    v: [0.55, 0.35, 0.45, 0.6, 0.95, 0.95] },
  { id: 'steward', name: 'The Steward', role: 'Product owner / project manager', spikes: 'Tactical + Leadership', complement: 'The Visionary',
    read: 'Rallies the team through the crunch and keeps everyone unblocked, day to day.',
    v: [0.9, 0.5, 0.5, 0.5, 0.7, 0.95] },
  { id: 'captain', name: 'The Captain', role: 'Senior TPM', spikes: 'Tactical + Strategic', complement: 'The Conductor', rare: true,
    read: 'Commands the crisis on deck and owns where the ship is headed over years. The senior TPM move.',
    v: [0.95, 0.5, 0.5, 0.95, 0.55, 0.55] },
  { id: 'translator', name: 'The Translator', role: 'TPM, native fluency', spikes: 'Technical + Communication', complement: 'The Steward', rare: true,
    read: 'Native in the code, and can make an exec care about the invisible work.',
    v: [0.5, 0.95, 0.5, 0.55, 0.95, 0.6] },
  { id: 'catalyst', name: 'The Catalyst', role: 'Innovation lead who ships', spikes: 'Creativity + Leadership', complement: 'The Architect', rare: true,
    read: 'Invents the wild idea and gets the team to actually commit to shipping it.',
    v: [0.5, 0.5, 0.95, 0.55, 0.6, 0.95] },
]

// The balanced whole. Assigned when a profile is nearly flat (no single region dominates).
export const RENAISSANCE = {
  id: 'renaissance', name: 'The Renaissance', role: 'The full TPM (the unicorn)',
  spikes: 'Balanced across all six', complement: 'Any, to add depth', balanced: true,
  read: 'Native in all six. The whole shape the others are each a slice of.',
  v: [0.85, 0.85, 0.85, 0.85, 0.85, 0.85],
}

// A fixed shuffled presentation order so the structure is not announced. Hand-fixed (not
// random per load) so the page is stable and testable.
export const PRESENTATION_ORDER = [
  'co1', 'ta1', 'te1', 'mx1', 'st1', 'cr1', 'le1', 'co3', 'ta3', 'te3', 'st2',
  'cr2', 'mx3', 'le2', 'co2', 'ta2', 'te2', 'st3', 'cr3', 'le3', 'mx2', 'mx4',
]

// Flat lookup of every item with its owning axis (or meta) and reverse flag.
export const ITEM_INDEX = (() => {
  const idx = {}
  AXES.forEach((axis) => {
    axis.items.forEach((it) => {
      idx[it.id] = { ...it, group: axis.id, kind: 'axis' }
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

// Vector helpers for the nearest-shape match.
const vmean = (v) => v.reduce((a, b) => a + b, 0) / v.length
const center = (v) => { const m = vmean(v); return v.map((x) => x - m) }
const dot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0)
const norm = (v) => Math.sqrt(dot(v, v))
// Cosine of the centered vectors = correlation of the two shapes (level-invariant).
function shapeSimilarity(a, b) {
  const ca = center(a)
  const cb = center(b)
  const denom = norm(ca) * norm(cb)
  return denom === 0 ? 0 : dot(ca, cb) / denom
}

// Returns { axes, metaMean, multiplier, product, profile } where profile is the 0..1 shape.
export function scoreResponses(responses) {
  const axes = {}
  AXES.forEach((axis) => {
    axes[axis.id] = mean(axis.items.map((it) => itemScore(it.id, responses)))
  })

  const metaMean = mean(METACOGNITION.items.map((it) => itemScore(it.id, responses)))
  // Amplifier maps a 1..5 metacognition mean onto roughly 0.85..1.15.
  const multiplier = metaMean == null ? null : 0.85 + ((metaMean - 1) / 4) * 0.3

  const product = {}
  PRODUCT_SKILLS.forEach((skill) => {
    const base = mean(skill.fedBy.map((aid) => axes[aid]))
    product[skill.id] = base == null || multiplier == null ? null : clamp(base * multiplier, 1, 5)
  })

  // 0..1 shape vector in AXIS_ORDER; null axes fall back to the neutral midpoint.
  const profile = AXIS_ORDER.map((id) => (axes[id] == null ? 0.5 : (axes[id] - 1) / 4))

  return { axes, metaMean, multiplier, product, profile }
}

// How flat a profile has to be (max minus min, on 0..1) to read as balanced (Renaissance).
const BALANCED_SPREAD = 0.18

// Assigns the archetype whose prototype shape the profile most resembles. Reads shape, not
// level, so a uniformly-high profile still matches by its relative spikes. A nearly-flat
// profile is the Renaissance. Returns { primary, secondary, leaning }.
export function assignArchetype(profile) {
  const spread = Math.max(...profile) - Math.min(...profile)
  if (spread < BALANCED_SPREAD) {
    return { primary: RENAISSANCE, secondary: null, leaning: false }
  }
  const ranked = ARCHETYPES
    .map((a) => ({ a, sim: shapeSimilarity(profile, a.v) }))
    .sort((x, y) => y.sim - x.sim)
  const [top, next] = ranked
  // Call it a "lean" only when the runner-up is genuinely close.
  const leaning = next && top.sim > 0 && next.sim / top.sim > 0.9
  return { primary: top.a, secondary: leaning ? next.a : null, leaning: !!leaning }
}

// Top axes by score, for a strengths-first read. Returns an ordered array of axis ids.
export function strongestAxes(axes) {
  return AXES
    .map((a) => ({ id: a.id, level: axes[a.id] }))
    .filter((a) => a.level != null)
    .sort((a, b) => b.level - a.level)
    .map((a) => a.id)
}

// The ordered level scale, low to high. Used for the label and its position indicator.
export const LEVELS = [
  { id: 'emerging', label: 'Emerging' },
  { id: 'solid', label: 'Solid' },
  { id: 'strong', label: 'Strong' },
]

export function levelBand(level) {
  if (level == null) return { id: 'none', label: 'Not yet', index: -1 }
  if (level >= 3.8) return { ...LEVELS[2], index: 2 }
  if (level >= 2.8) return { ...LEVELS[1], index: 1 }
  return { ...LEVELS[0], index: 0 }
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
