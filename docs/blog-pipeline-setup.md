# Blog pipeline setup (Google Drive → website)

One-time setup so any UC person can publish a blog post by working in Google Drive.
Budget about 15 minutes. You do this once; after that, publishing is drag-and-drop.

## How it works

| Folder | What it does |
|--------|--------------|
| `UC Blog / Drafts` | Drop a Google Doc here. It becomes a **draft** post, viewable at a private link, hidden from the blog and search engines. |
| `UC Blog / Published` | Move a Doc here. It goes **live** on the website. |

A job converts each Doc into a styled blog post and publishes it. The first Heading 1
in the Doc becomes the post title, and a `Slug:` line sets its web address. Remove a Doc from both folders and its post comes down on the
next run. It runs two ways:

- **On demand** for previews. When someone wants to see a draft, trigger it (Actions
  → **Blog sync from Google Drive** → **Run workflow**). The preview is ready a minute
  or two later.
- **Once a day** for publishing, so anything moved into Published goes live within a
  day without anyone lifting a finger.

## What you set up (once)

### 1. Make the folders

1. In Google Drive, make a folder `UC Blog`.
2. Inside it, make two folders: `Drafts` and `Published`.
3. Share `UC Blog` with the UC people who should be able to publish (Editor access).

### 2. Make a service account (the robot that reads the folders)

1. Go to https://console.cloud.google.com and create a project (name it e.g. `uc-blog`).
2. In the search bar, open **Google Drive API** and click **Enable**.
3. Go to **APIs & Services → Credentials → Create credentials → Service account**.
   Give it a name like `blog-sync`, then **Done**.
4. Open the new service account → **Keys → Add key → Create new key → JSON**.
   A `.json` file downloads. Keep it safe; it is a password.
5. Copy the service account's **email** (looks like
   `blog-sync@uc-blog.iam.gserviceaccount.com`).

### 3. Share the folders with the robot

1. Back in Drive, right-click `UC Blog` → **Share**.
2. Paste the service account email, set it to **Viewer**, and send.

### 4. Get the two folder IDs

Open each folder in Drive and copy the ID from the URL:

```
https://drive.google.com/drive/folders/1AbC...XyZ
                                        ^^^^^^^^^^  this part is the ID
```

You need the ID for **Drafts** and for **Published**.

### 5. Give GitHub the credentials

In the GitHub repo, go to **Settings → Secrets and variables → Actions**:

| Type | Name | Value |
|------|------|-------|
| **Secret** (New repository secret) | `GOOGLE_SERVICE_ACCOUNT_KEY` | paste the entire contents of the JSON key file |
| **Variable** (Variables tab → New) | `DRIVE_DRAFTS_FOLDER_ID` | the Drafts folder ID |
| **Variable** (Variables tab → New) | `DRIVE_PUBLISHED_FOLDER_ID` | the Published folder ID |

### 6. Turn it on

The sync runs on a schedule only after this code is merged to the main branch. To
test it right away: **Actions → Blog sync from Google Drive → Run workflow**.

## Run the sync from the Doc (optional)

This adds a **UC Blog** menu inside each post Doc, with **Preview now** and **Publish**,
so nobody has to open GitHub. It has two parts:

- **The relay** (`scripts/apps-script/relay/`) is a small web app that holds the GitHub
  token and starts the sync. It runs as the person who deploys it.
- **The menu** (`scripts/apps-script/template-menu/`) lives in the `_TEMPLATE` Doc.
  Copying a Doc copies its script, so every new post gets the menu. The menu only knows
  the relay's address, never the token.

### A. Make the GitHub token

1. On GitHub, go to **Settings → Developer settings → Personal access tokens →
   Fine-grained tokens → Generate new token**.
2. Name it `uc-blog-relay`. Set **Resource owner** to `Understory-Collaborative`.
3. Pick an expiration (a year at most) and put the renewal date on your calendar. When
   it expires, the menu says "GitHub rejected the token."
4. **Repository access:** Only select repositories → `understory-collab`.
5. **Permissions → Repository permissions → Actions:** Read and write. Leave
   everything else at No access.
