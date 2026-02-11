# Sprint 15: P1 Visual Effects — Refined Design Specs

**Designer:** DS | **Status:** DRAFT (Pre-Sprint Prep)
**Source:** Sprint 11 P1 backlog items, refined against current codebase state
**Goal:** Add 5 polish & delight effects that make the portfolio feel alive and interactive

---

## Overview

These 5 effects were originally specced in Sprint 11 as P1 (stretch goals). P0 effects (gradient mesh blobs, skill progress bars, 3D tilt cards, scroll-driven timeline, scroll progress bar) are already implemented and live. These P1 effects layer on top to add personality and interactivity.

**Priority order (recommended implementation sequence):**

| # | Effect | Section | Impact | Complexity |
|---|--------|---------|--------|------------|
| 1 | Split char text reveal | Hero | High — first thing visitors see | Low |
| 2 | Holographic shimmer | Achievements | Medium — delightful hover | Low |
| 3 | Floating particles | Hero + Contact | Medium — ambient atmosphere | Low |
| 4 | Clip-path header reveal | All sections | Medium — unique section entries | Low |
| 5 | Magnetic social icons | Contact | Medium — playful interaction | Medium |

**Estimated total:** ~210 lines new JS, ~80 lines new CSS. No new dependencies.

---

## Effect 1: Hero Split Character Text Reveal

**Component:** `components/sections/HeroAbout.tsx`
**Current behavior:** Name (`personalInfo.name`) fades+slides as a single `<h1>` block via `nameReveal` variant.
**After:** Each character animates individually with staggered y + rotateX, creating a premium cascade reveal.

### Visual Description

```
Frame 0:   _  _  _  _     _  _  _  _  _
Frame 1:   H  _  _  _     _  _  _  _  _
Frame 2:   H  u  _  _     _  _  _  _  _
Frame 3:   H  u  n  _     _  _  _  _  _
...
Frame 10:  H  u  n  g     P  h  a  m  .
```

Each character drops in from above with a subtle 3D rotation.

### Specs

**Container (the `<h1>`):**

| Property | Value |
|----------|-------|
| Style | `perspective: 800px` (enables subtle 3D on children) |
| Display | `flex` + `flex-wrap: wrap` (to handle word breaks) |
| Class | Keep existing `gradient-text` class |

**Per-character `<motion.span>`:**

| Property | Value |
|----------|-------|
| Initial | `opacity: 0, y: 40, rotateX: -40deg` |
| Animate | `opacity: 1, y: 0, rotateX: 0deg` |
| Duration | 0.4s |
| Stagger | 0.035s between characters |
| Easing | `cubic-bezier(0.16, 1, 0.3, 1)` (expo out) |
| Display | `inline-block` (required for transform) |

**Space handling:** Render space characters as `\u00A0` (non-breaking space) in their own `<motion.span>` with the same animation. This preserves word spacing.

**Total animation time for "Hung Pham" (9 chars + 1 space = 10):**
`0.035 * 9 + 0.4 = ~0.72s` — well within the 1.0s guideline.

**Implementation approach:**

```tsx
// Inside HeroAbout, replace the <motion.h1> name block:
const nameChars = personalInfo.name.split('');

<motion.h1
  className="text-5xl md:text-7xl font-bold mb-4 md:mb-6 gradient-text"
  style={{ perspective: 800 }}
  variants={container} // Use parent stagger container
>
  {nameChars.map((char, i) => (
    <motion.span
      key={i}
      variants={charVariant}
      custom={i}
      style={{ display: 'inline-block' }}
    >
      {char === ' ' ? '\u00A0' : char}
    </motion.span>
  ))}
</motion.h1>
```

**Variant definition:**

```tsx
const charVariant = prefersReducedMotion
  ? {
      hidden: { opacity: 0 },
      show: { opacity: 1, transition: { duration: 0.2 } },
    }
  : {
      hidden: { opacity: 0, y: 40, rotateX: -40 },
      show: (i: number) => ({
        opacity: 1,
        y: 0,
        rotateX: 0,
        transition: {
          duration: 0.4,
          delay: i * 0.035,
          ease: [0.16, 1, 0.3, 1],
        },
      }),
    };
```

