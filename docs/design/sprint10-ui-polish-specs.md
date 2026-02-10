# Sprint 10: UI Polish — Design Specs

**Designer:** DS | **Status:** READY FOR REVIEW
**Source:** Boss feedback + full UI/UX audit of production site

---

## Priority Tiers

| Tier | Meaning | Items |
|------|---------|-------|
| **P0** | Boss explicitly complained | C1, C2 |
| **P1** | Critical UX issues found in audit | C3, C4, C5 |
| **P2** | Major polish & accessibility | M1–M5 |
| **P3** | Minor (future sprints) | m1–m6 |

**Recommendation for Sprint 10 scope:** P0 + P1 (5 items). P2/P3 can be backlogged.

---

## P0: Boss-Reported Issues

### C1. Navigation Active State (Scroll Spy)

**Problem:** Nav links all look the same regardless of scroll position. User has no idea which section they're viewing.

**Files affected:** `components/layout/Navigation.tsx`, new hook `hooks/useActiveSection.ts`

#### Design: Active Section Indicator

**Desktop Nav:**

```
  Home    Experience    [Projects]    Skills    Achievements    Contact
                        ‾‾‾‾‾‾‾‾‾
                        (gradient underline + color change)
```

| State | Text Color | Underline | Transition |
|-------|-----------|-----------|------------|
| Default | `--text-secondary` | none | — |
| Hover | `--cta` | grows from left, 2px, `--cta` (existing behavior) | 300ms |
| **Active** | `--cta` | **persistent 2px bottom bar**, gradient `--gradient-start` → `--gradient-end` | 200ms ease-out |

Active underline spec:
- Height: 2px
- Width: 100% of text
- Background: `linear-gradient(90deg, var(--gradient-start), var(--gradient-end))`
- Position: absolute bottom-0
- Border-radius: 1px (pill ends)
- Transition: opacity 200ms, width must NOT animate (instant switch, not slide)

**Mobile Menu:**

```
      Home
      Experience
  >   Projects        <- active: left accent bar + cta color
      Skills
      Achievements
      Contact
```

| State | Text Color | Indicator |
|-------|-----------|-----------|
| Default | `--text-primary` | none |
| **Active** | `--cta` | 3px left bar, gradient, border-radius 2px |

#### Scroll Spy Behavior

**Mechanism:** `IntersectionObserver` watching all section `id` elements.

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| `threshold` | 0.3 (30% visible) | Triggers when section is meaningfully in view |
| `rootMargin` | `-80px 0px -40% 0px` | Top: offset for fixed nav (64px + buffer). Bottom: bias toward upper content |
| Debounce | None needed | IntersectionObserver is already efficient |

**Section IDs to observe:** `hero`, `experience`, `projects`, `skills`, `achievements`, `contact`

**Edge cases:**
- Page load → default to `hero`
- Multiple sections visible → pick the one closest to top of viewport
- User scrolls past last section → `contact` stays active

**New hook:** `hooks/useActiveSection.ts`
```
useActiveSection(sectionIds: string[]) → activeSection: string
```

---

### C2. URL Hash Updates

**Problem:** URL never changes when scrolling. Users can't bookmark or share links to specific sections. Browser back/forward doesn't navigate sections.

**Files affected:** `lib/scroll.ts`, `hooks/useActiveSection.ts`, `components/layout/Navigation.tsx`

#### Design: Hash Sync Behavior

**Two directions:**

1. **Scroll → Hash:** When `activeSection` changes (from scroll spy), update URL hash.
2. **Hash → Scroll:** On page load, if URL has `#section`, scroll to it.

| Event | Action |
|-------|--------|
| Scroll spy detects new active section | `history.replaceState(null, '', '#' + sectionId)` |
| Nav link clicked | `history.pushState(null, '', '#' + sectionId)` + smooth scroll |
| Page load with `#hash` | Smooth scroll to that section after mount |
| Browser back/forward | Listen to `popstate` → scroll to hash target |

