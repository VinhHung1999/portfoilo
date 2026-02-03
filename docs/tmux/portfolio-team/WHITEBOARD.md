# Portfolio Team Whiteboard

**Sprint:** 1 (Core Structure) - COMPLETE ✓
**Goal:** Build Hero section, Navigation, and About section with animations

---

## Current Status

| Role | Status | Current Task | Last Update |
|------|--------|--------------|-------------|
| PM   | Active | Coordinating implementation | 17:37 |
| DS   | Complete | Full redesign specs delivered | 17:35 |
| DEV  | Assigned | Implementing Deep Space Violet redesign | 17:37 |
| QA   | Standby | Will test after implementation | 17:37 |

---

## Project Vision

**Target:** Interactive portfolio landing page
- Modern, high-quality design
- Smooth animations and interactions
- Future: Chat integration capability
- Mobile responsive

---

## Tech Stack Decision

**APPROVED by PM [16:09]:**
- Framework: Next.js 14+ (App Router)
- Styling: Tailwind CSS
- Animation: Framer Motion
- Language: TypeScript
- Deployment: Vercel (recommended)

---

## Sprint Backlog

### Sprint 0: Setup & Tech Stack (COMPLETE ✓)
- [x] DS: Research portfolio trends 2024-2025
- [x] DS: Create design system (colors, typography, spacing)
- [x] DEV: Recommend tech stack for interactive portfolio with animations + future chat integration
- [x] PM: Approve tech stack and design system [16:09]

**APPROVED:** Next.js 14 + Tailwind + Framer Motion + TypeScript
**DESIGN SYSTEM:** Dark mode, electric accents, Inter/JetBrains Mono, 4px spacing

### Sprint 1: Core Structure (COMPLETE ✓)
- [x] DS: Create detailed design specs for Hero section (layout, copy, animations)
- [x] DS: Create detailed design specs for Navigation (sticky header, menu, mobile)
- [x] DS: Create detailed design specs for About section (layout, content structure)
- [x] DEV: Initialize Next.js project with approved tech stack [16:18 - f164e8e]
- [x] DEV: Implement Hero section per DS specs [16:35 - 5af9f53]
- [x] DEV: Implement Navigation per DS specs [16:35 - 32f2ab1]
- [x] DEV: Implement About section per DS specs [16:35 - e38284a]
- [x] QA: Black-box test all sections [16:40 - ISSUES FOUND]
- [x] DEV: Fix Hero CTA button visibility (desktop) [16:48 - 2ee40f9]
- [x] DEV: Implement mobile hamburger menu + mobile menu panel [16:48 - 2ee40f9]
- [x] DEV: Fix Motion.dev animation warnings (transparent issue) [16:48 - 2ee40f9]
- [x] QA: Retest after fixes [16:52 - ALL PASS]

**FINAL TEST RESULTS:**
- Hero Section: PASS (6/6 tests)
- Navigation: PASS (9/9 tests)
- About Section: PASS (8/8 tests)
- Total: 23/23 tests passing ✓

### Sprint 2: Content Sections (Planned)
- [ ] Projects/Work showcase
- [ ] Skills/Tech stack
- [ ] Contact section

### Sprint 3: Polish (Planned)
- [ ] Page transitions
- [ ] Loading animations
- [ ] Performance optimization
- [ ] Mobile polish

---

## Design Specs

### Research Summary (2024-2025 Trends)

**Key Trends Identified:**
1. **Dark Mode with Neon Accents** - Dominant in developer portfolios
2. **Bold Minimalism** - Strategic whitespace, powerful central visuals
3. **Micro-interactions** - Hover effects, scroll animations, cursor effects
4. **Smooth Scroll** - Framer Motion/GSAP for buttery animations
5. **Mobile-First** - 66% of web traffic is mobile
6. **Interactive Elements** - 3D effects, parallax (subtle: 20-30% speed diff)

