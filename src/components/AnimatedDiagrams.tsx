// Looping drawings for case studies without screenshots. Each one draws what the case study is about.
import { useLoop, seg, ease, outro } from '../lib/useLoop'

const W = 600
const H = 375

/** A path that draws itself as p goes 0 → 1. */
function Draw({ d, p, className = 'dg-line' }: { d: string; p: number; className?: string }) {
  return <path d={d} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} className={className} />
}

/* ---------- Syntax: production planning ---------- */

const lines = [
  [[0, 3], [3.5, 4], [8, 3]],
  [[1, 5], [6.5, 3.5]],
  [[0, 2], [2.5, 3], [6, 5]],
  [[2, 4], [7, 4]],
] as const

export function PlanningDrawing() {
  const [ref, t] = useLoop(9000)
  const x0 = 120
  const span = 440
  const cw = span / 12
  let k = 0
  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="diagram" role="img" aria-label="Production lines being scheduled on a planning board, then planning time shown falling by half.">
      <g opacity={outro(t)}>
        {Array.from({ length: 13 }, (_, i) => (
          <line key={i} x1={x0 + i * cw} x2={x0 + i * cw} y1={58} y2={232} className="dg-grid" />
        ))}
        {lines.map((bars, r) => {
          const y = 66 + r * 42
          return (
            <g key={r}>
              <text x={40} y={y + 18} className="dg-text">Line {r + 1}</text>
              {bars.map(([s, len]) => {
                const p = ease(seg(t, 0.04 + k * 0.035, 0.16 + k++ * 0.035))
                return <rect key={s} x={x0 + s * cw + 2} y={y} width={Math.max(0, len * cw * p - 4)} height={26} rx={5} className="dg-bar" />
              })}
            </g>
          )
        })}
        <line
          x1={x0 + span * ease(seg(t, 0.08, 0.5))}
          x2={x0 + span * ease(seg(t, 0.08, 0.5))}
          y1={52}
          y2={238}
          className="dg-playhead"
          opacity={seg(t, 0.08, 0.12) * (1 - seg(t, 0.5, 0.56))}
        />
        <text x={40} y={292} className="dg-text">Before</text>
        <rect x={x0} y={278} width={span * ease(seg(t, 0.5, 0.62))} height={20} rx={4} className="dg-bar" />
        <text x={40} y={330} className="dg-text dg-strong">Now</text>
        <rect x={x0} y={316} width={(span / 2) * ease(seg(t, 0.62, 0.74))} height={20} rx={4} className="dg-bar--best" />
        <text x={x0 + span / 2 + 14} y={331} className="dg-title dg-accent" opacity={seg(t, 0.72, 0.78)}>
          −50% planning time
        </text>
      </g>
    </svg>
  )
}

/* ---------- G-Gateway: real-time job matching ---------- */

const jobs = [70, 128, 186, 244, 302]
const matched = new Set([0, 2, 3])

