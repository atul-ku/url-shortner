import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // The proxy is the key DevOps trick here.
    // During development, the React app runs on :5173 and the API on :3000.
    // Without the proxy, the browser blocks cross-origin requests (CORS).
    // With this proxy, any request to /api/* from the frontend is
    // silently forwarded to http://localhost:3000 — the browser never sees it.
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})