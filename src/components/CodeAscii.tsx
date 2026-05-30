import { useEffect, useRef } from 'react'

/**
 * Code-themed background: actual lines of AI-ops-flavored "code" rendered on a canvas.
 * Some chars start "broken" (highlighted red). The `@` agent walks the grid, targeting
 * broken chars and "fixing" them (restores their normal color). Periodically random
 * chars detach as colored pieces, wander grid-by-grid, and return to their slot.
 * Same retro grid-stepping vibe as HeroAscii, but with code content.
 */

const DEFAULT_LINES = [
  'async function run() {',
  '  const queue = await agent.fetch()',
  '  for (const task of queue) {',
  '    if (task.broken) {',
  '      agent.fix(task)',
  '    }',
  '    await task.execute()',
  '  }',
  '  return report.ship()',
  '}',
  '',
  'const pipeline = build()',
  'pipeline.run()',
  'pipeline.observe(metrics)',
  '',
  'export default agent',
  '',
  '// keep humans on craft.',
  '// keep agents on ops.',
]

const CELL_W = 10
const LINE_H = 22
const LEFT_PAD = 20
const TOP_PAD = 20

const PIECE_FRAMES_PER_STEP = 9
const PIECE_STEPS_BEFORE_RETURN = 65
const ROBOT_FRAMES_PER_STEP = 9
const EJECT_INTERVAL_MS = 1400
const MAX_EJECTED = 14
const NEW_BROKEN_INTERVAL_MS = 4500
const MAX_BROKEN_CHARS = 28   // hard ceiling on total broken chars in flight
const INITIAL_BROKEN = 2      // # of words broken at start

const BROKEN_COLOR = '#EC1C24'
const FLOAT_COLORS = ['#00F0FF', '#FF61DC', '#FFB800']
const ROBOT_CHAR = 'X'  // tie the editor agent to the "X" in PIXELLIVE
const ROBOT_COLOR = '#FFFFFF'

// VS Code-like syntax palette
const SYNTAX_DEFAULT  = '#D4D4D4'   // identifiers, punctuation
const SYNTAX_KEYWORD  = '#C586C0'   // keywords (async, const, for…)
const SYNTAX_STRING   = '#CE9178'   // string literals
const SYNTAX_NUMBER   = '#B5CEA8'   // numbers
const SYNTAX_FUNCTION = '#DCDCAA'   // function names (ident immediately before "(")
const SYNTAX_PROPERTY = '#9CDCFE'   // property names / props after "."
const SYNTAX_COMMENT  = '#6A9955'   // // comments

const KEYWORDS = new Set([
  'async','await','function','const','let','var','for','of','in','if','else',
  'return','export','import','default','true','false','null','undefined','new',
  'this','class','typeof','instanceof','throw','try','catch','finally','break','continue',
])

/** Per-character color for one line, based on basic JS-ish tokenization. */
function syntaxColors(line: string): string[] {
  const out: string[] = new Array(line.length).fill(SYNTAX_DEFAULT)
  let i = 0
  while (i < line.length) {
    const ch = line[i]
    // Line comment
    if (ch === '/' && line[i + 1] === '/') {
      for (let j = i; j < line.length; j++) out[j] = SYNTAX_COMMENT
      break
    }
    // String
    if (ch === '"' || ch === "'" || ch === '`') {
      const quote = ch
      out[i] = SYNTAX_STRING; i++
      while (i < line.length && line[i] !== quote) { out[i] = SYNTAX_STRING; i++ }
      if (i < line.length) { out[i] = SYNTAX_STRING; i++ }
      continue
    }
    // Number
    if (/\d/.test(ch)) {
      while (i < line.length && /[\d.]/.test(line[i])) { out[i] = SYNTAX_NUMBER; i++ }
      continue
    }
    // Identifier
    if (/[a-zA-Z_$]/.test(ch)) {
      const start = i
      while (i < line.length && /[\w$]/.test(line[i])) i++
      const word = line.slice(start, i)
      let color = SYNTAX_DEFAULT
      if (KEYWORDS.has(word)) color = SYNTAX_KEYWORD
      else if (line[i] === '(') color = SYNTAX_FUNCTION
      else if (start > 0 && line[start - 1] === '.') color = SYNTAX_PROPERTY
      for (let j = start; j < i; j++) out[j] = color
      continue
    }
    // Punctuation / whitespace → default
    i++
  }
  return out
}

