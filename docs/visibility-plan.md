# Visibility plan: getting recommended for late projects and struggling teams

Scoped 2026-10-07. The goal is for Understory to be the site that search engines and AI
assistants point to when someone asks how to fix a late project or help a team perform
better. Sizes are relative (S, M, L), not time estimates.

---

## How assistants pick what to recommend

| Signal | What it means for us | Where it stands |
|---|---|---|
| Readable pages | The assistant's crawler has to see the words. | This is done: the Astro cut over made every page plain HTML. |
| Search presence | Assistants that search the web start from search results, so ordinary search ranking still decides what they read. | The sitemap and structured data are in #122. Search Console and Bing still need setting up. |
| A page that answers the question | The assistant quotes the page that answers what was asked, in the words it was asked. | This is the main gap on the site. Most pages describe us, and few answer a question. |
| Mentions elsewhere | Assistants lean on names that show up across many independent sources. | This is likely the largest gap, and it lives off the site. |
| One consistent description | The same one-line description everywhere lets a search engine treat the site, the LinkedIn page, and the bios as one company. | It doesn't exist yet, and it depends on the tagline work below. |

An `llms.txt` file isn't on this list. It's a proposed standard, and as of this plan no
major assistant has said it uses one to choose sources. It costs little, so it sits in
workstream 7 as optional.

---

## Workstreams

| # | Workstream | Owner | Size | Starts after |
|---|---|---|---|---|
| 1 | Question research | webs (sources only she can reach), Claude (Google side, synthesis) | M | Now |
| 2 | Tagline and one-line description | webs decides, Claude drafts | M | First round of 1 |
| 3 | Page breakdown audit | Claude audits, webs decides | S | First round of 1 |
| 4 | Answer-shaped posts | webs writes, Claude edits | L, ongoing | 1 |
| 5 | Named concepts | Claude inventories, webs decides | S | Now |
| 6 | Mentions elsewhere | webs | L, ongoing | 2 |
| 7 | Technical leftovers | Claude, webs for accounts | S | #122 merged |
| 8 | Measurement | Claude sets up, monthly check | S | 7 |

---

## 1. Question research

**Status:** round 1 is in `docs/question-bank.md` (2026-10-07, 55 questions from Quora). Round 2 needs webs at a browser for Google, Reddit, and TikTok.

**Goal:** a bank of the real questions buyers ask, in their words, ranked by how often they
show up. It feeds every other workstream: the tagline's wording, which pages to split, and
which posts to write.

This adapts webs's method in `friday/domains/content/ask-question-capture.md` to Understory's
buyer, the leader with a late project or a stuck team. Its two rules carry over unchanged:
only real, sourced questions get answered, and the answer lowers the worry before it fixes
anything.

| Source | How | Who |
|---|---|---|
| Google autocomplete | Type a stem into the search box and record the suggestions. Repeat in a private window, since results follow your history. | webs, or a Claude session with browser access, since this environment can't reach Google |
| Google "People also ask" | Search each stem, record the questions in the box, and open a few, since each one opens more. | webs, or a browser session |
| Google "Related searches" | Record the list at the bottom of each results page. | webs, or a browser session |
| TikTok autocomplete | Use the existing method with Understory's stems. | webs |
| Reddit and forums | Post titles are the questions, and upvotes show how many people share them. r/ExperiencedDevs, r/EngineeringManagers, r/projectmanagement, r/agile, r/ProductManagement. | webs, by hand |
| LinkedIn comments | Replies under posts about late projects, status reporting, and team performance. | webs |
| Our own record | Read submissions to `/questions`, contact form messages, and notes from calls. | webs |
| The assistants themselves | Ask ChatGPT, Claude, Perplexity, and Gemini a stem, then record the follow-up questions they suggest. | Claude or webs |

**Starter stems** (first person, the way a worried leader types; webs to edit):

- `my project is late`, `how do i tell my boss the project`, `how to recover a late`
- `why does my team keep missing`, `how to get my team to`, `my engineering team is`
- `our status is green but`, `how to estimate when`, `what does a technical product manager`

**Capture:** one file, `docs/question-bank.md`, using the capture template from
`ask-question-capture.md` (verbatim question, source, times seen, answer material). Add a
"page" field for the page or post that answers it, blank until one exists.

**Open, for webs:** your notes on using Google's generated questions weren't anywhere in the
repos. The Google rows above are the standard method. If your notes differ, point Claude to
them and this section changes to match.

---

## 2. Tagline and one-line description

**Why the current line is weak:** "You aren't supposed to have all of this solved on your
own" speaks to the reader's feeling, which fits the brand's "curious, not judgmental" soul.
It never says what the problem is or who helps with it. A stranger can't tell what
Understory does from it, and neither can a search engine or an assistant matching it to a
question about late projects.

**Proposal: split it into two lines with two jobs.**

