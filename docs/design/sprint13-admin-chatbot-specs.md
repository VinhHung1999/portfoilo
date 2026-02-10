# Sprint 13: Admin Chatbot Settings — Design Specifications

**Sprint:** 13
**Feature:** Admin panel section for chatbot configuration
**Designer:** DS
**Date:** 2026-02-09
**Status:** Ready for DEV

---

## Overview

Add a new "Chatbot" section to the existing admin panel, allowing the portfolio owner to configure custom context that the AI chatbot uses when answering questions. This section follows all existing admin panel patterns exactly (sidebar nav, SectionHeader, form components, save/undo flow).

**Key Design Principle:** This is NOT a new design system — it reuses 100% of existing admin patterns from `admin-panel-specs.md`. The spec focuses on what's unique to the chatbot section.

---

## 1. Sidebar Navigation — Add "Chatbot" Item

### Change to `AdminSection` type and `ADMIN_SECTIONS` array

Add a new entry after "Achievements":

```typescript
// AdminSidebar.tsx
import { User, Briefcase, FolderOpen, Zap, Award, MessageCircle } from "lucide-react";

export type AdminSection = "personal" | "experience" | "projects" | "skills" | "achievements" | "chatbot";

export const ADMIN_SECTIONS: SidebarItem[] = [
  { id: "personal", label: "Personal", icon: User },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "projects", label: "Projects", icon: FolderOpen },
  { id: "skills", label: "Skills", icon: Zap },
  { id: "achievements", label: "Achievements", icon: Award },
  { id: "chatbot", label: "Chatbot", icon: MessageCircle },
];
```

### Visual

**Desktop Sidebar:**
```
+--------------------+
|                    |
|  CONTENT           |
|                    |
|  [User] Personal   |
|  [Briefcase] Exp   |
|  [Folder] Projects |
|  [Zap] Skills      |
|  [Award] Achieve   |
|                    |
|  ──────────────    |  ← Visual separator (optional)
|                    |
|  AI                |  ← New section label
|                    |
|  [MessageCircle]   |
|    Chatbot         |  ← New item
|                    |
+--------------------+
```

### Sidebar Section Separator

To visually distinguish chatbot from content-editing sections, add a second group:

| Element | Spec |
|---------|------|
| Separator | 1px horizontal line, `var(--border)`, margin `16px 16px 12px 16px` |
| Group label | "AI" — same style as "CONTENT": Inter 11px/600 uppercase, `var(--text-muted)`, `px-4 mb-2` |

> This separates content sections (Personal, Experience, etc.) from utility sections (Chatbot). If more AI/utility features are added later, they group naturally here.

### Mobile Tab Bar

- Chatbot icon (`MessageCircle`) appears as 6th tab in the horizontal scrollable bar
- Same styling as existing tabs: `min-w-[72px]`, icon 18px + label 12px
- May require a small scroll to reach on narrow screens — acceptable since this is an infrequent setting

---

## 2. Chatbot Settings Section — Page Layout

### Section Header

Reuse existing `SectionHeader` component exactly:

| Property | Value |
|----------|-------|
| Title | "Chatbot" |
| Subtitle | "Configure your AI assistant's knowledge and behavior" |
| Save button | Standard (disabled when clean, enabled when dirty) |
| Undo button | Standard (visible when dirty) |

### Page Structure

