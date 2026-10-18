// Google Drive -> profile pages sync.
//
// Each UC person makes their own profile page, /about/<slug>, by copying the template Doc
// (docs/profile-template.md) in Google Drive:
//
//   UC Team / Drafts     a draft profile (previewable, noindex)
//   UC Team / Published  a live profile, with a /<slug> short link
//
// This script runs in a scheduled GitHub Action (.github/workflows/profile-sync.yml). For
// each Doc it reads the labeled lines, sends the photo to Gemini to be redrawn as a hedcut
// (scripts/portrait.js), and writes every profile into src/data/team.generated.js, which
// src/data/authors.js merges with the hand-entered profiles. The Action then commits and
// pushes, which triggers a deploy.
//
// A portrait is drawn only when a person's photo changes: each profile records its
// photo's hash, so a re-run reuses the portrait it already has. Portraits are saved as
// public/team/<slug>-<hash>.webp, so a new photo gets a new file and a synced portrait
// never overwrites a hand-made one.
//
// A Doc moved out of both folders has its profile and portrait removed on the next run,
// so Drive stays the source of truth.
//
// Required environment:
//   GOOGLE_SERVICE_ACCOUNT_KEY       the service account JSON (as a string); it reads Drive
//                                    and, with the Vertex AI User role, draws portraits
//   DRIVE_TEAM_DRAFTS_FOLDER_ID      the UC Team / Drafts folder id
//   DRIVE_TEAM_PUBLISHED_FOLDER_ID   the UC Team / Published folder id
//
// Run with --dry-run (or with no credentials) to log what would happen without writing.

import { createHash } from 'node:crypto'
import { existsSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { google } from 'googleapis'
import sharp from 'sharp'
import { cleanHref, extractTitle, htmlToMarkdown, slugify } from './blog-sync.js'
import { generatePortrait } from './portrait.js'
import { keepOneAccent } from './portrait-accent.js'
import { HAND_AUTHORS } from '../src/data/authors.js'
import { ARCHETYPES, RENAISSANCE } from '../src/data/tpmSelfCheckData.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const GENERATED_FILE = join(root, 'src', 'data', 'team.generated.js')
const TEAM_DIR = join(root, 'public', 'team')
const VERCEL_FILE = join(root, 'vercel.json')
const PORTRAIT_SIZE = 960

const DRY_RUN = process.argv.includes('--dry-run') || !process.env.GOOGLE_SERVICE_ACCOUNT_KEY

// The template's own placeholder values. A Doc still carrying one hasn't been filled in.
const PLACEHOLDER_NAME = /^your name/i
const PLACEHOLDER_LINK = /your-name|example\.com/i

const LABELS = ['slug', 'full name', 'role', 'tpm type', 'links']

// Pull a labeled line ("Slug: webs", maybe bold) out of the markdown. Returns the value
// and the markdown without that line.
export function takeLabel(markdown, label) {
  const pattern = new RegExp(`^\\*{0,2}${label}\\*{0,2}:\\*{0,2}\\s*(.*?)\\s*$`, 'im')
  const match = pattern.exec(markdown)
  if (!match) return { value: '', markdown }
  const value = match[1].replace(/[*_`]/g, '').replace(/\(optional\)/i, '').trim()
  return { value, markdown: markdown.replace(match[0], '') }
}

// "LinkedIn | https://..." lines, in order. Docs turns a typed address into a link, so the
// address may come back as markdown, [text](href), with Google's redirect around it.
export function parseLinks(markdown) {
  const links = []
  for (const raw of markdown.split('\n')) {
    const line = raw.trim()
    if (!line.includes('|') || new RegExp(`^\\*{0,2}(${LABELS.join('|')})`, 'i').test(line)) continue
    const [label, ...rest] = line.split('|')
    const target = rest.join('|').trim()
    const linked = /\[[^\]]*\]\(([^)\s]+)\)/.exec(target)
    const url = (linked ? cleanHref(linked[1]) : target).replace(/[*_`\\]/g, '')
    const name = label.replace(/[*_`[\]\\]/g, '').trim()
    if (!name || !/^https?:\/\//.test(url) || PLACEHOLDER_LINK.test(url)) continue
    links.push({ name, url })
  }
  return links
}

// The paragraphs under the "Bio" heading, up to the next heading or rule.
export function parseBio(markdown) {
  const lines = markdown.split('\n')
  const start = lines.findIndex((line) => /^#{1,3}\s*\**\s*bio\s*\**\s*$/i.test(line.trim()))
  if (start === -1) return []
  const paragraphs = []
  for (const line of lines.slice(start + 1)) {
    const text = line.trim()
    if (/^#{1,6}\s/.test(text) || /^(\* \* \*|-{3,}|_{3,})$/.test(text)) break
    if (!text || text.startsWith('![')) continue
    const clean = text
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/[*_`]/g, '')
      .replace(/\\([\\[\]().!-])/g, '$1')
      .trim()
    if (clean && !/^write your bio here/i.test(clean)) paragraphs.push(clean)
  }
  return paragraphs
}

