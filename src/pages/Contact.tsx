import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Video, Search, Megaphone, Twitter, Linkedin, Instagram, Youtube, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { PageTransition } from '@/components/ui/page-transition'
import { BackgroundBeams } from '@/components/ui/bg-beams'
import { AuroraBackground } from '@/components/ui/aurora-bg'
import { GlassCard } from '@/components/ui/glass-card'
import { BlurFadeIn } from '@/components/ui/blur-fade'
import { OrbitingCircles, OrbitRing } from '@/components/ui/orbiting-circles'
import { useSEO } from '@/lib/seo'
import { isConvexConfigured, useSafeMutation } from '@/lib/convex'
import { api } from '../../convex/_generated/api'

const serviceOptions = [
  'Video Production',
  'SEO',
  'SEM & Paid Ads',
  'Content Planning',
  'Growth Analytics',
  'Full-Service Package',
]

const socials = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Youtube, href: '#', label: 'YouTube' },
]

export default function Contact() {
  useSEO('Contact Us', 'Get in touch with Pixel Live Production. Start your digital project today.')

  const submitContact = useSafeMutation(api.contact.submit)
  const subscribeNewsletter = useSafeMutation(api.newsletter.subscribe)

  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    service: '',
    message: '',
    newsletter: false,
  })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields.')
      return
    }

    setLoading(true)
    try {
      if (isConvexConfigured) {
        await submitContact({
          name: form.name,
          email: form.email,
          company: form.company || undefined,
          serviceInterest: form.service || undefined,
          message: form.message,
        })

        if (form.newsletter) {
          await subscribeNewsletter({ email: form.email })
        }
      } else {
        // Simulate submission when Convex isn't connected yet
        await new Promise(r => setTimeout(r, 1000))
      }

      setSent(true)
      toast.success("Message sent! We'll be in touch within 24 hours.")
    } catch (err) {
      console.error('Contact submission failed:', err)
      toast.error('Something went wrong. Please try again or email us directly.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = `
    w-full px-4 py-3 rounded-xl text-sm
    bg-[var(--glass)] border border-[var(--border-color)]
    focus:outline-none focus:border-neon/60 focus:ring-1 focus:ring-neon/30
    text-[var(--fg)] placeholder:text-[var(--muted)]
    transition-all duration-200
  `

  return (
    <PageTransition>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-32 px-6">
        <div className="absolute inset-0 bg-[var(--bg)]" />
        <div className="bg-grid-pattern absolute inset-0 opacity-30" />
        <BackgroundBeams />
        <AuroraBackground className="absolute inset-0" />

        <div className="relative z-10 w-full max-w-6xl mx-auto">
          <BlurFadeIn className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-neon font-semibold mb-4">Let's Connect</p>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4">
              Start your project<br />
              <span className="text-gradient-neon">today.</span>
            </h1>
            <p className="text-[var(--fg-muted)] text-lg max-w-md mx-auto">
              Tell us about your goals. We'll respond with a custom strategy within 24 hours.
            </p>
          </BlurFadeIn>

          <div className="grid lg:grid-cols-5 gap-8 items-start">
            {/* Form */}
            <BlurFadeIn className="lg:col-span-3" delay={0.1}>
              <GlassCard className="p-8 backdrop-blur-xl" glow>
                {sent ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-neon/10 border border-neon/30 flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-8 h-8 text-neon" />
                    </div>
                    <h3 className="text-2xl font-black mb-2">Message received!</h3>
                    <p className="text-[var(--fg-muted)] mb-6">We'll review your project and reach out within 24 hours.</p>
                    <button
                      onClick={() => {
                        setSent(false)
                        setForm({ name: '', email: '', company: '', service: '', message: '', newsletter: false })
                      }}
                      className="text-sm text-neon font-semibold hover:underline"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {!isConvexConfigured && (
                      <div className="p-3 rounded-xl border border-yellow-500/20 bg-yellow-500/5 text-xs text-yellow-400 flex items-start gap-2">
                        <span className="shrink-0 mt-0.5">⚠</span>
                        <span>
                          Convex not connected — form will simulate submission.{' '}
                          Add <code className="bg-yellow-500/10 px-1 rounded">VITE_CONVEX_URL</code> to <code className="bg-yellow-500/10 px-1 rounded">.env.local</code> and run{' '}
                          <code className="bg-yellow-500/10 px-1 rounded">npx convex dev</code> to enable real saves.
                        </span>
                      </div>
                    )}

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[var(--fg-muted)] mb-1.5 uppercase tracking-wider">
                          Name <span className="text-neon">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Alex Johnson"
                          className={inputClass}
                          value={form.name}
                          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[var(--fg-muted)] mb-1.5 uppercase tracking-wider">
                          Email <span className="text-neon">*</span>
                        </label>
                        <input
                          type="email"
                          placeholder="alex@company.com"
                          className={inputClass}
                          value={form.email}
                          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[var(--fg-muted)] mb-1.5 uppercase tracking-wider">
                        Company
                      </label>
                      <input
                        type="text"
                        placeholder="Your Company"
                        className={inputClass}
                        value={form.company}
                        onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[var(--fg-muted)] mb-1.5 uppercase tracking-wider">
                        Service Interest
                      </label>
                      <select
                        className={inputClass}
                        value={form.service}
                        onChange={e => setForm(f => ({ ...f, service: e.target.value }))}
                      >
                        <option value="">Select a service…</option>
                        {serviceOptions.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[var(--fg-muted)] mb-1.5 uppercase tracking-wider">
                        Message <span className="text-neon">*</span>
                      </label>
                      <textarea
                        rows={5}
                        placeholder="Tell us about your project, goals, and timeline…"
                        className={`${inputClass} resize-none`}
                        value={form.message}
                        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      />
                    </div>

                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div className="relative mt-0.5">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={form.newsletter}
                          onChange={e => setForm(f => ({ ...f, newsletter: e.target.checked }))}
                        />
                        <div
                          className={`w-4 h-4 rounded border transition-all ${form.newsletter ? 'bg-neon border-neon' : 'border-[var(--border-color)] group-hover:border-neon/40'}`}
                        >
                          {form.newsletter && (
                            <svg className="w-4 h-4 text-black p-0.5" viewBox="0 0 16 16" fill="none">
                              <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <span className="text-sm text-[var(--fg-muted)]">
                        Subscribe to our newsletter for digital marketing insights
                      </span>
                    </label>

                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 bg-neon text-black hover:bg-neon/90 transition-all hover:shadow-[0_0_24px_rgba(0,240,255,0.4)] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      ) : (
                        <>
                          Send Message <Send className="w-4 h-4" />
                        </>
                      )}
                    </motion.button>
                  </form>
                )}
              </GlassCard>
            </BlurFadeIn>

            {/* Right panel */}
            <BlurFadeIn className="lg:col-span-2 space-y-6" delay={0.2}>
              <GlassCard className="p-6">
                <p className="text-xs uppercase tracking-widest font-semibold text-[var(--muted)] mb-4">Contact</p>
                <div className="space-y-3">
                  <p className="text-sm text-[var(--fg-muted)]">hello@pixellive.agency</p>
                  <p className="text-sm text-[var(--fg-muted)]">+1 (415) 000-0000</p>
                  <p className="text-sm text-[var(--fg-muted)]">San Francisco, CA</p>
                </div>
                <div className="flex gap-3 mt-5">
                  {socials.map(({ icon: Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      aria-label={label}
                      className="w-9 h-9 rounded-xl glass-panel flex items-center justify-center hover:border-neon/40 hover:text-neon transition-colors text-[var(--fg-muted)]"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </GlassCard>

              {/* Orbit visual */}
              <GlassCard className="p-6">
                <p className="text-xs uppercase tracking-widest font-semibold text-[var(--muted)] mb-4">Our Services</p>
                <div className="relative h-48 flex items-center justify-center">
                  <div className="relative w-36 h-36">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-xl bg-neon/10 border border-neon/40 flex items-center justify-center text-xs font-bold text-neon">
                        PLP
                      </div>
                    </div>
                    <OrbitRing radius={48}>
                      <OrbitingCircles radius={48} duration={5} icon={<Video className="w-3 h-3" />} />
                    </OrbitRing>
                    <OrbitRing radius={70}>
                      <OrbitingCircles radius={70} duration={8} reverse icon={<Search className="w-3 h-3" />} />
                    </OrbitRing>
                    <OrbitRing radius={92}>
                      <OrbitingCircles radius={92} duration={11} icon={<Megaphone className="w-3 h-3" />} />
                    </OrbitRing>
                  </div>
                </div>
              </GlassCard>
            </BlurFadeIn>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
