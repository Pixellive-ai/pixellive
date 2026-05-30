import { type ReactNode, type CSSProperties } from 'react'
import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  glow?: boolean
}

export function GlassCard({ children, className, style, glow = false }: GlassCardProps) {
  return (
    <div
      className={cn(
        'relative rounded-2xl glass-panel',
        glow && 'glass-card-glow transition-shadow duration-300',
        className
      )}
      style={style}
    >
      {children}
    </div>
  )
}
