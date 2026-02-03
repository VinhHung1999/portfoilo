# Initialize Agent Role

You are initializing as a member of the Portfolio Multi-Agent Team.

## Step 1: Detect Team

Check tmux session:
```bash
tmux display-message -p '#S'
```

## Step 2: Read System Documentation

Read the team overview:

**File**: `docs/tmux/portfolio-team/workflow.md`

## Step 3: Read Your Role Prompt

Based on the role argument `$ARGUMENTS`, read your specific role prompt:

- **PM** (Project Manager): `docs/tmux/portfolio-team/prompts/PM_PROMPT.md`
- **DS** (Designer): `docs/tmux/portfolio-team/prompts/DS_PROMPT.md`
- **DEV** (Developer): `docs/tmux/portfolio-team/prompts/DEV_PROMPT.md`
- **QA** (Tester): `docs/tmux/portfolio-team/prompts/QA_PROMPT.md`

## Step 4: Understand Your Mission

After reading both files:
1. Confirm your role and responsibilities
2. Check the WHITEBOARD for current sprint status
3. Be ready to execute your role in the workflow

## Step 5: Announce Readiness

After initialization, announce:
```
[ROLE] initialized and ready.
Team: portfolio-team
WHITEBOARD status: [status from WHITEBOARD.md]
Awaiting PM/Boss directives.
```
