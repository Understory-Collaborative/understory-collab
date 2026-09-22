// Blog authors and their profile pages at /about/<slug>.
//
// A post's `author` frontmatter (from the Doc's "Author:" line, or the Doc owner's
// name as a fallback) is matched against `name`, `slug`, and `aliases`, ignoring
// case, so the byline can link to the right profile. An author with no match still
// gets a plain-text byline.
//
// `draft: true` keeps a profile out of search (noindex) and shows a draft banner,
// the same way draft posts work, until the bio is written.

export const AUTHORS = [
  {
    slug: 'webs',
    name: 'webs',
    aliases: [],
    photo: '/team/webs.jpg',
    photoAlt: 'Portrait of webs',
    // FLAG: role line and bio are webs's to write. Left empty rather than invented.
    role: '',
    bio: [],
    draft: true,
  },
]

export function findAuthor(name) {
  if (!name) return null
  const key = name.trim().toLowerCase()
  return (
    AUTHORS.find((author) =>
      [author.name, author.slug, ...author.aliases].some(
        (candidate) => candidate.toLowerCase() === key,
      ),
    ) || null
  )
}

export function getAuthorBySlug(slug) {
  return AUTHORS.find((author) => author.slug === slug) || null
}