| Line | Job | Where it goes |
|---|---|---|
| Tagline | Makes the right reader feel seen. Can carry warmth and voice. | The home hero |
| One-line description | Says plainly what we do, for whom, and for which problem, in the words from workstream 1. | Meta description, Organization structured data, LinkedIn tagline, every bio, the first line of About |

The current line could survive as supporting copy once the hero names the problem.

**Inputs:** the question bank (workstream 1), the wedge in `review/tpm-positioning.md`, the
soul in `review/brand-offer-foundation.md`, and the site voice in `design-system/VOICE.md`.

**Steps:**

1. After the first round of question research, pull the phrases buyers repeat most.
2. Claude drafts candidates for both lines, using the `storybrand` one-liner and
   `the-big-idea` skills in `friday/marketing`, and runs each through the voice canon.
3. Test each candidate. Would a stranger know what we do from it alone? Does it use a word
   from the question bank? Could a competitor say it word for word? If so, cut it.
4. webs picks. Nothing ships without her choice.
5. Roll the description out everywhere in one pass, so it reads the same in every place.

---

## 3. Page breakdown audit

**The rule:** each page answers one main question. Search engines and assistants match a
question to a page, so a page answering four questions competes weakly for all four.

**The test, per page:**

1. Can you state the page's main question in one sentence? If not, it may be two pages.
2. For each section, would someone search for it on its own? If yes, it's a candidate for its
   own page or post, linked from the parent.
3. Does the section answer the question, or only mention it? A mention stays; an answer that
   gets cut short becomes its own page.

Hub pages, like Home and `/tpm-types`, are the exception: their job is to route, so they
stay broad and link out.

**Output:** a table of page, main question, sections that could stand alone, and a
recommendation, for webs to decide on line by line. Likely candidates to look at first are
the three offer pages, Office Hours, and About.

**Open, for webs:** your notes on this process weren't in the repos either. The test above is
the standard one-question-per-page method; point Claude to your notes if they add steps.

---

## 4. Answer-shaped posts

The Q&A posts already match how assistants pick sources: one question, answered by someone
who has done the work.

- **Pick from the bank.** Write the questions that show up most often first.
- **Title it as the question,** in the asker's words.
- **Answer early.** `friday/style/voice.md` asks long answers to acknowledge the feeling
  before the fix. Keep that opening short, and get to the first concrete step within the
  first few paragraphs, since assistants tend to quote the part that answers.
- **Link each post** to the page or concept it relates to (an offer, a TPM type, the
  assessment).
- **Cadence:** webs decides.

---

## 5. Named concepts

Assistants credit a source for an idea they can't find anywhere else. Understory already has
several: the TPM types, the fire severity levels from the assessment, the status color post,
and the confidence score. Each should have:

- One consistent name, used the same way on the site, LinkedIn, and in talks.
- One page that defines it, which everything else links to.

**Step:** Claude inventories every named concept on the site and in the posts, with where
each is defined today, and webs decides which ones to build out.

---

## 6. Mentions elsewhere

This is likely the largest lever, and it's almost entirely webs's. Each mention should use the one-line
description from workstream 2 and link to a specific page, not only the home page.

| Channel | Notes |
|---|---|
| LinkedIn articles | These are already running. Cross-link each one to its blog version. |
| Guest posts | Pitch engineering management and product newsletters and blogs. |
| Podcasts | Pitch engineering leadership and product shows. |
| Talks | Speak at local meetups and conferences, and post the slides. |
| Communities | Answer questions where buyers ask them (the workstream 1 sources), with a link only where it helps. |

`friday`'s content agent, Cypher, can help pick which ideas to pitch where.

---

## 7. Technical leftovers

| Item | Who | Notes |
|---|---|---|
| Google Search Console | webs | Verify the domain and submit the sitemap. It shows the searches the site appears for, which feed workstream 1. |
| Bing Webmaster Tools | webs | Do the same here, since ChatGPT's search draws on Bing's results. |
| `sameAs` links | Claude | Done: the company's and webs's LinkedIn profiles are in the structured data. |
| `llms.txt` | Claude | This is optional: a short markdown map of the site for tools that look for one. |

---

## 8. Measurement

Once a month, ask the same set of questions to ChatGPT, Claude, Perplexity, and Google's AI
answers, and log whether Understory is mentioned or linked.

- The questions come from the top of the question bank.
- The log lives in `docs/visibility-log.md`: date, assistant, question, mentioned or not, and
  which page it linked.
- Search Console's query report goes into the same review: searches that show the site but
  get few clicks point to pages that need a sharper answer.

---

## Order of work

1. Merge #122. webs sets up Search Console and Bing.
2. First round of question research (1), and the named concepts inventory (5), in parallel.
3. Tagline and description (2), and the page breakdown audit (3), drawing on round one.
4. Answer-shaped posts (4) and mentions elsewhere (6), ongoing.
5. Monthly measurement (8) from the first month after Search Console is live.
