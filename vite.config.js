import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Chuyển các request /api sang Selenium server (server/index.js)
    proxy: { '/api': 'http://localhost:3001' },
  },
    base: '/automatic-leads-import-tool/',

})
