import { Link } from 'react-router-dom'
import { Video, Search, Megaphone, FileText, CheckCircle, ArrowRight, Bot, Share2, Code2, Sparkles } from 'lucide-react'
import { PageTransition } from '@/components/ui/page-transition'
import { AuroraBackground } from '@/components/ui/aurora-bg'
import { TiltCard } from '@/components/ui/tilt-card'
import { BlurFadeIn } from '@/components/ui/blur-fade'
import { GlassCard } from '@/components/ui/glass-card'
import { SpotlightCard } from '@/components/ui/spotlight-card'
import { BentoGrid, BentoCell } from '@/components/ui/bento-grid'
import { AnimatedBeam } from '@/components/ui/animated-beam'
import { BorderBeam } from '@/components/ui/border-beam'
import { useSEO } from '@/lib/seo'

const services = [
  {
    icon: Bot,
    title: 'AI Automation & Lead Generation',
    desc: 'We build and run AI systems that bring you customers — leads found, outreach sent, content posted, results reported. Done-for-you, so you never have to think about it.',
    color: '#00F0FF',
    features: [
      'AI lead generation — qualified prospects on autopilot',
      'Done-for-you outreach & follow-up',
      'Custom AI agents for your business operations',
      'A live dashboard of your automation working',
      'We run it, watch it, fix it, and keep it improving',
    ],
    deliverables: ['Your own ops dashboard', 'Qualified leads delivered', 'Monthly performance reports', 'Continuous tuning & upgrades'],
    tools: ['Custom AI Agents', 'LLM Workflows', 'CRM & Email Automation', 'Analytics Dashboards'],
  },
  {
    icon: Sparkles,
    title: 'AI Web Development',
    desc: 'Websites and apps with intelligence built in — conversational chat, AI-powered search, personalization engines, and on-page agents that act on your customers’ behalf.',
    color: '#60A5FA',
    features: [
      'Conversational AI / chatbot integration',
      'AI-powered search & recommendations',
      'Personalization & dynamic content',
      'Custom dashboards with live agents',
      'RAG / knowledge-base setups for internal tools',
    ],
    deliverables: ['Production-ready AI app or site', 'Trained prompts & flows', 'Live agent dashboard', 'API & data integrations'],
    tools: ['OpenAI / Anthropic APIs', 'Vector Databases', 'Vercel AI SDK', 'Custom Agents'],
  },
  {
    icon: Search,
    title: 'Search Engine Optimization',
    desc: 'Sustainable, scalable organic growth through technical excellence and compelling content strategy.',
    color: '#7B61FF',
    features: [
      'Technical SEO audits',
      'Keyword & intent mapping',
      'On-page & off-page optimization',
      'Content cluster strategy',
      'Link acquisition',
    ],
    deliverables: ['Monthly ranking reports', 'Site audit documents', 'Content briefs', 'Backlink reports'],
    tools: ['Ahrefs', 'Screaming Frog', 'SurferSEO', 'GSC'],
  },
  {
    icon: Megaphone,
    title: 'SEM & Paid Advertising',
    desc: 'High-performance paid campaigns engineered for ROAS. Every dollar works harder.',
    color: '#FF61DC',
    features: [
      'Google Search & Shopping',
      'Meta & Instagram Ads',
      'YouTube Advertising',
      'Retargeting & lookalikes',
      'Conversion rate optimization',
    ],
    deliverables: ['Campaign dashboards', 'Weekly performance reports', 'A/B test results', 'Budget recommendations'],
    tools: ['Google Ads', 'Meta Ads Manager', 'Triple Whale', 'Northbeam'],
  },
  {
    icon: Share2,
    title: 'Social Media Management',
    desc: 'An always-on social presence — we plan, create, post, and engage across your channels, then report what is actually working.',
    color: '#FF8A3D',
    features: [
      'Content calendar & consistent posting',
      'On-brand graphics & captions',
      'Community engagement & replies',
      'Instagram, LinkedIn & more',
      'Monthly growth & reach reporting',
    ],
    deliverables: ['Monthly content calendar', 'Branded post creatives', 'Engagement summary', 'Growth & reach reports'],
    tools: ['Meta Business Suite', 'Buffer', 'Canva', 'AI-Assisted Drafting'],
  },
  {
    icon: Code2,
    title: 'Web & App Development',
    desc: 'Fast, beautiful, conversion-focused websites and apps — built on a modern stack and ready to scale with you.',
    color: '#3DD68C',
    features: [
      'Marketing websites & landing pages',
      'Web & mobile applications',
      'Brand & visual identity',
      'Conversion-rate optimization',
      'Ongoing maintenance & updates',
    ],
    deliverables: ['Production-ready site or app', 'Source code & handover', 'Brand & design system', 'Maintenance plan'],
    tools: ['React', 'Next.js', 'TypeScript', 'Tailwind'],
  },
  {
    icon: FileText,
    title: 'Content Planning',
    desc: 'Strategic content ecosystems that nurture audiences, build authority, and drive conversions.',
    color: '#FFB800',
    features: [
      'Editorial calendar development',
      'Blog & long-form content',
      'Social content systems',
      'Email sequences',
      'Content repurposing workflows',
    ],
    deliverables: ['90-day content calendar', 'Brand voice guide', 'Template library', 'Monthly analytics recap'],
    tools: ['Notion', 'Airtable', 'HubSpot', 'Jasper'],
  },
  {
    icon: Video,
    title: 'Video Production',
    desc: 'The creative-quality layer. Cinematographer-led production so your brand never looks like everyone else — from concept to final cut.',
    color: '#A78BFA',
    features: [
      'Brand films & documentaries',
      'Social media reels & shorts',
      'TV & OTT commercials',
      'Corporate & event coverage',
      'Motion graphics & animation',
    ],
    deliverables: ['4K / 6K footage', 'Color graded masters', 'Platform-optimized cuts', 'Raw project files'],
    tools: ['Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Cinema 4D'],
  },
]

