import { site } from '../content/site'

/**
 * Privacy-friendly analytics with GoatCounter (no cookies, no consent banner).
 * Nothing loads until site.goatcounter is set to your GoatCounter code.
 */
type GoatCounter = { count: (opts: { path: string; title?: string; event?: boolean }) => void }
declare global {
  interface Window {
    goatcounter?: GoatCounter & { no_onload?: boolean }
  }
}

let queue: { path: string; title?: string; event?: boolean }[] = []

export function loadAnalytics() {
  if (!site.goatcounter || typeof document === 'undefined') return
  if (document.querySelector('script[data-goatcounter]')) return
  // Page views are counted by the router, so the script must not count on load.
  window.goatcounter = { ...(window.goatcounter ?? {}), no_onload: true } as Window['goatcounter']
  const s = document.createElement('script')
  s.async = true
  s.src = 'https://gc.zgo.at/count.js'
  s.dataset.goatcounter = `https://${site.goatcounter}.goatcounter.com/count`
  s.onload = () => {
    const pending = queue
    queue = []
    pending.forEach((hit) => window.goatcounter?.count?.(hit))
  }
  document.head.appendChild(s)
}

function send(hit: { path: string; title?: string; event?: boolean }) {
  if (!site.goatcounter) return
  if (window.goatcounter?.count) window.goatcounter.count(hit)
  else queue.push(hit)
}

/** A page view. Called by the router on every navigation. */
export const trackPage = (path: string) => send({ path, title: document.title })

/** A named action, e.g. 'cv-download' or 'contact-sent'. Shows under Events in GoatCounter. */
export const track = (event: string) => send({ path: event, title: event, event: true })
