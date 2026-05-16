# Design System: QuotaCheck AI (Stitch Aesthetic)

## 1. Visual Theme & Atmosphere
A clinical, high-agency cockpit with an editorial-tech atmosphere. The vibe is "Deep Space Architecture" — extreme density (8/10), high variance/asymmetry (7/10), and perpetual micro-motion (9/10). The UI feels heavy, precise, and hardware-accelerated, replacing generic AI clichés with structural grid math and striking typographic contrast. It looks less like a standard SaaS app and more like a classified intelligence terminal.

## 2. Color Palette & Roles
- **Canvas Black** (`#09090B`) — Base background for the entire application (Zinc 950).
- **Deep Charcoal Ink** (`#18181B`) — Elevated surfaces, cards, and primary structural containers.
- **Pure White** (`#FFFFFF`) — Primary Display typography and icons.
- **Muted Steel** (`#71717A`) — Secondary Body typography, metadata, and borders.
- **Whisper Line** (`rgba(255,255,255,0.08)`) — Grid lines, border-bottom separators, and subtle structure.
- **Signal Red** (`#EF4444`) — The ONLY allowed accent color. Used for critical states, active tracking, and high-contrast CTA focus. Saturation kept controlled. No glowing neon.

## 3. Typography Rules
- **Display/Headlines:** `Geist` — Track-tight (-0.03em), controlled scale. Uses weight (Black 900) instead of just size for hierarchy.
- **Body:** `Geist` — Relaxed leading (1.6), max 65ch width. Always Muted Steel.
- **Mono/Technical:** `Geist Mono` — Used strictly for numbers, API keys, quotas, timestamps, and high-density labels.
- **Banned Fonts:** `Inter`, `Roboto`, `Arial`.
- **Typographic Feature:** "Inline Image Typography" — Use small, pill-shaped or circular contextual images directly nested between words in Hero headlines.

## 4. Component Stylings
- **Buttons:** Flat, completely solid `#FFFFFF` with `#09090B` text for primary. No outer glows. On active/click state, tactile 1px Y-axis translate using spring physics.
- **Cards:** For high-density areas, CARDS ARE BANNED. Use raw `border-top` dividers and structural grid lines instead. If elevation is strictly needed, use subtle `#18181B` fill with a `Whisper Line` border. No drop shadows.
- **Inputs:** Label above, strictly Mono font. Focus state changes border to `Signal Red`. No floating labels.
- **Empty States:** Composed architectural layouts. Not just "No data". 

## 5. Layout Principles
- **Asymmetric Grid:** Split the screen unevenly (e.g., 60/40 or 70/30). Centered hero sections are strictly BANNED.
- **No Overlapping:** Every element must live in its own mathematical bounding box. No absolute positioning that covers text.
- **Strict Collapse:** Below 768px, layout collapses strictly to 1 column. 
- **Containment:** Max width 1440px, centered, with generous `clamp(2rem, 5vw, 6rem)` horizontal padding.

## 6. Motion & Interaction
- **Engine:** Framer Motion (`motion/react`) with strict spring physics.
- **Default Spring:** `type: "spring", stiffness: 100, damping: 20`.
- **Perpetual Micro-Loops:** The background or structural elements should feature slow, infinite panning or pulsing loops (e.g., a slow-moving SVG grid, or a pulsing data conduit).
- **Stagger:** Lists and UI elements must mount with a cascade delay. No instant-on rendering.
- **Hardware Acceleration:** Only animate `transform` and `opacity`.

## 7. Anti-Patterns (BANNED)
- ❌ No `Inter` or generic fonts.
- ❌ No Emojis (use Lucide icons).
- ❌ No pure black `#000000`.
- ❌ No neon purple, blue glows, or "AI gradient" text.
- ❌ No 3-column equal grid layouts for features.
- ❌ No centered hero text.
- ❌ No generic "Scroll down" or bouncing chevron arrows.
- ❌ No clichés: "Elevate your workflow", "Next-gen AI", "Unleash power".
- ❌ No overlapping elements or chaotic Z-index stacking.
