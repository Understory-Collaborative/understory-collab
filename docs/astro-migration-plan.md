# Astro migration: scope

Moving understorycollab.com from a Vite + React single-page app to Astro. Scoped
2026-09-22. Sizes are relative (S, M, L), not time estimates.

---

## Recommendation

Migrate, as its own project on its own branch, with a Vercel preview for each phase. Switch
the live site over only when the parity checklist at the end passes.

## Why

| Today (single-page app) | With Astro |
|---|---|
| Page content exists only after JavaScript runs. Google renders it; many other crawlers and AI search tools see an empty page. | Every page is real HTML at build time. |
| Every page downloads the whole app: about 540 KB of JavaScript (166 KB gzipped). The build warns about it. | Pages with no interactive parts ship no JavaScript. Interactive parts load only on their own pages. |
| Link previews need a post-build script (`scripts/prerender-meta.js`) and Vercel rewrites, and a mistyped post URL gets Vercel's plain 404. | Each page sets its own tags in its HTML. The script, the rewrites, and the 404 tradeoff all go away. |
| The blog loader (`src/lib/posts.js`) parses frontmatter by hand. | Astro content collections read `content/posts` natively, with a schema that catches a bad field at build time. |

## What stays the same

- **The design system:** `design-system/tokens/`, `src/index.css`, and each page's CSS file carry over as they are.
- **The Drive sync:** `scripts/blog-sync.js` keeps writing markdown to `content/posts`. The Docs menu, relay, and Action don't change.
- **Forms and data:** the `api/` functions (contact, subscribe, field guide, questions) keep their endpoints. Needs confirming in phase 0; see Risks.
- **Static extras:** `public/` (field guides, blog assets, `bedford/`, team photos) is copied as is.
- **Data files:** `src/data/*.js` (quiz, TPM self-check, offers, authors) are plain JavaScript and import unchanged.

---

## Page inventory

"Static" pages have no state and become plain Astro pages. "Island" pages keep a React component for the interactive part.

| Route | Today | In Astro | Size |
|---|---|---|---|
| `/` | Home.jsx, static | Astro page | S |
| `/about` | About.jsx, static | Astro page | S |
| `/about/[slug]` | AuthorProfile.jsx | Astro page + `getStaticPaths` from `authors.js` | S |
| `/our-work` | OurWork.jsx, static | Astro page | S |
| `/office-hours` | OfficeHours.jsx, static | Astro page | S |
| `/offers/[slug]` | OfferPage.jsx | Astro page + `getStaticPaths` from `offersData.js` | S |
| `/accessibility`, `/privacy`, `/unsubscribe` | static | Astro pages | S |
| `/blog` | Blog.jsx | Astro page reading the collection | S |
| `/blog/[slug]` | BlogPost.jsx, react-markdown | Astro page + `getStaticPaths`; markdown rendered at build | M |
| `/tpm-types` | TpmTypes.jsx, static | Astro page | S |
| `/tpm-types/[slug]` | TpmTypeDetail.jsx, with HexRadar and the ShareType share card | Astro page + `getStaticPaths`; HexRadar is SVG and renders with no JavaScript; ShareType becomes an island | M |
| `/contact` | Contact.jsx, form, reads `?door=` | Island (`client:load`); reads the query from `window.location` | M |
| `/questions` | Questions.jsx, Q&A form | Island | M |
| `/assessment` | Quiz.jsx, 16 hooks, field-guide capture | Island | L |
| `/tpm-self-check` | TpmSelfCheck.jsx, localStorage, print, ShareType canvas export | Island | L |
| 404 | NotFound states inside pages | `src/pages/404.astro` | S |

### Shared pieces

