#!/bin/bash

# Portfolio Team - Automated Setup Script
# Creates a tmux session with 4 Claude Code instances (PM, DS, DEV, QA)

set -e  # Exit on error

PROJECT_ROOT="/Users/hungphu/Documents/AI_Projects/portfoilo"
SESSION_NAME="portfolio_team"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Starting Portfolio Team Setup..."
echo "Project Root: $PROJECT_ROOT"
echo "Session Name: $SESSION_NAME"

# 1. Check if session already exists
if tmux has-session -t $SESSION_NAME 2>/dev/null; then
    echo "Session '$SESSION_NAME' already exists!"
    read -p "Kill existing session and create new one? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        tmux kill-session -t $SESSION_NAME
        echo "Killed existing session"
    else
        echo "Aborted. Use 'tmux attach -t $SESSION_NAME' to attach"
        exit 0
    fi
fi

# 2. Verify tm-send is installed
echo "Verifying tm-send installation..."
if ! command -v tm-send >/dev/null 2>&1; then
    echo ""
    echo "ERROR: tm-send is not installed!"
    echo ""
    echo "tm-send is a GLOBAL tool at ~/.local/bin/tm-send"
    echo "Install it first, then re-run this script."
    echo ""
    exit 1
fi
echo "tm-send found at: $(which tm-send)"

# 3. Start new tmux session
echo "Creating tmux session '$SESSION_NAME'..."
cd "$PROJECT_ROOT"
tmux new-session -d -s $SESSION_NAME

# 4. Create 4-pane layout
echo "Creating 4-pane layout..."
tmux split-window -h -t $SESSION_NAME
tmux split-window -h -t $SESSION_NAME
tmux split-window -h -t $SESSION_NAME
tmux select-layout -t $SESSION_NAME even-horizontal

# 5. Resize for proper pane widths
echo "Resizing window..."
tmux resize-window -t $SESSION_NAME -x 400 -y 50

# 6. Set pane titles and role names
tmux select-pane -t $SESSION_NAME:0.0 -T "PM"
tmux select-pane -t $SESSION_NAME:0.1 -T "DS"
tmux select-pane -t $SESSION_NAME:0.2 -T "DEV"
tmux select-pane -t $SESSION_NAME:0.3 -T "QA"

tmux set-option -p -t $SESSION_NAME:0.0 @role_name "PM"
tmux set-option -p -t $SESSION_NAME:0.1 @role_name "DS"
tmux set-option -p -t $SESSION_NAME:0.2 @role_name "DEV"
tmux set-option -p -t $SESSION_NAME:0.3 @role_name "QA"

# 7. Get pane IDs
echo "Getting pane IDs..."
PANE_IDS=$(tmux list-panes -t $SESSION_NAME -F "#{pane_id}")
PM_PANE=$(echo "$PANE_IDS" | sed -n '1p')
DS_PANE=$(echo "$PANE_IDS" | sed -n '2p')
DEV_PANE=$(echo "$PANE_IDS" | sed -n '3p')
QA_PANE=$(echo "$PANE_IDS" | sed -n '4p')

echo "Pane IDs:"
echo "  PM  (Pane 0): $PM_PANE"
echo "  DS  (Pane 1): $DS_PANE"
echo "  DEV (Pane 2): $DEV_PANE"
echo "  QA  (Pane 3): $QA_PANE"

# 8. Start Claude Code in each pane with model assignment
echo "Starting Claude Code in all panes..."

# PM - Sonnet (coordination)
tmux send-keys -t $SESSION_NAME:0.0 "cd $PROJECT_ROOT && claude" C-m

# DS - Opus (creative design needs high reasoning)
tmux send-keys -t $SESSION_NAME:0.1 "cd $PROJECT_ROOT && claude" C-m

# DEV - Sonnet (implementation)
tmux send-keys -t $SESSION_NAME:0.2 "cd $PROJECT_ROOT && claude" C-m

# QA - Haiku (testing)
tmux send-keys -t $SESSION_NAME:0.3 "cd $PROJECT_ROOT && claude" C-m

# 9. Wait for Claude Code to start
echo "Waiting 20 seconds for Claude Code instances..."
sleep 20

# 10. Initialize roles
echo "Initializing agent roles..."
tmux send-keys -t $SESSION_NAME:0.0 "/init-role PM" C-m
sleep 0.3
tmux send-keys -t $SESSION_NAME:0.0 C-m
sleep 2

tmux send-keys -t $SESSION_NAME:0.1 "/init-role DS" C-m
sleep 0.3
tmux send-keys -t $SESSION_NAME:0.1 C-m
sleep 2

tmux send-keys -t $SESSION_NAME:0.2 "/init-role DEV" C-m
sleep 0.3
tmux send-keys -t $SESSION_NAME:0.2 C-m
sleep 2

tmux send-keys -t $SESSION_NAME:0.3 "/init-role QA" C-m
sleep 0.3
tmux send-keys -t $SESSION_NAME:0.3 C-m

# 11. Wait for initialization
echo "Waiting 15 seconds for role initialization..."
sleep 15

# 12. Summary
echo ""
echo "Setup Complete!"
echo ""
echo "Session: $SESSION_NAME"
echo "Project: $PROJECT_ROOT"
echo ""
echo "Portfolio Team Roles:"
echo "  +--------+--------+--------+--------+"
echo "  | PM     | DS     | DEV    | QA     |"
echo "  | Pane 0 | Pane 1 | Pane 2 | Pane 3 |"
echo "  +--------+--------+--------+--------+"
echo ""
echo "Team Structure:"
echo "  - PM: Project Manager (coordination)"
echo "  - DS: Designer (UI/UX, creative)"
echo "  - DEV: Developer (implementation)"
echo "  - QA: Tester (quality)"
echo ""
echo "Next steps:"
echo "  1. Attach: tmux attach -t $SESSION_NAME"
echo "  2. Send goal to PM: >>> Create stunning portfolio with hero section"
echo "  3. Team will coordinate automatically"
echo ""
echo "To detach: Ctrl+B, then D"
echo "To kill: tmux kill-session -t $SESSION_NAME"
echo ""

# 13. Move cursor to PM pane
tmux select-pane -t $SESSION_NAME:0.0
echo "Cursor in Pane 0 (PM)."
