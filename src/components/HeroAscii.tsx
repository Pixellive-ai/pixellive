import { useEffect, useRef } from 'react'

/**
 * Pixellive hero — pixel-grid PIXELLIVE wordmark with characters being ejected,
 * drifting through space with physics + damping, and respawning back into their
 * slot. A decorative `@` "agent" wanders the canvas above the mark.
 *
 * Inspired by Jules' hero (the autonomous-coding-agent visual). Same vibe,
 * Pixellive brand colors and wordmark.
 */

// 5×7 bitmap font — enough for the page wordmarks we use
const FONT: Record<string, string[]> = {
  A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  B: ['11110', '10001', '10001', '11110', '10001', '10001', '11110'],
  D: ['11110', '10001', '10001', '10001', '10001', '10001', '11110'],
  E: ['1111', '1000', '1000', '1110', '1000', '1000', '1111'],
  H: ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
  I: ['111', '010', '010', '010', '010', '010', '111'],
  L: ['100', '100', '100', '100', '100', '100', '111'],
  M: ['10001', '11011', '10101', '10101', '10001', '10001', '10001'],
  N: ['10001', '11001', '10101', '10101', '10101', '10011', '10001'],
  O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  P: ['1110', '1001', '1001', '1110', '1000', '1000', '1000'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
  S: ['01110', '10001', '10000', '01110', '00001', '10001', '01110'],
  T: ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
  U: ['10001', '10001', '10001', '10001', '10001', '10001', '01110'],
  V: ['10001', '10001', '10001', '01010', '01010', '00100', '00100'],
  X: ['10001', '01010', '00100', '00100', '00100', '01010', '10001'],
  Y: ['10001', '10001', '10001', '01110', '00100', '00100', '00100'],
}
const PLACED_CHARS = ['M', 'X', 'W', '0', 'K', 'N']
const PIECE_COLORS = ['#EC1C24', '#00F0FF', '#FF61DC', '#FFB800']
const LOGO_COLOR = '#5D1015'
const ROBOT_COLOR = '#FFFBEB'
const ROBOT_CHAR = '@'

const CELL_PX_DESKTOP = 22
const CELL_PX_MOBILE = 14
const GLYPH_GAP_RATIO = 1.4

const MAX_EJECTED = 18
const EJECT_INTERVAL_MS = 1200
const INITIAL_EJECTED = 10
// Each piece wanders grid-by-grid like the robot — pick target, step toward it,
// pick new target on arrival. After STEPS_BEFORE_RETURN, snap back home.
const PIECE_FRAMES_PER_STEP = 10
const PIECE_STEPS_BEFORE_RETURN = 70
const ROBOT_FRAMES_PER_STEP = 12

type Cell = {
  ch: string
  origX: number
  origY: number
  x: number
  y: number
  targetX: number
  targetY: number
  framesUntilStep: number
  stepsRemaining: number
  color: string
  state: 'placed' | 'ejected'
}

type Props = {
  word?: string
  height?: number
  fillParent?: boolean
}

export default function HeroAscii({ word = 'PIXELLIVE', height = 380, fillParent = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const WORD = word.toUpperCase()

  useEffect(() => {
    const canvasEl = canvasRef.current
    if (!canvasEl) return
    const canvas = canvasEl
    const ctx = canvas.getContext('2d')!
    // Skip any letters we don't have in FONT — keeps it forgiving.
    const validWord = WORD.split('').filter((ch) => FONT[ch]).join('')
    if (!validWord) return
    let cells: Cell[] = []
    let robotX = 0
    let robotY = 0
    let robotTargetX = 0
    let robotTargetY = 0
    let robotStepCounter = 0
    let lastEjectTime = 0
    let rafId = 0
    let resizeObserver: ResizeObserver | null = null

    const cellSize = () => (window.innerWidth < 768 ? CELL_PX_MOBILE : CELL_PX_DESKTOP)

    function buildCells() {
      const cs = cellSize()
      const gap = cs * GLYPH_GAP_RATIO
      cells = []

      let totalW = 0
      for (const ch of validWord) totalW += FONT[ch][0].length * cs + gap
      totalW -= gap
      const totalH = 7 * cs

      const startX = (canvas.width - totalW) / 2
      const startY = (canvas.height - totalH) / 2 - 20

      let cursorX = startX
      for (const letter of validWord) {
        const glyph = FONT[letter]
        const gw = glyph[0].length
        for (let r = 0; r < 7; r++) {
          for (let c = 0; c < gw; c++) {
            if (glyph[r][c] === '1') {
              const cx = cursorX + c * cs + cs / 2
              const cy = startY + r * cs + cs / 2
              cells.push({
                ch: PLACED_CHARS[Math.floor(Math.random() * PLACED_CHARS.length)],
                origX: cx,
                origY: cy,
                x: cx,
                y: cy,
                targetX: cx,
                targetY: cy,
                framesUntilStep: 0,
                stepsRemaining: 0,
                color: LOGO_COLOR,
                state: 'placed',
              })
            }
          }
        }
        cursorX += gw * cs + gap
      }

      robotX = canvas.width / 2
      robotY = startY - 60
      robotTargetX = robotX
      robotTargetY = robotY
    }

    function ejectRandom() {
      const placed: Cell[] = []
      let ejectedCount = 0
      for (const cell of cells) {
        if (cell.state === 'placed') placed.push(cell)
        else ejectedCount++
      }
      if (placed.length === 0 || ejectedCount >= MAX_EJECTED) return
      const cell = placed[Math.floor(Math.random() * placed.length)]
      const cs = cellSize()
      // Pick a random grid-aligned target somewhere on canvas — piece will walk to it
      cell.targetX = Math.round((cs + Math.random() * (canvas.width - cs * 2)) / cs) * cs
      cell.targetY = Math.round((cs + Math.random() * (canvas.height - cs * 2)) / cs) * cs
      cell.framesUntilStep = PIECE_FRAMES_PER_STEP
      cell.stepsRemaining = PIECE_STEPS_BEFORE_RETURN
      cell.color = PIECE_COLORS[Math.floor(Math.random() * PIECE_COLORS.length)]
      cell.state = 'ejected'
    }

    function resize() {
      const parent = canvas.parentElement
      const w = parent?.clientWidth || window.innerWidth
      const h = parent?.clientHeight || 500
      canvas.width = w
      canvas.height = h
      buildCells()
      for (let i = 0; i < INITIAL_EJECTED; i++) ejectRandom()
    }

    resize()
    resizeObserver = new ResizeObserver(resize)
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement)

    function tick(now: number) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const cs = cellSize()
      const cellFont = `bold ${cs}px "SF Mono", Menlo, ui-monospace, monospace`
      ctx.font = cellFont
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      if (now - lastEjectTime > EJECT_INTERVAL_MS) {
        ejectRandom()
        lastEjectTime = now
      }

      // update + draw cells (each ejected piece wanders grid-by-grid)
      for (const cell of cells) {
        if (cell.state === 'ejected') {
          cell.framesUntilStep -= 1
          if (cell.framesUntilStep <= 0) {
            // step toward current target (8-way grid step)
            const dxp = cell.targetX - cell.x
            const dyp = cell.targetY - cell.y
            const distp = Math.hypot(dxp, dyp)
            if (distp < cs * 1.4) {
              // arrived → pick new random target
              cell.targetX = Math.round((cs + Math.random() * (canvas.width - cs * 2)) / cs) * cs
              cell.targetY = Math.round((cs + Math.random() * (canvas.height - cs * 2)) / cs) * cs
            } else {
              cell.x += Math.sign(dxp) * cs
              cell.y += Math.sign(dyp) * cs
            }
            cell.framesUntilStep = PIECE_FRAMES_PER_STEP
            cell.stepsRemaining -= 1
          }
          if (cell.stepsRemaining <= 0) {
            // lifetime over → snap back home
            cell.x = cell.origX
            cell.y = cell.origY
            cell.color = LOGO_COLOR
            cell.state = 'placed'
          }
        }
        ctx.fillStyle = cell.color
        ctx.fillText(cell.ch, cell.x, cell.y)
      }

      // robot — wanders in grid steps (one cell every few frames)
      ctx.font = `bold ${cs + 14}px "SF Mono", Menlo, ui-monospace, monospace`
      ctx.fillStyle = ROBOT_COLOR
      ctx.fillText(ROBOT_CHAR, robotX, robotY)
      robotStepCounter += 1
      if (robotStepCounter >= ROBOT_FRAMES_PER_STEP) {
        robotStepCounter = 0
        const dxr = robotTargetX - robotX
        const dyr = robotTargetY - robotY
        const dr = Math.hypot(dxr, dyr)
        if (dr < cs * 1.5) {
          // pick new random target (snapped to grid)
          robotTargetX = Math.round((canvas.width * 0.2 + Math.random() * canvas.width * 0.6) / cs) * cs
          robotTargetY = Math.round((canvas.height * 0.15 + Math.random() * canvas.height * 0.45) / cs) * cs
        } else {
          // step 1 cell toward target (8-direction)
          robotX += Math.sign(dxr) * cs
          robotY += Math.sign(dyr) * cs
        }
      }

      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId)
      resizeObserver?.disconnect()
    }
  }, [WORD])

  return (
    <canvas
      ref={canvasRef}
      aria-label="Pixellive"
      style={{ width: '100%', height: fillParent ? '100%' : `${height}px`, display: 'block' }}
    />
  )
}
