# Sprint 12: AI Chatbot UI — Design Specifications

**Sprint:** 12
**Feature:** Floating AI Chat for Portfolio
**Designer:** DS
**Date:** 2026-02-09
**Status:** Ready for DEV

---

## Overview

A floating chatbot that lets visitors ask questions about the portfolio owner's skills, experience, and projects. Powered by xAI (Grok) with streaming responses. Must integrate seamlessly with the existing Violet→Blue design system.

**Design Principles:**
- Non-intrusive — never blocks portfolio content
- Professional — matches existing aesthetic, no gimmicks
- Fast — streaming feels instant, animations are snappy
- Accessible — keyboard navigable, reduced-motion safe, screen-reader friendly

---

## Z-Index Layering (Existing Context)

| Layer | z-index | Elements |
|-------|---------|----------|
| Modals | z-50 | Project modal, Nav header, Toast |
| Overlays | z-40 | Mobile menu, Admin top bar |
| Backdrops | z-30 | Mobile overlay |
| **Chat FAB** | **z-40** | Floating action button |
| **Chat Window** | **z-40** | Chat panel (below nav, above content) |

> FAB and chat window use z-40 — below navigation (z-50) so nav remains accessible, above all page content.

---

## 1. Floating Action Button (FAB)

### Layout

| Property | Value | Notes |
|----------|-------|-------|
| Position | `fixed` | Viewport-anchored |
| Bottom | `24px` (`--space-6`) | Consistent with spacing system |
| Right | `24px` (`--space-6`) | |
| Width | `56px` | Professional size, meets 44px touch target |
| Height | `56px` | 1:1 ratio |
| Border-radius | `--radius-full` (9999px) | Perfect circle |
| z-index | 40 | Below nav (50), above content |

### Styling

```
Both Modes:
  background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end))
  color: #FFFFFF
  box-shadow: var(--shadow-md)

  Light: #7C3AED → #2563EB (vibrant violet-blue)
  Dark:  #7B337D → #3B82F6 (muted warm violet → brighter blue)

CSS vars handle the switch automatically. Do NOT hardcode hex values.
FAB is always the brand accent — gradient adapts per theme like all other gradient usages.
```

### Icon

- **Default (closed):** `MessageCircle` from `lucide-react` — 24px
- **Open state:** `X` (close) from `lucide-react` — 24px
- Icon transition: crossfade with 150ms duration

### States & Animations

| State | Effect | Duration | Easing |
|-------|--------|----------|--------|
| Default | Static, gradient bg | — | — |
| Hover | `scale(1.08)` + glow shadow | 200ms | `--ease-out-expo` |
| Active/Tap | `scale(0.95)` | 100ms | ease-out |
| Page load | Subtle pulse ring (1x) | 2s | ease-in-out |
| Chat open | Icon rotates to X, 180deg | 250ms | `--ease-out-expo` |

**Pulse Ring Animation (page load only, plays once after 3s delay):**
```css
@keyframes chat-fab-pulse {
  0% { box-shadow: 0 0 0 0 rgba(124, 58, 237, 0.4); }
  70% { box-shadow: 0 0 0 12px rgba(124, 58, 237, 0); }
  100% { box-shadow: 0 0 0 0 rgba(124, 58, 237, 0); }
}
/* Plays once, 3s after page load, then stops. */
/* Dark mode: use rgba(123, 51, 125, 0.4) */
```

> Pulse draws attention on first visit. Stops after one cycle — not annoying.

### Unread Badge (optional future)

If chatbot has a proactive greeting:
- Red dot, 12px, top-right of FAB
- `background: #EF4444`
- Border: 2px solid `var(--bg-primary)` (creates cutout effect)

### Mobile Adjustment

- Same position (`bottom: 24px, right: 24px`)
- Same size (56px) — already meets touch targets
- When chat is open on mobile, FAB is hidden (full-screen takes over)

---

## 2. Chat Window

### Desktop Layout

