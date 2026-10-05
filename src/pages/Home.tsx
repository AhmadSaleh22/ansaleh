import { Bio } from '../components/Bio'
import { Link } from 'react-router-dom'
import { Hero } from '../components/Hero'
import { Help } from '../components/Help'
import { ask } from '../components/Ask'
import { Gallery } from '../components/Gallery'
import { Library } from '../components/Library'
import { NotesList } from '../components/NotesList'
import { ProjectsList } from '../components/ProjectsList'
import { Section } from '../components/Section'
import { notes } from '../lib/content'
import { experience } from '../content/experience'
import { site } from '../content/site'
import { useTitle } from '../lib/useTitle'

export function Home() {
  useTitle()
  return (
    <main className="mx-auto max-w-[640px] px-4 pb-32 pt-16 sm:pt-20">
      <Hero />

      <Section id="about" title="About" tight>
        <Bio />
      </Section>

      <Section id="work" title="Work">
        <Gallery />
      </Section>

      <Section id="experience" title="Experience">
        <ul className="-my-1.5">
          {experience.map((r) => (
            <li key={r.slug}>
              <Link to={`/experience/${r.slug}`} viewTransition className="group grid gap-x-6 py-1.5 sm:grid-cols-[170px_1fr_auto]">
                <span className="transition-colors duration-150 ease-out group-hover:text-muted">{r.company}</span>
                <span className="flex flex-wrap items-baseline gap-x-2 text-muted">
                  <span>{r.role}</span>
                  <span className="whitespace-nowrap text-[12px]">{r.type}</span>
                </span>
                <span className="tabular-nums text-muted">{r.period}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="projects" title="Projects">
        <ProjectsList />
      </Section>

      {notes.length > 0 && (
        <Section id="notes" title="Notes">
          <NotesList />
        </Section>
      )}

      <Section id="library" title="Library">
        <Library />
      </Section>

      <Section id="help" title="How I can help">
        <Help />
      </Section>

      <footer className="mt-24 flex flex-wrap gap-x-5 gap-y-1 text-muted">
        <button type="button" className="link text-fg" onClick={() => ask()}>Work with me</button>
        <a className="link select-all" href={`mailto:${site.email}`}>{site.email}</a>
        <a className="link" href={site.github} target="_blank" rel="noopener noreferrer">GitHub</a>
        <a className="link" href={site.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <span className="ml-auto">{site.place}</span>
      </footer>
    </main>
  )
}
