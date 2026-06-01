# Research and Decisions: Dashboard & Project UI Refactoring

**Feature**: [spec.md](file:///Users/tylerle/Documents/Me/Personal-finance/specs/003-dashboard-ui-refactor/spec.md)
**Created**: 2026-06-01

This document outlines the technical research, chosen solutions, and rationales for the visual and interactive refactoring of the Personal Finance dashboard and asset views.

---

## 1. Responsive Navigation Pattern

- **Decision**: Pinned bottom navigation bar on mobile (viewport `< 640px`), top header/navigation for desktop (viewport `>= 640px`).
- **Rationale**: Mobile users use the app with one hand (usually thumb). Pinned bottom bars place critical navigation items (Overview, Assets) within the primary thumb zone, enhancing mobile reachability. Desktop screens have ample width, making top navigation or sidebars more natural.
- **Alternatives Considered**: 
  - *Collapsible Hamburger Menu (Mobile)*: Rejected because it requires two taps to switch screens and hides navigation options behind a closed menu.
  - *Sidebar on all screens*: Desktop sidebar is great, but taking up screen space on mobile is not viable.

---

## 2. Grid Layout & Card Distribution

- **Decision**: Tailwind CSS Grid layout using `grid-cols-[repeat(auto-fit,minmax(280px,1fr))]` with a container container-query `@container` structure.
- **Rationale**: Using `auto-fit` with `minmax` allows cards to scale cleanly and wrap automatically without needing nested responsive media queries (e.g. `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`). Incorporating container queries ensures that cards wrap and style themselves relative to their parent container size, making the layout extremely robust when embedded inside various layout components.
- **Alternatives Considered**:
  - *Flexbox wrapping*: Harder to maintain equal height/width grids without extra calculations.
  - *Media-query-only grid*: Responsive layout is rigid and breaks if the card is placed in a smaller sidebar wrapper.

---

## 3. Glassmorphism & Visual Polish

- **Decision**: Apply backdrop-filter blurs (`backdrop-blur-md`) combined with translucent background overlays (`bg-background/80` or `bg-slate-900/60` in dark mode) for floating headers and overlay panels.
- **Rationale**: Glassmorphism adds depth and a premium look. Floating elements sit on top of content layers smoothly, creating a modern, professional financial feel.
- **Alternatives Considered**:
  - *Flat Solid Color Backgrounds*: Rejected because they look basic and cheap, failing the "Wow factor" requirement.

---

## 4. Mobile Modal Presentation

- **Decision**: Mobile-first bottom drawer sheet (slides up from the bottom of viewport) on screens `< 640px`.
- **Rationale**: Pushing standard centered modals onto small mobile screens forces users to reach to the top-right to close, which is ergonomically poor. A bottom sheet is easy to swipe/tap close and keeps inputs near the virtual keyboard.
- **Alternatives Considered**:
  - *Centered Popups (Desktop Modal) on Mobile*: Hard to reach, awkward keyboard integration.
