import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

/** Shared frame for notes and case studies: back link, meta line, title, body. */
export function ArticleShell({ meta, title, byline, back = '/', titleClassName = 'text-balance text-[20px] font-medium leading-snug', children }: { meta: string; title: string; byline?: string; back?: string; titleClassName?: string; children: ReactNode }) {
  return (
    <main className="bg-page">
      <article className="mx-auto max-w-[560px] px-4 pb-40 pt-[160px] max-sm:pt-24">
        <div className="mb-10 flex items-baseline justify-between gap-4 text-muted">
          <Link to={back} viewTransition className="press -mx-1 px-1 transition-colors duration-150 ease-out hover:text-fg">
            ← Back
          </Link>
          <span>{meta}</span>
        </div>
        <h1 className={titleClassName}>{title}</h1>
        {byline && <p className="mt-1 text-muted">{byline}</p>}
        <div className="mt-8">{children}</div>
      </article>
    </main>
  )
}
