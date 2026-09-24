# How the self-check scores work

The scoring reference for the TPM self-check. It traces every number from a single answer to
the final archetype. Companion to `review/tpm-hexagon-model.md` (the model) and
`src/data/tpmSelfCheckData.js` (the code that does exactly this).

The worked example at the bottom uses one real run, so every formula here has a number you
can check against it.

---

## The five steps

| Step | Input | Output | Formula |
|---|---|---|---|
| 1. Score each item | your 1-5 answer | a 1-5 item score | reverse items flip: `6 - answer` |
| 2. Average into axes | the items of one axis | the axis score (1-5) | `mean(its item scores)` |
| 3. Metacognition to multiplier | the 4 metacognition items | one multiplier (0.85-1.15) | `0.85 + ((metaMean - 1) / 4) * 0.3` |
| 4. Derive product skills | the two axes that feed each | a product-skill score (1-5) | `clamp(mean(feeding axes) * multiplier, 1, 5)` |
| 5. Shape to archetype | the six axis scores | the nearest archetype | nearest prototype by shape (see step 5) |

The key thing to hold onto: **metacognition multiplies only the derived product skills.** The
six durable-skill scores and the archetype are read straight from your answers, un-multiplied.
Metacognition shows up for the six as a separate plain-language read, not as a number change.

---

## Step 1: each answer becomes a 1-5 score

Every statement is answered on a 1-5 agreement scale (1 strongly disagree, 5 strongly agree).

Some statements are **reverse-coded**: worded so that agreeing is the weaker answer. Those flip
at scoring, `score = 6 - answer`, so a 5 becomes a 1. The reverse items are the third statement
in each axis and one metacognition item: `ta3, te3, cr3, st3, co3, le3, mx3`.

Reverse items exist to blunt straightlining (picking 5 down the whole page). If someone agrees
with both "I improvise a workaround that holds" and "I stall rather than invent another way
through," the two disagree, and the reversal catches it.

## Step 2: item scores average into the six axis scores

Each of the six durable skills has three items. The axis score is their mean, after any
reversal, so it stays on the 1-5 scale.

```
axis score = mean(item1, item2, item3)      // each already reverse-adjusted
```

Three items per axis is a deliberate floor. It is enough to average out a single misread item,
and short enough to keep the whole check to 22 questions.

## Step 3: metacognition becomes a multiplier

The four metacognition items average the same way into `metaMean` (1-5). That mean maps onto a
multiplier between 0.85 and 1.15:

```
multiplier = 0.85 + ((metaMean - 1) / 4) * 0.3
```

| metaMean | multiplier | effect on product skills |
|---|---|---|
| 1.0 (lowest) | 0.85 | -15% |
| 3.0 (neutral) | 1.00 | no change |
| 5.0 (highest) | 1.15 | +15% |

Why a multiplier and not a seventh axis: metacognition is the self-regulation that decides
whether your skills show up under pressure. It scales how much of your capability actually
lands, so it multiplies rather than adds. At the neutral midpoint it does nothing; strong
self-awareness lifts the derived skills by up to 15%, weak self-awareness drops them by up to
15%. This is the dissertation contribution: metacognition sits beneath the skills, not beside
them.

## Step 4: product skills are derived, not asked

Each product skill is fed by two durable skills. Its score is the mean of those two, times the
multiplier, clamped to stay on the 1-5 scale.

```
product skill = clamp(mean(feeding axis A, feeding axis B) * multiplier, 1, 5)
```

| Product skill | Fed by |
|---|---|
| Developing roadmaps | Strategic + Communication |
| Financial management | Tactical + Strategic |
| Market awareness | Strategic + Creativity |
| Value articulation | Communication + Strategic |
| Go to market | Communication + Leadership & collaboration |

Deriving these keeps the check short and avoids measuring a whole skill with a single question.
Direct measurement of product skills belongs to the paid tier.

## Step 5: the archetype comes from the shape

First, each axis score is normalized to a 0-1 scale so the shape is level-free:

```
n = (axis score - 1) / 4        // 1 becomes 0.0, 5 becomes 1.0
```

The six normalized values are your **profile**. Then:

1. **Flat check.** If the profile is nearly even (its highest minus its lowest is under 0.18),
   no single region dominates, so it is **The Renaissance**.
2. **Nearest shape.** Otherwise, compare your profile to each archetype's prototype shape and
   take the closest. The comparison is a **centered cosine** (a correlation): subtract each
   vector's own average, then measure the angle between them.

```
similarity = cosine(center(profile), center(prototype))
```

Centering is what makes this match the *pattern* of highs and lows rather than the overall
level. A uniformly strong person is placed by their relative spikes, not parked on whoever has
the highest numbers. The archetype with the highest similarity wins, and a second archetype is
shown as "leaning" only when its similarity is at least 90% of the winner's.

