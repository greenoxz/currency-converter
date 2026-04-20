import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'FinFX - Currency Converter & Trip Expense Log',
        short_name: 'FinFX',
        description: 'Convert currencies and log travel expenses. Real-time rates, charts, and a built-in trip tracker.',
        start_url: '/',
        scope: '/',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone', // ทำให้เหมือนเป็นแอปมือถือจริงๆ ปิดแถบ URL ของเบราว์เซอร์
        orientation: 'portrait', // ล็อคหน้าจอแนวตั้งเท่านั้น
        icons: [
          {
            src: '/icon.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          },
          {
            src: '/icon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  server: {
    port: 5175,
    strictPort: true
  }
})
