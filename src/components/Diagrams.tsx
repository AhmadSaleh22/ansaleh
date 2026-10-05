// Drawings for project frames, in the site's own type and colours.

/** From the job-copilot repository: three services connected by two Pub/Sub topics. */
export function JobCopilotDiagram() {
  const box = (x: number, title: string, lines: string[]) => (
    <g transform={`translate(${x} 150)`}>
      <rect width="176" height="104" rx="10" className="dg-box" />
      <text x="16" y="32" className="dg-title">{title}</text>
      {lines.map((l, i) => (
        <text key={l} x="16" y={60 + i * 22} className="dg-text">{l}</text>
      ))}
    </g>
  )
  const topic = (cx: number, name: string) => (
    <g transform={`translate(${cx - 56} 92)`}>
      <rect width="112" height="28" rx="14" className="dg-topic" />
      <text x="56" y="19" textAnchor="middle" className="dg-topic-text">{name}</text>
    </g>
  )
  return (
    <svg viewBox="0 0 600 375" className="diagram" role="img" aria-label="A CV upload goes to profile-manager, which publishes cv-uploaded. job-fetcher matches jobs from RemoteOK and publishes job-matched. job-notifier writes a cover letter and sends an email.">
      <defs>
        <marker id="dg-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0L10 5L0 10z" className="dg-arrowhead" />
        </marker>
      </defs>
      {box(12, 'profile-manager', ['CV upload', 'LLM reads preferences'])}
      {box(212, 'job-fetcher', ['Jobs from RemoteOK', 'Scores and matches'])}
      {box(412, 'job-notifier', ['LLM cover letter', 'Email summary'])}
      {topic(200, 'cv-uploaded')}
      {topic(400, 'job-matched')}
      <path d="M200 120 V196" className="dg-dash" />
      <path d="M400 120 V196" className="dg-dash" />
      <path d="M190 202 H206" className="dg-line" markerEnd="url(#dg-arrow)" />
      <path d="M390 202 H406" className="dg-line" markerEnd="url(#dg-arrow)" />
      <text x="12" y="300" className="dg-caption">GCP Pub/Sub and Cloud Run, PostgreSQL with Prisma, Terraform</text>
    </svg>
  )
}

/** Accuracy from the classifier repository's results. */
const accuracy = [
  { model: 'SVM', value: 90.7 },
  { model: 'Naive Bayes', value: 87.1 },
  { model: 'Logistic regression', value: 86.6 },
  { model: 'Random forest', value: 82.0 },
]

export function ClassifierChart() {
  const x0 = 170
  const width = 400
  const w = (v: number) => (v / 100) * width
  return (
    <svg viewBox="0 0 600 375" className="diagram" role="img" aria-label="Functional versus non-functional accuracy: SVM 90.7%, Naive Bayes 87.1%, logistic regression 86.6%, random forest 82.0%. Across 11 non-functional types the SVM reaches 74%.">
      <text x="24" y="92" className="dg-title">Functional or non-functional, accuracy by model</text>
      {accuracy.map((d, i) => {
        const y = 120 + i * 40
        const best = i === 0
        return (
          <g key={d.model}>
            <text x={x0 - 14} y={y + 18} textAnchor="end" className={best ? 'dg-text dg-strong' : 'dg-text'}>{d.model}</text>
            <rect x={x0} y={y} width={width} height="26" rx="4" className="dg-track" />
            <rect x={x0} y={y} width={w(d.value)} height="26" rx="4" className={best ? 'dg-bar dg-bar--best' : 'dg-bar'} />
            <text x={x0 + w(d.value) - 10} y={y + 18} textAnchor="end" className={best ? 'dg-value dg-value--best' : 'dg-value'}>{d.value.toFixed(1)}%</text>
          </g>
        )
      })}
      <text x="24" y="318" className="dg-caption">Across 11 non-functional types the SVM reaches 74%.</text>
    </svg>
  )
}

import { PlanningDrawing, MatchingDrawing, StructureDrawing, RevenueDrawing } from './AnimatedDiagrams'

export type DiagramName = 'jobcopilot' | 'classifier' | 'planning' | 'matching' | 'structure' | 'revenue'

export function Diagram({ name }: { name: DiagramName }) {
  switch (name) {
    case 'jobcopilot': return <JobCopilotDiagram />
    case 'classifier': return <ClassifierChart />
    case 'planning': return <PlanningDrawing />
    case 'matching': return <MatchingDrawing />
    case 'structure': return <StructureDrawing />
    case 'revenue': return <RevenueDrawing />
  }
}
