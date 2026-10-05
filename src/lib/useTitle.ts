import { useEffect } from 'react'

export function useTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · Ahmad Saleh` : 'Ahmad Saleh · Software Engineer'
  }, [title])
}
