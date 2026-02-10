# Admin Panel UI Design Specs

**Sprint 8 Prep** | Designer: DS | Status: READY FOR REVIEW

---

## 1. Overall Layout

### Page Structure (`/admin`)

```
+----------------------------------------------------------+
| Top Bar (h-14)                                           |
| [<- Back to Portfolio]          [Theme Toggle] [Logout]  |
+------------+---------------------------------------------+
|            |                                             |
| Sidebar    |  Main Content Area                         |
| (w-56)     |                                             |
|            |  +---------------------------------------+  |
| [Personal] |  | Section Header                        |  |
| [Experien] |  | "Personal Info"          [Save] [Undo]|  |
| [Projects] |  +---------------------------------------+  |
| [Skills  ] |  |                                       |  |
| [Achievem] |  | Form / List Content                   |  |
|            |  |                                       |  |
|            |  |                                       |  |
|            |  +---------------------------------------+  |
|            |                                             |
+------------+---------------------------------------------+
```

### Layout Specs

| Element | Value | CSS Variable |
|---------|-------|--------------|
| Top bar height | 56px (h-14) | -- |
| Sidebar width | 224px (w-56) | -- |
| Content max-width | 768px | -- |
| Content padding | 32px | `--space-8` |
| Background (main area) | `--bg-secondary` | #FAFAFA / #18181B |
| Background (sidebar) | `--bg-primary` | #FFFFFF / #09090B |
| Background (top bar) | `--bg-primary` + border-b | with `--border` |

### Responsive Behavior

| Breakpoint | Sidebar | Behavior |
|------------|---------|----------|
| >= 1024px (lg) | Visible, fixed left | Standard layout |
| 768-1023px (md) | Collapsed to icons only (w-16) | Icon-only sidebar, tooltip on hover |
| < 768px (mobile) | Hidden | Top horizontal tab bar replaces sidebar |

**Mobile Tab Bar:** Horizontal scrollable row below top bar. Same 5 section icons. Active tab has `--cta` underline (2px).

---

## 2. Top Bar

### Desktop

```
[<- Portfolio]                              [Sun/Moon] [Logout]
```

| Element | Spec |
|---------|------|
| Height | 56px |
| Background | `--bg-primary` with `backdrop-filter: blur(12px)` |
| Border | bottom 1px `--border` |
| "Back to Portfolio" | Left-aligned. Icon `ArrowLeft` + text. Color `--text-secondary`. Hover: `--cta`. Links to `/` |
| Theme Toggle | Reuse existing `ThemeToggle` component |
| Logout button | Text button. Color `--text-muted`. Hover: `--text-primary` |
| Padding | 0 24px (`--space-6`) |

### Mobile

Same, but "Back to Portfolio" shows only the `ArrowLeft` icon (no text) to save space.

---

## 3. Sidebar Navigation

### Visual Spec

```
+--------------------+
|                    |
|  CONTENT           |  <- Section label
|                    |
|  [User] Personal   |  <- Active: bg highlight + left accent
|  [Briefcase] Exp   |
|  [Folder] Projects |
|  [Zap] Skills      |
|  [Award] Achieve   |
|                    |
+--------------------+
```

### Sidebar Item States

| State | Background | Text Color | Left Border | Icon Color |
|-------|-----------|------------|-------------|------------|
| Default | transparent | `--text-secondary` | none | `--text-muted` |
| Hover | `--bg-tertiary` | `--text-primary` | none | `--text-secondary` |
| Active | `--bg-tertiary` | `--cta` | 3px solid `--cta` | `--cta` |

### Sidebar Item Specs

| Property | Value |
|----------|-------|
| Height | 44px |
| Padding | 12px 16px |
| Border radius | `--radius-md` (8px) on right only (left flush for active border) |
| Font | Inter 14px/500 |
| Icon size | 18px (Lucide icons) |
| Gap (icon to text) | 12px |
| Section label ("CONTENT") | Inter 11px/600 uppercase, `--text-muted`, padding 16px, margin-bottom 8px |
| Transition | background-color 150ms `--ease-out-quad` |

### Icons per Section

| Section | Lucide Icon |
|---------|-------------|
| Personal | `User` |
| Experience | `Briefcase` |
| Projects | `FolderOpen` |
| Skills | `Zap` |
| Achievements | `Award` |

---

## 4. Main Content Area

### Section Header

