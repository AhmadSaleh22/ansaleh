export type Project = {
  name: string
  description: string
  url: string
  status?: string
  /** Add this to show the project as a frame in the Work gallery. */
  frame?: {
    title: string
    stack: string
    /** Screenshot in public/work/. 'start' anchors it to the left, 'end' to the right (for Arabic RTL screens). */
    image?: string
    anchor?: 'start' | 'end'
    /** Built-in drawing instead of an image. */
    diagram?: 'jobcopilot' | 'classifier' | 'planning' | 'matching' | 'structure' | 'revenue'
  }
}

const gh = 'https://github.com/AhmadSaleh22/'

export const projects: Project[] = [
  {
    name: 'TRENDOW',
    description: 'Restaurant operating system for MENA: point of sale, kitchen display, stock and cash drawer, in Arabic and English. Tech lead, team of 3.',
    url: 'https://github.com/AhmedShantti/ros-frontend',
    status: 'In progress',
    frame: { title: 'A restaurant operating system, from order to stock', stack: 'Next.js, TypeScript, Zustand', image: '/work/trendow-home.jpg' },
  },
  {
    name: 'OffBrand',
    description: 'Luxury fashion marketplace with a retail store and a dropshipping platform for merchants, plus checkout, orders and an admin.',
    url: gh + 'full-stack-offbrand',
    frame: { title: 'A luxury fashion store with a dropshipping side', stack: 'Next.js, NestJS, Prisma', image: '/work/offbrand-home.jpg' },
  },
  {
    name: 'Requirements classifier',
    description: 'Classifies software requirements (90.7% FR/NFR with SVM, 74% across 11 NFR types), flags ambiguous wording and drafts a BRD.',
    url: gh + 'ai-model-system-requirements-analysis',
    frame: { title: 'Teaching a model to read software requirements', stack: 'Python, scikit-learn', diagram: 'classifier' },
  },
  {
    name: 'JobCopilot',
    description: 'Event-driven job matching on GCP Pub/Sub and Cloud Run with LLM CV parsing.',
    url: gh + 'job-copilot',
    status: 'In progress',
    frame: { title: 'Job matching as three services talking over Pub/Sub', stack: 'TypeScript, GCP', diagram: 'jobcopilot' },
  },
]