### Mobile

Same effect, smaller text size (text-5xl already handles this). The stagger works identically — no changes needed.

### Reduced Motion

Entire name fades in as one block (current behavior preserved) — no per-character animation.

### What Changes in HeroAbout.tsx

1. **Replace** both mobile and desktop `<motion.h1>` name blocks (lines ~152-157 and ~272-277) with the split-character version
2. **Add** `charVariant` definition alongside existing `nameReveal`
3. **Remove** `nameReveal` variant (no longer used after this change)
4. **Keep** all other animations (fadeInUp, photoReveal, container) unchanged

---

## Effect 2: Holographic Shimmer on Achievement Cards

**Component:** `components/sections/Achievements.tsx`
**Current behavior:** Cards lift -4px on hover with border color change to `--cta` and box-shadow glow. Basic.
**After:** A diagonal light streak sweeps across the card on hover, simulating a holographic trading card.

### Visual Description

```
Hover starts:
┌──────────────────┐
│  /               │  ← Light streak enters from left
│ / Achievement    │
│/                 │
└──────────────────┘

Mid-sweep:
┌──────────────────┐
│        /         │
│  Title / desc    │  ← Streak crosses center
│        /         │
└──────────────────┘

Complete:
┌──────────────────┐
│               /  │
│  Achievement  /  │  ← Streak exits right
│               /  │
└──────────────────┘
```

### Specs

**Shimmer overlay (CSS pseudo-element approach):**

