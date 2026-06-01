# UI Layout & Component Structures: Dashboard & Project UI Refactoring

**Feature**: [spec.md](file:///Users/tylerle/Documents/Me/Personal-finance/specs/003-dashboard-ui-refactor/spec.md)
**Created**: 2026-06-01

This document describes the key layout configurations, design tokens, and components affected by the UI refactoring.

---

## 1. Client-Side UI & Navigation State

No new database tables or backend entities are created. The styling relies on current entity schemas. However, we track the following structural layout components:

### Mobile Bottom Navigation
- **Responsive Visibility**: Visible only on screens `< 640px` (`max-sm` or `block sm:hidden`).
- **Structure**: Sticky bar pinned at bottom of viewport.
- **Attributes**:
  - `activeTab`: tracks the current route path (`/dashboard` vs `/dashboard/assets`) to highlight the active menu item.
  - `items`: array of `{ label: string, href: string, icon: Component }`.

---

## 2. Layout Grid Configurations

### Card Grid Wrapper
- **Class/Style**: Grid layout.
- **Target columns**: `grid-cols-[repeat(auto-fit,minmax(280px,1fr))]`
- **Spacing**: `gap-6` (24px) for spacing between cards, improving scannability.

---

## 3. Design Tokens (CSS Variables)

We extend the theme variables in `src/app/globals.css` to add support for glassmorphism overlays and blur depths:

```css
:root {
  /* Existing tokens */
  ...
  /* Extended tokens */
  --overlay-bg: rgba(255, 255, 255, 0.75);
  --glass-border: rgba(226, 232, 240, 0.8);
}

.dark {
  /* Existing tokens */
  ...
  /* Extended tokens */
  --overlay-bg: rgba(15, 23, 42, 0.65);
  --glass-border: rgba(30, 41, 59, 0.5);
}
```
