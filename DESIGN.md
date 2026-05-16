# Design System: QuotaCheck

## 1. Visual Theme & Atmosphere
A stark, clinical editorial interface with confident asymmetric layouts and fluid spring-physics motion. The atmosphere is highly technical yet sophisticated — like a well-lit architecture studio or a Swiss-designed physical control panel. Density is 6 (Balanced), Variance is 8 (Artsy/Asymmetric), Motion is 5 (Restrained, tactile).

## 2. Color Palette & Roles
- **Canvas White** (`#F9FAFB`) — Primary background surface. Open, airy, and clinical.
- **Pure Surface** (`#FFFFFF`) — Interactive element backgrounds and absolute foregrounds.
- **Charcoal Ink** (`#18181B`) — Primary text, Zinc-950 depth for maximalist contrast.
- **Muted Steel** (`#71717A`) — Secondary text, metadata, descriptions.
- **Whisper Border** (`rgba(24,24,27,0.1)`) — Structural dividers, 1px hairlines.
- **Safety Orange** (`#FF3B00`) — Single accent for CTAs, exhaustive alerts, focus rings. Extremely controlled usage.
- **Clinical Success** (`#00A651`) — Status indicators (Operational).

## 3. Typography Rules
- **Display:** `Outfit` (or `Space Grotesk`) — Track-tight, controlled scale, weight-driven hierarchy. Used massively for headers.
- **Body:** `Inter` is BANNED. We use `Outfit` for sans-serif structural text or standard clean system fonts with relaxed leading, 65ch max-width.
- **Mono:** `Geist Mono` — For code, metadata, timestamps, high-density numbers.
- **Banned:** `Inter`, generic system fonts for premium contexts. Serif fonts are strictly banned in this dashboard context.

## 4. Component Stylings
* **Buttons:** Flat, brutalist, sharp corners or perfect pills depending on hierarchy. Tactile push feedback (`scale: 0.97`) on active state. No neon outer glows. Accent fill for primary, ghost/outline with Charcoal text for secondary.
* **Cards:** BANNED. Replaced by pure layout separation via stark `border-t` or `border-l` hairlines (Whisper Border) and negative space. Elevation shadows are banned. If a container is needed, it uses a 1px solid Charcoal border with `rounded-none`.
* **Inputs:** Label above, error below. Focus ring in Safety Orange. Hard 1px borders. No floating labels.
* **Loaders:** Skeletal shimmer matching exact layout dimensions. No circular spinners.
* **Empty States:** Composed, brutalist typographic compositions — not just "No data".
* **Status Indicators:** Physical-feeling 1px dots or pills, strictly geometric.

## 5. Layout Principles
Grid-first responsive architecture. Asymmetric splits for Hero sections and major dashboard zones (e.g., a massive 70% width block next to a 30% width block).
Strict single-column collapse below 768px. Max-width containment (e.g., `max-w-7xl`).
No flexbox percentage math; rely on CSS Grid. Generous internal padding (`py-12`, `py-24`).
No overlapping elements.

## 6. Motion & Interaction
Spring physics for all interactive elements (`stiffness: 300, damping: 25`). Staggered cascade reveals on lists.
Perpetual micro-loops on active dashboard components (e.g., a slowly blinking cursor or a ticking mono-clock).
Hardware-accelerated transforms only.

## 7. Anti-Patterns (Banned)
- NO emojis anywhere.
- NO `Inter` font.
- NO pure black (`#000000`).
- NO neon glows, drop shadows, or glassmorphism.
- NO 3-column equal grids.
- NO AI copywriting clichés ("Elevate", "Seamless", "Unleash").
- NO generic placeholder names.
- NO overlapping elements — clean spatial separation always.
