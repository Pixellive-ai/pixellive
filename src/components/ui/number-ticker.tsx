import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { cn } from '@/lib/utils'

interface NumberTickerProps {
  value: number
  suffix?: string
  prefix?: string
  duration?: number
  className?: string
}

export function NumberTicker({
  value,
  suffix = '',
  prefix = '',
  duration = 2000,
  className,
}: NumberTickerProps) {
  const [current, setCurrent] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let startTime: number
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCurrent(Math.floor(eased * value))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [inView, value, duration])

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {prefix}{current.toLocaleString()}{suffix}
    </span>
  )
}
