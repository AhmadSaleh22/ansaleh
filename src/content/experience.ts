export type Role = {
  /** Page address: /experience/<slug> */
  slug: string
  company: string
  role: string
  /** How the role was held. Shown so roles that overlap read correctly. */
  type: 'Full-time' | 'Part-time' | 'Contract' | 'While completing B.Sc.'
  period: string
  location: string
  /** One line on what the company does and where I fit. */
  summary: string
  /** What I did there. Taken from the CV. */
  highlights: string[]
  stack: string
  /** Slug of the matching case study in src/content/work, if there is one. */
  caseStudy?: string
}

/** Newest first. Matches the CV. */
export const experience: Role[] = [
  {
    slug: 'syntax',
    company: 'Syntax',
    role: 'Frontend Lead',
    type: 'Full-time',
    period: 'Apr 2025 – Sep 2026',
    location: 'Remote',
    summary: 'A cloud-based production-planning platform used daily by operators across 10 manufacturing plants. I led the frontend.',
    highlights: [
      'Cut planning time 50% for operators at 10 manufacturing plants by interviewing and observing them, mapping the planning journey end to end and redesigning it.',
      'Turned machine and production-line data into decision views that help managers choose what to produce more of, when, and how to improve products.',
      'Replaced manual reporting with a real-time 3D factory view, with filtering, modals and data tables.',
      'Cut feature delivery time 40% by building a 25+ component design system with the design team, standardizing UI behaviour and WCAG accessibility.',
      'Cut code review cycles 30% by setting frontend architecture and engineering standards adopted by 6 engineers.',
      'Shipped four major releases with zero rollbacks; data-heavy screens load in under 100 ms.',
      'Investigated production issues by reading logs, finding root causes and coordinating fixes, and supported configuration, deployments and post-release checks.',
      'Kept the technical documentation and handed over knowledge for maintenance and operations.',
    ],
    stack: 'React, TypeScript, design systems, WCAG',
    caseStudy: 'syntax',
  },
  {
    slug: 'marham-care',
    company: 'Marham Care',
    role: 'Software Engineer',
    type: 'Part-time',
    period: 'Nov 2024 – Mar 2025',
    location: 'Remote',
    summary: 'A MedTech publishing platform for doctors and clinics, with about 2,000 visitors a month.',
    highlights: [
      'Interviewed doctors and front-desk staff and watched them use the platform, then restructured the site’s information architecture around how they work.',
      'Shipped React and TypeScript frontends for the platform, rendered dynamically on SharePoint Classic.',
      'Cut regression bugs reaching users by adding Jest and SuperTest unit and integration tests as a gate on every release.',
      'Automated CI/CD on Jenkins and Bitbucket with test gates and deployment checks, so a small team can ship safely.',
      'Supported production through monitoring, logging and troubleshooting; incidents were usually resolved within about an hour.',
    ],
    stack: 'React, TypeScript, Jest, SuperTest, Jenkins, Bitbucket',
    caseStudy: 'marham',
  },
  {
    slug: 'g-gateway',
    company: 'G-Gateway',
    role: 'Full Stack Developer',
    type: 'Contract',
    period: 'Jun – Oct 2024',
    location: 'Remote',
    summary: 'A project-based contract building real-time job matching for candidates.',
    highlights: [
      'Owned the real-time job-matching feature end to end with the PM and designer, from API contract to UX, including multi-location filtering.',
      'Delivered match feedback in under a second with event-driven services in Node.js and Python on GCP Pub/Sub and Cloud Run, and an Angular and RxJS client.',
      'Kept the candidate journey consistent and accessible with a reusable Angular component library built on Tailwind and Angular CDK.',
      'Ran more than 15 production schema migrations with Prisma, rolled out in a controlled way to protect existing data.',
      'Investigated issues across services, APIs, databases and asynchronous messaging, and documented requirements and release decisions with the team.',
    ],
    stack: 'Node.js, Python, Angular, RxJS, GCP Pub/Sub, Cloud Run, Prisma',
    caseStudy: 'g-gateway',
  },
  {
    slug: 'eddekhar',
    company: 'Eddekhar',
    role: 'Full Stack Mobile Engineer',
    type: 'Full-time',
    period: 'Mar 2023 – May 2024',
    location: 'Remote, team in Saudi Arabia',
    summary: 'An employee savings and rewards company in Saudi Arabia. We built its in-house ERP for payroll, finance and treasury.',
    highlights: [
      'Interviewed finance teams, client HR, management and employees from MVP to full release to map payroll journeys and design the workflows around them.',
      'Built the in-house ERP for payroll, finance and treasury, paying salaries for 1,400 employees across 5 companies, leading a team of 5 engineers.',
      'Shipped the cross-platform mobile app with React Native and Expo.',
      'Designed the REST APIs and the Neo4j data model linking employees, organizations and payroll records, cutting report turnaround from a week to a day with caching and pagination.',
      'Fed roadmap prioritization with analytics and funnel telemetry that showed where users dropped off.',
      'Ran production on AWS and GCP: user roles and permissions, SSL/TLS certificates, DNS, automated backups, recovery and disaster-recovery procedures.',
      'Managed production database migrations and schema changes while keeping data intact and available.',
    ],
    stack: 'React, Next.js, React Native, Expo, Neo4j, REST, AWS, GCP',
    caseStudy: 'eddekhar',
  },
  {
    slug: 'al-baab',
    company: 'Al-Baab',
    role: 'Full Stack Engineer',
    type: 'While completing B.Sc.',
    period: 'Sep 2022 – Feb 2023',
    location: 'Remote, team in Saudi Arabia',
    summary: 'Enterprise applications serving thousands of concurrent users.',
    highlights: [
      'Turned dense graph data into views non-technical users could act on by optimizing Neo4j models and Cypher queries for real-time updates.',
      'Set up CI/CD and code review practices that cut deployment cycles by 50% while keeping 99.9% uptime.',
      'Coached junior engineers on scoping MVPs, writing testable code and explaining trade-offs to non-technical stakeholders, while shipping and reviewing production code.',
      'Investigated performance and production issues and fixed them at the database, application and infrastructure level.',
    ],
    stack: 'Neo4j, Cypher, Node.js, CI/CD',
  },
  {
    slug: 'easy-sales-ai',
    company: 'Easy-Sales AI',
    role: 'Software Engineer',
    type: 'While completing B.Sc.',
    period: 'Feb 2021 – Aug 2022',
    location: 'Remote, team in Canada',
    summary: 'A sales SaaS that predicts which opportunities account managers should work on first.',
    highlights: [
      'Grew sales by $300K (+200%) within two months by researching why active users weren’t buying (pricing, timing, low purchase intent) and redesigning the purchase journey around the findings.',
      'Shipped the fixes end to end: time-limited offers, pricing and free-trial changes, simpler onboarding, behaviour analytics and reminder notifications.',
      'Built a machine-learning inference service on AWS Lambda and SageMaker, and the React prioritization UI that account managers used daily, on a platform with 6,000 monthly visitors.',
      'Wrote Python and Bash automation for infrastructure setup, cutting manual work.',
    ],
    stack: 'React, Python, AWS Lambda, SageMaker, Bash',
    caseStudy: 'easy-sales',
  },
]
