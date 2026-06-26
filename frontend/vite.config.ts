import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

// ポートは固定（別ポート起動は将来の CORS/プロキシ前提を崩すため）。
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5176,
    strictPort: true,
    fs: { allow: ['..'] }, // リポ直下の単一ソース ../data を読むため
  },
  resolve: {
    alias: { '@data': path.resolve(__dirname, '../data') },
  },
})
