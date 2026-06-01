# Quickstart: Dashboard & Project UI Verification

This document outlines how to test and verify the UI refactoring features locally in your development environment.

---

## 1. Local Server Verification

Start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in.

---

## 2. Step-by-Step Verification Flows

### Test Case 1: Mobile Responsiveness & Bottom Navigation
1. Open the Developer Tools in your browser (F12 or right-click -> Inspect).
2. Click the device toggle button to simulate mobile viewports (e.g., iPhone SE/12 Pro, screen width < 640px).
3. **Verify**:
   - The desktop header navigation items disappear.
   - A sticky bottom navigation bar appears at the bottom.
   - The active tab (Overview vs Assets) is highlighted dynamically with appropriate styling.
   - All tap/touch buttons in the bottom nav are comfortable to press (touch target is at least 48px high/wide).

### Test Case 2: Glassmorphism Theme & Visual Polishing
1. Reset the viewport to desktop size (width >= 1024px).
2. Click the Theme Toggle button to switch between Light and Dark modes.
3. **Verify**:
   - The background displays a soft, non-intrusive gradient blur.
   - Cards and components have a transparent background styling with a backdrop-filter (`backdrop-blur-md`).
   - Text is highly readable in both light and dark modes (good color contrast).
   - In Dark mode, cards and headers display a deep gray-slate tint rather than flat pitch black.

### Test Case 3: Empty State Enhancements
1. Sign in with a new user account that has no assets or categories.
2. Navigate to the main `/dashboard` page and `/dashboard/assets` page.
3. **Verify**:
   - Instead of a blank canvas, you see an engaging placeholder with an illustrative icon.
   - A clear Call to Action (CTA) button (e.g., "Add Category" or "Add Asset") is prominently featured.
   - Layout spacing remains clean and aligned.

### Test Case 4: Mobile Dialog Sheets
1. Switch to a mobile viewport (< 640px).
2. Navigate to the `/dashboard/assets` screen and tap "Thêm tài sản" (Add Asset) or "Quản lý danh mục" (Manage Categories).
3. **Verify**:
   - The modal overlay slides up gracefully from the bottom as a bottom sheet.
   - Typing into fields does not trigger automatic browser viewport zooming (viewport maximum-scale config validation).
   - You can dismiss the bottom sheet by clicking the backdrop overlay or the close (X) button.
