import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Per-page document metadata for this single-page app. React renders after the
// static index.html <head>, so this component keeps the tab title, description,
// and the Open Graph / Twitter and canonical tags in sync with the current route.
//
// The static defaults in index.html cover crawlers that never run JS (they are
// the reliable social-share preview). This adds accurate per-page titles and
// descriptions for browser tabs, bookmarks, and crawlers that do execute JS.
//
// Usage: render <PageMeta title="About" description="…" /> near the top of a page.
// Omit `title` on the home page to use the site name alone.

const SITE_NAME = 'Understory Collaborative'

function upsertMeta(key, keyType, content) {
  if (!content) return
  let el = document.head.querySelector(`meta[${keyType}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(keyType, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function PageMeta({ title, description }) {
  const { pathname } = useLocation()

  useEffect(() => {
    const fullTitle = title ? `${title} · ${SITE_NAME}` : SITE_NAME
    document.title = fullTitle

    // Derive the canonical origin at runtime so it is always correct, whatever
    // domain the site is served from.
    const url = `${window.location.origin}${pathname}`

    upsertMeta('description', 'name', description)
    upsertMeta('og:title', 'property', fullTitle)
    upsertMeta('og:description', 'property', description)
    upsertMeta('og:url', 'property', url)
    upsertMeta('twitter:title', 'name', fullTitle)
    upsertMeta('twitter:description', 'name', description)
    upsertLink('canonical', url)
  }, [title, description, pathname])

  return null
}

export default PageMeta
