import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, ArrowRight, Loader2 } from 'lucide-react'
import { PageTransition } from '@/components/ui/page-transition'
import { AuroraBackground } from '@/components/ui/aurora-bg'
import { BlurFadeIn } from '@/components/ui/blur-fade'
import { GlassCard } from '@/components/ui/glass-card'
import { SpotlightCard } from '@/components/ui/spotlight-card'
import { StaggerChildren, StaggerItem } from '@/components/ui/animated-beam'
import { useSEO } from '@/lib/seo'
import { isConvexConfigured, useSafeQuery } from '@/lib/convex'
import { api } from '../../convex/_generated/api'

const categories = ['All', 'Video', 'SEO', 'Ads', 'Content', 'Strategy']

const CATEGORY_COLORS: Record<string, string> = {
  Video: '#00F0FF',
  SEO: '#7B61FF',
  Ads: '#FF61DC',
  Content: '#FFB800',
  Strategy: '#00FF94',
}

const CATEGORY_BG: Record<string, string> = {
  Video: 'from-cyan-900/30 to-blue-900/20',
  SEO: 'from-purple-900/30 to-indigo-900/20',
  Ads: 'from-pink-900/30 to-rose-900/20',
  Content: 'from-yellow-900/30 to-orange-900/20',
  Strategy: 'from-emerald-900/30 to-green-900/20',
}

interface BlogCardPost {
  _id: string
  title: string
  excerpt: string
  category: string
  author: string
  readTime: string
  publishedAt?: number
  published: boolean
  slug: string
  content: string
  featuredImage?: string
  featuredImageUrl?: string | null
}

const FALLBACK_POSTS: BlogCardPost[] = [
  {
    _id: '1',
    title: 'The Cinematic Brand Film Formula That Generated 5M Views',
    excerpt: 'Breaking down the exact creative framework we used to turn a 60-second brand film into a viral moment.',
    category: 'Video',
    author: 'Alex Kim',
    readTime: '8 min',
    publishedAt: Date.now(),
    published: true,
    slug: '1',
    content: '',
    featuredImage: undefined,
  },
  {
    _id: '2',
    title: 'How We Tripled Organic Traffic in 6 Months Without Backlinks',
    excerpt: 'A deep dive into the content cluster strategy and technical SEO fixes that drove a 3x traffic surge.',
    category: 'SEO',
    author: 'Jordan Lee',
    readTime: '12 min',
    publishedAt: Date.now() - 86400000 * 4,
    published: true,
    slug: '2',
    content: '',
    featuredImage: undefined,
  },
  {
    _id: '3',
    title: 'Google Ads in 2024: The Bidding Strategies That Actually Work',
    excerpt: "Manual CPC is dead. Here's how to use Performance Max and Smart Bidding to dominate your category.",
    category: 'Ads',
    author: 'Mia Torres',
    readTime: '10 min',
    publishedAt: Date.now() - 86400000 * 7,
    published: true,
    slug: '3',
    content: '',
    featuredImage: undefined,
  },
  {
    _id: '4',
    title: 'Building a Content Engine: 90-Day Framework for Brand Authority',
    excerpt: 'The systematic approach to content planning that transforms scattered posts into a compounding authority machine.',
    category: 'Content',
    author: 'Riley Chen',
    readTime: '15 min',
    publishedAt: Date.now() - 86400000 * 14,
    published: true,
    slug: '4',
    content: '',
    featuredImage: undefined,
  },
  {
    _id: '5',
    title: 'Meta Ads ROAS Breakdown: What a 6.2x Return Actually Looks Like',
    excerpt: 'A transparent case study with real numbers on how we structured a Meta campaign for an e-commerce brand.',
    category: 'Ads',
    author: 'Mia Torres',
    readTime: '9 min',
    publishedAt: Date.now() - 86400000 * 18,
    published: true,
    slug: '5',
    content: '',
    featuredImage: undefined,
  },
  {
    _id: '6',
    title: 'The 2024 Video Formats Ranked by Platform ROI',
    excerpt: "Short-form vs long-form, vertical vs horizontal — we tested them all. Here's the definitive ranking.",
    category: 'Video',
    author: 'Sam Patel',
    readTime: '7 min',
    publishedAt: Date.now() - 86400000 * 22,
    published: true,
    slug: '6',
    content: '',
    featuredImage: undefined,
  },
]

