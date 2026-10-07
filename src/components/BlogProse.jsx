import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// A heading 1 inside a post body would compete with the page title, so it renders as a
// section heading instead.
const markdownComponents = {
  h1: ({ node, ...props }) => <h2 {...props} />, // eslint-disable-line no-unused-vars
}

// Post markdown, rendered the same way in both builds. The Astro blog renders this at
// build time with no client directive, so it ships as plain HTML with no JavaScript.
// Astro passes a component's children as rendered HTML, so Astro pages pass the
// markdown as the `markdown` prop; the old React app passes it as children.
function BlogProse({ markdown, children }) {
  return (
    <div className="blog-prose">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {markdown ?? children}
      </ReactMarkdown>
    </div>
  )
}

export default BlogProse
