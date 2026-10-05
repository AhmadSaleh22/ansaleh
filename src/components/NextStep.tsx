import { ask } from './Ask'
import { ctas, defaultCta } from '../content/ctas'
import { site } from '../content/site'
import { track } from '../lib/track'

/** Closing block for a case study or experience page: one question, two ways to answer it. */
export function NextStep({ slug, topic }: { slug: string; topic: string }) {
  return (
    <aside className="next-step" aria-label="Work with Ahmad">
      <p className="font-medium">{ctas[slug] ?? defaultCta}</p>
      <p className="mt-1 text-muted">I take on projects and consulting, and I’m open to remote roles and relocation.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className="btn btn--primary press" onClick={() => ask({ topic, intent: 'project' })}>
          Talk about a project
        </button>
        <button type="button" className="btn press" onClick={() => ask({ topic, intent: 'hiring' })}>
          Discuss a role
        </button>
        {site.booking && (
          <a href={site.booking} target="_blank" rel="noopener noreferrer" className="btn press" onClick={() => track('booking-click')}>
            Book a call
          </a>
        )}
      </div>
    </aside>
  )
}
