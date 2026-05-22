import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Suaib65.github.io/',  // if repo is named Suaib65.github.io
  // OR
  base: '/',  // only if repo name = username.github.io exactly
})
