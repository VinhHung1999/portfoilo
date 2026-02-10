# Sprint 11: Visual WOW Factor — Design Specs

**Designer:** DS | **Status:** READY FOR REVIEW
**Boss Directive:** "Lam toi bat ngo di" — Full creative freedom
**Goal:** Transform the portfolio from "nice" to "WOW"

---

## Creative Vision

The current site is technically solid but visually *flat*. Every section uses the same fade+slide-up pattern. Nothing responds to the user. Nothing surprises.

The WOW strategy: **Make the portfolio feel alive.** Every section gets a unique animation signature. The page reacts to the user — their scroll, their cursor, their attention. Effects are layered: ambient background + scroll-triggered content + interactive hover.

---

## Priority Tiers

| Tier | Items | Impact |
|------|-------|--------|
| **P0** | 5 effects | Game-changers — each one is a "wow" moment |
| **P1** | 5 effects | Polish & delight — adds depth and interactivity |

**Recommended:** P0 all in Sprint 11. P1 as stretch goals or Sprint 12.

---

## P0: Game-Changers

---

### P0-1. Hero: Animated Gradient Mesh Background

**Current:** Static white/dark background. No atmosphere.
**After:** Living, breathing gradient blobs that slowly morph behind the hero content. Sets premium tone immediately on page load.

#### Visual Description

Three large soft gradient blobs (300-500px radius) positioned behind hero content. They slowly drift and morph using CSS keyframes. Colors: violet (`--gradient-start`) and blue (`--gradient-end`) at low opacity.

```
     ╭─────╮
  ╭──┤ blob1├──╮        ╭──────╮
  │  ╰──┬──╯  │   ╭────┤blob3 │
  │     │     │   │    ╰──────╯
  │  ╭──┴──╮  │   │
  │  │blob2│  │   │
  │  ╰─────╯  │   │
  ╰────────────╯   │
       [Hero Content overlays blobs]
```

#### Specs

**Container:**
- Position: `absolute`, `inset-0`, `overflow: hidden`, `z-index: 0`
- Hero content: `z-index: 1` (sits above)

**Each blob (3 total):**

| Property | Blob 1 | Blob 2 | Blob 3 |
|----------|--------|--------|--------|
| Size | 500px x 500px | 400px x 400px | 350px x 350px |
| Position | top-left (-10%, 10%) | bottom-center (50%, 60%) | top-right (70%, -5%) |
| Color (light) | `rgba(124, 58, 237, 0.08)` | `rgba(37, 99, 235, 0.06)` | `rgba(124, 58, 237, 0.05)` |
| Color (dark) | `rgba(124, 58, 237, 0.15)` | `rgba(59, 130, 246, 0.12)` | `rgba(124, 58, 237, 0.10)` |
| Border-radius | 40% 60% 70% 30% / 40% 50% 60% 50% | 50% 30% 50% 70% / 50% 60% 30% 60% | 60% 40% 30% 70% / 60% 30% 70% 40% |
| Filter | `blur(80px)` | `blur(100px)` | `blur(70px)` |
| Animation | `blob-drift-1 25s infinite` | `blob-drift-2 30s infinite` | `blob-drift-3 20s infinite` |

**Keyframes:**

```css
@keyframes blob-drift-1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(30px, -50px) scale(1.05); }
  50% { transform: translate(-20px, 20px) scale(0.95); }
  75% { transform: translate(40px, 30px) scale(1.02); }
}

@keyframes blob-drift-2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(-40px, -30px) scale(1.08); }
  66% { transform: translate(30px, 40px) scale(0.92); }
}

@keyframes blob-drift-3 {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(-50px, 30px) rotate(30deg); }
}
```

**Performance:**
- `will-change: transform` on all blobs
- Use `transform` only (no layout changes)
- Mobile: Reduce blob count to 2 (remove blob 3), reduce sizes by 30%

**Reduced motion:** Blobs are static (no animation), just positioned as atmospheric color washes.

**Implementation:** Pure CSS in `globals.css` + 3 `<div>` elements in HeroAbout component.

---

### P0-2. Skills: Animated Progress Bars with Staggered Fill

**Current:** Plain bordered text tags with 1.05 scale hover. The most boring section.
**After:** Horizontal skill bars that fill with gradient animation on scroll. Each bar shows skill name on left and animated percentage on right. Grouped by category in cards.

