// Blog post loader.
//
// A blog entry is a markdown file in /content/posts with a YAML frontmatter block
// (title, subtitle, date, slug, excerpt, author, draft). Files without frontmatter are treated
// as working notes and skipped, so a rough working doc can sit in the same folder as
// a finished post without leaking onto the site. This is also what the Google Drive
// publishing flow will write: markdown with frontmatter, one file per post.
//
// Anything marked `draft: true` is kept out of the blog index and the sitemap, but is
// still viewable at its own URL (rendered noindex) so it can be previewed before it
// goes live.

const modules = import.meta.glob('/content/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

// Split a raw file into { data, content }. Returns null when there is no leading
// `---` frontmatter block, which is how working notes get skipped.
function parseFrontmatter(raw) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw)
  if (!match) return null

  const [, block, content] = match
  const data = {}
  for (const line of block.split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith('#')) continue
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    let value = line.slice(idx + 1).trim()
    // Strip matching surrounding quotes if present.
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (value === 'true') value = true
    else if (value === 'false') value = false
    data[key] = value
  }
  return { data, content: content.trim() }
}

// Fallback slug from the filename: drop the folder, the .md, and any leading
// YYYY-MM-DD- date prefix, so 2026-09-07-my-post.md -> my-post.
function slugFromPath(path) {
  const file = path.split('/').pop().replace(/\.md$/, '')
  return file.replace(/^\d{4}-\d{2}-\d{2}-/, '')
}

// Roughly 200 words per minute; always at least one minute.
function readingMinutes(content) {
  const words = content.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

const posts = Object.entries(modules)
  .map(([path, raw]) => {
    const parsed = parseFrontmatter(raw)
    if (!parsed) return null
    const { data, content } = parsed
    if (!data.title) return null
    return {
      slug: data.slug || slugFromPath(path),
      title: data.title,
      subtitle: data.subtitle || '',
      date: data.date || '',
      excerpt: data.excerpt || '',
      author: data.author || '',
      cover: data.cover || '',
      category: data.category || '',
      // Tags are stored as a comma-separated string in frontmatter.
      tags: (data.tags || '')
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      draft: data.draft === true,
      readingMinutes: readingMinutes(content),
      content,
    }
  })
  .filter(Boolean)
  // Newest first. Missing or equal dates fall back to a stable title sort.
  .sort((a, b) => {
    if (a.date && b.date && a.date !== b.date) return a.date < b.date ? 1 : -1
    return a.title.localeCompare(b.title)
  })

// Published posts only: what the blog index and sitemap should show.
export function getPublishedPosts() {
  return posts.filter((post) => !post.draft)
}

// Any post by slug, including drafts, so a draft can be previewed by URL.
export function getPostBySlug(slug) {
  return posts.find((post) => post.slug === slug) || null
}

// Format an ISO date (YYYY-MM-DD) as a readable label. Parsed as UTC noon so the
// day never shifts across time zones.
export function formatDate(iso) {
  if (!iso) return ''
  const date = new Date(`${iso}T12:00:00Z`)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}
