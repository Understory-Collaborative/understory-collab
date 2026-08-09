# Understory Collaborative — Brand and Offer Foundation (working draft)

This is a first pass at turning the mythology we uncovered into offers, a funnel, and a
web presence. It is a draft to react to. Anywhere you see **[webs decides]**, that is a
blank only you can fill, so I have not guessed.

---

## 1. The soul

The one belief under everything: **curious, not judgmental.** The world already has enough
pressure, judgment, and awful. Understory is the opposite of that.

The promise arc, in webs's own words:

> I know things feel bad right now. Tell me everything, and wallow as long as you need.
> Then we get to work, and a month from now you will forget why you felt so stuck, because
> we are firing on all engines with a clear path to your goals. Before long you will not
> need us, because you will know the system so well that you drive it and keep the practices
> that make the place hum.

The role: **the guide, not the hero.** The client gets to say "I did that." We reveal the
strength that was theirs the whole time, then step back into the soil. The proof we did the
job is that they no longer need us.

What we are not: the prestige-consultancy play. We do not sell cover, decks, a pyramid of
juniors, or dependency. We do not compete on price, because arguing price means agreeing to
be compared on a spreadsheet.

Voice: the house canon (plain language, no AI slop, no self-certifying virtue words, warm
with high standards). Accessibility and inclusive design are load-bearing, not decoration,
which is also why the work is stronger: a diverse understory meets the needs of more people.

---

## 2. The three doors (offers)

Three specific situations a stuck leader recognizes on sight. Same soul behind each door.
Each is run through Paula's five questions.

### Door 1 — Save the team

- **Who it is for:** a leader with an underperforming team that has already cycled through
  several leads, where moving or replacing people is expensive and slow, and they want one
  final effort to save the people they have. This includes the leader who has just made an
  acquisition and inherited a team, and needs to know quickly whether it can succeed and
  what has to change.
- **The problem:** "I need to know I did right by them. Can this team actually succeed, and
  if so, what has to change, and if not, I need to know that too."
- **The impact we deliver:** a clear evaluation of where the real issues are, the small
  irritants removed first, and a team that either climbs back to a strong, steady delivery
  pace or a defensible read that it cannot, so the leader can act with a clear conscience.
- **Risk of doing nothing:** months of sunk cost, quiet attrition of the good people, and a
  reorg made on a hunch instead of evidence.
- **Proof:** two team turnarounds from stuck and spiraling to a steady 80 to 90 points per
  sprint within a month or two. We cannot name the companies, and we can tell the general
  story with the numbers. **[webs decides: confirm the metric we lead with.]**
- **Price:** **[webs decides]**

### Door 2 — Get it shipped

- **Who it is for:** a leader on a project where the date keeps sliding, the scope keeps
  shifting, and no one can say what the first iteration even delivers.
- **The problem:** "I need someone to take control of this and get a defined thing shipped,
  then hand me back a project I can actually steer."
- **The impact we deliver:** a defined first iteration, a delivery path the team can see,
  and the ownership handed back so it keeps moving after we go.
- **Risk of doing nothing:** the date slides again, trust erodes with whoever is waiting,
  and the team burns out on a moving target.
- **Proof:** three delivery rescues, which show the range of the offer. We saved one feature
  delivery by collaborating alongside the struggling team. We saved another by taking over
  the project ourselves. On a third, we held the hard conversation about what the timeframe
  could actually fit, then shipped a meaningful value increment to customers. **[webs decides:
  which one leads.]**
- **Price:** **[webs decides]**

### Door 3 — AI without the chaos

- **Who it is for:** a leader who wants AI to make their people sharper, and instead has
  finance shipping to production with unknown security and PII exposure, runaway token
  spend, a chunk of the org refusing to touch it, and inboxes full of five-paragraph slop
  and enormous documents about nothing.
- **The problem:** "I want the upside without the risk and the noise. I need guardrails,
  cost control, and people actually using this well."
