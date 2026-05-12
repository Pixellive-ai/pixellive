import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Users, Lightbulb, Target, Heart, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageTransition } from '@/components/ui/page-transition'
import { AuroraBackground } from '@/components/ui/aurora-bg'
import { GlassCard } from '@/components/ui/glass-card'
import { BlurFadeIn } from '@/components/ui/blur-fade'
import { NumberTicker } from '@/components/ui/number-ticker'
import { TiltCard } from '@/components/ui/tilt-card'
import { StaggerChildren, StaggerItem } from '@/components/ui/animated-beam'
import { OrbitingCircles, OrbitRing } from '@/components/ui/orbiting-circles'
import { useSEO } from '@/lib/seo'
import { Video, Search, Megaphone, FileText } from 'lucide-react'

const philosophy = [
  {
    icon: Lightbulb,
    title: 'Creative First',
    desc: 'Every strategy starts with a bold creative vision. We never sacrifice storytelling for metrics.',
  },
  {
    icon: Target,
    title: 'Data Driven',
    desc: 'Every creative decision is backed by data. We measure what matters and iterate relentlessly.',
  },
  {
    icon: Heart,
    title: 'Client Obsessed',
    desc: 'Your success is our success. We embed ourselves in your growth as a true digital partner.',
  },
]

const team = [
  { name: 'Alex Kim', role: 'Creative Director', initials: 'AK', color: '#00F0FF' },
  { name: 'Jordan Lee', role: 'Head of SEO', initials: 'JL', color: '#7B61FF' },
  { name: 'Mia Torres', role: 'Paid Media Lead', initials: 'MT', color: '#FF61DC' },
  { name: 'Sam Patel', role: 'Video Producer', initials: 'SP', color: '#FFB800' },
  { name: 'Riley Chen', role: 'Content Strategist', initials: 'RC', color: '#00FF94' },
  { name: 'Devon Walsh', role: 'Analytics Lead', initials: 'DW', color: '#FF6B35' },
]

const milestones = [
  { year: '2016', event: 'Founded in a small studio in San Francisco' },
  { year: '2018', event: 'First 50 clients — expanded to video production' },
  { year: '2020', event: 'Launched full-service digital department' },
  { year: '2022', event: '100M+ views generated for clients globally' },
  { year: '2024', event: '250+ projects, 120+ clients, 8 years of impact' },
]

const stats = [
  { value: 250, suffix: '+', label: 'Projects' },
  { value: 120, suffix: '+', label: 'Clients' },
  { value: 50, suffix: 'M+', label: 'Views' },
  { value: 8, suffix: ' yrs', label: 'Experience' },
]

