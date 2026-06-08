/**
 * Website visitor de-anonymization (self-hosted, $0).
 *
 * A tiny beacon on the site POSTs each session here. We take the visitor's IP,
 * resolve it to the owning network/organization (ipinfo.io), and — when that org
 * looks like a *company* rather than a consumer ISP, mobile carrier, or cloud
 * host — log it as a soft "someone from <Company> visited" lead into the
 * leads-inbox repo (under visits/, separate from real contact-form leads).
 *
 * HONEST LIMITS: IP→company only resolves visitors on a corporate network. Most
 * traffic (home broadband, mobile, VPN) resolves to an ISP and is dropped. Real
 * person-level identity (RB2B/Vector) needs a consented identity-graph vendor —
 * see the RB2B hook at the bottom. This is the free baseline + the plumbing.
 *
 * Env:
 *   IPINFO_TOKEN     optional — raises ipinfo rate limit (free tier ~50k/mo)
 *   GITHUB_TOKEN     reuse the contact function's token
 *   GITHUB_OWNER     default "Pixellive-ai"
 *   GITHUB_REPO      default "leads-inbox"
 *   VISIT_TELEGRAM   "1" to ping Telegram on a NEW company/day (default: silent)
 *   TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID  (only if VISIT_TELEGRAM=1)
 */

interface VisitBeacon {
  path?: string
  referrer?: string
}

interface VisitRecord {
  id: string
  type: 'visit'
  company: string
  asn: string | null
  network: string
  city: string | null
  region: string | null
  country: string | null
  ipPrefix: string
  firstSeenAt: string
  lastSeenAt: string
  pageCount: number
  paths: string[]
  referrers: string[]
  source: string
}

// Network orgs that are NOT prospects: consumer ISPs, mobile carriers, cloud/hosting,
// VPN/CDN. If the resolved org matches any of these, we drop the hit.
const NON_COMPANY = /\b(airtel|jio|reliance|vodafone|idea|bsnl|mtnl|act fibernet|hathway|tata (play|teleservices)|excitel|comcast|xfinity|verizon|at&t|t-mobile|sprint|spectrum|charter|cox communications|centurylink|frontier|telecom|telecommunications?|broadband|fibernet|cellular|mobile|wireless|isp\b|internet service|amazon|aws|google (llc|cloud)|microsoft|azure|digitalocean|linode|akamai|cloudflare|fastly|ovh|hetzner|contabo|vultr|oracle cloud|leaseweb|hosting|datacenter|data center|colo|vpn|nordvpn|proton|m247|stackpath)\b/i

export default async (req: Request): Promise<Response> => {
  // Beacon must never break the page — always resolve quietly.
  const ok = () => new Response(null, { status: 204 })
  if (req.method !== 'POST') return ok()

  let body: VisitBeacon = {}
  try { body = await req.json() } catch { /* allow empty beacon */ }

  const ip = clientIp(req)
  if (!ip || isPrivate(ip)) return ok()

  let geo: Awaited<ReturnType<typeof resolveIp>>
  try { geo = await resolveIp(ip) } catch { return ok() }
  if (!geo?.org) return ok()

  const company = cleanOrg(geo.org)
  if (!company || NON_COMPANY.test(geo.org)) return ok() // consumer/ISP/cloud → drop

  const now = new Date().toISOString()
  const record: VisitRecord = {
    id: `${company.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${now.slice(0, 10).replace(/-/g, '')}`,
    type: 'visit',
    company,
    asn: geo.asn ?? null,
    network: geo.org,
    city: geo.city ?? null,
    region: geo.region ?? null,
    country: geo.country ?? null,
    ipPrefix: maskIp(ip),
    firstSeenAt: now,
    lastSeenAt: now,
    pageCount: 1,
    paths: body.path ? [body.path] : [],
    referrers: body.referrer ? [body.referrer] : [],
    source: 'pixellive-visit-beacon',
  }

  try {
    const isNew = await upsertVisit(record)
    if (isNew && process.env.VISIT_TELEGRAM === '1') await notifyTelegram(record)
  } catch (e) {
    console.error('visit log failed:', e)
  }
  return ok()
}

// ── IP + geo ──

function clientIp(req: Request): string | null {
  const nf = req.headers.get('x-nf-client-connection-ip')
  if (nf) return nf.trim()
  const xff = req.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0].trim()
  return null
}

function isPrivate(ip: string): boolean {
  return /^(10\.|127\.|192\.168\.|169\.254\.|::1|fc00:|fe80:)/.test(ip) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(ip)
}

