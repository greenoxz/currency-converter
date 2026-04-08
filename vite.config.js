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
        enabled: true // เปิดให้เทสต์โหมด PWA ใน localhost (dev) ได้ด้วย
      },
      manifest: {
        name: 'FishyCurrency Exchange',
        short_name: 'FishyCurrency',
        description: 'แอปเช็คเรทแลกเปลี่ยนเงินตรา Real-time',
        start_url: '/',
        scope: '/',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone', // ทำให้เหมือนเป็นแอปมือถือจริงๆ ปิดแถบ URL ของเบราว์เซอร์
        orientation: 'portrait', // ล็อคหน้าจอแนวตั้งเท่านั้น
        icons: [
          {
            src: '/icon.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
