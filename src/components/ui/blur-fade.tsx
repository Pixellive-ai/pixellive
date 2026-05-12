import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { type ReactNode } from 'react'

interface BlurFadeInProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  once?: boolean
}

export function BlurFadeIn({
  children,
  className,
  delay = 0,
  direction = 'up',
  once = true,
}: BlurFadeInProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once, margin: '-60px' })
  const reduced = useReducedMotion()

  const dirMap = {
    up: { y: 20, x: 0 },
    down: { y: -20, x: 0 },
    left: { x: 20, y: 0 },
    right: { x: -20, y: 0 },
  }

  const hidden = reduced
    ? { opacity: 0 }
    : { opacity: 0, filter: 'blur(8px)', ...dirMap[direction] }

  const visible = reduced
    ? { opacity: 1 }
    : { opacity: 1, filter: 'blur(0px)', x: 0, y: 0 }

  return (
    <motion.div
      ref={ref}
      initial={hidden}
      animate={inView ? visible : hidden}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
