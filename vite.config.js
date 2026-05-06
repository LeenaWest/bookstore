import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/bookstore/', // This is crucial for GitHub Pages
  plugins: [react()]
})
