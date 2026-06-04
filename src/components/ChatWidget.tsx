import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { MessageCircle, X, Send, ArrowRight } from 'lucide-react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

type Role = 'user' | 'assistant'

interface ChatMessage {
  role: Role
  content: string
}

const GREETING: ChatMessage = {
  role: 'assistant',
  content: "Hey, I'm Pixel, your AI assistant. Which service are you interested in?",
}

// The discovery agent emits this on its own last line when it has understood
// the visitor's need. We strip it from the visible reply and surface the
// "continue on the form" handoff instead.
const HANDOFF_MARKER = '[[HANDOFF]]'

// Finds an email anywhere inside a chat message — we never ASK for it in chat,
// but if the visitor volunteers one we carry it over to prefill the form.
const EMAIL_FIND = /[^\s@]+@[^\s@]+\.[^\s@]+/

// Fallback handoff trigger: if the model never emits the marker but the visitor
// clearly signals intent, we still offer the form. We don't knock on doors —
// they have to say something like this first.
const INTEREST_RE =
  /\b(pric(e|ing)|cost|quote|budget|hire|work with|get started|sign ?up|onboard|interested|reach out|follow up|contact|how do (we|i) start|can you (build|help|do)|need (a|some|help)|looking for)\b/i

function signalsInterest(messages: ChatMessage[]): boolean {
  return messages.some(m => m.role === 'user' && INTEREST_RE.test(m.content))
}

function stripHandoff(text: string): { clean: string; handoff: boolean } {
  if (!text.includes(HANDOFF_MARKER)) return { clean: text, handoff: false }
  const clean = text.split(HANDOFF_MARKER).join('').trim()
  return { clean, handoff: true }
}

function findEmail(messages: ChatMessage[]): string {
  for (const m of messages) {
    if (m.role !== 'user') continue
    const hit = m.content.match(EMAIL_FIND)?.[0]
    if (hit) return hit.trim().toLowerCase()
  }
  return ''
}

// Turn the conversation into a readable brief for the form's message box.
function buildBrief(messages: ChatMessage[]): string {
  const lines = messages
    .filter(m => m.content.trim())
    .map(m => `${m.role === 'user' ? 'You' : 'Pixel'}: ${m.content.replace(/\s+/g, ' ').trim()}`)
  return ['From my chat with Pixel:', ...lines].join('\n')
}

