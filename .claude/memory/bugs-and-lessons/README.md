# Bugs & Lessons Learned

## Resolved Bugs

### Hero CTA buttons invisible (Sprint 1)
- **Cause:** Button text color same as background on desktop
- **Fix:** Explicit text color on CTA buttons

### Mobile hamburger menu missing (Sprint 1)
- **Cause:** Component not implemented for mobile breakpoint
- **Fix:** Added hamburger icon + slide-out menu panel

### Motion.dev animation warnings (Sprint 1)
- **Cause:** Animating to `transparent` color value
- **Fix:** Use explicit rgba values instead of `transparent`

### Skills catIndex undefined (Sprint 7)
- **Cause:** Category index variable not properly initialized
- **Fix:** Added proper initialization check

### WHITEBOARD Design Specs outdated (Sprint 7)
- **Cause:** WHITEBOARD had outdated design specs that didn't match actual code implementation
- **Fix:** DEV audited globals.css and component files, updated WHITEBOARD to reflect actual implementation
- **Lesson:** Keep design specs synchronized with code; update specs when code changes

### Gradient colors unprofessional (Sprint 1-2)
- **Cause:** Blue→purple gradient looked generic
- **Lesson:** Dark themes need muted accent colors, not saturated gradients
- **Resolution:** Went through 3 iterations before settling on Violet→Blue

## Team Coordination Lessons

### Tmux pane detection bug
**NEVER use `tmux display-message -p '#{pane_index}'`** — returns active cursor pane, not your pane. Always use `$TMUX_PANE` environment variable.

### Achievements icon gradient used wrong CSS var names (Sprint 7)
- **Cause:** Code used `--gradient-violet`/`--gradient-blue` but actual vars are `--gradient-start`/`--gradient-end`
- **Symptom:** Icons invisible in light mode (white icons on transparent bg — gradient failed silently)
- **Lesson:** CSS custom property typos fail silently; always verify var names against `globals.css`

### Design-first saves rework
DS creating specs before DEV implements reduces back-and-forth significantly. Skip this at the cost of 2-3x rework cycles.

### useIsMobile() SSR hydration → Framer Motion race condition (Sprint 12)
- **Cause:** `useIsMobile()` defaults to `false` on SSR, Framer Motion starts desktop animation, then switches to mobile variants mid-animation — `scale` gets stuck at ~0.83
- **Fix:** Add a `mounted` state gate — only render animated component after `useEffect` confirms client-side hydration
- **Lesson:** Any hook that differs between SSR and client can break Framer Motion variant selection

### Focus trap: preventDefault on EVERY Tab, not just boundaries (Sprint 12)
- **Cause:** Focus trap only called `e.preventDefault()` when `activeElement === first/last` — browser still tabs out on intermediate elements
- **Fix:** Intercept ALL Tab/Shift+Tab presses inside dialog, manually cycle focus
- **Lesson:** `aria-modal="true"` is semantic only, does NOT enforce browser focus trapping

### Vercel Blob eventual consistency in dev mode (Sprint 13)
- **Cause:** PUT to Vercel Blob returns success, but subsequent GET returns stale data (delete-then-put pattern)
- **Symptom:** Admin "Saved!" toast shown but data reverts on page reload
- **Lesson:** Vercel Blob has eventual consistency; test persistence with navigate-away-and-back, not just save response

### Docker Desktop proxy blocks image pull (Sprint 14)
- **Cause:** Docker Desktop configured with HTTP/HTTPS proxy (`http.docker.internal:3128`) — all pulls hang
- **Symptom:** `docker pull` hangs indefinitely; host `curl` to registry works fine (401)
- **Diagnosis:** `docker info` shows proxy settings; host can reach registry but Docker daemon routes through proxy
- **Fix:** Docker Desktop → Settings → Resources → Proxies → disable proxy → Apply & Restart
- **Lesson:** When Docker pull hangs, check `docker info | grep Proxy` first — proxy is a common hidden cause

### Next.js standalone doesn't serve dynamically uploaded files from `public/` (Sprint 15)
- **Cause:** Standalone `server.js` only serves `public/` files known at build time; uploads added later return 404
- **Fix:** Created `/api/uploads/[...path]` API route to serve files from `public/uploads/` via `fs.readFile`; changed upload API to return `/api/uploads/` URLs
- **Lesson:** Any user-uploaded content in standalone mode needs an API route or external CDN to serve

### Docker COPY fails when `public/` directory missing (Sprint 15)
- **Cause:** `COPY --from=builder /app/public ./public` fails if `public/` doesn't exist
- **Fix:** Create `public/.gitkeep` so the directory is always tracked by git

### Next.js 16 removed `next lint` command (Sprint 15)
- **Cause:** `next lint` was removed in Next.js 16; `npm run lint` fails with "no such directory: .../lint"
- **Lesson:** Next.js 16 CLI only has: build, dev, start, info, typegen, upgrade. Use standalone ESLint if needed.

### Git author shows wrong contributor on GitHub (Sprint 17)
- **Cause:** No git user.name/user.email configured → defaults to hostname-based identity (`hungphu@Hungs-Mac-mini.local`). GitHub can't match this to any account. Co-Authored-By trailer made Claude appear as contributor instead.
- **Fix:** `git config user.name` + `user.email` set to match GitHub account; amend commit without Co-Authored-By
- **Lesson:** Always verify git config email matches GitHub account email before pushing. Skip Co-Authored-By if Boss doesn't want it.