## How a number becomes a label

Both the axis table and the product-skill table show a band, not a raw number, so nobody reads
a false precision into a self-report.

| Score | Band |
|---|---|
| 3.8 and up | Strong |
| 2.8 to 3.79 | Solid |
| below 2.8 | Emerging |

---

## Worked example: the Operator run

These are the exact answers behind the Operator result in the test run.

### The answers, and step 1

| Item | Axis | Answer | Reverse? | Scored |
|---|---|---|---|---|
| ta1 | Tactical | 5 | no | 5 |
| ta2 | Tactical | 5 | no | 5 |
| ta3 | Tactical | 1 | yes | 6 - 1 = 5 |
| te1 | Technical | 5 | no | 5 |
| te2 | Technical | 5 | no | 5 |
| te3 | Technical | 1 | yes | 6 - 1 = 5 |
| cr1 | Creativity | 3 | no | 3 |
| cr2 | Creativity | 3 | no | 3 |
| cr3 | Creativity | 3 | yes | 6 - 3 = 3 |
| st1 | Strategic | 2 | no | 2 |
| st2 | Strategic | 2 | no | 2 |
| st3 | Strategic | 4 | yes | 6 - 4 = 2 |
| co1 | Communication | 3 | no | 3 |
| co2 | Communication | 3 | no | 3 |
| co3 | Communication | 3 | yes | 6 - 3 = 3 |
| le1 | Leadership | 3 | no | 3 |
| le2 | Leadership | 3 | no | 3 |
| le3 | Leadership | 3 | yes | 6 - 3 = 3 |
| mx1 | Metacognition | 4 | no | 4 |
| mx2 | Metacognition | 4 | no | 4 |
| mx3 | Metacognition | 2 | yes | 6 - 2 = 4 |
| mx4 | Metacognition | 4 | no | 4 |

### Step 2: axis scores

| Axis | Item scores | Mean | Band |
|---|---|---|---|
| Tactical | 5, 5, 5 | 5.00 | Strong |
| Technical | 5, 5, 5 | 5.00 | Strong |
| Creativity | 3, 3, 3 | 3.00 | Solid |
| Strategic | 2, 2, 2 | 2.00 | Emerging |
| Communication | 3, 3, 3 | 3.00 | Solid |
| Leadership | 3, 3, 3 | 3.00 | Solid |

### Step 3: the multiplier

```
metaMean = (4 + 4 + 4 + 4) / 4 = 4.00
multiplier = 0.85 + ((4.00 - 1) / 4) * 0.3 = 0.85 + 0.225 = 1.075
```

### Step 4: product skills

Each is `mean(feeding axes) * 1.075`.

| Product skill | Feeding axes | Base mean | x 1.075 | Band |
|---|---|---|---|---|
| Financial management | Tactical 5.0, Strategic 2.0 | 3.50 | 3.76 | Solid |
| Go to market | Comms 3.0, Leadership 3.0 | 3.00 | 3.23 | Solid |
| Developing roadmaps | Strategic 2.0, Comms 3.0 | 2.50 | 2.69 | Emerging |
| Market awareness | Strategic 2.0, Creativity 3.0 | 2.50 | 2.69 | Emerging |
| Value articulation | Comms 3.0, Strategic 2.0 | 2.50 | 2.69 | Emerging |

Notice how low Strategic (2.0) drags down every product skill it feeds, and the multiplier
lifts each by 7.5%.

### Step 5: the archetype

Normalize the six axes with `(score - 1) / 4`, in the fixed order tactical, technical,
creativity, strategic, communication, leadership:

```
profile = [1.00, 1.00, 0.50, 0.25, 0.50, 0.50]
spread  = 1.00 - 0.25 = 0.75      // >= 0.18, so not the Renaissance
```

Compare against each prototype with the centered cosine. The Operator prototype is
`[0.95, 0.95, 0.55, 0.40, 0.50, 0.55]`, and it comes out on top:

```
similarity(profile, Operator) ~= 0.99
```

That is the highest of the twelve, no runner-up within 90%, so the result is **The Operator**,
no lean. Every number here matches what the running app shows.

---

## Design notes (tunable, yours to set)

- **The multiplier touches only the product skills.** The six durable scores and the archetype
  use raw answers. If you want metacognition to also scale the six, that is a one-line change.
- **The 0.85-1.15 band** sets how much metacognition can move a score. Widen or narrow it to
  taste.
- **The 0.18 flatness threshold** decides how even a profile has to be to read as Renaissance.
- **The bands (2.8 and 3.8)** are where a raw mean becomes Emerging, Solid, or Strong.
