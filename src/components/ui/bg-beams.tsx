import { cn } from '@/lib/utils'

interface BackgroundBeamsProps {
  className?: string
}

export function BackgroundBeams({ className }: BackgroundBeamsProps) {
  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
      <svg
        className="absolute w-full h-full"
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="beam-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0,240,255,0.15)" />
            <stop offset="100%" stopColor="rgba(0,240,255,0)" />
          </radialGradient>
        </defs>
        {[...Array(8)].map((_, i) => {
          const angle = (i / 8) * 360
          const rad = (angle * Math.PI) / 180
          const x2 = 400 + Math.cos(rad) * 600
          const y2 = 300 + Math.sin(rad) * 600
          return (
            <line
              key={i}
              x1="400"
              y1="300"
              x2={x2}
              y2={y2}
              stroke="rgba(0,240,255,0.06)"
              strokeWidth="1"
              style={{
                animation: `pulse-opacity ${2 + i * 0.3}s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          )
        })}
        <circle cx="400" cy="300" r="200" fill="url(#beam-grad)" opacity="0.3" />
      </svg>
    </div>
  )
}
