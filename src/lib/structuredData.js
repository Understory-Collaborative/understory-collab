// Structured data (schema.org JSON-LD) for search engines and AI assistants: who runs
// the site, who wrote each post, and when. BaseLayout writes the site-wide graph on
// every page; pages add their own nodes (a post, a profile). Every value comes from
// data the site already shows, so nothing here can drift from the page.

export const SITE_NAME = 'Understory Collaborative'
export const SITE_DESCRIPTION =
  "When a project is late, a team is stuck, or your tooling has gotten away from you, we've worked through it before. Start wherever you're stuck."
const CONTACT_EMAIL = 'contact@understorycollab.com'

export const orgId = (site) => new URL('/#organization', site).href
export const personId = (site, author) => new URL(`/about/${author.slug}#person`, site).href

export function siteGraph(site) {
  return [
    {
      '@type': 'Organization',
      '@id': orgId(site),
      name: SITE_NAME,
      url: new URL('/', site).href,
      logo: new URL('/android-chrome-512x512.png', site).href,
      description: SITE_DESCRIPTION,
      email: CONTACT_EMAIL,
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
