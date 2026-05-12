import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface AuroraBackgroundProps {
  children?: ReactNode
  className?: string
}

export function AuroraBackground({ children, className }: AuroraBackgroundProps) {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 20% 40%, rgba(0,240,255,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 60% 80% at 80% 60%, rgba(123,97,255,0.10) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 60% 20%, rgba(255,97,220,0.06) 0%, transparent 50%)
          `,
          animation: 'aurora-shift 8s ease infinite',
          backgroundSize: '200% 200%',
        }}
      />
      {children}
    </div>
  )
}
