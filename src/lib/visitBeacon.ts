/**
 * Visitor beacon — fires once per browser session to /api/visit so the backend
 * can resolve the visitor's network to a company (see netlify/functions/visit.ts).
 * Fully fire-and-forget: never blocks render, swallows all errors, runs once.
 */
export function fireVisitBeacon(): void {
  try {
    if (typeof window === 'undefined') return
    const KEY = 'plv_visit_sent'
    if (sessionStorage.getItem(KEY)) return
    sessionStorage.setItem(KEY, '1')

    const payload = JSON.stringify({
      path: window.location.pathname,
      referrer: document.referrer || '',
    })
    // keepalive lets it complete even if the page navigates away immediately.
    fetch('/api/visit', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(() => {})
  } catch {
    /* beacons never break the app */
  }
}
