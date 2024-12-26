import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '#': fileURLToPath(new URL('./types', import.meta.url)),
    },
  },
  build: {
    sourcemap: true,
    lib: {
      entry: './src/index.ts',
      name: 'Fexios',
      fileName: 'fexios',
    },
  },
})