```
+--------------------------------------------------+
| Personal Info                     [Save] [Undo]  |
| Edit your personal details                       |
+--------------------------------------------------+
```

| Element | Spec |
|---------|------|
| Title | Inter 24px/700, `--text-primary` |
| Subtitle | Inter 14px/400, `--text-muted` |
| Container | padding 32px (`--space-8`) bottom border 1px `--border` |
| Buttons | Right-aligned, flex row, gap 12px |

### Save/Undo Buttons

| Button | Style | Spec |
|--------|-------|------|
| **Save** | Primary filled | bg `--cta`, text white, 14px/500, padding 8px 20px, radius `--radius-md`, hover `--cta-hover`, shadow `0 1px 2px rgba(0,0,0,0.1)` |
| **Undo** | Ghost/secondary | bg transparent, text `--text-secondary`, border 1px `--border`, same size as Save, hover bg `--bg-tertiary` |

**Button States:**

| State | Save Button | Undo Button |
|-------|-------------|-------------|
| Default (no changes) | Disabled: opacity 0.4, cursor not-allowed | Hidden |
| Dirty (has changes) | Enabled: full opacity | Visible |
| Saving | Spinner (16px) replaces text, disabled | Disabled |
| Success | Brief green flash (bg `#22C55E` for 1.5s), text "Saved!" | Hidden (auto) |
| Error | Red outline flash, tooltip/toast with error message | Stays visible |

---

## 5. Form Components

### 5.1 Text Input

```
Label *
+------------------------------------------+
| Placeholder text                         |
+------------------------------------------+
Helper text or error message
```

| Property | Value |
|----------|-------|
| Label | Inter 13px/500, `--text-primary`, margin-bottom 6px |
| Required indicator | " *" in `--cta` color after label |
| Input height | 40px |
| Input padding | 0 12px |
| Input background | `--bg-primary` |
| Input border | 1px solid `--border` |
| Input border (focus) | 1px solid `--cta`, box-shadow `0 0 0 3px var(--cta-glow)` |
| Input border (error) | 1px solid `#EF4444` |
| Input text | Inter 14px/400, `--text-primary` |
| Placeholder | Inter 14px/400, `--text-muted` |
| Border radius | `--radius-md` (8px) |
| Margin bottom (field spacing) | 20px |
| Helper text | Inter 12px/400, `--text-muted` |
| Error text | Inter 12px/400, `#EF4444` |
| Transition | border-color 150ms, box-shadow 150ms |

### 5.2 Textarea

Same as Text Input but:

| Property | Value |
|----------|-------|
| Min height | 100px |
| Resize | vertical only |
| Padding | 12px |
| Line-height | 1.6 |

### 5.3 Tag Input (for techStack, tags, skills)

```
Tags
+------------------------------------------+
| [React x] [Next.js x] [TypeScript x]    |
| Type and press Enter to add...           |
+------------------------------------------+
```

| Property | Value |
|----------|-------|
| Container | Same as text input, but min-height 40px, auto-grows, padding 6px |
| Tag pill | bg `--bg-tertiary`, text `--text-secondary`, 12px/500, padding 4px 8px, radius `--radius-full`, inline-flex |
| Tag remove "x" | 14px, `--text-muted`, hover `--text-primary`, cursor pointer, margin-left 4px |
| Input area | Inline after tags, no border, bg transparent |
| Add behavior | `Enter` key or comma creates tag |

### 5.4 Select / Dropdown

```
Icon
+------------------------------------------+
| trophy                              [v]  |
+------------------------------------------+
```

| Property | Value |
|----------|-------|
| Same dimensions as Text Input | -- |
| Dropdown arrow | Lucide `ChevronDown`, 16px, `--text-muted` |
| Dropdown menu | bg `--bg-primary`, border 1px `--border`, shadow `--shadow-md`, radius `--radius-md`, max-height 200px, overflow-y auto |
| Option | padding 8px 12px, hover bg `--bg-tertiary`, Inter 14px/400 |
| Selected option | text `--cta`, checkmark icon left |

### 5.5 Date Input

Plain text input with placeholder format hint (e.g., "Jan 2022"). No date picker needed -- dates in this portfolio are display strings, not Date objects.

| Property | Value |
|----------|-------|
| Same as Text Input | -- |
| Placeholder | "e.g., Jan 2022" |
| "Present" checkbox | For endDate: checkbox + label "Currently here" that sets value to null |

---

## 6. Section-Specific Form Designs

### 6.1 Personal Info

