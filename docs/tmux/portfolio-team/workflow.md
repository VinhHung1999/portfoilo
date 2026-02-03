# Portfolio Team - Lightweight Multi-Agent Team

<context>
A lightweight multi-agent team for building a stunning interactive portfolio website.
Optimized for creative projects with design-first approach.
</context>

**Terminology:** "Role" and "agent" are used interchangeably. Each role (PM, DS, DEV, QA) is a Claude Code AI agent instance.

---

## Team Overview

| Role | Pane | Purpose | Model |
|------|------|---------|-------|
| PM | 0 | Project coordination, sprint management | Sonnet |
| DS | 1 | UI/UX design, creative direction | Opus |
| DEV | 2 | Full-stack implementation | Sonnet |
| QA | 3 | Black-box testing, UX validation | Haiku |

---

## CRITICAL: Pane Detection Bug

**NEVER use `tmux display-message -p '#{pane_index}'`** - returns active cursor pane, NOT your pane!

**Always use `$TMUX_PANE` environment variable:**

```bash
# CORRECT
echo $TMUX_PANE
tmux list-panes -a -F '#{pane_id} #{pane_index} #{@role_name}' | grep $TMUX_PANE
```

---

## Communication Protocol

### Use tm-send for ALL Messages

```bash
# Correct
tm-send PM "DEV -> PM [14:30]: Task complete. Ready for QA."

# NEVER use raw tmux send-keys
```

### Two-Step Response Rule

Every task requires TWO responses:
1. **ACKNOWLEDGE** (immediately): "Received, starting now"
2. **COMPLETE** (when done): "Task DONE. [Summary]"

### Communication Flow

```
Boss (User) --> PM --> DS (design) --> DEV (implement) --> QA (test) --> PM --> Boss
```

**PM is the hub.** All communication flows through PM.

---

## Sprint Workflow

### Phase 1: Sprint Planning
```
Boss --> PM: Sprint Goal (e.g., "Build hero section")
PM --> DS: Design request
DS --> PM: Design specs/mockup
PM --> DEV: Implementation assignment
```

### Phase 2: Sprint Execution
```
1. DS creates design specs (Figma-like description, colors, layout)
2. DEV implements with TDD
3. DEV reports completion
4. PM requests QA testing
5. QA tests and reports
6. Loop until QA passes
```

### Phase 3: Sprint Review
```
PM --> Boss: Sprint summary
Boss: Approve/Request changes
```

---

## Design-First Approach

### DS Provides:
- Color palette and typography
- Layout specifications (spacing, grid)
- Animation/interaction specs
- Component breakdown
- Mobile responsiveness guidelines

### DEV Follows:
- DS design specs exactly
- Uses `/frontend-design` skill for complex UI
- Progressive implementation (skeleton -> style -> animation)
- TDD for all features

---

## Definition of Done

A feature is "Done" when:
- [ ] DS design approved by PM
- [ ] DEV implemented and committed
- [ ] Lint and build pass
- [ ] QA black-box testing passed
- [ ] PM verified visually
- [ ] Boss accepts

---

## Artifacts

### WHITEBOARD.md
- Current sprint status
- Role assignments
- Blockers

### Design Specs
- Location: `docs/design/` or inline in WHITEBOARD
- Include: colors, fonts, spacing, animations

---

## Git Workflow

```bash
# Feature branch
git checkout -b feature/section-name

# After QA pass
git checkout main
git merge feature/section-name
git push origin main
```

---

## Development Commands

```bash
# Install dependencies (team will choose tech stack)
npm install  # or pnpm install

# Run dev server
npm run dev

# Build
npm run build

# Test
npm test
```

---

## Files in This Directory

```
portfolio-team/
├── workflow.md           # This file
├── WHITEBOARD.md         # Sprint status
├── pm/                   # PM's workspace
│   └── IMPROVEMENT_BACKLOG.md
└── prompts/
    ├── PM_PROMPT.md      # Project Manager
    ├── DS_PROMPT.md      # Designer
    ├── DEV_PROMPT.md     # Developer
    └── QA_PROMPT.md      # Tester
```

---

## Key Principles

1. **Design First** - DS creates specs before DEV implements
2. **PM is Hub** - All communication through PM
3. **Progressive** - Build incrementally (skeleton -> polish)
4. **Git is Truth** - Commits show progress
5. **Report Back** - Always notify when task complete