export default function Blog() {
  useSEO('Blog', 'Digital marketing insights from the Pixel Live team — Video, SEO, Ads & Content strategy.')
  const [activeCategory, setActiveCategory] = useState('All')

  const convexPosts = useSafeQuery(api.blog.listPublished)
  const loading = isConvexConfigured && convexPosts === undefined

  const allPosts: BlogCardPost[] = isConvexConfigured
    ? (convexPosts ?? []).map((p: any) => ({
        ...p,
        _id: String(p._id),
        readTime: '10 min',
      }))
    : FALLBACK_POSTS

  const filtered = allPosts.filter((p) => activeCategory === 'All' || p.category === activeCategory)
  const featured = filtered[0]
  const rest = filtered.slice(1)

  const getFeaturedImageSrc = (post: BlogCardPost) => {
    if (post.featuredImageUrl) return post.featuredImageUrl
    if (post.featuredImage && /^https?:\/\//i.test(post.featuredImage)) return post.featuredImage
    return undefined
  }

  const colorFor = (cat: string) => CATEGORY_COLORS[cat] ?? '#00F0FF'
  const bgFor = (cat: string) => CATEGORY_BG[cat] ?? 'from-gray-900/30 to-gray-800/20'
  const fmtDate = (ts: number | undefined) =>
    ts ? new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''

  return (
    <PageTransition>
      <AuroraBackground>
        <section className="pt-40 pb-16 px-6 text-center">
          <BlurFadeIn>
            <p className="text-xs uppercase tracking-widest text-neon font-semibold mb-4">Insights</p>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
              The Digital<br />
              <span className="text-gradient-neon">Intelligence Hub.</span>
            </h1>
            <p className="text-[var(--fg-muted)] max-w-lg mx-auto text-lg leading-relaxed">
              Strategies, case studies, and frameworks from the frontlines of digital marketing.
            </p>
          </BlurFadeIn>
        </section>
      </AuroraBackground>

      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Category filter */}
          <BlurFadeIn className="flex flex-wrap gap-2 mb-12 justify-center">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'text-black bg-neon'
                    : 'glass-panel border border-[var(--border-color)] text-[var(--fg-muted)] hover:border-neon/30 hover:text-neon'
                }`}
              >
                {cat}
              </button>
            ))}
          </BlurFadeIn>

          {/* Loading skeleton */}
          {loading && (
            <div className="flex flex-col items-center gap-4 py-24 text-[var(--fg-muted)]">
              <Loader2 className="w-8 h-8 text-neon animate-spin" />
              <p className="text-sm">Loading posts…</p>
            </div>
          )}

          {/* Empty state */}
          {!loading && filtered.length === 0 && (
            <BlurFadeIn className="py-24 text-center text-[var(--fg-muted)]">
              <p className="text-lg font-semibold mb-2">No posts yet</p>
              <p className="text-sm">Check back soon for {activeCategory === 'All' ? 'new' : activeCategory} content.</p>
            </BlurFadeIn>
          )}

          {/* Featured post */}
          {!loading && featured && (
            <BlurFadeIn className="mb-8">
              <Link to={`/blog/${featured.slug ?? featured._id}`}>
                <SpotlightCard className="group">
                  <div
                    className={`relative rounded-2xl bg-gradient-to-br ${bgFor(featured.category)} border border-[var(--border-color)] p-8 md:p-12 overflow-hidden hover:border-neon/20 transition-colors min-h-[280px] flex flex-col justify-end`}
                  >
                    {getFeaturedImageSrc(featured) && (
                      <img
                        src={getFeaturedImageSrc(featured)}
                        alt={featured.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-20"
                      />
                    )}
                    <div className="bg-grid-pattern absolute inset-0 opacity-20" />
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <span
                          className="text-xs font-semibold px-3 py-1 rounded-full"
                          style={{
                            background: `${colorFor(featured.category)}20`,
                            color: colorFor(featured.category),
                            border: `1px solid ${colorFor(featured.category)}30`,
                          }}
                        >
                          {featured.category}
                        </span>
                        <span className="text-xs text-[var(--muted)] flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {featured.readTime}
                        </span>
                        <span className="text-xs text-[var(--muted)]">{fmtDate(featured.publishedAt)}</span>
                      </div>
                      <h2 className="text-2xl md:text-4xl font-black mb-3 max-w-2xl group-hover:text-neon transition-colors">
                        {featured.title}
                      </h2>
                      <p className="text-[var(--fg-muted)] max-w-xl">{featured.excerpt}</p>
                      <div className="flex items-center gap-2 mt-4 text-sm font-semibold text-neon">
                        Read article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </SpotlightCard>
              </Link>
            </BlurFadeIn>
          )}

          {/* Grid */}
          {!loading && rest.length > 0 && (
            <StaggerChildren className="grid md:grid-cols-3 gap-6">
              {rest.map(post => (
                <StaggerItem key={post._id}>
                  <Link to={`/blog/${post.slug ?? post._id}`} className="block h-full">
                    <SpotlightCard className="h-full">
                      <GlassCard className="h-full overflow-hidden group hover:border-neon/20 transition-colors" glow>
                        <div className={`h-36 bg-gradient-to-br ${bgFor(post.category)} relative overflow-hidden`}>
                          {getFeaturedImageSrc(post) && (
                            <img
                              src={getFeaturedImageSrc(post)}
                              alt={post.title}
                              className="absolute inset-0 w-full h-full object-cover opacity-30"
                            />
                          )}
                          <div className="bg-grid-pattern absolute inset-0 opacity-30" />
                          <div className="absolute bottom-3 left-4">
                            <span
                              className="text-xs font-semibold px-2.5 py-1 rounded-full"
                              style={{
                                background: `${colorFor(post.category)}25`,
                                color: colorFor(post.category),
                                border: `1px solid ${colorFor(post.category)}30`,
                              }}
                            >
                              {post.category}
                            </span>
                          </div>
                        </div>
                        <div className="p-5">
                          <div className="flex items-center gap-3 mb-3 text-xs text-[var(--muted)]">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                            <span>{fmtDate(post.publishedAt)}</span>
                          </div>
                          <h3 className="font-bold leading-snug mb-2 group-hover:text-neon transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-sm text-[var(--fg-muted)] line-clamp-2">{post.excerpt}</p>
                          <div className="flex items-center gap-1 mt-4 text-xs font-semibold text-neon">
                            Read more <ArrowRight className="w-3 h-3" />
                          </div>
                        </div>
                      </GlassCard>
                    </SpotlightCard>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerChildren>
          )}
        </div>
      </section>
    </PageTransition>
  )
}
