import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { site } from '../content/site'
import { track } from '../lib/track'

/**
 * "Ask about this": select any text on the site (or press an Ask button) and send
 * Ahmad a message about it. Messages go through Netlify Forms (the hidden "contact"
 * form in index.html); the visitor's email app is the fallback if that fails.
 */

export type AskDetail = { quote?: string; topic?: string; image?: string; intent?: IntentId }

/** Open the composer from anywhere, e.g. a button next to a project. */
export function ask(detail: AskDetail = {}) {
  window.dispatchEvent(new CustomEvent<AskDetail>('ask:open', { detail }))
}

const intents = [
  { id: 'hiring', label: 'Hiring', subject: 'A role at our company' },
  { id: 'project', label: 'A project', subject: 'A project we could build together' },
  { id: 'consulting', label: 'Consulting', subject: 'Consulting on our product' },
  { id: 'curious', label: 'Just curious', subject: 'A question about your work' },
] as const
export type IntentId = (typeof intents)[number]['id']

const MAX_QUOTE = 600
const clip = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s)

function selectionInfo() {
  const sel = window.getSelection()
  if (!sel || sel.isCollapsed || sel.rangeCount === 0) return null
  const text = sel.toString().replace(/\s+/g, ' ').trim()
  if (text.length < 3) return null
  const range = sel.getRangeAt(0)
  const node = range.commonAncestorContainer
  const el = node.nodeType === 1 ? (node as Element) : node.parentElement
  if (!el || el.closest('input, textarea, [data-ask-ignore]')) return null
  const rect = range.getBoundingClientRect()
  if (!rect.width && !rect.height) return null
  return { text: clip(text, MAX_QUOTE), rect }
}

