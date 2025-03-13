import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

const scssOptions: Array<string> = [
  `@use "@/styles/colors" as *;`,
  `@use "@/styles/mixins" as *;`,
  `@use "@/styles/variables" as *;`,
];

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/hspc2025/",
  server: {
    port: 3000
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `${scssOptions.join("\n")}\n`
      }
    }
  },
  define: {
    BUILD_TIME: Date.now().toString()
  },
  resolve: {
    alias: {
      "@": "/src"
    }
  },
})