// A TPM type written as its name ("The Polymath", or just "Polymath") or its id.
export function findTpmType(text) {
  if (!text) return null
  const key = text.toLowerCase().replace(/^the\s+/, '').trim()
  return (
    [...ARCHETYPES, RENAISSANCE].find(
      (type) => type.id === key || type.name.toLowerCase().replace(/^the\s+/, '') === key,
    ) || null
  )
}

// The first image in the markdown, as bytes. Docs exports images as data: URIs or as
// links to Google's image servers.
async function firstImage(markdown) {
  const match = /!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/.exec(markdown)
  if (!match) return null
  const src = match[1]
  try {
    if (src.startsWith('data:')) {
      const parts = /^data:(image\/[a-z+]+);base64,(.*)$/i.exec(src)
      return parts ? { mimeType: parts[1], data: Buffer.from(parts[2], 'base64') } : null
    }
    const response = await fetch(src)
    if (!response.ok) return null
    const mimeType = (response.headers.get('content-type') || 'image/png').split(';')[0]
    return { mimeType, data: Buffer.from(await response.arrayBuffer()) }
  } catch {
    return null
  }
}

// Photos are sent to the model as JPEG, oriented and no larger than it needs.
async function normalizePhoto(photo) {
  const data = await sharp(photo.data).rotate().resize(2000, 2000, { fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 90 }).toBuffer()
  return { mimeType: 'image/jpeg', data }
}

// The profiles the last run wrote, so this run can reuse their portraits and clean up.
function previousProfiles() {
  if (!existsSync(GENERATED_FILE)) return []
  const text = readFileSync(GENERATED_FILE, 'utf8')
  const start = text.indexOf('[')
  return start === -1 ? [] : JSON.parse(text.slice(start))
}

function writeGenerated(profiles) {
  const header =
    '// Generated by scripts/profile-sync.js from the UC Team folders in Google Drive.\n' +
    "// Don't edit by hand: each person edits their own Doc, and the next sync rewrites this.\n"
  writeFileSync(GENERATED_FILE, `${header}export const DRIVE_PROFILES = ${JSON.stringify(profiles, null, 2)}\n`)
}

// Top-level paths a short link can't take: the site's own pages and files, and redirects
// that aren't short links.
function reservedPaths(vercel) {
  const names = new Set(['about', 'api', 'blog'])
  for (const entry of readdirSync(join(root, 'src', 'pages'))) names.add(entry.replace(/\.astro$/, ''))
  for (const entry of readdirSync(join(root, 'public'))) names.add(entry.replace(/\.[^.]+$/, ''))
  for (const redirect of vercel.redirects || []) {
    if (!isShortLink(redirect)) names.add(redirect.source.split('/')[1])
  }
  return names
}