export function AskLayer() {
  const [pill, setPill] = useState<null | { text: string; x: number; y: number }>(null)
  const [open, setOpen] = useState<null | AskDetail>(null)
  const [intent, setIntent] = useState<IntentId>('hiring')
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [bot, setBot] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [emailError, setEmailError] = useState(false)
  const textarea = useRef<HTMLTextAreaElement>(null)
  const [chip, setChip] = useState<null | { x: number; y: number; topic: string; image?: string }>(null)
  const chipEl = useRef<HTMLButtonElement>(null)

  // Show the pill above a fresh text selection.
  useEffect(() => {
    let t = 0
    const update = () => {
      window.clearTimeout(t)
      t = window.setTimeout(() => {
        if (open) return
        const info = selectionInfo()
        if (!info) return setPill(null)
        const x = Math.min(window.innerWidth - 80, Math.max(80, info.rect.left + info.rect.width / 2))
        const y = Math.max(12, info.rect.top - 10)
        setPill({ text: info.text, x, y })
      }, 120)
    }
    const hide = () => setPill(null)
    document.addEventListener('selectionchange', update)
    window.addEventListener('scroll', hide, { passive: true })
    return () => {
      document.removeEventListener('selectionchange', update)
      window.removeEventListener('scroll', hide)
      window.clearTimeout(t)
    }
  }, [open])

  // Hovering an image or drawing shows an "Ask about this" chip in its corner (mouse only).
  useEffect(() => {
    if (open) return
    let hideTimer = 0
    const hide = () => setChip(null)
    const onOver = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      const target = e.target as Element | null
      if (!target || chipEl.current?.contains(target)) return window.clearTimeout(hideTimer)
      const media = target.closest('img, video, svg.diagram')
      if (!media || !media.closest('main') || media.closest('[data-ask-ignore], .preview-card')) {
        window.clearTimeout(hideTimer)
        hideTimer = window.setTimeout(hide, 140)
        return
      }
      window.clearTimeout(hideTimer)
      const frame = media.closest('[data-frame]')
      const box = (frame?.querySelector('.relative') ?? media.closest('figure') ?? media) as Element
      const r = box.getBoundingClientRect()
      if (r.width < 90 || r.height < 70) return
      const link = frame?.querySelector('a')
      const caption = media.closest('figure')?.querySelector('figcaption')?.textContent
      const alt = media.getAttribute('alt') || media.getAttribute('aria-label')
      const topic = (link?.getAttribute('aria-label') || caption || alt || document.title).replace(/, on GitHub$/, '')
      const src = media instanceof HTMLImageElement ? media.currentSrc || media.src : undefined
      setChip({ x: r.right - 10, y: r.top + 10, topic, image: src })
    }
    const onScroll = () => setChip(null)
    document.addEventListener('pointerover', onOver)
    window.addEventListener('scroll', onScroll, { passive: true, capture: true })
    return () => {
      document.removeEventListener('pointerover', onOver)
      window.removeEventListener('scroll', onScroll, { capture: true })
      window.clearTimeout(hideTimer)
    }
  }, [open])

  const openWith = useCallback((detail: AskDetail) => {
    setPill(null)
    setChip(null)
    setStatus('idle')
    setEmailError(false)
    if (detail.intent) setIntent(detail.intent)
    setOpen(detail)
  }, [])

  // Buttons elsewhere on the site open the composer through an event.
  useEffect(() => {
    const onAsk = (e: Event) => openWith((e as CustomEvent<AskDetail>).detail ?? {})
    window.addEventListener('ask:open', onAsk)
    return () => window.removeEventListener('ask:open', onAsk)
  }, [openWith])

  useEffect(() => {
    if (!open) return
    const id = window.setTimeout(() => textarea.current?.focus(), 60)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null)
    window.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(id)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const current = intents.find((i) => i.id === intent)!
  const body = () =>
    [
      'Hi Ahmad,',
      '',
      message.trim() || '(I’d like to know more.)',
      '',
      open?.quote ? `About this, on your site:\n“${open.quote}”` : open?.topic ? `About: ${open.topic}` : '',
      open?.image ? `Image: ${open.image}` : '',
      `Page: ${window.location.href}`,
      `I’m reaching out about: ${current.label}`,
      '',
      name.trim() ? `— ${name.trim()}` : '',
    ]
      .filter((l, i, a) => !(l === '' && a[i - 1] === ''))
      .join('\n')
      .trim()

  const subject = () => (open?.topic ? `${current.subject}: ${open.topic}` : current.subject)
  const mailto = () => `mailto:${site.email}?subject=${encodeURIComponent(subject())}&body=${encodeURIComponent(body())}`

  const send = async () => {
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    setEmailError(!validEmail)
    if (!validEmail) return
    setStatus('sending')
    const fields: Record<string, string> = {
      'form-name': 'contact',
      'bot-field': bot,
      name: name.trim(),
      email: email.trim(),
      intent: current.label,
      topic: open?.topic ?? '',
      quote: open?.quote ?? '',
      image: open?.image ?? '',
      page: window.location.href,
      message: message.trim() || '(No message, just wants to talk.)',
    }
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(fields).toString(),
      })
      if (!res.ok) throw new Error(String(res.status))
      setStatus('sent')
      track('contact-sent')
      setMessage('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <AnimatePresence>
        {chip && !open && (
          <motion.button
            key="ask-chip"
            ref={chipEl}
            type="button"
            data-ask-ignore
            className="ask-media-chip"
            style={{ left: chip.x, top: chip.y }}
            initial={{ opacity: 0, scale: 0.9, x: '-100%' }}
            animate={{ opacity: 1, scale: 1, x: '-100%' }}
            exit={{ opacity: 0, scale: 0.95, x: '-100%', transition: { duration: 0.1 } }}
            transition={{ type: 'spring', stiffness: 600, damping: 34 }}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              openWith({ topic: chip.topic, image: chip.image })
            }}
          >
            Ask about this
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {pill && (
          <motion.button
            key="ask-pill"
            type="button"
            data-ask-ignore
            className="ask-pill"
            style={{ left: pill.x, top: pill.y }}
            initial={{ opacity: 0, y: 4, scale: 0.92, x: '-50%' }}
            animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
            exit={{ opacity: 0, y: 2, scale: 0.96, x: '-50%', transition: { duration: 0.1 } }}
            transition={{ type: 'spring', stiffness: 600, damping: 32 }}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => openWith({ quote: pill.text })}
          >
            Ask Ahmad about this
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            key="ask-backdrop"
            className="ask-backdrop"
            data-ask-ignore
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(e) => e.target === e.currentTarget && setOpen(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="ask-title"
              className="ask-card"
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98, transition: { duration: 0.12 } }}
              transition={{ type: 'spring', stiffness: 420, damping: 34 }}
            >
              <div className="flex items-baseline justify-between gap-4">
                <h2 id="ask-title">Ask Ahmad</h2>
                <button type="button" className="ask-close press" onClick={() => setOpen(null)} aria-label="Close">
                  Esc
                </button>
              </div>

              {open.image && <img src={open.image} alt="" className="ask-thumb" />}
              {open.quote ? (
                <blockquote className="ask-quote">{open.quote}</blockquote>
              ) : open.topic ? (
                <p className="ask-quote">{open.topic}</p>
              ) : null}

              {status === 'sent' ? (
                <div className="mt-5" role="status">
                  <p className="font-medium">Thanks, your message is on its way.</p>
                  <p className="mt-1 text-muted">I’ll reply to {email.trim()}.</p>
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    {site.booking && (
                      <a href={site.booking} target="_blank" rel="noopener noreferrer" className="ask-send press" onClick={() => track('booking-click')}>
                        Book a call too
                      </a>
                    )}
                    <button type="button" className="link text-muted" onClick={() => setOpen(null)}>
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    void send()
                  }}
                >
                  <fieldset className="mt-5">
                    <legend className="text-muted">What is this about?</legend>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {intents.map((i) => (
                        <button
                          key={i.id}
                          type="button"
                          className="ask-chip press"
                          aria-pressed={intent === i.id}
                          onClick={() => setIntent(i.id)}
                        >
                          {i.label}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <label className="mt-5 block">
                    <span className="text-muted">Message</span>
                    <textarea
                      ref={textarea}
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="What would you like to know, or what are you working on?"
                      className="ask-field"
                    />
                  </label>
                  <label className="mt-3 block">
                    <span className="text-muted">Your email, so I can reply</span>
                    <input
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        setEmailError(false)
                      }}
                      aria-invalid={emailError || undefined}
                      aria-describedby={emailError ? 'ask-email-error' : undefined}
                      className="ask-field"
                    />
                    {emailError && (
                      <span id="ask-email-error" className="mt-1 block text-[12px] text-accent">
                        Add an email address so I can get back to you.
                      </span>
                    )}
                  </label>
                  <label className="mt-3 block">
                    <span className="text-muted">Your name and company (optional)</span>
                    <input autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className="ask-field" />
                  </label>
                  <label className="ask-honeypot" aria-hidden>
                    Leave this empty
                    <input tabIndex={-1} autoComplete="off" value={bot} onChange={(e) => setBot(e.target.value)} />
                  </label>

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <button type="submit" className="ask-send press" disabled={status === 'sending'}>
                      {status === 'sending' ? 'Sending…' : 'Send message'}
                    </button>
                    <a className="link text-muted" href={mailto()}>
                      Use your email app instead
                    </a>
                  </div>
                  {status === 'error' ? (
                    <p className="mt-3 text-[12px] text-accent" role="alert">
                      That didn’t go through. Use your email app instead, or write to {site.email}.
                    </p>
                  ) : (
                    <p className="mt-3 text-[12px] text-muted">
                      Goes straight to me, with what you picked and this page included. Your email is only used to reply.
                    </p>
                  )}
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