#### Visual Description

```
LANGUAGES
┌──────────────────────────────────────────────┐
│ TypeScript     ████████████████████░░░░  90%  │
│ Python         ███████████████████░░░░░  85%  │
│ JavaScript     █████████████████░░░░░░░  80%  │
│ Java           ██████████████░░░░░░░░░░  65%  │
│ SQL            █████████████░░░░░░░░░░░  60%  │
└──────────────────────────────────────────────┘

AI/ML & LLM
┌──────────────────────────────────────────────┐
│ LangChain      ████████████████████░░░░  90%  │
│ Claude API     ██████████████████░░░░░░  80%  │
│ ...                                           │
└──────────────────────────────────────────────┘
```

#### Data Enhancement

Skills data needs proficiency values. Add to `data/types.ts`:

```typescript
export interface SkillCategory {
  category: string;
  skills: SkillItem[];  // Changed from string[]
}

export interface SkillItem {
  name: string;
  proficiency: number; // 0-100
}
```

If DEV prefers backward compatibility, proficiency can default to a reasonable value based on skill position in array (first = 90, decreasing by 5).

#### Bar Specs

| Property | Value |
|----------|-------|
| Bar container height | 32px |
| Bar background (track) | `--bg-tertiary` |
| Bar fill | `linear-gradient(90deg, var(--gradient-start), var(--gradient-end))` |
| Bar border-radius | `--radius-full` (pill shape) |
| Skill name | Inter 13px/500, `--text-primary`, positioned left inside bar with `padding-left: 12px`, `z-index: 1` |
| Percentage | Inter 13px/600, `--cta`, positioned right outside bar |
| Gap between bars | 10px |
| Gap between categories | 32px |

**Category card:**

| Property | Value |
|----------|-------|
| Background | `--bg-secondary` |
| Border | 1px solid `--border` |
| Border-radius | `--radius-lg` (16px) |
| Padding | 24px |
| Category title | Inter 14px/600 uppercase, `--text-muted`, margin-bottom 16px |

#### Animation

**Trigger:** `useInView` (Framer Motion) — when category card enters viewport.

**Bar fill animation:**

| Property | Value |
|----------|-------|
| Initial state | `width: 0%` |
| Final state | `width: {proficiency}%` |
| Duration | 1.0s |
| Easing | `cubic-bezier(0.16, 1, 0.3, 1)` (expo out — fast start, gentle finish) |
| Stagger | Each bar delays 80ms after the previous |
| Category stagger | Each category card delays 150ms after previous |

**Percentage counter:**
- Counts from 0 to `proficiency` in sync with bar fill
- Use `useMotionValue` + `useTransform` from Framer Motion
- Display as integer (no decimal)

**Hover effect on individual bar:**
- Bar fill brightens slightly: `filter: brightness(1.15)`
- Subtle glow: `box-shadow: 0 0 12px var(--cta-glow)`
- Transition: 200ms ease-out

**Mobile:** Same layout, bars scale to full container width. Categories stack vertically.

**Reduced motion:** Bars appear at full width instantly (no fill animation). Percentages show final value immediately.

---

### P0-3. Projects: 3D Tilt Card Effect

**Current:** Cards have border-color change on hover + box-shadow. Flat.
**After:** Cards tilt in 3D space following cursor position. A radial glow follows the mouse on the card surface, simulating lighting.

#### Visual Description

```
        ╔═══════════════╗
       ╱                ╱│  ← Card tilts away from cursor
      ╱    Project     ╱ │
     ╱    Card        ╱  │
    ╔═══════════════╗   │
    ║  ○ glow spot  ║   │  ← Radial glow follows mouse
    ║               ║  ╱
    ╚═══════════════╝╱
         ↑ cursor here
```

#### Specs

**Container:**
- `perspective: 1000px` on card parent (the grid cell)
- `transform-style: preserve-3d` on card

**Tilt calculation (on `mousemove` within card):**

```
centerX = card.width / 2
centerY = card.height / 2
rotateX = ((mouseY - centerY) / centerY) * -8    // max ±8 degrees
rotateY = ((mouseX - centerX) / centerX) * 8     // max ±8 degrees
```

