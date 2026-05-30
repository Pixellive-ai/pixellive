import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  Search, Megaphone, Bot, Share2, Code2, Sparkles, FileText, Video,
  ChevronDown, ArrowRight, Star, Play,
} from 'lucide-react'
import { PageTransition } from '@/components/ui/page-transition'
import { ParticleField } from '@/components/ui/particle-field'
import { AuroraBackground } from '@/components/ui/aurora-bg'
import { BackgroundBeams } from '@/components/ui/bg-beams'
import { TextGenerateEffect } from '@/components/ui/text-generate'
import CodeAscii from '@/components/CodeAscii'
import { BentoGrid, BentoCell } from '@/components/ui/bento-grid'
import { SpotlightCard } from '@/components/ui/spotlight-card'
import { BorderBeam } from '@/components/ui/border-beam'
import { NumberTicker } from '@/components/ui/number-ticker'
import { Marquee } from '@/components/ui/marquee'
import { TiltCard } from '@/components/ui/tilt-card'
import { BlurFadeIn } from '@/components/ui/blur-fade'
import { GlassCard } from '@/components/ui/glass-card'
import { StaggerChildren, StaggerItem } from '@/components/ui/animated-beam'
import { useSEO } from '@/lib/seo'

const services = [
  {
    icon: Bot,
    title: 'AI Automation & Lead Generation',
    desc: 'We build and run AI systems that bring you customers — leads, content, and reporting handled end-to-end. Done-for-you.',
    tag: 'AI Ops',
    colSpan: 2 as const,
    color: '#00F0FF',
  },
  {
    icon: Sparkles,
    title: 'AI Web Development',
    desc: 'Websites and apps with AI built in — chat, search, personalization, on-page agents.',
    tag: 'AI Web',
    colSpan: 1 as const,
    color: '#60A5FA',
  },
  {
    icon: Search,
    title: 'SEO',
    desc: 'Dominate organic search with data-driven strategies.',
    tag: 'Search',
    colSpan: 1 as const,
    color: '#7B61FF',
  },
  {
    icon: Megaphone,
    title: 'SEM & Paid Ads',
    desc: 'High-ROI paid campaigns across Google, Meta & beyond.',
    tag: 'Paid',
    colSpan: 1 as const,
    color: '#FF61DC',
  },
  {
    icon: Share2,
    title: 'Social Media',
    desc: 'Always-on content, posting, and engagement across your channels.',
    tag: 'Social',
    colSpan: 1 as const,
    color: '#FF8A3D',
  },
  {
    icon: Code2,
    title: 'Web & App Development',
    desc: 'Fast, conversion-focused websites and apps, built to scale.',
    tag: 'Build',
    colSpan: 1 as const,
    color: '#3DD68C',
  },
  {
    icon: FileText,
    title: 'Content Planning',
    desc: 'Editorial calendars, blog content, and systems that build brand authority.',
    tag: 'Strategy',
    colSpan: 1 as const,
    color: '#FFB800',
  },
  {
    icon: Video,
    title: 'Video Production',
    desc: 'Cinema-grade brand films, reels, and campaign creative.',
    tag: 'Creative',
    colSpan: 1 as const,
    color: '#A78BFA',
  },
]

const stats = [
  { value: 250, suffix: '+', label: 'Projects Delivered' },
  { value: 120, suffix: '+', label: 'Happy Clients' },
  { value: 50, suffix: 'M+', label: 'Views Generated' },
  { value: 8, suffix: ' yrs', label: 'In the Industry' },
]

const clients = [
  'TechCorp', 'Nexus Media', 'Orbit Brand', 'Velocity Co', 'Apex Digital',
  'NovaCraft', 'Stellar Inc', 'PulseAds', 'CoreMind', 'ZenithGroup',
]

const works = [
  {
    title: 'Orbital Brand Campaign',
    category: 'Video Production',
    bg: 'from-cyan-900/50 to-blue-900/30',
  },
  {
    title: 'Search Domination',
    category: 'SEO + Content',
    bg: 'from-purple-900/50 to-indigo-900/30',
  },
  {
    title: 'Paid Media Overhaul',
    category: 'SEM + Ads',
    bg: 'from-pink-900/50 to-rose-900/30',
  },
]

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'CMO, TechCorp',
    text: 'Pixel Live transformed our digital presence. The video campaign they produced generated 2M views in 30 days.',
    rating: 5,
  },
  {
    name: 'Marcus Rivera',
    role: 'Founder, Nexus Media',
    text: 'Our organic traffic tripled in 6 months. Their SEO strategy is nothing short of exceptional.',
    rating: 5,
  },
  {
    name: 'Priya Nair',
    role: 'Growth Lead, Velocity Co',
    text: 'The paid media ROI we achieved with Pixel Live was 4x what we expected. Truly world-class.',
    rating: 5,
  },
]

