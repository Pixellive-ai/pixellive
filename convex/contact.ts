import { queryGeneric as query, mutationGeneric as mutation } from 'convex/server'
import { v } from 'convex/values'

export const submit = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    company: v.optional(v.string()),
    serviceInterest: v.optional(v.string()),
    message: v.string(),
  },
  handler: async (ctx: any, args: any) => {
    return await ctx.db.insert('contact_submissions', {
      ...args,
      createdAt: Date.now(),
    })
  },
})

export const listAll = query({
  args: {},
  handler: async (ctx: any) => {
    return await ctx.db.query('contact_submissions').order('desc').collect()
  },
})
