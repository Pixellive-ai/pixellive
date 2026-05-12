import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Clock, Calendar, User, Loader2 } from 'lucide-react'
import { PageTransition } from '@/components/ui/page-transition'
import { BlurFadeIn } from '@/components/ui/blur-fade'
import { GlassCard } from '@/components/ui/glass-card'
import { AuroraBackground } from '@/components/ui/aurora-bg'
import { useSEO } from '@/lib/seo'
import { isConvexConfigured, useSafeQuery } from '@/lib/convex'
import { api } from '../../convex/_generated/api'

const CATEGORY_COLORS: Record<string, string> = {
  Video: '#00F0FF',
  SEO: '#7B61FF',
  Ads: '#FF61DC',
  Content: '#FFB800',
  Strategy: '#00FF94',
}

function parseSchema(raw?: string) {
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function buildSeoSchema(post: any) {
  const schemas = [parseSchema(post?.faqSchema), parseSchema(post?.customSchema)].filter(Boolean)
  if (schemas.length === 0) return undefined
  return JSON.stringify(schemas.length === 1 ? schemas[0] : schemas)
}

function resolveFeaturedImage(post: any) {
  if (post?.featuredImageUrl) return post.featuredImageUrl
  if (post?.featuredImage && /^https?:\/\//i.test(post.featuredImage)) return post.featuredImage
  return undefined
}

function resolveGalleryImages(post: any) {
  if (Array.isArray(post?.galleryImageUrls) && post.galleryImageUrls.length > 0) {
    return post.galleryImageUrls as string[]
  }

  if (!Array.isArray(post?.images)) return []
  return (post.images as string[]).filter((value) => /^https?:\/\//i.test(value))
}

function resolveVideo(url?: string) {
  if (!url) return null

  const youtubeMatch =
    url.match(/youtube\.com\/watch\?v=([^&]+)/i) || url.match(/youtu\.be\/([^?&]+)/i)
  if (youtubeMatch?.[1]) {
    return { kind: 'iframe' as const, src: `https://www.youtube.com/embed/${youtubeMatch[1]}` }
  }

  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/i)
  if (vimeoMatch?.[1]) {
    return { kind: 'iframe' as const, src: `https://player.vimeo.com/video/${vimeoMatch[1]}` }
  }

  if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(url)) {
    return { kind: 'video' as const, src: url }
  }

  return { kind: 'link' as const, src: url }
}

export default function BlogPost() {
  const { id } = useParams<{ id: string }>()

  const post = useSafeQuery(api.blog.getBySlug, { slug: id ?? '' })

  const loading = isConvexConfigured && post === undefined
  const title = loading ? 'Loading…' : (post?.title ?? `Article #${id}`)
  const seoSchema = useMemo(() => buildSeoSchema(post), [post])
  const featuredImageSrc = resolveFeaturedImage(post)
  const galleryImages = resolveGalleryImages(post)
  const video = resolveVideo(post?.videoUrl)

  useSEO(
    post?.metaTitle || title,
    post?.metaDescription || post?.excerpt,
    post?.keywords,
    seoSchema
  )

  const fmtDate = (ts: number | undefined) =>
    ts ? new Date(ts).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'March 2024'

  return (
    <PageTransition>
      {/* Hero */}
      {featuredImageSrc ? (
        <div className="relative h-72 md:h-96 overflow-hidden">
          <img 
            src={featuredImageSrc} 
            alt={post.title} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/60 to-transparent" />
        </div>
      ) : (
        <AuroraBackground>
          <div className="h-48 md:h-64" />
        </AuroraBackground>
      )}

      <section className="pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          <BlurFadeIn>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-sm text-[var(--fg-muted)] hover:text-neon transition-colors mt-8 mb-8 block"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Blog
            </Link>

            {/* Loading state */}
            {loading && (
              <div className="flex flex-col items-center gap-4 py-24 text-[var(--fg-muted)]">
                <Loader2 className="w-8 h-8 text-neon animate-spin" />
                <p className="text-sm">Loading post…</p>
              </div>
            )}

            {/* Not found state (Convex connected but no post) */}
            {!loading && isConvexConfigured && post === null && (
              <GlassCard className="p-8 text-center">
                <h2 className="text-2xl font-black mb-2">Post not found</h2>
                <p className="text-[var(--fg-muted)] mb-6">This article doesn't exist or has been unpublished.</p>
                <Link to="/blog" className="text-neon text-sm font-semibold hover:underline">
                  Browse all articles →
                </Link>
              </GlassCard>
            )}

            {/* Post content */}
            {!loading && (post || !isConvexConfigured) && (
              <>
                {post?.category && (
                  <span
                    className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-6"
                    style={{
                      background: `${CATEGORY_COLORS[post.category] ?? '#00F0FF'}15`,
                      color: CATEGORY_COLORS[post.category] ?? '#00F0FF',
                      border: `1px solid ${CATEGORY_COLORS[post.category] ?? '#00F0FF'}30`,
                    }}
                  >
                    {post.category}
                  </span>
                )}

                <h1 className="text-4xl md:text-5xl font-black leading-tight mb-6">
                  {post?.title ?? `Deep Dive: Digital Marketing Insights #${id}`}
                </h1>

                <div className="flex flex-wrap items-center gap-4 mb-10 pb-8 border-b border-[var(--border-color)]">
                  <span className="flex items-center gap-1.5 text-sm text-[var(--fg-muted)]">
                    <User className="w-4 h-4" /> {post?.author ?? 'Pixel Live Team'}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-[var(--fg-muted)]">
                    <Calendar className="w-4 h-4" /> {fmtDate(post?.publishedAt)}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-[var(--fg-muted)]">
                    <Clock className="w-4 h-4" /> 10 min read
                  </span>
                </div>

                <div className="space-y-6 text-[var(--fg-muted)] leading-relaxed">
                  {post?.content ? (
                    <div
                      className="prose prose-invert max-w-none prose-headings:text-[var(--fg)] prose-headings:font-black prose-a:text-neon prose-code:text-neon prose-code:bg-neon/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded"
                      dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                  ) : (
                    <>
                      {!isConvexConfigured && (
                        <GlassCard className="p-6 mb-6 border-l-2 border-neon">
                          <p className="text-sm text-[var(--fg-muted)]">
                            <span className="text-neon font-semibold">Connect Convex</span> to render real article content via{' '}
                            <code className="text-neon bg-neon/10 px-1.5 py-0.5 rounded text-xs">
                              useQuery(api.blog.getBySlug)
                            </code>
                            . Add <code className="text-neon bg-neon/10 px-1.5 py-0.5 rounded text-xs">VITE_CONVEX_URL</code> to your{' '}
                            <code className="text-neon bg-neon/10 px-1.5 py-0.5 rounded text-xs">.env.local</code> then run{' '}
                            <code className="text-neon bg-neon/10 px-1.5 py-0.5 rounded text-xs">npx convex dev</code>.
                          </p>
                        </GlassCard>
                      )}
                      <p>
                        The digital landscape is evolving faster than ever. Brands that thrive are those that combine creative excellence with data-driven execution — a philosophy at the core of everything we do at Pixel Live.
                      </p>
                      <h2 className="text-2xl font-black text-[var(--fg)] mt-8 mb-4">The Framework</h2>
                      <p>
                        Every campaign we run starts with a discovery phase: understanding the audience, the competitive landscape, and the unique value proposition of the brand. Only then do we move to strategy and execution.
                      </p>
                      <h2 className="text-2xl font-black text-[var(--fg)] mt-8 mb-4">The Results</h2>
                      <p>
                        Our data-driven approach consistently delivers above-benchmark results across all channels — from organic search to paid media to video engagement metrics.
                      </p>
                    </>
                  )}
                </div>

                {video && (
                  <div className="mt-10">
                    <h2 className="text-2xl font-black mb-4">Video</h2>
                    {video.kind === 'iframe' && (
                      <div className="overflow-hidden rounded-2xl border border-[var(--border-color)] bg-black/20">
                        <iframe
                          src={video.src}
                          title={`${post?.title ?? 'Post'} video`}
                          className="w-full aspect-video"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    )}
                    {video.kind === 'video' && (
                      <video src={video.src} className="w-full rounded-2xl border border-[var(--border-color)]" controls />
                    )}
                    {video.kind === 'link' && (
                      <a
                        href={video.src}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neon text-sm font-semibold hover:underline"
                      >
                        Open video link →
                      </a>
                    )}
                  </div>
                )}

                {galleryImages.length > 0 && (
                  <div className="mt-10">
                    <h2 className="text-2xl font-black mb-4">Image Gallery</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {galleryImages.map((imageUrl, index) => (
                        <img
                          key={`${imageUrl}-${index}`}
                          src={imageUrl}
                          alt={`${post?.title ?? 'Post'} image ${index + 1}`}
                          className="w-full h-56 object-cover rounded-xl border border-[var(--border-color)]"
                          loading="lazy"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </BlurFadeIn>
        </div>
      </section>
    </PageTransition>
  )
}