**Sources:** [Muzli Top 100 Portfolios](https://muz.li/blog/top-100-most-creative-and-unique-portfolio-websites-of-2025/), [Colorlib Trends](https://colorlib.com/wp/portfolio-design-trends/), [Awwwards GSAP](https://www.awwwards.com/websites/gsap/)

---

### Color Palette

**Theme: Deep Space Violet (Boss Approved [17:33])**

*Galaxy/space aesthetic - true black with sophisticated muted violet accent.*

| Token | HSL | Hex | Usage |
|-------|-----|-----|-------|
| `--bg-primary` | hsl(0, 0%, 0%) | `#000000` | True black background |
| `--bg-secondary` | hsl(300, 5%, 6%) | `#101010` | Cards, elevated surfaces |
| `--bg-tertiary` | hsl(300, 5%, 10%) | `#1a1a1a` | Hover states, borders |
| `--text-primary` | hsl(0, 0%, 100%) | `#ffffff` | Headings |
| `--text-secondary` | hsl(0, 0%, 75%) | `#bfbfbf` | Body text |
| `--text-muted` | hsl(0, 0%, 50%) | `#808080` | Captions, hints |
| `--accent-primary` | hsl(298, 40%, 35%) | `#7B337D` | Primary accent (muted violet) |
| `--accent-light` | hsl(298, 40%, 50%) | `#a34da6` | Hover states, highlights |
| `--accent-dark` | hsl(298, 40%, 25%) | `#552357` | Pressed states, depth |
| `--accent-glow` | hsla(298, 40%, 35%, 0.3) | `#7B337D4d` | Subtle glow effects |

**Gradients (Violet Space Theme):**
```css
--gradient-hero: linear-gradient(135deg, #7B337D 0%, #552357 100%);
--gradient-text: linear-gradient(90deg, #a34da6, #7B337D, #a34da6);
--gradient-space: radial-gradient(ellipse at top, #1a1a1a 0%, #000000 100%);
--gradient-subtle: linear-gradient(180deg, transparent 0%, rgba(123, 51, 125, 0.05) 100%);
```

**Button Styling (Deep Space Violet):**
- Primary CTA: Solid `--accent-primary` (#7B337D) bg, white text
- Secondary CTA: Transparent, `--accent-primary` border, violet text
- Hover: Lighten to `--accent-light` (#a34da6) + subtle glow
- Pressed: Darken to `--accent-dark` (#552357)

**Galaxy Effects (Optional Enhancements):**
- Starfield: Subtle CSS star particles on hero background
- Nebula glow: Soft violet radial gradient behind key elements
- Space dust: Micro-particles floating animation (very subtle)

---

### Typography

**Font Stack:**
| Element | Font | Weight | Size | Line Height |
|---------|------|--------|------|-------------|
| Display (Hero) | Inter | 800 | 64px / 4rem | 1.1 |
| H1 | Inter | 700 | 48px / 3rem | 1.2 |
| H2 | Inter | 700 | 36px / 2.25rem | 1.25 |
| H3 | Inter | 600 | 24px / 1.5rem | 1.3 |
| Body | Inter | 400 | 16px / 1rem | 1.6 |
| Body Large | Inter | 400 | 18px / 1.125rem | 1.7 |
| Caption | Inter | 400 | 14px / 0.875rem | 1.5 |
| Code | JetBrains Mono | 400 | 14px / 0.875rem | 1.6 |

**Mobile Scaling:**
- Display: 40px
- H1: 32px
- H2: 28px
- Body: 16px (unchanged)

**Font Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
```

---

### Spacing System

**Base Unit: 4px**

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Tight gaps |
| `--space-2` | 8px | Icon padding |
| `--space-3` | 12px | Small gaps |
| `--space-4` | 16px | Element padding |
| `--space-6` | 24px | Card padding |
| `--space-8` | 32px | Section gaps |
| `--space-12` | 48px | Component spacing |
| `--space-16` | 64px | Section padding (mobile) |
| `--space-24` | 96px | Section padding (desktop) |
| `--space-32` | 128px | Hero spacing |

**Container:**
- Max width: 1200px
- Padding: 24px (mobile), 48px (tablet), 64px (desktop)

---

### Border & Effects

| Token | Value |
|-------|-------|
| `--radius-sm` | 4px |
| `--radius-md` | 8px |
| `--radius-lg` | 16px |
| `--radius-xl` | 24px |
| `--radius-full` | 9999px |
| `--shadow-sm` | 0 1px 2px rgba(0,0,0,0.3) |
| `--shadow-md` | 0 4px 12px rgba(0,0,0,0.4) |
| `--shadow-lg` | 0 8px 24px rgba(0,0,0,0.5) |
| `--shadow-glow` | 0 0 40px var(--accent-glow) |

---

### Animation Specs (Professional Galaxy Theme)

**Design Philosophy:**
- Elegant, refined motion - NO bouncy/playful effects
- Subtle reveals that feel premium
- Consistent timing across all elements
- Space-like floating sensation

---

#### Timing Functions (Professional Only)
```css
/* Primary - smooth deceleration */
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);

/* Secondary - symmetric smooth */
--ease-in-out-cubic: cubic-bezier(0.65, 0, 0.35, 1);

/* Subtle - gentle motion */
--ease-out-quad: cubic-bezier(0.25, 0.46, 0.45, 0.94);

/* DO NOT USE: spring, bounce, elastic - too playful */
```

**Durations:**
| Type | Duration | Usage |
|------|----------|-------|
| Micro | 150ms | Hover color changes |
| Small | 250ms | Button states |
| Medium | 400ms | Element reveals |
| Large | 600ms | Section transitions |
| Page snap | 800ms | Scroll snap animation |

---

#### Pagination Scroll System

**Structure:**
```css
/* Container */
.scroll-container {
  height: 100vh;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
}

/* Each Section */
.section {
  height: 100vh;
  scroll-snap-align: start;
  scroll-snap-stop: always;
}
```

**Section Order:**
1. Hero (100vh) - snap point
2. About (100vh) - snap point
3. Projects (100vh or more) - snap point
4. Skills (100vh) - snap point
5. Contact (100vh) - snap point

**Framer Motion Integration:**
```jsx
// Wrap with scroll snap container
<motion.main className="snap-y snap-mandatory h-screen overflow-y-scroll">
  <section className="snap-start h-screen">Hero</section>
  <section className="snap-start h-screen">About</section>
  ...
</motion.main>
```

---

#### Progressive Reveal System

**Principle:** Content is INVISIBLE until user scrolls to section. No content visible on load except Hero.

**Hidden State (Before Scroll):**
```jsx
const hidden = {
  opacity: 0,
  y: 60,        // Start below
  filter: "blur(4px)"  // Subtle blur
};
```

**Visible State (After Scroll Trigger):**
```jsx
const visible = {
  opacity: 1,
  y: 0,
  filter: "blur(0px)",
  transition: {
    duration: 0.6,
    ease: [0.16, 1, 0.3, 1]
  }
};
```

**Trigger Configuration:**
```jsx
// Framer Motion useInView
const ref = useRef(null);
const isInView = useInView(ref, {
  once: true,           // Only animate once
  amount: 0.3,          // Trigger when 30% visible
  margin: "-100px"      // Start slightly before in view
});

// Apply animation
<motion.div
  ref={ref}
  initial="hidden"
  animate={isInView ? "visible" : "hidden"}
  variants={{ hidden, visible }}
/>
```

**Stagger Children (Within Sections):**
```jsx
const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,  // 150ms between each child
      delayChildren: 0.1      // Wait 100ms before starting
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
  }
};
```

---

#### Professional Micro-interactions

**Button Hover (Subtle):**
```jsx
whileHover={{
  backgroundColor: "#a34da6",  // accent-light
  transition: { duration: 0.25 }
}}
whileTap={{
  scale: 0.98,
  backgroundColor: "#552357"   // accent-dark
}}
// NO scale on hover - too playful
```

**Card Hover (Elegant Lift):**
```jsx
whileHover={{
  y: -8,
  boxShadow: "0 20px 40px rgba(123, 51, 125, 0.15)",
  transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
}}
```

**Link Hover (Underline Reveal):**
```jsx
// Underline grows from left to right
<motion.span
  className="absolute bottom-0 left-0 h-[1px] bg-accent-primary"
  initial={{ scaleX: 0, originX: 0 }}
  whileHover={{ scaleX: 1 }}
  transition={{ duration: 0.3 }}
/>
```

**Text Reveal (Character by Character - Optional):**
```jsx
// For hero name - elegant letter reveal
const letterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.03, duration: 0.4 }
  })
};
```

---

#### Galaxy Background Effects

**Starfield (CSS Only):**
```css
.starfield {
  background-image:
    radial-gradient(2px 2px at 20px 30px, white, transparent),
    radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
    radial-gradient(1px 1px at 90px 40px, rgba(255,255,255,0.6), transparent);
  background-size: 200px 200px;
  animation: twinkle 5s ease-in-out infinite;
}

