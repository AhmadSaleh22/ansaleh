import { useId, useState } from 'react'
import { motion } from 'motion/react'
import { site } from '../content/site'

const spring = { type: 'spring', stiffness: 500, damping: 40 } as const

export function Bio() {
  const [long, setLong] = useState(false)
  const panelId = useId()

  return (
    <div>
      <p>{site.bio.short}</p>

      <motion.div
        id={panelId}
        initial={false}
        animate={{ height: long ? 'auto' : 0, opacity: long ? 1 : 0 }}
        transition={{ height: { type: 'spring', stiffness: 260, damping: 32 }, opacity: { duration: 0.2 } }}
        style={{ overflow: 'hidden' }}
        aria-hidden={!long}
        inert={!long}
      >
        <div className="space-y-4 pt-4">
          {site.bio.long.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </motion.div>

      <div
        role="group"
        aria-label="Bio length"
        className="relative mt-5 inline-flex rounded-full border border-line p-0.5 text-[12px] leading-none"
      >
        {(['Short', 'Long'] as const).map((label) => {
          const active = (label === 'Long') === long
          return (
            <motion.button
              key={label}
              type="button"
              aria-pressed={active}
              aria-controls={panelId}
              onClick={() => setLong(label === 'Long')}
              whileTap={{ scale: 0.97 }}
              transition={spring}
              className="relative cursor-pointer rounded-full px-3 py-[7px] font-medium"
            >
              {active && (
                <motion.span
                  layoutId="bio-pill"
                  transition={spring}
                  className="absolute inset-0 rounded-full bg-fg"
                />
              )}
              <span className={`relative transition-colors duration-150 ease-out ${active ? 'text-bg' : 'text-muted hover:text-fg'}`}>
                {label}
              </span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
