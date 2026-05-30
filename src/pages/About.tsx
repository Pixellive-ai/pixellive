import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Lightbulb, Target, Repeat, Compass, Camera, Code2, Radar, Send, BarChart3, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageTransition } from '@/components/ui/page-transition'
import { AuroraBackground } from '@/components/ui/aurora-bg'
import { GlassCard } from '@/components/ui/glass-card'
import { BlurFadeIn } from '@/components/ui/blur-fade'
import { TiltCard } from '@/components/ui/tilt-card'
import { useSEO } from '@/lib/seo'

const philosophy = [
  {
    icon: Lightbulb,
    title: 'Humans for craft. AI for the engine.',
    desc: "Our team owns strategy, creative, and the calls that need judgment. Our AI backend handles the operational work that doesn't.",
    color: '#EC1C24',
  },
  {
    icon: Target,
    title: 'Outcomes, not artifacts.',
    desc: "You don't get tools to manage. You get results delivered — leads, content, ads, reporting — handled end-to-end.",
    color: '#3DD68C',
  },
  {
    icon: Repeat,
    title: 'We run on what we sell.',
    desc: "The same AI ops layer that runs Pixellive is what we'd build for you. Proof, not promise.",
    color: '#00F0FF',
  },
]

const team = [
  { kind: 'Human', icon: Compass,    color: '#EC1C24', title: 'Strategy & Creative Direction', desc: 'Vision, brand, the calls that need judgment.' },
  { kind: 'Human', icon: Camera,     color: '#A78BFA', title: 'Production & Visual Craft',     desc: 'Cinematography, design, the work that needs taste.' },
  { kind: 'Human', icon: Code2,      color: '#3DD68C', title: 'Engineering',                    desc: 'Sites, apps, and the systems that hold it together.' },
  { kind: 'AI',    icon: Radar,      color: '#00F0FF', title: 'Research & Lead Intelligence',  desc: 'Continuously hunts and qualifies opportunities.' },
  { kind: 'AI',    icon: Send,       color: '#FF61DC', title: 'Outreach & Content Cadence',    desc: 'Drafts, sends, posts, follows up — on schedule.' },
  { kind: 'AI',    icon: BarChart3,  color: '#FFB800', title: 'Analytics & Reporting',         desc: "Real-time visibility on what's working and what isn't." },
] as const

const howWeWork = [
  { step: '01', title: 'Build',   desc: 'We build your stack — audit your presence, set up the automation, site, and ads.', color: '#3DD68C' },
  { step: '02', title: 'Run',     desc: 'We run it on our infrastructure — monitored, maintained, improving.',              color: '#FFB800' },
  { step: '03', title: 'Deliver', desc: 'You get outcomes + a live dashboard showing it working. Never the busywork.',     color: '#00F0FF' },
]

