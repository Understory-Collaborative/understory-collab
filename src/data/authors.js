// Blog authors and their profile pages at /about/<slug>.
//
// A post's `author` frontmatter (from the Doc's "Author:" line, or the Doc owner's
// name as a fallback) is matched against `name`, `slug`, and `aliases`, ignoring
// case, so the byline can link to the right profile. An author with no match still
// gets a plain-text byline.
//
// `draft: true` keeps a profile out of search (noindex) and shows a draft banner,
// the same way draft posts work, until the bio is written.
//
// Profiles come from two places. Most come from Google Drive: each person fills in a copy
// of the profile template Doc, and scripts/profile-sync.js writes them into
// team.generated.js. Any below are typed in by hand.
// When a person publishes a Drive profile with the same slug, it replaces their hand-entered
// one, which can then be deleted from this file.

import { DRIVE_PROFILES } from './team.generated.js'

// webs's profile moved to Drive on 2026-10-22, so none are left. A hand-entered profile
// still works the same way; add it here when someone can't use the Doc.
export const HAND_AUTHORS = []

// Every profile, published before drafts so bylines find the live one. A draft that
// would take a slug already live (someone redoing their page) previews at
// /about/<slug>-preview instead, so the live page stays up while they edit.
function mergeProfiles() {
  const published = DRIVE_PROFILES.filter((profile) => !profile.draft)
  const liveSlugs = new Set(published.map((profile) => profile.slug))
  const hand = HAND_AUTHORS.filter((author) => !liveSlugs.has(author.slug))
  for (const author of hand) if (!author.draft) liveSlugs.add(author.slug)
  const drafts = DRIVE_PROFILES.filter((profile) => profile.draft).map((profile) =>
    liveSlugs.has(profile.slug) ? { ...profile, slug: `${profile.slug}-preview` } : profile,
  )
  return [...published, ...hand, ...drafts]
}

export const AUTHORS = mergeProfiles()

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
