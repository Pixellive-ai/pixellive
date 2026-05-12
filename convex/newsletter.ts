import { queryGeneric as query, mutationGeneric as mutation } from 'convex/server'
import { v } from 'convex/values'

export const subscribe = mutation({
  args: { email: v.string() },
  handler: async (ctx: any, { email }: { email: string }) => {
    const existing = await ctx.db
      .query('newsletter_subscribers')
      .withIndex('by_email', (q: any) => q.eq('email', email))
      .first()
    if (existing) return existing._id
    return await ctx.db.insert('newsletter_subscribers', {
      email,
      subscribedAt: Date.now(),
    })
  },
})

export const listAll = query({
  args: {},
  handler: async (ctx: any) => {
    return await ctx.db.query('newsletter_subscribers').order('desc').collect()
  },
})
