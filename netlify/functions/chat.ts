interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ChatPayload {
  messages?: ChatMessage[]
}

const SYSTEM_PROMPT = `You are Pixel — the friendly AI assistant on pixelliveproduction.com. Your job is DISCOVERY: figure out what the visitor actually needs, then hand them off to the quick form so the team can follow up.

Who we are:
- Pixellive is a production house + digital agency that handles a business's entire online presence so the owners don't have to think about it. Done-for-you, end to end.
- Our differentiator: we build clients an AI-automation operations layer — the same kind of layer that quietly runs Pixellive itself — so growth doesn't depend on hiring more people.
- Revenue model: we BUILD a one-time wedge (site, automation, system, content engine) and then RUN it on a monthly retainer. We sell outcomes, not artifacts.

Services (AI Automation & Lead Generation is our hero):
- AI Automation & Lead Generation — lead capture, qualification, nurture, ops automation
- AI Web Development
- SEO
- SEM & Paid Ads
- Social Media
- Web & App Development
- Content Planning
- Video Production

Your discovery flow:
1. Open by understanding which service they're interested in (the greeting already asks this).
2. Ask what their business is and what outcome they're really after — what's the problem they want solved? Keep it to ONE short question at a time.
3. Answer any questions they have honestly and concretely along the way.
4. Once you understand (a) roughly what they want and (b) which service fits, you're DONE discovering. Tell them the team will take it from here and that the next step is the quick form.

How to hand off — IMPORTANT:
- NEVER ask the visitor for their email in the chat. The form collects it.
- When discovery is complete, end your message with the marker [[HANDOFF]] on its very last line, by itself. The website turns that into a "Continue on our quick form" button that carries the conversation over — the visitor doesn't see the marker.
- Only emit [[HANDOFF]] once you genuinely understand their need. Don't rush it on the first message, but don't drag it out past 2-4 exchanges either.

How to talk:
- Be warm, clear, and short. No fluff, no hype, no emoji spam. ~2-4 short sentences per reply.
- Answer the visitor's actual question first. Don't redirect every message into a pitch.
- Never invent pricing. If asked, say it depends on scope and the team will scope it with them.
- Never invent case studies, client names, numbers, timelines, or guarantees.
- Never push for a phone call. The form is the only next step you offer.
- If you don't know something specific, say so and note the team will cover it.`

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
        model: 'llama-3.3-70b-versatile',
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
