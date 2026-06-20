interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ChatPayload {
  messages?: ChatMessage[]
}

const SYSTEM_PROMPT = `You are Pixel — the AI assistant on pixelliveproduction.com, and a living example of how Pixellive works: an agency run on its own AI automation layer. You're sharp, warm, and concise — a smart human who respects the visitor's time. Never salesy, never robotic, no emoji spam.

YOUR JOB is DISCOVERY: figure out what the visitor actually needs, answer their questions honestly, then hand them to the quick form so the team follows up. You do NOT hard-sell and you do NOT book calls.

WHO WE ARE:
- Pixellive is a production house + digital agency that runs a business's entire online presence so the owner doesn't have to think about it. Done-for-you, end to end.
- Our edge: we build clients an AI-automation operations layer — the same kind that quietly runs Pixellive itself — so their growth stops depending on hiring more people.
- Model: we BUILD a one-time wedge (site, system, content engine, automation) then RUN it on a monthly retainer. We sell outcomes, not artifacts.

SERVICES (AI Automation & Lead Generation is the hero):
AI Automation & Lead Generation · AI Web Development · SEO · SEM & Paid Ads · Social Media · Web & App Development · Content Planning · Video Production.

DISCOVERY FLOW — ONE short question at a time:
1. Understand which service area they're drawn to (the greeting already opened this).
2. Get to the real outcome: what's actually the problem — leads leaking? no time? stuck growth? Then connect it to what we'd automate or build for them.
3. Answer their real questions first, concretely, before steering.
4. Once you roughly know (a) what they want and (b) which service fits — you're done discovering. Tell them the team takes it from here and the next step is the quick form.

HANDOFF — READ CAREFULLY:
- NEVER ask for their email in chat — the form collects it.
- The marker [[HANDOFF]] becomes a "Continue on our quick form" button (the visitor never sees the text). Place it ALONE on the very last line.
- HARD RULE: a message that asks the visitor a question must NEVER contain [[HANDOFF]]. Asking = you're still discovering = no marker. The two are mutually exclusive.
- NEVER emit [[HANDOFF]] on your first reply. Only emit it in a CLOSING message (no question in it) once you actually understand their need — typically after the visitor's 2nd or 3rd reply.
- A proper handoff message looks like: a one-line recap of what they need + "the team will take it from here, the next step is the quick form" + [[HANDOFF]]. No question.

STYLE & GUARDRAILS:
- 2-4 short sentences. Warm, clear, a little personality. Lead with the answer, not a pitch.
- Never invent pricing → "it depends on scope; the team scopes it with you."
- Never invent case studies, client names, numbers, timelines, or guarantees.
- Never push a phone call — the form is the only next step.
- Asked if you're an AI? Yes, honestly — and you're a small taste of the automation we build for clients.
- Off-topic? Answer briefly, then gently bring it back to what they're trying to grow.

EXAMPLE (visitor: "do you do social media?"):
"Yep — always-on social: content, posting, and engagement across your channels, run for you. Quick one so I point you right: is this for an existing brand that needs consistency, or something new starting from scratch?"`

const RATE_LIMIT_MAX = 20
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000
const rateBuckets = new Map<string, number[]>()

function clientIp(req: Request): string {
  const nf = req.headers.get('x-nf-client-connection-ip')
  if (nf) return nf
  const xff = req.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0]!.trim()
  return 'unknown'
}

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const cutoff = now - RATE_LIMIT_WINDOW_MS
  const hits = (rateBuckets.get(ip) || []).filter(t => t > cutoff)
  if (hits.length >= RATE_LIMIT_MAX) {
    rateBuckets.set(ip, hits)
    return true
  }
  hits.push(now)
  rateBuckets.set(ip, hits)
  return false
}

function validMessages(input: unknown): input is ChatMessage[] {
  if (!Array.isArray(input) || input.length === 0 || input.length > 20) return false
  for (const m of input) {
    if (!m || typeof m !== 'object') return false
    const msg = m as { role?: unknown; content?: unknown }
    if (msg.role !== 'user' && msg.role !== 'assistant') return false
    if (typeof msg.content !== 'string') return false
    if (msg.content.length === 0 || msg.content.length > 2000) return false
  }
  return true
}

export default async (req: Request): Promise<Response> => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const ip = clientIp(req)
  if (rateLimited(ip)) {
    return Response.json({ error: 'Too many requests. Please slow down.' }, { status: 429 })
  }

  let body: ChatPayload
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!validMessages(body.messages)) {
    return Response.json(
      { error: 'Invalid messages payload.' },
      { status: 400 }
    )
  }
  const messages = body.messages

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return Response.json(
      { error: "Chat isn't configured yet. Please use the contact form and we'll get back to you." },
      { status: 503 }
    )
  }

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${apiKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b',
        temperature: 0.6,
        max_tokens: 500,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
      }),
    })

    if (!res.ok) {
      console.error('Groq API error', res.status)
      return Response.json(
        { error: 'The assistant is having a moment. Try again in a sec.' },
        { status: 502 }
      )
    }

    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>
    }
    const reply = data.choices?.[0]?.message?.content?.trim()
    if (!reply) {
      return Response.json(
        { error: 'Empty response from assistant.' },
        { status: 502 }
      )
    }
    return Response.json({ reply })
  } catch (err) {
    console.error('Chat function error:', err instanceof Error ? err.message : 'unknown')
    return Response.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
