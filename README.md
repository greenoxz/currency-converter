# FishyCurrency Exchange

[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

**Live:** [currency-converter-git-main-greenoxzs-projects.vercel.app](https://currency-converter-git-main-greenoxzs-projects.vercel.app/)

---

A mobile-first currency converter PWA I built for personal use — mainly for checking exchange rates and keeping track of spending while traveling. It started as a simple converter but grew into something more useful over time, so I figured I'd put it on GitHub.

## What it does

**Converter** — Pick two currencies and type an amount. It converts both ways so you don't have to flip the inputs. Supports 20+ fiat currencies plus the major cryptos (BTC, ETH, SOL, BNB) via CoinGecko. You can dial in a specific decimal precision or just leave it on auto.

**Charts** — See how a currency pair has moved over time. Ranges go from 1 hour up to 5 years. The chart scales dynamically so small shifts actually show up instead of being a flat line.

**Expense log** — Save an exchange transaction with notes and a category (food, shopping, accommodation, etc.). When you look back at old entries, it shows you the rate you used vs. what the rate is today, so you can see if you got a good deal or not.

**PWA** — Works offline using cached data from your last sync. Installs to the home screen on both iOS and Android and locks to portrait, so it feels like an actual app.

## Stack

- React 19 + Vite 8 + TypeScript
- Vanilla CSS (no framework)
- Recharts for the charts
- ExchangeRate-API v6 for fiat rates
- CoinGecko API for crypto prices
- `vite-plugin-pwa` for service worker / install support
- Capacitor (Android build target)

## Running locally

You'll need an API key from [ExchangeRate-API](https://www.exchangerate-api.com/).

```bash
git clone https://github.com/greenoxz/currency-converter.git
cd currency-converter
```

Create a `.env` file in the project root:

```
VITE_ER_API_KEY=your_key_here
```

Then:

```bash
npm install --legacy-peer-deps
npm run dev
```

## A few design decisions worth noting

- No emojis anywhere in the UI. Different OSes render them differently and it looks inconsistent, especially on older Android devices.
- Everything is SVG or icon font — no emoji flags either, those are even worse.
- Dark mode only. The app is meant to be used on a phone screen in all kinds of lighting, so a light theme wasn't worth adding.

## License

MIT — do whatever you want with it.

---

_Made by [Greenoxz](https://github.com/greenoxz)_
