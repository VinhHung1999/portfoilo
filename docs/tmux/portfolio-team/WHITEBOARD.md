# Portfolio Team Whiteboard

**Sprint:** 1 (Core Structure)
**Goal:** Build Hero section, Navigation, and About section with animations

---

## Current Status

| Role | Status | Current Task | Last Update |
|------|--------|--------------|-------------|
| PM   | Active | Coordinating Sprint 1 fixes | 16:40 |
| DS   | Complete | Design specs delivered | 16:15 |
| DEV  | Assigned | Fix QA issues (Hero, Nav) | 16:40 |
| QA   | Waiting | Retest after DEV fixes | 16:40 |

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

### Sprint 1: Core Structure (ACTIVE)
- [x] DS: Create detailed design specs for Hero section (layout, copy, animations)
- [x] DS: Create detailed design specs for Navigation (sticky header, menu, mobile)
- [x] DS: Create detailed design specs for About section (layout, content structure)
- [x] DEV: Initialize Next.js project with approved tech stack [16:18 - f164e8e]
- [x] DEV: Implement Hero section per DS specs [16:35 - 5af9f53]
- [x] DEV: Implement Navigation per DS specs [16:35 - 32f2ab1]
- [x] DEV: Implement About section per DS specs [16:35 - e38284a]
- [x] QA: Black-box test all sections [16:40 - ISSUES FOUND]
- [ ] DEV: Fix Hero CTA button visibility (desktop)
- [ ] DEV: Implement mobile hamburger menu + mobile menu panel
- [ ] DEV: Fix Motion.dev animation warnings (transparent issue)
- [ ] QA: Retest after fixes

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

**Theme: Dark Mode with Electric Accents**

| Token | HSL | Hex | Usage |
|-------|-----|-----|-------|
| `--bg-primary` | hsl(220, 20%, 6%) | `#0d1117` | Main background |
| `--bg-secondary` | hsl(220, 20%, 10%) | `#161b22` | Cards, sections |
| `--bg-tertiary` | hsl(220, 20%, 14%) | `#21262d` | Hover states |
| `--text-primary` | hsl(0, 0%, 100%) | `#ffffff` | Headings |
| `--text-secondary` | hsl(220, 10%, 75%) | `#b8c0cc` | Body text |
| `--text-muted` | hsl(220, 10%, 50%) | `#6e7681` | Captions, hints |
| `--accent-primary` | hsl(210, 100%, 60%) | `#3b82f6` | Primary CTA, links |
| `--accent-secondary` | hsl(280, 80%, 65%) | `#a855f7` | Gradient partner |
| `--accent-success` | hsl(142, 70%, 50%) | `#22c55e` | Success states |
| `--accent-glow` | hsl(210, 100%, 60%, 0.3) | `#3b82f64d` | Neon glow effects |

**Gradient:**
```css
--gradient-hero: linear-gradient(135deg, #3b82f6 0%, #a855f7 100%);
--gradient-text: linear-gradient(90deg, #3b82f6, #a855f7, #3b82f6);
```

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

### Animation Specs

**Timing Functions:**
```css
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
--spring: cubic-bezier(0.34, 1.56, 0.64, 1);
```

**Durations:**
| Type | Duration |
|------|----------|
| Micro (hover) | 150ms |
| Small (buttons) | 200ms |
| Medium (cards) | 300ms |
| Large (sections) | 500ms |
| Page transition | 600ms |

**Micro-interactions:**
- Button hover: scale(1.02), glow effect
- Card hover: translateY(-4px), shadow-lg
- Link hover: gradient underline animation
- Scroll reveal: fadeInUp with stagger 100ms

**Scroll Animations (Framer Motion):**
```jsx
// Fade in up on scroll
{ opacity: 0, y: 40 } → { opacity: 1, y: 0 }
duration: 0.6, ease: [0.16, 1, 0.3, 1]

// Stagger children
staggerChildren: 0.1
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

### Component Guidelines

**Hero Section:**
- Full viewport height (100vh)
- Gradient text for name/title
- Subtle floating animation on decorative elements
- CTA button with glow on hover

**Navigation:**
- Sticky header, blur backdrop
- Smooth scroll to sections
- Mobile: hamburger with slide-in menu

**Cards (Projects):**
- Hover lift with shadow
- Image with subtle zoom on hover
- Tech stack tags with accent colors

**Buttons:**
- Primary: gradient background, white text
- Secondary: transparent, border accent
- Hover: scale + glow

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

#### Styling
| Element | Style |
|---------|-------|
| Background | `--bg-primary` (#0d1117) |
| Greeting | `--text-muted`, 18px, weight 500 |
| Name | Gradient text (`--gradient-text`), Display size (64px/40px mobile), weight 800 |
| Tagline | `--text-primary`, H2 (36px/28px mobile), weight 600 |
| Description | `--text-secondary`, Body Large (18px), max-width 600px, centered |
| CTA Primary | Gradient bg, white text, padding 16px 32px, radius-lg, glow on hover |
| CTA Secondary | Transparent, border `--accent-primary`, padding 16px 32px, radius-lg |
| Scroll Indicator | `--text-muted`, bouncing chevron animation |

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

#### Styling
| Element | Style |
|---------|-------|
| Header | Height 64px, sticky top-0, z-50 |
| Background (default) | Transparent |
| Background (scrolled) | `--bg-secondary` with backdrop-blur-lg, border-bottom 1px `--bg-tertiary` |
| Logo/Name | `--text-primary`, 20px, weight 700, gradient on hover |
| Nav Links | `--text-secondary`, 14px, weight 500, uppercase, letter-spacing 0.5px |
| Nav Link Hover | `--text-primary`, underline gradient animation |
| Active Link | `--accent-primary` |
| Hamburger | 24x24px, 3 lines, `--text-primary` |
| Mobile Menu | Full height, `--bg-primary`, slide from right 300px wide |

#### Animations
```jsx
// Header background transition on scroll
const headerVariants = {
  top: { backgroundColor: "transparent", borderColor: "transparent" },
  scrolled: {
    backgroundColor: "rgba(22, 27, 34, 0.8)",
    backdropFilter: "blur(12px)",
    borderColor: "rgba(33, 38, 45, 1)"
  }
};

// Nav link hover - gradient underline
const linkHover = {
  scaleX: [0, 1],
  transition: { duration: 0.3 }
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

#### Styling
| Element | Style |
|---------|-------|
| Section | `--bg-primary`, padding 96px 0 (desktop), 64px 0 (mobile) |
| Container | max-width 1200px, grid 2 cols (desktop), 1 col (mobile) |
| Section Title | H2 style, `--text-primary`, margin-bottom 32px |
| Photo | 300x300 (desktop), 200x200 (mobile), `--radius-xl`, border 4px `--bg-tertiary` |
| Photo Container | Optional: gradient border or glow effect |
| Bio Text | `--text-secondary`, Body Large (18px), line-height 1.7 |
| Paragraph Gap | 24px between paragraphs |
| Quick Facts | `--text-secondary`, 16px, icon + text pairs |
| Icons | Emoji or Lucide icons, `--accent-primary` |

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
| QA | Hero CTA buttons not visible (desktop) | 16:40 | DEV assigned |
| QA | Mobile hamburger menu missing | 16:40 | DEV assigned |
| QA | Motion.dev animation warnings (20x) | 16:40 | DEV assigned |

---

## Notes

[Team communication notes]

---

## Clear After Sprint

After Sprint Review, update this whiteboard for next Sprint.
