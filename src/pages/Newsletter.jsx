import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listPosts, formatPublishedDate } from '../lib/ghost'
import SubscribeForm from '../components/SubscribeForm'
import './Newsletter.css'

function Newsletter() {
  const [posts, setPosts] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let cancelled = false

    listPosts()
      .then((data) => {
        if (cancelled) return
        setPosts(data)
        setStatus('ready')
      })
      .catch(() => {
        if (cancelled) return
        setStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="newsletter">
      <section className="page-hero" aria-labelledby="newsletter-heading">
        <div className="page-hero-content">
          <h1 id="newsletter-heading">Newsletter</h1>
          <p className="page-hero-description">
            Occasional writing from the Understory Collaborative team on
            technology, strategy, and the work we care about.
          </p>
        </div>
      </section>

      <section className="newsletter-subscribe-top" aria-label="Subscribe">
        <div className="section-container">
          <SubscribeForm
            heading="Subscribe to get new posts by email"
            description="No spam. Unsubscribe anytime."
          />
        </div>
      </section>

      <section className="newsletter-posts" aria-labelledby="posts-heading">
        <div className="section-container">
          <h2 id="posts-heading" className="sr-only">Recent posts</h2>

          {status === 'loading' && (
            <p className="newsletter-status">Loading posts…</p>
          )}

          {status === 'error' && (
            <p className="newsletter-status newsletter-status--error">
              We couldn't load posts right now. Please try again shortly.
            </p>
          )}

          {status === 'ready' && posts.length === 0 && (
            <p className="newsletter-status">
              No posts yet. Subscribe above to get the first one.
            </p>
          )}

          {status === 'ready' && posts.length > 0 && (
            <ul className="newsletter-list" role="list">
              {posts.map((post) => (
                <li key={post.id} className="newsletter-card">
                  <Link to={`/newsletter/${post.slug}`} className="newsletter-card__link">
                    {post.feature_image && (
                      <img
                        src={post.feature_image}
                        alt={post.feature_image_alt || ''}
                        className="newsletter-card__image"
                        loading="lazy"
                      />
                    )}
                    <div className="newsletter-card__body">
                      <p className="newsletter-card__meta">
                        <time dateTime={post.published_at}>
                          {formatPublishedDate(post.published_at)}
                        </time>
                        {post.reading_time ? (
                          <>
                            <span aria-hidden="true"> · </span>
                            <span>{post.reading_time} min read</span>
                          </>
                        ) : null}
                      </p>
                      <h3 className="newsletter-card__title">{post.title}</h3>
                      {post.excerpt && (
                        <p className="newsletter-card__excerpt">{post.excerpt}</p>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  )
}

export default Newsletter
