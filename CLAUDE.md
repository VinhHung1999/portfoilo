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

`app/page.tsx` renders a single scrollable page composed of section components in order: HeroAbout → Experience → Skills → Projects → Achievements → Contact. Navigation uses smooth scroll to section `id` anchors (no client-side routing).

### Component Organization

- `components/sections/` — full-page sections (HeroAbout, Experience, Projects, Skills, Achievements, Contact)
- `components/layout/` — Navigation (fixed header, mobile hamburger)
- `components/ui/` — reusable primitives (ThemeToggle, Skeleton)

All section components are `"use client"` and follow the same pattern: import data from `/data/`, use Framer Motion for scroll-triggered animations, check `useReducedMotion()` for accessibility.

### Theme System

CSS variables in `app/globals.css` define the design system (colors, spacing, shadows, gradients). Light/dark mode toggles via `data-theme` attribute on `<html>`, managed by a React Context provider in `lib/theme.tsx` with localStorage persistence. The color palette uses a Violet→Blue gradient system (`--gradient-start`, `--gradient-end`).

### Animation System

`lib/animations.ts` exports reusable Framer Motion variants (fade-in, slide-up, scale, stagger). All animations respect `prefers-reduced-motion` via the `hooks/useReducedMotion.ts` hook — when enabled, animations are reduced to simple opacity fades.

### Utilities

- `lib/scroll.ts` — `scrollToSection()` smooth scroll helper
- `hooks/useIsMobile.ts` — viewport detection (breakpoint at 768px)

## Key Conventions

- **Tailwind v4** uses the PostCSS plugin (`@tailwindcss/postcss`) — no `tailwind.config` file. Custom utilities are defined with `@layer` in `globals.css`.
- **Path alias**: `@/*` maps to project root (e.g., `import { experiences } from "@/data/experience"`)
- **Mobile-first**: Components use separate mobile/desktop layouts (not just responsive tweaks). Tailwind `md:` breakpoint = 768px.
- **Sprint-based development**: Features are developed in numbered sprints (see git history). Use feature branches named `feature_<short_name>`.
