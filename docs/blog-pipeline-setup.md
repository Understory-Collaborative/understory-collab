# Blog pipeline setup (Google Drive → website)

One-time setup so any UC person can publish a blog post by working in Google Drive.
Budget about 15 minutes. You do this once; after that, publishing is drag-and-drop.

## How it works

| Folder | What it does |
|--------|--------------|
| `UC Blog / Drafts` | Drop a Google Doc here. It becomes a **draft** post, viewable at a private link, hidden from the blog and search engines. |
| `UC Blog / Published` | Move a Doc here. It goes **live** on the website. |

A scheduled job checks both folders every 15 minutes, converts each Doc to a styled
blog post, and publishes it. The Doc's name becomes the post title. Remove a Doc from
both folders and its post comes down on the next run.

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

## Trying it out

1. Put a short Google Doc in `Drafts`.
2. Run the workflow (or wait for the schedule).
3. The post appears at `/blog/<doc-name-as-slug>` as a draft (not listed, not indexed).
4. Move the Doc to `Published` and run again. It goes live and shows up on `/blog`.

## Good to know

- **The Doc name is the post title.** Name your Docs deliberately.
- **The post date** is the day the Doc was created.
- **Images** in the Doc are pulled in automatically. Complex layouts convert more
  roughly than plain text and headings; this is the part we will refine with a real
  post in hand.
- **Hand-written posts are safe.** The job only touches posts it created from Drive,
  so a post added directly in the repo is never changed or removed.