| Property | Value |
|----------|-------|
| Max tilt angle | ±8 degrees |
| Transform | `perspective(1000px) rotateX(Xdeg) rotateY(Ydeg) scale(1.02)` |
| Transition (while hovering) | `transform 100ms ease-out` (snappy tracking) |
| Transition (on mouse leave) | `transform 400ms cubic-bezier(0.16, 1, 0.3, 1)` (smooth settle back to flat) |
| Reset on leave | `rotateX(0) rotateY(0) scale(1)` |

**Radial glow overlay:**

A pseudo-element or overlay div that follows the mouse:

| Property | Value |
|----------|-------|
| Position | `absolute`, full card size |
| Background | `radial-gradient(circle 200px at {mouseX}px {mouseY}px, rgba(var(--cta-rgb), 0.12), transparent)` |
| Pointer-events | `none` |
| Border-radius | Inherit from card (`--radius-lg`) |
| Z-index | Above card content bg, below text |
| Opacity | 0 at rest, 1 on hover (transition 200ms) |

**Implementation approach:**
- New hook: `hooks/useTiltEffect.ts`
- Returns `{ ref, style, glowStyle, handlers }` for the card
- Uses `useMotionValue` for smooth interpolation
- `onMouseMove` → update tilt values
- `onMouseLeave` → animate back to 0

**Mobile:** Disable tilt entirely (no mouse on touch devices). Keep existing touch feedback instead.

**Reduced motion:** Disable tilt. Keep only the existing border-color hover.

---

### P0-4. Experience: Scroll-Driven Timeline

**Current:** All cards fade+slide-up identically. Timeline line appears with scaleY. Dots scale in. No differentiation.
**After:** Cards alternate slide-in direction (odd from left, even from right). Timeline line *draws itself* progressively as you scroll. Dots pulse with gradient glow when their card enters view.

#### Visual Description

```
                    ┃
         ╔══════╗   ●━━━  Card 1 slides in from RIGHT
         ║      ║   ┃
         ╚══════╝   ┃
                    ┃
   ━━━●   ╔══════╗  ┃    Card 2 slides in from LEFT
       ┃   ║      ║  ┃
       ┃   ╚══════╝  ┃
                    ┃
         ╔══════╗   ●━━━  Card 3 slides in from RIGHT
         ║      ║   ┃
         ╚══════╝   ┃
                    ▼ (line draws as you scroll)
```

#### Alternating Card Slide-in

**Desktop only** (md+). Mobile keeps single-column left-aligned (no alternating).

| Card Index | Slide Direction | Initial X | Final X |
|------------|----------------|-----------|---------|
| Even (0, 2, 4...) | From right | `x: 60, opacity: 0` | `x: 0, opacity: 1` |
| Odd (1, 3, 5...) | From left | `x: -60, opacity: 0` | `x: 0, opacity: 1` |

| Property | Value |
|----------|-------|
| Duration | 0.6s |
| Easing | `cubic-bezier(0.16, 1, 0.3, 1)` (expo out) |
| Stagger between cards | 150ms |

**Mobile:** All cards slide up (`y: 30` → `y: 0`) as before.

#### Progressive Timeline Line

Instead of the line appearing all at once (`scaleY: 0→1`), tie line height to scroll progress within the Experience section.

| Property | Value |
|----------|-------|
| Mechanism | `useScroll({ target: sectionRef })` → `scrollYProgress` |
| Line `scaleY` | Maps from `scrollYProgress` 0→1 |
| `transform-origin` | `top` |
| Color | Gradient: `linear-gradient(180deg, var(--gradient-start), var(--gradient-end))` (was solid `--bg-tertiary`) |
| Width | 2px (was 0.5 via `w-0.5`) |

#### Enhanced Timeline Dots

**Idle state:**

| Property | Value |
|----------|-------|
| Size | 12px (was implied by w-3 h-3) |
| Background | `--bg-primary` |
| Border | 3px solid `--cta` |

**Active state (when card enters viewport):**

| Property | Value |
|----------|-------|
| Background | Gradient fill (`--gradient-start` → `--gradient-end`) |
| Border | 3px solid `--cta` |
| Box-shadow | `0 0 12px var(--cta-glow)` |
| Scale | pulse from 1 → 1.3 → 1 over 600ms, once |

**Reduced motion:** Cards fade in (opacity only). Line appears instantly. Dots show final state.

