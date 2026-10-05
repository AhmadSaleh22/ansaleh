import { useEffect, useLayoutEffect } from 'react'
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import { AskLayer } from './Ask'
import { AvailabilityBar } from './AvailabilityBar'
import { trackPage } from '../lib/track'

/** Wraps every route. Reduced motion is honoured by Motion and by CSS. */
export function Layout() {
  const { pathname } = useLocation()
  const surface = pathname === '/' ? 'home' : 'note'

  // Notes and case studies sit on a white page; keep the root in sync so overscroll matches.
  useLayoutEffect(() => {
    document.documentElement.dataset.surface = surface
  }, [surface])

  // One page view per route, after the page has set its title.
  useEffect(() => {
    const id = window.setTimeout(() => trackPage(pathname), 0)
    return () => window.clearTimeout(id)
  }, [pathname])

  return (
    <MotionConfig reducedMotion="user">
      <div key={pathname} className="route min-h-dvh">
        <Outlet />
      </div>
      <AvailabilityBar />
      <AskLayer />
      <ScrollRestoration />
    </MotionConfig>
  )
}