**Important:** Use `replaceState` for scroll-triggered updates (don't pollute back history). Use `pushState` only for deliberate nav clicks.

**Hash value when at top:** `#hero` or empty string (clear hash). Recommendation: clear hash when at hero — cleaner URL.

---

## P1: Critical Issues Found in Audit

### C3. Theme Flash on Load (FOUC)

**Problem:** `ThemeProvider` returns `null` until `mounted` is `true` (line 42-44 in `lib/theme.tsx`). This means the entire page is blank on first render until client hydration completes.

**File affected:** `lib/theme.tsx`, `app/layout.tsx`

#### Design: Inline Theme Script

Replace the `return null` pattern with a blocking `<script>` in `<head>` that sets `data-theme` before any rendering:

```html
<script>
  (function() {
    var t = localStorage.getItem('theme');
    if (!t) t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', t);
  })();
</script>
```

This runs synchronously before paint. The `ThemeProvider` can then:
- Read `data-theme` from DOM on mount (instead of defaulting to "light")
- Remove the `if (!mounted) return null` guard
- Use `suppressHydrationWarning` on `<html>` to prevent mismatch warnings

**Result:** Zero flash. Theme is correct from the very first frame.

---

### C4. Light Mode Shadows Too Dark

**Problem:** Shadow opacities (0.3, 0.4, 0.5) in `globals.css` lines 57-59 are dark-mode values applied to light mode. Cards and elements look heavy/harsh on white backgrounds.

**File affected:** `app/globals.css`

#### Design: Corrected Shadow Values

**Light mode (`:root`):**

| Variable | Current | New |
|----------|---------|-----|
| `--shadow-sm` | `rgba(0,0,0, 0.3)` | `rgba(0,0,0, 0.06)` |
| `--shadow-md` | `rgba(0,0,0, 0.4)` | `rgba(0,0,0, 0.1)` |
| `--shadow-lg` | `rgba(0,0,0, 0.5)` | `rgba(0,0,0, 0.15)` |

**Dark mode (`[data-theme="dark"]`):** Add explicit overrides (keep higher opacity for dark bg):

| Variable | Value |
|----------|-------|
| `--shadow-sm` | `rgba(0,0,0, 0.3)` |
| `--shadow-md` | `rgba(0,0,0, 0.4)` |
| `--shadow-lg` | `rgba(0,0,0, 0.5)` |

---

### C5. Hardcoded Violet Colors in Animation Variants

**Problem:** `lib/animations.ts` hardcodes violet glow colors (`rgba(123, 51, 125, ...)`) for card hover and button states. In light mode, the theme uses blue (`--cta: #2563EB`), so violet glow is visually inconsistent.

**File affected:** `lib/animations.ts`

#### Design: Theme-Aware Hover Effects

Since Framer Motion `variants` are static objects (no CSS variables), the fix should move hover shadows to CSS classes or use inline style computation.

**Option A (recommended):** Replace Framer Motion hover shadows with CSS-based hover:

```css
/* In globals.css */
.card-hover {
  transition: transform 0.3s var(--ease-out-expo), box-shadow 0.3s var(--ease-out-expo);
}
.card-hover:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px var(--cta-glow);
}
```

This automatically respects theme because `--cta-glow` is already defined per theme.

**Card hover shadow values:**

| Theme | `--cta-glow` | Result |
|-------|-------------|--------|
| Light | `rgba(37, 99, 235, 0.3)` | Blue glow |
| Dark | `rgba(59, 130, 246, 0.3)` | Blue glow |

**Button variants** (lines 106-117): Same approach — use CSS hover with `--cta-hover` instead of hardcoded `#a34da6`.

---

## P2: Major Polish (Backlog Recommended)

### M1. Dark Mode Muted Text Contrast

**Problem:** `--text-muted: #71717A` on dark bg `#09090B` gives ~4.2:1 contrast ratio — fails WCAG AA (needs 4.5:1).

**Fix:** Change dark mode `--text-muted` to `#A1A1AA` (contrast ~7:1).

---

### M2. Mobile Menu Missing AnimatePresence

**Problem:** Overlay backdrop (`{isOpen && <motion.div exit={...}>}`) never plays exit animation because it's not wrapped in `<AnimatePresence>`.

**Fix:** Wrap the overlay conditional render with `<AnimatePresence>`.

---

### M3. Mobile Menu Focus Trap & Escape Key

**Problem:** Mobile menu has no focus trap, no `role="dialog"`, no Escape key to close. Keyboard/screen-reader users can tab behind the overlay.

**Fix:**
- Add `role="dialog"` and `aria-modal="true"` to mobile menu
- Trap focus within menu when open
- Close on `Escape` keypress
- Return focus to hamburger button on close

---

### M4. Project Modal Accessibility

**Problem:** Project detail modal lacks `role="dialog"`, `aria-modal`, focus trap, Escape key handler, and `aria-label` on close button.

**Fix:** Same pattern as M3 — dialog role, focus trap, Escape handler.

---

### M5. No Skip-to-Content Link

**Problem:** No way for keyboard users to bypass navigation. WCAG 2.4.1 failure.

**Fix:** Add visually hidden skip link as first element in page:
```html
<a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-[--cta] focus:text-white focus:px-4 focus:py-2 focus:rounded-md">
  Skip to content
</a>
```
Add `id="main-content"` to `<main>`.

---

## P3: Minor Issues (Future Sprints)

| ID | Issue | Quick Description |
|----|-------|-------------------|
| m1 | Global 44px min touch target | `button, a { min-height: 44px }` in CSS breaks small tags/pills on mobile. Apply selectively instead. |
| m2 | Inline styles everywhere | Nav uses JS `onMouseEnter`/`onMouseLeave` for hover colors instead of CSS `:hover`. Keyboard focus never triggers color. Migrate to CSS classes. |
| m3 | Blunt mobile typography override | `h1, .text-5xl, .text-7xl { font-size: 0.85em }` — should use responsive Tailwind classes on elements. |
| m4 | Duplicate mobile/desktop hero | HeroAbout renders full content twice (`md:hidden` + `hidden md:grid`). Refactor to single responsive layout. |
| m5 | No loading/error fallback | `page.tsx` uses `force-dynamic` + `getPortfolioContent()` with no error boundary or skeleton fallback. |
| m6 | Dead CSS class | `.animated-element` defined but never used. Clean up. |

---

## Implementation Notes for DEV

### Recommended File Changes (P0 + P1)

| File | Changes |
|------|---------|
| **NEW** `hooks/useActiveSection.ts` | IntersectionObserver hook returning active section ID |
| `components/layout/Navigation.tsx` | Consume `useActiveSection`, apply active styles, add AnimatePresence for overlay |
| `lib/scroll.ts` | Add `pushState` after `scrollIntoView`. Add `onHashLoad()` for initial hash scroll |
| `lib/theme.tsx` | Remove `return null` guard, read `data-theme` from DOM on mount |
| `app/layout.tsx` | Add inline `<script>` for theme init before hydration, add `suppressHydrationWarning` to `<html>` |
| `app/globals.css` | Fix light-mode shadow values, add dark-mode shadow overrides, add `.card-hover` utility |
| `lib/animations.ts` | Remove hardcoded violet from `cardHoverVariants` and `buttonVariants`, or replace with CSS approach |

### Testing Checklist

- [ ] Scroll through all sections — nav highlights correct section
- [ ] Click nav link — URL updates with `#section`, smooth scroll works
- [ ] Refresh page with `#experience` in URL — scrolls to Experience
- [ ] Browser back/forward after clicking nav links — navigates correctly
- [ ] First load — no blank white flash (test with throttled connection)
- [ ] Light mode — shadows are subtle, not harsh
- [ ] Dark mode — shadows still visible and appropriate
- [ ] Card hover in light mode — blue glow, not violet
- [ ] Mobile — nav highlights work in mobile menu too

---

*End of Sprint 10 UI Polish Specs*
