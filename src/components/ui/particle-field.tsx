import { useEffect, useRef } from 'react'

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number }[] = []
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const count = reduceMotion ? 0 : 55
    const LINK = 100, LINK_SQ = LINK * LINK // compare squared distance — avoids per-frame sqrt
    const FRAME_MS = 1000 / 30 // throttle to ~30fps; ambient effect doesn't need 60

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
      })
    }

    // Pause the loop entirely when the tab is hidden or the canvas is scrolled
    // out of view — no point burning the main thread on invisible particles.
    let visible = true, onScreen = true
    const onVisibility = () => { visible = !document.hidden }
    document.addEventListener('visibilitychange', onVisibility)
    const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting }, { threshold: 0 })
    io.observe(canvas)

    let last = 0
    const draw = (t: number) => {
      animId = requestAnimationFrame(draw)
      if (!visible || !onScreen) { last = t; return }
      if (t - last < FRAME_MS) return
      last = t

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const w = canvas.width, h = canvas.height
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = w; else if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h; else if (p.y > h) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0,240,255,${p.opacity})`
        ctx.fill()
      }

      ctx.lineWidth = 0.5
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]
          const dx = p.x - q.x, dy = p.y - q.y
          const distSq = dx * dx + dy * dy
          if (distSq < LINK_SQ) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.strokeStyle = `rgba(0,240,255,${0.08 * (1 - Math.sqrt(distSq) / LINK)})`
            ctx.stroke()
          }
        }
      }
    }

    animId = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
      io.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  )
}