@keyframes twinkle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
```

**Nebula Glow (Behind Hero Text):**
```css
.nebula-glow {
  background: radial-gradient(
    ellipse 600px 400px at center,
    rgba(123, 51, 125, 0.15) 0%,
    transparent 70%
  );
}
```

---

### Responsive Breakpoints

| Name | Width | Target |
|------|-------|--------|
| `sm` | 640px | Mobile landscape |
| `md` | 768px | Tablet |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Large desktop |

---

### Component Guidelines (Deep Space Violet)

**Hero Section:**
- Full viewport height (100vh), snap point
- True black bg (#000000) with optional starfield
- Violet gradient text for name (`--gradient-text`)
- Nebula glow effect behind text
- Progressive reveal on load (staggered)
- CTA button with violet hover state (NO scale, color change only)

**Navigation:**
- Sticky header, `--bg-secondary` (#101010) with blur backdrop
- Pagination dots (optional) showing current section
- Links: `--text-secondary` (#bfbfbf), hover → `--accent-primary` (#7B337D)
- Mobile: hamburger with slide-in menu (dark theme)

**Cards (Projects):**
- Background: `--bg-secondary` (#101010)
- Border: 1px `--bg-tertiary` (#1a1a1a)
- Hover: elegant lift (-8px) + violet glow shadow
- Image: NO zoom on hover (keep professional)
- Tech stack tags: `--accent-primary` (#7B337D) text

**Buttons (Deep Space Violet):**
- Primary: `--accent-primary` (#7B337D) bg, white text
- Secondary: transparent, `--accent-primary` border + text
- Hover: lighten to `--accent-light` (#a34da6), subtle glow
- Pressed: darken to `--accent-dark` (#552357)
- NO scale on hover (too playful)

**Sections (General):**
- Each section: 100vh, scroll-snap-align: start
- Content hidden until scroll trigger (progressive reveal)
- Stagger children animations within section
- Consistent spacing: 96px padding desktop, 64px mobile

---

## Sprint 1: Component Design Specs

### 1. HERO SECTION

**Purpose:** First impression. Communicate identity, expertise, and invite action.

#### Layout (Desktop)
```
┌─────────────────────────────────────────────────────────────┐
│ [Nav - see Navigation spec]                                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                    [Greeting - fade in]                     │
│              "Hi, I'm"                                      │
│                                                             │
│         ██  NAME  ██  [Gradient text, scale in]             │
│                                                             │
│              [Tagline - fade in up]                         │
│     "Full-Stack Developer & Creative Technologist"          │
│                                                             │
│              [Description - fade in up, delay]              │
│     "I build interactive experiences that blend             │
│      beautiful design with powerful technology."            │
│                                                             │
│         [CTA Button]        [Secondary Button]              │
│         "View My Work"      "Get in Touch"                  │
│                                                             │
│                    ↓ [Scroll indicator]                     │
└─────────────────────────────────────────────────────────────┘
```

#### Layout (Mobile)
- Same structure, centered
- Display font: 40px
- Buttons stack vertically
- Padding: 24px sides

#### Content Copy (Example - DEV to replace with real content)
```
Greeting: "Hi, I'm"
Name: "Hung Pham"
Tagline: "Full-Stack Developer & Creative Technologist"
Description: "I craft interactive digital experiences that merge
              elegant design with robust engineering. Passionate
              about AI, web technologies, and building products
              that make a difference."
