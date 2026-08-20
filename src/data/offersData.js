// The three offers — Design, Build, Ship — the "work with me" rung.
//
// These are the same three buckets the homepage names (Design = what to build, Build = how
// to build it, Ship = how to ship it), each with the stuck-leader story it grew from:
// Design = the delivery rescue, Build = the team turnaround, Ship = sane AI and cadence.
// Each renders through one template (OfferPage.jsx) on the who / problem / impact / proof
// structure from review/brand-offer-foundation.md.
//
// Decided with webs (2026-08-19): names are Design / Build / Ship; price is intake-only
// (no public number on these pages — the $50 office hours is the only customer-facing
// price, per HANDOFF D3). The `engagement` field describes the shape without a number, and
// scope is settled after a short application, never off a form (VOICE.md selling rule).
//
// `selfSelect` lines are reader-voice hooks. The proof stories are webs's, kept general
// (no client named).

export const offers = [
  {
    id: 'design',
    slug: 'design',
    name: 'Design',
    // Descriptor shows in the application dropdown; the selfSelect line is the page hook.
    descriptor: 'getting the first version shipped',
    selfSelect: "The date keeps slipping, and I can't say what actually ships.",
    whoFor:
      'A leader on a project where the date keeps sliding, the scope keeps shifting, and no ' +
      'one can say what the first version even delivers.',
    problem:
      'I need someone to take control of this and get a defined thing shipped, then hand me ' +
      'back a project I can steer.',
    impact:
      'A first version everyone can name, a delivery path the team can see, and the project ' +
      'handed back so it keeps moving after we go.',
    risk:
      'The date slides again, trust erodes with whoever is waiting, and the team burns out ' +
      'on a moving target.',
    proof:
      'Three delivery rescues that show the range. We saved one by working alongside the ' +
      'struggling team. We saved another by taking the project over ourselves. On a third we ' +
      'had the hard conversation about what the timeline could really fit, then shipped a real ' +
      'increment to customers.',
    engagement:
      "It starts with an assessment that scopes the work, then an engagement priced from what " +
      "it finds, whether that's a fixed price per iteration or a monthly retainer. We settle " +
      'the shape with you in a short conversation after a brief application.',
  },
  {
    id: 'build',
    slug: 'build',
    name: 'Build',
    descriptor: 'turning a team around',
    selfSelect: 'My team keeps missing, and I need to know whether it can be saved.',
    whoFor:
      'A leader with an underperforming team that has already cycled through several leads, ' +
      'where moving or replacing people is expensive and slow. They want one last effort to ' +
      'save the people they have. This includes the leader who has just made an acquisition, ' +
      'inherited a team, and needs to know quickly whether it can succeed and what has to ' +
      'change.',
    problem:
      'I need to know I did right by them. Can this team actually succeed, and if so, what ' +
      'has to change, and if not, I need to know that too.',
    impact:
      'A clear evaluation of where the real issues are, the small irritants cleared first, ' +
      'and a team that either climbs back to a steady, predictable pace or a defensible answer ' +
      'that it cannot, so you can act with a clear conscience.',
    risk:
      'Months of sunk cost, quiet attrition of the good people, and a reorg made on a hunch ' +
      'instead of evidence.',
    proof:
      'Two team turnarounds, both development teams at mid-sized companies, from stuck and ' +
      'spiraling to about seven times the throughput within a month or two.',
    engagement:
      'It starts with an assessment of the team, then an engagement scoped from what it finds, ' +
      'usually an embedded retainer while we turn the team around. We work out the shape with ' +
      'you after a short application.',
  },
  {
    id: 'ship',
    slug: 'ship',
    name: 'Ship',
    descriptor: 'shipping more often, with AI that helps',
    selfSelect: "AI is loose in my org, and it's more risk and noise than help.",
    whoFor:
      'A leader who wants AI to make their people better at the work. Instead they have ' +
      'finance shipping to production with unknown security and PII exposure, runaway token ' +
      'spend, a chunk of the org refusing to touch it, and inboxes full of five-paragraph ' +
      'slop and enormous documents about nothing.',
    problem:
      'I want the upside without the risk and the noise. I need guardrails, cost control, and ' +
      'people actually using this well.',
    impact:
      'Guardrails for security, PII, and spend, adoption that reaches the people still ' +
      'refusing, and a standard that kills the slop.',
    risk:
      'A PII or security incident, a budget surprise, and a workforce split between reckless ' +
      'and refusing.',
    proof:
      'A repeatable adoption method already run under the understory brand. It starts opt-in, ' +
      'reaching the specific people who are still struggling, so most of the work is ' +
      'frustrations being heard and space made to learn the tools together. Office hours let ' +
      'people drop in and share, a cache of internal experts grows on its own, and from there ' +
      'the method targets specific roles and then whole teams. The method itself is the proof, ' +
      'reaching the refusers and leaving the org able to run without us.',
    engagement:
      'It starts with a readiness assessment, then an engagement scoped from what it finds, ' +
      'usually an embedded retainer for a phased rollout. We work out the shape with you after ' +
      'a short application.',
  },
]

export function getOffer(slug) {
  return offers.find((offer) => offer.slug === slug) || null
}
