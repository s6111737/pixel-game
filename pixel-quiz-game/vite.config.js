import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // 確保編譯後的資源路徑使用相對路徑，適合 GitHub Pages
})