export default function About() {
  useSEO('About Us', 'Learn how Pixellive combines a senior human team with a proprietary AI backend to deliver the leverage of a massive agency, without the bloat.')
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] })
  const x = useTransform(scrollYProgress, [0, 0.8], ['0%', '-75%'])

  return (
    <PageTransition>
      {/* Hero */}
      <AuroraBackground>
        <section className="pt-40 pb-24 px-6 text-center relative">
          <BlurFadeIn>
            <p className="text-xs uppercase tracking-widest text-neon font-semibold mb-4">Our Story</p>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
              Built for outcomes.<br />
              <span className="text-gradient-neon">Engineered for scale.</span>
            </h1>
            <p className="text-[var(--fg-muted)] max-w-xl mx-auto text-lg leading-relaxed">
              A senior human team. A proprietary AI backend. The leverage of a massive agency, without the friction.
            </p>
          </BlurFadeIn>
        </section>
      </AuroraBackground>

      {/* Horizontal Scroll Storytelling */}
      <section ref={containerRef} className="relative hidden md:block" style={{ height: '500vh' }}>
        <div className="sticky top-0 h-screen overflow-hidden">
          <motion.div style={{ x }} className="flex h-full w-[400%]">
            {/* Panel 1: Origin */}
            <div className="w-screen h-screen flex items-center justify-center px-20 bg-[var(--bg)]">
              <div className="max-w-2xl">
                <p className="text-xs uppercase tracking-widest text-neon font-semibold mb-4">Chapter 01</p>
                <h2 className="text-5xl font-black mb-6">Our Origin</h2>
                <div className="space-y-5 text-[var(--fg-muted)] text-lg leading-relaxed">
                  <p className="text-[var(--fg)] text-2xl font-bold">Pixellive is a new generation of digital agency.</p>
                  <p>Traditional agencies scale by adding headcount. We scale with intelligence. By automating the heavy lifting—research, outreach, content scheduling, and deep analytics—with our proprietary AI backend, we&apos;ve eliminated the friction of the traditional agency model.</p>
                  <p>This keeps our human team lean, senior, and entirely focused on what AI can&apos;t replicate: high-level strategy, creative direction, and human taste. You get the output and leverage of a massive agency, without the communication gaps or bloated fees.</p>
                  <p className="text-[var(--fg)] font-semibold">One senior team. One intelligent backend. Real-time dashboard visibility. We handle the digital landscape so you can run your business.</p>
                </div>
              </div>
            </div>

            {/* Panel 2: Philosophy */}
            <div className="w-screen h-screen flex items-center justify-center px-20 bg-[var(--bg-secondary)]">
              <div className="max-w-4xl w-full">
                <p className="text-xs uppercase tracking-widest text-neon font-semibold mb-4">Chapter 02</p>
                <h2 className="text-5xl font-black mb-10">Our Philosophy</h2>
                <div className="grid grid-cols-3 gap-6">
                  {philosophy.map(p => (
                    <TiltCard key={p.title} intensity={8}>
                      <GlassCard
                        className="p-6 h-full"
                        glow
                        style={{ background: `linear-gradient(135deg, ${p.color}10 0%, transparent 60%), var(--glass)`, borderColor: `${p.color}40`, ['--card-glow' as string]: `${p.color}33` } as React.CSSProperties}
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                          style={{ background: `${p.color}15`, border: `1px solid ${p.color}30`, color: p.color }}
                        >
                          <p.icon className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold mb-2">{p.title}</h3>
                        <p className="text-sm text-[var(--fg-muted)] leading-relaxed">{p.desc}</p>
                      </GlassCard>
                    </TiltCard>
                  ))}
                </div>
              </div>
            </div>

            {/* Panel 3: How We Work */}
            <div className="w-screen h-screen flex items-center justify-center px-20 bg-[var(--bg)]">
              <div className="max-w-5xl w-full">
                <p className="text-xs uppercase tracking-widest text-neon font-semibold mb-4">Chapter 03</p>
                <h2 className="text-5xl font-black mb-3">How We Work</h2>
                <p className="text-[var(--fg-muted)] mb-12 max-w-xl">
                  One model. Three moves. Built so you stay focused on your business while we handle the digital.
                </p>
                <div className="grid grid-cols-3 gap-6">
                  {howWeWork.map(s => (
                    <TiltCard key={s.step} intensity={8}>
                      <GlassCard
                        className="p-6 text-left h-full"
                        glow
                        style={{ background: `linear-gradient(135deg, ${s.color}10 0%, transparent 60%), var(--glass)`, borderColor: `${s.color}40`, ['--card-glow' as string]: `${s.color}33` } as React.CSSProperties}
                      >
                        <div className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: s.color }}>Step {s.step}</div>
                        <h3 className="text-2xl font-bold mb-3" style={{ color: s.color }}>{s.title}</h3>
                        <p className="text-sm text-[var(--fg-muted)] leading-relaxed">{s.desc}</p>
                      </GlassCard>
                    </TiltCard>
                  ))}
                </div>
              </div>
            </div>

            {/* Panel 4: The Team */}
            <div className="w-screen h-screen flex items-center justify-center px-20 bg-[var(--bg-secondary)]">
              <div className="max-w-5xl w-full">
                <p className="text-xs uppercase tracking-widest text-neon font-semibold mb-4">Chapter 04</p>
                <h2 className="text-5xl font-black mb-3">The Team</h2>
                <p className="text-[var(--fg-muted)] mb-10 max-w-xl">
                  Pixellive runs on two kinds of intelligence. Both pull their weight, every day, on every account.
                </p>
                <div className="grid grid-cols-3 gap-6">
                  {team.map((m, i) => {
                    const color = m.color
                    const Icon = m.icon
                    return (
                      <TiltCard key={i} intensity={8}>
                        <GlassCard
                          className="p-5 text-left h-full"
                          glow
                          style={{ background: `linear-gradient(135deg, ${color}10 0%, transparent 60%), var(--glass)`, borderColor: `${color}40`, ['--card-glow' as string]: `${color}33` } as React.CSSProperties}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div
                              className="w-12 h-12 rounded-xl flex items-center justify-center"
                              style={{ background: `${color}20`, border: `1px solid ${color}40`, color }}
                            >
                              <Icon className="w-5 h-5" />
                            </div>
                            <span
                              className="text-[10px] font-mono uppercase tracking-widest px-2 py-1 rounded"
                              style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}
                            >
                              {m.kind}
                            </span>
                          </div>
                          <p className="font-semibold text-sm mb-1">{m.title}</p>
                          <p className="text-xs text-[var(--muted)] leading-relaxed">{m.desc}</p>
                        </GlassCard>
                      </TiltCard>
                    )
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mobile fallback for About panels */}
      <div className="md:hidden py-16 px-6 space-y-16">
        <div className="max-w-lg mx-auto">
          <h2 className="text-3xl font-black mb-6">Our Origin</h2>
          <div className="space-y-4 text-[var(--fg-muted)] leading-relaxed">
            <p className="text-[var(--fg)] text-xl font-bold">Pixellive is a new generation of digital agency.</p>
            <p>Traditional agencies scale by adding headcount. We scale with intelligence. By automating the heavy lifting—research, outreach, content scheduling, and deep analytics—with our proprietary AI backend, we&apos;ve eliminated the friction of the traditional agency model.</p>
            <p>This keeps our human team lean, senior, and entirely focused on what AI can&apos;t replicate: high-level strategy, creative direction, and human taste. You get the output and leverage of a massive agency, without the communication gaps or bloated fees.</p>
            <p className="text-[var(--fg)] font-semibold">One senior team. One intelligent backend. Real-time dashboard visibility. We handle the digital landscape so you can run your business.</p>
          </div>
        </div>

        <div className="max-w-lg mx-auto">
          <h2 className="text-3xl font-black mb-6">Our Philosophy</h2>
          <div className="space-y-4">
            {philosophy.map(p => (
              <GlassCard
                key={p.title}
                className="p-5"
                glow
                style={{ background: `linear-gradient(135deg, ${p.color}10 0%, transparent 60%), var(--glass)`, borderColor: `${p.color}40`, ['--card-glow' as string]: `${p.color}33` } as React.CSSProperties}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${p.color}15`, border: `1px solid ${p.color}30`, color: p.color }}
                  >
                    <p.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">{p.title}</h3>
                    <p className="text-sm text-[var(--fg-muted)]">{p.desc}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        <div className="max-w-lg mx-auto">
          <h2 className="text-3xl font-black mb-6">How We Work</h2>
          <div className="space-y-4">
            {howWeWork.map(s => (
              <GlassCard
                key={s.step}
                className="p-5"
                glow
                style={{ background: `linear-gradient(135deg, ${s.color}10 0%, transparent 60%), var(--glass)`, borderColor: `${s.color}40`, ['--card-glow' as string]: `${s.color}33` } as React.CSSProperties}
              >
                <div className="font-mono text-xs uppercase tracking-widest mb-2" style={{ color: s.color }}>Step {s.step}</div>
                <h3 className="text-xl font-bold mb-2" style={{ color: s.color }}>{s.title}</h3>
                <p className="text-sm text-[var(--fg-muted)] leading-relaxed">{s.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>

        <div className="max-w-lg mx-auto">
          <h2 className="text-3xl font-black mb-2">The Team</h2>
          <p className="text-[var(--fg-muted)] text-sm mb-6">Two kinds of intelligence. Both pull their weight.</p>
          <div className="grid grid-cols-2 gap-4">
            {team.map((m, i) => {
              const color = m.color
              const Icon = m.icon
              return (
                <GlassCard
                  key={i}
                  className="p-4"
                  glow
                  style={{ background: `linear-gradient(135deg, ${color}10 0%, transparent 60%), var(--glass)`, borderColor: `${color}40`, ['--card-glow' as string]: `${color}33` } as React.CSSProperties}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: `${color}20`, border: `1px solid ${color}40`, color }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span
                      className="text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded"
                      style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}
                    >
                      {m.kind}
                    </span>
                  </div>
                  <p className="font-semibold text-xs mb-1 leading-tight">{m.title}</p>
                  <p className="text-[10px] text-[var(--muted)] leading-relaxed">{m.desc}</p>
                </GlassCard>
              )
            })}
          </div>
        </div>
      </div>

      {/* CTA */}
      <section className="py-24 px-6 text-center border-t border-[var(--border-color)]">
        <BlurFadeIn>
          <h2 className="text-4xl font-black mb-4">Ready to work together?</h2>
          <p className="text-[var(--fg-muted)] mb-8">Let's create something extraordinary.</p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold bg-neon text-white hover:bg-neon/90 transition-all hover:shadow-[0_0_32px_rgba(236,28,36,0.5)]"
          >
            Start a Project <ArrowRight className="w-4 h-4" />
          </Link>
        </BlurFadeIn>
      </section>
    </PageTransition>
  )
}
