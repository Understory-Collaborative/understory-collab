// Post frontmatter parsing, shared by the Astro blog collection (src/content.config.ts),
// the old Vite app's loader (posts.js), and the build scripts, so every reader of
// src/content/blog agrees on what a post says.
//
// This is a line parser on purpose, not YAML. The Drive sync escapes markdown characters
// inside quoted values (a title like "\[Title\]"), which a YAML parser rejects outright,
// and one bad post would then fail the whole site build.

// Split a raw file into { data, content }. Returns null when there is no leading
// `---` frontmatter block, which is how working notes get skipped.
export function parseFrontmatter(raw) {
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
export function slugFromPath(path) {
  const file = path.split('/').pop().replace(/\.md$/, '')
  return file.replace(/^\d{4}-\d{2}-\d{2}-/, '')
}

// Roughly 200 words per minute; always at least one minute.
export function readingMinutes(content) {
  const words = content.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

// Tags are stored as a comma-separated string in frontmatter.
export function splitTags(tags) {
  return String(tags || '')
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
}

// Newest first. Missing or equal dates fall back to a stable title sort.
export function byDateDesc(a, b) {
  if (a.date && b.date && a.date !== b.date) return a.date < b.date ? 1 : -1
  return a.title.localeCompare(b.title)
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
