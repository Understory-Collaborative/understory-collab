import { Link, useParams } from 'react-router-dom'
import PageMeta from '../components/PageMeta'
import Prose from '../components/BlogProse'
import { splitQA } from '../lib/qa'
import { getPostBySlug, formatDate } from '../lib/posts'
import { findAuthor } from '../data/authors'
import './BlogPost.css'

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
  const author = findAuthor(post.author)

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
            </p>
            <h1 id="post-heading">{post.title}</h1>
            {post.subtitle && (
              <p className="page-hero-description blog-post-subtitle">{post.subtitle}</p>
            )}
            {post.author && (
              <p className="blog-post-byline">
                By{' '}
                {author ? (
                  <Link to={`/about/${author.slug}`}>{author.name}</Link>
                ) : (
                  post.author
                )}
              </p>
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