```
+------------------------------------------------------+
| Chatbot                              [Save] [Undo]   |
| Configure your AI assistant's knowledge and behavior  |
+------------------------------------------------------+
|                                                      |
|  ┌──────────────────────────────────────────────┐    |
|  │  STATUS CARD                                  │    |
|  │  [●] Active          Last saved: 2 min ago   │    |
|  └──────────────────────────────────────────────┘    |
|                                                      |
|  ── Custom Context ──                                |
|                                                      |
|  Custom Instructions                                 |
|  [ Add additional context for the chatbot.       ]   |
|  [ For example: current job search focus,        ]   |
|  [ skills to highlight, or topics to avoid.      ]   |
|  [                                               ]   |
|  [                                               ]   |
|  254 / 2000 characters                               |
|                                                      |
|  ── Suggested Topics ──                              |
|                                                      |
|  [Job search x] [Backend focus x] [AI/ML x]         |
|  Type and press Enter to add...                      |
|                                                      |
|  ── Welcome Message ──                               |
|                                                      |
|  Greeting                                            |
|  [Hi! I'm Hung's AI assistant. Ask me about     ]   |
|  [his skills, projects, or experience.           ]   |
|                                                      |
|  Suggested Questions                                 |
|  [What are your main skills?                  ] [x]  |
|  [Tell me about your experience              ] [x]  |
|  [Show me your projects                      ] [x]  |
|                           [+ Add Question]           |
|                                                      |
|  ── Preview ──                                       |
|                                                      |
|  ┌──────────────────────────────────────────────┐    |
|  │        [Open Chat Preview]                    │    |
|  │                                               │    |
|  │   Test your chatbot with current settings     │    |
|  └──────────────────────────────────────────────┘    |
|                                                      |
+------------------------------------------------------+
```

---

## 3. Component Specs

### 3.1 Status Card

A simple info card at the top showing chatbot status.

```
┌────────────────────────────────────────┐
│  [●] Active              Saved 2m ago  │
└────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Background | `var(--bg-primary)` |
| Border | 1px solid `var(--border)` |
| Border-radius | `--radius-md` (8px) |
| Padding | `12px 16px` |
| Layout | Flex row, `justify-content: space-between`, `align-items: center` |
| Margin-bottom | `24px` (`--space-6`) |

**Left side:**
- Status dot: 8px circle, `#22C55E` (green = active), with subtle pulse animation
- Label: "Active" — Inter 14px/500, `var(--text-primary)`
- If chatbot is disabled (future): dot = `var(--text-muted)`, label = "Inactive"

**Right side:**
- "Saved 2m ago" — Inter 13px/400, `var(--text-muted)`
- Uses relative time (e.g., "just now", "2 min ago", "1 hour ago")
- Shows "Never saved" in `var(--text-muted)` italic if no prior save

### 3.2 Custom Instructions Textarea

The primary input — where Boss adds context for the chatbot.

| Property | Value |
|----------|-------|
| Component | Reuse `FormTextarea` |
| Label | "Custom Instructions" |
| Placeholder | See below |
| Min-height | `160px` (taller than standard 100px — this is the main content area) |
| Max-length | 2000 characters |
| Resize | Vertical |

**Placeholder text:**
```
Add additional context for the chatbot. For example:
• "I'm currently looking for senior AI/ML roles"
• "Highlight my backend and system design experience"
• "I specialize in LLM applications and multi-agent systems"
```

**Character counter:**

| Property | Value |
|----------|-------|
| Position | Below textarea, right-aligned |
| Font | Inter 12px/400 |
| Color (normal) | `var(--text-muted)` |
| Color (near limit, >1800) | `#F59E0B` (warning amber) |
| Color (at limit, 2000) | `#EF4444` (error red) |
| Format | "254 / 2000 characters" |

### 3.3 Suggested Topics (Tag Input)

Quick tags that help organize the chatbot's focus areas.

| Property | Value |
|----------|-------|
| Component | Reuse existing `TagInput` |
| Label | "Suggested Topics" |
| Helper text | "Tags help the chatbot understand your current priorities" — Inter 12px/400, `var(--text-muted)` |
| Placeholder | "Type and press Enter to add..." |
| Max tags | 10 |

**Pre-filled examples (when empty):** none — starts empty, Boss adds as needed.

### 3.4 Welcome Message Section

#### Greeting Textarea

| Property | Value |
|----------|-------|
| Component | Reuse `FormTextarea` |
| Label | "Greeting" |
| Min-height | `80px` |
| Placeholder | "Hi! I'm [name]'s AI assistant. Ask me about skills, projects, or experience." |
| Helper text | "Shown when visitors first open the chat" |

> This greeting maps directly to the `EmptyState` welcome message in the chat UI (Sprint 12 spec, Section 5a).

#### Suggested Questions (Repeatable List)

