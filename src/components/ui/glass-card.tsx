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
        glow && 'hover:shadow-[0_0_32px_rgba(0,240,255,0.12)] transition-shadow duration-300',
        className
      )}
      style={style}
    >
      {children}
    </div>
  )
}
