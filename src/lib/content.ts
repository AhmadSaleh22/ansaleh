type Raw = Record<string, string>

function parse(raw: string): { data: Record<string, string>; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw)
  if (!match) return { data: {}, body: raw }
  const data: Record<string, string> = {}
  for (const line of match[1].split(/\r?\n/)) {
    const i = line.indexOf(':')
    if (i < 1) continue
    const key = line.slice(0, i).trim()
    let value = line.slice(i + 1).trim()
    if (/^(['"]).*\1$/.test(value)) value = value.slice(1, -1)
    data[key] = value
  }
  return { data, body: match[2].trim() }
}

const slugOf = (path: string) => path.split('/').pop()!.replace(/\.md$/, '')

// Files starting with "_" are templates and never published.
const visible = (files: Raw) => Object.entries(files).filter(([path]) => !slugOf(path).startsWith('_'))

export type Work = {
  slug: string
  order: number
  title: string
  company: string
  role: string
  period: string
  /** Big result shown inside a frame that has no image or video yet. */
  figure: string
  figureLabel: string
  cover?: string
  /** 'end' keeps the right side of an Arabic (RTL) screenshot in view. */
  anchor?: 'start' | 'end'
  video?: string
  /** Animated drawing shown when there is no image or video. */
  diagram?: 'planning' | 'matching' | 'structure' | 'revenue'
  body: string
}

export type Note = {
  slug: string
  /** 1-based, oldest first, so numbers never change when a note is added. */
  number: number
  title: string
  date: string
  summary?: string
  body: string
}

export type Book = {
  slug: string
  order: number
  title: string
  author: string
  /** Path under /public. Without one, a plain tile is shown. */
  cover?: string
  /** Optional, for example Reading or Finished. */
  status?: string
  /** Notes in Markdown. Empty until written. */
  body: string
}

const workFiles = import.meta.glob('../content/work/*.md', { query: '?raw', import: 'default', eager: true }) as Raw
const bookFiles = import.meta.glob('../content/books/*.md', { query: '?raw', import: 'default', eager: true }) as Raw
const noteFiles = import.meta.glob('../content/notes/*.md', { query: '?raw', import: 'default', eager: true }) as Raw

export const work: Work[] = visible(workFiles)
  .map(([path, raw]) => {
    const { data, body } = parse(raw)
    return {
      slug: slugOf(path),
      order: Number(data.order ?? 99),
      title: data.title ?? slugOf(path),
      company: data.company ?? '',
      role: data.role ?? '',
      period: data.period ?? '',
      figure: data.figure ?? '',
      figureLabel: data.figureLabel ?? '',
      cover: data.cover || undefined,
      anchor: data.anchor === 'end' ? ('end' as const) : ('start' as const),
      video: data.video || undefined,
      diagram: (data.diagram || undefined) as Work['diagram'],
      body,
    }
  })
  .sort((a, b) => a.order - b.order)

const parsedNotes = visible(noteFiles).map(([path, raw]) => {
  const { data, body } = parse(raw)
  return { slug: slugOf(path), title: data.title ?? slugOf(path), date: data.date ?? '', summary: data.summary || undefined, body }
})
const oldestFirst = [...parsedNotes].sort((a, b) => a.date.localeCompare(b.date))
export const notes: Note[] = oldestFirst
  .map((n, i) => ({ ...n, number: i + 1 }))
  .reverse()

export const books: Book[] = visible(bookFiles)
  .map(([path, raw]) => {
    const { data, body } = parse(raw)
    return {
      slug: slugOf(path),
      order: Number(data.order ?? 99),
      title: data.title ?? slugOf(path),
      author: data.author ?? '',
      cover: data.cover || undefined,
      status: data.status || undefined,
      body,
    }
  })
  .sort((a, b) => a.order - b.order)

export function formatDate(iso: string, style: 'short' | 'long' = 'long') {
  const d = new Date(iso + 'T00:00:00')
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: style === 'long' ? 'long' : 'short',
    year: 'numeric',
  })
}
