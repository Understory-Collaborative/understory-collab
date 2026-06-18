# Understory Collaborative Design System

> Quietly growing beneath the canopy. Something is taking root.

Understory Collaborative is a technology consultancy that drops in early — like smokejumpers
on a wildfire — to protect the foundational systems a business grows from. The brand runs on
one metaphor: a forest. Healthy growth happens in the understory, beneath the canopy; tech
debt is dry brush; a crisis is a fire that spreads from brush to firestorm. The system below
turns that metaphor into color, type, and components, and into a voice that sounds like a
seasoned peer, not a vendor.

This folder is a self-contained design system: brand assets, design tokens (CSS custom
properties), reusable UI primitives, a canonical UI kit, a page template, and foundation
specimens. The running React site consumes the tokens directly (see **Using the system**);
standalone surfaces link one file, `styles.css`.

## Source materials

| Asset | Path | Notes |
|---|---|---|
| Logo (square badge + wordmark) | `assets/UC_Logo.png` | 500×500 PNG, no transparency (solid grass-green field). The only mark supplied. A transparent badge, a horizontal lockup, and an app icon are **missing** — flag for the brand owner. |
| Color values | `tokens/colors.css` | Derived from the running site (`src/index.css`, `src/pages/Quiz.css`) and the logo. The severity ramp is a real product asset. Ramp steps the site never used are marked `(proposal)`. |
| Type | `tokens/fonts.css` | **No brand font files were supplied.** The logo's display lettering is not shipped as a webfont. The system sets Hanken Grotesk (a humanist grotesque, loaded from Google Fonts) for display and body — a deliberate brand choice, not the logo's exact face. Self-hosting the woff2 is the production follow-up. |

Anything not traceable to a source above is a considered proposal, labeled as such in the
token files and open to your direction.

## Content fundamentals: how Understory talks

Everything in this section is **drafted from the live site, the white papers, and the review
docs (`review/`), and proposed for your sign-off** — it is evidence of how the brand already
talks, not invented brand law. Where the source is thin, it says so.

**The voice in one line:** a seasoned CTO telling you the truth over coffee. Honest, plain,
unhurried, and never selling. The quiz brief names it exactly — "like a seasoned CTO friend
asking you honest questions over coffee. Not a vendor checklist."

**Who it's written to.** Primarily "Technical Tom" — a CTO/VP of Engineering who is
*skeptical of full-service firms ("a mile wide, inch deep"), tired of consultants who agree
with his plan instead of pressure-testing it, and can smell a pitch.* That reader sets the
voice: you earn his trust by being right and honest, not by being enthusiastic. Secondary
readers (Strategic Sara, Founder Frankie) want the same honesty in less technical terms.

**The metaphor is the whole system, carried in words.** Forest health = technical health.
The understory is the foundational layer growth depends on; tech debt is dry brush; a crisis
spreads brush → smolder → crown fire → firestorm; Understory are smokejumpers who drop in
early. The brief is explicit that this stays subtle: *"No parachutes on the homepage. The
language carries the metaphor. The visuals support it without beating anyone over the head."*

**The Root–Rise–Flourish narrative.** The brand's method arc (roots first, then growth, then
flourishing) is the through-line the marketing review checks every page against. New copy
should sit somewhere on that arc, not invent a competing structure.

### Registers (proposed)

| Register | Where it's used | How it sounds | Example (real copy) |
|---|---|---|---|
| **Peer diagnosis** | Homepage, the "What's On Fire?" quiz, CTAs | Direct second person, short, asks the honest question instead of asserting | "You've been saying 'we'll get to that' about the same systems for a while now." |
| **Field guide** | White papers (the T1 lead-gen offer) | Patient and educational; explains, never pitches; normalizes the problem before naming the fix | "This accumulation is physics, not failure." |
| **Quiet brand** | Taglines, hero, metadata | Understated, organic, almost soft-spoken | "Quietly growing beneath the canopy. Something is taking root." |

### Writing rules (proposed)

- **Educate, don't pitch.** This is the load-bearing rule, straight from the funnel design
  (Chet Holmes T1): the quiz diagnoses, the paper teaches, and Understory becomes the
  obvious answer *without being named as one.* A white paper that says "that's where we come
  in" has broken character.
- **Lead with the honest observation, not the offer.** Name what's true — even when it's
  uncomfortable — before anything else.
- **Carry the metaphor in words; keep it subtle; never go literal.** No parachutes, no flames
  on the homepage.
- **Plain and literal where it counts.** A reader skimming under stress should never have to
  decode a figure of speech to know what to do next (this is also the COGA floor).
- **Sentence case for headings** ("What we do"), matching the site. Title case is the
  exception; say so when you use it.

### Forbidden (proposed — confirm with the brand owner)

