// TPM self-check item pool (working draft, NOT psychometrically validated).
//
// A theory-based, formative instrument used for reflection and development, never for
// selection (hiring, promotion, pay). Framework and rules of use live in the repo at
// review/tpm-competency-assessment.md; the research contribution is pointed to from the
// friday repo at research/dissertation/applied-tpm-assessment.md.
//
// Three layers: metacognition (Schraw & Dennison MAI, 1994) sits beneath teamwork
// competency (Stevens & Campion, 1994), which sits beneath the visible delivery craft.
// Items are our own wording, so nothing is lifted from a licensed instrument.

export const SCALE = [
  { value: 1, label: 'Strongly disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Neither' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly agree' },
]

// Layers, each with constructs, each with items. Item ids are stable so saved
// responses survive reordering.
export const LAYERS = [
  {
    id: 'metacognition',
    name: 'Metacognition',
    blurb:
      'How you regulate your own thinking: knowing what you know, planning, monitoring, and adjusting. The engine underneath the other two layers.',
    constructs: [
      {
        id: 'knowledge',
        name: 'Knowledge of cognition',
        items: [
          { id: 'm1', text: 'I have a clear read on my own strengths and blind spots as a delivery lead.' },
          { id: 'm2', text: 'I know which of my methods tend to work, and I reach for them on purpose.' },
          { id: 'm3', text: 'I can tell when an approach fits the situation in front of me and when it does not.' },
        ],
      },
      {
        id: 'planning',
        name: 'Planning',
        items: [
          { id: 'm4', text: "Before I take on an engagement, I think through what I need to learn about this client's context." },
          { id: 'm5', text: 'I set specific goals for a piece of work before I start it.' },
        ],
      },
      {
        id: 'information',
        name: 'Information management',
        items: [
          { id: 'm6', text: 'I organize what I am hearing on an engagement so the signal does not get lost.' },
        ],
      },
      {
        id: 'monitoring',
        name: 'Comprehension monitoring',
        items: [
          { id: 'm7', text: 'While an engagement is running, I regularly check whether my read of the situation still holds.' },
        ],
      },
      {
        id: 'debugging',
        name: 'Debugging',
        items: [
          { id: 'm8', text: 'When my approach stops working, I change it rather than push harder on it.' },
        ],
      },
      {
        id: 'evaluation',
        name: 'Evaluation',
        items: [
          { id: 'm9', text: 'After a milestone, I ask whether my approach actually worked, not only whether we hit the date.' },
        ],
      },
    ],
  },
  {
    id: 'teamwork',
    name: 'Teamwork competency',
    blurb:
      'How you operate with and around other people. The interpersonal and self-management behaviors of a team member (Stevens & Campion, 1994).',
    constructs: [
      {
        id: 'conflict',
        name: 'Conflict resolution',
        items: [
          { id: 't1', text: 'I can name a disagreement openly and keep it about the work, not the people.' },
          { id: 't2', text: 'I push back on a bad decision without damaging the relationship.' },
        ],
      },
      {
        id: 'collab',
        name: 'Collaborative problem solving',
        items: [
          { id: 't3', text: 'I can tell when a problem needs the whole group and when it does not.' },
        ],
      },
      {
        id: 'communication',
        name: 'Communication',
        items: [
          { id: 't4', text: 'I adapt how I explain things to whoever I am talking to, from an executive to an engineer.' },
          { id: 't5', text: 'People leave my updates knowing what is true and what to do next.' },
        ],
      },
      {
        id: 'goals',
        name: 'Goal setting and performance management',
        items: [
          { id: 't6', text: 'I set specific, challenging goals for the work and track against them.' },
          { id: 't7', text: 'I give people direct, usable feedback on how the work is going.' },
        ],
      },
      {
        id: 'coordination',
        name: 'Planning and task coordination',
        items: [
          { id: 't8', text: 'I keep roles, handoffs, and workload clear across the people on an engagement.' },
        ],
      },
    ],
  },
  {
    id: 'craft',
    name: 'Delivery craft',
    blurb:
      'The visible output on an engagement. The five skills a technical product manager is judged on when leading fixed-price delivery.',
    constructs: [
      {
        id: 'change',
        name: 'Change control',
        items: [
          { id: 'd1', text: 'When scope shifts, I make the tradeoff explicit and vetted before we agree to it.' },
        ],
      },
      {
        id: 'risk',
        name: 'Risk management',
        items: [
          { id: 'd2', text: 'I keep a live view of the real risks to the engagement, not a checkbox list.' },
        ],
      },
      {
        id: 'financial',
        name: 'Financial management',
        items: [
          { id: 'd3', text: "I know the numbers on both sides, our cost and the client's budget, and I can read the burn." },
        ],
      },
      {
        id: 'reporting',
        name: 'Stakeholder reporting',
        items: [
          { id: 'd4', text: 'My status reporting reflects reality, including the parts people would rather not hear.' },
        ],
      },
      {
        id: 'value',
        name: 'Value articulation',
        items: [
          { id: 'd5', text: "I can state the value we are delivering in the client's own terms and metrics." },
        ],
      },
    ],
  },
]

export const ALL_ITEM_IDS = LAYERS.flatMap((layer) =>
  layer.constructs.flatMap((c) => c.items.map((i) => i.id))
)

export const TOTAL_ITEMS = ALL_ITEM_IDS.length

// A reflective read of a layer average, worded as a mirror and not a measure. Bands are
// deliberately coarse because the instrument is not validated.
export function readBand(avg) {
  if (avg == null) return null
  if (avg >= 4) return 'You rate yourself strong here. Worth checking against a real artifact or a peer.'
  if (avg >= 3) return 'A mixed read. Some of this is solid, some is worth a closer look.'
  return 'You rate yourself lower here. A good place to point development, not a verdict.'
}
