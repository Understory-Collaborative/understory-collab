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
| The blog loader (`src/lib/posts.js`) parses frontmatter by hand. | Astro content collections read `src/content/blog` natively, with a schema that catches a bad field at build time. |

## What stays the same

- **The design system:** `design-system/tokens/`, `src/index.css`, and each page's CSS file carry over as they are.
- **The Drive sync, mostly:** the Docs menu and relay don't change. Posts move to Astro's default folder, so the sync's output path changes (see phase 3).
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
| Navigation | Dropdown, mobile menu, active link | Astro markup plus a small plain script (no React). Keep today's look, hover grace period, gap bridge, and keyboard behavior | M |
| Theme | ThemeContext + inline script in `index.html` | Move the inline script into `BaseLayout`; the toggle becomes a small plain script (no React) | S |
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
| **3. Blog** | Move posts to `src/content/blog` and define the collection. Point `scripts/blog-sync.js` (`POSTS_DIR`) and the `git add` paths in `.github/workflows/blog-sync.yml` at the new folder. Blog index, post page with cover hero, Q&A layout, bylines. | Every current post renders the same, a Drive sync writes to the new folder, and link previews work without the prerender script. |
| **4. Islands** | Contact, Questions, footer subscribe, then Assessment and TPM self-check. | Each form submits end to end on the preview. The self-check saves, prints, and exports its share card. |
| **5. Cut over** | Delete React Router, PageMeta, `prerender-meta.js`, and the Vercel rewrites. Update docs. Merge to `main`. | The parity checklist passes on the preview. |

## Phase 0 notes (2026-09-22)

Built and checked locally, then confirmed on the Vercel preview.

| What | Where it stands |
|---|---|
| Astro 7 + `@astrojs/react` 7 | Installed. `npm run build` is now `astro build`; the old app still builds with `npm run build:vite` for side-by-side checks. |
| No Vercel adapter | Static output only, so Vercel keeps treating `api/` as functions. The adapter would replace that folder, so leave it out unless a page ever needs a server. |
| `vercel.json` | Sets `"framework": "astro"` and drops the SPA rewrites. The catch-all would have served the spike for every URL, and the blog rewrites point at files the prerender script no longer writes. Unported routes 404 on the preview until their phase lands. |
| Old React pages | Moved from `src/pages/` to `src/views/`, since Astro treats `src/pages/` as routes. They stay until cut over, so `npm run build:vite` can render the old site for side-by-side checks. Phase 5 deletes them with React Router. |
| Spike page | `src/pages/index.astro`, marked `noindex`. It loads `src/index.css`, mounts the footer `SubscribeForm` as a `client:visible` island, and runs a GET against `/api/subscribe`, which the function answers with a 405 without adding anyone. Phase 2 replaces it with Home. |
| JavaScript on the spike | About 61 KB gzipped for the React runtime and the island, loaded only because the island is there. Today's app ships 166 KB gzipped on every page. |
| Porting note | Astro drops a line break between text and an inline tag, as JSX does, so `submit\n<code>` renders as "submit<code>". Keep the space on the same line as the text, or use `{' '}`. |

webs checked the Vercel preview for `astro` on 2026-10-01, and phase 0 passes:

- [x] The spike page loads with the site's fonts and colors.
- [x] The function check reads "Pass".
- [x] The form reaches `/api/subscribe`. A real address got a 503 "Subscriptions are currently unavailable", which the function returns when `MAILERLITE_API_KEY` is missing, so the key isn't set for Vercel's Preview environment.

Before phase 4, add the form keys (`MAILERLITE_API_KEY`, `RESEND_API_KEY`, and the sender addresses in `.env.example`) to Vercel's Preview environment, or the forms can't submit end to end on the preview. A Preview key writes to the real MailerLite list, so test with your own address.

## Phase 1 notes (2026-10-01)

| What | Where it stands |
|---|---|
| `BaseLayout.astro` | Sets every `<head>` tag at build time from `title`, `description`, `image`, `ogType`, and `noindex` props, so PageMeta isn't needed on Astro pages. Canonical URLs have no trailing slash. |
| Nav | `Navigation.astro` plus a small plain script that Astro inlines. Screenshots match the old nav pixel for pixel in both themes at 1280px and 390px. The hover grace period, gap bridge, click after hover, ArrowDown, Escape, outside click, mobile menu, and `aria-current` all pass the same checks as the old nav. |
| Theme | The inline script in `BaseLayout` sets the theme before first paint and saves it, as ThemeContext did. The toggle is part of the nav script. Both icons ship, and CSS shows the right one on first paint. |
| Footer | `Footer.astro`, with `SubscribeForm` as a `client:visible` island. |
| Skip link | Now an `<a href="#main-content">`, which works without JavaScript. It used to show a 3px strip at the top left, on the live site too; it now stays fully hidden until focused. |
| Redirects | In `vercel.json` rather than `astro.config.mjs`. Vercel sends real 308 redirects, where Astro's static build writes meta-refresh pages. |
| 404 | `src/pages/404.astro`, served with a 404 status. The copy is a draft for webs to edit. |
| Home | `src/pages/index.astro` is a placeholder inside the shell until phase 2. Every other route 404s on the preview for now. |

One tradeoff to decide before phase 4: the footer form is a React island, so every page loads React (about 60 KB compressed) once the footer scrolls into view. Rewriting that one form as a plain script, like the nav, would drop React from every page that has no other interactive part.