| Property | Value | Notes |
|----------|-------|-------|
| Position | `fixed` | Viewport-anchored |
| Bottom | `96px` | 24px (FAB bottom) + 56px (FAB) + 16px gap |
| Right | `24px` | Aligned with FAB |
| Width | `380px` | Optimal for conversation readability |
| Max-height | `520px` | Doesn't overwhelm the viewport |
| Min-height | `360px` | Enough for header + 2 messages + input |
| Border-radius | `--radius-lg` (16px) | Matches card system |
| z-index | 40 | Same layer as FAB |

### Window Structure (top to bottom)

```
┌─────────────────────────────────┐
│  HEADER (56px)                  │  ← Gradient accent top border
│  [Avatar] Portfolio AI   [—][X] │
├─────────────────────────────────┤
│                                 │
│  MESSAGE LIST (scrollable)      │  ← flex-grow, overflow-y: auto
│                                 │
│  [AI bubble]                    │
│              [User bubble]      │
│  [AI bubble]                    │
│                                 │
├─────────────────────────────────┤
│  INPUT BAR (56px)               │  ← Fixed at bottom
│  [input field...        ] [➤]   │
└─────────────────────────────────┘
```

### Window Styling

```
Light Mode:
  background: var(--bg-primary) (#FFFFFF)
  border: 1px solid var(--border) (#E4E4E7)
  box-shadow: var(--shadow-lg)

Dark Mode:
  background: var(--bg-secondary) (#18181B)
  border: 1px solid var(--border) (#3F3F46)
  box-shadow: var(--shadow-lg)
```

### Header (56px height)

| Element | Spec |
|---------|------|
| Top accent | 2px gradient bar: `linear-gradient(90deg, var(--gradient-start), var(--gradient-end))` |
| Background | `var(--bg-primary)` light / `var(--bg-secondary)` dark |
| Border-bottom | 1px solid `var(--border)` |
| Padding | `0 16px` (`--space-4`) |
| Layout | Flex row, `align-items: center`, `justify-content: space-between` |

**Header Left:**
- AI avatar: 32px circle, gradient background, sparkle/bot icon (16px, white)
- Title: "Portfolio AI" — `font-family: Inter`, `font-weight: 600`, `font-size: 14px`, `color: var(--text-primary)`
- Subtitle: "Ask me anything" — `font-size: 12px`, `color: var(--text-muted)`, hidden when `width < 340px`

**Header Right:**
- Minimize button: `Minus` icon, 20px, `color: var(--text-muted)`, hover → `var(--text-primary)`
- Close button: `X` icon, 20px, `color: var(--text-muted)`, hover → `var(--text-primary)`
- Both: 32px tap target, `--radius-md` on hover bg `var(--bg-tertiary)`
- Gap: 4px between buttons

### Message List Area

| Property | Value |
|----------|-------|
| Padding | `16px` (`--space-4`) |
| Gap between messages | `12px` (`--space-3`) |
| Overflow-y | `auto` (scrollable) |
| Scroll behavior | `smooth` |
| Flex | `1 1 auto` (fills available space) |

**Scrollbar styling:**
```css
/* Thin, subtle scrollbar */
scrollbar-width: thin;
scrollbar-color: var(--border) transparent;

/* Webkit */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 9999px;
}
```

**Auto-scroll:** Always scroll to bottom when new message appears. Use `scrollIntoView({ behavior: 'smooth' })`.

### Input Bar (56px height)

| Element | Spec |
|---------|------|
| Background | `var(--bg-primary)` light / `var(--bg-secondary)` dark |
| Border-top | 1px solid `var(--border)` |
| Padding | `8px 12px` |
| Layout | Flex row, gap 8px, align-items center |

**Text Input:**

| Property | Value |
|----------|-------|
| Height | `40px` |
| Flex | `1 1 auto` |
| Background | `var(--bg-tertiary)` |
| Border | none (relies on bg contrast) |
| Border-radius | `--radius-full` (pill shape) |
| Padding | `0 16px` |
| Font | Inter, 14px, `var(--text-primary)` |
| Placeholder | "Ask about my experience..." — `var(--text-muted)` |
| Focus | `outline: 2px solid var(--cta)`, `outline-offset: 1px` |

