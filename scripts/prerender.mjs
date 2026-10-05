/**
 * Runs after `vite build`. Writes dist/<route>/index.html for every page, each with its own
 * <title>, description, canonical URL and Open Graph / Twitter tags, so shared links and
 * search engines see the right page before any JavaScript runs.
 *
 * Set SITE_URL to the live domain when building (for example SITE_URL=https://example.com npm run build).
 * Without it, URLs stay relative, which works on the site but not in most link previews.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const content = join(root, 'src', 'content')
const SITE_URL = (process.env.SITE_URL ?? '').replace(/\/$/, '')
const NAME = 'Ahmad Saleh'

const template = readFileSync(join(dist, 'index.html'), 'utf8')

function frontmatter(raw) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw)
  const data = {}
  if (!m) return data
  for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(':')
    if (i < 1) continue
    let v = line.slice(i + 1).trim()
    if (/^(['"]).*\1$/.test(v)) v = v.slice(1, -1)
    data[line.slice(0, i).trim()] = v
  }
  return data
}

function markdown(dir) {
  const path = join(content, dir)
  if (!existsSync(path)) return []
  return readdirSync(path)
    .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
    .map((f) => ({ slug: f.replace(/\.md$/, ''), ...frontmatter(readFileSync(join(path, f), 'utf8')) }))
}

/** Reads slug, company, role and summary from src/content/experience.ts without running TypeScript. */
function experience() {
  const src = readFileSync(join(content, 'experience.ts'), 'utf8')
  const field = (block, key) => (new RegExp(`${key}:\\s*'((?:[^'\\\\]|\\\\.)*)'`).exec(block) ?? [])[1]
  return src
    .split(/\n  \{\n/)
    .slice(1)
    .map((block) => ({ slug: field(block, 'slug'), company: field(block, 'company'), role: field(block, 'role'), summary: field(block, 'summary') }))
    .filter((r) => r.slug)
}

const escape = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const abs = (path) => (SITE_URL ? SITE_URL + path : path)

function page({ path, title, description, image = '/og.png', type = 'website' }) {
  const fullTitle = title ? `${title} · ${NAME}` : `${NAME} · Software Engineer`
  let html = template
  const set = (re, value) => {
    html = html.replace(re, (_m, before, _old, after) => `${before}${escape(value)}${after}`)
  }
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(fullTitle)}</title>`)
  set(/(<meta name="description" content=")([^"]*)(")/, description)
  set(/(<link rel="canonical" href=")([^"]*)(")/, abs(path))
  set(/(<meta property="og:type" content=")([^"]*)(")/, type)
  set(/(<meta property="og:title" content=")([^"]*)(")/, fullTitle)
  set(/(<meta property="og:description" content=")([^"]*)(")/, description)
  set(/(<meta property="og:url" content=")([^"]*)(")/, abs(path))
  set(/(<meta property="og:image" content=")([^"]*)(")/, abs(image))
  set(/(<meta name="twitter:title" content=")([^"]*)(")/, fullTitle)
  set(/(<meta name="twitter:description" content=")([^"]*)(")/, description)
  set(/(<meta name="twitter:image" content=")([^"]*)(")/, abs(image))
  const file = path === '/' ? join(dist, 'index.html') : join(dist, path.slice(1), 'index.html')
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, html)
  return path
}

const defaultDescription = /<meta name="description" content="([^"]*)"/.exec(template)?.[1] ?? ''
const written = [page({ path: '/', description: defaultDescription })]

for (const w of markdown('work')) {
  const result = [w.figure, w.figureLabel].filter(Boolean).join(' ')
  written.push(
    page({
      path: `/work/${w.slug}`,
      title: w.title,
      description: `Case study: ${w.company}, ${w.role}. ${result ? result.charAt(0).toUpperCase() + result.slice(1) + '.' : ''}`.trim(),
      image: w.cover || '/og.png',
      type: 'article',
    }),
  )
}
for (const r of experience()) {
  written.push(page({ path: `/experience/${r.slug}`, title: `${r.company} · ${r.role}`, description: r.summary ?? '', type: 'article' }))
}
for (const n of markdown('notes')) {
  written.push(page({ path: `/notes/${n.slug}`, title: n.title, description: n.summary ?? '', type: 'article' }))
}
for (const b of markdown('books')) {
  written.push(page({ path: `/library/${b.slug}`, title: b.title, description: `Notes on ${b.title} by ${b.author}.`, image: b.cover || '/og.png', type: 'article' }))
}

console.log(`prerender: wrote ${written.length} pages${SITE_URL ? ` for ${SITE_URL}` : ' (relative URLs; set SITE_URL for link previews)'}`)
