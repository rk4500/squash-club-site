# 📋 Product Requirements Document (PRD): FLAME Squash Club Website

## 1. Document Control & Overview
*   **Title**: FLAME Squash Club (FSC) Official Website
*   **Version**: 1.0.0
*   **Target Audience**: Developers, AI agents, Designers, Club Committee
*   **Platform**: Web (Responsive Desktop, Tablet, Mobile)
*   **Objective**: Design and build a premium, high-fidelity, high-performance website for FLAME Squash Club (FLAME University, Pune) to showcase match standings, club tournaments, executive committees, players' bios, and community activities using a decoupled, data-driven architecture.

---

## 2. Tech Stack & Infrastructure

To ensure performance and maintainability, the application must be built using the following stack:
*   **Framework**: Next.js 14 (App Router, Static/Dynamic React Server Components)
*   **Language**: TypeScript (Strict type safety, explicit interfaces)
*   **Styling**: Tailwind CSS (Utility-first configuration) + CSS custom variables & keyframe animations
*   **Icons**: Lucide React (Ultra-light SVG icons)
*   **Deployment Target**: Vercel (Optimized static hosting, serverless image optimization)
*   **Package Management**: npm

---

## 3. Brand & Design System (Aesthetic Guidelines)

The visual theme must feel **ultra-premium, modern, and athletic**, mimicking elite sports brand interfaces. It uses a custom glassy, high-performance, dark-mode design system.

### 3.1 Color Palette Tokens
| Variable Name | Hex/RGBA Code | Usage Context |
| :--- | :--- | :--- |
| `Navy Dark` / `--bg` | `#05080f` | Main deep background |
| `Navy Mid` / `--bg2` | `#080d17` | Card background, alternate section background |
| `Navy Light` / `--bg3` | `#0c1220` | Dynamic borders and dropdown headers |
| `Gold` / `--gold` | `#f5a800` | Highlights, badges, primary gradients, active ranks |
| `Gold Bright` / `--gold-bright`| `#ffbe33` | Hover states, interactive triggers |
| `Gold Dim` | `rgba(245, 168, 0, 0.15)` | Glowing backdrops, light card borders |

### 3.2 Typography Tokens (Google Fonts)
*   **Headline Font (`font-bebas`)**: *Bebas Neue* (sans-serif)
    *   *Usage*: Page titles, hero highlights, major ranks, large background text, section numbers.
*   **Sub-Header Font (`font-condensed`)**: *Barlow Condensed* (sans-serif)
    *   *Usage*: Section labels, date badges, tags, micro-labels, navigation links.
*   **Body Font (`font-barlow`)**: *Barlow* (sans-serif)
    *   *Usage*: Paragraph copy, player bios, details, instructions.

