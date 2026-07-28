import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [react(), tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-192.png', 'icons/icon-header-512.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png'],
      manifest: {
        id: '/flowchart/',
        name: 'Flowchart BCC UFRJ',
        short_name: 'Flowchart BCC',
        description: 'Fluxograma interativo da grade curricular atual de Ciência da Computação da UFRJ',
        start_url: '/flowchart/',
        scope: '/flowchart/',
        display: 'standalone',
        background_color: '#0a0a0a',
        theme_color: '#000000',
        icons: [
          {
            src: '/flowchart/icons/icon-header-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/flowchart/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/flowchart/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/flowchart/icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        navigateFallback: '/flowchart/index.html',
      },
    }),
  ],
  base: "/flowchart/"
})