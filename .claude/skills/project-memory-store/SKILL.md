---
name: Project Memory Store
description: Update project memory files in .claude/memory/ after completing meaningful work. Use when the Stop hook reminds you, or when user says "--project-store". Skip for trivial changes.
---

# Project Memory Store

**Purpose**: Update memory files in `.claude/memory/` when meaningful changes happen in the project.

## Memory Files

| File | Content | When to update |
|------|---------|----------------|
| `team.md` | Team roles, workflow | Team process changes |
| `design-decisions.md` | UI/UX decisions, color palette, animation | Design or theme changes |
| `sprint-history.md` | Summary of work per sprint | Feature or fix completed |
| `bugs-and-lessons.md` | Bugs encountered, lessons learned | Bug fixed or gotcha discovered |

## Workflow

1. Review what was done in the session
2. Decide which file(s) need updating (may be 0 if trivial)
3. Read the target file first (avoid duplicates)
4. Append/edit new content
5. If major architecture change → also update `CLAUDE.md`

## Entry Format

```markdown
### Short title
- What happened
- Lesson / decision made
```

## Examples

**Good entry** (sprint-history.md):
```markdown
### Sprint 8: Add dark mode toggle to navbar
- Implemented ThemeToggle in Navigation, persists via localStorage
- Used CSS variables approach from design-decisions.md
```

**Good entry** (bugs-and-lessons.md):
```markdown
### Framer Motion stagger not working on mobile
- Cause: useInView threshold too high (0.3) for small screens
- Fix: reduced to 0.1 on mobile via useIsMobile hook
```

**Bad entry** (too vague):
```markdown
### Fixed a bug
- It works now
```

**Bad entry** (too verbose — keep it to 2-3 lines):
```markdown
### Sprint 8: Dark mode
- First I researched 5 different approaches to dark mode...
- Then I tried CSS variables but it didn't work because...
- So I switched to data-theme attribute approach...
- After that I had to refactor 12 components...
- (nobody will read all this)
```

## Decision Criteria: Store or Skip?

| Scenario | Action |
|----------|--------|
| Completed a new feature/sprint | **Store** in sprint-history.md |
| Fixed a non-obvious bug | **Store** in bugs-and-lessons.md |
| Made a design/architecture decision with trade-offs | **Store** in design-decisions.md |
| Changed team workflow | **Store** in team.md |
| Fixed a typo, renamed a variable | **Skip** |
| Added a console.log for debugging | **Skip** |
| Standard implementation with no surprises | **Skip** |

## Handling Conflicts

When new info contradicts an existing entry:

1. **Don't delete the old entry** — it shows decision evolution
2. **Update inline** with a note:
   ```markdown
   ### Color palette: Violet→Blue gradient
   - Originally Deep Space Violet (#7B337D) only
   - **Updated (Sprint 4):** Evolved to Violet→Blue gradient (#7C3AED → #2563EB)
   - Reason: better contrast in light mode
   ```
3. If the old info is completely wrong/obsolete → replace it, but add context why

## CLAUDE.md vs Memory Files

| Change type | Update where |
|-------------|-------------|
| New npm script, new dependency | `CLAUDE.md` (Commands section) |
| New folder convention, path alias | `CLAUDE.md` (Key Conventions) |
| New component pattern, architecture shift | `CLAUDE.md` (Architecture) |
| Sprint work summary | `memory/sprint-history.md` only |
| Bug fix details | `memory/bugs-and-lessons.md` only |
| Why a color/font/animation was chosen | `memory/design-decisions.md` only |
| Team role or process change | `memory/team.md` only |

**Rule of thumb**: CLAUDE.md = what you need to START working. Memory = deeper context you read WHEN needed.

## Rules

- **Only update when meaningful** — skip for trivial changes
- **Keep it short** — max 3-4 lines per entry
- **No duplicates** — read the file before adding
- **Preserve history** — don't delete old entries, update them
