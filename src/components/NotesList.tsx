import { Link } from 'react-router-dom'
import { notes, formatDate } from '../lib/content'

/** Rough reading time at about 220 words a minute. */
function readingTime(body: string) {
  const words = body.replace(/[#*_>`!\[\]()-]/g, ' ').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 220))
}

export function NotesList() {
  return (
    <ol className="note-list">
      {notes.map((n) => (
        <li key={n.slug}>
          <Link to={`/notes/${n.slug}`} viewTransition className="note-row">
            <span className="note-num tabular-nums" aria-hidden>
              {String(n.number).padStart(2, '0')}
            </span>
            <span className="note-main">
              <span className="note-title">{n.title}</span>
              {n.summary && <span className="note-summary">{n.summary}</span>}
              <span className="note-meta">
                <time dateTime={n.date}>{formatDate(n.date, 'short')}</time>
                <span aria-hidden>·</span>
                <span>{readingTime(n.body)} min read</span>
              </span>
            </span>
            <svg className="note-arrow" viewBox="0 0 16 16" aria-hidden>
              <path d="M5 11L11 5M6 5h5v5" />
            </svg>
          </Link>
        </li>
      ))}
    </ol>
  )
}