---

### P0-5. Global: Scroll Progress Bar

**Current:** No scroll progress indication.
**After:** A thin gradient bar pinned to the very top of the viewport that fills left-to-right as the user scrolls.

#### Visual Description

```
█████████████████░░░░░░░░░░░░░░░░░░░░  ← 45% scrolled
┌──────────────────────────────────────┐
│          [Page Content]              │
```

#### Specs

| Property | Value |
|----------|-------|
| Position | `fixed`, `top: 0`, `left: 0`, `z-index: 60` (above nav at z-50) |
| Height | 3px |
| Width | `{scrollProgress * 100}%` |
| Background | `linear-gradient(90deg, var(--gradient-start), var(--gradient-end))` |
| Box-shadow | `0 0 8px var(--cta-glow)` (subtle trailing glow) |
| Transition | None (direct binding to scroll for instant feedback) |

**Implementation:**
- `useScroll()` from Framer Motion → `scrollYProgress`
- `motion.div` with `scaleX` bound to `scrollYProgress`
- `transform-origin: left`

**Mobile:** Same behavior, same specs. Thin enough to not interfere.

**Reduced motion:** Still visible — it's a static indicator, not an animation.

---

## P1: Polish & Delight

---

### P1-1. Hero: Split Character Text Reveal

**Current:** Name fades+slides as a single block.
**After:** Each character of the name animates individually with stagger, creating a typewriter/cascade effect.

#### Specs

Split "Hung Pham" into individual `<span>` per character (preserve space as `&nbsp;`).

| Property | Value |
|----------|-------|
| Initial per-char | `opacity: 0, y: 40, rotateX: -40deg` |
| Final per-char | `opacity: 1, y: 0, rotateX: 0deg` |
| Duration per-char | 0.4s |
| Stagger | 0.035s between characters |
| Easing | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Container | `perspective: 800px` (for subtle 3D rotation) |
| Total time for "Hung Pham" (10 chars) | ~0.035 * 10 + 0.4 = ~0.75s |

**Implementation:** Map `name.split('')` into `motion.span` elements with `custom={index}` variants.

**Reduced motion:** Entire name fades in as one block (current behavior).

---

### P1-2. Achievements: Holographic Shimmer on Hover

**Current:** Cards lift -4px on hover. Very subtle.
**After:** A diagonal light streak sweeps across the card on hover, like a holographic trading card.

#### Specs

**Shimmer overlay:**

| Property | Value |
|----------|-------|
| Element | `::after` pseudo-element (or overlay div) |
| Position | `absolute`, full card |
| Background | `linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.15) 45%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.15) 55%, transparent 70%)` |
| Initial position | `translateX(-100%)` |
| Hover position | `translateX(100%)` |
| Duration | 0.6s |
| Easing | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Pointer-events | `none` |
| Overflow | `hidden` on card |

**Dark mode shimmer:** Replace white with `rgba(255,255,255,0.08)` at peak (more subtle on dark).

**Combined with existing hover:**
- Keep the -4px lift
- Add border glow: `box-shadow: 0 12px 32px var(--cta-glow)`
- Shimmer plays once per hover entry

**Mobile:** Trigger shimmer on tap (play once on `touchstart`).

**Reduced motion:** No shimmer. Keep lift + glow only.

---

### P1-3. Contact: Magnetic Social Icon Buttons

**Current:** Social icons scale 1.1 on hover and change background color. Standard.
**After:** Icons "magnetically" pull toward cursor when it's within proximity (before direct hover). Creates a playful, interactive feel.

#### Specs

**Magnetic attraction zone:** 80px radius from button center.

**Behavior:**
1. Cursor enters 80px radius → button starts translating toward cursor
2. Translation strength: `distance_factor * 0.3` (max ~15px movement)
3. Cursor directly hovers → existing scale+color change kicks in
4. Cursor leaves radius → button springs back to origin

| Property | Value |
|----------|-------|
| Max translate distance | 15px in any direction |
| Attraction radius | 80px |
| Spring back | `transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)` |
| While attracted | `transition: transform 0.15s ease-out` (snappy follow) |

**Implementation:**
- Wrap each social icon in a component that tracks mouse proximity
- Use `onMouseMove` on the parent container (not individual buttons) for efficiency
- Calculate distance from cursor to each button center
- Apply `transform: translate(dx, dy)` if within radius