export function MatchingDrawing() {
  const [ref, t] = useLoop(8000)
  const cv = { x: 92, y: 186 }
  const hub = { x: 262, y: 186 }
  const jx = 420
  const toHub = ease(seg(t, 0.06, 0.2))
  const fan = ease(seg(t, 0.24, 0.42))
  const lit = seg(t, 0.44, 0.52)
  const clock = ease(seg(t, 0.06, 0.52))
  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="diagram" role="img" aria-label="A CV is sent through Pub/Sub to several jobs in different locations; three of them light up as matches in under a second.">
      <g opacity={outro(t)}>
        <rect x={cv.x - 44} y={cv.y - 30} width={88} height={60} rx={10} className="dg-box" />
        <text x={cv.x} y={cv.y - 4} textAnchor="middle" className="dg-title">Candidate</text>
        <text x={cv.x} y={cv.y + 16} textAnchor="middle" className="dg-text">preferences</text>

        <Draw d={`M${cv.x + 44} ${cv.y} H${hub.x - 46}`} p={toHub} />
        <rect x={hub.x - 46} y={hub.y - 17} width={92} height={34} rx={17} className="dg-topic" />
        <text x={hub.x} y={hub.y + 5} textAnchor="middle" className="dg-topic-text">Pub/Sub</text>
        {toHub > 0 && toHub < 1 && <circle cx={cv.x + 44 + (hub.x - 46 - cv.x - 44) * toHub} cy={cv.y} r={4} className="dg-dot" />}

        {jobs.map((y, i) => {
          const d = `M${hub.x + 46} ${hub.y} C ${hub.x + 100} ${hub.y}, ${jx - 60} ${y + 22}, ${jx} ${y + 22}`
          const on = matched.has(i)
          return (
            <g key={y} opacity={on ? 1 : 1 - 0.55 * lit}>
              <Draw d={d} p={fan} className={on && lit > 0 ? 'dg-line dg-line--accent' : 'dg-line'} />
              <rect x={jx} y={y} width={150} height={44} rx={8} className={on && lit > 0 ? 'dg-box dg-box--accent' : 'dg-box'} />
              <circle cx={jx + 18} cy={y + 17} r={4} className={on && lit > 0 ? 'dg-pin dg-pin--accent' : 'dg-pin'} />
              <rect x={jx + 30} y={y + 12} width={70} height={8} rx={4} className="dg-skel" />
              <rect x={jx + 30} y={y + 26} width={46} height={6} rx={3} className="dg-skel" />
              {on && (
                <path d={`M${jx + 124} ${y + 22} l5 5 l10 -11`} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - lit} className="dg-check" />
              )}
            </g>
          )
        })}

        <line x1={48} x2={248} y1={322} y2={322} className="dg-track-line" />
        <line x1={48} x2={48 + 200 * 0.8 * clock} y1={322} y2={322} className="dg-progress" />
        <text x={48} y={346} className="dg-caption">0 s</text>
        <text x={248} y={346} textAnchor="end" className="dg-caption">1 s</text>
        <text x={48} y={300} className="dg-title dg-accent" opacity={seg(t, 0.5, 0.56)}>Matched in under a second</text>
      </g>
    </svg>
  )
}

/* ---------- Marham: information architecture and release gates ---------- */

type Card = { from: [number, number, number]; to: [number, number] }
const cards: Card[] = [
  { from: [70, 60, -8], to: [300, 64] },
  { from: [470, 92, 6], to: [150, 140] },
  { from: [230, 210, -4], to: [300, 140] },
  { from: [520, 230, 9], to: [450, 140] },
  { from: [110, 200, 7], to: [100, 216] },
  { from: [360, 40, -6], to: [200, 216] },
  { from: [300, 250, 5], to: [400, 216] },
  { from: [180, 110, -10], to: [500, 216] },
]
const edges: [number, number][] = [[0, 1], [0, 2], [0, 3], [1, 4], [1, 5], [3, 6], [3, 7]]
const gates = ['Jest', 'SuperTest', 'Release']