**Layout:** Single-column form. All fields visible at once (no tabs).

```
+--------------------------------------------------+
| Personal Info                     [Save] [Undo]  |
| Edit your personal details                       |
+--------------------------------------------------+
|                                                  |
| Name *                                           |
| [Hung Pham                                    ]  |
|                                                  |
| Tagline *                                        |
| [Full-Stack Developer & Creative Technologist ]  |
|                                                  |
| Bio *                                            |
| [I'm a full-stack developer based in Ho Chi   ]  |
| [Minh City, Vietnam. I craft interactive...   ]  |
|                                                  |
| ---- Contact & Location ----                     |
|                                                  |
| Email *                   Location               |
| [hello@hungpham.dev   ]   [Ho Chi Minh City.. ]  |
|                                                  |
| Status                    Languages              |
| [Open to opportunities]   [Vietnamese, English]  |
|                                                  |
| ---- Social Links ----                           |
|                                                  |
| [GitHub  ] [https://github.com/hungson175   ] [x]|
| [LinkedIn] [https://linkedin.com/in/hungpham] [x]|
| [Twitter ] [https://twitter.com/hungpham    ] [x]|
| [Email   ] [mailto:hello@hungpham.dev       ] [x]|
|                         [+ Add Social Link]      |
|                                                  |
| ---- Quick Facts ----                            |
|                                                  |
| [MapPin ] [Location] [Ho Chi Minh City, VN   ] [x]|
| [Target ] [Focus   ] [Full-Stack Dev, AI/ML  ] [x]|
|                         [+ Add Quick Fact]       |
|                                                  |
+--------------------------------------------------+
```

**Field Groups:** Use a thin horizontal divider (1px `--border`) with a section label (Inter 11px/600 uppercase, `--text-muted`) to separate: Basic Info | Contact & Location | Social Links | Quick Facts.

**Two-column row** (Email+Location, Status+Languages): On desktop, side-by-side with gap 16px. On mobile, stack vertically.

**Social Links / Quick Facts:** Repeatable row pattern (see Section 6.2 list pattern below). Each row: icon-select + name-input + value-input + delete button.

### 6.2 Experience (List + Edit Pattern)

**Layout:** List view as default. Click item to expand inline editor.

#### List View

```
+--------------------------------------------------+
| Experience                        [Save] [Undo]  |
| Manage your work history                         |
+--------------------------------------------------+
|                                                  |
| +----------------------------------------------+|
| | Senior Full-Stack Developer                   ||
| | Tech Company Inc  |  Jan 2022 - Present      ||
| | 3 achievements, 6 tech skills      [Edit][x] ||
| +----------------------------------------------+|
|                                                  |
| +----------------------------------------------+|
| | Full-Stack Developer                          ||
| | Innovation Labs  |  Mar 2020 - Dec 2021      ||
| | 3 achievements, 6 tech skills      [Edit][x] ||
| +----------------------------------------------+|
|                                                  |
| +----------------------------------------------+|
| | Software Developer                            ||
| | StartUp Ventures  |  Jun 2018 - Feb 2020     ||
| | 3 achievements, 5 tech skills      [Edit][x] ||
| +----------------------------------------------+|
|                                                  |
|              [+ Add Experience]                  |
|                                                  |
+--------------------------------------------------+
```

#### List Card Spec

| Property | Value |
|----------|-------|
| Background | `--bg-primary` |
| Border | 1px solid `--border` |
| Border radius | `--radius-md` (8px) |
| Padding | 16px |
| Margin between cards | 12px |
| Role (title) | Inter 16px/600, `--text-primary` |
| Company + dates | Inter 13px/400, `--text-muted` |
| Summary line | Inter 12px/400, `--text-muted` |
| Edit button | Ghost, Lucide `Pencil` 16px, `--text-muted`, hover `--cta` |
| Delete button | Ghost, Lucide `Trash2` 16px, `--text-muted`, hover `#EF4444` |
| Hover | border-color `--cta` with 150ms transition |
| Drag handle (future) | Left edge, Lucide `GripVertical`, `--text-muted` |

#### Inline Edit (Expanded Card)

When "Edit" is clicked, the card expands smoothly (200ms, `--ease-out-expo`) to show the full form:

