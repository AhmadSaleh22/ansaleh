import { AnimatePresence, motion } from 'motion/react'

/** Two-digit counter where a changed digit slides out and the new one slides in. */
export function RollingNumber({ value, direction = 1 }: { value: number; direction?: 1 | -1 }) {
  const text = String(value).padStart(2, '0')
  return (
    <span className="inline-flex tabular-nums" aria-label={text}>
      {text.split('').map((digit, i) => (
        <span key={i} className="relative inline-block overflow-hidden" aria-hidden>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={digit}
              className="inline-block"
              initial={{ y: `${direction * 70}%`, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: `${direction * -70}%`, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 38 }}
            >
              {digit}
            </motion.span>
          </AnimatePresence>
        </span>
      ))}
    </span>
  )
}