6. Generate it and copy it. If the organization requires approval for tokens, approve
   it under **Organization settings → Personal access tokens → Pending requests**.

### B. Set up the relay

Do this signed in as the account that owns the `UC Blog` folder.

1. Go to https://script.google.com and start a **New project**. Name it `UC Blog relay`.
2. Replace everything in `Code.gs` with `scripts/apps-script/relay/Code.gs`.
3. Open **Project Settings**, turn on **Show "appsscript.json" manifest file in
   editor**, then replace `appsscript.json` with `scripts/apps-script/relay/appsscript.json`.
4. Still in **Project Settings**, under **Script properties**, add:

   | Property | Value |
   |---|---|
   | `GITHUB_TOKEN` | the token from step A |
   | `DRIVE_DRAFTS_FOLDER_ID` | the Drafts folder ID (same as the GitHub variable) |
   | `DRIVE_PUBLISHED_FOLDER_ID` | the Published folder ID (same as the GitHub variable) |

5. **Deploy → New deployment →** type **Web app**. Set **Execute as: Me** and **Who has
   access: Anyone with a Google account**. (If everyone who publishes uses one Google
   Workspace domain, pick that domain instead.) Deploy, approve the permissions, and
   copy the **Web app URL**.

To change the relay's code later, use **Deploy → Manage deployments → Edit → New
version**, so the URL stays the same.

Opening the web app URL in a browser shows a one-line note about the relay. That's
expected; the relay only does its work when the Doc menu calls it.

### C. Add the menu to the template

1. Open the `_TEMPLATE — make a copy` Doc and choose **Extensions → Apps Script**.
2. Replace `Code.gs` with `scripts/apps-script/template-menu/Code.gs`, and paste the web
   app URL from step B into `RELAY_URL` at the top.
3. Show the manifest as in step B and replace `appsscript.json` with
   `scripts/apps-script/template-menu/appsscript.json`.
4. Save, then reload the Doc. The **UC Blog** menu appears next to **Help**. On the
   template itself the menu only says to make a copy first.

### Using the menu

- **Preview now** starts the sync and shows the preview link. The page is ready a
  minute or two later.
- **Publish** asks you to confirm, moves the Doc into Published, and starts the sync.
- **The first time** someone uses the menu, Google asks them to approve it. Because
  the script is private, Google shows "Google hasn't verified this app"; choose
  **Advanced → Go to UC Blog (unsafe)** to continue. It only reads the open Doc and
  calls the relay.
- **Docs made before the menu existed** don't have it. Make a fresh copy of the
  template and move the content over, or add the script to that Doc with step C.

### What the relay allows

It only starts the blog sync. It refuses any Doc outside the Drafts and Published
folders, and it starts at most one sync every 30 seconds. Anyone who has the relay's
URL and a Google account can ask it to run the sync, which is the whole of what it can
do.

## Trying it out

1. Put a short Google Doc in `Drafts`.
2. Run the workflow (**Actions → Blog sync from Google Drive → Run workflow**).
3. A minute later the post appears at `/blog/<doc-name-as-slug>` as a draft
   (not listed, not indexed) so you can preview it.
4. Move the Doc to `Published`. It goes live on the next run — trigger it manually to
   see it now, or let the daily run publish it within a day.

## Good to know

- **The title comes from inside the Doc**, from its first Heading 1. The Doc name is
  only used when there is no Heading 1. Set the web address with a `Slug:` line;
  changing it later moves the post to the new address.
- **Start a post from the `_TEMPLATE` Doc** in the Drafts folder: right-click it,
  choose **Make a copy**, and name the copy so you can find it. Any Doc whose name
  starts with `_` is ignored by the sync, so the template itself never gets published.
- **Set the summary with an `Excerpt:` line** at the top of the Doc. It becomes the
  blog-list blurb and the search-engine description. Without one, the first paragraph
  is used.
- **The post date** is the day the Doc was created.
- **Images** in the Doc are pulled in automatically. Complex layouts convert more
  roughly than plain text and headings; this is the part we will refine with a real
  post in hand.
- **Hand-written posts are safe.** The job only touches posts it created from Drive,
  so a post added directly in the repo is never changed or removed.