```
+----------------------------------------------+
| [Company *            ] [Role *             ] |
| [Tech Company Inc     ] [Sr. Full-Stack Dev ] |
|                                               |
| [Start Date *] [End Date    ] [x] Currently  |
| [Jan 2022    ] [            ]  here           |
|                                               |
| Achievements                                  |
| [Led development of AI-powered multi-agent ]  |
| [Architected microservices infrastructure  ]  |
| [Mentored team of 5 junior developers     ]  |
|                        [+ Add Achievement]    |
|                                               |
| Tech Stack                                    |
| [React x] [Next.js x] [TypeScript x] [+]     |
|                                               |
|                     [Done] [Cancel]           |
+----------------------------------------------+
```

**Achievements sub-list:** Each achievement is a textarea (1 line, auto-grows). Drag to reorder (optional). Delete via `x` button on right. "Add" button appends empty field.

**Done/Cancel:** "Done" collapses the card back to list view (saves to local state, NOT to server). "Cancel" reverts changes and collapses. The top-level "Save" button commits ALL changes to server.

### 6.3 Projects (List + Edit Pattern)

Same list+edit pattern as Experience.

#### List Card

```
+----------------------------------------------+
| [Bot icon]  AI Multi-Agent System             |
|             Python, LangChain, FastAPI, +2    |
|             Links: Live | GitHub   [Edit][x]  |
+----------------------------------------------+
```

| Element | Spec |
|---------|------|
| Icon | Lucide icon from `thumbnail` field, 24px, `--cta` color, inside 40px circle bg `--bg-tertiary` |
| Title | Inter 16px/600, `--text-primary` |
| Tags preview | First 3 tags + "+N" counter, Inter 12px/400, `--text-muted` |
| Links | "Live" / "GitHub" as small text links, `--cta` color |

#### Expanded Edit Form

```
+----------------------------------------------+
| Title *                                       |
| [AI Multi-Agent System                     ]  |
|                                               |
| Description *                                 |
| [Built a multi-agent system using LangChain]  |
| [where AI agents collaborate autonomously. ]  |
|                                               |
| Thumbnail Icon                                |
| [ Bot          v ]  (select from Lucide set)  |
|                                               |
| Tags                                          |
| [Python x] [LangChain x] [FastAPI x] [+]     |
|                                               |
| Live URL                    GitHub URL         |
| [https://example.com    ]   [https://github.] |
|                                               |
|                     [Done] [Cancel]           |
+----------------------------------------------+
```

**Thumbnail Icon Select:** Dropdown with icon preview. Curated list: `Bot`, `Palette`, `ShoppingBag`, `Globe`, `Code`, `Smartphone`, `Database`, `Brain`, `Rocket`, `Layout`.

### 6.4 Skills (Category + Skills Pattern)

**Layout:** Each category is a card. Skills within each category use the tag input pattern.

```
+--------------------------------------------------+
| Skills                            [Save] [Undo]  |
| Manage your skill categories                     |
+--------------------------------------------------+
|                                                  |
| +----------------------------------------------+|
| | Languages                          [Edit][x] ||
| | TypeScript, Python, JavaScript, Java, SQL     ||
| +----------------------------------------------+|
|                                                  |
| +----------------------------------------------+|
| | AI/ML & LLM                        [Edit][x] ||
| | LangChain, Claude API, OpenAI, PyTorch, ...   ||
| +----------------------------------------------+|
|                                                  |
| +----------------------------------------------+|
| | Framework & Tools                  [Edit][x] ||
| | React, Next.js, Vue.js, Node.js, FastAPI, ...||
| +----------------------------------------------+|
|                                                  |
| +----------------------------------------------+|
| | Method & Leadership                [Edit][x] ||
| | Agile, Scrum, Team Leadership, Code Review   ||
| +----------------------------------------------+|
|                                                  |
|            [+ Add Skill Category]                |
|                                                  |
+--------------------------------------------------+
```

#### Expanded Edit

```
+----------------------------------------------+
| Category Name *                               |
| [Languages                                 ]  |
|                                               |
| Skills                                        |
| [TypeScript x] [Python x] [JavaScript x]     |
| [Java x] [SQL x]                             |
| Type and press Enter to add...                |
|                                               |
|                     [Done] [Cancel]           |
+----------------------------------------------+
```

### 6.5 Achievements (List + Edit Pattern)

Same list+edit pattern as Experience.

#### List Card

```
+----------------------------------------------+
| [Trophy]  Best Engineering Team       2023    |
|           Led development of high-impact...   |
|                                    [Edit][x]  |
+----------------------------------------------+
```

