# Convexia — Frontend

A pixel-faithful React clone of [convexia.bio](https://www.convexia.bio/) — an AI-powered drug sourcing and evaluation platform. Built with Vite, React, Tailwind CSS v4, Framer Motion, and Lucide React.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Features](#features)
- [Pages & Routes](#pages--routes)
- [Global Systems](#global-systems)
- [Theming](#theming)
- [Component Reference](#component-reference)
- [Assets & Media](#assets--media)
- [Customization](#customization)
- [Dependencies](#dependencies)

---

## Overview

This is the complete frontend for Convexia — a biotech AI platform that helps pharma and biotech teams discover, evaluate, and prioritize drug assets. The frontend includes a full marketing landing page, authentication flows (Login, Signup, Forgot Password), and a global design system with dark/light mode support.

---

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| [Vite](https://vitejs.dev/) | ^5 | Build tool & dev server |
| [React](https://react.dev/) | ^18 | UI framework |
| [React Router DOM](https://reactrouter.com/) | ^6 | Client-side routing |
| [Tailwind CSS](https://tailwindcss.com/) | v4 | Utility-first styling |
| [Framer Motion](https://www.framer.com/motion/) | ^11 | Animations & transitions |
| [Lucide React](https://lucide.dev/) | latest | Icons |

---

## Project Structure

```
src/
├── App.jsx              # Root app — routing, ThemeProvider, ToastProvider, all landing page sections
├── Login.jsx            # Login page
├── Signup.jsx           # Signup page with password strength indicator
├── ForgotPassword.jsx   # Forgot password page with animated success state
├── main.jsx             # React DOM entry point
├── index.css            # Global styles, CSS tokens, dark/light mode, custom fonts
└── App.css              # Legacy Vite boilerplate (kept for reference, not actively used)
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/your-org/convexia-frontend.git
cd convexia-frontend

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

Output goes to `dist/`. Preview the production build locally:

```bash
npm run preview
```

---

## Features

### Landing Page
- **Full-screen hero** with background video, animated scroll indicator, and gradient headline
- **7-step process** timeline with actual video embeds for Steps 2, 3, and 7 sourced from Convexia's CDN
- **ConvexiaBench section** with animated benchmark bars and stat cards, backed by a looping video
- **In-Silico Drug Evaluation Stack** — 4 cards with video background overlays
- **Why Our AI is Different** — 3 cards with hover-reveal video effects
- **Full FAQ accordion** — all 7 real questions, animated with `AnimatePresence`
- **Contact form** with loading state, success animation, and toast notification
- **CTA section** with footer background video
- **Molecule canvas** — interactive particle network that reacts to mouse position

### Auth Pages
- Login, Signup, and Forgot Password with matching aesthetic
- Password strength indicator on Signup (Weak → Fair → Good → Strong)
- Animated success state on Forgot Password
- Social login buttons (Google, GitHub)
- All forms fire toast notifications on success/failure

### Global
- **Dark / Light mode** — persisted to `localStorage`, toggled via pill button in navbar
- **Toast notification system** — global context, appears bottom-right, auto-dismisses at 3.8s
- **Scroll-to-top** on every route change
- **Scroll-aware navbar** — transparent at top, frosted glass on scroll
- **Custom fonts** — Syne (display) + DM Sans (body) via Google Fonts
- **Custom scrollbar** — turns accent green on hover

---

## Pages & Routes

| Route | Component | Description |
|---|---|---|
| `/` | `LandingPage` (in `App.jsx`) | Full marketing site |
| `/login` | `Login.jsx` | Sign in form |
| `/signup` | `Signup.jsx` | Account creation form |
| `/forgot-password` | `ForgotPassword.jsx` | Password reset request |

All routes are defined in `App.jsx` using React Router v6 `<Routes>` / `<Route>`.

---

## Global Systems

### ThemeContext

Defined and exported from `App.jsx`. Provides `theme` (`'dark'` | `'light'`) and `toggleTheme()` to the entire tree.

```jsx
import { useTheme } from './App';

const { theme, toggleTheme } = useTheme();
```

Theme is applied by toggling the `.light` class on `<html>`. CSS custom properties in `index.css` handle all visual changes — no JS-driven style injection needed.

### ToastContext

Also defined and exported from `App.jsx`. Call `showToast(message, type)` from anywhere in the app.

```jsx
import { useToast } from './App';

const { showToast } = useToast();

showToast('Account created!');           // success (default)
showToast('Please agree to terms.', 'error');  // error
```

Toasts animate in/out using Framer Motion's `AnimatePresence` and auto-dismiss after 3.8 seconds.

---

## Theming

All colors are defined as CSS custom properties in `index.css` and switch automatically when the `.light` class is on `<html>`.

### Dark Mode Tokens (default)

```css
--bg:           #050505
--surface:      #0f0f0f
--surface2:     #181818
--border:       rgba(255,255,255,0.07)
--accent:       #00ff9d
--accent-blue:  #3b82f6
--text:         #ffffff
--text-muted:   rgba(255,255,255,0.45)
--glow-accent:  rgba(0,255,157,0.12)
--glow-blue:    rgba(59,130,246,0.12)
```

### Light Mode Tokens (`.light` class on `<html>`)

```css
--bg:           #f2f2ee
--surface:      #ffffff
--surface2:     #f8f8f5
--border:       rgba(0,0,0,0.07)
--accent:       #00b870
--accent-blue:  #2563eb
--text:         #0a0a0a
--text-muted:   rgba(0,0,0,0.45)
```

### Fonts

```css
--font-display: 'Syne', sans-serif;   /* headings */
--font-body:    'DM Sans', sans-serif; /* body text */
```

Both are loaded from Google Fonts at the top of `index.css`.

### Tailwind Mapping

Tokens are bridged into Tailwind's `@theme` block so you can use them as Tailwind classes:

```html
class="bg-background text-accent border-surface"
```

---

## Component Reference

### `App.jsx` Exports

| Export | Type | Description |
|---|---|---|
| `ThemeContext` | Context | Raw context object |
| `useTheme` | Hook | `{ theme, toggleTheme }` |
| `ToastContext` | Context | Raw context object |
| `useToast` | Hook | `{ showToast(msg, type) }` |
| `default App` | Component | Root app with providers + router |

### Landing Page Sections (internal to `App.jsx`)

| Component | Section ID | Description |
|---|---|---|
| `Navbar` | — | Fixed top nav with scroll effect + theme toggle |
| `Hero` | — | Full-screen video hero |
| `StepsSection` | `#overview` | 7-step timeline with media |
| `Benchmarks` | `#convexiabench` | Performance stats with video bg |
| `EvalStack` | `#techstack` | 4-card evaluation stack |
| `WhyAI` | `#ai` | 3-card AI differentiators |
| `FAQ` | `#faq` | Accordion with 7 questions |
| `Contact` | `#contact` | Contact form with success state |
| `CTASection` | — | Full-width CTA with video bg |
| `Footer` | — | Links, logo, copyright |

### `MoleculeCanvas`

Used on every page. Renders an interactive particle network on a `<canvas>` element. Respects current theme (dark particles on light bg, light particles on dark bg). Mouse proximity repels nearby particles.

```jsx
<MoleculeCanvas particleCount={55} className="fixed inset-0 ..." />
```

Props:

| Prop | Default | Description |
|---|---|---|
| `particleCount` | `55` | Number of particles |
| `className` | `"fixed inset-0 w-full h-full pointer-events-none z-0 opacity-40 canvas-bg"` | Canvas element class |

---

## Assets & Media

All media is served directly from Convexia's Webflow CDN (`cdn.prod.website-files.com`). No local video or image files are needed.

| Asset | Used In |
|---|---|
| Convexia logo SVG | Navbar, all auth pages, footer |
| Hero video | Hero section |
| ConvexiaBench video | Benchmarks section background |
| Footer/CTA video | CTASection background |
| Scientific eval video (Step 2) | Steps timeline |
| DNA animation (Step 3) | Steps timeline |
| Final review video (Step 7) | Steps timeline |
| Step 6 illustration | Steps timeline |
| HiW background image | StepsSection overlay |
| FAQ background image | FAQ section overlay |
| DNA video | EvalStack card (Binding) |
| Danger wave video | EvalStack card (Off-Target) |
| Face video | WhyAI card (Human-in-Loop) |
| Funnel video | WhyAI card (Training) |

---

## Customization

### Changing the Accent Color

Update `--accent` and `--glow-accent` in `:root` and `.light` inside `index.css`.

### Adding a New Route

1. Create your page component (e.g. `Dashboard.jsx`)
2. Import it in `App.jsx`
3. Add a `<Route path="/dashboard" element={<Dashboard />} />` inside `<Routes>`

### Adding a New FAQ

Find the `FAQS` array near the top of `App.jsx` and append an object:

```js
{ q: "Your question here?", a: "Your answer here." }
```

### Adding a New Step

Find the `STEPS` array in `App.jsx` and add an entry:

```js
{
  id: "08", num: "Step 8",
  title: "Your Step Title",
  sub: "Short subtitle.",
  desc: "Longer description.",
  video: "https://...",   // optional
  image: "https://...",   // optional
  cta: { label: "CTA Label", href: "https://..." },  // optional
}
```

---

## Dependencies

Install everything with:

```bash
npm install react react-dom react-router-dom framer-motion lucide-react
npm install -D vite @vitejs/plugin-react tailwindcss @tailwindcss/vite
```

Full `package.json` dependencies:

```json
{
  "dependencies": {
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.400.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-router-dom": "^6.24.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.0",
    "@tailwindcss/vite": "^4.0.0",
    "tailwindcss": "^4.0.0",
    "vite": "^5.3.0"
  }
}
```

### Vite Config

Make sure `vite.config.js` includes the Tailwind plugin:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

---

## License

Private — © 2025 Convexia. All rights reserved.
