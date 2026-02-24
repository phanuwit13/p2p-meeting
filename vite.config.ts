import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { cloudflare } from "@cloudflare/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    allowedHosts: ['m2m.queueter.com'],
  },
  plugins: [tailwindcss(), react({
    babel: {
      plugins: [['babel-plugin-react-compiler']],
    },
  }), cloudflare()],
})