| Element | Spec |
|---------|------|
| Icon | Mapped from `icon` field. 20px. Colors: trophy=`#F59E0B`, award=`--cta`, star=`#F59E0B`, medal=`#A855F7`, sparkles=`--gradient-start` |
| Title | Inter 16px/600, `--text-primary` |
| Date | Inter 13px/400, `--text-muted`, right-aligned |
| Description | Inter 13px/400, `--text-secondary`, 1 line truncated |

#### Expanded Edit Form

```
+----------------------------------------------+
| Title *                                       |
| [Best Engineering Team                     ]  |
|                                               |
| Description *                                 |
| [Led development of high-impact features   ]  |
|                                               |
| Date *                    Icon                 |
| [2023              ]      [trophy        v ]  |
|                                               |
|                     [Done] [Cancel]           |
+----------------------------------------------+
```

**Icon Select:** Dropdown with icon previews. Options: `trophy`, `award`, `star`, `medal`, `sparkles`. Each shows the colored icon + name.

---

## 7. Feedback & States

### Toast Notifications

Position: top-right, 24px from edge, below top bar.

| Type | Spec |
|------|------|
| **Success** | bg `#22C55E`, white text, Lucide `Check` icon, auto-dismiss 3s |
| **Error** | bg `#EF4444`, white text, Lucide `AlertCircle` icon, persist until dismissed |
| **Info** | bg `--cta`, white text, Lucide `Info` icon, auto-dismiss 4s |

| Property | Value |
|----------|-------|
| Width | 320px max |
| Padding | 12px 16px |
| Border radius | `--radius-md` (8px) |
| Shadow | `--shadow-md` |
| Font | Inter 14px/500 |
| Animation | Slide in from right, 200ms `--ease-out-expo` |
| Dismiss | Click "x" or auto-dismiss |

### Delete Confirmation Modal

```
+------------------------------+
|  Delete Experience?          |
|                              |
|  This will remove "Senior    |
|  Full-Stack Developer" from  |
|  your portfolio. This action |
|  cannot be undone.           |
|                              |
|        [Cancel] [Delete]     |
+------------------------------+
```

| Property | Value |
|----------|-------|
| Overlay | bg `rgba(0,0,0,0.5)`, z-50 |
| Modal | bg `--bg-primary`, radius `--radius-lg` (16px), shadow `--shadow-lg`, padding 24px, max-width 400px |
| Title | Inter 18px/600, `--text-primary` |
| Body | Inter 14px/400, `--text-secondary` |
| Cancel | Ghost button |
| Delete | bg `#EF4444`, white text, hover `#DC2626` |
| Animation | Fade in overlay 150ms, scale modal from 0.95 to 1.0 with 200ms `--ease-out-expo` |

### Empty State

When a section list is empty (e.g., no experiences added yet):

```
+----------------------------------------------+
|                                               |
|           [Briefcase icon - 48px]             |
|                                               |
|        No experiences added yet               |
|     Add your work history to showcase         |
|         your professional journey.            |
|                                               |
|          [+ Add Experience]                   |
|                                               |
+----------------------------------------------+
```

| Property | Value |
|----------|-------|
| Icon | Lucide section icon, 48px, `--text-muted` opacity 0.5 |
| Title | Inter 16px/600, `--text-secondary` |
| Description | Inter 14px/400, `--text-muted`, max-width 300px, centered |
| Button | Same as "Add" button spec |

### Loading State

While data is being fetched from API:

| Element | Behavior |
|---------|----------|
| Form fields | Show skeleton shimmer (use existing `.skeleton` class) |
| List cards | 3 skeleton cards with shimmer |
| Save button | Disabled |

---

## 8. "Add" Button Spec

All "Add" buttons follow the same pattern:

| Property | Value |
|----------|-------|
| Style | Dashed border, full width |
| Border | 2px dashed `--border` |
| Border radius | `--radius-md` (8px) |
| Height | 44px |
| Text | Inter 14px/500, `--text-muted` |
| Icon | Lucide `Plus`, 16px, left of text |
| Hover | border-color `--cta`, text color `--cta`, bg `--bg-tertiary` |
| Transition | all 150ms |

---

## 9. Animation Specs

All admin panel animations follow Sprint 7 timing guidelines (fast, professional).

