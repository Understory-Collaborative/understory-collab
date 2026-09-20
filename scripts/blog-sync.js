// Google Drive -> blog sync.
//
// The publishing flow for the whole team is folder-based:
//
//   UC Blog / Drafts     drop a Google Doc here  -> a draft post (previewable, noindex)
//   UC Blog / Published  move the Doc here        -> a live post
//
// This script runs in a scheduled GitHub Action (see .github/workflows/blog-sync.yml).
// It reads both folders through a Google service account, converts each Doc to
// markdown with frontmatter, writes it into content/posts, and downloads any images
// alongside. The Action then commits and pushes, which triggers a deploy.
//
// It only ever touches files it created (frontmatter `source: drive`), so a
// hand-authored post is never overwritten or removed. A Doc removed from both
// folders has its generated post cleaned up on the next run, so Drive stays the
// source of truth.
//
// Required environment:
//   GOOGLE_SERVICE_ACCOUNT_KEY  the service account JSON (as a string)
//   DRIVE_DRAFTS_FOLDER_ID      the Drafts folder id
//   DRIVE_PUBLISHED_FOLDER_ID   the Published folder id
//
// Run with --dry-run (or with no credentials) to log what would happen without
// writing anything.

import { readdirSync, readFileSync, writeFileSync, rmSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { google } from 'googleapis'
import TurndownService from 'turndown'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const POSTS_DIR = join(root, 'content', 'posts')
const ASSETS_DIR = join(root, 'public', 'blog-assets')
const ASSETS_URL_BASE = '/blog-assets'

const DRY_RUN =
  process.argv.includes('--dry-run') || !process.env.GOOGLE_SERVICE_ACCOUNT_KEY

const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
})

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

// YAML-safe: wrap in double quotes and escape any of its own.
function yamlString(value) {
  return `"${String(value).replace(/"/g, '\\"')}"`
}

function buildFrontmatter(fields) {
  const lines = ['---']
  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined || value === '') continue
    lines.push(`${key}: ${typeof value === 'boolean' ? value : yamlString(value)}`)
  }
  lines.push('---')
  return lines.join('\n')
}

