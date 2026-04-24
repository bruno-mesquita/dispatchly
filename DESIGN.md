# DESIGN.md - Dispatchly Landing Pages & Shared UI

This document serves as the single source of truth for the Dispatchly landing page design system, including themes, typography, spatial layout, and shared React components. All UI development for landing pages must adhere to these guidelines to ensure consistency.

## 1. Theme & Design Tokens

Core theme colors and Shadcn UI variables are managed in `packages/ui/src/styles/globals.css` using OKLCH color space. Refer to that file for the source of truth on the color palette.

## 2. Typography

*   **Primary Sans-Serif:** `Geist` (fallback: `ui-sans-serif`, `system-ui`, `sans-serif`).
    *   *Usage:* Body copy, headings, buttons, general UI.
*   **Serif:** `Instrument Serif` (fallback: `Georgia`, `serif`).
    *   *Usage:* Editorial touches, specific italicized words within large headings (e.g., in Variation 2).
*   **Monospace:** `JetBrains Mono` (fallback: `ui-monospace`, `monospace`).
    *   *Usage:* Code blocks, overlines/kickers, metadata, specific numeric readouts.

## 3. Global CSS & Utilities
...
### CSS Reset & Basics

```css
*, *::before, *::after { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body {
  font-family: 'Geist', ui-sans-serif, system-ui, -apple-system, sans-serif;
  background: #f2f0ec;
  color: #0a0a0a;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
::selection { background: #0E0E0C; color: #FAFAF7; }
```

### Animations

*   **`dpl-ping`**: Used for live status dots (e.g., the `PulseDot` component).
    ```css
    @keyframes dpl-ping {
      0% { transform: scale(0.8); opacity: 0.6; }
      80%, 100% { transform: scale(2.4); opacity: 0; }
    }
    ```
*   **`dpl-fadein`**: Used for incoming log stream rows.
    ```css
    @keyframes dpl-fadein {
      from { opacity: 0; transform: translateY(3px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    ```

## 4. Shared React Components (`shared-bits.jsx`)

These components are designed to be reused across all landing page variations.

### Brand & Layout

*   **`DLogo` / `DWordmark`**: Renders the Dispatchly SVG logo and optional wordmark.
*   **`NavBar`**: Standard top navigation bar (Product, Docs, Pricing, Changelog, Customers, Sign In, CTA).
*   **`Footer`**: Standard footer with grid layout for links (Product, Developers, Company, Resources) and copyright info.
*   **`Kicker`**: A small overline component used above section headings. Features a monospace number, a small horizontal line, and a label.

### Data Display & Metrics

*   **`Count` (and `useCount` hook)**: Animates a number counting up to a target value. Useful for stats. Supports formatting, decimals, prefixes, and suffixes.
*   **`StatCard`**: A styled card displaying a label, a large value (often using `Count`), an optional delta (positive/negative percentage), and an optional sparkline.
*   **`Sparkline`**: A minimalist SVG line chart for tight spaces (like inside a `StatCard`).
*   **`AreaChart`**: A larger SVG chart with a gradient fill, used for larger data visualizations (e.g., dispatches over 7 days).

### Technical & Observability UI

*   **`PulseDot`**: A small colored circle with an animated pulsing ring behind it to indicate "live" or "operational" status.
*   **`CodeBlock`**: A syntax-highlighted code snippet renderer. Features optional line numbers, a file name or tab bar for switching languages, and custom lightweight tokenization.
*   **`LogStream`**: A scrolling, animated list of simulated log events (delivered, opened, clicked, bounced). Uses `dpl-fadein`.

### Journey Visualization

These components are used to draw the node-based journey workflows (e.g., in Variation 2).

*   **`JourneyNode`**: Represents a step in a journey (trigger, email, wait, branch, sms, push). Features specific icons per type, title, subtitle, and optional highlighting.
*   **`JourneyConnector`**: The visual link between `JourneyNode`s. Can be horizontal or vertical, and optionally displays a label (e.g., "wait 24h", "yes").

## 5. Architectural Approach

The landing pages are currently structured as three distinct variations, demonstrating different stylistic directions while utilizing the shared design system.

*   **Variation 1: Grid Atlas (`v1-grid-atlas.jsx`)**: Ultra-minimal, technical. Uses a background grid, large monospace typography in technical areas, and emphasizes code and live logs directly in the hero.
*   **Variation 2: Journey Canvas (`v2-journey-canvas.jsx`)**: Editorial, spacious. The hero is dominated by a visual representation of a message journey using `JourneyNode` and `JourneyConnector` components. Uses the `Instrument Serif` font for italicized emphasis within large headings.
*   **Variation 3: Console / Ops (`v3-console.jsx`)**: Dense, dashboard-like. The hero section presents a preview of the actual application interface, showcasing observability, global delivery maps, and dense metric grids.

When building new sections or refining existing ones, prioritize reusing the defined CSS variables and shared React components to maintain this cohesive design language.
