import { Link } from 'react-router-dom'
import PageMeta from '../components/PageMeta'
import { getPublishedPosts, formatDate } from '../lib/posts'
import './Blog.css'

// The blog index. Lists published posts newest first. When there are none yet it
// shows a plain empty state rather than a broken-looking blank page.
function Blog() {
  const posts = getPublishedPosts()

  return (
    <div className="blog">
      <PageMeta
        title="Blog"
        description="Field notes on technical product management from Understory Collaborative: scope, delivery, and keeping technical work healthy."
      />

      <section className="page-hero" aria-labelledby="blog-heading">
        <div className="page-hero-content">
          <h1 id="blog-heading">Blog</h1>
          <p className="page-hero-description">
            Field notes on technical product management: scope, delivery, and keeping
            technical work healthy, from the people who do it.
          </p>
        </div>
      </section>

      <section className="blog-list-section" aria-labelledby="blog-list-heading">
        <div className="section-container">
          <h2 id="blog-list-heading" className="sr-only">
            All posts
          </h2>

          {posts.length === 0 ? (
            <div className="blog-empty">
              <p className="blog-empty-lead">No posts yet.</p>
              <p className="blog-empty-support">
                The first ones are on their way. Check back soon.
              </p>
            </div>
          ) : (
            <ul className="blog-list" role="list">
              {posts.map((post) => (
                <li key={post.slug} className="blog-card">
                  <article className="blog-card-inner">
                    {post.cover && (
                      <Link
                        to={`/blog/${post.slug}`}
                        className="blog-card-cover"
                        tabIndex={-1}
                        aria-hidden="true"
                      >
                        <img src={post.cover} alt="" loading="lazy" />
                      </Link>
                    )}
                    <div className="blog-card-text">
                      <p className="blog-card-meta">
                        {post.category && (
                          <span className="blog-card-category">{post.category}</span>
                        )}
                        {post.date && (
                          <time dateTime={post.date}>{formatDate(post.date)}</time>
                        )}
                        {post.date && <span aria-hidden="true"> · </span>}
                        <span>{post.readingMinutes} min read</span>
                      </p>
                      <h3 className="blog-card-title">
                        <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>
                      {post.excerpt && (
                        <p className="blog-card-excerpt">{post.excerpt}</p>
                      )}
                      {post.tags.length > 0 && (
                        <ul className="blog-tags" role="list">
                          {post.tags.map((tag) => (
                            <li key={tag} className="blog-tag">
                              {tag}
                            </li>
                          ))}
                        </ul>
                      )}
                      <Link
                        to={`/blog/${post.slug}`}
                        className="blog-card-more"
                        aria-label={`Read ${post.title}`}
                      >
                        Read more
                      </Link>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  )
}

export default Blog
