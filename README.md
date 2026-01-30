# wentao.gg

Personal portfolio website showcasing projects, experience, and skills.

## Tech Stack

- **Framework:** Next.js 16
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Deployment:** Vercel

## Features

- Dark/light theme toggle
- Responsive design (mobile-first)
- Interactive animations and effects
- Collapsible sections for projects and experience
- Project showcase with category organization

## Projects

- **₿ Crypto**
  - 🐋 Tracker - Hyperliquid whale leaderboard

- **🏋️ Powerlifting**
  - PowerOPPS - Powerlifting index calculator
  - What's my RPE? - Velocity-based RPE predictor (coming soon)

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Changelog

### 2025-01-30
- Added HL Whale Tracker project (`/projects/hl-whale-tracker`)
  - Hyperliquid trader leaderboard with PnL, win rate, Sharpe ratio metrics
  - Sortable columns and time period filters (24h, 7d, 30d, All)
  - Mobile-responsive table and card views
  - API integration with rate limiting and retry logic
- Reorganized projects into collapsible categories (₿, 🏋️)
- Added collapsible job descriptions in Experience section
- Updated navigation with nested project dropdown
- Mobile responsive improvements throughout
