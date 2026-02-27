# 🧬 NanoToxi AI — Nanoparticle Toxicity Prediction Platform

> **AI-powered nanoparticle safety assessment** — delivering instant toxicity predictions, aggregation risk scores, and cytotoxicity analysis to accelerate safer nanomaterial research.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Pages & Routes](#pages--routes)
- [Design System](#design-system)
- [UI Components & Animations](#ui-components--animations)
- [Authentication](#authentication)
- [AI Demo Widget](#ai-demo-widget)
- [Benchmarks Page](#benchmarks-page)
- [Environment & API](#environment--api)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

NanoToxi AI is a full-featured **React web application** that serves as the frontend for an ML-powered nanoparticle toxicity prediction API. The platform allows researchers, scientists, and organizations to:

- Submit nanoparticle properties (size, charge, material, coating, etc.) and receive instant **toxicity predictions**
- View **aggregation risk** and **cytotoxicity scores**
- Explore **benchmark comparisons** (NanotoxiBench) against baseline models
- Access the platform via a beautifully designed, cinematic landing page

The project is production-ready in terms of UI/UX, with full dark/light theme support, smooth scroll animations, scroll-driven canvas visualizations, and a polished authentication flow.

---

## Features

- 🔬 **AI Toxicity Prediction** — Submit nanoparticle parameters and get real-time predictions with confidence scores, risk factors, and cytotoxicity scores; falls back to heuristic simulation when the API is offline
- 📊 **NanotoxiBench** — Benchmark page comparing model performance across datasets with animated bar charts and accuracy metrics
- 🎨 **Cinematic Landing Page** — Hero section with scroll-driven animations, stats ticker, 3-step how-it-works flow, bento feature grid, FAQ, contact form, and CTA
- 🌗 **Dark / Light Theme** — Full theme toggle persisted across the app via React Context and CSS custom properties
- ✨ **Smooth Scroll** — Powered by [Lenis](https://github.com/studio-freight/lenis) for silky-smooth inertia scrolling
- 🖱️ **Cursor Trail** — Canvas-based electric-blue comet trail that follows the cursor across all pages
- 🔐 **Auth Pages** — Login, Signup (with password strength meter), and Forgot Password flows; mock OAuth for Google & GitHub
- 🎞️ **Preloader** — Cinematic "Initializing ML Pipeline" counter shown once per session
- 🧲 **Magnetic Buttons** — Spring-physics magnetic hover effect on primary CTA buttons
- 📡 **Animated Background Canvases** — Particle molecule network across auth pages and the landing page
- 🔔 **Toast Notifications** — Animated slide-up toast system for user feedback
- 📱 **Fully Responsive** — Mobile-first layouts across all pages

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 18 with Vite |
| **Routing** | React Router v6 |
| **Animations** | Framer Motion |
| **Smooth Scroll** | Lenis |
| **Icons** | Lucide React |
| **Styling** | Tailwind CSS v4 + CSS Custom Properties |
| **Fonts** | Syne (display) · DM Sans (body) via Google Fonts |
| **Canvas FX** | Vanilla Canvas API (particle networks, scroll animations, cursor trail) |
| **API** | Railway-hosted ML backend (`web-production-6a673.up.railway.app`) |

---

## Project Structure

```
src/
├── App.jsx                  # Root app — Router, providers, layout, all major sections
├── Benchmarks.jsx           # NanotoxiBench comparison page
├── Login.jsx                # Login page with OAuth + email/password
├── Signup.jsx               # Signup page with password strength indicator
├── ForgotPassword.jsx       # Forgot password flow with email confirmation state
├── ScrollAnimations.jsx     # Canvas-based scroll-driven animation components
├── useCursorTrail.js        # Imperative canvas cursor comet trail initializer
├── main.jsx                 # React entry point
├── index.css                # Design tokens, Tailwind config, global styles
└── App.css                  # Legacy Vite scaffold styles (minimal usage)

public/
└── nanologo.png             # Brand logo (used across navbar, auth pages, footer)
```

---

## Getting Started

### Prerequisites

- Node.js **18+**
- npm or yarn

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-org/nanotoxi-ai.git
cd nanotoxi-ai

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
npm run preview
```

---

## Pages & Routes

| Route | Component | Description |
|---|---|---|
| `/` | `LandingPage` | Full marketing landing page |
| `/login` | `Login` | Sign-in with email/password or OAuth |
| `/signup` | `Signup` | Account creation with password strength |
| `/forgot-password` | `ForgotPassword` | Email reset link flow |
| `/benchmarks` | `BenchmarksPage` | Model benchmark comparisons |

### Landing Page Sections

The landing page (`/`) is composed of the following sections, in order:

1. **`Navbar`** — Sticky glassmorphic nav with theme toggle, mobile hamburger menu, and animated link underlines
2. **`Hero`** — Full-viewport headline with gradient text, animated badge, dual CTA magnetic buttons, and scroll indicator
3. **`StatsTicker`** — Horizontally scrolling ticker of key platform statistics
4. **`StepsSection`** — Sticky scroll 3-step workflow (Input → Evaluate → Report) with canvas animations per step
5. **`EvalStack`** — Bento-style feature grid highlighting the evaluation capabilities
6. **`WhyAI`** — Second feature bento grid for AI-specific differentiators
7. **`FAQ`** — Accordion-style frequently asked questions
8. **`Contact`** — Contact form section
9. **`DemoWidget`** — Interactive nanoparticle property form with live API prediction results
10. **`CTASection`** — Full-bleed video background call-to-action
11. **`Footer`** — Site links, logo, copyright

---

## Design System

The design system is defined entirely via **CSS custom properties** in `index.css`, enabling instant dark/light mode switching without any JavaScript class toggling beyond applying `.light` to the root element.

### Color Tokens

| Token | Dark Mode | Light Mode |
|---|---|---|
| `--bg` | `#040810` (deep navy) | `#f0f4fb` |
| `--surface` | `#080e1c` | `#ffffff` |
| `--surface2` | `#0d1526` | `#e8eff9` |
| `--accent` | `#00c6ff` (electric blue) | `#0080b3` |
| `--accent-blue` | `#2563eb` | `#1d4ed8` |
| `--text` | `#e8f0ff` | `#060d1c` |
| `--text-muted` | `rgba(200,220,255,0.58)` | `rgba(6,13,28,0.60)` |

### Typography

- **Display / Headings** — `Syne` (weights 400–800), applied via `--font-display`
- **Body** — `DM Sans` (weights 300–600), applied via `--font-body`
- Large headings use `clamp()` for fluid responsive sizing

### Utility Classes

| Class | Purpose |
|---|---|
| `.gradient-text` | Accent-to-blue gradient text fill |
| `.glass-panel` | Glassmorphic card with backdrop blur |
| `.feature-card` | Cinematic card with deep glow shadow |
| `.section-eyebrow` | Small all-caps section label |
| `.heading-display` | Fluid responsive display heading |
| `.glow-accent` | Electric blue box-shadow glow |
| `.bench-bar` | Benchmark progress bar track |
| `.global-noise` | Full-screen film grain overlay (fixed, z-index 9998) |

---

## UI Components & Animations

### Preloader (`Preloader`)

A full-screen animated counter that runs from 0→100% on first load only. Uses a module-level flag (`globalAppLoaded`) to skip the preloader on subsequent in-session navigation back to `/`.

### Cursor Trail (`useCursorTrail.js`)

An imperative canvas element appended to `document.body` that renders a tapering electric-blue comet trail following the mouse. Initialized once at the Router level and persists across all route changes. Returns a cleanup function to remove the canvas and event listeners.

### Molecule Canvas (on auth pages & landing)

Each auth page and the landing page renders an animated particle network on a `<canvas>` element. Particles drift slowly and connect with faint lines when within proximity. Color adapts to dark/light theme. The canvas is fixed-position, `pointer-events: none`, layered below all content.

### Scroll Animations (`ScrollAnimations.jsx`)

The **StepsSection** uses Framer Motion's `useScroll` + `useTransform` for parallax-style scroll progress, combined with dedicated canvas components (`AnimCanvas`, `AggregationCanvas`, `ToxicityHexCanvas`, `CytotoxicityCanvas`, `RiskRadarCanvas`, `DataHelixCanvas`, `ReportMatrixCanvas`, `ValidationMeshCanvas`, `NanoInputCanvas`, `ExpertValidationCanvas`) that render scientific visualizations for each workflow step.

### Magnetic Buttons (`MagneticButton`)

A Framer Motion `useMotionValue` + `useSpring` implementation that pulls the button and its inner text toward the cursor on hover, creating a satisfying magnetic 3D parallax effect. Supports `href` (external links) and `to` (React Router links).

### Toast Notifications (`ToastProvider`)

A React Context-based toast system. Call `showToast(message, type)` from any child component. Toasts animate in with a slide-up + scale animation and auto-dismiss after ~3 seconds.

### Theme Toggle (`ThemeProvider`)

A React Context exposing `{ theme, toggleTheme }`. The current theme is persisted to `localStorage`. Toggling applies/removes the `.light` class on `document.documentElement`, which cascades all CSS token overrides.

---

## Authentication

All three auth pages (`Login`, `Signup`, `ForgotPassword`) share these characteristics:

- **Animated molecule particle canvas** as background
- **Glassmorphic card** with backdrop blur
- **CSS variable-driven** inputs that respect dark/light theme
- **Toast feedback** for all actions
- **Mock OAuth** for Google and GitHub (1.5s simulated delay, then navigates to `/`)

### Signup-specific

- **Password strength meter** — evaluates length (≥8), uppercase, numbers, and special characters; renders a 4-segment color-coded bar with labels (Weak / Fair / Good / Strong)
- **Terms & Conditions checkbox** — custom animated checkbox; form blocks submission if unchecked

### ForgotPassword-specific

- Two-state UI: email form → confirmation screen (animated with `AnimatePresence`)
- Confirmation screen shows the submitted email address and a button to open Gmail

---

## AI Demo Widget

Located at the bottom of the landing page (`DemoWidget`), this interactive section lets users test the API directly:

**Input fields:**
- Nanoparticle Size (nm)
- Surface Charge (mV, zeta potential)
- Material (Gold, Silver, Iron Oxide, Silica, Carbon Nanotube, TiO₂, ZnO, Quantum Dot)
- Coating (PEG, Citrate, Amine, CTAB, Bare/None, Dextran, Lipid)
- Concentration (μg/mL)
- Exposure Duration (hours)

**Prediction result card shows:**
- Binary toxicity prediction (Toxic / Non-Toxic) with color coding
- Confidence percentage
- Aggregation Risk (HIGH/LOW)
- Cytotoxicity Score
- Top risk factors / safety indicators (bulleted list)
- Offline simulation notice if the backend API is unreachable

**API endpoint:** `POST https://web-production-6a673.up.railway.app/predict`

When the API is offline, the widget falls back to a deterministic heuristic simulation based on the input values (size, charge, material type) to still return a meaningful result.

---

## Benchmarks Page

The `/benchmarks` route (`Benchmarks.jsx`) presents **NanotoxiBench**, a curated benchmark comparison of the NanoToxi model against established baselines.

Features:
- Animated header with particle canvas background
- Per-dataset accuracy bar charts with smooth animated fills
- Model comparison table
- Metric explanations (Accuracy, F1, AUC-ROC, etc.)
- Responsive card layout

---

## Environment & API

The ML backend is hosted externally on Railway. No environment variables are required to run the frontend in development — the API URL is hardcoded in `App.jsx`:

```
https://web-production-6a673.up.railway.app/predict
```

If you are self-hosting the backend, update this URL in the `DemoWidget` component inside `App.jsx`.

**Expected request body (POST `/predict`):**

```json
{
  "size": 50,
  "charge": -20,
  "material": "Gold",
  "coating": "PEG",
  "concentration": 100,
  "exposure_time": 24
}
```

**Expected response:**

```json
{
  "prediction": "Non-Toxic",
  "confidence": 0.94,
  "aggregation_risk": "LOW",
  "cytotoxicity_score": 0.12,
  "top_risk_factors": ["Low surface charge reduces aggregation", "PEG coating improves biocompatibility"]
}
```

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please follow the existing code style — components are co-located in `src/`, CSS tokens are defined in `index.css`, and all theme-sensitive values use CSS custom properties rather than hardcoded colors.

---

## License

© 2025 Nanotoxi. All rights reserved.

---

<div align="center">
  <sub>Built with React · Framer Motion · Lenis · Tailwind CSS · Canvas API</sub>
</div>
