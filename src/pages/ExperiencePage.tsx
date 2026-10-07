import { Link, Navigate, useParams } from 'react-router-dom'
import { ArticleShell } from '../components/ArticleShell'
import { experience } from '../content/experience'
import { work } from '../lib/content'
import { useTitle } from '../lib/useTitle'
import { NextStep } from '../components/NextStep'

export function ExperiencePage() {
  const { slug } = useParams()
  const index = experience.findIndex((r) => r.slug === slug)
  const role = experience[index]
  useTitle(role ? `${role.company} · ${role.role}` : undefined)
  if (!role) return <Navigate to="/404" replace />

  const story = role.caseStudy ? work.find((w) => w.slug === role.caseStudy) : undefined
  const next = experience[index + 1]

  return (
    <ArticleShell meta={role.period} title={role.company} byline={`${role.role} · ${role.type} · ${role.location}`} back="/#experience">
      <div className="prose">
        <p>{role.summary}</p>
        {/* When the role's case study has a video, it plays here too, with the case study's cover as its poster. */}
        {story?.video && (
          <figure className="prose-figure">
            <video
              src={story.video}
              poster={story.cover}
              aria-label={`${role.company} product video`}
              muted
              loop
              playsInline
              controls
              preload="metadata"
            />
          </figure>
        )}
        <h2>What I did</h2>
        <ul>
          {role.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
        <h3>Built with</h3>
        <p>{role.stack}</p>
      </div>

      {story && (
        <Link to={`/work/${story.slug}`} viewTransition className="group mt-10 block rounded-xl bg-ground p-4">
          <span className="block text-muted">Case study</span>
          <span className="block transition-colors duration-150 ease-out group-hover:text-muted">{story.title}</span>
        </Link>
      )}

      <NextStep slug={role.slug} topic={`${role.role} at ${role.company}`} />

      {next && (
        <nav className="mt-16 flex items-baseline justify-between gap-4 border-t border-line pt-4 text-muted" aria-label="Next role">
          <span>Before that</span>
          <Link to={`/experience/${next.slug}`} viewTransition className="text-fg transition-colors duration-150 ease-out hover:text-muted">
            {next.company} →
          </Link>
        </nav>
      )}
    </ArticleShell>
  )
}
