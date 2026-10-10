// Build-time sitemap + robots generator.
//
// Writes public/sitemap.xml, public/robots.txt, and public/llms.txt so search engines
// and ai crawlers can discover every public route, including each published blog post. Runs before `astro build`
// (see the build script in package.json); the generated files are copied into dist
// with the rest of public/. Drafts are skipped, matching the site's own rules.
//
// Override the origin with SITE_ORIGIN if the canonical domain ever changes.

import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { AUTHORS } from '../src/data/authors.js'
import { offers } from '../src/data/offersData.js'
import { blogCategories, findCategory } from '../src/data/blogCategories.js'
import { ARCHETYPES, RENAISSANCE } from '../src/data/tpmSelfCheckData.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const ORIGIN = (process.env.SITE_ORIGIN || 'https://understorycollab.com').replace(/\/$/, '')
const POSTS_DIR = join(root, 'src', 'content', 'blog')
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
      return { slug: data.slug || slugFromFile(file), date: data.date || '', category: data.category || '' }
    })
    .filter(Boolean)
}

function urlEntry(loc, lastmod) {
  const mod = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''
  return `  <url>\n    <loc>${ORIGIN}${loc}</loc>${mod}\n  </url>`
}

const entries = [
  ...STATIC_ROUTES.map((route) => urlEntry(route)),
  // One page per offer and per TPM type, from the same data the pages are built from.
  ...offers.map((offer) => urlEntry(`/offers/${offer.slug}`)),
  ...[...ARCHETYPES, RENAISSANCE].map((type) => urlEntry(`/tpm-types/${type.id}`)),
  // Author profiles, once they're out of draft.
  ...AUTHORS.filter((author) => !author.draft).map((author) => urlEntry(`/about/${author.slug}`)),
  ...publishedPosts().map((post) => urlEntry(`/blog/${post.slug}`, post.date)),
  // A category page exists only once a published post carries that category.
  ...blogCategories
    .filter((category) =>
      publishedPosts().some((post) =>
        post.category.split(',').some((label) => findCategory(label)?.slug === category.slug)
      )
    )
    .map((category) => urlEntry(`/blog/category/${category.slug}`)),
]

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`

// Every ai bot is allowed in, and each is named so the choice is visible and easy to
// reverse: training bots, then search bots, then bots that fetch a page a person asked
// about. The policy is in friday's domains/content/llm-crawlability-plan.md.
const AI_BOTS = [
  'GPTBot',
  'ClaudeBot',
  'Google-Extended',
  'OAI-SearchBot',
  'Claude-SearchBot',
  'PerplexityBot',
  'ChatGPT-User',
  'Claude-User',
]

const robots = `User-agent: *
Allow: /

${AI_BOTS.map((bot) => `User-agent: ${bot}\nAllow: /`).join('\n\n')}

Sitemap: ${ORIGIN}/sitemap.xml
`

// llms.txt: a Markdown map of the site for language models (llmstxt.org). The summary
// matches friday's entity sheet; offers and TPM types come from the same data as their pages.
const llms = `# Understory Collaborative

> Understory Collaborative is a software delivery consultancy that gets stalled teams moving again, with deep roots in edtech. We work with non-technical founders and business leaders who are building software with their own team or an agency, and with engineering leaders whose delivery has stalled. The team works from across the US.

webs (Stephanie Weber) is a learning scientist and developer in Las Vegas. She runs studio w labs, co-founded Understory Collaborative, and co-founded The Intelligent Hoodlums with Mike Lang.

## Start here

- [Home](${ORIGIN}/): what we do and where to start
- [About](${ORIGIN}/about): who we are and how we work
- [Our work](${ORIGIN}/our-work): the problems we solve and the domains we work in
- [webs](${ORIGIN}/about/webs): co-founder profile

## Offers

${offers.map((offer) => `- [${offer.name}](${ORIGIN}/offers/${offer.slug}): ${offer.metaDescription}`).join('\n')}

## Free tools and help

- [What's On Fire? assessment](${ORIGIN}/assessment): six questions on the state of your engineering organization, with a report
- [Office hours](${ORIGIN}/office-hours): a thirty-minute call for fifty dollars
- [Questions](${ORIGIN}/questions): ask a question about what you're building, answered free
- [TPM self-check](${ORIGIN}/tpm-self-check): a self-reflection for technical product managers
- [TPM types](${ORIGIN}/tpm-types): the technical product manager archetypes

## Optional

- [Blog](${ORIGIN}/blog): posts from the team
- [Contact](${ORIGIN}/contact)
`

mkdirSync(PUBLIC_DIR, { recursive: true })
writeFileSync(join(PUBLIC_DIR, 'sitemap.xml'), sitemap)
writeFileSync(join(PUBLIC_DIR, 'robots.txt'), robots)
writeFileSync(join(PUBLIC_DIR, 'llms.txt'), llms)

console.log(
  `Generated sitemap.xml (${entries.length} urls), robots.txt, and llms.txt for ${ORIGIN}`,
)
