import { Link, useParams } from 'react-router-dom'
import PageMeta from '../components/PageMeta'
import { getAuthorBySlug, findAuthor } from '../data/authors'
import { getPublishedPosts, formatDate } from '../lib/posts'
import './AuthorProfile.css'

// An author's profile, linked from the byline on each of their posts. Lists the
// author's published posts under the bio.
function AuthorProfile() {
  const { slug } = useParams()
  const author = getAuthorBySlug(slug)

  if (!author) {
    return (
      <div className="author-profile">
        <PageMeta title="Profile not found" noindex />
        <section className="page-hero">
          <div className="page-hero-content">
            <h1>Profile not found</h1>
            <p className="page-hero-description">
              We couldn&rsquo;t find that person. They may not have a profile yet.
            </p>
          </div>
        </section>
        <section className="section-container author-profile-backrow">
          <Link to="/about" className="author-profile-back">
            &larr; Back to About
          </Link>
        </section>
      </div>
    )
  }

  const posts = getPublishedPosts().filter(
    (post) => findAuthor(post.author)?.slug === author.slug,
  )

  return (
    <div className="author-profile">
      <PageMeta
        title={author.name}
        description={author.bio[0] || `${author.name} at Understory Collaborative.`}
        noindex={author.draft}
      />

      <header className="page-hero" aria-labelledby="author-heading">
        <div className="page-hero-content author-profile-hero">
          <img
            className="author-profile-photo"
            src={author.photo}
            alt={author.photoAlt}
            width="720"
            height="960"
          />
          <div>
            {author.draft && (
              <p className="author-profile-draft-flag" role="status">
                Draft profile, not indexed
              </p>
            )}
            <h1 id="author-heading">{author.name}</h1>
            {author.role && <p className="page-hero-description">{author.role}</p>}
          </div>
        </div>
      </header>

      <section className="author-profile-body" aria-labelledby="author-bio-heading">
        <div className="author-profile-column">
          <h2 id="author-bio-heading">About {author.name}</h2>
          {author.bio.length > 0 ? (
            author.bio.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
          ) : (
            <p className="author-profile-placeholder">Bio coming soon.</p>
          )}

          {posts.length > 0 && (
            <>
              <h2 id="author-posts-heading">Posts by {author.name}</h2>
              <ul className="author-profile-posts" role="list" aria-labelledby="author-posts-heading">
                {posts.map((post) => (
                  <li key={post.slug}>
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                    {post.date && (
                      <time dateTime={post.date}>{formatDate(post.date)}</time>
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>

      <section className="section-container author-profile-backrow">
        <Link to="/blog" className="author-profile-back">
          &larr; Back to the blog
        </Link>
      </section>
    </div>
  )
}

export default AuthorProfile
