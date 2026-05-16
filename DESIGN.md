# Design System: QuotaCheck AI (Light Stitch Aesthetic)

## 1. Visual Theme & Atmosphere
An "Art Gallery Airy" aesthetic with extreme density and offset asymmetry. The vibe feels like a high-end architectural studio or a minimalist print magazine. It avoids generic "Light Mode" by explicitly banning pure white backgrounds, opting instead for a warm, tactile Canvas Stone. Movement is fluid and physical, relying entirely on heavy spring physics.

## 2. Color Palette & Roles
- **Canvas Stone** (`#F5F5F4`) — The base background for the application. Replaces pure white to reduce eye strain and feel premium (Stone 100).
- **Charcoal Ink** (`#1C1917`) — Primary typography, borders, and high-contrast structural elements (Stone 900).
- **Terracotta Accent** (`#C2410C`) — The single accent color. A warm, desaturated orange/red that provides color without looking like a generic primary button.
- **Muted Sand** (`#D6D3D1`) — Secondary borders, muted metadata, and grid lines.
- **Pure White** (`#FFFFFF`) — Allowed ONLY for specific floating cards or input backgrounds resting on the Canvas Stone to create physical depth without shadows.

## 3. Typography Rules
- **Display/Headlines:** `Geist` — Track-tight (-0.03em), extremely heavy weights for contrast.
- **Body:** `Geist` — Relaxed leading (1.6), max 65ch width. Charcoal Ink or Muted Sand.
- **Mono/Technical:** `Geist Mono` — Used strictly for numbers, metadata, and labels.
- **Typographic Feature:** "Inline Image Typography" — Embedded structural pill-shaped elements within headlines using the Terracotta accent.

## 4. Component Stylings
- **Buttons:** Flat `#1C1917` (Charcoal) with `#F5F5F4` text. No drop shadows. Tactile 1px translate down on active state using spring physics.
- **Cards:** No generic drop shadows. Cards are defined by a 1px solid `Charcoal Ink` border or a solid `Pure White` fill resting on the Canvas Stone.
- **Inputs:** Label above (Mono). Flat `Pure White` background with a 1px `Muted Sand` border. Focus state changes border directly to `Terracotta`.

## 5. Layout Principles
- **Asymmetric Grid:** Split screens heavily (70/30). Centered hero sections are strictly BANNED.
- **Negative Space:** Massive padding (`clamp(4rem, 10vw, 8rem)`) between sections to create the "Airy" feel.
- **Containment:** Max width 1440px, aligned left or offset, never perfectly symmetric.

## 6. Motion & Interaction
- **Engine:** Framer Motion (`motion/react`) with strict spring physics.
- **Default Spring:** `type: "spring", stiffness: 100, damping: 20`.
- **Perpetual Micro-Loops:** The background grid or inline elements should have an infinite, slow, linear rotation or translation to feel "alive".

## 7. Anti-Patterns (BANNED)
- ❌ No pure white `#FFFFFF` for the main page background.
- ❌ No drop shadows with large blurs (e.g., `shadow-xl`). Use hard structural borders.
- ❌ No `Inter`, Emojis, or generic AI gradients.
- ❌ No perfectly centered layouts.
