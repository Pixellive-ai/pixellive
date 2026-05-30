interface ContactPayload {
  name?: string
  email?: string
  company?: string
  service?: string
  message?: string
  newsletter?: boolean
}

interface Lead {
  id: string
  receivedAt: string
  name: string
  email: string
  company: string | null
  serviceInterest: string | null
  message: string
  newsletter: boolean
  source: string
  userAgent: string | null
}

export default async (req: Request): Promise<Response> => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  let body: ContactPayload
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const name = body.name?.trim()
  const email = body.email?.trim().toLowerCase()
  const message = body.message?.trim()

  if (!name || !email || !message) {
    return Response.json({ error: 'Name, email, and message are required.' }, { status: 400 })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: 'Invalid email address.' }, { status: 400 })
  }

  const lead: Lead = {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    receivedAt: new Date().toISOString(),
    name,
    email,
    company: body.company?.trim() || null,
    serviceInterest: body.service?.trim() || null,
    message,
    newsletter: !!body.newsletter,
    source: 'pixellive.netlify.app',
    userAgent: req.headers.get('user-agent') || null,
  }

  const [tgRes, ghRes] = await Promise.allSettled([
    notifyTelegram(lead),
    commitToInbox(lead),
  ])

  if (tgRes.status === 'rejected') console.error('Telegram bridge failed:', tgRes.reason)
  if (ghRes.status === 'rejected') console.error('GitHub bridge failed:', ghRes.reason)

  if (tgRes.status === 'rejected' && ghRes.status === 'rejected') {
    return Response.json(
      { error: 'Lead could not be delivered. Please try again or email us directly.' },
      { status: 502 }
    )
  }

  return Response.json({ ok: true, id: lead.id })
}

async function notifyTelegram(lead: Lead): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) throw new Error('Telegram env not configured')

  const text =
    `🎯 <b>New lead</b> — ${esc(lead.name)}\n\n` +
    `📧 ${esc(lead.email)}\n` +
    (lead.company ? `🏢 ${esc(lead.company)}\n` : '') +
    (lead.serviceInterest ? `🎯 ${esc(lead.serviceInterest)}\n` : '') +
    `\n💬 ${esc(lead.message)}\n\n` +
    `<i>id: ${lead.id}</i>`

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  })
  if (!res.ok) {
    throw new Error(`Telegram API ${res.status}: ${await res.text()}`)
  }
}

async function commitToInbox(lead: Lead): Promise<void> {
  const token = process.env.GITHUB_TOKEN
  const owner = process.env.GITHUB_OWNER || 'Pixellive-ai'
  const repo = process.env.GITHUB_REPO || 'leads-inbox'
  if (!token) throw new Error('GitHub env not configured')

  const date = new Date(lead.receivedAt)
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const path = `leads/${year}/${month}/lead-${lead.id}.json`

  const content = Buffer.from(JSON.stringify(lead, null, 2), 'utf-8').toString('base64')

  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURI(path)}`,
    {
      method: 'PUT',
      headers: {
        accept: 'application/vnd.github+json',
        authorization: `Bearer ${token}`,
        'content-type': 'application/json',
        'x-github-api-version': '2022-11-28',
      },
      body: JSON.stringify({
        message: `Lead from ${lead.name} (${lead.email})`,
        content,
        branch: 'main',
      }),
    }
  )
  if (!res.ok) {
    throw new Error(`GitHub API ${res.status}: ${await res.text()}`)
  }
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
