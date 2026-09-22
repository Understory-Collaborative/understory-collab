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
//
// What the author controls from inside the Doc:
//   Title      the first Heading 1 (or Title-style line). Falls back to the Doc name.
//   Subtitle   a Subtitle-style line, or a Heading 2 placed directly under the title.
//   Slug:      a labeled line setting the URL. Falls back to the title, slugified.
//   Author:    a labeled line naming the author, linked to their profile if they have
//              one (src/data/authors.js). Falls back to the Doc owner's name.
//   Excerpt:, Category:, Tags:   labeled lines, as before.

import { readdirSync, readFileSync, writeFileSync, rmSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
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
turndown.remove(['style', 'script'])

// Google Docs' HTML export marks bold and italic with generated CSS classes
// (`.c3{font-weight:700}`) instead of <b> and <i>, so Turndown drops them. This reads
// the export's <style> block into a class -> { bold, italic } map before converting.
let docClassStyles = new Map()

function readClassStyles(html) {
  const map = new Map()
  const css = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]).join('\n')
  for (const [, selectors, body] of css.matchAll(/([^{}]+)\{([^}]*)\}/g)) {
    const bold = /font-weight:\s*(700|800|900|bold)/i.test(body)
    const italic = /font-style:\s*italic/i.test(body)
    if (!bold && !italic) continue
    for (const selector of selectors.split(',')) {
      const match = /^\s*\.([\w-]+)\s*$/.exec(selector)
      if (match) map.set(match[1], { bold, italic })
    }
  }
  return map
}

function spanEmphasis(node) {
  let bold = false
  let italic = false
  for (const cls of (node.getAttribute('class') || '').split(/\s+/)) {
    const style = docClassStyles.get(cls)
    if (style?.bold) bold = true
    if (style?.italic) italic = true
  }
  const inline = node.getAttribute('style') || ''
  if (/font-weight:\s*(700|800|900|bold)/i.test(inline)) bold = true
  if (/font-style:\s*italic/i.test(inline)) italic = true
  return { bold, italic }
}

function insideHeading(node) {
  for (let el = node.parentNode; el; el = el.parentNode) {
    if (/^H[1-6]$/.test(el.nodeName)) return true
  }
  return false
}

turndown.addRule('docsEmphasis', {
  filter: (node) =>
    node.nodeName === 'SPAN' && !insideHeading(node) &&
    (spanEmphasis(node).bold || spanEmphasis(node).italic),
  replacement: (content, node) => {
    const { bold, italic } = spanEmphasis(node)
    // Keep surrounding spaces outside the markers, or markdown won't read them.
    const lead = content.match(/^\s*/)[0]
    const trail = content.match(/\s*$/)[0]
    const inner = content.trim()
    if (!inner) return content
    const mark = (bold ? '**' : '') + (italic ? '_' : '')
    const close = (italic ? '_' : '') + (bold ? '**' : '')
    return `${lead}${mark}${inner}${close}${trail}`
  },
})

// The Docs "Title" and "Subtitle" paragraph styles export as <p class="title"> and
// <p class="subtitle">. Turn them into a heading 1 and a labeled line so they're found
// the same way as a Heading 1 and a "Subtitle:" line.
turndown.addRule('docsTitle', {
  filter: (node) => node.nodeName === 'P' && /\btitle\b/.test(node.getAttribute('class') || ''),
  replacement: (content) => `\n\n# ${content.replace(/[*_]/g, '').trim()}\n\n`,
})
turndown.addRule('docsSubtitle', {
  filter: (node) => node.nodeName === 'P' && /\bsubtitle\b/.test(node.getAttribute('class') || ''),
  replacement: (content) => `\n\nSubtitle: ${content.replace(/[*_]/g, '').trim()}\n\n`,
})

export function htmlToMarkdown(html) {
  docClassStyles = readClassStyles(html)
  return turndown.turndown(html)
}

// Pull the title and subtitle out of the body. The title is the first heading 1; a
// heading 2 sitting directly under it, with nothing in between, is the subtitle.
//
// An image placed on the same line as the title in the Doc exports inside the heading,
// so images are lifted out of both lines and put back at the top of the body, where the
// cover-image step finds them.
const INLINE_IMAGE = /!\[[^\]]*\]\([^)\s]+(?:\s+"[^"]*")?\)/g

