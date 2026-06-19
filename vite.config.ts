import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    dts({
      bundleTypes: true,
      copyDtsFiles: true,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '#': fileURLToPath(new URL('./types', import.meta.url)),
    },
  },
  build: {
    sourcemap: true,
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      name: 'Fexios',
      fileName: 'fexios',
      formats: ['es'],
    },
  },
})
