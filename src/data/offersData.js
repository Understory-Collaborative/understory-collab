// The three doors — Understory Collaborative's signature offers.
//
// A stuck leader self-selects one of these on the homepage, and each has its own
// offer page built on the who / problem / impact / proof structure from
// review/brand-offer-foundation.md.
//
// SCAFFOLD STATUS: the who, problem, impact, and risk copy below is webs's own
// language from the foundation draft. Names are decided with webs (Save the team /
// Get it shipped / AI without the chaos). Two things are still open and are marked
// PENDING so they render as visible placeholders on the page rather than silent
// gaps, because the house rule is to ask, never to invent:
//   - `price`       : PENDING — no price invented.
//   - `proofLead`   : PENDING — which real metric or story leads, and whether a
//                     client can be named, is webs's call.
// The `selfSelect` lines are first-draft reader-voice for webs to confirm or rewrite.
// The `proof` text itself is real material from the draft; only the lead choice
// and any client naming are open.

export const PENDING = '[webs decides]'

export const offers = [
  {
    id: 'salvage-team',
    slug: 'save-the-team',
    name: 'Save the team',
    // First-draft homepage self-select line, drawn from the problem quote below.
    // webs to confirm or rewrite.
    selfSelect: 'My team keeps missing, and I need to know whether it can be saved.',
    whoFor:
      'A leader with an underperforming team that has already cycled through several ' +
      'leads, where moving or replacing people is expensive and slow, and they want ' +
      'one final effort to save the people they have. This includes the leader who ' +
      'has just made an acquisition and inherited a team, and needs to know quickly ' +
      'whether it can succeed and what has to change.',
    problem:
      'I need to know I did right by them. Can this team actually succeed, and if so, ' +
      'what has to change, and if not, I need to know that too.',
    impact:
      'A clear evaluation of where the real issues are, the small irritants removed ' +
      'first, and a team that either climbs back to a strong, steady delivery pace or ' +
      'a defensible read that it cannot, so you can act with a clear conscience.',
    risk:
      'Months of sunk cost, quiet attrition of the good people, and a reorg made on a ' +
      'hunch instead of evidence.',
    proof:
      'Two team turnarounds from stuck and spiraling to a steady, predictable delivery ' +
      'pace within a month or two.',
    proofLead: PENDING, // which metric leads, and whether the client can be named
    price: PENDING,
  },
  {
    id: 'take-the-wheel',
    slug: 'get-it-shipped',
    name: 'Get it shipped',
    selfSelect: 'This project keeps slipping, and no one can say what actually ships.',
    whoFor:
      'A leader on a project where the date keeps sliding, the scope keeps shifting, ' +
      'and no one can say what the first iteration even delivers.',
    problem:
      'I need someone to take control of this and get a defined thing shipped, then ' +
      'hand me back a project I can actually steer.',
    impact:
      'A defined first iteration, a delivery path the team can see, and the ownership ' +
      'handed back so it keeps moving after we go.',
    risk:
      'The date slides again, trust erodes with whoever is waiting, and the team burns ' +
      'out on a moving target.',
    proof:
      'Three delivery rescues that show the range of the offer: one saved by ' +
      'collaborating alongside the struggling team, one saved by taking over the ' +
      'project ourselves, and one where we held the hard conversation about what the ' +
      'timeframe could actually fit, then shipped a meaningful value increment to ' +
      'customers.',
    proofLead: PENDING, // which of the three rescues leads
    price: PENDING,
  },
  {
    id: 'sane-ai',
    slug: 'ai-without-the-chaos',
    name: 'AI without the chaos',
    selfSelect: 'AI is loose in my org, and it is more risk and noise than help.',
    whoFor:
      'A leader who wants AI to make their people sharper, and instead has finance ' +
      'shipping to production with unknown security and PII exposure, runaway token ' +
      'spend, a chunk of the org refusing to touch it, and inboxes full of ' +
      'five-paragraph slop and enormous documents about nothing.',
    problem:
      'I want the upside without the risk and the noise. I need guardrails, cost ' +
      'control, and people actually using this well.',
    impact:
      'Guardrails for security, PII, and spend; adoption that reaches the refusers; ' +
      'and a standard that kills the slop.',
    risk:
      'A PII or security incident, a budget surprise, and a workforce split between ' +
      'reckless and refusing.',
    proof:
      'A repeatable adoption method already run under the understory brand. It starts ' +
      'opt-in, reaching the specific people who are still struggling, so most of the ' +
      'work is frustrations being heard and space made to learn the tools together. ' +
      'Office hours let people drop in and share, a cache of internal experts grows on ' +
      'its own, and from there the method targets specific roles and then whole teams. ' +
      'The method is the proof: adoption that reaches the refusers and leaves the org ' +
      'able to run without us.',
    proofLead: PENDING, // whether to name the understory engagement specifically
    price: PENDING,
  },
]

export function getOffer(slug) {
  return offers.find((offer) => offer.slug === slug) || null
}
