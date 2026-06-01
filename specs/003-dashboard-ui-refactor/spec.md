# Feature Specification: Dashboard & Project UI Refactoring

**Feature Branch**: `003-dashboard-ui-refactor`

**Created**: 2026-06-01

**Status**: Draft

**Input**: User description:
1. thiết kế lại giao diện web dashboard
2. kế bên Personal Finance có icon nên replace thành icon menu
3. đưa menu vào Tổng quan và tài sản vào
4. header change language hoặc dark/light nên luôn hiển thị cho dù đi vào tài sản
5. menu nên mở đóng giống như youtube
6. khi click vào tab phải chuyển tab ngay và show loading nếu như load từ database hoặc API -> refactor UI smooth hơn.

---

## Introduction
This specification outlines the visual, navigation, and structural refactoring of the Personal Finance application dashboard. The core goal is to introduce a unified application shell layout for the dashboard (`/dashboard/*`) featuring a shared global header and a YouTube-style collapsible navigation sidebar. This sidebar will house navigation items for "Tổng quan" (Overview) and "Tài sản" (Assets). Additionally, the shared header containing the language and dark/light theme switchers must remain constantly visible across all sub-pages (Overview, Assets, etc.). The sidebar will support YouTube-style toggle states (Expanded and Collapsed) on desktop, while automatically adapting to a bottom navigation bar on mobile viewports.

Furthermore, to ensure a premium, instant feel during navigation, the application must respond immediately upon clicking any navigation link (Sidebar tabs or mobile bottom nav tabs) by highlighting the active tab instantly and showing a polished loading indicator/skeleton screen while database and API requests are resolved.

---

## Clarifications

### Session 2026-06-01
- Q: Phong cách hiệu ứng Loading (Wow Animation) → A: Option A (Glassmorphic Shimmer Skeletons)

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - YouTube-Style Sidebar & Toggle Menu (Priority: P1)

Users on desktop screens see a side navigation menu containing links to "Tổng quan" (Overview) and "Tài sản" (Assets). Next to the "Personal Finance" logo, they see a hamburger menu icon. Clicking this icon toggles the sidebar layout style exactly like YouTube:
- **Expanded (Default/Wide)**: Sidebar width is wider (~240px). Each menu item is rendered horizontally as `[Icon] [Text]`.
- **Collapsed (Mini/Narrow)**: Sidebar width is narrower (~72px). Each menu item is rendered vertically with `[Icon]` on top and a smaller `[Text]` directly below it, centered.

**Why this priority**: Navigating between core sections is the most common interaction. A clean, YouTube-style collapsible navigation maximizes usable screen space while preserving readability.

**Independent Test**:
1. Open the dashboard on a desktop screen.
2. Observe the sidebar displays in **Expanded** mode (icon next to text).
3. Click the Hamburger menu icon next to the "Personal Finance" title.
4. Verify that the sidebar collapses smoothly to **Collapsed** mode (icon on top, smaller text below, narrow sidebar width) and the main content layout expands to fill the screen.
5. Click the Hamburger menu icon again, verify it expands back to the default width.

**Acceptance Scenarios**:
1. **Given** the desktop viewport is active, **When** the page loads, **Then** the sidebar is rendered in its expanded layout (~240px width) by default.
2. **Given** the sidebar is expanded, **When** the user clicks the Hamburger icon next to the logo, **Then** the sidebar collapses to 72px width, and the menu items change layout to icon-above-text immediately with a smooth CSS transition.
3. **Given** the user navigates between "Tổng quan" and "Tài sản", **When** they click a link, **Then** the sidebar state (Expanded vs Collapsed) remains preserved across page navigations.

---

### User Story 2 - Shared Sticky Header & Layout (Priority: P2)

Users see a shared global header at the top of the viewport. This header contains the "Personal Finance" brand/logo (with the hamburger menu icon next to it) on the left, and the Actions Toolbar (Switch Language, Theme Toggle, User Profile/Email, and Sign Out button) on the right. This header **must always be visible** regardless of whether the user is on the "Tổng quan" (Overview) dashboard page or the "Tài sản" (Assets) page.

**Why this priority**: Crucial utilities like changing theme, switching language, and signing out must be accessible globally, ensuring a cohesive look and feel without UI duplication or disappearance when navigating pages.

**Independent Test**:
1. Log in and land on the dashboard `/dashboard`.
2. Verify the header is present and the theme/language switches work.
3. Click the "Tài sản" sidebar link.
4. Verify that the URL changes to `/dashboard/assets` and the asset list loads, but the top header remains identical, visible, and functional.

**Acceptance Scenarios**:
1. **Given** the user is at `/dashboard/assets`, **When** the page loads, **Then** they see the same top header with language toggle, theme toggle, and sign out options.
2. **Given** the user switches language from Vietnamese to English in the header on the Assets page, **When** they navigate back to the Overview page, **Then** the language remains English.

---

### User Story 3 - Instant Tab Transition & Loading States (Priority: P3)