// A short link is a redirect from /<slug> to /about/<slug>.
const isShortLink = (redirect) => redirect.destination === `/about${redirect.source}` && /^\/[a-z0-9-]+$/.test(redirect.source)

async function listDocs(drive, folderId) {
  if (!folderId) return []
  const files = []
  let pageToken
  do {
    const res = await drive.files.list({
      q: `'${folderId}' in parents and mimeType = 'application/vnd.google-apps.document' and trashed = false`,
      fields: 'nextPageToken, files(id, name, modifiedTime)',
      pageToken,
      pageSize: 100,
    })
    files.push(...(res.data.files || []))
    pageToken = res.data.nextPageToken
  } while (pageToken)
  return files
}

// Read one Doc into a profile, or null with a reason when it isn't ready.
async function readProfile(drive, doc) {
  const res = await drive.files.export({ fileId: doc.id, mimeType: 'text/html' }, { responseType: 'text' })
  let markdown = htmlToMarkdown(res.data).replaceAll(String.fromCharCode(11), '\n')
  const photo = await firstImage(markdown)

  const fields = {}
  for (const label of ['slug', 'full name', 'role', 'tpm type']) {
    const taken = takeLabel(markdown, label)
    fields[label] = taken.value
    markdown = taken.markdown
  }
  const { title } = extractTitle(markdown)
  const name = title.trim()
  if (!name || PLACEHOLDER_NAME.test(name)) return { skip: 'no name yet (the Heading 1 is still the placeholder)' }
  const slug = slugify(fields.slug) || slugify(name)
  if (!slug || slug === 'your-name') return { skip: 'no slug yet' }

  const tpmType = findTpmType(fields['tpm type'])
  const warnings = []
  if (fields['tpm type'] && !tpmType) warnings.push(`TPM type "${fields['tpm type']}" isn't a known type, so it's left off`)
  const links = parseLinks(markdown)
  if (!links.length) warnings.push('no links yet')

  return {
    photo,
    warnings,
    profile: {
      slug,
      name,
      ...(fields['full name'] && { alternateName: fields['full name'] }),
      ...(fields.role && !/^your title/i.test(fields.role) && { role: fields.role }),
      ...(tpmType && { tpmType: tpmType.id }),
      elsewhere: links,
      sameAs: links.map((link) => link.url),
      aliases: [],
      bio: parseBio(markdown),
      driveId: doc.id,
      updated: (doc.modifiedTime || '').slice(0, 10),
    },
  }
}

// The portrait for a profile: reuse the last one when the photo hasn't changed, otherwise
// draw a new one. Returns { photo, photoHash } or {} when there's no usable photo.
async function portraitFor(profile, photo, previous) {
  if (!photo) return {}
  const photoHash = createHash('sha256').update(photo.data).digest('hex').slice(0, 12)
  const file = `${profile.slug}-${photoHash}.webp`
  if (previous?.photoHash === photoHash && previous.photo === `/team/${file}` && existsSync(join(TEAM_DIR, file))) {
    return { photo: previous.photo, photoHash }
  }
  if (DRY_RUN) return { photo: `/team/${file}`, photoHash }
  const drawn = await generatePortrait(await normalizePhoto(photo))
  const { image } = await keepOneAccent(drawn)
  // Encoding fresh pixels drops the photo's metadata, including any location.
  await sharp(image).resize(PORTRAIT_SIZE, PORTRAIT_SIZE).webp({ quality: 88 }).toFile(join(TEAM_DIR, file))
  console.log(`drew   portrait for ${profile.slug}`)
  return { photo: `/team/${file}`, photoHash }
}

