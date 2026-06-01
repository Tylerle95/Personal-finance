# Feature Specification: Dashboard & Project UI Refactoring

**Feature Branch**: `003-dashboard-ui-refactor`

**Created**: 2026-06-01

**Status**: Draft

**Input**: User description: "hiện tại mình thấy phần dashboard và cả dự án UI vẫn chưa thân thiện lắm > bạn có thể để xuất mình refactor thân thiện hơn không? https://www.skills.sh/ lên skills.sh tìm một vài skills để làm best UI cho mình nhé"

## Introduction
This specification outlines the visual and interaction refactoring of the Personal Finance application dashboard and core screens to deliver a premium, modern, and user-friendly experience (mobile-first approach). Drawing inspiration from top-tier UI design systems and skills (such as glassmorphism, responsive navigation patterns, and micro-interactions), the refactored interface will wow the user at first glance while improving usability on all devices.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Premium Visual Polish & Modern Aesthetics (Priority: P1)

Users see a stunning, cohesive financial dashboard that feels high-end, utilizing dark mode, soft gradient background glows, glassmorphism card panels, and clean modern typography.

**Why this priority**: First impressions are critical. Financial trackers must look highly professional and clean to earn the user's trust and keep them engaged.

**Independent Test**:
1. Open the application.
2. Toggle between Light and Dark mode.
3. Verify that cards have smooth hover elevations, text remains highly legible, background colors use curated harmonies (slate/indigo/violet gradients instead of flat shades), and UI borders look crisp.

**Acceptance Scenarios**:
1. **Given** the user lands on the dashboard, **When** they view the card elements, **Then** they see subtle gradients, rounded corners, soft shadows, and clean divider lines without any stark basic colors.
2. **Given** dark mode is active, **When** they toggle to light mode, **Then** all screen components adapt immediately using premium-grade light tokens (soft shadows, light glass borders) without text contrast loss.

---

### User Story 2 - Mobile-First Responsive Navigation (Priority: P2)

Users on mobile devices can navigate effortlessly using a dedicated sticky bottom navigation bar, while desktop users enjoy an elegant sidebar/topbar.

**Why this priority**: Users frequently check finance trackers on the go. Mobile navigation must be highly optimized for single-hand thumb reach.

**Independent Test**:
1. Open the app on a simulated mobile screen (width < 640px).
2. Verify that the desktop-oriented header navigation links disappear and a bottom navigation bar appears.
3. Tap the bottom navigation icons and verify they are easily clickable (minimum 48px touch area) and transition smoothly.

**Acceptance Scenarios**:
1. **Given** the viewport is mobile, **When** the dashboard page loads, **Then** the user sees a sticky bottom bar containing links to "Overview" (Tổng quan) and "Assets" (Tài sản).
2. **Given** the viewport is desktop, **When** the page loads, **Then** the bottom navigation is hidden and the sidebar/top header links are visible instead.

---

### User Story 3 - Interactive Feedback & Micro-Animations (Priority: P3)

Users receive delightful, instant feedback when interacting with dashboard actions (buttons, switches, categories) through micro-animations, ripple effects, and modal transitions.

**Why this priority**: Interactive animation increases engagement and confirms actions visually before they finish.

**Independent Test**:
1. Click the "Switch Language" or "Theme Toggle" button.
2. Click "Add Asset" to open the form modal.
3. Observe if there are smooth scales, fades, or slide transitions.

**Acceptance Scenarios**:
1. **Given** the user clicks any action button, **When** the mouse clicks or the screen is tapped, **Then** they see a localized ripple effect expand inside the button boundaries.
2. **Given** the user clicks "Add Asset", **When** the modal appears, **Then** it slides up from the bottom (on mobile) or fades in with a gentle spring animation (on desktop), rather than popping up instantly.

---

## Edge Cases

- **iOS Elastic Scrolling**: When scrolling on iOS safari, the bottom navigation bar must remain pinned and not clip into the browser wrapper.
- **Form Focus Autoom**: When focusing on input fields in mobile Safari, the viewport should not zoom in.
- **Empty States**: If a user has no assets or categories, the empty state must look engaging and direct the user to the correct action button clearly, instead of showing a blank screen.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a responsive layout that displays a sticky bottom navigation bar on mobile (width < 640px) and a desktop sidebar/header on larger viewports.
- **FR-002**: All interactive touch targets (links, tabs, action buttons) MUST have a minimum clickable area of 48px on mobile devices.
- **FR-003**: The user interface MUST implement a glassmorphism style (semi-transparent backgrounds with backdrop blur filters) for headers, modals, and overlay panels.
- **FR-004**: System MUST apply fluid background glow gradients that shift position gracefully depending on whether light or dark theme is selected.
- **FR-005**: All button clicks and touch actions MUST trigger a micro-animation (e.g. button scale down on press, ripple overlay, or hover state transitions).
- **FR-006**: Modals on mobile devices MUST open as a bottom sheet (sliding up from the bottom of the screen) for better reachability.
- **FR-007**: System MUST prevent page/input auto-zooming on mobile devices during form interaction.
- **FR-008**: System MUST display beautifully styled empty states for dashboard cards, charts, and lists that guide new users with clear next-step actions.

### Key Entities

This UI refactoring focuses on styling, components, and layout structures:
- **Navigation Layout**: Client-side state tracking active tab/route and responsive viewport state.
- **Theme Configurations**: Curated light/dark mode color tokens.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Page components transition and load within 200ms of clicking navigation links.
- **SC-002**: Layout is fully responsive, with 0% horizontal scroll overflow on mobile viewports down to 320px.
- **SC-003**: All interactive buttons conform to the >= 48px touch target guidelines, yielding 100% reachability.
- **SC-004**: System achieves a high subjective user satisfaction rating (Wow factor) through polished typography, glassmorphism, and color scheme matching.

---

## Assumptions

- No changes to underlying database schemas or API contracts (all changes are styling and component-level enhancements).
- Support for modern browsers that support CSS backdrop-filter and CSS nesting.