When a user clicks on any tab ("Tổng quan" or "Tài sản") in the sidebar or mobile bottom nav, the application UI must respond instantly:
- The active tab state highlights immediately without waiting for server data to fetch.
- The main content area transitions to a modern, polished loading state (such as a smooth shimmer skeleton screen or high-end spinner widget) if data is being fetched from the database or API.
- The layout header and navigation sidebar must remain fully interactive and static (no flashing or jumping) during this loading transition.

**Why this priority**: Latency in database calls must not freeze the UI. Instant feedback is a cornerstone of modern, premium single-page application feel.

**Independent Test**:
1. Navigate from "Tổng quan" to "Tài sản".
2. Verify that the sidebar active indicator shifts to "Tài sản" immediately.
3. Verify that the main content page shows a modern loading spinner or skeleton loader instantly before the actual asset list is populated.
4. Verify that the header utilities (theme/language toggle) remain clickable and responsive during this loading phase.

**Acceptance Scenarios**:
1. **Given** the user triggers navigation to a page that fetches database info, **When** the network call is initiated, **Then** the active link styling changes instantly and a content loading container is shown in the workspace area.
2. **Given** the loading view is active, **When** the server data fetches successfully, **Then** the content is injected smoothly via a fade-in animation.

---

### User Story 4 - Mobile-First Responsive Navigation (Priority: P4)

On mobile devices (viewport < 640px), the sidebar navigation collapses and hides completely. Instead, a sticky bottom navigation bar appears at the bottom of the viewport containing easily clickable tabs for "Tổng quan" and "Tài sản". 

**Independent Test**:
1. Resize browser window to mobile width (< 640px).
2. Verify sidebar is hidden, bottom navigation bar appears, and touch targets are >= 48px.

---

### User Story 5 - Premium Visual Polish & Transitions (Priority: P5)

The overall dashboard and assets UI is refined. The cards utilize beautiful dark mode tokens, soft purple/blue gradient glows in the background, glassmorphism boundaries (blur filter), and smooth micro-interactions.

---

## Edge Cases

- **Fast Connections Loading State**: If the network is extremely fast (data loaded in < 50ms), the loading state must not cause a jarring "flicker" of skeleton UI. Next.js transition states handle this cleanly, but a fade-in layout is used to smooth the final print.
- **Sidebar Toggle Layout Shift**: When toggling the sidebar, the main content area must adjust its padding/margin smoothly to prevent sudden jumping of layout cards, charts, and tables.
- **Theme/Language Mismatch**: Switching the language/theme on the Assets page must not cause hydration mismatch errors or trigger a full page reload.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST implement a single parent Layout wrapper (`src/app/dashboard/layout.tsx`) that encompasses all sub-pages under `/dashboard`.
- **FR-002**: The parent Layout MUST render a shared top Header containing the brand title, language toggle, theme toggle, and sign out controls.
- **FR-003**: System MUST place a Hamburger Menu Icon directly next to the "Personal Finance" brand title in the layout.
- **FR-004**: System MUST render a left sidebar navigation on desktop viewports (width >= 640px).
- **FR-005**: Sidebar MUST support two display states: Expanded (240px) and Collapsed (72px). Clicking the Hamburger Icon toggles the state.
- **FR-006**: Sidebar MUST display menu links for "Tổng quan" (`/dashboard`) and "Tài sản" (`/dashboard/assets`).
- **FR-007**: On mobile viewports (width < 640px), the sidebar MUST be hidden, and navigation MUST be handled via a sticky bottom navigation bar.
- **FR-008**: System MUST transition to loading state instantly upon page navigation by rendering a shared Next.js loading template (`loading.tsx`) containing a premium Glassmorphic Shimmer Skeleton loader mimicking the Net Worth chart and card panels with a smooth 60fps shimmer scanning effect.
- **FR-009**: The active menu item styling MUST update instantly upon user click to indicate immediate navigation response.
- **FR-010**: The shared Header and Sidebar elements MUST remain static and fully responsive without reloading during sub-route navigation.
- **FR-011**: All interactive touch targets in the header, sidebar, and bottom navigation MUST have a minimum clickable area of 48px.
- **FR-012**: Transition animations between sidebar states MUST use CSS transition properties (width, padding) and render smoothly at 60fps.

### Key Entities

- **Dashboard Layout State**:
  - `isSidebarExpanded` (boolean): Tracks if the navigation sidebar is in expanded or collapsed mode.
- **Active Navigation Route**:
  - `activeRoute` (string): Current path to highlight active state in sidebar and bottom navigation.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Sidebar collapses and expands within 250ms with smooth CSS transitions.
- **SC-002**: Layout is fully responsive, with 0% horizontal scroll overflow on mobile and desktop viewports down to 320px.
- **SC-003**: Feedback to click navigation is immediate (active state highlights < 30ms, loading skeleton prints < 50ms).
- **SC-004**: Theme toggling and language switching take effect immediately across all routes under `/dashboard` within 100ms.

---

## Assumptions

- Next.js layout structure maintains client state during sub-route navigation.
- Next.js `loading.tsx` route files are leveraged to automate layout-level suspense transitions.
