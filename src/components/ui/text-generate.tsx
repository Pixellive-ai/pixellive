import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface TextGenerateEffectProps {
  text: string
  className?: string
  delay?: number
}

export function TextGenerateEffect({ text, className, delay = 0 }: TextGenerateEffectProps) {
  const reduced = useReducedMotion()
  const words = text.split(' ')
  const [show, setShow] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShow(true), delay * 1000)
    return () => clearTimeout(t)
  }, [delay])

  if (reduced) {
    return <span className={className}>{text}</span>
  }

  return (
    <span className={cn('inline', className)}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={show ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: i * 0.06, ease: 'easeOut' }}
          className="inline-block mr-[0.28em]"
        >
          {word}
        </motion.span>
      ))}
    </span>
  )
}
