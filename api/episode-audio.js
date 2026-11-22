/*
 * GET /podcast/audio/<file> — counts a podcast app's download, then sends it on to the MP3.
 *
 * The feed (src/pages/podcast/feed.xml.js) points each episode's enclosure here instead of
 * straight at the Vercel Blob store, because Blob doesn't count downloads per file. vercel.json
 * rewrites /podcast/audio/<file> to this function with ?file=<file>. The function records an
 * "Episode downloaded" event in Vercel Analytics, with the episode number and the app, and
 * answers with a 302 to the file in the Blob store. Listeners never see the count; it shows only
 * in the project's Vercel Analytics, under Events.
 *
 * Apps often fetch one episode in several pieces (HTTP range requests), and Apple sends a tiny
 * "bytes=0-1" probe first. Only a request for the start of the file counts, so one listen is
 * close to one event. It's still a rough count: an app that re-downloads counts again.
 *
 * The site's own players on /podcast keep playing straight from the Blob store; they count as
 * "Episode played" in the browser instead, so feed downloads and site plays stay separate.
 *
 * A counting failure never blocks the download.
 */
import { track } from '@vercel/analytics/server'
import { episodes, audioUrl } from '../src/data/podcastData.js'

// The app, from its user agent. Names only, never the full string.
const APPS = [
  [/AppleCoreMedia|Podcasts\/|iTunes|Apple ?TV/i, 'Apple Podcasts'],
  [/Spotify/i, 'Spotify'],
  [/Overcast/i, 'Overcast'],
  [/Pocket ?Casts/i, 'Pocket Casts'],
  [/Castro/i, 'Castro'],
  [/Podcast ?Addict/i, 'Podcast Addict'],
  [/Castbox/i, 'Castbox'],
  [/AntennaPod/i, 'AntennaPod'],
  [/YouTube|Google-Podcast|GoogleChirp/i, 'YouTube Music'],
  [/Mozilla|Chrome|Safari/i, 'Browser'],
]

function appName(userAgent = '') {
  const match = APPS.find(([pattern]) => pattern.test(userAgent))
  return match ? match[1] : 'Other'
}

// A request counts when it asks for the whole file or for a piece starting at byte 0,
// but not Apple's two-byte probe.
function isFirstRequest(range) {
  if (!range) return true
  return /^bytes=0-/.test(range) && range !== 'bytes=0-1'
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD')
    return res.status(405).end()
  }

  const episode = episodes.find((item) => item.file === req.query.file)
  if (!episode) return res.status(404).end()

  if (req.method === 'GET' && isFirstRequest(req.headers.range)) {
    try {
      // Wait at most a second, so a slow analytics call never holds up the download.
      await Promise.race([
        track('Episode downloaded', { episode: episode.number, app: appName(req.headers['user-agent']) }, { headers: req.headers }),
        new Promise((resolve) => setTimeout(resolve, 1000)),
      ])
    } catch (error) {
      console.error('Episode download count failed:', error.message)
    }
  }

  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('Location', audioUrl(episode))
  return res.status(302).end()
}