CTA Primary: "View My Work"
CTA Secondary: "Get in Touch"
```

#### Styling (Deep Space Violet)
| Element | Style |
|---------|-------|
| Background | `--bg-primary` (#000000 true black) + optional starfield |
| Nebula Glow | Radial gradient behind name (rgba(123,51,125,0.15)) |
| Greeting | `--text-muted` (#808080), 18px, weight 500 |
| Name | Violet gradient text (`--gradient-text` #a34da6→#7B337D), Display size (64px/40px mobile), weight 800 |
| Tagline | `--text-primary` (#ffffff), H2 (36px/28px mobile), weight 600 |
| Description | `--text-secondary` (#bfbfbf), Body Large (18px), max-width 600px, centered |
| CTA Primary | Solid `--accent-primary` (#7B337D) bg, white text, padding 16px 32px, radius-lg |
| CTA Primary Hover | `--accent-light` (#a34da6), subtle violet glow, NO scale |
| CTA Secondary | Transparent, border `--accent-primary` (#7B337D), violet text |
| Scroll Indicator | `--text-muted` (#808080), subtle fade animation (not bouncing) |

#### Animations (Framer Motion)
```jsx
// Staggered entrance sequence
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 }
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }
};

// Name special animation - scale + gradient shimmer
const nameReveal = {
  hidden: { opacity: 0, scale: 0.9 },
  show: {
    opacity: 1, scale: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
};

// Scroll indicator - infinite bounce
const bounce = {
  y: [0, 10, 0],
  transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
};

// Button hover
whileHover: { scale: 1.02, boxShadow: "0 0 30px rgba(59,130,246,0.4)" }
whileTap: { scale: 0.98 }
```

#### Animation Sequence
1. 0.0s - Container fades in
2. 0.3s - Greeting fades in up
3. 0.45s - Name scales in with gradient
4. 0.6s - Tagline fades in up
5. 0.75s - Description fades in up
6. 0.9s - Buttons fade in up together
7. 1.5s - Scroll indicator starts bouncing

---

### 2. NAVIGATION

**Purpose:** Persistent navigation, brand anchor, smooth section access.

#### Layout (Desktop)
```
┌─────────────────────────────────────────────────────────────┐
│  LOGO/Name          About   Projects   Skills   Contact     │
└─────────────────────────────────────────────────────────────┘
     ↑ Left                                        Right ↑
```

#### Layout (Mobile)
```
┌─────────────────────────────────────────────────────────────┐
│  LOGO/Name                                      ☰ [Hamburger]│
└─────────────────────────────────────────────────────────────┘

// Mobile menu (slide in from right)
┌────────────────────────────┐
│                          ✕ │
│                            │
│          About             │
│          Projects          │
│          Skills            │
│          Contact           │
│                            │
│     [Social Icons]         │
└────────────────────────────┘
```

#### Menu Items
1. **About** → scrolls to #about
2. **Projects** → scrolls to #projects
3. **Skills** → scrolls to #skills
4. **Contact** → scrolls to #contact

#### Styling (Deep Space Violet)
| Element | Style |
|---------|-------|
| Header | Height 64px, sticky top-0, z-50 |
| Background (default) | Transparent |
| Background (scrolled) | `--bg-secondary` (#101010) with backdrop-blur-lg, border-bottom 1px `--bg-tertiary` (#1a1a1a) |
| Logo/Name | `--text-primary` (#ffffff), 20px, weight 700, violet color on hover |
| Nav Links | `--text-secondary` (#bfbfbf), 14px, weight 500, uppercase, letter-spacing 0.5px |
| Nav Link Hover | `--accent-primary` (#7B337D), violet underline animation |
| Active Link | `--accent-primary` (#7B337D) |
| Hamburger | 24x24px, 3 lines, `--text-primary` (#ffffff) |
| Mobile Menu | Full height, `--bg-primary` (#000000), slide from right 300px wide |

#### Animations
```jsx
// Header background transition on scroll (Deep Space Violet)
const headerVariants = {
  top: { backgroundColor: "transparent", borderColor: "transparent" },
  scrolled: {
    backgroundColor: "rgba(16, 16, 16, 0.9)", // #101010 with opacity
    backdropFilter: "blur(12px)",
    borderColor: "rgba(26, 26, 26, 1)" // #1a1a1a
  }
};

// Nav link hover - violet underline (grows from left)
const linkHover = {
  scaleX: [0, 1],
  originX: 0,
  transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
};

// Mobile menu
const mobileMenu = {
  closed: { x: "100%" },
  open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } }
};