export function StructureDrawing() {
  const [ref, t] = useLoop(9000)
  const move = ease(seg(t, 0.12, 0.38))
  const link = ease(seg(t, 0.38, 0.54))
  const pos = (c: Card) => {
    const [fx, fy, rot] = c.from
    return { x: fx + (c.to[0] - fx) * move, y: fy + (c.to[1] - fy) * move, r: rot * (1 - move) }
  }
  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="diagram" role="img" aria-label="Scattered pages move into a clear site structure, then every release passes Jest and SuperTest before going out.">
      <g opacity={outro(t)}>
        {edges.map(([a, b]) => {
          const A = cards[a].to
          const B = cards[b].to
          const midY = (A[1] + 15 + B[1] - 15) / 2
          return <Draw key={`${a}-${b}`} d={`M${A[0]} ${A[1] + 15} V${midY} H${B[0]} V${B[1] - 15}`} p={link} />
        })}
        {cards.map((c, i) => {
          const { x, y, r } = pos(c)
          const root = i === 0
          return (
            <g key={i} transform={`translate(${x} ${y}) rotate(${r})`} opacity={0.5 + 0.5 * seg(t, 0, 0.1)}>
              <rect x={-38} y={-15} width={76} height={30} rx={6} className={root ? 'dg-box dg-box--accent' : 'dg-box'} />
              <rect x={-26} y={-5} width={root ? 52 : 40} height={6} rx={3} className={root ? 'dg-skel dg-skel--accent' : 'dg-skel'} />
              <rect x={-26} y={5} width={root ? 30 : 26} height={4} rx={2} className="dg-skel" />
            </g>
          )
        })}
        {gates.map((g, i) => {
          const x = 150 + i * 150
          const p = seg(t, 0.58 + i * 0.07, 0.66 + i * 0.07)
          return (
            <g key={g}>
              {i > 0 && <Draw d={`M${x - 150 + 62} 312 H${x - 62}`} p={seg(t, 0.55 + i * 0.07, 0.6 + i * 0.07)} />}
              <rect x={x - 62} y={295} width={124} height={34} rx={17} className={p >= 1 ? 'dg-topic' : 'dg-box'} />
              <text x={x - 10} y={317} textAnchor="middle" className={p >= 1 ? 'dg-topic-text' : 'dg-text'}>{g}</text>
              <path d={`M${x + 36} 311 l4 4 l8 -9`} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} className="dg-check" />
            </g>
          )
        })}
      </g>
    </svg>
  )
}

/* ---------- Easy-Sales: revenue after the purchase journey was fixed ---------- */

const series = [1, 1.06, 0.96, 1.03, 1, 1.7, 2.4, 3]
const fixAt = 4

export function RevenueDrawing() {
  const [ref, t] = useLoop(8000)
  const x0 = 56
  const x1 = 560
  const base = 300
  const unit = 70
  const px = (i: number) => x0 + (i * (x1 - x0)) / (series.length - 1)
  const py = (v: number) => base - v * unit
  const pts = series.map((v, i) => `${px(i)} ${py(v)}`)
  const d = `M${pts.join(' L')}`
  const area = `${d} L${px(series.length - 1)} ${base} L${x0} ${base} Z`
  const p = ease(seg(t, 0.06, 0.62))
  const shown = p * (x1 - x0)
  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="diagram" role="img" aria-label="Sales stay flat, the purchase journey is redesigned, and sales rise to three times their level within two months.">
      <defs>
        <clipPath id="rev-clip">
          <rect x={x0} y={0} width={shown} height={H} />
        </clipPath>
      </defs>
      <g opacity={outro(t)}>
        <line x1={x0} x2={x1} y1={base} y2={base} className="dg-grid" />
        <line x1={px(fixAt)} x2={px(fixAt)} y1={70} y2={base} className="dg-dash" opacity={seg(t, 0.3, 0.36)} />
        <text x={px(fixAt) - 10} y={150} textAnchor="end" className="dg-text" opacity={seg(t, 0.3, 0.36)}>Purchase journey redesigned</text>
        <path d={area} clipPath="url(#rev-clip)" className="dg-area" />
        <Draw d={d} p={p} className="dg-line dg-line--accent dg-line--thick" />
        {series.map((v, i) =>
          px(i) - x0 <= shown + 0.5 ? <circle key={i} cx={px(i)} cy={py(v)} r={i >= fixAt ? 4 : 3} className={i >= fixAt ? 'dg-pin dg-pin--accent' : 'dg-pin'} /> : null,
        )}
        <text x={x0} y={base + 26} className="dg-caption">Active users, few buyers</text>
        <text x={x1} y={base + 26} textAnchor="end" className="dg-caption">Two months later</text>
        <text x={x1} y={py(series[series.length - 1]) - 18} textAnchor="end" className="dg-title dg-accent" opacity={seg(t, 0.6, 0.68)}>
          +$300K, +200%
        </text>
      </g>
    </svg>
  )
}
