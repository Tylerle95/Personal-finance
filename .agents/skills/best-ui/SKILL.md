---
name: best-ui
description: |
  Best practices for modern premium web UI design.
  PROACTIVELY activate for: (1) building stunning glassmorphism layouts, (2) implementing responsive mobile-first navigation systems, (3) designing accessible touch targets (>= 48px), (4) creating slide-up bottom sheets for mobile modals, and (5) adding smooth micro-interactions, gradients, and custom scrollbars.
  Provides: Design tokens, CSS utility classes, React/HTML snippets, and guidelines for visual excellence.
---

# Premium Web UI Design Guidelines & Best Practices

This skill defines the design language and implementation standards for building high-end, responsive, and visually stunning web applications. It focuses on premium aesthetics, seamless mobile ergonomics, and micro-interactions.

---

## 1. Glassmorphism Design System

Glassmorphism creates a modern, clean, and premium aesthetic by utilizing transparency, blur, and border highlights.

### Tailwind CSS Configuration (v4 `@theme`)

To implement glassmorphism consistently, define standard tokens in your main CSS file:

```css
@theme {
  --color-glass-bg: rgba(255, 255, 255, 0.08);
  --color-glass-border: rgba(255, 255, 255, 0.12);
  --color-glass-card-bg: rgba(255, 255, 255, 0.05);
  
  --shadow-glass-sm: 0 4px 30px rgba(0, 0, 0, 0.03);
  --shadow-glass-md: 0 8px 32px 0 rgba(0, 0, 0, 0.08);
  --shadow-glass-lg: 0 12px 40px 0 rgba(0, 0, 0, 0.15);
}
```

### Pure CSS & HTML Example

Apply `backdrop-filter`, borders, and gradients to make elements feel premium:

```html
<!-- Premium Glassmorphism Card with Micro-Interactions -->
<div class="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-glass-md transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10 hover:shadow-glass-lg">
  <!-- Subtle inner gradient overlay -->
  <div class="absolute inset-0 -z-10 bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
  
  <h3 class="text-lg font-semibold text-white">Glassmorphic Title</h3>
  <p class="mt-2 text-sm text-gray-300/90">Premium text description styling.</p>
</div>
```

---

## 2. Ergonomic Mobile Navigation

Mobile ergonomics require key interactive elements to be within easy reach of the thumb (bottom zone) and clear separation from desktop layouts.

### Mobile Bottom Bar Pattern (React / Next.js)

```tsx
import Link from 'next/link';

export function MobileNavBar() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-black/40 backdrop-blur-md border-t border-white/10 pb-[safe-area-inset-bottom]">
      <div className="flex justify-around items-center h-16 px-4">
        <Link href="/dashboard" className="flex flex-col items-center justify-center w-12 h-12 text-white/70 active:text-white transition-colors duration-200">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-[10px] mt-0.5 font-medium">Home</span>
        </Link>
        
        {/* Additional Nav Links */}
      </div>
    </nav>
  );
}
```

### Key Rules for Mobile Nav:
- **Visibility**: Hide the desktop top header menu on screens `< 768px` (`md` breakpoint).
- **Sticky / Fixed**: Bottom nav bar must be `fixed bottom-0 inset-x-0 z-50` with high backdrop-blur (`backdrop-blur-md`).
- **Touch Target**: Tap zones must have a height/width of at least `48px` (`w-12 h-12`) to comply with accessibility standards.

---

## 3. Mobile Bottom Sheets (Slide-up Modals)

Traditional centered popup modals do not perform well on small screens. Instead, use a slide-up bottom sheet on mobile devices.

### CSS Transitions for Slide-up Sheet

```css
@utility bottom-sheet-slide-up {
  transform: translateY(100%);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@utility bottom-sheet-slide-up-active {
  transform: translateY(0);
}
```

### React Bottom Sheet Example

```tsx
import { useEffect, useState } from 'react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function BottomSheet({ isOpen, onClose, children }: BottomSheetProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) setMounted(true);
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-end justify-center transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />
      
      {/* Sheet Content */}
      <div className={`relative w-full max-w-lg bg-gray-900 border-t border-white/10 rounded-t-3xl p-6 pb-8 shadow-2xl z-10 bottom-sheet-slide-up ${isOpen ? 'bottom-sheet-slide-up-active' : ''}`}>
        {/* Notch Indicator for swiping feel */}
        <div className="mx-auto w-12 h-1.5 rounded-full bg-white/20 mb-4 cursor-pointer" onClick={onClose} />
        
        {children}
      </div>
    </div>
  );
}
```

---

## 4. Fluid Responsive Layouts (Auto-Fit Grid)

Avoid heavy dependencies on media queries (`sm:`, `md:`, `lg:`) for grid structures. Instead, use auto-fit grids which adjust organically depending on the container's width.

```css
/* Fluid grid containing responsive items */
@utility grid-auto-fit-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}
```

```html
<div class="grid-auto-fit-cards">
  <div class="bg-white/5 border border-white/10 rounded-xl p-6">Card 1</div>
  <div class="bg-white/5 border border-white/10 rounded-xl p-6">Card 2</div>
  <div class="bg-white/5 border border-white/10 rounded-xl p-6">Card 3</div>
</div>
```

---

## 5. Micro-interactions and Polish

Micro-interactions make the app feel alive and extremely premium.

### Custom Scrollbars for Dashboard Panels

Replace ugly system scrollbars with narrow, elegant scrollbars matching the color theme:

```css
@utility scrollbar-elegant {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
}

@utility scrollbar-elegant::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

@utility scrollbar-elegant::-webkit-scrollbar-track {
  background: transparent;
}

@utility scrollbar-elegant::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 9999px;
}

@utility scrollbar-elegant::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.4);
}
```

### Visual Polish Guidelines
- **Modern Fonts**: Import and prioritize high-end modern typography (e.g., `Inter`, `Outfit`, `Plus Jakarta Sans`) rather than default sans-serif.
- **Micro-animations**: Standardize page and component mounting animations:
  ```css
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @utility animate-fade-in-up {
    animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  ```
- **Inputs on Mobile**: Ensure input fields have a font-size of at least `16px` to prevent iOS devices from auto-zooming on focus.
