---
name: understory-design
description: Use this skill to generate well-branded interfaces and assets for Understory Collaborative (a technology consultancy that drops in early to protect the foundational systems a business grows from), for production or for throwaway prototypes and mocks. Contains the design guidelines, colors, type, fonts, assets, and UI kit components.
user-invocable: true
---

Read the `README.md` file within this skill first, then explore the other files.

If you are creating visual artifacts (slides, mocks, throwaway prototypes), copy assets out
and build static HTML that links `styles.css`. If you are working on the production React
site, the tokens are already wired in through `src/index.css` — read the rules here, style
with the existing CSS variables, and never hard-code a value that exists as a token.

Two standing rules for this brand specifically:
- **Never invent brand content.** The voice, forbidden-phrase, and signature-phrase sections
  in the README are drafted proposals, not settled law. If copy is missing or ambiguous,
  flag it as an open question rather than filling the gap.
- **The metaphor lives in the words, not the pictures.** Forest-and-fire language, never
  literal flames or parachutes.

If the user invokes this skill without other guidance, ask what they want to build, ask a
few questions, and act as an expert designer who outputs HTML artifacts or production code.

## Quick reference

- **Brand:** Understory Collaborative, "Quietly growing beneath the canopy." A consultancy
  that protects the systems a business grows from. Voice: a seasoned CTO talking to a peer.
- **Palette:** forest green `#2d5a3d` (primary / nav), warm earth `#e8a87c` (accent, used
  sparingly, leads on dark). Severity ramp — brush `#e8a87c` → smolder `#e07b4c` → crown
  `#d94f30` → firestorm `#c62828`. Dark canvas `#1a1a1a` default, light theme available.
- **Type:** system UI stack (stand-in — no brand face supplied yet). Sentence-case
  headings, 1rem base, 1.6 body line height.
- **Icons:** none in use yet; pick one light-stroke set if needed (proposal).
- **Feel:** soft forest-tinted shadows (reserved for hover; site is mostly flat), 8px
  control radius, calm eased motion, no spring.

## Files

- `styles.css` — link this one file (standalone surfaces) to get tokens, base, and components.
- `tokens/` — colors, typography, spacing, elevation, motion, fonts.
- `assets/` — `UC_Logo.png`.
- `components/` — button, card, input, nav, severity-badge.
- `ui_kits/quiz-result.html` — the canonical screen; match it when a rule is ambiguous.
- `guidelines/foundations.html` — color, severity, type, and component specimens.

When in doubt, match the UI kit. It is the canonical expression of the brand.
