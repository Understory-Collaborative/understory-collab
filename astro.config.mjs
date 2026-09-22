import { defineConfig } from 'astro/config'
import react from '@astrojs/react'

// Astro migration (docs/astro-migration-plan.md). Static output with no Vercel adapter, so
// Vercel keeps deploying the root `api/` folder as serverless functions beside the built
// pages, the way it does for the Vite build today. The adapter's build output would replace
// that folder, which is the risk phase 0 exists to rule out.
export default defineConfig({
  site: 'https://understorycollab.com',
  output: 'static',
  integrations: [react()],
})