**Send Button:**

| Property | Value |
|----------|-------|
| Size | `40px x 40px` |
| Border-radius | `--radius-full` |
| Background (active) | `linear-gradient(135deg, var(--gradient-start), var(--gradient-end))` |
| Background (disabled) | `var(--bg-tertiary)` |
| Icon | `Send` from lucide-react, 18px, white (active) / `var(--text-muted)` (disabled) |
| Disabled when | Input is empty OR AI is streaming |
| Hover | `scale(1.05)` + glow, 200ms |
| Tap | `scale(0.95)`, 100ms |

**Keyboard:** `Enter` to send. `Shift+Enter` for newline (if multiline support added later).

---

## 3. Message Bubbles

### User Message (right-aligned)

| Property | Value |
|----------|-------|
| Alignment | `margin-left: auto` (right side) |
| Max-width | `75%` of message area |
| Background | `linear-gradient(135deg, var(--gradient-start), var(--gradient-end))` |
| Color | `#FFFFFF` |
| Font | Inter, 14px, line-height 1.5 |
| Padding | `10px 14px` |
| Border-radius | `16px 16px 4px 16px` | Tail: bottom-right |
| Shadow | none (gradient provides visual weight) |

### AI Message (left-aligned)

| Property | Value |
|----------|-------|
| Alignment | `margin-right: auto` (left side) |
| Max-width | `85%` of message area |
| Background (light) | `var(--bg-tertiary)` (#F4F4F5) |
| Background (dark) | `var(--bg-tertiary)` (#27272A) |
| Color | `var(--text-primary)` |
| Font | Inter, 14px, line-height 1.5 |
| Padding | `10px 14px` |
| Border-radius | `16px 16px 16px 4px` | Tail: bottom-left |
| Shadow | none |

> AI bubbles are wider (85%) because AI responses are typically longer and may contain formatted content.

### AI Message — Rich Content

AI responses may include:
- **Bold text**: `font-weight: 600`
- **Code inline**: `JetBrains Mono`, `font-size: 13px`, bg `var(--bg-secondary)` light / `var(--bg-tertiary)` dark, padding `2px 6px`, `border-radius: 4px`
- **Links**: `color: var(--cta)`, `text-decoration: underline`, hover `var(--cta-hover)`
- **Lists**: Standard `ul/ol`, left-padding 16px, bullet color `var(--text-muted)`

> Use a lightweight Markdown renderer for AI responses (e.g., `react-markdown` with minimal plugins). No heavy formatting — keep it conversational.

### Message Timestamp (optional, subtle)

- Position: Below bubble, aligned to sender side
- Font: Inter, 11px, `var(--text-muted)`
- Format: "2:34 PM" (short)
- Show on hover only (desktop), always visible (mobile)

---

## 4. Streaming Indicator

When AI is generating a response, show a typing indicator inside an AI bubble:

### Typing Dots

```
[ ● ● ● ]   ← Three dots in an AI-styled bubble
```

| Property | Value |
|----------|-------|
| Container | Same styling as AI message bubble |
| Dot size | 6px diameter |
| Dot color | `var(--text-muted)` |
| Dot gap | 4px |
| Animation | Staggered opacity pulse |
| Duration | 1.4s per cycle, infinite |

**Animation spec:**
```css
@keyframes typing-dot {
  0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
  30% { opacity: 1; transform: translateY(-3px); }
}

.typing-dot:nth-child(1) { animation-delay: 0ms; }
.typing-dot:nth-child(2) { animation-delay: 160ms; }
.typing-dot:nth-child(3) { animation-delay: 320ms; }
```

### Streaming Text

Once tokens start arriving, replace dots with actual text:
- Text appears character-by-character (natural streaming feel)
- No additional animation needed — streaming itself IS the animation
- Cursor: optional blinking `|` at end of streaming text
  - Color: `var(--cta)`
  - Blink: `opacity: 0 ↔ 1`, 800ms, `steps(1)`
  - Disappears when streaming completes

---

## 5. Chat States

### 5a. Empty State (Welcome)

Shown when chat opens with no message history:

```
┌─────────────────────────────────┐
│  HEADER                         │
├─────────────────────────────────┤
│                                 │
│         [Gradient Icon]         │  ← 48px, sparkle/message icon
│                                 │
│      "Hi! I'm Hung's AI        │  ← 16px, font-weight: 600
│       assistant."               │     color: var(--text-primary)
│                                 │
│   "Ask me about his skills,    │  ← 14px, color: var(--text-muted)
│    projects, or experience."    │     text-align: center
│                                 │
│   ┌─────────────────────┐      │
│   │ What are your skills?│      │  ← Suggested question chips
│   └─────────────────────┘      │
│   ┌─────────────────────┐      │
│   │ Tell me about your   │      │
│   │ experience           │      │
│   └─────────────────────┘      │
│   ┌─────────────────────┐      │
│   │ Show me your projects│      │
│   └─────────────────────┘      │
│                                 │
├─────────────────────────────────┤
│  INPUT BAR                      │
└─────────────────────────────────┘
```

**Suggested Question Chips:**

| Property | Value |
|----------|-------|
| Layout | Flex column, centered, gap 8px |
| Padding | `8px 16px` |
| Background (light) | `var(--bg-tertiary)` |
| Background (dark) | `var(--bg-tertiary)` |
| Border | 1px solid `var(--border)` |
| Border-radius | `--radius-full` (pill) |
| Font | Inter, 13px, `var(--text-secondary)` |
| Hover bg | `var(--cta)` at 10% opacity → `rgba(37, 99, 235, 0.1)` light / `rgba(59, 130, 246, 0.1)` dark |
| Hover text | `var(--cta)` |
| Cursor | pointer |
| Transition | background 200ms, color 200ms |

Clicking a chip sends it as a user message immediately.

### 5b. Loading State

When waiting for first token from API:
- Typing dots indicator appears (see Section 4)
- Input is disabled (send button greyed out)
- Input placeholder changes to "Thinking..." (italic)

### 5c. Error State

If API call fails:

```
┌─────────────────────────────────┐
│  [!] Oops, something went      │  ← Inline in message area
│  wrong. Please try again.      │
│                                 │
│  [Retry]                        │  ← Small button
└─────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Container | Same as AI bubble, but with error accent |
| Icon | `AlertCircle` from lucide, 16px, `#EF4444` |
| Text | Inter, 14px, `var(--text-secondary)` |
| Retry button | Text button, `var(--cta)`, `font-weight: 500`, hover underline |

> Error is shown as a special AI message — not a toast or modal. Keeps the conversation flow.

### 5d. Minimized State

When user clicks minimize (`—`):
- Chat window hides (scale-down animation)
- FAB returns to default (MessageCircle icon)
- Conversation is preserved in memory (React state)
- Re-opening shows previous messages

---

## 6. Dark / Light Mode

All colors reference CSS variables — automatic theme switching via `data-theme` attribute.

### Theme Comparison Table

| Element | Light | Dark |
|---------|-------|------|
| Window bg | `--bg-primary` (#FFF) | `--bg-secondary` (#18181B) |
| Header bg | `--bg-primary` (#FFF) | `--bg-secondary` (#18181B) |
| Message area bg | `--bg-primary` (#FFF) | `--bg-secondary` (#18181B) |
| Input bar bg | `--bg-primary` (#FFF) | `--bg-secondary` (#18181B) |
| Input field bg | `--bg-tertiary` (#F4F4F5) | `--bg-tertiary` (#27272A) |
| AI bubble bg | `--bg-tertiary` (#F4F4F5) | `--bg-tertiary` (#27272A) |
| User bubble bg | Gradient (`#7C3AED→#2563EB`) | Gradient (`#7B337D→#3B82F6`) |
| Border | `--border` (#E4E4E7) | `--border` (#3F3F46) |
| Shadow | `--shadow-lg` (light) | `--shadow-lg` (dark, deeper) |
| FAB gradient | Gradient (`#7C3AED→#2563EB`) | Gradient (`#7B337D→#3B82F6`) |
| FAB pulse | `rgba(124,58,237,0.4)` | `rgba(123,51,125,0.4)` |
| Text primary | `--text-primary` | `--text-primary` |
| Text muted | `--text-muted` | `--text-muted` |

> User bubble and FAB gradients use `var(--gradient-start)` / `var(--gradient-end)` — they adapt per theme automatically. Light mode = vibrant violet-blue, dark mode = muted warm violet with brighter blue. This matches how all other gradients behave across the site (nav underline, section separators, gradient text). DEV must use CSS vars, NOT hardcoded hex.

---

## 7. Mobile Responsive

### Breakpoint: `max-width: 768px` (Tailwind `md:`)

**Mobile chat = Full-screen overlay:**

| Property | Value |
|----------|-------|
| Position | `fixed` |
| Inset | `0` (covers entire viewport) |
| Width | `100vw` |
| Height | `100vh` (`100dvh` preferred for mobile Safari) |
| Border-radius | `0` (no rounded corners) |
| z-index | 40 |

> Full-screen chosen over bottom sheet: simpler UX, no half-open state confusion, better keyboard handling on mobile.

### Mobile Header

- Same structure as desktop, height stays 56px
- Close button (`X`) only — no minimize on mobile (full screen has no minimized state)
- Title + subtitle remain

### Mobile Message List

- Same as desktop, fills `flex: 1`
- Touch scroll (native momentum)
- Padding: `12px` (slightly less than desktop 16px)

### Mobile Input Bar

- Sticks to bottom, above keyboard when open
- Use `env(safe-area-inset-bottom)` for notched phones:
  ```css
  padding-bottom: max(8px, env(safe-area-inset-bottom));
  ```
- Input height stays 40px
- Send button stays 40px

### Mobile FAB

- Hidden when chat is open (full-screen replaces it)
- When chat is closed, FAB visible at same position
- On very small screens (`< 375px`): bottom: 16px, right: 16px

### Mobile Transitions

- Open: Slide up from bottom, 300ms, `--ease-out-expo`
- Close: Slide down, 250ms, ease-in

> Different from desktop (which uses scale). Slide feels more natural on mobile touchscreens.

---

## 8. Animations

All animations respect `prefers-reduced-motion`. Reduced = simple opacity fades only.

### Chat Window Open (Desktop)

```
Transform origin: bottom-right (where FAB is)
From: scale(0.6), opacity(0), translateY(20px)
To:   scale(1),   opacity(1), translateY(0)
Duration: 250ms
Easing: --ease-out-expo  [cubic-bezier(0.16, 1, 0.3, 1)]
```

### Chat Window Close (Desktop)

```
From: scale(1),   opacity(1), translateY(0)
To:   scale(0.6), opacity(0), translateY(20px)
Duration: 200ms
Easing: ease-in
```

### Chat Window Open (Mobile)

```
From: translateY(100%)
To:   translateY(0)
Duration: 300ms
Easing: --ease-out-expo
```

### Chat Window Close (Mobile)

```
From: translateY(0)
To:   translateY(100%)
Duration: 250ms
Easing: ease-in
```

### Message Appear

Each new message animates in:
```
From: opacity(0), translateY(8px)
To:   opacity(1), translateY(0)
Duration: 200ms
Easing: --ease-out-quad [cubic-bezier(0.25, 0.46, 0.45, 0.94)]
```

### FAB Icon Transition

When toggling between MessageCircle and X:
```
Outgoing icon: opacity 1 → 0, rotate 0 → 90deg, 150ms
Incoming icon: opacity 0 → 1, rotate -90deg → 0, 150ms
```

### Suggested Chip Click

```
scale(0.95) → scale(1), 100ms, ease-out
Then: chip fades out as message appears in conversation
```

### Reduced Motion Fallback

When `prefers-reduced-motion: reduce`:
- All transforms → `none`
- All animations → simple `opacity: 0 → 1`, 150ms
- FAB pulse → disabled
- Typing dots → static (no bounce, just opacity blink)

---

## 9. Component Inventory

| # | Component | Complexity | Notes |
|---|-----------|------------|-------|
| 1 | `ChatFAB` | Low | Fixed button with gradient, icon swap |
| 2 | `ChatWindow` | Medium | Container with header, messages, input |
| 3 | `ChatHeader` | Low | Gradient bar, title, close/minimize |
| 4 | `MessageList` | Medium | Scrollable area, auto-scroll logic |
| 5 | `MessageBubble` | Low | User vs AI variants, markdown rendering |
| 6 | `TypingIndicator` | Low | Animated dots |
| 7 | `ChatInput` | Medium | Text field + send, Enter to submit, disabled states |
| 8 | `EmptyState` | Low | Welcome + suggested chips |
| 9 | `ErrorMessage` | Low | Inline error with retry |

**Suggested file structure:**
```
components/
  chat/
    ChatFAB.tsx
    ChatWindow.tsx
    ChatHeader.tsx
    MessageList.tsx
    MessageBubble.tsx
    TypingIndicator.tsx
    ChatInput.tsx
    EmptyState.tsx
```

**Dependencies:**
- `lucide-react` (already installed) — icons: MessageCircle, X, Send, Minus, AlertCircle, Sparkles
- `framer-motion` (already installed) — animations
- `react-markdown` (NEW) — render AI markdown responses
- Custom hook: `useChatStore` or `useState` in ChatWindow for conversation state

---

## 10. Accessibility

| Requirement | Implementation |
|-------------|----------------|
| Keyboard nav | `Tab` through FAB → input → send. `Escape` closes chat. |
| Focus trap | When chat is open, focus stays within chat window |
| Focus restore | When chat closes, focus returns to FAB |
| Screen reader | FAB: `aria-label="Open chat assistant"`. Chat: `role="dialog"`, `aria-label="Chat with AI assistant"` |
| Live region | Message list: `aria-live="polite"` for new messages |
| Reduced motion | All animations have opacity-only fallback |
| Color contrast | All text meets WCAG AA (4.5:1 ratio minimum) |
| Touch targets | Minimum 44x44px for all interactive elements |

---

## 11. Interaction Flow

```
1. User lands on page
   → FAB visible (bottom-right), pulse animation plays once after 3s

2. User clicks FAB
   → Chat window opens (scale animation)
   → FAB icon transitions to X
   → Empty state shown with welcome + suggested chips
   → Focus moves to input field

3. User clicks a chip OR types a question
   → User message appears (right side, gradient bubble)
   → Typing indicator shows (AI bubble with dots)
   → Input disabled while streaming

4. AI starts streaming
   → Dots replaced by streaming text (token by token)
   → Auto-scroll follows new text
   → Blinking cursor at end of stream

5. AI finishes
   → Cursor disappears
   → Input re-enabled
   → Focus returns to input

6. User clicks X or presses Escape
   → Chat window closes (scale/slide animation)
   → FAB returns to MessageCircle icon
   → Conversation preserved in state

7. User re-opens chat
   → Previous messages shown
   → No empty state (has history)
   → Input ready
```

---

## 12. Quick Summary for DEV

**Must-have (P0):**
- FAB with gradient, icon swap, z-40
- Chat window: 380x520 desktop, full-screen mobile
- User bubbles (gradient) + AI bubbles (bg-tertiary)
- Typing dots indicator
- Streaming text display
- Empty state with welcome + 3 suggested chips
- Open/close animations (scale desktop, slide mobile)
- Dark/light mode via CSS vars
- Keyboard: Enter to send, Escape to close
- `prefers-reduced-motion` support

**Nice-to-have (P1):**
- Minimize button (desktop only)
- Message timestamps on hover
- Blinking cursor during stream
- Markdown rendering in AI responses (bold, code, links)
- Unread badge on FAB

**Out of scope (future sprint):**
- Voice input
- Message history persistence (localStorage)
- Proactive greeting bubble
- File/image sharing
- Conversation export