function maskIp(ip: string): string {
  if (ip.includes(':')) return ip.split(':').slice(0, 3).join(':') + '::/48' // IPv6 → /48
  return ip.split('.').slice(0, 3).join('.') + '.0/24'                       // IPv4 → /24
}

async function resolveIp(ip: string) {
  const token = process.env.IPINFO_TOKEN
  const url = `https://ipinfo.io/${encodeURIComponent(ip)}/json${token ? `?token=${token}` : ''}`
  const res = await fetch(url, { signal: AbortSignal.timeout(6000), headers: { accept: 'application/json' } })
  if (!res.ok) throw new Error(`ipinfo ${res.status}`)
  const j = await res.json() as { org?: string; city?: string; region?: string; country?: string }
  // ipinfo "org" looks like "AS13335 Cloudflare, Inc."
  const asn = j.org?.match(/^(AS\d+)/)?.[1] ?? null
  return { org: j.org ?? '', asn, city: j.city, region: j.region, country: j.country }
}

// "AS13335 Cloudflare, Inc." → "Cloudflare"; strip ASN, legal suffixes, junk.
function cleanOrg(org: string): string | null {
  let n = org.replace(/^AS\d+\s*/i, '').trim()
  n = n.replace(/[,.\s]+(inc|llc|ltd|gmbh|pvt|private limited|co|corp|corporation|limited|sas|bv|ag|plc)\.?$/i, '').trim()
  if (n.length < 2 || n.length > 60) return null
  return n
}

// ── persistence (GitHub contents API; one record per company per day, merged) ──

async function upsertVisit(rec: VisitRecord): Promise<boolean> {
  const token = process.env.GITHUB_TOKEN
  const owner = process.env.GITHUB_OWNER || 'Pixellive-ai'
  const repo = process.env.GITHUB_REPO || 'leads-inbox'
  if (!token) throw new Error('GitHub env not configured')

  const d = new Date(rec.firstSeenAt)
  const path = `visits/${d.getUTCFullYear()}/${String(d.getUTCMonth() + 1).padStart(2, '0')}/${rec.id}.json`
  const apiBase = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURI(path)}`
  const headers = {
    accept: 'application/vnd.github+json',
    authorization: `Bearer ${token}`,
    'content-type': 'application/json',
    'x-github-api-version': '2022-11-28',
  }

  // Does today's record for this company already exist? Merge if so.
  let sha: string | undefined
  let merged = rec
  const existing = await fetch(apiBase, { headers })
  if (existing.ok) {
    const ej = await existing.json() as { sha: string; content: string }
    sha = ej.sha
    try {
      const prev = JSON.parse(Buffer.from(ej.content, 'base64').toString('utf-8')) as VisitRecord
      merged = {
        ...prev,
        lastSeenAt: rec.firstSeenAt,
        pageCount: (prev.pageCount ?? 0) + 1,
        paths: [...new Set([...(prev.paths ?? []), ...rec.paths])].slice(0, 50),
        referrers: [...new Set([...(prev.referrers ?? []), ...rec.referrers])].slice(0, 20),
      }
    } catch { /* corrupt prev → overwrite with fresh */ }
  }

  const content = Buffer.from(JSON.stringify(merged, null, 2), 'utf-8').toString('base64')
  const res = await fetch(apiBase, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      message: `${sha ? 'Visit (repeat)' : 'Visit'} from ${rec.company} (${rec.network})`,
      content,
      branch: 'main',
      ...(sha ? { sha } : {}),
    }),
  })
  if (!res.ok) throw new Error(`GitHub ${res.status}: ${await res.text()}`)
  return !sha // new company-day = true
}

async function notifyTelegram(rec: VisitRecord): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) return
  const loc = [rec.city, rec.region, rec.country].filter(Boolean).join(', ')
  const text =
    `👀 <b>Site visit</b> — <b>${esc(rec.company)}</b>\n` +
    (loc ? `📍 ${esc(loc)}\n` : '') +
    `🌐 ${esc(rec.network)}\n` +
    (rec.paths[0] ? `📄 ${esc(rec.paths[0])}\n` : '') +
    `\n<i>anonymous corporate visitor — no contact yet</i>`
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true }),
  }).catch(() => {})
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/*
 * ── RB2B / Vector drop-in hook (person-level, higher match — needs signup) ──
 * Self-hosted IP→company above only catches corporate networks. For person-level
 * identity, add RB2B's free script to index.html <head> once KJ signs up at rb2b.com:
 *     <script async src="https://b2bjsstore.s3.us-west-2.amazonaws.com/b/<ID>/<KEY>.js"></script>
 * RB2B then POSTs identified persons to a webhook — point that webhook at this
 * same function (extend the handler to accept RB2B's payload shape) so both
 * sources land in the same visits/ inbox.
 */