**Mobile:** Disabled entirely (no cursor on touch).

**Reduced motion:** Disabled.

---

### P1-4. Subtle Floating Particles (Hero + Contact)

**Current:** No ambient effects.
**After:** Tiny gradient dots floating slowly upward in the background of Hero and Contact sections. Creates depth and atmosphere.

#### Specs

**Pure CSS implementation** (zero JS overhead):

| Property | Value |
|----------|-------|
| Particle count | 15 per section (Hero) / 10 (Contact) |
| Particle size | 2-4px (randomized via CSS custom properties) |
| Color (light) | `rgba(124, 58, 237, 0.15)` |
| Color (dark) | `rgba(124, 58, 237, 0.25)` |
| Shape | Circle (`border-radius: 50%`) |
| Animation | Float upward + slight horizontal drift |
| Duration | 15-30s per particle (randomized) |
| Pointer-events | `none` |

**Keyframes:**

```css
@keyframes particle-float {
  0% {
    transform: translateY(100%) translateX(0) scale(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
    transform: translateY(90%) translateX(10px) scale(1);
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-10%) translateX(-15px) scale(0.5);
    opacity: 0;
  }
}
```

**Each particle positioned with:**
- Random `left: {5-95}%`
- Random `--duration: {15-30}s`
- Random `--delay: {0-15}s`
- Random `--size: {2-4}px`

**Implementation:** Create particles in CSS (set in `globals.css`) with a `.particles-container` class. Place container `div` inside Hero and Contact sections with `position: absolute; inset: 0; overflow: hidden; pointer-events: none`.

Generate particle divs in component (15 divs with randomized inline CSS custom properties).

**Mobile:** Reduce to 8 particles (Hero) / 5 (Contact) for performance.

**Reduced motion:** Particles visible but static (no animation) — just ambient dots.

---

### P1-5. Section Headers: Gradient Clip-Path Reveal

**Current:** All section headers use identical fade+slide-up.
**After:** Section titles reveal with a horizontal wipe using `clip-path`, while the gradient text color animates in.

#### Specs

| Property | Value |
|----------|-------|
| Initial | `clip-path: inset(0 100% 0 0)` (fully clipped from right) |
| Final | `clip-path: inset(0 0 0 0)` (fully revealed) |
| Duration | 0.6s |
| Easing | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Delay | 0.1s after section enters viewport |

**Combined with gradient text:** The header should use `.gradient-text` class. As the clip-path reveals, the gradient becomes visible left-to-right — creates a "light sweep" effect on the text.

**Subtitle** (the description below): Fades in 0.2s after header reveal completes.

**Implementation:** Framer Motion `animate` with `clipPath` property. Framer supports `clipPath` natively.

**Reduced motion:** Simple opacity fade (current behavior).

---

## Animation Timing Summary

All effects follow Sprint 7 guidelines: fast, professional, no bounce.

| Effect | Duration | Easing | Trigger |
|--------|----------|--------|---------|
| Gradient mesh blobs | 20-30s loop | linear | Always running |
| Skill bar fill | 1.0s + 80ms stagger | expo-out | Scroll into view (once) |
| Percentage counter | Synced with bar fill | — | Scroll into view (once) |
| 3D card tilt | 100ms (tracking) | ease-out | Mouse move |
| 3D card reset | 400ms | expo-out | Mouse leave |
| Radial glow follow | Instant (bound to mouse) | — | Mouse move |
| Timeline card slide | 0.6s + 150ms stagger | expo-out | Scroll into view (once) |
| Timeline line draw | Continuous | linear (scroll-bound) | Scroll progress |
| Dot pulse | 0.6s | ease-out | Card enters view (once) |
| Scroll progress bar | Instant | — (scroll-bound) | Scroll |
| Char reveal stagger | 0.4s + 35ms/char | expo-out | Page load |
| Holographic shimmer | 0.6s | expo-out | Hover (once per entry) |
| Magnetic pull | 0.15s (follow) / 0.4s (release) | ease-out / expo-out | Mouse proximity |
| Floating particles | 15-30s loop | linear | Always running |
| Header clip-path | 0.6s | expo-out | Scroll into view (once) |

---

