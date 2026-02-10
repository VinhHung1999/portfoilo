---
name: Project Memory Recall
description: Read project memory from .claude/memory/ before starting complex tasks. Use when user says "--project-recall" or when starting work that might benefit from past context. Skip for trivial tasks.
---

# Project Memory Recall

**Purpose**: Read context from `.claude/memory/` to avoid repeating past mistakes and leverage existing knowledge.

## Memory Files

| File | When to read |
|------|-------------|
| `team.md` | Need to understand roles, team workflow |
| `design-decisions.md` | About to change UI/UX, need to know why current design exists |
| `sprint-history.md` | Need to know what was already done, avoid redoing work |
| `bugs-and-lessons.md` | About to modify code in an area that had past bugs |

## Decision Criteria: Recall or Skip?

| Task | Action |
|------|--------|
| Implementing a new section/component | **Recall** sprint-history (what pattern was used before) |
| Changing colors, fonts, animations | **Recall** design-decisions (why current choices were made) |
| Fixing a bug in Skills/Navigation/Hero | **Recall** bugs-and-lessons (past bugs in same area) |
| Starting a new sprint | **Recall** sprint-history (what's done, what's next) |
| Coordinating with team agents | **Recall** team (roles, communication flow) |
| Fixing a typo | **Skip** |
| Reading a file | **Skip** |
| Simple 1-line change | **Skip** |

## Workflow

1. Identify the upcoming task
2. Pick the relevant memory file(s) — usually just 1-2
3. Read the file
4. Look for:
   - Past decisions that constrain current work
   - Bugs that happened in the same area
   - Patterns/conventions already established
5. Apply context to the task

## Examples

**Before adding a new section:**
→ Read `sprint-history.md` to see how previous sections were built
→ Read `design-decisions.md` to follow the established animation philosophy

**Before changing the color palette:**
→ Read `design-decisions.md` — the palette went through 3 iterations, there are specific reasons for the current choice

**Before fixing a Framer Motion bug:**
→ Read `bugs-and-lessons.md` — there were past issues with `transparent` values and animation warnings

## Rules

- **Only read relevant files** — don't read all 4 files for every task
- **Skip for simple tasks** — fixing a typo doesn't need recall
- **CLAUDE.md is always preloaded** — no need to read it again
- **Trust but verify** — memory entries may be outdated if code changed since they were written
