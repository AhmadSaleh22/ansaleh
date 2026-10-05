import { Prose } from './Prose'

type Section = { title: string; body: string }

/** Splits Markdown into the text before the first "## " heading and one section per "## ". */
export function splitSections(markdown: string): { intro: string; sections: Section[] } {
  const parts = markdown.split(/^## +/m)
  const intro = parts.shift()?.trim() ?? ''
  const sections = parts.map((part) => {
    const nl = part.indexOf('\n')
    const title = (nl === -1 ? part : part.slice(0, nl)).trim()
    const body = nl === -1 ? '' : part.slice(nl + 1).trim()
    return { title, body }
  })
  return { intro, sections }
}

const tilt = [-1.6, 1.1, -0.7, 1.5, -1.2, 0.8, -1.9, 0.5]

/** Each "## " section of a book's notes becomes a sticky note on a board. */
export function StickyNotes({ markdown }: { markdown: string }) {
  const { intro, sections } = splitSections(markdown)
  return (
    <>
      {intro && <Prose>{intro}</Prose>}
      {sections.length > 0 && (
        <ul className="sticky-board" aria-label="Notes">
          {sections.map((s, i) => (
            <li
              key={s.title}
              className={`sticky-note ${i % 2 ? 'sticky-note--orange' : 'sticky-note--yellow'}`}
              style={{ ['--tilt' as string]: `${tilt[i % tilt.length]}deg` }}
            >
              <h2 className="sticky-title">{s.title}</h2>
              <Prose>{s.body}</Prose>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
