import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import './styles/global.css'

// Without the View Transitions API, routes fade in with CSS instead.
if (typeof (document as Document & { startViewTransition?: unknown }).startViewTransition !== 'function') document.documentElement.classList.add('no-vt')

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      // Markdown rendering only loads when a case study or note is opened.
      { path: 'work/:slug', lazy: async () => ({ Component: (await import('./pages/WorkPage')).WorkPage }) },
      { path: 'experience/:slug', lazy: async () => ({ Component: (await import('./pages/ExperiencePage')).ExperiencePage }) },
      { path: 'library/:slug', lazy: async () => ({ Component: (await import('./pages/BookPage')).BookPage }) },
      { path: 'notes/:slug', lazy: async () => ({ Component: (await import('./pages/NotePage')).NotePage }) },
      { path: '*', element: <NotFound /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