export default function About() {
  useSEO('About Us', 'Learn the story behind Pixel Live Production — our origin, philosophy, and team.')
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] })
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-60%'])

  return (
    <PageTransition>
      {/* Hero */}
      <AuroraBackground>
        <section className="pt-40 pb-24 px-6 text-center relative">
          <BlurFadeIn>
            <p className="text-xs uppercase tracking-widest text-neon font-semibold mb-4">Our Story</p>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
              Built by creators.<br />
              <span className="text-gradient-neon">Driven by results.</span>
            </h1>
            <p className="text-[var(--fg-muted)] max-w-xl mx-auto text-lg leading-relaxed">
              Pixel Live was born from the belief that exceptional digital work should be accessible, measurable, and unforgettable.
            </p>
          </BlurFadeIn>
        </section>
      </AuroraBackground>

      {/* Horizontal Scroll Storytelling */}
      <section ref={containerRef} className="relative hidden md:block" style={{ height: '400vh' }}>
        <div className="sticky top-0 h-screen overflow-hidden">
          <motion.div style={{ x }} className="flex h-full w-[400%]">
            {/* Panel 1: Origin */}
            <div className="w-screen h-screen flex items-center justify-center px-20 bg-[var(--bg)]">
              <div className="max-w-2xl">
                <p className="text-xs uppercase tracking-widest text-neon font-semibold mb-4">Chapter 01</p>
                <h2 className="text-5xl font-black mb-6">Our Origin</h2>
                <p className="text-[var(--fg-muted)] text-lg leading-relaxed mb-8">
                  In 2016, two creatives and one data scientist sat in a San Francisco garage with a single mission: make brands impossible to ignore. What started as a scrappy video production shop grew into one of the most integrated digital agencies on the West Coast.
                </p>
                <div className="space-y-3">
                  {milestones.map(m => (
                    <div key={m.year} className="flex items-start gap-4">
                      <span className="text-neon font-bold text-sm w-10 shrink-0">{m.year}</span>
                      <span className="text-[var(--fg-muted)] text-sm">{m.event}</span>
                    </div>
                  ))}
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
                    <GlassCard key={p.title} className="p-6" glow>
                      <div className="w-10 h-10 rounded-xl bg-neon/10 border border-neon/20 flex items-center justify-center mb-4">
                        <p.icon className="w-5 h-5 text-neon" />
                      </div>
                      <h3 className="font-bold mb-2">{p.title}</h3>
                      <p className="text-sm text-[var(--fg-muted)] leading-relaxed">{p.desc}</p>
                    </GlassCard>
                  ))}
                </div>
              </div>
            </div>

            {/* Panel 3: Team */}
            <div className="w-screen h-screen flex items-center justify-center px-20 bg-[var(--bg)]">
              <div className="max-w-4xl w-full">
                <p className="text-xs uppercase tracking-widest text-neon font-semibold mb-4">Chapter 03</p>
                <h2 className="text-5xl font-black mb-10">Our Team</h2>
                <div className="grid grid-cols-3 gap-6">
                  {team.map(member => (
                    <TiltCard key={member.name} intensity={8}>
                      <GlassCard className="p-5 text-center" glow>
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold mx-auto mb-3"
                          style={{ background: `${member.color}20`, border: `1px solid ${member.color}40`, color: member.color }}
                        >
                          {member.initials}
                        </div>
                        <p className="font-semibold text-sm">{member.name}</p>
                        <p className="text-xs text-[var(--muted)] mt-1">{member.role}</p>
                      </GlassCard>
                    </TiltCard>
                  ))}
                </div>
              </div>
            </div>

            {/* Panel 4: Numbers */}
            <div className="w-screen h-screen flex items-center justify-center px-20 bg-[var(--bg-secondary)]">
              <div className="max-w-3xl w-full text-center">
                <p className="text-xs uppercase tracking-widest text-neon font-semibold mb-4">Chapter 04</p>
                <h2 className="text-5xl font-black mb-12">Our Numbers</h2>
                <div className="grid grid-cols-2 gap-8 mb-12">
                  {stats.map(s => (
                    <div key={s.label} className="p-8 glass-panel rounded-2xl border border-[var(--border-color)]">
                      <div className="text-5xl font-black text-neon mb-2">
                        <NumberTicker value={s.value} suffix={s.suffix} />
                      </div>
                      <p className="text-[var(--fg-muted)] font-medium">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Orbit visualization */}
                <div className="relative h-40 flex items-center justify-center">
                  <div className="relative w-40 h-40">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-xl bg-neon/10 border border-neon/40 flex items-center justify-center">
                        <Users className="w-6 h-6 text-neon" />
                      </div>
                    </div>
                    <OrbitRing radius={56}>
                      <OrbitingCircles radius={56} duration={6} icon={<Video className="w-4 h-4" />} />
                    </OrbitRing>
                    <OrbitRing radius={80}>
                      <OrbitingCircles radius={80} duration={10} reverse icon={<Search className="w-4 h-4" />} />
                    </OrbitRing>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mobile fallback for About panels */}
      <div className="md:hidden py-16 px-6 space-y-16">
        <div className="max-w-lg mx-auto">
          <h2 className="text-3xl font-black mb-6">Our Philosophy</h2>
          <div className="space-y-4">
            {philosophy.map(p => (
              <GlassCard key={p.title} className="p-5" glow>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-neon/10 border border-neon/20 flex items-center justify-center shrink-0">
                    <p.icon className="w-5 h-5 text-neon" />
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
          <h2 className="text-3xl font-black mb-6">Our Team</h2>
          <div className="grid grid-cols-2 gap-4">
            {team.map(member => (
              <GlassCard key={member.name} className="p-4 text-center">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold mx-auto mb-2"
                  style={{ background: `${member.color}20`, border: `1px solid ${member.color}40`, color: member.color }}
                >
                  {member.initials}
                </div>
                <p className="font-semibold text-sm">{member.name}</p>
                <p className="text-xs text-[var(--muted)] mt-0.5">{member.role}</p>
              </GlassCard>
            ))}
          </div>
        </div>

        <div className="max-w-lg mx-auto">
          <h2 className="text-3xl font-black mb-6">Our Numbers</h2>
          <div className="grid grid-cols-2 gap-4">
            {stats.map(s => (
              <div key={s.label} className="p-6 glass-panel rounded-2xl border border-[var(--border-color)] text-center">
                <div className="text-4xl font-black text-neon mb-1">
                  <NumberTicker value={s.value} suffix={s.suffix} />
                </div>
                <p className="text-[var(--fg-muted)] text-sm">{s.label}</p>
              </div>
            ))}
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
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold bg-neon text-black hover:bg-neon/90 transition-all hover:shadow-[0_0_32px_rgba(0,240,255,0.5)]"
          >
            Start a Project <ArrowRight className="w-4 h-4" />
          </Link>
        </BlurFadeIn>
      </section>
    </PageTransition>
  )
}
