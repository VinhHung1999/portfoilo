# Sprint 11: Color Palette v2 — Based on Real Portfolio Research

**Designer:** DS | **Status:** READY FOR BOSS DECISION
**Approach:** Studied actual award-winning senior dev portfolios, not theoretical palettes

---

## Research Findings

**What top senior devs actually use:**

| Developer | Role | Palette Approach | Reference |
|-----------|------|-----------------|-----------|
| Brittany Chiang | Sr. Engineer, Spotify | Dark slate + muted teal accent | brittanychiang.com |
| Dennis Snellenberg | Freelance Dev/Designer (Awwwards) | Monochrome + warm earth accent | dennissnellenberg.com |
| Bruno Simon | Creative Dev (SOTD, FWA) | Warm earth: coral + muted cream | bruno-simon.com |

**The pattern:** Monochrome foundation (not pure black — slightly tinted) + ONE muted, desaturated accent. No gradients on backgrounds. No bright saturated colors. The sophistication comes from restraint.

**What they all avoid:** Violet/blue gradients, bright golds, multiple accent colors, anything "loud."

---

## Palette D: "Slate & Teal"

**Inspired by:** Brittany Chiang (brittanychiang.com)
**Vibe:** Senior engineer who codes at a top tech company. Clean, dark, technical. The muted teal feels calm and intelligent — not playful like bright cyan, not cold like pure blue. Understated confidence.

### Light Mode

