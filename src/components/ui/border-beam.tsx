import { cn } from '@/lib/utils'

interface BorderBeamProps {
  className?: string
  size?: number
  duration?: number
  colorFrom?: string
  colorTo?: string
}

export function BorderBeam({
  className,
  size = 120,
  duration = 3,
  colorFrom = '#00F0FF',
  colorTo = '#7B61FF',
}: BorderBeamProps) {
  return (
    <div
      className={cn('pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden', className)}
      style={{ zIndex: 0 }}
    >
      <div
        className="absolute inset-0 rounded-[inherit]"
        style={{
          background: `conic-gradient(from 0deg, transparent 0%, ${colorFrom} 25%, ${colorTo} 50%, transparent 75%)`,
          animation: `spin ${duration}s linear infinite`,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          padding: '1px',
          width: `${size}%`,
          height: `${size}%`,
          left: `${(100 - size) / 2}%`,
          top: `${(100 - size) / 2}%`,
          opacity: 0,
        }}
      />
      <div
        className="absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `conic-gradient(from 0deg, transparent 0%, ${colorFrom} 20%, transparent 40%)`,
          animation: `spin ${duration}s linear infinite`,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          padding: '1px',
        }}
      />
    </div>
  )
}
