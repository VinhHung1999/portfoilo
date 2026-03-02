# Portfolio Team Whiteboard

**Sprint:** 18 - 🚀 ACTIVE
**Goal:** Update Projects section with real project data from Boss's GitHub/portfolio
**Status:** IN PROGRESS — PM coordinating team

---

## Current Status

| Role | Status | Last Update |
|------|--------|-------------|
| PM   | 🚀 Coordinating Sprint 18 | 2026-03-01 |
| DS   | 📋 Assigned: Review project cards design | 2026-03-01 |
| DEV  | 📋 Assigned: Update projects.json with real data | 2026-03-01 |
| QA   | ⏸️ Waiting for DEV | 2026-03-01 |

---

## Sprint 18 Tasks

| # | Task | Owner | Status |
|---|------|-------|--------|
| 1 | Research Boss's GitHub repos (VinhHung1999) for real projects | DEV | ✅ Done |
| 2 | Collect project info from all tmux teams (love_scrum, voice, webphim, xteink) | PM | ✅ Done |
| 3 | Update `content/projects.json` with verified team info | PM | ✅ Done (build passed) |
| 4 | QA test project cards on dev | QA | 📋 Assigned |

---

## Active Blockers

- **Docker Desktop proxy** (http.docker.internal:3128) blocks image pull. Boss will fix manually. Once fixed: `docker-compose up -d` → production live on :3000.

---

## Quick Reference

**Production (new):** https://portfolio.hungphu.work
**Dev (new):** https://portfolio-dev.hungphu.work
**Production (old/Vercel):** https://portfolio-seven-nu-cnkdguoq1l.vercel.app

**Key Design Specs:**
- Visual WOW: `docs/design/sprint11-visual-wow-specs.md`
- Admin Panel: `docs/design/admin-panel-specs.md`
- Color Palette: Violet→Blue gradient
- Typography: Inter (primary), JetBrains Mono (code)

---

## Backlog

**Sprint 17+ Backlog:**

---

**Sprint 11 P1 (stretch):**

| ID | Effect | Priority |
|----|--------|----------|
| P1-1 | Hero: Split char text reveal | P1 |
| P1-2 | Achievements: Holographic shimmer | P1 |
| P1-3 | Contact: Magnetic social icons | P1 |
| P1-4 | Floating particles (Hero + Contact) | P1 |
| P1-5 | Section headers: Clip-path reveal | P1 |

**Sprint 10 P2/P3 (accessibility):**

| ID | Issue | Priority |
|----|-------|----------|
| M1 | Dark mode muted text contrast (WCAG AA) | P2 |
| M2 | Mobile menu missing AnimatePresence | P2 |
| M3 | Mobile menu focus trap & Escape key | P2 |
| M4 | Project modal accessibility | P2 |
| M5 | Skip-to-content link | P2 |
| m1-m6 | Minor polish items | P3 |

---

## Completed Sprints

| Sprint | Delivered |
|--------|----------|
| 0-6 | Portfolio sections (Hero, Exp, Skills, Projects, Achievements, Contact) |
| 7 | Data migration + API foundation |
| 8 | Admin Panel UI (22 components) |
| 9 | Image upload + Vercel deploy + production fixes |
| 10 | UI Polish: Nav scroll spy, URL hash sync, theme FOUC fix, shadow fix, CSS var hover |
| 11 | Visual WOW: Hero mesh blobs, Skills Bento Grid, 3D tilt cards, scroll timeline, scroll progress bar |
| 12 | AI Chatbot: LangChain + xAI streaming, 8 chat components, full-screen mobile, focus trap |
| 13 | Admin Chatbot: settings UI, custom context, prompt tuning, hybrid Blob/local storage |
| 14 | Docker self-host: Dockerfile, docker-compose, Cloudflare Tunnel (dev verified, prod pending Docker fix) |
| 15 | Conversation logging, email transcript, admin panel enhancements |
| 16 | GitHub Sync: GraphQL client, admin settings, sync API, build-time sync (QA 53/53) |
| 17 | Populate portfolio with real CV data (personal, experience, skills, achievements) |

---

**Last Updated:** 2026-03-01 (Sprint 18 started)
