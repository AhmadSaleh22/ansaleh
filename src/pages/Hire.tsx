import { ArticleShell } from '../components/ArticleShell'
import { ask } from '../components/Ask'
import { offers } from '../content/help'
import { site } from '../content/site'
import { useTitle } from '../lib/useTitle'

export const hireTitle = 'Hire a senior software engineer or consultant'

export function Hire() {
  useTitle(hireTitle)
  return (
    <ArticleShell meta="Hire" title={hireTitle} titleClassName="text-balance text-[20px] font-medium leading-snug">
      <p>
        I’m Ahmad Saleh, a senior software engineer in Cairo (UTC+3) with 5+ years building production web platforms in React, TypeScript, Node.js and Python on AWS and GCP.
        I’m open to full-time roles, remote or with relocation, and to consulting engagements.
      </p>

      <h2 className="mt-10 font-medium">Ways to work together</h2>
      <ul className="help-list mt-4">
        {offers.map((o) => (
          <li key={o.title} className="help-item">
            <h3 className="font-medium">{o.title}</h3>
            <p className="pt-1">{o.body}</p>
            <p className="pt-2 text-[13px] text-muted">{o.proof}</p>
            <button type="button" className="link mt-3 text-[13px] text-fg" onClick={() => ask({ intent: o.intent, topic: o.title })}>
              {o.cta} →
            </button>
          </li>
        ))}
      </ul>

      <h2 className="mt-10 font-medium">What I’m strongest at</h2>
      <ul className="mt-3 list-disc space-y-1 pl-5">
        <li>React, Next.js and TypeScript frontends, with Three.js for real-time 3D</li>
        <li>3D industrial visualization: a live plant-floor view for 10 manufacturing plants</li>
        <li>Node.js, NestJS and Python APIs; PostgreSQL, MongoDB and Neo4j</li>
        <li>AWS and GCP, event-driven systems, CI/CD and release quality</li>
        <li>Discovery with real users before building, which is how I added $300K in two months at Easy-Sales AI</li>
      </ul>

      <h2 className="mt-10 font-medium">Proof</h2>
      <ul className="mt-3 list-disc space-y-1 pl-5">
        <li>Planning time cut by 50% across 10 plants at Syntax</li>
        <li>A payroll ERP paying 1,400 employees across 5 companies at Eddekhar</li>
        <li>4 major releases with zero rollbacks; review cycles down 30%</li>
      </ul>

      <div className="mt-10 flex flex-wrap gap-x-5 gap-y-1">
        <button type="button" className="link text-fg" onClick={() => ask()}>Work with me</button>
        {site.booking && <a className="link" href={site.booking} target="_blank" rel="noopener noreferrer">Book a call</a>}
        <a className="link select-all" href={`mailto:${site.email}`}>{site.email}</a>
        <a className="link" href={site.cv}>CV (PDF)</a>
      </div>
    </ArticleShell>
  )
}