export default function ChatWidget() {
  const reducedMotion = useReducedMotion()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [chatError, setChatError] = useState<string | null>(null)
  const [handoffReady, setHandoffReady] = useState(false)

  const scrollRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const userExchanges = messages.filter(m => m.role === 'user').length

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, sending, handoffReady])

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus()
  }, [open])

  useEffect(() => {
    // Fallback: surface the form if the visitor clearly signals intent even
    // when the model didn't emit the handoff marker.
    if (!handoffReady && userExchanges >= 2 && signalsInterest(messages)) {
      setHandoffReady(true)
    }
  }, [messages, userExchanges, handoffReady])

  useEffect(() => {
    if (!open) return
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  function goToForm() {
    const params = new URLSearchParams()
    const email = findEmail(messages)
    if (email) params.set('email', email)
    params.set('message', buildBrief(messages))
    params.set('source', 'chatbot')
    navigate(`/contact?${params.toString()}`)
    setOpen(false)
  }

  async function send() {
    const trimmed = input.trim()
    if (!trimmed || sending) return
    if (trimmed.length > 2000) {
      setChatError('Message too long — keep it under 2000 characters.')
      return
    }

    const next = [...messages, { role: 'user' as const, content: trimmed }]
    setMessages(next)
    setInput('')
    setChatError(null)
    setSending(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: next.slice(-20) }),
      })
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(data.error || `Server error (${res.status})`)
      }
      const data = (await res.json()) as { reply?: string }
      const raw = data.reply?.trim()
      if (!raw) throw new Error('Empty response.')
      const { clean, handoff } = stripHandoff(raw)
      setMessages(m => [...m, { role: 'assistant', content: clean || "Got it — let's take this to the form." }])
      if (handoff) setHandoffReady(true)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong.'
      setChatError(msg)
      setMessages(m => [
        ...m,
        {
          role: 'assistant',
          content:
            "Sorry — I couldn't reach the server. You can try again, or use the contact form and we'll follow up.",
        },
      ])
    } finally {
      setSending(false)
    }
  }

  function onInputKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void send()
    }
  }

  const panelMotion = reducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 16, scale: 0.96 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 16, scale: 0.96 },
      }

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close chat' : 'Open chat with Pixellive'}
        aria-expanded={open}
        whileHover={reducedMotion ? undefined : { scale: 1.05 }}
        whileTap={reducedMotion ? undefined : { scale: 0.95 }}
        className="fixed bottom-6 right-6 z-[60] w-14 h-14 rounded-full bg-neon text-white flex items-center justify-center shadow-[0_0_24px_rgba(236,28,36,0.4)] hover:shadow-[0_0_32px_rgba(236,28,36,0.6)] transition-shadow"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="x"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.15 }}
              className="flex"
            >
              <X className="w-6 h-6" />
            </motion.span>
          ) : (
            <motion.span
              key="msg"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.15 }}
              className="flex"
            >
              <MessageCircle className="w-6 h-6" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            {...panelMotion}
            transition={{ duration: reducedMotion ? 0 : 0.18, ease: 'easeOut' }}
            role="dialog"
            aria-label="Pixellive chat"
            className="fixed bottom-24 right-6 z-[60] w-[min(360px,calc(100vw-2rem))] max-h-[min(560px,calc(100vh-8rem))] flex flex-col rounded-2xl glass-panel bg-[var(--bg-secondary)]/95 backdrop-blur-xl border border-[var(--border-color)] shadow-2xl overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border-color)]">
              <div className="w-8 h-8 rounded-full bg-neon/15 border border-neon/40 flex items-center justify-center text-neon">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold leading-tight">Pixel</p>
                <p className="text-[11px] text-[var(--fg-muted)] leading-tight">Usually replies instantly</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-3 no-scrollbar"
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={
                      m.role === 'user'
                        ? 'max-w-[85%] rounded-2xl rounded-br-sm px-3 py-2 text-sm bg-neon text-white whitespace-pre-wrap break-words'
                        : 'max-w-[85%] rounded-2xl rounded-bl-sm px-3 py-2 text-sm bg-[var(--glass)] border border-[var(--border-color)] text-[var(--fg)] whitespace-pre-wrap break-words'
                    }
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {sending && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-sm px-3 py-2 bg-[var(--glass)] border border-[var(--border-color)] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--fg-muted)] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--fg-muted)] animate-bounce" style={{ animationDelay: '120ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--fg-muted)] animate-bounce" style={{ animationDelay: '240ms' }} />
                  </div>
                </div>
              )}

              {handoffReady && (
                <div className="rounded-xl border border-neon/30 bg-neon/5 p-3 mt-1">
                  <p className="text-xs text-[var(--fg)] mb-2">
                    Perfect — the team can take it from here. I'll carry this chat over so you don't repeat yourself.
                  </p>
                  <button
                    type="button"
                    onClick={goToForm}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-bold bg-neon text-white hover:bg-neon/90 transition-colors"
                  >
                    Continue on our quick form <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <form
              onSubmit={e => {
                e.preventDefault()
                void send()
              }}
              className="border-t border-[var(--border-color)] p-3 flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder="Tell me what you're looking for…"
                aria-label="Message"
                maxLength={2000}
                className="flex-1 min-w-0 px-3 py-2 rounded-lg text-sm bg-[var(--glass)] border border-[var(--border-color)] focus:outline-none focus:border-neon/60 focus:ring-1 focus:ring-neon/30 text-[var(--fg)] placeholder:text-[var(--muted)]"
                disabled={sending}
              />
              <button
                type="submit"
                aria-label="Send message"
                disabled={sending || !input.trim()}
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-neon text-white hover:bg-neon/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            {chatError && (
              <p className="px-3 pb-2 text-[11px] text-neon">{chatError}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