## New Files & Hooks DEV Needs

| File | Purpose |
|------|---------|
| `hooks/useTiltEffect.ts` | 3D tilt + radial glow tracking for project cards |
| `hooks/useCountUp.ts` | Animated counter (0 → N) synced with bar fill |
| `globals.css` additions | Blob keyframes, particle keyframes, shimmer overlay |

**No new dependencies required.** Everything uses Framer Motion (already installed) + pure CSS.

---

## Component Change Map

| Component | P0/P1 | Changes |
|-----------|-------|---------|
| **HeroAbout.tsx** | P0-1, P1-1, P1-4 | Add gradient mesh blobs, split char reveal for name, floating particles container |
| **Skills.tsx** | P0-2 | Replace tag list with progress bar cards. Add staggered fill + counter animation |
| **Projects.tsx** | P0-3 | Add `useTiltEffect` hook to project cards. Add radial glow overlay |
| **Experience.tsx** | P0-4 | Alternating slide direction. Scroll-driven timeline line. Enhanced dot pulse |
| **Contact.tsx** | P1-3, P1-4 | Magnetic social buttons. Floating particles container |
| **Achievements.tsx** | P1-2 | Add shimmer overlay on hover |
| **Navigation.tsx** | P0-5 | Add scroll progress bar (or as sibling in `page.tsx`) |
| **globals.css** | P0-1, P1-2, P1-4 | Blob drift keyframes, particle float keyframes, shimmer gradient |
| **data/types.ts** | P0-2 | Add `SkillItem` interface with `proficiency` field |
| **data/skills.ts** | P0-2 | Update skills data with proficiency values |
| **All section headers** | P1-5 | Replace fade+slide with clip-path reveal |

---

## Performance Budget

| Effect | JS Impact | CSS Impact | Runtime Cost |
|--------|-----------|------------|-------------|
| Gradient mesh blobs | 0 | ~30 lines | Low (GPU transform) |
| Skill bar fill | ~50 lines (hook) | ~20 lines | Low (one-time) |
| 3D tilt cards | ~60 lines (hook) | ~10 lines | Medium (mousemove — throttle to rAF) |
| Scroll timeline | ~15 lines | ~5 lines | Low (Framer scroll binding) |
| Scroll progress bar | ~10 lines | ~5 lines | Low (Framer scroll binding) |
| Char reveal | ~20 lines | 0 | Low (one-time on load) |
| Holographic shimmer | 0 | ~15 lines | Low (CSS only) |
| Magnetic buttons | ~40 lines | ~5 lines | Low (limited to 4 buttons) |
| Floating particles | ~5 lines (render divs) | ~25 lines | Low (GPU transform) |
| Clip-path headers | ~10 lines | 0 | Low (one-time) |
| **TOTAL** | ~210 lines new JS | ~115 lines new CSS | All within budget |

**Mobile performance:** 3D tilt disabled. Particle count reduced. All heavy effects use `transform` + `opacity` only (GPU-composited). No layout thrashing.

---

## Accessibility Summary

| Effect | Reduced Motion Behavior |
|--------|------------------------|
| Gradient mesh | Static positioned (no animation) |
| Skill bars | Instant fill (no animation) |
| 3D tilt | Disabled |
| Timeline slide-in | Opacity fade only |
| Scroll progress | Always visible (not an animation) |
| Char reveal | Entire name fades as block |
| Shimmer | Disabled |
| Magnetic buttons | Disabled |
| Particles | Static dots (no float) |
| Clip-path headers | Opacity fade only |

---

## Suggested Proficiency Values for Skills

For DEV to use in `data/skills.ts`:

```
Languages:        TypeScript(92) Python(88) JavaScript(85) Java(65) SQL(70)
AI/ML & LLM:     LangChain(90) Claude API(88) OpenAI(82) PyTorch(60) TensorFlow(55)
Framework/Tools:  React(92) Next.js(90) Vue.js(70) Node.js(85) FastAPI(82) PostgreSQL(78) Redis(72) Docker(75) AWS(70)
Method/Leadership: Agile(90) Scrum(88) Team Leadership(85) Code Review(92) Mentoring(88)
```

These are suggestions — Boss should confirm actual values.

---

*End of Sprint 11 Visual WOW Specs — Let's make this portfolio unforgettable.*
