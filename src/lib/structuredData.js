// Structured data (schema.org JSON-LD) for search engines and ai assistants: who runs
// the site, who wrote each post, and when. BaseLayout writes the site-wide graph on
// every page; pages add their own nodes (a post, a profile). Every value comes from
// data the site already shows, so nothing here can drift from the page. The company and
// founder facts match friday's entity sheet (domains/content/entity-sheet.md), which the
// studio w labs and Intelligent Hoodlums sites copy too; change them there first.

import { getAuthorBySlug } from '../data/authors.js'

export const SITE_NAME = 'Understory Collaborative'
export const SITE_DESCRIPTION =
  "When a project is late, a team is stuck, or your tooling has gotten away from you, we've worked through it before. Start wherever you're stuck."
// What the company is, for the Organization record. The page description above is the
// homepage's opening line, which never says what Understory does. No city: the team works
// from across the US.
const ORG_DESCRIPTION =
  'Understory Collaborative is a software delivery consultancy that gets stalled teams moving again, with deep roots in edtech.'
const CONTACT_EMAIL = 'contact@understorycollab.com'
// The company's profiles elsewhere, so search engines treat them and the site as one company.
const ORG_SAME_AS = ['https://www.linkedin.com/company/understory-collaborative/']

export const orgId = (site) => new URL('/#organization', site).href
// Each person's id ends in their slug (webs is /about/webs#webs), the same format the
// other two sites use for her, so the three records read as one person.
export const personId = (site, author) =>
  new URL(`/about/${author.slug}#${author.slug}`, site).href

// Founders named on the Organization record. webs only, until the other members decide
// whether they're listed as founders or members.
const FOUNDERS = [getAuthorBySlug('webs')]

export function siteGraph(site) {
  return [
    {
      '@type': 'Organization',
      '@id': orgId(site),
      name: SITE_NAME,
      url: new URL('/', site).href,
      logo: new URL('/android-chrome-512x512.png', site).href,
      description: ORG_DESCRIPTION,
      areaServed: 'US',
      founder: FOUNDERS.map((author) => ({ '@id': personId(site, author) })),
      email: CONTACT_EMAIL,
      sameAs: ORG_SAME_AS,
    },
    {
      '@type': 'WebSite',
      '@id': new URL('/#website', site).href,
      name: SITE_NAME,
      url: new URL('/', site).href,
      publisher: { '@id': orgId(site) },
    },
  ]
}

export function personNode(site, author) {
  return {
    '@type': 'Person',
    '@id': personId(site, author),
    name: author.name,
    ...(author.alternateName && { alternateName: author.alternateName }),
    ...(author.role && { jobTitle: author.role }),
    ...(author.bio?.[0] && { description: author.bio[0] }),
    image: new URL(author.photo, site).href,
    url: new URL(`/about/${author.slug}`, site).href,
    worksFor: { '@id': orgId(site) },
    ...(author.sameAs?.length && { sameAs: author.sameAs }),
  }
}

// Serialize for a <script type="application/ld+json"> block. Escaping "<" keeps a
// value like "</script>" from closing the tag early.
export function toJsonLd(nodes) {
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes }).replace(
    /</g,
    '\\u003c',
  )
}
