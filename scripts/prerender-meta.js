// Per-page social previews for a single-page app.
//
// Link previews on LinkedIn, Slack, Facebook, and iMessage come from crawlers that read
// the HTML and never run JavaScript, so they only ever see the default tags in
// index.html. This runs after `vite build` and writes a copy of dist/index.html for
// each blog route with that route's title, description, image, and URL baked into the
// <head>. Vercel serves these files ahead of the catch-all rewrite, and the app still
// boots from them as usual.
//
//   /blog              the blog index
//   /blog/<slug>       every post, drafts included (drafts also get noindex)
//   /about/<slug>      every author profile
//
// Page-level PageMeta keeps the tags in sync after navigation inside the app.

import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { AUTHORS } from '../src/data/authors.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = join(root, 'dist')
const POSTS_DIR = join(root, 'content', 'posts')
const ORIGIN = (process.env.SITE_ORIGIN || 'https://understorycollab.com').replace(/\/$/, '')
const SITE_NAME = 'Understory Collaborative'
const DEFAULT_IMAGE = '/og-image.png'

const BLOG_INDEX = {
  path: '/blog',
  title: 'Blog',
  description:
    'Field notes on technical product management from Understory Collaborative: scope, delivery, and keeping technical work healthy.',
  image: DEFAULT_IMAGE,
  type: 'website',
}

function readFrontmatter(raw) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw)
  if (!match) return null
  const data = {}
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    let value = line.slice(idx + 1).trim().replace(/^["']|["']$/g, '').replace(/\\"/g, '"')
    if (value === 'true') value = true
    else if (value === 'false') value = false
    data[key] = value
  }
  return data
}

function findAuthor(name) {
  if (!name) return null
  const key = String(name).trim().toLowerCase()
  return AUTHORS.find((a) => [a.name, a.slug, ...a.aliases].some((c) => c.toLowerCase() === key)) || null
}

function postPages() {
  let files = []
  try {
    files = readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'))
  } catch {
    return []
  }
  return files
    .map((file) => {
      const data = readFrontmatter(readFileSync(join(POSTS_DIR, file), 'utf8'))
      if (!data || !data.title) return null
      const slug = data.slug || file.replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, '')
      const author = findAuthor(data.author)
      return {
        path: `/blog/${slug}`,
        title: data.title,
        description: data.excerpt || data.subtitle || BLOG_INDEX.description,
        image: data.cover || DEFAULT_IMAGE,
        type: 'article',
        published: data.date || '',
        author: author ? author.name : data.author || '',
        authorUrl: author ? `/about/${author.slug}` : '',
        tags: String(data.tags || '').split(',').map((t) => t.trim()).filter(Boolean),
        noindex: data.draft === true,
      }
    })
    .filter(Boolean)
}

function authorPages() {
  return AUTHORS.map((author) => ({
    path: `/about/${author.slug}`,
    title: author.name,
    description: author.bio[0] || `${author.name} at ${SITE_NAME}.`,
    image: author.photo || DEFAULT_IMAGE,
    type: 'profile',
    noindex: author.draft === true,
  }))
}

const escapeAttr = (text) =>
  String(text).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const absolute = (path) => (/^https?:\/\//.test(path) ? path : `${ORIGIN}${path.startsWith('/') ? '' : '/'}${path}`)

function headFor(page) {
  const url = absolute(page.path)
  const image = absolute(page.image)
  const tags = [
    `<title>${escapeAttr(`${page.title} · ${SITE_NAME}`)}</title>`,
    `<meta name="description" content="${escapeAttr(page.description)}">`,
    `<link rel="canonical" href="${escapeAttr(url)}">`,
    `<meta property="og:type" content="${page.type}">`,
    `<meta property="og:site_name" content="${SITE_NAME}">`,
    `<meta property="og:title" content="${escapeAttr(page.title)}">`,
    `<meta property="og:description" content="${escapeAttr(page.description)}">`,
    `<meta property="og:url" content="${escapeAttr(url)}">`,
    `<meta property="og:image" content="${escapeAttr(image)}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${escapeAttr(page.title)}">`,
    `<meta name="twitter:description" content="${escapeAttr(page.description)}">`,
    `<meta name="twitter:image" content="${escapeAttr(image)}">`,
  ]
  if (page.type === 'article') {
    if (page.published) tags.push(`<meta property="article:published_time" content="${escapeAttr(page.published)}">`)
    if (page.authorUrl) tags.push(`<meta property="article:author" content="${escapeAttr(absolute(page.authorUrl))}">`)
    else if (page.author) tags.push(`<meta name="author" content="${escapeAttr(page.author)}">`)
    for (const tag of page.tags) tags.push(`<meta property="article:tag" content="${escapeAttr(tag)}">`)
  }
  if (page.noindex) tags.push('<meta name="robots" content="noindex, nofollow">')
  return tags.join('\n    ')
}

// Remove the template's own copies of every tag this script sets, then add the page's.
function render(template, page) {
  const stripped = template
    .replace(/\s*<title>[\s\S]*?<\/title>/, '')
    .replace(/\s*<meta\s+(?:name|property)="(?:description|og:[^"]+|twitter:[^"]+|robots|author|article:[^"]+)"[^>]*>/g, '')
    .replace(/\s*<link\s+rel="canonical"[^>]*>/g, '')
    .replace(/\s*<!-- (?:Open Graph \/ Facebook|Twitter) -->/g, '')
  return stripped.replace('</head>', `    ${headFor(page)}\n  </head>`)
}

function run() {
  let template
  try {
    template = readFileSync(join(DIST, 'index.html'), 'utf8')
  } catch {
    console.error('prerender-meta: dist/index.html not found. Run vite build first.')
    process.exit(1)
  }
  const pages = [BLOG_INDEX, ...postPages(), ...authorPages()]
  for (const page of pages) {
    const dir = join(DIST, page.path)
    mkdirSync(dir, { recursive: true })
    writeFileSync(join(dir, 'index.html'), render(template, page))
  }
  console.log(`Wrote social preview tags for ${pages.length} pages.`)
}

run()
