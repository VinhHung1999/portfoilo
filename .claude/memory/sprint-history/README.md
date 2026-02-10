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
