# Nanotoxi — Frontend

> AI-powered nanoparticle toxicity prediction platform. Predict toxicity, aggregation, and cytotoxicity in under 0.15 seconds.

---

## Overview

Nanotoxi is a web application frontend for an AI-driven nanoparticle safety assessment platform. It provides a marketing landing page, authentication flows, and a full benchmark results page (NanotoxiBench) showcasing ML model performance.

**Tech Stack:** React 18 · React Router v6 · Framer Motion · Tailwind CSS v4 · Lucide React

---

## Project Structure

```
src/
├── App.jsx              # Root app, routing, shared contexts & landing page
├── Benchmarks.jsx       # /benchmarks — NanotoxiBench full page
├── Login.jsx            # /login — authentication page
├── Signup.jsx           # /signup — registration page
├── ForgotPassword.jsx   # /forgot-password — password reset page
├── useCursorTrail.js    # Canvas-based cursor comet trail utility
├── index.css            # Global styles, CSS variables, Tailwind config
├── App.css              # Legacy Vite scaffold styles (mostly unused)
└── main.jsx             # React entry point
```

---

## Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `LandingPage` (inside App.jsx) | Main marketing landing page |
| `/benchmarks` | `BenchmarksPage` | NanotoxiBench — full ML benchmark results |
| `/login` | `Login` | Sign-in page |
| `/signup` | `Signup` | Registration page |
| `/forgot-password` | `ForgotPassword` | Password reset request |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Install & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Dependencies

```bash
npm install react-router-dom framer-motion lucide-react
```

---

## API Integration

The backend prediction API is hosted at:

```
https://web-production-6a673.up.railway.app
```

**Key endpoints:**

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/predict` | POST | Run toxicity prediction |
| `/contact` | POST | Contact form submission |
| `/share-dataset` | POST | Dataset sharing |

**Example prediction request:**
```json
POST /predict
{
  "size": 50,
  "zeta_potential": -25.4,
  "surface_area": 120.3,
  "dosage": 100,
  "exposure_time": 24,
  "coating": "PEG"
}
```

**External links:**
- App: `https://app.nanotoxi.com/`
- Demo booking: `https://calendly.com/nanotoxi/demo`
- Contact: `contact@nanotoxi.com`

---

## Design System

### CSS Variables (in `index.css`)

| Variable | Dark | Light | Usage |
|----------|------|-------|-------|
| `--bg` | `#050505` | `#f2f2ee` | Page background |
| `--surface` | `#0f0f0f` | `#ffffff` | Cards, panels |
| `--accent` | `#00ff9d` | `#00b870` | Primary green accent |
| `--accent-blue` | `#3b82f6` | `#2563eb` | Secondary blue |
| `--text` | `#ffffff` | `#0a0a0a` | Body text |
| `--text-muted` | `rgba(255,255,255,0.45)` | `rgba(0,0,0,0.45)` | Secondary text |
| `--border` | `rgba(255,255,255,0.07)` | `rgba(0,0,0,0.07)` | Borders |

### Fonts

- **Display:** `Syne` (headings, numbers, logo)
- **Body:** `DM Sans` (paragraphs, UI text)

Both loaded via Google Fonts in `index.css`.

### Theme Toggling

Theme state is stored in `localStorage` under the key `nanotoxi-theme`. The `ThemeProvider` context (in `App.jsx`) toggles a `.light` class on `<html>` and exposes `useTheme()` hook to all components.

---

## Key Features

### Cursor Trail
`useCursorTrail.js` exports `initCursorTrail()` — a canvas-based comet trail that renders on a fixed full-page canvas above all content. It draws a tapered glowing green stroke following the real cursor without hiding it. Called once in `LandingPage` via the `CursorTrail` component.

### Molecule Canvas
The animated particle network background (`MoleculeCanvas`) responds to mouse movement — particles repel from the cursor within a 180px radius. Used on the landing page and all auth pages.

### NanotoxiBench (`/benchmarks`)
Full benchmark results page featuring:
- 4 collapsible benchmark categories (Toxicity, Aggregation, Cytotoxicity, Risk Factor)
- Animated bar charts comparing Nanotoxi vs. 5 baselines per task
- SVG radar chart showing multi-dimensional performance
- Dataset provenance details sidebar
- Sticky sidebar with CTAs

---

## Logo

The current logo is a text-based wordmark (`Nano` + `toxi` in accent green) combined with a `FlaskConical` icon from Lucide. To replace with an SVG logo file:

1. Place your logo at `public/nanotoxi-logo.svg`
2. In `App.jsx`, find the `<a href="/" className="flex items-center gap-3 group">` in `Navbar` and replace the icon+wordmark with:
   ```jsx
   <img src="/nanotoxi-logo.svg" alt="Nanotoxi" className="h-[22px]" />
   ```
3. Repeat for the `Footer` component and auth page logos.

---

## Deployment

### Vite Build

```bash
npm run build
# Output: dist/
```

### Environment Notes

- The app uses client-side routing (React Router). Your hosting provider must redirect all routes to `index.html`.
  - **Netlify:** add `public/_redirects` with `/* /index.html 200`
  - **Vercel:** add `vercel.json` with rewrites
  - **Nginx:** add `try_files $uri /index.html`

### Vercel (`vercel.json`)
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Netlify (`public/_redirects`)
```
/*  /index.html  200
```

---

## Branding Notes

- **Do not** reference Convexia anywhere — the project has been fully rebranded to Nanotoxi
- Theme localStorage key: `nanotoxi-theme` (was `cvx-theme`)
- All external links point to `nanotoxi.com` / `app.nanotoxi.com`
- Contact email: `contact@nanotoxi.com`

---

## Changelog

| Version | Changes |
|---------|---------|
| 1.0.0 | Initial Nanotoxi rebrand from Convexia |
| 1.1.0 | Routing fixes, cursor trail, stats ticker, artistic upgrades |
| 1.2.0 | Canvas cursor trail (`useCursorTrail.js`), `/benchmarks` page (NanotoxiBench), README |

---

© 2025 Nanotoxi. All rights reserved.
