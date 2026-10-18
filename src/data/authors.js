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
// team.generated.js. The few below are typed in by hand, from before the sync existed.
// When a person publishes a Drive profile with the same slug, it replaces their hand-entered
// one, which can then be deleted from this file.

import { DRIVE_PROFILES } from './team.generated.js'

export const HAND_AUTHORS = [
  {
    slug: 'webs',
    name: 'webs',
    // The full name, from the bio, so search engines can match webs to her other work.
    alternateName: 'Stephanie Weber',
    // Profiles elsewhere, for the structured data's sameAs: her personal profiles, then
    // her pages on her other two sites. The same list is on those sites, from friday's
    // entity sheet, so all three records read as one person.
    sameAs: [
      'https://www.linkedin.com/in/weberswords',
      'https://www.tiktok.com/@webswebswebs',
      'https://github.com/weberswords',
      'https://www.thoughtworks.com/profiles/s/stephanie-weber',
      'https://studiowlabs.com/about',
      'https://theintelligenthoodlums.com/crew',
    ],
    // Her links, shown under the TPM type at the top of the profile.
    elsewhere: [
      { name: 'LinkedIn', url: 'https://www.linkedin.com/in/weberswords' },
      { name: 'studio w labs', url: 'https://studiowlabs.com' },
      { name: 'The Intelligent Hoodlums', url: 'https://theintelligenthoodlums.com/crew' },
    ],
    aliases: [],
    photo: '/team/webs.webp',
    photoAlt: 'Hedcut portrait of webs in glasses, drawn in stipple and line',
    role: 'Co-founder',
    // Id from the TPM self-check roster (src/data/tpmSelfCheckData.js); links to
    // /tpm-types/<id>.
    tpmType: 'polymath',
    bio: [
      'webs (Stephanie Weber) is a technical product manager who gets stuck software teams moving again. She has more than twenty years across education and technology, and she\'s finishing a PhD at UNLV on how cross-functional software teams collaborate.',
      'As a technical product manager, she introduced a product lifecycle that product and engineering adopted as their shared language. She built a system for engineering and product to talk about how confident they were in a ship date. She coached two VPs of Engineering through organization-wide changes, and she designed a phased rollout of ai tools for developers, QA engineers, and product people.',
      'She got there the long way. She spent ten years in the Clark County School District as a classroom teacher and digital learning coach, and co-founded The Intelligent Hoodlums, which runs professional learning for teachers. After a master\'s in educational leadership, and a couple of summers dealing at the World Series of Poker, she taught herself to code.',
      'At ThoughtWorks she worked across full-stack development, security, and infrastructure, including a rebuild of how an airline manages aircraft maintenance and a GDPR build for a global fashion brand. She holds everything she builds to the standard she studies: secure, accessible, and transparent by default.',
    ],
    draft: false,
  },
]

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