| Piece | Today | In Astro | Size |
|---|---|---|---|
| Layout (nav, footer, skip link) | Layout.jsx with React Router `<Outlet>` | `BaseLayout.astro` | S |
| Page metadata | PageMeta.jsx sets tags after load | `<head>` props on `BaseLayout`; delete PageMeta | S |
| Navigation | Dropdown, mobile menu, active link | Keep as a small React island, or rewrite as a plain script | M |
| Theme | ThemeContext + inline script in `index.html` | Move the inline script into `BaseLayout`; the toggle becomes a small island or script | S |
| Focus on route change | Layout moves focus to `<main>` after navigation | Not needed: every link is a full page load, and the browser resets focus | S |
| Footer newsletter form | SubscribeForm.jsx | Island (`client:visible`) | S |
| Redirects | `<Navigate>` routes in App.jsx | `redirects` in `astro.config.mjs` | S |
| Sitemap | `scripts/generate-sitemap.js` | `@astrojs/sitemap`, or keep the script | S |

---

## Phases

Each phase lands as a PR onto a long-lived `astro` branch with a Vercel preview. The live site keeps running from `main` throughout.

| Phase | What | Done when |
|---|---|---|
| **0. Spike** | Astro + `@astrojs/react` in the repo, one static page, one island, one `api/` call from the preview. | The preview deploys, the island works, and a form reaches its `api/` function. |
| **1. Shell** | `BaseLayout`, nav, footer, theme, global CSS, redirects, 404. | Every page shell matches today's in both themes and at phone width. |
| **2. Static pages** | Home, About, Our Work, Office Hours, Offers, TPM types, legal pages, author profiles. | Visual match with today, and View Source shows the page content and its own tags. |
| **3. Blog** | Content collection on `content/posts`, blog index, post page with cover hero, Q&A layout, bylines. | Every current post renders the same, and link previews work without the prerender script. |
| **4. Islands** | Contact, Questions, footer subscribe, then Assessment and TPM self-check. | Each form submits end to end on the preview. The self-check saves, prints, and exports its share card. |
| **5. Cut over** | Delete React Router, PageMeta, `prerender-meta.js`, and the Vercel rewrites. Update docs. Merge to `main`. | The parity checklist passes on the preview. |

## Risks

| Risk | Why | Mitigation |
|---|---|---|
| `api/` functions on Vercel | They deploy today as Vercel functions beside a static build. Astro should keep that, but it's the one piece this plan can't confirm from the repo alone. | Prove it in phase 0 before anything else moves. |
| Blog rendering differences | react-markdown and Astro's markdown differ on edge cases; the Q&A split and heading demotion are custom. | Port the Q&A split as a build-time step, and compare every current post side by side. |
| Island bugs | Assessment and self-check hold a lot of state, and ShareType (on the self-check and every TPM type page) draws on a canvas. | Move them late, when the shell is stable; they keep their React code, so the change is in how they mount. |
| URL changes | Any changed path breaks shared links and search results. | Keep every path the same. Carry the existing redirects over, and check the sitemap before and after. |
| Drive sync timing | Posts sync to `main`, and the `astro` branch falls behind. | Merge `main` into `astro` at every phase. |

## Parity checklist (before cut over)

- [ ] Every route in the inventory loads on the preview, in light and dark, at desktop and 390px.
- [ ] Every old redirect still redirects.
- [ ] Contact, Questions, subscribe, and field guide submit, and the submissions arrive.
- [ ] The assessment reaches a result and captures the email.
- [ ] The TPM self-check saves progress, prints, and exports its share card.
- [ ] Each blog post matches today's version: cover hero, subtitle, byline, Q&A layout, and tags.
- [ ] Link previews on LinkedIn's Post Inspector show the right title and image for a post, a profile, and `/blog`.
- [ ] Keyboard only: skip link, nav dropdown, forms, and the self-check work, with visible focus.
- [ ] The sitemap lists the same URLs as before.
- [ ] Pages with no interactive parts ship no JavaScript (check the network tab).

## Open questions for webs

1. Timing: start now, or after the current content push?
2. Navigation: keep it as React, or rewrite it as a plain script so most pages ship no JavaScript at all?
3. Blog URLs: keep `content/posts` where the Drive sync writes today (no sync change), or move to Astro's default `src/content`?
