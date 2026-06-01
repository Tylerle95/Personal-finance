# Implementation Plan: Dashboard & Project UI Refactoring

**Branch**: `003-dashboard-ui-refactor` | **Date**: 2026-06-01 | **Spec**: [specs/003-dashboard-ui-refactor/spec.md](file:///Users/tylerle/Documents/Me/Personal-finance/specs/003-dashboard-ui-refactor/spec.md)

**Input**: Feature specification from `/specs/003-dashboard-ui-refactor/spec.md`

## Summary

Refactor the existing dashboard and assets UI to deliver a premium, modern user experience. The approach is mobile-first, ensuring high touch reachability on small screens while leveraging desktop space on large screens. Design updates focus on glassmorphism panels, harmonious gradient background glows, micro-interactions, responsive grid alignments, and refined mobile navigation flows.

## Technical Context

- **Language/Version**: TypeScript / React 18 / Next.js 14 (App Router)
- **Primary Dependencies**: Tailwind CSS (v4), Lucide React (for icons)
- **Storage**: N/A (Existing Supabase schema reused)
- **Testing**: Manual responsive layout checks via Chrome DevTools and Mobile Safari/Chrome simulation.
- **Target Platform**: Modern mobile and desktop browsers (iOS/Android Safari/Chrome, Chrome Desktop, Firefox, Edge).
- **Project Type**: Web Application
- **Performance Goals**: Transitions rendering at 60fps, sub-200ms route changes.
- **Constraints**: Viewport width down to 320px, touch targets >= 48px, no auto-zoom on mobile inputs.
- **Scale/Scope**: Styling and responsive behavior adjustments on existing pages: `DashboardClient.tsx` and `AssetClient.tsx`.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- All check gates passed. No custom project rules have been defined in `constitution.md` yet.
- The UI refactoring strictly adheres to modern UX guidelines (mobile-first, touch-friendly targets, no placeholder comments, fully typed).

## Project Structure

### Documentation (this feature)

```text
specs/003-dashboard-ui-refactor/
├── plan.md              # This file
├── research.md          # Technical research & layout decisions
├── data-model.md        # Responsive states & design tokens
└── quickstart.md        # Step-by-step verification flows
```

### Source Code Layout

The files involved in this UI refactoring:

```text
src/
├── app/
│   ├── globals.css      # Custom design tokens, glassmorphism layers, and blur transitions
│   └── dashboard/
│       ├── DashboardClient.tsx  # Layout layout refactoring, mobile bottom nav integration, premium cards polish
│       └── assets/
│           └── AssetClient.tsx  # Dynamic grid wrapper, mobile bottom sheet modals, and category controls polish
└── components/
    └── ui/
        ├── AssetCard.tsx        # Styled glassmorphism asset card, layout adjustments
        └── NetWorthSummary.tsx  # Visual chart/allocation enhancements
```

**Structure Decision**: Selected a single project layout structure, updating styling rules in `src/app/globals.css` and polishing target UI client components in `src/app/dashboard/` and `src/components/ui/`.

## Complexity Tracking

No violations in the constitution check; tracking is not required.
