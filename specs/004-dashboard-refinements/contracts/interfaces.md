# Interface Contracts: UI Components

This document defines the properties and callback contracts for the new UI components.

## 1. `ConfirmationModal` Component

A reusable modal popup following glassmorphic styling constraints.

### React Props
```typescript
interface ConfirmationModalProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  isPending?: boolean
  onConfirm: () => void | Promise<void>
  onClose: () => void
}
```

---

## 2. `CircularAllocationChart` Component

Renders a donut-shaped chart for asset allocation percentages.

### React Props
```typescript
interface AllocationItem {
  category_id: string
  label: string
  totalValue: number
  percentage: number
  color: string
  icon: string
}

interface CircularAllocationChartProps {
  allocation: AllocationItem[]
}
```
