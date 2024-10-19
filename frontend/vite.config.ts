import path from "path"
import viteReact from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import { defineConfig, loadEnv } from "vite"

export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [TanStackRouterVite(), viteReact()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@server": path.resolve(__dirname, "../backend/"),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: `${env.BASE_URL}:${env.PORT}/api`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})
