# Understory Collaborative — website

Marketing site for Understory Collaborative, built as a React + Vite single-page app and
deployed from the `preview` branch.

## Stack

- **React 19** + **React Router 7**, built with **Vite 7**
- Plain CSS driven by a token-based design system (no CSS framework)
- Serverless form handlers under `api/` (Vercel Node functions)
- ESLint (flat config) for linting

## Develop

```bash
npm install
npm run dev      # local dev server (Vite)
npm run build    # production build to dist/
npm run lint     # eslint
npm run preview  # serve the production build locally
```

Run `npm run build` and `npm run lint` before every commit — both must pass.

## Deploy

The host builds from the **`preview`** branch. Work on a feature branch, open a PR into
`preview`, and merge it; that is what goes live. `main` is not the deploy branch.

## Layout

| Path | What it is |
|---|---|
| `src/pages/` | Routed pages (Home, About, OurWork, Contact, OfficeHours, Questions, Quiz/assessment, OfferPage, Apply, Privacy, Accessibility, Unsubscribe) |
| `src/components/` | Layout, Navigation, Footer, SubscribeForm |
| `src/data/` | `quizData.js` (the "What's On Fire?" assessment), `offersData.js` |
| `api/` | Serverless form handlers — see **Forms** below |
| `design-system/` | Design tokens, component CSS, guidelines, and the `SKILL.md` / `README.md` spec. The site imports the token files directly; `design-system/styles.css` is a specimen aggregator, not used by the app |
| `HANDOFF.md` | Living state for the funnel redesign — read this first for current decisions and what's next |

## Forms

No form needs a paid plan or a committed secret; form ids are public.

| Form | Handler | Backend |
|---|---|---|
| Contact | `api/contact.js` | Emails the message to `contact@understorycollab.com` via Resend. No list write; contacting us is not a newsletter opt-in |
| Newsletter | `src/lib/subscribe.js`, `api/subscribe.js` | MailerLite (double opt-in). Signup source tagged via `MAILERLITE_GROUPS` |
| Field guide | `api/field-guide.js` | Adds the email to MailerLite (assessment group, double opt-in) to capture the lead, and delivers the guide via an instant on-page download plus an optional Resend email |
| Q&A | `api/questions.js` | Posts to a Google Form's `/formResponse` |

Copy `.env.example` to `.env` for local overrides. The newsletter and the field guide need
`MAILERLITE_API_KEY`; the contact form and the field-guide email also need `RESEND_API_KEY`
plus a verified from address (`CONTACT_NOTIFY_FROM` or `FIELD_GUIDE_FROM`); the Q&A form needs none.

## Design system & brand

The brand is an **olive** identity in two modes (deep-olive dark canvas, warm-cream light),
with a shared lime action color. Colors, type (Overpass), spacing, and elevation live in
`design-system/tokens/`. See `design-system/README.md` and `design-system/VOICE.md` (the
website copy voice gate) before writing UI or copy.
