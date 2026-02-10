# Design Decisions

Key UI/UX decisions made during development. Read this before changing visual elements.

## Color Palette Evolution

The palette went through 3 iterations based on Boss feedback:

1. **Blue-Purple gradient** (Sprint 1) — rejected as "unprofessional"
2. **Dark Slate Tech** (teal accents) — rejected as "childish"
3. **Deep Space Violet** (current) — approved by Boss

### Current: Violet-Blue Gradient System

The original Deep Space Violet (#7B337D) evolved into a Violet→Blue gradient system during Sprint 4-6 refactoring:

- `--gradient-start: #7C3AED` (Violet)
- `--gradient-end: #2563EB` (Blue)
- `--cta: #2563EB` (Blue for CTAs)
- Light/dark mode support via CSS variables + `data-theme` attribute

## Animation Philosophy

- **Professional and refined** — no bouncy, spring, or elastic effects
- **Subtle over dramatic** — users scroll frequently
- **GPU-accelerated** — only transform and opacity
- **Accessible** — respects `prefers-reduced-motion`
- Timing: expo/cubic easing only, no spring physics

## Layout Decisions

- **Linear scroll** (not pagination) — pagination was tried and removed for better UX
- **Mobile-first** with separate layouts (not just responsive tweaks)
- **Hero+About merged** into single `HeroAbout.tsx` component (Sprint 6)
- **Data separated** from components (Sprint 6) — all content in `/data/`

## Theme: Light + Dark

Originally dark-only (galaxy theme). Light mode added in Sprint 4 refactor. Both themes defined via CSS variables in `globals.css`.

## Typography Specifications

**Font Stack:**
- Primary: Inter (400, 500, 600, 700, 800)
- Code: JetBrains Mono (400, 500)

**Desktop Sizes:**
- Hero Name: text-7xl (~72px)
- Hero Tagline: text-4xl (~36px)
- Section Headings: text-3xl to text-5xl (30-48px)
- Body: text-base to text-lg (16-18px)

**Mobile Scaling:** 15% reduction for large headings

## Animation Timings (Sprint 7 Optimized)

Hero section animations were optimized in Sprint 7 for 66% faster initial reveal:

**Container:**
- staggerChildren: 0.08s (was 0.15s - 47% faster)
- delayChildren: 0.1s (was 0.3s - 67% faster)

**Name Reveal:**
- duration: 0.5s (was 0.8s - 37% faster)
- y: 30px (was 60px - 50% subtler)
- blur: 2px (was 4px - 50% subtler)

**Result:** Initial text visible in ~0.6s (was ~1.1s)

## Spacing System

Base unit: 4px
- Mobile section padding: 64px
- Desktop section padding: 96px
- Container max-width: 1200px

## Border & Effects

- Border radius: 4px (sm), 8px (md), 16px (lg), 24px (xl)
- Shadows: Subtle, dark-themed (rgba(0,0,0,0.3-0.5))
- Icon sizing: 32x32 or 40x40 consistent
