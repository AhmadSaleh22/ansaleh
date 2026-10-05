import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent as ReactPointerEvent } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react'
import { Link } from 'react-router-dom'
import { gallery, type GalleryItem } from '../lib/gallery'
import { Diagram } from './Diagrams'
import { RollingNumber } from './RollingNumber'
import { ask } from './Ask'

const pad = (n: number) => String(n).padStart(2, '0')
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function Gallery() {
  const scroller = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const direction = useRef<1 | -1>(1)
  const drag = useRef({ down: false, moved: false, startX: 0, startLeft: 0, lastX: 0, lastT: 0, v: 0, raf: 0 })
  // Where a button or key press is heading, so fast repeated presses keep counting from there.
  const target = useRef<number | null>(null)
  const [dragging, setDragging] = useState(false)

  // Cursor label that follows the pointer over the band: "View" on the current frame, "Drag" elsewhere.
  const [cursor, setCursor] = useState<null | 'View' | 'Drag'>(null)
  const cx = useMotionValue(0)
  const cy = useMotionValue(0)
  const sx = useSpring(cx, { stiffness: 600, damping: 45, mass: 0.5 })
  const sy = useSpring(cy, { stiffness: 600, damping: 45, mass: 0.5 })

  const frames = useCallback(
    () => Array.from(scroller.current?.querySelectorAll<HTMLElement>('[data-frame]') ?? []),
    [],
  )
  const padLeft = () => (scroller.current ? parseFloat(getComputedStyle(scroller.current).paddingLeft) || 0 : 0)
  const targetFor = (i: number) => (frames()[i]?.offsetLeft ?? 0) - padLeft()

  // Keep the stepper and the counter in step with the scroll position.
  const measure = useCallback(() => {
    const el = scroller.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    const list = frames()
    let best = 0
    if (scrollLeft + clientWidth >= scrollWidth - 2) best = list.length - 1
    else {
      let min = Infinity
      list.forEach((f, i) => {
        const d = Math.abs(f.offsetLeft - padLeft() - scrollLeft)
        if (d < min) { min = d; best = i }
      })
    }
    if (target.current === best) target.current = null
    setActive((prev) => {
      if (prev !== best) direction.current = best > prev ? 1 : -1
      return best
    })
  }, [frames])

  useLayoutEffect(measure, [measure])
  useEffect(() => {
    const el = scroller.current
    if (!el) return
    let raf = 0
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(measure) }
    el.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { el.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(raf) }
  }, [measure])

  const goTo = (i: number, focus = false) => {
    const el = scroller.current
    if (!el) return
    const next = Math.max(0, Math.min(frames().length - 1, i))
    target.current = next
    el.scrollTo({ left: targetFor(next), behavior: reducedMotion() ? 'auto' : 'smooth' })
    if (focus) frames()[next]?.querySelector<HTMLElement>('a')?.focus({ preventScroll: true })
  }

  const step = (by: 1 | -1, focus = false) => goTo((target.current ?? active) + by, focus)

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return
    if (e.key === 'ArrowRight') { e.preventDefault(); step(1, true) }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1, true) }
  }

  // Drag to scroll with momentum (mouse only; touch already scrolls natively).
  const onPointerDown = (e: React.PointerEvent) => {
    const el = scroller.current
    if (!el || e.pointerType !== 'mouse' || e.button !== 0) return
    const d = drag.current
    cancelAnimationFrame(d.raf)
    target.current = null
    Object.assign(d, { down: true, moved: false, startX: e.clientX, startLeft: el.scrollLeft, lastX: e.clientX, lastT: performance.now(), v: 0 })

    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - d.startX
      if (!d.moved && Math.abs(dx) > 4) {
        d.moved = true
        el.style.scrollSnapType = 'none'
        el.dataset.drag = 'true'
        setDragging(true)
      }
      if (!d.moved) return
      el.scrollLeft = d.startLeft - dx
      const now = performance.now()
      const dt = Math.max(1, now - d.lastT)
      d.v = 0.8 * ((d.lastX - ev.clientX) / dt) + 0.2 * d.v
      d.lastX = ev.clientX
      d.lastT = now
    }
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
      d.down = false
      setDragging(false)
      if (!d.moved) return
      delete el.dataset.drag
      if (performance.now() - d.lastT > 80) d.v = 0
      let last = performance.now()
      const glide = (t: number) => {
        const dt = t - last
        last = t
        el.scrollLeft += d.v * dt
        d.v *= Math.pow(0.94, dt / 16)
        const atEdge = el.scrollLeft <= 0 || el.scrollLeft + el.clientWidth >= el.scrollWidth - 1
        if (Math.abs(d.v) > 0.03 && !atEdge && !reducedMotion()) d.raf = requestAnimationFrame(glide)
        else {
          el.style.scrollSnapType = ''
          let nearest = 0, min = Infinity
          frames().forEach((f, i) => {
            const dist = Math.abs(f.offsetLeft - padLeft() - el.scrollLeft)
            if (dist < min) { min = dist; nearest = i }
          })
          el.scrollTo({ left: targetFor(nearest), behavior: reducedMotion() ? 'auto' : 'smooth' })
        }
      }
      d.raf = requestAnimationFrame(glide)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
  }

  // A drag must not end in a click on the frame under the cursor.
  const onClickCapture = (e: MouseEvent) => {
    if (drag.current.moved) { e.preventDefault(); e.stopPropagation(); drag.current.moved = false; return }
    const frame = (e.target as HTMLElement).closest<HTMLElement>('[data-frame]')
    const i = frame ? frames().indexOf(frame) : -1
    if (i !== -1 && i !== active) { e.preventDefault(); e.stopPropagation(); goTo(i) }
  }

  const onBandPointer = (e: ReactPointerEvent) => {
    if (e.pointerType !== 'mouse') return
    const frame = (e.target as HTMLElement).closest<HTMLElement>('[data-frame]')
    const i = frame ? frames().indexOf(frame) : -1
    const label = i === active && i !== -1 ? 'View' : 'Drag'
    if (!cursor) { sx.jump(e.clientX); sy.jump(e.clientY) }
    cx.set(e.clientX)
    cy.set(e.clientY)
    if (label !== cursor) setCursor(label)
  }


  const current = gallery[active]

  return (
    <div>
      {/* Sticky stepper: one segment per frame; the current one stretches. */}
      <div className="sticky top-0 z-10 -mx-4 bg-bg px-4 py-3">
        <div className="flex items-center gap-4">
          <p className="w-[52px] shrink-0 text-[12px] leading-none text-muted" aria-live="polite">
            <span className="sr-only">Showing frame </span>
            <span className="text-fg"><RollingNumber value={active + 1} direction={direction.current} /></span> / {pad(gallery.length)}
          </p>
          <div className="stepper flex-1" role="group" aria-label="Choose a frame">
            {gallery.map((g, i) => (
              <button
                key={g.key}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to ${g.title}`}
                aria-current={i === active || undefined}
                className="stepper-step"
                data-state={i < active ? 'done' : i === active ? 'current' : 'next'}
              >
                <span className="stepper-bar" />
                <span className="stepper-label" aria-hidden>{g.byline.split(' · ')[0]}</span>
              </button>
            ))}
          </div>
          <div className="flex shrink-0 gap-1">
            <button type="button" className="gallery-btn press" onClick={() => step(-1)} disabled={active === 0} aria-label="Previous">
              <svg viewBox="0 0 16 16" aria-hidden><path d="M10 3.5 5.5 8 10 12.5" /></svg>
            </button>
            <button type="button" className="gallery-btn press" onClick={() => step(1)} disabled={active === gallery.length - 1} aria-label="Next">
              <svg viewBox="0 0 16 16" aria-hidden><path d="M6 3.5 10.5 8 6 12.5" /></svg>
            </button>
          </div>
        </div>
      </div>

      <div
        className="relative ml-[calc(50%-50vw)] w-screen bg-ground py-10"
        onPointerMove={onBandPointer}
        onPointerEnter={onBandPointer}
        onPointerLeave={() => setCursor(null)}
      >
        <div
          ref={scroller}
          role="region"
          aria-label="Work"
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onClickCapture={onClickCapture}
          onDragStart={(e) => e.preventDefault()}
          className="gallery-scroller flex cursor-grab gap-4 overflow-x-auto pb-1"
          style={{
            paddingInline: 'max(16px, calc(50vw - 304px))',
            scrollPaddingInline: 'max(16px, calc(50vw - 304px))',
          }}
        >
          {gallery.map((g, i) => (
            <Frame key={g.key} item={g} priority={i < 2} active={i === active} />
          ))}
          {/* Lets the last frame snap to the column edge. */}
          <div aria-hidden className="w-px shrink-0" />
        </div>

        <AnimatePresence>
          {cursor && (
            <motion.span
              aria-hidden
              className="gallery-cursor"
              style={{ x: sx, y: sy }}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: dragging ? 0.9 : 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ type: 'spring', stiffness: 500, damping: 32 }}
            >
              {dragging ? 'Drag' : cursor}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* One caption for the frame in place, so the band itself stays quiet. */}
      <div className="mt-5 min-h-[66px]" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current.key}
            initial={{ opacity: 0, y: 6, filter: 'blur(3px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -4, filter: 'blur(3px)', transition: { duration: 0.12 } }}
            transition={{ type: 'spring', stiffness: 420, damping: 36 }}
          >
            <div className="flex items-baseline justify-between gap-4">
              <p className="text-[12px] text-muted">{current.external ? 'Project' : 'Case study'}</p>
              <button type="button" className="link text-[12px] text-muted" onClick={() => ask({ topic: current.title })}>
                Ask about this
              </button>
            </div>
            {current.external ? (
              <a href={current.href} target="_blank" rel="noopener noreferrer" className="group mt-0.5 block">
                <span className="text-balance transition-colors duration-150 ease-out group-hover:text-muted">{current.title} ↗</span>
                <span className="block text-muted">{current.byline}</span>
              </a>
            ) : (
              <Link to={current.href} viewTransition className="group mt-0.5 block">
                <span className="text-balance transition-colors duration-150 ease-out group-hover:text-muted">{current.title}</span>
                <span className="block text-muted">{current.byline}</span>
              </Link>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}


function Frame({ item, priority, active }: { item: GalleryItem; priority: boolean; active: boolean }) {
  const media = item.video ? (
    <video
      src={item.video}
      poster={item.cover}
      muted
      loop
      playsInline
      autoPlay={!reducedMotion()}
      preload="metadata"
      className="h-full w-full object-cover"
    />
  ) : item.cover ? (
    // A screenshot sits inside the frame like a window, cropped by its edge.
    <div className="frame-shot" data-anchor={item.anchor}>
      <img src={item.cover} alt="" draggable={false} loading={priority ? 'eager' : 'lazy'} />
    </div>
  ) : item.diagram ? (
    <div className="flex h-full items-center justify-center">
      <Diagram name={item.diagram} />
    </div>
  ) : (
    <div className="flex h-full flex-col justify-end p-5 text-muted">
      <span className="font-medium text-fg">{item.figure}</span>
      <span>{item.figureLabel}</span>
    </div>
  )

  const body = <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-frame">{media}</div>

  return (
    <article data-frame data-active={active || undefined} className="gallery-frame w-[85vw] shrink-0 snap-start sm:w-[480px]">
      {item.external ? (
        <a href={item.href} target="_blank" rel="noopener noreferrer" draggable={false} className="group block" aria-label={`${item.title}, ${item.byline}, on GitHub`}>
          {body}
        </a>
      ) : (
        <Link to={item.href} viewTransition draggable={false} className="group block" aria-label={`${item.title}, ${item.byline}`}>
          {body}
        </Link>
      )}
    </article>
  )
}
