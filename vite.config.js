import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { versionedMedia } from './scripts/versioned-media.mjs'

export default defineConfig({
  plugins: [versionedMedia(), react(), tailwindcss()],
})
