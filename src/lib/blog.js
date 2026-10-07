// The Astro pages' view of the blog collection: every post sorted newest first, with
// the collection id as the slug.
import { getCollection } from 'astro:content'
import { byDateDesc } from './frontmatter.js'

export async function getPosts() {
  const entries = await getCollection('blog')
  return entries.map((entry) => ({ ...entry.data, slug: entry.id })).sort(byDateDesc)
}

// Published posts only: what the blog index and author profiles list.
export async function getPublishedPosts() {
  return (await getPosts()).filter((post) => !post.draft)
}
