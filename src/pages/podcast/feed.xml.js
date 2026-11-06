// The Between the Seams RSS feed, built at deploy time from src/data/podcastData.js. Apple
// Podcasts, Spotify, and the other apps poll this URL for new episodes.
import { show, episodes, audioUrl, episodePath, clock } from '../../data/podcastData.js'

const escape = (text) =>
  String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// The episode notes apps show: the description, the call to action, office hours, and chapters.
function notes(episode) {
  const lines = [episode.description, '', `${episode.cta[0]} ${episode.cta[1]}`,
    `Want to talk it through? Book free office hours: ${show.officeHours}`, '', 'Chapters',
    ...episode.chapters.map(([at, name]) => `${at} ${name}`)]
  return lines.join('\n')
}

function category([main, sub]) {
  return sub
    ? `<itunes:category text="${escape(main)}"><itunes:category text="${escape(sub)}"/></itunes:category>`
    : `<itunes:category text="${escape(main)}"/>`
}

export function GET({ site }) {
  const page = new URL('/podcast', site).href
  const image = new URL(show.image, site).href
  const items = episodes.map((episode) => `
    <item>
      <title>${escape(episode.title)}</title>
      <guid isPermaLink="false">${escape(episode.guid)}</guid>
      <pubDate>${new Date(episode.date).toUTCString()}</pubDate>
      <link>${new URL(episodePath(episode), site).href}</link>
      <description>${escape(notes(episode))}</description>
      <enclosure url="${escape(audioUrl(episode))}" length="${episode.bytes}" type="audio/mpeg"/>
      <itunes:episode>${episode.number}</itunes:episode>
      <itunes:episodeType>full</itunes:episodeType>
      <itunes:duration>${clock(episode.seconds)}</itunes:duration>
      <itunes:explicit>false</itunes:explicit>
    </item>`).join('')
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(show.title)}</title>
    <link>${page}</link>
    <atom:link href="${new URL('/podcast/feed.xml', site).href}" rel="self" type="application/rss+xml"/>
    <language>${show.language}</language>
    <description>${escape(show.description.join('\n\n'))}</description>
    <itunes:author>${escape(show.author)}</itunes:author>
    <itunes:owner><itunes:name>${escape(show.author)}</itunes:name><itunes:email>${show.email}</itunes:email></itunes:owner>
    <itunes:image href="${image}"/>
    <image><url>${image}</url><title>${escape(show.title)}</title><link>${page}</link></image>
    ${show.categories.map(category).join('\n    ')}
    <itunes:explicit>false</itunes:explicit>
    <itunes:type>episodic</itunes:type>${items}
  </channel>
</rss>
`
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } })
}
