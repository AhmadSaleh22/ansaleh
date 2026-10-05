import type { IntentId } from '../components/Ask'

export type Offer = {
  title: string
  /** What I'd do, in one or two sentences. */
  body: string
  /** One fact from past work that backs it up. */
  proof: string
  cta: string
  intent: IntentId
}

/** The three ways to work with me. Shown on the home page under "How I can help". */
export const offers: Offer[] = [
  {
    title: 'Join your team',
    body: 'A senior engineer who can own a product area end to end: frontend architecture, APIs, data and the release process, and the juniors around them.',
    proof: 'Led frontend at Syntax for 10 manufacturing plants; led a team of 5 at Eddekhar.',
    cta: 'Discuss a role',
    intent: 'hiring',
  },
  {
    title: 'Build your product',
    body: 'From talking to your users to a shipped first version on React or Next.js, Node.js or Python, and AWS or GCP. I stay through launch and the first fixes.',
    proof: 'Built a payroll ERP for 1,400 employees across 5 companies, from MVP to full release.',
    cta: 'Talk about a project',
    intent: 'project',
  },
  {
    title: 'Make releases boring',
    body: 'If every deploy is a risk, I set up the tests, CI/CD gates, review standards and design system that let a small team ship without breaking things.',
    proof: '4 major releases with zero rollbacks at Syntax; review cycles down 30%.',
    cta: 'Ask about consulting',
    intent: 'consulting',
  },
]