| Property | Value |
|----------|-------|
| Element | CSS `::after` on card (preferred over JS overlay for zero runtime cost) |
| Position | `absolute`, `inset: 0` |
| Background | `linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.15) 45%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.15) 55%, transparent 70%)` |
| Initial transform | `translateX(-100%)` |
| Hover transform | `translateX(100%)` |
| Duration | 0.6s |
| Easing | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Pointer-events | `none` |
| Border-radius | `inherit` (matches card's `rounded-2xl`) |
| Overflow | `hidden` on card (critical — clips the sweep) |
| Z-index | 1 (above card bg, below text content) |

**Dark mode shimmer:** Replace white peaks with lower opacity:
- `rgba(255,255,255,0.08)` at 45%/55%
- `rgba(255,255,255,0.12)` at 50% center

**CSS implementation (in `globals.css`):**

```css
/* ===== Sprint 15: Holographic Shimmer ===== */
.achievement-card {
  position: relative;
  overflow: hidden;
}

.achievement-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    110deg,
    transparent 30%,
    rgba(255, 255, 255, 0.15) 45%,
    rgba(255, 255, 255, 0.25) 50%,
    rgba(255, 255, 255, 0.15) 55%,
    transparent 70%
  );
  transform: translateX(-100%);
  transition: none;
  pointer-events: none;
  border-radius: inherit;
  z-index: 1;
}

.achievement-card:hover::after {
  transform: translateX(100%);
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

[data-theme="dark"] .achievement-card::after {
  background: linear-gradient(
    110deg,
    transparent 30%,
    rgba(255, 255, 255, 0.06) 45%,
    rgba(255, 255, 255, 0.10) 50%,
    rgba(255, 255, 255, 0.06) 55%,
    transparent 70%
  );
}

@media (prefers-reduced-motion: reduce) {
  .achievement-card::after {
    display: none;
  }
}
```

### What Changes in Achievements.tsx

1. **Add** `achievement-card` class to the card `<motion.div>` (line ~67)
2. **Add** `position: relative` and `overflow: hidden` to card (already has `relative` implicitly via motion, add `overflow-hidden` class)
3. **Ensure** text content has `position: relative; z-index: 2` so shimmer passes behind text
4. **Keep** existing hover effects (y: -4 lift, border color, box-shadow)

### Combined Hover (existing + shimmer)

On hover, user sees:
1. Card lifts -4px (Framer Motion `whileHover`)
2. Border glows `--cta` color (existing JS hover handlers)
3. Light streak sweeps left-to-right (CSS `::after`)

All three happen simultaneously — no conflicts.

### Mobile

Shimmer triggers on tap via `touchstart` — CSS `:hover` works on first tap on mobile. One sweep per tap, which is acceptable. If that feels wrong, we can add `:active` trigger instead.

### Reduced Motion

Shimmer `::after` is hidden entirely (`display: none`). Only the lift + border glow remain.

---

## Effect 3: Floating Particles (Hero + Contact)

**Components:** `components/sections/HeroAbout.tsx`, `components/sections/Contact.tsx`
**Current behavior:** No ambient effects (Hero has gradient mesh blobs, which are separate).
**After:** Tiny gradient dots float slowly upward, adding depth and atmosphere.

### Visual Description

```
   ·          ·
        ·              ·    ← tiny dots
  ·                ·
     [Hero / Contact Content]
          ·      ·
   ·                    ·
        ·     ·
```

### Specs

**Pure CSS implementation** (zero JS runtime cost — only JS is rendering the divs):

| Property | Value |
|----------|-------|
| Particle count | Hero: 15, Contact: 10 |
| Particle size | 2-4px (randomized per particle) |
| Color (light) | `rgba(124, 58, 237, 0.15)` (violet) |
| Color (dark) | `rgba(124, 58, 237, 0.25)` |
| Shape | Circle (`border-radius: 50%`) |
| Animation | Float upward + slight horizontal drift |
| Duration | 15-30s per particle (randomized) |
| Pointer-events | `none` |
| Z-index | 0 (behind content, same layer as blobs in Hero) |

**Keyframes (in `globals.css`):**

```css
/* ===== Sprint 15: Floating Particles ===== */
@keyframes particle-float {
  0% {
    transform: translateY(100%) translateX(0) scale(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
    transform: translateY(80%) translateX(var(--drift-x, 10px)) scale(1);
  }
  90% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(-10%) translateX(calc(var(--drift-x, 10px) * -1.5)) scale(0.5);
    opacity: 0;
  }
}

.particle {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  will-change: transform, opacity;
  animation: particle-float var(--duration) var(--delay) infinite linear;
  width: var(--size);
  height: var(--size);
  background: rgba(124, 58, 237, 0.15);
}

[data-theme="dark"] .particle {
  background: rgba(124, 58, 237, 0.25);
}

.particles-container {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

@media (prefers-reduced-motion: reduce) {
  .particle {
    animation: none !important;
    opacity: 0.3;
  }
}
```

**Component implementation (reusable):**

Create a lightweight helper component or inline the particle divs:

```tsx
// Inline in HeroAbout / Contact — no separate component needed
const PARTICLE_COUNT = 15; // 10 for Contact

const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  left: `${5 + Math.random() * 90}%`,
  '--duration': `${15 + Math.random() * 15}s`,
  '--delay': `${Math.random() * 15}s`,
  '--size': `${2 + Math.random() * 2}px`,
  '--drift-x': `${-20 + Math.random() * 40}px`,
}));

// In JSX:
<div className="particles-container">
  {particles.map((style, i) => (
    <div key={i} className="particle" style={style} />
  ))}
</div>
```

**IMPORTANT:** Generate particle values deterministically (use index-based seed, not `Math.random()`) to avoid hydration mismatches in Next.js SSR. Use something like:

```tsx
// Deterministic pseudo-random for SSR safety
const seed = (i: number) => ((i * 9301 + 49297) % 233280) / 233280;

const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  left: `${5 + seed(i) * 90}%`,
  '--duration': `${15 + seed(i + 100) * 15}s`,
  '--delay': `${seed(i + 200) * 15}s`,
  '--size': `${2 + seed(i + 300) * 2}px`,
  '--drift-x': `${-20 + seed(i + 400) * 40}px`,
}));
```

### What Changes

**HeroAbout.tsx:**
- Add particles container div **inside** the existing blob container (the `absolute inset-0 overflow-hidden` div at line ~105), or as a sibling. Particles sit alongside blobs — both are `z-index: 0`, behind content at `z-index: 1`.

**Contact.tsx:**
- Add particles container as first child inside the `<section>`, with `position: absolute; inset: 0; overflow: hidden; pointer-events: none`.
- Contact section needs `position: relative` (add `relative` class if not present).

### Mobile

Reduce particle count: Hero 8, Contact 5. Use CSS media query or pass count as prop.

### Reduced Motion

Particles visible as static dots (no animation) at 30% opacity. Provides ambient texture without motion.

---

## Effect 4: Section Headers — Gradient Clip-Path Reveal

**Components:** All 5 section components (Experience, Skills, Projects, Achievements, Contact)
**Current behavior:** All headers use identical `itemVariants` (opacity 0→1, y: 20→0).
**After:** Headers reveal with a horizontal wipe via `clip-path`, with gradient text becoming visible left-to-right.

### Visual Description

```
Frame 0:   |                              (fully clipped)
Frame 1:   |Ach                           (revealing left→right)
Frame 2:   |Achieveme                     (continuing)
Frame 3:   |Achievements                  (fully revealed)
Frame 4:        subtitle fades in below
```

### Specs

| Property | Value |
|----------|-------|
| Initial | `clipPath: "inset(0 100% 0 0)"` (fully clipped from right) |
| Final | `clipPath: "inset(0 0% 0 0)"` (fully revealed) |
| Duration | 0.6s |
| Easing | `cubic-bezier(0.16, 1, 0.3, 1)` (expo out) |
| Trigger | `useInView` — when section enters viewport |

**Subtitle (description text below):**
- Fades in with `opacity: 0 → 1` and `y: 10 → 0`
- Delay: 0.3s after header starts (so header is ~50% revealed when subtitle begins)
- Duration: 0.4s

**Implementation — new Framer Motion variants:**

```tsx
// In lib/animations.ts (or inline in each component)
export const headerClipReveal = {
  hidden: { clipPath: "inset(0 100% 0 0)" },
  visible: {
    clipPath: "inset(0 0% 0 0)",
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const subtitleFadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: 0.3,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};
```

**Usage in section components:**

```tsx
{/* Replace current header block */}
<motion.h2
  variants={headerClipReveal}
  className="text-3xl md:text-5xl font-bold mb-4 gradient-text"
>
  Achievements
</motion.h2>
<motion.p
  variants={subtitleFadeIn}
  className="text-base md:text-lg max-w-2xl mx-auto"
  style={{ color: "var(--text-secondary)" }}
>
  Recognition and milestones...
</motion.p>
```

### Gradient Text + Clip-Path Synergy

The header already has `gradient-text` class (background gradient clipped to text). As the `clip-path` reveals left-to-right, the gradient becomes visible progressively — creating a natural "light sweep" on the text. This is a purely visual bonus with zero extra code.

**IMPORTANT:** For `gradient-text` to work with `clipPath`, the `<h2>` must NOT have `overflow: hidden` separately. The Framer Motion `clipPath` animation handles the clipping — no extra CSS needed.

### What Changes in Each Section

Each of the 5 section header blocks follows the same pattern:

| Section | Current header `<motion.div variants={itemVariants}>` | Change to |
|---------|-------------------------------------------------------|-----------|
| Experience | `<motion.div variants={itemVariants}>` wrapping h2+p | Split h2 to use `headerClipReveal`, p to use `subtitleFadeIn` |
| Skills | Same pattern | Same change |
| Projects | Same pattern | Same change |
| Achievements | Same pattern | Same change |
| Contact | h2+p directly (no wrapping motion.div) | Wrap in motion elements with new variants |

**HeroAbout is excluded** — it has its own split-char reveal (Effect 1), not clip-path.

### Reduced Motion

Simple opacity fade (use existing `itemVariantsReduced`). No clip-path animation.

```tsx
const headerVariant = prefersReducedMotion
  ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.2 } } }
  : headerClipReveal;
```

---

## Effect 5: Magnetic Social Icons (Contact)

**Component:** `components/sections/Contact.tsx`
**Current behavior:** Social icons (Github, LinkedIn, Twitter, Mail) scale 1.1 on hover with bg color change. Standard.
**After:** Icons "magnetically" pull toward cursor when it's within proximity (~80px), creating a playful, interactive feel.

### Visual Description

```
                    cursor ↓
                      ★

    [GH]    [LI]  →[TW]←    [ML]
                  (Twitter icon pulls toward cursor)
```

### Specs

**Magnetic attraction zone:** 80px radius from button center.

**Behavior sequence:**
1. Cursor enters 80px radius around a button → button translates toward cursor
2. Translation strength: proportional to distance, max ~15px
3. Cursor directly hovers button → existing scale + color change applies on top
4. Cursor leaves 80px radius → button springs back to origin

| Property | Value |
|----------|-------|
| Max translate distance | 15px in any direction |
| Attraction radius | 80px |
| While attracted (tracking) | `transition: transform 0.15s ease-out` (snappy follow) |
| Spring back (on leave) | `transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)` (smooth settle) |

**Calculation:**

```
For each button:
  dx = cursorX - buttonCenterX
  dy = cursorY - buttonCenterY
  distance = sqrt(dx² + dy²)

  if distance < 80:
    factor = (80 - distance) / 80  // 0 at edge, 1 at center
    translateX = dx * factor * 0.3  // Max ~15px at closest
    translateY = dy * factor * 0.3
  else:
    translateX = 0
    translateY = 0
```

**Implementation approach — parent `onMouseMove`:**

Track mouse on the social links container (the `div.flex.gap-4` wrapper), not on individual buttons. This is more efficient — one event listener instead of four.

```tsx
// In Contact.tsx
const containerRef = useRef<HTMLDivElement>(null);
const buttonRefs = useRef<(HTMLAnchorElement | null)[]>([]);
const [offsets, setOffsets] = useState<{ x: number; y: number }[]>(
  socialLinks.map(() => ({ x: 0, y: 0 }))
);

const handleMouseMove = useCallback((e: React.MouseEvent) => {
  const newOffsets = socialLinks.map((_, i) => {
    const btn = buttonRefs.current[i];
    if (!btn) return { x: 0, y: 0 };
    const rect = btn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 80) {
      const factor = (80 - dist) / 80;
      return { x: dx * factor * 0.3, y: dy * factor * 0.3 };
    }
    return { x: 0, y: 0 };
  });
  setOffsets(newOffsets);
}, [socialLinks.length]);

const handleMouseLeave = useCallback(() => {
  setOffsets(socialLinks.map(() => ({ x: 0, y: 0 })));
}, [socialLinks.length]);
```

**Apply to each button:**

```tsx
<motion.a
  ref={(el) => { buttonRefs.current[i] = el; }}
  style={{
    transform: `translate(${offsets[i].x}px, ${offsets[i].y}px)`,
    transition: offsets[i].x !== 0 || offsets[i].y !== 0
      ? 'transform 0.15s ease-out'
      : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
  }}
  // ...existing props
/>
```

**Performance note:** `onMouseMove` fires frequently but we're only updating 4 offset values. Use `requestAnimationFrame` throttle if needed, but with only 4 buttons this should be smooth without it.

**Alternative (cleaner) — use Framer Motion `useMotionValue`:**

```tsx
// Per-button approach using Framer Motion for smoother animation
const x = useMotionValue(0);
const y = useMotionValue(0);
// Update on mousemove, animate with spring on leave
```

DEV can choose whichever approach is cleaner in the existing code structure. Both achieve the same result.

### What Changes in Contact.tsx

1. **Wrap** the social links `<div className="flex gap-4">` (line ~123) with `onMouseMove` and `onMouseLeave`
2. **Add** offset state and calculation logic
3. **Apply** `transform: translate()` to each `<motion.a>` social link
4. **Keep** existing hover effects (scale, bg color change) — they layer on top of magnetic offset

### Mobile

**Disabled entirely.** No cursor on touch devices. Use `useIsMobile()` hook (already exists at `hooks/useIsMobile.ts`) to skip the magnetic behavior.

```tsx
const isMobile = useIsMobile();
// Only attach onMouseMove/onMouseLeave if !isMobile
```

### Reduced Motion

Disabled. No magnetic pull — buttons stay in place. Only existing scale + color hover remains.

---

## CSS Budget Summary (globals.css additions)

```
Effect 2: Shimmer      ~25 lines (keyframe-free, pure CSS transitions)
Effect 3: Particles    ~30 lines (keyframe + particle/container classes)
Total new CSS:         ~55 lines
```

Effects 1, 4, 5 are purely JS/Framer Motion — no CSS additions needed.

---

## JS Budget Summary (component changes)

| Effect | New JS Lines | Files Changed |
|--------|-------------|---------------|
| 1. Split char reveal | ~25 lines | HeroAbout.tsx |
| 2. Holographic shimmer | ~3 lines (add class) | Achievements.tsx, globals.css |
| 3. Floating particles | ~20 lines each | HeroAbout.tsx, Contact.tsx |
| 4. Clip-path headers | ~15 lines (variants) + ~5 per section | lib/animations.ts + 5 sections |
| 5. Magnetic icons | ~35 lines | Contact.tsx |
| **Total** | **~130 lines new JS** | **8 files** |

---

## New Files

None. All changes go into existing files.

Optional: If DEV prefers, particle rendering could be extracted to a `components/ui/Particles.tsx` component to avoid duplication between Hero and Contact. DS recommends this but defers to DEV.

---

## Accessibility Summary

| Effect | Reduced Motion Behavior |
|--------|------------------------|
| Split char reveal | Entire name fades as one block |
| Holographic shimmer | `::after` hidden (`display: none`) |
| Floating particles | Static dots at 30% opacity (no float) |
| Clip-path headers | Simple opacity fade |
| Magnetic icons | Disabled (no pull) |

All effects are decorative — they do not convey information. Safe to disable entirely for `prefers-reduced-motion`.

---

## Testing Checklist (for QA)

- [ ] Split char: Name renders correctly (no missing chars, spaces preserved)
- [ ] Split char: Animation completes within 1.0s
- [ ] Split char: Gradient text visible on all characters
- [ ] Shimmer: Sweeps once per hover entry (not looping)
- [ ] Shimmer: Works in both light and dark modes
- [ ] Shimmer: Doesn't obscure card text
- [ ] Particles: No hydration mismatch errors (SSR deterministic)
- [ ] Particles: Don't interfere with content interactions
- [ ] Particles: Reduced count on mobile (8 Hero, 5 Contact)
- [ ] Clip-path: Headers reveal left-to-right on scroll
- [ ] Clip-path: Subtitle appears after header
- [ ] Clip-path: Works on all 5 sections
- [ ] Magnetic: Icons pull toward cursor within 80px
- [ ] Magnetic: Icons spring back on leave
- [ ] Magnetic: Disabled on mobile
- [ ] All: `prefers-reduced-motion` respected
- [ ] All: No performance regression (check with Lighthouse)
- [ ] All: Light mode + Dark mode both correct

---

## Known Gotchas for DEV

1. **SSR Hydration (Effect 3):** `Math.random()` in particle generation will cause hydration mismatch. MUST use deterministic seed function as specified above.

2. **Gradient text + clipPath (Effect 4):** Framer Motion's `clipPath` works natively — no need for CSS. However, ensure the `<motion.h2>` with `gradient-text` doesn't have conflicting `-webkit-background-clip` issues. Test in Safari specifically.

3. **Shimmer z-index (Effect 2):** The `::after` shimmer must be `z-index: 1`, and all card text content must be `z-index: 2` with `position: relative`. Without this, shimmer will render ON TOP of text.

4. **Magnetic + Framer Motion conflict (Effect 5):** The existing `whileHover={{ scale: 1.1 }}` on social icons uses Framer Motion's internal transform. The magnetic `translate()` uses inline style. These should compose correctly since Framer Motion applies scale and inline style applies translate. But DEV should verify — if they conflict, use Framer Motion's `x` and `y` motion values instead.

5. **Container stagger timing (Effect 1):** The Hero uses a parent `container` variant with `staggerChildren: 0.08`. The split-char effect has its own `delay: i * 0.035` per character. These could compound. DEV should either:
   - Remove the char `<h1>` from parent stagger (make it `initial="hidden" animate="show"` independently), OR
   - Remove per-char delay and rely on parent stagger (but parent stagger of 0.08 is too slow for chars)
   - **Recommendation:** Make the h1 animate independently, not as a child of the container.

---

*Specs refined from Sprint 11 P1 backlog. Ready for PM review and Sprint 15 kickoff.*
