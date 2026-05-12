import { useRef, type ReactNode } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'

interface AnimatedBeamProps {
  className?: string
}

export function AnimatedBeam({ className }: AnimatedBeamProps) {
  return (
    <div className={cn('relative flex items-center', className)}>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-neon/40 to-neon/20 relative overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-transparent via-neon to-transparent"
          animate={{ x: ['-100%', '400%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
        />
      </div>
    </div>
  )
}

interface StaggerChildrenProps {
  children: ReactNode
  className?: string
  staggerDelay?: number
}

export function StaggerChildren({ children, className, staggerDelay = 0.1 }: StaggerChildrenProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: staggerDelay } },
      }}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16, filter: 'blur(6px)' },
        visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.4, ease: 'easeOut' } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
