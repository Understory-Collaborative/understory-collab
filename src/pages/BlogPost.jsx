import { Link, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import PageMeta from '../components/PageMeta'
import { getPostBySlug, formatDate } from '../lib/posts'
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

  return (
    <div className="blog-post">
      <PageMeta
        title={post.title}
        description={post.excerpt}
        noindex={post.draft}
      />

      <article>
        <header className="page-hero" aria-labelledby="post-heading">
          <div className="page-hero-content">
            {post.draft && (
              <p className="blog-post-draft-flag" role="status">
                Draft preview &mdash; not published or indexed
              </p>
            )}
            <p className="blog-post-meta">
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
          </div>
        </header>

        <div className="blog-post-body-section">
          <div className="blog-post-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
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
