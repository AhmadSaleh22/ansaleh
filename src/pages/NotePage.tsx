import { Navigate, useParams } from 'react-router-dom'
import { ArticleShell } from '../components/ArticleShell'
import { Prose } from '../components/Prose'
import { formatDate, notes } from '../lib/content'
import { useTitle } from '../lib/useTitle'

export function NotePage() {
  const { slug } = useParams()
  const note = notes.find((n) => n.slug === slug)
  useTitle(note?.title)
  if (!note) return <Navigate to="/404" replace />
  return (
    <ArticleShell meta={`Note #${note.number} · ${formatDate(note.date)}`} title={note.title} titleClassName="hand-title">
      <div className="hand-page">
        <Prose>{note.body}</Prose>
      </div>
    </ArticleShell>
  )
}
