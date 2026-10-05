import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { site } from '../content/site'
import { ask } from './Ask'
import { track } from '../lib/track'

const KEY = 'availability-bar-dismissed'

function wasDismissed() {
  try {
    return sessionStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

/** A small bar that appears once the visitor starts scrolling and stays until dismissed. */
export function AvailabilityBar() {
  const [dismissed, setDismissed] = useState(wasDismissed)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (dismissed) return
    const onScroll = () => {
      // Appears as soon as the visitor starts scrolling, then stays.
      setShown(window.scrollY > 40)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [dismissed])

  const dismiss = () => {
    setDismissed(true)
    try {
      sessionStorage.setItem(KEY, '1')
    } catch {
      /* storage unavailable: hidden for this page view only */
    }
  }

  return (
    <AnimatePresence>
      {shown && !dismissed && (
        <motion.div
          className="avail-bar"
          role="region"
          aria-label="Availability"
          initial={{ opacity: 0, y: 16, x: '-50%', filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, x: '-50%', filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: 12, x: '-50%', filter: 'blur(4px)', transition: { duration: 0.15 } }}
          transition={{ type: 'spring', stiffness: 420, damping: 34 }}
        >
          <span className="status-dot" data-live aria-hidden />
          <span>{site.availability}</span>
          <a href={site.cv} download className="avail-link" onClick={() => track('cv-download')}>CV</a>
          <button type="button" className="avail-cta press" onClick={() => ask({ intent: 'hiring' })}>
            Let’s talk
          </button>
          <button type="button" className="avail-close" onClick={dismiss} aria-label="Hide this bar">
            <svg viewBox="0 0 16 16" aria-hidden><path d="M4.5 4.5l7 7M11.5 4.5l-7 7" /></svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
