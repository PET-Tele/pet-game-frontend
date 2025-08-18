import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    optimizeDeps: {
      include: ['@chakra-ui/react', '@emotion/react', '@emotion/styled', 'framer-motion'],
    },
    server: {
      proxy: {
        '/api/v1': {
          target: 'http://localhost:3333', // Fastify server URL
          changeOrigin: true,
          secure: false,
        },
      },
    },
    define: {
      'process.env': {
        BACK_API_URL: env.BACK_API_URL
      }
    },
  }
})
