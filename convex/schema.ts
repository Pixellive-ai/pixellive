import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  blog_posts: defineTable({
    // Core
    title: v.string(),
    slug: v.string(),
    excerpt: v.string(),
    content: v.string(),
    category: v.string(),
    author: v.string(),
    published: v.boolean(),
    publishedAt: v.optional(v.number()),
    // Media
    featuredImage: v.optional(v.string()),
    images: v.optional(v.array(v.string())),
    videoUrl: v.optional(v.string()),
    // SEO
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    keywords: v.optional(v.array(v.string())),
    // Schema
    faqSchema: v.optional(v.string()),
    customSchema: v.optional(v.string()),
  })
    .index('by_slug', ['slug'])
    .index('by_published', ['published']),

  contact_submissions: defineTable({
    name: v.string(),
    email: v.string(),
    company: v.optional(v.string()),
    serviceInterest: v.optional(v.string()),
    message: v.string(),
    createdAt: v.number(),
  }),

  newsletter_subscribers: defineTable({
    email: v.string(),
    subscribedAt: v.number(),
  }).index('by_email', ['email']),

  seo_settings: defineTable({
    key: v.string(),
    value: v.string(),
    updatedAt: v.number(),
  }).index('by_key', ['key']),
})
