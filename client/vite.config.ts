import path from 'path'
import { cloudflare } from '@cloudflare/vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), cloudflare()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
})
