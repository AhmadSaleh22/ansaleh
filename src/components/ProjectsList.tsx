import { projects } from '../content/projects'
import { Diagram } from './Diagrams'

const host = (url: string) => (url.includes('github.com') ? 'GitHub' : new URL(url).hostname.replace(/^www\./, ''))

export function ProjectsList() {
  return (
    <ul className="project-list">
      {projects.map((p) => {
        const live = p.status?.toLowerCase() === 'in progress'
        return (
          <li key={p.name}>
            <a href={p.url} target="_blank" rel="noopener noreferrer" className="project-row">
              <span className="project-thumb" aria-hidden>
                {p.frame?.image ? (
                  <img src={p.frame.image} alt="" loading="lazy" className="h-full w-full object-cover object-top" />
                ) : p.frame?.diagram ? (
                  <span className="project-diagram">
                    <Diagram name={p.frame.diagram} />
                  </span>
                ) : null}
              </span>

              <span className="project-main">
                <span className="project-head">
                  <span className="project-name">{p.name}</span>
                  {p.status && (
                    <span className="project-status">
                      {live && <span className="status-dot" data-live aria-hidden />}
                      {p.status}
                    </span>
                  )}
                </span>
                <span className="project-desc">{p.description}</span>
                <span className="project-meta">
                  {p.frame?.stack && <span>{p.frame.stack}</span>}
                  {p.frame?.stack && <span aria-hidden>·</span>}
                  <span className="project-host">
                    {host(p.url)}
                    <svg viewBox="0 0 16 16" aria-hidden>
                      <path d="M5 11L11 5M6 5h5v5" />
                    </svg>
                  </span>
                </span>
              </span>
            </a>
          </li>
        )
      })}
    </ul>
  )
}
