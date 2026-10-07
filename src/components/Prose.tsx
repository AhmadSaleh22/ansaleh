import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const isVideo = (src?: string) => !!src && /\.(mp4|webm)(\?.*)?$/i.test(src)

/** Markdown with the site's rules: ## accent title, ### grey label, media breaking out to 880px. */
export function Prose({ children }: { children: string }) {
  return (
    <div className="prose">
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          // A paragraph holding only an image becomes a figure, so <figure> is never nested in <p>.
          p({ node, children, ...rest }) {
            const only = node?.children.length === 1 ? node.children[0] : undefined
            if (only && only.type === 'element' && only.tagName === 'img') return <>{children}</>
            return <p {...rest}>{children}</p>
          },
          img({ src, alt, title }) {
            return (
              <figure className="prose-figure">
                {isVideo(src) ? (
                  <video src={src} poster={title} aria-label={alt} muted loop playsInline controls preload="metadata" />
                ) : (
                  <img src={src} alt={alt ?? ''} loading="lazy" decoding="async" />
                )}
                {alt ? <figcaption>{alt}</figcaption> : null}
              </figure>
            )
          },
          a({ href, children }) {
            const external = href?.startsWith('http')
            return (
              <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                {children}
              </a>
            )
          },
        }}
      >
        {children}
      </Markdown>
    </div>
  )
}
