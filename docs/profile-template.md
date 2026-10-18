# Profile template

This is the source for the `_TEMPLATE (make a copy)` Google Doc in `UC Team / Drafts`
(https://docs.google.com/document/d/1nyRbP_RyfQya5h31OunA4l8b_AOyR2_AmZ5ac2SxrfY/edit).
Each UC person makes their own profile page, `/about/<slug>`, by copying that Doc. The
layout follows webs's page at https://understorycollab.com/about/webs, top to bottom.

The sync that reads these Docs isn't built yet. Until it is, profiles are still typed
into `src/data/authors.js`, and this file is the plan for what the Doc asks for.

A profile needs a **photo**, a **name**, a **slug**, and at least one **link**. A
**role**, a **TPM type**, and a **bio** are optional but recommended.

The photo is redrawn as a hedcut portrait by `scripts/portrait-test.js` (Gemini on
Vertex AI, then `scripts/portrait-accent.js` to keep one signature color). The person
approves it by looking at their draft page and then moving the Doc to Published. Its alt
text is written for them, as "Hedcut portrait of <name>", so the Doc doesn't ask for one.

---

## What the person sees in the template Doc

> **How to use this template** _(delete this note in your copy)_
> Right-click this Doc and choose **Make a copy**. Name the copy anything you like; the
> name only helps you find it in Drive. Fill in the lines below, keeping each label (like
> **Slug:**) at the start of its line. Leave your copy in **UC Team / Drafts** to preview
> it. Move it to **UC Team / Published** to put it live.
>
> **Your photo** _(replace this line with your photo)_: paste a photo of yourself here.
> It gets redrawn as a hedcut portrait, a stipple-and-line drawing in olive ink, so every
> UC person matches. For the best likeness:
> - Look straight at the camera, shoulders up.
> - Stand in front of a plain wall.
> - Use a photo at least 1,500 pixels wide. A phone photo is fine.
> - Wear a top without words or logos.
> - One signature item can keep its color, like red glasses. Everything else becomes olive.
>
> _[Your name as you want it shown, styled as **Heading 1**.]_
>
> **Slug:** your-name (lowercase, with hyphens between words). Your page will be
> understorycollab.com/about/your-name, and understorycollab.com/your-name will lead
> there too.
>
> **Full name:** _(optional)_ Your full professional name, if it's different from the
> name above. It isn't shown on the page; it helps search engines connect this page to
> your other work.
>
> **Role:** Your title at UC, for example Co-founder. Shows under your name.
>
> **TPM type:** _(optional)_ Your result from the TPM self-check, for example The
> Polymath. Shows under your role, linked to that type's page. Take the self-check at
> understorycollab.com/tpm-self-check.
>
> **Links:** One link per line: the link text, then a |, then the web address. They
> show as a row of small links with icons under your TPM type, in this order, so put the
> one you most want people to tap first.
> LinkedIn | https://www.linkedin.com/in/your-name
> My website | https://example.com
>
> **Bio**, styled as **Heading 2**. Write your bio under it in plain paragraphs.
>
> ---
>
> **To check your page:** keep your copy in **UC Team / Drafts**. Your preview page, with
> your hedcut portrait, shows at a private link. If you don't like the portrait, swap in a
> different photo and it gets redrawn.
> **To publish:** move your copy into **UC Team / Published**. Moving it there is how you
> approve your portrait.

---

## How each field maps to the page

| In the Doc | Becomes | Needed? |
|---|---|---|
| First image | Redrawn as a hedcut, shown as the round portrait at the top; its alt text is "Hedcut portrait of _name_" | Yes |
| First Heading 1 | Name, the page title | Yes |
| `Slug:` line | Web address, `/about/<slug>`; the name is the fallback | Yes |
| `Full name:` line | Search engines only (`alternateName`) | Optional |
| `Role:` line | Line under the name | Optional |
| `TPM type:` line | "TPM type:" line, linked to `/tpm-types/<id>` | Optional |
| `Links:` lines | Row of small icon links under the TPM type, a LinkedIn icon for LinkedIn and a globe for everything else; also tells search engines these profiles are the same person (`sameAs`) | At least one |
| Paragraphs under the `Bio` heading | "About _name_" section | Optional; the page says "Bio coming soon" without it |
| Nothing | "Posts by _name_" list, filled in from blog posts whose `Author:` matches | Automatic |

## Decisions (webs, 2026-10-18)

| Question | Decision |
|---|---|
| A TPM type line that doesn't match a type in `src/data/tpmSelfCheckData.js` | The page publishes without it, and the sync log names the typo. |
| Where profile Docs live | A separate `UC Team` folder with its own `Drafts` and `Published`, kept apart from the blog. |
| webs's extra profiles (TikTok, GitHub, Thoughtworks) | They move into her Doc as links, so they show on her page too, and `authors.js` stops holding them. |
| Short links | Each person also gets `/<slug>`, redirecting to `/about/<slug>`. The sync refuses slugs that clash with a real page, like `/start`. |
| The portrait | A hedcut in olive ink on cream, with one signature item allowed to keep its color. |
