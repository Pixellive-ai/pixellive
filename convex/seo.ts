import { queryGeneric as query, mutationGeneric as mutation } from 'convex/server'
import { v } from 'convex/values'

export const get = query({
  args: { key: v.string() },
  handler: async (ctx: any, { key }: { key: string }) => {
    const row = await ctx.db
      .query('seo_settings')
      .withIndex('by_key', (q: any) => q.eq('key', key))
      .first()
    return row?.value ?? null
  },
})

export const getAll = query({
  args: {},
  handler: async (ctx: any) => {
    return await ctx.db.query('seo_settings').collect()
  },
})

export const set = mutation({
  args: { key: v.string(), value: v.string() },
  handler: async (ctx: any, { key, value }: { key: string; value: string }) => {
    const existing = await ctx.db
      .query('seo_settings')
      .withIndex('by_key', (q: any) => q.eq('key', key))
      .first()
    if (existing) {
      await ctx.db.patch(existing._id, { value, updatedAt: Date.now() })
    } else {
      await ctx.db.insert('seo_settings', { key, value, updatedAt: Date.now() })
    }
  },
})
