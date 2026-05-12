import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface BentoGridProps {
  children: ReactNode
  className?: string
}

interface BentoCellProps {
  children: ReactNode
  className?: string
  colSpan?: 1 | 2 | 3
  rowSpan?: 1 | 2
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-fr',
        className
      )}
    >
      {children}
    </div>
  )
}

export function BentoCell({ children, className, colSpan = 1, rowSpan = 1 }: BentoCellProps) {
  const colClass = {
    1: 'md:col-span-1',
    2: 'md:col-span-2',
    3: 'md:col-span-3',
  }[colSpan]

  const rowClass = {
    1: 'row-span-1',
    2: 'row-span-2',
  }[rowSpan]

  return (
    <div className={cn('relative group', colClass, rowClass, className)}>
      {children}
    </div>
  )
}
