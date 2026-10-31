import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// In development, /api and /uploads are forwarded to RecetteVie running locally
// (php -S 127.0.0.1:8000 -t public router.php), so the browser sees a single origin.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const recetteVie = env.RECETTEVIE_URL || 'http://127.0.0.1:8000'

  return {
    base: env.VITE_BASE || '/',
    plugins: [react()],
    server: {
      proxy: {
        '/api': recetteVie,
        '/uploads': recetteVie,
      },
    },
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.js'],
    },
  }
})
