import type { ReactNode } from 'react'

export function Section({ id, title, children, tight = false }: { id: string; title: string; children: ReactNode; tight?: boolean }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`${tight ? 'mt-14' : 'mt-24'} scroll-mt-16`}>
      <h2 id={`${id}-title`} className="mb-4 text-muted">
        {title}
      </h2>
      {children}
    </section>
  )
}