type Cell = {
  originalCh: string  // the canonical character from the code
  ch: string          // currently displayed character
  origX: number
  origY: number
  x: number
  y: number
  targetX: number
  targetY: number
  framesUntilStep: number
  stepsRemaining: number
  color: string
  originalColor: string  // syntax-highlighted color this cell settles to in normal state
  state: 'placed' | 'ejected' | 'broken' | 'erased' | 'flash'
  flashFrames: number
  freshFrames: number  // when > 0, cell was recently rewritten by @ — render at 80% then fade
  wordId: number      // group cells in the same broken word (0 = not part of a broken word)
}

const FRESH_HOLD_FRAMES = 300   // 5s @ 60fps — hold at 80% opacity
const FRESH_FADE_FRAMES = 60    // 1s linear fade from 80% → 30%

type Props = {
  lines?: string[]
  fillParent?: boolean
  height?: number
}

export default function CodeAscii({ lines = DEFAULT_LINES, fillParent = false, height = 400 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvasEl = canvasRef.current
    if (!canvasEl) return
    const canvas = canvasEl
    const ctx = canvas.getContext('2d')!
    let cells: Cell[] = []
    let robotX = 0
    let robotY = 0
    let robotTargetX = 0
    let robotTargetY = 0
    let robotStepCounter = 0
    let lastEjectTime = 0
    let lastBreakTime = 0
    let nextWordId = 1
    let resizeObserver: ResizeObserver | null = null
    let rafId = 0

    function buildCells() {
      cells = []
      const totalLines = Math.max(lines.length, Math.ceil((canvas.height - TOP_PAD) / LINE_H))
      for (let row = 0; row < totalLines; row++) {
        const line = lines[row % lines.length]
        const lineColors = syntaxColors(line)
        for (let col = 0; col < line.length; col++) {
          const ch = line[col]
          if (ch === ' ') continue
          const x = LEFT_PAD + col * CELL_W
          const y = TOP_PAD + row * LINE_H + LINE_H / 2
          const tokenColor = lineColors[col]
          cells.push({
            originalCh: ch,
            ch,
            origX: x,
            origY: y,
            x,
            y,
            targetX: x,
            targetY: y,
            framesUntilStep: 0,
            stepsRemaining: 0,
            color: tokenColor,
            originalColor: tokenColor,
            state: 'placed',
            flashFrames: 0,
            freshFrames: 0,
            wordId: 0,
          })
        }
      }
      // Mark a few initial broken cells
      for (let i = 0; i < INITIAL_BROKEN; i++) markBroken()
      robotX = LEFT_PAD
      robotY = TOP_PAD + LINE_H / 2
      robotTargetX = robotX
      robotTargetY = robotY
    }

    function markBroken() {
      const placed: Cell[] = []
      let brokenCount = 0
      for (const c of cells) {
        if (c.state === 'placed') placed.push(c)
        else if (c.state === 'broken') brokenCount++
      }
      if (brokenCount >= MAX_BROKEN_CHARS || placed.length === 0) return

      // Pick a random placed cell as seed, then expand to the whole word it belongs to
      const seedCell = placed[Math.floor(Math.random() * placed.length)]
      const seedIdx = cells.indexOf(seedCell)

      // Walk backward while the previous cell is in the same row + adjacent column + still placed
      let startIdx = seedIdx
      while (startIdx > 0) {
        const curr = cells[startIdx]
        const prev = cells[startIdx - 1]
        if (prev.origY !== curr.origY) break
        if (curr.origX - prev.origX > CELL_W + 1) break  // gap (space)
        if (prev.state !== 'placed') break
        startIdx--
      }
      // Walk forward similarly
      let endIdx = seedIdx
      while (endIdx < cells.length - 1) {
        const curr = cells[endIdx]
        const next = cells[endIdx + 1]
        if (next.origY !== curr.origY) break
        if (next.origX - curr.origX > CELL_W + 1) break
        if (next.state !== 'placed') break
        endIdx++
      }

      // Break the entire word, tagged with a fresh wordId so we can track deletion completion
      const wordId = nextWordId++
      for (let i = startIdx; i <= endIdx; i++) {
        cells[i].state = 'broken'
        cells[i].color = BROKEN_COLOR
        cells[i].ch = 'i'  // Pixellive red "i" — ties broken-code visual to the brand mark
        cells[i].wordId = wordId
      }
    }

    function ejectRandom() {
      const placed: Cell[] = []
      let ejectedCount = 0
      for (const c of cells) {
        if (c.state === 'placed') placed.push(c)
        else if (c.state === 'ejected') ejectedCount++
      }
      if (placed.length === 0 || ejectedCount >= MAX_EJECTED) return
      const cell = placed[Math.floor(Math.random() * placed.length)]
      cell.targetX = Math.round((Math.random() * (canvas.width - 40)) / CELL_W) * CELL_W + LEFT_PAD
      cell.targetY = Math.round((Math.random() * (canvas.height - 40)) / LINE_H) * LINE_H + TOP_PAD
      cell.framesUntilStep = PIECE_FRAMES_PER_STEP
      cell.stepsRemaining = PIECE_STEPS_BEFORE_RETURN
      cell.color = FLOAT_COLORS[Math.floor(Math.random() * FLOAT_COLORS.length)]
      cell.state = 'ejected'
    }

    function resize() {
      const parent = canvas.parentElement
      const w = parent?.clientWidth || window.innerWidth
      const h = parent?.clientHeight || height
      canvas.width = w
      canvas.height = h
      buildCells()
    }

    resize()
    resizeObserver = new ResizeObserver(resize)
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement)

    function tick(now: number) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.font = `bold 13px "SF Mono", Menlo, ui-monospace, monospace`
      ctx.textAlign = 'left'
      ctx.textBaseline = 'middle'

      if (now - lastEjectTime > EJECT_INTERVAL_MS) {
        ejectRandom()
        lastEjectTime = now
      }
      if (now - lastBreakTime > NEW_BROKEN_INTERVAL_MS) {
        markBroken()
        lastBreakTime = now
      }

      for (const cell of cells) {
        if (cell.state === 'flash') {
          cell.flashFrames -= 1
          if (cell.flashFrames <= 0) {
            cell.state = 'placed'
            cell.color = cell.originalColor
            // Mark as recently written — stay bright then fade
            cell.freshFrames = FRESH_HOLD_FRAMES + FRESH_FADE_FRAMES
          }
        }
        if (cell.state === 'placed' && cell.freshFrames > 0) cell.freshFrames -= 1
        if (cell.state === 'ejected') {
          cell.framesUntilStep -= 1
          if (cell.framesUntilStep <= 0) {
            const dxp = cell.targetX - cell.x
            const dyp = cell.targetY - cell.y
            const dp = Math.hypot(dxp, dyp)
            if (dp < CELL_W * 2) {
              cell.targetX = Math.round((Math.random() * (canvas.width - 40)) / CELL_W) * CELL_W + LEFT_PAD
              cell.targetY = Math.round((Math.random() * (canvas.height - 40)) / LINE_H) * LINE_H + TOP_PAD
            } else {
              cell.x += Math.sign(dxp) * CELL_W
              cell.y += Math.sign(dyp) * LINE_H
            }
            cell.framesUntilStep = PIECE_FRAMES_PER_STEP
            cell.stepsRemaining -= 1
          }
          if (cell.stepsRemaining <= 0) {
            cell.x = cell.origX
            cell.y = cell.origY
            cell.color = cell.originalColor
            cell.state = 'placed'
          }
        }
        // Per-state opacity so the broken '?' chars POP while normal code stays muted
        let alpha = 0.15                         // default placed code: dim
        if (cell.state === 'broken') alpha = 0.8 // broken '?' chars: prominent
        else if (cell.state === 'flash') alpha = 1.0
        else if (cell.state === 'ejected') alpha = 0.7
        else if (cell.state === 'erased') continue   // invisible — don't draw
        else if (cell.state === 'placed' && cell.freshFrames > 0) {
          // Recently rewritten by @: hold at 0.8 for FRESH_HOLD_FRAMES, then linear fade to 0.3
          if (cell.freshFrames > FRESH_FADE_FRAMES) alpha = 0.8
          else alpha = 0.15 + 0.65 * (cell.freshFrames / FRESH_FADE_FRAMES)
        }
        ctx.globalAlpha = alpha
        ctx.fillStyle = cell.color
        ctx.fillText(cell.ch, cell.x, cell.y)
      }
      ctx.globalAlpha = 1

      // robot — prefer broken targets; fix on arrival; otherwise wander
      ctx.font = `bold 16px "SF Mono", Menlo, ui-monospace, monospace`
      ctx.globalAlpha = 1
      // Theme-aware: white in dark mode, black in light mode (so X stays readable on either bg)
      const isDark = document.documentElement.classList.contains('dark')
      ctx.fillStyle = isDark ? '#FFFFFF' : '#000000'
      ctx.fillText(ROBOT_CHAR, robotX, robotY)

      robotStepCounter += 1
      if (robotStepCounter >= ROBOT_FRAMES_PER_STEP) {
        robotStepCounter = 0

        // Two-phase, directional repair:
        //   1) If any word is fully erased (no 'broken' chars remaining), REWRITE it
        //      starting from its LEFTMOST cell → walks left-to-right.
        //   2) Else, DELETE the nearest broken word starting from its RIGHTMOST cell
        //      → walks right-to-left.
        const brokenByWord = new Map<number, Cell[]>()
        const erasedByWord = new Map<number, Cell[]>()
        for (const c of cells) {
          if (c.state === 'broken' && c.wordId !== 0) {
            const arr = brokenByWord.get(c.wordId) ?? []
            arr.push(c); brokenByWord.set(c.wordId, arr)
          } else if (c.state === 'erased' && c.wordId !== 0) {
            const arr = erasedByWord.get(c.wordId) ?? []
            arr.push(c); erasedByWord.set(c.wordId, arr)
          }
        }

        let target: Cell | null = null
        let targetPhase: 'delete' | 'rewrite' | null = null
        let minDist = Infinity

        // Phase 1: pick a word ready for rewrite, target its LEFTMOST erased cell
        for (const [wid, ws] of erasedByWord) {
          if (brokenByWord.has(wid)) continue   // still has '?' to delete first
          const leftmost = ws.reduce((a, b) => (a.x <= b.x ? a : b))
          const d = Math.hypot(leftmost.x - robotX, leftmost.y - robotY)
          if (d < minDist) { minDist = d; target = leftmost; targetPhase = 'rewrite' }
        }
        // Phase 2: if no rewrite target, pick a broken word, target its RIGHTMOST '?' cell
        if (!target) {
          for (const [, ws] of brokenByWord) {
            const rightmost = ws.reduce((a, b) => (a.x >= b.x ? a : b))
            const d = Math.hypot(rightmost.x - robotX, rightmost.y - robotY)
            if (d < minDist) { minDist = d; target = rightmost; targetPhase = 'delete' }
          }
        }

        if (target) {
          robotTargetX = target.x
          robotTargetY = target.y
          if (minDist < CELL_W * 2) {
            if (targetPhase === 'delete') {
              target.ch = ' '
              target.state = 'erased'
            } else {
              target.ch = target.originalCh
              target.state = 'flash'
              target.color = '#FFFFFF'
              target.flashFrames = 14
              target.wordId = 0
            }
          }
        }

        const dxr = robotTargetX - robotX
        const dyr = robotTargetY - robotY
        const dr = Math.hypot(dxr, dyr)
        if (dr < CELL_W) {
          // wander to a new random spot
          robotTargetX = Math.round((Math.random() * (canvas.width - 40)) / CELL_W) * CELL_W + LEFT_PAD
          robotTargetY = Math.round((Math.random() * (canvas.height - 40)) / LINE_H) * LINE_H + TOP_PAD
        } else {
          robotX += Math.sign(dxr) * CELL_W
          robotY += Math.sign(dyr) * LINE_H
        }
      }

      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId)
      resizeObserver?.disconnect()
    }
  }, [lines])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: fillParent ? '100%' : `${height}px`, display: 'block' }}
    />
  )
}