## Phase 2 notes (2026-10-01)

| What | Where it stands |
|---|---|
| Pages | Home, About, Our Work, Office Hours, Accessibility, Privacy, Unsubscribe, the three offer pages, the author profile, the TPM types index, and all twelve type pages. 25 pages build. |
| How | A script converted the JSX mechanically (`class`, `href`, image imports, and page metadata moved to `BaseLayout` props), so the copy is unchanged character for character. The four data-driven pages use `getStaticPaths` from `authors.js`, `offersData.js`, and `tpmSelfCheckData.js`. |
| Content check | For all 24 routes, the rendered `<main>` HTML matches the old app's after normalizing attribute order and asset URLs, and so do the title, description, `og:title`, robots, and canonical path. |
| Visual check | Screenshots of `<main>` in both themes at 1280px and 390px: 86 of 96 are pixel-identical. The other ten differ by 1 to 86 pixels of glyph edges on lines with links, with the same DOM and computed styles. |
| `HexRadar` | Renders to static SVG at build time, with no JavaScript. |
| `ShareType` | A `client:only` island, since it reads `window` while rendering. It also needed one fix: Astro imports images as objects, so the canvas got no logo until `ShareType.jsx` read the URL from `.src`. The share card now matches the old one pixel for pixel. Check any other React component that imports an image when it becomes an island. |
| Unknown slugs | `/offers/x` used to redirect home, and unknown profiles and types showed their own "not found" text. All three now get the site 404 page. |
| Author profile previews | The tags match `scripts/prerender-meta.js`, apart from `og:title`, which now includes the site name like every other page. |

## Phase 3 notes (2026-10-07)

| What | Where it stands |
|---|---|
| Posts | Moved from `content/posts` to `src/content/blog`, working notes included. `content/white-papers` stays where it is. |
| Collection | `src/content.config.ts` defines `blog` with a schema: a missing title, a date that isn't `YYYY-MM-DD`, a slug with spaces or capitals, or a non-boolean `draft` fails the build and names the post. |
| Why not Astro's YAML loader | The sync escapes markdown characters inside quoted values, so the current draft's title is `"\[Title: webs decides\]"`. YAML rejects `\[`, so one post would fail every build. The collection's loader uses the site's existing line parser (`src/lib/frontmatter.js`), which the old app, the collection, and the scripts now share. |
| Markdown | Rendered by the same `react-markdown` setup as before (`BlogProse.jsx`), at build time with no JavaScript. That removes the rendering-differences risk below. The Q&A split moved to `src/lib/qa.js`. |
| Content check | Against a build of `main`: the blog index, all five posts (including the Q&A post and the drafts), and the profile's post list render the same HTML. Screenshots of the index are pixel-identical; posts differ by 3 to 14 pixels of glyph edge on the byline link. |
| Link previews | Each post's raw HTML carries the same tags `prerender-meta.js` writes on `main`: title, description, cover image, `og:type` article, published date, author, and tags. Link previews on `og:title` and `twitter:title` now use the page's own title on every page, as the prerender did. |
| Sitemap | `npm run build` runs `scripts/generate-sitemap.js` before `astro build`. Its URLs and `robots.txt` match `main`'s. |
| Drive sync | `scripts/blog-sync.js`, the sitemap and prerender scripts, and the Action's `git add` all point at `src/content/blog`. The Action runs from `main`, so the change takes effect at cut over. |

Until cut over, the sync keeps writing to `main`'s `content/posts`. When merging `main` into `astro`, git follows the move for edited posts, but a new post lands in `content/posts`. After each merge, run `git mv -f content/posts/*.md src/content/blog/` if that folder exists.

## Risks

| Risk | Why | Mitigation |
|---|---|---|
| `api/` functions on Vercel | They deploy today as Vercel functions beside a static build. Astro should keep that, but it's the one piece this plan can't confirm from the repo alone. | Prove it in phase 0 before anything else moves. |
| Blog rendering differences | react-markdown and Astro's markdown differ on edge cases; the Q&A split and heading demotion are custom. | Resolved in phase 3: posts render through the same react-markdown setup at build time. |
| Island bugs | Assessment and self-check hold a lot of state, and ShareType (on the self-check and every TPM type page) draws on a canvas. | Move them late, when the shell is stable; they keep their React code, so the change is in how they mount. |
| URL changes | Any changed path breaks shared links and search results. | Keep every path the same. Carry the existing redirects over, and check the sitemap before and after. |
| Drive sync timing | Posts sync to `main`'s `content/posts` until cut over, and the `astro` branch reads `src/content/blog`. | Merge `main` into `astro` at every phase and move any new posts across. Switch the sync's folder in the same merge as cut over, and don't run a sync during it. |

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
- [ ] Pages with no interactive parts ship no JavaScript beyond the small nav and theme scripts (check the network tab).
- [ ] A Drive sync after cut over writes to `src/content/blog` and the post appears.

## Decisions (webs, 2026-09-22)

| Question | Decision |
|---|---|
| Timing | Start now, in a new conversation. |
| Navigation and theme toggle | Rewrite as plain scripts, so most pages ship no React at all, as long as the nav still looks and behaves exactly as it does today. |
| Where posts live | Move to Astro's default, `src/content/blog`. The Drive sync and its Action change with it (phase 3). |
