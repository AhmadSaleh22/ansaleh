# Ahmad Saleh — personal site

React 19, TypeScript, Vite, Tailwind CSS 4, Motion, React Router. Content lives in files under `src/content/`, so updating the site never means touching components.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static files in dist/
```

## Structure

```
src/content/   work/*.md, notes/*.md, projects.ts, books.ts, site.ts
src/components/  Gallery, Bio, Library, Prose, ...
src/pages/     Home, WorkPage, NotePage, NotFound
src/styles/    global.css  (design tokens, dark mode, prose rules)
public/        fonts, books/, work/, notes/ (images and videos)
```

## Add a note

1. Copy `src/content/notes/_example.md` to e.g. `src/content/notes/watch-them-work.md`. The file name becomes the address `/notes/watch-them-work`.
2. Fill in `title`, `date` (YYYY-MM-DD) and an optional `summary`, then write below.
3. `##` is a section title (accent red), `###` a grey sub-label.
4. Images and videos: put them in `public/notes/` and write `![Caption](/notes/file.jpg)` (`.mp4` and `.webm` work too). They break out to 880px.

Files starting with `_` are ignored. The Notes section appears on the home page once one note exists. Note numbers follow date order, oldest first.

## Add a case study

Each file in `src/content/work/` is one gallery frame and one page at `/work/<file-name>`. Copy an existing file. Front matter: `order` (position in the gallery), `title`, `company`, `role`, `period`, and `figure` / `figureLabel` (the result shown in a frame that has no media yet).

## Add a gallery image or video

Put the file in `public/work/` and add one line to the case study's front matter:

```
cover: /work/syntax.jpg      # image, ideally 1600×1000 (16:10)
video: /work/syntax.mp4      # optional; muted, looping, autoplays (not with reduced motion)
```

If both are set, `cover` becomes the video poster. The same media shows at the top of the case-study page.

## Experience

The Experience list on the home page comes from `src/content/experience.ts`. Keep it in step with the CV.

## Add a project to the gallery

Projects live in `src/content/projects.ts`. Give one a `frame` and it also appears in the Work gallery after the case studies, linking to its GitHub repo:

```ts
frame: { title: '…', stack: 'Next.js, NestJS', image: '/work/serveo-home.jpg' }
```

Use `anchor: 'end'` for Arabic (RTL) screenshots so the right side stays in view.

## Add a book and its notes

Each book is a Markdown file in `src/content/books/`, and it gets its own page at `/library/<file-name>`. Copy `_example.md` (files starting with `_` are ignored), fill in `title`, `author`, `cover` (an image in `public/books/`), `order` and an optional `status` such as Reading or Finished, then write your notes and what you learned below the top block. `##` and `###` headings, lists, quotes and images all work. Until you write notes, the page says they're coming.

## Other content

Bio, title, links and place: `src/content/site.ts`.

## Design tokens

Defined at the top of `src/styles/global.css` (light and dark). Inter is self-hosted from `public/fonts/` and preloaded, with a metric-matched fallback to avoid layout shift.

## Hosting

It is a single-page app, so the host must serve `index.html` for every path. `public/_redirects` does this on Netlify-style hosts.
