// Between the Seams, Understory's podcast. One list feeds both the /podcast page and the RSS
// feed at /podcast/feed.xml, which Apple Podcasts, Spotify, and other apps read.
//
// The audio lives in the site's Vercel Blob store, not in this repo: each episode is about
// 35 MB, and the Hobby plan caps a deployment's uploaded files at 100 MB. Upload each MP3 to
// the store under between-the-seams/, then put the store's public base URL in AUDIO_BASE.
// An episode's guid never changes once it's published, or apps list it twice.

export const AUDIO_BASE = 'https://REPLACE-WITH-BLOB-STORE.public.blob.vercel-storage.com/between-the-seams'

export const show = {
  title: 'Between the Seams',
  author: 'Understory Collaborative',
  email: 'contact@understorycollab.com',
  // Apple asks for a square image from 1400 to 3000 pixels, with no transparency.
  image: '/podcast/cover.jpg',
  language: 'en-us',
  // Apple's categories. Business > Management first, since the show is for leaders.
  categories: [['Business', 'Management'], ['Technology']],
  description: [
    "Between the Seams is a podcast from Understory Collaborative about where software projects get stuck. Each episode brings together technical product managers and delivery leaders who've worked in the gaps between teams: the handoffs, the words two teams define differently, and the work everyone thought someone else owned. They talk through what they've seen and what helps.",
    "It's for leaders whose dates keep sliding and for TPMs who want to get better at the job. Episodes come from Understory's live webinars.",
  ],
  officeHours: 'https://understorycollab.com/office-hours',
}

// Newest first. Chapter times are in the audio, which has no title or end card, so they run
// a few seconds earlier than the YouTube replay's.
export const episodes = [
  {
    number: 2,
    guid: 'understorycollab.com/podcast/between-the-seams/2',
    title: 'Where Do Projects Actually Break Down: Inside Teams or Between Them?',
    date: '2026-11-05T20:17:00Z',
    file: 'episode-2.mp3',
    bytes: 36528521,
    seconds: 2283,
    youtube: null,
    description:
      'This is Understory Collaborative\'s second webinar, and episode 2 of Between the Seams. Danielle Christophe hosts Jess Kern and webs for a conversation about where projects get stuck: inside one team, or in the handoffs between teams. Jess\'s quick test is to ask who owns the problem. "If you get a name, it\'s inside a team. If you get a meeting, it\'s a seam." From there, the panel covers why "who owns this?" so often goes unanswered, whether ai is helping or hurting handoffs, and one habit that keeps them from breaking.',
    cta: ["Want to know the state of your engineering team? Take the What's On Fire? quiz.", 'https://understorycollab.com/assessment'],
    chapters: [
      ['0:00', 'Welcome'],
      ['0:36', 'Meet the panel, and what a TPM does'],
      ['2:49', 'Is the problem inside a team or between teams?'],
      ['8:59', 'Where handoffs fail most'],
      ['14:40', 'Why "who owns this?" goes unanswered'],
      ['20:40', 'One change to help a team talk better'],
      ['24:02', 'Is ai helping or hurting handoffs?'],
      ['30:19', 'What a TPM does when things break down'],
      ['33:18', 'One habit that keeps handoffs from breaking'],
      ['36:56', 'Assessments and office hours'],
    ],
  },
  {
    number: 1,
    guid: 'understorycollab.com/podcast/between-the-seams/1',
    title: 'What Is a TPM, and Why Does the Job Feel Harder Than Ever?',
    date: '2026-10-22T23:13:00Z',
    file: 'episode-1.mp3',
    bytes: 35378441,
    seconds: 2211,
    youtube: 'https://www.youtube.com/watch?v=EUg-o2iFFi0',
    description:
      'This is Understory Collaborative\'s first webinar, and episode 1 of Between the Seams. Danielle Christophe hosts Al, Jess Kern, and webs for a conversation about what a technical product manager does, how the job differs from a PM\'s, and why it feels harder right now. For leaders deciding whether to hire one, Al\'s advice is that they "need to have the humility to hire someone that has the ability to tell them no." The panel also covers whether ai makes TPMs more productive, and the one thing never to hand off to it.',
    cta: ['Which kind of TPM are you? Take the TPM self-check.', 'https://understorycollab.com/tpm-self-check'],
    chapters: [
      ['0:00', 'Welcome'],
      ['0:59', 'Meet the panel'],
      ['6:48', 'What makes a TPM different from a PM?'],
      ['16:03', 'Does ai make TPMs more productive?'],
      ['24:07', 'The one thing never to hand off to ai'],
      ['27:15', 'Do you need a TPM? Advice for non-technical leaders'],
      ['36:07', 'The self-check and office hours'],
    ],
  },
]

export const audioUrl = (episode) => `${AUDIO_BASE}/${episode.file}`

// 2211 becomes 00:36:51, the form Apple's itunes:duration reads.
export function clock(seconds) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${pad(Math.floor(seconds / 3600))}:${pad(Math.floor((seconds % 3600) / 60))}:${pad(seconds % 60)}`
}
