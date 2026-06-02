# Research: Dashboard & UI UX Refinements

This document outlines the technical research, choices, and rationales for the UI/UX refinements.

## 1. Circular Asset Allocation Chart

### Decision
Implement a custom React component `<CircularAllocationChart>` using native SVG `<circle>` elements with `stroke-dasharray` and `stroke-dashoffset` for rendering a donut chart.

### Rationale
- **Zero Dependencies**: Keeps the production build small (no need to install heavy libraries like Recharts, Chart.js, or Chartkick).
- **Styling Control**: Directly styles SVG strokes and paths using Tailwind CSS and CSS variables, matching dark mode and glassmorphism.
- **Hydration Compatibility**: React 19 and Next.js App Router render inline SVGs on the server without hydration mismatch warnings.
- **Micro-Interactions**: Easy to add CSS transitions on hover (scaling, stroke width change) and custom Tooltips.

### Alternatives Considered
- **Recharts**: Heavy bundle size, sometimes buggy with hydration mismatch in Next.js Server Components, and complex to style outside standard CSS configurations.
- **Chart.js**: Requires importing client-side canvas APIs, requiring `use client` wrapper and extra configurations for rendering responsive charts.

---

## 2. Row-Based Transaction List Layout

### Decision
Replace the card grid in `src/app/dashboard/assets/AssetClient.tsx` with a responsive HTML `<table>` or flex list.

### Rationale
- **High Data Density**: Row layout scales better than a card grid when there are 20+ transactions/assets.
- **Easier Scanning**: Headers align names, categories, dates, and amounts vertically.
- **Responsiveness**: Hide non-essential columns (like unit price, quantity) on mobile viewports (< 640px) or collapse each row into a compact detail card.

### Alternatives Considered
- **Grid Layout**: Kept as is. Rejected because as the number of assets/transactions grows, cards occupy too much vertical and horizontal space, forcing excessive scrolling.

---

## 3. Collapsed Sidebar Menu

### Decision
Refactor `src/app/dashboard/DashboardLayoutClient.tsx` to conditionally hide text labels in collapsed mode and style links as centered icon blocks.

### Rationale
- Matches the requested desktop-collapsed menu specification (icons only).
- Avoids complex multi-component layouts by utilizing CSS utility classes to hide labels and shift flex alignment.
- Tooltips added via native `title` attribute or a lightweight overlay tooltip.

---

## 4. Delete & Logout Confirmation Modals

### Decision
Implement a reusable `<ConfirmationModal>` component in `src/components/ui/ConfirmationModal.tsx` and integrate it with:
1. Deleting assets/transactions in `AssetClient.tsx`
2. Deleting categories in the categories view
3. Signing out in `DashboardLayoutClient.tsx`

### Rationale
- Prevents accidental loss of user data or sessions.
- Keeps consistency with the glassmorphism design system.
- Direct Server Actions are only triggered *after* confirmation state is set to true.

### Alternatives Considered
- **Browser default `window.confirm()`**: Functional, but looks dated and disrupts the premium UI experience.