function splitHeading(text) {
  const images = text.match(INLINE_IMAGE) || []
  const clean = text.replace(INLINE_IMAGE, '').replace(/[*_]/g, '').trim()
  return { clean, images }
}

export function extractTitle(markdown) {
  const match = /^#[ \t]+(.+?)[ \t#]*$/m.exec(markdown)
  if (!match) return { title: '', subtitle: '', markdown }
  const heading = splitHeading(match[1])
  const images = [...heading.images]
  let rest = markdown.slice(0, match.index) + markdown.slice(match.index + match[0].length)
  let subtitle = ''
  const after = markdown.slice(match.index + match[0].length)
  const sub = /^\s*##[ \t]+(.+?)[ \t#]*$/m.exec(after)
  if (sub && sub.index === 0) {
    const subHeading = splitHeading(sub[1])
    subtitle = subHeading.clean
    images.push(...subHeading.images)
    rest = markdown.slice(0, match.index) + after.slice(sub[0].length)
  }
  rest = [...images, rest.trim()].filter(Boolean).join('\n\n')
  return { title: heading.clean, subtitle, markdown: rest.trim() }
}

export function slugify(text) {
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
  return htmlToMarkdown(res.data)
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
      // A Doc whose name starts with "_" is a template or work in progress; it is
      // never published. This is what keeps the Drafts-folder template off the site.
      if (doc.name.trim().startsWith('_')) {
        console.log(`skip   ${doc.name.trim()} (name starts with _)`)
        continue
      }
      seen.add(doc.id)
      const date = (doc.createdTime || '').slice(0, 10)

      let markdown = (await docToMarkdown(drive, doc.id)).trim()

      // Labeled lines near the top of the Doc set metadata, then are removed from the
      // body: "Slug:", "Author:", "Subtitle:", "Excerpt:", "Category:", "Tags:" (comma separated).
      // The label may be bold, so **Excerpt:** works too.
      const takeLabel = (label) => {
        const re = new RegExp(`^\\*{0,2}${label}\\*{0,2}:\\s*(.+?)\\s*$`, 'im')
        const match = re.exec(markdown)
        if (!match) return ''
        markdown = markdown.replace(match[0], '').trim()
        return match[1].replace(/[*_`]/g, '').trim()
      }
      const slugExplicit = takeLabel('slug')
      const author = takeLabel('author') || doc.owners?.[0]?.displayName || ''
      const subtitleExplicit = takeLabel('subtitle')
      const category = takeLabel('category')
      const tags = takeLabel('tags')
      const excerptExplicit = takeLabel('excerpt')

      const extracted = extractTitle(markdown)
      markdown = extracted.markdown
      const title = extracted.title || doc.name.trim()
      const subtitle = subtitleExplicit || extracted.subtitle
      const slug = slugify(slugExplicit) || slugify(title) || doc.id

      markdown = (await localizeImages(markdown, slug)).trim()

      // Cover image: the first image that appears before the first section heading is
      // lifted out to drive the card and post header, so a lead image becomes the
      // cover while images deeper in the body stay inline.
      let cover = ''
      const firstHeading = markdown.search(/^#{2,3}\s/m)
      const region = firstHeading === -1 ? markdown : markdown.slice(0, firstHeading)
      const coverMatch = /!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/.exec(region)
      if (coverMatch) {
        cover = coverMatch[1]
        markdown = markdown.replace(coverMatch[0], '').trim()
      }

      const excerpt = excerptExplicit || deriveExcerpt(markdown)

      const frontmatter = buildFrontmatter({
        title,
        subtitle,
        slug,
        date,
        author,
        excerpt,
        cover,
        category,
        tags,
        draft,
        source: 'drive',
        driveId: doc.id,
        updated: (doc.modifiedTime || '').slice(0, 10),
      })

      // The filename follows the slug, so a changed slug renames the file and clears
      // the old image folder instead of leaving a stale copy behind.
      const filename = `${date || 'undated'}-${slug}.md`
      const previous = managed.get(doc.id)
      if (previous && previous !== filename) {
        rmSync(join(POSTS_DIR, previous))
        const oldSlug = previous.replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, '')
        if (oldSlug !== slug) rmSync(join(ASSETS_DIR, oldSlug), { recursive: true, force: true })
        console.log(`renamed ${previous} -> ${filename}`)
      }
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

// Run only when invoked directly, so the converters above can be imported and tested.
if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  run().catch((error) => {
    console.error('blog-sync failed:', error.message)
    process.exit(1)
  })
}