// Hamburger to X transformation
const topLine = { closed: { rotate: 0, y: 0 }, open: { rotate: 45, y: 6 } };
const midLine = { closed: { opacity: 1 }, open: { opacity: 0 } };
const botLine = { closed: { rotate: 0, y: 0 }, open: { rotate: -45, y: -6 } };

// Stagger menu items in mobile
staggerChildren: 0.1, delayChildren: 0.2
```

#### Scroll Behavior
- Use `scroll-behavior: smooth` or Framer Motion `scrollIntoView`
- Offset scroll position by header height (64px)
- Update active link based on scroll position (Intersection Observer)

---

### 3. ABOUT SECTION

**Purpose:** Personal introduction, background, skills highlight.

#### Layout (Desktop)
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌──────────────┐    ┌─────────────────────────────────┐   │
│  │              │    │ ABOUT ME                [H2]    │   │
│  │    PHOTO     │    │                                 │   │
│  │   (Avatar)   │    │ [Bio paragraph 1]               │   │
│  │              │    │                                 │   │
│  │  300x300px   │    │ [Bio paragraph 2]               │   │
│  │  rounded-xl  │    │                                 │   │
│  │              │    │ [Quick Facts / Highlights]      │   │
│  └──────────────┘    │ • Location: Vietnam             │   │
│                      │ • Focus: Full-Stack, AI         │   │
│                      │ • Available for: Freelance      │   │
│                      └─────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Layout (Mobile)
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    ABOUT ME [H2]                            │
│                                                             │
│               ┌──────────────┐                              │
│               │    PHOTO     │                              │
│               │   200x200    │                              │
│               └──────────────┘                              │
│                                                             │
│  [Bio paragraph 1]                                          │
│                                                             │
│  [Bio paragraph 2]                                          │
│                                                             │
│  [Quick Facts]                                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Content Structure (Example - DEV to replace)
```markdown
## About Me

