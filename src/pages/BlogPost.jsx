import { Link, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import PageMeta from '../components/PageMeta'
import { getPostBySlug, formatDate } from '../lib/posts'
import './BlogPost.css'

// A heading 1 inside a post body would compete with the page title, so it renders as a
// section heading instead.
const markdownComponents = {
  h1: ({ node, ...props }) => <h2 {...props} />, // eslint-disable-line no-unused-vars
}

function Prose({ children }) {
  return (
    <div className="blog-prose">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {children}
      </ReactMarkdown>
    </div>
  )
}

const Q_PREFIX = /^(?:\*\*|__)?Q:(?:\*\*|__)?\s*/
const A_PREFIX = /^(?:\*\*|__)?A:(?:\*\*|__)?\s*/

// A Q&A post is written as a paragraph starting "Q:" and a later one starting "A:".
// Split it so the question and the answer render as their own labeled sections. A
// short last line of the question with no end punctuation is the asker's sign-off.
// Returns null for any post that isn't shaped that way, which then renders as-is.
function splitQA(content) {
  const blocks = content.split(/\n{2,}/)
  const qi = blocks.findIndex((block) => Q_PREFIX.test(block))
  const ai = blocks.findIndex((block, i) => i > qi && A_PREFIX.test(block))
  if (qi === -1 || ai === -1) return null

  const question = blocks.slice(qi, ai)
  const answer = blocks.slice(ai)
  question[0] = question[0].replace(Q_PREFIX, '')
  answer[0] = answer[0].replace(A_PREFIX, '')

  let signature = ''
  const last = question[question.length - 1].replace(/[*_]/g, '').trim()
  if (question.length > 1 && last.length <= 60 && !/[.?!:,]$/.test(last)) {
    signature = last
    question.pop()
  }

  return {
    intro: blocks.slice(0, qi).join('\n\n'),
    question: question.join('\n\n'),
    signature,
    answer: answer.join('\n\n'),
  }
}

// A single blog post. Drafts render at their own URL for preview, but are marked
// noindex so a preview never gets picked up by search engines before it is published.
function BlogPost() {
  const { slug } = useParams()
  const post = getPostBySlug(slug)

  if (!post) {
    return (
      <div className="blog-post">
        <PageMeta title="Post not found" noindex />
        <section className="page-hero">
          <div className="page-hero-content">
            <h1>Post not found</h1>
            <p className="page-hero-description">
              We couldn&rsquo;t find that post. It may have moved or not be published yet.
            </p>
          </div>
        </section>
        <section className="section-container blog-post-backrow">
          <Link to="/blog" className="blog-post-back">
            &larr; Back to the blog
          </Link>
        </section>
      </div>
    )
  }

  const qa = splitQA(post.content)

  return (
    <div className="blog-post">
      <PageMeta
        title={post.title}
        description={post.excerpt}
        noindex={post.draft}
      />

      <article>
        {/* A cover image replaces the vine texture as the hero background. */}
        <header
          className={post.cover ? 'page-hero blog-post-hero--cover' : 'page-hero'}
          style={post.cover ? { '--post-cover': `url("${post.cover}")` } : undefined}
          aria-labelledby="post-heading"
        >
          <div className="page-hero-content">
            {post.draft && (
              <p className="blog-post-draft-flag" role="status">
                Draft preview &mdash; not published or indexed
              </p>
            )}
            <p className="blog-post-meta">
              {post.category && (
                <span className="blog-post-category">{post.category}</span>
              )}
              {post.date && (
                <time dateTime={post.date}>{formatDate(post.date)}</time>
              )}
              {post.date && <span aria-hidden="true"> · </span>}
              <span>{post.readingMinutes} min read</span>
              {post.author && (
                <>
                  <span aria-hidden="true"> · </span>
                  <span>{post.author}</span>
                </>
              )}
            </p>
            <h1 id="post-heading">{post.title}</h1>
            {post.subtitle && (
              <p className="page-hero-description blog-post-subtitle">{post.subtitle}</p>
            )}
          </div>
        </header>

        <div className="blog-post-body-section">
          <div className="blog-post-body">
            {qa ? (
              <>
                {qa.intro && <Prose>{qa.intro}</Prose>}
                <section className="blog-qa blog-qa-question" aria-labelledby="qa-question">
                  <h2 id="qa-question" className="blog-qa-label">The question</h2>
                  <Prose>{qa.question}</Prose>
                  {qa.signature && <p className="blog-qa-signature">{qa.signature}</p>}
                </section>
                <section className="blog-qa blog-qa-answer" aria-labelledby="qa-answer">
                  <h2 id="qa-answer" className="blog-qa-label">The answer</h2>
                  <Prose>{qa.answer}</Prose>
                </section>
              </>
            ) : (
              <Prose>{post.content}</Prose>
            )}

            {post.tags.length > 0 && (
              <ul className="blog-tags blog-post-tags" role="list" aria-label="Tags">
                {post.tags.map((tag) => (
                  <li key={tag} className="blog-tag">
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </article>

      <section className="section-container blog-post-backrow">
        <Link to="/blog" className="blog-post-back">
          &larr; Back to the blog
        </Link>
      </section>
    </div>
  )
}

export default BlogPost
