import { Link } from 'react-router-dom'
import { experience } from '../content/experience'

export function ExperienceList() {
  return (
    <ol className="xp-list">
      {experience.map((r) => {
        const current = /now|present/i.test(r.period)
        return (
          <li key={r.slug} className="xp-item" data-current={current || undefined}>
            <span className="xp-rail" aria-hidden>
              <span className="status-dot" data-live={current || undefined} />
            </span>
            <Link to={`/experience/${r.slug}`} viewTransition className="xp-row">
              <span className="xp-head">
                <span className="xp-company">{r.company}</span>
                <span className="xp-period tabular-nums">{r.period}</span>
              </span>
              <span className="xp-role">
                {r.role}
                <span aria-hidden> · </span>
                {r.type}
              </span>
              <span className="xp-headline">{r.headline}</span>
              <svg className="xp-arrow" viewBox="0 0 16 16" aria-hidden>
                <path d="M6 4l4 4-4 4" />
              </svg>
            </Link>
          </li>
        )
      })}
    </ol>
  )
}
