import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons.svg'],
      manifest: {
        name: 'DataLearn Platform',
        short_name: 'DataLearn',
        description: 'Interactive data science learning platform',
        theme_color: '#4f46e5',
        background_color: '#ffffff',
        display: 'standalone',
        display_override: ['window-controls-overlay', 'standalone', 'browser'],
        scope: '/learn/',
        start_url: '/learn/',
        orientation: 'portrait-primary',
        categories: ['education', 'productivity'],
        screenshots: [
          {
            src: '/learn/screenshots/desktop.png',
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Learning Platform — desktop view',
          },
          {
            src: '/learn/screenshots/mobile.png',
            sizes: '390x844',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Learning Platform — mobile view',
          },
        ],
        shortcuts: [
          {
            name: 'Dashboard',
            short_name: 'Dashboard',
            url: '/learn/#/dashboard',
            icons: [{ src: '/learn/pwa-192x192.png', sizes: '192x192' }],
          },
          {
            name: 'Curriculum',
            short_name: 'Curriculum',
            url: '/learn/#/curriculum',
            icons: [{ src: '/learn/pwa-192x192.png', sizes: '192x192' }],
          },
          {
            name: 'Playground',
            short_name: 'Playground',
            url: '/learn/#/playground',
            icons: [{ src: '/learn/pwa-192x192.png', sizes: '192x192' }],
          },
        ],
        icons: [
          {
            src: '/learn/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/learn/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/learn/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        navigateFallback: '/learn/index.html',
        navigateFallbackDenylist: [/^\/learn\/api/],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api',
              networkTimeoutSeconds: 10,
            },
          },
        ],
      },
    }),
  ],
  base: '/learn/',
})
