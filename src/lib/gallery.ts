import { work } from './content'
import { projects } from '../content/projects'

export type GalleryItem = {
  key: string
  title: string
  byline: string
  href: string
  external?: boolean
  cover?: string
  video?: string
  anchor?: 'start' | 'end'
  diagram?: 'jobcopilot' | 'classifier' | 'planning' | 'matching' | 'structure' | 'revenue'
  figure?: string
  figureLabel?: string
}

/** Case studies, then projects that have a frame. */
const items: GalleryItem[] = [
  ...work.map((w) => ({
    key: w.slug,
    title: w.title,
    byline: `${w.company} · ${w.role}`,
    href: `/work/${w.slug}`,
    cover: w.cover,
    anchor: w.anchor,
    video: w.video,
    diagram: w.diagram,
    figure: w.figure,
    figureLabel: w.figureLabel,
  })),
  ...projects
    .filter((p) => p.frame)
    .map((p) => ({
      key: p.name,
      title: p.frame!.title,
      byline: `${p.name} · ${p.frame!.stack}`,
      href: p.url,
      external: true,
      cover: p.frame!.image,
      anchor: p.frame!.anchor ?? 'start',
      diagram: p.frame!.diagram,
    })),
]

/** Frames with a screenshot or video come first; the rest keep their order. */
const hasMedia = (g: GalleryItem) => Boolean(g.cover || g.video)
export const gallery: GalleryItem[] = [...items.filter(hasMedia), ...items.filter((g) => !hasMedia(g))]
