# Portfolio Project Memory

This directory contains structured memories specific to the portfolio project.

**How to use:** Start here. Only read deeper files when you need that specific context.

---

## Structure

```
memory/
├── README.md                      # This file
├── team/                          # Team roles, workflow, communication
│   ├── README.md                   # Overview of team structure
│   └── *.md                       # Individual team memories
├── design-decisions/              # UI/UX decisions, color evolution, animation
│   ├── README.md                   # Overview of design decisions
│   └── *.md                       # Individual design memories
├── sprint-history/                # Summary of work per sprint
│   ├── README.md                   # Overview of all sprints
│   └── *.md                       # Individual sprint details
└── bugs-and-lessons/              # Bugs encountered, lessons learned
    ├── README.md                   # Overview of bugs & lessons
    └── *.md                       # Individual bug reports
```

---

## Memory Format

Each README.md contains the overview. When a topic grows, split into separate files within the folder.

**Entry format:**
```markdown
### Short title
- What happened / what was decided
- Lesson learned or reason for decision
```

**Separate file format** (when splitting from README.md):
```markdown
# Title

**Tags:** #tag1 #tag2
**Created:** YYYY-MM-DD

---

## Description
One sentence summary.

## Content
3-5 sentences: what happened, what worked/failed, key lesson.
```

---

## When to Read Each Folder

| Folder | Read when... |
|--------|-------------|
| [team/](team/README.md) | Coordinating with team roles, understanding who does what |
| [design-decisions/](design-decisions/README.md) | Making UI/UX changes, questioning why something looks a certain way |
| [sprint-history/](sprint-history/README.md) | Planning new sprints, understanding what was already done |
| [bugs-and-lessons/](bugs-and-lessons/README.md) | Debugging, or before modifying areas that had past issues |

---

## Adding New Memories

1. Determine which folder the memory belongs to
2. Read README.md in that folder first (avoid duplicates)
3. For small additions: append to README.md
4. For detailed entries: create a new `.md` file in the folder and link from README.md
5. Keep entries short: max 3-4 lines each
6. If new info contradicts old entry, update inline with "**Updated (Sprint N):**"

---

## Search

```bash
# Search all project memories
grep -r "keyword" .claude/memory/

# Search by topic
grep -r "animation" .claude/memory/design-decisions/

# Search for past bugs
grep -r "Cause\|Fix" .claude/memory/bugs-and-lessons/
```

---

## Relationship to CLAUDE.md

| Scope | Where |
|-------|-------|
| What you need to START working | `CLAUDE.md` |
| Deeper context, read WHEN needed | `.claude/memory/*/README.md` |
| Architecture changes, new commands | Update `CLAUDE.md` |
| Sprint summaries, bugs, design rationale | Update memory files only |

---

## Active References

- Team workflow: `docs/tmux/portfolio-team/workflow.md`
- Sprint whiteboard: `docs/tmux/portfolio-team/WHITEBOARD.md`
- Design specs: embedded in WHITEBOARD.md
- Role prompts: `docs/tmux/portfolio-team/prompts/`

---

**Last Updated:** 2026-02-06