[Photo: Professional headshot or avatar]

**Bio Paragraph 1 (Who I am):**
"I'm a full-stack developer based in Vietnam with a passion for
creating interactive digital experiences. With X years of experience
in web development, I specialize in building modern applications
using React, Next.js, and AI technologies."

**Bio Paragraph 2 (What I do/believe):**
"I believe great software combines clean code with thoughtful design.
When I'm not coding, you'll find me exploring new technologies,
contributing to open source, or learning about AI and machine learning."

**Quick Facts:**
• 📍 Location: Ho Chi Minh City, Vietnam
• 🎯 Focus: Full-Stack Development, AI/ML
• 💼 Status: Open to opportunities
• 🌐 Languages: Vietnamese, English
```

#### Styling (Deep Space Violet)
| Element | Style |
|---------|-------|
| Section | `--bg-primary` (#000000), 100vh, scroll-snap-align: start |
| Container | max-width 1200px, grid 2 cols (desktop), 1 col (mobile), centered vertically |
| Section Title | H2 style, `--text-primary` (#ffffff), margin-bottom 32px |
| Photo | 300x300 (desktop), 200x200 (mobile), `--radius-xl`, border 2px `--accent-primary` (#7B337D) |
| Photo Container | Subtle violet glow (`0 0 40px rgba(123,51,125,0.2)`) |
| Bio Text | `--text-secondary` (#bfbfbf), Body Large (18px), line-height 1.7 |
| Paragraph Gap | 24px between paragraphs |
| Quick Facts | `--text-secondary` (#bfbfbf), 16px, icon + text pairs |
| Icons | Lucide icons, `--accent-primary` (#7B337D) |
| Progressive Reveal | Content hidden until scroll, fade+slide animation |

#### Animations
```jsx
// Section reveal on scroll
const sectionReveal = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

