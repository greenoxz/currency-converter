# 💸 FishyCurrency - Mobile Currency & Expense Tracker

**Live Demo:** [https://currency-converter-git-main-greenoxzs-projects.vercel.app/](https://currency-converter-git-main-greenoxzs-projects.vercel.app/)

A premium, mobile-first Progressive Web App (PWA) designed to track, convert, and log currency exchange rates with high precision and minimalist aesthetic. Built with React and Vite.

## ✨ Features

- **💱 Dual-Box Converter**: Instantly convert between 20+ supported world currencies using a clean, distraction-free interface.
- **🚀 Premium Data Sync**: Supports **ExchangeRate-API v6** with private API keys for highly accurate, fast, and reliable rate updates. (Fallback to Global API v4 included).
- **📈 Interactive Live Charts**: View 30-day historical data charts scaled to match current live market rates.
- **📓 Triple-Language Support**: Seamlessly switch between Thai (TH), English (EN), and Chinese (ZH) with beautiful circular flag icons.
- **⚖️ Expense Tracker**: Save exchange records with custom titles. Automatically compares your saved "Actual Rate" with today's live rate to calculate profit or savings.
- **🌐 Offline functionality**: Full PWA support with automatic network detection. View your last-fetched rates even without an internet connection.
- **📱 Native App Experience**: 
  - One-click **Install** button directly in the UI.
  - Locked to **Portrait Orientation** for a consistent mobile feel.
  - **Disable Copying**: Text selection is disabled across the app to prevent accidental highlights and mimic a native mobile application.

## 🚀 Tech Stack

- **Framework**: React.js + Vite
- **Styling**: Vanilla CSS (Strict Minimalist Design Tokens)
- **Data Visualization**: Recharts
- **Offline / PWA**: `vite-plugin-pwa`
- **Infrastructure**: Optimized for Vercel / GitHub Pages

## 🛠️ Installation & Setup

1. Clone the repository.
2. Create a `.env` file in the root directory and add your API Key:
   ```bash
   VITE_ER_API_KEY=your_api_key_here
   ```
3. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
   *(Note: Use `--legacy-peer-deps` to ensure compatibility with Vite 8 and PWA plugins).*

4. Run development server:
   ```bash
   npm run dev
   ```

## 📦 Deployment Note (Vercel)
This project includes an `.npmrc` file configured for `legacy-peer-deps=true` to ensure zero-config deployment on Vercel and CI/CD pipelines.

## 🎨 Design Philosophy
FishyCurrency adheres to a strictly minimalist, high-contrast UI. It bypasses OS-level emoji rendering issues by using high-resolution circular vector flags and pure SVG icons. No generic emojis are used to preserve a professional financial tool aesthetic.
