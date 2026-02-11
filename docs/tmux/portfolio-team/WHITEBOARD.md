# Portfolio Team Whiteboard

**Sprint:** 14 - ✅ CLOSED
**Goal:** Docker Self-Hosted + Cloudflare Tunnel (portfolio.hungphu.work + portfolio-dev.hungphu.work)
**Status:** Closed. 5/6 tasks done. Task 5 (production QA) carry-over pending Docker fix.

---

## Current Status

| Role | Status | Last Update |
|------|--------|-------------|
| PM   | ✅ Sprint closed | 17:25 |
| DS   | ⏸️ Standby | 17:25 |
| DEV  | ⏸️ Standby | 17:25 |
| QA   | ⏸️ Standby | 17:25 |

---

## Active Blockers

- **Docker Desktop proxy** (http.docker.internal:3128) blocks image pull. Boss will fix manually. Once fixed: `docker-compose up -d` → production live on :3000.

---

## Sprint 14 Summary

| # | Task | Status |
|---|------|--------|
| 1 | Remove `@vercel/blob`, local filesystem | ✅ Done (5dd9ed6) |
| 2 | Dockerfile + docker-compose.yml | ✅ Done (a011732) |
| 3 | Cloudflare Tunnel: `portfolio.hungphu.work` → :3000 | ✅ Done (502 until Docker fixed) |
| 4 | Cloudflare Tunnel: `portfolio-dev.hungphu.work` → :2000 | ✅ Done (verified 200) |
| 5 | QA: Test production | ⏳ Carry-over (Docker blocker) |
| 6 | QA: Test dev environment | ✅ Done (15/15 passed) |

**Carry-over to post-Docker fix:** Build image, `docker-compose up`, QA test production.

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

---

**Last Updated:** 2026-02-11 17:25