| Variable | Hex | Swatch | Usage |
|----------|-----|--------|-------|
| `--bg-primary` | `#FAFAFA` | ![](https://placehold.co/16/FAFAFA/FAFAFA) | Page background |
| `--bg-secondary` | `#F0F2F4` | ![](https://placehold.co/16/F0F2F4/F0F2F4) | Cards (cool white) |
| `--bg-tertiary` | `#E2E6EA` | ![](https://placehold.co/16/E2E6EA/E2E6EA) | Tags, inputs |
| `--bg-alternate` | `#F4F6F8` | ![](https://placehold.co/16/F4F6F8/F4F6F8) | Alternating sections |
| `--text-primary` | `#0F172A` | ![](https://placehold.co/16/0F172A/0F172A) | Headings (dark slate) |
| `--text-secondary` | `#475569` | ![](https://placehold.co/16/475569/475569) | Body text |
| `--text-muted` | `#94A3B8` | ![](https://placehold.co/16/94A3B8/94A3B8) | Captions |
| `--border` | `#E2E8F0` | ![](https://placehold.co/16/E2E8F0/E2E8F0) | Borders |
| `--cta` | `#5B8A85` | ![](https://placehold.co/16/5B8A85/5B8A85) | Muted teal accent |
| `--cta-hover` | `#4A7570` | ![](https://placehold.co/16/4A7570/4A7570) | Hover |
| `--cta-glow` | `rgba(91, 138, 133, 0.2)` | | Glow effects |
| `--gradient-start` | `#5B8A85` | | Teal |
| `--gradient-end` | `#3D6B66` | | Deeper teal |

### Dark Mode

| Variable | Hex | Swatch | Usage |
|----------|-----|--------|-------|
| `--bg-primary` | `#0F172A` | ![](https://placehold.co/16/0F172A/0F172A) | Deep slate (not pure black) |
| `--bg-secondary` | `#1E293B` | ![](https://placehold.co/16/1E293B/1E293B) | Cards |
| `--bg-tertiary` | `#334155` | ![](https://placehold.co/16/334155/334155) | Tags, inputs |
| `--bg-alternate` | `#0B1222` | ![](https://placehold.co/16/0B1222/0B1222) | Alternating sections |
| `--text-primary` | `#E2E8F0` | ![](https://placehold.co/16/E2E8F0/E2E8F0) | Headings |
| `--text-secondary` | `#94A3B8` | ![](https://placehold.co/16/94A3B8/94A3B8) | Body text |
| `--text-muted` | `#64748B` | ![](https://placehold.co/16/64748B/64748B) | Captions |
| `--border` | `#1E293B` | ![](https://placehold.co/16/1E293B/1E293B) | Borders |
| `--cta` | `#6DB5AD` | ![](https://placehold.co/16/6DB5AD/6DB5AD) | Teal (brighter for dark bg) |
| `--cta-hover` | `#85C7C0` | ![](https://placehold.co/16/85C7C0/85C7C0) | Hover |
| `--cta-glow` | `rgba(109, 181, 173, 0.2)` | | Glow effects |
| `--gradient-start` | `#6DB5AD` | | Teal |
| `--gradient-end` | `#5B8A85` | | Deeper teal |

**Shadows (light):** `rgba(15,23,42, 0.04)`, `rgba(15,23,42, 0.07)`, `rgba(15,23,42, 0.10)`
**Shadows (dark):** `rgba(0,0,0, 0.25)`, `rgba(0,0,0, 0.35)`, `rgba(0,0,0, 0.45)`

---

## Palette E: "Charcoal & Warm Stone"

**Inspired by:** Dennis Snellenberg (dennissnellenberg.com — Awwwards Honorable Mention)
**Vibe:** Design-aware senior developer. Warm, grounded, tactile. The warm stone accent (desaturated rose-brown) feels organic and human — not corporate, not childish. Like expensive concrete and natural wood.

### Light Mode

| Variable | Hex | Swatch | Usage |
|----------|-----|--------|-------|
| `--bg-primary` | `#FAFAF8` | ![](https://placehold.co/16/FAFAF8/FAFAF8) | Warm white |
| `--bg-secondary` | `#F2F0EC` | ![](https://placehold.co/16/F2F0EC/F2F0EC) | Cards (linen tint) |
| `--bg-tertiary` | `#E6E3DD` | ![](https://placehold.co/16/E6E3DD/E6E3DD) | Tags, inputs |
| `--bg-alternate` | `#F5F4F0` | ![](https://placehold.co/16/F5F4F0/F5F4F0) | Alternating sections |
| `--text-primary` | `#1A1A1A` | ![](https://placehold.co/16/1A1A1A/1A1A1A) | Headings |
| `--text-secondary` | `#4A4744` | ![](https://placehold.co/16/4A4744/4A4744) | Body (warm gray) |
| `--text-muted` | `#8A8580` | ![](https://placehold.co/16/8A8580/8A8580) | Captions |
| `--border` | `#DDD9D3` | ![](https://placehold.co/16/DDD9D3/DDD9D3) | Borders |
| `--cta` | `#9B7B6B` | ![](https://placehold.co/16/9B7B6B/9B7B6B) | Warm stone/rose-brown |
| `--cta-hover` | `#876758` | ![](https://placehold.co/16/876758/876758) | Hover |
| `--cta-glow` | `rgba(155, 123, 107, 0.2)` | | Glow effects |
| `--gradient-start` | `#9B7B6B` | | Warm stone |
| `--gradient-end` | `#7A6458` | | Deeper stone |

### Dark Mode

| Variable | Hex | Swatch | Usage |
|----------|-----|--------|-------|
| `--bg-primary` | `#121210` | ![](https://placehold.co/16/121210/121210) | Warm near-black |
| `--bg-secondary` | `#1C1B18` | ![](https://placehold.co/16/1C1B18/1C1B18) | Cards |
| `--bg-tertiary` | `#2A2825` | ![](https://placehold.co/16/2A2825/2A2825) | Tags, inputs |
| `--bg-alternate` | `#0E0E0C` | ![](https://placehold.co/16/0E0E0C/0E0E0C) | Alternating sections |
| `--text-primary` | `#EDE9E3` | ![](https://placehold.co/16/EDE9E3/EDE9E3) | Warm white |
| `--text-secondary` | `#B0AAA2` | ![](https://placehold.co/16/B0AAA2/B0AAA2) | Body text |
| `--text-muted` | `#706B65` | ![](https://placehold.co/16/706B65/706B65) | Captions |
| `--border` | `#2E2C28` | ![](https://placehold.co/16/2E2C28/2E2C28) | Borders |
| `--cta` | `#B8957F` | ![](https://placehold.co/16/B8957F/B8957F) | Warm stone (brighter) |
| `--cta-hover` | `#CCAA96` | ![](https://placehold.co/16/CCAA96/CCAA96) | Hover |
| `--cta-glow` | `rgba(184, 149, 127, 0.2)` | | Glow effects |
| `--gradient-start` | `#B8957F` | | Warm stone |
| `--gradient-end` | `#9B7B6B` | | Deeper stone |

**Shadows (light):** `rgba(26,26,26, 0.04)`, `rgba(26,26,26, 0.06)`, `rgba(26,26,26, 0.09)`
**Shadows (dark):** `rgba(0,0,0, 0.25)`, `rgba(0,0,0, 0.35)`, `rgba(0,0,0, 0.45)`

---

## Palette F: "Monochrome + Sage"

**Inspired by:** Minimal Awwwards portfolio trend (Cristina Gómez, Patrick Johnson, etc.)
**Vibe:** "I don't need color to make an impression." Almost entirely black-and-white with a single sage/muted green accent. Maximum restraint = maximum sophistication. The sage green is organic, calming, and distinctly modern — it's the accent color of 2025 luxury design.

### Light Mode

| Variable | Hex | Swatch | Usage |
|----------|-----|--------|-------|
| `--bg-primary` | `#FAFAFA` | ![](https://placehold.co/16/FAFAFA/FAFAFA) | Clean white |
| `--bg-secondary` | `#F3F3F3` | ![](https://placehold.co/16/F3F3F3/F3F3F3) | Cards (neutral) |
| `--bg-tertiary` | `#E8E8E8` | ![](https://placehold.co/16/E8E8E8/E8E8E8) | Tags, inputs |
| `--bg-alternate` | `#F6F6F6` | ![](https://placehold.co/16/F6F6F6/F6F6F6) | Alternating sections |
| `--text-primary` | `#171717` | ![](https://placehold.co/16/171717/171717) | Near-black headings |
| `--text-secondary` | `#404040` | ![](https://placehold.co/16/404040/404040) | Body text |
| `--text-muted` | `#8C8C8C` | ![](https://placehold.co/16/8C8C8C/8C8C8C) | Captions |
| `--border` | `#E5E5E5` | ![](https://placehold.co/16/E5E5E5/E5E5E5) | Borders |
| `--cta` | `#6B8F71` | ![](https://placehold.co/16/6B8F71/6B8F71) | Sage green |
| `--cta-hover` | `#5A7A5F` | ![](https://placehold.co/16/5A7A5F/5A7A5F) | Hover |
| `--cta-glow` | `rgba(107, 143, 113, 0.18)` | | Glow effects |
| `--gradient-start` | `#6B8F71` | | Sage |
| `--gradient-end` | `#4F7255` | | Deeper sage |

### Dark Mode

| Variable | Hex | Swatch | Usage |
|----------|-----|--------|-------|
| `--bg-primary` | `#111111` | ![](https://placehold.co/16/111111/111111) | Near-black |
| `--bg-secondary` | `#1A1A1A` | ![](https://placehold.co/16/1A1A1A/1A1A1A) | Cards |
| `--bg-tertiary` | `#262626` | ![](https://placehold.co/16/262626/262626) | Tags, inputs |
| `--bg-alternate` | `#0D0D0D` | ![](https://placehold.co/16/0D0D0D/0D0D0D) | Alternating sections |
| `--text-primary` | `#EDEDED` | ![](https://placehold.co/16/EDEDED/EDEDED) | White headings |
| `--text-secondary` | `#A3A3A3` | ![](https://placehold.co/16/A3A3A3/A3A3A3) | Body text |
| `--text-muted` | `#666666` | ![](https://placehold.co/16/666666/666666) | Captions |
| `--border` | `#262626` | ![](https://placehold.co/16/262626/262626) | Borders |
| `--cta` | `#88B58E` | ![](https://placehold.co/16/88B58E/88B58E) | Sage (brighter for dark bg) |
| `--cta-hover` | `#9EC8A4` | ![](https://placehold.co/16/9EC8A4/9EC8A4) | Hover |
| `--cta-glow` | `rgba(136, 181, 142, 0.18)` | | Glow effects |
| `--gradient-start` | `#88B58E` | | Sage |
| `--gradient-end` | `#6B8F71` | | Deeper sage |

**Shadows (light):** `rgba(0,0,0, 0.04)`, `rgba(0,0,0, 0.06)`, `rgba(0,0,0, 0.09)`
**Shadows (dark):** `rgba(0,0,0, 0.25)`, `rgba(0,0,0, 0.35)`, `rgba(0,0,0, 0.45)`

---

## Side-by-Side Comparison

| Aspect | D: Slate & Teal | E: Charcoal & Warm Stone | F: Monochrome & Sage |
|--------|-----------------|-------------------------|---------------------|
| **Reference** | Brittany Chiang (Spotify) | Dennis Snellenberg (Awwwards) | Minimal Awwwards trend |
| **Feeling** | Technical, focused, calm | Warm, organic, tactile | Maximally restrained, pure |
| **Temperature** | Cool | Warm | Neutral |
| **Dark mode** | Excellent (slate tints) | Excellent (warm blacks) | Excellent (pure monochrome) |
| **Light mode** | Clean, professional | Inviting, premium | Ultra-clean, sharp |
| **Accent boldness** | Subtle | Medium | Very subtle |
| **Risk of "nha que"** | Zero | Zero | Zero |
| **Best impression** | "Competent senior eng" | "Design-sensitive tech lead" | "Confident, no gimmicks" |

---

## DS Recommendation

**Palette E (Charcoal & Warm Stone)** — The warm stone accent has character without being loud. It feels human and premium, like a well-designed physical product. The warm tints on backgrounds prevent the "cold corporate" feel while staying completely mature. Dennis Snellenberg won Awwwards recognition with this exact approach.

**Runner-up: Palette D (Slate & Teal)** — If Boss prefers a cooler, more technical feel. Brittany Chiang proved this works at the highest level.

---

## Implementation Reminder

Palette swap is still a single-file change (`globals.css`). All Sprint 11 P0 effects (mesh blobs, 3D tilt, scroll timeline, progress bar) auto-adapt via CSS variables.

---

## Decision Needed

Boss picks: **D**, **E**, or **F**?

---

*Ready to finalize immediately after Boss decision.*