These map to the suggested question chips in the chat EmptyState.

```
Suggested Questions

[What are your main skills?                     ] [x]
[Tell me about your experience                  ] [x]
[Show me your projects                          ] [x]
                                  [+ Add Question]
```

| Property | Value |
|----------|-------|
| Each item | `FormInput` (single line) + delete `X` button |
| Input placeholder | "e.g., What projects have you worked on?" |
| Delete button | `X` icon, 16px, `var(--text-muted)`, hover `#EF4444` |
| Add button | Reuse `AddButton` component: dashed border, "+ Add Question" |
| Max items | 5 (more would clutter the chat empty state) |
| Min items | 1 (at least one suggested question) |
| Item spacing | 8px gap between rows |

**Validation:** Each question must be non-empty. Show error (red border) on save attempt if a question field is blank.

### 3.5 Preview Section

A card that lets Boss test the chatbot directly in admin.

```
┌─────────────────────────────────────────────┐
│                                             │
│           [MessageCircle icon - 40px]       │
│                                             │
│      Test your chatbot configuration        │
│    Opens a preview with current settings    │
│                                             │
│          [Open Chat Preview]                │
│                                             │
└─────────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Card style | Same as EmptyState pattern from admin-panel-specs.md |
| Icon | `MessageCircle`, 40px, `var(--text-muted)` opacity 0.5 |
| Title | "Test your chatbot configuration" — Inter 16px/600, `var(--text-secondary)` |
| Subtitle | "Opens a preview with current settings" — Inter 14px/400, `var(--text-muted)` |
| Button | Primary filled (same as Save button style): bg `var(--cta)`, white text, 14px/500, padding `8px 20px`, radius `--radius-md`, hover `var(--cta-hover)` |
| Button text | "Open Chat Preview" |
| Button icon | `ExternalLink` from lucide, 16px, left of text |

**Behavior on click:**
- Opens the floating chat widget (from Sprint 12) in a preview mode
- Uses the *unsaved* current form state (not what's on server) — so Boss can test before saving
- Chat window appears over the admin panel, same position/size as on the portfolio page
- A small banner at top of chat window: "Preview Mode — using unsaved settings" — bg `#F59E0B` at 15% opacity, text `#F59E0B`, Inter 12px/500, padding `6px 12px`

> This is a P1 feature. MVP can skip preview and just use the live chatbot on the portfolio page for testing.

---

## 4. Section Field Groups

Use the existing field group divider pattern (same as PersonalInfoForm):

| Element | Spec |
|---------|------|
| Divider | 1px solid `var(--border)` |
| Label | Inter 11px/600 uppercase, `var(--text-muted)` |
| Spacing | `margin-top: 24px`, `margin-bottom: 16px` |