| Animation | Duration | Easing | Trigger |
|-----------|----------|--------|---------|
| Card expand/collapse | 200ms | `--ease-out-expo` | Edit/Done click |
| Toast enter | 200ms | `--ease-out-expo` | On event |
| Toast exit | 150ms | ease-in | Auto-dismiss or click |
| Modal overlay | 150ms | ease-out | Open |
| Modal scale | 200ms | `--ease-out-expo` | Open |
| Sidebar hover | 150ms | `--ease-out-quad` | Hover |
| Focus ring | 150ms | ease-out | Focus |
| Button state change | 150ms | ease-out | Click |

**Reduced motion:** All animations collapse to instant (0ms) when `prefers-reduced-motion` is enabled. Only opacity transitions remain (150ms).

---

## 10. Color Reference (Admin-Specific)

All colors derive from the existing CSS variable system. No new colors except semantic states:

| Purpose | Light | Dark | Usage |
|---------|-------|------|-------|
| Success | `#22C55E` | `#22C55E` | Save success toast, success border |
| Error | `#EF4444` | `#EF4444` | Error toast, validation errors, delete button |
| Warning | `#F59E0B` | `#F59E0B` | Unsaved changes indicator (optional) |
| Primary action | `--cta` | `--cta` | Save button, active sidebar, links |
| Everything else | Use `--` vars | Use `--` vars | Consistent with portfolio |

---

## 11. Typography Summary

| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Page title | Inter | 24px | 700 | `--text-primary` |
| Page subtitle | Inter | 14px | 400 | `--text-muted` |
| Section divider label | Inter | 11px | 600 | `--text-muted` (uppercase) |
| Sidebar section label | Inter | 11px | 600 | `--text-muted` (uppercase) |
| Sidebar item | Inter | 14px | 500 | `--text-secondary` |
| Card title | Inter | 16px | 600 | `--text-primary` |
| Card meta | Inter | 13px | 400 | `--text-muted` |
| Form label | Inter | 13px | 500 | `--text-primary` |
| Form input | Inter | 14px | 400 | `--text-primary` |
| Form helper/error | Inter | 12px | 400 | `--text-muted` / `#EF4444` |
| Button text | Inter | 14px | 500 | varies |
| Tag pill | Inter | 12px | 500 | `--text-secondary` |
| Toast | Inter | 14px | 500 | white |

---

## 12. Component Inventory

Summary of all components DEV needs to build:

### Layout Components
1. **AdminLayout** - Top bar + sidebar + content area wrapper
2. **AdminSidebar** - Section navigation (collapsible on md, hidden on mobile)
3. **AdminTopBar** - Back link + theme toggle + logout
4. **MobileTabBar** - Horizontal section tabs for mobile

### Form Components
5. **FormInput** - Text input with label, validation, helper text
6. **FormTextarea** - Multi-line text with auto-grow
7. **TagInput** - Tag pills with add/remove
8. **IconSelect** - Dropdown with icon previews
9. **DateInput** - Text input with "Currently here" checkbox option

### List Components
10. **EditableList** - Generic list with add/edit/delete pattern (reusable for Experience, Projects, Achievements)
11. **ListCard** - Collapsed card showing summary
12. **ListCardExpanded** - Expanded inline edit form

### Feedback Components
13. **Toast** - Success/error/info notification
14. **ConfirmModal** - Delete confirmation dialog
15. **EmptyState** - Placeholder for empty lists
16. **SkeletonForm** - Loading state for forms
17. **SkeletonList** - Loading state for lists

### Section Forms (compose above components)
18. **PersonalInfoForm** - Uses FormInput, FormTextarea, TagInput
19. **ExperienceForm** - Uses EditableList with nested fields
20. **ProjectsForm** - Uses EditableList with TagInput, IconSelect
21. **SkillsForm** - Uses EditableList with TagInput
22. **AchievementsForm** - Uses EditableList with IconSelect

---

## 13. Accessibility

| Requirement | Implementation |
|-------------|----------------|
| Focus management | Visible focus rings (`--cta-glow`) on all interactive elements |
| Keyboard nav | Tab through sidebar items, form fields. Enter to submit, Escape to cancel/close |
| Screen reader | Proper `aria-label` on icon-only buttons, `role="alert"` on toasts |
| Color contrast | All text meets WCAG AA (4.5:1 ratio minimum) |
| Touch targets | Minimum 44x44px on all buttons and interactive elements |
| Reduced motion | Honors `prefers-reduced-motion` media query |
| Form errors | Associated via `aria-describedby` to input fields |

---

*End of Admin Panel UI Design Specs*
