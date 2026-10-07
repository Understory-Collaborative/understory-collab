// Blog post loader for the old Vite app, kept until the Astro cut over so the two can be
// compared side by side. The Astro pages read the `blog` collection instead
// (src/content.config.ts). Both parse with src/lib/frontmatter.js.
//
// A blog entry is a markdown file in /src/content/blog with a frontmatter block (title,
// subtitle, date, slug, excerpt, author, draft). Files without frontmatter are treated
// as working notes and skipped. Anything marked `draft: true` is kept out of the blog
// index and the sitemap, but is still viewable at its own URL (rendered noindex).

import {
  parseFrontmatter,
  slugFromPath,
  readingMinutes,
  splitTags,
  byDateDesc,
} from './frontmatter.js'

export { formatDate } from './frontmatter.js'

const modules = import.meta.glob('/src/content/blog/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

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
      tags: splitTags(data.tags),
      draft: data.draft === true,
      readingMinutes: readingMinutes(content),
      content,
    }
  })
  .filter(Boolean)
  .sort(byDateDesc)

// Published posts only: what the blog index and sitemap should show.
export function getPublishedPosts() {
  return posts.filter((post) => !post.draft)
}

// Any post by slug, including drafts, so a draft can be previewed by URL.
export function getPostBySlug(slug) {
  return posts.find((post) => post.slug === slug) || null
}
