import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  root: 'src',
  base: './',
  plugins: [react()],
  build: {
    // куда складывать готовый бандл (одним уровнем выше)
    outDir: '../dist',
    emptyOutDir: true,
  },
  server: {
    host: true,
    open: true,       // автоматически откроет браузер
    port: 5500        // можно изменить при необходимости
  }
})
