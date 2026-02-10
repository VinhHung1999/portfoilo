# Portfolio Team Whiteboard

**Sprint:** 13 - ✅ CLOSED — Boss Approved
**Goal:** Admin Chatbot Context + Prompt Tuning
**Status:** All delivered. Boss approved.

---

## Current Status

| Role | Status | Current Task | Last Update |
|------|--------|--------------|-------------|
| PM   | 🔄 Coordinating | Sprint 13 kickoff | now |
| DS   | ✅ Done | Admin chatbot specs | 00:30 |
| DEV  | ✅ Done | Admin UI + API + 3 bug fixes | now |
| QA   | ✅ All Pass | 67/67 checks, 3 bugs verified fixed | 01:36 |

---

## Active Blockers

- Git push to GitHub failed (SSH/HTTPS timeout) — network issue, retry later

---

## Quick Reference

**Production:** https://portfolio-seven-nu-cnkdguoq1l.vercel.app
**Admin:** https://portfolio-seven-nu-cnkdguoq1l.vercel.app/admin

**Key Design Specs:**
- Visual WOW: `docs/design/sprint11-visual-wow-specs.md`
- Color palettes: `docs/design/sprint11-color-redesign-specs.md`, `docs/design/sprint11-color-v2-specs.md`
- UI Polish: `docs/design/sprint10-ui-polish-specs.md`
- Admin Panel: `docs/design/admin-panel-specs.md`
- Color Palette: Violet→Blue gradient (original, kept)
- Typography: Inter (primary), JetBrains Mono (code)

---

## Backlog

**Sprint 11 P1 (stretch — not delivered):**

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

---

## Sprint 13 Tasks

| # | Task | Owner | Status |
|---|------|-------|--------|
| 1 | Design admin panel chatbot settings section | DS | ✅ Done |
| 2 | Backend: API to save/load custom chatbot context (Vercel Blob) | DEV | ✅ Done (commit 8cfa965) |
| 3 | Tune system prompt (persona, tone, boundaries, auto-detect lang) | DEV | ✅ Done (commit 8cfa965) |
| 4 | Build admin UI for chatbot context (per DS specs) | DEV | ✅ Done (commit 1cd4c78) |
| 5 | Merge custom context + portfolio data in /api/chat | DEV | ✅ Done (included in #3) |
| 6 | QA: Test admin CRUD, context accuracy, edge cases | QA | ✅ Round 1 (61/67) |
| 7 | FIX: Blob persistence → direct put() + local file fallback | DEV | ✅ Fixed (bc57d86) |
| 8 | FIX: Last question delete disabled | DEV | ✅ Fixed (bc57d86) |
| 9 | FIX: Default questions via 3-layer fallback | DEV | ✅ Fixed (bc57d86) |
| 10 | QA: Retest after fixes | QA | ✅ All Pass (67/67) |

---

**Last Updated:** 2026-02-09
