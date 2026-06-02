'use client'

import { AllocationItem } from '@/lib/types/assets'
import CircularAllocationChart from './CircularAllocationChart'

interface AllocationChartProps {
  allocation: AllocationItem[]
}

export default function AllocationChart({ allocation }: AllocationChartProps) {
  return <CircularAllocationChart allocation={allocation} />
}
