// Counts plays on the site's own podcast players, on /podcast and each episode page. The first
// time a player starts in a visit, it records an "Episode played" event in Vercel Analytics
// with the episode number. The count shows only in the project's Vercel Analytics, under Events.
// Downloads from podcast apps are counted separately, in api/episode-audio.js.
import { track } from '@vercel/analytics'

export function countEpisodePlays() {
  document.querySelectorAll('audio[data-episode]').forEach((audio) => {
    audio.addEventListener('play', () => {
      track('Episode played', { episode: Number(audio.dataset.episode) })
    }, { once: true })
  })
}
