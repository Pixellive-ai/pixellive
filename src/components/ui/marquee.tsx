import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface MarqueeProps {
  children: ReactNode
  reverse?: boolean
  className?: string
  pauseOnHover?: boolean
  speed?: 'slow' | 'normal' | 'fast'
}

export function Marquee({
  children,
  reverse = false,
  className,
  pauseOnHover = true,
  speed = 'normal',
}: MarqueeProps) {
  const duration = { slow: '50s', normal: '30s', fast: '15s' }[speed]

  return (
    <div className={cn('flex overflow-hidden select-none', className)}>
      <div
        className={cn('flex min-w-full shrink-0 gap-6 items-center', pauseOnHover && 'group-hover:[animation-play-state:paused]')}
        style={{
          animation: `${reverse ? 'marquee-reverse' : 'marquee'} ${duration} linear infinite`,
        }}
        aria-hidden
      >
        {children}
      </div>
      <div
        className={cn('flex min-w-full shrink-0 gap-6 items-center', pauseOnHover && 'group-hover:[animation-play-state:paused]')}
        style={{
          animation: `${reverse ? 'marquee-reverse' : 'marquee'} ${duration} linear infinite`,
        }}
        aria-hidden
      >
        {children}
      </div>
    </div>
  )
}