// First readable paragraph, trimmed, as a fallback excerpt.
function deriveExcerpt(markdown) {
  const para = markdown
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .find((block) => block && !block.startsWith('#') && !block.startsWith('!['))
  if (!para) return ''
  const clean = para.replace(/[#*_`>[\]]/g, '').replace(/\s+/g, ' ').trim()
  return clean.length > 200 ? `${clean.slice(0, 197)}...` : clean
}

// Save one image (data: URI or http(s) URL) next to the post and return its site
// path. On any failure the original src is kept so the post still renders.
async function saveImage(src, slug, index) {
  try {
    let buffer
    let ext = 'png'
    if (src.startsWith('data:')) {
      const match = /^data:(image\/[a-z+]+);base64,(.*)$/i.exec(src)
      if (!match) return src
      ext = match[1].split('/')[1].replace('+xml', '')
      buffer = Buffer.from(match[2], 'base64')
    } else if (/^https?:\/\//.test(src)) {
      const res = await fetch(src)
      if (!res.ok) return src
      const type = res.headers.get('content-type') || ''
      if (type.includes('/')) ext = type.split('/')[1].split(';')[0].replace('+xml', '')
      buffer = Buffer.from(await res.arrayBuffer())
    } else {
      return src
    }
    const dir = join(ASSETS_DIR, slug)
    mkdirSync(dir, { recursive: true })
    const name = `image-${index}.${ext}`
    writeFileSync(join(dir, name), buffer)
    return `${ASSETS_URL_BASE}/${slug}/${name}`
  } catch {
    return src
  }
}

// Replace every markdown image src with a locally saved copy.
async function localizeImages(markdown, slug) {
  const pattern = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g
  const matches = [...markdown.matchAll(pattern)]
  let out = markdown
  let index = 1
  for (const match of matches) {
    const [whole, alt, src] = match
    const localSrc = await saveImage(src, slug, index)
    if (localSrc !== src) {
      out = out.replace(whole, `![${alt}](${localSrc})`)
      index += 1
    }
  }
  return out
}

async function listDocs(drive, folderId) {
  if (!folderId) return []
  const files = []
  let pageToken
  do {
    const res = await drive.files.list({
      q: `'${folderId}' in parents and mimeType = 'application/vnd.google-apps.document' and trashed = false`,
      fields: 'nextPageToken, files(id, name, createdTime, modifiedTime, owners(displayName))',
      pageToken,
      pageSize: 100,
    })
    files.push(...(res.data.files || []))
    pageToken = res.data.nextPageToken
  } while (pageToken)
  return files
}

async function docToMarkdown(drive, fileId) {
  const res = await drive.files.export(
    { fileId, mimeType: 'text/html' },
    { responseType: 'text' },
  )
  return turndown.turndown(res.data)
}

// Existing generated posts, keyed by driveId, so we can update in place and clean up.
function existingManaged() {
  const map = new Map()
  let files = []
  try {
    files = readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'))
  } catch {
    return map
  }
  for (const file of files) {
    const raw = readFileSync(join(POSTS_DIR, file), 'utf8')
    const fm = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw)
    if (!fm) continue
    const idMatch = /^driveId:\s*["']?([^"'\n]+)["']?\s*$/m.exec(fm[1])
    const isDrive = /^source:\s*["']?drive["']?\s*$/m.test(fm[1])
    if (isDrive && idMatch) map.set(idMatch[1], file)
  }
  return map
}

async function run() {
  if (DRY_RUN) {
    console.log('blog-sync: dry run (no credentials or --dry-run). No files written.')
  }

  const draftsId = process.env.DRIVE_DRAFTS_FOLDER_ID
  const publishedId = process.env.DRIVE_PUBLISHED_FOLDER_ID

  let drive
  if (!DRY_RUN) {
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY),
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    })
    drive = google.drive({ version: 'v3', auth })
  } else {
    return
  }

  const managed = existingManaged()
  const seen = new Set()

  // Published wins over Drafts when a Doc is in both, so process published last.
  const groups = [
    { docs: await listDocs(drive, draftsId), draft: true },
    { docs: await listDocs(drive, publishedId), draft: false },
  ]

  mkdirSync(POSTS_DIR, { recursive: true })

  for (const { docs, draft } of groups) {
    for (const doc of docs) {
      seen.add(doc.id)
      const title = doc.name.trim()
      const slug = slugify(title) || doc.id
      const date = (doc.createdTime || '').slice(0, 10)
      const author = doc.owners?.[0]?.displayName || ''

      let markdown = await docToMarkdown(drive, doc.id)
      markdown = await localizeImages(markdown, slug)
      markdown = markdown.trim()

      const frontmatter = buildFrontmatter({
        title,
        slug,
        date,
        author,
        excerpt: deriveExcerpt(markdown),
        draft,
        source: 'drive',
        driveId: doc.id,
        updated: (doc.modifiedTime || '').slice(0, 10),
      })

      const filename = managed.get(doc.id) || `${date || 'undated'}-${slug}.md`
      writeFileSync(join(POSTS_DIR, filename), `${frontmatter}\n\n${markdown}\n`)
      console.log(`${draft ? 'draft ' : 'live  '} ${filename}`)
    }
  }

  // Clean up generated posts whose Doc is gone from both folders.
  for (const [driveId, file] of managed) {
    if (!seen.has(driveId)) {
      rmSync(join(POSTS_DIR, file))
      const slug = file.replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, '')
      rmSync(join(ASSETS_DIR, slug), { recursive: true, force: true })
      console.log(`removed ${file} (no longer in Drive)`)
    }
  }
}

run().catch((error) => {
  console.error('blog-sync failed:', error.message)
  process.exit(1)
})
