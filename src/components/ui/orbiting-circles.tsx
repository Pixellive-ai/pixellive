import { type ReactNode, type CSSProperties } from 'react'
import { cn } from '@/lib/utils'

interface OrbitingCirclesProps {
  children?: ReactNode
  className?: string
  radius?: number
  duration?: number
  reverse?: boolean
  icon?: ReactNode
}

export function OrbitingCircles({
  children,
  className,
  radius = 80,
  duration = 8,
  reverse = false,
  icon,
}: OrbitingCirclesProps) {
  const style: CSSProperties = {
    ['--radius' as string]: `${radius}px`,
    animation: `${reverse ? 'orbit-reverse' : 'orbit'} ${duration}s linear infinite`,
  }

  return (
    <div className={cn('absolute flex items-center justify-center', className)} style={style}>
      <div className="flex items-center justify-center w-10 h-10 rounded-full glass-panel border border-neon/20 text-neon">
        {icon || children}
      </div>
    </div>
  )
}

export function OrbitRing({ radius, children, className }: { radius: number; children: ReactNode; className?: string }) {
  return (
    <div
      className={cn('absolute rounded-full border border-[var(--border-color)]', className)}
      style={{ width: radius * 2, height: radius * 2, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
    >
      {children}
    </div>
  )
}
