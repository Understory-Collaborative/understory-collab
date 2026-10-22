# Profile template

This is the source for the `_TEMPLATE (make a copy)` Google Doc in `UC Team / Drafts`
(https://docs.google.com/document/d/1nyRbP_RyfQya5h31OunA4l8b_AOyR2_AmZ5ac2SxrfY/edit).
Each UC person makes their own profile page, `/about/<slug>`, by copying that Doc. The
layout follows webs's page at https://understorycollab.com/about/webs, top to bottom.

`scripts/profile-sync.js` reads these Docs and builds the pages; the setup and how it
runs are at the end of this file. Profiles typed into `src/data/authors.js` by hand still
work, and a published Drive profile with the same slug replaces the hand-entered one.

A profile needs a **photo**, a **name**, a **slug**, and at least one **link**. A
**role**, a **TPM type**, and a **bio** are optional but recommended.

The photo is redrawn as a hedcut portrait by `scripts/portrait.js` (Gemini on
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
> **Use my photo as is:** _(optional)_ Write yes to show your photo exactly as you
> pasted it, cropped to a circle, instead of redrawing it as a hedcut. Use this if you've
> retouched your own portrait or have one an artist drew. Delete the yes to switch back.
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
> **To check your page:** keep your copy in **UC Team / Drafts**. Choose **UC Profile**,
> then **Preview now**, and your preview link appears; the page is ready a few minutes
> later. If you don't like the portrait, swap in a different photo and preview again.
> **To publish:** choose **UC Profile**, then **Publish**, or move your copy into **UC Team
> / Published**. Moving it there is how you approve your portrait.

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
| `Use my photo as is:` line | `yes` shows the photo as pasted, cropped to a square near the top, instead of a hedcut; its alt text is "Portrait of _name_" | Optional |
| `Links:` lines | Row of small icon links under the TPM type, a LinkedIn icon for LinkedIn and a globe for everything else; also tells search engines these profiles are the same person (`sameAs`) | At least one |
| Paragraphs under the `Bio` heading | "About _name_" section | Optional; the page says "Bio coming soon" without it |
| Nothing | "Posts by _name_" list, filled in from blog posts whose `Author:` matches | Automatic |

## A profile's lifecycle

| To | Do this | What happens |
|---|---|---|
| Start a profile | Copy the template into `UC Team / Drafts`, fill it in, and choose **UC Profile → Preview now** | A draft page at `/about/<slug>`, noindex, with the portrait drawn once |
| Publish it | **UC Profile → Publish**, or move the Doc to `UC Team / Published` | The page goes live, with a `/<slug>` short link |
| Edit a live profile | Edit the Doc in `Published`, then **UC Profile → Preview now**, or wait for the daily run | The change goes **straight live**; there's no preview step for a published Doc. The portrait isn't redrawn unless the photo changed. |
| Change the photo | Paste the new photo in place of the old one | A new portrait is drawn; the old file is removed |
| Re-copy the Doc (to get the menu, say) | Copy it, keep the same photo, and remove the old Doc from both folders | The portrait is reused, not redrawn, because it's matched by photo |
| Take a profile down | Move the Doc out of both `Drafts` and `Published` (into `UC Team` itself, say), or trash it | The next sync removes the page, its portrait, and its short link. The menu can't start this run, since the relay only acts on Docs in the two folders, so it waits for the daily run or a manual one. |

Moving a published Doc back to `Drafts` doesn't take the page down: it keeps the page up
at the same address as a noindex draft.

## Decisions (webs, 2026-10-18)

| Question | Decision |
|---|---|
| A TPM type line that doesn't match a type in `src/data/tpmSelfCheckData.js` | The page publishes without it, and the sync log names the typo. |
| Where profile Docs live | A separate `UC Team` folder with its own `Drafts` and `Published`, kept apart from the blog. |
| webs's extra profiles (TikTok, GitHub, Thoughtworks) | They move into her Doc as links, so they show on her page too, and `authors.js` stops holding them. |
| Short links | Each person also gets `/<slug>`, redirecting to `/about/<slug>`. The sync refuses slugs that clash with a real page, like `/start`. |
| The portrait | A hedcut in olive ink on cream, with one signature item allowed to keep its color. |

## How the sync runs

`.github/workflows/profile-sync.yml` runs `scripts/profile-sync.js` once a day at 12:30
UTC, and on demand from **Actions → Profile sync from Google Drive → Run workflow**. For
each Doc in `UC Team / Drafts` and `UC Team / Published` (skipping names that start with
`_`, like the template), it:

1. Reads the labeled lines, the Heading 1 name, the links, and the bio.
2. Sends the first image to Gemini on Vertex AI to be redrawn as a hedcut
   (`scripts/portrait.js`), then keeps only one signature color (`scripts/portrait-accent.js`).
   It only redraws when the photo changes, so a re-run costs nothing.
3. Writes every profile into `src/data/team.generated.js` and each portrait into
   `public/team/<slug>-<hash>.webp`, then adds a `/<slug>` short link in `vercel.json`
   for each published profile.

A draft previews at `/about/<slug>`, or at `/about/<slug>-preview` when that slug is
already live, so a person redoing their page keeps the live one up while they edit.

## Preview from the Doc

The template carries a **UC Profile** menu with **Preview now** and **Publish**, so
teammates don't need GitHub or a day's wait. It's the blog's menu idea
(`docs/blog-pipeline-setup.md`, "Run the sync from the Doc") pointed at the profile sync,
through the same relay:

- **The relay** (`scripts/apps-script/relay/`) starts the profile sync for a Doc in the
  UC Team folders and the blog sync for a Doc in the UC Blog folders, and refuses any
  other Doc.
- **The menu** (`scripts/apps-script/profile-menu/`) lives in the profile `_TEMPLATE`
  Doc, so every copy gets it. It shows the preview link, `/about/<slug>`, or
  `/about/<slug>-preview` when that slug is already live.

To set it up, once:

1. **Update the relay.** Open the `UC Blog relay` project at https://script.google.com.
   Replace `Code.gs` with `scripts/apps-script/relay/Code.gs`. Under **Project Settings
   → Script properties**, add `DRIVE_TEAM_DRAFTS_FOLDER_ID` and
   `DRIVE_TEAM_PUBLISHED_FOLDER_ID`, the same values as the GitHub variables. Then
   choose **Deploy → Manage deployments → Edit → New version**, so the address stays
   the same. The GitHub token already covers the profile workflow.
2. **Add the menu to the template.** Open `_TEMPLATE (make a copy)` in `UC Team /
   Drafts` and choose **Extensions → Apps Script**. Replace `Code.gs` with
   `scripts/apps-script/profile-menu/Code.gs`, and paste the relay's web app URL into
   `RELAY_URL` at the top, the same address the UC Blog menu uses. Turn on **Show
   "appsscript.json" manifest file in editor** under **Project Settings**, and replace
   `appsscript.json` with `scripts/apps-script/profile-menu/appsscript.json`. Save and
   reload the Doc; the **UC Profile** menu appears next to **Help**.

The first time someone uses the menu, Google asks them to approve it and shows "Google
hasn't verified this app", the same as the blog menu; choose **Advanced → Go to UC
Profile (unsafe)**. It only reads the open Doc and calls the relay. A Doc copied before
the menu was added doesn't have it; add the script to that Doc with step 2.

## One-time setup

It shares the blog's Google setup (`docs/blog-pipeline-setup.md`): the same service
account and the same `GOOGLE_SERVICE_ACCOUNT_KEY` secret. On top of that:

| Step | Where |
|---|---|
| Turn on the Vertex AI API, with billing on | Google Cloud console, the blog's project |
| Give the blog's service account the **Agent Platform User** role (`roles/aiplatform.user`, formerly Vertex AI User) | IAM & Admin → IAM → **Grant access**, since the account isn't listed until it has a role |
| Make `UC Team` with `Drafts` and `Published`, and share `UC Team` with the service account as **Viewer** | Google Drive |
| Add `DRIVE_TEAM_DRAFTS_FOLDER_ID` and `DRIVE_TEAM_PUBLISHED_FOLDER_ID` as repository variables | GitHub → Settings → Secrets and variables → Actions → Variables |

All four were done on 2026-10-18.
