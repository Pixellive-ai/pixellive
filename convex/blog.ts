import { queryGeneric as query, mutationGeneric as mutation } from 'convex/server'
import { v } from 'convex/values'

const EXTERNAL_URL_REGEX = /^https?:\/\//i

async function resolveAssetUrl(ctx: any, value?: string) {
  if (!value) return null
  if (EXTERNAL_URL_REGEX.test(value)) return value

  try {
    return await ctx.storage.getUrl(value as any)
  } catch {
    return null
  }
}

async function resolveAssetUrls(ctx: any, values?: string[]) {
  if (!values || values.length === 0) return []
  const urls = await Promise.all(values.map((value) => resolveAssetUrl(ctx, value)))
  return urls.filter((url): url is string => Boolean(url))
}

async function withResolvedAssets(ctx: any, post: any) {
  if (!post) return post

  const featuredImageUrl = await resolveAssetUrl(ctx, post.featuredImage)
  const galleryImageUrls = await resolveAssetUrls(ctx, post.images)

  return {
    ...post,
    featuredImageUrl,
    galleryImageUrls,
  }
}

// ─── Public queries ───────────────────────────────────────────────────────────

export const listPublished = query({
  args: {},
  handler: async (ctx: any) => {
    const posts = await ctx.db
      .query('blog_posts')
      .withIndex('by_published', (q: any) => q.eq('published', true))
      .order('desc')
      .collect()
    return await Promise.all(posts.map((post: any) => withResolvedAssets(ctx, post)))
  },
})

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx: any, { slug }: { slug: string }) => {
    const post = await ctx.db
      .query('blog_posts')
      .withIndex('by_slug', (q: any) => q.eq('slug', slug))
      .first()
    return await withResolvedAssets(ctx, post)
  },
})

// ─── Admin queries ────────────────────────────────────────────────────────────

export const listAll = query({
  args: {},
  handler: async (ctx: any) => {
    const posts = await ctx.db.query('blog_posts').order('desc').collect()
    return await Promise.all(posts.map((post: any) => withResolvedAssets(ctx, post)))
  },
})

export const getById = query({
  args: { id: v.id('blog_posts') },
  handler: async (ctx: any, { id }: any) => {
    const post = await ctx.db.get(id)
    return await withResolvedAssets(ctx, post)
  },
})

// ─── Admin mutations ──────────────────────────────────────────────────────────

export const create = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    excerpt: v.string(),
    content: v.string(),
    category: v.string(),
    author: v.string(),
    published: v.boolean(),
    featuredImage: v.optional(v.string()),
    images: v.optional(v.array(v.string())),
    videoUrl: v.optional(v.string()),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    keywords: v.optional(v.array(v.string())),
    faqSchema: v.optional(v.string()),
    customSchema: v.optional(v.string()),
  },
  handler: async (ctx: any, args: any) => {
    return await ctx.db.insert('blog_posts', {
      ...args,
      publishedAt: args.published ? Date.now() : undefined,
    })
  },
})

export const update = mutation({
  args: {
    id: v.id('blog_posts'),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    content: v.optional(v.string()),
    category: v.optional(v.string()),
    author: v.optional(v.string()),
    published: v.optional(v.boolean()),
    featuredImage: v.optional(v.string()),
    images: v.optional(v.array(v.string())),
    videoUrl: v.optional(v.string()),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    keywords: v.optional(v.array(v.string())),
    faqSchema: v.optional(v.string()),
    customSchema: v.optional(v.string()),
  },
  handler: async (ctx: any, { id, ...fields }: any) => {
    const existing = await ctx.db.get(id)
    if (!existing) throw new Error('Post not found')
    const patch: any = { ...fields }
    if (fields.published === true && !existing.publishedAt) {
      patch.publishedAt = Date.now()
    }
    await ctx.db.patch(id, patch)
    return id
  },
})

export const remove = mutation({
  args: { id: v.id('blog_posts') },
  handler: async (ctx: any, { id }: any) => {
    await ctx.db.delete(id)
  },
})
