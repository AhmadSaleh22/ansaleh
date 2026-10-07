import { useEffect, useState, type FocusEvent, type PointerEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react'
import { site } from '../content/site'
import { projects } from '../content/projects'
import { work } from '../lib/content'
import { Diagram, type DiagramName } from './Diagrams'
import { ask } from './Ask'
import { track } from '../lib/track'

type Media = { image?: string; diagram?: DiagramName }

/** What a company's preview shows: its case-study screenshot, or its drawing. */
function mediaForWork(slug: string): Media {
  const w = work.find((x) => x.slug === slug)
  return { image: w?.cover, diagram: w?.diagram }
}

const trendow = projects.find((p) => p.name === 'TRENDOW')

const CARD_W = 248
const CARD_H = 155

/**
 * An inline link that shows a small preview card next to the cursor on hover.
 * Touch devices get a plain link; keyboard focus shows the card above the link.
 */
function PreviewLink({ to, href, media, children }: { to?: string; href?: string; media: Media; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.6 })

  const place = (cx: number, top: number, jump: boolean) => {
    const left = Math.min(window.innerWidth - CARD_W - 12, Math.max(12, cx - CARD_W / 2))
    const t = Math.max(12, top - CARD_H - 14)
    x.set(left)
    y.set(t)
    if (jump) {
      sx.jump(left)
      sy.jump(t)
    }
  }
  const onEnter = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    place(e.clientX, e.clientY, true)
    setOpen(true)
  }
  const onMove = (e: PointerEvent) => {
    if (e.pointerType === 'mouse') place(e.clientX, e.clientY, false)
  }
  const onFocus = (e: FocusEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    place(r.left + r.width / 2, r.top, true)
    setOpen(true)
  }
  const close = () => setOpen(false)

  const handlers = { onPointerEnter: onEnter, onPointerMove: onMove, onPointerLeave: close, onFocus, onBlur: close }
  const className = 'link link--strong text-fg'

  return (
    <>
      {to ? (
        <Link to={to} viewTransition className={className} {...handlers}>{children}</Link>
      ) : (
        <a href={href} target="_blank" rel="noopener noreferrer" className={className} {...handlers}>{children}</a>
      )}
      <AnimatePresence>
        {open && (
          <motion.span
            aria-hidden
            className="pointer-events-none fixed left-0 top-0 z-50 block overflow-hidden rounded-lg bg-frame"
            style={{ x: sx, y: sy, width: CARD_W, height: CARD_H, transformOrigin: '50% 100%' }}
            initial={{ opacity: 0, scale: 0.92, filter: 'blur(4px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.96, filter: 'blur(2px)', transition: { duration: 0.12 } }}
            transition={{ type: 'spring', stiffness: 520, damping: 34 }}
          >
            <span className="preview-card">
              {media.image ? (
                <img src={media.image} alt="" className="h-full w-full object-cover object-top" />
              ) : media.diagram ? (
                <Diagram name={media.diagram} />
              ) : null}
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </>
  )
}

/** Working hours in Cairo; the status dot is green inside them and grey outside. */
const WORK_START = 9
const WORK_END = 18

function useCairoTime() {
  const read = () => {
    const now = new Date()
    const time = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Africa/Cairo' }).format(now)
    const hour = Number(new Intl.DateTimeFormat('en-GB', { hour: '2-digit', hour12: false, timeZone: 'Africa/Cairo' }).format(now)) % 24
    return { time, working: hour >= WORK_START && hour < WORK_END }
  }
  const [state, setState] = useState(read)
  useEffect(() => {
    const id = window.setInterval(() => setState(read()), 15_000)
    return () => window.clearInterval(id)
  }, [])
  return state
}

export function Hero() {
  const { time, working } = useCairoTime()

  // Warm the cache so previews never pop in empty.
  useEffect(() => {
    for (const src of [mediaForWork('eddekhar').image, trendow?.frame?.image]) {
      if (src) new Image().src = src
    }
  }, [])

  return (
    <header>
      <h1>{site.name}</h1>
      <p className="text-muted">{site.title}</p>

      <p className="max-w-[520px] pt-10 text-pretty">
        I build web and mobile products for payroll, healthcare and manufacturing. Most recently I led frontend at{' '}
        <PreviewLink to="/experience/syntax" media={mediaForWork('syntax')}>Syntax</PreviewLink> and built its 3D plant floor in Three.js. Before that I worked on{' '}
        <PreviewLink to="/experience/marham-care" media={mediaForWork('marham')}>Marham Care</PreviewLink> and built a payroll ERP at{' '}
        <PreviewLink to="/experience/eddekhar" media={mediaForWork('eddekhar')}>Eddekhar</PreviewLink>.
      </p>

      <ul className="glance" aria-label="At a glance">
        {site.glance.map((g) => (
          <li key={g}>{g}</li>
        ))}
      </ul>

      <div className="flex flex-wrap items-center gap-2 pt-6">
        <a href={site.cv} download className="btn btn--primary press" onClick={() => track('cv-download')}>Download CV</a>
        <button type="button" className="btn press" onClick={() => ask({ intent: 'hiring' })}>Let’s talk</button>
        {site.booking && (
          <a href={site.booking} target="_blank" rel="noopener noreferrer" className="btn press" onClick={() => track('booking-click')}>
            Book a call
          </a>
        )}
      </div>

      <p className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-6 text-muted">
        <span className="inline-flex items-center gap-2">
          <span
            className="status-dot"
            data-live={working || undefined}
            title={working ? 'Working hours in Cairo' : 'Outside working hours in Cairo'}
            aria-hidden
          />
          <span>
            {site.place} <time className="tabular-nums">{time}</time>
          </span>
        </span>
        {trendow && (
          <span>
            Building{' '}
            <PreviewLink href={trendow.url} media={{ image: trendow.frame?.image }}>TRENDOW</PreviewLink>
          </span>
        )}
      </p>
    </header>
  )
}
