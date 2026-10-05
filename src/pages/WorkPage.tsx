import { Navigate, useParams } from 'react-router-dom'
import { ArticleShell } from '../components/ArticleShell'
import { Prose } from '../components/Prose'
import { work } from '../lib/content'
import { useTitle } from '../lib/useTitle'
import { Diagram } from '../components/Diagrams'
import { NextStep } from '../components/NextStep'

export function WorkPage() {
  const { slug } = useParams()
  const index = work.findIndex((w) => w.slug === slug)
  const item = work[index]
  useTitle(item?.title)
  if (!item) return <Navigate to="/404" replace />
  const media = item.video ? `![](${item.video})` : item.cover ? `![](${item.cover})` : ''
  return (
    <ArticleShell
      meta={`Case study #${index + 1} · ${item.period}`}
      title={item.title}
      byline={`${item.company} · ${item.role}`}
    >
      {!media && item.diagram && (
        <figure className="prose-figure">
          <div className="aspect-[16/10] rounded-xl bg-ground">
            <Diagram name={item.diagram} />
          </div>
        </figure>
      )}
      <Prose>{`${media}\n\n${item.body}`}</Prose>
      <NextStep slug={item.slug} topic={item.title} />
    </ArticleShell>
  )
}
