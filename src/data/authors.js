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
    role: 'Co-founder',
    // Id from the TPM self-check roster (src/data/tpmSelfCheckData.js); links to
    // /tpm-types/<id>.
    tpmType: 'polymath',
    bio: [
      'webs (Stephanie Weber) is a technical product manager who gets stuck software teams moving again. She has more than twenty years across education and technology, and she\'s finishing a PhD at UNLV on how cross-functional software teams collaborate.',
      'As a technical product manager, she introduced a product lifecycle her whole company adopted as its shared language. She built a system for engineering and product to talk about how confident they were in a ship date. She coached two VPs of Engineering through organization-wide changes, and she designed a phased rollout of AI tools for developers, QA engineers, and product people.',
      'She got there the long way. She spent ten years in the Clark County School District as a classroom teacher and digital learning coach, and co-founded The Intelligent Hoodlums, which runs professional learning for teachers. After a master\'s in educational leadership, and a couple of summers dealing at the World Series of Poker, she taught herself to code.',
      'At ThoughtWorks she worked across full-stack development, security, and infrastructure, including a rebuild of how an airline manages aircraft maintenance and a GDPR build for a global fashion brand. She holds everything she builds to the standard she studies: secure, accessible, and transparent by default.',
    ],
    draft: false,
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
