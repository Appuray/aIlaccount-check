# Project: AI Account Limit Manager (QuotaCheck / NEURA-LINK)

This project is a React-based dashboard for managing multiple AI service accounts (Gemini, ChatGPT, Claude, etc.), tracking their usage limits, and optimizing selection based on health, priority, and service tier. It features an Awwwards-winning level landing page with immersive scroll animations.

## Tech Stack
- **Framework:** [React 19](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite 6](https://vitejs.dev/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand) with persistence
- **Styling:** [Tailwind CSS 4.0](https://tailwindcss.com/)
- **Animations:** GSAP (`gsap`, `@gsap/react`), [Framer Motion](https://www.framer.com/motion/) (`motion/react`)
- **Smooth Scrolling:** [Lenis](https://github.com/darkroomengineering/lenis)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Charts:** [Recharts](https://recharts.org/)
- **Utilities:** `clsx`, `tailwind-merge`

## Core Architecture

### 1. State Management (`src/store.ts`)
The application uses a single Zustand store with the `persist` middleware to save account data and usage history to `localStorage` (key: `aim_v5_ultimate`).
- **Persistence Logic:** Includes a rehydration handler that automatically resets accounts if their `resetAt` timestamp has passed.
- **Key Actions:** `markExhausted`, `resetAccount`, `addAccount`, `getBestAccount` (recommendation engine).
- **Theme/Filters:** The store manages the global `theme` (system/light/dark) and dashboard filter states (`selectedStatus`, `selectedTag`).

### 2. UI Structure
- `Landing.tsx`: An Awwwards-style immersive landing page featuring a custom preloader, SVG animations, Lenis smooth scrolling, and complex GSAP scroll-triggers (Bento Grid, word reveals, parallax images).
- `App.tsx`: Main layout with a sidebar for navigation between Dashboard, Analytics, Logs, and Settings.
- `Dashboard.tsx` & `AccountGrid.tsx`: Displays accounts as interactive cards with multi-dimensional filtering (by Tag and Status: All, Operational, Exhausted).
- `UsageStats.tsx`: Visualizes exhaustion data using Recharts.

## Key Workflows

### Adding an Account
Users can add a new AI node via the "Deploy New Node" button. They specify the name, service, tier, priority, and tags. The store generates a unique ID and assigns a color.

### Marking Exhausted & Auto-Reset
When an account hits its limit, clicking "Mark Exhausted" on its card sets an `exhaustedAt` and `resetAt` timestamp. On application load (or rehydration), any account whose `resetAt` time is in the past is automatically reset to an available (Operational) state.

### Recommendation Engine
The `getBestAccount` function identifies the most suitable available account based on:
1. Availability (not exhausted)
2. Tag matching (if a filter is applied)
3. Priority (1-5)
4. Health (0-100)
5. Tier (Pro vs. Free)

## Styling Conventions

### Theming & Colors (`src/index.css`)
- **Strict CSS Variables:** The application strictly uses CSS variables for its color palette (`--color-brand-bg`, `--color-brand-surface`, `--color-brand-accent`, etc.).
- **No Hardcoded Dark Classes:** We explicitly **avoid** using Tailwind's `dark:` classes (e.g., `dark:bg-black`, `dark:text-white`) in components. Instead, we rely entirely on the base variable classes (e.g., `bg-brand-bg`, `text-brand-text`). The values of these variables automatically swap inside the `.dark` selector defined in `index.css`.
- **Current Palette:** A high-contrast premium theme.
  - Light mode: Off-white background (`#F5F5F5`), light mint surfaces (`#DFF1F1`), muted cyan borders (`#BBD5DA`), and pure red accents (`#FF0000`).
  - Dark mode: Slate 950 backgrounds with Slate 800 surfaces and white accents.

### Typography
- Primary interface uses `Inter`, while technical elements use `Geist Mono`.
- The Landing Page heavily utilizes CSS `clamp()` functions for highly responsive, massive typography that never breaks viewport boundaries.

## Development Commands
- `npm run dev`: Start development server.
- `npm run build`: Type-check and build for production.
- `npm run lint`: Run TypeScript type checking.
- `npm run clean`: Remove build artifacts.