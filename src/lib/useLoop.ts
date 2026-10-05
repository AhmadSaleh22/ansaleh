import { useEffect, useRef, useState } from 'react'

/** The moment in the loop where everything is drawn; used when motion is off. */
export const HOLD = 0.86

/**
 * Drives a looping drawing. Returns a ref for the SVG and t in [0, 1).
 * Runs only while the drawing is on screen; with reduced motion it stays on the finished frame.
 */
export function useLoop(duration: number) {
  const ref = useRef<SVGSVGElement>(null)
  const [t, setT] = useState(HOLD)

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    let start = 0
    let running = false
    const tick = (now: number) => {
      if (!start) start = now
      setT(((now - start) % duration) / duration)
      raf = requestAnimationFrame(tick)
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true
          start = 0
          raf = requestAnimationFrame(tick)
        } else if (!entry.isIntersecting && running) {
          running = false
          cancelAnimationFrame(raf)
          setT(HOLD)
        }
      },
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [duration])

  return [ref, t] as const
}

/** Progress of t through the window [a, b], clamped to 0..1. */
export const seg = (t: number, a: number, b: number) => Math.min(1, Math.max(0, (t - a) / (b - a)))
/** Ease out, cubic. */
export const ease = (x: number) => 1 - Math.pow(1 - x, 3)
/** Fade the whole drawing out at the end of the loop, so it can start again. */
export const outro = (t: number) => 1 - seg(t, 0.93, 1)