Field groups in order:
1. **Status** (status card, no divider label — it's at the top)
2. **Custom Context** — divider label: "CUSTOM CONTEXT"
3. **Suggested Topics** — no separate divider (belongs to Custom Context group)
4. **Welcome Message** — divider label: "WELCOME MESSAGE"
5. **Preview** — divider label: "PREVIEW"

---

## 5. Data Model

```typescript
interface ChatbotSettings {
  customInstructions: string;     // Max 2000 chars
  suggestedTopics: string[];      // Max 10 tags
  greeting: string;               // Welcome message
  suggestedQuestions: string[];    // 1-5 questions
}
```

### API Endpoints

Follow existing admin API pattern (`/api/admin/{section}`):

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| `GET` | `/api/admin/chatbot` | — | `ChatbotSettings` |
| `PATCH` | `/api/admin/chatbot` | `Partial<ChatbotSettings>` | Updated `ChatbotSettings` |

### Storage

Same as other admin sections — JSON file in `content/` directory:

```
content/chatbot.json
```

**Default content (if file doesn't exist):**
```json
{
  "customInstructions": "",
  "suggestedTopics": [],
  "greeting": "Hi! I'm Hung's AI assistant. Ask me about his skills, projects, or experience.",
  "suggestedQuestions": [
    "What are your main skills?",
    "Tell me about your experience",
    "Show me your projects"
  ]
}
```

---

## 6. Save/Undo Flow

Identical to existing admin forms. No new patterns needed:

1. **Load:** `GET /api/admin/chatbot` → populate form → store as `original`
2. **Edit:** Any change sets `isDirty = true` (compare JSON stringify)
3. **Undo:** Reset `data` to `original`, clears dirty state
4. **Save:** `PATCH /api/admin/chatbot` with current `data`
   - Button shows spinner during save
   - Success: "Saved!" green flash for 1.5s, toast "Chatbot settings saved"
   - Error: toast "Failed to save chatbot settings"
5. **Loading state:** `SkeletonForm` while fetching

---

## 7. Responsive Behavior

### Desktop (>= 1024px)

Standard admin layout: sidebar visible, content area `max-w-3xl`, `p-8`.

### Tablet (768–1023px)

Sidebar collapsed to icons. Content area fills available width.

### Mobile (< 768px)

- "Chatbot" tab in horizontal tab bar (6th item, may need scroll)
- Full-width form layout
- Textarea stays full-width
- Tag input wraps naturally
- Preview card stacks vertically
- Suggested questions list is full-width

No special mobile treatment needed — existing form components are already responsive.

---

## 8. Animations

No new animations. Everything reuses existing admin panel transitions:

| Animation | Duration | Easing | Source |
|-----------|----------|--------|--------|
| Section switch | instant (no transition between sections) | — | Existing |
| Save button state | 150ms | ease-out | `SectionHeader` |
| Form field focus | 150ms | ease-out | `FormInput`/`FormTextarea` |
| Tag add/remove | 150ms | ease-out | `TagInput` |
| Toast appear/dismiss | 200ms / 150ms | `--ease-out-expo` / ease-in | `Toast` |

---

## 9. Component Inventory

| # | Component | New/Reuse | Notes |
|---|-----------|-----------|-------|
| 1 | `AdminSidebar` | **Modify** | Add "chatbot" to `AdminSection` type + `ADMIN_SECTIONS` array + separator + "AI" group label |
| 2 | `MobileTabBar` | **Auto** | Picks up new section from `ADMIN_SECTIONS` — no code change needed |
| 3 | `ChatbotSettingsForm` | **New** | Main form component — follows `PersonalInfoForm` pattern exactly |
| 4 | `StatusCard` | **New** | Simple info card (small, ~30 lines) |
| 5 | `SectionHeader` | Reuse | No changes |
| 6 | `FormTextarea` | Reuse | For custom instructions + greeting |
| 7 | `TagInput` | Reuse | For suggested topics |
| 8 | `FormInput` | Reuse | For each suggested question row |
| 9 | `AddButton` | Reuse | For "+ Add Question" |
| 10 | `SkeletonForm` | Reuse | Loading state |
| 11 | Admin page (`app/admin/page.tsx`) | **Modify** | Add `chatbot` case to `renderSection()` switch |

**File structure:**
```
components/admin/sections/
  ChatbotSettingsForm.tsx   ← NEW (main form)
  StatusCard.tsx            ← NEW (small info card)
  ...existing files...
```

**Estimated effort:** Small. Only 2 new components + 2 minor modifications. Heavy reuse of existing form infrastructure.

---

## 10. Priority Split

### P0 (Must have for Sprint 13)

- Sidebar nav: add "Chatbot" item with `MessageCircle` icon
- `ChatbotSettingsForm` with:
  - Custom Instructions textarea (with char counter)
  - Suggested Topics tag input
  - Welcome Message: greeting textarea + suggested questions list
- Save/Undo flow (standard pattern)
- API endpoint: `GET`/`PATCH /api/admin/chatbot`
- `content/chatbot.json` storage

### P1 (Stretch)

- Status card with last-saved timestamp
- Sidebar section separator + "AI" group label
- Chat preview mode in admin
- Preview mode banner ("using unsaved settings")

### Out of Scope

- System prompt editor (too dangerous for admin UI)
- Response style/tone settings
- Analytics/conversation history viewer
- Rate limiting configuration

---

*End of Admin Chatbot Settings Design Specs*