export default function Home() {
  useSEO('Home', 'AI-powered digital agency — AI automation & lead generation, SEO, paid ads, social, and web development. Done-for-you.')
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })

  const layer1Y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const layer2Y = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const layer3Y = useTransform(scrollYProgress, [0, 1], ['0%', '8%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <PageTransition>
      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y: layer1Y }}>
          <div className="absolute inset-0 bg-[var(--bg)]" />
          <div className="bg-grid-pattern absolute inset-0 opacity-40" />
          <ParticleField />
        </motion.div>

        <motion.div className="absolute inset-0 pointer-events-none" style={{ y: layer2Y }}>
          <AuroraBackground className="absolute inset-0" />
        </motion.div>

        <motion.div className="absolute inset-0 pointer-events-none" style={{ y: layer3Y }}>
          <BackgroundBeams />
        </motion.div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 text-center px-6 max-w-5xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[var(--neon)]/30 text-xs font-semibold text-neon uppercase tracking-widest mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-neon animate-pulse" />
            AI-Powered Digital Agency
          </motion.div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tight mb-6">
            <TextGenerateEffect text="We Build Worlds." className="block text-[var(--fg)]" />
            <TextGenerateEffect
              text="You Conquer Them."
              className="block text-gradient-neon"
              delay={0.8}
            />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.6 }}
            className="text-lg md:text-xl text-[var(--fg-muted)] max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            We handle your entire online presence — leads, content, ads, and automation —
            so you don't have to think about it. AI-powered, done-for-you.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.9 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/services"
              className="group flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold bg-neon text-white hover:bg-neon/90 transition-all hover:shadow-[0_0_32px_rgba(236,28,36,0.5)] hover:-translate-y-0.5"
            >
              View Our Work
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/contact"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold glass-panel border border-white/10 hover:border-neon/30 transition-all hover:-translate-y-0.5"
            >
              <Play className="w-4 h-4 text-neon" />
              Talk to Us
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-6 h-6 text-neon/50" />
        </motion.div>
      </section>

      {/* Mission Control */}
      <section className="relative py-24 px-6 overflow-hidden">
        {/* Animation runs full-width behind */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <CodeAscii fillParent />
        </div>
        {/* Shield carves out the content column so the animation only shows in side margins */}
        <div
          className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-full max-w-6xl pointer-events-none z-[1]"
          style={{ backgroundColor: 'var(--bg)' }}
        />
        <div className="max-w-6xl mx-auto relative z-10">
          <BlurFadeIn className="text-center mb-16">
            <p className="text-xs uppercase tracking-widest text-neon font-semibold mb-3">Mission Control</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              Everything your brand needs,<br />
              <span className="text-gradient">in one command center.</span>
            </h2>
            <p className="text-[var(--fg-muted)] max-w-xl mx-auto">
              From AI lead generation to done-for-you content and ads — we run every lever of your digital growth.
            </p>
          </BlurFadeIn>

          <BentoGrid>
            {services.map((svc, i) => (
              <BentoCell key={svc.title} colSpan={svc.colSpan}>
                <BlurFadeIn delay={i * 0.08} className="h-full">
                  <TiltCard intensity={8} className="h-full">
                    <SpotlightCard className="h-full group">
                      <div
                        className="relative h-full rounded-2xl p-6 overflow-hidden min-h-[200px] flex flex-col justify-between border transition-colors"
                        style={{
                          background: `linear-gradient(135deg, ${svc.color}10 0%, transparent 60%), var(--glass)`,
                          borderColor: `${svc.color}40`,
                        }}
                      >
                        <div>
                          <div
                            className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                            style={{ background: `${svc.color}15`, border: `1px solid ${svc.color}30` }}
                          >
                            <svc.icon className="w-5 h-5" style={{ color: svc.color }} />
                          </div>
                          <h3 className="text-xl font-bold mb-2">{svc.title}</h3>
                          <p className="text-sm text-[var(--fg-muted)] leading-relaxed">{svc.desc}</p>
                        </div>
                        <span
                          className="mt-4 self-start text-xs font-semibold px-3 py-1 rounded-full"
                          style={{
                            background: `${svc.color}15`,
                            color: svc.color,
                            border: `1px solid ${svc.color}30`,
                          }}
                        >
                          {svc.tag}
                        </span>
                      </div>
                    </SpotlightCard>
                  </TiltCard>
                </BlurFadeIn>
              </BentoCell>
            ))}
          </BentoGrid>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-6 border-y border-[var(--border-color)] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon/30 to-transparent" />
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <BlurFadeIn key={stat.label} delay={i * 0.1} className="text-center">
              <div className="text-4xl md:text-5xl font-black text-neon mb-2">
                <NumberTicker value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-sm text-[var(--fg-muted)] font-medium">{stat.label}</p>
            </BlurFadeIn>
          ))}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon/30 to-transparent" />
      </section>

      {/* Clients Marquee */}
      <section className="py-16 overflow-hidden">
        <BlurFadeIn className="text-center mb-8">
          <p className="text-xs uppercase tracking-widest text-[var(--muted)] font-semibold">
            Trusted by industry leaders
          </p>
        </BlurFadeIn>
        <div className="group space-y-4">
          <Marquee>
            {clients.map(c => (
              <div
                key={c}
                className="px-8 py-3 glass-panel rounded-xl text-sm font-semibold text-[var(--fg-muted)] whitespace-nowrap border border-[var(--border-color)] hover:border-neon/20 hover:text-neon transition-colors"
              >
                {c}
              </div>
            ))}
          </Marquee>
          <Marquee reverse>
            {clients.slice().reverse().map(c => (
              <div
                key={c + '-r'}
                className="px-8 py-3 glass-panel rounded-xl text-sm font-semibold text-[var(--fg-muted)] whitespace-nowrap border border-[var(--border-color)] hover:border-neon/20 hover:text-neon transition-colors"
              >
                {c}
              </div>
            ))}
          </Marquee>
        </div>
      </section>

      {/* Featured Work */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <BlurFadeIn className="text-center mb-16">
            <p className="text-xs uppercase tracking-widest text-neon font-semibold mb-3">Our Work</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">
              Stories that <span className="text-gradient">moved the needle.</span>
            </h2>
          </BlurFadeIn>

          <StaggerChildren className="grid md:grid-cols-3 gap-6">
            {works.map(work => (
              <StaggerItem key={work.title}>
                <TiltCard className="h-full">
                  <div
                    className={`relative h-64 rounded-2xl bg-gradient-to-br ${work.bg} border border-[var(--border-color)] overflow-hidden group`}
                  >
                    <div className="absolute inset-0 bg-grid-pattern opacity-20" />
                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                      <span className="text-xs font-semibold text-neon uppercase tracking-widest mb-2">
                        {work.category}
                      </span>
                      <h3 className="text-xl font-bold">{work.title}</h3>
                    </div>
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-full glass-panel border border-neon/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-4 h-4 text-neon" />
                    </div>
                  </div>
                </TiltCard>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-[var(--bg-secondary)]">
        <div className="max-w-6xl mx-auto">
          <BlurFadeIn className="text-center mb-16">
            <p className="text-xs uppercase tracking-widest text-neon font-semibold mb-3">Client Stories</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">
              Results that <span className="text-gradient">speak loudest.</span>
            </h2>
          </BlurFadeIn>

          <StaggerChildren className="grid md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <StaggerItem key={t.name}>
                <GlassCard className="p-6 h-full" glow>
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-neon fill-neon" />
                    ))}
                  </div>
                  <p className="text-sm text-[var(--fg-muted)] leading-relaxed mb-6">"{t.text}"</p>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-[var(--muted)]">{t.role}</p>
                  </div>
                </GlassCard>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* CTA Banner */}
      <AuroraBackground>
        <section className="py-32 px-6 text-center relative">
          <BlurFadeIn>
            <p className="text-xs uppercase tracking-widest text-neon font-semibold mb-4">Ready to launch?</p>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
              Let's build something<br />
              <span className="text-gradient-neon">extraordinary.</span>
            </h2>
            <p className="text-[var(--fg-muted)] max-w-lg mx-auto mb-10">
              Book a free strategy call and discover how Pixel Live can 10x your digital presence.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl font-bold bg-neon text-white hover:bg-neon/90 transition-all hover:shadow-[0_0_40px_rgba(236,28,36,0.5)] hover:-translate-y-1 text-lg"
            >
              Start Your Project
              <ArrowRight className="w-5 h-5" />
            </Link>
          </BlurFadeIn>
        </section>
      </AuroraBackground>
    </PageTransition>
  )
}
