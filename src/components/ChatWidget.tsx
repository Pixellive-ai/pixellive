import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MessageCircle, X, Send } from 'lucide-react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

type Role = 'user' | 'assistant'

interface ChatMessage {
  role: Role
  content: string
}

type LeadState = 'idle' | 'prompted' | 'submitting' | 'sent'

const GREETING: ChatMessage = {
  role: 'assistant',
  content:
    "Hey, I'm Pixellive's assistant. Ask me anything — services, how we work, what an AI automation layer looks like for your business. I'll keep it short.",
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Only offer follow-up when the visitor actually signals buying intent —
// we don't knock on doors. If they want us, they'll say something like this.
const INTEREST_RE =
  /\b(pric(e|ing)|cost|quote|budget|hire|work with|get started|sign ?up|onboard|interested|reach out|follow up|contact|how do (we|i) start|can you (build|help|do)|need (a|some|help)|looking for)\b/i

function signalsInterest(messages: ChatMessage[]): boolean {
  return messages.some(m => m.role === 'user' && INTEREST_RE.test(m.content))
}

export default function ChatWidget() {
  const reducedMotion = useReducedMotion()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [chatError, setChatError] = useState<string | null>(null)

  const [leadState, setLeadState] = useState<LeadState>('idle')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)

  const scrollRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const userExchanges = messages.filter(m => m.role === 'user').length

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, sending, leadState])

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus()
  }, [open])

  useEffect(() => {
    // Prompt for follow-up only after a real exchange AND a genuine interest
    // signal — never just because they sent a couple of messages.
    if (leadState === 'idle' && userExchanges >= 1 && signalsInterest(messages)) {
      setLeadState('prompted')
    }
  }, [messages, userExchanges, leadState])

  useEffect(() => {
    if (!open) return
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

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
      const reply = data.reply?.trim()
      if (!reply) throw new Error('Empty response.')
      setMessages(m => [...m, { role: 'assistant', content: reply }])
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

  async function submitLead(e: FormEvent) {
    e.preventDefault()
    const trimmed = email.trim().toLowerCase()
    if (!EMAIL_RE.test(trimmed)) {
      setEmailError('That email looks off — mind double-checking?')
      return
    }
    const trimmedName = name.trim()
    setEmailError(null)
    setLeadState('submitting')

    const transcript = messages
      .filter(m => m.role === 'user')
      .slice(-5)
      .map(m => `• ${m.content}`)
      .join('\n')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: trimmedName || 'Chat visitor',
          email: trimmed,
          message:
            transcript ||
            'Visitor asked the chatbot to have the team follow up (no transcript yet).',
          service: 'Chatbot',
          newsletter: false,
          source: 'chatbot',
        }),
      })
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(data.error || `Server error (${res.status})`)
      }
      setLeadState('sent')
      setMessages(m => [
        ...m,
        {
          role: 'assistant',
          content: "Got it — we'll be in touch soon. Anything else I can answer in the meantime?",
        },
      ])
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : 'Could not save that — try again?')
      setLeadState('prompted')
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
                <p className="text-sm font-bold leading-tight">Pixellive</p>
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

              {(leadState === 'prompted' || leadState === 'submitting') && (
                <div className="rounded-xl border border-neon/30 bg-neon/5 p-3 mt-1">
                  <p className="text-xs text-[var(--fg)] mb-2">
                    Want the team to follow up? Drop your email — no spam, no nag.
                  </p>
                  <form onSubmit={submitLead} className="space-y-2">
                    <input
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Your name (optional)"
                      aria-label="Your name"
                      className="w-full min-w-0 px-3 py-2 rounded-lg text-sm bg-[var(--bg)] border border-[var(--border-color)] focus:outline-none focus:border-neon/60 focus:ring-1 focus:ring-neon/30 text-[var(--fg)] placeholder:text-[var(--muted)]"
                      disabled={leadState === 'submitting'}
                    />
                    <div className="flex gap-2">
                      <input
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        aria-label="Your email"
                        className="flex-1 min-w-0 px-3 py-2 rounded-lg text-sm bg-[var(--bg)] border border-[var(--border-color)] focus:outline-none focus:border-neon/60 focus:ring-1 focus:ring-neon/30 text-[var(--fg)] placeholder:text-[var(--muted)]"
                        disabled={leadState === 'submitting'}
                      />
                      <button
                        type="submit"
                        disabled={leadState === 'submitting'}
                        className="px-3 py-2 rounded-lg text-xs font-bold bg-neon text-white hover:bg-neon/90 transition-colors disabled:opacity-60"
                      >
                        {leadState === 'submitting' ? '…' : 'Send'}
                      </button>
                    </div>
                  </form>
                  {emailError && (
                    <p className="text-[11px] text-neon mt-2">{emailError}</p>
                  )}
                  <button
                    type="button"
                    onClick={() => setLeadState('sent')}
                    className="text-[11px] text-[var(--fg-muted)] hover:text-[var(--fg)] mt-2"
                  >
                    Not now
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
                placeholder="Ask about services, automation, scope…"
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
