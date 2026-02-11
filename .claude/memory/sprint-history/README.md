# Sprint History

## Sprint 0: Setup & Tech Stack
- DS researched portfolio trends 2024-2025
- Approved stack: Next.js + Tailwind + Framer Motion + TypeScript
- Initial design system: dark mode, electric accents

## Sprint 1: Core Structure
- Hero, Navigation, About sections
- QA found: CTA buttons invisible on desktop, missing mobile hamburger
- All fixed, 23/23 tests passing

## Sprint 2: Content Sections
- Projects, Skills, Contact, Work Experience
- Boss approved: "Toi thay kha on roi a"
- All 4 content sections passing

## Sprint 3: Polish & Performance
- DS delivered: page transitions, loading animations, micro-interactions, mobile polish specs
- Animation timing refined (professional, no bounce)

## Sprint 4: Professional UI Refactor
- Color palette changed to Violet→Blue gradients
- Light/dark theme system implemented
- Component styling overhaul

## Sprint 6: Hero+About Merge & Data Separation
- Hero and About merged into `HeroAbout.tsx`
- Achievements section added
- All content data moved to `/data/` directory
- Type definitions centralized in `data/types.ts`

## Sprint 7: Hero Animation Timing
- Hero animation optimized (66% faster)
- Navigation: added Home link, removed About link, added Achievements link
- Fixed Skills component catIndex undefined bug
- Design Specs updated in WHITEBOARD to match actual code implementation
- CMS Admin Panel planning (6 sprints breakdown ready, pending Boss approval)

## Sprint 7b: Data Migration + API Foundation
- Converted 5 data files from `data/*.ts` → `content/*.json` (source of truth for CMS)
- `data/*.ts` now thin typed wrappers importing from JSON; `data/types.ts` kept as-is
- Projects.tsx inline data extracted to `content/projects.json` + expanded `Project` type in types.ts
- API routes: `/api/admin/[resource]` with GET/PATCH + Bearer token auth (ADMIN_PASSWORD env var)
- Fixed pre-existing framer-motion type errors (`ease` arrays and `when` needed `as const`)

## Sprint 8: Admin Panel UI
- Built 22 components (layout, forms, feedback, section editors, auth)
- Login page + admin dashboard with sidebar/mobile tab navigation
- Inline card editing with dirty state tracking, undo, confirm delete

## Sprint 9: Image Upload + Deploy + Production Bugs
- Vercel Blob image upload (API + drag-and-drop ImageUpload component)
- Auth upgraded from sessionStorage Bearer tokens to httpOnly secure cookies
- Deployed to Vercel production: https://portfolio-seven-nu-cnkdguoq1l.vercel.app
- Bug fixes: read-only filesystem → Blob storage for CRUD, static page → force-dynamic rendering, avatar/thumbnailUrl image rendering

## Sprint 10: UI Polish
- DS audit identified 16 issues across 4 priority tiers
- Implemented 5 P0+P1 items: Nav scroll spy, URL hash sync, theme FOUC fix, shadow fix, CSS var hover
- QA caught 2 bugs (theme flash after hydration, mobile scroll spy backward) — both fixed
- Boss approved: "Ngon rồi, đóng sprint"

## Sprint 11: Visual WOW Effects
- DS delivered 10 visual effect specs (P0+P1)
- Implemented 5 P0 effects: Hero mesh blobs, Skills Bento Grid, 3D tilt cards, scroll timeline, scroll progress bar
- Color palette iteration: 4 rounds (Violet-Blue → Gold → Warm Stone → Slate Teal → back to Violet-Blue)
- Lesson: Ask Boss for reference websites EARLY instead of proposing theoretical palettes
- useIsMobile SSR hydration bug on Experience mobile — fixed with SSR-safe defaults

## Sprint 12: AI Chatbot
- LangChain + xAI (grok-3-mini) streaming chat integration
- 8 chat components, full-screen mobile, focus trap, accessibility
- Markdown rendering with react-markdown
- Boss: "quá là hài lòng"

## Sprint 13: Admin Chatbot Settings
- Admin UI for chatbot settings (greeting, suggested questions, custom context, prompt tuning)
- Hybrid Blob/local storage for chatbot settings persistence
- Delete guard + default questions fallback

## Sprint 14: Docker Self-Hosted + Cloudflare Tunnel
- Removed @vercel/blob, migrated to local filesystem storage (5dd9ed6)
- Multi-stage Dockerfile + docker-compose.yml with volumes for content/ and uploads/ (a011732)
- Cloudflare Tunnel: `portfolio-dev.hungphu.work` → :2000 (verified working)
- Cloudflare Tunnel: `portfolio.hungphu.work` → :3000 (DNS ready, 502 until Docker proxy fixed)
- QA dev environment: 15/15 tests passed
- **Blocker:** Docker Desktop proxy (http.docker.internal:3128) prevents image pull — Boss to fix manually
- Production QA (Task 5) carry-over to post-Docker fix

## Sprint 15: Conversation Logging + Email Transcript
- Conversation persistence: individual JSON files in `content/conversations/{id}.json`
- Nodemailer email transcript: auto-sends after 5min visitor inactivity (frontend timer)
- Admin "Conversations" tab: stats cards, conversation list, expand thread, delete
- Public API: `/api/conversations` (save), `/api/conversations/send-transcript` (email)
- Admin API: `/api/admin/conversations` (list+stats), `/api/admin/conversations/[id]` (detail+delete)
- SMTP graceful skip if env vars not configured
