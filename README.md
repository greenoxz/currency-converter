# 💸 MoneyX - Mobile Currency & Expense Tracker

A modern, mobile-first Progressive Web App (PWA) designed to track, convert, and log currency exchange rates seamlessly. Built with React and Vite.

## ✨ Features

- **💱 Dual-Box Converter**: Instantly convert between 20+ supported world currencies using a clean interface.
- **📊 Interactive Charts**: View 30-day historical data charts for currency pairs.
- **📓 Expense & Rate Tracker**: Save specific exchange records when traveling or spending abroad. Swap reference rates natively.
- **⚖️ Live Profit & Loss**: Automatically compare your saved historical exchange rate with today's live mid-market rate to calculate gains or losses.
- **🌐 Offline-First System**: Intelligently detects network status. View and calculate conversions using cached rates seamlessly while offline (without internet connection).
- **🌍 Multi-Language Ready**: Instantly switch between English (EN), Thai (TH), and Chinese (ZH) with native country flag integrations.
- **📱 Clean Minimalist UI**: Crafted with a premium distraction-free, white/gray minimalist mobile interface layout.

## 🚀 Tech Stack

- **Framework**: React.js + Vite
- **Styling**: Vanilla CSS (Design Tokens, Clean Grid/Flexbox Layouts)
- **Data Visualization**: Recharts
- **Offline / PWA**: `vite-plugin-pwa`

## 🛠️ Installation & Setup

1. Clone or download the repository
2. Install dependencies via npm:
   ```bash
   npm install --legacy-peer-deps
   ```
   *(Note: `--legacy-peer-deps` must be used to safely install alongside `vite-plugin-pwa` compatibility)*

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

## 📦 Building for Production

Compile the progressive web app functionality and components for production:
```bash
npm run build
```
The output will be constructed inside the `dist/` directory, complete with service workers and `manifest.webmanifest`. You can host this static bundle on any provider like GitHub Pages, Vercel, or Netlify.

## 🎨 UI/UX Notes
- Application strictly enforces a maximum width of `500px` centered on wide screens to mimic a native iPhone/Android application window.
- Fully relies on scalable, high-resolution vector SVGs and `flagcdn.com` logic to bypass operating system emoji rendering flaws globally.
