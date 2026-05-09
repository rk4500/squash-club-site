---
name: FLAME Squash Club (FSC) Design System
description: The visual language of elite athletic prestige.
colors:
  primary: "#f5a800"
  primary-bright: "#ffbe33"
  neutral-bg: "#05080f"
  neutral-bg-mid: "#080d17"
  neutral-bg-light: "#0c1220"
  border-subtle: "rgba(255,255,255,0.06)"
typography:
  display:
    fontFamily: "Bebas Neue, sans-serif"
    fontSize: "clamp(2rem, 8vw, 9rem)"
    fontWeight: 400
    lineHeight: "0.88"
    letterSpacing: "0.05em"
  headline:
    fontFamily: "Bebas Neue, sans-serif"
    fontSize: "2rem"
    fontWeight: 400
    lineHeight: "1.2"
    letterSpacing: "0.1em"
  body:
    fontFamily: "Barlow, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 300
    lineHeight: "1.6"
    letterSpacing: "normal"
  label:
    fontFamily: "Barlow Condensed, sans-serif"
    fontSize: "0.65rem"
    fontWeight: 500
    lineHeight: "1"
    letterSpacing: "0.25em"
rounded:
  none: "0px"
spacing:
  sm: "12px"
  md: "24px"
  lg: "40px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-bg}"
    rounded: "{rounded.none}"
    padding: "14px 28px"
  button-primary-hover:
    backgroundColor: "{colors.primary-bright}"
  card-container:
    backgroundColor: "{colors.neutral-bg-mid}"
    rounded: "{rounded.none}"
    padding: "28px"
---

# Design System: FLAME Squash Club

## 1. Overview

**Creative North Star: "The Arena of High-Contrast Tension"**

The FLAME Squash Club visual system is a high-contrast, immersive athletic design language inspired by the speed, intense focus, and physical tension of professional squash courts. The interface rejects typical light-mode layouts, flat grids, and generic pastel colors in favor of a deep, high-performance dark aesthetic featuring glowing gold highlights and tactile, analog-like scanline and grain overlays.

Every layout prioritizes geometric precision, bold capitalized headers, and a clear visual sense of prestige and competitive discipline. Spacing is rhythmic and varied, simulating the heartbeat of a live, high-octane tournament.

### Key Characteristics:
*   **Tactile Textures**: Deep background overlays (fractal grain noise and thin scanlines) to give the digital screen an analog, physical surface tension.
*   **Razor-Sharp Geometry**: Zero rounded corners (`0px` border-radius) on any primary container or CTA, representing the laser-focused accuracy of the sport.
*   **Vibrant Gold Halos**: Gold glows and borders triggered primarily by user state transitions to signify victory and elite rank.

---

## 2. Colors

The color system is highly committed, using deep, ink-like neutrals that are tinted slightly toward a cold brand hue, paired with a rich, multi-stop gold accent that represents the trophy-winning ambition of FSC.

### Primary
*   **Victory Gold** (`#f5a800` / `oklch(76% 0.18 81)`): The primary brand color. Representing prestige and first-place standing. Used for active badges, primary CTA backgrounds, and glowing text.
*   **Gold Light** (`#ffbe33` / `oklch(82% 0.19 83)`): Hover states and interactive transitions.

### Neutral
*   **Navy Dark (Deep Background)** (`#05080f` / `oklch(12% 0.015 240)`): The main canvas. Provides an intense dark environment that emphasizes active gold and white elements.
*   **Navy Mid (Surface Container)** (`#080d17` / `oklch(15% 0.018 245)`): Standard container background for cards and secondary panels.
*   **Navy Light (Active Border)** (`#0c1220` / `oklch(18% 0.02 245)`): Gridlines, structural dividers, and secondary component borders.

### Named Rules
**The Rarity of Gold Rule.** Gold is a reward. The primary `#f5a800` accent is restricted to ≤10% of any single viewport area at rest. Its visual scarcity is what preserves its psychological value as a premium achievement mark.

---

## 3. Typography

**Display Font:** Bebas Neue (with fallback `sans-serif`)
**Body Font:** Barlow (with fallback `sans-serif`)
**Label/Condensed Font:** Barlow Condensed (with fallback `sans-serif`)

