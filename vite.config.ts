import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Listen on the local network too, so the site opens on a phone on the same Wi-Fi.
  server: { host: true },
})