### 3.3 Custom Visual Enhancements & Keyframe Effects
To recreate the premium aesthetic exactly, the following CSS classes from [globals.css](file:///home/archer/Documents/squash_club_website/app/globals.css) must be implemented:
1.  **Analog Grain Overlay (`.grain`)**: 
    *   A fixed background pseudo-element with `feTurbulence` fractal noise SVG at `0.04` opacity.
    *   Runs an 8-second 10-frame step translation animation (`grain-shift`) to simulate organic film grain texture.
2.  **Scanlines Overlay (`.scanlines`)**: 
    *   Repeating linear gradient from transparent to `rgba(0,0,0,0.03)` spaced exactly `4px` apart to create digital monitor lines.
3.  **Gold Gradient Text (`.gold-text`)**: 
    *   Clip-path gradient: `linear-gradient(135deg, #f5a800 0%, #ffd166 60%, #f5a800 100%)`.
4.  **Borders & Hover States (`.card`, `.bar-left`)**:
    *   Cards must start with a subtle border (`rgba(255,255,255,0.06)`).
    *   On hover, cards translate `translateY(-2px)`, glow with a gold drop shadow, and trigger a `2px` left border slide-in transition (`.bar-left::before`).

---

## 4. Page-by-Page Requirements & Specifications

### 4.1 Navigation Header (`Navbar.tsx`)
*   **Desktop Layout**: 
    *   Left: Inline mini logo pointing to `/` + Brand mark "FLAME SQUASH" and "Club · Pune" subtext.
    *   Right: Link array (`Events`, `Committee`, `Ladder`, `Team`, `Gallery`, `Contact`) + Solid Gold CTA Button (`Join`).
*   **Behavior**: 
    *   Starts fully transparent. Transitions to `bg-[#05080f]/90` with `backdrop-blur-xl` and a `white/5` border bottom after `60px` scroll.
    *   Active links display an absolute bottom gold border (`h-px bg-[#f5a800]`).
*   **Mobile Layout**: 
    *   Menu toggle button (hamburger/close icon). Clicking slides in/out a full-screen vertical navigation overlay with huge `5xl` Bebas Neue navigation links.

### 4.2 Landing Page (`/` or `page.tsx`)
*   **Hero Section**:
    *   Full-height layout (`min-h-screen`) containing a subtle background grid (`hero-lines`) and central radial gold vignette.
    *   Giant backdrop structural text: "FSC" in `22vw` Bebas Neue transparent outline font.
    *   Left: Est. Year badge, official high-res logo, triple-tier header text (FLAME, SQUASH, CLUB) with timing animation offsets (`slide-up`, `delay-1` through `4`), and dual CTA triggers.
    *   Right (Desktop Only): A quad-grid stats panel showcasing critical metrics (e.g., Reach: "688K", Follower growth: "92%").
*   **Marquee Strip**:
    *   Infinite looping horizontal text strip: `FSC · FLAME SQUASH · DOMINATE · PUNE`.
    *   Pauses on hover.
*   **About Section**:
    *   Large structural outline numeral (`01`) in the background.
    *   Two-column structure outlining club philosophy and link to committee.
*   **Season Highlights Section**:
    *   A grid of interactive cards displaying recent accomplishments (e.g., NMIMS Fury Winner, AIU Pre-Quarterfinals).
*   **Ladder Teaser Section**:
    *   Left: Description of the ladder rules and a solid gold CTA button.
    *   Right: A clean, high-priority vertical podium of the Top 3 ranked players with active gold trophy icon highlighting the #1 seed.

### 4.3 Squash Ladder Page (`/ladder` or `ladder/page.tsx`)
*   **Top 3 Podium Component**:
    *   Visual representation of the podium with 1st place taller and centered, flanked by 2nd place (left) and 3rd place (right).
    *   Displays large ranking numbers, players' initials in custom gold/white monogram boxes, and full names.
*   **Rankings Table Component**:
    *   A grid with structured columns (`Rank #`, `Player Name/Year`, `Wins`, `Losses`, `Trend Icon`).
    *   Row 1 (#1 Seed) receives a distinct gold highlight layout (`bg-[#f5a800]/4` and gold bottom border).
    *   Trend Indicators: Up arrow (emerald), Down arrow (red), or Stable dash (muted white).

### 4.4 Events Page (`/events` or `events/page.tsx`)
*   **Category Splits**: 
    *   Organizes tournaments into `Intra-College`, `Inter-College`, and `Collaboration` sections.
*   **Event Card Specifications**:
    *   Displays category tag, date badge (formatted to `day month year`), tournament name, detailed description, and key achievement highlights in gold.

### 4.5 Committee Page (`/committee` or `committee/page.tsx`)
*   **Symmetric Symmetrical Grids**:
    *   **Tier 1 (Executive)**: Consolidates the 5 executives into a single unified 6-column grid (`md:grid-cols-6`). The President and VP span `md:col-span-3` (50% width), and the other three span `md:col-span-2` (33.3% width), ensuring perfect equal-width row alignment with zero gaps.
    *   **Tier 2 (Heads)**: Cards with custom category badges matching their departments (e.g., Pink for Social Media, Emerald for Data & IT).
    *   **Tier 3 (Members)**: Grouped by operational sub-committees, utilizing a balanced 6-column grid (`lg:grid-cols-6`) with 3-span and 2-span layouts to ensure perfect row alignment across all 5 sub-committees.
*   **Monograms & Cutouts**: If profile pictures are missing, fallback to custom gold monogram blocks (`Monogram`) extracting initials. Cutout photos use a letterboxed `aspect-[16/10]` ratio with full-color display and Victory Gold glow backdrops.

### 4.6 Team Page (`/team` or `team/page.tsx`)
*   **Splits**: Dedicated sections for the Men's Squad and Women's Squad inside a responsive card layout.
*   **Athletic Showcase Cards**:
    *   Features a letterboxed cutout photo container with a 3D pop hover effect completely contained inside borders (hover scales up and rises).
    *   **Infinite Scrolling Marquee**: A mathematical, double-span infinite sliding marquee that displays achievements at a constant speed calculated dynamically based on length.
    *   **2-Line Bio Constraints**: Bios are strictly calibrated to **68–70 characters** to fit on exactly **2 lines** across all screen sizes, with development console warnings to flag bios over 90 characters.

---

## 5. Dynamic Data Schemas (JSON Database Definitions)

All data must be stored under `/data/*.json` according to these strict TypeScript-compliant schemas.

### 5.1 `ladder.json`
```json
{
  "lastUpdated": "string",
  "edition": "string",
  "rankings": [
    {
      "rank": "number",
      "name": "string",
      "year": "string",
      "wins": "number",
      "losses": "number",
      "trend": "up | down | stable"
    }
  ]
}
```

### 5.2 `committee.json`
```json
{
  "executive": [
    { "name": "string", "role": "string", "photo": "string" }
  ],
  "heads": [
    { "name": "string", "role": "string", "team": "string", "photo": "string" }
  ],
  "members": [
    { "name": "string", "studentId": "string", "committee": "string" }
  ]
}
```

### 5.3 `events.json`
```json
[
  {
    "id": "number",
    "name": "string",
    "category": "Intra-College | Inter-College | Collaboration",
    "date": "string (YYYY-MM-DD)",
    "description": "string",
    "highlight": "string"
  }
]
```

### 5.4 `team.json`
```json
[
  {
    "name": "string",
    "role": "string",
    "year": "string",
    "gender": "male | female",
    "bio": "string",
    "achievements": ["string"],
    "photo": "string"
  }
]
```

---

## 6. Non-Functional & Performance Requirements
*   **Mobile-First Design**: Breakpoints are fully custom-crafted (`sm:640px`, `md:768px`, `lg:1024px`, `xl:1280px`). Hidden stats and alternate panels ensure absolute layout sanity on small screens.
*   **SEO Optimization**: Every route must utilize semantic HTML5 elements (`<header>`, `<main>`, `<section>`, `<footer>`, `<h1>`). Layout metadata defines page title, description, and club logo favicon.
*   **Loading Performance**: Image components use Next.js `next/image` with lazy loading on secondary sections and `priority` on above-the-fold hero content.

---

## 7. Future Roadmaps & Enhancements

These approved, high-impact features are slated for future development cycles:

### 🏆 7.1 Interactive Match Challenge Calculator
*   **Objective**: Allow players to see valid targets they can challenge to climb the Squash Ladder.
*   **Rules**:
    *   A player can challenge up to **2 spots above** them on the ladder.
    *   Players outside the Top 20 can challenge ranks **19 or 20** to enter the ladder.
*   **UI Specs**:
    *   A drop-down component to select current rank.
    *   A dynamic result panel listing eligible challenge targets.

### 🖼️ 7.2 Fully Dynamic Gallery & Media Viewer
*   **Objective**: Replace the photo album placeholders with a dynamic media player.
*   **Components**:
    *   Grid mapping images located in `public/gallery/` and logged in `data/gallery.json`.
    *   Lightbox component featuring zoom, full-screen expansion, and previous/next slide buttons.

### 📊 7.3 Interactive Tournament Brackets
*   **Objective**: Visualize single/double elimination brackets for marquee matches.
*   **UI Specs**:
    *   A clean node-connector system illustrating matches, player progression, and scores.

### ☁️ 7.4 Headless CMS / Google Sheets Integration
*   **Objective**: Allow non-technical club executives to update rankings and events directly from their mobile phones.
*   **Approach**: Fetch ladder standings directly from a shared Google Sheet via Next.js Server Actions on a daily ISR (Incremental Static Regeneration) revalidation interval.

---
