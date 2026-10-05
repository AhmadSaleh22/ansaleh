import { Link, Navigate, useParams } from 'react-router-dom'
import { ArticleShell } from '../components/ArticleShell'
import { StickyNotes } from '../components/StickyNotes'
import { books } from '../lib/content'
import { useTitle } from '../lib/useTitle'

export function BookPage() {
  const { slug } = useParams()
  const index = books.findIndex((b) => b.slug === slug)
  const book = books[index]
  useTitle(book?.title)
  if (!book) return <Navigate to="/404" replace />
  const next = books[index + 1]

  return (
    <ArticleShell meta={book.status ? `Library · ${book.status}` : 'Library'} title={book.title} byline={book.author} back="/#library">
      {book.cover && (
        <img
          src={book.cover}
          alt={`Cover of ${book.title}`}
          className="mb-10 w-[132px] rounded-[3px] outline outline-1 -outline-offset-1 outline-line"
        />
      )}

      {book.body ? (
        <StickyNotes markdown={book.body} />
      ) : (
        <p className="text-muted">I haven’t written up my notes on this one yet.</p>
      )}

      {next && (
        <nav className="mt-16 flex items-baseline justify-between gap-4 border-t border-line pt-4 text-muted" aria-label="Next book">
          <span>Next on the shelf</span>
          <Link to={`/library/${next.slug}`} viewTransition className="text-fg transition-colors duration-150 ease-out hover:text-muted">
            {next.title} →
          </Link>
        </nav>
      )}
    </ArticleShell>
  )
}
