# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Memory
[memory](.claude/memory/README.md)

## Commands

```bash
npm run dev      # Start dev server (port 2000)
npm run build    # Production build
npm run lint     # ESLint (next/core-web-vitals)
```

No test suite exists yet. Playwright is installed as a dev dependency.

## Team

This project is built by a **multi-agent tmux team** (`portfolio_team` session) with 4 roles:

| Role | Pane | Purpose | Model |
|------|------|---------|-------|
| PM | 0 | Sprint coordination, team communication hub | Sonnet |
| DS | 1 | UI/UX design specs, creative direction | Opus |
| DEV | 2 | Full-stack implementation | Sonnet |
| QA | 3 | Black-box testing, UX validation | Haiku |

**Workflow:** Design-first — DS specs → DEV implements → QA tests → PM reports to Boss.

**Boss (user) also acts as BM:** Boss may delegate sprint tasks directly to PM via `tm-send`, or implement features directly alongside the team. The whiteboard (`docs/tmux/portfolio-team/WHITEBOARD.md`) is the shared backlog — add sprint tasks there for the team to pick up.

**Communication:** All inter-agent communication flows through PM via `tm-send`. Boss sends tasks to PM who coordinates the team.

**Key docs:**
- `docs/tmux/portfolio-team/WHITEBOARD.md` — sprint status + backlog (source of truth)
- `docs/tmux/portfolio-team/workflow.md` — full team workflow
- `docs/tmux/portfolio-team/prompts/` — role prompts (PM, DS, DEV, QA)
- `.claude/memory/team/` — team memory & lessons learned

## Architecture

**Single-page portfolio** built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, and Framer Motion.

### Data-Driven Content

All display content lives in `/data/` as typed TypeScript exports. Components import data directly — no database, no API. To update portfolio content, edit data files only:

- `data/personal.ts` — bio, contact, social links, quick facts
- `data/experience.ts` — work history
- `data/projects.ts` — project showcase
- `data/skills.ts` — skill categories
- `data/achievements.ts` — awards & recognitions
- `data/types.ts` — shared TypeScript interfaces

### Page Structure

`app/page.tsx` renders a single scrollable page inside a `<div className="pf">` wrapper: HeroAbout (sky hero + MoMo-themed phone) → a dark `.sheet` containing QuickFacts → Experience → Projects → Skills → Achievements → Contact. `ChatFAB` sits outside `.pf`. Navigation uses smooth scroll to section `id` anchors (no client-side routing).

### Component Organization

- `components/sections/` — sections (HeroAbout + QuickFacts, HeroPhone, Experience, Projects, Skills, Achievements, Contact)
- `components/layout/` — Navigation (fixed header, turns solid after scrolling)
- `components/ui/` — primitives (Reveal scroll-in, Avatar with initials fallback; ThemeToggle/Skeleton are legacy)
- `data/heroPhone.ts` — static hero phone content (notifications, apps) and bio emphasis phrases

Projects support optional presentation fields (`featured`, `theme`, `extraCategories`, `stats`, `highlights`, `workflow`) and skills support optional display `groups`; the admin forms don't edit these but preserve them on save.

### Design System (public page)

The approved design spec is `docs/design/prototypes/origin-redesign.html`; the implementation was matched to it pixel-for-pixel, so change the spec and the code together. Styles live in `app/portfolio.css` with **every selector scoped under `.pf`** (keyframes prefixed `pf-`) so `/admin` and the chat widget are unaffected. Fonts load via `next/font` in `app/fonts.ts`, but CSS references the real family names (not the `--f-*` variables) so missing glyphs fall back like the prototype; Inter is loaded only up to 600 on purpose. Side-project cards use each product's own theme (Tử Vi Ngày Mai, BlissDay, Steady).

`app/globals.css` (light/dark `data-theme`, Violet→Blue tokens, Tailwind) still serves the admin panel and chat widget. Two of its global rules leak into the page and are neutralized in `portfolio.css`: the mobile 44px min-size on `a`/`button`, and Tailwind preflight's `sup` offsets.

### Animation System

Public page: CSS transitions plus small client components — `Reveal` (IntersectionObserver adds `.in`), hero blur-in and digit roll, and `HeroPhone`'s scroll-driven iOS notification stack. All respect `prefers-reduced-motion`. The legacy Framer Motion variants in `lib/animations.ts` are no longer used by the public page.

### Utilities

- `lib/scroll.ts` — `scrollToSection()` smooth scroll helper
- `hooks/useIsMobile.ts` — viewport detection (breakpoint at 768px)

## Key Conventions

- **Tailwind v4** uses the PostCSS plugin (`@tailwindcss/postcss`) — no `tailwind.config` file. Custom utilities are defined with `@layer` in `globals.css`.
- **Path alias**: `@/*` maps to project root (e.g., `import { experiences } from "@/data/experience"`)
- **Mobile-first**: Components use separate mobile/desktop layouts (not just responsive tweaks). Tailwind `md:` breakpoint = 768px.
- **Sprint-based development**: Features are developed in numbered sprints (see git history). Use feature branches named `feature_<short_name>`.
