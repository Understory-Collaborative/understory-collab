// Build-time sitemap + robots generator.
//
// Writes public/sitemap.xml and public/robots.txt so search engines can discover
// every public route, including each published blog post. Runs before `vite build`
// (see the build script in package.json); the generated files are copied into dist
// with the rest of public/. Drafts are skipped, matching the site's own rules.
//
// Override the origin with SITE_ORIGIN if the canonical domain ever changes.

import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const ORIGIN = (process.env.SITE_ORIGIN || 'https://understorycollab.com').replace(/\/$/, '')
const POSTS_DIR = join(root, 'content', 'posts')
const PUBLIC_DIR = join(root, 'public')

// Public marketing routes. Redirect-only and utility routes (unsubscribe, apply,
// old aliases) are intentionally left out.
const STATIC_ROUTES = [
  '/',
  '/about',
  '/our-work',
  '/blog',
  '/assessment',
  '/tpm-self-check',
  '/tpm-types',
  '/office-hours',
  '/questions',
  '/contact',
  '/accessibility',
  '/privacy',
]

// Minimal frontmatter read: enough to get slug, date, and draft flag.
function readFrontmatter(raw) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw)
  if (!match) return null
  const data = {}
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    let value = line.slice(idx + 1).trim().replace(/^["']|["']$/g, '')
    if (value === 'true') value = true
    else if (value === 'false') value = false
    data[key] = value
  }
  return data
}

function slugFromFile(file) {
  return file.replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, '')
}

function publishedPosts() {
  let files = []
  try {
    files = readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'))
  } catch {
    return []
  }
  return files
    .map((file) => {
      const data = readFrontmatter(readFileSync(join(POSTS_DIR, file), 'utf8'))
      if (!data || !data.title || data.draft === true) return null
      return { slug: data.slug || slugFromFile(file), date: data.date || '' }
    })
    .filter(Boolean)
}

function urlEntry(loc, lastmod) {
  const mod = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''
  return `  <url>\n    <loc>${ORIGIN}${loc}</loc>${mod}\n  </url>`
}

const entries = [
  ...STATIC_ROUTES.map((route) => urlEntry(route)),
  ...publishedPosts().map((post) => urlEntry(`/blog/${post.slug}`, post.date)),
]

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`

const robots = `User-agent: *
Allow: /

Sitemap: ${ORIGIN}/sitemap.xml
`

mkdirSync(PUBLIC_DIR, { recursive: true })
writeFileSync(join(PUBLIC_DIR, 'sitemap.xml'), sitemap)
writeFileSync(join(PUBLIC_DIR, 'robots.txt'), robots)

console.log(
  `Generated sitemap.xml (${entries.length} urls) and robots.txt for ${ORIGIN}`,
)