async function run() {
  if (DRY_RUN) console.log('profile-sync: dry run (no credentials or --dry-run). No files written.')
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY) return

  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY),
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  })
  const drive = google.drive({ version: 'v3', auth })
  const previous = new Map(previousProfiles().map((profile) => [profile.driveId, profile]))

  // Published wins over Drafts when a Doc is in both, so it's read last.
  const groups = [
    { docs: await listDocs(drive, process.env.DRIVE_TEAM_DRAFTS_FOLDER_ID), draft: true },
    { docs: await listDocs(drive, process.env.DRIVE_TEAM_PUBLISHED_FOLDER_ID), draft: false },
  ]
  const byDoc = new Map()
  for (const { docs, draft } of groups) {
    for (const doc of docs) {
      // A Doc whose name starts with "_" is a template; it's never a profile.
      if (doc.name.trim().startsWith('_')) continue
      const read = await readProfile(drive, doc)
      if (read.skip) {
        console.log(`skip   ${doc.name.trim()}: ${read.skip}`)
        continue
      }
      for (const warning of read.warnings) console.warn(`warn   ${doc.name.trim()}: ${warning}`)
      byDoc.set(doc.id, { ...read, draft, docName: doc.name.trim() })
    }
  }

  // One profile per slug: published first, then the earliest Doc.
  const profiles = []
  const taken = new Set()
  const ordered = [...byDoc.values()].sort((a, b) => Number(a.draft) - Number(b.draft))
  for (const entry of ordered) {
    const { profile, photo, draft, docName } = entry
    if (taken.has(`${profile.slug}:${draft}`)) {
      console.warn(`warn   ${docName}: another ${draft ? 'draft' : 'published'} profile already uses "${profile.slug}"; skipped`)
      continue
    }
    taken.add(`${profile.slug}:${draft}`)
    let portrait = {}
    try {
      portrait = await portraitFor(profile, photo, previous.get(profile.driveId))
    } catch (error) {
      console.warn(`warn   ${docName}: couldn't draw the portrait (${error.message})`)
      const last = previous.get(profile.driveId)
      if (last?.photo) portrait = { photo: last.photo, photoHash: last.photoHash }
    }
    if (!portrait.photo) console.warn(`warn   ${docName}: no photo yet`)
    profiles.push({
      ...profile,
      ...(portrait.photo && { photo: portrait.photo, photoAlt: `Hedcut portrait of ${profile.name}`, photoHash: portrait.photoHash }),
      draft,
    })
    console.log(`${draft ? 'draft ' : 'live  '} ${profile.slug} (${docName})`)
  }

  // Short links for every published profile, hand-entered or from Drive.
  const vercel = JSON.parse(readFileSync(VERCEL_FILE, 'utf8'))
  const reserved = reservedPaths(vercel)
  const liveSlugs = new Set([
    ...profiles.filter((profile) => !profile.draft).map((profile) => profile.slug),
    ...HAND_AUTHORS.filter((author) => !author.draft).map((author) => author.slug),
  ])
  const shortLinks = []
  for (const slug of [...liveSlugs].sort()) {
    if (reserved.has(slug)) {
      console.warn(`warn   /${slug} is already a page on the site, so ${slug} gets no short link`)
      continue
    }
    shortLinks.push({ source: `/${slug}`, destination: `/about/${slug}`, permanent: false })
  }
  vercel.redirects = [...(vercel.redirects || []).filter((redirect) => !isShortLink(redirect)), ...shortLinks]

  if (DRY_RUN) return

  // Remove portraits this sync drew that no profile uses any more.
  const inUse = new Set(profiles.map((profile) => profile.photo).filter(Boolean))
  for (const old of previous.values()) {
    if (old.photo && !inUse.has(old.photo)) {
      rmSync(join(root, 'public', old.photo), { force: true })
      console.log(`removed ${old.photo}`)
    }
  }
  writeGenerated(profiles)
  writeFileSync(VERCEL_FILE, `${JSON.stringify(vercel, null, 2)}\n`)
}

// Run only when invoked directly, so the parsers above can be imported and tested.
if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  run().catch((error) => {
    console.error('profile-sync failed:', error.message)
    process.exit(1)
  })
}