- **Vendor/hype language:** *revolutionary, cutting-edge, synergy, best-in-class, seamless,
  game-changer, end-to-end solution,* and *leverage* as a verb. Technical Tom is the reason —
  this is the register he distrusts.
- **Pitching inside a white paper.** No "that's where we come in," no closing CTA that sells.
- **Internal-only framing, never public.** Strategy docs describe the funnel in blunt terms
  (e.g. the paper "deepens the wound"). That language is for the team, not for any reader-
  facing surface. Keep it out of copy.

### Signature phrases (from existing copy)

- "Quietly growing beneath the canopy. Something is taking root." (site metadata / tagline)
- "We meet you where you are." (homepage)
- "Is your understory on fire?" (the quiz's mass-market hook)
- "Clear the brush before fire season." (Brush Fire white paper)
- "This accumulation is physics, not failure." (Brush Fire white paper)
- The four crisis types as proper nouns: **Brush Fire, Smolder, Crown Fire, Firestorm.**

## Visual foundations

- **Color.** Forest green (`--forest-700`, `#2d5a3d`) is the spine and the nav surface in
  both themes. Warm earth (`--earth-400`, `#e8a87c`) is the accent and leads on dark
  surfaces; it is used sparingly. On light surfaces the green leads, because the earth tone
  is too pale to carry text at AA. The **severity ramp** (brush → smolder → crown →
  firestorm) is the signature asset: warm-to-hot, decorative reinforcement only, always
  paired with the type's name in text. The neutral ramp runs a full 0–900, status covers
  success / warning / danger / info, and there are soft forest and earth tints for selected
  states and callouts. Raw ramps and semantic aliases live in `tokens/colors.css`.
- **Type.** Hanken Grotesk for display and body (see the source-materials note). Headings
  lead bold/extrabold so the page reads with weight, not thin. Scale runs 1rem body to
  2.5rem hero, sentence-case headings, line height 1.6 for body. See
  `tokens/typography.css`.
- **Spacing and layout.** 4px grid. Content max 1200px, prose max 800px, 44px minimum touch
  target. `tokens/spacing.css`.
- **Backgrounds.** Dark canvas by default (`#1a1a1a`) with a light theme. A subtle top-down
  gradient (card → canvas) is used on heroes. No photographic backgrounds.
- **Corner radii.** 8px controls, 12px cards, 16px panels, pill for badges.
- **Cards.** Lifted surface, hairline border, default flat; the soft forest-tinted shadow is
  reserved for interactive hover.
- **Shadows.** Forest-tinted, not black — and a **proposal**: the live site is nearly flat.
  `tokens/elevation.css`.
- **Motion.** Calm and quiet: 0.2s color/hover, 0.3s theme and page-enter fades, eased, no
  spring. Collapses to zero under `prefers-reduced-motion`. `tokens/motion.css`.
- **Imagery.** Per the smokejumper brief: clean stylized vector — layered canopy and root
  systems, forest cross-sections. Not gritty, not photorealistic, no literal parachutes.

## Iconography

- **System.** No icon set is in use yet; the only glyph in the live UI is the theme toggle.
  Pick a single light-stroke set (a **proposal** — e.g. Lucide) and record the choice here.
- **The mark is not an icon.** Use `assets/UC_Logo.png`, never a look-alike leaf glyph.

## Products and surfaces

Understory ships a marketing site (home, advisory, implementation, portfolios, newsletter,
contact, accessibility), the ungated **"What's On Fire?" quiz** with four crisis-type result
screens, and crisis-specific **white papers** delivered by email. The quiz-result screen is
the design system's canonical kit because it exercises the severity ramp, the voice, and the
primary CTA together.

## File index

```
README.md            ← this guide
SKILL.md             ← agent-skill entry point
styles.css           ← single entry point for standalone surfaces (imports only)
tokens/              ← fonts, colors, typography, spacing, elevation, motion, base
assets/              ← UC_Logo.png (badge/wordmark)
components/          ← button, card, input, nav, severity-badge
ui_kits/             ← quiz-result.html (canonical screen)
templates/           ← page.html (copy-and-fill starting point)
guidelines/          ← foundations.html (color, severity, type, component specimens)
```

## Using the system

**The running React site** imports the token files directly in `src/index.css` and keeps its
own reset — so the design system is the single source of truth for color, type, spacing,
elevation, and motion, while components keep consuming the variable names they always have
(`--bg-primary`, `--accent-color`, …). Those names are mapped onto the semantic layer at the
bottom of `tokens/colors.css`.

**A standalone surface** (a prototype, a new static page, the specimens) links one file:

1. `<link rel="stylesheet" href="design-system/styles.css">` — repoint the path.
2. Set `data-theme="dark"` or `"light"` on `<html>` (dark is the default).
3. Style with the CSS custom properties. Never hard-code a value that exists as a token.
4. To start a new screen, copy `templates/page.html` and repoint its stylesheet link.

When a written rule here and the UI kit disagree, match the kit.
