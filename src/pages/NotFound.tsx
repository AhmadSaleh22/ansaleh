import { ArticleShell } from '../components/ArticleShell'
import { useTitle } from '../lib/useTitle'

export function NotFound() {
  useTitle('Not found')
  return (
    <ArticleShell meta="404" title="Nothing here">
      <p className="text-muted">That page doesn’t exist.</p>
    </ArticleShell>
  )
}