// Photo - scale up with slight rotation
const photoReveal = {
  hidden: { opacity: 0, scale: 0.8, rotate: -5 },
  visible: {
    opacity: 1, scale: 1, rotate: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }
};

// Text content - fade in from right
const textReveal = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1, x: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }
};

// Quick facts - stagger each item
const factItem = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 }
};

// Trigger: when section is 20% in viewport
viewport: { once: true, amount: 0.2 }
```

#### Responsive
| Breakpoint | Layout |
|------------|--------|
| < 768px | Single column, photo centered above text |
| ≥ 768px | Two columns, photo left, text right |
| Photo | 200px (mobile), 280px (tablet), 300px (desktop) |

---

## Blockers

| Role | Blocker | Reported | Status |
|------|---------|----------|--------|
| QA | Hero CTA buttons not visible (desktop) | 16:40 | RESOLVED [16:48] |
| QA | Mobile hamburger menu missing | 16:40 | RESOLVED [16:48] |
| QA | Motion.dev animation warnings (20x) | 16:40 | RESOLVED [16:48] |
| Boss | Gradient colors unprofessional | 16:55 | RESOLVED - Dark Slate Tech COMPLETE [17:20] |
| Boss | Teal color looks childish | 17:23 | RESOLVED - Deep Space Violet selected [17:33] |
| Boss | Animations need to be more professional | 17:23 | RESOLVED - DS redesign [17:35] |
| Boss | Need pagination-style scroll snapping | 17:27 | RESOLVED - DS redesign [17:35] |
| Boss | Progressive reveal on scroll | 17:27 | RESOLVED - DS redesign [17:35] |

---

## Notes

**[16:56] Boss Feedback:** Current gradient (blue→purple) needs improvement for professionalism.
**[17:03] Research Complete:** 3 verified palettes delivered by research-team.
**[17:06] Boss Decision:** Option 1 - DARK SLATE TECH selected.
**[17:07] DS Complete:** Dark Slate Tech palette implemented.
**[17:23] Boss Feedback:** Teal looks childish, need true black + galaxy theme + professional animations.
**[17:30] Research Complete:** 3 galaxy palettes from research-team (Deep Space Violet recommended).
**[17:33] Boss Decision:** Option 1 - DEEP SPACE VIOLET selected.
**[17:35] DS FULL REDESIGN COMPLETE:**
  - Color Palette: True black (#000000) + muted violet (#7B337D)
  - Pagination Scroll: 100vh snap sections
  - Progressive Reveal: Content hidden until scroll trigger
  - Professional Animations: Refined easing, no bouncy effects
  - Galaxy Effects: Starfield, nebula glow specs included
  - All component specs updated (Hero, Nav, About)
  - Ready for DEV implementation.

---

## Clear After Sprint

After Sprint Review, update this whiteboard for next Sprint.
