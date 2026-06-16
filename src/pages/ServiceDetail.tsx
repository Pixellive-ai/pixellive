import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CheckCircle, Compass } from 'lucide-react'
import { PageTransition } from '@/components/ui/page-transition'
import { AuroraBackground } from '@/components/ui/aurora-bg'
import { BlurFadeIn } from '@/components/ui/blur-fade'
import { GlassCard } from '@/components/ui/glass-card'
import { SpotlightCard } from '@/components/ui/spotlight-card'
import { BorderBeam } from '@/components/ui/border-beam'
import { useSEO } from '@/lib/seo'
import { services } from '@/pages/Services'

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>()
  const service = services.find(s => s.slug === slug)

  useSEO(
    service ? service.title : 'Service not found',
    service ? service.desc : 'This service could not be found.',
  )

  if (!service) {
    return (
      <PageTransition>
        <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-[var(--bg)] relative overflow-hidden">
          <div className="bg-grid-pattern absolute inset-0 opacity-30" />
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-black mb-4">Service not found.</h1>
            <p className="text-[var(--fg-muted)] mb-8 max-w-sm mx-auto">
              The service you're looking for doesn't exist or has moved.
            </p>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-neon/10 border border-neon/40 text-neon hover:bg-neon/20 transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Back to all services
            </Link>
          </div>
        </section>
      </PageTransition>
    )
  }

  const { color, icon: Icon, title, desc, features, deliverables, tools } = service

  return (
    <PageTransition>
      {/* Hero */}
      <AuroraBackground>
        <section className="pt-40 pb-20 px-6 relative">
          <div className="max-w-4xl mx-auto">
            <BlurFadeIn>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--fg-muted)] hover:text-neon transition-colors mb-8"
              >
                <ArrowLeft className="w-4 h-4" /> Back to all services
              </Link>

              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: `${color}15`, border: `1px solid ${color}30` }}
                >
                  <Icon className="w-8 h-8" style={{ color }} />
                </div>
                <span
                  className="text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-widest"
                  style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}
                >
                  Pixellive Production
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">{title}</h1>
              <p className="text-lg md:text-xl text-[var(--fg-muted)] max-w-2xl leading-relaxed">{desc}</p>
            </BlurFadeIn>
          </div>
        </section>
      </AuroraBackground>

      {/* What's included */}
      <section className="py-20 px-6 bg-[var(--bg)]">
        <div className="max-w-4xl mx-auto">
          <BlurFadeIn>
            <p className="text-xs uppercase tracking-widest font-semibold mb-6" style={{ color }}>
              What's included
            </p>
            <ul className="grid sm:grid-cols-2 gap-4">
              {features.map(f => (
                <li
                  key={f}
                  className="flex items-start gap-3 text-sm text-[var(--fg-muted)] glass-panel border border-[var(--border-color)] rounded-xl p-4"
                >
                  <CheckCircle className="w-5 h-5 mt-0.5 shrink-0" style={{ color }} />
                  {f}
                </li>
              ))}
            </ul>
          </BlurFadeIn>
        </div>
      </section>

      {/* What you get */}
      <section className="py-20 px-6 bg-[var(--bg-secondary)]">
        <div className="max-w-4xl mx-auto">
          <BlurFadeIn>
            <p className="text-xs uppercase tracking-widest font-semibold mb-6" style={{ color }}>
              What you get
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {deliverables.map(d => (
                <div
                  key={d}
                  className="flex items-center gap-3 text-sm text-[var(--fg-muted)] rounded-xl p-4"
                  style={{
                    background: `linear-gradient(135deg, ${color}08 0%, transparent 60%)`,
                    border: `1px solid ${color}25`,
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />
                  {d}
                </div>
              ))}
            </div>

            {tools && tools.length > 0 && (
              <div className="mt-10">
                <p className="text-xs uppercase tracking-widest font-semibold text-[var(--muted)] mb-4">
                  Tools & platforms
                </p>
                <div className="flex flex-wrap gap-2">
                  {tools.map(tool => (
                    <span
                      key={tool}
                      className="text-xs px-3 py-1 rounded-full font-medium"
                      style={{ background: `${color}12`, border: `1px solid ${color}25`, color }}
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </BlurFadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-[var(--bg)]">
        <div className="max-w-4xl mx-auto">
          <BlurFadeIn>
            <SpotlightCard>
              <div
                className="relative rounded-2xl p-10 md:p-14 border overflow-hidden text-center"
                style={{
                  background: `linear-gradient(135deg, ${color}10 0%, transparent 60%)`,
                  borderColor: `${color}30`,
                }}
              >
                <BorderBeam colorFrom={color} colorTo={color + '88'} duration={4} />
                <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
                  Want this running for your business?
                </h2>
                <p className="text-[var(--fg-muted)] max-w-lg mx-auto mb-8">
                  Tell us where you are today and we'll show you exactly how {title} fits in.
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold transition-all hover:-translate-y-0.5"
                  style={{ background: `${color}15`, border: `1px solid ${color}40`, color }}
                >
                  Get in touch <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </SpotlightCard>

            <div className="mt-10 text-center">
              <Link
                to="/services"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--fg-muted)] hover:text-neon transition-colors"
              >
                <Compass className="w-4 h-4" /> Back to all services
              </Link>
            </div>
          </BlurFadeIn>
        </div>
      </section>
    </PageTransition>
  )
}
