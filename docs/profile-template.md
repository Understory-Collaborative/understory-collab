# Profile template

This is the source for the `_TEMPLATE — make a copy` Google Doc that will live in the
`UC Team` folder. Each UC person makes their own profile page, `/about/<slug>`, by
copying that Doc. The layout follows webs's page at
https://understorycollab.com/about/webs, top to bottom.

The sync that reads these Docs isn't built yet. Until it is, profiles are still typed
into `src/data/authors.js`, and this file is the plan for what the Doc asks for.

A profile needs a **photo**, a **name**, a **slug**, a **photo description**, and at
least one **link**. A **role**, a **TPM type**, and a **bio** are optional but
recommended.

---

## What the person sees in the template Doc

> **How to use this template** _(delete this note in your copy)_
> Right-click this Doc → **Make a copy**. Name the copy anything you like; the Doc
> name is only for finding it in Drive. Fill in the fields below, then leave the copy
> in **Drafts** to preview it or move it to **Published** to go live.
>
> _[Paste your photo here, at the very top. A head-and-shoulders shot works best. The
> page crops it to a circle around your face.]_
>
> **Photo description:** A few words for people who use screen readers, for example
> "Portrait of Jordan Reyes outdoors".
>
> _[Your name as you want it shown, styled as **Heading 1**.]_
>
> **Slug:** your-name (lowercase, hyphens between words). Your page will be
> understorycollab.com/about/your-name.
>
> **Full name:** _(optional)_ Your full legal or professional name, if it's different
> from the name above. It isn't shown on the page; it helps search engines connect
> this page to your other work.
>
> **Role:** Your title at UC, for example Co-founder. Shows under your name.
>
> **TPM type:** _(optional)_ Your result from the TPM self-check, for example The
> Polymath. Shows under your role, linked to that type's page. Take the self-check at
> understorycollab.com/tpm-self-check.
>
> **Links:** One link per line, the button text, then a `|`, then the web address. They
> show as a stack of buttons under your TPM type, in this order. Put the one you most
> want people to tap first.
> LinkedIn | https://www.linkedin.com/in/your-name
> My website | https://example.com
>
> **Bio**, styled as **Heading 2**. Write your bio under it in plain paragraphs. It
> shows under the heading "About _your name_".

---

## How each field maps to the page

| In the Doc | Becomes | Needed? |
|---|---|---|
| First image | Round photo at the top | Yes |
| `Photo description:` line | The photo's alt text | Yes |
| First Heading 1 | Name, the page title | Yes |
| `Slug:` line | Web address, `/about/<slug>`; the name is the fallback | Yes |
| `Full name:` line | Search engines only (`alternateName`) | Optional |
| `Role:` line | Line under the name | Optional |
| `TPM type:` line | "TPM type:" line, linked to `/tpm-types/<id>` | Optional |
| `Links:` lines | Stack of buttons under the TPM type; also tells search engines these profiles are the same person (`sameAs`) | At least one |
| Paragraphs under the `Bio` heading | "About _name_" section | Optional; the page says "Bio coming soon" without it |
| Nothing | "Posts by _name_" list, filled in from blog posts whose `Author:` matches | Automatic |

## Open questions before the sync is built

| Question | Why it matters |
|---|---|
| Which TPM type names count? The Doc line has to match a type in `src/data/tpmSelfCheckData.js`. | A typo would drop the line silently, so the sync should warn instead. |
| Should the Drafts and Published folders be shared with the blog's, or separate under `UC Team`? | Separate folders keep profiles out of the blog's list, at the cost of one more folder ID to set up. |
| Do the hand-entered extras on webs's profile (her TikTok, GitHub, and Thoughtworks links in `sameAs`) move into her Doc as links, or stay in `authors.js`? | Profiles should live in one place. |