### Character
The typography pairs a loud, tall, and authoritative display face (*Bebas Neue*) with an ultra-readable, highly structured geometric sans (*Barlow*), tied together by an energetic, wide-tracked micro-condensed face (*Barlow Condensed*) for status labels.

### Hierarchy
*   **Display** (`font-weight: 400`, `font-size: clamp(2.5rem, 11vw, 9.5rem)`, `line-height: 0.88`): Used exclusively for main page headings and gigantic backdrop structural indicators. Must be fully capitalized.
*   **Headline** (`font-weight: 400`, `font-size: 2rem` to `3.5rem`, `line-height: 1.2`): Section introductions and main container headings. Capitalized.
*   **Title** (`font-weight: 400`, `font-size: 1.25rem` to `1.5rem`, `line-height: 1.3`): Card headers and medium interface titles.
*   **Body** (`font-weight: 300`, `font-size: 0.875rem` (14px), `line-height: 1.6`): Description paragraphs, player bios, and general copy. Constrained to `65–75ch` maximum line length to maintain readability.
*   **Label** (`font-weight: 500`, `font-size: 0.65rem` (10.4px), `letter-spacing: 0.25em`, `text-transform: uppercase`): Ranks, categorizations, metadata, and tiny navigation elements.

---

## 4. Elevation

The system is flat-by-default, emphasizing structured gridlines rather than physical floating card shadows. Depth is conveyed through tonal layering (switching between `Navy Dark` and `Navy Mid`) and high-impact glowing states.

### Shadow Vocabulary
*   **Gold Glow** (`box-shadow: 0 0 40px rgba(245,168,0,0.2), 0 0 80px rgba(245,168,0,0.05)`): Applied to the active #1 rank or as a dynamic hovering response on cards and CTA buttons.

### Named Rules
**The Tonal Depth Rule.** Depth is structural, not literal. We do not use blurry grey drop-shadows. Depth is built entirely using thin, clean dividers (`1px solid rgba(255,255,255,0.06)`) and stepping background colors from `Navy Dark` up to `Navy Mid` for containers.

---

## 5. Components

### Buttons
*   **Shape:** Strictly sharp corners (`rounded-none`).
*   **Primary Variant:** Background `#f5a800`, text `#05080f`, `font-family: 'Barlow Condensed'`, uppercase, `letter-spacing: 0.15em`, tracking-wider.
*   **Hover Treatment:** Background transitions smoothly to `#ffbe33` with a micro-translation of `translateX(4px)` applied to any trailing SVG arrow.

### Cards / Containers
*   **Corner Style:** Sharp (`rounded-none`).
*   **Background:** `rgba(8,13,23,0.8)` with a thin border `1px solid rgba(255,255,255,0.06)`.
*   **Interaction State:** On hover, card borders transition to `rgba(245,168,0,0.35)`, rise by `translateY(-2px)`, and trigger a left-side `2px` vertical gold border slide-in (`.bar-left::before`).

### Navigation
*   **Desktop Header:** Transparent at rest with a height of `68px`. Transitions to `bg-[#05080f]/90` with `backdrop-blur-xl` and a thin `white/5` border bottom on scrolling past `60px`.
*   **Mobile Overlay:** Fully opaque `bg-[#05080f]/98` backdrop-blur navigation window.

---

## 6. Do's and Don'ts

### Do:
*   **Do** enforce absolute sharp edges (`rounded-none`) across all buttons, cards, and input boundaries.
*   **Do** restrict gold color use (`#f5a800`) to tactical visual accents, ensuring it never overwhelms body copy or structural borders.
*   **Do** use `.grain` and `.scanlines` overlays to give flat dark layouts a physical court-like texture.
*   **Do** capitalize all display headings using `Bebas Neue` for a strong athletic voice.

### Don't:
*   **Don't** use standard rounded corners (`rounded-sm`, `rounded-md`, `rounded-lg`) on active UI blocks.
*   **Don't** implement side-stripe borders larger than `2px` at rest (only use `.bar-left` as a hover transition state).
*   **Don't** use generic un-tinted neutrals (`#000` or `#fff`). Neutral elements must be tinted with slight blue hues.
*   **Don't** use modals or popups where inline content expansion or slide-in overlays can represent the workflow more cleanly.