export default function Services() {
  useSEO('Services', 'Explore Pixel Live\'s full-service offerings — Video, SEO, Ads, and Content.')

  return (
    <PageTransition>
      <AuroraBackground>
        <section className="pt-40 pb-24 px-6 text-center relative">
          <BlurFadeIn>
            <p className="text-xs uppercase tracking-widest text-neon font-semibold mb-4">What We Do</p>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
              Every service you need.<br />
              <span className="text-gradient-neon">Zero compromise.</span>
            </h1>
            <p className="text-[var(--fg-muted)] max-w-xl mx-auto text-lg leading-relaxed">
              An integrated suite of digital services designed to build brands, capture audiences, and convert at scale.
            </p>
          </BlurFadeIn>
        </section>
      </AuroraBackground>

      {services.map((svc, i) => (
        <section
          key={svc.title}
          className={`py-24 px-6 ${i % 2 === 1 ? 'bg-[var(--bg-secondary)]' : 'bg-[var(--bg)]'}`}
        >
          <div className="max-w-6xl mx-auto">
            <div className={`flex flex-col lg:flex-row gap-12 items-center ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              <BlurFadeIn className="flex-1" direction={i % 2 === 1 ? 'right' : 'left'} delay={0}>
                <TiltCard intensity={8}>
                  <SpotlightCard className="h-full">
                    <div
                      className="relative rounded-2xl p-8 border overflow-hidden min-h-[360px] flex flex-col justify-between"
                      style={{
                        background: `linear-gradient(135deg, ${svc.color}08 0%, transparent 60%)`,
                        borderColor: `${svc.color}30`,
                      }}
                    >
                      <BorderBeam colorFrom={svc.color} colorTo={svc.color + '88'} duration={4} />
                      <div>
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                          style={{ background: `${svc.color}15`, border: `1px solid ${svc.color}30` }}
                        >
                          <svc.icon className="w-7 h-7" style={{ color: svc.color }} />
                        </div>
                        <h3 className="text-3xl font-bold mb-4">{svc.title}</h3>
                        <AnimatedBeam className="mb-4" />
                        <p className="text-[var(--fg-muted)] leading-relaxed">{svc.desc}</p>
                      </div>

                      <div className="mt-6 flex flex-wrap gap-2">
                        {svc.tools.map(tool => (
                          <span
                            key={tool}
                            className="text-xs px-3 py-1 rounded-full font-medium"
                            style={{
                              background: `${svc.color}12`,
                              border: `1px solid ${svc.color}25`,
                              color: svc.color,
                            }}
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  </SpotlightCard>
                </TiltCard>
              </BlurFadeIn>

              <BlurFadeIn className="flex-1 space-y-6" direction={i % 2 === 1 ? 'left' : 'right'} delay={0.15}>
                <div>
                  <p className="text-xs uppercase tracking-widest font-semibold mb-4" style={{ color: svc.color }}>
                    What's included
                  </p>
                  <ul className="space-y-3">
                    {svc.features.map(f => (
                      <li key={f} className="flex items-start gap-3 text-sm text-[var(--fg-muted)]">
                        <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: svc.color }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <GlassCard className="p-5" glow>
                  <p className="text-xs uppercase tracking-widest font-semibold text-[var(--muted)] mb-3">Deliverables</p>
                  <div className="grid grid-cols-2 gap-2">
                    {svc.deliverables.map(d => (
                      <div
                        key={d}
                        className="text-xs px-3 py-2 rounded-lg glass-panel border border-[var(--border-color)] text-[var(--fg-muted)]"
                      >
                        {d}
                      </div>
                    ))}
                  </div>
                </GlassCard>

                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5"
                  style={{
                    background: `${svc.color}15`,
                    border: `1px solid ${svc.color}40`,
                    color: svc.color,
                  }}
                >
                  Get a proposal <ArrowRight className="w-4 h-4" />
                </Link>
              </BlurFadeIn>
            </div>
          </div>
        </section>
      ))}

      {/* Tools BentoGrid */}
      <section className="py-24 px-6 bg-[var(--bg-secondary)]">
        <div className="max-w-6xl mx-auto">
          <BlurFadeIn className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-neon font-semibold mb-3">Our Toolkit</p>
            <h2 className="text-4xl font-black">Built on industry-leading platforms.</h2>
          </BlurFadeIn>

          <BentoGrid>
            {[
              { title: 'Production', items: ['RED Cinema', 'ARRI Alexa', 'DJI Drones', 'Aputure Lighting'], colSpan: 1 as const },
              { title: 'Search & Analytics', items: ['Google Analytics 4', 'Ahrefs', 'Screaming Frog', 'Looker Studio'], colSpan: 1 as const },
              { title: 'Paid Media', items: ['Google Ads', 'Meta Ads', 'TikTok Ads', 'LinkedIn Ads'], colSpan: 1 as const },
            ].map(cat => (
              <BentoCell key={cat.title} colSpan={cat.colSpan}>
                <SpotlightCard className="h-full">
                  <GlassCard className="p-6 h-full min-h-[180px]" glow>
                    <p className="text-xs uppercase tracking-widest font-semibold text-neon mb-4">{cat.title}</p>
                    <div className="space-y-2">
                      {cat.items.map(item => (
                        <div key={item} className="text-sm text-[var(--fg-muted)] flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-neon/50 shrink-0" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </SpotlightCard>
              </BentoCell>
            ))}
          </BentoGrid>
        </div>
      </section>
    </PageTransition>
  )
}