- **The impact we deliver:** guardrails for security, PII, and spend; adoption that reaches
  the refusers; and a standard that kills the slop. This is the door only Understory can
  sell with full conviction, because webs has literally built a canon against that slop.
- **Risk of doing nothing:** a PII or security incident, a budget surprise, and a workforce
  split between reckless and refusing.
- **Proof:** a repeatable adoption method webs has already run, under the understory brand.
  It starts opt-in, reaching out to the specific people who are still struggling. Most of the
  work is frustrations being heard and space being made for people to learn the tools and
  collaborate. Office hours let people drop in and share, which means we are not the only
  experts in the room, and a cache of internal experts grows on its own. From there we target
  specific roles and how each would use the tools, then whole teams, which is nearly effortless
  by that point because people already know what to do, how to do it, and where to find
  resources. The method is the proof: adoption that reaches the refusers and leaves the org
  able to run without us.
- **Price:** **[webs decides]**

---

## 3. The funnel (Beau's order of operations, mapped to what UC already has)

1. **Content that builds know, like, and trust.** One core piece every two weeks under the
   understory brand, with shorts as they come. Cypher can run the engine. (Decided: biweekly
   core.)
2. **Signature offer at $500+.** The three doors are the signature, done-for-you or one to
   one. The $500 is the framework floor, not a real price for done-for-you work of this size.
   **[webs decides: pricing per door.]**
3. **Tripwire: paid group office hours.** Up to 3 spots at $50 each, so a 30-minute session
   earns $50 to $150. A standalone paid micro-consult (bring one specific problem, leave with a
   concrete next step), kept distinct from the free application call so the two do not blur. The
   group format scales better than 1:1 and is on brand, since office hours are already part of
   the adoption method. Scope is general office hours (bring whatever your fire is), so it
   catches leads across all three doors, not only AI. (Decided.)
4. **A selling system.** The "What's On Fire?" quiz is the diagnostic top of funnel. The path
   is quiz to fire-type result to a short application. Rather than a mechanical severity-to-door
   map, the result screen presents the three doors as an honest qualifier: if one fits, walk
   through it; if none does, we are likely not the right fit. (Decided: short application as the
   conversation step; qualifier-style routing.)
5. **An automated path** so warm leads move without hand-holding: quiz to Kit email
   nurture to offer.

Existing assets this maps onto:

- **"What's On Fire?" quiz** = the diagnostic lead magnet at the top. Per-person capture is the
  fire-type bucket, stored on a single Kit `fire_type` custom field (footer and quiz feed the
  same form).
- **Kit newsletter** = the nurture layer (migrated off Ghost; the footer signup and the
  quiz field-guide flow both feed one Kit form).
- **Short application** = the conversation step (form and questions still to build).

---

## 4. Web presence map

- **Home:** mythology-led hero, then a "which one is you right now?" section with the three
  doors, so a stuck leader self-selects immediately instead of reading a capability list.
- **Three offer pages,** one per door, each built on Paula's five questions above.
- **Quiz** stays the top-of-funnel diagnostic and presents the three doors as a qualifier
  after the fire-type result (see funnel step 4).
- **Newsletter (Kit)** is the nurture.
- **About** carries the guide-not-hero story and the understory meaning.

Door 3 note: AI is the presented outfit (specific, good for SEO, the door we sell with full
conviction), while the practices underneath generalize to any stalled initiative. Keep AI
fronted for now so it stays distinct from door 2.

---

## 5. What I need from you (the blanks)

Settled so far: door names (Save the team, Get it shipped, AI without the chaos), content
cadence (biweekly core), the conversation step (short application), the tripwire (general paid
group office hours, up to 3 spots at $50 each), per-person quiz capture (fire-type bucket on a
Kit `fire_type` custom field), and quiz routing (qualifier-style, not a severity map). Still
open:

1. **Pricing** for each of the three doors.
2. **Real proof:** which metric or story leads each door. No client can be named, so proof
   stays generic: the numbers and the story, no company names. (Client naming: decided, none.)
