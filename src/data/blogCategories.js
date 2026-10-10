// Blog categories. They're the three offers, so a reader who finds one post can find the
// rest on the same problem, then the offer that helps with it (decided with webs,
// 2026-10-10). A post can carry more than one: write them comma separated on the Doc's
// "Category:" line, as in "Design, Build". Any other label still shows, as plain text with
// no page, so older posts don't lose their badge before they're retagged.
import { offers } from './offersData.js'

const selfSelect = (id) => offers.find((offer) => offer.id === id)?.selfSelect || ''

export const blogCategories = [
  { slug: 'design', name: 'Design', line: selfSelect('design') },
  { slug: 'build', name: 'Build', line: selfSelect('build') },
  // Ship covers shipping software: automation, better process, and ai running amok in an
  // org. The Ship offer page's line speaks only to ai, so this one waits on webs.
  { slug: 'ship', name: 'Ship', line: '' },
]

export function findCategory(label) {
  const key = String(label || '').trim().toLowerCase()
  return blogCategories.find((category) => category.slug === key || category.name.toLowerCase() === key)
}

// The labels a post carries, each with its category page when it has one.
export function postCategories(post) {
  return (post.categories || []).map((label) => {
    const category = findCategory(label)
    return category ? { label: category.name, href: `/blog/category/${category.slug}` } : { label }
  })
}
